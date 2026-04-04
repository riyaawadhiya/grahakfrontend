// app/(auth)/signIn.jsx
// ✅ UI UNCHANGED — only handleLogin wired to useLogin mutation

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLogin } from '../../src/hooks/useAuth';

export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const login = useLogin();   // ← React Query mutation

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }
    if (!agreedToTerms) {
      Alert.alert('Error', 'Please accept the terms to continue');
      return;
    }
    // Calls POST /auth/login → on success navigates to /(tabs)/home automatically
    login.mutate({ email, password });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0f172a]">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-12" keyboardShouldPersistTaps="handled">
          
          <View className="mb-10 items-center">
             <View className="mb-6 h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/10 border border-indigo-500/30">
                 <Feather name="hexagon" size={40} color="#818cf8" />
             </View>
             <Text className="text-3xl font-extrabold text-white tracking-tight">Sign In</Text>
             <Text className="mt-3 text-base text-slate-400 text-center px-4 leading-relaxed">
               Sign in to access your dashboard and continue your journey.
             </Text>
          </View>

          <View className="gap-y-5">
              <View>
                  <Text className="mb-2.5 text-sm font-semibold text-slate-300 ml-1 tracking-wide">EMAIL ADDRESS</Text>
                  <View className={`flex-row items-center rounded-2xl border bg-slate-900/50 px-4 py-4 ${isEmailFocused ? 'border-indigo-500' : 'border-slate-800'}`}>
                      <Feather name="mail" size={20} color={isEmailFocused ? "#818cf8" : "#64748b"} />
                      <TextInput
                          className="flex-1 ml-3 text-base text-white font-medium"
                          placeholder="name@example.com"
                          placeholderTextColor="#475569"
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          onFocus={() => setIsEmailFocused(true)}
                          onBlur={() => setIsEmailFocused(false)}
                      />
                  </View>
              </View>

              <View>
                  <Text className="mb-2.5 text-sm font-semibold text-slate-300 ml-1 tracking-wide">PASSWORD</Text>
                  <View className={`flex-row items-center rounded-2xl border bg-slate-900/50 px-4 py-4 ${isPasswordFocused ? 'border-indigo-500' : 'border-slate-800'}`}>
                      <Feather name="lock" size={20} color={isPasswordFocused ? "#818cf8" : "#64748b"} />
                      <TextInput
                          className="flex-1 ml-3 text-base text-white font-medium"
                          placeholder="••••••••"
                          placeholderTextColor="#475569"
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry
                          onFocus={() => setIsPasswordFocused(true)}
                          onBlur={() => setIsPasswordFocused(false)}
                      />
                  </View>
              </View>

              <View className="mt-2 flex-row items-center justify-between">
                  <TouchableOpacity className="flex-row items-center" onPress={() => setAgreedToTerms(!agreedToTerms)} activeOpacity={0.7}>
                      <View className={`mr-3 h-6 w-6 items-center justify-center rounded-lg border ${agreedToTerms ? 'border-indigo-500 bg-indigo-500' : 'border-slate-600 bg-slate-800'}`}>
                          {agreedToTerms && <Feather name="check" size={14} color="white" />}
                      </View>
                      <Text className="text-sm font-medium text-slate-300">Remember me</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7}>
                      <Text className="text-sm font-semibold text-indigo-400">Forgot Password?</Text>
                  </TouchableOpacity>
              </View>

              {/* Login Button — shows spinner while mutation is pending */}
              <TouchableOpacity
                  className="mt-6 flex-row w-full items-center justify-center rounded-2xl bg-indigo-600 py-4 shadow-lg shadow-indigo-600/30"
                  activeOpacity={0.8}
                  onPress={handleLogin}
                  disabled={login.isPending}
              >
                  {login.isPending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Text className="text-lg font-bold text-white tracking-wide">Sign In</Text>
                      <Feather name="arrow-right" size={20} color="white" style={{ marginLeft: 8 }} />
                    </>
                  )}
              </TouchableOpacity>
          </View>

          <View className="mt-12 flex-row items-center justify-center pt-8 border-t border-slate-800/80">
              <Text className="text-base text-slate-400">Don't have an account? </Text>
              <TouchableOpacity activeOpacity={0.7}>
                  <Text className="text-base font-bold text-indigo-400">Create one now</Text>
              </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}