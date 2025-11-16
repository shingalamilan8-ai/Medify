import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function VerifyScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { medicineData } = route.params;
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Simulate verification process
    const verifyMedicine = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      try {
        // Enhanced verification logic with REAL current date
        const validManufacturers = ['pharmacorp', 'medlife', 'healthcare', 'biopharm', 'medisafe'];
        const isFakeManufacturer = !validManufacturers.includes(
          medicineData.manufacturerId.toLowerCase()
        );

        // Parse expiry date (format: MM/YYYY)
        const [expiryMonth, expiryYear] = medicineData.expiryDate.split('/').map(Number);

        // Use REAL current date
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // January = 1

        // Calculate months until expiry
        const monthsUntilExpiry = (expiryYear - currentYear) * 12 + (expiryMonth - currentMonth);

        const isExpired = monthsUntilExpiry < 0;
        const isNearExpiry = monthsUntilExpiry >= 0 && monthsUntilExpiry <= 3;

        const verificationResult = {
          authentic: !isFakeManufacturer,
          nearExpiry: isNearExpiry,
          expired: isExpired,
          manufacturer: medicineData.manufacturerId,
          batchNumber: medicineData.batchId,
          expiryDate: medicineData.expiryDate,
          isFake: isFakeManufacturer,
          monthsUntilExpiry: monthsUntilExpiry,
          currentDate: `${currentMonth}/${currentYear}` // For debugging
        };

        console.log('Verification Result:', verificationResult); // Debug log

        setVerifying(false);

        setTimeout(() => {
          navigation.navigate('Result', {
            medicineData,
            verificationResult
          });
        }, 1000);
      } catch (error) {
        // Handle invalid QR format
        const verificationResult = {
          authentic: false,
          nearExpiry: false,
          expired: false,
          isFake: true,
          manufacturer: 'Invalid Format',
          batchNumber: medicineData.batchId || 'Invalid',
          expiryDate: medicineData.expiryDate || 'Invalid',
          error: true
        };

        setVerifying(false);
        setTimeout(() => {
          navigation.navigate('Result', { medicineData, verificationResult });
        }, 1000);
      }
    };


    verifyMedicine();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MediTrust</Text>
      <Text style={styles.status}>Verifying authenticity...</Text>
      <Text style={styles.subStatus}>Checking blockchain ledger...</Text>

      <ActivityIndicator size="large" color="#2E86AB" style={styles.spinner} />

      <View style={styles.details}>
        <Text style={styles.detailTitle}>Scanned Details:</Text>
        <Text>Manufacturer: {medicineData.manufacturerId}</Text>
        <Text>Batch: {medicineData.batchId}</Text>
        <Text>Expiry: {medicineData.expiryDate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E86AB',
    marginBottom: 30,
  },
  status: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subStatus: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  spinner: {
    marginBottom: 40,
  },
  details: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  detailTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
});