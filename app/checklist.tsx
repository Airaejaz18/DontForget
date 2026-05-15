import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../src/constants/colors";
import {
  addChecklistItem,
  deleteChecklistItem,
  deleteDestination,
  getItemsByDestination,
} from "../src/database/db";

export default function ChecklistScreen() {
  const {
    destinationId,
    destinationName,
    destinationColor,
    destinationBgLight,
    destinationEmoji,
    destinationTime,
    destinationType,
  } = useLocalSearchParams();

  const [items, setItems] = useState<any[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [isEssential, setIsEssential] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, []),
  );

  const loadItems = () => {
    const data = getItemsByDestination(Number(destinationId)) as any[];
    setItems(data);
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    addChecklistItem(Number(destinationId), newItemName.trim(), isEssential);
    setNewItemName("");
    setIsEssential(false);
    setShowAddItem(false);
    loadItems();
  };

  const handleDeleteItem = (itemId: number) => {
    Alert.alert("Delete Item", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteChecklistItem(itemId);
          loadItems();
        },
      },
    ]);
  };

  const handleDeleteDestination = () => {
    Alert.alert(
      "Delete Destination",
      `Delete ${destinationName} and all its items?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteDestination(Number(destinationId));
            router.back();
          },
        },
      ],
    );
  };

  const checkedCount = items.filter((i) => i.checked).length;

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemRow}>
      <View style={styles.itemLeft}>
        <View style={styles.checkbox} />
        <View>
          <Text style={styles.itemName}>{item.item_name}</Text>
          {item.is_essential === 1 && (
            <Text style={styles.essentialTag}>⚡ ESSENTIAL</Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => handleDeleteItem(item.id)}
        style={styles.deleteBtn}
      >
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: (destinationColor as string) || COLORS.primary },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}> Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View
            style={[
              styles.headerImage,
              { backgroundColor: "rgba(255,255,255,0.2)" },
            ]}
          >
            {destinationEmoji && String(destinationEmoji).startsWith("file") ? (
              <Image
                source={{ uri: String(destinationEmoji) }}
                style={{ width: 60, height: 60, borderRadius: 18 }}
              />
            ) : (
              <Text style={styles.headerEmoji}>{destinationEmoji || "🎒"}</Text>
            )}
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{destinationName}</Text>
            <Text style={styles.headerMeta}>
              ⏰ {destinationTime} ·{" "}
              {destinationType === "daily" ? "Daily" : "One-time"}
            </Text>
          </View>
          <TouchableOpacity onPress={handleDeleteDestination}>
            <Text style={styles.deleteDestBtn}>🗑️</Text>
          </TouchableOpacity>
        </View>
        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>{items.length} items total</Text>
            <Text style={styles.progressText}>
              {items.filter((i) => i.is_essential === 1).length} essential
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width:
                    items.length > 0
                      ? `${(checkedCount / items.length) * 100}%`
                      : "0%",
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Items List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyText}>No items yet!</Text>
            <Text style={styles.emptySubText}>
              Add items you don't want to forget
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.addItemContainer}>
            {showAddItem ? (
              <View style={styles.addItemForm}>
                <TextInput
                  style={styles.addItemInput}
                  placeholder="Item name..."
                  placeholderTextColor={COLORS.textLight}
                  value={newItemName}
                  onChangeText={setNewItemName}
                  autoFocus
                />
                <TouchableOpacity
                  style={styles.essentialToggle}
                  onPress={() => setIsEssential(!isEssential)}
                >
                  <View
                    style={[
                      styles.essentialCheck,
                      isEssential && styles.essentialCheckActive,
                    ]}
                  />
                  <Text style={styles.essentialToggleText}>
                    Mark as Essential ⚡
                  </Text>
                </TouchableOpacity>
                <View style={styles.addItemButtons}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => {
                      setShowAddItem(false);
                      setNewItemName("");
                    }}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={handleAddItem}
                  >
                    <Text style={styles.confirmBtnText}>Add Item</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addItemBtn}
                onPress={() => setShowAddItem(true)}
              >
                <Text style={styles.addItemBtnText}>➕</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* Start Mom Mode Button */}
      {items.length > 0 && (
        <TouchableOpacity
          style={[
            styles.momModeBtn,
            { backgroundColor: (destinationColor as string) || COLORS.primary },
          ]}
          onPress={() =>
            router.push({
              pathname: "/mommode",
              params: {
                destinationId,
                destinationName,
                destinationColor,
                destinationEmoji,
              },
            })
          }
          activeOpacity={0.85}
        >
          <Text style={styles.momModeBtnText}>Start Mom Mode</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backBtn: { marginBottom: 12 },
  backText: { fontSize: 13, fontWeight: "800", color: "rgba(255,255,255,0.9)" },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  headerImage: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerEmoji: { fontSize: 30 },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 22, fontWeight: "800", color: COLORS.white },
  headerMeta: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
  },
  deleteDestBtn: { fontSize: 22 },
  progressContainer: { gap: 6 },
  progressInfo: { flexDirection: "row", justifyContent: "space-between" },
  progressText: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.85)",
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 4,
  },
  listContent: { padding: 16, paddingBottom: 100 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    elevation: 2,
  },
  itemLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: COLORS.border,
  },
  itemName: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  essentialTag: {
    fontSize: 10,
    color: COLORS.accent,
    fontWeight: "800",
    marginTop: 2,
  },
  deleteBtn: { padding: 4 },
  deleteIcon: { fontSize: 18 },
  emptyContainer: { alignItems: "center", paddingVertical: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 6,
  },
  emptySubText: { fontSize: 14, color: COLORS.textLight, fontWeight: "600" },
  addItemContainer: { marginTop: 8 },
  addItemForm: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  addItemInput: {
    padding: 12,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    backgroundColor: COLORS.bg,
    marginBottom: 12,
  },
  essentialToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  essentialCheck: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  essentialCheckActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  essentialToggleText: { fontSize: 13, fontWeight: "700", color: COLORS.text },
  addItemButtons: { flexDirection: "row", gap: 10 },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 50,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  cancelBtnText: { fontSize: 14, fontWeight: "700", color: COLORS.textLight },
  confirmBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  confirmBtnText: { fontSize: 14, fontWeight: "700", color: COLORS.white },
  addItemBtn: {
    padding: 14,
    borderRadius: 50,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    alignItems: "center",
  },
  addItemBtnText: { fontSize: 14, fontWeight: "700", color: COLORS.textLight },
  momModeBtn: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    padding: 18,
    borderRadius: 50,
    alignItems: "center",
    elevation: 8,
  },
  momModeBtnText: { fontSize: 16, fontWeight: "800", color: COLORS.white },
});
