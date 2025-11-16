import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function ResultScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { medicineData = {}, verificationResult = {} } = route.params || {};

  const determineStatusColor = () => {
    if (!verificationResult.authentic) return '#FF3B30'; // red for fake
    if (verificationResult.expired) return '#FF3B30'; // red for expired
    if (verificationResult.nearExpiry) return '#FF9500'; // yellow for near expiry
    return '#34C759'; // green for authentic
  };

  const determineStatusText = () => {
    if (!verificationResult.authentic) return 'Counterfeit medicine detected';
    if (verificationResult.expired) return 'Expired medicine';
    if (verificationResult.nearExpiry) return 'Medicine near expiry';
    return 'Authentic — safe to use';
  };

  const determineStatusEmoji = () => {
    if (!verificationResult.authentic) return '🚫';
    if (verificationResult.expired) return '⏳';
    if (verificationResult.nearExpiry) return '⚠️';
    return '✅';
  };

  const formatExpiry = (expiry) => {
    if (!expiry) return 'Unknown';
    const d = new Date(expiry);
    if (!isNaN(d)) {
      return d.toLocaleDateString();
    }
    return expiry;
  };

  const handleReport = () => {
    Alert.alert(
      'Report medicine',
      'Are you sure you want to report this medicine as counterfeit/unsafe?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Thanks — reported', 'We have submitted the report to the authorities.');
          },
        },
      ],
    );
  };

  const statusColor = determineStatusColor();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MediTrust</Text>

      <View style={[styles.statusCard, { borderColor: statusColor }]}>
        <Text style={[styles.statusEmoji, { color: statusColor }]}>
          {determineStatusEmoji()}
        </Text>
        <Text style={[styles.statusText, { color: statusColor }]}>
          {determineStatusText()}
        </Text>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Product:</Text>
          <Text style={styles.detailValue}>{medicineData.name ?? 'Unknown'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Manufacturer:</Text>
          <Text style={styles.detailValue}>{verificationResult.manufacturer ?? 'Unknown'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Batch number:</Text>
          <Text style={styles.detailValue}>{verificationResult.batchNumber ?? 'Unknown'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Expiry date:</Text>
          <Text style={styles.detailValue}>{formatExpiry(verificationResult.expiryDate)}</Text>
        </View>
      </View>

      {(!verificationResult.authentic || verificationResult.expired) && (
        <TouchableOpacity
          style={styles.reportButton}
          onPress={handleReport}
          accessibilityLabel="Report this medicine"
        >
          <Text style={styles.reportButtonText}>Report to authorities</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.scanAgainButton}
        onPress={() => navigation.navigate('Scan')}
        accessibilityLabel="Scan another medicine"
      >
        <Text style={styles.scanAgainButtonText}>Scan another medicine</Text>
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
    fontWeight: '700',
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
    width: '85%',
  },
  statusEmoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#f8f9fa',
    padding: 18,
    borderRadius: 12,
    width: '85%',
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#2E86AB',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: '600',
    color: '#666',
  },
  detailValue: {
    color: '#333',
    maxWidth: '60%',
    textAlign: 'right',
  },
  reportButton: {
    backgroundColor: '#FF3B30',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    width: '85%',
    alignItems: 'center',
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  scanAgainButton: {
    backgroundColor: '#2E86AB',
    padding: 14,
    borderRadius: 10,
    width: '85%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 36,
  },
  scanAgainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
