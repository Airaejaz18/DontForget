import * as SQLite from "expo-sqlite";

// Open database
const db = SQLite.openDatabaseSync("dontforget.db");

// ─── INITIALIZE ALL TABLES ───
export const initDatabase = () => {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS user_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT DEFAULT 'Friend',
      notifications_on INTEGER DEFAULT 1,
      vibration_on INTEGER DEFAULT 1,
      sound_on INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS destinations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image_type TEXT DEFAULT 'emoji',
      image_value TEXT DEFAULT '🎒',
      color TEXT DEFAULT '#6B8FFF',
      bg_light TEXT DEFAULT '#E8EEFF',
      reminder_type TEXT DEFAULT 'daily',
      reminder_time TEXT DEFAULT '08:00',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS checklist_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      destination_id INTEGER NOT NULL,
      item_name TEXT NOT NULL,
      is_essential INTEGER DEFAULT 0,
      FOREIGN KEY (destination_id) 
        REFERENCES destinations(id) 
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS session_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      destination_id INTEGER NOT NULL,
      date TEXT DEFAULT (datetime('now')),
      total_items INTEGER DEFAULT 0,
      packed_count INTEGER DEFAULT 0,
      FOREIGN KEY (destination_id) 
        REFERENCES destinations(id)
        ON DELETE CASCADE
    );
  `);

  // Insert default user settings if not exists
  const user = db.getFirstSync("SELECT * FROM user_settings LIMIT 1");
  if (!user) {
    db.runSync("INSERT INTO user_settings (user_name) VALUES (?)", ["Friend"]);
  }
};

// ─── USER SETTINGS ───
export const getUserSettings = () => {
  return db.getFirstSync("SELECT * FROM user_settings LIMIT 1");
};

export const updateUserName = (name: string) => {
  db.runSync("UPDATE user_settings SET user_name = ?", [name]);
};

export const updateSettings = (
  notifications: number,
  vibration: number,
  sound: number,
) => {
  db.runSync(
    `UPDATE user_settings 
     SET notifications_on = ?, 
         vibration_on = ?, 
         sound_on = ?`,
    [notifications, vibration, sound],
  );
};

// ─── DESTINATIONS ───
export const getAllDestinations = () => {
  return db.getAllSync("SELECT * FROM destinations ORDER BY created_at DESC");
};

export const addDestination = (
  name: string,
  imageType: string,
  imageValue: string,
  color: string,
  bgLight: string,
  reminderType: string,
  reminderTime: string,
) => {
  const result = db.runSync(
    `INSERT INTO destinations 
     (name, image_type, image_value, color, bg_light, reminder_type, reminder_time) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, imageType, imageValue, color, bgLight, reminderType, reminderTime],
  );
  return result.lastInsertRowId;
};

export const updateDestination = (
  id: number,
  name: string,
  imageType: string,
  imageValue: string,
  color: string,
  bgLight: string,
  reminderType: string,
  reminderTime: string,
) => {
  db.runSync(
    `UPDATE destinations 
     SET name = ?, image_type = ?, image_value = ?,
         color = ?, bg_light = ?, reminder_type = ?,
         reminder_time = ?
     WHERE id = ?`,
    [
      name,
      imageType,
      imageValue,
      color,
      bgLight,
      reminderType,
      reminderTime,
      id,
    ],
  );
};

export const deleteDestination = (id: number) => {
  db.runSync("DELETE FROM destinations WHERE id = ?", [id]);
};

// ─── CHECKLIST ITEMS ───
export const getItemsByDestination = (destinationId: number) => {
  return db.getAllSync(
    `SELECT * FROM checklist_items 
     WHERE destination_id = ? 
     ORDER BY id ASC`,
    [destinationId],
  );
};

export const addChecklistItem = (
  destinationId: number,
  itemName: string,
  isEssential: boolean,
) => {
  db.runSync(
    `INSERT INTO checklist_items 
     (destination_id, item_name, is_essential) 
     VALUES (?, ?, ?)`,
    [destinationId, itemName, isEssential ? 1 : 0],
  );
};

export const updateChecklistItem = (
  id: number,
  itemName: string,
  isEssential: boolean,
) => {
  db.runSync(
    `UPDATE checklist_items 
     SET item_name = ?, is_essential = ? 
     WHERE id = ?`,
    [itemName, isEssential ? 1 : 0, id],
  );
};

export const deleteChecklistItem = (id: number) => {
  db.runSync("DELETE FROM checklist_items WHERE id = ?", [id]);
};

export const deleteAllItemsByDestination = (destinationId: number) => {
  db.runSync("DELETE FROM checklist_items WHERE destination_id = ?", [
    destinationId,
  ]);
};

// ─── SESSION LOGS ───
export const saveSessionLog = (
  destinationId: number,
  totalItems: number,
  packedCount: number,
) => {
  db.runSync(
    `INSERT INTO session_logs 
     (destination_id, total_items, packed_count) 
     VALUES (?, ?, ?)`,
    [destinationId, totalItems, packedCount],
  );
};

export const getSessionLogs = (destinationId: number) => {
  return db.getAllSync(
    `SELECT * FROM session_logs 
     WHERE destination_id = ? 
     ORDER BY date DESC`,
    [destinationId],
  );
};

export default db;
