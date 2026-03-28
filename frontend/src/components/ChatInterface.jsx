import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';

const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!text) return; // Prevent crash if text is undefined
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(c => c + 1);
      }, 15); // Adjust typing speed here
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return <p style={{ margin: 0, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{displayedText}</p>;
};

const ChatInterface = ({ onComplete }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initial Greeting
  useEffect(() => {
    const initChat = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'init', history: [] }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessages([{ role: 'bot', text: data.text }]);
      } else {
        setMessages([{ role: 'bot', text: 'Error connecting to AI: ' + (data.error || 'Server error.') }]);
      }
    } catch (error) {
        console.error("Failed to initialize chat", error);
        setMessages([{ role: 'bot', text: 'Welcome to the ET AI Concierge. How can I assist you with your financial journey today?' }]);
      } finally {
        setIsLoading(false);
      }
    };
    initChat();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    const newMessages = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: newMessages.map(m => ({ role: m.role, content: m.text })) }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
        if ((data.action === 'complete' || data.action === 'report') && data.profile) {
          setTimeout(() => {
            onComplete(data.profile);
          }, 3000);
        }
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: "Error: " + (data.error || "Failed to parse API response.") }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "I'm having trouble connecting to my servers right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel w-full max-w-3xl mx-auto flex flex-col" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <div className="p-4 border-b border-light flex items-center gap-3" style={{ borderBottom: '1px solid var(--border-light)' }}>
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-black">
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--primary)' }}>ET AI Concierge</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Smart Onboarding & Financial Guide</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`animate-fade-in flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div 
              style={{
                maxWidth: '80%',
                padding: '1rem',
                borderRadius: '12px',
                background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                color: msg.role === 'user' ? '#000' : 'var(--text-main)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--border-light)',
                borderBottomRightRadius: msg.role === 'user' ? '0' : '12px',
                borderBottomLeftRadius: msg.role === 'bot' ? '0' : '12px',
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                {msg.role === 'bot' && <Bot size={18} style={{ marginTop: '3px', color: 'var(--primary)', flexShrink: 0 }} />}
                {msg.role === 'bot' && idx === messages.length - 1 ? (
                   <TypewriterText text={msg.text} />
                ) : (
                   <p style={{ margin: 0, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                )}
                {msg.role === 'user' && <User size={18} style={{ marginTop: '3px', color: '#000', flexShrink: 0 }} />}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fade-in" style={{ display: 'flex' }}>
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-light)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
               <Loader2 className="animate-spin" size={18} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
               <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
               <span style={{ color: 'var(--text-muted)' }}>
                 {messages.length >= 6 ? '🔍 Analyzing your financial profile...' : '💭 AI is thinking...'}
               </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', padding: '1.5rem', gap: '1rem', borderTop: '1px solid var(--border-light)', background: 'rgba(0,0,0,0.2)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
        <input 
          type="text" 
          className="input-field" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type your message here..." 
          disabled={isLoading}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn-primary" disabled={isLoading || !input.trim()}>
          <Send size={18} />
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
