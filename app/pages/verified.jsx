import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useVendor } from './_layout';

export default function Verified() {
  const [countdown, setCountdown] = useState(5);
  const [isDone, setIsDone] = useState(false);
  const [status, setStatus] = useState('');
  const { vendorData } = useVendor();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsDone(true);
      // Randomly simulate Pending or Verified
      setStatus(Math.random() > 0.5 ? 'Verified' : 'Pending');
    }
  }, [countdown]);

  return (
    <View className="flex-1 bg-white dark:bg-[#09090b] items-center justify-center px-6">
      {!isDone ? (
        <View className="items-center justify-center">
          <View className="h-32 w-32 rounded-full border-4 border-indigo-100 dark:border-indigo-900 items-center justify-center mb-8">
            <Text className="text-6xl font-black text-indigo-600 dark:text-indigo-400 animate-pulse">
              {countdown}
            </Text>
          </View>
          <Text className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 text-center tracking-tight">
            Verifying Details
          </Text>
          <Text className="mt-3 text-base text-slate-500 dark:text-slate-400 text-center px-4">
            {vendorData?.name ? `Please wait while we process the registration for ${vendorData.shopName || vendorData.name}.` : 'Please wait while we process your request.'}
          </Text>
        </View>
      ) : (
        <View className="items-center justify-center">
          {status === 'Verified' ? (
            <>
              <View className="h-28 w-28 rounded-full bg-green-100 dark:bg-green-900/30 items-center justify-center mb-6 shadow-xl shadow-green-500/20">
                <FontAwesome5 name="check" size={48} color="#16a34a" />
              </View>
              <Text className="text-3xl font-extrabold text-green-600 dark:text-green-500 mb-2 tracking-tight">Verified ✅</Text>
              <Text className="text-slate-500 dark:text-slate-400 text-center text-lg mt-2">Your shop is now active on our platform.</Text>
            </>
          ) : (
            <>
              <View className="h-28 w-28 rounded-full bg-orange-100 dark:bg-orange-900/30 items-center justify-center mb-6 shadow-xl shadow-orange-500/20">
                <Feather name="clock" size={48} color="#ea580c" />
              </View>
              <Text className="text-3xl font-extrabold text-orange-600 dark:text-orange-500 mb-2 tracking-tight">Verification Pending ⏳</Text>
              <Text className="text-slate-500 dark:text-slate-400 text-center text-lg px-4 mt-2">We are manually reviewing your GST details. This usually takes 24 hours.</Text>
            </>
          )}
        </View>
      )}
    </View>
  );
}
