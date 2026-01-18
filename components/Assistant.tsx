
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { generateAssistantResponse } from '../services/geminiService';
import { ChatMessage, ViewState } from '../types';

interface AssistantProps {
  contextData: string;
  onClose: () => void;
  // AI Actions
  onNavigate?: (view: string) => void;
  onAddActivity?: (activity: any) => void;
  onDeleteActivity?: (title: string) => void;
  onAddMedication?: (medication: any) => void;
}

export const Assistant: React.FC<AssistantProps> = ({ 
  contextData, 
  onClose,
  onNavigate,
  onAddActivity,
  onDeleteActivity,
  onAddMedication
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello Elanor! I can help you manage your schedule or navigate the app. What do you need?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateAssistantResponse(userMsg.text, contextData);
      
      // Process Text Response
      if (response.text) {
        setMessages(prev => [...prev, { role: 'model', text: response.text }]);
      }

      // Process Tool Calls
      if (response.toolCalls && response.toolCalls.length > 0) {
        response.toolCalls.forEach(call => {
           console.log("Executing Tool:", call.name, call.args);
           
           if (call.name === 'navigate_to' && onNavigate) {
              onNavigate(call.args.view);
           } 
           else if (call.name === 'add_activity' && onAddActivity) {
              onAddActivity(call.args);
           }
           else if (call.name === 'delete_activity' && onDeleteActivity) {
              onDeleteActivity(call.args.title);
           }
           else if (call.name === 'add_medication' && onAddMedication) {
              onAddMedication(call.args);
           }
        });
        
        // If the model invoked a tool but didn't return text (sometimes happens), add a confirmation
        if (!response.text) {
           setMessages(prev => [...prev, { role: 'model', text: "I've updated that for you, Elanor." }]);
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to my brain right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      {/* Main Container */}
      <div className="bg-white w-full max-w-md h-[90vh] sm:h-[80vh] sm:rounded-[2rem] rounded-t-[2rem] flex flex-col shadow-2xl overflow-hidden pointer-events-auto relative transform transition-transform duration-300 ease-out">
        
        {/* Header */}
        <div className="bg-white p-4 px-6 flex justify-between items-center border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center text-white">
                <Icon name="sparkles" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Companion</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-slate-500 font-medium">Online</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* Chat Area - Uses flex-1 and min-h-0 to scroll correctly regardless of font size */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 min-h-0">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 text-[1rem] leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-2xl rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-none flex items-center gap-2 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0 safe-area-bottom">
          <div className="flex gap-3 items-center">
            <div className="flex-1 bg-slate-100 rounded-full px-2 flex items-center border border-transparent focus-within:border-brand-300 focus-within:bg-white transition-all">
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 p-3 bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400 text-[1rem]"
                />
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center hover:bg-brand-700 disabled:opacity-50 disabled:bg-slate-300 transition-colors shadow-lg shadow-brand-200"
            >
              <Icon name="send" size={20} className="ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
