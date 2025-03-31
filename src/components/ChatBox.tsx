import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2, Mail, User, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Theme } from '../lib/theme';
import toast from 'react-hot-toast';

interface Message {
  type: 'user' | 'bot' | 'system';
  content: string;
}

interface ChatBoxProps {
  theme: Theme;
}

const INITIAL_MESSAGES: Message[] = [
  { type: 'bot', content: 'Hi! I\'m your Thapar Societies assistant. How can I help you today?' },
  { type: 'bot', content: 'You can ask me about societies or type "contact" to send us a message!' }
];

const PREDEFINED_RESPONSES = {
  'hello': 'Hello! How can I assist you with Thapar societies today?',
  'hi': 'Hi there! Looking to learn more about our societies?',
  'societies': 'We have various societies including technical, cultural, sports, and academic ones. Which category interests you?',
  'registration': 'Registration processes vary by society. You can check each society\'s card for their current registration status and links.',
  'contact': 'I\'ll help you send us a message. Please provide your name:',
  'events': 'Each society hosts various events throughout the year. Check their social media for the latest updates!',
  'default': 'I\'m here to help! Feel free to ask about our societies, registration process, or upcoming events.'
};

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export function ChatBox({ theme }: ChatBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [contactForm, setContactForm] = useState<Partial<ContactForm>>({});
  const [contactStep, setContactStep] = useState<'none' | 'name' | 'email' | 'message'>('none');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = async (response: string) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    setIsTyping(false);
    setMessages(prev => [...prev, { type: 'bot', content: response }]);
  };

  const handleContactForm = async (input: string) => {
    switch (contactStep) {
      case 'name':
        setContactForm(prev => ({ ...prev, name: input }));
        setMessages(prev => [...prev, 
          { type: 'user', content: input },
          { type: 'bot', content: 'Great! Now, please provide your email address:' }
        ]);
        setContactStep('email');
        break;
      
      case 'email':
        if (!input.includes('@')) {
          await simulateTyping('Please provide a valid email address:');
          return;
        }
        setContactForm(prev => ({ ...prev, email: input }));
        setMessages(prev => [...prev,
          { type: 'user', content: input },
          { type: 'bot', content: 'Perfect! Finally, what message would you like to send us?' }
        ]);
        setContactStep('message');
        break;
      
      case 'message':
        setContactForm(prev => ({ ...prev, message: input }));
        setMessages(prev => [...prev, { type: 'user', content: input }]);
        
        try {
          const { error } = await supabase
            .from('contact_messages')
            .insert([{ 
              name: contactForm.name,
              email: contactForm.email,
              message: input
            }]);

          if (error) throw error;

          setMessages(prev => [...prev, 
            { type: 'system', content: '✅ Message sent successfully!' },
            { type: 'bot', content: 'Thank you for your message! Is there anything else I can help you with?' }
          ]);
          toast.success('Message sent successfully!');
        } catch (error) {
          console.error('Error sending message:', error);
          setMessages(prev => [...prev, 
            { type: 'system', content: '❌ Failed to send message. Please try again.' }
          ]);
          toast.error('Failed to send message');
        }

        setContactStep('none');
        setContactForm({});
        break;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    if (contactStep !== 'none') {
      await handleContactForm(userMessage);
      return;
    }

    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);

    const lowercaseMessage = userMessage.toLowerCase();
    if (lowercaseMessage.includes('contact')) {
      await simulateTyping('I\'ll help you send us a message. Please provide your name:');
      setContactStep('name');
      return;
    }

    let response = PREDEFINED_RESPONSES.default;
    for (const [key, value] of Object.entries(PREDEFINED_RESPONSES)) {
      if (lowercaseMessage.includes(key)) {
        response = value;
        break;
      }
    }

    await simulateTyping(response);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 left-4 p-4 rounded-full shadow-lg z-50 group ${
          theme === 'dark'
            ? 'bg-brand-red text-white hover:bg-brand-red/90'
            : 'bg-brand-red text-white hover:bg-brand-red/90'
        }`}
      >
        <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  const getInputPlaceholder = () => {
    switch (contactStep) {
      case 'name': return 'Enter your name...';
      case 'email': return 'Enter your email...';
      case 'message': return 'Type your message...';
      default: return 'Type your message...';
    }
  };

  const getInputIcon = () => {
    switch (contactStep) {
      case 'name': return <User size={16} className="text-gray-400" />;
      case 'email': return <Mail size={16} className="text-gray-400" />;
      case 'message': return <MessageSquare size={16} className="text-gray-400" />;
      default: return null;
    }
  };

  return (
    <div className={`fixed bottom-4 left-4 w-80 rounded-lg shadow-xl z-50 transition-all duration-300 ${
      isMinimized ? 'h-14' : 'h-[500px]'
    } ${
      theme === 'dark'
        ? 'bg-brand-black border border-brand-grey'
        : 'bg-white border border-light-border'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-brand-red to-brand-teal text-white rounded-t-lg">
        <h3 className="font-semibold">Thapar Societies Chat</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/20 p-1 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-1 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className={`h-[380px] overflow-y-auto p-4 space-y-4 ${
            theme === 'dark' ? 'bg-brand-black' : 'bg-white'
          }`}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-brand-red text-white rounded-br-none'
                      : message.type === 'system'
                      ? `${theme === 'dark' ? 'bg-brand-grey text-white' : 'bg-light-card text-light-text'}`
                      : `${theme === 'dark' ? 'bg-brand-grey text-white' : 'bg-light-card text-light-text'} rounded-bl-none`
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className={`p-3 rounded-lg rounded-bl-none ${
                  theme === 'dark' ? 'bg-brand-grey' : 'bg-light-card'
                }`}>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`p-4 border-t ${
            theme === 'dark' ? 'border-brand-grey' : 'border-light-border'
          }`}>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                {getInputIcon() && (
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    {getInputIcon()}
                  </div>
                )}
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={getInputPlaceholder()}
                  className={`w-full p-2 ${getInputIcon() ? 'pl-10' : 'pl-3'} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red ${
                    theme === 'dark'
                      ? 'bg-brand-grey text-white border-none'
                      : 'bg-light-card text-light-text border border-light-border'
                  }`}
                />
              </div>
              <button
                onClick={handleSendMessage}
                className="bg-brand-red text-white p-2 rounded-lg hover:bg-brand-red/90 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}