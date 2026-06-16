# SEEDREAM_SANDBOX_ENV_BRIDGE_V1_REPORT

## objective

Audit how a user-configured API key could be made visible to the Codex Agent Runtime without exposing secrets.

## sources_audited

### 1. `os.environ`

- `SEEDREAM_API_KEY`: `MISSING`
- `GEMINI_API_KEY`: `MISSING`
- `GOOGLE_API_KEY`: `MISSING`
- `GOOGLE_GENAI_API_KEY`: `MISSING`
- `OPENAI_API_KEY`: `FOUND`

### 2. `.env`

- No `.env` file was present in the repository root or scanned workspace.

### 3. `.env.local`

- No `.env.local` file was present in the repository root or scanned workspace.

### 4. `config.json`

- No runtime `config.json` secret source was present.
- The only relevant config file found was `scripts/visual_autopilot/visual_generation_config.example.json`, which contains example `api_key_env` names only and no secret values.

### 5. provider secrets

- No provider secret manager implementation was found in the repository.
- No provider-side secret store or secret lookup bridge was found.

### 6. agent runtime injected variables

- The Codex Agent Runtime sees only the environment injected into its own process.
- It does not automatically inherit the user terminal session environment in this workspace.

## why_user_terminal_visible_but_sandbox_not_visible

The user terminal and the Codex Agent Runtime are separate process contexts.

The user terminal can have API keys available through its own shell session, profile, or launch context.
The sandboxed Agent Runtime only sees variables that were injected when it started.

In this workspace, there is no bridge that copies user-shell variables into the agent process.
As a result:

- user terminal can have `SEEDREAM_API_KEY`
- sandbox / agent runtime can still report `MISSING`

## runtime_observation

- `SEEDREAM_API_KEY` is not visible in the Agent Runtime
- `SEEDREAMProvider.health_check()` therefore reports `MISSING`

## recommendation

Recommended approach: `C. runtime bridge`

Reason:

- it preserves secret handling outside source code
- it allows the Agent Runtime to receive user-configured variables explicitly
- it avoids writing API keys into Markdown, JSON, or source files

Secondary fallback:

- `B. startup script injection` for local development workflows

Not recommended as the primary fix:

- `A. unified .env` because this workspace currently has no `.env` bridge in place and the sandbox will not automatically load user shell state
- `D. provider secret manager` because it is heavier than needed for the current integration gap

## prohibited

- No hardcoded API keys
- No key values were recorded in this report

## readiness

`SEEDREAM_SANDBOX_ENV_BRIDGE = NOT_IMPLEMENTED`

`SEEDREAM_API_KEY` remains unavailable inside the current Codex Agent Runtime.

`SEEDREAM_SANDBOX_ENV_BRIDGE_V1_COMPLETE = YES`
