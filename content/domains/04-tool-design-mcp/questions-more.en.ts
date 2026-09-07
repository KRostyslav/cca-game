import type { QuestionEn } from "@/lib/content/types";

/** Англійський дубль додаткового пулу. */
export const questionsMoreEn: Record<string, QuestionEn> = {
  "td-1-q7": {
    prompt: "How should a tool be named so the model picks it correctly?",
    choices: {
      a: "As a verb plus object: `search_documents`, `create_ticket` — so the purpose reads from the name.",
      b: "As an internal service abbreviation, like in the code.",
      c: "As short as possible, to save tokens.",
      d: "With a version number in the name.",
    },
    whyWrong: {
      b: "Internal abbreviations tell the model nothing about what the tool is for.",
      c: "Saving a few tokens is not worth mistakes in tool selection.",
      d: "A version in the name confuses the model and does not help pick the right tool.",
    },
    explanation:
      "The name is the first thing the model sees. Together with the description it should answer \"what does this tool do\" without guesswork.",
  },
  "td-1-q8": {
    prompt: "Besides what it does, what belongs in a tool description?",
    choices: {
      a: "When it is appropriate to use and when another tool is better.",
      b: "Constraints: limits, formats, what the tool cannot do.",
      c: "What exactly comes back in the response.",
      d: "The tool's change history.",
      e: "The internal endpoint it calls.",
    },
    whyWrong: {
      d: "Version history is information for developers; it only spends context.",
      e: "Implementation details are of no use to the model and add nothing to the choice.",
    },
    explanation:
      "A good description answers three questions: when to reach for it, what you get and what you will not get. That removes most incorrect calls.",
  },
  "td-1-q9": {
    prompt: "What does `defer_loading: true` mean for a tool?",
    choices: {
      a: "Its full definition is not held in context permanently but loaded when the model finds it through tool search.",
      b: "The tool is called asynchronously.",
      c: "The tool is available only after user confirmation.",
      d: "The tool is cached between requests.",
    },
    whyWrong: {
      b: "This is about loading the definition, not about how the call executes.",
      c: "Confirmation is permissions, a separate mechanism.",
      d: "Caching applies to the request prefix, not to individual tool definitions.",
    },
    explanation:
      "Deferred loading solves the large-set problem: a small active set stays in context while the rest is pulled in on demand.",
  },
  "td-1-q10": {
    scenario:
      "The model regularly calls the `get_report` tool without the required period parameter, gets an error and repeats the call with it.",
    prompt: "What do you fix?",
    choices: {
      a: "Make the parameter required in the schema and describe its purpose — then the first call is already correct.",
      b: "Remove the error and return a default report.",
      c: "Add a rule to the system prompt.",
      d: "Nothing: the second attempt works anyway.",
    },
    whyWrong: {
      b: "A silent default returns a report for the wrong period, and nobody will notice.",
      c: "The schema is closer to the call site and is enforced, unlike a rule in prose.",
      d: "Every extra cycle costs tokens and time, and at scale that is a noticeable expense.",
    },
    explanation:
      "The schema is the cheapest place to fix this: it accompanies every call and does not depend on whether the model recalled a rule from the prompt.",
  },
  "td-1-q11": {
    prompt: "The model has two tools: `list_users` and `search_users`. How do you make the choice unambiguous?",
    choices: {
      a: "Separate them explicitly in the descriptions: one is a full paginated list, the other a search by criterion — and have each mention the other.",
      b: "Merge them into one tool with a mode flag.",
      c: "Remove `list_users`.",
      d: "Give them identical descriptions.",
    },
    whyWrong: {
      b: "A mode flag often makes the schema more complex without making the choice clearer.",
      c: "A full listing is a legitimate scenario; losing it constrains the agent.",
      d: "That guarantees confusion instead of removing it.",
    },
    explanation:
      'Cross-references in descriptions act as signposts: "to search by name use search_users" removes the doubt at the moment of choice.',
  },
  "td-1-q12": {
    prompt: "Put the steps of designing a new tool in order.",
    choices: {
      a: "Define the task and the tool's boundaries of responsibility",
      b: "Describe the parameter schema with types and constraints",
      c: "Decide the response format and its size",
      d: "Write the description explaining when the tool is appropriate",
    },
    explanation:
      "The description is written last, once the boundaries, parameters and output are clear: only then does it describe the real tool rather than an intention.",
  },
  "td-1-q13": {
    prompt: 'What is wrong with a tool that takes one string parameter `query` and does "everything"?',
    choices: {
      a: "The input cannot be validated: any string is formally valid.",
      b: "The model gets no hints about the permitted operations.",
      c: "Errors become opaque: it is unclear which part of the request was wrong.",
      d: "Such a tool is slower than others.",
      e: "It cannot return a structured response.",
    },
    whyWrong: {
      d: "Speed depends on the implementation, not on the shape of the schema.",
      e: "Response shape does not depend on how many parameters a tool has.",
    },
    explanation:
      "A catch-all string parameter shifts all the complexity onto the model and makes errors inexpressive. Explicit parameters provide both validation and hints.",
  },
  "td-1-q14": {
    scenario:
      "An agent has 12 calendar tools: create, update, delete, move, copy an event and so on. The model often picks the wrong one.",
    prompt: "What do you try first?",
    choices: {
      a: "Merge closely related operations into one tool with an action parameter and a clear schema.",
      b: "Add a thirteenth dispatcher tool.",
      c: "Shorten the descriptions to a single phrase.",
      d: "Set every tool to `defer_loading`.",
    },
    whyWrong: {
      b: "One more tool in the set is more likely to increase the confusion than remove it.",
      c: "Shorter descriptions worsen exactly what hurts — tool selection.",
      d: "You cannot defer them all: at least one tool and the search itself must stay active.",
    },
    explanation:
      "Twelve similar tools create twelve chances to be wrong. Consolidation reduces the number of decisions the model has to make blind.",
  },
  "td-1-q15": {
    prompt: "How much data should a tool return by default?",
    choices: {
      a: "As much as a typical step needs, with a way to request more explicitly.",
      b: "The maximum available, so the model definitely needs no second call.",
      c: "The minimum, just identifiers.",
      d: "As much as fits inside the response limit.",
    },
    whyWrong: {
      b: "That clogs the context and makes every call expensive regardless of need.",
      c: "Then nearly every call spawns a second one and the step count grows.",
      d: "A technical limit is not a usefulness criterion: it is unrelated to the task.",
    },
    explanation:
      "A sensible default volume plus an explicit way to get details balances the number of calls against the load on context.",
  },
  "td-1-q16": {
    prompt: "Why should a tool with side effects be separated from a read-only tool?",
    choices: {
      a: "Different risks mean different permissions: reading can be allowed freely while changes stay behind confirmation.",
      b: "Reading executes faster.",
      c: "The model cannot call tools that make changes.",
      d: "The tool specification requires it.",
    },
    whyWrong: {
      b: "Speed is not a reason to separate responsibilities.",
      c: "It can — the question is only under what conditions it is allowed to.",
      d: "No such requirement exists — this is engineering practice.",
    },
    explanation:
      "When reading and writing are mixed in one tool, permissions become coarse: you must either allow everything or block useful reads.",
  },
  "td-1-q17": {
    scenario:
      "A tool returns data in its own compact format with abbreviations to save tokens. The model regularly misinterprets it.",
    prompt: "What do you do?",
    choices: {
      a: "Go back to understandable field names: saving tokens is not worth interpretation errors.",
      b: "Add a format legend to the system prompt.",
      c: "Teach the model the format with a few examples.",
      d: "Compress it even further.",
    },
    whyWrong: {
      b: "The legend spends the same tokens, but permanently, and adds another layer for mistakes.",
      c: "Examples help partly but leave the source of ambiguity in place.",
      d: "That aggravates the problem rather than solving it.",
    },
    explanation:
      "A tool's response format is an interface for the model too. A few extra tokens on clear names pay for themselves in the absence of misreadings.",
  },
  "td-1-q18": {
    prompt: "What do you do if a tool returns data that is almost always irrelevant to the task?",
    choices: {
      a: "Remove it from the default response and add a parameter for the cases where it is needed.",
      b: 'Keep it: it might come in handy someday.',
      c: "Ask the model to ignore the extra fields.",
      d: "Compress it into a shorter format.",
    },
    whyWrong: {
      b: '"Might come in handy" is paid for on every call and clutters the context.',
      c: "The tokens are already spent and attention already diluted — a request does not change that.",
      d: "It reduces the volume but leaves unnecessary data in the context.",
    },
    explanation:
      "The default should serve the typical case. Anything needed rarely is enabled by a parameter — then it is paid for only when it is actually required.",
  },
  "td-2-q7": {
    prompt: "A tool accepts a date. How do you describe the parameter to avoid format chaos?",
    choices: {
      a: "State the format explicitly in the description with an example: `ISO 8601, e.g. 2026-09-07`.",
      b: "Accept any string and parse it inside the tool.",
      c: "Accept a number — a timestamp.",
      d: "Add a format rule to the system prompt.",
    },
    whyWrong: {
      b: "Lenient parsing hides ambiguity: 03/04 could be March or April.",
      c: "The model handles timestamps less reliably, and mistakes become invisible.",
      d: "The schema is closer to the call and applies regardless of what the model recalls from the prompt.",
    },
    explanation:
      "A description with an example is the cheapest way to fix a format. For dates it matters especially: ambiguity raises no error, it quietly changes the meaning.",
  },
  "td-2-q8": {
    prompt: "What should a structured tool error contain?",
    choices: {
      a: "A machine-readable error code.",
      b: "An explanation the model can understand.",
      c: "A hint about a possible next step.",
      d: "A full stack trace.",
      e: "Internal database query identifiers.",
    },
    whyWrong: {
      d: "A stack trace is noise to the model: it does not suggest what to do next.",
      e: "Implementation details do not help the model choose its next action.",
    },
    explanation:
      "An error should answer three questions: what happened, why and what to do. Everything else is context load with no benefit.",
  },
  "td-2-q9": {
    prompt: "A search tool found nothing. What is better to return?",
    choices: {
      a: 'An explicit "0 results" with the criteria explained and a hint on narrowing or widening the query.',
      b: "An empty array.",
      c: "An error with `is_error: true`.",
      d: "The closest matches with no warning.",
    },
    whyWrong: {
      b: 'The model cannot tell "there is nothing" from "something went wrong" and will most likely repeat the call.',
      c: "No results is not an error: it is a valid search outcome.",
      d: "The model will take them for exact matches and build a conclusion on them.",
    },
    explanation:
      'An empty result is the most common cause of looping. An explicit "nothing found, try X" gives the model a signal about progress and direction.',
  },
  "td-2-q10": {
    scenario:
      "A tool returns a list of 300 records with a pagination cursor, but the model never uses the cursor and works only with the first page.",
    prompt: "What is probably wrong?",
    choices: {
      a: "The response has no explicit signal that more data exists: the model sees no reason to make a second call.",
      b: "The model cannot handle pagination.",
      c: "The cursor has the wrong format.",
      d: "The page size should be raised to 300.",
    },
    whyWrong: {
      b: "It can, if the response shows the page is not the last one.",
      c: "Then you would see call errors rather than silent disregard.",
      d: "That removes pagination along with control over response size.",
    },
    explanation:
      "Pagination only works if the response carries `has_more` or a similar signal. Without it the first page looks like the complete result.",
  },
  "td-2-q11": {
    prompt: "Why describe a parameter's constraints in the schema — for example a maximum string length?",
    choices: {
      a: "The model sees the limit in advance and does not waste a call that would fail anyway.",
      b: "It speeds up the tool's execution.",
      c: "It is a JSON Schema requirement.",
      d: "It replaces validation inside the tool.",
    },
    whyWrong: {
      b: "Speed does not depend on whether the constraint is described in the schema.",
      c: "Constraints are optional; the point is usefulness, not a formal requirement.",
      d: "Tool-side validation stays in any case — the schema complements it.",
    },
    explanation:
      "Constraints in the schema act as hints: they save the cycles otherwise spent on a call, an error and a retry.",
  },
  "td-2-q12": {
    prompt: "Put the steps of handling a tool failure in production in order.",
    choices: {
      a: "Catch the exception inside the tool's code",
      b: "Determine whether the error is transient or persistent",
      c: "Return a structured explanation with a hint to the model",
      d: "Record the event in a log for later analysis",
    },
    explanation:
      'Classifying the error determines the hint: for a transient one "try again" fits, for a persistent one "change the parameters" or "use another tool".',
  },
  "td-2-q13": {
    prompt: "What do you do if a tool returns a very large object the model never uses in full?",
    choices: {
      a: "Return a shortened form with an identifier that fetches the full object in a separate call.",
      b: "Truncate the object to its first N fields.",
      c: "Return it as is: the model will pick what it needs.",
      d: "Compress the JSON by removing whitespace.",
    },
    whyWrong: {
      b: "Arbitrary truncation may remove exactly the needed field and make the response unpredictably incomplete.",
      c: "It will pick after you have already paid for the whole volume.",
      d: "Saving on formatting is negligible next to the volume of the data itself.",
    },
    explanation:
      'The "short view plus fetch by id" pattern lets you pay for details only when they are genuinely needed.',
  },
  "td-2-q14": {
    prompt: "Which errors should be treated as transient, with a retry hint to the model?",
    choices: {
      a: "Exceeding an external service's rate limit.",
      b: "A network call timeout.",
      c: "Temporary unavailability of a dependent service.",
      d: "Invalid call arguments.",
      e: "Lack of permission for the operation.",
    },
    whyWrong: {
      d: "Retrying with the same arguments yields the same error — they must change.",
      e: "Permissions will not appear on a retry; a different solution is needed.",
    },
    explanation:
      "The hint must match the nature of the error. Advising a retry where it cannot possibly work is a direct route to agent looping.",
  },
  "td-2-q15": {
    scenario:
      'A record-creation tool returns only `{ "ok": true }`. The agent often makes an extra search call immediately after creating.',
    prompt: "What do you change?",
    choices: {
      a: "Return the identifier and the key fields of the created record — then the next step needs no additional call.",
      b: "Add an instruction to the description not to search after creating.",
      c: "Return the full object with every field.",
      d: "Nothing: the extra call is cheap.",
    },
    whyWrong: {
      b: "The agent needs data about the created record, not a ban on looking for it.",
      c: "Excess also hurts; the identifier and key fields are enough.",
      d: "At scale every extra cycle multiplies by the number of operations.",
    },
    explanation:
      "A tool's response should close the most likely next step. An empty confirmation forces the agent to fetch what could have been returned straight away.",
  },
  "td-2-q16": {
    prompt: "The idempotency key comes from the model. Why is that risky?",
    choices: {
      a: "The model may generate the same key for different operations — it is safer to derive it in code from the call parameters.",
      b: "The model cannot generate unique strings.",
      c: "The key lengthens the request.",
      d: "Idempotency is not needed at all.",
    },
    whyWrong: {
      b: "It can, but that gives no uniqueness guarantee — which is exactly the problem.",
      c: "A few tokens are not a risk.",
      d: "It is needed: without it retries create duplicates.",
    },
    explanation:
      "Idempotency must be a property of the system, not depend on how well the model invented a key. A deterministic key derived from parameters is more reliable.",
  },
  "td-2-q17": {
    prompt: "Why should a tool not silently normalise invalid arguments?",
    choices: {
      a: "The model never learns about the mistake and will repeat it, while the result may not be what anyone expected.",
      b: "Normalisation is slow.",
      c: "It is forbidden by the specification.",
      d: "Normalisation breaks caching.",
    },
    whyWrong: {
      b: "Speed is irrelevant — the problem is a hidden change of meaning.",
      c: "There is no such prohibition; it is a design question.",
      d: "The cache concerns the request's input prefix, not the tool's logic.",
    },
    explanation:
      'Silent normalisation turns an error into an invisible distortion. Better to return a clear error with a hint than to "fix" the argument your own way.',
  },
  "td-2-q18": {
    prompt: "How does a schema help when a tool is called several times in parallel?",
    choices: {
      a: "A strict schema guarantees each call has valid arguments, so an error in one is not mistaken for an error in another.",
      b: "The schema orders the calls in time.",
      c: "The schema merges parallel calls into one.",
      d: "The schema guarantees identical results.",
    },
    whyWrong: {
      b: "Execution order is determined by your code, not by a parameter schema.",
      c: "Merging is a matter of tool design, not of the schema.",
      d: "The result depends on the arguments and system state, not on the schema.",
    },
    explanation:
      "Parallel calls make diagnosis harder: valid arguments in each of them leave less room for guesswork when something goes wrong.",
  },
  "td-3-q7": {
    prompt: "Who initiates use of the MCP prompts primitive?",
    choices: {
      a: "The user — these are templates they choose deliberately.",
      b: "The model during its reasoning.",
      c: "The server on a schedule.",
      d: "The host application automatically at startup.",
    },
    whyWrong: {
      b: "What the model chooses is tools; prompts are launched by a person.",
      c: "The server provides capabilities but does not launch them itself.",
      d: "An application may inject resources automatically, but not launch prompts.",
    },
    explanation:
      "The three primitives differ by initiator: tools by the model, resources by the application, prompts by the user. That is the key to designing a server correctly.",
  },
  "td-3-q8": {
    prompt: "Which transport do you choose for an MCP server serving several teams across different networks?",
    choices: {
      a: "Streamable HTTP with authorisation — the server is remote and reachable by many clients.",
      b: "stdio",
      c: "File exchange through a shared directory.",
      d: "A direct connection from the model to the server.",
    },
    whyWrong: {
      b: "stdio works with a local subprocess on the same machine and does not suit remote access.",
      c: "MCP has no such transport.",
      d: "The model has no network stack: the connection is always held by the application.",
    },
    explanation:
      "The transport follows the location: a local subprocess means stdio, a remote service means HTTP with authorisation.",
  },
  "td-3-q9": {
    prompt: "What does standardising integrations through MCP give you?",
    choices: {
      a: "One implementation works with different host applications.",
      b: "A server update reaches all clients without changes on their side.",
      c: "A shared vocabulary appears: tools, resources, prompts.",
      d: "Automatic isolation of the server from the system.",
      e: "A guarantee of tool description quality.",
    },
    whyWrong: {
      d: "The protocol is not a sandbox: a local server runs with its process's privileges.",
      e: "Description quality is the server author's responsibility, not the protocol's.",
    },
    explanation:
      "MCP removes duplicated integrations and provides a shared language. But it guarantees nothing about a particular server's security or quality.",
  },
  "td-3-q10": {
    scenario:
      "A team wants to give an agent access to the database schema so it understands the table structure, but without the ability to run queries.",
    prompt: "Which MCP primitive fits here?",
    choices: {
      a: "A resource: the schema is read-only data the application supplies.",
      b: "A tool: the model should decide when to read the schema.",
      c: "A prompt: the user will launch a template containing the schema.",
      d: "None: the schema should be written into the system prompt.",
    },
    whyWrong: {
      b: "A tool implies an action by the model; here you simply want to provide context without query execution.",
      c: "The schema is needed as background context, not as a manually launched template.",
      d: "Possible, but then the schema enters the context always and is updated by hand.",
    },
    explanation:
      "Resources exist precisely for \"give data without giving action\". If you do not want the model executing queries, the schema should arrive as a resource, not a tool.",
  },
  "td-3-q11": {
    prompt: "How many MCP servers can one host application serve?",
    choices: {
      a: "Any number: each gets its own client and its own connection.",
      b: "One — otherwise tool names would conflict.",
      c: "No more than three.",
      d: "It depends on the model.",
    },
    whyWrong: {
      b: "Several servers is an ordinary configuration; name conflicts are resolved at the application level.",
      c: "The protocol imposes no such limit.",
      d: "The model knows nothing about servers: it sees only the resulting tool set.",
    },
    explanation:
      "The \"host → many clients → many servers\" shape is built into the protocol. What is worth limiting is not the server count but the total number of tools in context.",
  },
  "td-3-q12": {
    prompt: "Put the steps of an agent using an MCP server's tool in order.",
    choices: {
      a: "The host application connects a client to the server and receives the tool list",
      b: "The tool definitions are sent to the model with the request",
      c: "The model returns a tool call",
      d: "The client executes the call on the server and returns the result to the model",
    },
    explanation:
      "In this chain the model never talks to the server directly: all network operations are performed by the client inside the host application.",
  },
  "td-3-q13": {
    prompt: "How does MCP differ from your service's ordinary REST API?",
    choices: {
      a: "MCP describes not just calls but how to present capabilities to a model: tools with descriptions, resources, templates.",
      b: "MCP is faster than REST.",
      c: "MCP needs no authorisation.",
      d: "MCP replaces HTTP.",
    },
    whyWrong: {
      b: "Speed depends on the implementation and transport, not on the protocol itself.",
      c: "Remote servers do require authorisation.",
      d: "One of MCP's transports runs precisely over HTTP.",
    },
    explanation:
      "REST describes endpoints for programs. MCP describes capabilities for a model — with descriptions that enter the context and influence its decisions.",
  },
  "td-3-q14": {
    prompt: "What is the host application's responsibility rather than the MCP server's?",
    choices: {
      a: "Managing the session and the conversation context.",
      b: "Choosing the model and request parameters.",
      c: "Applying permissions to tool calls.",
      d: "Implementing a specific tool's logic.",
      e: "Describing a tool's parameters.",
    },
    whyWrong: {
      d: "That is the server's job: it provides and executes the tools.",
      e: "Schemas are described by the server that provides those tools.",
    },
    explanation:
      "The boundary is simple: the server provides capabilities, the host decides how and under what conditions to use them. Permissions and context always stay on the application side.",
  },
  "td-3-q15": {
    scenario:
      "You connected two MCP servers and both expose a tool named `search`. The agent has started getting confused.",
    prompt: "What do you do?",
    choices: {
      a: "Disambiguate the names with a server prefix, or keep connected only the one the task needs.",
      b: "Rename the tool on the model's side.",
      c: "Add a prompt rule about which `search` to use when.",
      d: "Nothing: the model will work it out from the descriptions.",
    },
    whyWrong: {
      b: "The model does not rename tools: it sees what the application provided.",
      c: "A rule in prose competes with the descriptions and leaves the ambiguity inside the tool set itself.",
      d: "Identical names are exactly the situation in which it regularly errs.",
    },
    explanation:
      "A name conflict is a configuration problem and belongs in configuration. An unambiguous tool set is always cheaper than explaining things in the prompt.",
  },
  "td-3-q16": {
    prompt: "Can the model tell that a tool came from an MCP server?",
    choices: {
      a: "No: it sees an ordinary tool definition, like any other.",
      b: "Yes, MCP tools have a special type.",
      c: "Yes, if you enable a separate parameter.",
      d: "It depends on the transport.",
    },
    whyWrong: {
      b: "To the model they are the same tools; the delivery mechanism stays an application detail.",
      c: "No such parameter exists.",
      d: "Transport is a connection detail, invisible to the model.",
    },
    explanation:
      "MCP is a delivery mechanism, not a separate category for the model. That is why the quality of MCP tool descriptions matters just as much as your own.",
  },
  "td-3-q17": {
    prompt: "A local MCP server runs as a subprocess. With what privileges does it operate?",
    choices: {
      a: "Those of the process that launched it — that is, your user.",
      b: "Minimal privileges inside an isolated sandbox.",
      c: "The model's privileges.",
      d: "Administrator privileges.",
    },
    whyWrong: {
      b: "The protocol creates no sandbox: isolation must be provided separately.",
      c: "The model has no system privileges: it only composes calls.",
      d: "No privilege escalation occurs — it inherits the parent process's rights.",
    },
    explanation:
      "This matters when assessing a third-party server's risk: it has the same access you do, files and network included.",
  },
  "td-3-q18": {
    prompt: "When does MCP provide no advantage at all?",
    choices: {
      a: "When the integration is needed in exactly one application that you write yourself.",
      b: "When there are many integrations.",
      c: "When resources are needed rather than tools.",
      d: "When the server must be remote.",
    },
    whyWrong: {
      b: "Many integrations is, on the contrary, an argument for a shared protocol.",
      c: "Resources are a full part of the protocol.",
      d: "For remote servers MCP has a dedicated transport and authorisation.",
    },
    explanation:
      "MCP's value is portability. If there is one client and always will be, an ordinary function in code is cheaper and simpler to maintain.",
  },
  "td-4-q7": {
    prompt: "What happens if a request specifies `mcp_servers` but omits `mcp_toolset` in `tools`?",
    choices: {
      a: "The request is rejected as a validation error: the connector needs both halves.",
      b: "The server connects but its tools are unavailable.",
      c: "The tools are picked up automatically.",
      d: "The model asks you to add the toolset.",
    },
    whyWrong: {
      b: "No partial connection happens — the request simply fails validation.",
      c: "There is no automatic pickup: the toolset must be declared explicitly.",
      d: "The request never reaches the model: the error occurs earlier.",
    },
    explanation:
      "This is one of the most common mistakes when first wiring up the connector: the server list describes the connection, `mcp_toolset` enables its tools.",
  },
  "td-4-q8": {
    prompt: "What should be checked before connecting a third-party MCP server in production?",
    choices: {
      a: "Which actions it can perform and whether all of them are needed.",
      b: "Where the data it receives goes.",
      c: "What exactly its tool descriptions say.",
      d: "How many GitHub stars it has.",
      e: "Whether it uses the same programming language as your project.",
    },
    whyWrong: {
      d: "Popularity does not substitute for checking powers and description content.",
      e: "The implementation language affects neither security nor protocol compatibility.",
    },
    explanation:
      "A third-party server is both code in your environment and text in your prompt. Both sides need review, and neither is assessed by popularity.",
  },
  "td-4-q9": {
    prompt: "Your MCP server has a tool performing an expensive 30-second operation. How do you design the interaction?",
    choices: {
      a: "Return a result with a clear status and, if needed, split it into separate start and status-check tools.",
      b: "Block the call until completion with no signals at all.",
      c: "Cancel the operation if it runs longer than 10 seconds.",
      d: "Run the operation in the background and return nothing.",
    },
    whyWrong: {
      b: "Long silence looks like a hang to the agent and provokes repeated calls.",
      c: "That breaks a legitimate scenario instead of serving it properly.",
      d: "The agent learns neither the result nor that it started.",
    },
    explanation:
      "For long operations it matters that the agent understands the state. Splitting \"start\" and \"check\" lets it avoid blocking and avoid duplicate launches.",
  },
  "td-4-q10": {
    scenario:
      "An internal MCP server works reliably, but after an update two of its tools were renamed. Agents in three applications started making mistakes.",
    prompt: "How do you avoid this in future?",
    choices: {
      a: "Treat the tool set as a public API: do not rename without need, and keep compatibility for a transition period when you do.",
      b: "Notify the teams in chat before updating.",
      c: "Update all applications simultaneously with the server.",
      d: "Forbid server updates.",
    },
    whyWrong: {
      b: "A notification does not save agents already working with the old names.",
      c: "A synchronous release of several applications is hard and is itself a source of failures.",
      d: "That blocks development instead of making changes compatible.",
    },
    explanation:
      "An MCP server is a contract for several consumers. Renaming its tools is, for them, the same as changing a public API's signatures.",
  },
  "td-4-q11": {
    prompt: "Where in Claude Code do you describe an MCP server needed only by you personally?",
    choices: {
      a: "In the user scope via `claude mcp add` — then it never reaches the repository.",
      b: "In the project's `.mcp.json`.",
      c: "In CLAUDE.md.",
      d: "In environment variables.",
    },
    whyWrong: {
      b: "That file is committed: the server would appear for every colleague.",
      c: "Project memory is not connection configuration.",
      d: "Variables can pass parameters but do not describe the connection itself.",
    },
    explanation:
      "The same split as with settings: shared things go into the repository, personal ones into the user scope.",
  },
  "td-4-q12": {
    prompt: "Put the steps of designing an MCP server for an internal service in order.",
    choices: {
      a: "Determine which operations the agent genuinely needs",
      b: "Design tools with narrow schemas and constraints",
      c: "Decide the response format and structured errors",
      d: "Configure authorisation and limit the server's system privileges",
    },
    explanation:
      "Start from the operations that are needed rather than from the existing API: otherwise the server mirrors every endpoint, most of which the agent has no use for.",
  },
  "td-4-q13": {
    prompt: "An MCP server exposes 40 tools, of which the agent actually uses eight. What do you do?",
    choices: {
      a: "Keep the eight needed ones active and defer or remove the rest from this application's configuration.",
      b: "Nothing: unused tools do no harm.",
      c: "Split the server into five separate ones.",
      d: "Shorten the descriptions of the unused tools.",
    },
    whyWrong: {
      b: "They do harm: their descriptions sit in the context of every request and complicate selection.",
      c: "If all five are connected, the tool set in context is unchanged.",
      d: "That trims the volume slightly but leaves surplus tools in the choice set.",
    },
    explanation:
      "Every tool in the set costs tokens and adds another chance to err. The connection configuration should reflect what this particular application needs.",
  },
  "td-4-q14": {
    prompt: "What makes an MCP server convenient for several teams at once?",
    choices: {
      a: "Stable tool names and backward-compatible changes.",
      b: "Descriptions understandable without knowing the internal implementation.",
      c: "A clearly bounded set of operations with no duplication.",
      d: "The maximum number of tools for every eventuality.",
      e: "A tie-in to one specific client application.",
    },
    whyWrong: {
      d: "A bloated set complicates selection and inflates every consumer's context.",
      e: "That destroys portability — the protocol's main advantage.",
    },
    explanation:
      "A server for several teams lives by library rules: a stable contract, clear descriptions, nothing superfluous.",
  },
  "td-4-q15": {
    scenario:
      "An agent accesses the company document store through an MCP server. Security asks how to restrict a particular agent to a single section.",
    prompt: "Where should the restriction be implemented?",
    choices: {
      a: "On the server side, honouring the credentials the client connected with: the server must not return what is off-limits.",
      b: "In the agent's prompt.",
      c: "By filtering results in the host application.",
      d: "By limiting the number of tool calls.",
    },
    whyWrong: {
      b: "A prompt is not access control: it does not prevent calling the tool with any parameters.",
      c: "The data has already left the store; that is a late and unreliable line of defence.",
      d: "A call limit has nothing to do with which documents are accessible.",
    },
    explanation:
      "Access control over data belongs to whoever stores that data. The server must enforce the connection's rights rather than rely on client discipline.",
  },
  "td-4-q16": {
    prompt: "Why should an MCP server return structured errors, given that the model reads them anyway?",
    choices: {
      a: "That is exactly why: the model must understand the cause and choose the next step rather than guess from arbitrary prose.",
      b: "So they are convenient to log.",
      c: "It is a protocol requirement.",
      d: "To hide internal details.",
    },
    whyWrong: {
      b: "Logging is useful, but the error's main audience is the model inside the loop.",
      c: "The protocol does not dictate error content — that is a server design decision.",
      d: "Hiding details is useful, but it is a side effect rather than the goal.",
    },
    explanation:
      "An MCP tool error follows the same rules as any other: code, explanation, hint. The model is its primary consumer.",
  },
  "td-4-q17": {
    prompt: "You want the agent to see the contents of one specific configuration file but not to read arbitrary files. How do you do that through MCP?",
    choices: {
      a: "Expose that file as a resource, without providing a tool for reading arbitrary paths.",
      b: "Provide a file-reading tool with a path check in the prompt.",
      c: "Provide a reading tool and rely on the host application's permissions.",
      d: "Paste the file contents into the tool description.",
    },
    whyWrong: {
      b: "A check in the prompt is not a check: the path parameter remains arbitrary.",
      c: "A workable extra layer, but the server still exposes more capability than needed.",
      d: "The description does not update with the file and inflates the context.",
    },
    explanation:
      "A resource gives exactly what is needed and nothing beyond. A tool that reads arbitrary paths is a far wider capability than the task requires.",
  },
  "td-4-q18": {
    prompt: "What matters most for the quality of an agent's work with an MCP server?",
    choices: {
      a: "The quality of tool descriptions and schemas: they determine whether the model picks the right tool with the right arguments.",
      b: "The server's response speed.",
      c: "The language the server is written in.",
      d: "The number of tools provided.",
    },
    whyWrong: {
      b: "Speed affects latency but not correctness of choice.",
      c: "The implementation is invisible to the model.",
      d: "More tools tends to hurt selection quality rather than help it.",
    },
    explanation:
      "To the model an MCP server exists purely as descriptions and schemas. Everything else is infrastructure that does not shape its decisions.",
  },
  "td-b-q4": {
    scenario:
      "A startup wants to give an agent access to a payment provider: check payment status and, when needed, issue refunds. The team is small and there is a single application.",
    prompt: "How do you design the integration?",
    choices: {
      a: "Two separate tools: reading status is freely available, refunds go through an amount check in code and operator confirmation.",
      b: "A single `payment_action` tool with an action parameter.",
      c: "An MCP server for the payment provider.",
      d: "Give the agent the provider's API key and an HTTP request tool.",
    },
    whyWrong: {
      b: "Mixing reads and refunds makes permissions coarse: you must either allow everything or block useful reads.",
      c: "One application and one team — portability will not repay the maintenance of a server.",
      d: "That is the widest possible authority in the most sensitive system.",
    },
    explanation:
      "Splitting by risk gives precise permissions, and the amount check in code makes the financial rule independent of how the model read the situation.",
  },
  "td-b-q5": {
    scenario:
      'A company has an internal MCP server with 25 tools. A new product needs only three of them, but the team connects the whole server "just in case".',
    prompt: "Why is that a problem?",
    choices: {
      a: "22 surplus descriptions in every request: more tokens, worse tool selection and wider authority than required.",
      b: "The server will run slower.",
      c: "A version conflict will arise.",
      d: "Nothing is wrong: unused tools are free.",
    },
    whyWrong: {
      b: "Server speed does not depend on how many tools the client declares.",
      c: "Versions are irrelevant here: connecting the full set creates no conflicts.",
      d: "They are not free: the descriptions are paid for on every request and influence selection.",
    },
    explanation:
      "Connecting a server is a decision about both cost and security. The tool set should match the application's task rather than everything the server can do.",
  },
  "td-b-q6": {
    scenario:
      "A CRM integration is written as ten separate tools inside one application. Now it must be repeated in a second application, and later a third.",
    prompt: "When is it worth rewriting it as an MCP server?",
    choices: {
      a: "Now: the second consumer is the point where portability starts repaying the cost of a server.",
      b: "Never: copying code is simpler.",
      c: "Only when a tenth application appears.",
      d: "After the integration stabilises in a year.",
    },
    whyWrong: {
      b: "Three copies of an integration drift apart and require triple maintenance.",
      c: "By then a debt of desynchronised copies will have piled up.",
      d: "A year of duplication is exactly the cost you could avoid.",
    },
    explanation:
      "The rule is simple: one consumer means ordinary tools, two or more means a server. The second application is the threshold where MCP's cost begins to pay back.",
  },
  "td-b-q7": {
    scenario:
      'An agent is integrated with a ticketing system. After a new "close ticket" tool was added, it began closing tickets that are still in progress.',
    prompt: "What do you do first?",
    choices: {
      a: "Clarify in the description the criteria under which closing is appropriate, and add a status check in the tool's code.",
      b: "Remove the closing tool.",
      c: "Require operator confirmation for every closure.",
      d: "Lower the model's `effort`.",
    },
    whyWrong: {
      b: "That removes a useful capability instead of making it safe.",
      c: "A possible option, but first remove the ambiguity in the criteria themselves.",
      d: "Reasoning depth is unrelated to missing closure criteria.",
    },
    explanation:
      "Two levels work together: the description explains when the action is appropriate, and the code check prevents closing a ticket in an inadmissible status.",
  },
  "td-b-q8": {
    scenario:
      "You are choosing between a public MCP server for a popular service and your own thin integration with the two operations you need.",
    prompt: "What should factor into the decision?",
    choices: {
      a: "The scope of authority and descriptions that arrive with the public server, weighed against the maintenance cost of your own two tools.",
      b: "Only the public server's popularity.",
      c: "Only development speed.",
      d: "The language the server is written in.",
    },
    whyWrong: {
      b: "Popularity says nothing about authority or about what its descriptions put into your context.",
      c: "Speed to start ignores risk and maintenance cost.",
      d: "The implementation is invisible through the protocol and does not affect the choice.",
    },
    explanation:
      "A ready-made server saves time but brings someone else's authority and someone else's descriptions into your prompt. Two functions of your own are often cheaper than that price.",
  },
  "td-b-q9": {
    scenario:
      "An agent is integrated with three external services. One of them is periodically unavailable, and the whole agent stops working.",
    prompt: "How do you make the system more resilient?",
    choices: {
      a: "Isolate the failure: the unavailable service's tool returns a structured error and the agent continues without it where possible.",
      b: "Shut the agent down until the service recovers.",
      c: "Duplicate calls across all three services.",
      d: "Increase the timeouts.",
    },
    whyWrong: {
      b: "Partial unavailability should not stop scenarios that do not depend on that service.",
      c: "Duplication does not help when the needed data exists in only one of them.",
      d: "Waiting longer on an unavailable service merely lengthens the downtime.",
    },
    explanation:
      "One integration failing should not become the agent failing. A structured error gives the model a chance to take another route or to state the limitation honestly.",
  },
};
