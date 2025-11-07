# TimeKeeper

A futuristic task management calendar application with a Batman-style aesthetic.

## Features

- Interactive calendar with task tracking
- **AI Scheduling Assistant** - Chat with an AI to build task schedules
- Dark/Light theme support
- Task creation and management
- Time tracking and progress visualization
- Holographic green accent design
- Metrics dashboard

## Tech Stack

- React 19
- TypeScript
- Vite
- date-fns
- react-icons
- Framer Motion

## Getting Started

### Installation

```bash
npm install
```

### Configuration

To use the AI Scheduling Assistant, you need to configure an OpenRouter API key:

1. Get your API key from [OpenRouter](https://openrouter.ai/keys)
2. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
3. Add your API key to `.env`:
   ```
   VITE_OPENROUTER_API_KEY=your_api_key_here
   ```

The AI assistant will be disabled if no API key is configured.

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

- `/src` - Source code
  - `/components` - React components
  - `/pages` - Page components
  - `/theme` - Theme context and styling
  - `/types` - TypeScript type definitions
  - `/utils` - Utility functions
  - `/hooks` - Custom React hooks
- `/public` - Static assets
- `/dist` - Production build output

## License

See LICENSE file for details.
