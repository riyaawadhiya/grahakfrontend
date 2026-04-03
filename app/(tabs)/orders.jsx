import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import OrderCard from '@/components/OrderCard';
import AddOrderSheet from '@/components/AddOrderSheet';
import { MOCK_ORDERS } from '../../src/utils/mockData.js';
import { FILTERS } from '../../src/utils/constants.js';

const showToast = (msg) => {
  if (Platform.OS === 'android') ToastAndroid.show(msg, ToastAndroid.SHORT);
  else Alert.alert('', msg);
};

let _idSeq = MOCK_ORDERS.length;

export default function OrdersScreen() {
  const sheetRef = useRef(null);

  const [orders,      setOrders]      = useState(MOCK_ORDERS);
  const [orderStates, setOrderStates] = useState({});
  const [filter,      setFilter]      = useState('all');
  const [search,      setSearch]      = useState('');

  /* ── helpers ── */
  const getStatus = useCallback(
    (order) => orderStates[order.id] ?? order.status,
    [orderStates]
  );

  const setStatus = useCallback((id, status) => {
    setOrderStates((prev) => ({ ...prev, [id]: status }));
    const labels = { accepted: 'Order accepted ✓', completed: 'Order completed ✓', rejected: 'Order rejected' };
    showToast(labels[status] ?? status);
  }, []);

  const pendingCount = useMemo(
    () => orders.filter((o) => getStatus(o) === 'pending').length,
    [orders, getStatus]
  );

  /* ── filtered + sorted list (descending by id) ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders
      .filter((o) => {
        const s = getStatus(o);
        const matchFilter =
          filter === 'all'     ? true :
          filter === 'pending' ? s === 'pending' || s === 'accepted' :
          s === filter;
        const matchSearch =
          o.customer.toLowerCase().includes(q) ||
          o.orderNumber.toLowerCase().includes(q);
        return matchFilter && matchSearch;
      })
      .sort((a, b) => b.id - a.id);
  }, [orders, orderStates, filter, search, getStatus]);

  /* ── place new order ── */
  const handlePlaceOrder = useCallback(({ items, amount }) => {
    _idSeq += 1;
    const newOrder = {
      id:          _idSeq,
      orderNumber: `ORD-${String(1000 + _idSeq).padStart(4, '0')}`,
      customer:    'Walk-in Customer',
      items,
      amount,
      time:        'Just now',
      status:      'pending',
      isNew:       true,
    };
    setOrders((prev) => [newOrder, ...prev]);
  }, []);

  /* ── render items ── */
  const renderOrder = useCallback(
    ({ item }) => (
      <OrderCard
        order={item}
        resolvedStatus={getStatus(item)}
        onAccept={()   => setStatus(item.id, 'accepted')}
        onComplete={() => setStatus(item.id, 'completed')}
        onReject={()   => setStatus(item.id, 'rejected')}
      />
    ),
    [getStatus, setStatus]
  );

  const ListEmpty = useCallback(
    () => (
      <View className="items-center pt-16">
        <Text style={{ fontSize: 40 }}>📭</Text>
        <Text className="text-sm font-semibold text-gray-400 mt-3">No orders found</Text>
        <Text className="text-xs text-gray-300 mt-1">Try a different filter</Text>
      </View>
    ),
    []
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* ── HEADER ── */}
        <View className="bg-indigo-600 px-5 pt-4 pb-6 rounded-b-3xl">
          <View className="flex-row justify-between items-center mb-3.5">
            <View>
              <Text className="text-indigo-200 text-xs mb-0.5">Vendor Dashboard</Text>
              <Text className="text-white text-2xl font-bold">Orders</Text>
            </View>
            {pendingCount > 0 && (
              <View className="flex-row items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5">
                <View className="w-2 h-2 rounded-full bg-amber-400" />
                <Text className="text-white text-xs font-medium">{pendingCount} pending</Text>
              </View>
            )}
          </View>

          {/* Search */}
          <View className="flex-row items-center bg-white/15 rounded-xl px-3 py-2.5 gap-2">
            <Ionicons name="search-outline" size={15} color="#A5B4FC" />
            <TextInput
              className="flex-1 text-white text-xs"
              placeholder="Search orders or customers..."
              placeholderTextColor="#A5B4FC"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={15} color="#A5B4FC" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── FILTER CHIPS ── */}
        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={(f) => f.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 14, paddingVertical: 10, gap: 7 }}
          renderItem={({ item: f }) => {
            const active = filter === f.key;
            const label  = f.key === 'pending' && pendingCount > 0
              ? `${f.label} (${pendingCount})` : f.label;
            return (
              <TouchableOpacity
                onPress={() => setFilter(f.key)}
                activeOpacity={0.8}
                className={`px-3.5 py-1.5 rounded-full
                  ${active ? 'bg-indigo-600' : 'bg-gray-100'}`}
              >
                <Text className={`text-[11px] font-${active ? '600' : '400'}
                  ${active ? 'text-white' : 'text-gray-500'}`}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* ── ORDER LIST ── */}
        <FlatList
          data={filtered}
          keyExtractor={(o) => String(o.id)}
          renderItem={renderOrder}
          ListEmptyComponent={ListEmpty}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 100 }}
        />

        {/* ── FAB ── */}
        <TouchableOpacity
          onPress={() => sheetRef.current?.open()}
          activeOpacity={0.85}
          className="absolute bottom-6 right-5 w-14 h-14 bg-indigo-600 rounded-full
            items-center justify-center"
          style={{ elevation: 6, shadowColor: '#4F46E5', shadowOpacity: 0.45, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
          accessibilityLabel="Add new order"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>

        {/* ── BOTTOM SHEET ── */}
        <AddOrderSheet ref={sheetRef} onPlaceOrder={handlePlaceOrder} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}