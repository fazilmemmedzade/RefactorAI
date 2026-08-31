import React, { useState, useRef, useEffect } from 'react';
import { IoSend, IoCode } from 'react-icons/io5';
import './InputArea.css';

function InputArea({ onSend, isLoading }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-area">
      <div className="input-wrapper">
        <div className="icon-wrapper">
          <IoCode className="input-icon" />
        </div>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Kodunu yaz, sual ver, ya da təhlil et..."
          rows={1}
          disabled={isLoading}
        />
        <button 
          className={`send-btn ${input.trim() && !isLoading ? 'active' : ''}`}
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
        >
          <IoSend />
        </button>
      </div>
    </div>
  );
}

export default InputArea;