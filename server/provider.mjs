export async function callProvider({ messages, apiKey, endpoint, model, fetchImpl = fetch }) {
  const response = await fetchImpl(endpoint, {
    method: 'POST', redirect: 'error', signal: AbortSignal.timeout(50000),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, temperature: 0.2, max_tokens: 3000 }),
  });
  if (!response.ok) {
    throw Object.assign(new Error('Model xidməti sorğunu tamamlaya bilmədi.'), {
      status: [401, 429].includes(response.status) ? response.status : 502,
    });
  }
  const result = await response.json();
  const content = result?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) throw Object.assign(new Error('Model boş cavab qaytardı.'), { status: 502 });
  return content;
}
