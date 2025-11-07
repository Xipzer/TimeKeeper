// Color palette for TimeKeeper

export const lightColors = {
  // Primary colors
  primary: '#6366F1', // Indigo
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',

  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  backgroundTertiary: '#F3F4F6',

  // Surface colors
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text colors
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Border colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',

  // Semantic colors
  success: '#10B981',
  successLight: '#D1FAE5',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Task colors (vibrant)
  taskRed: '#FF6B6B',
  taskTeal: '#4ECDC4',
  taskBlue: '#45B7D1',
  taskSalmon: '#FFA07A',
  taskMint: '#98D8C8',
  taskYellow: '#F7DC6F',
  taskPurple: '#BB8FCE',
  taskSky: '#85C1E2',
  taskOrange: '#F8B739',
  taskGreen: '#52B788',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.2)',

  // Shadow
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const darkColors = {
  // Primary colors
  primary: '#818CF8',
  primaryLight: '#A5B4FC',
  primaryDark: '#6366F1',

  // Background colors
  background: '#111827',
  backgroundSecondary: '#1F2937',
  backgroundTertiary: '#374151',

  // Surface colors
  surface: '#1F2937',
  surfaceElevated: '#374151',

  // Text colors
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  textInverse: '#111827',

  // Border colors
  border: '#374151',
  borderLight: '#4B5563',
  borderDark: '#1F2937',

  // Semantic colors
  success: '#34D399',
  successLight: '#064E3B',
  error: '#F87171',
  errorLight: '#7F1D1D',
  warning: '#FBBF24',
  warningLight: '#78350F',
  info: '#60A5FA',
  infoLight: '#1E3A8A',

  // Task colors (vibrant, slightly adjusted for dark mode)
  taskRed: '#FF8787',
  taskTeal: '#6EDDD4',
  taskBlue: '#61C9E1',
  taskSalmon: '#FFB899',
  taskMint: '#B0E8D8',
  taskYellow: '#F9E68C',
  taskPurple: '#D1A9DE',
  taskSky: '#A5D7F2',
  taskOrange: '#FFCA5D',
  taskGreen: '#70D1A0',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',

  // Shadow
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export type Colors = typeof lightColors;
