import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useTaskManager } from '../../hooks/useTaskManager';
import { TaskCard } from '../../components/Tasks/TaskCard';
import { TaskForm } from '../../components/Tasks/TaskForm';
import { MonthCalendar } from '../../components/Calendar/MonthCalendar';
import { CalendarHeader } from '../../components/Calendar/CalendarHeader';
import { DayMetrics } from '../../components/Calendar/DayMetrics';
import { FAB } from '../../components/UI/FAB';
import { dateHelpers } from '../../utils/dateHelpers';
import { hapticFeedback } from '../../utils/haptics';
import { TaskInput } from '../../types';

const HomeScreen = () => {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date()); // For month navigation
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const { tasks, loading, addTask, completeTask, deleteTask, refresh } = useTaskManager();

  const handleRefresh = () => {
    hapticFeedback.light();
    refresh();
  };

  const handleTaskComplete = async (taskId: string) => {
    try {
      await completeTask(taskId);
      hapticFeedback.success();
    } catch (error) {
      console.error('Error completing task:', error);
      hapticFeedback.error();
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      hapticFeedback.warning();
    } catch (error) {
      console.error('Error deleting task:', error);
      hapticFeedback.error();
    }
  };

  const handleCreateTask = async (taskInput: TaskInput) => {
    try {
      await addTask(taskInput);
      hapticFeedback.success();
      setIsTaskFormVisible(false);
    } catch (error) {
      console.error('Error creating task:', error);
      hapticFeedback.error();
    }
  };

  const handleOpenTaskForm = () => {
    hapticFeedback.medium();
    setIsTaskFormVisible(true);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setViewDate(date);
  };

  const handlePreviousMonth = () => {
    setViewDate(dateHelpers.getPreviousMonth(viewDate));
  };

  const handleNextMonth = () => {
    setViewDate(dateHelpers.getNextMonth(viewDate));
  };

  const handleTodayPress = () => {
    const today = new Date();
    setSelectedDate(today);
    setViewDate(today);
  };

  const selectedDayTasks = tasks.filter(task =>
    dateHelpers.isSameDay(task.startTime, selectedDate)
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Calendar Header */}
        <CalendarHeader
          currentDate={viewDate}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          onTodayPress={handleTodayPress}
        />

        {/* Month Calendar */}
        <View style={[styles.calendarCard, { backgroundColor: theme.colors.surface }]}>
          <MonthCalendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            tasks={tasks}
          />
        </View>

        {/* Day Metrics */}
        <View style={styles.metricsContainer}>
          <DayMetrics tasks={selectedDayTasks} selectedDate={selectedDate} />
        </View>

        {/* Selected Day Tasks Section */}
        <View style={styles.tasksSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {dateHelpers.isToday(selectedDate) ? "Today's Tasks" : 'Tasks'}
          </Text>

          {selectedDayTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: theme.colors.textSecondary }]}>
                No tasks for this day
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textTertiary }]}>
                Tap the + button to create a task
              </Text>
            </View>
          ) : (
            selectedDayTasks
              .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={() => handleTaskComplete(task.id)}
                  onDelete={() => handleTaskDelete(task.id)}
                />
              ))
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <FAB onPress={handleOpenTaskForm} />

      {/* Task Form Modal */}
      <TaskForm
        visible={isTaskFormVisible}
        onClose={() => setIsTaskFormVisible(false)}
        onSubmit={handleCreateTask}
        initialDate={selectedDate}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  calendarCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 12,
  },
  metricsContainer: {
    paddingHorizontal: 16,
  },
  tasksSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default HomeScreen;
