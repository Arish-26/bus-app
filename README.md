# 🚌 Shanmuga Industries Arts & Science College — Campus Bus Tracker

> A modern, student-centric mobile bus directory and transport management app built for **Shanmuga Industries Arts & Science College (Tiruvannamalai, Tamil Nadu)** using **Expo**, **React Native**, and **TypeScript**.

---

## 🎯 Problem Statement & Purpose

### The Problem
In large educational institutions like Shanmuga Industries Arts & Science College, hundreds of students commute daily from various towns across Tiruvannamalai District (such as *Polur, Chengam, Kilpennathur, Arani, Vandavasi, Gingee, Villupuram*, etc.). 

Students often face challenges:
- **Misplaced Contact Information**: Not knowing which bus goes to their locality or how to contact the driver in case of delays or emergencies.
- **Outdated Notice Boards**: Physical transport notices are difficult to update quickly when bus drivers, contact numbers, or routes change.
- **Unauthorized Data Mutations**: Open forms risk accidental deletion or modification of transport records by non-admin users.

### The Solution
This app provides a **role-segmented mobile solution**:
1. **For Students**: A read-only, instant-search directory allowing students to look up bus numbers, route locations, driver details, and tap a single button to call the driver directly.
2. **For Transport Admins**: A secure control panel to update driver names, phone numbers, route locations, upload custom bus photos, add new buses, or remove obsolete records.

---

## 🌟 Key Features

### 🎓 Student Features
- **Comprehensive Bus Directory**: Browse all 50 campus buses assigned to Tiruvannamalai and surrounding regional routes.
- **Instant Search & Filter**: Search buses instantly by bus number, driver name, or route destination.
- **Status Indicators**: Visual green dots indicate buses with updated details on file.
- **One-Tap Direct Driver Dialing**: Tap **📞 Call Driver** to instantly place a call to the assigned bus driver.
- **Secure Student Authentication**: Restricted access requiring a valid college Roll Number in the range `111623104001` – `111623104040` (no password required).
- **Read-Only Protection**: Students cannot accidentally edit, corrupt, or delete bus information.

### 🛠️ Transport Admin Features
- **Authorized Admin Access**: Login using the secret admin code (`batman`).
- **Edit Bus Details**: Update driver names, phone numbers, and route destinations.
- **Bus Photo Uploads**: Upload and compress custom bus photos using `expo-image-picker`.
- **Add New Buses**: Dynamically add new bus entries to the campus transport network.
- **Remove Buses**: Delete outdated bus entries with confirmation dialogs.
- **Cross-Platform Session Management**: Persistent login session with instant **Logout 🚪** capability.

---

## 🔑 Login Credentials Reference

| User Role | Credentials / Input | Access Level |
| :--- | :--- | :--- |
| **🎓 Student** | Any Roll Number from `111623104001` to `111623104040` | View directory, Search routes, Tap-to-call drivers |
| **🛠️ Admin** | Secret Name: `batman` | View, Edit bus details, Add new buses, Remove buses |

---

## 🚀 How to Build the Android APK (via Expo EAS)

We have configured [`eas.json`](file:///c:/Users/dell1/Downloads/bus/bus-app/eas.json) to generate a standalone `.apk` file for Android.

### Step 1: Sign up & Login to Expo
1. Create a free account at [expo.dev](https://expo.dev).
2. Log in to your Expo account in the terminal:
   ```bash
   npx eas login
   ```

### Step 2: Build the APK
Run the EAS cloud build command:
```bash
npx eas build -p android --profile preview
```

Expo cloud servers will compile the app and provide a direct **download link for the `.apk` file** that can be installed on any Android phone!

---

## 🐙 How to Push to GitHub

### Option A: Using GitHub Desktop (Recommended if Git CLI is not installed)
1. Download & Install [GitHub Desktop](https://desktop.github.com/).
2. Open GitHub Desktop and click **File ➔ Add Local Repository**.
3. Select the folder: `c:\Users\dell1\Downloads\bus\bus-app`.
4. Click **Publish repository** to upload it to your GitHub account!

### Option B: Using Git Command Line
If Git is installed on your computer:
```bash
# 1. Initialize git
git init

# 2. Add all project files
git add .

# 3. Create initial commit
git commit -m "Initial commit: Shanmuga College Campus Bus Directory App"

# 4. Connect to your GitHub repository URL and push
git remote add origin https://github.com/YOUR_USERNAME/bus-tracker-app.git
git branch -M main
git push -u origin main
```

---

## 🛠️ Technology Stack

- **Framework**: [Expo](https://expo.dev) (SDK 57)
- **Library**: [React Native](https://reactnative.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Storage**: [`@react-native-async-storage/async-storage`](https://react-native-async-storage.github.io/async-storage/)
- **Build Service**: Expo Application Services (EAS Build)

---

## 📄 License
Created for **Shanmuga Industries Arts & Science College**, Tiruvannamalai.
