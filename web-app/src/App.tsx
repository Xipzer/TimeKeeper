import './App.css';
import { ThemeProvider } from './theme/ThemeContext';
import { AppLayout } from './components/Layout/AppLayout';
import { CalendarPage } from './pages/CalendarPage';

function App() {
  return (
    <ThemeProvider>
      <AppLayout>
        <CalendarPage />
      </AppLayout>
    </ThemeProvider>
  );
}

export default App;
