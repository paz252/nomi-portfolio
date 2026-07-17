import { useEffect, useRef, useState } from "react";

import api from "../../api/axiosConfig";

import "./Chatbot.css";

import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import ActionButtons from "./ActionButtons";

import useSpeechRecognition from "./hooks/useSpeechRecognition";

import { copyText, getTimestamp } from "./utils";
import MetallicText from "../utils/MetallicText";

export default function Chatbot({ guestName }) {
  const [messages, setMessages] = useState([]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [copiedMessageIndex, setCopiedMessageIndex] = useState(null);

  const messagesContainerRef = useRef(null);

  const { isListening, toggleListening } = useSpeechRecognition(setInputValue);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text,
        timestamp: getTimestamp(),
      },
    ]);

    setInputValue("");
    setIsLoading(true);

    try {
      const { data } = await api.post("/chat", {
        message: text,
      });

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text:
            data.response ??
            "Sorry, I couldn't process your request.",
          timestamp: getTimestamp(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text:
            "⚠️ Backend may still be starting. Please try again shortly.",
          timestamp: getTimestamp(),
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

  const handleCopy = async (text, index) => {
    try {
      await copyText(text);
      setCopiedMessageIndex(index);

      setTimeout(() => {
        setCopiedMessageIndex(null);
      }, 1800);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="chatbot-main-container chatbot-expanded card shadow w-100 d-flex flex-column mt-5">

      <div className="chatbot-header text-center pb-3">
        <div className="chat-welcome-title">
          Hello! I'm <MetallicText speed={6}>Aman</MetallicText>
        </div>
      </div>

      <div ref={messagesContainerRef} className="chat-messages">
        <div
          className={`chat-messages-body ${
            messages.length === 0 ? "chat-messages-empty" : ""
          }`}
        >
          <MessageList
            messages={messages}
            guestName={guestName}
            copiedMessageIndex={copiedMessageIndex}
            onCopy={handleCopy}
            isLoading={isLoading}
          />
        </div>

        <div className="chat-footer">
          {(messages.length === 0 || (!isLoading && messages.at(-1)?.type === "ai")) && (
            <div className="chat-action-bar">
              <ActionButtons onSend={handleSendMessage} isLoading={isLoading} />
            </div>
          )}

          <div className="chat-input-shell">
            <ChatInput
              inputValue={inputValue}
              setInputValue={setInputValue}
              isLoading={isLoading}
              isListening={isListening}
              onToggleVoice={toggleListening}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}