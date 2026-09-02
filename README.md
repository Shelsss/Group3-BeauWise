# 🚀 BeauWise: Mobile Client

> **BeauWise** is an AI-powered cosmetic ingredient analysis and suitability assessment system. It uses OCR and Large Language Models (LLMs) to scan product labels, evaluate ingredient safety,
> and recommend alternatives tailored to a user's specific facial skin and hair profile.
>
> Beauwise is implemented for everyday consumers to make safe, informed decisions by decoding complex ingredient lists.
> Grounded in verified dermatological science rather than brand marketing,
> it minimizes the trial and error of finding suitable cosmetics, acts as an educational tool for skincare professionals,
> and promotes industry transparency by highlighting FDA-compliant products.
>
> **Core Features**
>
> - **Ingredient Scanning (OCR):** Extracts text directly from physical product labels.
> - **AI-Assisted Analysis:** Leverages LLMs to evaluate the safety, suitability, and purpose of extracted ingredients.
> - **Personalized Recommendations:** Uses content-based filtering to suggest alternative active ingredients aligned with the user's personal skin and hair profile.
> - **FDA Product Verification:** Checks a cosmetic product's regulatory legitimacy and notification status.
> - **Batch Code Lookup:** Determines a product's freshness and safe usage period.
> - **Educational Module:** Debunks cosmetic myths and educates users on ingredient science.
>
> Learn More: **[BeauWise](https://beauwise.tech)**

<br/>

## 🌐 Project Ecosystem

This repository is the mobile frontend of the Beauwise mobile platform. You can find the other components here:

- [Backend Server Repo](https://github.com/navi-cc/beauwise-server) - The core API and database.
- [Web Admin Client Repo](https://github.com/navi-cc/admin-beauwise) - The admin web app.
- **[Mobile Client Repo](https://github.com/Shelsss/Group3-BeauWise) (You are here)** - The android app.

<br/>

## 🛠 Tech Stack

- **Core Library:** React Native (v0.81.5)
- **Framework:** Expo (v54.0.33)
- **Runtime:** Node.js (v22.19.0)

<br/>

## 📋 Prerequisites

Before running the mobile app locally, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v22.19.0)
- [Android Studio](https://developer.android.com/studio) (with a configured Android Virtual Device / Emulator)

> [!NOTE]
> Ensure the local backend server is already running the app.

<br/>

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following keys. Reach out to the team lead for the secret values.

```ini
EXPO_PUBLIC_WEB_CLIENT_ID= #...
EXPO_PUBLIC_BEAUWISE_CDN= #...
```

<br/>

## 🔌 Connecting to the Local Firebase Emulators / Server

When running the app on a physical device or the Android emulator, `localhost` (or `127.0.0.1`) will not correctly route to your computer's local backend server. You must configure the app to use your computer's actual local Wi-Fi/network IP address (e.g., `192.168.x.x`).

To fix connection issues, locate the specific firebase service initialization file (e.g., [`src/services/auth.js`](src/services/auth.js), [`src/services/cloudFunction.js`](src/services/cloudFunction.js) and [`src/services/firestore.js`](src/services/firestore.js)) and update the `localIP` array with your machine's current IPv4 address:

```javascript
// Replace with your machine's actual local IP address
const localIP = ['127.0.0.1', '192.168.x.xxx', '10.141.xx.xxx'];

// Ensure the index matches your updated IP (e.g., localIP[1] for 192.168.x.xxx)
connectAuthEmulator(auth, `http://${localIP[1]}:9099`);
```

<br/>

## 🚀 Local Development Setup

1. Install Dependencies

```bash
npm install
```

2. Build and Start the App (Android)
   This single command will automatically generate the native android folder, build the project, and start the Expo development server:

```bash
npm run android
```

<br/>

> [!NOTE]
> Ensure your Android Emulator is running before executing this command, or have a physical Android device connected via USB with USB Debugging enabled.
