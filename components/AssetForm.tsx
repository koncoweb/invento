import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import {
  Camera,
  Calendar,
  Check,
  ChevronDown,
  Upload,
  QrCode,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";

interface AssetFormProps {
  isEditing?: boolean;
  initialData?: {
    name: string;
    category: string;
    location: string;
    condition: string;
    acquisitionDate: string;
    image?: string;
  };
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

const AssetForm = ({
  isEditing = false,
  initialData = {
    name: "",
    category: "",
    location: "",
    condition: "good",
    acquisitionDate: new Date().toISOString().split("T")[0],
    image: undefined,
  },
  onSave = () => {},
  onCancel = () => {},
}: AssetFormProps) => {
  const [formData, setFormData] = useState(initialData);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = [
    "Furniture",
    "Electronics",
    "Office Supplies",
    "IT Equipment",
    "Other",
  ];
  const conditions = ["excellent", "good", "fair", "poor"];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectCategory = (category: string) => {
    setFormData((prev) => ({ ...prev, category }));
    setShowCategoryDropdown(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSelectCondition = (condition: string) => {
    setFormData((prev) => ({ ...prev, condition }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSave = () => {
    // In a real app, we would validate the form data here
    onSave(formData);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleUploadImage = () => {
    // In a real app, this would open the image picker
    console.log("Upload image");
  };

  const handleGenerateQR = () => {
    // In a real app, this would generate a QR code for the asset
    console.log("Generate QR code");
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4 bg-white">
        <Text className="text-2xl font-bold mb-6">
          {isEditing ? "Edit Asset" : "Add New Asset"}
        </Text>

        {/* Image Upload Section */}
        <View className="items-center mb-6">
          <TouchableOpacity
            onPress={handleUploadImage}
            className="w-32 h-32 rounded-lg bg-gray-100 items-center justify-center border border-gray-300"
          >
            {formData.image ? (
              <Image
                source={{ uri: formData.image }}
                style={{ width: 128, height: 128, borderRadius: 8 }}
                contentFit="cover"
              />
            ) : (
              <View className="items-center">
                <Upload size={32} color="#9ca3af" />
                <Text className="text-gray-500 mt-2">Upload Image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Name Field */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1 font-medium">Asset Name*</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            value={formData.name}
            onChangeText={(text) => handleInputChange("name", text)}
            placeholder="Enter asset name"
          />
        </View>

        {/* Category Dropdown */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1 font-medium">Category*</Text>
          <TouchableOpacity
            className="border border-gray-300 rounded-lg p-3 bg-white flex-row justify-between items-center"
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <Text
              className={formData.category ? "text-black" : "text-gray-400"}
            >
              {formData.category || "Select category"}
            </Text>
            <ChevronDown size={20} color="#9ca3af" />
          </TouchableOpacity>

          {showCategoryDropdown && (
            <View className="border border-gray-300 rounded-lg mt-1 bg-white">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  className="p-3 border-b border-gray-200"
                  onPress={() => handleSelectCategory(category)}
                >
                  <Text>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Location Field */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1 font-medium">Location*</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 bg-white"
            value={formData.location}
            onChangeText={(text) => handleInputChange("location", text)}
            placeholder="Enter asset location"
          />
        </View>

        {/* Condition Radio Buttons */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Condition*</Text>
          <View className="flex-row flex-wrap">
            {conditions.map((condition) => (
              <TouchableOpacity
                key={condition}
                className="flex-row items-center mr-4 mb-2"
                onPress={() => handleSelectCondition(condition)}
              >
                <View
                  className={`w-5 h-5 rounded-full border ${formData.condition === condition ? "bg-blue-500 border-blue-500" : "border-gray-400"} mr-1 items-center justify-center`}
                >
                  {formData.condition === condition && (
                    <Check size={12} color="white" />
                  )}
                </View>
                <Text className="capitalize">{condition}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Acquisition Date */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-1 font-medium">
            Acquisition Date*
          </Text>
          <TouchableOpacity
            className="border border-gray-300 rounded-lg p-3 bg-white flex-row justify-between items-center"
            onPress={() => setShowDatePicker(!showDatePicker)}
          >
            <Text>{formData.acquisitionDate || "Select date"}</Text>
            <Calendar size={20} color="#9ca3af" />
          </TouchableOpacity>
          {/* In a real app, we would show a date picker here */}
        </View>

        {/* QR Code Generation */}
        <TouchableOpacity
          className="mb-6 flex-row items-center justify-center p-3 bg-gray-100 rounded-lg"
          onPress={handleGenerateQR}
        >
          <QrCode size={20} color="#4b5563" />
          <Text className="ml-2 text-gray-700 font-medium">
            Generate QR Code
          </Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View className="flex-row justify-between mb-4">
          <TouchableOpacity
            className="flex-1 mr-2 p-3 border border-gray-300 rounded-lg items-center"
            onPress={onCancel}
          >
            <Text className="font-medium">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 ml-2 p-3 bg-blue-500 rounded-lg items-center"
            onPress={handleSave}
          >
            <Text className="text-white font-medium">Save Asset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AssetForm;
