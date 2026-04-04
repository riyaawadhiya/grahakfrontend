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
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 12,
                borderRadius: 12,
                backgroundColor: '#F9FAFB',
                marginBottom: 10,
              }}
            >
              {/* Left */}
              <View>
                <Text style={{ fontSize: 14, fontWeight: '600' }}>
                  {item.emoji} {item.name}
                </Text>

                <Text style={{ fontSize: 12, color: '#6B7280' }}>
                  ₹{item.price}
                </Text>

                {qty > 0 && (
                  <Text style={{ fontSize: 12, color: '#EF4444', marginTop: 2 }}>
                    Pending: ₹{total}
                  </Text>
                )}
              </View>

              {/* Right Buttons */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <TouchableOpacity
                  onPress={() => handleRemove(item)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    backgroundColor: '#E5E7EB',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 16 }}>−</Text>
                </TouchableOpacity>

                <Text style={{ fontSize: 14, fontWeight: '600' }}>{qty}</Text>

                <TouchableOpacity
                  onPress={() => handleAdd(item)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    backgroundColor: '#6366F1',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 16, color: '#fff' }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}