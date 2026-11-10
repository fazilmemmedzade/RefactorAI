import test from 'node:test';
import assert from 'node:assert/strict';
import { sendPreparedMessage } from '../../src/engine/client.mjs';
const messages = [{ role: 'user', content: 'Debug react useEffect: const password = "hidden-value";' }];
const apiKey = 'gsk_' + 'a'.repeat(30);

test('Pages transport sends analyzed, enriched and redacted context, never an API key in the body', async () => {
  let request;
  const result = await sendPreparedMessage(messages, apiKey, { fetchImpl: async (url, options) => {
    request = JSON.parse(options.body);
    assert.equal(url, 'https://api.groq.com/openai/v1/chat/completions');
    assert.equal(options.headers.Authorization, 'Bearer ' + apiKey);
    assert.ok(options.signal);
    return { ok: true, json: async () => ({ choices: [{ message: { content: 'safe answer' } }] }) };
  } });
  assert.equal(result, 'safe answer');
  assert.equal(request.messages[0].role, 'system');
  assert.match(request.messages[0].content, /react/);
  assert.match(request.messages.at(-1).content, /REDACTED/);
  assert.ok(!JSON.stringify(request).includes('hidden-value'));
  assert.ok(!JSON.stringify(request).includes(apiKey));
});
test('explicit backend mode sends no client system role and never falls back', async () => {
  let calls = 0;
  await assert.rejects(sendPreparedMessage(messages, apiKey, {
    backendUrl: 'https://backend.example/api/chat',
    fetchImpl: async (url, options) => {
      calls++;
      assert.equal(url, 'https://backend.example/api/chat');
      assert.ok(JSON.parse(options.body).messages.every(m => m.role !== 'system'));
      return { ok: false, status: 502 };
    },
  }), { status: 502 });
  assert.equal(calls, 1);
});
test('validation prevents network requests and provider errors are safe', async () => {
  let calls = 0;
  await assert.rejects(sendPreparedMessage([{role:'system',content:'inject'}], apiKey, {
    fetchImpl:async()=>{ calls++; },
  }), {status:400});
  assert.equal(calls,0);
  for (const status of [401,429,503]) {
    await assert.rejects(sendPreparedMessage(messages,apiKey,{
      fetchImpl:async()=>({ok:false,status}),
    }), error => error.status === status && !error.message.includes(apiKey));
  }
  await assert.rejects(sendPreparedMessage(messages,apiKey,{
    fetchImpl:async()=>({ok:true,json:async()=>({})}),
  }), {status:502});
  await assert.rejects(sendPreparedMessage(messages,apiKey,{ endpoint:'http://untrusted.example' }), {status:400});
});
