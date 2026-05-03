import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import COLORS from "../src/constants/colors";
import { getUserSettings } from "../src/database/db";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const user = getUserSettings() as any;
        if (user && user.user_name !== "Friend") {
          router.replace("/home");
        } else {
          router.replace("/onboarding");
        }
      } catch (error) {
        router.replace("/onboarding");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.blob1} />
      <View style={styles.blob2} />
      <Text style={styles.momEmoji}>👩‍👧</Text>
      <Text style={styles.appName}>Don't Forget!</Text>
      <Text style={styles.tagline}>your digital mom 💕</Text>
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.dotLarge]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  blob1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.1)",
    top: -60,
    left: -60,
  },
  blob2: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,155,181,0.2)",
    bottom: 80,
    right: -40,
  },
  momEmoji: {
    fontSize: 90,
    marginBottom: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: "800",
    color: COLORS.white,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255,255,255,0.85)",
    marginBottom: 60,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  dotLarge: {
    width: 24,
  },
});
