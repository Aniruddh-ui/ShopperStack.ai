import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  SparklesIcon, 
  CameraIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm your AI fashion assistant. I can help you find the perfect outfit, suggest styles, or answer any fashion questions. What are you looking for today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    // Check for specific keywords and provide appropriate responses
    if (lowerInput.includes('summer') || lowerInput.includes('dress')) {
      return {
        id: Date.now(),
        type: 'ai',
        content: "I understand you're looking for summer dresses! 🎨 Our AI fashion assistant is currently being integrated and will be available soon. You'll be able to get personalized recommendations, style suggestions, and product matches. Stay tuned for the full AI experience! ✨",
        timestamp: new Date(),
        suggestions: [
          "Try our Trends page for current fashion",
          "Check out our Events page for outfit ideas",
          "Upload an image to test image matching",
          "Explore our Closet feature"
        ]
      };
    } else if (lowerInput.includes('interview') || lowerInput.includes('job')) {
      return {
        id: Date.now(),
        type: 'ai',
        content: "Great question about interview outfits! 👔 Our AI assistant is being trained to provide personalized professional style recommendations. Soon you'll get outfit suggestions, color coordination advice, and confidence-boosting style tips. The AI integration is coming very soon! 🚀",
        timestamp: new Date(),
        suggestions: [
          "Visit our Events page for interview looks",
          "Check trending professional styles",
          "Upload your current wardrobe",
          "Get outfit suggestions by occasion"
        ]
      };
    } else if (lowerInput.includes('trend') || lowerInput.includes('trending')) {
      return {
        id: Date.now(),
        type: 'ai',
        content: "You want to know what's trending! 📈 Our AI fashion trend analyzer is being integrated and will provide real-time trend insights, social media analysis, and personalized trend recommendations. The AI will soon track live fashion trends across multiple platforms! 🔥",
        timestamp: new Date(),
        suggestions: [
          "Explore our Trends page now",
          "Check current fashion trends",
          "See trending colors and styles",
          "Get seasonal recommendations"
        ]
      };
    } else if (lowerInput.includes('tall') || lowerInput.includes('height')) {
      return {
        id: Date.now(),
        type: 'ai',
        content: "Looking to enhance your height with fashion! 📏 Our AI style assistant is being trained to provide personalized styling tips for different body types and height preferences. Soon you'll get specific outfit recommendations, color suggestions, and styling techniques! ✨",
        timestamp: new Date(),
        suggestions: [
          "Try our Events page for styling tips",
          "Check professional styling guides",
          "Upload your measurements",
          "Get personalized recommendations"
        ]
      };
    } else {
      return {
        id: Date.now(),
        type: 'ai',
        content: "Thanks for your fashion question! 🤖 Our AI fashion assistant is currently being integrated and will be available soon. You'll soon have access to personalized style recommendations, trend analysis, outfit suggestions, and much more. The AI is learning and will be ready to help you find your perfect style! ✨",
        timestamp: new Date(),
        suggestions: [
          "Explore our current features",
          "Check out the Trends page",
          "Try the Events page for outfit ideas",
          "Upload images to test matching"
        ]
      };
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Smart Filter Chat
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chat with our AI to get personalized fashion recommendations and refine your search
          </p>
        </motion.div>

        {/* Chat Interface */}
        <div className="bg-white rounded-2xl shadow-lg h-[600px] flex flex-col max-w-4xl mx-auto">
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Fashion Assistant</h3>
                <p className="text-sm text-gray-500">Coming Soon • AI Integration in Progress</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${
                  message.type === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                } rounded-2xl px-4 py-3`}>
                  <p className="text-sm">{message.content}</p>
                  
                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs hover:bg-white/30 transition-colors duration-300"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 text-gray-900 rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <SparklesIcon className="w-4 h-4 animate-pulse" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about fashion..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows="1"
                />
                <button
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="absolute right-3 top-3 text-gray-400 hover:text-purple-600 transition-colors duration-300"
                >
                  <CameraIcon className="w-5 h-5" />
                </button>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors duration-300"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat; 