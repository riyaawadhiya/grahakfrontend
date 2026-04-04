// components/Badge.jsx  ← REWRITTEN
import React from 'react';
import { View, Text } from 'react-native';
import { STATUS_CONFIG } from '../utils/constants.js';

/**
 * Two modes:
 *  1. Status badge  — pass `status` (uses STATUS_CONFIG)
 *  2. Custom badge  — pass `label` + optional `variant`
 */
const VARIANTS = {
  default:  { wrap: 'bg-gray-100 border-gray-200',    text: 'text-gray-600'   },
  success:  { wrap: 'bg-green-50 border-green-200',   text: 'text-[#00B14F]'  },
  warning:  { wrap: 'bg-amber-50 border-amber-200',   text: 'text-amber-600'  },
  danger:   { wrap: 'bg-red-50   border-red-200',     text: 'text-red-500'    },
  info:     { wrap: 'bg-blue-50  border-blue-200',    text: 'text-blue-600'   },
};

function Badge({ label, variant = 'default', status, style }) {
  // --- Status mode ---
  if (status) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    return (
      <View style={style} className={`px-2 py-0.5 rounded-full self-start ${cfg.badgeBg}`}>
        <Text className={`text-[9px] font-bold ${cfg.badgeText}`}>
          {cfg.label}
        </Text>
      </View>
    );
  }

  // --- Custom label mode ---
  const v = VARIANTS[variant] ?? VARIANTS.default;
  return (
    <View style={style} className={`px-2 py-[3px] rounded-lg self-start border ${v.wrap}`}>
      <Text className={`text-[10px] font-semibold tracking-wide ${v.text}`}>
        {label ?? ''}
      </Text>
    </View>
  );
}

export default React.memo(Badge);