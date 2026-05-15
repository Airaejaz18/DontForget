# Don't Forget!

A smart checklist reminder app that acts as your **digital mom** —
reminding you to pack everything before you leave!

---

## 📱 About The App

Don't Forget! is a React Native mobile application built for
Android. It helps users create destination-based checklists
and get reminded before leaving. The app features a unique
"Mom Mode" that goes through each item one by one,
scolding you for essential items you haven't packed!

---

## Features

- Home Screen — View all your destinations at a glance
- Add Destinations — Create custom destinations with emoji or real photos
- Checklist — Add items to each destination, mark as essential
- Mom Mode — One-by-one item check with animated mom reactions
- Smart Notifications— Get reminded before you leave
- Haptic Feedback — Phone vibrates for essential items
- Custom Images — Add real photos to destination cards
- Edit & Delete — Full control over destinations and items
- Settings — Customize your experience, name and image

---

## Tech Stack

Technologies used:
React Native: Mobile app framework
Expo SDK 53: Development platform
Expo Router: File-based navigation
SQLite (expo-sqlite): Local database
expo-notifications: Push notifications
expo-haptics: Vibration feedback
expo-image-picker: Gallery access
AsyncStorage: Settings storage

---

## Project Structure

DontForget/
├── app/
│ ├── \_layout.tsx # Main layout & DB init
│ ├── index.tsx # Splash screen
│ ├── onboarding.tsx # First time setup
│ ├── home.tsx # Home screen
│ ├── checklist.tsx # Checklist screen
│ ├── mommode.tsx # Mom Mode screen
│ ├── addDestination.tsx # Add/Edit destination
│ └── settings.tsx # Settings screen
├── src/
│ ├── constants/
│ │ ├── colors.ts # App color palette
│ │ └── data.ts # Templates & constants
│ ├── database/
│ │ └── db.ts # SQLite operations
│ └── utils/
│ ├── notifications.ts # Notification helpers
│ └── storage.ts # AsyncStorage helpers
└── assets/ # Images & fonts

---

## Database Schema

```sql
-- User settings
user_settings (id, user_name, notifications_on, vibration_on, sound_on)

-- Destinations
destinations (id, name, image_type, image_value, color, bg_light, reminder_type, reminder_time, created_at)

-- Checklist items
checklist_items (id, destination_id, item_name, is_essential)

-- Session logs
session_logs (id, destination_id, date, total_items, packed_count)

How to Run
Prerequisites
Node.js v18+
Expo Go app on Android phone
Installation
# Clone the repository
git clone https://github.com/Sumaira-Malik18/DontForget.git

# Go into project folder
cd DontForget

# Install dependencies
npm install

# Start the app
npx expo start

1. Install Expo Go from Play Store
2. Scan QR code shown in terminal
3. App opens on your phone!

Download APK
Download the latest APK from the Releases section.

Screenshots:
<table>
  <tr>
    <td><img src="assets/images/screenshots/home screen.jpeg" width="200"/></td>
    <td><img src="assets/images/screenshots/Create destination screen.jpeg" width="200"/></td>
    <td><img src="assets/images/screenshots/settings screen.jpeg" width="200"/></td>
  </tr>
  <tr>
    <td>Home Screen</td>
    <td>Add destination Screen</td>
    <td>Settings Screen</td>
  </tr>
  <tr>
    <td><img src="assets/images/screenshots/checklist screen.jpeg" width="200"/></td>
    <td><img src="assets/images/screenshots/mommode screen.jpeg" width="200"/></td>
  </tr>
  <tr>
    <td>Checklist Screen</td>
    <td>AMommode Screen</td>
  </tr>
</table>



Developer
Sumaira Malik
Semester Project — 2026
 License
This project is built for educational purposes as a semester project.
```
