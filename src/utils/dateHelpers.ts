import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  startOfDay,
  setHours,
  setMinutes,
  differenceInMinutes,
  isSameMonth,
  parseISO,
} from 'date-fns';

export const dateHelpers = {
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

  isSameDay: (date1: Date, date2: Date) => {
    return isSameDay(date1, date2);
  },

  isToday: (date: Date) => {
    return isToday(date);
  },

  isSameMonth: (date1: Date, date2: Date) => {
    return isSameMonth(date1, date2);
  },

  createTimeFromHour: (date: Date, hour: number, minute: number = 0) => {
    return setMinutes(setHours(startOfDay(date), hour), minute);
  },

  getMinutesBetween: (start: Date, end: Date) => {
    return differenceInMinutes(end, start);
  },

  startOfDay: (date: Date) => {
    return startOfDay(date);
  },

  parseISO: (dateString: string) => {
    return parseISO(dateString);
  },

  now: () => {
    return new Date();
  },
};

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
