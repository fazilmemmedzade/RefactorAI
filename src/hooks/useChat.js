import { useRef, useState } from 'react';
import { sendMessageToAI } from '../services/openaiService';

function useChat(apiKey) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const pending = useRef(false);

  const sendMessage = async (content) => {
    if (pending.current || typeof content !== 'string' || !content.trim()) return;
    if (!apiKey) { alert('Zəhmət olmasa API key daxil edin!'); return; }
    const userMessage = { role: 'user', content: content.trim() };
    const updatedMessages = [...messages, userMessage];
    pending.current = true;
    setMessages(updatedMessages);
    setIsLoading(true);
    try {
      const reply = await sendMessageToAI(updatedMessages.filter(m => !m.isError), apiKey);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      if (error.status === 401) localStorage.removeItem('refactor_api_key');
      setMessages(prev => [...prev, {
        role: 'assistant', isError: true,
        content: error.message || 'Xəta baş verdi. Yenidən cəhd edin.',
      }]);
    } finally { pending.current = false; setIsLoading(false); }
  };
  return { messages, sendMessage, isLoading };
}
export default useChat;
