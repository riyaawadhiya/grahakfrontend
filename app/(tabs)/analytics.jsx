import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, DonutChart } from '../../src/components/Charts';
import { WEEKLY_DATA, MONTHLY_DATA, YEARLY_DATA, PIE_DATA } from '../../src/utils/mockData';

const PERIODS = [
  { key: 'week',  label: 'Week'  },
  { key: 'month', label: 'Month' },
  { key: 'year',  label: 'Year'  },
];

const KPI = {
  week:  { revenue: '₹4,820',   online: '₹3,140',  sales: '128' },
  month: { revenue: '₹18,540',  online: '₹12,380', sales: '512' },
  year:  { revenue: '₹2,14,600', online: '₹1,48,900', sales: '6,248' },
};

const CHART_DATA = { week: WEEKLY_DATA, month: MONTHLY_DATA, year: YEARLY_DATA };

const TOP_ITEMS = [
  { name: 'Headphones',  sales: 148, color: '#6366F1' },
  { name: 'Sneakers',    sales: 124, color: '#8B5CF6' },
  { name: 'Smart Watch', sales: 98,  color: '#A78BFA' },
  { name: 'T-Shirts',    sales: 87,  color: '#C4B5FD' },
  { name: 'Sunglasses',  sales: 63,  color: '#DDD6FE' },
];

function KpiCard({ icon, iconBg, iconColor, label, value, badge }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: iconBg, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        {badge && (
          <View style={{ backgroundColor: '#F0FDF4', borderRadius: 999, paddingHorizontal: 7, paddingVertical: 2 }}>
            <Text style={{ fontSize: 10, fontWeight: '600', color: '#00B14F' }}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>{label}</Text>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>{value}</Text>
    </View>
  );
}

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState('month');
  const kpi = KPI[period];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── GRADIENT HEADER ── */}
      <View style={{ backgroundColor: '#6366F1', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <Text style={{ color: '#C7D2FE', fontSize: 12, marginBottom: 4 }}>Dashboard Overview</Text>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 14 }}>Analytics</Text>

        {/* Period Toggle */}
        <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 14, padding: 4, gap: 4 }}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p.key}
              onPress={() => setPeriod(p.key)}
              style={{ flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center', backgroundColor: period === p.key ? '#fff' : 'transparent' }}
            >
              <Text style={{ fontSize: 13, fontWeight: period === p.key ? '600' : '400', color: period === p.key ? '#6366F1' : '#fff' }}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* ── KPI CARDS ── */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
          <KpiCard icon="cash-outline"       iconBg="#EEF2FF" iconColor="#6366F1" label="Revenue"     value={kpi.revenue} badge="+12%" />
          <KpiCard icon="card-outline"       iconBg="#F5F3FF" iconColor="#8B5CF6" label="Online Pay"  value={kpi.online}  badge="+8%"  />
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          <KpiCard icon="bag-outline"        iconBg="#EDE9FE" iconColor="#7C3AED" label="Total Sales" value={kpi.sales}   badge="+5%"  />
          <View style={{ flex: 1, borderRadius: 16, padding: 14, backgroundColor: '#6366F1', shadowColor: '#6366F1', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Ionicons name="trending-up-outline" size={18} color="#fff" />
            </View>
            <Text style={{ fontSize: 11, color: '#A5B4FC', marginBottom: 2 }}>Growth Rate</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>8.4%</Text>
          </View>
        </View>

        {/* ── SALES TREND ── */}
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 12 }}>Sales Trend</Text>
          <BarChart data={CHART_DATA[period]} height={160} />
        </View>

        {/* ── REVENUE BY CATEGORY ── */}
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 12 }}>Revenue by Category</Text>
          <DonutChart data={PIE_DATA} />
        </View>

        {/* ── TOP ITEMS ── */}
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 14 }}>Most Purchased Items</Text>
          {TOP_ITEMS.map((item, idx) => {
            const pct = Math.round((item.sales / TOP_ITEMS[0].sales) * 100);
            return (
              <View key={item.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: idx < TOP_ITEMS.length - 1 ? 14 : 0 }}>
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