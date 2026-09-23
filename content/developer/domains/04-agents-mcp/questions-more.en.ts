import type { QuestionEn } from "@/lib/content/types";

/** Англійський дубль додаткового пулу. */
export const questionsMoreEn: Record<string, QuestionEn> = {
  // ── dm-1: Agent SDK: your first agent (extra pool) ──────────────────────
  "dm-1-q8": {
    prompt: "When should you use `ClaudeSDKClient` in Python instead of the `query()` function?",
    choices: {
      a: "For an interactive multi-turn conversation in one session, with the ability to send follow-up messages and interrupt the agent.",
      b: "When you need synchronous code: `ClaudeSDKClient` is the synchronous version of `query()`.",
      c: "When the agent must use built-in tools: `query()` does not support them.",
      d: "When you need to call the Messages API directly, bypassing the agent loop.",
    },
    whyWrong: {
      b: "Both APIs are asynchronous and used with `async`/`await`.",
      c: "`query()` has access to the same built-in tools.",
      d: "For direct Messages API calls there is the `anthropic` client; `ClaudeSDKClient` is the same agent harness.",
    },
    explanation:
      "`query()` suits one-off tasks: every call is a new run. `ClaudeSDKClient` keeps the connection and session, so subsequent `client.query()` calls continue the same conversation, and `interrupt()` lets you stop the current action.",
  },
  "dm-1-q9": {
    scenario:
      "An Agent SDK agent runs in CI to fix failing tests. Sometimes it gets stuck: it edits the same file and reruns the tests over and over, and one CI run costs as much as a hundred normal ones.",
    prompt: "How do you set a hard limit and handle it correctly?",
    choices: {
      a: "Lower `max_tokens` so the agent finishes sooner.",
      b: "Write \"make no more than 10 attempts\" in the prompt.",
      c: "Set `maxTurns` and check for a `result` with `subtype: \"error_max_turns\"` to mark the run as incomplete.",
      d: "Kill the process with an external CI timeout.",
    },
    whyWrong: {
      a: "`max_tokens` limits a single model response, not the number of loop steps.",
      b: "That is a request, not a guarantee; the limit belongs in configuration.",
      d: "You lose the `result` message with the cost and `session_id`, and a time limit is not a step limit.",
    },
    explanation:
      "`maxTurns` caps the number of agent loop turns. When the limit is hit, the SDK ends the run cleanly with a `result` message of `subtype: \"error_max_turns\"`, and your code can record it as a distinct outcome.",
  },
  "dm-1-q10": {
    prompt: "The UI must show the agent's text as it is generated rather than a whole turn at a time. What do you enable in the SDK?",
    choices: {
      a: "`stream: true`, as in the Messages API.",
      b: "Nothing: `assistant` messages already arrive token by token.",
      c: "Switch to the Messages API, because the SDK cannot do partial output.",
      d: "`includePartialMessages: true`, and handle messages of type `stream_event`.",
    },
    whyWrong: {
      a: "`query()` has no `stream` parameter: it always streams messages, and partial events are enabled separately.",
      b: "An `assistant` message arrives whole, after the model turn has finished.",
      c: "The SDK can do it: you only need to enable partial messages.",
    },
    explanation:
      "With `includePartialMessages` the SDK additionally yields `stream_event` messages carrying raw API streaming events (including text deltas). Complete `assistant` messages still arrive as well.",
  },
  "dm-1-q11": {
    prompt: "What in the `system` message with `subtype: \"init\"` is useful for debugging?",
    choices: {
      a: "The `session_id` of the current run.",
      b: "The `total_cost_usd` of the whole run.",
      c: "The list of tools available to the agent.",
      d: "The status of connected MCP servers.",
    },
    whyWrong: {
      b: "Nothing has been spent at `init` time; the cost arrives in `result`.",
    },
    explanation:
      "`init` records what the agent starts with: the session, model, tools and MCP servers with their status. If a tool is missing from this list, the model will certainly not call it.",
  },
  "dm-1-q12": {
    prompt: "What does `resume: sessionId` combined with `forkSession: true` do?",
    choices: {
      a: "Deletes the old session and continues in a new one.",
      b: "Merges two sessions into one.",
      c: "Creates a new session with a new id that starts from the original's history; the original is left unchanged.",
      d: "Resumes the session read-only, without tool calls.",
    },
    whyWrong: {
      a: "The original session is left untouched; that is the whole point of a fork.",
      b: "A fork branches history; it does not merge it.",
      d: "There is no such mode: in a fork the agent works as usual.",
    },
    explanation:
      "A fork is useful for trying an alternative approach from the same state without spoiling the main branch. Without `forkSession`, a resumed session continues under the same id.",
  },
  "dm-1-q13": {
    scenario:
      "An Agent SDK service is being deployed to a container. Locally the developer ran it after signing in to Claude Code, but in the container the very first `query()` fails with an authentication error.",
    prompt: "How should credentials be provided?",
    choices: {
      a: "Put the key in the repository's `CLAUDE.md`.",
      b: "Pass the key in `systemPrompt`.",
      c: "Exec into the container and sign in interactively by hand.",
      d: "Set the `ANTHROPIC_API_KEY` environment variable from the deployment's secret.",
    },
    whyWrong: {
      a: "That is text for the model: the key ends up in the context and in git, and it does not configure authentication.",
      b: "The system prompt is request content, not credentials; the key would only leak into the context.",
      c: "A manual interactive sign-in does not survive restarts and does not fit an automated deployment.",
    },
    explanation:
      "The SDK reads the API key from `ANTHROPIC_API_KEY`; Bedrock and Vertex have their own environment variables. The secret should come from a secrets manager, not from repository files or prompts.",
  },
  "dm-1-q14": {
    scenario:
      "A worker clones a user's repository into `/work/<job-id>` and starts an Agent SDK agent. The agent edits files, but the changes land in the worker's own directory instead of the clone.",
    prompt: "What do you fix?",
    choices: {
      a: "Pass `cwd: \"/work/<job-id>\"` in the `query()` options.",
      b: "Put the absolute path to the clone in the prompt.",
      c: "Copy the changed files into the clone after the run finishes.",
      d: "Pass the path through `settingSources`.",
    },
    whyWrong: {
      b: "The model may pick up the path, but relative tool paths and `Bash` would still resolve against the wrong directory.",
      c: "That treats the symptom: the agent still reads code and runs tests in the wrong repository.",
      d: "`settingSources` selects settings sources, not the working directory.",
    },
    explanation:
      "`cwd` sets the agent's working directory: built-in tool paths resolve against it and `Bash` commands run in it. Workers that handle different repositories should set it explicitly on every run.",
  },
  "dm-1-q15": {
    prompt: "The script sometimes crashes with `TypeError: Cannot read properties of undefined (reading 'trim')`. Why?",
    choices: {
      a: "There can be several `result` messages, and only the last one contains text.",
      b: "A `result` with an error `subtype` (`error_max_turns`, `error_during_execution`) has no `result` field; check `subtype` first.",
      c: "The `result` field is filled in only in `includePartialMessages` mode.",
      d: "You must `await message.result`, because it is a Promise.",
    },
    whyWrong: {
      a: "There is exactly one `result` message per run, at the end.",
      c: "Partial messages do not affect the final summary message.",
      d: "When present, `result` is a plain string.",
    },
    explanation:
      "The `result` message is a discriminated union: `subtype: \"success\"` carries text, error subtypes do not. Robust code branches on `subtype` and logs incomplete runs separately.",
  },
  "dm-1-q16": {
    prompt: "An Agent SDK agent called the built-in `Bash` tool. Where does the command actually run?",
    choices: {
      a: "In an Anthropic sandbox isolated from your infrastructure.",
      b: "Nowhere: the model just simulates the command output.",
      c: "On the machine of the user who sent the request to your app.",
      d: "On the machine or container where your SDK process runs, with its privileges.",
    },
    whyWrong: {
      a: "That is how server tools and Managed Agents work; the Agent SDK runs tools in your environment.",
      b: "The command really runs, and the model receives the real output as a `tool_result`.",
      c: "The user talks to your backend; commands run wherever the SDK runs.",
    },
    explanation:
      "The SDK is a harness running in your process, so `Bash`, `Write` and the other tools act with that process's privileges. That is why a production agent runs in an isolated container with minimal privileges.",
  },

  // ── dm-2: Tools and permissions in the SDK (extra pool) ─────────────────
  "dm-2-q8": {
    scenario:
      "A code review agent on the Agent SDK should only read code and write a comment in its answer. Security requires a guarantee that it changes no files and runs no commands, even if the PR code contains a prompt injection.",
    prompt: "How do you ensure this?",
    choices: {
      a: "A system prompt instruction: \"Never modify files\".",
      b: "`permissionMode: \"acceptEdits\"`.",
      c: "`allowedTools: [\"Read\", \"Grep\", \"Glob\"]` and `disallowedTools: [\"Write\", \"Edit\", \"Bash\"]`.",
      d: "`bypassPermissions` and checking the diff after the run.",
    },
    whyWrong: {
      a: "A prompt is not a technical control, and prompt injection is exactly what gets around it.",
      b: "This mode does the opposite: it auto-approves edits.",
      d: "Checking after the fact does not prevent a malicious command, and `bypassPermissions` removes every permission prompt.",
    },
    explanation:
      "The permission boundary is set by tool configuration: allowed read tools run without prompts, and disallowed ones are rejected no matter what the context says.",
  },
  "dm-2-q9": {
    prompt: "Options: `permissionMode: \"bypassPermissions\"`, `allowedTools: [\"Read\"]`. Can the agent run `Bash`?",
    choices: {
      a: "No: `allowedTools` is an allowlist, and everything else is denied.",
      b: "Yes: `allowedTools` only pre-approves what it lists, and the mode approves the rest; denials are set with `disallowedTools`.",
      c: "Only after confirmation through `canUseTool`.",
      d: "No: in `bypassPermissions` only tools from `allowedTools` work.",
    },
    whyWrong: {
      a: "`allowedTools` only pre-approves what is listed; it is not a restriction.",
      c: "`bypassPermissions` has no permission prompts, so `canUseTool` is never called.",
      d: "The opposite: `bypassPermissions` approves everything not explicitly denied.",
    },
    explanation:
      "`allowedTools` and `disallowedTools` are asymmetric: the first merely lets calls through without asking, the second actually forbids them. Under `bypassPermissions` anything not explicitly denied runs.",
  },
  "dm-2-q10": {
    prompt: "Which fields can you set for a subagent in the `agents` option?",
    choices: {
      a: "`description` — when the main agent should delegate.",
      b: "`apiKey` — a separate API key for the subagent.",
      c: "`prompt` — the subagent's system prompt.",
      d: "`tools` — a restricted tool set.",
      e: "`model` — the model for the subagent.",
    },
    whyWrong: {
      b: "Subagents run within the same process and credentials; there is no separate key here.",
    },
    explanation:
      "A subagent definition is a routing description, its own prompt, a narrowed tool set and optionally a different model. Everything else (credentials, working directory) it inherits from the run.",
  },
  "dm-2-q11": {
    prompt: "A `log-analyst` subagent is defined, but the main agent never delegates to it. What do you check first?",
    choices: {
      a: "Whether the subagent has a `model` set.",
      b: "Whether `maxTurns` is large enough.",
      c: "The `description`: that is what the main agent uses to decide whom to delegate to and when.",
      d: "Whether `forkSession` is enabled.",
    },
    whyWrong: {
      a: "The subagent's model affects how it works, not whether it gets called.",
      b: "A turn limit does not prevent delegation from the very first turn.",
      d: "Session forking has nothing to do with delegating to subagents.",
    },
    explanation:
      "A subagent's `description` works like a tool description: the model reads it to decide whether the task fits. A specific description such as \"analyses logs and returns a short error report\" works better than a generic one.",
  },
  "dm-2-q12": {
    scenario:
      "An agent investigating an incident reads 200 log files. Halfway through, the main agent's context is clogged with raw logs and it forgets the original task.",
    prompt: "What is the best solution in the Agent SDK?",
    choices: {
      a: "Define a subagent with read-only tools for log analysis: it works in its own context and returns only a short summary.",
      b: "Increase `maxTurns` so the agent can finish reading.",
      c: "Every 20 files, `resume` the same session.",
      d: "Switch to a model with a larger context window.",
    },
    whyWrong: {
      b: "More turns only add even more logs to the same context.",
      c: "`resume` restores the same history, logs and all.",
      d: "That postpones the problem: noise in the context still dilutes attention to the main task.",
    },
    explanation:
      "A subagent isolates the \"dirty\" work: all the raw data stays in its context, and the main agent gets only the result. The subagent's narrowed tools also limit what it can do.",
  },
  "dm-2-q13": {
    prompt: "Can a subagent defined in `agents` launch subagents of its own?",
    choices: {
      a: "Yes, with unlimited depth.",
      b: "Yes, but only down to the third nesting level.",
      c: "Only in `bypassPermissions` mode.",
      d: "No: subagents do not spawn their own subagents, so the delegation tool is not added to their `tools`.",
    },
    whyWrong: {
      a: "Nested delegation by subagents is not supported.",
      b: "There is no such depth limit, because there is no nesting at all.",
      c: "The permission mode does not change the fact that subagents cannot delegate.",
    },
    explanation:
      "Delegation goes one level deep: the main agent distributes the work, and subagents do it and return a result. Multi-level orchestration is built in the main agent or in your own code.",
  },
  "dm-2-q14": {
    scenario:
      "A custom `create_invoice` tool in `createSdkMcpServer` calls a payments API. When the API returns 422 for an invalid IBAN, the handler currently returns `{ content: [{ type: \"text\", text: \"OK\" }] }`, because \"the main thing is not to break the agent\".",
    prompt: "What should the handler return in this case?",
    choices: {
      a: "The same \"OK\", and write the error to the log.",
      b: "Throw an exception to stop the whole `query()`.",
      c: "`isError: true` and text saying the IBAN is invalid, what exactly is wrong and what is needed from the user.",
      d: "An empty `content`.",
    },
    whyWrong: {
      a: "The model will believe the invoice was created and tell the user something false.",
      b: "One invalid operation is no reason to abort the run; the agent can fix the data and try again.",
      d: "An empty response does not explain what happened and invites a retry.",
    },
    explanation:
      "SDK custom tools return results in MCP format, so errors are flagged with `isError: true`. The model sees the cause and can ask the user to fix the data instead of reporting a made-up success.",
  },
  "dm-2-q15": {
    prompt: "What can a `PreToolUse` hook in the SDK do through `hookSpecificOutput`?",
    choices: {
      a: "Deny the call (`permissionDecision: \"deny\"`) with an explanation for the model.",
      b: "Replace the result text of a tool that has already run.",
      c: "Modify the call's arguments via `updatedInput`.",
      d: "Approve the call without a permission prompt (`permissionDecision: \"allow\"`).",
    },
    whyWrong: {
      b: "At `PreToolUse` the tool has not run yet; there is no result.",
    },
    explanation:
      "`PreToolUse` is the decision point before execution: allow, deny, hand over to the normal prompt, or fix the input. Working with a result that already exists is `PostToolUse`'s job.",
  },
  "dm-2-q16": {
    prompt: "What does `permissionMode: \"acceptEdits\"` change?",
    choices: {
      a: "It approves every tool without exception.",
      b: "It allows only reading and forbids edits.",
      c: "It accepts changes only after showing the diff to the user.",
      d: "It auto-approves file edits and basic filesystem operations; other tools, such as arbitrary `Bash`, go through the normal check.",
    },
    whyWrong: {
      a: "That is `bypassPermissions` behaviour, not `acceptEdits`.",
      b: "The opposite: the mode automatically accepts edits.",
      c: "The mode adds no diff display: edits are approved automatically.",
    },
    explanation:
      "`acceptEdits` is handy when file changes are tracked in git and easy to revert. Commands with side effects outside the files do not get automatic approval from this mode.",
  },

  // ── dm-3: An MCP server from scratch (extra pool) ───────────────────────
  "dm-3-q8": {
    prompt: "Put the steps of creating an MCP server in TypeScript and connecting it to Claude Code in order.",
    choices: {
      a: "Register tools with `server.registerTool(...)`.",
      b: "Install `@modelcontextprotocol/sdk` and `zod`.",
      c: "Add the server to Claude Code (`claude mcp add` or `.mcp.json`).",
      d: "Create `new McpServer({ name, version })`.",
      e: "Connect the transport: `await server.connect(new StdioServerTransport())`.",
    },
    explanation:
      "Tools are registered before the transport is connected, so the client gets the full list in `tools/list` straight away. Registering in the client is the last step, once the server starts without errors.",
  },
  "dm-3-q9": {
    prompt: "What do you pass as `inputSchema` to `registerTool` in the TypeScript SDK, and what does the SDK do with it?",
    choices: {
      a: "A zod schema of the fields; the SDK turns it into JSON Schema for `tools/list` and validates arguments before calling the handler.",
      b: "A TypeScript interface; the SDK reads it at runtime.",
      c: "A JSON Schema string; the SDK passes it to the client unchanged.",
      d: "Nothing: the schema is optional, and it is better to check arguments by hand in the handler.",
    },
    whyWrong: {
      b: "TypeScript types are erased at compile time; they do not exist at runtime.",
      c: "The SDK expects a zod schema, not a raw string, and generates the JSON Schema itself.",
      d: "Without a schema the model does not know which arguments to pass, and the client cannot validate them.",
    },
    explanation:
      "One zod schema provides the contract for the model (JSON Schema in `tools/list`), input validation and argument types in the handler. Methods such as `.describe()` add field descriptions to the schema.",
  },
  "dm-3-q10": {
    scenario:
      "The `search_orders` tool takes `from` and `to` as strings. The model often passes \"yesterday\" or \"03/04/2026\", the handler throws while parsing, and the agent tries variants at random.",
    prompt: "What do you change on the server side?",
    choices: {
      a: "Rename the tool to `search_orders_iso`.",
      b: "Describe the format in the schema (`.describe(\"Date in YYYY-MM-DD format\")`), validate it and return `isError` with an example of a correct value.",
      c: "Remove the date filters so the model cannot get them wrong.",
      d: "Parse any date format with heuristics.",
    },
    whyWrong: {
      a: "A name conveys the field format far less reliably than the schema and description.",
      c: "That loses needed functionality instead of making it understandable.",
      d: "\"03/04/2026\" is ambiguous; guessing the format produces silent wrong results.",
    },
    explanation:
      "A field description in the schema is the cheapest way to teach the model a format, and a clear error with an example fixes the occasional miss on the first retry.",
  },
  "dm-3-q11": {
    prompt: "What is true about tool annotations (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`)?",
    choices: {
      a: "`readOnlyHint: true` signals that the tool does not modify its environment.",
      b: "The server uses them to technically prevent a tool from writing.",
      c: "A client may use them, for example to decide whether to ask for confirmation.",
      d: "A client should not trust annotations from untrusted servers.",
    },
    whyWrong: {
      b: "Annotations are just metadata; what the handler does is determined by code, not by a hint.",
    },
    explanation:
      "Annotations are hints for the client's UX and policies. Because a server can write anything in them, security decisions rest on trust in the server, not on the annotations themselves.",
  },
  "dm-3-q12": {
    scenario:
      "The `export_customers` tool returns the whole customers table: several megabytes of JSON. Claude Code warns about an oversized tool output, and after the call the agent loses track of the task.",
    prompt: "How do you rework the tool?",
    choices: {
      a: "Compress the JSON and return it as base64.",
      b: "Add filters, `limit` and pagination, return only the needed fields, and for a full export return a link to a resource.",
      c: "Leave it and raise the output limit in the client.",
      d: "Split the output into many text blocks in the same result.",
    },
    whyWrong: {
      a: "The model will not decode base64, and the token count will not drop meaningfully.",
      c: "A higher limit just lets more noise into the context.",
      d: "The volume in context does not change: every block still reaches the model.",
    },
    explanation:
      "A tool result becomes part of the model's context. Narrow, paginated output leaves the agent room to think, and large artefacts are better returned as a `resource_link` or a file.",
  },
  "dm-3-q13": {
    prompt: "Why does a server declare `capabilities: { tools: { listChanged: true } }`?",
    choices: {
      a: "So the client caches the tool list forever.",
      b: "To allow the client to add its own tools to the server.",
      c: "To send `notifications/tools/list_changed` when the tool set changes, after which the client requests `tools/list` again.",
      d: "To enable versioning of tool schemas.",
    },
    whyWrong: {
      a: "The opposite: the flag means the list can change.",
      b: "Clients do not register tools on the server; the server defines the set.",
      d: "The protocol has no schema versioning; the flag is only about list-change notifications.",
    },
    explanation:
      "Dynamic servers (for example, with tools that depend on the user's permissions) declare `listChanged` and send the notification. The client refreshes its list without dropping the connection.",
  },
  "dm-3-q14": {
    scenario:
      "A local stdio server for Jira needs an API token. A developer suggests adding an `api_token` parameter to the `create_issue` tool so the model passes it from the prompt.",
    prompt: "How should the secret be passed to the server?",
    choices: {
      a: "As an environment variable in the client configuration (`env` in `.mcp.json` or `claude mcp add --env`), which the server reads at startup.",
      b: "As an `api_token` parameter, as suggested.",
      c: "Hard-code it in the server source.",
      d: "Put it in the tool description.",
    },
    whyWrong: {
      b: "The secret would pass through the model's context, logs and session history, and the model has to get it from somewhere.",
      c: "The secret ends up in the repository and is shared by every user.",
      d: "The description is sent to the model on every request; that is simply leaking the secret into the context.",
    },
    explanation:
      "A stdio server gets credentials from the environment the client sets when launching it. The model never sees the secret, and `.mcp.json` can reference environment variables instead of literal values.",
  },
  "dm-3-q15": {
    prompt: "A tool indexes a repository for several minutes. How does it report progress to the client according to the protocol?",
    choices: {
      a: "Print percentages to stdout.",
      b: "Return several results for one `tools/call`.",
      c: "Ask the model to call the tool again to check the status.",
      d: "If the request carries a `progressToken` in `_meta`, send `notifications/progress` with that token.",
    },
    whyWrong: {
      a: "stdout is the JSON-RPC channel; arbitrary output breaks the protocol.",
      b: "One request gets one response; intermediate states are sent as notifications.",
      c: "That is a possible design for very long tasks, but not the protocol's progress mechanism.",
    },
    explanation:
      "A client that wants progress adds a `progressToken` to the request. The server sends `notifications/progress` with `progress` and optionally `total` and `message`, followed by the normal response.",
  },
  "dm-3-q16": {
    prompt: "How do a tool's `name` and `title` differ in MCP?",
    choices: {
      a: "They are synonyms; the client shows whichever is set.",
      b: "`title` is the identifier for `tools/call`, `name` is the UI label.",
      c: "`name` is the programmatic identifier for `tools/call`; `title` is a human-readable display name.",
      d: "`title` is sent to the model instead of `description`.",
    },
    whyWrong: {
      a: "They serve different purposes: an identifier and a label for humans.",
      b: "The other way round: calls use `name`.",
      d: "The description stays in `description`; `title` is just a UI label.",
    },
    explanation:
      "`name` must be stable: calls, permission rules and names like `mcp__server__name` depend on it. `title` can change freely; it is display only.",
  },

  // ── dm-4: Transports, resources, prompts (extra pool) ───────────────────
  "dm-4-q8": {
    scenario:
      "A developer runs a Streamable HTTP MCP server for local work: `0.0.0.0:8080`, no authentication. A security audit flagged a DNS rebinding risk: a malicious website in the browser could send requests to this server.",
    prompt: "What do you fix?",
    choices: {
      a: "Enable HTTPS with a self-signed certificate.",
      b: "Add the CORS header `Access-Control-Allow-Origin: *`.",
      c: "Rate-limit requests.",
      d: "Validate the `Origin` header, listen only on `127.0.0.1` and add authentication.",
    },
    whyWrong: {
      a: "Encrypting the channel does not stop the victim's browser from sending requests to the local server.",
      b: "That explicitly allows requests from any website.",
      c: "Rate limiting shrinks the attack but does not block it.",
    },
    explanation:
      "The spec requires Streamable HTTP servers to validate `Origin` and advises local servers to bind to localhost only. Together with authentication this shuts out browser pages.",
  },
  "dm-4-q9": {
    scenario:
      "A remote MCP server with OAuth provides GitHub tools. To avoid setting up separate authentication, the developer forwards to the GitHub API the same bearer token the client sent to the MCP server.",
    prompt: "What is wrong here?",
    choices: {
      a: "This is token passthrough: the token was issued for the MCP server (its audience), and the server must obtain a separate token for the upstream API.",
      b: "Nothing, as long as the connection uses HTTPS.",
      c: "The token should be passed in tool arguments, not in a header.",
      d: "It just needs a refresh token added.",
    },
    whyWrong: {
      b: "HTTPS protects the channel but does not fix using the token for something it was not issued for.",
      c: "That is even worse: the secret would end up in the model's context.",
      d: "Refreshing the token does not change the fact that it is used for someone else's resource.",
    },
    explanation:
      "The MCP spec forbids accepting tokens not issued for this server and forwarding client tokens onwards. The server validates its token's audience and uses separate credentials for upstream APIs.",
  },
  "dm-4-q10": {
    prompt: "How does a local stdio MCP server authenticate according to the spec?",
    choices: {
      a: "It runs a full OAuth 2.1 flow with PKCE on every launch.",
      b: "It gets a token from the model in the first tool call.",
      c: "It takes credentials from the environment the client sets when launching the process.",
      d: "It doesn't: stdio servers cannot call protected APIs.",
    },
    whyWrong: {
      a: "The MCP authorization spec targets the HTTP transport; stdio servers are advised not to follow it.",
      b: "The model should never see or pass secrets.",
      d: "They can; the credentials just arrive through environment variables or local configuration.",
    },
    explanation:
      "With stdio, the client launches the server process itself, so the natural place for credentials is the process environment. The MCP OAuth flow is meant for remote HTTP servers.",
  },
  "dm-4-q11": {
    prompt: "Put the messages at the start of an MCP connection in the correct order.",
    choices: {
      a: "The client sends `notifications/initialized`.",
      b: "The client calls `tools/call`.",
      c: "The client sends `initialize` with `protocolVersion`, `capabilities` and `clientInfo`.",
      d: "The client requests `tools/list`.",
      e: "The server responds with its `capabilities`, `serverInfo` and protocol version.",
    },
    explanation:
      "Initialisation negotiates the protocol version and each side's capabilities. Only after `notifications/initialized` does normal operation begin: first the client discovers the tools, then it calls them.",
  },
  "dm-4-q12": {
    prompt: "Which `.mcp.json` entry connects a remote server over Streamable HTTP?",
    choices: {
      a: "`{ \"tickets\": { \"type\": \"stdio\", \"url\": \"https://mcp.example.com/mcp\" } }`",
      b: "`{ \"tickets\": { \"command\": \"https://mcp.example.com/mcp\" } }`",
      c: "`{ \"tickets\": { \"type\": \"sse\", \"url\": \"https://mcp.example.com/mcp\" } }`",
      d: "`{ \"tickets\": { \"type\": \"http\", \"url\": \"https://mcp.example.com/mcp\" } }`",
    },
    whyWrong: {
      a: "stdio launches a local process from `command`; a `url` field does not apply to it.",
      b: "`command` is the executable for stdio; a URL will not work there.",
      c: "`sse` is the legacy HTTP+SSE transport; Streamable HTTP uses the `http` type.",
    },
    explanation:
      "`mcpServers` entries come in two main shapes: stdio (`command`, `args`, `env`) and remote (`type: \"http\"`, `url`, optionally `headers`). The `sse` type remains for older servers.",
  },
  "dm-4-q13": {
    prompt: "A client wants to know when the contents of the `config://app` resource change. How does this work in MCP?",
    choices: {
      a: "The client calls `tools/call` every few seconds.",
      b: "The client sends `resources/subscribe`, the server sends `notifications/resources/updated`, and the client re-reads the resource with `resources/read`.",
      c: "The server sends the new contents right in the notification body.",
      d: "The server sends `notifications/resources/list_changed`.",
    },
    whyWrong: {
      a: "Resources are not read through tools, and polling wastes resources.",
      c: "The notification carries only the URI; the client fetches the contents separately.",
      d: "That notification is about changes to the list of resources, not the contents of a specific one.",
    },
    explanation:
      "Subscriptions work if the server declared `resources.subscribe`. The notification only signals a change, and the client gets the fresh data with an ordinary read.",
  },
  "dm-4-q14": {
    prompt: "What is true about the `Mcp-Session-Id` header in Streamable HTTP?",
    choices: {
      a: "It replaces the authorization token.",
      b: "The server may issue it in the response to `initialize`.",
      c: "The client includes it in every subsequent HTTP request of that session.",
      d: "If the server answers 404 to a request with this id, the client must start a new session with a fresh `initialize`.",
    },
    whyWrong: {
      a: "A session id is not proof of identity; authorization uses a separate bearer token.",
    },
    explanation:
      "A session is a state mechanism, not a security one. The server may end it at any time, and a 404 on a request carrying `Mcp-Session-Id` means the client must initialise again.",
  },
  "dm-4-q15": {
    prompt: "While handling a POST with `tools/call`, a Streamable HTTP server wants to send several `notifications/progress` first and then the result. How?",
    choices: {
      a: "Respond with `Content-Type: text/event-stream` and send the notifications in the SSE stream, followed by the response to the request.",
      b: "Respond with a single JSON array containing the notifications and the result.",
      c: "Send the notifications as separate POST requests to the client.",
      d: "It is impossible: progress is only available over stdio.",
    },
    whyWrong: {
      b: "Then the client would not see any progress until the whole operation finishes.",
      c: "The client has no HTTP endpoint; the server talks to it through responses and SSE streams.",
      d: "Progress works on both transports; SSE is exactly what HTTP uses for it.",
    },
    explanation:
      "For a POST carrying a request, the server chooses the response format: `application/json` for a single message, or SSE to send several messages, the last of which is the response itself.",
  },
  "dm-4-q16": {
    scenario:
      "A team wants developers in Claude Code to be able to run a standardised PR review flow: the user chooses the moment and gives the PR number, and the server fills in the team's checklist and context.",
    prompt: "Which primitive, and how do you implement it?",
    choices: {
      a: "A `review_pr` tool so the model decides when to call it.",
      b: "A `review://checklist` resource that the user copies into the chat.",
      c: "A prompt via `registerPrompt` with a `pr_number` argument that returns `messages` with the checklist and context.",
      d: "A long checklist in the `description` of one of the tools.",
    },
    whyWrong: {
      a: "The initiator here is the user, not the model; a tool is invoked on the model's initiative.",
      b: "A resource returns data but takes no invocation arguments and produces no ready-made messages.",
      d: "That bloats every request with the checklist and gives the user no explicit trigger.",
    },
    explanation:
      "Prompts are templates the user invokes explicitly. Claude Code shows it as a slash command, asks for the arguments, and the server returns ready-made messages.",
  },

  // ── dm-5: Testing and debugging MCP (extra pool) ────────────────────────
  "dm-5-q8": {
    scenario:
      "An MCP server loads a large search index at startup, which takes about 40 seconds. Claude Code marks the server as failed to connect, even though a minute later the process is running fine.",
    prompt: "What do you do?",
    choices: {
      a: "Answer `initialize` right away and load the index lazily or in the background; if needed, raise the startup timeout with `MCP_TIMEOUT`.",
      b: "Run the server through the MCP Inspector, which has no timeout.",
      c: "Move the index loading into the tool description.",
      d: "Increase `max_tokens` in the model settings.",
    },
    whyWrong: {
      b: "The Inspector is a debugging tool, not a way to connect a server to Claude Code.",
      c: "A description is static text for the model and has no effect on startup time.",
      d: "The response token limit has nothing to do with starting an MCP server.",
    },
    explanation:
      "The client waits a limited time for initialisation to finish. A fast handshake with deferred loading of heavy resources is the more reliable fix; `MCP_TIMEOUT` only widens the margin.",
  },
  "dm-5-q9": {
    prompt: "A new MCP server does not work for the agent. Put the checks in bottom-up order, from the process to the agent's behaviour.",
    choices: {
      a: "In the Inspector, call the tool with test arguments.",
      b: "Connect the server in Claude Code and check its status with `/mcp`.",
      c: "Run the server command by hand and make sure it starts without errors on stderr.",
      d: "Ask the agent to do a real task that needs the tool.",
      e: "In the MCP Inspector, check that `tools/list` returns the tool with the correct schema.",
    },
    explanation:
      "Each level checks one thing: the process, the contract, the handler, the client integration, and only then the model's behaviour. That way a failure is immediately pinned to a specific layer.",
  },
  "dm-5-q10": {
    prompt: "How can an MCP server send structured logs to the client through the protocol itself?",
    choices: {
      a: "Append logs to the result text of every tool.",
      b: "Write them to stdout alongside JSON-RPC.",
      c: "Declare the `logging` capability and send `notifications/message` with a level; the client can change the threshold via `logging/setLevel`.",
      d: "Open a separate HTTP endpoint for logs that the client polls.",
    },
    whyWrong: {
      a: "Logs would clutter the model's context and mix with the data.",
      b: "Over stdio this breaks the protocol.",
      d: "The protocol has no such thing; the client would know nothing about your endpoint.",
    },
    explanation:
      "Logging in MCP is a separate notification channel with levels such as `debug`, `info` and `error`. The client decides what to do with them, and they never reach the model.",
  },
  "dm-5-q11": {
    prompt: "A server is listed in `.mcp.json`, but its tools are missing. What are the likely causes?",
    choices: {
      a: "The server crashes at startup, for example because of a missing environment variable.",
      b: "The tools have `readOnlyHint: false`.",
      c: "`command` or `args` contains a relative path that does not resolve from the client's working directory.",
      d: "The server writes debug output to stdout and breaks the handshake.",
    },
    whyWrong: {
      b: "Annotations do not hide tools; they are just metadata for the client.",
    },
    explanation:
      "The most common causes are the environment (path, runtime, variables) and a polluted stdout. They show up in `/mcp`, in `claude --debug`, and when running the server command by hand.",
  },
  "dm-5-q12": {
    prompt: "After a refactor the `tools/list` snapshot test fails: only the `description` text of one tool changed. How should you treat it?",
    choices: {
      a: "Remove descriptions from the snapshot: they do not affect behaviour.",
      b: "Update the snapshot automatically on every test run.",
      c: "Delete the test, since descriptions change often.",
      d: "Review the change deliberately: the description is part of the model's prompt, so the snapshot is updated explicitly after review, with an eval run if needed.",
    },
    whyWrong: {
      a: "The description directly affects when and how the model calls the tool.",
      b: "Then the test catches nothing: any change slips through unnoticed.",
      c: "Frequent contract changes are exactly why you want the test.",
    },
    explanation:
      "Descriptions and schemas are both an API and a prompt. A snapshot makes every change to them visible in review, and an eval shows whether the agent's behaviour has degraded.",
  },
  "dm-5-q13": {
    scenario:
      "The `fetch_report` tool calls a slow external service that sometimes \"hangs\" for several minutes. The client aborts the request on timeout, but the handler keeps running, and the agent gets a vague error and repeats the call.",
    prompt: "How do you fix the server?",
    choices: {
      a: "Ask the client to disable timeouts.",
      b: "Its own timeout on the upstream call, `isError` with an explanation and advice, and handling request cancellation (`notifications/cancelled`) by aborting the work.",
      c: "Retry the service call in an infinite loop until it succeeds.",
      d: "Return an empty successful result if the service does not respond within 10 seconds.",
    },
    whyWrong: {
      a: "The agent would stall for minutes, and the service hangs would not go away.",
      c: "The call just hangs longer and loads a service that is already struggling.",
      d: "The model will think the report is empty and draw wrong conclusions.",
    },
    explanation:
      "A server must keep its dependencies in check: bound the time, report failures honestly, and stop working when the client cancels the request. Then the agent gets a clear error and no resources are wasted.",
  },
  "dm-5-q14": {
    prompt: "You need a quick CI check that the built server starts and returns its tool list. Does this option fit?",
    choices: {
      a: "No: the Inspector only works as a web UI.",
      b: "No: the check requires a running Claude Code.",
      c: "It only works for HTTP servers.",
      d: "Yes: the Inspector's CLI mode launches the server, completes initialisation and prints the `tools/list` result.",
    },
    whyWrong: {
      a: "The Inspector has a CLI mode precisely for scripts and CI.",
      b: "The Inspector is itself an MCP client; Claude Code is not needed.",
      c: "The example is stdio: the Inspector launches `node build/index.js` as a subprocess.",
    },
    explanation:
      "The Inspector's CLI mode is handy for smoke tests of a real stdio launch, which in-memory tests do not cover. Detailed contract checks are better kept in tests with an MCP client.",
  },
  "dm-5-q15": {
    prompt: "A client sent `initialize` with a protocol version the server does not support. What happens according to the spec?",
    choices: {
      a: "The server responds with another version it supports; if the client does not support that one, it should disconnect.",
      b: "The server silently works with its own version without telling the client.",
      c: "The server always accepts the client's version.",
      d: "The server returns HTTP 426 Upgrade Required.",
    },
    whyWrong: {
      b: "The version is returned explicitly in the `initialize` response so both sides know it.",
      c: "A server cannot \"accept\" a version it does not implement; that is what negotiation is for.",
      d: "Negotiation happens at the JSON-RPC level and is the same for every transport.",
    },
    explanation:
      "Version negotiation is part of `initialize`: the client proposes, and the server answers with the same or another supported version. Incompatibility surfaces before any useful work is done.",
  },
  "dm-5-q16": {
    prompt: "The server's contract tests are green. How do you check that the agent actually uses the new tool correctly?",
    choices: {
      a: "Contract tests are enough: if the contract is right, the model will do everything right.",
      b: "A set of eval scenarios run through the agent, checking tool calls and their arguments and the pass rate.",
      c: "Ask the agent once by hand and look at the answer.",
      d: "Mock the model in tests so it always calls the tool.",
    },
    whyWrong: {
      a: "The contract tests the server, not whether the model understands the description and picks the tool.",
      c: "Model behaviour is non-deterministic; a single run proves nothing.",
      d: "A mock tests your mock, not how the real model reads the description.",
    },
    explanation:
      "There are two layers of checks: deterministic contract tests of the server and statistical evals of the agent's behaviour. The latter shows whether the name, description and schema are clear enough.",
  },

  // ── dm-boss: an MCP-powered agent in production (extra pool) ────────────
  "dm-boss-q6": {
    scenario:
      "The `lookup_customer` tool is written as an in-process server via `createSdkMcpServer` inside an Agent SDK service. Now developers in Claude Code and another internal agent need the same tool.",
    prompt: "How should the code be organised?",
    choices: {
      a: "Copy the tool's code into every project.",
      b: "Expose a REST API and describe the tool again in every client.",
      c: "Keep the in-process server: Claude Code will connect to it via `mcpServers`.",
      d: "Move the tool into a standalone MCP server (stdio or HTTP) and connect it in all three places.",
    },
    whyWrong: {
      a: "Three copies will drift apart: every fix has to be made three times.",
      b: "The tool definition would have to be duplicated and kept in sync in every client.",
      c: "An in-process server lives inside your service's process; other clients cannot connect to it.",
    },
    explanation:
      "An in-process server is convenient while only one agent needs the tool. Once there are several consumers, a standalone MCP server gives one implementation that the SDK (via `mcpServers`), Claude Code and any other client can connect to.",
  },
  "dm-boss-q7": {
    scenario:
      "An Agent SDK chat service runs in several stateless containers that restart often. It stores each user's `session_id` in a database and passes it to `resume`, but after a restart or when landing on another container, resuming does not work.",
    prompt: "What is the cause?",
    choices: {
      a: "Session history is stored on the local disk of the process that created it; you need persistent shared storage for session files, user-to-instance affinity, or your own storage of conversation state.",
      b: "A `session_id` is only valid for a few minutes.",
      c: "You need to add `forkSession: true`.",
      d: "Sessions are stored on Anthropic's servers, and you must pass the API key they were created with.",
    },
    whyWrong: {
      b: "It is not about expiry: the new container simply does not have the session files.",
      c: "A fork also needs the original history, which the new container does not have.",
      d: "The Agent SDK stores sessions locally, not in the API.",
    },
    explanation:
      "The Agent SDK is a harness in your process, and its sessions live on your filesystem too. A stateless deployment must either keep those files on a persistent volume or manage conversation history itself.",
  },
  "dm-boss-q8": {
    scenario:
      "The logs show the agent calling `search_kb` 25–30 times per run with small variations of the query. On an empty search the server returns the successful text \"[]\", the agent hits `maxTurns`, and the run's cost grows tenfold.",
    prompt: "What do you change first?",
    choices: {
      a: "Throw an exception after the third empty search to stop the run.",
      b: "Return an informative response from the tool: what was searched, which filters exist, how to broaden the query, and that there are no results; keep `maxTurns` as a safety net.",
      c: "Increase `maxTurns` so the agent has time to find the answer.",
      d: "Remove `search_kb` so the agent answers from its own knowledge.",
    },
    whyWrong: {
      a: "An aborted run with no explanation helps neither the user nor the agent.",
      c: "More turns mean more of the same fruitless searches and a higher cost.",
      d: "The agent loses access to the knowledge base and starts making things up.",
    },
    explanation:
      "A bare \"[]\" gives the model no signal about what to change, so it keeps rephrasing. A result with hints lets it either adjust the search or honestly answer that there is no data.",
  },
  "dm-boss-q9": {
    scenario:
      "The main agent has the full tool set, including `Edit` and `Bash`. To review changes you add a `reviewer` subagent that should only read code and return comments.",
    prompt: "How do you restrict the subagent?",
    choices: {
      a: "Write \"read only\" in the subagent's `prompt`.",
      b: "Enable `permissionMode: \"plan\"` for the whole run.",
      c: "Nothing: subagents have only read tools by default.",
      d: "Set `tools: [\"Read\", \"Grep\", \"Glob\"]` in its definition.",
    },
    whyWrong: {
      a: "A prompt is not a technical boundary; with the full tool set the subagent can still edit.",
      b: "That would also block changes for the main agent, which needs them.",
      c: "Without a `tools` field, a subagent inherits the main agent's tools.",
    },
    explanation:
      "The `tools` field in a subagent definition narrows its tool set independently of the main agent. Without it, the subagent gets everything available in the run.",
  },
  "dm-boss-q10": {
    prompt: "Why is the token passed in the configuration's `headers` here rather than as a tool argument?",
    choices: {
      a: "Authentication at the transport level: the model neither sees nor passes the secret, so it never ends up in the context, session history or conversation logs.",
      b: "Tool arguments do not support strings longer than 64 characters.",
      c: "This way the model encrypts the token before sending it.",
      d: "Otherwise the tools would not get the `mcp__crm__` prefix.",
    },
    whyWrong: {
      b: "There is no such limit; the problem is precisely that arguments pass through the model.",
      c: "The model encrypts nothing and never sees headers at all.",
      d: "The prefix depends only on the server's key in `mcpServers`.",
    },
    explanation:
      "Secrets belong to the transport and configuration, while everything the model fills in is untrusted input visible in the context. A token from an environment variable never reaches the prompt or a `tool_use`.",
  },
  "dm-boss-q11": {
    scenario:
      "The contract tests for `update_order` are green, but in production the agent regularly sends `status: \"Closed\"` or `\"done\"`, while the server only accepts `closed`, `open` and `cancelled` and replies with a vague \"invalid status\".",
    prompt: "What is the most reliable fix?",
    choices: {
      a: "Add the list of valid statuses to the agent's system prompt.",
      b: "Normalise any string on the server with heuristics.",
      c: "Declare the field as an enum in the schema (`z.enum([\"open\", \"closed\", \"cancelled\"])`) and return `isError` listing the valid values.",
      d: "Add a test that the model passes the correct status.",
    },
    whyWrong: {
      a: "A prompt rule is detached from the schema and goes stale at the first server change.",
      b: "\"done\" could mean `closed` or something else; silent guessing produces wrong data.",
      d: "A test would record the problem but give the model no information to avoid it.",
    },
    explanation:
      "An enum in the schema appears in `tools/list`, so the model sees the valid values before calling. An error listing the values fixes the occasional miss on the first retry.",
  },
  "dm-boss-q12": {
    scenario:
      "An Agent SDK service is scaled to 20 replicas. Each one connects the order-database MCP server as a stdio process. The server holds a DB connection pool, and the DBAs complain about exhausted connections and no shared rate limit.",
    prompt: "What is the architectural solution?",
    choices: {
      a: "Shrink the pool size in each stdio process.",
      b: "Move the DB logic into in-process tools in every replica.",
      c: "Run the stdio server in only one replica.",
      d: "Deploy the MCP server as a separate Streamable HTTP service with authentication and a shared pool, and connect the replicas via `type: \"http\"`.",
    },
    whyWrong: {
      a: "That only softens the symptom: there is still no shared rate limit or central control.",
      b: "You would have just as many connections and scattered limits, and other clients could no longer use the server.",
      c: "The other 19 replicas would lose access to the tools.",
    },
    explanation:
      "stdio means one server process per client, so every replica has its own pool and its own limits. A single HTTP service concentrates connections, rate limiting and auditing in one place and scales independently of the agents.",
  },
};
