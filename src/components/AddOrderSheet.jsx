import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import ItemCard from './ItemCard';
import { CATALOG } from '../utils/mockData.js';

const showToast = (msg) => {
  if (Platform.OS === 'android') ToastAndroid.show(msg, ToastAndroid.SHORT);
  else Alert.alert('', msg);
};

/**
 * Bottom sheet for creating a new order.
 * Exposes open() via ref.
 */
const AddOrderSheet = forwardRef(function AddOrderSheet({ onPlaceOrder }, ref) {
  const sheetRef  = useRef(null);
  const snapPoints = useMemo(() => ['70%', '92%'], []);

  const [cart, setCart] = useState({});

  useImperativeHandle(ref, () => ({
    open() {
      setCart({});
      sheetRef.current?.snapToIndex(0);
    },
    close() {
      sheetRef.current?.close();
    },
  }));

  const changeQty = useCallback((id, delta) => {
    setCart((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  }, []);

  const total = useMemo(
    () =>
      Object.entries(cart).reduce((sum, [id, qty]) => {
        const item = CATALOG.find((c) => c.id === id);
        return sum + (item ? item.price * qty : 0);
      }, 0),
    [cart]
  );

  const hasItems = total > 0;

  const handlePlace = useCallback(() => {
    if (!hasItems) return;
    const itemNames = Object.entries(cart)
      .map(([id, qty]) => {
        const item = CATALOG.find((c) => c.id === id);
        return item ? `${item.name} x${qty}` : null;
      })
      .filter(Boolean)
      .join(', ');
    onPlaceOrder({ items: itemNames, amount: total });
    sheetRef.current?.close();
    showToast('Order placed ✓');
  }, [cart, total, hasItems, onPlaceOrder]);

  const renderItem = useCallback(
    ({ item }) => (
      <ItemCard
        item={item}
        qty={cart[item.id] ?? 0}
        onAdd={() => changeQty(item.id, +1)}
        onRemove={() => changeQty(item.id, -1)}
      />
    ),
    [cart, changeQty]
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{ borderRadius: 24 }}
      handleIndicatorStyle={{ backgroundColor: '#D1D5DB', width: 36 }}
    >
      {/* Header */}
      <BottomSheetView className="flex-row justify-between items-center px-5 py-3 border-b border-gray-100">
        <Text className="text-base font-bold text-gray-900">New Order</Text>
        <View className="items-end">
          <Text className="text-[10px] text-gray-400 font-medium">TOTAL</Text>
          <Text className="text-lg font-extrabold text-indigo-600">₹{total}</Text>
        </View>
      </BottomSheetView>

      {/* Item list */}
      <BottomSheetFlatList
        data={CATALOG}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 10, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer CTA */}
      <BottomSheetView className="px-4 pb-8 pt-2 border-t border-gray-100">
        <TouchableOpacity
          onPress={handlePlace}
          disabled={!hasItems}
          activeOpacity={0.85}
          className={`w-full rounded-2xl py-4 items-center
            ${hasItems ? 'bg-indigo-600' : 'bg-gray-200'}`}
        >
          <Text
            className={`text-sm font-bold
              ${hasItems ? 'text-white' : 'text-gray-400'}`}
          >
            {hasItems ? `Place Order — ₹${total}` : 'Select items to place order'}
          </Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default AddOrderSheet;