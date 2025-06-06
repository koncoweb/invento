import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyCLHOUfTZJBAueFMT3En9mFUXEpsqpaN4g",
  authDomain: "invento-79d79.firebaseapp.com",
  projectId: "invento-79d79",
  storageBucket: "invento-79d79.firebasestorage.app",
  messagingSenderId: "793470788626",
  appId: "1:793470788626:web:76592f8d0170287496a4cb",
  measurementId: "G-0VK3YJ2Y7C",
};

// Initialize Firebase app only if it hasn't been initialized
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication
let auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    // If auth is already initialized, get the existing instance
    auth = getAuth(app);
  }
}

// Initialize Cloud Firestore
const db = getFirestore(app);

export { auth, db };
export default app;
