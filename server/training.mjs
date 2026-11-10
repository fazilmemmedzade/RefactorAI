import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { prepareRequest, redact } from './pipeline.mjs';

// Only explicit, human-reviewed examples enter the dataset. No chat collection.
export function buildDataset(records) {
  if (!Array.isArray(records)) throw new Error('Expected an array of reviewed examples');
  const seen = new Set();
  const train = [], validation = [];
  for (const row of records) {
    if (row?.approved !== true || typeof row.source !== 'string' || !row.source.trim() ||
        typeof row.license !== 'string' || !row.license.trim() ||
        typeof row.answer !== 'string' || !row.answer.trim() || row.answer.length > 24000) {
      throw new Error('Each example requires approval, source, license and a bounded answer');
    }
    const request = prepareRequest(row.messages);
    const messages = [...request.messages, { role: 'assistant', content: redact(row.answer) }];
    // Group identical inputs together to prevent train/validation leakage.
    const hash = createHash('sha256').update(JSON.stringify(request.messages)).digest('hex');
    if (seen.has(hash)) continue;
    seen.add(hash);
    const example = { messages };
    (parseInt(hash.slice(0, 8), 16) % 5 === 0 ? validation : train).push(example);
  }
  return { train, validation };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [input, prefix] = process.argv.slice(2);
  if (!input || !prefix) throw new Error('Usage: node server/training.mjs reviewed.json output-prefix');
  const dataset = buildDataset(JSON.parse(await readFile(input, 'utf8')));
  for (const split of ['train', 'validation']) {
    await writeFile(prefix + '.' + split + '.jsonl', dataset[split].map(row => JSON.stringify(row)).join('\n') +
      (dataset[split].length ? '\n' : ''), { flag: 'wx' });
  }
  console.log(JSON.stringify({ train: dataset.train.length, validation: dataset.validation.length }));
}
