/**
 * Firebase Configuration
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project (or use an existing one)
 * 3. In the project overview, click "Add app" and select "Web" (</> icon)
 * 4. Register your app with a nickname
 * 5. Copy the firebaseConfig object values
 * 6. Create a .env file in the root directory with these variables:
 *    VITE_FIREBASE_API_KEY=your_api_key
 *    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
 *    VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
 *    VITE_FIREBASE_PROJECT_ID=your_project_id
 *    VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
 *    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
 *    VITE_FIREBASE_APP_ID=your_app_id
 *
 * 7. Enable Realtime Database:
 *    - In Firebase console, go to "Realtime Database"
 *    - Click "Create Database"
 *    - Start in "test mode" (you can update rules later)
 *    - Choose a location close to your users
 *
 * 8. Security Rules (update after testing):
 *    {
 *      "rules": {
 *        ".read": true,
 *        ".write": true
 *      }
 *    }
 *
 * Note: For production, implement proper security rules to restrict access
 */

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and export it
export const database = getDatabase(app);
export default app;
