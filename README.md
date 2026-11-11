# 🤖 RefactorAI

**RefactorAI** is an AI-powered developer assistant built with **React 18**. It helps developers discuss programming, analyze code, investigate errors, and explore refactoring and optimization ideas through a conversational interface.

The application prepares each request with a dedicated analysis and knowledge layer before sending it to an AI model. Users connect with their own Groq API key.

<a href="https://fazilmemmedzade.github.io/RefactorAI/">Visit the live application</a>

## ✨ Features

### 💻 Developer Assistant

RefactorAI focuses on software development conversations. You can use it to:

* Explain programming concepts and existing code
* Identify potential issues in an implementation
* Discuss debugging approaches and error messages
* Suggest refactoring and readability improvements
* Explore performance and security considerations
* Request examples, documentation, and test ideas
* Continue a conversation with follow-up questions

### 🧠 Request Preparation

Before a request reaches the model, RefactorAI processes the conversation through a shared engine.

The preparation layer:

* Validates message roles and content
* Applies message and conversation size limits
* Masks common credential and private-key patterns
* Detects code-language labels in fenced blocks
* Identifies selected code patterns that may need review
* Retrieves relevant entries from a local knowledge base
* Builds a bounded context containing the latest message and recent history

The analysis uses pattern matching and curated guidance. It does not execute submitted code or guarantee that every issue or secret will be found.

### 📚 Developer Knowledge Base

The application includes guidance for several development topics:

* Behavior-preserving refactoring
* JavaScript, TypeScript, and asynchronous operations
* React state and effects
* C# and .NET service boundaries
* Python maintainability
* Security and input handling
* Performance analysis
* Debugging and regression testing

Relevant entries are selected from the local knowledge base and included as context for the model. This enriches a request; it does not change the model's trained weights.

### 💬 Conversational Chat

The chat interface supports:

* Continuous conversations and follow-up questions
* Multiline message input
* Loading and error states
* Responsive layout
* Developer-oriented prompts and responses

Press **Enter** to send a message. Use **Shift + Enter** to start a new line.

### 📝 Markdown & Code Rendering

Assistant responses are displayed using Markdown with support for:

* Formatted text and headings
* Code blocks with syntax highlighting
* GitHub Flavored Markdown
* Lists and tables

Raw HTML in assistant responses is not rendered as HTML.

### 🔑 Bring Your Own API Key

RefactorAI uses a **Bring Your Own Key** approach.

Users enter their own Groq API key through the application. The key is stored in the browser's local storage and can be removed through the key menu. The repository does not provide a shared API key.

The application sends processed conversation content to Groq for inference. Secret masking is best effort, so review sensitive content before submitting it.

### 🧪 Tests & Training Data Export

The repository includes automated checks for the request pipeline, provider integration, optional backend, and reviewed-data export.

A separate offline tool can prepare training and validation JSONL files from examples that have been explicitly reviewed and include source and license information. Conversations are not automatically collected for training, and the export tool does not train a model.

## 🏗️ Architecture

RefactorAI separates the chat interface, conversation management, request preparation, and provider communication.

```text
Chat Interface
      │
      ▼
Conversation Management
      │
      ▼
Validation and Secret Masking
      │
      ▼
Code Signals and Knowledge Retrieval
      │
      ▼
Context Preparation
      │
      ▼
Groq Model API
      │
      ▼
Response Validation and Chat Display
```

### 🌐 GitHub Pages Mode

The published application is a static React site. Its preparation layer runs in the browser before the processed request is sent to Groq.

This mode does not require a separately hosted backend. The browser-based layer organizes and prepares requests but does not provide server-side enforcement.

### 🖥️ Optional Backend Mode

The project also includes an optional Node.js HTTP service. It uses the same preparation engine and can be selected by configuring a backend URL when building the frontend.

When a backend is configured, the application sends requests to that service. A backend failure does not automatically switch the application back to direct provider access.

## 🔌 AI Model Integration

The default provider endpoint is the **Groq OpenAI-compatible Chat Completions API**.

The default model is:

```text
openai/gpt-oss-120b
```

The application uses the user's API key to authenticate requests. Model availability and API usage limits depend on the user's Groq account.

## 🧩 Main Components

| Component | Description |
| --------- | ----------- |
| `Header` | Application header and API key controls |
| `ApiKeyModal` | API key input interface |
| `ChatContainer` | Main conversation interface |
| `MessageList` | Displays the conversation |
| `MessageItem` | Renders messages, Markdown, and code |
| `InputArea` | Message input and sending controls |
| `useChat` | Conversation state and request handling |
| `openaiService` | Connects the chat to the request client |
| `src/engine` | Validation, analysis, knowledge retrieval, and provider client |
| `server` | Optional backend and reviewed-data export tool |

## 🛠️ Technologies

The project uses:

* **React 18**
* **JavaScript**
* **Node.js**
* **CSS**
* **React Markdown**
* **Remark GFM**
* **React Syntax Highlighter**
* **React Icons**
* **Groq OpenAI-compatible API**
* **GitHub Actions**
* **GitHub Pages**

## 📋 Requirements

To run RefactorAI locally, you need:

* Node.js **22.12 or newer**
* npm
* Git
* A Groq API key
* A modern web browser

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/fazilmemmedzade/RefactorAI.git
cd RefactorAI
```

### 2. Install Dependencies

```bash
npm ci --ignore-scripts
```

### 3. Start the Application

```bash
npm start
```

Open the local development address shown in the terminal.

### 4. Add Your API Key

Enter your Groq API key in the application when prompted. You can change or remove it using the key menu in the header.

### 5. Start a Conversation

Enter a programming question or paste a code example. RefactorAI prepares the request, sends it to the configured provider, and displays the response in the chat.

## ⚙️ Configuration

The default frontend configuration points to Groq:

```env
REACT_APP_API_URL=https://api.groq.com/openai/v1/chat/completions
```

Optional frontend build variables:

| Variable | Purpose |
| -------- | ------- |
| `REACT_APP_API_URL` | OpenAI-compatible provider endpoint |
| `REACT_APP_MODEL_NAME` | Model identifier used in browser mode |
| `REACT_APP_BACKEND_URL` | Optional backend chat endpoint |

Variables prefixed with `REACT_APP_` are included in the frontend build and are public. Do not place API keys in them.

### Optional Backend

Start the local backend with:

```bash
npm run server
```

The default backend listens on `127.0.0.1:3001`. For local development, configure the frontend with:

```env
REACT_APP_BACKEND_URL=http://localhost:3001/api/chat
```

Backend process settings such as `PORT`, `HOST`, `FRONTEND_ORIGIN`, `MODEL_API_URL`, and `MODEL_NAME` are described in `server/.env.example`.

For a deployed frontend, host the backend separately over HTTPS and configure the allowed frontend origin. See the [model pipeline guide](docs/model-pipeline.md) for deployment details.

## 🧪 Running Tests

Run the backend and shared-pipeline checks with:

```bash
npm run test:backend
```

The checks cover input validation, secret masking, knowledge retrieval, context limits, provider handling, the HTTP boundary, and reviewed-data export.

## 🏭 Production Build

Create an optimized frontend build:

```bash
npm run build
```

The generated application is placed in the `build` directory.

## 🌐 Deployment

RefactorAI is published using **GitHub Pages**:

<a href="https://fazilmemmedzade.github.io/RefactorAI/">https://fazilmemmedzade.github.io/RefactorAI/</a>

The GitHub Actions workflow runs checks, builds the frontend, and publishes the build artifact from the **master** branch. The repository's Pages source is configured to use GitHub Actions.

GitHub Pages hosts the static frontend. The optional Node.js backend requires separate hosting.

## 📁 Project Structure

```text
RefactorAI/
│
├── .github/
│   └── workflows/        # Tests, build, and Pages deployment
│
├── docs/
│   └── model-pipeline.md
│
├── public/              # Frontend public assets
│
├── server/
│   ├── test/            # Pipeline and integration checks
│   ├── index.mjs        # Optional HTTP backend
│   ├── pipeline.mjs     # Shared engine exports
│   ├── provider.mjs     # Server-side provider adapter
│   ├── training.mjs     # Reviewed-data JSONL export
│   └── .env.example
│
├── src/
│   ├── components/      # Chat and API key components
│   ├── engine/          # Analysis, knowledge, and client
│   ├── hooks/           # Chat state management
│   ├── services/        # Frontend service integration
│   ├── App.jsx
│   └── index.js
│
├── .env
├── package.json
├── package-lock.json
└── README.md
```

## 🎯 Project Purpose

RefactorAI was created as a practical developer assistant for discussing code, debugging, documentation, and refactoring in one interface.

The project demonstrates a workflow that connects a React chat application with a shared request-preparation layer and an AI provider:

**Ask → Prepare Context → Analyze → Retrieve Knowledge → Send → Review Response**

AI-generated answers can contain mistakes. Review suggested changes and run appropriate tests before using them in a real project.

## 👨‍💻 Author

**Fazil Məmmədzadə**

<a href="https://github.com/fazilmemmedzade">Github</a>

<a href="https://fazilmemmedzade.github.io/Portfolio">Portfolio</a>

---

⭐ If you like the project, consider starring the repository!

## 📸 Screenshots

| API Key Page |
| :---: |
| <img width="920" alt="API Key Page" src="https://github.com/fazilmemmedzade/My-Files/blob/main/APIKeyPage.png" /> |

| Chat Page |
| :---: |
| <img width="920" alt="Chat Page" src="https://github.com/fazilmemmedzade/My-Files/blob/main/ChatPage.png" /> |

| Question & Answer |
| :---: |
| <img width="920" alt="Question & Answer" src="https://github.com/fazilmemmedzade/My-Files/blob/main/Answer.png" /> |

| Full Answer |
| :---: |
| <img width="920" alt="Full Answer" src="https://github.com/fazilmemmedzade/My-Files/blob/main/Answer2.png" /> |
