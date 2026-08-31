import React, { useState } from 'react';
import { FaCode, FaGithub, FaKey, FaSignOutAlt } from 'react-icons/fa';
import './Header.css';

function Header({ onClearApiKey }) {
  const [showKeyMenu, setShowKeyMenu] = useState(false);

  return (
    <header className="header">
      <div className="header-left">
        <FaCode className="header-icon" />
        <h1>Refactor <span>AI</span></h1>
        <span className="badge">Dev Only</span>
      </div>
      <div className="header-right">
        <span className="model-badge">GPT-OSS-20B</span>
        
        {/* API Key Menyu */}
        <div className="key-menu-wrapper">
          <button 
            className="key-menu-btn"
            onClick={() => setShowKeyMenu(!showKeyMenu)}
          >
            <FaKey />
          </button>
          {showKeyMenu && (
            <div className="key-dropdown">
              <button onClick={onClearApiKey} className="key-dropdown-item">
                <FaSignOutAlt /> API Key-i dəyiş
              </button>
            </div>
          )}
        </div>

        <a href="https://github.com/fazilmemmedzade/RefactorAI" target="_blank" rel="noopener noreferrer">
          <FaGithub className="github-icon" />
        </a>
      </div>
    </header>
  );
}

export default Header;