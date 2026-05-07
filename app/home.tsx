import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../src/constants/colors";
import { getAllDestinations, getUserSettings } from "../src/database/db";
import { getProfilePhoto } from "../src/utils/storage";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [userName, setUserName] = useState("Friend");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  // Reload data every time screen is focused
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const loadData = async () => {
    const user = getUserSettings() as any;
    if (user) setUserName(user.user_name);
    const dests = getAllDestinations() as any[];
    setDestinations(dests);
    const photo = await getProfilePhoto();
    setProfilePhoto(photo);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const renderDestination = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/checklist" as any,
          params: {
            destinationId: item.id,
            destinationName: item.name,
            destinationColor: item.color,
            destinationBgLight: item.bg_light,
            destinationEmoji: item.image_value,
            destinationImageType: item.image_type,
            destinationTime: item.reminder_time,
            destinationType: item.reminder_type,
          },
        })
      }
      onLongPress={() =>
        router.push({
          pathname: "/addDestination",
          params: {
            editMode: "true",
            destinationId: item.id,
            destinationName: item.name,
            destinationColor: item.color,
            destinationBgLight: item.bg_light,
            destinationEmoji: item.image_value,
            destinationImageType: item.image_type,
            destinationTime: item.reminder_time,
            destinationType: item.reminder_type,
          },
        })
      }
      activeOpacity={0.85}
      delayLongPress={600}
    >
      {/* Square Image Box */}
      <View style={[styles.cardImage, { backgroundColor: item.bg_light }]}>
        {item.image_type === "custom" && item.image_value ? (
          // show actual image
          <Image
            source={{ uri: item.image_value }}
            style={{ width: 90, height: 90 }}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.cardEmoji}>{item.image_value}</Text>
        )}
        {/* Color dot */}
        <View style={[styles.colorDot, { backgroundColor: item.color }]} />
      </View>

      {/* Card Info */}
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardMeta}>
          {item.reminder_type === "daily" ? "⏰ Daily" : "📅 Event"}
          {" · "}
          {(() => {
            // Convert 24hr to 12hr for display
            const [h, m] = item.reminder_time.split(":");
            const hour = parseInt(h);
            const ampm = hour >= 12 ? "PM" : "AM";
            const hour12 = hour % 12 || 12;
            return `${hour12}:${m} ${ampm}`;
          })()}
        </Text>
        <View style={styles.cardTags}>
          <View style={[styles.tag, { backgroundColor: item.bg_light }]}>
            <Text style={[styles.tagText, { color: item.color }]}>
              {item.reminder_type === "daily" ? "Daily" : "One-time"}
            </Text>
          </View>
        </View>
      </View>

      {/* Arrow */}
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {/* Mom character */}
      <View style={styles.emptyMomCircle}>
        <Text style={styles.emptyMomEmoji}>👩‍👧</Text>
      </View>

      {/* Speech bubble */}
      <View style={styles.emptyBubbleWrapper}>
        <View style={styles.emptyBubble}>
          <Text style={styles.emptyBubbleText}>
            Add your first destination!{"\n"}
            I'll help you remember everything 💕
          </Text>
        </View>
        <View style={styles.emptyBubbleTail} />
      </View>

      <Text style={styles.emptyTitle}>No Destinations Yet!</Text>
      <Text style={styles.emptySubtitle}>
        Tap the button below to add your{"\n"}
        first destination 🎒
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Profile Photo */}
          <TouchableOpacity
            style={styles.profileCircle}
            onPress={() => router.push("/settings")}
          >
            {profilePhoto ? (
              <Image
                source={{ uri: profilePhoto }}
                style={styles.profileImage}
              />
            ) : (
              <Text style={styles.profileEmoji}>👩‍👧</Text>
            )}
          </TouchableOpacity>
          {/* Greeting */}
          <View>
            <Text style={styles.greeting}>{getGreeting()}! ☀️</Text>
            <Text style={styles.userName}>{userName} 💙</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => router.push("/settings")}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Banner */}
      {destinations.length > 0 && (
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Text style={styles.bannerEmoji}>💬</Text>
          </View>
          <Text style={styles.bannerText}>
            You have{" "}
            <Text style={styles.bannerHighlight}>
              {destinations.length} destination
              {destinations.length > 1 ? "s" : ""}
            </Text>{" "}
            set up. Stay organized! 🌟
          </Text>
        </View>
      )}

      {/* Destinations List */}
      <FlatList
        data={destinations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDestination}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContent,
          destinations.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          destinations.length > 0 ? (
            <Text style={styles.sectionTitle}>MY DESTINATIONS</Text>
          ) : null
        }
      />

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/addDestination" as any)}
        activeOpacity={0.85}
      >
        <Text style={styles.addButtonText}>➕ Add Destination</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profileEmoji: {
    fontSize: 26,
  },
  greeting: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textLight,
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.text,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsIcon: {
    fontSize: 22,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    padding: 12,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    gap: 10,
  },
  bannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerEmoji: {
    fontSize: 18,
  },
  bannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.text,
    lineHeight: 18,
  },
  bannerHighlight: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textLight,
    letterSpacing: 1,
    marginBottom: 12,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardImage: {
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1.5,
    borderRightColor: COLORS.border,
    position: "relative",
  },
  cardEmoji: {
    fontSize: 38,
  },
  colorDot: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cardInfo: {
    flex: 1,
    padding: 16,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "600",
    marginBottom: 8,
  },
  cardTags: {
    flexDirection: "row",
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "800",
  },
  arrow: {
    fontSize: 22,
    color: COLORS.textLight,
    paddingRight: 14,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyMomCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  emptyMomEmoji: {
    fontSize: 72,
  },
  emptyBubbleWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  emptyBubble: {
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
  emptyBubbleText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyBubbleTail: {
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
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 22,
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    padding: 18,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.white,
  },
});
