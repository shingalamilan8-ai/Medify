import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function ResultScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { medicineData, verificationResult } = route.params;

  const getStatusColor = () => {
    if (verificationResult.isFake) return '#FF3B30'; // Red for fake
    if (verificationResult.expired) return '#FF3B30'; // Red for expired
    if (verificationResult.nearExpiry) return '#FF9500'; // Yellow for near expiry
    return '#34C759'; // Green for authentic
  };

  const getStatusMessage = () => {
    if (verificationResult.isFake) return 'Counterfeit Medicine Detected';
    if (verificationResult.expired) return 'Expired Medicine';
    if (verificationResult.nearExpiry) return 'Medicine Near Expiry';
    return 'Authentic & Safe to Use';
  };

  const getStatusEmoji = () => {
    if (verificationResult.isFake) return '❌';
    if (verificationResult.expired) return '❌';
    if (verificationResult.nearExpiry) return '⚠️';
    return '✅';
  };


  const handleReport = () => {
    Alert.alert(
      'Report Medicine',
      'Are you sure you want to report this medicine as counterfeit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement reporting functionality
            Alert.alert('Reported', 'Thank you for reporting. Authorities have been notified.');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MediTrust</Text>

      <View style={[styles.statusCard, { borderColor: getStatusColor() }]}>
        <Text style={[styles.statusEmoji, { color: getStatusColor() }]}>
          {getStatusEmoji()}
        </Text>
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusMessage()}
        </Text>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Manufacturer:</Text>
          <Text style={styles.detailValue}>{verificationResult.manufacturer}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Batch Number:</Text>
          <Text style={styles.detailValue}>{verificationResult.batchNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Expiry Date:</Text>
          <Text style={styles.detailValue}>{verificationResult.expiryDate}</Text>
        </View>
      </View>

      <View style={styles.debugCard}>
        <Text style={styles.debugTitle}>Debug Info</Text>
        <Text>Months until expiry: {verificationResult.monthsUntilExpiry}</Text>
        <Text>Current date: {verificationResult.currentDate}</Text>
        <Text>Expiry date: {verificationResult.expiryDate}</Text>
      </View>

      {(!verificationResult.authentic || verificationResult.expired) && (
        <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
          <Text style={styles.reportButtonText}>Report to Authorities</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.scanAgainButton}
        onPress={() => navigation.navigate('Scan')}
      >
        <Text style={styles.scanAgainButtonText}>Scan Another Medicine</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E86AB',
    marginBottom: 40,
  },
  statusCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    borderWidth: 3,
    alignItems: 'center',
    marginBottom: 30,
    width: '80%',
  },
  statusEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2E86AB',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#666',
  },
  detailValue: {
    color: '#333',
  },
  reportButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  reportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanAgainButton: {
    backgroundColor: '#2E86AB',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
  },
  scanAgainButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugCard: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    marginTop: 20,
  },
  debugTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#666',
  },
});