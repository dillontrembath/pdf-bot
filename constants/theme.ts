export const THEME_COLORS = {
  // Primary Brand Colors (purple theme)
  primary: '#6366F1',        // Main purple
  primaryLight: '#F8F9FF',   // Very light purple
  primaryBg: '#E0E7FF',      // Light purple background

  // Grays (ordered from lightest to darkest)
  gray50: '#F9FAFB',   // Lightest - main backgrounds
  gray100: '#F3F4F6',  // Very light - surfaces, secondary backgrounds
  gray200: '#E5E7EB',  // Light - borders, dividers
  gray300: '#D1D5DB',  // Medium - disabled states
  gray500: '#6B7280',  // Dark - secondary text, placeholders
  gray900: '#111827',  // Darkest - primary text

  // Base Colors
  white: '#FFFFFF',
  black: '#000000',

  // Status Colors
  red: '#EF4444',
  green: '#10B981',
};

// Typography
export const TYPOGRAPHY = {
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
};

// Spacing
export const SPACING = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  '4xl': 32,
};

// Border Radius (consistent rounding)
export const BORDER_RADIUS = {
  sm: 8,     // Small elements (icons, chips)
  md: 12,    // Cards, buttons 
  lg: 16,    // Large buttons, containers
  xl: 20,    // Circular buttons
  full: 999, // Fully rounded (pills, avatars)
};

// Button Styles
export const BUTTON_STYLES = {
  primary: {
    backgroundColor: THEME_COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  
  secondary: {
    backgroundColor: THEME_COLORS.gray100,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: THEME_COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
};

// Card Styles
export const CARD_STYLES = {
  default: {
    backgroundColor: THEME_COLORS.white,
    borderWidth: 1,
    borderColor: THEME_COLORS.gray200,
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
};

// Layout Styles
export const LAYOUT = {
  screen: {
    flex: 1,
    backgroundColor: THEME_COLORS.gray50,
  },
  
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  
  section: {
    marginBottom: 16,
  },
  
  header: {
    backgroundColor: THEME_COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.gray200,
  },
};

// Text Styles
export const TEXT_STYLES = {
  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: 'bold' as const,
    fontFamily: 'Inter_700Bold',
    color: THEME_COLORS.gray900,
    marginBottom: 8,
  },
  
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
    color: THEME_COLORS.gray900,
    marginBottom: 4,
  },
  
  body: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Inter_400Regular',
    color: THEME_COLORS.gray900,
    lineHeight: 24,
  },
  
  caption: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Inter_400Regular',
    color: THEME_COLORS.gray500,
  },
  
  buttonPrimary: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
    color: THEME_COLORS.white,
  },
  
  buttonSecondary: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: '500' as const,
    fontFamily: 'Inter_500Medium',
    color: THEME_COLORS.primary,
  },
};

// Modal Styles
export const MODAL_STYLES = {
  overlay: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  
  container: {
    backgroundColor: THEME_COLORS.white,
    borderRadius: 16,
    width: 256,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    padding: 12,
    paddingTop: 16,
    paddingBottom: 8,
  },
};