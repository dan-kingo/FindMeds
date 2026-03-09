// app/order-details/[id].tsx

import React, { useState, useEffect, useRef, ComponentProps } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Text, Card, Button, Chip, ActivityIndicator } from 'react-native-paper';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';

import { orderAPI } from '@/src/services/api';
import { theme } from '@/src/constants/theme';

interface TrackingData {
  lat: number;
  lng: number;
  status: string;
  distance: number;
  eta: number;
  driverId?: string;
}

const OrderDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const eventSource = useRef<EventSource | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchOrder();
    connectToTracking();

    return () => {
      eventSource.current?.close();
      stopPolling();
    };
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await orderAPI.getOrderById(id);
      setOrder(res.data);
      
      // Initialize tracking data from order if available
      if (res.data.delivery) {
        const delivery = res.data.delivery;
        if (delivery.currentLocation?.coordinates) {
          const [lng, lat] = delivery.currentLocation.coordinates;
          setTracking({
            lat,
            lng,
            status: res.data.status || 'accepted',
            distance: delivery.distance || 0,
            eta: delivery.estimatedDeliveryTime 
              ? new Date(delivery.estimatedDeliveryTime).getTime()
              : Date.now() + 30 * 60 * 1000,
            driverId: delivery.driverId,
          });
        }
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to load order');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const startPollingFallback = async () => {
    console.log('Starting polling fallback for tracking updates');
    setUsingFallback(true);
    
    // Clear any existing polling
    stopPolling();
    
    // Initial fetch
    await fetchOrderData();
    
    // Set up interval polling - less frequent to reduce load
    pollingRef.current = setInterval(async () => {
      await fetchOrderData();
    }, 10000); // Poll every 10 seconds
  };

  const fetchOrderData = async () => {
    try {
      // Simply fetch the order again to get updated delivery info
      const res = await orderAPI.getOrderById(id);
      const updatedOrder = res.data;
      
      // Update order state
      setOrder(updatedOrder);
      
      // Update tracking data if delivery info exists
      if (updatedOrder.delivery) {
        const delivery = updatedOrder.delivery;
        if (delivery.currentLocation?.coordinates) {
          const [lng, lat] = delivery.currentLocation.coordinates;
          setTracking({
            lat,
            lng,
            status: updatedOrder.status || 'accepted',
            distance: delivery.distance || 0,
            eta: delivery.estimatedDeliveryTime 
              ? new Date(delivery.estimatedDeliveryTime).getTime()
              : Date.now() + 30 * 60 * 1000,
            driverId: delivery.driverId,
          });
        }
      }
    } catch (error) {
      console.warn('Polling error:', error);
    }
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setUsingFallback(false);
  };

  const connectToTracking = async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        Alert.alert('Auth error', 'Please log in again');
        startPollingFallback();
        return;
      }

      // Check if EventSource is available
      if (!global.EventSource) {
        console.warn('EventSource not available, using fallback polling');
        startPollingFallback();
        return;
      }

      const url = `https://medstream.onrender.com/api/deliveries/${id}/stream`;

      console.log('Attempting SSE connection to:', url);
      
      const es = new global.EventSource(url);

      es.onmessage = (ev) => {
        try {
          // Handle both "data: " prefix and direct JSON
          const dataStr = ev.data.startsWith('data: ') ? ev.data.substring(6) : ev.data;
          const data = JSON.parse(dataStr);
          console.log('SSE tracking data received:', data);
          
          setTracking({
            lat: data.lat,
            lng: data.lng,
            status: data.status,
            distance: data.distance,
            eta: data.eta,
            driverId: data.driverId,
          });
          
          // If we were using fallback, stop it since SSE is working
          if (usingFallback) {
            stopPolling();
          }
        } catch (err) {
          console.warn('Invalid SSE data format:', err, 'Raw data:', ev.data);
        }
      };

      es.onerror = (err) => {
        console.warn('SSE error – reconnecting...', err);
        es.close();
        eventSource.current = null;
        
        // Only restart if not already using fallback
        if (!usingFallback) {
          console.log('Will attempt reconnect in 5 seconds...');
          setTimeout(connectToTracking, 5000);
        }
      };

      es.onopen = () => {
        console.log('SSE connection opened successfully');
        // If fallback was running, stop it
        if (usingFallback) {
          stopPolling();
        }
      };

      // Handle connection message
      es.addEventListener('connected', (ev: any) => {
        console.log('SSE connection established');
      });

      eventSource.current = es;
    } catch (err) {
      console.error('SSE setup failed', err);
      // Fallback to polling
      startPollingFallback();
    }
  };

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      placed: 'warning',
      accepted: 'primary',
      preparing: 'primary',
      ready: 'info',
      'out for delivery': 'info',
      'en_route': 'info',
      delivered: 'success',
      cancelled: 'error',
    };
    return map[status.toLowerCase()] ?? 'default';
  };

  const getStatusIcon = (status: string): ComponentProps<typeof MaterialCommunityIcons>['name'] => {
    const map: Record<string, ComponentProps<typeof MaterialCommunityIcons>['name']> = {
      placed: 'clock',
      accepted: 'check-circle',
      preparing: 'chef-hat',
      ready: 'package-variant',
      'out for delivery': 'truck-delivery',
      'en_route': 'truck',
      delivered: 'check',
      cancelled: 'close-circle',
    };
    return map[status.toLowerCase()] ?? 'information';
  };

  const cancelOrder = async (orderId: string) => {
    try {
      // Add real API call here
      // await orderAPI.cancelOrder(orderId);
      Alert.alert('Cancelled', 'Your order has been cancelled.');
      // Update local state
      setOrder((prev: any) => ({ ...prev, status: 'cancelled' }));
      setTracking(prev => prev ? { ...prev, status: 'cancelled' } : null);
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel order');
    }
  };

  const retryConnection = () => {
    stopPolling();
    connectToTracking();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text>Order not found</Text>
        <Button mode="contained" onPress={() => router.back()} style={styles.backButton}>
          Go Back
        </Button>
      </View>
    );
  }

  const destination = order.location?.coordinates;
  const driverPos = tracking && tracking.lat && tracking.lng
    ? { latitude: tracking.lat, longitude: tracking.lng }
    : null;
  const destPos = destination && destination.length === 2
    ? { latitude: destination[1], longitude: destination[0] }
    : null;

  // Format ETA for display
  const formatETA = (eta: number) => {
    if (!eta) return 'Calculating...';
    const now = Date.now();
    const diff = eta - now;
    
    if (diff <= 0) return 'Arrived';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <View style={styles.container}>
      {/* Connection Status Indicator */}
      {usingFallback && (
        <Card style={styles.connectionStatus}>
          <Card.Content style={styles.connectionContent}>
            <MaterialCommunityIcons name="wifi-off" size={16} color={theme.colors.warning} />
            <Text variant="bodySmall" style={styles.connectionText}>
              Using fallback updates • Real-time tracking unavailable
            </Text>
            <Button 
              mode="text" 
              compact 
              onPress={retryConnection}
              style={styles.retryButton}
            >
              Retry
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* MAP */}
      {order.deliveryType === 'delivery' && (
        <View style={styles.mapContainer}>
          <MapView
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude: destPos?.latitude ?? 9.01,
              longitude: destPos?.longitude ?? 38.76,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            onMapReady={() => setMapReady(true)}
          >
            {destPos && (
              <Marker coordinate={destPos} title="Delivery address" pinColor="red" />
            )}

            {driverPos && mapReady && (
              <Marker coordinate={driverPos} title="Driver" description={tracking?.status}>
                <View style={styles.driverMarker}>
                  <MaterialCommunityIcons name="truck-delivery" size={28} color="#fff" />
                </View>
              </Marker>
            )}

            {driverPos && destPos && (
              <Polyline
                coordinates={[driverPos, destPos]}
                strokeColor={theme.colors.primary}
                strokeWidth={4}
              />
            )}
          </MapView>

          {/* Tracking Overlay */}
          {(tracking && (tracking.distance > 0 || tracking.eta)) && (
            <Card style={styles.trackingCard}>
              <Card.Content style={styles.trackingContent}>
                <View style={styles.trackingRow}>
                  <MaterialCommunityIcons 
                    name={getStatusIcon(tracking.status)} 
                    size={20} 
                    color={theme.colors.primary} 
                  />
                  <Text style={styles.trackingText}>
                    {tracking.status.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
                
                {tracking.distance > 0 && (
                  <View style={styles.trackingRow}>
                    <MaterialCommunityIcons name="map-marker-distance" size={20} color={theme.colors.primary} />
                    <Text style={styles.trackingText}>
                      {tracking.distance.toFixed(1)} km away
                    </Text>
                  </View>
                )}
                
                {tracking.eta && (
                  <View style={styles.trackingRow}>
                    <MaterialCommunityIcons name="clock-outline" size={20} color={theme.colors.primary} />
                    <Text style={styles.trackingText}>
                      ETA: {formatETA(tracking.eta)}
                    </Text>
                  </View>
                )}
                
                {usingFallback && (
                  <View style={styles.trackingRow}>
                    <MaterialCommunityIcons name="sync" size={16} color={theme.colors.warning} />
                    <Text style={[styles.trackingText, styles.fallbackText]}>Polling for updates</Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          )}
        </View>
      )}

      {/* DETAILS */}
      <View style={styles.details}>
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <Text variant="titleLarge" style={styles.title}>
              Order #{order._id?.slice(-8) || id}
            </Text>

            <Chip
              mode="flat"
              icon={getStatusIcon(tracking?.status || order.status)}
              style={[
                styles.statusChip,
                { backgroundColor: (theme.colors as any)[getStatusColor(tracking?.status || order.status)] },
              ]}
            >
              {(tracking?.status || order.status).replace('_', ' ').toUpperCase()}
            </Chip>
          </Card.Content>
        </Card>

        <Card style={styles.section}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Items</Text>
            {order.items?.map((it: any, i: number) => (
              <Text key={i} style={styles.item}>
                • {it.medicine?.name || 'Item'} × {it.quantity} = ${((it.price || 0) * it.quantity).toFixed(2)}
              </Text>
            ))}
            <Text style={styles.total}>
              Total: ${order.items?.reduce((s: number, it: any) => s + (it.price || 0) * it.quantity, 0).toFixed(2) || '0.00'}
            </Text>
          </Card.Content>
        </Card>

        {order.deliveryType === 'delivery' && order.address && (
          <Card style={styles.section}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>Delivery Address</Text>
              <Text style={styles.address}>{order.address}</Text>
            </Card.Content>
          </Card>
        )}

        <View style={styles.actions}>
          {order?.status !== 'Delivered' && order.status !== 'cancelled' && (
            <Button 
              mode="outlined" 
              onPress={() => cancelOrder(id)} 
              style={styles.cancelBtn}
            >
              Cancel Order
            </Button>
          )}
          {tracking?.driverId && (
            <Button 
              mode="contained" 
              icon="phone" 
              onPress={() => Linking.openURL(`tel:${tracking.driverId}`)}
            >
              Call Driver
            </Button>
          )}
        </View>

        {/* Manual Refresh Button */}
        <Button 
          mode="text" 
          icon="refresh" 
          onPress={retryConnection}
          style={styles.refreshButton}
        >
          Refresh Connection
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20, 
    backgroundColor: theme.colors.background
  },
  loadingText: {
    marginTop: 10,
    color: theme.colors.primary
  },
  backButton: {
    marginTop: 10
  },
  mapContainer: { 
    height: 300, 
    position: 'relative' 
  },
  connectionStatus: {
    backgroundColor: '#FFF3CD',
    margin: 8,
    borderRadius: 4, // Less rounded
    elevation: 2
  },
  connectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  connectionText: {
    marginLeft: 8,
    color: '#856404',
    flex: 1
  },
  retryButton: {
    marginLeft: 8
  },
  trackingCard: { 
    position: 'absolute', 
    top: 16, 
    left: 16, 
    right: 16, 
    borderRadius: 4, // Less rounded
    elevation: 4 
  },
  trackingContent: {
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  trackingRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 2 
  },
  trackingText: { 
    marginLeft: 8, 
    fontWeight: '600' 
  },
  fallbackText: {
    color: theme.colors.warning,
    fontSize: 12
  },
  driverMarker: { 
    backgroundColor: theme.colors.primary, 
    padding: 6, 
    borderRadius: 20, 
    borderWidth: 2, 
    borderColor: '#fff' 
  },
  details: { 
    flex: 1, 
    padding: 16,
    gap: 12 // Add gap between cards to prevent overlapping
  },
  headerCard: {
    borderRadius: 4, // Less rounded
    elevation: 2
  },
  headerContent: {
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  title: { 
    marginBottom: 8, 
    fontWeight: 'bold' 
  },
  statusChip: { 
    alignSelf: 'flex-start', 
    borderRadius: 4 // Less rounded
  },
  section: { 
    borderRadius: 4, // Less rounded
    elevation: 2
  },
  sectionTitle: { 
    marginBottom: 8, 
    fontWeight: '600' 
  },
  item: { 
    marginBottom: 4 
  },
  total: { 
    marginTop: 8, 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  address: { 
    opacity: 0.8 
  },
  actions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 8 
  },
  cancelBtn: { 
    borderColor: theme.colors.error 
  },
  refreshButton: {
    marginTop: 8,
    alignSelf: 'center'
  }
});

export default OrderDetailsScreen;