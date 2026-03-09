import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Card, Divider, useTheme, Button } from "react-native-paper";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import Header from "@/src/components/Header";
import ScreenBackground from "@/src/components/ScreenBackground";
export default function ContactScreen() {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err),
    );
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Here you would typically send the form data to your backend
    console.log({ name, email, message });
    setTimeout(() => {
      setIsSubmitting(false);
      setName("");
      setEmail("");
      setMessage("");
      alert("Thank you for your message! We will get back to you soon.");
    }, 1500);
  };

  return (
    <ScreenBackground>
      <View style={styles.screen}>
        <Header title="Contact Us" showBack />
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>
              Contact Us
            </Text>
            <Text style={styles.subtitle}>
              We're here to help and answer any questions
            </Text>
          </View>

          {/* Contact Information Cards */}

          <Card style={styles.contactCard}>
            <Card.Content style={styles.cardContent}>
              <Ionicons
                name="call-outline"
                size={28}
                color={theme.colors.primary}
              />
              <Text style={styles.contactType}>Phone Support</Text>
              <Text style={styles.contactInfo}>+1 (800) 555-1234</Text>
              <Button
                mode="outlined"
                onPress={() => openLink("tel:+18005551234")}
                style={styles.contactButton}
                icon="phone"
              >
                Call Now
              </Button>
            </Card.Content>
          </Card>

          <Card style={styles.contactCard}>
            <Card.Content style={styles.cardContent}>
              <MaterialIcons
                name="email"
                size={28}
                color={theme.colors.primary}
              />
              <Text style={styles.contactType}>Email Us</Text>
              <Text style={styles.contactInfo}>support@FindMeds.com</Text>
              <Button
                mode="outlined"
                onPress={() => openLink("mailto:support@FindMeds.com")}
                style={styles.contactButton}
                icon="email"
              >
                Send Email
              </Button>
            </Card.Content>
          </Card>

          <Card style={styles.contactCard}>
            <Card.Content style={styles.cardContent}>
              <FontAwesome
                name="map-marker"
                size={28}
                color={theme.colors.primary}
              />
              <Text style={styles.contactType}>Corporate Office</Text>
              <Text style={styles.contactInfo}>123 FindMeds way</Text>
              <Text style={styles.contactInfo}>poly campus, Bahir Dar</Text>
              <Text style={styles.contactInfo}>Ethiopia</Text>
              <Button
                mode="outlined"
                onPress={() =>
                  openLink(
                    "https://maps.google.com/?q=poly+campus,+Bahir+Dar,+Ethiopia",
                  )
                }
                style={styles.contactButton}
                icon="map"
              >
                View on Map
              </Button>
            </Card.Content>
          </Card>

          {/* Business Hours */}
          <Card style={styles.hoursCard}>
            <Card.Content>
              <Text
                style={[styles.hoursTitle, { color: theme.colors.primary }]}
              >
                Business Hours
              </Text>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursDay}>Monday - Friday</Text>
                <Text style={styles.hoursTime}>9:00 AM - 6:00 PM</Text>
              </View>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursDay}>Saturday</Text>
                <Text style={styles.hoursTime}>10:00 AM - 4:00 PM</Text>
              </View>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursDay}>Sunday</Text>
                <Text style={styles.hoursTime}>Closed</Text>
              </View>
            </Card.Content>
          </Card>

          {/* Social Media */}
          <View style={styles.socialContainer}>
            <Text style={styles.socialTitle}>Connect With Us</Text>
            <View style={styles.socialIcons}>
              <TouchableOpacity
                onPress={() => openLink("https://facebook.com/FindMeds")}
              >
                <FontAwesome
                  name="facebook"
                  size={28}
                  color="#3b5998"
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openLink("https://twitter.com/FindMeds")}
              >
                <FontAwesome
                  name="twitter"
                  size={28}
                  color="#1DA1F2"
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openLink("https://instagram.com/FindMeds")}
              >
                <FontAwesome
                  name="instagram"
                  size={28}
                  color="#E1306C"
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  openLink("https://linkedin.com/company/FindMeds")
                }
              >
                <FontAwesome
                  name="linkedin"
                  size={28}
                  color="#0077B5"
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
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
    color: "#9fb0c3",
    textAlign: "center",
  },
  contactMethods: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  contactCard: {
    flex: 1,
    marginBottom: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(160,196,255,0.16)",
    backgroundColor: "rgba(23,33,43,0.72)",
  },
  cardContent: {
    alignItems: "center",
    padding: 20,
  },
  contactType: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    color: "#e7edf5",
  },
  contactInfo: {
    fontSize: 16,
    color: "#9fb0c3",
    textAlign: "center",
    marginBottom: 15,
  },
  contactButton: {
    width: "100%",
    marginTop: 10,
  },
  formCard: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  messageInput: {
    height: 120,
    textAlignVertical: "top",
  },
  submitButton: {
    marginTop: 10,
    paddingVertical: 8,
  },
  submitButtonText: {
    fontSize: 16,
  },
  hoursCard: {
    marginBottom: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(160,196,255,0.16)",
    backgroundColor: "rgba(23,33,43,0.72)",
  },
  hoursTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  hoursDay: {
    fontSize: 16,
    color: "#9fb0c3",
  },
  hoursTime: {
    fontSize: 16,
    fontWeight: "500",
    color: "#e7edf5",
  },
  socialContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  socialTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#e7edf5",
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialIcon: {
    marginHorizontal: 15,
  },
});
