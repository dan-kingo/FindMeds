import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { theme } from '@/src/constants/theme';
import { authAPI } from '@/src/services/api';
import Header from '@/src/components/Header';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create or mark user verified with details
      await authAPI.requestOtp({
        phone: formData.phone,
        name: formData.name,
        email: formData.email,
        location: formData.location,
      });

      // Set password and get token in one step
      const response = await authAPI.verifyOtp(formData.phone, password);
      const { token, user } = response.data;
      // Store token and user via auth store
      const { login } = require('@/src/store/authStore').useAuthStore.getState();
      login(token, user);

      Toast.show({
        type: 'success',
        text1: 'Registration Complete',
        text2: 'Welcome to MedStream!',
      });

      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Registration error:', error);
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error.response?.data?.message || 'Failed to register',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        
        <KeyboardAwareScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          extraScrollHeight={20}
          enableAutomaticScroll={true}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <Text variant="headlineSmall" style={styles.title}>
              Create Account
            </Text>
            <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Join MedStream to find medicines easily
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.form}>
            <TextInput
              label="Full Name *"
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              placeholder="Enter your full name"
              mode="outlined"
              error={!!errors.name}
              style={styles.input}
              returnKeyType="next"
            />
            <HelperText type="error" visible={!!errors.name}>
              {errors.name}
            </HelperText>

            <TextInput
              label="Phone Number *"
              value={formData.phone}
              onChangeText={(value) => updateFormData('phone', value)}
              placeholder="+2519xxxxxxxx"
              keyboardType="phone-pad"
              mode="outlined"
              error={!!errors.phone}
              style={styles.input}
              returnKeyType="next"
            />
            <HelperText type="error" visible={!!errors.phone}>
              {errors.phone}
            </HelperText>

            <TextInput
              label="Email *"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
              style={styles.input}
              returnKeyType="next"
              error={!!errors.email}
            />
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>

            <TextInput
              label="Location *"
              value={formData.location}
              onChangeText={(value) => updateFormData('location', value)}
              placeholder="Enter your city/town"
              mode="outlined"
              style={styles.input}
              returnKeyType="done"
              error={!!errors.location}
            />
            <HelperText type="error" visible={!!errors.location}>
              {errors.location}
            </HelperText>

            <TextInput
              label="Password *"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter at least 6 characters"
              secureTextEntry={!showPassword}
              mode="outlined"
              style={styles.input}
              error={!!errors.password}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword((prev) => !prev)}
                />
              }
            />
            <HelperText type="error" visible={!!errors.password}>
              {errors.password}
            </HelperText>

            <TextInput
              label="Confirm Password *"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter your password"
              secureTextEntry={!showConfirmPassword}
              mode="outlined"
              style={styles.input}
              error={!!errors.confirmPassword}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword((prev) => !prev)}
                />
              }
            />
            <HelperText type="error" visible={!!errors.confirmPassword}>
              {errors.confirmPassword}
            </HelperText>

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.continueButton}
              contentStyle={styles.buttonContent}
            >
              Continue
            </Button>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.footer}>
            <Text variant="bodyMedium" style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
              Already have an account?{' '}
              <Text 
                style={{ color: theme.colors.primary, fontWeight: '600' }}
                onPress={() => router.push('/(auth)/login')}
              >
                Sign In
              </Text>
            </Text>
          </Animated.View>
        </KeyboardAwareScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40, // Extra padding for keyboard
  },
  title: {
    fontWeight: 'bold',
    marginTop: 32,
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 32,
  },
  form: {
    marginBottom: 32,
  },
  input: {
    marginBottom: 8,
  },
  continueButton: {
    marginTop: 24,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  footerText: {
    textAlign: 'center',
  },
});