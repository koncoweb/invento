import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import {
  BarChart3,
  Package,
  AlertCircle,
  TrendingUp,
} from "lucide-react-native";

interface AssetCategory {
  name: string;
  count: number;
  color: string;
}

interface AssetStatus {
  name: string;
  count: number;
  color: string;
  icon: React.ReactNode;
}

interface AssetSummaryProps {
  totalAssets?: number;
  categories?: AssetCategory[];
  statuses?: AssetStatus[];
  onCategoryPress?: (category: AssetCategory) => void;
  onStatusPress?: (status: AssetStatus) => void;
}

const AssetSummary = ({
  totalAssets = 124,
  categories = [
    { name: "Electronics", count: 45, color: "#3b82f6" },
    { name: "Furniture", count: 32, color: "#10b981" },
    { name: "Office Supplies", count: 28, color: "#f59e0b" },
    { name: "IT Equipment", count: 19, color: "#8b5cf6" },
  ],
  statuses = [
    {
      name: "Good Condition",
      count: 98,
      color: "#10b981",
      icon: <Package size={20} color="#10b981" />,
    },
    {
      name: "Needs Maintenance",
      count: 18,
      color: "#f59e0b",
      icon: <AlertCircle size={20} color="#f59e0b" />,
    },
    {
      name: "Critical",
      count: 8,
      color: "#ef4444",
      icon: <AlertCircle size={20} color="#ef4444" />,
    },
  ],
  onCategoryPress = () => {},
  onStatusPress = () => {},
}: AssetSummaryProps) => {
  return (
    <View className="bg-white p-4 rounded-lg shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-gray-800">Asset Summary</Text>
        <TouchableOpacity className="flex-row items-center">
          <BarChart3 size={18} color="#6b7280" />
          <Text className="text-sm text-gray-500 ml-1">Details</Text>
        </TouchableOpacity>
      </View>

      {/* Total Assets Card */}
      <View className="bg-blue-50 p-4 rounded-lg mb-4 flex-row justify-between items-center">
        <View>
          <Text className="text-sm text-gray-600">Total Assets</Text>
          <Text className="text-2xl font-bold text-blue-600">
            {totalAssets}
          </Text>
        </View>
        <View className="bg-blue-100 p-2 rounded-full">
          <TrendingUp size={24} color="#3b82f6" />
        </View>
      </View>

      {/* Categories Section */}
      <Text className="text-base font-semibold text-gray-700 mb-2">
        Categories
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            className="mr-3 bg-gray-50 p-3 rounded-lg min-w-[120px]"
            onPress={() => onCategoryPress(category)}
          >
            <View
              style={{ backgroundColor: category.color + "20" }}
              className="w-8 h-8 rounded-full items-center justify-center mb-2"
            >
              <Text style={{ color: category.color }} className="font-bold">
                {category.name.charAt(0)}
              </Text>
            </View>
            <Text className="text-sm font-medium text-gray-800">
              {category.name}
            </Text>
            <Text
              className="text-lg font-bold"
              style={{ color: category.color }}
            >
              {category.count}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Status Section */}
      <Text className="text-base font-semibold text-gray-700 mb-2">Status</Text>
      <View className="space-y-2">
        {statuses.map((status, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center justify-between bg-gray-50 p-3 rounded-lg"
            onPress={() => onStatusPress(status)}
          >
            <View className="flex-row items-center">
              {status.icon}
              <Text className="ml-2 text-gray-800">{status.name}</Text>
            </View>
            <View
              style={{ backgroundColor: status.color + "20" }}
              className="px-3 py-1 rounded-full"
            >
              <Text style={{ color: status.color }} className="font-bold">
                {status.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default AssetSummary;
