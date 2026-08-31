import React, { useRef, useEffect } from 'react';
import MessageItem from './MessageItem';
import { FaBolt } from 'react-icons/fa';
import './MessageList.css';

function MessageList({ messages, isLoading }) {
  const bottomRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="message-list" ref={listRef}>
      {messages.length === 0 ? (
        <div className="empty-state">
          <FaBolt className="empty-icon" />
          <h3>Refactor AI</h3>
          <p>Kodlarını analiz et, sənədləşdir, optimallaşdır.</p>
          <div className="quick-actions">
            <button>Kodu analiz et</button>
            <button>Sənədləşdir</button>
            <button>Optimallaşdır</button>
          </div>
        </div>
      ) : (
        messages.map((msg, idx) => (
          <MessageItem key={idx} message={msg} />
        ))
      )}
      {isLoading && (
        <div className="typing-indicator">
          <span></span><span></span><span></span>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;