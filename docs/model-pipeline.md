# Shared model pipeline

## GitHub Pages mode

All source is maintained on master. GitHub Actions builds the React app and deploys
the build artifact to Pages. The browser service delegates to src/engine/client.mjs,
which always prepares the conversation with src/engine/pipeline.mjs before inference.
The shared corpus is src/engine/knowledge.mjs.

Preparation validates input, redacts common secret formats, extracts fenced language
labels and heuristic code warnings, retrieves up to four relevant knowledge entries,
and assembles a stable policy plus bounded recent history. The latest source is
preserved intact; older messages are dropped to fit a 48,000-character budget.
Output is checked and redacted. Requests have deadlines and errors omit provider bodies.

Pages mode uses the user's own Groq key and sends processed source to Groq. Processing
in the browser does not provide server-side enforcement or hide the provider from
the browser. It is a modular application layer. Do not add shared service credentials
to the public build. The existing localStorage key storage remains. Raw HTML from
assistant Markdown is disabled.

The engine does not execute source, parse an AST, use embeddings, or guarantee secret
or vulnerability detection. Character budgets are not exact model token accounting.
Knowledge retrieval is deterministic lexical matching. Model quality has not been
benchmarked and model weights have not been trained.

## Optional backend mode

Run node server/index.mjs (or npm run server), then build the frontend with:

```env
REACT_APP_BACKEND_URL=https://your-backend.example/api/chat
```

The client redacts and bounds input before transport; the backend independently
validates and prepares context using the same engine. It never trusts a client system
role. A failed configured backend never triggers direct-provider fallback.

Server settings: PORT, HOST, FRONTEND_ORIGIN, MODEL_API_URL and MODEL_NAME; see
server/.env.example. Pass them through the process environment. Default bind address
is 127.0.0.1 and default frontend origin is http://localhost:3000. Use HOST=0.0.0.0
when required by your hosting provider. Use HTTPS and enforce body deadlines at a
reverse proxy. CORS is an origin restriction, not authentication. BYOK prevents a
public shared-key relay; add user authentication and quotas before using shared keys.
Never log Authorization headers, raw source or conversation bodies.

## Reviewed training-data export

Create a JSON array of reviewed examples with explicit provenance:

```json
[{
  "approved": true,
  "source": "human-authored example, review reference",
  "license": "confirmed reuse permission",
  "messages": [{"role": "user", "content": "Debug this minimal example..."}],
  "answer": "Reviewed correct answer, fix and regression tests..."
}]
```

```sh
node server/training.mjs reviewed.json work/dataset
```

The output prefix's directory must already exist. The exporter writes train and
validation JSONL, refuses overwrites, uses production context preparation, redacts
common secrets, removes duplicate inputs and hashes inputs into a deterministic
approximately 80/20 split. Small datasets may have an empty split; inspect counts.
Review the output manually and keep private datasets out of Git.

Actual fine-tuning requires suitable infrastructure and a model-specific training
workflow. Keep a separate final test set, compare correctness, regressions, security
and language quality against the existing model, and then configure MODEL_NAME or
REACT_APP_MODEL_NAME for an available trained endpoint. No training job is started
automatically and no production conversations are collected.
