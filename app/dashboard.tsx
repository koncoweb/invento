import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  BarChart3,
  Bell,
  LogOut,
  QrCode,
  Settings,
  User,
} from "lucide-react-native";
import AssetSummary from "../components/AssetSummary";

export default function Dashboard() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Stockopname Reminder",
      message: "Monthly inventory check due in 3 days",
      date: "2023-10-15",
    },
    {
      id: 2,
      title: "Low Stock Alert",
      message: "Office chairs are running low",
      date: "2023-10-14",
    },
    {
      id: 3,
      title: "New Asset Added",
      message: "Laptop Dell XPS 15 has been added",
      date: "2023-10-13",
    },
  ]);

  const handleScanQR = () => {
    // Navigate to QR scanner screen
    router.push("/scan");
  };

  const handleManageInventory = () => {
    // Navigate to inventory management screen
    router.push("/inventory");
  };

  const handleReports = () => {
    // Navigate to reports screen
    router.push("/reports");
  };

  const handleLogout = () => {
    // Handle logout logic
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="bg-blue-600 px-4 py-4 flex-row justify-between items-center">
        <View>
          <Text className="text-white text-xl font-bold">Asset Inventory</Text>
          <Text className="text-white text-sm">Welcome back, Admin</Text>
        </View>
        <View className="flex-row gap-4">
          <TouchableOpacity>
            <Bell color="white" size={24} />
          </TouchableOpacity>
          <TouchableOpacity>
            <User color="white" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Asset Summary Component */}
        <AssetSummary />

        {/* Quick Actions */}
        <View className="px-4 py-4">
          <Text className="text-lg font-bold mb-3">Quick Actions</Text>
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="bg-white rounded-lg p-4 items-center justify-center w-[30%] shadow-sm"
              onPress={handleScanQR}
            >
              <View className="bg-blue-100 p-3 rounded-full mb-2">
                <QrCode color="#2563eb" size={24} />
              </View>
              <Text className="text-center text-sm font-medium">Scan QR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white rounded-lg p-4 items-center justify-center w-[30%] shadow-sm"
              onPress={handleManageInventory}
            >
              <View className="bg-green-100 p-3 rounded-full mb-2">
                <Settings color="#16a34a" size={24} />
              </View>
              <Text className="text-center text-sm font-medium">
                Manage Inventory
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white rounded-lg p-4 items-center justify-center w-[30%] shadow-sm"
              onPress={handleReports}
            >
              <View className="bg-purple-100 p-3 rounded-full mb-2">
                <BarChart3 color="#9333ea" size={24} />
              </View>
              <Text className="text-center text-sm font-medium">Reports</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications */}
        <View className="px-4 py-4">
          <Text className="text-lg font-bold mb-3">Notifications</Text>
          <View className="bg-white rounded-lg shadow-sm p-2">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <View
                  key={notification.id}
                  className="border-b border-gray-100 p-3"
                >
                  <View className="flex-row justify-between">
                    <Text className="font-medium">{notification.title}</Text>
                    <Text className="text-xs text-gray-500">
                      {notification.date}
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </Text>
                </View>
              ))
            ) : (
              <Text className="text-center py-4 text-gray-500">
                No notifications
              </Text>
            )}
          </View>
        </View>

        {/* Recent Activities */}
        <View className="px-4 py-4 mb-4">
          <Text className="text-lg font-bold mb-3">Recent Activities</Text>
          <View className="bg-white rounded-lg shadow-sm p-4">
            <View className="flex-row items-center mb-3">
              <View className="bg-blue-100 p-2 rounded-full mr-3">
                <QrCode color="#2563eb" size={16} />
              </View>
              <View>
                <Text className="font-medium">Laptop Dell XPS scanned</Text>
                <Text className="text-xs text-gray-500">Today, 10:30 AM</Text>
              </View>
            </View>

            <View className="flex-row items-center mb-3">
              <View className="bg-green-100 p-2 rounded-full mr-3">
                <Settings color="#16a34a" size={16} />
              </View>
              <View>
                <Text className="font-medium">Office chair updated</Text>
                <Text className="text-xs text-gray-500">
                  Yesterday, 2:15 PM
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="bg-purple-100 p-2 rounded-full mr-3">
                <BarChart3 color="#9333ea" size={16} />
              </View>
              <View>
                <Text className="font-medium">Monthly report generated</Text>
                <Text className="text-xs text-gray-500">Oct 12, 9:00 AM</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Logout Button */}
      <TouchableOpacity
        className="m-4 bg-red-500 py-3 rounded-lg flex-row justify-center items-center"
        onPress={handleLogout}
      >
        <LogOut color="white" size={20} />
        <Text className="text-white font-bold ml-2">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
