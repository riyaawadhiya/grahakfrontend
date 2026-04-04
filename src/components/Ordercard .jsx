// src/components/OrderCard.jsx
// Used in: app/(tabs)/orders.jsx
// Displays a single incoming order with status badge + action buttons.

import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { STATUS_CONFIG, TERMINAL_STATUSES } from '../utils/constants';
import { formatPriceCompact } from '../utils/formatPrice';

// ── Sub-components ─────────────────────────────────────────────────────────────

/** Colored status pill */
const StatusBadge = memo(({ status }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <View
      style={{
        flexDirection:   'row',
        alignItems:      'center',
        backgroundColor: cfg.bg,
        borderRadius:    20,
        paddingHorizontal: 8,
        paddingVertical:   3,
        gap:             4,
      }}
    >
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: cfg.dot }} />
      <Text style={{ fontSize: 11, fontWeight: '600', color: cfg.text }}>
        {cfg.label}
      </Text>
    </View>
  );
});

/** Single action button */
const ActionBtn = memo(({ label, onPress, variant = 'outline' }) => {
  const isGhost   = variant === 'ghost';
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flex:            1,
        paddingVertical: 8,
        borderRadius:    10,
        alignItems:      'center',
        backgroundColor: isPrimary ? '#4F46E5' : isGhost ? '#FEE2E2' : '#F3F4F6',
        borderWidth:     0,
      }}
    >
      <Text
        style={{
          fontSize:   12,
          fontWeight: '700',
          color:      isPrimary ? '#fff' : isGhost ? '#B91C1C' : '#374151',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
});

// ── OrderCard ──────────────────────────────────────────────────────────────────

/**
 * Props:
 *   order          { id, orderNumber, customer, items, amount, time, isNew }
 *   resolvedStatus 'pending' | 'accepted' | 'completed' | 'rejected'
 *   onAccept       () => void
 *   onComplete     () => void
 *   onReject       () => void
 */
const OrderCard = memo(({
  order,
  resolvedStatus,
  onAccept,
  onComplete,
  onReject,
}) => {
  const isTerminal = TERMINAL_STATUSES.has(resolvedStatus);
  const isPending  = resolvedStatus === 'pending';
  const isAccepted = resolvedStatus === 'accepted';

  return (
    <View
      style={{
        backgroundColor: '#ffffff',
        borderRadius:    16,
        marginBottom:    12,
        overflow:        'hidden',
        // iOS shadow
        shadowColor:     '#000',
        shadowOffset:    { width: 0, height: 2 },
        shadowOpacity:   0.07,
        shadowRadius:    8,
        // Android
        elevation:       3,
      }}
    >
      {/* NEW ribbon */}
      {order.isNew && resolvedStatus === 'pending' && (
        <View
          style={{
            position:        'absolute',
            top:             0,
            right:           0,
            backgroundColor: '#4F46E5',
            paddingHorizontal: 10,
            paddingVertical:   3,
            borderBottomLeftRadius: 10,
            zIndex:          1,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 }}>
            NEW
          </Text>
        </View>
      )}

      {/* ── Card body ── */}
      <View style={{ padding: 14 }}>

        {/* Row 1: order number + status */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#111827' }}>
            {order.orderNumber}
          </Text>
          <StatusBadge status={resolvedStatus} />
        </View>

        {/* Row 2: customer */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 }}>
          <View
            style={{
              width:           26,
              height:          26,
              borderRadius:    13,
              backgroundColor: '#EEF2FF',
              alignItems:      'center',
              justifyContent:  'center',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#4F46E5' }}>
              {order.customer.charAt(0)}
            </Text>
          </View>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151' }}>
            {order.customer}
          </Text>
        </View>

        {/* Row 3: items list */}
        <View
          style={{
            backgroundColor: '#F9FAFB',
            borderRadius:    10,
            padding:         10,
            marginBottom:    10,
          }}
        >
          {order.items.map((item, idx) => (
            <Text
              key={idx}
              style={{ fontSize: 12, color: '#6B7280', lineHeight: 20 }}
            >
              • {item}
            </Text>
          ))}
        </View>

        {/* Row 4: amount + time */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#4F46E5' }}>
            {formatPriceCompact(order.amount)}
          </Text>
          <Text style={{ fontSize: 11, color: '#9CA3AF' }}>🕐 {order.time}</Text>
        </View>

        {/* ── Action buttons ── */}
        {!isTerminal && (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {/* Reject always visible while not terminal */}
            <ActionBtn label="Reject"   onPress={onReject}   variant="ghost"   />

            {isPending  && <ActionBtn label="Accept"   onPress={onAccept}   variant="primary" />}
            {isAccepted && <ActionBtn label="Complete" onPress={onComplete} variant="primary" />}
          </View>
        )}

        {/* Terminal state message */}
        {isTerminal && (
          <View style={{ alignItems: 'center', paddingTop: 4 }}>
            <Text style={{ fontSize: 12, color: '#9CA3AF', fontStyle: 'italic' }}>
              {resolvedStatus === 'completed' ? '✓ Order fulfilled' : '✗ Order rejected'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
});

OrderCard.displayName = 'OrderCard';
export default OrderCard;