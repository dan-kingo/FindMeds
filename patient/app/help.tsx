import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import { Card, Divider, List } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import Header from "@/src/components/Header";
import ScreenBackground from "@/src/components/ScreenBackground";
import { theme } from "@/src/constants/theme";

const faqs = [
  {
    question: "How do I find nearby pharmacies?",
    answer:
      "The app automatically detects your location and displays nearby pharmacies. You can also manually search by address.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Yes, we use industry-standard encryption to protect all your personal and health information.",
  },
  {
    question: "How do I upload a prescription?",
    answer:
      "Go to the 'Upload Prescription' section and either take a photo or select an existing image from your device.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards and mobile payment options like Apple Pay and Google Pay.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach us through the 'Contact Us' screen in the app or email support@findmeds.com",
  },
];

export default function HelpScreen() {
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const toggleFAQ = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <ScreenBackground>
      <View style={styles.screen}>
        <Header title="Help Center" showBack />
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <MaterialIcons
              name="help-outline"
              size={32}
              color={theme.colors.primary}
            />
            <Text style={[styles.title, { color: theme.colors.primary }]}>
              Help Center
            </Text>
            <Text style={styles.subtitle}>
              Find answers to common questions
            </Text>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              {faqs.map((faq, index) => (
                <View key={index}>
                  <List.Accordion
                    title={faq.question}
                    titleStyle={styles.question}
                    style={styles.accordion}
                    expanded={expandedIds.includes(index)}
                    onPress={() => toggleFAQ(index)}
                    left={(props) => (
                      <List.Icon
                        {...props}
                        icon={expandedIds.includes(index) ? "minus" : "plus"}
                      />
                    )}
                  >
                    <Text
                      style={[styles.answer, { color: theme.colors.onSurface }]}
                    >
                      {faq.answer}
                    </Text>
                  </List.Accordion>
                  {index < faqs.length - 1 && (
                    <Divider style={styles.divider} />
                  )}
                </View>
              ))}
            </Card.Content>
          </Card>

          <Card style={styles.helpSection}>
            <Card.Content>
              <Text style={[styles.helpTitle, { color: theme.colors.primary }]}>
                Still need help?
              </Text>
              <Text
                style={[styles.helpText, { color: theme.colors.onSurface }]}
              >
                Contact our support team for personalized assistance.
              </Text>
              <List.Item
                title="Contact Support"
                description="We're available 24/7"
                left={(props) => <List.Icon {...props} icon="email" />}
                onPress={() => Linking.openURL("mailto:support@findmeds.com")}
                style={styles.contactItem}
              />
            </Card.Content>
          </Card>
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
    fontSize: 24,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(160,196,255,0.16)",
    backgroundColor: "rgba(23,33,43,0.72)",
    marginBottom: 20,
  },
  question: {
    fontWeight: "500",
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  accordion: {
    backgroundColor: "transparent",
  },
  answer: {
    padding: 16,
    paddingTop: 0,
    fontSize: 15,
    lineHeight: 22,
  },
  divider: {
    backgroundColor: "rgba(160,196,255,0.14)",
  },
  helpSection: {
    marginTop: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(160,196,255,0.16)",
    backgroundColor: "rgba(23,33,43,0.72)",
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  helpText: {
    fontSize: 15,
    marginBottom: 15,
  },
  contactItem: {
    paddingLeft: 0,
  },
});
