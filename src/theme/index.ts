// Main theme file combining colors, spacing, typography, and animations
import { lightColors, darkColors, Colors } from './colors';
import { spacing, borderRadius, iconSizes, shadowPresets, hitSlop } from './spacing';
import { typography } from './typography';

export interface Theme {
  colors: Colors;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  iconSizes: typeof iconSizes;
  typography: typeof typography;
  shadows: typeof shadowPresets;
  hitSlop: typeof hitSlop;
  isDark: boolean;
}

export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  borderRadius,
  iconSizes,
  typography,
  shadows: shadowPresets,
  hitSlop,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  borderRadius,
  iconSizes,
  typography,
  shadows: shadowPresets,
  hitSlop,
  isDark: true,
};

// Animation configurations
export const animations = {
  // Spring configs for different use cases
  spring: {
    gentle: {
      damping: 20,
      mass: 1,
      stiffness: 180,
    },
    bouncy: {
      damping: 15,
      mass: 1,
      stiffness: 200,
    },
    snappy: {
      damping: 25,
      mass: 0.8,
      stiffness: 250,
    },
    slow: {
      damping: 30,
      mass: 1,
      stiffness: 100,
    },
  },
  // Timing configs
  timing: {
    fast: 200,
    medium: 300,
    slow: 500,
  },
  // Easing curves
  easing: {
    easeInOut: [0.4, 0.0, 0.2, 1] as const,
    easeOut: [0.0, 0.0, 0.2, 1] as const,
    easeIn: [0.4, 0.0, 1, 1] as const,
    sharp: [0.4, 0.0, 0.6, 1] as const,
  },
} as const;

export * from './colors';
export * from './spacing';
export * from './typography';
