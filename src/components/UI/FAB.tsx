import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { hapticFeedback } from '../../utils/haptics';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface FABProps {
  onPress: () => void;
  icon?: React.ReactNode;
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
  style?: ViewStyle;
}

export const FAB: React.FC<FABProps> = ({
  onPress,
  icon,
  position = 'bottom-right',
  style,
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const handlePress = () => {
    hapticFeedback.medium();

    // Scale and rotate animation
    scale.value = withSequence(
      withSpring(0.9, { damping: 15, stiffness: 200 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );

    rotate.value = withSequence(
      withSpring(45, { damping: 15, stiffness: 200 }),
      withSpring(0, { damping: 15, stiffness: 200 })
    );

    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const getPositionStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      bottom: theme.spacing.lg,
    };

    switch (position) {
      case 'bottom-center':
        return { ...baseStyle, alignSelf: 'center' as const };
      case 'bottom-left':
        return { ...baseStyle, left: theme.spacing.lg };
      default:
        return { ...baseStyle, right: theme.spacing.lg };
    }
  };

  return (
    <AnimatedTouchable
      onPress={handlePress}
      style={[
        styles.fab,
        {
          backgroundColor: theme.colors.primary,
          ...theme.shadows.lg,
        },
        getPositionStyle(),
        animatedStyle,
        style,
      ]}
      activeOpacity={0.9}
    >
      {icon || (
        <Animated.Text style={styles.plusIcon}>+</Animated.Text>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  plusIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});
