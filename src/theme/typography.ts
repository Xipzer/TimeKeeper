// Typography system for TimeKeeper
import { Platform } from 'react-native';

const systemFont = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  // Display
  displayLarge: {
    fontFamily: systemFont,
    fontSize: 57,
    lineHeight: 64,
    fontWeight: '700' as const,
    letterSpacing: -0.25,
  },
  displayMedium: {
    fontFamily: systemFont,
    fontSize: 45,
    lineHeight: 52,
    fontWeight: '700' as const,
    letterSpacing: 0,
  },
  displaySmall: {
    fontFamily: systemFont,
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },

  // Headline
  headlineLarge: {
    fontFamily: systemFont,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
  headlineMedium: {
    fontFamily: systemFont,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
  headlineSmall: {
    fontFamily: systemFont,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },

  // Title
  titleLarge: {
    fontFamily: systemFont,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
  titleMedium: {
    fontFamily: systemFont,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontFamily: systemFont,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
  },

  // Body
  bodyLarge: {
    fontFamily: systemFont,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontFamily: systemFont,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontFamily: systemFont,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
  },

  // Label
  labelLarge: {
    fontFamily: systemFont,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontFamily: systemFont,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontFamily: systemFont,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
  },
} as const;

export type Typography = keyof typeof typography;
