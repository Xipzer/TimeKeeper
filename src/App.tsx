import { useRef } from 'react';
import './App.css';
import { ThemeProvider } from './theme/ThemeContext';
import { AppLayout } from './components/Layout/AppLayout';
import { CalendarPage } from './pages/CalendarPage';
import { taskStorage } from './utils/storage';
import type { Task } from './types';

function App() {
  const calendarPageRef = useRef<{ reloadTasks: () => void }>(null);

  const handleTasksCreated = (tasks: Task[]) => {
    // Save all tasks to storage
    tasks.forEach(task => {
      taskStorage.addTask(task);
    });

    // Trigger CalendarPage to reload
    if (calendarPageRef.current) {
      calendarPageRef.current.reloadTasks();
    }
  };

  return (
    <ThemeProvider>
      <AppLayout onTasksCreated={handleTasksCreated}>
        <CalendarPage ref={calendarPageRef} />
      </AppLayout>
    </ThemeProvider>
  );
}

export default App;
