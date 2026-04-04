import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AddItemSheet({ visible, onClose }) {
  if (!visible) return null;

  const MENU_ITEMS = [
    { id: '1', name: 'Samosa', price: 10, emoji: '🥟' },
    { id: '2', name: 'Kachori', price: 15, emoji: '🥯' },
    { id: '3', name: 'Tea', price: 20, emoji: '☕' },
  ];

  const [cart, setCart] = useState({});

  const handleAdd = (item) => {
    setCart((prev) => {
      const qty = (prev[item.id]?.qty || 0) + 1;

      return {
        ...prev,
        [item.id]: {
          ...item,
          qty,
          total: -(qty * item.price), // 🔥 negative pending
        },
      };
    });
  };

  const handleRemove = (item) => {
    setCart((prev) => {
      const current = prev[item.id];
      if (!current) return prev;

      const qty = current.qty - 1;

      if (qty <= 0) {
        const updated = { ...prev };
        delete updated[item.id];
        return updated;
      }

      return {
        ...prev,
        [item.id]: {
          ...item,
          qty,
          total: -(qty * item.price),
        },
      };
    });
  };

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '55%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        elevation: 10,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>Add Items</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={20} />
        </TouchableOpacity>
      </View>

      {/* Items */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {MENU_ITEMS.map((item) => {
          const qty = cart[item.id]?.qty || 0;
          const total = cart[item.id]?.total || 0;

          return (
         <View
  key={item.id}
  style={{
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    marginBottom: 14,
  }}
>
  {/* 🔺 RIGHT BIG BUTTON */}
<TouchableOpacity
  onPress={() => handleAdd(item)}
  style={{
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10, // ✅ spacing from text
  }}
>
  <Text style={{ fontSize: 26, color: '#fff', fontWeight: '700' }}>+</Text>
</TouchableOpacity>

  {/* 🔻 LEFT BIG BUTTON */}


<View
  style={{
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'center', // ✅ center vertically
  }}
>
  <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827' }}>
    {item.emoji} {item.name}
  </Text>

  <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
    ₹{item.price}
  </Text>

  {qty > 0 && (
    <Text style={{ fontSize: 13, color: '#EF4444', marginTop: 4 }}>
      Pending: ₹{total}
    </Text>
  )}
</View>

  {/* 🔺 RIGHT BIG BUTTON */}
  <TouchableOpacity
    onPress={() => handleRemove(item)}
    style={{
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: '#E5E7EB',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    }}
  >
    <Text style={{ fontSize: 26, fontWeight: '600' }}>−</Text>
  </TouchableOpacity>
</View>
          );
        })}
      </ScrollView>
    </View>
  );
}