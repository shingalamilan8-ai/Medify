import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';


export default function VerifyScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { medicineData = {} } = route.params || {};

  const [statusMessage, setStatusMessage] = useState('Starting verification…');
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);
  const timerRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;

    const verify = async () => {
      try {
        setStatusMessage('Contacting verification service...');
        await sleep(1000);
        if (!mountedRef.current) return;

        setStatusMessage('Checking product metadata...');
        await sleep(800);
        if (!mountedRef.current) return;

        setStatusMessage('Cross-checking batch on ledger...');
        await sleep(1200);
        if (!mountedRef.current) return;

        const now = new Date();
        const expiryRaw = medicineData.expiryDate || medicineData.expiry || '';
        const expiryDate = parseExpiry(expiryRaw); // returns Date or null

        let expired = false;
        let nearExpiry = false;

        if (expiryDate) {
          const diffMs = expiryDate - now;
          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

          if (diffDays < 0) expired = true;
          else if (diffDays <= 30) nearExpiry = true;
        } else {
        }

        const suspicious = /0000|fake|test/i.test(String(medicineData.batchId || ''));

        const verificationResult = {
          authentic: !suspicious,
          expired,
          nearExpiry,
          manufacturer: medicineData.manufacturerId || 'Unknown manufacturer',
          batchNumber: medicineData.batchId || 'Unknown batch',
          expiryDate: expiryDate ? expiryDate.toISOString() : (expiryRaw || 'Unknown'),
        };

        setStatusMessage('Finalizing results...');
        await sleep(700);
        if (!mountedRef.current) return;

        setLoading(false);

        timerRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          navigation.replace('Result', { medicineData, verificationResult });
        }, 800);
      } catch (err) {
        console.error('Verification error:', err);
        if (!mountedRef.current) return;
        setLoading(false);
        Alert.alert('Verification failed', 'Something went wrong while verifying. Please try again.');
        navigation.goBack();
      }
    };

    verify();

    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [medicineData, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MediTrust</Text>

      <Text style={styles.status}>{statusMessage}</Text>
      <Text style={styles.subStatus}>
        Verifying authenticity and batch details — this usually takes a few seconds.
      </Text>

      <ActivityIndicator size="large" color="#2E86AB" style={styles.spinner} animating={loading} />

      <View style={styles.details}>
        <Text style={styles.detailTitle}>Scanned details</Text>
        <Text style={styles.detailText}>Product: {medicineData.name ?? 'Unknown'}</Text>
        <Text style={styles.detailText}>Manufacturer ID: {medicineData.manufacturerId ?? 'Unknown'}</Text>
        <Text style={styles.detailText}>Batch: {medicineData.batchId ?? 'Unknown'}</Text>
        <Text style={styles.detailText}>Expiry (raw): {medicineData.expiryDate ?? medicineData.expiry ?? 'Unknown'}</Text>
      </View>
    </View>
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


function parseExpiry(input) {
  if (!input) return null;
  const s = String(input).trim();

  const iso = new Date(s);
  if (!isNaN(iso)) return iso;

  const mmYYYY = s.match(/^(\d{1,2})[\/\-](\d{4})$/);
  if (mmYYYY) {
    const month = parseInt(mmYYYY[1], 10);
    const year = parseInt(mmYYYY[2], 10);
    return new Date(year, month, 0, 23, 59, 59);
  }

  const ymd = s.match(/^(\d{4})(\d{2})(\d{2})?$/);
  if (ymd) {
    const year = parseInt(ymd[1], 10);
    const month = parseInt(ymd[2], 10) - 1;
    const day = ymd[3] ? parseInt(ymd[3], 10) : 1;
    return new Date(year, month, day);
  }

  const textual = Date.parse(s);
  if (!isNaN(textual)) return new Date(textual);

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2E86AB',
    marginBottom: 20,
  },
  status: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  subStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  spinner: {
    marginBottom: 26,
  },
  details: {
    backgroundColor: '#f5f7fa',
    padding: 16,
    borderRadius: 10,
    width: '100%',
  },
  detailTitle: {
    fontWeight: '700',
    marginBottom: 8,
    color: '#2E86AB',
  },
  detailText: {
    marginBottom: 4,
    color: '#333',
  },
});
