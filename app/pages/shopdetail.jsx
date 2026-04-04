import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import FormCard from '../components/FormCard';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { useVendor } from './_layout';
import { useState } from 'react';

export default function ShopDetail() {
  const router = useRouter();
  const { vendorData, updateVendorData } = useVendor();
  const [photoUri, setPhotoUri] = useState(vendorData.photoUri);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      shopName: '',
      gst: '',
      address: '',
    }
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const onSubmit = (data) => {
    updateVendorData({ ...data, photoUri });
    router.push('/pages/verified');
  };

  return (
    <FormCard>
      <View className="mb-6 mt-2">
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 border border-indigo-600/20">
          <FontAwesome5 name="store" size={24} color="#4f46e5" />
        </View>
        <Text className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Shop Details</Text>
        <Text className="mt-2 text-base text-slate-500 dark:text-slate-400 font-medium">
          Step 2: Tell us about your business.
        </Text>
      </View>

      {/* Photo Upload Section */}
      <View className="mb-6 items-center">
        <TouchableOpacity
          onPress={pickImage}
          activeOpacity={0.8}
          className="items-center justify-center h-28 w-28 rounded-full border-2 border-dashed border-indigo-300 dark:border-indigo-500/50 bg-slate-50 dark:bg-slate-900 overflow-hidden"
        >
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={{ width: '100%', height: '100%' }} />
          ) : (
            <View className="items-center">
              <Feather name="camera" size={28} color="#6366f1" />
              <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Upload</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <InputField
        control={control}
        name="shopName"
        label="Shop Name"
        placeholder="Enter shop name"
        iconName="briefcase"
        rules={{ required: 'Shop name is required' }}
      />

      <InputField
        control={control}
        name="gst"
        label="GST Number"
        placeholder="15 char alphanumeric"
        iconName="file-text"
        rules={{
          required: 'GST Number is required',
          pattern: { value: /^[A-Za-z0-9]{15}$/, message: 'Must be exactly 15 alphanumeric characters' }
        }}
      />

      <InputField
        control={control}
        name="address"
        label="Shop Address"
        placeholder="Enter full address"
        iconName="map-pin"
        multiline={true}
        rules={{ required: 'Address is required' }}
      />

      <View className="mt-6 flex-row justify-between">
        <PrimaryButton
          title="Back"
          onPress={() => router.back()}
          iconLeft="arrow-left"
          variant="secondary"
          className="flex-1 mr-2"
        />
        <PrimaryButton
          title="Finish"
          onPress={handleSubmit(onSubmit)}
          iconRight="check-circle"
          className="flex-1 ml-2"
        />
      </View>
    </FormCard>
  );
}
