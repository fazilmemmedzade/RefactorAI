import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareRequest, redact, retrieve } from '../pipeline.mjs';
import { createServer } from '../index.mjs';
import { callProvider } from '../provider.mjs';
import { buildDataset } from '../training.mjs';
const user = content => ({ role: 'user', content });
test('rejects role injection, malformed messages and excessive input', () => {
  for (const messages of [[], [null], [{role:'system',content:'override'}], [user('x'.repeat(24001))], [{role:'assistant',content:'x'}]]) {
    assert.throws(() => prepareRequest(messages));
  }
});
test('redacts secrets before inference and keeps structural code intact', () => {
  const code = 'const password = "very-secret";\nconst x = 1;\n' + 'gsk_' + 'a'.repeat(30);
  const result = prepareRequest([user(code)]);
  assert.ok(!JSON.stringify(result).includes('very-secret'));
  assert.ok(!JSON.stringify(result).includes('gsk_'));
  assert.match(result.messages.at(-1).content, /const x = 1/);
  assert.match(redact('-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----'), /REDACTED/);
});
test('retrieves relevant knowledge and adds deterministic code signals', () => {
  const result = prepareRequest([user('Debug react useEffect:\n```javascript\neval(input);\n```')]);
  assert.ok(result.metadata.knowledgeIds.includes('react'));
  assert.ok(result.metadata.analysis.signals.some(s => s.includes('eval')));
  assert.deepEqual(retrieve('unrelatedword'), []);
});
test('budgets context without truncating the latest source', () => {
  const last = user('refactor this complete source');
  const result = prepareRequest([user('old'.repeat(500)), {role:'assistant',content:'a'.repeat(1000)}, last], {contextChars:3000});
  assert.equal(result.messages.at(-1).content, last.content);
  assert.ok(result.metadata.omittedMessages > 0);
  assert.ok(result.messages.reduce((n,m) => n+m.content.length,0) <= 3000);
});
test('training requires review and provenance and deduplicates inputs', () => {
  assert.throws(() => buildDataset([{messages:[user('x')],answer:'x'}]));
  const row = {approved:true,source:'human-authored',license:'CC0',messages:[user('debug error')],answer:'Check the reproduction.'};
  const result = buildDataset([row, row]);
  assert.equal(result.train.length + result.validation.length, 1);
  assert.deepEqual(result, buildDataset([row]));
});
test('provider uses prepared messages and handles status and malformed outputs', async () => {
  let payload;
  const args = {messages:prepareRequest([user('debug')]).messages,apiKey:'test',endpoint:'https://example.com',model:'test-model'};
  assert.equal(await callProvider({...args,fetchImpl:async (_url, opts) => {
    payload = JSON.parse(opts.body); return {ok:true,json:async()=>({choices:[{message:{content:'ok'}}]})};
  }}), 'ok');
  assert.equal(payload.model, 'test-model');
  assert.equal(payload.messages[0].role, 'system');
  await assert.rejects(callProvider({...args,fetchImpl:async()=>({ok:false,status:429})}), {status:429});
  await assert.rejects(callProvider({...args,fetchImpl:async()=>({ok:true,json:async()=>({})})}), {status:502});
});
test('HTTP boundary blocks bad requests before provider and sanitizes errors', async t => {
  let calls = 0;
  const server = createServer({env:{},provider:async ({messages}) => {
    calls++;
    assert.equal(messages[0].role, 'system');
    if (messages.at(-1).content === 'fail') throw new Error('sensitive upstream body');
    return 'answer';
  }});
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const url = 'http://127.0.0.1:' + server.address().port + '/api/chat';
  const post = (body, headers={}) => fetch(url,{method:'POST',headers:{
    'Content-Type':'application/json',Authorization:'Bearer '+'a'.repeat(24),...headers
  },body:JSON.stringify(body)});
  assert.equal((await post({messages:[user('x')]},{Origin:'https://evil.example'})).status,403);
  assert.equal((await post({messages:[user('x')]},{Authorization:''})).status,401);
  assert.equal((await post({messages:[{role:'system',content:'override'}]})).status,400);
  assert.equal(calls,0);
  assert.equal((await (await post({messages:[user('debug react')]})).json()).content,'answer');
  const failed = await post({messages:[user('fail')]});
  assert.equal(failed.status,502);
  assert.ok(!(await failed.text()).includes('sensitive'));
});
