import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Button,
  TextInput,
  Text,
  ActivityIndicator,
  Card,
} from "react-native-paper";
import { profileAPI } from "@/src/services/api";
import Header from "@/src/components/Header";
import ScreenBackground from "@/src/components/ScreenBackground";
import { useRouter, useFocusEffect } from "expo-router";
import { theme } from "@/src/constants/theme";

interface ProfileData {
  name: string;
  email: string;
  location: string;
  language: "en" | "am";
}

const EditProfileScreen = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    location: "",
    language: "en",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, []),
  );

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.getProfile();
      setProfile({
        name: response.data.name || "",
        email: response.data.email || "",
        location: response.data.location || "",
        language: response.data.language || "en",
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
    };

    if (!profile.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (profile.email && !/^\S+@\S+\.\S+$/.test(profile.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setUpdating(true);
      await profileAPI.updateProfile(profile);
      Alert.alert("Success", "Profile updated successfully", [
        {
          text: "OK",
          onPress: () => router.back(), // Go back to previous screen (Profile)
        },
      ]);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      let errorMessage = "Failed to update profile. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  if (loading) {
    return (
      <ScreenBackground>
        <View style={styles.loaderContainer}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <View style={styles.screen}>
        <Header title="Edit Profile" showBack />
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.title}>
                Personal Information
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                Keep your profile details up to date for smoother deliveries.
              </Text>

              <TextInput
                label="Name *"
                value={profile.name}
                onChangeText={(text) => handleChange("name", text)}
                mode="outlined"
                style={styles.input}
                outlineColor="rgba(160,196,255,0.2)"
                activeOutlineColor={theme.colors.primary}
                textColor={theme.colors.onSurface}
                error={!!errors.name}
              />
              {errors.name ? (
                <Text style={styles.error}>{errors.name}</Text>
              ) : null}

              <TextInput
                label="Email"
                value={profile.email}
                onChangeText={(text) => handleChange("email", text)}
                mode="outlined"
                style={styles.input}
                outlineColor="rgba(160,196,255,0.2)"
                activeOutlineColor={theme.colors.primary}
                textColor={theme.colors.onSurface}
                keyboardType="email-address"
                autoCapitalize="none"
                error={!!errors.email}
              />
              {errors.email ? (
                <Text style={styles.error}>{errors.email}</Text>
              ) : null}

              <TextInput
                label="Location"
                value={profile.location}
                onChangeText={(text) => handleChange("location", text)}
                mode="outlined"
                style={styles.input}
                outlineColor="rgba(160,196,255,0.2)"
                activeOutlineColor={theme.colors.primary}
                textColor={theme.colors.onSurface}
              />

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
                loading={updating}
                disabled={updating}
                contentStyle={styles.buttonContent}
              >
                {updating ? "Updating..." : "Save Changes"}
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(160,196,255,0.16)",
    backgroundColor: "rgba(23,33,43,0.72)",
  },
  title: {
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    opacity: 0.75,
    marginBottom: 18,
  },
  input: {
    marginBottom: 10,
    backgroundColor: "rgba(23,33,43,0.6)",
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
  },
  buttonContent: {
    height: 48,
  },
  error: {
    color: theme.colors.error,
    marginBottom: 15,
    marginLeft: 5,
    fontSize: 12,
  },
});

export default EditProfileScreen;
