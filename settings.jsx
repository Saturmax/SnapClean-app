import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
} from '@expo-google-fonts/montserrat';
import { 
  Crown, 
  Info, 
  Shield, 
  HelpCircle, 
  Star,
  ChevronRight
} from 'lucide-react-native';

export default function Settings() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const settingsItems = [
    {
      title: 'Upgrade to Pro',
      subtitle: 'HD exports, no ads • $4.99/month',
      icon: Crown,
      action: () => Alert.alert('Pro Upgrade', 'Pro features coming soon!'),
      highlight: true,
    },
    {
      title: 'About SnapClean',
      subtitle: 'Version 1.0.0',
      icon: Info,
      action: () => Alert.alert('About', 'SnapClean - AI Background Removal'),
    },
    {
      title: 'Privacy Policy',
      subtitle: 'How we protect your data',
      icon: Shield,
      action: () => Alert.alert('Privacy', 'Privacy policy coming soon'),
    },
    {
      title: 'Help & Support',
      subtitle: 'Get help with the app',
      icon: HelpCircle,
      action: () => Alert.alert('Support', 'Support coming soon'),
    },
    {
      title: 'Rate SnapClean',
      subtitle: 'Share your feedback',
      icon: Star,
      action: () => Alert.alert('Rate App', 'Thanks for your feedback!'),
    },
  ];

  const renderSettingsItem = (item, index) => (
    <TouchableOpacity
      key={index}
      onPress={item.action}
      style={{
        backgroundColor: item.highlight
          ? '#667eea'
          : isDark
          ? '#1E1E1E'
          : '#F8F9FA',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        ...(item.highlight && {
          shadowColor: '#667eea',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 4,
        }),
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: item.highlight
            ? 'rgba(255,255,255,0.2)'
            : isDark
            ? '#2A2A2A'
            : '#E5E7EB',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 16,
        }}
      >
        <item.icon
          size={24}
          color={
            item.highlight
              ? '#fff'
              : isDark
              ? 'rgba(255,255,255,0.87)'
              : '#000'
          }
        />
      </View>
      
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: 'Montserrat_600SemiBold',
            fontSize: 16,
            color: item.highlight
              ? '#fff'
              : isDark
              ? 'rgba(255,255,255,0.87)'
              : '#000',
            marginBottom: 2,
          }}
        >
          {item.title}
        </Text>
        <Text
          style={{
            fontFamily: 'Montserrat_400Regular',
            fontSize: 14,
            color: item.highlight
              ? 'rgba(255,255,255,0.8)'
              : isDark
              ? 'rgba(255,255,255,0.6)'
              : '#6B7280',
          }}
        >
          {item.subtitle}
        </Text>
      </View>
      
      <ChevronRight
        size={20}
        color={
          item.highlight
            ? 'rgba(255,255,255,0.8)'
            : isDark
            ? 'rgba(255,255,255,0.6)'
            : '#6B7280'
        }
      />
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? '#121212' : '#fff',
      }}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
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
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontFamily: 'Montserrat_600SemiBold',
              fontSize: 28,
              color: isDark ? 'rgba(255,255,255,0.87)' : '#000',
              marginBottom: 8,
            }}
          >
            Settings
          </Text>
          <Text
            style={{
              fontFamily: 'Montserrat_400Regular',
              fontSize: 16,
              color: isDark ? 'rgba(255,255,255,0.6)' : '#6B7280',
            }}
          >
            Manage your SnapClean experience
          </Text>
        </View>

        {/* Settings Items */}
        {settingsItems.map(renderSettingsItem)}
        
        {/* App Info */}
        <View
          style={{
            marginTop: 32,
            paddingTop: 24,
            borderTopWidth: 1,
            borderTopColor: isDark ? '#2A2A2A' : '#E5E7EB',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: 'Montserrat_400Regular',
              fontSize: 14,
              color: isDark ? 'rgba(255,255,255,0.6)' : '#6B7280',
              textAlign: 'center',
            }}
          >
            SnapClean v1.0.0{'\n'}
            Made with ❤️ for photo editing
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}