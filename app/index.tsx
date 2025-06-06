import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Lock, Mail, Eye, EyeOff, User } from "lucide-react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (!isLogin && !name) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        // Sign in existing user
        await signInWithEmailAndPassword(auth, email, password);
        Alert.alert("Success", "Welcome back!");
      } else {
        // Create new user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = userCredential.user;

        // Update user profile with display name
        await updateProfile(user, {
          displayName: name,
        });

        // Save user data to Firestore
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: email,
          createdAt: new Date().toISOString(),
          role: "user",
        });

        Alert.alert("Success", "Account created successfully!");
      }

      router.replace("/dashboard");
    } catch (error: any) {
      let errorMessage = "An error occurred";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later";
          break;
        default:
          errorMessage = error.message || "Authentication failed";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address first");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Password Reset",
        "Password reset email sent! Check your inbox and follow the instructions.",
      );
    } catch (error: any) {
      let errorMessage = "Failed to send password reset email";

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address";
      }

      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerClassName="flex-grow">
        <View className="flex-1 p-6 justify-center">
          {/* Logo and Header */}
          <View className="items-center mb-10">
            <Image
              source={{
                uri: "https://api.dicebear.com/7.x/identicon/svg?seed=inventory",
              }}
              className="w-24 h-24 mb-4"
            />
            <Text className="text-3xl font-bold text-blue-600">
              Asset Inventory
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              {isLogin
                ? "Sign in to manage your organization assets"
                : "Create an account to get started"}
            </Text>
          </View>

          {/* Auth Form */}
          <View className="space-y-4">
            {!isLogin && (
              <View className="relative">
                <View className="absolute left-3 top-3">
                  <User size={20} color="#6b7280" />
                </View>
                <TextInput
                  className="bg-gray-100 px-10 py-3 rounded-lg text-gray-800"
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}

            <View className="relative">
              <View className="absolute left-3 top-3">
                <Mail size={20} color="#6b7280" />
              </View>
              <TextInput
                className="bg-gray-100 px-10 py-3 rounded-lg text-gray-800"
                placeholder="Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View className="relative">
              <View className="absolute left-3 top-3">
                <Lock size={20} color="#6b7280" />
              </View>
              <TextInput
                className="bg-gray-100 px-10 py-3 rounded-lg text-gray-800"
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                className="absolute right-3 top-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#6b7280" />
                ) : (
                  <Eye size={20} color="#6b7280" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className={`py-3 rounded-lg ${isLoading ? "bg-blue-400" : "bg-blue-600"} mt-2`}
              onPress={handleAuth}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold text-center">
                {isLoading
                  ? "Processing..."
                  : isLogin
                    ? "Sign In"
                    : "Create Account"}
              </Text>
            </TouchableOpacity>

            {isLogin && (
              <TouchableOpacity className="mt-2" onPress={handleForgotPassword}>
                <Text className="text-blue-600 text-center">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Toggle between login and register */}
          <View className="mt-8">
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text className="text-center text-gray-600">
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Organization Info */}
          <View className="mt-10">
            <Text className="text-center text-gray-400 text-xs">
              © 2023 Asset Inventory System
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
