// app/_layout.jsx  (Root layout)
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 min
      gcTime: 1000 * 60 * 10,     // 10 min
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
      refetchOnWindowFocus: false, // false is better for mobile
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Stack initialRouteName='(auth)' screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)"  options={{ headerShown: false }} />
          <Stack.Screen name="(pages)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)"  options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}