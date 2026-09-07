import type { QuestionEn } from "@/lib/content/types";

/** Англійський дубль додаткового пулу. */
export const questionsMoreEn: Record<string, QuestionEn> = {
  "cr-1-q5": {
    prompt: "Why does the cost of a long conversation grow faster than the number of messages?",
    choices: {
      a: "Every request carries the entire prior history, so total input tokens grow quadratically.",
      b: "The model gets more expensive with each call.",
      c: "Long conversations are processed more slowly and therefore cost more.",
      d: "Because of connection overhead.",
    },
    whyWrong: {
      b: "The rate does not change with the number of calls.",
      c: "You pay for tokens, not for processing time.",
      d: "Network overhead is negligible next to token cost.",
    },
    explanation:
      "The twentieth message pays for all nineteen before it. That is why long sessions need compaction, external state and discipline about tool response sizes.",
  },
  "cr-1-q6": {
    prompt: "What most often occupies the most space in an agent's context?",
    choices: {
      a: "Tool results that return whole documents or large lists.",
      b: "The accumulated history of a multi-turn conversation.",
      c: "Definitions of a large number of tools.",
      d: "The model name and request parameters.",
      e: "The JSON response format.",
    },
    whyWrong: {
      d: "That is a handful of tokens — it does not affect the volume.",
      e: "Response structure adds a negligible share next to the data itself.",
    },
    explanation:
      "The three main context consumers are tools, history and tool definitions. Optimisation always starts by measuring which of them dominates.",
  },
  "cr-1-q7": {
    prompt: "A request exceeded the model's context limit. What happens?",
    choices: {
      a: "The API returns a request error — there is no response at all.",
      b: "The model automatically trims the oldest messages.",
      c: 'The response comes back with `stop_reason: "max_tokens"`.',
      d: "Compaction kicks in.",
    },
    whyWrong: {
      b: "There is no automatic trimming: managing history is your responsibility.",
      c: "That applies to the output limit, not to input context overflow.",
      d: "Compaction is enabled by a parameter and works before the limit, not as an emergency mechanism.",
    },
    explanation:
      "Context overflow is a request-level error. That is why long sessions track volume in advance rather than relying on automatics.",
  },
  "cr-1-q8": {
    scenario:
      "An agent reads an 8000-line file to find one function. This happens dozens of times a day.",
    prompt: "What do you change?",
    choices: {
      a: "Provide a code-search tool that returns the needed fragment with surrounding context.",
      b: "Increase the model's context window.",
      c: "Cache the file's contents.",
      d: "Split the file into smaller ones.",
    },
    whyWrong: {
      b: "The file already fits; the problem is that 99% of what was read is unnecessary.",
      c: "The cache lowers cost, but the context is still clogged with irrelevant code.",
      d: "Refactoring code for an agent's convenience is expensive and not always appropriate.",
    },
    explanation:
      "Reading a whole file for one function is a classic waste of context. A search returning a fragment delivers the same knowledge for a fraction of the tokens.",
  },
  "cr-1-q9": {
    prompt: "What does the `usage` field in a response show?",
    choices: {
      a: "How many tokens went in and out, and what share of the input was served by the cache.",
      b: "How much context remains before the limit.",
      c: "The request processing time.",
      d: "The number of tools called.",
    },
    whyWrong: {
      b: "The remaining window is computed by you, knowing the model's limit and the request size.",
      c: "Latency is measured client-side; `usage` does not contain it.",
      d: "Calls are visible in the response blocks, not in token statistics.",
    },
    explanation:
      '`usage` is the basic observability tool: it answers both "why is this expensive" and "is the cache working".',
  },
  "cr-1-q10": {
    prompt: "Order the ways of fighting context overflow from cheapest to most expensive.",
    choices: {
      a: "Reduce the size of tool responses",
      b: "Remove unused tools from the set",
      c: "Enable compaction or clearing of old results",
      d: "Rebuild the architecture around subagents and external state",
    },
    explanation:
      "The first two steps change no behaviour and cost almost nothing. Architectural rebuilding is the last resort, once the simpler measures are exhausted.",
  },
  "cr-1-q11": {
    prompt: "Should tokens be counted before every request in production?",
    choices: {
      a: "Not before every one: track the accumulated volume and count precisely where the risk of nearing the limit is real.",
      b: "Yes, mandatorily before each request.",
      c: "No, never: `usage` after the response is enough.",
      d: "Only during development.",
    },
    whyWrong: {
      b: "That is an extra call per request — an excessive price for most scenarios.",
      c: "After the fact you learn about overflow from a request error.",
      d: "In production it is precisely long sessions that approach the limit.",
    },
    explanation:
      "A sensible strategy is to estimate accumulated volume from previous responses' `usage` and do an exact count only at risky points.",
  },
  "cr-1-q12": {
    prompt: "An agent works well, but every request carries 25 tool definitions of which three are used. What does that cost?",
    choices: {
      a: "Permanent surplus input tokens on every request plus worse tool selection.",
      b: "Nothing: unused tools are not billed.",
      c: "Only increased latency.",
      d: "A risk of validation errors.",
    },
    whyWrong: {
      b: "The whole input is billed, tool definitions included.",
      c: "Latency does grow, but the main cost is permanent tokens and harder selection.",
      d: "Validation applies to call arguments, not to which tools are present in the set.",
    },
    explanation:
      "Tool definitions are a fixed part of every request. Twenty-two surplus descriptions are paid for as many times as the agent makes calls.",
  },
  "cr-2-q5": {
    prompt: "In what order does the API build the request prefix for caching?",
    choices: {
      a: "`tools` → `system` → `messages`.",
      b: "`system` → `tools` → `messages`.",
      c: "`messages` → `system` → `tools`.",
      d: "The client determines the order.",
    },
    whyWrong: {
      b: "Tool definitions come first — which is exactly why their instability breaks the cache entirely.",
      c: "Messages are the most variable part; they always come last.",
      d: "The render order is fixed and does not depend on how you passed the fields.",
    },
    explanation:
      "Knowing the order explains why a varying tool set nullifies the cache for the whole request: it sits at the very start of the prefix.",
  },
  "cr-2-q6": {
    prompt: "The cache hits, but the saving is barely noticeable. What is the most likely cause?",
    choices: {
      a: "The stable prefix is too small: most tokens belong to the variable part of the request.",
      b: "The TTL is too short.",
      c: "The model does not support caching.",
      d: "Too many cache breakpoints.",
    },
    whyWrong: {
      b: "A short TTL would produce misses, not hits with small savings.",
      c: "Then there would be no hits at all.",
      d: "The number of breakpoints does not reduce the saving on what is already cached.",
    },
    explanation:
      "The cache saves exactly on the stable part. If it is a fifth of the request, a bigger saving was never possible.",
  },
  "cr-2-q7": {
    prompt: "What is a good candidate for caching?",
    choices: {
      a: "A large stable system prompt containing the rules.",
      b: "Reference material identical across all requests.",
      c: "A stable set of tool definitions.",
      d: "Search results for a specific request.",
      e: "The user's name and the current time.",
    },
    whyWrong: {
      d: "They change every time — there is nothing to cache.",
      e: "Those are classic invalidators: they go after the cache breakpoint.",
    },
    explanation:
      "You cache what is large and unchanging. Anything that varies from request to request belongs after the cached prefix.",
  },
  "cr-2-q8": {
    scenario:
      "A service handles requests with two different system prompts depending on the task type. Caching works poorly for both.",
    prompt: "What is probably happening?",
    choices: {
      a: "The prompts alternate, so each request fails to match the previous prefix — split the streams or stabilise a shared opening section.",
      b: "Caching does not work with two prompts at all.",
      c: "The prompts should be merged into one large one.",
      d: "The problem is the model.",
    },
    whyWrong: {
      b: "It does work: the cache holds different prefixes; the issue is how often each is hit.",
      c: "Merging would give you a cache but hurt quality: instructions for two tasks would compete.",
      d: "Cache behaviour is identical across models and depends on request structure.",
    },
    explanation:
      "The shared stable part goes first, the specific part after it: then both streams reuse the same cached opening.",
  },
  "cr-2-q9": {
    prompt: "How much does a cache write cost compared with an ordinary input token?",
    choices: {
      a: "Slightly more than ordinary input, but subsequent reads are far cheaper.",
      b: "The same as ordinary input.",
      c: "Nothing.",
      d: "More than output tokens.",
    },
    whyWrong: {
      b: "A write carries a premium — which is exactly why caching pays only with repeated requests.",
      c: "There are no free writes; the payback comes from later reads.",
      d: "Output tokens cost considerably more than any input.",
    },
    explanation:
      "The payback model is simple: the first request pays a write premium, later ones save on reads. Caching a one-off request makes no sense.",
  },
  "cr-2-q10": {
    prompt: "Put the steps of diagnosing a non-working cache in order.",
    choices: {
      a: "Check `cache_read_input_tokens` in the responses",
      b: "Find what exactly changes in the prefix between requests",
      c: "Move the variable part after the cache breakpoint",
      d: "Confirm hits appeared and the saving matches the prefix size",
    },
    explanation:
      'Diagnosis always starts with `usage`: without numbers it is easy to "fix" what already worked and miss the real invalidator.',
  },
  "cr-2-q11": {
    prompt: "Why is changing the tool set between requests especially damaging to the cache?",
    choices: {
      a: "Tool definitions sit at the start of the prefix, so any change devalues everything that follows.",
      b: "Tools are cached separately from the prompt.",
      c: "Each tool has its own TTL.",
      d: "Tools are not cached at all.",
    },
    whyWrong: {
      b: "There is no separate tool cache — it is all one prefix.",
      c: "TTL applies to the cached prefix, not to individual tools.",
      d: "They are cached as part of the prefix — which is why their stability matters.",
    },
    explanation:
      "This follows from the render order: everything after a changed block has to be rebuilt. That is why the tool set should stay deterministic.",
  },
  "cr-2-q12": {
    prompt: "When does caching make no sense?",
    choices: {
      a: "When every request is unique and there simply is no shared stable prefix.",
      b: "When the system prompt is very large.",
      c: "When there are a great many requests.",
      d: "When tools are used.",
    },
    whyWrong: {
      b: "A large stable prompt is the best caching candidate there is.",
      c: "The more similar requests there are, the greater the saving.",
      d: "Tools are cached along with the rest of the prefix.",
    },
    explanation:
      "The cache works on repetition. Without a shared opening there is nothing to reuse, and the write premium never pays back.",
  },
  "cr-3-q5": {
    prompt: "What is better cleared than summarised?",
    choices: {
      a: "Old tool results that no longer influence later decisions.",
      b: "The course of the work and the decisions taken.",
      c: "The original task statement.",
      d: "The rules from the system prompt.",
    },
    whyWrong: {
      b: "That is exactly what should be preserved in compressed form — otherwise the agent redoes what is done.",
      c: "Without it the agent loses the purpose of the work.",
      d: "The system prompt is not part of the history and is not cleared with it.",
    },
    explanation:
      "The difference between clearing and summarising is the cost of the loss. A dump of a read file can go without regret; the conclusion drawn from it cannot.",
  },
  "cr-3-q6": {
    prompt: "What should be stored in an agent's external state rather than in the context?",
    choices: {
      a: "Progress of a multi-step task: what is already done.",
      b: "Key facts gathered during the work.",
      c: "Identifiers of created or modified objects.",
      d: "The user's current question.",
      e: "System behaviour rules.",
    },
    whyWrong: {
      d: "That is part of the active conversation, not long-lived state.",
      e: "They live in the system prompt and enter the context every time.",
    },
    explanation:
      "Anything that must survive compaction or a restart is moved outside. The context remains working memory for the current step.",
  },
  "cr-3-q7": {
    prompt: "After compaction an agent repeats actions it already performed. What does that mean?",
    choices: {
      a: "The progress state existed only in the conversation history and disappeared with it.",
      b: "Compaction is working incorrectly.",
      c: "The model is ignoring the summary.",
      d: "The context window needs enlarging.",
    },
    whyWrong: {
      b: "Compaction compresses the history honestly; it is not obliged to preserve every fact.",
      c: "The model works with what it has; a fact absent from the summary does not exist.",
      d: "A larger window merely postpones the same problem.",
    },
    explanation:
      "Compaction always loses something — that is its nature. State critical to correctness must live in a file or store, not in the message history.",
  },
  "cr-3-q8": {
    scenario:
      "A support agent is in a dialogue with a customer. After compaction it forgets the order number given at the start and asks for it again.",
    prompt: "How do you fix that?",
    choices: {
      a: "Extract the dialogue's key entities into structured state and add it to the context as a compact block.",
      b: "Disable compaction.",
      c: "Ask the customer to repeat the number.",
      d: "Compact less often.",
    },
    whyWrong: {
      b: "Then long dialogues hit the context limit and break off entirely.",
      c: "That degrades the product for the sake of a technical limitation.",
      d: "The problem returns as soon as the dialogue grows longer.",
    },
    explanation:
      "Key entities — order number, name, promises — take dozens of tokens. Held in state, they survive any compaction.",
  },
  "cr-3-q9": {
    prompt: "Why must the whole response `content` be appended to the history with server-side compaction?",
    choices: {
      a: "It contains compaction blocks the API uses to replace the compacted history on the next step; without them state is lost with no error.",
      b: "Otherwise the API returns an error.",
      c: "To preserve the response formatting.",
      d: "To make caching work.",
    },
    whyWrong: {
      b: "There will be no error — which is exactly what makes the defect so insidious.",
      c: "Formatting has nothing to do with the compaction mechanism.",
      d: "Caching depends on the request prefix, not on compaction blocks.",
    },
    explanation:
      "This is the most common compaction integration bug: storing only the text. No error appears, and the context quietly degrades.",
  },
  "cr-3-q10": {
    prompt: "Put the steps of preparing an agent for a long session in order.",
    choices: {
      a: "Decide what state must survive compaction",
      b: "Move that state into external storage or a file",
      c: "Enable compaction or clearing of old results",
      d: "Verify recovery after a process restart",
    },
    explanation:
      "The restart check is mandatory: it immediately shows whether the state truly lives outside the context or only appears to.",
  },
  "cr-3-q11": {
    prompt: "Why is a progress file better than a summary in the context?",
    choices: {
      a: "It is deterministic, visible to a human and survives both compaction and a process restart.",
      b: "It is faster than reading the context.",
      c: "It costs no tokens.",
      d: "It updates automatically.",
    },
    whyWrong: {
      b: "Reading a file is another tool call; the gain is not in speed.",
      c: "A file that is read also enters the context and is billed.",
      d: "The agent updates it through explicit actions.",
    },
    explanation:
      "The value of external state is reliability and transparency. A human sees the progress and the agent can re-read it at any moment.",
  },
  "cr-3-q12": {
    prompt: "When is starting a new session better than compacting the current one?",
    choices: {
      a: "When the agent moves to an unrelated task: the old context only gets in the way, even compressed.",
      b: "When the context reaches half the window.",
      c: "When the agent made a mistake.",
      d: "After every hour of work.",
    },
    whyWrong: {
      b: "Half a window is no reason to lose the current task's work.",
      c: "A mistake is corrected within the task; a clean start would discard useful context too.",
      d: "Time alone does not make context unnecessary.",
    },
    explanation:
      "Compaction preserves the essence of the current work. If the work changed entirely there is nothing to preserve — and a clean context beats a compressed irrelevant one.",
  },
  "cr-4-q5": {
    prompt: "How many fragments should a search tool return by default?",
    choices: {
      a: "A small number of the most relevant ones, with a way to request more explicitly.",
      b: "All that exceed the relevance threshold.",
      c: "Exactly one — the best.",
      d: "As many as fit in the context window.",
    },
    whyWrong: {
      b: "The count becomes unpredictable: sometimes three fragments, sometimes three hundred.",
      c: "One fragment often does not cover the question and forces extra calls.",
      d: "A technical limit has nothing to do with relevance.",
    },
    explanation:
      "A sensible default limit keeps the context clean, while the option to ask for more prevents losing what is needed.",
  },
  "cr-4-q6": {
    prompt: "Which fragment metadata is useful to an agent?",
    choices: {
      a: "The source: document name and section.",
      b: "The date or version of the material.",
      c: "A relevance score.",
      d: "The internal record identifier in the vector store.",
      e: "The search query's execution time.",
    },
    whyWrong: {
      d: "A technical identifier tells the model nothing about content or trustworthiness.",
      e: "That is a performance metric, not information for a decision.",
    },
    explanation:
      "Metadata lets the model not just read a fragment but assess it: how fresh it is, where it came from and whether to trust it.",
  },
  "cr-4-q7": {
    prompt: 'An agent searches, does not find what it needs and immediately answers "there is no information". What do you improve?',
    choices: {
      a: "Return a hint about possible query refinements, so the agent tries another formulation before giving up.",
      b: 'Forbid answering "there is no information".',
      c: "Increase the number of results.",
      d: "Lower the relevance threshold.",
    },
    whyWrong: {
      b: "That pushes the model to invent instead of answering honestly.",
      c: "More irrelevant fragments bring you no closer to the needed one.",
      d: "That fills the context with noise and raises the risk of wrong conclusions.",
    },
    explanation:
      "An empty result should suggest a next step. Then the agent makes one meaningful refinement attempt instead of a premature refusal or a loop.",
  },
  "cr-4-q8": {
    scenario:
      "Retrieval returns relevant fragments, but the agent often answers from one of them while ignoring a second, contradictory one.",
    prompt: "What do you do?",
    choices: {
      a: "Explicitly require in the prompt that fragments be cross-checked and contradictions reported with references to both sources.",
      b: "Return only the single most relevant fragment.",
      c: "Remove one of the contradictory documents from the base.",
      d: "Increase the number of fragments.",
    },
    whyWrong: {
      b: "That hides the contradiction instead of surfacing it.",
      c: "The contradiction may be legitimate: different policy versions for different cases.",
      d: "More material without an instruction to cross-check only raises the chance of picking at random.",
    },
    explanation:
      "The model is not obliged to look for contradictions unless asked. An explicit cross-check requirement turns a source conflict from a hidden error into visible information.",
  },
  "cr-4-q9": {
    prompt: "Why should a fragment be returned with surrounding context rather than just the matched line?",
    choices: {
      a: "An isolated line often cannot be interpreted correctly without the neighbouring text.",
      b: "It is cheaper that way.",
      c: "The response format requires it.",
      d: "To improve search relevance.",
    },
    whyWrong: {
      b: "A wider fragment costs more tokens — it is a deliberate trade for correctness.",
      c: "You define the format; this is about usefulness, not a requirement.",
      d: "The size of the returned fragment does not affect the quality of the search itself.",
    },
    explanation:
      "A condition without its `if`, a definition without its signature, a sentence without its paragraph — all are sources of wrong conclusions. A little surrounding context pays for itself in accuracy.",
  },
  "cr-4-q10": {
    prompt: "Put the steps of an agent working on the just-in-time context principle in order.",
    choices: {
      a: "State what information is missing for the next decision",
      b: "Run a targeted search with filters",
      c: "Assess the relevance of what was found using metadata",
      d: "Fetch the full material only for what is genuinely needed",
    },
    explanation:
      "The key difference from preloading is that context is gathered for a specific decision rather than just in case.",
  },
  "cr-4-q11": {
    prompt: "A knowledge base contains both current and archived documents. How do you design the search?",
    choices: {
      a: "Search current documents by default, with an explicit parameter for reaching the archive.",
      b: "Search everything and rely on the model.",
      c: "Delete the archive.",
      d: "Create a separate tool for each year.",
    },
    whyWrong: {
      b: "Without an explicit currency marker the model chooses by text relevance rather than by freshness.",
      c: "Historical documents are sometimes needed; deletion is too drastic.",
      d: "That bloats the tool set instead of using one filter parameter.",
    },
    explanation:
      "A safe default plus an explicit way to step outside it is the standard pattern. The model gets current material effortlessly, while the archive stays deliberately available.",
  },
  "cr-4-q12": {
    prompt: "Which is better: one search tool across all sources, or a separate tool per source?",
    choices: {
      a: "One tool with a source parameter: fewer definitions in context and a simpler choice for the model.",
      b: "A separate tool per source — it is more precise.",
      c: "A separate tool, because the sources have different formats.",
      d: "It depends on the model.",
    },
    whyWrong: {
      b: "Precision comes from filters and the index, not from the number of tools.",
      c: "Different formats are normalised inside the tool, keeping a single interface.",
      d: "This is a tool-design decision, identical for any model.",
    },
    explanation:
      "Every extra tool costs tokens and adds another decision for the model. A source parameter offers the same flexibility without inflating the set.",
  },
  "cr-5-q5": {
    prompt: "What do you do with a 400 error from the API?",
    choices: {
      a: "Do not retry: the request is malformed and a retry gives the same error — the request itself must be fixed.",
      b: "Retry with exponential backoff.",
      c: "Retry with a different model.",
      d: "Ignore it and continue.",
    },
    whyWrong: {
      b: "Backoff is meant for transient problems; a malformed request stays malformed.",
      c: "An error in the request's shape does not disappear by changing model.",
      d: "Ignoring leaves the system with neither a result nor diagnostics.",
    },
    explanation:
      "Separating retryable from non-retryable errors is the foundation of reliability. Retrying a 400 guarantees wasted requests.",
  },
  "cr-5-q6": {
    prompt: 'What should be done on `stop_reason: "refusal"`?',
    choices: {
      a: "Check `stop_details` before reading the response content.",
      b: "Handle the case in code as a distinct scenario rather than an ordinary answer.",
      c: "Record the event to analyse how often it occurs.",
      d: "Automatically retry the identical request.",
      e: "Show the raw response content to the user.",
    },
    whyWrong: {
      d: "Repeating an identical request will most likely give the same outcome.",
      e: "On a refusal the content may be empty or uninformative.",
    },
    explanation:
      "`stop_details` is populated only on a refusal, so checking `stop_reason` must precede reading the content. The case itself deserves its own handling branch.",
  },
  "cr-5-q7": {
    prompt: "The SDK client has a default timeout of 10 minutes. Why does that matter?",
    choices: {
      a: "Together with retries the actual wait can reach tens of minutes — that must be accounted for in your own limits.",
      b: "It is the smallest possible timeout.",
      c: "After it the request continues asynchronously.",
      d: "It applies only to streaming.",
    },
    whyWrong: {
      b: "The timeout is configurable downwards too.",
      c: "There is no asynchronous continuation: the request is simply aborted.",
      d: "The client timeout applies to any request.",
    },
    explanation:
      "Timeouts multiply with retries. In a service with its own SLA that means your external boundaries must be tighter than the SDK defaults.",
  },
  "cr-5-q8": {
    scenario:
      "A service has traffic peaks during which the share of 429s rises to 20%. Retries are configured, but users complain about delays.",
    prompt: "What do you change?",
    choices: {
      a: "Add a queue with controlled send rate so you stop creating the peaks yourself, and show the user a waiting status.",
      b: "Increase the number of retries.",
      c: "Remove jitter so retries are more predictable.",
      d: "Ignore 429 and show an error.",
    },
    whyWrong: {
      b: "More retries during a peak only lengthens the queue and worsens delays.",
      c: "Without jitter clients synchronise and amplify the peak.",
      d: "That shifts a transient problem onto the user.",
    },
    explanation:
      "Retries cure isolated failures, not a systematic breach of throughput. Controlling the send rate removes the cause rather than the symptom.",
  },
  "cr-5-q9": {
    prompt: "Why not catch all API errors with one general handler?",
    choices: {
      a: "You lose the distinction between what is worth retrying and what must be fixed — and the system reacts identically to different situations.",
      b: "A general handler is slower.",
      c: "The SDK does not permit it.",
      d: "It makes logging harder.",
    },
    whyWrong: {
      b: "Exception-handling speed is irrelevant here.",
      c: "Technically it is permitted — the question is handling quality.",
      d: "You can log from a general handler too; the problem is the reaction.",
    },
    explanation:
      "Typed error classes exist so code can behave differently: wait and retry, fix the request, or signal unavailability.",
  },
  "cr-5-q10": {
    prompt: "Put the steps of handling a failed model call in production in order.",
    choices: {
      a: "Identify the error type from the SDK's typed class",
      b: "Decide whether a retry makes sense",
      c: "Retry with backoff and jitter, or propagate the error",
      d: "Record the event with context for analysis",
    },
    explanation:
      "Classification determines everything that follows. Without it the system either retries the hopeless or gives up where a second's wait would have sufficed.",
  },
  "cr-5-q11": {
    prompt: "Why log the `stop_reason` of every response?",
    choices: {
      a: "It is the fastest way to see systematic `max_tokens` truncations or refusals that otherwise go unnoticed.",
      b: "It is needed for billing.",
      c: "Caching does not work without it.",
      d: "It is an API requirement.",
    },
    whyWrong: {
      b: "Cost is computed from tokens in the `usage` field.",
      c: "Caching does not depend on logging.",
      d: "The API imposes no logging requirements.",
    },
    explanation:
      "A truncated response looks like an ordinary one until somebody checks `stop_reason`. Logging makes that class of defect visible in your metrics.",
  },
  "cr-5-q12": {
    prompt: "When is streaming mandatory?",
    choices: {
      a: "When `max_tokens` is large: otherwise a long response risks running into the HTTP timeout.",
      b: "When maximum accuracy is needed.",
      c: "When caching is enabled.",
      d: "When tools are used.",
    },
    whyWrong: {
      b: "How the response is received does not affect its quality.",
      c: "Caching works independently of streaming.",
      d: "Tools work without streaming too.",
    },
    explanation:
      "Streaming is not only about UX: for large `max_tokens` values it is a technical requirement, otherwise the request aborts on timeout.",
  },
  "cr-b-q4": {
    scenario:
      "A document-indexing agent runs overnight. After failing on document 4000 of 5000, the next run starts from the first one.",
    prompt: "What do you add?",
    choices: {
      a: "Mark processed documents in external storage and take only the unprocessed ones at startup.",
      b: "Increase the process's memory.",
      c: "Split the task into five runs of a thousand each.",
      d: "Write the progress into the agent's context.",
    },
    whyWrong: {
      b: "That reduces the failure rate but does not change the behaviour after the next one.",
      c: "Each of them would still start from zero after a failure inside itself.",
      d: "Context does not survive a process restart.",
    },
    explanation:
      "An idempotent pass over the list of unprocessed items is the standard solution for batch work: a failure becomes a pause rather than the loss of a whole night.",
  },
  "cr-b-q5": {
    scenario:
      "A round-the-clock monitoring agent has accumulated so much external memory in a month that a search returns dozens of similar incidents for any query.",
    prompt: "What do you do?",
    choices: {
      a: "Add structure: categories, statuses and dates, and limit the default search to a relevant period and open cases.",
      b: "Clear the memory and start over.",
      c: "Return more results per query.",
      d: "Move the memory into the system prompt.",
    },
    whyWrong: {
      b: "That discards the accumulated knowledge — the very thing the memory was built for.",
      c: "The problem is precisely the surplus of similar results.",
      d: "A month of incident history would not fit and does not belong there.",
    },
    explanation:
      "External memory without structure degrades just as context does. Metadata and sensible search defaults keep it useful over the long run.",
  },
  "cr-b-q6": {
    scenario:
      "An agent has run continuously for a week. Cost grows daily although the volume of work is unchanged. `cache_read_input_tokens` is high and stable.",
    prompt: "Where do you look for the cause?",
    choices: {
      a: "In the accumulated session history: the cache works, but the context volume itself grows every day.",
      b: "In caching: it has probably broken.",
      c: "In the model's pricing.",
      d: "In the number of tools.",
    },
    whyWrong: {
      b: "The cache metrics are high — that is precisely the part working correctly.",
      c: "Pricing does not change by itself over a week.",
      d: "The tool set is constant and does not explain daily growth.",
    },
    explanation:
      "The cache saves on the stable part but does not stop the variable part growing. A week-long session needs compaction or a periodic restart carrying the state forward.",
  },
  "cr-b-q7": {
    scenario:
      "A long-running agent must recover after a crash. The team is debating what to store: the full message history or extracted state.",
    prompt: "What do you choose?",
    choices: {
      a: "Extracted state: it is compact, understandable to a human and does not drag along all the accumulated noise.",
      b: "The full history: that way the agent recovers exactly.",
      c: "Store nothing and start over.",
      d: "Store only the last ten messages.",
    },
    whyWrong: {
      b: "Recovery would restore all the unnecessary context too, along with the cost it carries.",
      c: "That is the very problem being solved.",
      d: "An arbitrary window loses early facts that may be critical.",
    },
    explanation:
      "Recovering from state gives a clean context with the facts you need. Recovering from history reproduces everything you should have shed.",
  },
  "cr-b-q8": {
    scenario:
      "An agent performing a long task hits a 429 every few hours because of rate limits. At present it simply stops with an error.",
    prompt: "How do you make it more resilient?",
    choices: {
      a: "Treat 429 as a transient state: wait as indicated by `retry-after`, resume from the last checkpoint and record the pause in the log.",
      b: "Halve the call rate permanently.",
      c: "Restart the task from scratch after every 429.",
      d: "Ignore the error and continue.",
    },
    whyWrong: {
      b: "That doubles the task's runtime for a problem occurring every few hours.",
      c: "Losing all completed work over a temporary limit is the most expensive possible reaction.",
      d: "The request did not execute; continuing on incomplete data yields a wrong result.",
    },
    explanation:
      "A long-running agent must survive transient limits. A pause with checkpoint recovery turns a 429 into a delay rather than a failed task.",
  },
};
