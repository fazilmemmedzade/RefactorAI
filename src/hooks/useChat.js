import { useState } from 'react';
import { sendMessageToAI } from '../services/openaiService';

function useChat(apiKey) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content) => {
    if (!apiKey) {
      alert('Zəhmət olmasa API key daxil edin!');
      return;
    }

    const userMessage = { role: 'user', content };
    
    // 1. Yeni mesajı lokal massivə yığırıq ki, asinxron state ləngiməsi olmasın
    const updatedMessages = [...messages, userMessage];
    
    // UI-ı dərhal yeniləyirik
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // 2. AI-a hazır updatedMessages massivini ötürürük
      const aiResponse = await sendMessageToAI(updatedMessages, apiKey);
      
      const assistantMessage = { 
        role: 'assistant', 
        content: aiResponse 
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      // Konsolda tam detalını görmək üçün:
      console.error('API Xətası Detallı:', error.response?.data || error);
      
      const status = error.response?.status;
      const errorMsg = error.response?.data?.error?.message || error.message || '';

      let errorMessage = 'Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.';

      if (status === 401 || errorMsg.includes('API key') || errorMsg.includes('invalid')) {
        errorMessage = 'API key etibarsızdır! Zəhmət olmasa düzgün key daxil edin.';
        localStorage.removeItem('refactor_api_key');
      } else if (status === 429) {
        errorMessage = 'API limitiniz/balansınız bitib və ya çox tez-tez sorğu göndərirsiniz.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Şəbəkə xətası! İnternet bağlantınızı və ya CORS tənzimləmələrini yoxlayın.';
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading };
}

export default useChat;