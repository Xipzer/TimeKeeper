import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { dateHelpers } from '../../utils/dateHelpers';
import { hapticFeedback } from '../../utils/haptics';

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onTodayPress: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onTodayPress,
}) => {
  const { theme } = useTheme();
  const todayScale = useSharedValue(1);

  const handlePreviousMonth = () => {
    hapticFeedback.light();
    onPreviousMonth();
  };

  const handleNextMonth = () => {
    hapticFeedback.light();
    onNextMonth();
  };

  const handleTodayPress = () => {
    hapticFeedback.medium();
    todayScale.value = withSequence(
      withSpring(1.1, { damping: 15, stiffness: 200 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );
    onTodayPress();
  };

  const todayButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: todayScale.value }],
  }));

  const isCurrentMonth = dateHelpers.isSameMonth(currentDate, new Date());

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={[styles.monthYear, { color: theme.colors.text }]}>
          {dateHelpers.formatMonthYear(currentDate)}
        </Text>
      </View>

      <View style={styles.rightSection}>
        {/* Previous Month Button */}
        <TouchableOpacity
          style={[
            styles.navButton,
            { backgroundColor: theme.colors.backgroundSecondary },
          ]}
          onPress={handlePreviousMonth}
          hitSlop={theme.hitSlop}
        >
          <Text style={[styles.navButtonText, { color: theme.colors.text }]}>
            ‹
          </Text>
        </TouchableOpacity>

        {/* Today Button */}
        {!isCurrentMonth && (
          <AnimatedTouchable
            style={[
              todayButtonStyle,
              styles.todayButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={handleTodayPress}
            hitSlop={theme.hitSlop}
          >
            <Text style={styles.todayButtonText}>Today</Text>
          </AnimatedTouchable>
        )}

        {/* Next Month Button */}
        <TouchableOpacity
          style={[
            styles.navButton,
            { backgroundColor: theme.colors.backgroundSecondary },
          ]}
          onPress={handleNextMonth}
          hitSlop={theme.hitSlop}
        >
          <Text style={[styles.navButtonText, { color: theme.colors.text }]}>
            ›
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  leftSection: {
    flex: 1,
  },
  monthYear: {
    fontSize: 22,
    fontWeight: '700',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    fontSize: 24,
    fontWeight: '300',
  },
  todayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    marginHorizontal: 4,
  },
  todayButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
