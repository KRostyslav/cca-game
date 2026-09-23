import type { QuestionEn } from "@/lib/content/types";

/** Англійський дубль питань цього домену: id питання → переклад. */
export const questionsEn: Record<string, QuestionEn> = {
  // ── Level 1: Agent SDK: your first agent ────────────────────────────────
  "dm-1-q1": {
    prompt: "What does `query()` from `@anthropic-ai/claude-agent-sdk` return?",
    choices: {
      a: "A `Promise<string>` with the agent's final answer text.",
      b: "An async iterator of messages that you consume with `for await`.",
      c: "A single `Message` object, like `messages.create()` in the Messages API.",
      d: "An `EventEmitter` you subscribe to with `.on(\"message\")`.",
    },
    whyWrong: {
      a: "An agent takes many steps; the SDK streams them as messages, and the final text lives in the `result` message.",
      c: "That is how the Messages API client behaves; `query()` runs a whole agent loop and streams every step of it.",
      d: "The SDK does not use Node's event model: messages are consumed as an async iterable.",
    },
    explanation:
      "`query()` starts the agent loop and yields an async stream of messages: `system`, `assistant`, `user` (tool results) and finally `result`. Your code consumes them with `for await` and decides what to log or display.",
  },
  "dm-1-q2": {
    prompt: "Which message in the stream carries the agent's final answer together with the run's cost and number of turns?",
    choices: {
      a: "`system` with `subtype: \"init\"`.",
      b: "The last `assistant` message.",
      c: "`result`, with the `result`, `total_cost_usd` and `num_turns` fields.",
      d: "The `user` message with the last `tool_result`.",
    },
    whyWrong: {
      a: "`init` arrives first: it has the `session_id`, the tool list and MCP server status, but no answer and no cost yet.",
      b: "An `assistant` message holds the content blocks of a single model turn; it has no aggregated run metrics.",
      d: "In the SDK stream, `user` messages carry tool results back to the model, not a summary of the run.",
    },
    explanation:
      "The `result` message closes every run. It contains the final text (for `subtype: \"success\"`), cost, turn count, duration, usage and `session_id` — everything worth logging.",
  },
  "dm-1-q3": {
    scenario:
      "A team is building an internal refactoring agent on the Agent SDK. They want Claude Code's behaviour (file handling, answer style, safe bash habits) plus a few company-specific rules. Right now `systemPrompt` is set to a string with the rules, and the agent does not behave \"like Claude Code\".",
    prompt: "How should the system prompt be set?",
    choices: {
      a: "Prepend the company rules to every `prompt`.",
      b: "Keep the string in `systemPrompt`: the SDK appends it to Claude Code's prompt automatically.",
      c: "Set `settingSources: [\"project\"]`; that enables Claude Code's system prompt.",
      d: "`systemPrompt: { type: \"preset\", preset: \"claude_code\", append: \"…rules…\" }`.",
    },
    whyWrong: {
      a: "This mixes instructions into the user's task and still does not bring back Claude Code's base prompt.",
      b: "A string replaces the system prompt entirely; nothing is appended automatically.",
      c: "`settingSources` controls loading settings and CLAUDE.md from the filesystem, not the system prompt preset.",
    },
    explanation:
      "By default the SDK does not use Claude Code's full prompt, and a string in `systemPrompt` replaces the prompt completely. The `claude_code` preset with `append` gives you Claude Code's baseline behaviour with your rules added at the end.",
  },
  "dm-1-q4": {
    prompt: "An Agent SDK agent works in a repository with a detailed `CLAUDE.md` but ignores the conventions it describes. What is the most likely cause?",
    choices: {
      a: "By default the SDK does not read settings from the filesystem; you need `settingSources: [\"project\"]`.",
      b: "`CLAUDE.md` is only read by the interactive CLI and is not supported in the SDK at all.",
      c: "The file is too large and the SDK truncates it.",
      d: "You must pass the contents of `CLAUDE.md` in every request's `prompt`.",
    },
    whyWrong: {
      b: "It is supported, but it has to be enabled explicitly through `settingSources`.",
      c: "Size is not the issue: the file is not loaded at all until the corresponding settings source is enabled.",
      d: "That is a workaround that duplicates an SDK mechanism and mixes instructions with the task.",
    },
    explanation:
      "The SDK is isolated from local settings so that server behaviour does not depend on stray files. `settingSources` enables sources explicitly: `project` reads the repository's `CLAUDE.md` and `.claude/settings.json`.",
  },
  "dm-1-q5": {
    prompt: "Which of these tools does an Agent SDK agent get built in, without any code of yours?",
    choices: {
      a: "`SendEmail`",
      b: "`Read`",
      c: "`Bash`",
      d: "`Grep`",
    },
    whyWrong: {
      a: "There is no such built-in tool; email integrations are added as a custom tool or an MCP server.",
    },
    explanation:
      "The Agent SDK ships Claude Code's tool set: `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`, `WebSearch`, `WebFetch` and more. Anything specific to your domain is added through custom tools or MCP.",
  },
  "dm-1-q6": {
    prompt: "A backend serves many users. How do you continue a specific user's earlier conversation with the agent?",
    choices: {
      a: "Concatenate all earlier messages into one string and pass it as `prompt`.",
      b: "Pass `continue: true`.",
      c: "Pass `forkSession: true` with no other options.",
      d: "Store the `session_id` from the `init` message and pass it as `resume` in the next `query()`.",
    },
    whyWrong: {
      a: "The SDK already stores session history; manual concatenation loses the structure of tool calls and wastes tokens.",
      b: "`continue` picks up the most recent session in the working directory, not a particular user's session.",
      c: "`forkSession` only changes how a session is resumed; without `resume` there is nothing to branch from.",
    },
    explanation:
      "Every run gets a `session_id`, delivered in the first `system` message. Store it alongside the user and pass it to `resume` so the agent continues with full context, including tool results.",
  },
  "dm-1-q7": {
    prompt: "Put the events of a single `query()` run in the order your code will see them.",
    choices: {
      a: "The SDK checks permission, runs the tool and returns a `tool_result` in a `user` message.",
      b: "`result` with the summary, cost and `num_turns`.",
      c: "`system` with `subtype: \"init\"`: `session_id`, tools, MCP servers.",
      d: "`assistant` with a `tool_use` block.",
      e: "`assistant` with final text and no tool calls.",
    },
    explanation:
      "First `init` describes the run's environment, then come model turns and tool results until the model answers without `tool_use`. `result` always arrives last.",
  },

  // ── Level 2: Tools and permissions in the SDK ───────────────────────────
  "dm-2-q1": {
    prompt: "You added an in-process MCP server `weather` with a `get_forecast` tool. What tool name goes into `allowedTools`?",
    choices: {
      a: "`get_forecast`",
      b: "`weather.get_forecast`",
      c: "`mcp__weather__get_forecast`",
      d: "`mcp:weather/get_forecast`",
    },
    whyWrong: {
      a: "MCP server tools get a prefix with the server name so that tools from different servers do not collide.",
      b: "The separator is not a dot: the SDK uses the `mcp__<server>__<tool>` format.",
      d: "The SDK has no such format; a wrong name simply matches no tool.",
    },
    explanation:
      "All MCP tools in the Agent SDK and Claude Code are named `mcp__<server>__<tool>`, where `<server>` is the key in `mcpServers`. The tool appears under this same name in `init` and in `tool_use`.",
  },
  "dm-2-q2": {
    prompt: "How do you make this tool available to the agent?",
    choices: {
      a: "Pass `mcpServers: { weather }` in the `query()` options and allow `mcp__weather__get_forecast`.",
      b: "Run `weather` as a separate process and register it with `claude mcp add`.",
      c: "Pass `getForecast` directly in the request's `tools` field, as in the Messages API.",
      d: "Nothing: `createSdkMcpServer` registers the server globally for every `query()`.",
    },
    whyWrong: {
      b: "`createSdkMcpServer` runs in the same process as your code; no separate process or CLI registration is needed.",
      c: "Custom tools in the Agent SDK are wired in through an MCP server in `mcpServers`, not as raw Messages API definitions.",
      d: "There is no global registration: each run only gets the servers in its own options.",
    },
    explanation:
      "`tool()` defines a tool with a zod schema, and `createSdkMcpServer` wraps it in an in-process MCP server. The server is passed in `mcpServers` under a key that becomes part of the name `mcp__weather__get_forecast`.",
  },
  "dm-2-q3": {
    prompt: "Which values are valid for `permissionMode` in the Agent SDK?",
    choices: {
      a: "`readOnly`",
      b: "`acceptEdits`",
      c: "`plan`",
      d: "`bypassPermissions`",
    },
    whyWrong: {
      a: "There is no such mode; a read-only agent is configured through its allowed and disallowed tools.",
    },
    explanation:
      "The core modes are `default` (normal checks), `acceptEdits` (auto-approves file edits), `plan` (planning only, no changes) and `bypassPermissions` (skips permission prompts). A mode sets default behaviour, not the list of tools.",
  },
  "dm-2-q4": {
    scenario:
      "An Agent SDK agent is embedded in a web app. Before every `Bash` command the user must see an \"Allow?\" dialog, and file paths in commands must be normalised to the user's working directory.",
    prompt: "Which SDK mechanism is designed for this?",
    choices: {
      a: "`permissionMode: \"acceptEdits\"`.",
      b: "A `PostToolUse` hook on `Bash`.",
      c: "A `canUseTool` callback returning `{ behavior: \"allow\", updatedInput }` or `{ behavior: \"deny\", message }`.",
      d: "A system prompt instruction to ask the user before every command.",
    },
    whyWrong: {
      a: "This mode auto-approves file edits and shows the user no dialog at all.",
      b: "`PostToolUse` fires after execution: too late to ask for permission.",
      d: "A prompt is not a technical control: the model may not follow it, and no real dialog appears in the UI.",
    },
    explanation:
      "`canUseTool` is called when a tool's permission is not settled by rules or mode. There you can show a dialog, wait for the decision and return `allow` with a modified `updatedInput`, or `deny` with an explanation for the model.",
  },
  "dm-2-q5": {
    prompt: "How do you register this hook so it only fires before `Bash` calls?",
    choices: {
      a: "`hooks: { Bash: [blockRmRf] }`",
      b: "`hooks: { PreToolUse: [{ matcher: \"Bash\", hooks: [blockRmRf] }] }`",
      c: "`hooks: { PostToolUse: [{ matcher: \"Bash\", hooks: [blockRmRf] }] }`",
      d: "`canUseTool: blockRmRf`",
    },
    whyWrong: {
      a: "The keys of `hooks` are event names (`PreToolUse`, `PostToolUse`…), not tool names.",
      c: "After execution the command can no longer be blocked, and the `hookEventName` in the output would not match the event.",
      d: "`canUseTool` has a different signature and output format (`behavior: \"allow\" | \"deny\"`), not `hookSpecificOutput`.",
    },
    explanation:
      "SDK hooks are grouped by event and, within an event, by a `matcher` with the tool name. You can only block what has not happened yet, so a denial needs `PreToolUse` with `permissionDecision: \"deny\"`.",
  },
  "dm-2-q6": {
    prompt: "A `PreToolUse` hook returned `permissionDecision: \"deny\"` with a reason. What happens next?",
    choices: {
      a: "`query()` throws and the whole run fails.",
      b: "The tool is silently skipped and the model learns nothing.",
      c: "The session ends and can no longer be resumed with `resume`.",
      d: "The tool does not run; the model receives the reason for the denial and can choose another path.",
    },
    whyWrong: {
      a: "Denying a single call is a normal situation, not a run failure.",
      b: "A silent skip would make the model retry the same thing; that is why the reason is returned to it.",
      c: "The session stays intact; the denial affects only one call.",
    },
    explanation:
      "`permissionDecisionReason` reaches the model as the result of the blocked call. It is both a denial and feedback: the agent keeps working, knowing why the action was rejected.",
  },
  "dm-2-q7": {
    prompt: "Put the stages of handling a single tool call in the Agent SDK in order.",
    choices: {
      a: "Permission check: rules, mode, and `canUseTool` if needed.",
      b: "The model returns a `tool_use` block.",
      c: "The `PostToolUse` hook fires.",
      d: "The `PreToolUse` hook fires.",
      e: "The tool executes.",
      f: "The `tool_result` goes back to the model.",
    },
    explanation:
      "Hooks come first in the permission chain and `canUseTool` last, when nothing else has decided. `PostToolUse` sees the finished result before it is sent to the model.",
  },

  // ── Level 3: An MCP server from scratch ─────────────────────────────────
  "dm-3-q1": {
    prompt: "Which high-level API of the official Python MCP SDK lets you write a server with a few decorators?",
    choices: {
      a: "`Flask` with an `/mcp` route.",
      b: "`anthropic.Anthropic().tools`.",
      c: "`claude_agent_sdk.create_sdk_mcp_server` run as a separate process.",
      d: "`FastMCP` from `mcp.server.fastmcp`.",
    },
    whyWrong: {
      a: "Flask is a web framework; you would have to implement the MCP protocol (JSON-RPC, lifecycle, schemas) by hand.",
      b: "The Messages API client does not create MCP servers; it is the other side of the integration.",
      c: "That is an in-process server for an Agent SDK agent, not a standalone MCP server for any client.",
    },
    explanation:
      "`FastMCP` from the `mcp` package handles the protocol for you: the `@mcp.tool()`, `@mcp.resource()` and `@mcp.prompt()` decorators register primitives, and `mcp.run()` starts the transport.",
  },
  "dm-3-q2": {
    prompt: "Where does the client get the input schema and description of the `get_forecast` tool from?",
    choices: {
      a: "FastMCP generates a JSON Schema from the type hints and takes the description from the docstring.",
      b: "Nowhere: the schema must be passed manually via `@mcp.tool(schema=...)`.",
      c: "The client guesses the parameters from the function name on the first call.",
      d: "From code comments that FastMCP parses at startup.",
    },
    whyWrong: {
      b: "FastMCP deliberately derives the schema from the function signature; a hand-written schema is unnecessary here.",
      c: "The client receives the exact schema via `tools/list` before any call.",
      d: "Type hints and the docstring are used, not arbitrary comments.",
    },
    explanation:
      "The function signature becomes the `inputSchema` (`latitude: number`, `longitude: number`, both required) and the docstring becomes the `description`. That is why type hints and docstrings in FastMCP are part of your contract with the model.",
  },
  "dm-3-q3": {
    prompt: "What is missing for this server to work as a local stdio server?",
    choices: {
      a: "`server.listen(3000)`",
      b: "`await server.connect(new StdioServerTransport())`",
      c: "Nothing: `McpServer` starts automatically once the first tool is registered.",
      d: "`export default server` so the client can import the module.",
    },
    whyWrong: {
      a: "A stdio server does not listen on a port: it talks to the client over stdin/stdout.",
      c: "Without a connected transport the server never receives a single message.",
      d: "The client does not import the server: it launches it as a subprocess and exchanges JSON-RPC.",
    },
    explanation:
      "`McpServer` describes the primitives, and the transport determines where messages come from. `StdioServerTransport` from `@modelcontextprotocol/sdk/server/stdio.js` reads JSON-RPC from stdin and writes responses to stdout.",
  },
  "dm-3-q4": {
    prompt: "Which block types can an MCP tool result return in its `content` array?",
    choices: {
      a: "`text`",
      b: "`tool_use`",
      c: "`image` (base64 data with a `mimeType`)",
      d: "`resource` — an embedded resource with a `uri` and contents",
    },
    whyWrong: {
      b: "`tool_use` is a model block in the Messages API; a server returns a result, not a new call.",
    },
    explanation:
      "A tool result is an array of `text`, `image`, `audio`, embedded `resource` or `resource_link` blocks. The client turns them into a `tool_result` for the model.",
  },
  "dm-3-q5": {
    scenario:
      "The `get_order` tool calls an internal API. For a non-existent order the API returns 404. Currently the handler throws, the client shows a generic error, and the agent repeats the same call three times.",
    prompt: "How should the tool return this situation?",
    choices: {
      a: "Return an empty `content: []` to keep the context clean.",
      b: "Respond with a JSON-RPC `-32602 Invalid params` error.",
      c: "Return `isError: true` with text saying the order was not found and to check the id via `search_orders`.",
      d: "Return a normal successful result with the text \"error\".",
    },
    whyWrong: {
      a: "An empty response explains nothing: the model will not understand what happened and will try again.",
      b: "Protocol errors are for protocol failures; a \"not found\" business outcome should reach the model as a tool result.",
      d: "Without `isError`, the client and the model treat it as success; an error must be flagged explicitly.",
    },
    explanation:
      "Tool execution errors are returned in the result with `isError: true` so the model sees them and adjusts. A useful error message points to the next step instead of a blind retry.",
  },
  "dm-3-q6": {
    prompt: "A client sent `tools/call` with the name of a tool the server does not have. How should the server respond?",
    choices: {
      a: "With a JSON-RPC protocol error in the response's `error` field.",
      b: "With a result carrying `isError: true` and the text \"unknown tool\".",
      c: "Terminate the server process so the client reconnects.",
      d: "Silently ignore the request.",
    },
    whyWrong: {
      b: "`isError` is for execution errors of an existing tool; an unknown name is a protocol violation.",
      c: "One bad request is no reason to drop the connection for every other call.",
      d: "The server must answer every JSON-RPC request that has an `id`; otherwise the client hangs until timeout.",
    },
    explanation:
      "MCP separates two layers: protocol errors (unknown tool, malformed request) come back as a JSON-RPC `error`, while failures inside a tool come back as a result with `isError: true`.",
  },
  "dm-3-q7": {
    prompt: "A tool declares an `outputSchema`. What must its successful result contain?",
    choices: {
      a: "Only a text block with JSON; the client validates it against the schema itself.",
      b: "A `structuredContent` field matching the schema; for compatibility the same JSON should also be duplicated in a text block.",
      c: "A `resource` block with the schema's URI.",
      d: "Nothing special: `outputSchema` is just documentation for humans.",
    },
    whyWrong: {
      a: "For a tool with an `outputSchema`, structured data goes in a separate field, not only as text.",
      c: "The client already knows the schema from `tools/list`; the result carries data, not a link to the schema.",
      d: "Clients may validate `structuredContent` against the schema; it is part of the contract.",
    },
    explanation:
      "`outputSchema` promises the client a data shape, and `structuredContent` delivers it. A text copy in `content` helps clients that do not yet support structured output.",
  },

  // ── Level 4: Transports, resources, prompts ─────────────────────────────
  "dm-4-q1": {
    prompt: "How does a client work with an MCP server over the stdio transport?",
    choices: {
      a: "It connects to a local port the server opens on startup.",
      b: "It launches the server as a subprocess and exchanges JSON-RPC over its stdin and stdout.",
      c: "It opens a WebSocket to the server.",
      d: "It routes requests through Anthropic's cloud, which calls the server.",
    },
    whyWrong: {
      a: "stdio has no ports: that is Streamable HTTP's job.",
      c: "WebSocket is not a standard MCP transport.",
      d: "stdio is a purely local channel between two processes on one machine.",
    },
    explanation:
      "With stdio the client starts the server process itself (`command` + `args`) and writes JSON-RPC messages to its stdin, one per line; it reads responses from stdout.",
  },
  "dm-4-q2": {
    prompt: "What does a server expose for the Streamable HTTP transport?",
    choices: {
      a: "Two endpoints: `/sse` for the event stream and `/messages` for requests.",
      b: "A gRPC service with generated stubs.",
      c: "A single endpoint (for example `/mcp`) that accepts POST and, if needed, GET for an SSE stream.",
      d: "A separate REST route for each tool.",
    },
    whyWrong: {
      a: "That is the legacy HTTP+SSE transport, which Streamable HTTP replaced.",
      b: "MCP uses JSON-RPC 2.0, not gRPC.",
      d: "Tools are invoked with the `tools/call` method through the same endpoint, not via separate routes.",
    },
    explanation:
      "In Streamable HTTP the client POSTs every message to one endpoint. The server replies with plain JSON or opens an SSE stream when it needs to send several messages.",
  },
  "dm-4-q3": {
    scenario:
      "A stateful MCP server on Streamable HTTP was scaled to three instances behind a round-robin load balancer. Since then clients consistently get an unknown-session error on their second or third request, even though `initialize` succeeds.",
    prompt: "What is the cause and what do you do?",
    choices: {
      a: "The session issued in `Mcp-Session-Id` lives in one instance's memory; you need sticky sessions, a shared session store, or stateless mode.",
      b: "Clients should switch to stdio.",
      c: "Increase the load balancer timeout.",
      d: "Disable the `Origin` header check.",
    },
    whyWrong: {
      b: "A remote server for many clients cannot run as a local subprocess.",
      c: "Timeouts are irrelevant: the request simply lands on an instance that does not know the session.",
      d: "The `Origin` check protects against DNS rebinding and has nothing to do with session routing.",
    },
    explanation:
      "The server issues `Mcp-Session-Id` during initialisation, and the client sends it with every request. If session state is local, all of a session's requests must reach the same instance, or the state must be moved out.",
  },
  "dm-4-q4": {
    prompt: "Which JSON-RPC method will the client use to get this resource's contents?",
    choices: {
      a: "`tools/call` with `name: \"app-config\"`.",
      b: "`resources/list`.",
      c: "`prompts/get` with `name: \"app-config\"`.",
      d: "`resources/read` with `uri: \"config://app\"`.",
    },
    whyWrong: {
      a: "A resource is not a tool and does not appear in `tools/list`.",
      b: "`resources/list` returns only the list of resources with metadata, not their contents.",
      c: "Prompts are a separate primitive for message templates.",
    },
    explanation:
      "Resources are addressed by URI: `resources/list` shows what exists, and `resources/read` returns the `contents` of a specific URI. The application, not the model, decides when to read a resource.",
  },
  "dm-4-q5": {
    prompt: "A server must return the profile of any user at `users://{userId}/profile`. How do you implement this?",
    choices: {
      a: "At startup, register a separate resource for every user in the database.",
      b: "A resource template (`ResourceTemplate`) with a URI template; the client discovers it via `resources/templates/list`.",
      c: "A `get_profile` tool, because resources do not support parameters.",
      d: "A prompt with a `userId` argument.",
    },
    whyWrong: {
      a: "It does not scale and goes stale as new users appear.",
      c: "Parameterised resources are supported through URI templates; a tool is appropriate only if the model should make the decision.",
      d: "Prompts return message templates, not data at an address.",
    },
    explanation:
      "Resource templates describe a whole URI space using an RFC 6570 template. The client fills in the parameters and reads the concrete URI with a normal `resources/read`.",
  },
  "dm-4-q6": {
    prompt: "What is true about the prompts primitive in MCP?",
    choices: {
      a: "A prompt runs on the server: the server calls the model itself and returns the answer.",
      b: "`prompts/get` takes arguments and returns a list of `messages`.",
      c: "They are usually invoked explicitly by the user, for example as a slash command in Claude Code.",
      d: "The server declares a prompt's arguments, including which are required.",
    },
    whyWrong: {
      a: "The server only returns a message template; the client is the one that calls the model.",
    },
    explanation:
      "Prompts are user-controlled templates. Claude Code exposes them as `/mcp__<server>__<prompt>` commands, and the server just fills in the arguments and returns ready-made messages.",
  },
  "dm-4-q7": {
    prompt: "A remote MCP server with OAuth received a request without a token. How should it respond according to the MCP authorization spec?",
    choices: {
      a: "HTTP 302 to a login page.",
      b: "HTTP 403 with an HTML login form.",
      c: "HTTP 401 with a `WWW-Authenticate` header pointing to the server's Protected Resource Metadata.",
      d: "A successful result asking for an API key as a tool argument.",
    },
    whyWrong: {
      a: "An MCP client is not a browser; it opens the login page itself after discovery.",
      b: "403 means \"forbidden\" for an authenticated user; the client needs a machine-readable pointer to where to get a token.",
      d: "Secrets in arguments pass through the model's context; authentication belongs at the transport level.",
    },
    explanation:
      "A 401 with `WWW-Authenticate` triggers discovery: the client reads `/.well-known/oauth-protected-resource`, finds the authorization server, runs OAuth 2.1 with PKCE, and then retries with a bearer token.",
  },

  // ── Level 5: Testing and debugging MCP ──────────────────────────────────
  "dm-5-q1": {
    prompt: "How do you launch the MCP Inspector for the local stdio server `build/index.js`?",
    choices: {
      a: "`node --inspect build/index.js`",
      b: "`claude mcp inspect build/index.js`",
      c: "`npx @modelcontextprotocol/inspector node build/index.js`",
      d: "`curl -X POST localhost:3000/mcp`",
    },
    whyWrong: {
      a: "That is the Node.js debugger; it does not speak MCP and does not show tools.",
      b: "Claude Code has no such subcommand; the Inspector is a separate tool.",
      d: "A stdio server does not listen on a port, and you could not do the initialisation handshake by hand like this anyway.",
    },
    explanation:
      "The Inspector launches your server as a subprocess and opens a web UI: you can view `tools/list`, call tools with arbitrary arguments, read resources and see notifications.",
  },
  "dm-5-q2": {
    scenario:
      "A Python FastMCP server passes its handler unit tests, but in Claude Code the connection drops right after startup or tools \"disappear\" from time to time. The handlers are sprinkled with `print(\"debug:\", args)`.",
    prompt: "What breaks the server?",
    choices: {
      a: "`print` writes to stdout, mixing junk into the JSON-RPC stream; logs must go to stderr (via `logging` or `file=sys.stderr`).",
      b: "Claude Code does not support Python servers.",
      c: "You need Streamable HTTP because stdio is unstable.",
      d: "Tools must be registered after `mcp.run()`.",
    },
    whyWrong: {
      b: "The server's language does not matter: the client only sees JSON-RPC over stdio.",
      c: "stdio is stable as long as nothing but protocol messages is written to stdout.",
      d: "`mcp.run()` blocks; registration must happen before it.",
    },
    explanation:
      "For a stdio server, stdout is the protocol channel: any line that is not JSON-RPC breaks parsing on the client side. Diagnostics go to stderr.",
  },
  "dm-5-q3": {
    prompt: "Which way of logging is safe in a TypeScript stdio server?",
    choices: {
      a: "`console.info(...)`: informational messages go to a separate channel.",
      b: "`process.stdout.write(...)` with a `LOG:` prefix.",
      c: "`console.log(...)`, as long as the message is wrapped in JSON.",
      d: "`console.error(...)`, because it writes to stderr.",
    },
    whyWrong: {
      a: "In Node.js `console.info` is an alias of `console.log` and writes to stdout.",
      b: "A prefix does not help: the client expects nothing but JSON-RPC on stdout.",
      c: "Valid JSON is not a valid JSON-RPC message; the client will break or reject it with an error.",
    },
    explanation:
      "`console.error` and `console.warn` write to stderr, which the client does not parse as protocol. `console.log`, `console.info` and `console.debug` write to stdout and are unsafe in a stdio server.",
  },
  "dm-5-q4": {
    prompt: "What should contract tests for an MCP server check?",
    choices: {
      a: "That the model picks this exact tool for a typical user request.",
      b: "Tool names and their `inputSchema` in `tools/list` match a stored snapshot.",
      c: "A call with valid arguments returns the expected `content` or `structuredContent`.",
      d: "A failing external dependency produces a result with `isError: true` and a clear message.",
    },
    whyWrong: {
      a: "That is an eval of model behaviour: non-deterministic and expensive, and it does not replace contract tests.",
    },
    explanation:
      "A server's contract is its tools, schemas and result shapes, including errors. All of these can be checked deterministically through an MCP client, with no model involved.",
  },
  "dm-5-q5": {
    prompt: "What is the main advantage of this test over launching the server as a subprocess over stdio?",
    choices: {
      a: "It also catches junk on the server's stdout.",
      b: "It is fast and deterministic: the real protocol (initialisation, schemas, serialisation) without processes or ports.",
      c: "It checks whether the model fills in arguments correctly.",
      d: "It needs no server code at all, only its schemas.",
    },
    whyWrong: {
      a: "Quite the opposite: the in-memory transport bypasses stdio, so it will not detect stdout pollution.",
      c: "There is no model in the test; the test supplies the arguments itself.",
      d: "The test spins up the real `server` with its handlers; that is exactly what it verifies.",
    },
    explanation:
      "`InMemoryTransport.createLinkedPair()` connects client and server inside one process. The test exercises the whole protocol layer yet stays fast; a separate stdio smoke test is still useful to check startup.",
  },
  "dm-5-q6": {
    scenario:
      "In a new version of an MCP server, the `ticketId` parameter of `get_ticket` was renamed to `id`. After the deploy, several teams complained that their agents and scripts making direct `tools/call` requests started getting validation errors.",
    prompt: "How should this change have been released?",
    choices: {
      a: "Change the `protocolVersion` in the `initialize` response so clients notice the new contract.",
      b: "Rely on `notifications/tools/list_changed`: clients will pick up the new schema themselves.",
      c: "The same way, but update the tool description at the same time.",
      d: "Keep compatibility: accept both parameters during a transition, mark the old one deprecated and bump the server `version`; make breaking changes under a new tool name.",
    },
    whyWrong: {
      a: "`protocolVersion` is the MCP spec version, not your API's; arbitrary values will break negotiation.",
      b: "The notification refreshes the client's list but does not fix code and scripts that send the old parameter.",
      c: "A breaking change stays breaking regardless of the description.",
    },
    explanation:
      "A tool schema is a public contract. Adding optional fields is safe, while renames and removals should go through a transition period or a new tool name, with the change recorded in the server version.",
  },
  "dm-5-q7": {
    prompt: "An MCP server does not show up among the available ones in Claude Code. Where do you start diagnosing inside Claude Code itself?",
    choices: {
      a: "Look at the server's stdout: both protocol and logs are there.",
      b: "The `/mcp` command for server status, and running `claude --debug` for detailed logs.",
      c: "Ask the model in the prompt to report MCP errors.",
      d: "Restart Claude Code until the server connects.",
    },
    whyWrong: {
      a: "stdout is the protocol channel; logs belong in stderr, and the connection state is shown by the client itself.",
      c: "The model cannot see a server that failed to connect; it simply will not have its tools.",
      d: "A deterministic error (path, environment variables, crash on startup) will recur every time.",
    },
    explanation:
      "`/mcp` shows which servers are connected, which failed and how many tools they provide. `--debug` prints startup and error details, including the server's stderr output.",
  },

  // ── Boss: an MCP-powered agent in production ────────────────────────────
  "dm-boss-q1": {
    scenario:
      "An Agent SDK service in a Docker container connects a stdio MCP server for tickets. Locally everything works, but in production the agent replies \"I don't have access to tickets\". The `init` message shows `mcp_servers: [{ name: \"tickets\", status: \"failed\" }]`.",
    prompt: "What do you do first?",
    choices: {
      a: "Add to the system prompt: \"Always use the ticket tools\".",
      b: "Enable `bypassPermissions` to lift access restrictions.",
      c: "Reproduce the server command inside the container (path, runtime, environment variables), and have the code check the status in `init` and abort the run if the server is not `connected`.",
      d: "Retry `query()` until the server connects.",
    },
    whyWrong: {
      a: "The tools are not in context at all: the server did not start, and a prompt will not change that.",
      b: "Permissions are not the problem: the server did not connect, so there is nothing to allow.",
      d: "A startup failure in a container is usually deterministic: a missing file or environment variable.",
    },
    explanation:
      "`init` honestly reports the state of every MCP server. Production code should check it and fail loudly, and the cause of `failed` is almost always the container environment: a different path, a missing runtime or secret.",
  },
  "dm-boss-q2": {
    scenario:
      "A support agent on the Agent SDK uses a `tickets` MCP server: `get_ticket`, `search_tickets` and `close_ticket`. It may read tickets freely, but every closure must be confirmed by a human via Slack.",
    prompt: "How do you configure permissions?",
    choices: {
      a: "Put `close_ticket` in `disallowedTools` and close tickets by hand.",
      b: "Allow `mcp__tickets__get_ticket` and `mcp__tickets__search_tickets` in `allowedTools`, and route `close_ticket` through `canUseTool`, which waits for a decision from Slack.",
      c: "Enable `bypassPermissions` and ask in the prompt to check with a human before closing.",
      d: "A `PostToolUse` hook on `close_ticket` that posts a message to Slack.",
    },
    whyWrong: {
      a: "Then the agent can never close a ticket, even after a human approves.",
      c: "`bypassPermissions` has no permission prompts, and a request in the prompt is not a technical control.",
      d: "`PostToolUse` fires after the closure: the human finds out after the fact.",
    },
    explanation:
      "`allowedTools` approves safe read calls without asking, and anything not settled by rules or mode reaches `canUseTool`. That is where the human confirmation with `allow` or `deny` lives.",
  },
  "dm-boss-q3": {
    scenario:
      "One Streamable HTTP MCP server serves agents for several of the company's customers. The `search_invoices` tool takes `tenant_id` as an argument, and the security review asks what stops customer A's agent from passing customer B's `tenant_id`.",
    prompt: "How do you isolate the data correctly?",
    choices: {
      a: "Derive the tenant on the server from the request's verified OAuth token and ignore any tenant arguments from the model.",
      b: "Put `tenant_id` in each agent's system prompt.",
      c: "Add to the tool description: \"Only use your own tenant_id\".",
      d: "Encrypt `tenant_id` in the argument.",
    },
    whyWrong: {
      b: "The model can make mistakes or fall to prompt injection; a value from the context is no proof of rights.",
      c: "A description is a request to the model, not an access check.",
      d: "Encryption does not prove that the caller is entitled to that tenant.",
    },
    explanation:
      "The trust boundary is at the transport level: the server validates the token (including its audience) and takes the identity from it. Anything the model fills in is untrusted input.",
  },
  "dm-boss-q4": {
    prompt: "Which of the following belong to minimum production readiness for an Agent SDK agent with its own MCP server?",
    choices: {
      a: "`bypassPermissions`, so a headless agent never hangs on a permission prompt.",
      b: "`maxTurns` and handling a `result` with `subtype: \"error_max_turns\"`.",
      c: "Logging `session_id`, `total_cost_usd` and `num_turns` from the `result` message.",
      d: "Contract tests for the MCP server in CI.",
      e: "MCP server logs on stdout so Docker collects them.",
    },
    whyWrong: {
      a: "It removes control exactly where nothing else backs it up; explicit `allowedTools` and `canUseTool` are better.",
      e: "For a stdio server stdout is the protocol channel; logs go to stderr, which Docker collects just as well.",
    },
    explanation:
      "A production agent needs a turn limit, observability for every run and automated checks of the tool contract. Loosening permissions and logging to stdout create new incidents instead of preventing them.",
  },
  "dm-boss-q5": {
    prompt: "After a new MCP server version was deployed, the agent started failing tasks involving `create_invoice`. Put the investigation steps in order.",
    choices: {
      a: "Write a contract test that reproduces the failure.",
      b: "Use the `session_id` from the logs to find the run and the failing call, with its arguments.",
      c: "Run the agent eval on invoice scenarios to confirm the fix.",
      d: "Reproduce the call with the same arguments in the MCP Inspector.",
      e: "Fix the handler or schema while keeping compatibility, and deploy.",
    },
    explanation:
      "First localise the failure from the logs, then reproduce it without the model, pin it down with a test, fix it, and finally verify the agent's behaviour end to end.",
  },
};
