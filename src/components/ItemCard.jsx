// components/ItemCard.jsx  ← PRODUCTION FINAL
import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';

function ItemCard({ item, qty, onAdd, onRemove }) {
  const isActive   = qty > 0;
  const lineAmount = item.price * qty;

  const handleAdd = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAdd();
  }, [onAdd]);

  const handleRemove = useCallback(() => {
    if (qty === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRemove();
  }, [qty, onRemove]);

  return (
    <View className={`flex-row items-center rounded-2xl mb-3 overflow-hidden border
      ${isActive ? 'border-indigo-300 bg-indigo-50' : 'border-gray-100 bg-gray-50'}`}
    >
      {/* MINUS */}
      <TouchableOpacity
        onPress={handleRemove}
        disabled={qty === 0}
        activeOpacity={0.7}
        className={`w-11 h-11 rounded-xl items-center justify-center m-3
          ${qty === 0 ? 'bg-gray-100' : 'bg-red-100'}`}
        accessibilityLabel={`Remove one ${item.name}`}
        accessibilityRole="button"
        accessibilityState={{ disabled: qty === 0 }}
      >
        <Text className={`text-xl font-bold leading-none
          ${qty === 0 ? 'text-gray-300' : 'text-red-600'}`}>
          −
        </Text>
      </TouchableOpacity>

      {/* CENTER */}
      <View className="flex-1 items-center py-3 gap-0.5">
        <Text style={{ fontSize: 30 }}>{item.emoji}</Text>
        <Text className="text-xs font-bold text-gray-800 text-center leading-4 mt-1">
          {item.name}
        </Text>
        <Text className="text-[10px] text-gray-400">₹{item.price} / item</Text>
        <View className="flex-row items-center gap-1.5 mt-1">
          {isActive && (
            <View className="bg-indigo-600 rounded-full px-2 py-0.5">
              <Text className="text-white text-[10px] font-bold">×{qty}</Text>
            </View>
          )}
          <Text className={`text-sm font-extrabold
            ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
            ₹{isActive ? lineAmount : item.price}
          </Text>
        </View>
      </View>

      {/* PLUS */}
      <TouchableOpacity
        onPress={handleAdd}
        activeOpacity={0.7}
        className="w-11 h-11 bg-indigo-100 rounded-xl items-center justify-center m-3"
        accessibilityLabel={`Add one ${item.name}`}
        accessibilityRole="button"
      >
        <Text className="text-indigo-600 text-xl font-bold leading-none">+</Text>
      </TouchableOpacity>
    </View>
  );
}

export default React.memo(ItemCard, (prev, next) =>
  prev.qty      === next.qty &&
  prev.item     === next.item &&
  prev.onAdd    === next.onAdd &&
  prev.onRemove === next.onRemove
);