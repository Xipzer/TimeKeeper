# Complete CalendarPage Implementation Guide

## Current Status

✅ **Working:**
- Batman-themed design (dark greys)
- Theme toggle (🌙/☀️ button works!)
- LocalStorage utilities
- ThemeContext provider

⏳ **Needs Implementation:**
- Interactive calendar
- Task management UI
- FAB button + modal
- New layout structure

## Exact Layout Required

```
┌─────────────────────────────────────────────────┐
│         CALENDAR (Full Width at Top)           │
│  [←] November 2024 [→] [Today]                 │
│  Mon  Tue  Wed  Thu  Fri  Sat  Sun             │
│  [1]  [2]  [3]  [4]  [5]  [6]  [7]            │
│  ...                                            │
└─────────────────────────────────────────────────┘
┌─────────────────────────┬───────────────────────┐
│      TASKS (Left)       │   METRICS (Right)     │
│                         │                        │
│ ☐ Task 1               │ Total: 5               │
│ ☑ Task 2               │ Done: 2                │
│ ☐ Task 3               │ Rate: 40%              │
│                         │ Time: 5h               │
└─────────────────────────┴───────────────────────┘

[+] FAB button bottom-right
```

## Step-by-Step Implementation

### Step 1: Replace CalendarPage.tsx

Replace `src/pages/CalendarPage.tsx` with this complete implementation:

```typescript
import React, { useState, useEffect } from 'react';
import { dateHelpers } from '../utils/dateHelpers';
import { taskStorage } from '../utils/storage';
import { Task, TASK_COLORS, TaskColor } from '../types';
import './CalendarPage.css';

export const CalendarPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formHour, setFormHour] = useState(9);
  const [formMinute, setFormMinute] = useState(0);
  const [formDuration, setFormDuration] = useState(60);
  const [formColor, setFormColor] = useState<TaskColor>(TASK_COLORS[0]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    setTasks(taskStorage.getTasks());
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setFormTitle('');
    setFormHour(9);
    setFormMinute(0);
    setFormDuration(60);
    setFormColor(TASK_COLORS[0]);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormHour(task.startTime.getHours());
    setFormMinute(task.startTime.getMinutes());
    setFormDuration(task.duration);
    setFormColor(task.color as TaskColor);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formTitle.trim()) return;

    const startTime = dateHelpers.createTimeFromHour(selectedDate, formHour, formMinute);
    const endTime = new Date(startTime.getTime() + formDuration * 60000);

    if (editingTask) {
      taskStorage.updateTask(editingTask.id, {
        title: formTitle,
        startTime,
        endTime,
        duration: formDuration,
        color: formColor,
      });
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        title: formTitle,
        startTime,
        endTime,
        duration: formDuration,
        color: formColor,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      taskStorage.addTask(newTask);
    }

    loadTasks();
    setIsModalOpen(false);
  };

  const handleToggleComplete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      taskStorage.updateTask(taskId, { completed: !task.completed });
      loadTasks();
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Delete this task?')) {
      taskStorage.deleteTask(taskId);
      loadTasks();
    }
  };

  const selectedDayTasks = tasks.filter(task =>
    dateHelpers.isSameDay(task.startTime, selectedDate)
  );

  const completedTasks = selectedDayTasks.filter(t => t.completed);
  const totalMinutes = selectedDayTasks.reduce((sum, t) => sum + t.duration, 0);
  const completedMinutes = completedTasks.reduce((sum, t) => sum + t.duration, 0);
  const completionRate = selectedDayTasks.length > 0
    ? Math.round((completedTasks.length / selectedDayTasks.length) * 100)
    : 0;

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="calendar-page-new">
      {/* Calendar - Full Width at Top */}
      <section className="calendar-section-full">
        <div className="calendar-header">
          <button onClick={() => setViewDate(dateHelpers.getPreviousMonth(viewDate))}>‹</button>
          <h2>{dateHelpers.formatMonthYear(viewDate)}</h2>
          <button onClick={() => setViewDate(dateHelpers.getNextMonth(viewDate))}>›</button>
          <button
            className="today-btn"
            onClick={() => {
              const today = new Date();
              setSelectedDate(today);
              setViewDate(today);
            }}
          >
            Today
          </button>
        </div>

        <div className="calendar-grid-wrapper">
          <div className="weekdays">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          <div className="calendar-grid">
            {dateHelpers.getMonthWithPadding(viewDate).map((date, idx) => {
              const isSelected = dateHelpers.isSameDay(date, selectedDate);
              const isToday = dateHelpers.isToday(date);
              const isCurrentMonth = dateHelpers.isSameMonth(date, viewDate);
              const dayTasks = tasks.filter(t => dateHelpers.isSameDay(t.startTime, date));

              return (
                <div
                  key={idx}
                  className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <span className="day-number">{dateHelpers.formatDayNumber(date)}</span>
                  {dayTasks.length > 0 && (
                    <div className="task-indicators">
                      {dayTasks.slice(0, 3).map((t, i) => (
                        <span key={i} className="task-dot" style={{ backgroundColor: t.color }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tasks (Left) and Metrics (Right) */}
      <div className="content-split">
        <section className="tasks-section-left">
          <h3>{dateHelpers.isToday(selectedDate) ? "Today's Tasks" : 'Tasks'}</h3>
          {selectedDayTasks.length === 0 ? (
            <p className="empty-message">No tasks for this day</p>
          ) : (
            <div className="task-list">
              {selectedDayTasks
                .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
                .map(task => (
                  <div key={task.id} className="task-card" style={{ borderLeftColor: task.color }}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task.id)}
                      className="task-checkbox"
                    />
                    <div className="task-content">
                      <div className="task-title" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                        {task.title}
                      </div>
                      <div className="task-time">
                        {dateHelpers.formatTime(task.startTime)} - {dateHelpers.formatTime(task.endTime)}
                        {' • '}{formatTime(task.duration)}
                      </div>
                    </div>
                    <div className="task-actions">
                      <button onClick={() => handleEditTask(task)} title="Edit">✏️</button>
                      <button onClick={() => handleDeleteTask(task.id)} title="Delete">🗑️</button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>

        <aside className="metrics-section-right">
          <h3>Day Metrics</h3>
          <div className="metrics-grid-compact">
            <div className="metric-box">
              <span className="metric-label">Total</span>
              <span className="metric-value">{selectedDayTasks.length}</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Done</span>
              <span className="metric-value" style={{ color: 'var(--color-success)' }}>
                {completedTasks.length}
              </span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Rate</span>
              <span className="metric-value">{completionRate}%</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Total Time</span>
              <span className="metric-value">{formatTime(totalMinutes)}</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Completed</span>
              <span className="metric-value">{formatTime(completedMinutes)}</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Remaining</span>
              <span className="metric-value">{formatTime(totalMinutes - completedMinutes)}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* FAB Button */}
      <button className="fab" onClick={handleAddTask} title="Add task">
        +
      </button>

      {/* Task Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editingTask ? 'Edit Task' : 'New Task'}</h2>

            <input
              type="text"
              placeholder="Task title"
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
              className="form-input"
              autoFocus
            />

            <div className="form-row">
              <label>Time:</label>
              <select value={formHour} onChange={e => setFormHour(Number(e.target.value))} className="form-select">
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                ))}
              </select>
              <select value={formMinute} onChange={e => setFormMinute(Number(e.target.value))} className="form-select">
                {[0, 15, 30, 45].map(m => (
                  <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Duration:</label>
              <select value={formDuration} onChange={e => setFormDuration(Number(e.target.value))} className="form-select">
                {[15, 30, 45, 60, 90, 120, 180, 240].map(d => (
                  <option key={d} value={d}>{formatTime(d)}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Color:</label>
              <div className="color-picker">
                {TASK_COLORS.map(color => (
                  <button
                    key={color}
                    className={`color-btn ${formColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormColor(color)}
                  />
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSubmit} className="btn-primary">
                {editingTask ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

### Step 2: Create CalendarPage.css

Create or replace `src/pages/CalendarPage.css`:

```css
.calendar-page-new {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

/* Calendar Section - Full Width */
.calendar-section-full {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.calendar-header button {
  padding: 0.5rem 1rem;
  background: var(--color-background-secondary);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1.25rem;
  color: var(--color-text);
  transition: all var(--transition-fast);
}

.calendar-header button:hover {
  background: var(--color-primary);
  color: var(--color-text);
  transform: scale(1.05);
}

.calendar-header h2 {
  flex: 1;
  font-size: 1.5rem;
  color: var(--color-text);
}

.today-btn {
  font-size: 0.95rem !important;
}

/* Calendar Grid */
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.weekday {
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  padding: 0.5rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-background-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  padding: 0.5rem;
}

.calendar-day:hover {
  background: var(--color-primary);
  color: white;
  transform: scale(1.05);
}

.calendar-day.selected {
  background: var(--color-primary);
  color: white;
  font-weight: 700;
}

.calendar-day.today {
  border: 2px solid var(--color-primary);
}

.calendar-day.other-month {
  opacity: 0.3;
}

.day-number {
  font-size: 1rem;
}

.task-indicators {
  display: flex;
  gap: 2px;
  margin-top: 4px;
}

.task-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
}

/* Content Split - Tasks Left, Metrics Right */
.content-split {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

/* Tasks Section */
.tasks-section-left {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tasks-section-left h3 {
  margin-bottom: 1rem;
  color: var(--color-text);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.task-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--color-background-secondary);
  border-left: 4px solid;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.task-card:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.task-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.task-content {
  flex: 1;
}

.task-title {
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.task-time {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.task-actions button {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}

.task-actions button:hover {
  opacity: 1;
}

.empty-message {
  text-align: center;
  color: var(--color-text-secondary);
  padding: 2rem;
}

/* Metrics Section */
.metrics-section-right {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.metrics-section-right h3 {
  margin-bottom: 1rem;
  color: var(--color-text);
}

.metrics-grid-compact {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.metric-box {
  background: var(--color-background-secondary);
  padding: 1rem;
  border-radius: var(--radius-md);
  text-align: center;
}

.metric-label {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.metric-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

/* FAB Button */
.fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all var(--transition-fast);
  z-index: 1000;
}

.fab:hover {
  transform: scale(1.1) rotate(90deg);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-content h2 {
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background-secondary);
  color: var(--color-text);
  font-size: 1rem;
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.form-row label {
  font-weight: 600;
  color: var(--color-text);
  min-width: 80px;
}

.form-select {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background-secondary);
  color: var(--color-text);
}

.color-picker {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.color-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.color-btn:hover {
  transform: scale(1.2);
}

.color-btn.selected {
  border-color: var(--color-text);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-secondary,
.btn-primary {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-secondary {
  background: var(--color-background-secondary);
  color: var(--color-text);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-secondary:hover,
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 1024px) {
  .content-split {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .calendar-section-full,
  .tasks-section-left,
  .metrics-section-right {
    padding: 1rem;
  }

  .calendar-grid {
    gap: 0.25rem;
  }

  .day-number {
    font-size: 0.875rem;
  }

  .metrics-grid-compact {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .metric-value {
    font-size: 1.25rem;
  }
}
```

## Testing Checklist

Once implemented, test these features:

1. ✅ Click the 🌙/☀️ button → Theme should toggle
2. ✅ Click on calendar dates → Selection changes
3. ✅ Click "[←]" and "[→]" → Navigate months
4. ✅ Click "Today" → Jumps to current date
5. ✅ Click "+" FAB → Modal opens
6. ✅ Fill form and click "Create" → Task appears
7. ✅ Check task checkbox → Marks complete
8. ✅ Click ✏️ on task → Opens edit modal
9. ✅ Click 🗑️ on task → Deletes task
10. ✅ Metrics update when tasks change

## What Should Work Now

- **Batman Theme**: Dark greys in dark mode, light greys in light mode
- **Theme Toggle**: Fully functional with localStorage persistence
- **Calendar**: Interactive date selection, month navigation
- **Tasks**: Add, edit, delete, complete/uncomplete
- **Metrics**: Real-time calculations
- **FAB**: Quick add button
- **Modal**: Task creation/editing form
- **Layout**: Calendar top, tasks left, metrics right

Everything persists to localStorage and survives page refresh!
