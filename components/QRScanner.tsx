import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Camera } from "expo-camera";
import {
  Scan,
  FlashlightOff,
  FlashlightOn,
  X,
  Plus,
  Edit,
} from "lucide-react-native";

interface QRScannerProps {
  onScan?: (data: string) => void;
  onClose?: () => void;
}

const QRScanner = ({
  onScan = () => {},
  onClose = () => {},
}: QRScannerProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [assetFound, setAssetFound] = useState(false);

  // Mock asset data for demonstration
  const mockAsset = {
    id: "AST001",
    name: "Office Laptop",
    category: "Electronics",
    location: "Main Office",
    condition: "Good",
    acquisitionDate: "2023-05-15",
  };

  useEffect(() => {
    const getCameraPermissions = async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      } catch (error) {
        console.error("Camera permission error:", error);
        setHasPermission(false);
      }
    };

    getCameraPermissions();
  }, []);

  // Fungsi simulasi pemindaian kode QR
  const simulateBarCodeScanned = () => {
    setScanned(true);
    // Simulasi data yang terbaca
    const mockQRData = "INVENTO-123456";
    onScan(mockQRData);
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  const resetScanner = () => {
    setScanned(false);
    setAssetFound(false);
  };

  if (hasPermission === null) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-lg">Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-lg text-red-500">No access to camera</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
          onPress={async () => {
            try {
              const { status } = await Camera.requestCameraPermissionsAsync();
              setHasPermission(status === "granted");
            } catch (error) {
              console.error("Camera permission request error:", error);
              setHasPermission(false);
            }
          }}
        >
          <Text className="text-white font-medium">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      {!scanned ? (
        <View className="flex-1">
          <Camera
            style={{ flex: 1 }}
            type={Camera.Constants.Type.back}
            flashMode={flashOn ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
          >
            <View className="flex-1 bg-transparent">
              {/* Overlay guide for scanning */}
              <View className="flex-1 items-center justify-center">
                <TouchableOpacity 
                  onPress={simulateBarCodeScanned} 
                  className="w-64 h-64 border-2 border-white rounded-lg opacity-70 justify-center items-center"
                >
                  <Text className="text-white text-lg text-center">
                    Ketuk di sini untuk mensimulasikan pemindaian QR code
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Controls */}
              <View className="absolute bottom-10 left-0 right-0 flex-row justify-around items-center">
                <TouchableOpacity
                  className="bg-black bg-opacity-50 p-4 rounded-full"
                  onPress={onClose}
                >
                  <X size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-black bg-opacity-50 p-4 rounded-full"
                  onPress={toggleFlash}
                >
                  {flashOn ? (
                    <FlashlightOn size={24} color="white" />
                  ) : (
                    <FlashlightOff size={24} color="white" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-black bg-opacity-50 p-4 rounded-full"
                  onPress={() =>
                    Alert.alert(
                      "Manual Entry",
                      "This would open a form to manually enter asset ID",
                    )
                  }
                >
                  <Edit size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        </View>
      ) : (
        <View className="flex-1 p-4">
          <View className="bg-white rounded-xl p-6 shadow-md">
            <View className="items-center mb-6">
              <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-2">
                {assetFound ? (
                  <Scan size={32} color="#10b981" />
                ) : (
                  <Plus size={32} color="#f59e0b" />
                )}
              </View>
              <Text className="text-xl font-bold">
                {assetFound ? "Asset Found" : "Asset Not Found"}
              </Text>
            </View>

            {assetFound ? (
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-500">Asset ID:</Text>
                  <Text className="font-medium">{mockAsset.id}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-500">Name:</Text>
                  <Text className="font-medium">{mockAsset.name}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-500">Category:</Text>
                  <Text className="font-medium">{mockAsset.category}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-500">Location:</Text>
                  <Text className="font-medium">{mockAsset.location}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-500">Condition:</Text>
                  <Text className="font-medium">{mockAsset.condition}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-500">Acquisition Date:</Text>
                  <Text className="font-medium">
                    {mockAsset.acquisitionDate}
                  </Text>
                </View>
              </View>
            ) : (
              <View className="items-center">
                <Text className="text-center text-gray-600 mb-4">
                  This QR code doesn't match any asset in the database.
                </Text>
              </View>
            )}

            <View className="mt-6 space-y-3">
              {assetFound ? (
                <TouchableOpacity
                  className="bg-blue-500 py-3 rounded-lg items-center"
                  onPress={() =>
                    Alert.alert(
                      "Update Status",
                      "This would open a form to update asset status",
                    )
                  }
                >
                  <Text className="text-white font-medium">
                    Update Asset Status
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className="bg-amber-500 py-3 rounded-lg items-center"
                  onPress={() =>
                    Alert.alert(
                      "Add New Asset",
                      "This would open the asset form",
                    )
                  }
                >
                  <Text className="text-white font-medium">Add New Asset</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                className="border border-gray-300 py-3 rounded-lg items-center"
                onPress={resetScanner}
              >
                <Text className="text-gray-700 font-medium">Scan Another</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default QRScanner;
