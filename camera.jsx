import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
} from '@expo-google-fonts/montserrat';
import { Camera, Image as ImageIcon } from 'lucide-react-native';

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? '#121212' : '#fff',
      }}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 24,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            backgroundColor: isDark ? '#2A2A2A' : '#F6F6F6',
            borderRadius: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <Camera
            color={isDark ? 'rgba(255,255,255,0.6)' : '#9E9E9E'}
            size={36}
          />
        </View>

        <Text
          style={{
            fontFamily: 'Montserrat_600SemiBold',
            fontSize: 20,
            color: isDark ? 'rgba(255,255,255,0.87)' : '#000',
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          Camera Coming Soon
        </Text>

        <Text
          style={{
            fontFamily: 'Montserrat_500Medium',
            fontSize: 16,
            color: isDark ? 'rgba(255,255,255,0.6)' : '#9E9E9E',
            textAlign: 'center',
            lineHeight: 24,
          }}
        >
          For now, use the home screen to{'\n'}select photos from your gallery
        </Text>
      </View>
    </View>
  );
}