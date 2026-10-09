import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User } from 'lucide-react';
import { askAssistant, isUsingRealAI } from '../services/aiService';
import { useApp } from '../context/AppContext';
import type { ChatMessage } from '../types';

const CampusAssistant: React.FC = () => {
  const { complaints } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm the CampusCare AI Assistant. I can help you with:\n\n• Finding the right department for your issue\n• Understanding complaint procedures & escalation\n• Checking the status of your complaints\n• Guidance when issues persist or recur\n• Campus safety and emergency procedures\n\nHow can I help you today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askAssistant(text, complaints);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "Who handles Wi-Fi problems?",
    "How do I report a broken projector?",
    "Where do I contact for security issues?",
    "What's the complaint process?",
    "What if my complaint is marked resolved but problem still exists?",
    "How does automatic escalation work?",
    "Who handles lost ID cards?"
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col glass-card p-0 overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">CampusCare AI Assistant</h1>
            <p className="text-xs text-gray-400">Ask me anything about campus services and departments.</p>
          </div>
        </div>
        <div className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
          {isUsingRealAI() ? 'Gemini AI Active' : 'Demo Mode'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-purple-500' : 'bg-blue-600'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`p-3 rounded-2xl whitespace-pre-wrap text-sm ${
              msg.role === 'user' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-none' 
                : 'glass-card rounded-tl-none border border-slate-700/50'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="glass-card rounded-2xl rounded-tl-none border border-slate-700/50 p-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-900/50 border-t border-slate-700">
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="whitespace-nowrap px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-full border border-slate-600 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="input-field flex-1"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="btn-primary p-3 flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CampusAssistant;
