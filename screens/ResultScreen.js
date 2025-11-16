import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Animated } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function ResultScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { medicineData, verificationResult } = route.params;

  const getStatusConfig = () => {
    if (verificationResult.isFake) {
      return {
        color: '#EF4444',
        icon: 'close-circle',
        message: 'Counterfeit Medicine Detected',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.3)'
      };
    }
    if (verificationResult.expired) {
      return {
        color: '#EF4444',
        icon: 'alert-circle',
        message: 'Expired Medicine',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.3)'
      };
    }
    if (verificationResult.nearExpiry) {
      return {
        color: '#F59E0B',
        icon: 'warning',
        message: 'Medicine Near Expiry',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        borderColor: 'rgba(245, 158, 11, 0.3)'
      };
    }
    if (!verificationResult.authentic) {
      return {
        color: '#EF4444',
        icon: 'close-circle',
        message: 'Medicine Not Authentic',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.3)'
      };
    }
    return {
      color: '#10B981',
      icon: 'checkmark-circle',
      message: 'Authentic & Safe to Use',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 0.3)'
    };
  };


  const statusConfig = getStatusConfig();

  const handleReport = async () => {
    Alert.alert(
      'Report Medicine',
      'Are you sure you want to report this medicine as counterfeit? This will notify authorities.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          style: 'destructive',
          onPress: async () => {
            try {
              const SERVER_IP = '172.19.13.117';
              const response = await fetch(`http://${SERVER_IP}:5000/api/report-counterfeit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  manufacturerId: medicineData.manufacturerId,
                  batchId: medicineData.batchId,
                  expiryDate: medicineData.expiryDate,
                  reporterLocation: "Reported via App",
                  additionalNotes: "User reported as counterfeit"
                }),
              });

              // Better response handling
              if (response.ok) {
                const result = await response.json();
                if (result.success) {
                  Alert.alert('Report Submitted', 'Thank you for reporting. Authorities have been notified.');
                } else {
                  Alert.alert('Error', result.message || 'Failed to submit report. Please try again.');
                }
              } else {
                throw new Error(`Server responded with status: ${response.status}`);
              }
            } catch (error) {
              console.error('Report error:', error);
              Alert.alert('Error', 'Failed to submit report. Please check your connection and try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Background Waves */}
      <View style={styles.backgroundWave1} />
      <View style={styles.backgroundWave2} />

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Status Card */}
        <View style={[styles.statusCard, { backgroundColor: statusConfig.bgColor, borderColor: statusConfig.borderColor }]}>
          <Ionicons name={statusConfig.icon} size={70} color={statusConfig.color} />
          <Text style={[styles.statusMessage, { color: statusConfig.color }]}>
            {statusConfig.message}
          </Text>
          <Text style={styles.statusSubtext}>
            {verificationResult.foundInDatabase ? 'Verified in database' : 'Not found in database'}
          </Text>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <Ionicons name="information-circle" size={24} color="#3B82F6" />
            <Text style={styles.detailsTitle}>Medicine Details</Text>
          </View>

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

          {verificationResult.monthsUntilExpiry !== undefined && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={[
                styles.detailValue,
                {
                  color: verificationResult.monthsUntilExpiry < 0 ? '#EF4444' :
                    verificationResult.monthsUntilExpiry <= 3 ? '#F59E0B' : '#10B981'
                }
              ]}>
                {verificationResult.monthsUntilExpiry < 0 ? 'Expired' :
                  verificationResult.monthsUntilExpiry <= 3 ? 'Near Expiry' : 'Valid'}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {(!verificationResult.authentic || verificationResult.isFake || verificationResult.expired) && (
          <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
            <Ionicons name="warning" size={22} color="#FFFFFF" />
            <Text style={styles.reportButtonText}>Report to Authorities</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.scanAgainButton} onPress={() => navigation.navigate('Scan')}>
          <Ionicons name="scan" size={22} color="#FFFFFF" />
          <Text style={styles.scanAgainText}>Scan Another Medicine</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Text */}
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
  // Background Waves
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
  // Main Content
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  // Status Card
  statusCard: {
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 30,
    borderRadius: 25,
    borderWidth: 2,
    marginBottom: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  statusMessage: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
  statusSubtext: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
  },
  // Details Card
  detailsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 12,
    marginBottom: 30,
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
  // Action Buttons
  actionsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 30,
    zIndex: 2,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 18,
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  reportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 18,
    borderRadius: 25,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  scanAgainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
  // Footer
  footer: {
    paddingBottom: 20,
    alignItems: 'center',
    zIndex: 2,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
});





