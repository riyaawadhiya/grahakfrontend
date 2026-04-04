// app/(tabs)/shop.jsx
// ✅ SELF-CONTAINED — no external utils, no context, no missing deps
// ProductCard is inlined; all state managed locally.

import React, { useState, memo, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar,
  Alert, Modal, TextInput, KeyboardAvoidingView, Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ['Electronics', 'Footwear', 'Clothing', 'Accessories', 'Home', 'Other'];

const CATEGORY_EMOJI = {
  Electronics: '🔌', Footwear: '👟', Clothing: '👕',
  Accessories: '⌚', Home: '🏠', Other: '📦',
};

const STATUS_COLORS = {
  published:   { bg: '#F0FDF4', text: '#16A34A', dot: '#22C55E' },
  unpublished: { bg: '#FFF7ED', text: '#C2410C', dot: '#F97316' },
  draft:       { bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' },
};

// ─── Mock initial data ────────────────────────────────────────────────────────
const MOCK_ITEMS = [
  { id: '1', name: 'Wireless Headphones', price: 2499, quantity: 15, category: 'Electronics', status: 'published',   image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80' },
  { id: '2', name: 'Running Sneakers',    price: 3299, quantity: 8,  category: 'Footwear',    status: 'published',   image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80' },
  { id: '3', name: 'Smart Watch',         price: 4999, quantity: 0,  category: 'Electronics', status: 'unpublished', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80' },
  { id: '4', name: 'Cotton T-Shirt',      price: 499,  quantity: 50, category: 'Clothing',    status: 'published',   image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80' },
  { id: '5', name: 'Sunglasses',          price: 1299, quantity: 12, category: 'Accessories', status: 'draft',       image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&q=80' },
];

// ─── Inline ProductCard ───────────────────────────────────────────────────────
const ProductCard = memo(({ item, onEdit, onTogglePublish, onRemove }) => {
  const s = STATUS_COLORS[item.status] ?? STATUS_COLORS.draft;

  return (
    <View style={{
      backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
      marginBottom: 10, borderWidth: 1, borderColor: '#F3F4F6',
      shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 }, elevation: 2,
    }}>
      <View style={{ flexDirection: 'row' }}>
        {/* Image */}
        <Image
          source={{ uri: item.image }}
          style={{ width: 90, height: 90 }}
          resizeMode="cover"
        />

        {/* Info */}
        <View style={{ flex: 1, padding: 12, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text numberOfLines={1} style={{ fontSize: 13, fontWeight: '700', color: '#111827' }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>
                {CATEGORY_EMOJI[item.category]} {item.category}
              </Text>
            </View>
            {/* Status badge */}
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: s.bg, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, gap: 4 }}>
              <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: s.dot }} />
              <Text style={{ fontSize: 9, fontWeight: '700', color: s.text, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {item.status}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#6366F1' }}>
                ₹{item.price.toLocaleString('en-IN')}
              </Text>
              <Text style={{ fontSize: 10, color: item.quantity === 0 ? '#EF4444' : '#9CA3AF', marginTop: 1 }}>
                {item.quantity === 0 ? 'Out of stock' : `${item.quantity} in stock`}
              </Text>
            </View>

            {/* Action buttons */}
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <TouchableOpacity
                onPress={onTogglePublish}
                style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: item.status === 'published' ? '#FFF7ED' : '#EEF2FF', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons
                  name={item.status === 'published' ? 'eye-off-outline' : 'eye-outline'}
                  size={15}
                  color={item.status === 'published' ? '#F97316' : '#6366F1'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onEdit}
                style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="pencil-outline" size={15} color="#8B5CF6" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onRemove}
                style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: '#FFF1F2', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="trash-outline" size={15} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ShopScreen() {
  const [items, setItems]             = useState(MOCK_ITEMS);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Form state
  const [formName,      setFormName]      = useState('');
  const [formPrice,     setFormPrice]     = useState('');
  const [formQty,       setFormQty]       = useState('');
  const [formCategory,  setFormCategory]  = useState('Electronics');
  const [formPublished, setFormPublished] = useState(true);

  const published   = items.filter((i) => i.status === 'published').length;
  const unpublished = items.filter((i) => i.status === 'unpublished').length;
  const draft       = items.filter((i) => i.status === 'draft').length;

  const filteredItems = filterStatus === 'all'
    ? items
    : items.filter((i) => i.status === filterStatus);

  const openAdd = () => {
    setEditingItem(null);
    setFormName(''); setFormPrice(''); setFormQty('');
    setFormCategory('Electronics'); setFormPublished(true);
    setModalVisible(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormPrice(String(item.price));
    setFormQty(String(item.quantity));
    setFormCategory(item.category);
    setFormPublished(item.status === 'published');
    setModalVisible(true);
  };

  const saveItem = () => {
    if (!formName.trim() || !formPrice || !formQty) return;
    if (editingItem) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editingItem.id
            ? { ...i, name: formName, price: parseFloat(formPrice), quantity: parseInt(formQty, 10), category: formCategory, status: formPublished ? 'published' : 'unpublished' }
            : i
        )
      );
    } else {
      setItems((prev) => [
        {
          id:       String(Date.now()),
          name:     formName,
          price:    parseFloat(formPrice),
          quantity: parseInt(formQty, 10),
          category: formCategory,
          status:   formPublished ? 'published' : 'unpublished',
          image:    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&q=80',
        },
        ...prev,
      ]);
    }
    setModalVisible(false);
  };

  const togglePublish = useCallback((id) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: i.status === 'published' ? 'unpublished' : 'published' }
          : i
      )
    );
  }, []);

  const removeItem = useCallback((id) => {
    Alert.alert('Remove Product?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setItems((prev) => prev.filter((i) => i.id !== id)) },
    ]);
  }, []);

  const FILTER_TABS = [
    { key: 'all',         label: `All (${items.length})`       },
    { key: 'published',   label: `Live (${published})`         },
    { key: 'unpublished', label: `Hidden (${unpublished})`     },
    { key: 'draft',       label: `Draft (${draft})`            },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── HEADER ── */}
      <View style={{ backgroundColor: '#6366F1', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <Text style={{ color: '#C7D2FE', fontSize: 12, marginBottom: 2 }}>Inventory</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>My Shop</Text>
          <TouchableOpacity
            onPress={openAdd}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 }}
          >
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[
            { val: published,   label: 'Published',   icon: 'eye-outline'     },
            { val: unpublished, label: 'Unpublished',  icon: 'eye-off-outline' },
            { val: draft,       label: 'Draft',        icon: 'document-outline'},
          ].map((s) => (
            <View key={s.label} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingVertical: 8, alignItems: 'center', gap: 2 }}>
              <Ionicons name={s.icon} size={13} color="rgba(255,255,255,0.7)" />
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>{s.val}</Text>
              <Text style={{ color: '#C7D2FE', fontSize: 10 }}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── FILTER TABS ── */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 2, gap: 6 }}
        style={{ flexGrow: 0 }}
      >
        {FILTER_TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setFilterStatus(t.key)}
            activeOpacity={0.75}
            style={{
              paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, marginRight: 6,
              backgroundColor: filterStatus === t.key ? '#6366F1' : '#fff',
              borderWidth: 0.5, borderColor: filterStatus === t.key ? '#6366F1' : '#E5E7EB',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: filterStatus === t.key ? '#fff' : '#6B7280' }}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── LIST ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingTop: 12, paddingBottom: 40 }}
      >
        {filteredItems.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>📦</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#9CA3AF' }}>No products here</Text>
            <Text style={{ fontSize: 11, color: '#D1D5DB', marginTop: 4 }}>Tap "Add" to get started</Text>
          </View>
        ) : (
          filteredItems.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              onEdit={() => openEdit(item)}
              onTogglePublish={() => togglePublish(item.id)}
              onRemove={() => removeItem(item.id)}
            />
          ))
        )}
      </ScrollView>

      {/* ── ADD / EDIT MODAL ── */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
                  {editingItem ? 'Edit Product' : 'Add New Product'}
                </Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>Fill in the details below</Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="close" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Name */}
            <Text style={inputStyles.label}>Item Name</Text>
            <TextInput
              style={inputStyles.input}
              placeholder="e.g. Wireless Headphones"
              placeholderTextColor="#9CA3AF"
              value={formName}
              onChangeText={setFormName}
            />

            {/* Price + Qty */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 0 }}>
              <View style={{ flex: 1 }}>
                <Text style={inputStyles.label}>Price (₹)</Text>
                <TextInput
                  style={inputStyles.input}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={formPrice}
                  onChangeText={setFormPrice}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={inputStyles.label}>Quantity</Text>
                <TextInput
                  style={inputStyles.input}
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={formQty}
                  onChangeText={setFormQty}
                />
              </View>
            </View>

            {/* Category */}
            <Text style={inputStyles.label}>Category</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setFormCategory(cat)}
                  style={{
                    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10,
                    backgroundColor: formCategory === cat ? '#6366F1' : '#F3F4F6',
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: formCategory === cat ? '600' : '400', color: formCategory === cat ? '#fff' : '#6B7280' }}>
                    {CATEGORY_EMOJI[cat]} {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Publish toggle */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <View>
                <Text style={{ fontSize: 13, fontWeight: '500', color: '#374151' }}>Published / Available</Text>
                <Text style={{ fontSize: 11, color: '#9CA3AF' }}>Show this item on your store</Text>
              </View>
              <TouchableOpacity
                onPress={() => setFormPublished((p) => !p)}
                style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: formPublished ? '#6366F1' : '#D1D5DB', justifyContent: 'center', padding: 2 }}
              >
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', alignSelf: formPublished ? 'flex-end' : 'flex-start', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }} />
              </TouchableOpacity>
            </View>

            {/* Save */}
            <TouchableOpacity
              onPress={saveItem}
              disabled={!formName.trim() || !formPrice || !formQty}
              style={{
                backgroundColor: '#6366F1', borderRadius: 14, paddingVertical: 14, alignItems: 'center',
                opacity: (!formName.trim() || !formPrice || !formQty) ? 0.4 : 1,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>
                {editingItem ? 'Save Changes' : 'Add Product'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const inputStyles = {
  label: { fontSize: 12, fontWeight: '500', color: '#6B7280', marginBottom: 6 },
  input: {
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#F3F4F6',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 13, color: '#111827', marginBottom: 14,
  },
};