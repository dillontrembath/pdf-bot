import React from 'react';
import { Text, TextStyle, TextProps } from 'react-native';
import { TEXT_STYLES } from '@/constants/theme';

interface AppTextProps extends TextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'buttonPrimary' | 'buttonSecondary';
  style?: TextStyle;
}

export function AppText({ 
  variant = 'body',
  style,
  ...props 
}: AppTextProps) {
  const textStyle = {
    ...TEXT_STYLES[variant],
    ...(style || {})
  };
  
  return (
    <Text 
      style={textStyle}
      {...props}
    />
  );
}