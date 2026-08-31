import React from 'react';
import useChat from '../hooks/useChat';
import MessageList from './MessageList';
import InputArea from './InputArea';
import './ChatContainer.css';

function ChatContainer({ apiKey }) {
  const { messages, sendMessage, isLoading } = useChat(apiKey);

  return (
    <div className="chat-container">
      <MessageList messages={messages} isLoading={isLoading} />
      <InputArea onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}

export default ChatContainer;