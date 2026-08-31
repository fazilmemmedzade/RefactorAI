import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaUser, FaRobot } from "react-icons/fa";
import rehypeRaw from "rehype-raw";
import "./MessageItem.css";
import remarkGfm from "remark-gfm";

function MessageItem({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`message-item ${isUser ? "user" : "assistant"}`}>
      <div className="avatar">{isUser ? <FaUser /> : <FaRobot />}</div>
      <div className="message-content">
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              // Cədvəl komponentləri - DÜZGÜN
              table({ children }) {
                return <table className="markdown-table">{children}</table>;
              },
              thead({ children }) {
                return <thead>{children}</thead>;
              },
              tbody({ children }) {
                return <tbody>{children}</tbody>;
              },
              tr({ children }) {
                return <tr className="markdown-tr">{children}</tr>;
              },
              th({ children }) {
                return <th className="markdown-th">{children}</th>;
              },
              td({ children }) {
                return <td className="markdown-td">{children}</td>;
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}

export default MessageItem;
