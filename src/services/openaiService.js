import { sendPreparedMessage } from '../engine/client.mjs';

export const sendMessageToAI = (messages, apiKey) => sendPreparedMessage(messages, apiKey, {
  backendUrl: process.env.REACT_APP_BACKEND_URL || '',
  endpoint: process.env.REACT_APP_API_URL || 'https://api.groq.com/openai/v1/chat/completions',
  model: process.env.REACT_APP_MODEL_NAME || 'openai/gpt-oss-120b',
});
