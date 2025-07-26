import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function AddMedicationScreen({ navigation }) {
  const [medicationData, setMedicationData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time: '',
    duration: '',
    instructions: '',
    prescribedBy: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setMedicationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveMedication = async () => {
    const { name, dosage, frequency, time } = medicationData;
    
    if (!name || !dosage || !frequency || !time) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      await firestore().collection('medications').add({
        ...medicationData,
        userId: user.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Success', 'Medication added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save medication: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Medication</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <View style={styles.illustration}>
          <Icon name="local-pharmacy" size={60} color="#3f51b5" />
        </View>
        <Text style={styles.illustrationTitle}>Manage your med</Text>
        <Text style={styles.illustrationSubtitle}>Add your meds for reminders of time</Text>
      </View>

      {/* Form */}
      <ScrollView style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Medication Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter medication name"
            value={medicationData.name}
            onChangeText={(value) => handleInputChange('name', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dosage *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 500mg, 2 tablets"
            value={medicationData.dosage}
            onChangeText={(value) => handleInputChange('dosage', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Frequency *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Twice daily, Every 8 hours"
            value={medicationData.frequency}
            onChangeText={(value) => handleInputChange('frequency', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 8:00 AM, 2:00 PM"
            value={medicationData.time}
            onChangeText={(value) => handleInputChange('time', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Duration</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 7 days, 2 weeks"
            value={medicationData.duration}
            onChangeText={(value) => handleInputChange('duration', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prescribed By</Text>
          <TextInput
            style={styles.input}
            placeholder="Doctor's name"
            value={medicationData.prescribedBy}
            onChangeText={(value) => handleInputChange('prescribedBy', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Start Date</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/DD/YYYY"
            value={medicationData.startDate}
            onChangeText={(value) => handleInputChange('startDate', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>End Date</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/DD/YYYY"
            value={medicationData.endDate}
            onChangeText={(value) => handleInputChange('endDate', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Special Instructions</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g., Take with food, Avoid alcohol"
            value={medicationData.instructions}
            onChangeText={(value) => handleInputChange('instructions', value)}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleSaveMedication}
          disabled={loading}
        >
          <Text style={styles.addButtonText}>
            {loading ? 'Saving...' : 'Add a med'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3f51b5',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 34,
  },
  illustrationContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
  },
  illustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e8eaf6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  illustrationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  illustrationSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#3f51b5',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});