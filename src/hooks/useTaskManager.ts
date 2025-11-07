import { useState, useEffect, useCallback } from 'react';
import { Task, TaskInput } from '../types';
import { taskStorage } from '../utils/storage';
import { dateHelpers } from '../utils/dateHelpers';

export const useTaskManager = (selectedDate?: Date) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load tasks
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      if (selectedDate) {
        const dateTasks = await taskStorage.getTasksByDate(selectedDate);
        setTasks(dateTasks);
      } else {
        const allTasks = await taskStorage.getTasks();
        setTasks(allTasks);
      }
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Add task
  const addTask = useCallback(async (taskInput: TaskInput) => {
    try {
      const endTime = new Date(taskInput.startTime.getTime() + taskInput.duration * 60000);
      const newTask: Task = {
        id: Date.now().toString(),
        ...taskInput,
        endTime,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await taskStorage.addTask(newTask);
      await loadTasks();
      return newTask;
    } catch (err) {
      setError(err as Error);
      console.error('Error adding task:', err);
      throw err;
    }
  }, [loadTasks]);

  // Update task
  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      await taskStorage.updateTask(taskId, updates);
      await loadTasks();
    } catch (err) {
      setError(err as Error);
      console.error('Error updating task:', err);
      throw err;
    }
  }, [loadTasks]);

  // Delete task
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await taskStorage.deleteTask(taskId);
      await loadTasks();
    } catch (err) {
      setError(err as Error);
      console.error('Error deleting task:', err);
      throw err;
    }
  }, [loadTasks]);

  // Complete task
  const completeTask = useCallback(async (taskId: string) => {
    try {
      await taskStorage.updateTask(taskId, { completed: true });
      await loadTasks();
    } catch (err) {
      setError(err as Error);
      console.error('Error completing task:', err);
      throw err;
    }
  }, [loadTasks]);

  // Uncomplete task
  const uncompleteTask = useCallback(async (taskId: string) => {
    try {
      await taskStorage.updateTask(taskId, { completed: false });
      await loadTasks();
    } catch (err) {
      setError(err as Error);
      console.error('Error uncompleting task:', err);
      throw err;
    }
  }, [loadTasks]);

  // Get task by ID
  const getTask = useCallback((taskId: string) => {
    return tasks.find(t => t.id === taskId);
  }, [tasks]);

  // Get tasks for a specific date
  const getTasksForDate = useCallback((date: Date) => {
    return tasks.filter(task =>
      dateHelpers.isSameDay(task.startTime, date)
    );
  }, [tasks]);

  // Get completed tasks count
  const getCompletedCount = useCallback(() => {
    return tasks.filter(t => t.completed).length;
  }, [tasks]);

  // Get total tasks count
  const getTotalCount = useCallback(() => {
    return tasks.length;
  }, [tasks]);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    uncompleteTask,
    getTask,
    getTasksForDate,
    getCompletedCount,
    getTotalCount,
    refresh: loadTasks,
  };
};
