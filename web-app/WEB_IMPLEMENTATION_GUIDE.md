# TimeKeeper Web App - Desktop-First Implementation Guide

## Overview

Converting from React Native mobile app to modern React web app optimized for desktop with responsive mobile support.

## Architecture Changes

### From Mobile to Desktop-First Design

**Mobile (React Native)**
- Bottom tab navigation
- Single column layout
- Touch-optimized
- Native animations

**Desktop-First (React Web)**
- Sidebar navigation (fixed on desktop)
- Multi-column layout utilizing screen space
- Mouse + keyboard optimized
- CSS animations & Framer Motion

## Desktop Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Header (App title, theme toggle, user actions)        │
├───────────┬─────────────────────────────────────────────┤
│           │                                             │
│  Sidebar  │           Main Content Area                │
│           │                                             │
│  - Cal    │  ┌────────────────┬─────────────────────┐  │
│  - Stats  │  │                │                     │  │
│  - Set    │  │   Calendar     │    Day Metrics     │  │
│           │  │    (Large)     │    + Task List     │  │
│  (Fixed)  │  │                │                     │  │
│           │  └────────────────┴─────────────────────┘  │
│           │                                             │
└───────────┴─────────────────────────────────────────────┘
```

### Responsive Breakpoints

- **Desktop (>1024px)**: Sidebar + Two-column content
- **Tablet (768-1024px)**: Collapsible sidebar + Single column
- **Mobile (<768px)**: Bottom navigation + Single column

## Key Implementation Files

### 1. App Layout Structure

```typescript
// src/components/Layout/AppLayout.tsx
- Sidebar navigation (fixed on desktop)
- Responsive container
- Theme provider wrapper

// src/components/Layout/Sidebar.tsx
- Navigation links
- Active state indicators
- Collapse/expand for mobile

// src/components/Layout/Header.tsx
- App branding
- Theme toggle
- User menu (future)
```

### 2. Calendar Components (Desktop-Optimized)

```typescript
// src/components/Calendar/MonthCalendar.tsx
- CSS Grid layout (7 columns)
- Larger date cells
- Hover states
- Keyboard navigation (arrow keys)

// src/components/Calendar/CalendarHeader.tsx
- Month navigation
- Today button
- View selector (future: week/day views)

// src/components/Calendar/DayMetrics.tsx
- Card-based layout
- Animated numbers
- Colorful visualizations
```

### 3. Task Components

```typescript
// src/components/Tasks/TaskCard.tsx
- Hover effects (elevation increase)
- Checkbox for completion
- Click to edit
- Delete button on hover

// src/components/Tasks/TaskForm.tsx
- Modal dialog (not bottom sheet)
- Form validation
- Time picker (web-optimized)
- Color picker grid

// src/components/Tasks/TaskList.tsx
- Virtual scrolling for performance
- Empty states
- Drag-and-drop (future)
```

### 4. Desktop-Specific Features

**Keyboard Shortcuts**
- `Ctrl/Cmd + K`: Quick add task
- `←/→`: Navigate months
- `T`: Jump to today
- `Esc`: Close modals

**Mouse Interactions**
- Hover states on all interactive elements
- Context menus (right-click)
- Drag-and-drop task rescheduling
- Tooltip on truncated text

**Performance Optimizations**
- Code splitting by route
- Lazy loading components
- Virtual scrolling for long lists
- Optimized re-renders with React.memo

## Styling Approach

### CSS Modules + CSS Variables

```css
/* Design tokens in :root */
--color-primary: #6366F1;
--spacing-md: 1rem;
--radius-lg: 1rem;

/* Component-specific styles */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--spacing-sm);
}
```

### Responsive Design

```css
/* Mobile First (base styles) */
.sidebar {
  position: fixed;
  bottom: 0;
  width: 100%;
}

/* Tablet */
@media (min-width: 768px) {
  .sidebar {
    left: 0;
    width: 280px;
    height: 100vh;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .main-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--spacing-xl);
  }
}
```

## Data Storage

### LocalStorage (Web)

```typescript
// src/utils/storage.ts
- localStorage API (replaces AsyncStorage)
- JSON serialization
- Error handling
- Type-safe getters/setters
```

## Animation Library

### Framer Motion

```typescript
import { motion } from 'framer-motion';

// Example: Task card animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, x: -100 }}
  transition={{ type: "spring", damping: 20 }}
>
  <TaskCard {...props} />
</motion.div>
```

## Implementation Priority

1. ✅ Setup Vite + React + TypeScript
2. ✅ Create CSS design system with variables
3. ⏳ Build AppLayout with Sidebar
4. ⏳ Convert Calendar components for desktop
5. ⏳ Implement Task components
6. ⏳ Add responsive breakpoints
7. ⏳ Implement keyboard shortcuts
8. ⏳ Add animations with Framer Motion
9. ⏳ Performance optimization
10. ⏳ Cross-browser testing

## Next Steps

Run the development server and start building:

```bash
npm run dev
```

Access at: http://localhost:5173
