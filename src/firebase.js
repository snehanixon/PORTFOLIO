// ─────────────────────────────────────────────────────────────
// Firebase Firestore — PM-VIKAS Activity Database
// ─────────────────────────────────────────────────────────────
// SETUP (one-time, ~2 minutes):
//   1. Go to https://console.firebase.google.com
//   2. Click "Create a project" → give it a name → Continue
//   3. Disable Google Analytics → Create project
//   4. Click "Web" icon (</>) → register app → copy the config below
//   5. In the Firebase console sidebar: Build → Firestore Database
//      → Create database → Start in TEST mode → Choose a region → Enable
//   6. Replace the placeholder values below with your actual config
// ─────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            "AIzaSyA3ogSmoyx1iYohI2zhwFkL3Y41inMKzJI",
  authDomain:        "sneha-portfolio-46df9.firebaseapp.com",
  projectId:         "sneha-portfolio-46df9",
  storageBucket:     "sneha-portfolio-46df9.firebasestorage.app",
  messagingSenderId: "683201300125",
  appId:             "1:683201300125:web:63aa52791a5dd96a95f674"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ── Firestore helpers ──────────────────────────────────────────
const COLLECTION = 'pm_vikas';
const DOCUMENT   = 'activities';

/**
 * Load all activities from Firestore.
 * Returns an array of event objects, or null on failure.
 */
export async function loadActivities() {
  try {
    const ref  = doc(db, COLLECTION, DOCUMENT);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data().events || [];
    }
    return [];
  } catch (err) {
    console.error('Firestore read error:', err);
    return null;
  }
}

/**
 * Save the full activities array to Firestore.
 * Returns true on success, false on failure.
 */
export async function saveActivities(events) {
  try {
    const ref = doc(db, COLLECTION, DOCUMENT);
    await setDoc(ref, { events });
    return true;
  } catch (err) {
    console.error('Firestore write error:', err);
    return false;
  }
}
