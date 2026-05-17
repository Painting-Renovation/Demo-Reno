'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Minimize2, Sparkles, Calendar, DollarSign, ListChecks, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const autoResponses: Record<string, string> = {
  quote: "Great choice! We'd love to give you a free estimate. You can fill out our quick online form, or I can help you get started right here. What type of painting project are you looking for? (Interior, Exterior, Cabinet, Commercial)",
  services: "We offer a full range of professional painting services:\n\n🎨 Interior Painting\n🏠 Exterior Painting\n🪑 Cabinet Refinishing\n🏢 Commercial Painting\n🪵 Deck & Fence\n🎨 Color Consultation\n\nWould you like details on any specific service?",
  pricing: "Our pricing depends on several factors like project size, paint quality, and prep work needed. Here's a rough guide:\n\n• Room painting: $400 - $1,200\n• Full home interior: $3,000 - $10,000+\n• Exterior painting: $2,500 - $8,000+\n• Cabinet refinishing: $1,500 - $4,000\n\nWant a precise quote? It's always free!",
  schedule: "We'd be happy to schedule a consultation! Our availability:\n\n📅 Mon-Fri: 8am - 6pm\n📅 Sat: 9am - 3pm\n📅 Sun: Closed\n\nWould you like me to help book an appointment? Or you can use our online scheduling tool for real-time availability.",
  default: "Thanks for your message! I'll make sure our team gets back to you promptly. In the meantime, you can:\n\n• Fill out our free estimate form\n• Browse our service gallery\n• Check out our customer reviews\n\nIs there anything specific I can help with?",
};

const quickReplies = [
  { label: 'Get a Quote', icon: FileText, key: 'quote' },
  { label: 'Our Services', icon: ListChecks, key: 'services' },
  { label: 'Pricing', icon: DollarSign, key: 'pricing' },
  { label: 'Schedule', icon: Calendar, key: 'schedule' },
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function ChatBotPanel() {
  const { setEstimateFormOpen, setAppointmentFormOpen } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: 'Hi there! 👋 Welcome to ProCoat Painters. I\'m here to help you with anything — quotes, services, pricing, or scheduling. How can I assist you today?',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const getAutoResponse = useCallback((text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes('quote') || lower.includes('estimate') || lower.includes('price')) return autoResponses.quote;
    if (lower.includes('service') || lower.includes('offer') || lower.includes('do you')) return autoResponses.services;
    if (lower.includes('pric') || lower.includes('cost') || lower.includes('how much')) return autoResponses.pricing;
    if (lower.includes('schedule') || lower.includes('book') || lower.includes('appointment') || lower.includes('when')) return autoResponses.schedule;
    return autoResponses.default;
  }, []);

  const handleQuickReply = useCallback((key: string) => {
    const replyLabel = quickReplies.find((r) => r.key === key)?.label ?? key;
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: replyLabel,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    if (key === 'quote') {
      setEstimateFormOpen(true);
      setTimeout(() => setIsOpen(false), 1000);
      return;
    }

    if (key === 'schedule') {
      setAppointmentFormOpen(true);
      setTimeout(() => setIsOpen(false), 1000);
      return;
    }

    setIsTyping(true);
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      setIsTyping(false);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: autoResponses[key] ?? autoResponses.default,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      if (!isOpen || isMinimized) {
        setUnreadCount((c) => c + 1);
      }
    }, delay);
  }, [isOpen, isMinimized, setEstimateFormOpen, setAppointmentFormOpen]);

  const handleSendMessage = useCallback(() => {
    const messageText = input.trim();
    if (!messageText) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: messageText,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      setIsTyping(false);
      const responseText = getAutoResponse(messageText);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: responseText,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      if (!isOpen || isMinimized) {
        setUnreadCount((c) => c + 1);
      }
    }, delay);
  }, [input, isOpen, isMinimized, getAutoResponse]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  }, []);

  const handleMinimize = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50" style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom))', right: 'max(1.5rem, env(safe-area-inset-right))' }}>
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="mb-4 w-[calc(100vw-3rem)] sm:w-[360px] sm:max-w-[400px] max-h-[70vh] sm:max-h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-navy to-navy-light px-5 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-gold" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-navy" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
                      ProCoat Assistant
                      <Badge className="bg-gold/20 text-gold text-[9px] px-1.5 py-0 border-0 h-4">AI</Badge>
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-white/60 text-xs">Online — typically replies in 5 min</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleMinimize}
                    className="text-white/50 hover:text-white transition-colors p-2 -mr-1 rounded-lg hover:bg-white/10 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Minimize chat"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleClose}
                    className="text-white/50 hover:text-white transition-colors p-2 -mr-1 rounded-lg hover:bg-white/10 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Close chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Response Time Notice */}
            <div className="bg-gold/5 border-b border-gold/10 px-5 py-2 flex-shrink-0">
              <p className="text-[11px] text-gold/80 text-center font-medium flex items-center justify-center gap-1">
                <Bot className="w-3 h-3" />
                Our team typically responds within 5 minutes during business hours
              </p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-cream/50 px-4 py-4 space-y-3 min-h-[280px] max-h-[340px]">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2 ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {msg.isBot && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-navy flex items-center justify-center mt-1 shadow-sm">
                      <Bot className="w-3.5 h-3.5 text-gold" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-2.5 shadow-sm ${
                      msg.isBot
                        ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                        : 'bg-navy text-white rounded-tr-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                    <p
                      className={`text-[10px] mt-1 ${
                        msg.isBot ? 'text-gray-400' : 'text-white/40'
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                  {!msg.isBot && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center mt-1 shadow-sm">
                      <User className="w-3.5 h-3.5 text-gold" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 items-end"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-navy flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="bg-cream/30 px-4 py-2.5 flex-shrink-0">
              <div className="flex flex-wrap gap-1.5">
                {quickReplies.map((reply) => (
                  <button
                    key={reply.key}
                    onClick={() => handleQuickReply(reply.key)}
                    className="flex items-center gap-1.5 text-xs font-medium bg-white border border-gray-200 text-navy hover:bg-gold hover:text-white hover:border-gold px-3 py-2 rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md min-h-[36px]"
                  >
                    <reply.icon className="w-3 h-3" />
                    {reply.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-100 px-4 py-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask us anything about painting..."
                  className="flex-1 text-sm bg-cream border border-gray-200 rounded-xl px-4 py-2.5 text-navy placeholder:text-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim()}
                  className="flex-shrink-0 w-10 h-10 rounded-xl bg-gold hover:bg-gold-light text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md hover:shadow-lg"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            className="relative flex items-center gap-2 bg-navy hover:bg-navy-light text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl transition-colors cursor-pointer group"
          >
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-sm font-medium hidden sm:inline"
            >
              Chat with us
            </motion.span>
            <div className="relative">
              <MessageCircle className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white"
                >
                  {unreadCount}
                </motion.span>
              )}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Minimized state */}
      {isOpen && isMinimized && (
        <motion.button
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpen}
          className="relative flex items-center justify-center bg-gold hover:bg-gold-light text-white w-14 h-14 rounded-full shadow-2xl transition-colors cursor-pointer"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white"
            >
              {unreadCount}
            </motion.span>
          )}
        </motion.button>
      )}
    </div>
  );
}
