import { router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../src/constants/colors";
import { updateUserName } from "../src/database/db";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleGetStarted = () => {
    if (!name.trim()) {
      setError("Please enter your name 😊");
      return;
    }
    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters!");
      return;
    }
    updateUserName(name.trim());
    router.replace("/home");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Background blobs */}
        <View style={styles.blob1} />
        <View style={styles.blob2} />
        <View style={styles.blob3} />

        {/* Mom Character Circle */}
        <View style={styles.momContainer}>
          <Text style={styles.momEmoji}>👩‍👧</Text>
        </View>

        {/* Speech Bubble */}
        <View style={styles.bubbleWrapper}>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>
              Hi! I'm your digital mom 💕{"\n"}
              I'll remind you of everything!
            </Text>
          </View>
          <View style={styles.bubbleTail} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Hello there! 👋</Text>
        <Text style={styles.subtitle}>
          I'll make sure you <Text style={styles.highlight}>never forget</Text>{" "}
          anything important again!
        </Text>

        {/* Name Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>YOUR NAME</Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            placeholder="e.g. Aisha, Sara, Ahmed..."
            placeholderTextColor={COLORS.textLight}
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError("");
            }}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={handleGetStarted}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Let's Go! 🚀</Text>
        </TouchableOpacity>

        {/* Features row */}
        <View style={styles.featuresRow}>
          {[
            { icon: "🎒", label: "Pack Smart" },
            { icon: "🔔", label: "Get Reminded" },
            { icon: "✅", label: "Never Forget" },
          ].map((f) => (
            <View key={f.label} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureEmoji}>{f.icon}</Text>
              </View>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    paddingTop: 70,
    paddingBottom: 40,
  },
  blob1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primaryLight,
    top: -60,
    right: -60,
  },
  blob2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.accentLight,
    bottom: 60,
    left: -40,
  },
  blob3: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.mintLight,
    top: 200,
    left: 20,
  },
  momContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  momEmoji: {
    fontSize: 72,
  },
  bubbleWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  bubble: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 14,
    maxWidth: width * 0.75,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  bubbleText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 20,
  },
  bubbleTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: COLORS.primary,
    marginTop: -1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
    fontWeight: "600",
  },
  highlight: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  inputWrapper: {
    width: "100%",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textLight,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    width: "100%",
    padding: 16,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.border,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.danger,
    fontWeight: "600",
    marginTop: 6,
    marginLeft: 16,
  },
  button: {
    width: "100%",
    padding: 18,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    marginBottom: 32,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.white,
  },
  featuresRow: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
  },
  featureItem: {
    alignItems: "center",
    gap: 6,
  },
  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textLight,
  },
});
