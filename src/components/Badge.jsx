import React from 'react';
import { View, Text } from 'react-native';
import { STATUS_CONFIG } from '../utils/constants.js';

const VARIANTS = {
  default: {
    wrap: 'bg-gray-100 border border-gray-200',
    text: 'text-gray-600',
  },
  success: {
    wrap: 'bg-green-50 border border-green-200',
    text: 'text-[#00B14F]',
  },
  warning: {
    wrap: 'bg-amber-50 border border-amber-200',
    text: 'text-amber-600',
  },
  danger: {
    wrap: 'bg-red-50 border border-red-200',
    text: 'text-red-500',
  },
  info: {
    wrap: 'bg-blue-50 border border-blue-200',
    text: 'text-blue-600',
  },
};

export default function Badge({ label, variant = 'default', status = 'pending', style }) {
  const v = VARIANTS[variant] ?? VARIANTS.default;
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  return (
    <View>
      <View
        style={style}
        className={`px-2 py-[3px] rounded-lg self-start ${v.wrap}`}
      >
        <Text className={`text-[10px] font-semibold tracking-wide ${v.text}`}>
          {label}
        </Text>
      </View>

      <View className={`px-2 py-0.5 rounded-full ${cfg.badgeBg}`}>
        <Text className={`text-[9px] font-bold ${cfg.badgeText}`}>
          {cfg.label}
        </Text>
      </View>
    </View>
  );
}