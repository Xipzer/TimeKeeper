# TimeKeeper

A delightful React Native mobile app for micromanaging daily tasks with an interactive calendar system.

## Features

- **Modern UI/UX**: Beautiful, smooth animations with haptic feedback throughout
- **Task Management**: Create, edit, complete, and delete tasks with intuitive gestures
- **Dark Mode**: Full dark mode support with automatic system theme detection
- **Calendar Views**: Day, week, and month views (coming soon)
- **Statistics**: Track your productivity with completion rates and streaks
- **Offline-First**: All data stored locally with AsyncStorage

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for routing
- **React Native Reanimated** for smooth animations
- **React Native Gesture Handler** for native gestures
- **Expo Haptics** for tactile feedback
- **AsyncStorage** for local data persistence
- **date-fns** for date manipulation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd TimeKeeper
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your platform:
```bash
npm run ios     # iOS
npm run android # Android
npm run web     # Web
```

## Project Structure

```
/src
  /components
    /Calendar      # Calendar views (MonthView, WeekView, DayView)
    /Tasks         # Task components (TaskCard, TaskForm, TaskList)
    /UI            # Reusable UI components (Button, FAB, BottomSheet, Input)
  /screens
    /Home          # Main calendar/task view
    /TaskDetail    # Task detail and creation screen
    /Statistics    # Stats and analytics
    /Settings      # App settings
  /navigation      # Navigation configuration
  /hooks           # Custom React hooks (useTaskManager, useCalendar)
  /utils           # Utility functions (dateHelpers, storage, haptics)
  /theme           # Theme system (colors, spacing, typography)
  /types           # TypeScript type definitions
```

## Key Features

### Task Management
- **Quick Add**: Tap the FAB to quickly add tasks
- **Swipe Gestures**: Swipe right to complete, left to delete
- **Task Cards**: Beautiful, color-coded task cards with time blocks
- **Duration Presets**: Quick duration selection (15m, 30m, 1h, 2h, etc.)

### Animations & Micro-interactions
- **Spring Physics**: All animations use spring-based physics for natural feel
- **Haptic Feedback**: Tactile feedback on all interactions
- **Scale Animations**: Subtle scale on press for better feedback
- **Smooth Transitions**: Seamless navigation between screens

### Theme System
- **Light/Dark Mode**: Full support for both themes
- **Auto-Detection**: Automatically follows system theme
- **Consistent Design**: Unified color palette and spacing system
- **Custom Colors**: 10 vibrant task colors to choose from

### Data Persistence
- **Local Storage**: All tasks saved to AsyncStorage
- **Offline-First**: No internet required
- **Fast Access**: Optimized for quick loading
- **Type-Safe**: Full TypeScript coverage

## Implemented Features

- ✅ Project setup with Expo and TypeScript
- ✅ Theme system with dark mode
- ✅ Navigation structure
- ✅ Task storage with AsyncStorage
- ✅ Task CRUD operations
- ✅ Swipe gestures for task completion/deletion
- ✅ Haptic feedback
- ✅ Beautiful UI components (Button, FAB, TaskCard)
- ✅ Statistics screen
- ✅ Settings screen with theme toggle

## Upcoming Features

- 🚧 Calendar components (Month, Week, Day views)
- 🚧 Drag-and-drop task rescheduling
- 🚧 Task creation modal with bottom sheet
- 🚧 Advanced statistics with charts
- 🚧 Confetti animation on task completion
- 🚧 Empty states with illustrations
- 🚧 Loading skeletons
- 🚧 Notifications and reminders
- 🚧 Task templates
- 🚧 Export functionality

## Design Principles

1. **Speed**: Every action should feel instant with optimistic updates
2. **Delight**: Surprise users with playful animations and feedback
3. **Clarity**: Information hierarchy should be obvious
4. **Accessibility**: Proper contrast ratios, touch target sizes (44x44 min)

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with React Native and Expo
- Inspired by modern task management apps
- Designed for delightful daily use
