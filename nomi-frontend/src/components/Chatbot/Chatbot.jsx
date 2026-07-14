import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../../api/axiosConfig';
import './Chatbot.css';

export default function Chatbot({ guestName }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasExpanded, setHasExpanded] = useState(false); // becomes true once the first message is sent, resets on Clear History

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition Lifecycle Hook
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported natively in this browser version. Please try using Chrome or Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const getFormattedTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = { type: 'user', text: message, timestamp: getFormattedTimestamp() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setHasExpanded(true);

    try {
      const response = await api.post("/chat", { message: message });
      const aiMessage = {
        type: 'ai',
        text: response.data?.response || 'Sorry, I could not process your request.',
        timestamp: getFormattedTimestamp(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: `⚠️ Backend node may be initializing from deep-standby. Please resend message shortly.`,
          timestamp: getFormattedTimestamp(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleClearChat = () => {
    setMessages([]);
    setInputValue('');
    setHasExpanded(false);
  };

  const showActionButtons = messages.length > 0 && messages[messages.length - 1].type === 'ai' && !isLoading;

  return (
    <div className={`chatbot-main-container card shadow border-0 w-100 d-flex flex-column ${hasExpanded ? 'chatbot-expanded' : 'chatbot-initial'}`}>

      {/* Internal Scrollable Message Engine Area */}
      <div className={`card-body bg-light chat-messages p-4 flex-grow-1 overflow-y-auto ${messages.length === 0 ? 'chat-messages-empty' : ''}`}>
        {messages.length === 0 && (
          <div className="chat-welcome">
            <div className="chat-welcome-title">Hello! I'm NOMI 👋</div>
            <p className="chat-welcome-text">Ask me anything about Aman Saxena, his projects, skills, or experience.</p>
          </div>
        )}

        {messages.map((msg, index) => (
          console.log(msg),
          <div key={index} className="message-block mb-3">
            <div className={`${msg.type === 'ai' ? 'ai-msg' : 'user-msg'} p-3 rounded shadow-sm message-bubble`}>
              <div className="text-uppercase tracking-wider font-monospace text-muted small opacity-75">
                {msg.type === 'ai' ? 'Nomi' : guestName || 'You'}
              </div>
              <div className="markdown-content-body text-break">
                {msg.type === 'ai' ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  <p className="m-0 whitespace-pre-wrap">{msg.text}</p>
                )}
              </div>
            </div>
            <div className={`${msg.type === 'ai' ? 'text-start' : 'text-end'} message-timestamp text-muted small`}>
              {msg.timestamp}
            </div>
          </div>
        ))}

        {/* Dynamic State Feedback */}
        {isLoading && (
          <div className="ai-msg p-3 mb-3 rounded shadow-sm d-inline-block">
            <div className="text-uppercase tracking-wider font-monospace text-muted small mb-2 opacity-75">
              Retrieving relevant chunks...
            </div>
            <span className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        )}

        {showActionButtons && (
          <div className="action-buttons mt-2 mb-2 d-flex gap-2 justify-content-start">
            <button
              className="btn btn-sm btn-outline-secondary rounded-1 d-flex align-items-center gap-1"
              onClick={handleClearChat}
            >
              <i className="bi bi-trash"></i> Clear History
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Footer Controls Group */}
      <div className="card-footer bg-white border-top p-3">
        <form className="input-group input-group-lg" onSubmit={handleSubmit}>

          <input
            type="text"
            className="form-control border bg-light px-4 py-2 custom-focus-input border-start-0"
            placeholder={isListening ? "Listening to voice input..." : "Ask a question..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading || isListening}
          />

          {/* Voice Input Trigger Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`btn px-3 d-flex align-items-center justify-content-center border border-end-0 bg-light ${isListening ? 'voice-active-pulse text-danger' : 'text-secondary'}`}
            title={isListening ? 'Listening... Click to cancel' : 'Click to use voice command'}
            disabled={isLoading}
          >
            <i className={`bi ${isListening ? 'bi-mic-fill animate-flash' : 'bi-mic'}`}></i>
          </button>

          <button
            type="submit"
            className="btn btn-primary px-4 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: '#001f3d', borderColor: '#001f3d' }}
            disabled={isLoading || isListening || !inputValue.trim()}
          >
            <i className="bi bi-send-fill text-white"></i>
          </button>
        </form>
      </div>
    </div>
  );
}