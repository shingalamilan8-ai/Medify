import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

export default function ScanScreen() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to use the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    
    try {
      // Parse QR code data (assuming format: manufacturerId|batchId|expiryDate)
      const qrData = data.split('|');
      const medicineData = {
        manufacturerId: qrData[0] || 'Unknown',
        batchId: qrData[1] || 'Unknown',
        expiryDate: qrData[2] || 'Unknown'
      };

      // Navigate to Verify screen with scanned data
      navigation.navigate('Verify', { medicineData });
    } catch (error) {
      Alert.alert('Error', 'Invalid QR code format');
      setScanned(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MediTrust</Text>
      <Text style={styles.subtitle}>Digital Medicine Authenticity Checker</Text>
      
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417'],
          }}
        />
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
        </View>
      </View>

      <Text style={styles.instruction}>Hold over Barcode/QR Code</Text>
      
      {scanned && (
        <TouchableOpacity 
          style={styles.scanAgainButton} 
          onPress={() => setScanned(false)}
        >
          <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}
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
    fontWeight: 'bold',
    color: '#2E86AB',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  cameraContainer: {
    width: 300,
    height: 300,
    overflow: 'hidden',
    borderRadius: 20,
    marginBottom: 20,
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
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#2E86AB',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  instruction: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  scanAgainButton: {
    backgroundColor: '#2E86AB',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  scanAgainText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2E86AB',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});