import React from "react";
import { View, StyleSheet } from "react-native";

import { theme } from "@/src/constants/theme";

type ScreenBackgroundProps = {
  children: React.ReactNode;
};

export default function ScreenBackground({ children }: ScreenBackgroundProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.blob, styles.blobPrimary]} />
      <View style={[styles.blob, styles.blobSecondary]} />
      <View style={[styles.blob, styles.blobTertiary]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  blob: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.22,
  },
  blobPrimary: {
    width: 260,
    height: 260,
    top: -90,
    left: -50,
    backgroundColor: theme.colors.primary,
  },
  blobSecondary: {
    width: 210,
    height: 210,
    top: 140,
    right: -75,
    backgroundColor: theme.colors.secondary,
  },
  blobTertiary: {
    width: 170,
    height: 170,
    bottom: 70,
    left: -45,
    backgroundColor: theme.colors.tertiary,
  },
});
