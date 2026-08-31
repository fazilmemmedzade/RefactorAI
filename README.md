# RefactorAI

**RefactorAI** is a lightweight, developer-focused AI chatbot built with **React 18**. It is designed specifically for programming tasks such as code analysis, documentation, optimization, refactoring, debugging, and general developer assistance.

The application uses a chat-based interface and connects directly to an **OpenAI-compatible Chat Completions API** using a user-provided API key.

## ✨ Features

* 🤖 Developer-focused AI chatbot
* 💻 Code analysis and programming assistance
* 📝 Code documentation and explanation
* ⚡ Code optimization and refactoring guidance
* 🐞 Debugging and error-analysis assistance
* 🔑 Bring Your Own API Key (BYOK)
* 💾 API key persistence with browser `localStorage`
* 🔄 Change or clear the saved API key from the header
* 🧠 Multi-message conversation context during the current session
* 📝 Markdown and GitHub-Flavored Markdown (GFM) rendering
* 🎨 Syntax highlighting for fenced code blocks
* 📊 Markdown table rendering
* 📜 Automatic scrolling to the newest message
* ⌨️ `Enter` to send and `Shift + Enter` for a new line
* 📐 Auto-growing message input with a maximum height
* ⏳ Loading / typing indicator while waiting for the AI
* ⚠️ User-friendly handling for authentication, rate-limit, network, and general API errors
* 📱 Responsive chat interface for smaller screens
* 🌙 Dark, minimalist developer-oriented UI

## 🛠️ Tech Stack

* **React 18.2**
* **JavaScript (ES6+)**
* **Axios 1.20**
* **React Markdown 9**
* **Remark GFM 4**
* **Rehype Raw 7**
* **React Syntax Highlighter 15**
* **React Icons 4**
* **Create React App / react-scripts 5**
* **CSS3**
* **OpenAI-compatible Chat Completions API**

## 📋 Requirements

* **Node.js** with npm
* An API key for the configured AI provider
* Internet connection
* **Git**

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/fazilmemmedzade/RefactorAI.git
cd RefactorAI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API endpoint

Create a `.env` file in the project root:

```env
REACT_APP_API_URL=https://api.openai.com/v1/chat/completions
```

The application reads the endpoint from `REACT_APP_API_URL`.

If the variable is not provided, the application falls back to:

```text
https://openrouter.ai/api/v1/chat/completions
```

The API key itself is **not stored in the repository or `.env` file**. The application asks the user for the key at runtime and stores it locally in the browser.

### 4. Start the application

```bash
npm start
```

The development server will normally be available at:

```text
http://localhost:3000
```

### 5. Production build

```bash
npm run build
```

The optimized production build is generated in the `build/` directory.

## 🔐 API Key Handling

RefactorAI follows a **Bring Your Own API Key** approach.

When the application starts, it checks the browser's `localStorage` for a previously saved API key. If none exists, the API Key modal is displayed.

After a valid-looking key is entered, it is stored under:

```text
refactor_api_key
```

The key can later be cleared and replaced from the API key menu in the header.

> ⚠️ **Security note:** storing an API key in browser `localStorage` is suitable for a personal or development chatbot, but it is not an appropriate architecture for a multi-user production application where the key must remain secret.

## 🧠 How It Works

```text
User
  │
  ▼
React Chat UI
  │
  ├── InputArea
  │
  ├── MessageList
  │     └── MessageItem
  │
  ▼
useChat Hook
  │
  ▼
Axios HTTP Request
  │
  ▼
Chat Completions API
  │
  ▼
AI Response
  │
  ▼
Markdown + Syntax Highlighting
  │
  ▼
Chat UI
```

Each new user message is added to the current in-memory conversation and the complete message history is sent with the next API request.

The assistant response is then appended to the conversation and rendered in the chat interface.

## 🧩 Main Components

| Component       | Responsibility                                                             |
| --------------- | -------------------------------------------------------------------------- |
| `App`           | Application shell, API key state, and global layout                        |
| `Header`        | Branding, model badge, GitHub link, and API key actions                    |
| `ApiKeyModal`   | Collects and validates the user's API key before starting the chat         |
| `ChatContainer` | Connects the chat hook with the message list and input area                |
| `MessageList`   | Displays messages, empty state, loading indicator, and automatic scrolling |
| `MessageItem`   | Renders user and assistant messages with Markdown and code highlighting    |
| `InputArea`     | Handles message input, auto-resize, keyboard shortcuts, and sending        |
| `useChat`       | Manages conversation state, loading state, and API errors                  |
| `openaiService` | Sends chat completion requests through Axios                               |

The component structure is intentionally small and separated by responsibility.

## 📁 Project Structure

```text
RefactorAI/
├── public/
│   └── index.html
│
├── src/
│   ├── components/
│   │   ├── ApiKeyModal.jsx
│   │   ├── ApiKeyModal.css
│   │   ├── ChatContainer.jsx
│   │   ├── ChatContainer.css
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   ├── InputArea.jsx
│   │   ├── InputArea.css
│   │   ├── MessageItem.jsx
│   │   ├── MessageItem.css
│   │   ├── MessageList.jsx
│   │   └── MessageList.css
│   │
│   ├── hooks/
│   │   └── useChat.js
│   │
│   ├── services/
│   │   └── openaiService.js
│   │
│   ├── App.jsx
│   ├── App.css
│   └── index.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

The repository currently follows a compact `components / hooks / services` structure.

## 🔄 Application Flow

### 1. API Key Setup

On first launch, the application opens the API key modal.

The entered key is checked for a minimum length before being saved locally.

### 2. Start a Conversation

The user enters a programming question, code snippet, debugging problem, documentation request, or optimization task.

The input supports:

* `Enter` — send message
* `Shift + Enter` — add a new line

The textarea automatically grows up to a maximum height of 150px.

### 3. Send the Request

`useChat` immediately adds the user's message to the UI, activates the loading state, and sends the updated conversation history to the AI service.

### 4. AI Processing

`openaiService.js` sends a `POST` request through Axios to the configured Chat Completions endpoint.

The request contains:

* the selected model
* the system instruction
* the current conversation history
* temperature configuration
* maximum token configuration

The service then returns the assistant's generated message.

### 5. Render the Response

Assistant responses are rendered using Markdown.

The application supports:

* GitHub-Flavored Markdown
* fenced code blocks
* syntax highlighting
* Markdown tables
* ordered and unordered lists
* inline code

`react-markdown`, `remark-gfm`, `rehype-raw`, and `react-syntax-highlighter` are responsible for this rendering pipeline.

### 6. Error Handling

The chat hook handles several common API failures:

* **401** — invalid API key
* **429** — rate limit, quota, or balance issue
* **Network error** — connection or CORS-related problem
* **Other errors** — generic retry message

An invalid API key is also removed from local storage so the user can enter a new one.

## 🎯 AI Assistant Focus

The assistant is configured specifically as a developer-oriented AI assistant for:

* Code analysis
* Code documentation
* Refactoring
* Code optimization
* Programming questions
* Clear technical explanations
* Proper Markdown formatting
* Proper multi-line Markdown tables

The system prompt is implemented in:

```text
src/services/openaiService.js
```

The prompt also defines the assistant's developer-focused tone and response formatting rules.

## 🌐 API Configuration

The application uses an environment-configurable API URL:

```javascript
const API_URL =
  process.env.REACT_APP_API_URL ||
  'https://openrouter.ai/api/v1/chat/completions';
```

This allows the frontend to work with the configured provider without changing the main chat logic.

The current repository also includes:

```env
REACT_APP_API_URL=https://api.openai.com/v1/chat/completions
```

in `.env`.

The provider must support the expected Chat Completions request format and allow browser-side requests from the application's origin.

## 🧪 Available Scripts

### Development

```bash
npm start
```

Starts the application in development mode.

### Production Build

```bash
npm run build
```

Builds an optimized production version of the application.

These scripts are defined in `package.json`.

## 🎨 UI

RefactorAI uses a dark, minimalist developer-oriented interface with a red accent theme.

The application includes:

* fixed application header
* centered chat area
* user and assistant avatars
* message bubbles
* loading indicator
* styled Markdown tables
* syntax-highlighted code blocks
* responsive mobile adjustments
* dedicated API key modal

The chat layout is centered with a maximum width of 1000px, while the message renderer includes responsive behavior for screens below 640px.

## ⚠️ Project Scope

RefactorAI is intentionally small and focused.

It is currently a **frontend-only developer chatbot** and does not include:

* a custom backend
* a database
* user registration or authentication
* persistent conversation history
* server-side API key protection
* multi-user authorization
* application routing

This keeps the project simple while still demonstrating a complete React-based AI chat workflow.

## ℹ️ Model Configuration Note

The currently implemented API service sends:

```text
openai/gpt-oss-120b
```

as the model identifier.

The header UI, however, currently displays:

```text
GPT-OSS-20B
```

These two values are not identical. The model shown in the UI should therefore be considered a presentation label rather than a guaranteed reflection of the model sent to the API.

## 🤝 Contributing

```bash
git checkout -b feature/NewFeature
git add .
git commit -m "Add NewFeature"
git push origin feature/NewFeature
```

Then open a Pull Request.

## 👨‍💻 Author

**Fazil Məmmədzadə**

* [GitHub](https://github.com/fazilmemmedzade)
* [Portfolio](https://fazilmmmdzad.github.io/Portfolio/)

## 🔗 Repository

[github.com/fazilmemmedzade/RefactorAI](https://github.com/fazilmemmedzade/RefactorAI)

---

⭐ If you like the project, consider starring the repository.
