import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  differenceInMinutes,
  isSameMonth,
  getDay,
  parseISO,
} from 'date-fns';

export const dateHelpers = {
  // Format dates
  formatDate: (date: Date, formatStr: string = 'MMM dd, yyyy') => {
    return format(date, formatStr);
  },

  formatTime: (date: Date) => {
    return format(date, 'h:mm a');
  },

  formatDayName: (date: Date) => {
    return format(date, 'EEE');
  },

  formatDayNumber: (date: Date) => {
    return format(date, 'd');
  },

  formatMonthYear: (date: Date) => {
    return format(date, 'MMMM yyyy');
  },

  // Week helpers
  getWeekDays: (date: Date, weekStartsOn: 0 | 1 = 1) => {
    const start = startOfWeek(date, { weekStartsOn });
    const end = endOfWeek(date, { weekStartsOn });
    return eachDayOfInterval({ start, end });
  },

  getNextWeek: (date: Date) => {
    return addWeeks(date, 1);
  },

  getPreviousWeek: (date: Date) => {
    return subWeeks(date, 1);
  },

  // Month helpers
  getMonthDays: (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  },

  getMonthWithPadding: (date: Date, weekStartsOn: 0 | 1 = 1) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  },

  getNextMonth: (date: Date) => {
    return addMonths(date, 1);
  },

  getPreviousMonth: (date: Date) => {
    return subMonths(date, 1);
  },

  // Day helpers
  getNextDay: (date: Date) => {
    return addDays(date, 1);
  },

  getPreviousDay: (date: Date) => {
    return subDays(date, 1);
  },

  // Comparison helpers
  isSameDay: (date1: Date, date2: Date) => {
    return isSameDay(date1, date2);
  },

  isToday: (date: Date) => {
    return isToday(date);
  },

  isSameMonth: (date1: Date, date2: Date) => {
    return isSameMonth(date1, date2);
  },

  // Time helpers
  getHourBlocks: () => {
    const blocks = [];
    for (let hour = 0; hour < 24; hour++) {
      blocks.push(hour);
    }
    return blocks;
  },

  getWorkingHourBlocks: (startHour: number = 6, endHour: number = 23) => {
    const blocks = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      blocks.push(hour);
    }
    return blocks;
  },

  createTimeFromHour: (date: Date, hour: number, minute: number = 0) => {
    return setMinutes(setHours(startOfDay(date), hour), minute);
  },

  getMinutesBetween: (start: Date, end: Date) => {
    return differenceInMinutes(end, start);
  },

  // Start/End of day
  startOfDay: (date: Date) => {
    return startOfDay(date);
  },

  endOfDay: (date: Date) => {
    return endOfDay(date);
  },

  // Parse ISO string to Date
  parseISO: (dateString: string) => {
    return parseISO(dateString);
  },

  // Get current time
  now: () => {
    return new Date();
  },

  // Get day of week (0-6)
  getDayOfWeek: (date: Date) => {
    return getDay(date);
  },
};

// Duration presets in minutes
export const DURATION_PRESETS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
  { label: '3 hours', value: 180 },
  { label: '4 hours', value: 240 },
];
