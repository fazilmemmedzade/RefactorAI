import axios from 'axios';
const API_URL = process.env.REACT_APP_BACKEND_URL || '/api/chat';
export const sendMessageToAI = async (messages, apiKey) => {
  if (!apiKey) throw new Error('API key tələb olunur');
  const { data } = await axios.post(API_URL, {
    messages: messages.map(({ role, content }) => ({ role, content })),
  }, { headers: { Authorization: `Bearer ${apiKey}` }, timeout: 65000 });
  if (typeof data?.content !== 'string' || !data.content.trim()) throw new Error('Server boş cavab qaytardı');
  return data.content;
};
