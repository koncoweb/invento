import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Plus, Edit, Trash2, Search } from "lucide-react-native";
import InventoryForm from "../components/InventoryForm";

interface InventoryItem {
  id: string;
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

export default function InventoryScreen() {
  const { user } = useAuth();
  const [inventories, setInventories] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      fetchInventories();
    }
  }, [user]);

  const fetchInventories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "inventories"));
      const items: InventoryItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as InventoryItem);
      });
      setInventories(items);
    } catch (error) {
      console.error("Error fetching inventories:", error);
      Alert.alert("Error", "Failed to fetch inventories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "inventories", id));
              setInventories(inventories.filter((item) => item.id !== id));
              Alert.alert("Success", "Item deleted successfully");
            } catch (error) {
              console.error("Error deleting item:", error);
              Alert.alert("Error", "Failed to delete item");
            }
          },
        },
      ],
    );
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormSubmit = async (
    formData: Omit<InventoryItem, "id" | "createdAt" | "updatedAt" | "userId">,
  ) => {
    try {
      if (editingItem) {
        // Update existing item
        await updateDoc(doc(db, "inventories", editingItem.id), {
          ...formData,
          updatedAt: new Date(),
        });
        setInventories(
          inventories.map((item) =>
            item.id === editingItem.id
              ? { ...item, ...formData, updatedAt: new Date() }
              : item,
          ),
        );
        Alert.alert("Success", "Item updated successfully");
      } else {
        // Create new item
        const docRef = await addDoc(collection(db, "inventories"), {
          ...formData,
          userId: user?.uid,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        const newItem: InventoryItem = {
          id: docRef.id,
          ...formData,
          userId: user?.uid || "",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setInventories([...inventories, newItem]);
        Alert.alert("Success", "Item added successfully");
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving item:", error);
      Alert.alert("Error", "Failed to save item");
    }
  };

  const filteredInventories = inventories.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "baik":
        return "bg-green-100 text-green-800";
      case "kurang baik":
        return "bg-yellow-100 text-yellow-800";
      case "rusak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-600">
          Please login to access inventory
        </Text>
      </View>
    );
  }

  if (showForm) {
    return (
      <InventoryForm
        initialData={editingItem}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
      />
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-6 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Inventory Management
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
          <Search size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-gray-900"
            placeholder="Search inventories..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Add Button */}
        <TouchableOpacity
          className="bg-blue-600 rounded-lg py-3 px-4 flex-row items-center justify-center"
          onPress={() => setShowForm(true)}
        >
          <Plus size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Add New Item</Text>
        </TouchableOpacity>
      </View>

      {/* Inventory List */}
      <ScrollView className="flex-1 px-4 py-4">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-600">Loading...</Text>
          </View>
        ) : filteredInventories.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-600 text-lg">
              No inventory items found
            </Text>
            <Text className="text-gray-500 mt-2">
              Add your first item to get started
            </Text>
          </View>
        ) : (
          filteredInventories.map((item) => (
            <View
              key={item.id}
              className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200"
            >
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    {item.itemName}
                  </Text>
                  <Text className="text-gray-600">{item.brand}</Text>
                </View>
                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    className="bg-blue-100 p-2 rounded-lg"
                    onPress={() => handleEdit(item)}
                  >
                    <Edit size={16} color="#2563EB" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-red-100 p-2 rounded-lg"
                    onPress={() => handleDelete(item.id)}
                  >
                    <Trash2 size={16} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="space-y-1">
                <Text className="text-sm text-gray-600">
                  <Text className="font-medium">Category:</Text> {item.category}
                </Text>
                <Text className="text-sm text-gray-600">
                  <Text className="font-medium">Location:</Text> {item.location}
                </Text>
                <Text className="text-sm text-gray-600">
                  <Text className="font-medium">Sub Location:</Text>{" "}
                  {item.subLocation}
                </Text>
                <View className="flex-row items-center mt-2">
                  <Text className="text-sm text-gray-600 font-medium mr-2">
                    Condition:
                  </Text>
                  <View
                    className={`px-2 py-1 rounded-full ${getConditionColor(item.condition)}`}
                  >
                    <Text className="text-xs font-medium capitalize">
                      {item.condition}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
