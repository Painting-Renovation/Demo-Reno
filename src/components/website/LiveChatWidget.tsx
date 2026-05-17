'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const BOT_RESPONSE = "Thanks for your message! Our team will get back to you shortly. In the meantime, feel free to fill out our free estimate form for an instant quote!";

const quickReplies = [
  'Get a Free Estimate',
  'Our Services',
  'Book a Consultation',
  'Pricing',
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function LiveChatWidget() {
  const { setEstimateFormOpen, setAppointmentFormOpen } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: 'Hi there! 👋 Welcome to ProCoat Painters. How can we help you today?',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: messageText,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      setIsTyping(false);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: BOT_RESPONSE,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed z-50" style={{ bottom: 'max(6rem, calc(env(safe-area-inset-bottom) + 6rem))', right: 'max(1.5rem, env(safe-area-inset-right))' }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="mb-3 w-[calc(100vw-3rem)] sm:w-[380px] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-navy to-navy-light px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">ProCoat Support</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-white/60 text-xs">Online now</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="min-w-[44px] min-h-[44px] text-white/50 hover:text-white transition-colors p-1 cursor-pointer"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollContainerRef}
              className="bg-cream h-72 overflow-y-auto px-4 py-4 space-y-3"
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-2 ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {msg.isBot && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-navy flex items-center justify-center mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-gold" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      msg.isBot
                        ? 'bg-white border border-gray-100 shadow-sm rounded-tl-md'
                        : 'bg-navy text-white rounded-tr-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p
                      className={`text-[10px] mt-1 ${
                        msg.isBot ? 'text-gray-400' : 'text-white/50'
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                  {!msg.isBot && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center mt-0.5">
                      <User className="w-3.5 h-3.5 text-gold" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 items-end"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-navy flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 1 && (
              <div className="bg-cream px-4 pb-3">
                <div className="flex flex-wrap gap-1.5">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs font-medium bg-white border border-gray-200 text-navy hover:bg-gold hover:text-white hover:border-gold px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="bg-white border-t border-gray-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 text-sm bg-cream border border-gray-200 rounded-xl px-4 py-2.5 text-navy placeholder:text-gray-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim()}
                  className="flex-shrink-0 w-10 h-10 rounded-xl bg-gold hover:bg-gold-light text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center gap-2 bg-navy hover:bg-navy-light text-white pl-4 pr-5 py-3.5 rounded-full shadow-xl transition-colors cursor-pointer group"
      >
        {!isOpen && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="text-sm font-medium hidden sm:inline"
          >
            Chat with us
          </motion.span>
        )}
        <div className="relative">
          <MessageCircle className="w-5 h-5 text-gold" />
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-navy" />
          )}
        </div>
      </motion.button>
    </div>
  );
}
