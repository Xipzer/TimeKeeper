import { Platform } from 'react-native';

// Platform-specific style utilities
export const platformStyles = {
  // Get shadow style based on platform
  getShadow: (shadowPreset: any) => {
    if (Platform.OS === 'web') {
      // Use boxShadow for web
      const shadows: Record<string, string> = {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        lg: '0 4px 8px 0 rgba(0, 0, 0, 0.12)',
        xl: '0 8px 16px 0 rgba(0, 0, 0, 0.15)',
      };
      return { boxShadow: shadows.sm };
    }
    // Use native shadow props for iOS/Android
    return shadowPreset;
  },
};
