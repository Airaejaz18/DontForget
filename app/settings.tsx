import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import COLORS from "../src/constants/colors";
import {
  getUserSettings,
  updateSettings,
  updateUserName,
} from "../src/database/db";

export default function SettingsScreen() {
  const [userName, setUserName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [notifications, setNotifications] = useState(1);
  const [vibration, setVibration] = useState(1);
  const [sound, setSound] = useState(1);

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, []),
  );

  const loadSettings = () => {
    const user = getUserSettings() as any;
    if (user) {
      setUserName(user.user_name);
      setNewName(user.user_name);
      setNotifications(user.notifications_on);
      setVibration(user.vibration_on);
      setSound(user.sound_on);
    }
  };

  const handleSaveName = () => {
    if (!newName.trim() || newName.trim().length < 2) return;
    updateUserName(newName.trim());
    setUserName(newName.trim());
    setEditingName(false);
  };

  const handleToggle = (type: string) => {
    let n = notifications,
      v = vibration,
      s = sound;
    if (type === "notifications") n = n === 1 ? 0 : 1;
    if (type === "vibration") v = v === 1 ? 0 : 1;
    if (type === "sound") s = s === 1 ? 0 : 1;
    setNotifications(n);
    setVibration(v);
    setSound(s);
    updateSettings(n, v, s);
  };

  const Toggle = ({
    value,
    onToggle,
  }: {
    value: number;
    onToggle: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.toggle, value === 1 && styles.toggleActive]}
      onPress={onToggle}
    >
      <View
        style={[styles.toggleThumb, value === 1 && styles.toggleThumbActive]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings ⚙️</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileMom}>
            <Text style={styles.profileMomEmoji}>👩‍👧</Text>
          </View>
          <View style={styles.profileInfo}>
            {editingName ? (
              <View style={styles.editNameRow}>
                <TextInput
                  style={styles.nameInput}
                  value={newName}
                  onChangeText={setNewName}
                  autoFocus
                  autoCapitalize="words"
                />
                <TouchableOpacity
                  style={styles.saveNameBtn}
                  onPress={handleSaveName}
                >
                  <Text style={styles.saveNameBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setEditingName(true)}>
                <Text style={styles.profileName}>{userName} ✏️</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.profileSub}>
              Your mom is always watching 👀
            </Text>
          </View>
        </View>

        {/* Settings Options */}
        <Text style={styles.sectionLabel}>PREFERENCES</Text>

        {[
          {
            icon: "🔔",
            label: "Notifications",
            key: "notifications",
            value: notifications,
          },
          {
            icon: "📳",
            label: "Vibration on Essential",
            key: "vibration",
            value: vibration,
          },
          { icon: "🔊", label: "Sound on Check", key: "sound", value: sound },
        ].map((item) => (
          <View key={item.key} style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>{item.icon}</Text>
              </View>
              <Text style={styles.settingLabel}>{item.label}</Text>
            </View>
            <Toggle
              value={item.value}
              onToggle={() => handleToggle(item.key)}
            />
          </View>
        ))}

        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>APP INFO</Text>

        {[
          { icon: "📱", label: "Version", value: "1.0.0" },
          { icon: "👩‍💻", label: "Developer", value: "Your Name" },
          { icon: "🎓", label: "Project", value: "Final Semester" },
        ].map((item, i) => (
          <View key={i} style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>{item.icon}</Text>
              </View>
              <Text style={styles.settingLabel}>{item.label}</Text>
            </View>
            <Text style={styles.settingValue}>{item.value}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't Forget! v1.0.0 💙</Text>
          <Text style={styles.footerText}>Made with ❤️ for Final Project</Text>
        </View>

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
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    gap: 14,
  },
  profileMom: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  profileMomEmoji: { fontSize: 36 },
  profileInfo: { flex: 1 },
  profileName: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  profileSub: { fontSize: 12, fontWeight: "600", color: COLORS.textLight },
  editNameRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  nameInput: {
    flex: 1,
    padding: 10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.primary,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  saveNameBtn: {
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
  },
  saveNameBtnText: { fontSize: 13, fontWeight: "800", color: COLORS.white },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textLight,
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  settingEmoji: { fontSize: 20 },
  settingLabel: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  settingValue: { fontSize: 13, fontWeight: "600", color: COLORS.textLight },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.border,
    justifyContent: "center",
    padding: 2,
  },
  toggleActive: { backgroundColor: COLORS.primary },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
  },
  toggleThumbActive: { alignSelf: "flex-end" },
  footer: { alignItems: "center", marginTop: 24, gap: 4 },
  footerText: { fontSize: 12, fontWeight: "600", color: COLORS.textLight },
});
