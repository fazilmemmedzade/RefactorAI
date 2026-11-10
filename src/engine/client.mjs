import { prepareRequest, redact, RequestError } from './pipeline.mjs';

export async function sendPreparedMessage(messages, apiKey, {
  backendUrl = '',
  endpoint = 'https://api.groq.com/openai/v1/chat/completions',
  model = 'openai/gpt-oss-120b',
  fetchImpl = fetch,
} = {}) {
  if (typeof apiKey !== 'string' || !apiKey.trim()) throw new RequestError('API key tələb olunur', 401);
  // Always prepare before any network request. A configured backend processes it
  // again server-side; never silently fall back when that backend is unavailable.
  const prepared = prepareRequest(messages);
  const destination = backendUrl || endpoint;
  const url = new URL(destination, globalThis.location?.origin || 'http://localhost');
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (url.protocol !== 'https:' && !(local && url.protocol === 'http:')) {
    throw new RequestError('API ünvanı HTTPS olmalıdır.');
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 55000);
  try {
    const response = await fetchImpl(url.href, {
      method: 'POST', redirect: 'error', signal: controller.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey.trim()}` },
      body: JSON.stringify(backendUrl ? {
        messages: prepared.messages.filter(m => m.role !== 'system'),
      } : { model, messages: prepared.messages, temperature: 0.2, max_tokens: 3000 }),
    });
    if (!response.ok) {
      const message = response.status === 401 ? 'API key etibarsızdır.' : response.status === 429 ?
        'API limiti aşılıb. Bir qədər sonra yenidən cəhd edin.' : 'Model xidməti sorğunu tamamlaya bilmədi.';
      throw new RequestError(message, response.status);
    }
    const data = await response.json();
    const content = backendUrl ? data?.content : data?.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || !content.trim()) throw new RequestError('Model boş cavab qaytardı.', 502);
    return redact(content);
  } catch (error) {
    if (error.name === 'AbortError') throw new RequestError('Cavab müddəti bitdi. Yenidən cəhd edin.', 504);
    if (error instanceof RequestError) throw error;
    throw new RequestError('Şəbəkə xətası. Bağlantını yoxlayıb yenidən cəhd edin.', 502);
  } finally { clearTimeout(timer); }
}
