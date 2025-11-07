import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { dateHelpers } from '../../utils/dateHelpers';
import { hapticFeedback } from '../../utils/haptics';
import { Task } from '../../types';

interface MonthCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  tasks: Task[];
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  selectedDate,
  onDateSelect,
  tasks,
}) => {
  const { theme } = useTheme();

  const monthDays = dateHelpers.getMonthWithPadding(selectedDate, 1);
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => dateHelpers.isSameDay(task.startTime, date));
  };

  const getTaskDensityColor = (count: number) => {
    if (count === 0) return 'transparent';
    if (count === 1) return theme.colors.primary + '30';
    if (count === 2) return theme.colors.primary + '60';
    return theme.colors.primary;
  };

  const handleDatePress = (date: Date) => {
    hapticFeedback.light();
    onDateSelect(date);
  };

  const renderDay = (date: Date, index: number) => {
    const isSelected = dateHelpers.isSameDay(date, selectedDate);
    const isToday = dateHelpers.isToday(date);
    const isCurrentMonth = dateHelpers.isSameMonth(date, selectedDate);
    const dayTasks = getTasksForDate(date);
    const taskCount = dayTasks.length;

    return (
      <TouchableOpacity
        key={`${date.toISOString()}-${index}`}
        style={styles.dayContainer}
        onPress={() => handleDatePress(date)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.dayContent,
            {
              backgroundColor: isSelected
                ? theme.colors.primary
                : 'transparent',
              borderColor: isToday ? theme.colors.primary : 'transparent',
              borderWidth: isToday && !isSelected ? 2 : 0,
            },
          ]}
        >
          <Text
            style={[
              styles.dayText,
              {
                color: isSelected
                  ? '#FFFFFF'
                  : isCurrentMonth
                  ? theme.colors.text
                  : theme.colors.textTertiary,
                fontWeight: isToday ? '700' : '400',
              },
            ]}
          >
            {dateHelpers.formatDayNumber(date)}
          </Text>
        </View>
        {taskCount > 0 && (
          <View
            style={[
              styles.taskDot,
              {
                backgroundColor: isSelected
                  ? '#FFFFFF'
                  : getTaskDensityColor(taskCount),
              },
            ]}
          />
        )}
      </TouchableOpacity>
    );
  };

  const weeks = [];
  for (let i = 0; i < monthDays.length; i += 7) {
    weeks.push(monthDays.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      {/* Week day headers */}
      <View style={styles.weekDaysRow}>
        {weekDays.map((day) => (
          <View key={day} style={styles.weekDayContainer}>
            <Text style={[styles.weekDayText, { color: theme.colors.textSecondary }]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.calendarGrid}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((day, dayIndex) => renderDay(day, dayIndex))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  calendarGrid: {
    gap: 4,
  },
  weekRow: {
    flexDirection: 'row',
    gap: 4,
  },
  dayContainer: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
  },
  taskDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
