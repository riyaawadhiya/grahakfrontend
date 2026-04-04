import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ProductCard({ item, onEdit, onTogglePublish, onRemove }) {
  const isLive = item.status === 'live';

  return (
    <View style={styles.card}>
      {/* TOP SECTION */}
      <View style={styles.topRow}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

        <View style={styles.info}>
          {/* Name + Status Badge */}
          <View style={styles.nameRow}>
            <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
            <View style={[styles.badge, isLive ? styles.badgeLive : styles.badgeDraft]}>
              <View style={[styles.dot, { backgroundColor: isLive ? '#16a34a' : '#9ca3af' }]} />
              <Text style={[styles.badgeText, { color: isLive ? '#16a34a' : '#6b7280' }]}>
                {isLive ? 'Live' : 'Draft'}
              </Text>
            </View>
          </View>

          {/* Price */}
          <Text style={styles.price}>₹{item.price}</Text>

          {/* Category + Stock */}
          <View style={styles.metaRow}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            <Text style={styles.stock}>Stock: {item.stock}</Text>
          </View>
        </View>
      </View>

      {/* DIVIDER */}
      <View style={styles.divider} />

      {/* ACTION ROW */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
          <Feather name="edit-2" size={14} color="#7C3AED" />
          <Text style={[styles.actionText, { color: '#7C3AED' }]}>Edit</Text>
        </TouchableOpacity>

        <View style={styles.actionDivider} />

        <TouchableOpacity style={styles.actionBtn} onPress={onTogglePublish}>
          <Feather name={isLive ? 'eye-off' : 'eye'} size={14} color="#6b7280" />
          <Text style={[styles.actionText, { color: '#6b7280' }]}>
            {isLive ? 'Unpublish' : 'Publish'}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionDivider} />

        <TouchableOpacity style={styles.actionBtn} onPress={onRemove}>
          <Feather name="trash-2" size={14} color="#ef4444" />
          <Text style={[styles.actionText, { color: '#ef4444' }]}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    paddingBottom: 12,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
  },
  info: { flex: 1, minWidth: 0 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  badgeLive: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  badgeDraft: { backgroundColor: '#f9fafb', borderColor: '#e5e7eb' },
  dot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 12, fontWeight: '500' },
  price: { fontSize: 15, fontWeight: '500', color: '#7C3AED', marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  categoryPill: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
  },
  categoryText: { fontSize: 12, color: '#6b7280' },
  stock: { fontSize: 12, color: '#6b7280' },
  divider: { height: 0.5, backgroundColor: '#e5e7eb' },
  actionRow: { flexDirection: 'row' },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  actionDivider: { width: 0.5, backgroundColor: '#e5e7eb' },
  actionText: { fontSize: 13, fontWeight: '500' },
});