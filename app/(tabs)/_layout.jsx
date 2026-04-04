// app/(tabs)/_layout.jsx
// ✅ Tab bar layout — matches #6366F1 design system

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

function TabIcon({ name, focused, label }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 6 }}>
      <Ionicons name={name} size={22} color={focused ? '#6366F1' : '#9CA3AF'} />
      <Text style={{ fontSize: 10, marginTop: 2, fontWeight: focused ? '600' : '400', color: focused ? '#6366F1' : '#9CA3AF' }}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          height: 64,
          paddingBottom: 6,
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 12,
        },
      }}
    >
      <Tabs.Screen
        name="orders"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'receipt' : 'receipt-outline'} focused={focused} label="Orders" />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'storefront' : 'storefront-outline'} focused={focused} label="Shop" />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'bar-chart' : 'bar-chart-outline'} focused={focused} label="Analytics" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} label="Profile" />,
        }}
      />
    </Tabs>
  );
}