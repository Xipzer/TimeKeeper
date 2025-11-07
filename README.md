# TimeKeeper

A futuristic task management calendar application with a Batman-style aesthetic, featuring AI-powered scheduling assistance.

## 🚀 Features

### Core Functionality
- **Interactive Multi-Month Calendar** - Scrollable calendar view displaying multiple months with 2 months per row
- **Comprehensive Task Management** - Create, edit, delete, and track tasks with full CRUD operations
- **AI Scheduling Assistant** - Natural language task creation powered by Claude Sonnet via OpenRouter
- **Real-Time Metrics Dashboard** - View total tasks, completed tasks, hours planned, and completion rates
- **Dark/Light Theme Support** - Seamless theme switching with persistent preferences

### Calendar Features
- **Informative Calendar Cells** - Each date displays:
  - Total number of tasks
  - Total hours scheduled
  - Progress percentage with visual bar
- **Color-Coded Tasks** - 10 predefined colors for easy categorization:
  - Red: Urgent/Important
  - Teal: Work/Professional
  - Blue: Personal
  - Salmon: Creative
  - Mint: Health/Wellness
  - Yellow: Learning
  - Purple: Social
  - Sky Blue: Meetings
  - Orange: Projects
  - Green: Completed/Success

### AI Assistant
- **Conversational Task Creation** - Describe tasks in natural language
- **Batch Scheduling** - Create multiple tasks in a single conversation
- **Smart Defaults** - AI suggests appropriate times, durations, and colors
- **Context-Aware** - Maintains conversation history for follow-up requests

### Design
- **Holographic Green Accents** - Futuristic gradient effects throughout the UI
- **Midnight Aesthetic** - Dark, sleek, and stealthy design
- **Animated Elements** - Smooth transitions, shine effects, and scanning lines
- **Responsive Layout** - Optimized for desktop with mobile support

## 🛠 Tech Stack

- **React 19** - Latest React with modern hooks and patterns
- **TypeScript** - Full type safety and enhanced developer experience
- **Vite** - Lightning-fast build tool and dev server
- **date-fns** - Modern date manipulation library
- **react-icons** - Comprehensive icon library
- **Framer Motion** - Production-ready animation library
- **OpenRouter API** - AI model access (Claude Sonnet 3.5)
- **LocalStorage** - Client-side task persistence

## 📦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenRouter API key (for AI assistant features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Xipzer/TimeKeeper.git
   cd TimeKeeper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional, for AI assistant):
   ```bash
   cp .env.example .env
   ```

4. Add your OpenRouter API key to `.env`:
   ```
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

   Get your API key from [OpenRouter](https://openrouter.ai/keys)

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📖 Usage

### Creating Tasks Manually

1. Click on any date in the calendar
2. Click the **"+ Add Task"** button in the tasks panel
3. Fill in task details:
   - Title (required)
   - Start time (hour and minute)
   - Duration in minutes
   - Color category
4. Click **"Create"** to save

### Using the AI Assistant

1. Click the **robot icon** in the top left corner
2. Type your scheduling request in natural language:
   - *"Schedule a team meeting tomorrow at 2pm for 90 minutes"*
   - *"I need to work on the presentation from 9am to 11am today"*
   - *"Plan my day tomorrow: gym at 7am (1hr), work from 9-5, dinner at 6:30pm"*
3. The AI will create tasks automatically and confirm the details
4. Tasks appear immediately in your calendar

### Managing Tasks

- **Edit**: Click the edit icon (pencil) on any task
- **Delete**: Click the trash icon on any task
- **Complete**: Click the checkbox to mark a task as done
- **View Details**: Click on a date to see all tasks for that day

### Theme Switching

- Click the **settings icon** (gear) in the top right corner
- Select **Light** or **Dark** theme
- Your preference is saved automatically

### Resetting Data

- Click the settings icon
- Click **"Reset All Tasks"** (red button)
- Confirm to delete all tasks permanently

## 🗂 Project Structure

```
TimeKeeper/
├── src/
│   ├── components/
│   │   ├── AIAssistant/      # AI chat drawer component
│   │   ├── Layout/            # App layout and navigation
│   │   ├── Calendar/          # Calendar-specific components (legacy)
│   │   ├── Tasks/             # Task-specific components (legacy)
│   │   └── UI/                # Reusable UI components (legacy)
│   ├── pages/
│   │   └── CalendarPage.tsx   # Main calendar and task management page
│   ├── theme/
│   │   └── ThemeContext.tsx   # Theme provider and context
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   ├── utils/
│   │   ├── dateHelpers.ts     # Date manipulation utilities
│   │   ├── storage.ts         # LocalStorage helpers
│   │   └── openrouter.ts      # OpenRouter API integration
│   ├── App.tsx                # Root application component
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles and CSS variables
├── public/                    # Static assets
├── .env.example               # Environment variable template
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies
```

## 🎨 Color Palette

The application uses a carefully selected color scheme for different task types:

| Color | Hex Code | Use Case |
|-------|----------|----------|
| Red | `#FF6B6B` | Urgent/Important tasks |
| Teal | `#4ECDC4` | Work/Professional |
| Blue | `#45B7D1` | Personal tasks |
| Salmon | `#FFA07A` | Creative projects |
| Mint | `#98D8C8` | Health/Wellness |
| Yellow | `#F7DC6F` | Learning activities |
| Purple | `#BB8FCE` | Social events |
| Sky Blue | `#85C1E2` | Meetings |
| Orange | `#F8B739` | Projects |
| Green | `#52B788` | Completed/Success |

## 🤖 AI Assistant Details

The AI scheduling assistant uses **Claude Sonnet 3.5** via OpenRouter for intelligent task creation:

### Capabilities
- Understands natural language date/time references
- Automatically calculates task durations
- Suggests appropriate task colors based on context
- Handles multiple tasks in one conversation
- Provides friendly, conversational responses

### Example Interactions

**Simple Task:**
```
User: "Add a dentist appointment tomorrow at 3pm"
AI: Creates task for next day at 15:00, suggests 60min duration
```

**Complex Schedule:**
```
User: "Plan my Monday: morning standup at 9am (30min),
      code review 10-12, lunch break at noon for an hour,
      and client call at 2pm for 2 hours"
AI: Creates 4 tasks with proper times, durations, and colors
```

**Contextual Follow-up:**
```
User: "Schedule a meeting for the design team"
AI: "What time would you like to schedule it?"
User: "Tomorrow at 10am for 2 hours"
AI: Creates the task with appropriate details
```

## 🔐 Privacy & Data

- All task data is stored locally in your browser's LocalStorage
- No data is sent to external servers except OpenRouter API calls (when using AI assistant)
- OpenRouter API calls only include conversation context, not your entire task database
- You can export/clear all data using the Reset button

## 📄 License

See [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- AI powered by [OpenRouter](https://openrouter.ai/) and [Anthropic Claude](https://www.anthropic.com/claude)
- Date utilities from [date-fns](https://date-fns.org/)

## 🐛 Known Issues

- AI assistant requires an active internet connection and valid API key
- Calendar scrolling may have minor performance impacts with 100+ tasks
- Theme preference may reset if LocalStorage is cleared

## 🚧 Future Enhancements

- Task recurrence/repeating events
- Task categories and tags
- Export to iCal/Google Calendar
- Drag-and-drop task rescheduling
- Task search and filtering
- Multi-user support with sync
- Mobile app version
- Task reminders and notifications

---
