import { initializeApp, getApps, getApp } from "firebase/app";
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

// Initialize Firebase app
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.log("Firebase app initialization error:", error);
  app = initializeApp(firebaseConfig);
}

// Initialize Firebase Authentication
let auth;
try {
  if (Platform.OS === "web") {
    auth = getAuth(app);
  } else {
    // For React Native, use initializeAuth with AsyncStorage persistence
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
} catch (error) {
  console.log("Auth initialization error, falling back to getAuth:", error);
  auth = getAuth(app);
}

// Initialize Cloud Firestore
const db = getFirestore(app);

export { auth, db };
export default app;
