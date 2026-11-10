# RefactorAI

Developer assistant with a code-analysis and knowledge layer between chat and model inference.

**Live app:** [RefactorAI on GitHub Pages](https://fazilmemmedzade.github.io/RefactorAI/)

## One source branch

All application source, the shared engine, optional backend, tests, training tools
and deployment configuration live on **master**. The Pages workflow builds and
publishes an artifact from master; no deployment branch is required.

## Request flow

Chat → validation → secret redaction → code signals → relevant knowledge retrieval
→ bounded context → model provider → validated/redacted response.

GitHub Pages runs this preparation layer in the browser. Users bring their own
**Groq API key**. There is no shared key in the source, and no localhost backend
dependency in the published build. Processed code is still sent to Groq for inference.
The engine is an application layer, not a server security boundary in Pages mode.

An optional Node backend uses the same engine. Set REACT_APP_BACKEND_URL at build
time to route requests through it. A configured backend failure never falls back
to direct provider access.

## Development

Requires Node 22.12+ and npm.

```sh
npm ci --ignore-scripts
npm start
npm run test:backend
npm run build
```

The Pages workflow runs tests and a production build before publishing. Repository
Settings → Pages → Source must be **GitHub Actions**.

## Configuration

The default .env supports static Pages deployment:

```env
REACT_APP_API_URL=https://api.groq.com/openai/v1/chat/completions
```

Optional build variables: REACT_APP_MODEL_NAME and REACT_APP_BACKEND_URL. Never put
an API key into REACT_APP_ variables: these values are public in the browser bundle.
The existing UI keeps a user's key in that browser's localStorage until cleared.

## Knowledge and training

src/engine contains the versioned knowledge corpus, analysis/context pipeline and
provider client. server contains the optional HTTP service and offline reviewed-data
exporter. Add domain guidance in src/engine/knowledge.mjs.

This layer enriches inference; it does not train model weights. The exporter produces
deduplicated train/validation JSONL from explicitly reviewed examples. No chats are
automatically collected. See [the architecture and training guide](docs/model-pipeline.md)
for commands, deployment settings and limitations.

Created by [Fazil Məmmədzadə](https://github.com/fazilmemmedzade).
