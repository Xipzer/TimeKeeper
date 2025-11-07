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
import { FAB } from '../../components/UI/FAB';
import { dateHelpers } from '../../utils/dateHelpers';
import { hapticFeedback } from '../../utils/haptics';
import { TaskInput } from '../../types';

const HomeScreen = () => {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const { tasks, loading, addTask, completeTask, deleteTask, refresh } = useTaskManager(selectedDate);

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

  const todayTasks = tasks.filter(task =>
    dateHelpers.isSameDay(task.startTime, selectedDate)
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {dateHelpers.formatMonthYear(selectedDate)}
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            {todayTasks.length} tasks today
          </Text>
        </View>
      </View>

      {/* Task List */}
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
        {todayTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: theme.colors.textSecondary }]}>
              No tasks yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textTertiary }]}>
              Tap the + button to create your first task
            </Text>
          </View>
        ) : (
          todayTasks
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
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 8,
    paddingBottom: 80,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default HomeScreen;
