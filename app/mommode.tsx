import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import COLORS from "../src/constants/colors";
import { MOM_PRAISE, MOM_SCOLDS } from "../src/constants/data";
import { getItemsByDestination, saveSessionLog } from "../src/database/db";

export default function MomModeScreen() {
  const { destinationId, destinationName, destinationColor, destinationEmoji } =
    useLocalSearchParams();

  const [items, setItems] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [momMood, setMomMood] = useState<
    "idle" | "happy" | "angry" | "celebrate" | "worried"
  >("idle");
  const [bubbleText, setBubbleText] = useState("");
  const [isScold, setIsScold] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [packedItems, setPackedItems] = useState<any[]>([]);
  const [missedItems, setMissedItems] = useState<any[]>([]);

  useEffect(() => {
    const data = getItemsByDestination(Number(destinationId)) as any[];
    const freshItems = data.map((i) => ({
      ...i,
      checked: false,
      skipped: false,
    }));
    setItems(freshItems);
    if (freshItems.length > 0) {
      setBubbleText(`Did you pack your ${freshItems[0].item_name}?`);
    }
  }, []);

  const triggerVibration = () => Vibration.vibrate(400);

  const handleNotYet = () => {
    const current = items[currentIdx];
    if (current.is_essential === 1) {
      const msg = MOM_SCOLDS[Math.floor(Math.random() * MOM_SCOLDS.length)];
      setMomMood("angry");
      setBubbleText(msg);
      setIsScold(true);
      triggerVibration();
    } else {
      setMomMood("worried");
      setBubbleText("Okay... but don't forget next time!");
      const updated = items.map((it, i) =>
        i === currentIdx ? { ...it, skipped: true } : it,
      );
      setItems(updated);
      setTimeout(() => moveNext(updated), 800);
    }
  };

  const handleYes = () => {
    setIsScold(false);
    setMomMood("happy");
    const praise = MOM_PRAISE[Math.floor(Math.random() * MOM_PRAISE.length)];
    setBubbleText(praise);
    const updated = items.map((it, i) =>
      i === currentIdx ? { ...it, checked: true } : it,
    );
    setItems(updated);
    setTimeout(() => moveNext(updated), 700);
  };

  const handleSkipEssential = () => {
    setIsScold(false);
    setMomMood("worried");
    const updated = items.map((it, i) =>
      i === currentIdx ? { ...it, skipped: true } : it,
    );
    setItems(updated);
    setTimeout(() => moveNext(updated), 400);
  };

  const moveNext = (updatedItems: any[]) => {
    const next = currentIdx + 1;
    if (next >= updatedItems.length) {
      const missed = updatedItems.filter((i) => !i.checked);
      const packed = updatedItems.filter((i) => i.checked);
      setPackedItems(packed);
      setMissedItems(missed);
      saveSessionLog(Number(destinationId), updatedItems.length, packed.length);
      if (missed.length === 0) {
        setMomMood("celebrate");
        setBubbleText("You packed EVERYTHING! I'm so proud! 🎉");
        setTimeout(() => setShowSuccess(true), 800);
      } else {
        setMomMood("angry");
        setBubbleText("You missed some things!");
        setTimeout(() => setShowSummary(true), 600);
        triggerVibration();
      }
    } else {
      setCurrentIdx(next);
      setMomMood("idle");
      setBubbleText(`Did you pack your ${updatedItems[next].item_name}?`);
    }
  };

  const getMomFace = () => {
    switch (momMood) {
      case "happy":
        return "😊";
      case "angry":
        return "😤";
      case "celebrate":
        return "🥳";
      case "worried":
        return "😟";
      default:
        return "👩‍👧";
    }
  };

  const bgColor = (destinationColor as string) || COLORS.primary;
  const currentItem = items[currentIdx];

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="light-content" />

      {/* Back button */}
      {!showSuccess && !showSummary && (
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      )}

      {/* Confetti effect on success */}
      {showSuccess && (
        <View style={styles.confettiContainer}>
          {["🎉", "⭐", "💕", "✨", "🌟", "🎊"].map((emoji, i) => (
            <Text
              key={i}
              style={[
                styles.confettiEmoji,
                {
                  left: `${10 + i * 15}%`,
                  top: `${5 + (i % 3) * 8}%`,
                },
              ]}
            >
              {emoji}
            </Text>
          ))}
        </View>
      )}

      {/* SUCCESS SCREEN */}
      {showSuccess && (
        <View style={styles.centerContent}>
          <Text style={styles.bigMomFace}>🥳</Text>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>
              You packed EVERYTHING!{"\n"}I'm so proud of you! 🎉
            </Text>
          </View>
          <Text style={styles.successTitle}>You're All Set!</Text>
          <Text style={styles.successSubtitle}>
            Have an amazing time at {destinationName}! 💕
          </Text>
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => router.push("/home")}
          >
            <Text style={styles.homeBtnText}>🏠 Back Home</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* SUMMARY SCREEN */}
      {showSummary && !showSuccess && (
        <ScrollView contentContainerStyle={styles.summaryContent}>
          <Text style={styles.bigMomFace}>😤</Text>
          <View style={[styles.bubble, { borderColor: COLORS.accent }]}>
            <Text style={styles.bubbleText}>
              You missed some things!{"\n"}Go pack them now!
            </Text>
          </View>
          {packedItems.length > 0 && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryCardTitle}>✅ PACKED</Text>
              {packedItems.map((item) => (
                <Text key={item.id} style={styles.summaryItem}>
                  ✓ {item.item_name}
                </Text>
              ))}
            </View>
          )}
          {missedItems.length > 0 && (
            <View style={[styles.summaryCard, styles.summaryCardMissed]}>
              <Text style={styles.summaryCardTitle}>❌ NOT PACKED</Text>
              {missedItems.map((item) => (
                <Text
                  key={item.id}
                  style={[
                    styles.summaryItem,
                    item.is_essential === 1 && styles.summaryItemEssential,
                  ]}
                >
                  {item.is_essential === 1 ? "⚡" : "·"} {item.item_name}
                  {item.is_essential === 1 ? " (Essential!)" : ""}
                </Text>
              ))}
            </View>
          )}
          <View style={styles.summaryButtons}>
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={() => router.push("/home")}
            >
              <Text style={styles.skipBtnText}>Skip anyway</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.packBtn}
              onPress={() => {
                setShowSummary(false);
                setCurrentIdx(0);
                setMomMood("idle");
                setItems(
                  items.map((i) => ({ ...i, checked: false, skipped: false })),
                );
                setBubbleText(`Did you pack your ${items[0]?.item_name}?`);
              }}
            >
              <Text style={styles.packBtnText}>🎒 Go Pack Them!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* NORMAL MOM MODE */}
      {!showSuccess && !showSummary && currentItem && (
        <View style={styles.centerContent}>
          {/* Counter */}
          <Text style={styles.counter}>
            {currentIdx + 1} of {items.length}
          </Text>

          {/* Speech Bubble */}
          <View style={[styles.bubble, isScold && styles.bubbleAngry]}>
            <Text
              style={[styles.bubbleText, isScold && styles.bubbleTextAngry]}
            >
              {bubbleText}
            </Text>
          </View>

          {/* Mom Face */}
          <Text style={styles.bigMomFace}>{getMomFace()}</Text>

          {/* Item Card */}
          {!isScold && (
            <View style={styles.itemCard}>
              <Text style={styles.itemCardLabel}>DID YOU PACK...</Text>
              <Text style={styles.itemCardName}>{currentItem.item_name}</Text>
              {currentItem.is_essential === 1 && (
                <Text style={styles.itemCardEssential}>
                  ⚡ ESSENTIAL — don't skip!
                </Text>
              )}
            </View>
          )}

          {/* Scold Card */}
          {isScold && (
            <View style={[styles.itemCard, styles.itemCardAngry]}>
              <Text style={styles.scoldEmoji}>🚨</Text>
              <Text style={styles.scoldItemName}>{currentItem.item_name}</Text>
              <Text style={styles.scoldSubText}>Pack it first!</Text>
            </View>
          )}

          {/* Buttons */}
          {isScold ? (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.yesBtn} onPress={handleYes}>
                <Text style={[styles.yesBtnText, { color: bgColor }]}>
                  ✅ Okay, I packed it!
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSkipEssential}>
                <Text style={styles.skipEssentialText}>
                  ⏭️ Skip anyway (not recommended)
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.notYetBtn} onPress={handleNotYet}>
                <Text style={styles.notYetBtnText}>❌ Not Yet</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.yesBtn} onPress={handleYes}>
                <Text style={[styles.yesBtnText, { color: bgColor }]}>
                  ✅ Yes!
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Progress Dots */}
          <View style={styles.dotsContainer}>
            {items.map((item, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === currentIdx && styles.dotActive,
                  i < currentIdx &&
                    (item.checked ? styles.dotPacked : styles.dotMissed),
                ]}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { position: "absolute", top: 50, left: 20, zIndex: 10 },
  backText: {
    fontSize: 13,
    fontWeight: "800",
    color: "rgba(255,255,255,0.9)",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 50,
  },
  confettiContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  confettiEmoji: { position: "absolute", fontSize: 24 },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    paddingTop: 80,
  },
  summaryContent: {
    alignItems: "center",
    padding: 24,
    paddingTop: 80,
  },
  counter: {
    fontSize: 12,
    fontWeight: "800",
    color: "rgba(255,255,255,0.78)",
    letterSpacing: 1,
    marginBottom: 12,
  },
  bubble: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 14,
    maxWidth: 280,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    elevation: 4,
  },
  bubbleAngry: { borderColor: COLORS.accent },
  bubbleText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 20,
  },
  bubbleTextAngry: { color: COLORS.accent },
  bigMomFace: { fontSize: 80, marginBottom: 16 },
  itemCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 24,
    padding: 22,
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
    elevation: 4,
  },
  itemCardAngry: { borderWidth: 2.5, borderColor: COLORS.accent },
  itemCardLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textLight,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  itemCardName: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 6,
  },
  itemCardEssential: {
    fontSize: 11,
    color: COLORS.accent,
    fontWeight: "800",
  },
  scoldEmoji: { fontSize: 32, marginBottom: 8 },
  scoldItemName: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 4,
  },
  scoldSubText: { fontSize: 13, color: COLORS.textLight, fontWeight: "600" },
  buttonsRow: { flexDirection: "row", gap: 12, width: "100%" },
  buttonsContainer: { width: "100%", gap: 10 },
  notYetBtn: {
    flex: 1,
    padding: 17,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
  },
  notYetBtnText: { fontSize: 15, fontWeight: "800", color: COLORS.white },
  yesBtn: {
    flex: 1,
    padding: 17,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    alignItems: "center",
    elevation: 4,
  },
  yesBtnText: { fontSize: 15, fontWeight: "800" },
  skipEssentialText: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.6)",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  dotsContainer: { flexDirection: "row", gap: 6, marginTop: 22 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dotActive: { width: 24, backgroundColor: COLORS.white },
  dotPacked: { backgroundColor: "rgba(255,255,255,0.88)" },
  dotMissed: { backgroundColor: "rgba(255,155,181,0.65)" },
  successTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.white,
    marginTop: 16,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.88)",
    textAlign: "center",
    marginBottom: 32,
  },
  homeBtn: {
    padding: 18,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    paddingHorizontal: 44,
    elevation: 4,
  },
  homeBtnText: { fontSize: 15, fontWeight: "800", color: COLORS.mint },
  summaryCard: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  summaryCardMissed: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  summaryCardTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  summaryItem: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: 4,
  },
  summaryItemEssential: { color: COLORS.yellow, fontWeight: "800" },
  summaryButtons: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginTop: 8,
  },
  skipBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.45)",
    alignItems: "center",
  },
  skipBtnText: { fontSize: 13, fontWeight: "700", color: COLORS.white },
  packBtn: {
    flex: 1.5,
    padding: 14,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  packBtnText: { fontSize: 13, fontWeight: "800", color: COLORS.accent },
});
