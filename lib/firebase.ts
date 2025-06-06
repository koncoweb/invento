import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLHOUfTZJBAueFMT3En9mFUXEpsqpaN4g",
  authDomain: "invento-79d79.firebaseapp.com",
  projectId: "invento-79d79",
  storageBucket: "invento-79d79.firebasestorage.app",
  messagingSenderId: "793470788626",
  appId: "1:793470788626:web:76592f8d0170287496a4cb",
  measurementId: "G-0VK3YJ2Y7C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
