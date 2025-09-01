import { View, ActivityIndicator } from 'react-native';
import { AppText } from './AppText';
import { THEME_COLORS } from '@/constants/theme';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

export function LoadingSpinner({ message = 'Loading...', size = 'large' }: LoadingSpinnerProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <ActivityIndicator size={size} color={THEME_COLORS.primary} />
      {message && (
        <AppText variant="body" style={{ marginTop: 8, textAlign: 'center', color: THEME_COLORS.gray500 }}>
          {message}
        </AppText>
      )}
    </View>
  );
}