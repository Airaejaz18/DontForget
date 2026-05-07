import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { initDatabase } from "../src/database/db";
import { requestNotificationPermission } from "../src/utils/notifications";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS !== "web") {
      initDatabase();
      requestNotificationPermission();
    }
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="home" />
        <Stack.Screen name="checklist" />
        <Stack.Screen name="mommode" />
        <Stack.Screen name="addDestination" />
        <Stack.Screen name="settings" />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
