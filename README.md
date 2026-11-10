# RefactorAI

**RefactorAI** is a lightweight AI-powered developer assistant built with **React 18**. It is designed to help developers with programming questions, code analysis, debugging, refactoring, optimization, and general software development tasks.

<a href="https://fazilmemmedzade.github.io/RefactorAI/">Visit site</a>

## ✨ Features

* AI programming assistant
* Code analysis and explanation
* Refactoring and optimization
* Debugging assistance
* Bring Your Own API Key
* Conversational chat
* Markdown and code rendering
* Syntax highlighting
* GitHub Flavored Markdown support
* API error handling
* Responsive UI

## 🧠 Developer Assistant

RefactorAI is focused specifically on developer-oriented conversations.

You can use it to:

* Explain programming concepts
* Analyze existing source code
* Find possible problems in implementations
* Debug errors
* Refactor existing code
* Improve code readability
* Discuss optimization approaches
* Ask general software development questions
* Generate and understand code examples

The chat interface is designed to keep the interaction simple while providing properly formatted technical responses.

## 💬 Chat Experience

RefactorAI provides a dedicated conversational interface for interacting with the AI assistant.

The application supports:

* Continuous conversations
* Keyboard-based message sending
* Multiline messages
* Markdown-formatted responses
* Syntax-highlighted code blocks
* Formatted Markdown tables
* Loading states while waiting for an AI response

Pressing `Enter` sends a message, while `Shift + Enter` can be used to create a new line.

## 🔑 API Key Management

RefactorAI follows a **Bring Your Own API Key** approach.

Users provide their own API key through the application instead of having a key hard-coded into the project.

The API key is stored locally in the browser and can be replaced when necessary.

This allows the project to be used without exposing a shared API key inside the source code.

## 🔌 AI API Integration

RefactorAI communicates with an **OpenAI-compatible Chat Completions API** through Axios.

The API communication is separated into a dedicated service:

```text
src/services/openaiService.js
```

The application can use an API URL configured through an environment variable and is designed to work with OpenAI-compatible endpoints.

The chat logic is managed separately through:

```text
src/hooks/useChat.js
```

This separation keeps API communication and chat state management independent from the UI components.

## 📝 Markdown & Code Rendering

AI responses are rendered as Markdown instead of plain text.

The project supports:

* Markdown
* GitHub Flavored Markdown
* Code blocks
* Syntax highlighting
* Formatted tables
* Multiple programming language code blocks

This is especially useful for developer-oriented responses where code and technical explanations need to remain readable.

## 🧩 Main Components

| Component       | Description                             |
| --------------- | --------------------------------------- |
| `Header`        | Application header and API key controls |
| `ChatContainer` | Main chat interface                     |
| `MessageList`   | Displays conversation messages          |
| `MessageItem`   | Renders individual messages and code    |
| `InputArea`     | User message input and sending controls |
| `ApiKeyModal`   | API key setup interface                 |
| `useChat`       | Chat state and conversation management  |
| `openaiService` | AI API communication                    |

## 🛠️ Tech Stack

* **React 18**
* **JavaScript**
* **Axios**
* **React Markdown**
* **Remark GFM**
* **React Syntax Highlighter**
* **React Icons**
* **CSS3**
* **OpenAI-compatible Chat Completions API**
* **Tailwind CSS**

## 📁 Project Structure

```text
RefactorAI/
│
├── src/
│   ├── components/
│   │   ├── ApiKeyModal.jsx
│   │   ├── ChatContainer.jsx
│   │   ├── Header.jsx
│   │   ├── InputArea.jsx
│   │   ├── MessageItem.jsx
│   │   └── MessageList.jsx
│   │
│   ├── hooks/
│   │   └── useChat.js
│   │
│   ├── services/
│   │   └── openaiService.js
│   │
│   ├── App.jsx
│   └── index.js
│
├── public/
│
├── .env
├── package.json
└── README.md
```

The project separates reusable UI components, chat state management, and external API communication into dedicated folders.

## 📋 Requirements

Before running RefactorAI, make sure you have:

* Node.js
* npm
* Git
* AI API Key

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/fazilmemmedzade/RefactorAI.git
cd RefactorAI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Application

```bash
npm start
```

The development server will start and the application can then be opened in your browser.

## ⚙️ Environment Configuration

The project supports environment-based API configuration.

Create or configure the `.env` file if you need to specify a custom API endpoint:

```env
REACT_APP_API_URL=your_api_endpoint
```

The API key itself should not be committed to the repository.

Instead, users can provide their own key through the RefactorAI interface.

## 🏗️ Production Build

To create a production build:

```bash
npm run build
```

The optimized application will be generated in the `build` directory.

## 🌐 Deployment

RefactorAI is configured for deployment as a web application and can be published through GitHub Pages.

The project is available online at:

<a href="https://fazilmemmedzade.github.io/RefactorAI/">https://fazilmemmedzade.github.io/RefactorAI/</a>

## 🎯 Purpose

RefactorAI was created as a practical AI-powered tool for developers.

The main goal is to provide a simple environment where programmers can ask technical questions, analyze code, troubleshoot problems, and discuss refactoring or optimization without leaving the application.

The project also demonstrates how a React frontend can be connected to an OpenAI-compatible AI API while keeping UI components, chat logic, and API communication separated into different parts of the application.

## 👨‍💻 Author

**Fazil Məmmədzadə**

<a href="https://github.com/fazilmemmedzade">Github</a>

<a href="https://fazilmemmedzade.github.io/Portfolio">Portfolio</a>

---

⭐ If you like the project, consider starring the repository!

## 📸 Screenshots

|                                                    API Key Page                                                   |
| :---------------------------------------------------------------------------------------------------------------: |
| <img width="920" alt="API Key Page" src="https://github.com/fazilmemmedzade/My-Files/blob/main/APIKeyPage.png" /> |

|                                                   Chat Page                                                  |
| :----------------------------------------------------------------------------------------------------------: |
| <img width="920" alt="Chat Page" src="https://github.com/fazilmemmedzade/My-Files/blob/main/ChatPage.png" /> |

|                                                  Question & Answer                                                 |
| :----------------------------------------------------------------------------------------------------------------: |
| <img width="920" alt="Question & Answer" src="https://github.com/fazilmemmedzade/My-Files/blob/main/Answer.png" /> |

|                                                  Full Answer                                                  |
| :-----------------------------------------------------------------------------------------------------------: |
| <img width="920" alt="Full Answer" src="https://github.com/fazilmemmedzade/My-Files/blob/main/Answer2.png" /> |
