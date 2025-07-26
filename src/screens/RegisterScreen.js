import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../App';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    contactNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = async () => {
    const { fname, lname, email, password, confirmPassword } = formData;
    
    if (!fname || !lname || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, {
        displayName: `${fname} ${lname}`
      });

      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fname,
        lname,
        age: formData.age,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        contactNumber: formData.contactNumber,
        email,
        createdAt: new Date().toISOString(),
      });

      // Navigation will be handled automatically by onAuthStateChanged
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Icon name="local-pharmacy" size={40} color="#fff" />
        </View>
      </View>

      <Text style={styles.title}>Create your Account</Text>

      <View style={styles.formContainer}>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Fname"
            value={formData.fname}
            onChangeText={(value) => handleInputChange('fname', value)}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Lname"
            value={formData.lname}
            onChangeText={(value) => handleInputChange('lname', value)}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Age"
            value={formData.age}
            onChangeText={(value) => handleInputChange('age', value)}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Gender"
            value={formData.gender}
            onChangeText={(value) => handleInputChange('gender', value)}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Height"
            value={formData.height}
            onChangeText={(value) => handleInputChange('height', value)}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Weight"
            value={formData.weight}
            onChangeText={(value) => handleInputChange('weight', value)}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChangeText={(value) => handleInputChange('contactNumber', value)}
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Password"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.signInText}>
            {loading ? 'Creating Account...' : 'Sign in'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or sign up with</Text>

        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  halfInput: {
    width: '48%',
  },
  signInButton: {
    backgroundColor: '#3f51b5',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleText: {
    color: '#333',
    fontSize: 16,
  },
});