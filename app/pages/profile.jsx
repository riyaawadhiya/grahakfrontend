import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { FontAwesome5 } from '@expo/vector-icons';
import FormCard from '../components/FormCard';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { useVendor } from './_layout';

export default function Profile() {
  const router = useRouter();
  const { vendorData, updateVendorData } = useVendor();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
    }
  });

  const onSubmit = (data) => {
    updateVendorData(data);
    router.push('/pages/shopdetail');
  };

  return (
    <FormCard>
      <View className="mb-8 mt-2">
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 border border-indigo-600/20">
          <FontAwesome5 name="user-tie" size={26} color="#4f46e5" />
        </View>
        <Text className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">User Details</Text>
        <Text className="mt-2 text-base text-slate-500 dark:text-slate-400 font-medium">
          Step 1: Let's start with your personal info.
        </Text>
      </View>

      <InputField
        control={control}
        name="name"
        label="Full Name"
        placeholder="Enter your name"
        iconName="user"
        rules={{ required: 'Name is required' }}
      />

      <InputField
        control={control}
        name="phone"
        label="Phone Number"
        placeholder="10-digit mobile number"
        iconName="phone"
        keyboardType="numeric"
        rules={{
          required: 'Phone number is required',
          pattern: { value: /^[0-9]{10}$/, message: 'Must be exactly 10 digits' }
        }}
      />

      <InputField
        control={control}
        name="email"
        label="Email Address"
        placeholder="name@example.com"
        iconName="mail"
        keyboardType="email-address"
        rules={{
          required: 'Email is required',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email format' }
        }}
      />

      <InputField
        control={control}
        name="password"
        label="Password"
        placeholder="••••••••"
        iconName="lock"
        secureTextEntry
        rules={{ required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } }}
      />

      <View className="mt-6 flex-row justify-end">
        <PrimaryButton
          title="Next"
          onPress={handleSubmit(onSubmit)}
          iconRight="arrow-right"
          className="px-8"
        />
      </View>
    </FormCard>
  );
}
