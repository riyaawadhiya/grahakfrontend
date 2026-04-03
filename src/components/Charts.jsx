import React from 'react';
import { View, Text } from 'react-native';

const GREEN = '#00B14F';

/* ─────────────────────────────────────────
   BarChart
   props:
     data   — [{ l: string, v: number }]
     height — number (default 160)
───────────────────────────────────────── */
export function BarChart({ data = [], height = 160 }) {
  if (!data.length) return null;
  const maxVal = Math.max(...data.map((d) => d.v), 1);

  return (
    <View style={{ height, flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
      {data.map((item, i) => {
        const barPct = (item.v / maxVal) * 78;
        const isMax  = item.v === maxVal;

        return (
          <View
            key={i}
            style={{ flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}
          >
            {/* value label */}
            <Text style={{ fontSize: 8, color: '#9CA3AF', marginBottom: 3, fontWeight: '500' }}>
              {item.v >= 1000 ? `${(item.v / 1000).toFixed(1)}k` : item.v}
            </Text>

            {/* bar */}
            <View
              style={{
                width: '70%',
                height: `${barPct}%`,
                backgroundColor: isMax ? GREEN : '#D1FAE5',
                borderRadius: 5,
                marginBottom: 6,
              }}
            />

            {/* x-axis label */}
            <Text style={{ fontSize: 9, color: '#9CA3AF', fontWeight: '500' }}>
              {item.l}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

/* ─────────────────────────────────────────
   DonutChart
   props:
     data — [{ name: string, value: number, color: string }]
───────────────────────────────────────── */
export function DonutChart({ data = [] }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
      {/* donut visual */}
      <View style={{ width: 120, height: 120, alignItems: 'center', justifyContent: 'center' }}>
        <SegmentRing data={data} />
      </View>

      {/* legend */}
      <View style={{ flex: 1, gap: 10 }}>
        {data.map((d) => (
          <View key={d.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                backgroundColor: d.color,
                flexShrink: 0,
              }}
            />
            <Text style={{ flex: 1, fontSize: 12, color: '#374151', fontWeight: '500' }}>
              {d.name}
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#6B7280' }}>
              {d.value}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function SegmentRing({ data }) {
  const SIZE   = 120;
  const STROKE = 18;
  const INNER  = SIZE - STROKE * 2;
  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <View
      style={{
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* outer ring — dominant colour */}
      <View
        style={{
          position: 'absolute',
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          borderWidth: STROKE,
          borderColor: sorted[0]?.color ?? GREEN,
        }}
      />

      {/* second segment */}
      <View
        style={{
          position: 'absolute',
          width: SIZE,
          height: SIZE / 2,
          overflow: 'hidden',
          top: 0,
        }}
      >
        <View
          style={{
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            borderWidth: STROKE,
            borderColor: sorted[1]?.color ?? '#6EE7B7',
          }}
        />
      </View>

      {/* third segment */}
      <View
        style={{
          position: 'absolute',
          width: SIZE / 2,
          height: SIZE / 2,
          overflow: 'hidden',
          top: SIZE / 2,
          left: SIZE / 2,
        }}
      >
        <View
          style={{
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            borderWidth: STROKE,
            borderColor: sorted[2]?.color ?? '#A7F3D0',
            position: 'absolute',
            bottom: 0,
            right: 0,
          }}
        />
      </View>

      {/* centre hole */}
      <View
        style={{
          width: INNER,
          height: INNER,
          borderRadius: INNER / 2,
          backgroundColor: '#fff',
          zIndex: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: '700', color: '#111827' }}>
          {sorted[0]?.value ?? 0}%
        </Text>
        <Text style={{ fontSize: 8, color: '#9CA3AF', marginTop: 1 }}>top</Text>
      </View>
    </View>
  );
}