import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Loader2, 
  User, 
  MessageSquare, 
  HelpCircle,
  Building2,
  DollarSign,
  BedDouble,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Property } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface PropertyAiChatbotProps {
  property: Property;
  className?: string;
}

export const PropertyAiChatbot: React.FC<PropertyAiChatbotProps> = ({
  property,
  className = ''
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello! I'm your AI Real Estate Assistant for **${property.title}**. Ask me anything about the price ($${property.price?.toLocaleString()}), amenities, layout, year built, or estimated payments!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "What are the top amenities included?",
    `Is there an HOA fee for ${property.title}?`,
    "What is the estimated monthly payment?",
    "Can you summarize the description and layout?",
    "How old is the property & year built?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/property-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property,
          message: query,
          chatHistory: messages.map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const errorMsg: Message = {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: `I ran into an issue finding that answer: ${data.error || 'Please try again.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Network error connecting to the AI assistant. Please check your connection.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border border-[#E8E6E1] shadow-sm flex flex-col overflow-hidden ${className}`}>
      
      {/* Header */}
      <div className="bg-[#3E3C38] text-white p-4 border-b border-[#3E3C38] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#8A9A5B] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-serif font-bold text-sm text-white">AI Property Assistant</h4>
              <span className="bg-[#8A9A5B]/20 border border-[#8A9A5B]/40 text-[#8A9A5B] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#8A9A5B]" /> Gemini AI
              </span>
            </div>
            <p className="text-[11px] text-[#E8E6E1]/70 truncate max-w-[280px]">
              Instant answers about {property.title}
            </p>
          </div>
        </div>

        <span className="text-[10px] text-[#8A9A5B] font-semibold bg-[#8A9A5B]/10 px-2 py-1 rounded-lg border border-[#8A9A5B]/20 hidden sm:inline">
          Context-Aware
        </span>
      </div>

      {/* Quick Suggested Questions */}
      <div className="bg-[#FAF9F6] p-3 border-b border-[#E8E6E1] overflow-x-auto flex items-center gap-2 no-scrollbar">
        <span className="text-[10px] font-bold text-[#8C8A85] uppercase tracking-wider shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-[#8A9A5B]" /> Ask:
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="shrink-0 bg-white hover:bg-[#F3F1ED] text-[#3E3C38] border border-[#E8E6E1] hover:border-[#8A9A5B] px-2.5 py-1 rounded-full text-[11px] font-medium transition-all shadow-2xs whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 max-h-[380px] min-h-[220px] bg-[#FAF9F6]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-[#5C6B4E] text-white'
                  : 'bg-[#3E3C38] text-[#8A9A5B] border border-[#4A4844]'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-[#5C6B4E] text-white rounded-tr-none'
                  : 'bg-white text-[#3E3C38] border border-[#E8E6E1] rounded-tl-none whitespace-pre-line'
              }`}
            >
              <div className="font-sans">{msg.text}</div>
              <span
                className={`block text-[9px] mt-1 text-right font-medium ${
                  msg.sender === 'user' ? 'text-white/70' : 'text-[#8C8A85]'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2.5 text-xs text-[#8C8A85]">
            <div className="w-7 h-7 rounded-xl bg-[#3E3C38] text-[#8A9A5B] flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-[#E8E6E1] flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 text-[#5C6B4E] animate-spin" />
              <span className="font-semibold text-[#3E3C38]">AI is analyzing property details...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-[#E8E6E1] flex items-center gap-2"
      >
        <input
          type="text"
          placeholder={`Ask about ${property.title}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl px-3 py-2 text-xs text-[#3E3C38] font-medium focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-[#5C6B4E] hover:bg-[#4A573F] disabled:opacity-40 text-white p-2 rounded-xl transition-all shadow-2xs"
          title="Send Question"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
