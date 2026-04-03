import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../../src/components/ProductCard';
import StatCard from '../../src/components/StatCard';
import Badge from '../../src/components/Badge';
import { MOCK_ITEMS } from '../../src/utils/mockData';

const CATEGORIES = ['Electronics', 'Footwear', 'Clothing', 'Accessories', 'Home', 'Other'];

export default function ShopScreen() {
  const [items, setItems] = useState(MOCK_ITEMS);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form state
  const [formName, setFormName]         = useState('');
  const [formPrice, setFormPrice]       = useState('');
  const [formQty, setFormQty]           = useState('');
  const [formCategory, setFormCategory] = useState('Electronics');
  const [formPublished, setFormPublished] = useState(true);

  const published   = items.filter((i) => i.status === 'published').length;
  const unpublished = items.filter((i) => i.status === 'unpublished').length;
  const draft       = items.filter((i) => i.status === 'draft').length;

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
            ? { ...i, name: formName, price: parseFloat(formPrice), quantity: parseInt(formQty), category: formCategory, status: formPublished ? 'published' : 'unpublished' }
            : i
        )
      );
    } else {
      setItems((prev) => [
        {
          id: String(Date.now()),
          name: formName,
          price: parseFloat(formPrice),
          quantity: parseInt(formQty),
          category: formCategory,
          status: formPublished ? 'published' : 'unpublished',
          image: 'https://images.unsplash.com/photo-1758979792186-32a5da91f24d?w=300&q=80',
        },
        ...prev,
      ]);
    }
    setModalVisible(false);
  };

  const togglePublish = (id) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: i.status === 'published' ? 'unpublished' : 'published' } : i
      )
    );
  };

  const removeItem = (id) => {
    Alert.alert('Remove Product?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setItems((prev) => prev.filter((i) => i.id !== id)) },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── GRADIENT HEADER ── */}
      <View style={{ backgroundColor: '#6366F1', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <Text style={{ color: '#C7D2FE', fontSize: 12, marginBottom: 2 }}>Inventory</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>My Shop</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Ionicons name="cube-outline" size={15} color="rgba(255,255,255,0.8)" />
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{items.length} items</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          {[
            { val: published,   label: 'Published'   },
            { val: unpublished, label: 'Unpublished' },
            { val: draft,       label: 'Draft'       },
          ].map((s) => (
            <View key={s.label} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingVertical: 8, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>{s.val}</Text>
              <Text style={{ color: '#C7D2FE', fontSize: 11 }}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }}>
        {/* ── ADD BUTTON ── */}
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <TouchableOpacity
            onPress={openAdd}
            activeOpacity={0.87}
            style={{ backgroundColor: '#6366F1', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 4, shadowColor: '#6366F1', shadowOpacity: 0.35, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 38, height: 38, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="add" size={20} color="#fff" />
              </View>
              <View>
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Add New Product</Text>
                <Text style={{ color: '#C7D2FE', fontSize: 11 }}>Tap to add item to your shop</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
        </View>

        {/* ── SECTION HEADER ── */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827' }}>Product Listings</Text>
          <Badge label={`${items.length} items`} variant="indigo" />
        </View>

        {/* ── ITEM LIST ── */}
        {items.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>📦</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#9CA3AF' }}>No products yet</Text>
            <Text style={{ fontSize: 11, color: '#D1D5DB', marginTop: 4 }}>Tap "Add New Product" to get started</Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 16, gap: 10 }}>
            {items.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onEdit={() => openEdit(item)}
                onTogglePublish={() => togglePublish(item.id)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* ── ADD / EDIT MODAL ── */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} activeOpacity={1} onPress={() => setModalVisible(false)} />
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36 }}>
            {/* Modal Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>{editingItem ? 'Edit Product' : 'Add New Product'}</Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>Fill in the details below</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="close" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Name */}
            <Text style={styles.label}>Item Name</Text>
            <TextInput style={styles.input} placeholder="e.g. Wireless Headphones" value={formName} onChangeText={setFormName} />

            {/* Price + Qty */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Price (₹)</Text>
                <TextInput style={styles.input} placeholder="0.00" keyboardType="numeric" value={formPrice} onChangeText={setFormPrice} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput style={styles.input} placeholder="0" keyboardType="numeric" value={formQty} onChangeText={setFormQty} />
              </View>
            </View>

            {/* Category */}
            <Text style={styles.label}>Category</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setFormCategory(cat)}
                  style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: formCategory === cat ? '#6366F1' : '#F3F4F6' }}
                >
                  <Text style={{ fontSize: 12, fontWeight: formCategory === cat ? '600' : '400', color: formCategory === cat ? '#fff' : '#6B7280' }}>{cat}</Text>
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
              style={{ backgroundColor: '#6366F1', borderRadius: 14, paddingVertical: 14, alignItems: 'center', opacity: (!formName.trim() || !formPrice || !formQty) ? 0.4 : 1 }}
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

const styles = {
  label: { fontSize: 12, fontWeight: '500', color: '#6B7280', marginBottom: 6 },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13,
    color: '#111827',
    marginBottom: 14,
  },
};