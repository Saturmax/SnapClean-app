import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { useRouter, useFocusEffect } from "expo-router";
import {
  Camera,
  Image as ImageIcon,
  Sparkles,
  Crown,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [recentEdits, setRecentEdits] = useState([]);
  const [loadingEdits, setLoadingEdits] = useState(true);

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    fetchRecentEdits();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchRecentEdits();
    }, []),
  );

  const fetchRecentEdits = async () => {
    try {
      setLoadingEdits(true);
      const response = await fetch("/api/recent-edits");
      if (response.ok) {
        const data = await response.json();
        setRecentEdits(data.recent_edits || []);
      }
    } catch (error) {
      console.error("Failed to fetch recent edits:", error);
    } finally {
      setLoadingEdits(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const pickImage = async (source) => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission required",
          "Please allow access to your photos to continue.",
        );
        return;
      }

      let result;
      if (source === "camera") {
        const cameraPermission =
          await ImagePicker.requestCameraPermissionsAsync();
        if (cameraPermission.granted === false) {
          Alert.alert(
            "Permission required",
            "Please allow camera access to take photos.",
          );
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      console.log("Image picker result:", result);

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        console.log("Selected image:", {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
        });

        router.push({
          pathname: "/processing",
          params: {
            imageUri: asset.uri,
            imageWidth: asset.width?.toString() || "1000",
            imageHeight: asset.height?.toString() || "1000",
          },
        });
      } else {
        console.log("Image selection was canceled or failed");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? "#121212" : "#fff",
      }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <View
            style={{
              backgroundColor: isDark ? "#1E1E1E" : "#F8F9FA",
              borderRadius: 20,
              padding: 12,
              marginBottom: 16,
            }}
          >
            <Sparkles size={24} color={isDark ? "#fff" : "#000"} />
          </View>
          <Text
            style={{
              fontFamily: "Montserrat_700Bold",
              fontSize: 28,
              color: isDark ? "rgba(255,255,255,0.87)" : "#000",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            SnapClean
          </Text>
          <Text
            style={{
              fontFamily: "Montserrat_400Regular",
              fontSize: 16,
              color: isDark ? "rgba(255,255,255,0.6)" : "#6B7280",
              textAlign: "center",
              lineHeight: 24,
            }}
          >
            Remove backgrounds from your photos{"\n"}instantly with AI magic
          </Text>
        </View>

        {/* Main Action Buttons */}
        <View style={{ marginBottom: 40 }}>
          <TouchableOpacity
            onPress={() => pickImage("gallery")}
            style={{
              backgroundColor: isDark ? "#fff" : "#000",
              borderRadius: 16,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: isDark
                  ? "rgba(0,0,0,0.1)"
                  : "rgba(255,255,255,0.1)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
              }}
            >
              <ImageIcon size={24} color={isDark ? "#000" : "#fff"} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Montserrat_600SemiBold",
                  fontSize: 18,
                  color: isDark ? "#000" : "#fff",
                  marginBottom: 2,
                }}
              >
                Choose from Gallery
              </Text>
              <Text
                style={{
                  fontFamily: "Montserrat_400Regular",
                  fontSize: 14,
                  color: isDark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)",
                }}
              >
                Select any photo to remove background
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => pickImage("camera")}
            style={{
              backgroundColor: isDark ? "#1E1E1E" : "#F8F9FA",
              borderRadius: 16,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: isDark ? "#2A2A2A" : "#E5E7EB",
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: isDark ? "#2A2A2A" : "#E5E7EB",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
              }}
            >
              <Camera
                size={24}
                color={isDark ? "rgba(255,255,255,0.87)" : "#000"}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Montserrat_600SemiBold",
                  fontSize: 18,
                  color: isDark ? "rgba(255,255,255,0.87)" : "#000",
                  marginBottom: 2,
                }}
              >
                Take New Photo
              </Text>
              <Text
                style={{
                  fontFamily: "Montserrat_400Regular",
                  fontSize: 14,
                  color: isDark ? "rgba(255,255,255,0.6)" : "#6B7280",
                }}
              >
                Capture a new photo instantly
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Pro Upgrade Banner */}
        <TouchableOpacity
          style={{
            backgroundColor: "#667eea",
            borderRadius: 16,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 32,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
            }}
          >
            <Crown size={24} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Montserrat_600SemiBold",
                fontSize: 16,
                color: "#fff",
                marginBottom: 2,
              }}
            >
              Upgrade to Pro
            </Text>
            <Text
              style={{
                fontFamily: "Montserrat_400Regular",
                fontSize: 14,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              HD exports, no ads • $4.99/month
            </Text>
          </View>
        </TouchableOpacity>

        {/* Recent Edits Section */}
        {recentEdits.length > 0 && (
          <View>
            <Text
              style={{
                fontFamily: "Montserrat_600SemiBold",
                fontSize: 20,
                color: isDark ? "rgba(255,255,255,0.87)" : "#000",
                marginBottom: 16,
              }}
            >
              Recent Edits
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 24 }}
            >
              {recentEdits.map((edit, index) => (
                <TouchableOpacity
                  key={edit.id}
                  onPress={() => {
                    router.push({
                      pathname: "/results",
                      params: {
                        originalUri: edit.original_image_uri,
                        processedUri: edit.processed_image_uri,
                        imageWidth: edit.image_width,
                        imageHeight: edit.image_height,
                      },
                    });
                  }}
                  style={{
                    width: 120,
                    height: 120,
                    backgroundColor: isDark ? "#1E1E1E" : "#F8F9FA",
                    borderRadius: 12,
                    marginRight: 12,
                    borderWidth: 1,
                    borderColor: isDark ? "#2A2A2A" : "#E5E7EB",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={{ uri: edit.processed_image_uri }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                    transition={300}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
