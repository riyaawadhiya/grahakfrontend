import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Focus states
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    // Logic for authenticating the user
    router.replace('/pages/profile');
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#09090b]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerClassName="flex-grow px-6 pt-16 pb-12" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Header Section */}
          <View className="mb-12 mt-8">
            <View className="mb-6 h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-600/20 shadow-sm shadow-blue-500/20">
              <FontAwesome5 name="bolt" size={30} color="#2563eb" />
            </View>
            <Text className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Log In to Your Account</Text>
            <Text className="mt-3 text-lg text-slate-500 dark:text-slate-400 font-medium">
              Welcome back, you've been missed!
            </Text>
          </View>


          {/* Form Section */}
          <View className="gap-y-6">

            {/* Email Input */}
            <View>
              <Text className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 tracking-wide uppercase">Email Account</Text>
              <View
                className={`flex-row items-center rounded-2xl border bg-slate-50 dark:bg-slate-900/50 px-4 py-4 transition-all ${isEmailFocused ? 'border-blue-500 bg-white shadow-sm shadow-blue-500/10' : 'border-slate-200 dark:border-slate-800'
                  }`}
              >
                <Feather name="mail" size={22} color={isEmailFocused ? "#3b82f6" : "#94a3b8"} />
                <TextInput
                  className="flex-1 ml-3 text-base text-slate-900 dark:text-white font-medium"
                  placeholder="example@email.com"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                />
              </View>
            </View>

            {/* Password Input */}
            <View>
              <Text className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 tracking-wide uppercase">Password</Text>
              <View
                className={`flex-row items-center rounded-2xl border bg-slate-50 dark:bg-slate-900/50 px-4 py-4 transition-all ${isPasswordFocused ? 'border-blue-500 bg-white shadow-sm shadow-blue-500/10' : 'border-slate-200 dark:border-slate-800'
                  }`}
              >
                <Feather name="lock" size={22} color={isPasswordFocused ? "#3b82f6" : "#94a3b8"} />
                <TextInput
                  className="flex-1 ml-3 text-base text-slate-900 dark:text-white font-medium"
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="p-1"
                  activeOpacity={0.7}
                >
                  <Feather name={isPasswordVisible ? "eye" : "eye-off"} size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <View className="flex-row justify-end mt-1">
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-sm font-bold text-blue-600 dark:text-blue-500">Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="mt-2 flex-row w-full items-center justify-center rounded-2xl bg-blue-600 py-4 shadow-xl shadow-blue-600/40 active:bg-blue-700"
              activeOpacity={0.8}
              onPress={handleLogin}
            >
              <Text className="text-lg font-bold text-white tracking-wide mr-2">Log In</Text>
              <Feather name="arrow-right" size={22} color="white" />
            </TouchableOpacity>
          </View>

          {/* Social Logins */}
          <View className="mt-10">
            <View className="flex-row items-center justify-center mb-6">
              <View className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800" />
              <Text className="mx-4 text-sm font-medium text-slate-500">Or continue with</Text>
              <View className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800" />
            </View>

            <View className="flex-row justify-between gap-x-4">
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3.5 shadow-sm"
                activeOpacity={0.7}
              >
                <FontAwesome5 name="google" size={18} color="#ea4335" />
                <Text className="ml-3 font-bold text-slate-700 dark:text-slate-300">Google</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3.5 shadow-sm"
                activeOpacity={0.7}
              >
                <FontAwesome5 name="apple" size={20} color={Platform.OS === 'ios' ? '#000' : '#888'} />
                <Text className="ml-3 font-bold text-slate-700 dark:text-slate-300">Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View className="mt-12 flex-row items-center justify-center">
            <Text className="text-base font-medium text-slate-500">Don't have an account? </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/pages/profile')}>
              <Text className="text-base font-extrabold text-blue-600 dark:text-blue-500">Register</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
