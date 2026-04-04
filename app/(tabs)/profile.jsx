// app/(tabs)/profile.jsx
// ✅ SELF-CONTAINED — no external deps. All state managed locally.

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar,
  Modal, TextInput, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const MENU_ITEMS = [
  { icon: 'storefront-outline',    label: 'Store Settings',     desc: 'Manage your store info',    iconBg: '#EEF2FF', iconColor: '#6366F1' },
  { icon: 'notifications-outline', label: 'Notifications',      desc: 'Order alerts & updates',    iconBg: '#F5F3FF', iconColor: '#8B5CF6', toggle: true },
  { icon: 'shield-outline',        label: 'Privacy & Security', desc: 'Password & data settings',  iconBg: '#EFF6FF', iconColor: '#3B82F6' },
  { icon: 'help-circle-outline',   label: 'Help & Support',     desc: 'FAQs and contact us',       iconBg: '#EDE9FE', iconColor: '#7C3AED' },
];

export default function ProfileScreen() {
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [editMode, setEditMode]               = useState(false);

  const [name,      setName]      = useState('Rohit Sharma');
  const [storeName, setStoreName] = useState('Sharma Store');
  const [email,     setEmail]     = useState('rohit@sharmastore.com');
  const [phone,     setPhone]     = useState('+91 98765 43210');
  const [location,  setLocation]  = useState('MP Nagar, Bhopal');

  const handleLogout = () =>
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => {} },
    ]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── HEADER ── */}
      <View style={{ backgroundColor: '#6366F1', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 16 }}>Profile</Text>

        <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ width: 60, height: 60, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' }}>
            <Text style={{ fontSize: 28 }}>🏪</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>{name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <Ionicons name="storefront-outline" size={12} color="#A5B4FC" />
              <Text style={{ color: '#A5B4FC', fontSize: 12 }}>{storeName}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <Ionicons name="location-outline" size={11} color="#C7D2FE" />
              <Text style={{ color: '#C7D2FE', fontSize: 11 }}>{location}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setEditMode(true)}
            style={{ width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="pencil-outline" size={15} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* ── STATS ── */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
          {[
            { icon: 'cube-outline',        iconBg: '#EEF2FF', iconColor: '#6366F1', val: '124',  label: 'Orders'  },
            { icon: 'star-outline',        iconBg: '#F5F3FF', iconColor: '#8B5CF6', val: '4.8',  label: 'Rating'  },
            { icon: 'trending-up-outline', iconBg: '#EDE9FE', iconColor: '#7C3AED', val: '+12%', label: 'Growth'  },
          ].map((s) => (
            <View key={s.label} style={{ flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 }}>
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: s.iconBg, alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                <Ionicons name={s.icon} size={16} color={s.iconColor} />
              </View>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827' }}>{s.val}</Text>
              <Text style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── ACCOUNT INFO ── */}
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 }}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1, marginBottom: 12 }}>ACCOUNT INFO</Text>
          {[
            { icon: 'mail-outline',     iconBg: '#EEF2FF', iconColor: '#6366F1', label: 'Email',    value: email    },
            { icon: 'call-outline',     iconBg: '#F5F3FF', iconColor: '#8B5CF6', label: 'Phone',    value: phone    },
            { icon: 'location-outline', iconBg: '#EDE9FE', iconColor: '#7C3AED', label: 'Location', value: location },
          ].map((row, i, arr) => (
            <React.Fragment key={row.label}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: row.iconBg, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={row.icon} size={14} color={row.iconColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 10, color: '#9CA3AF' }}>{row.label}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '500', color: '#374151' }}>{row.value}</Text>
                </View>
              </View>
              {i < arr.length - 1 && <View style={{ height: 1, backgroundColor: '#F9FAFB', marginVertical: 10 }} />}
            </React.Fragment>
          ))}
        </View>

        {/* ── MENU ITEMS ── */}
        <View style={{ backgroundColor: '#fff', borderRadius: 16, marginBottom: 14, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, overflow: 'hidden' }}>
          {MENU_ITEMS.map((item, i) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity
                activeOpacity={item.toggle ? 1 : 0.7}
                style={{ flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 }}
              >
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: item.iconBg, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={item.icon} size={17} color={item.iconColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '500', color: '#1F2937' }}>{item.label}</Text>
                  <Text style={{ fontSize: 11, color: '#9CA3AF' }}>{item.desc}</Text>
                </View>
                {item.toggle ? (
                  <TouchableOpacity
                    onPress={() => setNotificationsOn((p) => !p)}
                    style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: notificationsOn ? '#6366F1' : '#D1D5DB', justifyContent: 'center', padding: 2 }}
                  >
                    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', alignSelf: notificationsOn ? 'flex-end' : 'flex-start', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }} />
                  </TouchableOpacity>
                ) : (
                  <Ionicons name="chevron-forward" size={15} color="#D1D5DB" />
                )}
              </TouchableOpacity>
              {i < MENU_ITEMS.length - 1 && <View style={{ height: 1, backgroundColor: '#F9FAFB' }} />}
            </React.Fragment>
          ))}
        </View>

        {/* ── LOGOUT ── */}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.85}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, backgroundColor: '#FFF1F2', borderWidth: 1, borderColor: '#FECDD3' }}
        >
          <Ionicons name="log-out-outline" size={17} color="#EF4444" />
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#EF4444' }}>Log Out</Text>
        </TouchableOpacity>

        <Text style={{ textAlign: 'center', color: '#D1D5DB', fontSize: 11, marginTop: 16 }}>
          Version 1.0.0 • {storeName} Admin
        </Text>
      </ScrollView>

      {/* ── EDIT MODAL ── */}
      <Modal visible={editMode} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} activeOpacity={1} onPress={() => setEditMode(false)} />
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditMode(false)} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="close" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {[
              { label: 'Full Name',  value: name,      onChange: setName      },
              { label: 'Store Name', value: storeName,  onChange: setStoreName  },
              { label: 'Email',      value: email,      onChange: setEmail      },
              { label: 'Phone',      value: phone,      onChange: setPhone      },
              { label: 'Location',   value: location,   onChange: setLocation   },
            ].map((field) => (
              <View key={field.label} style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 11, fontWeight: '500', color: '#9CA3AF', marginBottom: 5 }}>{field.label}</Text>
                <TextInput
                  style={{ backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 13, color: '#111827' }}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            ))}

            <TouchableOpacity
              onPress={() => setEditMode(false)}
              style={{ backgroundColor: '#6366F1', borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 6 }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}