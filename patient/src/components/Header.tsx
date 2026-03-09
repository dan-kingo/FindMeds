import React from "react";
import { View, StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

import { theme } from "@/src/constants/theme";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  actions?: React.ReactNode[];
  subtitle?: string;
}

export default function Header({
  title,
  showBack = false,
  actions = [],
  subtitle,
}: HeaderProps) {
  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.wrapper}>
      <Appbar.Header style={styles.header}>
        {showBack && (
          <Appbar.BackAction
            onPress={() => router.back()}
            color={theme.colors.onSurface}
          />
        )}
        <Appbar.Content
          title={title}
          subtitle={subtitle}
          titleStyle={styles.title}
          subtitleStyle={styles.subtitle}
        />
        {actions.map((action, index) => (
          <View key={index} style={styles.actionSlot}>
            {action}
          </View>
        ))}
      </Appbar.Header>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  header: {
    borderRadius: 18,
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: "rgba(160, 196, 255, 0.14)",
    backgroundColor: "rgba(23, 33, 43, 0.72)",
  },
  title: {
    fontSize: 21,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  actionSlot: {
    marginRight: 2,
  },
});
