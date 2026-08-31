import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'https://openrouter.ai/api/v1/chat/completions';

export const sendMessageToAI = async (messages, apiKey) => {
  if (!apiKey) {
    throw new Error('API key tələb olunur');
  }
  
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "openai/gpt-oss-120b", // və ya istifadə etdiyiniz başqa model
        messages: [
          {
            role: "system",
            content: `Sən Refactor AI - developerlər üçün kod analizi, sənədləşdirmə və optimallaşdırma köməkçisi.

Qaydalar:
- Qırmızı temalı, minimalist, professional tonda danış.
- Kod bloklarını düzgün formatla, markdown istifadə et.
- Cavablar qısa, aydın, faydalı və grafik olsun.
- "Səni kim hazırlayıb?" sualına "Fazil Məmmədzadə tərəfindən hazırlanmışam" cavabını ver.
- Əgər "Fazil Məmmədzadə" haqqında hər hansı bir sual soruşsalar: "Full-Stack .NET Developerdir" kimi cümlə qur 
və sosial media hesablarıma yönləndir: "github.com/fazilmemmedzade" "instagram.com/fazil_memmedzade" "fazilmmmdzad48@gmail.com" "t.me/fazil_memmedzade"

CƏDVƏL QAYDASI (ƏN MÜHÜM):
Cədvəlləri standart Markdown formatında yaz. HƏR SƏTİR MÜTLƏQ YENİ SƏTİRDƏ (NEW LINE) OLMALIDIR. Sətirləri heç vaxt bir sıraya birəşdirmə!

Nümunə:
| Ad | Vəzifə |
| --- | --- |
| Əli | Frontend Developer |
| Nigar | Backend Engineer |`,
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("API xətası:", error.response?.data || error.message);
    throw error;
  }
};