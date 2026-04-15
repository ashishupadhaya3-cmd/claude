// Firebase configuration for RoomKhoj
// ----------------------------------------------------------------------------
// STEP 1: Go to https://console.firebase.google.com/ and create a new project.
// STEP 2: Add a Web App to your Firebase project.
// STEP 3: Copy the firebaseConfig object and paste it below (replace the
//         placeholder values).
// STEP 4: Enable Cloud Firestore (Build > Firestore Database > Create DB).
// STEP 5: Enable Storage (Build > Storage > Get started).
// STEP 6: For MVP testing set Firestore & Storage rules to "test mode"
//         (allow read, write: if true;). Lock down before production!
// ----------------------------------------------------------------------------

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Replace these with your real Firebase project credentials
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Initialise Firebase
const app = initializeApp(firebaseConfig);

// Firestore database instance
export const db = getFirestore(app);

// Cloud Storage instance (for room images)
export const storage = getStorage(app);

export default app;
