// Core data types for TimeKeeper app

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

export interface CalendarDay {
  date: Date;
  tasks: Task[];
  isToday: boolean;
  isCurrentMonth: boolean;
}

export interface WeekDay {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  tasks: Task[];
}

export type ViewMode = 'day' | 'week' | 'month';

export interface TimeBlock {
  hour: number;
  tasks: Task[];
}

export interface Statistics {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  streak: number;
  totalTimeSpent: number; // in minutes
  totalTimePlanned: number; // in minutes
  weeklyStats: WeeklyStats[];
}

export interface WeeklyStats {
  weekStart: Date;
  tasksCompleted: number;
  tasksCreated: number;
  timeSpent: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  notificationsEnabled: boolean;
  reminderTime: number; // minutes before task
  startOfWeek: 0 | 1; // 0 = Sunday, 1 = Monday
  workingHours: {
    start: number; // hour (0-23)
    end: number; // hour (0-23)
  };
}

export interface TaskTemplate {
  id: string;
  title: string;
  duration: number;
  color: TaskColor;
  description?: string;
}

// Animation types
export interface SpringConfig {
  damping: number;
  mass: number;
  stiffness: number;
  overshootClamping?: boolean;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
}

// Gesture types
export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

export interface SwipeGestureConfig {
  direction: SwipeDirection;
  threshold: number;
  onSwipe: () => void;
}
