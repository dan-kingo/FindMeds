import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, Chip, ActivityIndicator, Card, IconButton } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import Toast from 'react-native-toast-message';

import { theme } from '@/src/constants/theme';
import Header from '@/src/components/Header';
import { medicineAPI } from '@/src/services/api';
import { Medicine, Pharmacy } from '@/src/types';
import { useCartStore } from '@/src/store/cartStore';

interface MedicineWithPharmacy extends Medicine {
  pharmacy?: Pharmacy;
  description?: string;
}

export default function MedicineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart, updateQuantity, items } = useCartStore();

  const [medicine, setMedicine] = useState<MedicineWithPharmacy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await medicineAPI.getMedicineDetails(id);
        setMedicine(response.data);
      } catch (err: any) {
        console.error('Failed to load medicine details:', err);
        setError('Unable to load medicine details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const getQuantity = () => {
    if (!medicine?.pharmacy) return 0;
    const item = items.find(
      (i) => i.medicine._id === medicine._id && i.pharmacy._id === medicine.pharmacy?._id
    );
    return item?.quantity || 0;
  };

  const handleAddToCart = () => {
    if (!medicine || !medicine.pharmacy) {
      Toast.show({ type: 'error', text1: 'Pharmacy info missing' });
      return;
    }

    addToCart(medicine, medicine.pharmacy, 1);
    Toast.show({
      type: 'success',
      text1: 'Added to cart',
      text2: `${medicine.name} added to your cart`,
    });
  };

  const handleDecrease = () => {
    const qty = getQuantity();
    if (!medicine?.pharmacy) return;
    if (qty <= 1) {
      updateQuantity(medicine._id, medicine.pharmacy._id, 0);
    } else {
      updateQuantity(medicine._id, medicine.pharmacy._id, qty - 1);
    }
  };

  const handleIncrease = () => {
    if (!medicine?.pharmacy) return;
    const qty = getQuantity();
    if (qty === 0) {
      addToCart(medicine, medicine.pharmacy, 1);
    } else {
      updateQuantity(medicine._id, medicine.pharmacy._id, qty + 1);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}> 
        <ActivityIndicator animating color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error || !medicine) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}> 
        <Text variant="titleMedium">{error || 'Medicine not found'}</Text>
        <Button mode="text" onPress={() => router.back()} style={{ marginTop: 12 }}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Header title={medicine.name} showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          {medicine.imageUrl && (
            <Image source={{ uri: medicine.imageUrl }} style={styles.image} />
          )}
          <Card.Content>
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text variant="titleLarge" style={styles.title} numberOfLines={2}>
                  {medicine.name}
                </Text>
                <Text variant="bodyMedium" style={styles.subTitle}>
                  {medicine.type}{medicine.strength ? ` • ${medicine.strength}` : ''}
                </Text>
              </View>
              <Text variant="titleLarge" style={styles.price}>
                ${medicine.price.toFixed(2)}
              </Text>
            </View>

            {medicine.requiresPrescription && (
              <Chip mode="outlined" compact style={styles.rxChip}>Prescription Required</Chip>
            )}

            {medicine.description ? (
              <Text variant="bodyMedium" style={styles.description}>{medicine.description}</Text>
            ) : null}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Pharmacy</Text>
            {medicine.pharmacy ? (
              <View style={{ marginTop: 8 }}>
                <Text variant="bodyLarge" style={styles.pharmacyName}>{medicine.pharmacy.name}</Text>
                {medicine.pharmacy.city && (
                  <Text variant="bodySmall" style={styles.pharmacyDetail}>{medicine.pharmacy.city}</Text>
                )}
                {medicine.pharmacy.address && (
                  <Text variant="bodySmall" style={styles.pharmacyDetail}>{medicine.pharmacy.address}</Text>
                )}
              </View>
            ) : (
              <Text variant="bodyMedium" style={styles.pharmacyDetail}>Pharmacy details unavailable.</Text>
            )}
          </Card.Content>
        </Card>

        {getQuantity() === 0 ? (
          <Button
            mode="contained"
            icon="cart"
            onPress={handleAddToCart}
            style={styles.addButton}
          >
            Add to Cart
          </Button>
        ) : (
          <View style={styles.quantityRow}>
            <IconButton
              mode="contained"
              icon="minus"
              size={18}
              onPress={handleDecrease}
            />
            <Text variant="titleMedium" style={styles.quantityText}>
              {getQuantity()}
            </Text>
            <IconButton
              mode="contained"
              icon="plus"
              size={18}
              onPress={handleIncrease}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 220,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 12,
  },
  title: {
    fontWeight: '700',
  },
  subTitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  price: {
    fontWeight: '700',
    color: theme.colors.primary,
    marginLeft: 12,
  },
  rxChip: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  description: {
    marginTop: 12,
    lineHeight: 20,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  pharmacyName: {
    fontWeight: '600',
  },
  pharmacyDetail: {
    marginTop: 4,
    opacity: 0.8,
  },
  addButton: {
    marginTop: 8,
    borderRadius: 12,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 8,
  },
  quantityText: {
    minWidth: 32,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    opacity: 0.7,
  },
});
