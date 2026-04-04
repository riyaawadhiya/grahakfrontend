import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StatusBar, Alert, Modal, TextInput,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

// ── IMPORTANT ─────────────────────────────────────────────────────────────────
// DbConnection must come from the SDK, not from module_bindings directly.
// Your module_bindings re-exports a typed wrapper — we import both:
//   1. The typed DbConnection from your generated bindings (has .db / .reducers)
//   2. Fallback: raw SDK if bindings aren't set up yet
//
// Run: spacetime generate --lang typescript --out-dir src/module_bindings
// to regenerate bindings if missing.
import { DbConnection } from "../../src/module_bindings";
// If the above import fails, swap it for the raw SDK:
// import { DBConnection as DbConnection } from '@spacetimedb/sdk';

import ProductCard from '../../src/components/ProductCard';
import Badge from '../../src/components/Badge';
import * as MB from '../../src/module_bindings';
console.log('MB keys:', Object.keys(MB));

// ── CONFIG ────────────────────────────────────────────────────────────────────
const STDB_URI = 'wss://maincloud.spacetimedb.com';
const STDB_NAME = 'grahak';   // must match: spacetime publish <name>
const TOKEN_KEY = 'stdb_token';
const SHOP_ID_KEY = 'stdb_shop_id';

// In shop.jsx, find this const:
// const STDB_NAME = 'grahak';

// Then in your builder, it must be:
const builder = DbConnection.builder()
  .withUri(STDB_URI)
  .withDatabaseName(STDB_NAME) 

const CATEGORIES = ['All', 'Food', 'Beverage', 'Snack', 'Combo', 'Other'];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function paiseToRupees(paise) {
  return (Number(paise) / 100).toFixed(2);
}
function rupeesToPaise(rupees) {
  return BigInt(Math.round(parseFloat(rupees) * 100));
}

const Storage = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, String(value)),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function ShopScreen() {
  const [conn, setConn] = useState(null);
  const [connected, setConnected] = useState(false);
  const [shopId, setShopId] = useState(null);
  const [products, setProducts] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('Food');

  const [shopModalVisible, setShopModalVisible] = useState(false);
  const [shopName, setShopName] = useState('');

  // ── Connect ────────────────────────────────────────────────────────────────
  useEffect(() => {
    let connection;

    async function connect() {
      try {
        const savedToken = await Storage.getItem(TOKEN_KEY);
        const savedShopId = await Storage.getItem(SHOP_ID_KEY);
        if (savedShopId) setShopId(BigInt(savedShopId));

        // Guard: wait a tick for module to fully initialize
        if (!DbConnection?.builder) {
          console.warn('DbConnection not ready yet');
          return;
        }

        const builder = DbConnection.builder()
          .withUri(STDB_URI)
          .withDatabaseName(STDB_NAME)   // ← correct method
          .onConnect(async (_conn, _identity, token) => {
            console.log('✅ SpacetimeDB connected');
            await Storage.setItem(TOKEN_KEY, token);
            setConnected(true);
          })
          .onDisconnect(() => {
            setConnected(false);
          })
          .onConnectError((err) => {
            Alert.alert('Connection Error', String(err?.message ?? err));
          });

        if (savedToken) builder.withToken(savedToken);

        connection = builder.build();
        setConn(connection);

      } catch (err) {
        console.error('connect() threw:', err);
        // Don't Alert here — it's noisy on first load
        // Alert.alert('Error', String(err?.message ?? err));
      }
    }

    // Small delay so JS module registry fully loads before calling builder
    const timer = setTimeout(connect, 0);
    return () => {
      clearTimeout(timer);
      connection?.disconnect?.();
    };
  }, []);
  // ── Subscribe: products ────────────────────────────────────────────────────
  useEffect(() => {
    if (!conn || !connected || !shopId) return;

    conn.subscriptionBuilder()
      .subscribe(`SELECT * FROM products WHERE shop_id = ${shopId}`);

    const unsubInsert = conn.db.products.onInsert((_ctx, product) => {
      if (product.shop_id === shopId)
        setProducts(prev => [product, ...prev]);
    });
    const unsubUpdate = conn.db.products.onUpdate((_ctx, _old, updated) => {
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    });
    const unsubDelete = conn.db.products.onDelete((_ctx, deleted) => {
      setProducts(prev => prev.filter(p => p.id !== deleted.id));
    });

    return () => { unsubInsert?.(); unsubUpdate?.(); unsubDelete?.(); };
  }, [conn, connected, shopId]);

  // ── Subscribe: shops (to catch our own shop after createShop) ─────────────
  useEffect(() => {
    if (!conn || !connected) return;

    conn.subscriptionBuilder().subscribe('SELECT * FROM shops');

    const unsub = conn.db.shops.onInsert(async (_ctx, shop) => {
      const id = shop.id;
      await Storage.setItem(SHOP_ID_KEY, id.toString());
      setShopId(id);
    });

    return () => { unsub?.(); };
  }, [conn, connected]);

  // ── Reducers ───────────────────────────────────────────────────────────────
  const handleCreateShop = useCallback(async () => {
    if (!conn || !shopName.trim()) return;
    try {
      await conn.reducers.createShop(shopName.trim());
      setShopModalVisible(false);
      setShopName('');
    } catch (e) {
      Alert.alert('Error', e.message ?? 'Could not create shop');
    }
  }, [conn, shopName]);

  const handleAddProduct = useCallback(async () => {
    if (!conn || !shopId || !formName.trim() || !formPrice) return;
    try {
      await conn.reducers.addProduct(shopId, formName.trim(), rupeesToPaise(formPrice));
      setModalVisible(false);
      resetForm();
    } catch (e) {
      Alert.alert('Error', e.message ?? 'Could not add product');
    }
  }, [conn, shopId, formName, formPrice]);

  const handleRemoveProduct = useCallback((product) => {
    Alert.alert('Remove Product?', `Remove "${product.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: () => setProducts(prev => prev.filter(p => p.id !== product.id)),
      },
    ]);
  }, []);

  function resetForm() {
    setEditingProduct(null);
    setFormName('');
    setFormPrice('');
    setFormCategory('Food');
  }
  function openAdd() { resetForm(); setModalVisible(true); }
  function openEdit(product) {
    setEditingProduct(product);
    setFormName(product.name);
    setFormPrice(paiseToRupees(product.price));
    setFormCategory('Food');
    setModalVisible(true);
  }

  const totalRevenue = products.reduce((sum, p) => sum + Number(p.price), 0) / 100;

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (!connected) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={{ marginTop: 12, color: '#6B7280', fontSize: 13 }}>Connecting to server...</Text>
      </SafeAreaView>
    );
  }

  // ── Create shop screen ─────────────────────────────────────────────────────
  if (!shopId) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 8 }}>Welcome to QRDine</Text>
        <Text style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginBottom: 32 }}>
          Create your shop to start managing products and orders.
        </Text>
        <TouchableOpacity
          onPress={() => setShopModalVisible(true)}
          style={{ backgroundColor: '#6366F1', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 32 }}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Create My Shop</Text>
        </TouchableOpacity>

        <Modal visible={shopModalVisible} animationType="slide" transparent>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} activeOpacity={1} onPress={() => setShopModalVisible(false)} />
            <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 16 }}>Name your shop</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Sharma Ji Ka Dhaba"
                value={shopName}
                onChangeText={setShopName}
                autoFocus
              />
              <TouchableOpacity
                onPress={handleCreateShop}
                disabled={!shopName.trim()}
                style={{ backgroundColor: '#6366F1', borderRadius: 14, paddingVertical: 14, alignItems: 'center', opacity: shopName.trim() ? 1 : 0.4 }}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Create Shop</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    );
  }

  // ── Main screen ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={{ backgroundColor: '#6366F1', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <Text style={{ color: '#C7D2FE', fontSize: 12, marginBottom: 2 }}>Inventory · Live</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>My Shop</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#4ADE80' }} />
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{products.length} products</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          {[
            { val: products.length, label: 'Total' },
            { val: `₹${totalRevenue.toFixed(0)}`, label: 'Menu Value' },
            { val: `#${shopId.toString()}`, label: 'Shop ID' },
          ].map((s) => (
            <View key={s.label} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingVertical: 8, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>{String(s.val)}</Text>
              <Text style={{ color: '#C7D2FE', fontSize: 11 }}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }}>
        {/* Add product button */}
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 38, height: 38, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="add" size={20} color="#fff" />
              </View>
              <View>
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Add New Product</Text>
                <Text style={{ color: '#C7D2FE', fontSize: 11 }}>Syncs to all customers instantly</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
        ))}
      </ScrollView>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827' }}>Product Listings</Text>
          <Badge label={`${products.length} items`} variant="indigo" />
        </View>

        {products.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>📦</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#9CA3AF' }}>No products here</Text>
            <Text style={{ fontSize: 11, color: '#D1D5DB', marginTop: 4 }}>Tap "Add" to get started</Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 16, gap: 10 }}>
            {products.map((product) => (
              <ProductCard
                key={product.id.toString()}
                item={{
                  id: product.id.toString(),
                  name: product.name,
                  price: Number(product.price) / 100,
                  quantity: 1,
                  category: 'Food',
                  status: 'published',
                  image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80',
                }}
                onEdit={() => openEdit(product)}
                onTogglePublish={() => { }}
                onRemove={() => handleRemoveProduct(product)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Product Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>Changes sync instantly to customers</Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="close" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Item Name</Text>
            <TextInput style={styles.input} placeholder="e.g. Paneer Butter Masala" value={formName} onChangeText={setFormName} />

            <Text style={styles.label}>Price (₹)</Text>
            <TextInput style={styles.input} placeholder="e.g. 150.00" keyboardType="decimal-pad" value={formPrice} onChangeText={setFormPrice} />

            <Text style={styles.label}>Category</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {CATEGORIES.filter(c => c !== 'All').map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setFormCategory(cat)}
                  style={{
                    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10,
                    backgroundColor: formCategory === cat ? '#6366F1' : '#F3F4F6',
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: formCategory === cat ? '600' : '400', color: formCategory === cat ? '#fff' : '#6B7280' }}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleAddProduct}
              disabled={!formName.trim() || !formPrice}
              style={{ backgroundColor: '#6366F1', borderRadius: 14, paddingVertical: 14, alignItems: 'center', opacity: (!formName.trim() || !formPrice) ? 0.4 : 1 }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>
                {editingProduct ? 'Save Changes' : 'Add Product'}
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