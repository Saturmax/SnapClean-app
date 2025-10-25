import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  useColorScheme,
  Animated,
  Easing,
  Alert,
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
import { Sparkles } from "lucide-react-native";
import { Image } from "expo-image";

export default function Processing() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [progress, setProgress] = useState(0);
  const [processingText, setProcessingText] = useState("Analyzing image...");

  const progressAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
  });

  useEffect(() => {
    const processImage = async () => {
      try {
        console.log("Processing image with params:", params);

        if (!params.imageUri) {
          throw new Error("No image URI provided");
        }

        // Call the background removal API
        const response = await fetch("/api/remove-background", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUri: params.imageUri,
            imageWidth: parseInt(params.imageWidth) || 1000,
            imageHeight: parseInt(params.imageHeight) || 1000,
          }),
        });

        console.log("API Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error:", errorText);
          throw new Error("Background removal failed");
        }

        const result = await response.json();
        console.log("API Result:", result);

        // Save to recent edits
        try {
          await fetch("/api/recent-edits", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              original_image_uri: result.originalImageUri,
              processed_image_uri: result.processedImageUri,
              image_width: result.imageWidth,
              image_height: result.imageHeight,
              processing_time: result.processingTime,
            }),
          });
        } catch (saveError) {
          console.error("Failed to save to recent edits:", saveError);
          // Don't fail the whole process if saving fails
        }

        // Navigate to results
        router.replace({
          pathname: "/results",
          params: {
            originalUri: result.originalImageUri,
            processedUri: result.processedImageUri,
            imageWidth: result.imageWidth?.toString() || params.imageWidth,
            imageHeight: result.imageHeight?.toString() || params.imageHeight,
          },
        });
      } catch (error) {
        console.error("Processing error:", error);
        Alert.alert("Error", `Failed to process image: ${error.message}`);
        router.back();
      }
    };

    // Simulate processing steps with UI updates
    const steps = [
      { text: "Analyzing image...", duration: 800 },
      { text: "Detecting subject...", duration: 1000 },
      { text: "Removing background...", duration: 1500 },
      { text: "Applying final touches...", duration: 700 },
    ];

    let currentStep = 0;

    const processStep = () => {
      if (currentStep < steps.length) {
        setProcessingText(steps[currentStep].text);

        const stepProgress = 100 / steps.length;
        const targetProgress = (currentStep + 1) * stepProgress;

        Animated.timing(progressAnim, {
          toValue: targetProgress,
          duration: steps[currentStep].duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start();

        setTimeout(() => {
          setProgress(targetProgress);
          currentStep++;
          processStep();
        }, steps[currentStep].duration);
      } else {
        // Start actual processing
        processImage();
      }
    };

    processStep();

    // Sparkle animation
    const sparkleLoop = () => {
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => sparkleLoop());
    };

    sparkleLoop();

    // Pulse animation
    const pulseLoop = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true,
        }),
      ]).start(() => pulseLoop());
    };

    pulseLoop();
  }, [params]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? "#121212" : "#fff",
      }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        {/* Image Preview */}
        <Animated.View
          style={{
            transform: [{ scale: pulseAnim }],
            marginBottom: 40,
          }}
        >
          <View
            style={{
              width: 200,
              height: 200,
              borderRadius: 20,
              overflow: "hidden",
              backgroundColor: isDark ? "#1E1E1E" : "#F8F9FA",
              borderWidth: 2,
              borderColor: isDark ? "#2A2A2A" : "#E5E7EB",
            }}
          >
            {params.imageUri && (
              <Image
                source={{ uri: params.imageUri }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                transition={300}
              />
            )}
          </View>

          {/* Sparkle overlay */}
          <Animated.View
            style={{
              position: "absolute",
              top: -10,
              right: -10,
              opacity: sparkleAnim,
              transform: [
                {
                  rotate: sparkleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            }}
          >
            <View
              style={{
                backgroundColor: "#667eea",
                borderRadius: 15,
                padding: 8,
              }}
            >
              <Sparkles size={16} color="#fff" />
            </View>
          </Animated.View>
        </Animated.View>

        {/* Progress Ring */}
        <View style={{ marginBottom: 32, alignItems: "center" }}>
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 4,
              borderColor: isDark ? "#2A2A2A" : "#E5E7EB",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Progress circle */}
            <Animated.View
              style={{
                position: "absolute",
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 4,
                borderColor: "transparent",
                borderTopColor: "#667eea",
                transform: [
                  {
                    rotate: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              }}
            />

            <Text
              style={{
                fontFamily: "Montserrat_600SemiBold",
                fontSize: 18,
                color: isDark ? "rgba(255,255,255,0.87)" : "#000",
              }}
            >
              {Math.round(progress)}%
            </Text>
          </View>
        </View>

        {/* Processing Text */}
        <Text
          style={{
            fontFamily: "Montserrat_500Medium",
            fontSize: 18,
            color: isDark ? "rgba(255,255,255,0.87)" : "#000",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          {processingText}
        </Text>

        <Text
          style={{
            fontFamily: "Montserrat_400Regular",
            fontSize: 14,
            color: isDark ? "rgba(255,255,255,0.6)" : "#6B7280",
            textAlign: "center",
          }}
        >
          This usually takes a few seconds
        </Text>
      </View>
    </View>
  );
}
