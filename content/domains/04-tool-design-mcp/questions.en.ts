import type { QuestionEn } from "@/lib/content/types";

/** Англійський дубль питань цього домену: id питання → переклад. */
export const questionsEn: Record<string, QuestionEn> = {
  // ── Level 1: Tool design fundamentals ───────────────────────────────────
  "td-1-q1": {
    prompt: "What role does the `description` field of a tool definition play?",
    choices: {
      a: "It is a prompt for the model: it is how the model decides when and how to call the tool.",
      b: "It is documentation for developers; the model does not see it.",
      c: "It is the tool's caption in the user interface.",
      d: "It is optional — what matters is the `input_schema`.",
    },
    whyWrong: {
      b: "The description is sent to the model on every request — it directly shapes behaviour.",
      c: "What is shown in a UI is up to the application; the model receives this exact text as an instruction.",
      d: "The schema says how to call, not when; without a description the model guesses the purpose from the name.",
    },
    explanation:
      "A tool description is the most underrated prompt in the system. The difference between \"Search\" and \"Searches the full-text document index; to look up by identifier use get_document\" is the difference between looping and working.",
  },
  "td-1-q2": {
    prompt: "The model keeps confusing two tools: `get_user` and `fetch_user_data`. What do you do?",
    choices: {
      a: "Merge them into one tool, or clearly separate their purposes in names and descriptions.",
      b: "Add a rule to the system prompt about when to use which.",
      c: "Leave it — the model will eventually learn from its mistakes.",
      d: "Use `tool_choice` to force the right one.",
    },
    whyWrong: {
      b: "A rule in the prompt competes with the tool descriptions; it is more reliable to remove the ambiguity where it arises.",
      c: "No learning happens within a session: the same ambiguity will produce the same mistakes.",
      d: "Forcing the choice breaks agency: the model can no longer pick the appropriate tool for the situation.",
    },
    explanation:
      "Overlapping tools are a common cause of chaotic calls. The rule is simple: every tool should have a clear, non-overlapping responsibility, evident from its name and description.",
  },
  "td-1-q3": {
    prompt: "What makes a tool convenient for an agent?",
    choices: {
      a: "It returns exactly as much data as needed, with filtering and pagination available.",
      b: "The description explains not only what the tool does but when it is appropriate.",
      c: "Errors are returned in a structured form with a hint about what to do next.",
      d: "The tool returns as much data as possible so the model definitely needs no second call.",
      e: "Every tool has as many optional parameters as possible, for flexibility.",
    },
    whyWrong: {
      d: "That fills the context with noise; several targeted calls are cheaper than one 50-thousand-token dump.",
      e: "A large parameter surface increases the chance of a malformed call; flexibility is better granted selectively.",
    },
    explanation:
      "A tool is designed for a consumer with limited context. Its main virtues are frugal output, clarity of purpose and useful error messages.",
  },
  "td-1-q4": {
    prompt: "You have 60 tools and the quality of tool calls has noticeably dropped. What approach does the API provide?",
    choices: {
      a: "Mark rarely used tools with `defer_loading: true` and add a server-side tool-search tool.",
      b: "Split them across several agents with 10 tools each.",
      c: "Shorten the descriptions so all tools fit more compactly.",
      d: "Pass only the tools you think will be needed.",
    },
    whyWrong: {
      b: "A workable architectural move, but heavier; besides, it does not remove the need to describe the tools well.",
      c: "Terse descriptions make tool selection worse — which is exactly what already hurts.",
      d: "Manual filtering is brittle: the moment your guess is wrong, the needed tool simply is not there.",
    },
    explanation:
      "Tool search loads tool definitions on demand, keeping a small active set in context. One important condition: the search tool itself, and at least one other tool, must not be deferred.",
  },
  "td-1-q5": {
    prompt: "When is it better to give an agent one general-purpose `bash` tool rather than a set of narrow tools?",
    choices: {
      a: "When the action space is very wide and unpredictable, and the environment is isolated and controlled.",
      b: "Always — bash covers any task.",
      c: "When strict argument validation is required.",
      d: "When the tool is called very frequently.",
    },
    whyWrong: {
      b: "A wide action surface means a wide error and risk surface; for narrow tasks that is a bad trade.",
      c: "That is exactly what bash cannot give: an arbitrary string cannot be validated by a schema.",
      d: "Call frequency is not an argument for generality.",
    },
    explanation:
      "The trade-off is simple: narrow tools give validation and predictability, general ones give flexibility. Bash is justified in a sandbox for open-ended tasks, not as a universal replacement for tool design.",
  },
  "td-1-q6": {
    scenario:
      "A `query_database` tool accepts arbitrary SQL. The agent works, but twice it ran queries that locked tables in production, and once it deleted rows.",
    prompt: "How do you redesign it?",
    choices: {
      a: "Replace it with a set of parameterised read operations with limits and a timeout, and drop arbitrary SQL.",
      b: "Keep arbitrary SQL but add a prohibition on DELETE and UPDATE to the description.",
      c: "Add a regular-expression check for the keywords DELETE and DROP.",
      d: "Give the agent access to a read replica only.",
    },
    whyWrong: {
      b: "A description is an instruction, not a parser: it creates no technical barrier against a destructive query.",
      c: "Trivially bypassed — comments, casing, subqueries; filtering SQL with regexes is unreliable by construction.",
      d: "A good step that removes the write risk, but locking queries and resource exhaustion on the replica remain.",
    },
    explanation:
      "Arbitrary SQL is `eval` for your database. Parameterised operations give a validated schema, predictable execution plans and safe boundaries — at a cost in flexibility that production is worth.",
  },

  // ── Level 2: Schemas and errors ─────────────────────────────────────────
  "td-2-q1": {
    prompt: "The model passes `open`, then `OPEN`, then `Opened` in a `status` field. How do you fix it?",
    choices: {
      a: "Declare the field as an `enum` with the list of allowed values.",
      b: "Describe the allowed values in the tool description text.",
      c: "Normalise the values on the tool side.",
      d: "Use `strict: true` without changing the schema.",
    },
    whyWrong: {
      b: "Better than nothing, but without an `enum` it remains a recommendation — no validation takes place.",
      c: "It removes the symptom but hides the error: an unknown value quietly becomes something else.",
      d: "`strict` guarantees conformance to your schema — if the field is just `string` there, any string is valid.",
    },
    explanation:
      "An `enum` is both validation and documentation: the model sees the exact list of values right in the schema and has no room for variation.",
  },
  "td-2-q2": {
    prompt: "A tool received a non-existent identifier. What should it return?",
    choices: {
      a: "A structured error with a code, an explanation and a hint about what to do next.",
      b: "Throw an exception and abort the agent loop.",
      c: "Return an empty object.",
      d: 'Return the text "Error" with no details.',
    },
    whyWrong: {
      b: "That denies the model any chance to recover: an error it cannot see cannot be handled.",
      c: "The model cannot distinguish \"nothing found\" from \"it did not work\" and will most likely repeat the call.",
      d: "There is neither a cause nor a next step — the model is left with nothing to act on.",
    },
    explanation:
      "An error is also a message to the model. The code gives machine-readable clarity, the explanation gives context, the hint gives a way forward. That format turns a failure into self-correction.",
  },
  "td-2-q3": {
    prompt: "How do you return a failed tool result to the model in the Messages API?",
    choices: {
      a: "As a `tool_result` block with the same `tool_use_id` and `is_error: true`.",
      b: "Skip that block and send only the successful results.",
      c: "Send the error in the system prompt.",
      d: "Start a new conversation describing the error.",
    },
    whyWrong: {
      b: "Every `tool_use` needs a matching `tool_result`; omitting one is a malformed request.",
      c: "The system prompt is not a channel for call results; the link to the specific call is lost.",
      d: "You lose the entire task context over a situation the model can handle in place.",
    },
    explanation:
      "An error comes back through the same channel as a success: a `tool_result` with the `is_error` flag. That way the model sees exactly which call failed and can take a different route.",
  },
  "td-2-q4": {
    prompt: "What is true about `strict: true` for tools?",
    choices: {
      a: "It is a field of the tool itself, alongside `name`, `description` and `input_schema`.",
      b: "The schema must contain `additionalProperties: false` and a `required` list.",
      c: "It guarantees that `tool_use.input` will conform to the schema.",
      d: "It is specified inside `tool_choice`.",
      e: "It is compatible with programmatic tool calling.",
    },
    whyWrong: {
      d: "`tool_choice` controls whether a tool is called and has nothing to do with argument validation.",
      e: "These mechanisms are incompatible — programmatic tool calling does not work with `strict: true`.",
    },
    explanation:
      "Strict mode removes an entire class of production failures — malformed arguments. In exchange it requires a closed schema: without `additionalProperties: false` there is no guarantee.",
  },
  "td-2-q5": {
    prompt: "A search tool returns 800 records of 200 tokens each. What do you change?",
    choices: {
      a: "Add pagination, a default limit and a short record form with a way to fetch the full one by identifier.",
      b: "Silently truncate the result to the first 50 records.",
      c: "Return everything — let the model filter it.",
      d: "Compress the JSON by removing whitespace.",
    },
    whyWrong: {
      b: "The model will not know about the truncation and will draw conclusions from partial data as if it were complete.",
      c: "160 thousand tokens in one call eat context and money for the sake of a handful of useful records.",
      d: "Saving on formatting is negligible next to the volume of the data itself.",
    },
    explanation:
      "Two-stage delivery — a list of short records, then details on demand — is the classic pattern of a frugal tool. And any truncation must be explicit in the response.",
  },
  "td-2-q6": {
    scenario:
      "A tool that creates a task in an issue tracker is sometimes called twice with identical arguments when the previous call timed out. Duplicates appear in the tracker.",
    prompt: "What do you change in the tool's design?",
    choices: {
      a: "Accept an idempotency key and return the existing task if a request with that key has already been processed.",
      b: "Disable retries on the client side.",
      c: "Add an instruction to the description not to call the tool twice.",
      d: "Detect duplicates by text similarity.",
    },
    whyWrong: {
      b: "Then transient network failures become lost tasks — you have traded one defect for another.",
      c: "The model calls again precisely because it does not know the result of the first call; an instruction does not change that.",
      d: "A heuristic: it will produce both false positives on similar tasks and misses on the smallest difference.",
    },
    explanation:
      "Idempotency is a property of the tool, not of caller discipline. An operation key makes a repeated call safe both on a timeout and on a model retry.",
  },

  // ── Level 3: MCP foundations ────────────────────────────────────────────
  "td-3-q1": {
    prompt: "What problem does the Model Context Protocol solve?",
    choices: {
      a: "It standardises how applications supply tools and context to models — one integration works with different clients.",
      b: "It compresses context so it fits the model's window.",
      c: "It replaces the Messages API for agentic applications.",
      d: "It gives the model persistent memory between sessions.",
    },
    whyWrong: {
      b: "That is the job of compaction and context management; MCP is about integration, not compression.",
      c: "MCP does not replace the API — it supplies tools and data to the application that talks to the model.",
      d: "Memory can be implemented through an MCP server, but the protocol itself does not provide it.",
    },
    explanation:
      "Before MCP, every integration was written for a specific application. The protocol makes it portable: one server works in Claude Code and in other MCP clients alike.",
  },
  "td-3-q2": {
    prompt: "How are the roles distributed in the MCP architecture?",
    choices: {
      a: "A host application runs MCP clients, each of which connects to one MCP server that provides capabilities.",
      b: "The model connects to MCP servers directly.",
      c: "The MCP server launches and manages the clients.",
      d: "Client and server are two processes of the same program; the split is nominal.",
    },
    whyWrong: {
      b: "The model has no network stack: the application holds the connection, and the model only sees the tools it provides.",
      c: "The direction is the reverse: the client initiates the connection to the server.",
      d: "The server is often a separate process or a remote service — the split is quite real.",
    },
    explanation:
      "Host (Claude Code, a desktop app, your backend) → MCP clients → MCP servers. One client-server connection per server — that is both a trust boundary and a configuration boundary.",
  },
  "td-3-q3": {
    prompt: "Which primitives does an MCP server provide?",
    choices: {
      a: "Tools — actions the model invokes.",
      b: "Resources — data the application supplies.",
      c: "Prompts — templates the user triggers.",
      d: "Models — models available to call.",
      e: "Sessions — management of agent sessions.",
    },
    whyWrong: {
      d: "Model choice is the host application's business; the server does not supply models.",
      e: "Sessions are managed by the application, not by the MCP server.",
    },
    explanation:
      "The three primitives differ by who initiates their use: tools by the model, resources by the application, prompts by the user. That distinction decides what goes where when designing a server.",
  },
  "td-3-q4": {
    prompt: "Which transport do you choose for an MCP server that runs locally as a subprocess?",
    choices: {
      a: "stdio — exchange over standard input and output streams.",
      b: "Streamable HTTP",
      c: "WebSocket",
      d: "gRPC",
    },
    whyWrong: {
      b: "That is the transport for remote servers; for a local subprocess it adds an unnecessary network layer.",
      c: "It is not a standard MCP transport.",
      d: "The MCP protocol does not use gRPC as a transport.",
    },
    explanation:
      "Two main transports: stdio for local subprocesses and streamable HTTP for remote servers. Local stdio needs neither ports nor network authentication.",
  },
  "td-3-q5": {
    prompt: "How do MCP tools differ from tools declared in the request's `tools` field?",
    choices: {
      a: "Not at all from the model's point of view — it sees them identically; the difference is who supplies and executes them.",
      b: "MCP tools execute on Anthropic's servers.",
      c: "MCP tools need no parameter schema.",
      d: "MCP tools cannot modify data.",
    },
    whyWrong: {
      b: "They execute wherever the MCP server runs: locally or in your infrastructure.",
      c: "A schema is needed just the same — the model has to know which arguments to pass.",
      d: "They can: the scope of actions is determined by the server's implementation, not by the protocol.",
    },
    explanation:
      "MCP is a delivery mechanism for tools, not a separate mechanism for the model. They enter the context as the same kind of definitions, so description quality matters just as much.",
  },
  "td-3-q6": {
    scenario:
      "A team wrote three integrations with internal services for Claude Code. Now the same integrations are needed in their own Agent SDK application and possibly in a desktop client.",
    prompt: "How do they avoid writing them a third time?",
    choices: {
      a: "Package the integrations as MCP servers and connect them in each host application.",
      b: "Extract the logic into a shared library and import it into each application.",
      c: "Build an internal REST API and describe the tools in each application.",
      d: "Copy the tool definitions into every project.",
    },
    whyWrong: {
      b: "That works only where you write the application code, and it does not help with a desktop client you cannot import into.",
      c: "The API is shared, but the tool definitions would have to be duplicated and kept in sync in every client.",
      d: "That is exactly the third rewrite the team wants to avoid.",
    },
    explanation:
      "This is what MCP was built for: the server describes the tools once and any MCP client picks them up. Updating the server reaches every host application without changes on their side.",
  },

  // ── Level 4: MCP servers and clients ────────────────────────────────────
  "td-4-q1": {
    prompt: "Which file describes MCP servers shared across the whole project team in Claude Code?",
    choices: {
      a: "`.mcp.json` at the repository root.",
      b: "`.claude/settings.json`",
      c: "`CLAUDE.md`",
      d: "`~/.claude/mcp.json`",
    },
    whyWrong: {
      b: "That holds permissions, hooks and variables; project MCP server configuration lives separately.",
      c: "That is memory with instructions, not a configuration file.",
      d: "The user level holds personal servers, unavailable to colleagues through the repository.",
    },
    explanation:
      "`.mcp.json` is committed to the repository, so everyone gets the same servers. Personal servers are added with `claude mcp add` in a different scope.",
  },
  "td-4-q2": {
    prompt: "You are connecting a remote MCP server through the Messages API MCP connector. What is required besides `mcp_servers`?",
    choices: {
      a: "An `mcp_toolset` entry in `tools` with the same server name.",
      b: "Nothing — the server list is enough.",
      c: "Listing all of the server's tools manually in `tools`.",
      d: "A separate call to register the server.",
    },
    whyWrong: {
      b: "A request without `mcp_toolset` is rejected as a validation error.",
      c: "The whole point of a toolset is to avoid duplicating the list of tools.",
      d: "Servers are passed in the same request; there is no separate registration.",
    },
    explanation:
      "The connector needs both halves: `mcp_servers` describes the connection, `mcp_toolset` enables that server's tools. Omitting the second is a common mistake that yields validation instead of work.",
  },
  "td-4-q3": {
    prompt: "What should you consider when connecting a third-party MCP server?",
    choices: {
      a: "What data the server receives and where that data goes.",
      b: "What actions it can perform and whether you need all of them.",
      c: "That its tool descriptions enter your context and influence the model's behaviour.",
      d: "That an MCP server cannot perform state-changing actions.",
      e: "That the protocol itself isolates the server from the rest of the system.",
    },
    whyWrong: {
      d: "It can: a server may write, delete and call external APIs — it all depends on its implementation.",
      e: "The protocol is not a sandbox: a local server runs with the permissions of the process that started it.",
    },
    explanation:
      "A third-party MCP server is both code in your environment and text in your context. Both sides need assessment: what it can do, and what it tells the model.",
  },
  "td-4-q4": {
    prompt: "Your MCP server exposes a knowledge base of 5000 documents. How do you design the tools?",
    choices: {
      a: "A search tool with filters that returns short fragments, plus a tool that fetches a full document by identifier.",
      b: "One tool that returns all documents.",
      c: "One tool per document category.",
      d: "A resource listing all documents that the model reads every time.",
    },
    whyWrong: {
      b: "No context window survives that, and only a handful of documents will be useful.",
      c: "Dozens of nearly identical tools bloat the context and complicate selection.",
      d: "A list of 5000 entries is the same dump under a different name.",
    },
    explanation:
      "The \"search plus detail\" pattern gives just-in-time context: the model first finds what is relevant, then fetches the full text only for what it needs.",
  },
  "td-4-q5": {
    prompt: "What is appropriate to expose as an MCP resource rather than a tool?",
    choices: {
      a: "Read-only data the application can put into context — for example a file's contents or a database schema.",
      b: "Creating a record in an external system.",
      c: "A parameterised, filtered search.",
      d: "A prompt template for the user.",
    },
    whyWrong: {
      b: "That is an action with a side effect — a typical tool.",
      c: "A search is initiated by the model with parameters — also a tool.",
      d: "There is a separate prompts primitive for that.",
    },
    explanation:
      "Resources are data the application supplies, not actions the model invokes. The distinction is who initiates: if the model decides to use it, it is a tool.",
  },
  "td-4-q6": {
    scenario:
      "An internal MCP server exposes 30 tools for a CRM. The agent starts slowly, often picks the wrong tool, and the descriptions take up a noticeable share of the context.",
    prompt: "What is the best plan of action?",
    choices: {
      a: "Trim the set to the most-used operations, merge similar ones, and leave the rare ones deferred for loading through tool search.",
      b: "Split the server into three with ten tools each.",
      c: "Shorten the descriptions to a single brief phrase.",
      d: "Move some of the tools into the system prompt as instructions.",
    },
    whyWrong: {
      b: "If all three are connected, the same 30 descriptions are in context — only the configuration changes.",
      c: "That aggravates the main problem — picking the wrong tool.",
      d: "An instruction in a prompt is not a tool call: the model would be unable to perform the action.",
    },
    explanation:
      "Two causes — a bloated set and expensive loading. Consolidation reduces confusion, and deferred loading keeps rare capabilities available without holding them in context permanently.",
  },

  // ── Boss: Integrating an external service ───────────────────────────────
  "td-b-q1": {
    scenario:
      "You need to give an agent access to an internal analytics API. It will be used from Claude Code, from your own Agent SDK application and possibly from a desktop client. The data is sensitive and must not leave the company perimeter.",
    prompt: "Which integration do you choose?",
    choices: {
      a: "An MCP server in your own infrastructure: one implementation for all clients, data stays inside the perimeter.",
      b: "Declare the tools separately in each application.",
      c: "Host the MCP server in a public cloud provider.",
      d: "Give the agent bash and curl against the internal API.",
    },
    whyWrong: {
      b: "Three implementations to keep in sync and no gain — and for a desktop client that path is not even available.",
      c: "That contradicts the requirement to keep sensitive data inside the perimeter.",
      d: "Neither validation nor constrained actions: the agent could reach any endpoint with any parameters.",
    },
    explanation:
      "Several host applications plus a locality requirement is the textbook case for a self-hosted MCP server: one implementation, one access control, any number of clients.",
  },
  "td-b-q2": {
    scenario:
      "A single simple integration: the agent needs to post messages to one Slack channel. Nothing else. The team is debating whether to stand up an MCP server for it.",
    prompt: "What is appropriate?",
    choices: {
      a: "An ordinary tool inside the application: one function, a narrow schema, no separate server.",
      b: "A full MCP server for Slack.",
      c: "Give the agent curl and a Slack token.",
      d: "Connect a third-party public MCP server for Slack.",
    },
    whyWrong: {
      b: "For one operation in one application that is excess infrastructure: a server, configuration and maintenance for a single function.",
      c: "A token in the agent's hands together with arbitrary network requests is needless risk instead of one safe function.",
      d: "It adds an external dependency and broader powers than one channel requires.",
    },
    explanation:
      "MCP pays off through portability and reuse. A single operation in a single application needs neither, so an ordinary function with a narrow schema is cheaper and safer.",
  },
  "td-b-q3": {
    scenario:
      "You connected a third-party MCP server for working with cloud storage files. After that the agent occasionally started performing actions nobody asked for — for example \"tidying up\" old files.",
    prompt: "What do you check first?",
    choices: {
      a: "The server's tool descriptions: they enter the context and may contain prompting language that influences the model's behaviour.",
      b: "The server logs for technical errors.",
      c: "The model version.",
      d: "The network configuration.",
    },
    whyWrong: {
      b: "The calls succeed — the question is not about failures but about why the model initiates them.",
      c: "The behaviour changed right after connecting the server, not after a model change.",
      d: "The connection works; the problem is what is being done, not whether access exists.",
    },
    explanation:
      "A third-party server's tool descriptions are someone else's text inside your prompt. They can encourage actions you never planned, so connecting a server should be treated as both a code change and a prompt change — with permissions restricted accordingly.",
  },
};
