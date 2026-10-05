import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAfuEtVBGzHbDnDrm8AmwYv_loai8BS0qc",
  authDomain: "cp5-mobile-d9f68.firebaseapp.com",
  projectId: "cp5-mobile-d9f68",
  storageBucket: "cp5-mobile-d9f68.firebasestorage.app",
  messagingSenderId: "109375351766",
  appId: "1:109375351766:web:53dcfa10953d7bc46c5277",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// initializeAuth só pode ser chamado uma vez; em hot-reload usamos getAuth como fallback
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };
