import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTaskManager } from '../../hooks/useTaskManager';

const StatisticsScreen = () => {
  const { theme } = useTheme();
  const { tasks, getCompletedCount, getTotalCount } = useTaskManager();

  const completedCount = getCompletedCount();
  const totalCount = getTotalCount();
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Statistics
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Stats Cards */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, ...theme.shadows.sm }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.textSecondary }]}>
            Total Tasks
          </Text>
          <Text style={[styles.cardValue, { color: theme.colors.text }]}>
            {totalCount}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface, ...theme.shadows.sm }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.textSecondary }]}>
            Completed
          </Text>
          <Text style={[styles.cardValue, { color: theme.colors.success }]}>
            {completedCount}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface, ...theme.shadows.sm }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.textSecondary }]}>
            Completion Rate
          </Text>
          <Text style={[styles.cardValue, { color: theme.colors.primary }]}>
            {completionRate}%
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface, ...theme.shadows.sm }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.textSecondary }]}>
            Current Streak
          </Text>
          <Text style={[styles.cardValue, { color: theme.colors.warning }]}>
            0 days
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 48,
    fontWeight: '700',
  },
});

export default StatisticsScreen;
