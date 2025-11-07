import type { Task } from '../types';

const STORAGE_KEY = 'timekeeper-tasks';

export const taskStorage = {
  getTasks: (): Task[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const tasks = JSON.parse(stored);
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

  saveTasks: (tasks: Task[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  },

  addTask: (task: Task): void => {
    const tasks = taskStorage.getTasks();
    tasks.push(task);
    taskStorage.saveTasks(tasks);
  },

  updateTask: (taskId: string, updates: Partial<Task>): void => {
    const tasks = taskStorage.getTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date() };
      taskStorage.saveTasks(tasks);
    }
  },

  deleteTask: (taskId: string): void => {
    const tasks = taskStorage.getTasks();
    const filtered = tasks.filter(t => t.id !== taskId);
    taskStorage.saveTasks(filtered);
  },
};
