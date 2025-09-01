import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { CARD_STYLES } from '@/constants/theme';

interface AppCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export function AppCard({ 
  children, 
  onPress, 
  style,
  disabled = false 
}: AppCardProps) {
  const cardStyle = {
    ...CARD_STYLES.default,
    ...(style || {}),
    ...(disabled && { opacity: 0.6 })
  };
  
  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }
  
  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
}