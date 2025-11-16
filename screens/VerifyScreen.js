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
      
      // For now, we'll simulate a response
      const verificationResult = {
        authentic: true,
        nearExpiry: medicineData.expiryDate.includes('2024'), // Example logic
        expired: false,
        manufacturer: 'PharmaCorp',
        batchNumber: medicineData.batchId,
        expiryDate: medicineData.expiryDate
      };

      setVerifying(false);
      
      // Navigate to result screen after verification
      setTimeout(() => {
        navigation.navigate('Result', { 
          medicineData,
          verificationResult 
        });
      }, 1000);
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