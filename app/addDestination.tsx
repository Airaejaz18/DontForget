import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../src/constants/colors";
import {
  CARD_COLORS,
  DESTINATION_TEMPLATES,
  EMOJIS,
} from "../src/constants/data";
import { addDestination } from "../src/database/db";
import {
  scheduleDailyNotification,
  scheduleEventNotification,
} from "../src/utils/notifications";

export default function AddDestinationScreen() {
  const [name, setName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🎒");
  const [selectedColor, setSelectedColor] = useState(CARD_COLORS[0]);
  const [reminderType, setReminderType] = useState<"daily" | "event">("daily");
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [error, setError] = useState("");

  const formatTime = (date: Date) => {
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Please enter a destination name!");
      return;
    }
    //save to database
    const id = addDestination(
      name.trim(),
      "emoji",
      selectedEmoji,
      selectedColor.color,
      selectedColor.bgLight,
      reminderType,
      formatTime(reminderTime),
    );
    // Schedule notification
    const hour = reminderTime.getHours();
    const minute = reminderTime.getMinutes();

    if (reminderType === "daily") {
      await scheduleDailyNotification(
        name.trim(),
        selectedEmoji,
        hour,
        minute,
        Number(id),
      );
    } else {
      await scheduleEventNotification(
        name.trim(),
        selectedEmoji,
        reminderTime,
        Number(id),
      );
    }
    router.back();
  };

  const applyTemplate = (template: any) => {
    setName(template.name);
    setSelectedEmoji(template.emoji);
    const matchColor =
      CARD_COLORS.find((c) => c.color === template.color) || CARD_COLORS[0];
    setSelectedColor(matchColor);
    setReminderType(template.type);
    setShowTemplates(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Destination ✨</Text>
      </View>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Templates */}
        <TouchableOpacity
          style={styles.templateBtn}
          onPress={() => setShowTemplates(!showTemplates)}
        >
          <Text style={styles.templateBtnText}>✨ Choose from Templates</Text>
        </TouchableOpacity>
        {showTemplates && (
          <View style={styles.templatesContainer}>
            <Text style={styles.sectionLabel}>QUICK TEMPLATES</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {DESTINATION_TEMPLATES.map((template, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.templateCard,
                    { backgroundColor: template.bgLight },
                  ]}
                  onPress={() => applyTemplate(template)}
                >
                  <Text style={styles.templateEmoji}>{template.emoji}</Text>
                  <Text
                    style={[styles.templateName, { color: template.color }]}
                  >
                    {template.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Emoji Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CHOOSE EMOJI</Text>
          <View
            style={[
              styles.emojiPreview,
              { backgroundColor: selectedColor.bgLight },
            ]}
          >
            <Text style={styles.emojiPreviewText}>{selectedEmoji}</Text>
          </View>
          <View style={styles.emojiGrid}>
            {EMOJIS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={[
                  styles.emojiItem,
                  selectedEmoji === emoji && styles.emojiItemSelected,
                ]}
                onPress={() => setSelectedEmoji(emoji)}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Name */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DESTINATION NAME</Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            placeholder="e.g. University, Market..."
            placeholderTextColor={COLORS.textLight}
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError("");
            }}
            autoCapitalize="words"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {/* Color */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CARD COLOR</Text>
          <View style={styles.colorsRow}>
            {CARD_COLORS.map((c, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.colorCircle,
                  { backgroundColor: c.color },
                  selectedColor.color === c.color && styles.colorCircleSelected,
                ]}
                onPress={() => setSelectedColor(c)}
              />
            ))}
          </View>
        </View>

        {/* Reminder Type */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>REMINDER TYPE</Text>
          <View style={styles.typeRow}>
            {[
              { label: "⏰ Daily", val: "daily", desc: "Every day" },
              { label: "📅 Event", val: "event", desc: "One specific date" },
            ].map((t) => (
              <TouchableOpacity
                key={t.val}
                style={[
                  styles.typeCard,
                  reminderType === t.val && styles.typeCardSelected,
                ]}
                onPress={() => setReminderType(t.val as "daily" | "event")}
              >
                <Text
                  style={[
                    styles.typeLabel,
                    reminderType === t.val && styles.typeLabelSelected,
                  ]}
                >
                  {t.label}
                </Text>
                <Text
                  style={[
                    styles.typeDesc,
                    reminderType === t.val && styles.typeDescSelected,
                  ]}
                >
                  {t.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>REMINDER TIME</Text>
          <TouchableOpacity
            style={styles.timeBtn}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.timeIcon}>🕐</Text>
            <Text style={styles.timeText}>{formatTime(reminderTime)}</Text>
            <Text style={styles.timeEdit}>Tap to change</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={reminderTime}
              mode="time"
              is24Hour={true}
              onChange={(event, date) => {
                setShowTimePicker(Platform.OS === "ios");
                if (date) setReminderTime(date);
              }}
            />
          )}
        </View>

        {/* Save */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>Create Destination 🎉</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.border,
  },
  backText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 10,
  },
  headerTitle: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  scroll: { flex: 1, padding: 16 },
  templateBtn: {
    padding: 14,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  templateBtnText: { fontSize: 14, fontWeight: "800", color: COLORS.primary },
  templatesContainer: { marginBottom: 16 },
  templateCard: {
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginRight: 10,
    minWidth: 90,
  },
  templateEmoji: { fontSize: 32, marginBottom: 6 },
  templateName: { fontSize: 12, fontWeight: "800" },
  section: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textLight,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  emojiPreview: {
    width: 90,
    height: 90,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emojiPreviewText: { fontSize: 42 },
  emojiGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  emojiItem: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  emojiItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  emojiText: { fontSize: 22 },
  input: {
    padding: 16,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.border,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  inputError: { borderColor: COLORS.danger },
  errorText: {
    fontSize: 12,
    color: COLORS.danger,
    fontWeight: "600",
    marginTop: 6,
    marginLeft: 16,
  },
  colorsRow: { flexDirection: "row", gap: 12 },
  colorCircle: { width: 40, height: 40, borderRadius: 20 },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: COLORS.white,
    elevation: 4,
  },
  typeRow: { flexDirection: "row", gap: 12 },
  typeCard: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  typeCardSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  typeLabelSelected: { color: COLORS.white },
  typeDesc: { fontSize: 11, fontWeight: "600", color: COLORS.textLight },
  typeDescSelected: { color: "rgba(255,255,255,0.8)" },
  timeBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 12,
  },
  timeIcon: { fontSize: 22 },
  timeText: { fontSize: 20, fontWeight: "800", color: COLORS.text, flex: 1 },
  timeEdit: { fontSize: 12, fontWeight: "600", color: COLORS.textLight },
  saveBtn: {
    padding: 18,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    elevation: 8,
  },
  saveBtnText: { fontSize: 16, fontWeight: "800", color: COLORS.white },
});
