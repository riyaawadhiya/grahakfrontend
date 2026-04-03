import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Badge from './Badge';
import { STATUS_CONFIG } from '../utils/constants.js';

export default function OrderCard({ order, resolvedStatus, onAccept, onComplete, onReject }) {
  const status     = resolvedStatus ?? order.status;
  const isPending  = status === 'pending';
  const isAccepted = status === 'accepted';
  const showActions = isPending || isAccepted;
  const accentColor = STATUS_CONFIG[status]?.accent ?? '#9CA3AF';

  return (
    <View
      className="bg-white rounded-2xl mb-3 border border-gray-100 overflow-hidden"
      style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
    >
      {/* Left accent stripe */}
      <View
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: accentColor }}
      />

      <View className="p-3 pl-4">
        {/* Header row */}
        <View className="flex-row justify-between items-start mb-1">
          <View>
            <View className="flex-row items-center gap-1.5 mb-1">
              <Text className="text-indigo-600 text-xs font-bold">#{order.id}</Text>
              <Badge status={status} />
              {order.isNew && (
                <View className="bg-emerald-100 rounded px-1.5 py-0.5">
                  <Text className="text-emerald-700 text-[9px] font-bold">NEW</Text>
                </View>
              )}
            </View>
            <Text className="text-sm font-semibold text-gray-900">{order.customer}</Text>
            <Text className="text-[10px] text-gray-400">{order.orderNumber}</Text>
          </View>
          <View className="items-end">
            <Text className="text-base font-bold text-gray-900">₹{order.amount}</Text>
            <Text className="text-[10px] text-gray-400 mt-0.5">{order.time}</Text>
          </View>
        </View>

        {/* Items */}
        <Text className={`text-[11px] text-gray-400 leading-4 ${showActions ? 'mb-2.5' : ''}`}>
          {order.items}
        </Text>

        {/* Actions */}
        {showActions && (
          <View className="flex-row gap-2">
            {isPending && (
              <ActionButton label="Accept"   style="accept"   onPress={onAccept}   />
            )}
            <ActionButton label="Complete" style="complete" onPress={onComplete} />
            <ActionButton label="Reject"   style="reject"   onPress={onReject}   />
          </View>
        )}
      </View>
    </View>
  );
}

function ActionButton({ label, style, onPress }) {
  const styles = {
    accept:   { wrap: 'bg-blue-50 border border-blue-200',    text: 'text-blue-700'    },
    complete: { wrap: 'bg-emerald-50 border border-emerald-200', text: 'text-emerald-700' },
    reject:   { wrap: 'bg-red-50 border border-red-200',      text: 'text-red-600'     },
  }[style];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className={`flex-1 py-2 rounded-xl items-center ${styles.wrap}`}
    >
      <Text className={`text-[11px] font-semibold ${styles.text}`}>{label}</Text>
    </TouchableOpacity>
  );
}