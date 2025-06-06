import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Package,
  MapPin,
  Tag,
} from "lucide-react-native";
import QRScanner from "../components/QRScanner";
import InventoryForm from "../components/InventoryForm";

interface InventoryItem {
  id: string;
  inventoryId: string;
  qrcode: string;
  itemName: string;
  brand: string;
  category: string;
  location: string;
  subLocation: string;
  condition: "baik" | "kurang baik" | "rusak";
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export default function StockOpnameScreen() {
  const { user } = useAuth();
  const [showScanner, setShowScanner] = useState(true);
  const [scannedItem, setScannedItem] = useState<InventoryItem | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanCount, setScanCount] = useState(0);

  const handleScan = async (inventoryId: string) => {
    setLoading(true);
    try {
      // Query Firestore to find item with matching inventoryId
      const querySnapshot = await getDocs(collection(db, "inventories"));

      let foundItem: InventoryItem | null = null;

      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        if (data.inventoryId === inventoryId || data.qrcode === inventoryId) {
          foundItem = {
            id: docSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as InventoryItem;
        }
      });

      if (foundItem) {
        setScannedItem(foundItem);
        setShowScanner(false);
      } else {
        Alert.alert(
          "Item Not Found",
          "No inventory item found with this QR code.",
        );
      }
    } catch (error) {
      console.error("Error fetching item:", error);
      Alert.alert("Error", "Failed to fetch item data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDataMatch = (matches: boolean) => {
    if (matches) {
      // Data matches, increment scan count and prepare for next scan
      setScanCount((prev) => prev + 1);
      Alert.alert(
        "Item Verified",
        "Item data matches actual condition. Ready to scan next item.",
        [
          {
            text: "Scan Next",
            onPress: () => {
              setScannedItem(null);
              setShowScanner(true);
            },
          },
        ],
      );
    } else {
      // Data doesn't match, show update form
      setShowUpdateForm(true);
    }
  };

  const handleUpdateSubmit = async (
    formData: Omit<
      InventoryItem,
      "id" | "createdAt" | "updatedAt" | "userId" | "inventoryId" | "qrcode"
    >,
  ) => {
    if (!scannedItem) return;

    try {
      await updateDoc(doc(db, "inventories", scannedItem.id), {
        ...formData,
        updatedAt: new Date(),
      });

      setScanCount((prev) => prev + 1);
      Alert.alert(
        "Item Updated",
        "Inventory item has been updated successfully. Ready to scan next item.",
        [
          {
            text: "Scan Next",
            onPress: () => {
              setScannedItem(null);
              setShowUpdateForm(false);
              setShowScanner(true);
            },
          },
        ],
      );
    } catch (error) {
      console.error("Error updating item:", error);
      Alert.alert("Error", "Failed to update item. Please try again.");
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "baik":
        return "text-green-600";
      case "kurang baik":
        return "text-yellow-600";
      case "rusak":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getConditionBgColor = (condition: string) => {
    switch (condition) {
      case "baik":
        return "bg-green-100";
      case "kurang baik":
        return "bg-yellow-100";
      case "rusak":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-600">
          Please login to access stock opname
        </Text>
      </SafeAreaView>
    );
  }

  if (showUpdateForm && scannedItem) {
    return (
      <InventoryForm
        initialData={scannedItem}
        onSubmit={handleUpdateSubmit}
        onCancel={() => {
          setShowUpdateForm(false);
          setScannedItem(null);
          setShowScanner(true);
        }}
      />
    );
  }

  if (showScanner) {
    return (
      <View className="flex-1 bg-white">
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="bg-blue-600 px-4 py-4 flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ArrowLeft color="white" size={24} />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-white text-xl font-bold">Stock Opname</Text>
              <Text className="text-white text-sm">
                Items Scanned: {scanCount}
              </Text>
            </View>
          </View>

          <QRScanner onScan={handleScan} onClose={() => router.back()} />

          {loading && (
            <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center">
              <View className="bg-white rounded-lg p-6">
                <Text className="text-lg font-medium">
                  Loading item data...
                </Text>
              </View>
            </View>
          )}
        </SafeAreaView>
      </View>
    );
  }

  if (scannedItem) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar style="auto" />

        {/* Header */}
        <View className="bg-blue-600 px-4 py-4 flex-row items-center">
          <TouchableOpacity
            onPress={() => {
              setScannedItem(null);
              setShowScanner(true);
            }}
            className="mr-4"
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white text-xl font-bold">
              Verify Item Data
            </Text>
            <Text className="text-white text-sm">
              Items Scanned: {scanCount}
            </Text>
          </View>
        </View>

        <View className="flex-1 p-4">
          {/* Item Details Card */}
          <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <View className="items-center mb-4">
              <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-2">
                <Package size={32} color="#2563eb" />
              </View>
              <Text className="text-xl font-bold text-gray-900">
                {scannedItem.itemName}
              </Text>
              <Text className="text-gray-600">{scannedItem.brand}</Text>
            </View>

            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 font-medium">Inventory ID:</Text>
                <Text className="font-mono text-gray-900">
                  {scannedItem.inventoryId}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 font-medium">Category:</Text>
                <View className="flex-row items-center">
                  <Tag size={16} color="#6B7280" />
                  <Text className="ml-1 text-gray-900">
                    {scannedItem.category}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 font-medium">Location:</Text>
                <View className="flex-row items-center">
                  <MapPin size={16} color="#6B7280" />
                  <Text className="ml-1 text-gray-900">
                    {scannedItem.location}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 font-medium">Sub Location:</Text>
                <Text className="text-gray-900">{scannedItem.subLocation}</Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 font-medium">Condition:</Text>
                <View
                  className={`px-3 py-1 rounded-full ${getConditionBgColor(scannedItem.condition)}`}
                >
                  <Text
                    className={`text-sm font-medium capitalize ${getConditionColor(scannedItem.condition)}`}
                  >
                    {scannedItem.condition}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Verification Question */}
          <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4 text-center">
              Apakah data sesuai dengan kondisi barang?
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              Periksa lokasi, kondisi, dan detail lainnya
            </Text>

            <View className="flex-row space-x-4">
              <TouchableOpacity
                className="flex-1 bg-green-500 rounded-lg py-4 flex-row items-center justify-center"
                onPress={() => handleDataMatch(true)}
              >
                <CheckCircle size={20} color="white" />
                <Text className="text-white font-bold ml-2 text-lg">
                  Ya, Sesuai
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-red-500 rounded-lg py-4 flex-row items-center justify-center"
                onPress={() => handleDataMatch(false)}
              >
                <XCircle size={20} color="white" />
                <Text className="text-white font-bold ml-2 text-lg">
                  Tidak Sesuai
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Instructions */}
          <View className="bg-blue-50 rounded-lg p-4">
            <Text className="text-blue-800 text-sm text-center">
              💡 Pilih "Ya, Sesuai" jika semua data benar untuk melanjutkan scan
              item berikutnya. Pilih "Tidak Sesuai" jika ada data yang perlu
              diperbarui.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}
