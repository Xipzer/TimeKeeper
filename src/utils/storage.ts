import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Statistics, AppSettings } from '../types';

const STORAGE_KEYS = {
  TASKS: '@timekeeper_tasks',
  STATISTICS: '@timekeeper_statistics',
  SETTINGS: '@timekeeper_settings',
  STREAK: '@timekeeper_streak',
} as const;

// Task storage
export const taskStorage = {
  getTasks: async (): Promise<Task[]> => {
    try {
      const tasksJson = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      if (!tasksJson) return [];

      const tasks = JSON.parse(tasksJson);
      // Parse dates from ISO strings
      return tasks.map((task: any) => ({
        ...task,
        startTime: new Date(task.startTime),
        endTime: new Date(task.endTime),
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  },

  saveTasks: async (tasks: Task[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
      throw error;
    }
  },

  addTask: async (task: Task): Promise<void> => {
    try {
      const tasks = await taskStorage.getTasks();
      tasks.push(task);
      await taskStorage.saveTasks(tasks);
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },

  updateTask: async (taskId: string, updates: Partial<Task>): Promise<void> => {
    try {
      const tasks = await taskStorage.getTasks();
      const index = tasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date() };
        await taskStorage.saveTasks(tasks);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  deleteTask: async (taskId: string): Promise<void> => {
    try {
      const tasks = await taskStorage.getTasks();
      const filteredTasks = tasks.filter(t => t.id !== taskId);
      await taskStorage.saveTasks(filteredTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  getTasksByDate: async (date: Date): Promise<Task[]> => {
    try {
      const tasks = await taskStorage.getTasks();
      return tasks.filter(task => {
        const taskDate = new Date(task.startTime);
        return (
          taskDate.getDate() === date.getDate() &&
          taskDate.getMonth() === date.getMonth() &&
          taskDate.getFullYear() === date.getFullYear()
        );
      });
    } catch (error) {
      console.error('Error getting tasks by date:', error);
      return [];
    }
  },
};

// Statistics storage
export const statisticsStorage = {
  getStatistics: async (): Promise<Statistics | null> => {
    try {
      const statsJson = await AsyncStorage.getItem(STORAGE_KEYS.STATISTICS);
      if (!statsJson) return null;

      const stats = JSON.parse(statsJson);
      // Parse dates from ISO strings
      return {
        ...stats,
        weeklyStats: stats.weeklyStats.map((ws: any) => ({
          ...ws,
          weekStart: new Date(ws.weekStart),
        })),
      };
    } catch (error) {
      console.error('Error loading statistics:', error);
      return null;
    }
  },

  saveStatistics: async (statistics: Statistics): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(statistics));
    } catch (error) {
      console.error('Error saving statistics:', error);
      throw error;
    }
  },

  updateStreak: async (streak: number): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STREAK, streak.toString());
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  },

  getStreak: async (): Promise<number> => {
    try {
      const streak = await AsyncStorage.getItem(STORAGE_KEYS.STREAK);
      return streak ? parseInt(streak, 10) : 0;
    } catch (error) {
      console.error('Error getting streak:', error);
      return 0;
    }
  },
};

// Settings storage
export const settingsStorage = {
  getSettings: async (): Promise<AppSettings> => {
    try {
      const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!settingsJson) {
        // Return default settings
        return {
          theme: 'auto',
          notificationsEnabled: true,
          reminderTime: 15,
          startOfWeek: 1,
          workingHours: {
            start: 6,
            end: 23,
          },
        };
      }
      return JSON.parse(settingsJson);
    } catch (error) {
      console.error('Error loading settings:', error);
      return {
        theme: 'auto',
        notificationsEnabled: true,
        reminderTime: 15,
        startOfWeek: 1,
        workingHours: {
          start: 6,
          end: 23,
        },
      };
    }
  },

  saveSettings: async (settings: AppSettings): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },
};

// Clear all data (for testing/debugging)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};
