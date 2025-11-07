import React, { useState, useEffect } from 'react';
import { dateHelpers } from '../utils/dateHelpers';
import { taskStorage } from '../utils/storage';
import { TASK_COLORS } from '../types';
import type { Task, TaskColor } from '../types';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import './CalendarPage.css';

export const CalendarPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
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

  // Generate 6 months for scrollable view (3 past, current, 2 future)
  const generateMonths = () => {
    const months = [];
    const today = new Date();

    for (let i = -3; i <= 2; i++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
      months.push(monthDate);
    }

    return months;
  };

  const renderMonth = (monthDate: Date) => {
    const days = dateHelpers.getMonthWithPadding(monthDate);

    return (
      <div key={monthDate.toISOString()} className="month-container">
        <div className="month-label">
          {dateHelpers.formatMonthYear(monthDate)}
        </div>

        <div className="weekdays">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {days.map((date, idx) => {
            const isSelected = dateHelpers.isSameDay(date, selectedDate);
            const isToday = dateHelpers.isToday(date);
            const isCurrentMonth = dateHelpers.isSameMonth(date, monthDate);
            const dayTasks = tasks.filter(t => dateHelpers.isSameDay(t.startTime, date));

            // Calculate metrics for this day
            const totalTasks = dayTasks.length;
            const totalMinutes = dayTasks.reduce((sum, t) => sum + t.duration, 0);
            const totalHours = totalMinutes / 60;
            const completedTasks = dayTasks.filter(t => t.completed).length;
            const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            return (
              <div
                key={idx}
                className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                <span className="day-number">{dateHelpers.formatDayNumber(date)}</span>
                {totalTasks > 0 && (
                  <div className="day-metrics">
                    <div className="day-metrics-row">
                      <div className="day-metric-col">
                        <div className="day-metric-label">Tasks</div>
                        <div className="day-metric-value total">{totalTasks}</div>
                      </div>
                      <div className="day-metric-col">
                        <div className="day-metric-label">Time</div>
                        <div className="day-metric-value hours">{totalHours.toFixed(0)}H</div>
                      </div>
                    </div>
                    <div className="day-progress-container">
                      <div className="day-progress-bar">
                        <div
                          className="day-progress-fill"
                          style={{ width: `${progressPercent}%` }}
                        >
                          <span className="day-progress-text">{progressPercent}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-page-new">
      {/* Calendar - Full Width at Top */}
      <section className="calendar-section-full">
        <div className="calendar-scroll-container">
          {generateMonths().map(month => renderMonth(month))}
        </div>
      </section>

      {/* Tasks (Left) and Metrics (Right) */}
      <div className="content-split">
        <section className="tasks-section-left">
          <div className="tasks-header">
            <h3>{dateHelpers.isToday(selectedDate) ? "Today's Tasks" : 'Tasks'}</h3>
            <button className="add-task-button" onClick={handleAddTask}>
              + Add Task
            </button>
          </div>
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
                      <button onClick={() => handleEditTask(task)} title="Edit"><FiEdit2 /></button>
                      <button onClick={() => handleDeleteTask(task.id)} title="Delete"><FiTrash2 /></button>
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
