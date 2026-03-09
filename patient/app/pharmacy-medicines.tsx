import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Card, Chip, Button, IconButton } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { theme } from '@/src/constants/theme';
import Header from '@/src/components/Header';
import { medicineAPI } from '@/src/services/api';
import { useCartStore } from '@/src/store/cartStore';
import { Medicine, Pharmacy } from '@/src/types';
 
export default function PharmacyMedicinesScreen() {
  const params = useLocalSearchParams();
  const pharmacyId = params.pharmacyId as string;
  const pharmacyName = params.pharmacyName as string;
  
  const { addToCart, updateQuantity, items } = useCartStore();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPharmacyMedicines();
  }, [pharmacyId]);

  // Update the fetchPharmacyMedicines function
const fetchPharmacyMedicines = async () => {
  try {
    // Validate pharmacyId
    if (!pharmacyId ) {
      throw new Error('Invalid pharmacy ID');
    }

    setLoading(true);
    setError(null);
    const response = await medicineAPI.getMedicinesByPharmacy(pharmacyId);
    
    // Ensure response data is an array
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid response format');
    }
    
    setMedicines(response.data);
  } catch (err) {
    console.error('Error fetching pharmacy medicines:', err);
    let errorMessage = 'Failed to fetch medicines for this pharmacy';
    if (typeof err === 'object' && err !== null) {
      if ('response' in err && typeof (err as any).response?.data?.message === 'string') {
        errorMessage = (err as any).response.data.message;
      } else if ('message' in err && typeof (err as any).message === 'string') {
        errorMessage = (err as any).message;
      }
    }
    setError(errorMessage);
    
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: errorMessage,
    });
  } finally {
    setLoading(false);
  }
};

const getQuantity = (medicineId: string) => {
  const item = items.find(
    (i) => i.medicine._id === medicineId && i.pharmacy._id === pharmacyId
  );
  return item?.quantity || 0;
};

const handleAddToCart = (medicine: Medicine) => {
  try {
    const pharmacy: Pharmacy = {
      _id: pharmacyId,
      name: pharmacyName,
      city: '',
      deliveryAvailable: false,
      rating: 0,
    };

    addToCart(medicine, pharmacy, 1);
    Toast.show({
      type: 'success',
      text1: 'Added to cart',
      text2: `${medicine.name} has been added to your cart`,
    });
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Failed to add item to cart',
    });
  }
};

const handleDecrease = (medicine: Medicine) => {
  const currentQty = getQuantity(medicine._id);
  if (currentQty <= 1) {
    updateQuantity(medicine._id, pharmacyId, 0);
  } else {
    updateQuantity(medicine._id, pharmacyId, currentQty - 1);
  }
};

const handleIncrease = (medicine: Medicine) => {
  const currentQty = getQuantity(medicine._id);
  const pharmacy: Pharmacy = {
    _id: pharmacyId,
    name: pharmacyName,
    city: '',
    deliveryAvailable: false,
    rating: 0,
  };
  if (currentQty === 0) {
    addToCart(medicine, pharmacy, 1);
  } else {
    updateQuantity(medicine._id, pharmacyId, currentQty + 1);
  }
};

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header 
        title={pharmacyName}
        subtitle="Available medicines"
        showBack
      />

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color={theme.colors.primary} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={40} color={theme.colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            mode="contained" 
            onPress={fetchPharmacyMedicines}
            style={styles.retryButton}
          >
            Retry
          </Button>
        </View>
      ) : medicines.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="bottle-tonic-plus-outline" size={40} color={theme.colors.primary} />
          <Text style={styles.emptyText}>No medicines available in this pharmacy</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {medicines.map((medicine) => (
            <Card
              key={medicine._id}
              style={styles.medicineCard}
              onPress={() => router.push(`/medicine/${medicine._id}`)}
            >
              {medicine.imageUrl && (
                <Card.Cover source={{ uri: medicine.imageUrl }} style={styles.medicineImage} />
              )}
              <Card.Content style={{marginTop: 12}}>
                <Text variant="titleMedium">{medicine.name}</Text>
                <Text variant="bodySmall" style={styles.medicineType}>
                  {medicine.type} • {medicine.strength}
                </Text>
                <Text variant="titleMedium" style={styles.medicinePrice}>
                  ${medicine.price.toFixed(2)}
                </Text>
                {medicine.requiresPrescription && (
                  <Chip mode="outlined" compact style={styles.prescriptionChip}>
                    Prescription Required
                  </Chip>
                )}
                <Text variant="bodySmall" style={styles.medicineDescription}>
                  {medicine.description || 'No description available'}
                </Text>
                {getQuantity(medicine._id) === 0 ? (
                  <Button 
                    mode="contained" 
                    onPress={() => handleAddToCart(medicine)}
                    style={styles.addToCartButton}
                  >
                    Add to Cart
                  </Button>
                ) : (
                  <View style={styles.quantityRow}>
                    <IconButton
                      mode="contained"
                      icon="minus"
                      size={18}
                      onPress={() => handleDecrease(medicine)}
                    />
                    <Text variant="titleMedium" style={styles.quantityText}>
                      {getQuantity(medicine._id)}
                    </Text>
                    <IconButton
                      mode="contained"
                      icon="plus"
                      size={18}
                      onPress={() => handleIncrease(medicine)}
                    />
                  </View>
                )}
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicineCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  medicineType: {
    marginTop: 4,
    opacity: 0.7,
  },
  medicinePrice: {
    marginTop: 8,
    fontWeight: '600',
    marginBottom: 8,
  },
  medicineImage: {
    height: 180,
borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderRadius: 0
  },
  medicineDescription: {
    marginTop: 8,
    marginBottom: 12,
  },
  prescriptionChip: {
    marginTop: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  addToCartButton: {
    marginTop: 12,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  quantityText: {
    minWidth: 32,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: theme.colors.error,
  },
  retryButton: {
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
  },
});