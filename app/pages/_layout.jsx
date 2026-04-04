import { Stack } from 'expo-router';
import { createContext, useState, useContext } from 'react';

// Export context so it can be consumed
export const VendorContext = createContext(null);

export function useVendor() {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error('useVendor must be used within a VendorProvider');
  }
  return context;
}

export default function PagesLayout() {
  const [vendorData, setVendorData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    shopName: '',
    gst: '',
    address: '',
    photoUri: null,
  });

  const updateVendorData = (data) => {
    setVendorData((prev) => ({ ...prev, ...data }));
  };

  return (
    <VendorContext.Provider value={{ vendorData, updateVendorData }}>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="profile" />
        <Stack.Screen name="shopdetail" />
        <Stack.Screen name="verified" />
      </Stack>
    </VendorContext.Provider>
  );
}
