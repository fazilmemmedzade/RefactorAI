import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatContainer from './components/ChatContainer';
import ApiKeyModal from './components/ApiKeyModal';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    // LocalStorage-dan API key-i yoxla
    const savedKey = localStorage.getItem('refactor_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsModalOpen(false);
    }
  }, []);

  const handleSaveApiKey = (key) => {
    // API key-i localStorage-da saxla
    localStorage.setItem('refactor_api_key', key);
    setApiKey(key);
    setIsModalOpen(false);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('refactor_api_key');
    setApiKey(null);
    setIsModalOpen(true);
  };

  return (
    <div className="app">
      {isModalOpen && <ApiKeyModal onSave={handleSaveApiKey} />}
      <Header onClearApiKey={handleClearApiKey} />
      <div className="main-content">
        <ChatContainer apiKey={apiKey} />
      </div>
    </div>
  );
}

export default App;