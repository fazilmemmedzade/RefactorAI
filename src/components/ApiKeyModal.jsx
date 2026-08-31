import React, { useState } from "react";
import { FaKey, FaGithub, FaCode } from "react-icons/fa";
import "./ApiKeyModal.css";

function ApiKeyModal({ onSave }) {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim().length < 20) {
      setError("API key çox qısadır!");
      return;
    }
    setError("");
    onSave(apiKey.trim());
  };

  return (
    <div className="api-modal-overlay">
      <div className="api-modal">
        <div className="api-modal-header">
          <FaCode className="modal-icon" />
          <h2>
            Refactor <span>AI</span>
          </h2>
          <p>Developer AI Assistant</p>
        </div>

        <div className="api-modal-body">
          <div className="api-info">
            <FaKey className="key-icon" />
            <h3>OpenAI API Key daxil edin</h3>
            <p className="api-desc">
              AI chatbot-u işlətmək üçün OpenAI API key tələb olunur.
            </p>
            <a
              href="https://groq.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="api-link"
            >
                <FaKey className="key-icon" style={{ fontSize: "15px", marginTop: "8" }} />
                <span>Pulsuz API key əldə et</span>
              
            </a>
          </div>

          <form onSubmit={handleSubmit} className="api-form">
            <div className="input-group">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Api Key daxil edin"
                className={`api-input ${error ? "error" : ""}`}
                autoFocus
              />
              {error && <span className="error-message">{error}</span>}
            </div>

            <button
              type="submit"
              className="api-submit-btn"
              disabled={!apiKey.trim()}
            >
              <FaKey /> Başla
            </button>
          </form>

          <div className="api-footer">
            <span>API key yalnız lokal olaraq saxlanılır</span>
            <div className="social-links">
              <a
                href="https://github.com/fazilmemmedzade/RefactorAI"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyModal;
