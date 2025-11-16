import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';


export default function ScanScreen() {
  const [cameraFacing, setCameraFacing] = useState('back'); // 'back' | 'front'
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to use the camera.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const parts = (data || '').split('|').map((p) => p.trim());
      const medicineData = {
        manufacturerId: parts[0] || 'Unknown',
        batchId: parts[1] || 'Unknown',
        expiryDate: parts[2] || 'Unknown',
        name: parts[3] || null,
        raw: data,
      };

      // basic validation
      if (!medicineData.manufacturerId && !medicineData.batchId) {
        throw new Error('Invalid QR content');
      }

      // Navigate to Verify screen with scanned data
      navigation.navigate('Verify', { medicineData });
    } catch (err) {
      Alert.alert('Invalid QR', 'Unable to parse the scanned QR code. Please try again.');
      setScanned(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MediTrust</Text>
      <Text style={styles.subtitle}>Digital medicine authenticity checker</Text>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={cameraFacing}
          // only scan if not already scanned
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417'],
          }}
        />
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
        </View>
      </View>

      <Text style={styles.instruction}>Hold the camera steady over the barcode / QR code</Text>

      <View style={{ marginTop: 18, width: '80%' }}>
        <TouchableOpacity
          style={[styles.smallButton, { marginBottom: 12 }]}
          onPress={() => setCameraFacing((f) => (f === 'back' ? 'front' : 'back'))}
        >
          <Text style={styles.smallButtonText}>Flip camera</Text>
        </TouchableOpacity>

        {scanned && (
          <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
            <Text style={styles.scanAgainText}>Tap to scan again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2E86AB',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  cameraContainer: {
    width: 320,
    height: 320,
    overflow: 'hidden',
    borderRadius: 20,
    marginBottom: 18,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 220,
    height: 220,
    borderWidth: 2,
    borderColor: '#2E86AB',
    borderRadius: 14,
    backgroundColor: 'transparent',
  },
  instruction: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  scanAgainButton: {
    backgroundColor: '#2E86AB',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  scanAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#2E86AB',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  message: {
    fontSize: 16,
    marginBottom: 18,
    textAlign: 'center',
  },
  smallButton: {
    backgroundColor: '#f0f6fb',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  smallButtonText: {
    color: '#2E86AB',
    fontWeight: '600',
  },
});
