// src/components/ProductCard.jsx
// Used in: app/(tabs)/shop.jsx
// Product card in 2-column grid with availability toggle + cart add/remove.

import React, { memo, useCallback } from 'react';
import {
  View, Text, Image, Switch,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { useCart } from '../context/CartContext';
import QuantityControl from './QuantityControl';
import { formatPriceCompact } from '../utils/formatPrice';
import { GRID_PADDING, GRID_GAP, GRID_COLUMNS } from '../utils/constants';

// ── Card width calculation ────────────────────────────────────────────────────
const SCREEN_W = Dimensions.get('window').width;
export const CARD_WIDTH =
  (SCREEN_W - GRID_PADDING * 2 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

// ── Veg indicator dot ─────────────────────────────────────────────────────────
const VegDot = () => (
  <View
    style={{
      position:        'absolute',
      top:             8,
      left:            8,
      width:           16,
      height:          16,
      borderRadius:    2,
      borderWidth:     1.5,
      borderColor:     '#16a34a',
      backgroundColor: '#fff',
      alignItems:      'center',
      justifyContent:  'center',
    }}
  >
    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#16a34a' }} />
  </View>
);

// ── ProductCard ───────────────────────────────────────────────────────────────
/**
 * Props:
 *   product              { id, title, price, image, available }
 *   onToggleAvailability (productId: string) => void
 */
const ProductCard = memo(({ product, onToggleAvailability }) => {
  const { addToCart, removeFromCart, getQty } = useCart();
  const qty = getQty(product.id);

  const handleAdd    = useCallback(() => addToCart(product),             [addToCart, product]);
  const handleRemove = useCallback(() => removeFromCart(product.id),     [removeFromCart, product.id]);
  const handleToggle = useCallback(() => onToggleAvailability(product.id), [onToggleAvailability, product.id]);

  return (
    <View
      style={{
        width:           CARD_WIDTH,
        backgroundColor: '#ffffff',
        borderRadius:    16,
        overflow:        'hidden',
        marginBottom:    12,
        // iOS
        shadowColor:     '#000',
        shadowOffset:    { width: 0, height: 2 },
        shadowOpacity:   0.07,
        shadowRadius:    8,
        // Android
        elevation:       3,
      }}
    >
      {/* ── Image ── */}
      <View style={{ position: 'relative' }}>
        <Image
          source={product.image ? { uri: product.image } : require('../../assets/placeholder.png')}
          style={{ width: '100%', height: 130 }}
          resizeMode="cover"
        />

        <VegDot />

        {/* Unavailable dim overlay */}
        {!product.available && (
          <View
            style={{
              position:        'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.48)',
              alignItems:      'center',
              justifyContent:  'center',
            }}
          >
            <View
              style={{
                backgroundColor:   'rgba(0,0,0,0.6)',
                paddingHorizontal: 10,
                paddingVertical:   4,
                borderRadius:      20,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>Unavailable</Text>
            </View>
          </View>
        )}
      </View>

      {/* ── Body ── */}
      <View style={{ padding: 12 }}>

        {/* Title */}
        <Text numberOfLines={1} style={{ fontSize: 13, fontWeight: '700', color: '#111827' }}>
          {product.title}
        </Text>

        {/* Price */}
        <Text style={{ fontSize: 15, fontWeight: '800', color: '#4F46E5', marginTop: 2 }}>
          {formatPriceCompact(product.price)}
        </Text>

        {/* Availability toggle */}
        <View
          style={{
            flexDirection:     'row',
            alignItems:        'center',
            justifyContent:    'space-between',
            marginTop:         10,
            paddingTop:        10,
            borderTopWidth:    0.5,
            borderTopColor:    '#F3F4F6',
            marginBottom:      10,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: '600', color: product.available ? '#16a34a' : '#9CA3AF' }}>
            {product.available ? '● Available' : '○ Off'}
          </Text>
          <Switch
            value={product.available}
            onValueChange={handleToggle}
            trackColor={{ false: '#E5E7EB', true: '#C7D2FE' }}
            thumbColor={product.available ? '#4F46E5' : '#D1D5DB'}
            ios_backgroundColor="#E5E7EB"
            style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
          />
        </View>

        {/* Add button / Quantity control */}
        {qty === 0 ? (
          <TouchableOpacity
            onPress={handleAdd}
            disabled={!product.available}
            activeOpacity={0.75}
            style={{
              backgroundColor: product.available ? '#4F46E5' : '#E5E7EB',
              borderRadius:    10,
              paddingVertical: 8,
              alignItems:      'center',
            }}
            accessibilityLabel={`Add ${product.title} to cart`}
            accessibilityRole="button"
          >
            <Text style={{ color: product.available ? '#fff' : '#9CA3AF', fontWeight: '700', fontSize: 13 }}>
              + Add
            </Text>
          </TouchableOpacity>
        ) : (
          <QuantityControl qty={qty} onAdd={handleAdd} onRemove={handleRemove} size="sm" />
        )}
      </View>
    </View>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;r