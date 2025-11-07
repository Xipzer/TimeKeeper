// Core data types for TimeKeeper web app

export interface Task {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  color: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  isAllDay?: boolean;
}

export interface TaskInput {
  title: string;
  description?: string;
  startTime: Date;
  duration: number;
  color: string;
  isAllDay?: boolean;
}

export type TaskColor =
  | '#FF6B6B' // Red
  | '#4ECDC4' // Teal
  | '#45B7D1' // Blue
  | '#FFA07A' // Light Salmon
  | '#98D8C8' // Mint
  | '#F7DC6F' // Yellow
  | '#BB8FCE' // Purple
  | '#85C1E2' // Sky Blue
  | '#F8B739' // Orange
  | '#52B788'; // Green

export const TASK_COLORS: TaskColor[] = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
  '#F8B739',
  '#52B788',
];

export interface Statistics {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  streak: number;
  totalTimeSpent: number;
  totalTimePlanned: number;
}

export type ThemeMode = 'light' | 'dark' | 'auto';
