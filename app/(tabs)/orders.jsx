// app/(tabs)/orders.jsx
// ✅ SELF-CONTAINED — all state, logic, and OrderCard inlined. No external deps.

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AddItemSheet from '../../src/components/AddItemSheet';

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ORDERS = [
  {
    id: 'ORD-2481', status: 'new', table: 'Table 4', type: 'dine-in', time: '2 min ago',
    customer: { name: 'Rohit S.', initials: 'RS', color: '#EEF2FF', textColor: '#6366F1' },
    items: [{ name: 'Paneer Tikka', qty: 2 }, { name: 'Samosa', qty: 4 }, { name: 'Lassi', qty: 2 }],
    total: 480,
  },
  {
    id: 'ORD-2480', status: 'new', table: 'Takeaway', type: 'takeaway', time: '7 min ago',
    customer: { name: 'Priya K.', initials: 'PK', color: '#F5F3FF', textColor: '#8B5CF6' },
    items: [{ name: 'Dal Makhani', qty: 1 }, { name: 'Naan', qty: 3 }],
    total: 320,
  },
  {
    id: 'ORD-2479', status: 'preparing', table: 'Delivery', type: 'delivery', time: '15 min ago',
    customer: { name: 'Aakash M.', initials: 'AM', color: '#EDE9FE', textColor: '#7C3AED' },
    items: [{ name: 'Biryani', qty: 2 }, { name: 'Raita', qty: 2 }, { name: 'Gulab Jamun', qty: 3 }],
    total: 740,
  },
  {
    id: 'ORD-2478', status: 'ready', table: 'Table 7', type: 'dine-in', time: '28 min ago',
    customer: { name: 'Vikram T.', initials: 'VT', color: '#EFF6FF', textColor: '#3B82F6' },
    items: [{ name: 'Butter Chicken', qty: 1 }, { name: 'Garlic Naan', qty: 2 }],
    total: 520,
  },
  {
    id: 'ORD-2477', status: 'delivered', table: 'Table 2', type: 'dine-in', time: '42 min ago',
    customer: { name: 'Sneha G.', initials: 'SG', color: '#F3F4F6', textColor: '#6B7280' },
    items: [{ name: 'Chole Bhature', qty: 2 }, { name: 'Chai', qty: 3 }],
    total: 290,
  },
];

const TABS = [
  { key: 'all',       label: 'All'       },
  { key: 'new',       label: 'New'       },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready',     label: 'Ready'     },
  { key: 'delivered', label: 'Delivered' },
];

const STATUS = {
  new:       { label: 'New',       bg: '#EEF2FF', color: '#6366F1', dot: '#818CF8' },
  preparing: { label: 'Preparing', bg: '#FFF7ED', color: '#C2410C', dot: '#F97316' },
  ready:     { label: 'Ready',     bg: '#F0FDF4', color: '#166534', dot: '#22C55E' },
  delivered: { label: 'Delivered', bg: '#F3F4F6', color: '#6B7280', dot: '#9CA3AF' },
};

const SECTION_LABELS = {
  new:       'New orders',
  preparing: 'Preparing',
  ready:     'Ready to serve',
  delivered: 'Delivered',
};

// ─── Order Card ───────────────────────────────────────────────────────────────
function OrderCard({ order, onAccept, onDecline, onAdvance }) {
  const s = STATUS[order.status] ?? STATUS.new;

  return (
    <View style={{
      backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10,
      borderWidth: 0.5, borderColor: '#F3F4F6',
      shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 }, elevation: 2,
      opacity: order.status === 'delivered' ? 0.72 : 1,
    }}>
      {/* Top row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <View>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#111827' }}>#{order.id}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 }}>
            <Ionicons
              name={order.type === 'dine-in' ? 'restaurant-outline' : order.type === 'takeaway' ? 'bag-outline' : 'bicycle-outline'}
              size={11}
              color="#9CA3AF"
            />
            <Text style={{ fontSize: 10, color: '#9CA3AF' }}>{order.time} · {order.table}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: s.bg, borderRadius: 20, paddingHorizontal: 9, paddingVertical: 4, gap: 5 }}>
          <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: s.dot }} />
          <Text style={{ fontSize: 10, fontWeight: '700', color: s.color }}>{s.label}</Text>
        </View>
      </View>

      {/* Items chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {order.items.map((item, i) => (
            <View key={i} style={{ backgroundColor: '#F9FAFB', borderWidth: 0.5, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 }}>
              <Text style={{ fontSize: 11, color: '#374151' }}>
                {item.name}{' '}<Text style={{ color: '#9CA3AF' }}>×{item.qty}</Text>
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 0.5, borderTopColor: '#F3F4F6' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <View style={{ width: 26, height: 26, borderRadius: 8, backgroundColor: order.customer.color, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 9, fontWeight: '700', color: order.customer.textColor }}>
              {order.customer.initials}
            </Text>
          </View>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151' }}>{order.customer.name}</Text>
        </View>
        <Text style={{ fontSize: 14, fontWeight: '800', color: '#6366F1' }}>
          ₹{order.total.toLocaleString('en-IN')}
        </Text>
      </View>

      {/* Actions */}
      {order.status === 'new' && (
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
          <TouchableOpacity
            onPress={() => onDecline(order.id)}
            activeOpacity={0.75}
            style={{ flex: 1, paddingVertical: 9, borderRadius: 11, alignItems: 'center', backgroundColor: '#F3F4F6' }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151' }}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onAccept(order.id)}
            activeOpacity={0.75}
            style={{ flex: 2, paddingVertical: 9, borderRadius: 11, alignItems: 'center', backgroundColor: '#6366F1' }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>Accept Order</Text>
          </TouchableOpacity>
        </View>
      )}

      {order.status === 'preparing' && (
        <TouchableOpacity
          onPress={() => onAdvance(order.id, 'ready')}
          activeOpacity={0.75}
          style={{ marginTop: 10, paddingVertical: 9, borderRadius: 11, alignItems: 'center', backgroundColor: '#F59E0B' }}
        >
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>Mark as Ready</Text>
        </TouchableOpacity>
      )}

      {order.status === 'ready' && (
        <TouchableOpacity
          onPress={() => onAdvance(order.id, 'delivered')}
          activeOpacity={0.75}
          style={{ marginTop: 10, paddingVertical: 9, borderRadius: 11, alignItems: 'center', backgroundColor: '#10B981' }}
        >
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>Mark as Delivered</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function OrdersScreen() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [activeTab, setTab] = useState('all');
  const [sheetVisible, setSheetVisible] = useState(false);

  const counts = {
    all:       orders.length,
    new:       orders.filter((o) => o.status === 'new').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready:     orders.filter((o) => o.status === 'ready').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  };

  const visible  = activeTab === 'all' ? orders : orders.filter((o) => o.status === activeTab);
  const sections = ['new', 'preparing', 'ready', 'delivered'].reduce((acc, status) => {
    const group = visible.filter((o) => o.status === status);
    if (group.length) acc.push({ status, orders: group });
    return acc;
  }, []);

  const handleAccept  = (id) => setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'preparing' } : o));
  const handleDecline = (id) =>
    Alert.alert('Decline Order?', 'The customer will be notified.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Decline', style: 'destructive', onPress: () => setOrders((prev) => prev.filter((o) => o.id !== id)) },
    ]);
  const handleAdvance = (id, nextStatus) => setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: nextStatus } : o));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── HEADER ── */}
      <View style={{ backgroundColor: '#6366F1', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <Text style={{ color: '#C7D2FE', fontSize: 12, marginBottom: 4 }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
        </Text>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 16 }}>Orders</Text>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[
            { val: counts.all,       label: 'Total'     },
            { val: counts.new,       label: 'New'       },
            { val: counts.preparing, label: 'Preparing' },
            { val: counts.delivered, label: 'Delivered' },
          ].map((s) => (
            <View key={s.label} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingVertical: 8, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>{s.val}</Text>
              <Text style={{ color: '#C7D2FE', fontSize: 11 }}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── TABS ── */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, gap: 6 }}
        style={{ flexGrow: 0 }}
      >
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setTab(t.key)}
            activeOpacity={0.75}
            style={{
              paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, marginRight: 6,
              backgroundColor: activeTab === t.key ? '#6366F1' : '#fff',
              borderWidth: 0.5, borderColor: activeTab === t.key ? '#6366F1' : '#E5E7EB',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: activeTab === t.key ? '#fff' : '#6B7280' }}>
              {t.label}{counts[t.key] > 0 ? `  ${counts[t.key]}` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── LIST ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingTop: 12, paddingBottom: 40 }}
      >
        {sections.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 70 }}>
            <Text style={{ fontSize: 36, marginBottom: 12 }}>🛍️</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#9CA3AF' }}>No orders here</Text>
            <Text style={{ fontSize: 11, color: '#D1D5DB', marginTop: 4 }}>
              {activeTab === 'all' ? 'New orders will appear here' : `No ${activeTab} orders right now`}
            </Text>
          </View>
        ) : (
          sections.map(({ status, orders: group }) => (
            <View key={status}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8, marginTop: 4 }}>
                {SECTION_LABELS[status]}
              </Text>
              {group.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onAdvance={handleAdvance}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity
  onPress={() => setSheetVisible(true)}
  style={{
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6366F1',
    padding: 14,
    borderRadius: 50,
    elevation: 5,
  }}
>
  <Ionicons name="add" size={22} color="#fff" />
</TouchableOpacity>
<AddItemSheet
  visible={sheetVisible}
  onClose={() => setSheetVisible(false)}
/>
    </SafeAreaView>
    
  );
}