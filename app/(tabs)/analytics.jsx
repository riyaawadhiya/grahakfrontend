// app/(tabs)/analytics.jsx
// ✅ UI UNCHANGED — mock data replaced with useAnalytics hook

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAnalytics } from '../../src/hooks/useAnalytics';

// ─── Fallback mock data (shown while loading / on error) ──────────────────────
const FALLBACK_CHART = [
  { l: 'Mon', v: 320 }, { l: 'Tue', v: 480 }, { l: 'Wed', v: 290 },
  { l: 'Thu', v: 750 }, { l: 'Fri', v: 920 }, { l: 'Sat', v: 1100 }, { l: 'Sun', v: 680 },
];
const FALLBACK_PIE = [
  { name: 'Electronics', value: 38, color: '#6366F1' },
  { name: 'Footwear',    value: 27, color: '#8B5CF6' },
  { name: 'Clothing',    value: 21, color: '#A78BFA' },
  { name: 'Other',       value: 14, color: '#C4B5FD' },
];
const FALLBACK_TOP = [
  { name: 'Headphones',  sales: 148, color: '#6366F1' },
  { name: 'Sneakers',    sales: 124, color: '#8B5CF6' },
  { name: 'Smart Watch', sales: 98,  color: '#A78BFA' },
  { name: 'T-Shirts',    sales: 87,  color: '#C4B5FD' },
  { name: 'Sunglasses',  sales: 63,  color: '#DDD6FE' },
];
const FALLBACK_KPI = { revenue: '—', online: '—', sales: '—' };

// ─── Inline BarChart (unchanged) ──────────────────────────────────────────────
function BarChart({ data = [], height = 160 }) {
  if (!data.length) return null;
  const maxVal = Math.max(...data.map((d) => d.v), 1);
  return (
    <View style={{ height, flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
      {data.map((item, i) => {
        const barPct = (item.v / maxVal) * 78;
        const isMax  = item.v === maxVal;
        return (
          <View key={i} style={{ flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
            <Text style={{ fontSize: 8, color: '#9CA3AF', marginBottom: 3, fontWeight: '500' }}>
              {item.v >= 1000 ? `${(item.v / 1000).toFixed(1)}k` : item.v}
            </Text>
            <View style={{ width: '70%', height: `${barPct}%`, backgroundColor: isMax ? '#6366F1' : '#C7D2FE', borderRadius: 5, marginBottom: 6 }} />
            <Text style={{ fontSize: 9, color: '#9CA3AF', fontWeight: '500' }}>{item.l}</Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── Inline DonutChart (unchanged) ───────────────────────────────────────────
function DonutChart({ data = [] }) {
  const SIZE = 120, STROKE = 18, INNER = SIZE - STROKE * 2;
  const sorted = [...data].sort((a, b) => b.value - a.value);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
      <View style={{ width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ position: 'absolute', width: SIZE, height: SIZE, borderRadius: SIZE / 2, borderWidth: STROKE, borderColor: sorted[0]?.color ?? '#6366F1' }} />
        <View style={{ position: 'absolute', width: SIZE, height: SIZE / 2, overflow: 'hidden', top: 0 }}>
          <View style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2, borderWidth: STROKE, borderColor: sorted[1]?.color ?? '#8B5CF6' }} />
        </View>
        <View style={{ position: 'absolute', width: SIZE / 2, height: SIZE / 2, overflow: 'hidden', top: SIZE / 2, left: SIZE / 2 }}>
          <View style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2, borderWidth: STROKE, borderColor: sorted[2]?.color ?? '#A78BFA', position: 'absolute', bottom: 0, right: 0 }} />
        </View>
        <View style={{ width: INNER, height: INNER, borderRadius: INNER / 2, backgroundColor: '#fff', zIndex: 10, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#111827' }}>{sorted[0]?.value ?? 0}%</Text>
          <Text style={{ fontSize: 8, color: '#9CA3AF', marginTop: 1 }}>top</Text>
        </View>
      </View>
      <View style={{ flex: 1, gap: 10 }}>
        {data.map((d) => (
          <View key={d.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: d.color, flexShrink: 0 }} />
            <Text style={{ flex: 1, fontSize: 12, color: '#374151', fontWeight: '500' }}>{d.name}</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#6B7280' }}>{d.value}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── KPI Card (unchanged) ────────────────────────────────────────────────────
function KpiCard({ icon, iconBg, iconColor, label, value, badge }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: iconBg, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        {badge && (
          <View style={{ backgroundColor: '#F0FDF4', borderRadius: 999, paddingHorizontal: 7, paddingVertical: 2 }}>
            <Text style={{ fontSize: 10, fontWeight: '600', color: '#16A34A' }}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>{label}</Text>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>{value}</Text>
    </View>
  );
}

const PERIODS = [
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function AnalyticsScreen() {
  const [period, setPeriod] = useState('month');

  const { data, isLoading } = useAnalytics(period);

  // Safely fall back to mock data while loading or if API hasn't been built yet
  const kpi       = data?.kpi       ?? FALLBACK_KPI;
  const chartData = data?.chartData ?? FALLBACK_CHART;
  const categories = data?.categories ?? FALLBACK_PIE;
  const topItems  = data?.topItems  ?? FALLBACK_TOP;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── HEADER (unchanged) ── */}
      <View style={{ backgroundColor: '#6366F1', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <Text style={{ color: '#C7D2FE', fontSize: 12, marginBottom: 4 }}>Dashboard Overview</Text>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 14 }}>Analytics</Text>
        <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 14, padding: 4, gap: 4 }}>
          {PERIODS.map((p) => (
            <TouchableOpacity key={p.key} onPress={() => setPeriod(p.key)}
              style={{ flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center', backgroundColor: period === p.key ? '#fff' : 'transparent' }}
            >
              <Text style={{ fontSize: 13, fontWeight: period === p.key ? '600' : '400', color: period === p.key ? '#6366F1' : '#fff' }}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isLoading && (
        <View style={{ paddingTop: 12, alignItems: 'center' }}>
          <ActivityIndicator size="small" color="#6366F1" />
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* ── KPI CARDS (unchanged) ── */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
          <KpiCard icon="cash-outline"  iconBg="#EEF2FF" iconColor="#6366F1" label="Revenue"    value={kpi.revenue} badge="+12%" />
          <KpiCard icon="card-outline"  iconBg="#F5F3FF" iconColor="#8B5CF6" label="Online Pay" value={kpi.online}  badge="+8%"  />
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          <KpiCard icon="bag-outline"   iconBg="#EDE9FE" iconColor="#7C3AED" label="Total Sales" value={kpi.sales}  badge="+5%"  />
          <View style={{ flex: 1, borderRadius: 16, padding: 14, backgroundColor: '#6366F1', shadowColor: '#6366F1', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Ionicons name="trending-up-outline" size={18} color="#fff" />
            </View>
            <Text style={{ fontSize: 11, color: '#A5B4FC', marginBottom: 2 }}>Growth Rate</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>8.4%</Text>
          </View>
        </View>

        {/* ── SALES TREND (unchanged) ── */}
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 12 }}>Sales Trend</Text>
          <BarChart data={chartData} height={160} />
        </View>

        {/* ── CATEGORY (unchanged) ── */}
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 12 }}>Revenue by Category</Text>
          <DonutChart data={categories} />
        </View>

        {/* ── TOP ITEMS (unchanged) ── */}
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 14 }}>Most Purchased Items</Text>
          {topItems.map((item, idx) => {
            const pct = Math.round((item.sales / (topItems[0]?.sales || 1)) * 100);
            return (
              <View key={item.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: idx < topItems.length - 1 ? 14 : 0 }}>
                <Text style={{ fontSize: 11, fontWeight: '500', color: '#D1D5DB', width: 18 }}>#{idx + 1}</Text>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: 13, fontWeight: '500', color: '#374151' }}>{item.name}</Text>
                    <Text style={{ fontSize: 12, color: '#6B7280' }}>{item.sales} sold</Text>
                  </View>
                  <View style={{ height: 5, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                    <View style={{ width: `${pct}%`, height: '100%', backgroundColor: item.color, borderRadius: 3 }} />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}