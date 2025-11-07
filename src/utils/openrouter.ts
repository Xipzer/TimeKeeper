import { TASK_COLORS } from '../types';
import type { Task, TaskColor } from '../types';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface CreateTaskTool {
  date: string; // YYYY-MM-DD format
  title: string;
  description?: string;
  startTime: string; // HH:MM format (24-hour)
  duration: number; // minutes
  color?: string; // hex color
}

interface OpenRouterResponse {
  message: string;
  tasks: Task[];
}

// Tool/function definitions for the LLM
const tools = [
  {
    type: 'function',
    function: {
      name: 'create_tasks',
      description: 'Create one or more tasks in the user\'s calendar. Each task must have a date, title, start time, and duration. You can create multiple tasks at once to build a complete schedule.',
      parameters: {
        type: 'object',
        properties: {
          tasks: {
            type: 'array',
            description: 'Array of tasks to create',
            items: {
              type: 'object',
              properties: {
                date: {
                  type: 'string',
                  description: 'Date for the task in YYYY-MM-DD format (e.g., "2024-11-07")',
                },
                title: {
                  type: 'string',
                  description: 'Title of the task',
                },
                description: {
                  type: 'string',
                  description: 'Optional detailed description of the task',
                },
                startTime: {
                  type: 'string',
                  description: 'Start time in 24-hour HH:MM format (e.g., "09:00", "14:30")',
                },
                duration: {
                  type: 'number',
                  description: 'Duration in minutes (e.g., 30, 60, 120)',
                },
                color: {
                  type: 'string',
                  description: 'Optional hex color code for the task. Available colors: #FF6B6B (red), #4ECDC4 (teal), #45B7D1 (blue), #FFA07A (salmon), #98D8C8 (mint), #F7DC6F (yellow), #BB8FCE (purple), #85C1E2 (sky), #F8B739 (orange), #52B788 (green)',
                  enum: TASK_COLORS,
                },
              },
              required: ['date', 'title', 'startTime', 'duration'],
            },
          },
        },
        required: ['tasks'],
      },
    },
  },
];

// Convert tool call to actual tasks
function toolCallToTasks(toolCall: CreateTaskTool[]): Task[] {
  return toolCall.map((taskData) => {
    const [year, month, day] = taskData.date.split('-').map(Number);
    const [hours, minutes] = taskData.startTime.split(':').map(Number);

    const startTime = new Date(year, month - 1, day, hours, minutes);
    const endTime = new Date(startTime.getTime() + taskData.duration * 60000);

    // Validate and use color, default to random if invalid
    let color: TaskColor = taskData.color as TaskColor;
    if (!taskData.color || !TASK_COLORS.includes(taskData.color as TaskColor)) {
      color = TASK_COLORS[Math.floor(Math.random() * TASK_COLORS.length)];
    }

    const task: Task = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: taskData.title,
      description: taskData.description,
      startTime,
      endTime,
      duration: taskData.duration,
      color,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return task;
  });
}

export async function createTask(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<OpenRouterResponse> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured. Please set VITE_OPENROUTER_API_KEY in your .env file.');
  }

  // Build messages array
  const messages: Message[] = [
    {
      role: 'system',
      content: `You are a helpful AI scheduling assistant for TimeKeeper, a task management application. Your role is to help users create and organize their tasks and schedules.

Current date and time: ${new Date().toLocaleString()}

When users ask you to create tasks or build a schedule:
1. Ask clarifying questions if needed (date, time, duration, etc.)
2. Use the create_tasks function to add tasks to their calendar
3. Suggest reasonable durations and times if not specified
4. You can create multiple tasks at once to build a complete schedule
5. Be friendly, concise, and helpful

Available task colors and their meanings:
- Red (#FF6B6B): Urgent/Important
- Teal (#4ECDC4): Work/Professional
- Blue (#45B7D1): Personal
- Salmon (#FFA07A): Creative
- Mint (#98D8C8): Health/Wellness
- Yellow (#F7DC6F): Learning
- Purple (#BB8FCE): Social
- Sky Blue (#85C1E2): Meetings
- Orange (#F8B739): Projects
- Green (#52B788): Completed/Success`,
    },
    ...conversationHistory.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    {
      role: 'user',
      content: userMessage,
    },
  ];

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'TimeKeeper',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet', // Using Claude Sonnet for best results
        messages,
        tools,
        tool_choice: 'auto',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message;

    if (!assistantMessage) {
      throw new Error('No response from AI');
    }

    // Check if the assistant made a tool call
    const createdTasks: Task[] = [];
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      for (const toolCall of assistantMessage.tool_calls) {
        if (toolCall.function.name === 'create_tasks') {
          const args = JSON.parse(toolCall.function.arguments);
          const tasks = toolCallToTasks(args.tasks);
          createdTasks.push(...tasks);
        }
      }
    }

    // Get the text content
    let messageContent = assistantMessage.content || '';

    // If tasks were created and no message was provided, create a helpful message
    if (createdTasks.length > 0 && !messageContent.trim()) {
      messageContent = `I've created ${createdTasks.length} task${createdTasks.length > 1 ? 's' : ''} for you:\n\n${createdTasks.map(t => `• ${t.title} - ${t.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${t.duration} min)`).join('\n')}`;
    }

    return {
      message: messageContent,
      tasks: createdTasks,
    };
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    throw error;
  }
}
