import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { prepareRequest, redact, RequestError } from './pipeline.mjs';
import { callProvider } from './provider.mjs';
export function createServer({ provider = callProvider, env = process.env } = {}) {
  const origin = env.FRONTEND_ORIGIN || 'http://localhost:3000';
  const endpoint = env.MODEL_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
  const url = new URL(endpoint);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('MODEL_API_URL must be HTTPS without credentials');
  const model = env.MODEL_NAME || 'openai/gpt-oss-120b';
  let active = 0;
  return http.createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    const reply = (status, body) => { res.writeHead(status); res.end(JSON.stringify(body)); };
    if (req.headers.origin && req.headers.origin !== origin) return reply(403, { error: { message: 'Origin icazəli deyil.' } });
    if (req.headers.origin) { res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Vary', 'Origin'); }
    if (req.url === '/health' && req.method === 'GET') return reply(200, { status: 'ok' });
    if (req.url !== '/api/chat') return reply(404, { error: { message: 'Tapılmadı.' } });
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      return reply(204, {});
    }
    if (req.method !== 'POST') return reply(405, { error: { message: 'POST tələb olunur.' } });
    const apiKey = /^Bearer ([^\s]{20,512})$/.exec(req.headers.authorization || '')?.[1];
    if (!apiKey) return reply(401, { error: { message: 'API key tələb olunur.' } });
    if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) return reply(415, { error: { message: 'JSON tələb olunur.' } });
    if (active >= 8) return reply(429, { error: { message: 'Server məşğuldur.' } });
    active++;
    try {
      const chunks = []; let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 400000) throw new RequestError('Sorğu çox böyükdür.', 413);
        chunks.push(chunk);
      }
      let body;
      try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
      catch { throw new RequestError('JSON etibarsızdır.'); }
      const prepared = prepareRequest(body?.messages);
      const content = await provider({ messages: prepared.messages, apiKey, endpoint, model });
      reply(200, { content: redact(content), metadata: {
        knowledgeIds: prepared.metadata.knowledgeIds, omittedMessages: prepared.metadata.omittedMessages,
      } });
    } catch (error) {
      const status = error.status || 502;
      reply(status, { error: { message: error instanceof RequestError || [401, 429].includes(status) ?
        error.message : 'Model xidməti əlçatan deyil. Yenidən cəhd edin.' } });
    } finally { active--; }
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = createServer();
  server.requestTimeout = 15000; server.headersTimeout = 10000;
  server.listen(Number(process.env.PORT || 3001), process.env.HOST || '127.0.0.1',
    () => console.log('RefactorAI orchestration server ready'));
}
