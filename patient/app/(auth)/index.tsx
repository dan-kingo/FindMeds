import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { router } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "@/src/constants/theme";
import ScreenBackground from "@/src/components/ScreenBackground";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Animated.View
          entering={FadeInUp.delay(200).duration(800)}
          style={styles.header}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
          >
            <MaterialCommunityIcons
              name="pill"
              size={80}
              color={theme.colors.primary}
            />
          </View>
          <Text
            variant="headlineLarge"
            style={[styles.title, { color: theme.colors.primary }]}
          >
            FindMeds
          </Text>
          <Text
            variant="bodyLarge"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Find medicines from nearby pharmacies
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400).duration(800)}
          style={styles.features}
        >
          <Card style={styles.featureCard}>
            <Card.Content style={styles.feature}>
              <MaterialCommunityIcons
                name="map-search"
                size={30}
                color={theme.colors.primary}
              />
              <Text variant="bodyMedium" style={styles.featureText}>
                Search nearby pharmacies
              </Text>
            </Card.Content>
          </Card>
          <Card style={styles.featureCard}>
            <Card.Content style={styles.feature}>
              <MaterialCommunityIcons
                name="upload-box"
                size={30}
                color={theme.colors.primary}
              />
              <Text variant="bodyMedium" style={styles.featureText}>
                Upload prescriptions quickly
              </Text>
            </Card.Content>
          </Card>
          <Card style={styles.featureCard}>
            <Card.Content style={styles.feature}>
              <MaterialCommunityIcons
                name="truck-delivery"
                size={30}
                color={theme.colors.primary}
              />
              <Text variant="bodyMedium" style={styles.featureText}>
                Track realtime delivery
              </Text>
            </Card.Content>
          </Card>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(600).duration(800)}
          style={styles.buttons}
        >
          <Button
            mode="contained"
            onPress={() => router.push("/(auth)/register")}
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
          >
            Get Started
          </Button>
          <Button
            mode="outlined"
            onPress={() => router.push("/(auth)/login")}
            style={styles.secondaryButton}
            contentStyle={styles.buttonContent}
          >
            I already have an account
          </Button>
        </Animated.View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 18,
  },
  features: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 32,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  featureCard: {
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(160,196,255,0.16)",
    backgroundColor: "rgba(23,33,43,0.72)",
  },
  featureText: {
    marginLeft: 16,
    flex: 1,
  },
  buttons: {
    paddingBottom: 32,
  },
  primaryButton: {
    marginBottom: 16,
    borderRadius: 12,
  },
  secondaryButton: {
    marginBottom: 8,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
