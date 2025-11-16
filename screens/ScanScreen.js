
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Animated } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function ScanScreen() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();
  const [scanned, setScanned] = useState(false);
  const [scanLineAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // Scanner animation
  useEffect(() => {
    const animateScanLine = () => {
      scanLineAnim.setValue(0);
      Animated.timing(scanLineAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => animateScanLine());
    };
    animateScanLine();
  }, []);

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingIconContainer}>
          <Ionicons name="camera" size={70} color="#FFFFFF" />
        </View>
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionIconContainer}>
          <Ionicons name="camera-off" size={90} color="#FFFFFF" />
        </View>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          MediTrust needs camera access to scan medicine QR codes and verify authenticity.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Ionicons name="key" size={20} color="#FFFFFF" />
          <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);

    try {
      const qrData = data.split('|');
      const medicineData = {
        manufacturerId: qrData[0] || 'Unknown',
        batchId: qrData[1] || 'Unknown',
        expiryDate: qrData[2] || 'Unknown'
      };

      navigation.navigate('Verify', { medicineData });
    } catch (error) {
      Alert.alert('Invalid QR Code', 'Please scan a valid medicine QR code.');
      setScanned(false);
    }
  };

  const scanLinePosition = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.6 - 6]
  });

  return (
    <View style={styles.container}>
      {/* Animated Background Waves */}
      <View style={styles.backgroundWave1} />
      <View style={styles.backgroundWave2} />
      <View style={styles.backgroundWave3} />

      {/* Floating Particles */}
      <View style={styles.particle1} />
      <View style={styles.particle2} />
      <View style={styles.particle3} />
      <View style={styles.particle4} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Ionicons name="medical" size={36} color="#FFFFFF" />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>MediTrust</Text>
              <Text style={styles.subtitle}>Pharmaceutical Verification</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Main Scanner Section */}
      <View style={styles.mainContent}>
        {/* Scanner Container with Glass Morphism Effect */}
        <View style={styles.scannerSection}>
          <View style={styles.scannerCard}>
            <View style={styles.scannerGlow} />
            <CameraView
              style={styles.camera}
              facing={facing}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{ barcodeTypes: ['qr', 'pdf417', 'datamatrix'] }}
            />

            {/* Scanner Overlay */}
            <View style={styles.overlay}>
              <View style={styles.scanFrame}>
                {/* Animated Corner Dots */}
                <View style={[styles.cornerDot, styles.cornerDotTL]} />
                <View style={[styles.cornerDot, styles.cornerDotTR]} />
                <View style={[styles.cornerDot, styles.cornerDotBL]} />
                <View style={[styles.cornerDot, styles.cornerDotBR]} />

                {/* Grid Pattern */}
                <View style={styles.gridHorizontal} />
                <View style={styles.gridVertical} />
              </View>

              {/* Animated Scan Line */}
              <View style={styles.scanLineContainer}>
                <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanLinePosition }] }]} />
                <Animated.View style={[styles.scanLineGlow, { transform: [{ translateY: scanLinePosition }] }]} />
              </View>
            </View>
          </View>

          {/* Scan Instructions */}
          <View style={styles.instructionsContainer}>
            <View style={styles.instructionCard}>
              <Ionicons name="scan-circle" size={28} color="#3B82F6" />
              <Text style={styles.instructionText}>Position the medicine QR code within the frame</Text>
            </View>
          </View>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
              <Ionicons name="shield-checkmark" size={24} color="#22C55E" />
            </View>
            <Text style={styles.featureText}>Authentic</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <Ionicons name="time" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.featureText}>Expiry Check</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
              <Ionicons name="git-branch" size={24} color="#A855F7" />
            </View>
            <Text style={styles.featureText}>Blockchain</Text>
          </View>
        </View>
      </View>

      {/* Scan Again Button */}
      {scanned && (
        <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
          <Ionicons name="refresh-circle" size={24} color="#FFFFFF" />
          <Text style={styles.scanAgainText}>Scan Another Medicine</Text>
        </TouchableOpacity>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Secure • Verified • Trusted</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  // Background Waves with Gradient Effects
  backgroundWave1: {
    position: 'absolute',
    top: -height * 0.1,
    left: -width * 0.2,
    right: -width * 0.2,
    height: height * 0.5,
    backgroundColor: '#1E40AF',
    borderRadius: width,
    transform: [{ scaleX: 2 }],
    opacity: 0.8,
  },
  backgroundWave2: {
    position: 'absolute',
    top: height * 0.3,
    left: -width * 0.1,
    right: -width * 0.1,
    height: height * 0.4,
    backgroundColor: '#3B82F6',
    borderRadius: width,
    transform: [{ scaleX: 1.5 }],
    opacity: 0.6,
  },
  backgroundWave3: {
    position: 'absolute',
    bottom: -height * 0.2,
    left: -width * 0.05,
    right: -width * 0.05,
    height: height * 0.5,
    backgroundColor: '#60A5FA',
    borderRadius: width,
    transform: [{ scaleX: 1.2 }],
    opacity: 0.4,
  },
  // Floating Particles
  particle1: {
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.1,
    width: 8,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  particle2: {
    position: 'absolute',
    top: height * 0.4,
    right: width * 0.15,
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
  },
  particle3: {
    position: 'absolute',
    bottom: height * 0.3,
    left: width * 0.2,
    width: 10,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 5,
  },
  particle4: {
    position: 'absolute',
    bottom: height * 0.2,
    right: width * 0.1,
    width: 7,
    height: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 3.5,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIconContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    padding: 25,
    borderRadius: 30,
    marginBottom: 20,
  },
  loadingText: {
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  permissionIconContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    padding: 30,
    borderRadius: 40,
    marginBottom: 30,
  },
  permissionTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  permissionText: {
    color: '#CBD5E1',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 35,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 10,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 25,
    zIndex: 2,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 15,
    borderRadius: 20,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  titleContainer: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#A5B4FC',
    fontWeight: '500',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    paddingHorizontal: 20,
  },
  scannerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  scannerCard: {
    width: width * 0.88,
    height: width * 0.88,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 35,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 25,
  },
  scannerGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 35,
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
    width: width * 0.65,
    height: width * 0.65,
    borderWidth: 1.5,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 25,
    backgroundColor: 'transparent',
  },
  cornerDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 6,
  },
  cornerDotTL: {
    top: -6,
    left: -6,
  },
  cornerDotTR: {
    top: -6,
    right: -6,
  },
  cornerDotBL: {
    bottom: -6,
    left: -6,
  },
  cornerDotBR: {
    bottom: -6,
    right: -6,
  },
  gridHorizontal: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    transform: [{ translateY: -0.5 }],
  },
  gridVertical: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    transform: [{ translateX: -0.5 }],
  },
  scanLineContainer: {
    position: 'absolute',
    width: width * 0.65,
    height: width * 0.65,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  scanLine: {
    width: width * 0.58,
    height: 3,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
    zIndex: 2,
  },
  scanLineGlow: {
    width: width * 0.60,
    height: 15,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 10,
    position: 'absolute',
    top: -6,
    zIndex: 1,
  },
  instructionsContainer: {
    alignItems: 'center',
  },
  instructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  instructionText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 10,
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
  },
  featureItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 20,
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  featureIcon: {
    padding: 12,
    borderRadius: 15,
    marginBottom: 8,
  },
  featureText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    marginHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 30,
    marginBottom: 30,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 12,
    zIndex: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  scanAgainText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 10,
  },
  footer: {
    paddingBottom: 30,
    alignItems: 'center',
    zIndex: 2,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1.2,
  },
});