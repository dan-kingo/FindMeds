import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import { Card, Divider, IconButton } from "react-native-paper";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import Header from "@/src/components/Header";
import { theme } from "@/src/constants/theme";
import ScreenBackground from "@/src/components/ScreenBackground";

export default function AboutScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err),
    );
  };

  return (
    <ScreenBackground>
      <View style={styles.screen}>
        <Header title="About FindMeds" showBack />
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>
              About FindMeds
            </Text>
            <Text style={styles.subtitle}>
              Your trusted healthcare companion
            </Text>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.section}>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={24}
                  color={theme.colors.primary}
                  style={styles.icon}
                />
                <Text style={styles.sectionTitle}>Our Mission</Text>
              </View>
              <Text style={styles.text}>
                FindMeds connects patients with nearby pharmacies, making
                medication access convenient and reliable. We aim to bridge the
                gap between healthcare providers and patients through innovative
                technology.
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.section}>
                <MaterialIcons
                  name="medical-services"
                  size={24}
                  color={theme.colors.primary}
                  style={styles.icon}
                />
                <Text style={styles.sectionTitle}>Key Features</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons
                  name="map-marker-radius"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={styles.text}>
                  • Real-time pharmacy locator with distance calculation
                </Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons
                  name="pill"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={styles.text}>
                  • Comprehensive medicine database
                </Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={styles.text}>
                  • Pharmacy operating hours and availability
                </Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons
                  name="truck-delivery-outline"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={styles.text}>• Delivery service integration</Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.section}>
                <FontAwesome
                  name="users"
                  size={22}
                  color={theme.colors.primary}
                  style={styles.icon}
                />
                <Text style={styles.sectionTitle}>Our Team</Text>
              </View>
              <Text style={styles.text}>
                FindMeds is developed by a dedicated team of healthcare
                professionals and software engineers committed to improving
                medication access.
              </Text>
              <Divider style={styles.divider} />
              <Text style={styles.text}>
                We collaborate with licensed pharmacies and healthcare providers
                to ensure the accuracy and reliability of our services.
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.section}>
                <MaterialCommunityIcons
                  name="cellphone-information"
                  size={24}
                  color={theme.colors.primary}
                  style={styles.icon}
                />
                <Text style={styles.sectionTitle}>App Information</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Version:</Text>
                <Text style={styles.infoValue}>v1.0.0</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Last Updated:</Text>
                <Text style={styles.infoValue}>June 2025</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Platform:</Text>
                <Text style={styles.infoValue}>iOS & Android</Text>
              </View>
            </Card.Content>
          </Card>

          <View style={styles.socialLinks}>
            <Text style={styles.connectText}>Connect with us:</Text>
            <View style={styles.iconRow}>
              <IconButton
                icon={() => (
                  <FontAwesome name="facebook" size={24} color="#3b5998" />
                )}
                onPress={() => openLink("https://facebook.com/FindMeds")}
              />
              <IconButton
                icon={() => (
                  <FontAwesome name="twitter" size={24} color="#1DA1F2" />
                )}
                onPress={() => openLink("https://twitter.com/FindMeds")}
              />
              <IconButton
                icon={() => (
                  <FontAwesome name="instagram" size={24} color="#E1306C" />
                )}
                onPress={() => openLink("https://instagram.com/FindMeds")}
              />
              <IconButton
                icon={() => (
                  <MaterialIcons name="email" size={24} color="#D44638" />
                )}
                onPress={() => openLink("mailto:support@FindMeds.com")}
              />
            </View>
          </View>

          <Text style={styles.copyright}>
            © 2025 FindMeds Inc. All rights reserved.
          </Text>
        </ScrollView>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
  },
  card: {
    marginBottom: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(160,196,255,0.16)",
    backgroundColor: "rgba(23,33,43,0.72)",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 15,
  },
  featureItem: {
    display: "flex",
    alignContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  divider: {
    marginVertical: 15,
    backgroundColor: "rgba(160,196,255,0.14)",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.onSurface,
  },
  socialLinks: {
    marginTop: 10,
    alignItems: "center",
  },
  connectText: {
    fontSize: 16,
    marginBottom: 15,
    color: theme.colors.onSurface,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  copyright: {
    marginTop: 30,
    textAlign: "center",
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
  },
});
