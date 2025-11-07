import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Task } from '../../types';
import { dateHelpers } from '../../utils/dateHelpers';

interface DayMetricsProps {
  tasks: Task[];
  selectedDate: Date;
}

export const DayMetrics: React.FC<DayMetricsProps> = ({ tasks, selectedDate }) => {
  const { theme } = useTheme();

  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);

  const totalMinutes = tasks.reduce((sum, task) => sum + task.duration, 0);
  const completedMinutes = completedTasks.reduce((sum, task) => sum + task.duration, 0);
  const remainingMinutes = incompleteTasks.reduce((sum, task) => sum + task.duration, 0);

  const completionRate = tasks.length > 0
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  };

  const isToday = dateHelpers.isToday(selectedDate);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {isToday ? "Today's Metrics" : dateHelpers.formatDate(selectedDate, 'MMM dd')}
      </Text>

      {/* Metrics Grid */}
      <View style={styles.metricsGrid}>
        {/* Total Tasks */}
        <View style={[styles.metricCard, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
            Total
          </Text>
          <Text style={[styles.metricValue, { color: theme.colors.text }]}>
            {tasks.length}
          </Text>
        </View>

        {/* Completed */}
        <View style={[styles.metricCard, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
            Done
          </Text>
          <Text style={[styles.metricValue, { color: theme.colors.success }]}>
            {completedTasks.length}
          </Text>
        </View>

        {/* Completion Rate */}
        <View style={[styles.metricCard, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
            Rate
          </Text>
          <Text style={[styles.metricValue, { color: theme.colors.primary }]}>
            {completionRate}%
          </Text>
        </View>

        {/* Total Time */}
        <View style={[styles.metricCard, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
            Total Time
          </Text>
          <Text style={[styles.metricValue, { color: theme.colors.text }]}>
            {formatTime(totalMinutes)}
          </Text>
        </View>

        {/* Remaining Time */}
        <View style={[styles.metricCard, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
            Remaining
          </Text>
          <Text style={[styles.metricValue, { color: theme.colors.warning }]}>
            {formatTime(remainingMinutes)}
          </Text>
        </View>

        {/* Completed Time */}
        <View style={[styles.metricCard, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
            Completed
          </Text>
          <Text style={[styles.metricValue, { color: theme.colors.success }]}>
            {formatTime(completedMinutes)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    minWidth: '30%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
  },
});
