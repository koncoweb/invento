import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { ChevronDown, X, Plus } from "lucide-react-native";

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

interface InventoryFormProps {
  initialData?: InventoryItem | null;
  onSubmit: (
    data: Omit<
      InventoryItem,
      "id" | "createdAt" | "updatedAt" | "userId" | "inventoryId" | "qrcode"
    >,
  ) => void;
  onCancel: () => void;
}

const conditionOptions = [
  { label: "Baik", value: "baik" },
  { label: "Kurang Baik", value: "kurang baik" },
  { label: "Rusak", value: "rusak" },
];

export default function InventoryForm({
  initialData,
  onSubmit,
  onCancel,
}: InventoryFormProps) {
  const [formData, setFormData] = useState({
    itemName: initialData?.itemName || "",
    brand: initialData?.brand || "",
    category: initialData?.category || "",
    location: initialData?.location || "",
    subLocation: initialData?.subLocation || "",
    condition:
      initialData?.condition || ("baik" as "baik" | "kurang baik" | "rusak"),
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoryList: string[] = [];
      querySnapshot.forEach((doc) => {
        categoryList.push(doc.data().name);
      });
      setCategories(categoryList);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddNewCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert("Error", "Please enter a category name");
      return;
    }

    if (categories.includes(newCategoryName.trim())) {
      Alert.alert("Error", "Category already exists");
      return;
    }

    try {
      await addDoc(collection(db, "categories"), {
        name: newCategoryName.trim(),
        createdAt: new Date(),
      });

      const updatedCategories = [...categories, newCategoryName.trim()];
      setCategories(updatedCategories);
      setFormData({ ...formData, category: newCategoryName.trim() });
      setNewCategoryName("");
      setShowNewCategoryModal(false);
      Alert.alert("Success", "New category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
      Alert.alert("Error", "Failed to add new category");
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.itemName.trim()) newErrors.itemName = "Item name is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.subLocation.trim())
      newErrors.subLocation = "Sub location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderDropdown = (
    value: string,
    options: { label: string; value: string }[],
    onSelect: (value: string) => void,
    show: boolean,
    onToggle: () => void,
  ) => (
    <View className="relative">
      <TouchableOpacity
        className="border border-gray-300 rounded-lg px-3 py-3 flex-row justify-between items-center bg-white"
        onPress={onToggle}
      >
        <Text className={value ? "text-gray-900" : "text-gray-500"}>
          {value || "Select option"}
        </Text>
        <ChevronDown size={20} color="#6B7280" />
      </TouchableOpacity>

      {show && (
        <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 z-10 shadow-lg">
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              className="px-3 py-3 border-b border-gray-100 last:border-b-0"
              onPress={() => {
                onSelect(option.value);
                onToggle();
              }}
            >
              <Text className="text-gray-900">{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderCategoryDropdown = () => (
    <View className="relative">
      <TouchableOpacity
        className="border border-gray-300 rounded-lg px-3 py-3 flex-row justify-between items-center bg-white"
        onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
      >
        <Text className={formData.category ? "text-gray-900" : "text-gray-500"}>
          {formData.category || "Select category"}
        </Text>
        <ChevronDown size={20} color="#6B7280" />
      </TouchableOpacity>

      {showCategoryDropdown && (
        <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 z-10 shadow-lg">
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              className="px-3 py-3 border-b border-gray-100"
              onPress={() => {
                setFormData({ ...formData, category });
                setShowCategoryDropdown(false);
              }}
            >
              <Text className="text-gray-900">{category}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            className="px-3 py-3 flex-row items-center bg-blue-50"
            onPress={() => {
              setShowCategoryDropdown(false);
              setShowNewCategoryModal(true);
            }}
          >
            <Plus size={16} color="#2563EB" />
            <Text className="text-blue-600 ml-2 font-medium">
              Add New Category
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white px-4 py-6 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-bold text-gray-900">
            {initialData ? "Edit Item" : "Add New Item"}
          </Text>
          <TouchableOpacity onPress={onCancel}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Inventory ID Display (for edit mode) */}
        {initialData && (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Inventory ID
            </Text>
            <View className="border border-gray-300 rounded-lg px-3 py-3 bg-gray-50">
              <Text className="text-gray-900 font-mono">
                {initialData.inventoryId}
              </Text>
            </View>
            <Text className="text-xs text-gray-500 mt-1">
              QR Code: {initialData.qrcode}
            </Text>
          </View>
        )}

        {/* Item Name */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Item Name *
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-3 text-gray-900 bg-white"
            placeholder="Enter item name"
            value={formData.itemName}
            onChangeText={(text) =>
              setFormData({ ...formData, itemName: text })
            }
          />
          {errors.itemName && (
            <Text className="text-red-500 text-sm mt-1">{errors.itemName}</Text>
          )}
        </View>

        {/* Brand */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Brand *
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-3 text-gray-900 bg-white"
            placeholder="Enter brand name"
            value={formData.brand}
            onChangeText={(text) => setFormData({ ...formData, brand: text })}
          />
          {errors.brand && (
            <Text className="text-red-500 text-sm mt-1">{errors.brand}</Text>
          )}
        </View>

        {/* Category */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Category *
          </Text>
          {renderCategoryDropdown()}
          {errors.category && (
            <Text className="text-red-500 text-sm mt-1">{errors.category}</Text>
          )}
        </View>

        {/* Location */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Location *
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-3 text-gray-900 bg-white"
            placeholder="e.g., Cabang Semarang"
            value={formData.location}
            onChangeText={(text) =>
              setFormData({ ...formData, location: text })
            }
          />
          {errors.location && (
            <Text className="text-red-500 text-sm mt-1">{errors.location}</Text>
          )}
        </View>

        {/* Sub Location */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Sub Location *
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-3 text-gray-900 bg-white"
            placeholder="e.g., Gedung Kantor Cabang Semarang"
            value={formData.subLocation}
            onChangeText={(text) =>
              setFormData({ ...formData, subLocation: text })
            }
          />
          {errors.subLocation && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.subLocation}
            </Text>
          )}
        </View>

        {/* Condition */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Condition *
          </Text>
          {renderDropdown(
            conditionOptions.find((opt) => opt.value === formData.condition)
              ?.label || "",
            conditionOptions,
            (value) =>
              setFormData({
                ...formData,
                condition: value as "baik" | "kurang baik" | "rusak",
              }),
            showConditionDropdown,
            () => setShowConditionDropdown(!showConditionDropdown),
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-blue-600 rounded-lg py-4 px-4 mb-6"
          onPress={handleSubmit}
        >
          <Text className="text-white font-semibold text-center text-lg">
            {initialData ? "Update Item" : "Add Item"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* New Category Modal */}
      <Modal
        visible={showNewCategoryModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNewCategoryModal(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
          <View className="bg-white rounded-lg p-6 w-full max-w-sm">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Add New Category
            </Text>

            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-3 text-gray-900 mb-4"
              placeholder="Enter category name"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              autoFocus
            />

            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-lg py-3"
                onPress={() => {
                  setShowNewCategoryModal(false);
                  setNewCategoryName("");
                }}
              >
                <Text className="text-gray-700 font-medium text-center">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-blue-600 rounded-lg py-3"
                onPress={handleAddNewCategory}
              >
                <Text className="text-white font-medium text-center">Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
