import { useState } from 'react';
import './App.css';
import { AppLayout } from './components/Layout/AppLayout';
import { CalendarPage } from './pages/CalendarPage';

function App() {
  return (
    <AppLayout>
      <CalendarPage />
    </AppLayout>
  );
}

export default App;
