import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Helper function remains the same
const isFakeManufacturer = (manufacturer) => {
  const manufacturerLower = manufacturer.toLowerCase();
  return (
    manufacturerLower.includes('fake') ||
    manufacturerLower.includes('counterfeit') ||
    manufacturerLower.includes('unknown') ||
    manufacturerLower.includes('blackmarket') ||
    manufacturerLower.includes('illegal') ||
    !['pharmacorp', 'medlife', 'healthcare', 'biopharm', 'medisafe'].includes(manufacturerLower)
  );
};

export default function VerifyScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { medicineData } = route.params;
  const [verifying, setVerifying] = useState(true);
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Progress animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    const verifyMedicine = async () => {
      try {
        const SERVER_IP = '192.168.1.35';
        const SERVER_URL = `http://${SERVER_IP}:5000/api/verify-medicine`;

        const response = await fetch(SERVER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            manufacturerId: medicineData.manufacturerId,
            batchId: medicineData.batchId,
            expiryDate: medicineData.expiryDate
          }),
        });

        if (!response.ok) throw new Error(`Backend error: ${response.status}`);

        const verificationResult = await response.json();
        
        setVerifying(false);
        navigation.navigate('Result', { medicineData, verificationResult });

      } catch (error) {
        console.error('Backend connection failed:', error);
        
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const [expiryMonth, expiryYear] = medicineData.expiryDate.split('/').map(Number);
        const monthsUntilExpiry = (expiryYear - currentYear) * 12 + (expiryMonth - currentMonth);

        const fallbackResult = {
          authentic: !isFakeManufacturer(medicineData.manufacturerId),
          nearExpiry: monthsUntilExpiry >= 0 && monthsUntilExpiry <= 3,
          expired: monthsUntilExpiry < 0,
          manufacturer: medicineData.manufacturerId,
          batchNumber: medicineData.batchId,
          expiryDate: medicineData.expiryDate,
          verifiedOnBlockchain: false,
          message: "Using client-side verification - backend unavailable",
          isFake: isFakeManufacturer(medicineData.manufacturerId),
          foundInDatabase: false
        };

        setVerifying(false);
        navigation.navigate('Result', { medicineData, verificationResult: fallbackResult });
      }
    };

    verifyMedicine();
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={styles.container}>
      {/* Background with better contrast */}
      <View style={styles.backgroundMain} />
      <View style={styles.backgroundAccent} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Ionicons name="shield-checkmark" size={36} color="#FFFFFF" />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>MediTrust</Text>
            <Text style={styles.subtitle}>Verification in Progress</Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.verificationTitle}>Verifying Authenticity</Text>
          
          {/* Progress Bar with better visibility */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
            </View>
            <Text style={styles.progressText}>Checking blockchain ledger...</Text>
          </View>
        </View>

        {/* Medicine Details Card with better contrast */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <Ionicons name="medical" size={24} color="#2563EB" />
            <Text style={styles.detailsTitle}>Medicine Details</Text>
          </View>
          <View style={styles.detailsContent}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Manufacturer:</Text>
              <Text style={styles.detailValue}>{medicineData.manufacturerId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Batch Number:</Text>
              <Text style={styles.detailValue}>{medicineData.batchId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Expiry Date:</Text>
              <Text style={styles.detailValue}>{medicineData.expiryDate}</Text>
            </View>
          </View>
        </View>

        {/* Security Features with better colors */}
        <View style={styles.securityFeatures}>
          <View style={styles.securityItem}>
            <View style={styles.securityIconEncrypted}>
              <Ionicons name="lock-closed" size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.securityText}>Encrypted</Text>
          </View>
          <View style={styles.securityItem}>
            <View style={styles.securityIconBlockchain}>
              <Ionicons name="git-branch" size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.securityText}>Blockchain</Text>
          </View>
          <View style={styles.securityItem}>
            <View style={styles.securityIconSecure}>
              <Ionicons name="shield-checkmark" size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.securityText}>Secure</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Verifying • Secure • Trusted</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  // Background with better contrast
  backgroundMain: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0F172A',
  },
  backgroundAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: '#1E40AF',
    opacity: 0.9,
  },
  // Header
  header: {
    paddingTop: 60,
    paddingHorizontal: 25,
    zIndex: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    backgroundColor: 'rgba(37, 99, 235, 0.8)',
    padding: 16,
    borderRadius: 20,
    marginRight: 15,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  titleContainer: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#E2E8F0',
    fontWeight: '600',
    letterSpacing: 1.2,
    marginTop: 4,
  },
  // Main Content
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    paddingHorizontal: 20,
  },
  // Progress Section
  progressSection: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  verificationTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  progressBackground: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 5,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 3,
  },
  progressText: {
    color: '#E2E8F0',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Details Card with better contrast
  detailsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 12,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    width: '100%',
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 15,
  },
  detailsTitle: {
    color: '#1F2937',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  detailLabel: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '600',
  },
  detailValue: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '700',
  },
  // Security Features with solid colors
  securityFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  securityItem: {
    alignItems: 'center',
  },
  securityIconEncrypted: {
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 15,
    marginBottom: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  securityIconBlockchain: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 15,
    marginBottom: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  securityIconSecure: {
    backgroundColor: '#8B5CF6',
    padding: 12,
    borderRadius: 15,
    marginBottom: 8,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  securityText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Footer
  footer: {
    paddingBottom: 30,
    alignItems: 'center',
    zIndex: 2,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
});







