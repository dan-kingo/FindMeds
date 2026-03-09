import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, HelperText } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import Toast from "react-native-toast-message";

import { theme } from "@/src/constants/theme";
import { authAPI } from "@/src/services/api";
import { useAuthStore } from "@/src/store/authStore";
import Header from "@/src/components/Header";

export default function OtpVerificationScreen() {
  const { login } = useAuthStore();
  const params = useLocalSearchParams();
  const { phone, isRegistration } = params;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Auto-verify for login (non-registration) without OTP
    if (isRegistration !== "true" && phone) {
      (async () => {
        try {
          setLoading(true);
          const response = await authAPI.verifyOtp(phone as string);
          const { token, user } = response.data;
          login(token, user);
          Toast.show({ type: "success", text1: "Login Successful" });
          router.replace("/(tabs)");
        } catch (err: any) {
          setError(err.response?.data?.message || "Verification failed");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [phone, isRegistration]);

  const handleCompleteRegistration = async () => {
    if (isRegistration === "true" && (!password || password.length < 6)) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (isRegistration === "true" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyOtp(phone as string, password);

      const { token, user } = response.data;
      login(token, user);

      Toast.show({
        type: "success",
        text1: "Registration Complete",
        text2: "Welcome to FindMeds!",
      });

      router.replace("/(tabs)");
    } catch (error: any) {
      setError(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header
        title={
          isRegistration === "true" ? "Complete Registration" : "Verifying"
        }
        showBack
      />

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <Text variant="headlineSmall" style={styles.title}>
            {isRegistration === "true"
              ? "Create Your Account"
              : "Verifying your account..."}
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            {isRegistration === "true"
              ? "Set a password to finish registration."
              : `Phone: ${phone}`}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400).duration(600)}
          style={styles.form}
        >
          {isRegistration === "true" && (
            <>
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter at least 6 characters"
                secureTextEntry
                mode="outlined"
                style={styles.passwordInput}
              />

              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter your password"
                secureTextEntry
                mode="outlined"
                style={styles.passwordInput}
              />
            </>
          )}

          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>

          {isRegistration === "true" && (
            <Button
              mode="contained"
              onPress={handleCompleteRegistration}
              loading={loading}
              disabled={loading}
              style={styles.verifyButton}
              contentStyle={styles.buttonContent}
            >
              Complete Registration
            </Button>
          )}

          {isRegistration !== "true" && (
            <View style={styles.resendContainer}>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Verifying...
              </Text>
            </View>
          )}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 32,
    textAlign: "center",
  },
  form: {
    alignItems: "center",
  },
  otpInput: {
    width: "100%",
    textAlign: "center",
    fontSize: 24,
    letterSpacing: 8,
    marginBottom: 8,
  },
  passwordInput: {
    width: "100%",
    marginTop: 16,
  },
  verifyButton: {
    marginTop: 24,
    width: "100%",
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  resendContainer: {
    marginTop: 16,
    alignItems: "center",
  },
});
