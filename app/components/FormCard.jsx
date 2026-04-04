import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export default function FormCard({ children }) {
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-50 dark:bg-[#09090b]"
    >
      <ScrollView contentContainerClassName="flex-grow justify-center px-4 sm:px-6 py-12" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View className="rounded-3xl bg-white dark:bg-slate-900 shadow-2xl shadow-indigo-500/5 dark:shadow-none border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
