import { TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function PrimaryButton({ onPress, title, iconRight, iconLeft, variant = 'primary', className = '' }) {
  const isSecondary = variant === 'secondary';
  
  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center rounded-2xl py-4 active:opacity-80 transition-all ${
        isSecondary 
          ? 'bg-slate-100 dark:bg-slate-800' 
          : 'bg-indigo-600 shadow-lg shadow-indigo-600/30'
      } ${className}`}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {iconLeft && <Feather name={iconLeft} size={20} color={isSecondary ? '#475569' : 'white'} style={{ marginRight: 8 }} />}
      <Text className={`text-base font-bold tracking-wide ${isSecondary ? 'text-slate-700 dark:text-slate-300' : 'text-white'}`}>
        {title}
      </Text>
      {iconRight && <Feather name={iconRight} size={20} color={isSecondary ? '#475569' : 'white'} style={{ marginLeft: 8 }} />}
    </TouchableOpacity>
  );
}
