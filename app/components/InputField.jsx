import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

export default function InputField({ 
  control, 
  name, 
  rules, 
  label, 
  iconName, 
  placeholder, 
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View className="mb-4">
          {label && (
             <Text className="mb-2 text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 tracking-wider uppercase">
               {label}
             </Text>
          )}
          <View 
            className={`flex-row items-center rounded-2xl border bg-slate-50 dark:bg-slate-950 px-4 transition-all ${
              multiline ? 'py-3' : 'py-3.5'
            } ${
              error ? 'border-red-400 bg-red-50 dark:bg-red-900/10' :
              isFocused ? 'border-indigo-500 bg-white shadow-sm shadow-indigo-500/10 dark:bg-slate-900' : 
              'border-slate-200 dark:border-slate-800'
            }`}
          >
            {iconName && (
              <Feather 
                name={iconName} 
                size={20} 
                color={error ? "#f87171" : isFocused ? "#6366f1" : "#94a3b8"} 
                style={multiline ? { alignSelf: 'flex-start', marginTop: 4 } : {}}
              />
            )}
            
            <TextInput
              className={`flex-1 ml-3 text-base font-medium ${error ? 'text-red-900 dark:text-red-400' : 'text-slate-900 dark:text-white'} ${multiline ? 'h-24' : ''}`}
              placeholder={placeholder}
              placeholderTextColor={error ? "#fca5a5" : "#64748b"}
              value={value}
              onChangeText={onChange}
              onBlur={() => {
                onBlur();
                setIsFocused(false);
              }}
              onFocus={() => setIsFocused(true)}
              secureTextEntry={secureTextEntry && !isVisible}
              keyboardType={keyboardType}
              autoCapitalize="none"
              multiline={multiline}
              textAlignVertical={multiline ? 'top' : 'center'}
            />

            {secureTextEntry && (
              <TouchableOpacity 
                onPress={() => setIsVisible(!isVisible)}
                className="p-1 pl-2"
                activeOpacity={0.7}
              >
                 <Feather name={isVisible ? "eye" : "eye-off"} size={20} color={isFocused ? "#6366f1" : "#94a3b8"} />
              </TouchableOpacity>
            )}
          </View>
          {error && (
            <Text className="mt-1.5 ml-1 text-sm font-medium text-red-500">
              {error.message || 'This field is required'}
            </Text>
          )}
        </View>
      )}
    />
  );
}
