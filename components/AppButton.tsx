import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME_COLORS, BUTTON_STYLES, TEXT_STYLES } from '@/constants/theme';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
}: AppButtonProps) {
  const getButtonStyle = () => {
    let baseStyle: ViewStyle = { ...BUTTON_STYLES[variant] };
    
    // Size adjustments
    if (size === 'sm') {
      baseStyle.paddingVertical = 8;
      baseStyle.paddingHorizontal = 12;
    } else if (size === 'lg') {
      baseStyle.paddingVertical = 16;
      baseStyle.paddingHorizontal = 20;
    }
    
    // Full width
    if (fullWidth) {
      baseStyle.flex = 1;
    }
    
    // Disabled state
    if (disabled || loading) {
      baseStyle.opacity = 0.6;
    }
    
    // Merge custom style
    if (style) {
      baseStyle = { ...baseStyle, ...style };
    }
    
    return baseStyle;
  };
  
  const getTextStyle = () => {
    let baseStyle = variant === 'primary' 
      ? { ...TEXT_STYLES.buttonPrimary }
      : { ...TEXT_STYLES.buttonSecondary };
    
    // Size adjustments
    if (size === 'sm') {
      baseStyle.fontSize = 14;
    } else if (size === 'lg') {
      baseStyle.fontSize = 18;
    }
    
    // Outline variant text color
    if (variant === 'outline') {
      baseStyle.color = THEME_COLORS.primary;
    } else if (variant === 'secondary') {
      baseStyle.color = THEME_COLORS.gray900;
    }
    
    return baseStyle;
  };
  
  const getIconColor = () => {
    if (variant === 'primary') return THEME_COLORS.white;
    if (variant === 'outline') return THEME_COLORS.primary;
    return THEME_COLORS.gray900;
  };
  
  const getIconSize = () => {
    if (size === 'sm') return 16;
    if (size === 'lg') return 24;
    return 20;
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ActivityIndicator 
            size="small" 
            color={getIconColor()} 
            style={{ marginRight: 8 }} 
          />
          <Text style={getTextStyle()}>{title}</Text>
        </View>
      );
    }
    
    if (!icon) {
      return <Text style={getTextStyle()}>{title}</Text>;
    }
    
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {iconPosition === 'left' && (
          <Ionicons 
            name={icon} 
            size={getIconSize()} 
            color={getIconColor()} 
            style={title ? { marginRight: 8 } : {}} 
          />
        )}
        {title && <Text style={getTextStyle()}>{title}</Text>}
        {iconPosition === 'right' && (
          <Ionicons 
            name={icon} 
            size={getIconSize()} 
            color={getIconColor()} 
            style={title ? { marginLeft: 8 } : {}} 
          />
        )}
      </View>
    );
  };
  
  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}