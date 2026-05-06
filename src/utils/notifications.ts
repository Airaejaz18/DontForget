import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure how notifications appear
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request permission
export async function requestNotificationPermission() {
  if (!Device.isDevice) return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#6B8FFF",
    });
  }

  return true;
}

// Schedule daily notification
export async function scheduleDailyNotification(
  destinationName: string,
  emoji: string,
  hour: number,
  minute: number,
  destinationId: number,
) {
  await cancelNotification(destinationId);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `${emoji} Don't Forget!`,
      body: `You're leaving for ${destinationName} soon — did you pack everything?`,
      sound: true,
      data: { destinationId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour,
      minute,
      repeats: true,
    },
  });

  return id;
}

// Schedule one-time event notification
export async function scheduleEventNotification(
  destinationName: string,
  emoji: string,
  date: Date,
  destinationId: number,
) {
  await cancelNotification(destinationId);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `${emoji} Don't Forget!`,
      body: `Time to pack for ${destinationName}! Open the app to check your list.`,
      sound: true,
      data: { destinationId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
    },
  });

  return id;
}

// Cancel notification for a destination
export async function cancelNotification(destinationId: number) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notification of scheduled) {
    if (notification.content.data?.destinationId === destinationId) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier,
      );
    }
  }
}

// Cancel ALL notifications
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
