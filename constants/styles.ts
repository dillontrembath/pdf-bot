import { THEME_COLORS, BORDER_RADIUS } from './theme';

// Common style utilities
export const COMMON_STYLES = {
  // Shadow styles
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  lightShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // Flex utilities
  centerRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  centerColumn: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  // Icon containers
  iconContainer: (size: number, backgroundColor?: string) => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: backgroundColor || THEME_COLORS.primaryBg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  }),

  // Input styles
  inputContainer: {
    backgroundColor: THEME_COLORS.gray100,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: THEME_COLORS.gray200,
    minHeight: 48,
  },
};