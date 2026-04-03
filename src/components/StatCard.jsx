import React from 'react';
import { View, Text } from 'react-native';

export default function StatCard({ icon, value, label, sub }) {
  return (
    <View
      className="flex-1 bg-white rounded-2xl p-4 border border-gray-100"
      style={{
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
      }}
    >
      {icon && (
        <View className="w-9 h-9 rounded-xl bg-gray-50 items-center justify-center mb-3 border border-gray-100">
          <Text className="text-base">{icon}</Text>
        </View>
      )}

      <Text className="text-xl font-bold text-gray-900 tracking-tight">
        {value}
      </Text>

      <Text className="text-[11px] text-gray-400 mt-[3px] font-medium">
        {label}
      </Text>

      {sub && (
        <Text className="text-[10px] text-gray-400 mt-1">{sub}</Text>
      )}

      {/* green accent bottom bar */}
      <View
        className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
        style={{ backgroundColor: '#00B14F', opacity: 0.25 }}
      />
    </View>
  );
}