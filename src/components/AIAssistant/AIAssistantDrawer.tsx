import React, { useState, useRef, useEffect } from 'react';
import './AIAssistantDrawer.css';
import { FiSend, FiX } from 'react-icons/fi';
import { createTask } from '../../utils/openrouter';
import type { Task } from '../../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onTasksCreated: (tasks: Task[]) => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  onTasksCreated,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI scheduling assistant. I can help you create tasks and build a schedule for your day. Just tell me what you need to get done!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call OpenRouter API
      const response = await createTask(input.trim(), messages);

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If tasks were created, notify parent
      if (response.tasks && response.tasks.length > 0) {
        onTasksCreated(response.tasks);
      }
    } catch (error) {
      console.error('Error communicating with AI:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure your OpenRouter API key is configured.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="ai-assistant-backdrop" onClick={onClose} />

      {/* Drawer */}
      <div className="ai-assistant-drawer">
        {/* Header */}
        <div className="ai-assistant-header">
          <h2>AI Scheduling Assistant</h2>
          <button className="ai-assistant-close" onClick={onClose} title="Close">
            <FiX />
          </button>
        </div>

        {/* Messages */}
        <div className="ai-assistant-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`ai-message ${message.role === 'user' ? 'ai-message-user' : 'ai-message-assistant'}`}
            >
              <div className="ai-message-content">
                {message.content}
              </div>
              <div className="ai-message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="ai-message ai-message-assistant">
              <div className="ai-message-content ai-typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="ai-assistant-input-container">
          <textarea
            ref={inputRef}
            className="ai-assistant-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your tasks or schedule needs..."
            rows={2}
            disabled={isLoading}
          />
          <button
            className="ai-assistant-send"
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            title="Send message"
          >
            <FiSend />
          </button>
        </div>
      </div>
    </>
  );
};
