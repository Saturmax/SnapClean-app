import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Alert,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Download,
  Share2,
  Sliders,
  Eye,
  RotateCcw,
  Check,
} from "lucide-react-native";
import { Image } from "expo-image";

export default function Results() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [showOriginal, setShowOriginal] = useState(false);
  const [showEnhancePanel, setShowEnhancePanel] = useState(false);
  const [enhancement, setEnhancement] = useState({
    brightness: 0,
    contrast: 0,
    sharpness: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const toggleComparison = () => {
    setShowOriginal(!showOriginal);
    Animated.spring(slideAnim, {
      toValue: showOriginal ? 0 : 1,
      useNativeDriver: true,
    }).start();
  };

  const saveImage = async () => {
    try {
      setIsSaving(true);

      // Success animation
      Animated.sequence([
        Animated.spring(successAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.spring(successAnim, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();

      Alert.alert("Success!", "Image saved to your photo library.");
    } catch (error) {
      Alert.alert("Error", "Could not save image. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const shareImage = async () => {
    try {
      setIsSharing(true);
      Alert.alert("Share", "Sharing functionality will be available soon!");
    } catch (error) {
      Alert.alert("Error", "Could not share image. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  const resetEnhancements = () => {
    setEnhancement({
      brightness: 0,
      contrast: 0,
      sharpness: 0,
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? "#121212" : "#fff",
      }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 24,
          paddingTop: insets.top + 16,
          paddingBottom: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            padding: 8,
            marginLeft: -8,
          }}
        >
          <ArrowLeft
            size={24}
            color={isDark ? "rgba(255,255,255,0.87)" : "#000"}
          />
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: "Montserrat_600SemiBold",
            fontSize: 18,
            color: isDark ? "rgba(255,255,255,0.87)" : "#000",
          }}
        >
          Results
        </Text>

        <TouchableOpacity
          onPress={() => setShowEnhancePanel(!showEnhancePanel)}
          style={{
            padding: 8,
            marginRight: -8,
          }}
        >
          <Sliders
            size={24}
            color={isDark ? "rgba(255,255,255,0.87)" : "#000"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Image Comparison */}
        <View
          style={{
            marginHorizontal: 24,
            marginBottom: 32,
          }}
        >
          <View
            style={{
              aspectRatio: 1,
              borderRadius: 20,
              overflow: "hidden",
              backgroundColor: isDark ? "#1E1E1E" : "#F8F9FA",
              position: "relative",
            }}
          >
            {/* Processed Image */}
            <Image
              source={{ uri: params.processedUri }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={300}
            />

            {/* Original Image Overlay */}
            <Animated.View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: slideAnim,
              }}
            >
              <Image
                source={{ uri: params.originalUri }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                transition={300}
              />
            </Animated.View>

            {/* Success Sparkles */}
            <Animated.View
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: [
                  { translateX: -20 },
                  { translateY: -20 },
                  { scale: successAnim },
                ],
                opacity: successAnim,
              }}
            >
              <View
                style={{
                  backgroundColor: "#4CAF50",
                  borderRadius: 20,
                  padding: 12,
                }}
              >
                <Check size={16} color="#fff" />
              </View>
            </Animated.View>
          </View>

          {/* Comparison Toggle */}
          <TouchableOpacity
            onPress={toggleComparison}
            style={{
              backgroundColor: isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 8,
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
              marginTop: 16,
            }}
          >
            <Eye size={16} color={isDark ? "rgba(255,255,255,0.87)" : "#000"} />
            <Text
              style={{
                fontFamily: "Montserrat_500Medium",
                fontSize: 14,
                color: isDark ? "rgba(255,255,255,0.87)" : "#000",
                marginLeft: 8,
              }}
            >
              {showOriginal ? "Show Result" : "Show Original"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Enhancement Panel */}
        {showEnhancePanel && (
          <View
            style={{
              backgroundColor: isDark ? "#1E1E1E" : "#F8F9FA",
              marginHorizontal: 24,
              borderRadius: 16,
              padding: 20,
              marginBottom: 32,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "Montserrat_600SemiBold",
                  fontSize: 16,
                  color: isDark ? "rgba(255,255,255,0.87)" : "#000",
                }}
              >
                Enhance Image
              </Text>

              <TouchableOpacity onPress={resetEnhancements}>
                <RotateCcw
                  size={20}
                  color={isDark ? "rgba(255,255,255,0.6)" : "#6B7280"}
                />
              </TouchableOpacity>
            </View>

            {/* Enhancement Sliders - Simplified for demo */}
            {["Brightness", "Contrast", "Sharpness"].map((label, index) => (
              <View key={label} style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                    fontSize: 14,
                    color: isDark ? "rgba(255,255,255,0.6)" : "#6B7280",
                    marginBottom: 8,
                  }}
                >
                  {label}
                </Text>
                <View
                  style={{
                    height: 4,
                    backgroundColor: isDark ? "#2A2A2A" : "#E5E7EB",
                    borderRadius: 2,
                  }}
                >
                  <View
                    style={{
                      height: 4,
                      width: "50%",
                      backgroundColor: "#667eea",
                      borderRadius: 2,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View
          style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 120 }}
        >
          <TouchableOpacity
            onPress={saveImage}
            disabled={isSaving}
            style={{
              backgroundColor: isDark ? "#fff" : "#000",
              borderRadius: 16,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            <Download size={20} color={isDark ? "#000" : "#fff"} />
            <Text
              style={{
                fontFamily: "Montserrat_600SemiBold",
                fontSize: 16,
                color: isDark ? "#000" : "#fff",
                marginLeft: 8,
              }}
            >
              {isSaving ? "Saving..." : "Save to Gallery"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={shareImage}
            disabled={isSharing}
            style={{
              backgroundColor: isDark ? "#1E1E1E" : "#F8F9FA",
              borderRadius: 16,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: isDark ? "#2A2A2A" : "#E5E7EB",
              opacity: isSharing ? 0.7 : 1,
            }}
          >
            <Share2
              size={20}
              color={isDark ? "rgba(255,255,255,0.87)" : "#000"}
            />
            <Text
              style={{
                fontFamily: "Montserrat_600SemiBold",
                fontSize: 16,
                color: isDark ? "rgba(255,255,255,0.87)" : "#000",
                marginLeft: 8,
              }}
            >
              {isSharing ? "Sharing..." : "Share Image"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
