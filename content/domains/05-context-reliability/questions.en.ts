import type { QuestionEn } from "@/lib/content/types";

/** Англійський дубль питань цього домену: id питання → переклад. */
export const questionsEn: Record<string, QuestionEn> = {
  // ── Level 1: Context window ─────────────────────────────────────────────
  "cr-1-q1": {
    prompt: 'Why is "just put everything in the context" a poor strategy even with a large window?',
    choices: {
      a: "Irrelevant material dilutes the model's attention and raises the cost of every request without adding quality.",
      b: "The API rejects requests above a certain size regardless of the model.",
      c: "Large contexts cannot be cached.",
      d: "The model only reads the beginning and the end of the context.",
    },
    whyWrong: {
      b: "The limit depends on the model, and the problem appears long before it — in quality and cost.",
      c: "The opposite: a large stable prefix is an ideal caching candidate.",
      d: "An oversimplification: the model works with the whole context, but excess noise degrades attention.",
    },
    explanation:
      "Context is a limited attention budget, not just capacity. The best results come from the smallest sufficient context, not the largest possible one.",
  },
  "cr-1-q2": {
    prompt: "How do you correctly count how many tokens your request will use?",
    choices: {
      a: "Call the API's token-counting endpoint with the same messages, system prompt and tools.",
      b: "Count with the `tiktoken` library.",
      c: "Divide the number of characters by four.",
      d: "Look at `usage` after the request completes.",
    },
    whyWrong: {
      b: "That is another vendor's tokenizer: for Claude models it gives wrong numbers.",
      c: "A crude heuristic that is badly off on code, non-English text and markup.",
      d: "It gives an exact number, but only after you have paid — planning against a limit needs an estimate beforehand.",
    },
    explanation:
      "Tokenizers differ between vendors and even between model generations. The only reliable way to know the size in advance is to ask the API to count it.",
  },
  "cr-1-q3": {
    prompt: "What counts towards a request's input tokens?",
    choices: {
      a: "Tool definitions together with their descriptions and schemas.",
      b: "The system prompt.",
      c: "The entire message history, including tool results.",
      d: "Only the last user message.",
      e: "Files on the project disk.",
    },
    whyWrong: {
      d: "The API is stateless: the history is sent in full with every request and is billed in full.",
      e: "A file enters the context only once it has been read and its contents added to a message.",
    },
    explanation:
      "Every request carries the whole context again. That is why cost grows quadratically in a long session, and why 30 tool definitions cost you on every request rather than once.",
  },
  "cr-1-q4": {
    scenario:
      "A support agent holds long conversations. By the 40th message the cost of a single request has grown fivefold, and the model starts confusing early order details.",
    prompt: "What do you do?",
    choices: {
      a: "Extract the key facts of the conversation into structured state and pass it compactly, compacting or clearing the old history.",
      b: "Trim the history to the last 10 messages.",
      c: "Move to a model with a larger window.",
      d: "Start a new conversation every 20 messages.",
    },
    whyWrong: {
      b: "A plain sliding window loses important early facts — the order number, the agreements — exactly the ones needed later.",
      c: "It raises the ceiling but cures neither the growing cost nor the diluted attention.",
      d: "The customer would have to repeat what they already said — degrading the product for technical convenience.",
    },
    explanation:
      "Long conversations need explicit state rather than hope in the history's memory. Extracted facts occupy hundreds of tokens instead of tens of thousands and are not lost to compaction.",
  },

  // ── Level 2: Prompt caching ─────────────────────────────────────────────
  "cr-2-q1": {
    prompt: "On what principle does prompt caching work?",
    choices: {
      a: "On prefix matching: any byte change in the prefix invalidates the cache for everything that follows it.",
      b: "On semantic similarity between requests.",
      c: "On a hash of the whole request.",
      d: "On individual content blocks regardless of their order.",
    },
    whyWrong: {
      b: "No semantics are involved: the match must be exact, byte for byte.",
      c: "Then the cache would only work for fully identical requests — useless in a conversation.",
      d: "Order is critical: rendering goes tools → system → messages, and the cache is tied to the prefix.",
    },
    explanation:
      "Hence the main composition rule: stable content in front, variable content behind. A single date or identifier at the start of the system prompt removes caching from the entire request.",
  },
  "cr-2-q2": {
    prompt: "What silently breaks caching?",
    choices: {
      a: "The current time or date in the system prompt.",
      b: "Non-deterministic key ordering when serialising tools.",
      c: "A tool set that changes from request to request.",
      d: "A long system prompt.",
      e: "Using streaming.",
    },
    whyWrong: {
      d: "Length is no obstacle — on the contrary, a large stable prefix produces the biggest saving.",
      e: "How you receive the response has no effect on caching of the input prefix.",
    },
    explanation:
      "All three are variations of the same mistake: something in the prefix changes. Diagnosis is simple — if `cache_read_input_tokens` is consistently zero on similar requests, look for an invisible invalidator.",
  },
  "cr-2-q3": {
    prompt: "How do you confirm that caching actually works?",
    choices: {
      a: "Check `usage.cache_read_input_tokens` in the response — on a hit it is greater than zero.",
      b: "Compare the response time with the previous request.",
      c: "Check whether the model's output changed.",
      d: "Caching works automatically; there is nothing to check.",
    },
    whyWrong: {
      b: "Latency is noisy: it depends on load and output length — an indirect and unreliable signal.",
      c: "The cache concerns the input prefix and does not guarantee an identical response.",
      d: "That is exactly why a broken cache can live for months: it fails silently, without errors.",
    },
    explanation:
      "There are three numbers in `usage`: `cache_creation_input_tokens` for writes, `cache_read_input_tokens` for hits, `input_tokens` for uncached. That is the only direct source of truth.",
  },
  "cr-2-q4": {
    scenario:
      "An assistant has a 20-thousand-token system prompt containing product documentation. Caching is enabled, but `cache_read_input_tokens` is almost always zero. The user's name is interpolated at the start of the prompt.",
    prompt: "What do you fix?",
    choices: {
      a: "Move the user's name after the cached block — for example into the user message — leaving the documentation as an unchanged prefix.",
      b: "Drop personalisation altogether.",
      c: "Increase the cache TTL to an hour.",
      d: "Split the documentation into several blocks with their own cache breakpoints.",
    },
    whyWrong: {
      b: "There is no need to sacrifice functionality: it is enough to move the variable part to the end.",
      c: "A longer TTL does not help if the prefix differs every time — the entries simply never match.",
      d: "It does not help: the variable name sits ahead of all of them and invalidates each one.",
    },
    explanation:
      "A classic case: one personalised phrase at the start nullifies the cache for 20 thousand tokens. Composition order is the first thing to check when hit counts are zero.",
  },

  // ── Level 3: Compaction and memory ──────────────────────────────────────
  "cr-3-q1": {
    prompt: "How does compaction differ from context editing?",
    choices: {
      a: "Compaction summarises earlier context, while context editing deletes it — for example old tool results or thinking blocks.",
      b: "They are two names for the same feature.",
      c: "Compaction runs on the client, context editing on the server.",
      d: "Context editing keeps a summary of what it removed.",
    },
    whyWrong: {
      b: "They are different mechanisms with different parameters and different consequences for the information.",
      c: "Both mechanisms are server-side and controlled by request parameters.",
      d: "It clears without summarising — summarising is what compaction does.",
    },
    explanation:
      "The difference is the cost of the loss: a summary preserves the substance in compressed form, clearing removes it completely. Old tool results are usually no loss to delete, while the course of the work is better summarised.",
  },
  "cr-3-q2": {
    prompt: "What is the typical mistake when using server-side compaction?",
    choices: {
      a: "Appending only the response text to the history instead of the whole `content` — the compaction blocks are lost and the state silently breaks.",
      b: "Enabling compaction too early.",
      c: "Using compaction together with caching.",
      d: "Forgetting to specify `max_tokens`.",
    },
    whyWrong: {
      b: "Enabling it early is harmless: the mechanism only fires as the threshold approaches.",
      c: "They are compatible; compaction changes the history and the cache simply rebuilds.",
      d: "That is a required parameter of any request, unrelated to compaction.",
    },
    explanation:
      "Compaction returns blocks in `content` that the API uses to replace the compacted history on the next step. Keeping only the `text` drops those blocks — no error, just a silent loss of context.",
  },
  "cr-3-q3": {
    prompt: "Which strategies let an agent work beyond its context window?",
    choices: {
      a: "Save intermediate results to files and return to them when needed.",
      b: "Delegate the reading volume to subagents and receive concise conclusions back.",
      c: "Summarise completed stages of the work into compact state.",
      d: "Increase `max_tokens` for the response.",
      e: "Lower `effort` so the model thinks less.",
    },
    whyWrong: {
      d: "That is the output ceiling, not the input context — it has nothing to do with a long session.",
      e: "It saves reasoning tokens but does not address the accumulated history.",
    },
    explanation:
      "Three approaches, all about the same thing: keep only what is current in the window and move the rest outside — into files, into subagents or into summaries.",
  },
  "cr-3-q4": {
    scenario:
      "A refactoring agent has been running for an hour. After automatic compaction it forgets that it already migrated three modules and starts migrating them again.",
    prompt: "What do you add?",
    choices: {
      a: "An external progress file the agent updates after each module and re-reads at the start of each stage.",
      b: "Disable compaction.",
      c: 'Add "remember what has already been done" to the prompt.',
      d: "Compact less frequently.",
    },
    whyWrong: {
      b: "Then the session simply hits the context limit — an hour-long task cannot finish that way.",
      c: "After compaction that information is no longer in the context — there is nothing to remember.",
      d: "It postpones the problem to a later point in the same session without removing it.",
    },
    explanation:
      "State that must survive compaction lives outside the context. A progress file is the simplest external memory: deterministic, visible to a human, and it survives even an agent restart.",
  },

  // ── Level 4: Retrieval and filtering ────────────────────────────────────
  "cr-4-q1": {
    prompt: "What does the just-in-time context approach mean?",
    choices: {
      a: "The agent pulls in the data it needs at the moment it needs it, instead of loading everything upfront.",
      b: "The context is updated in real time during generation.",
      c: "Data is cached before the request for speed.",
      d: "The model itself decides how many tokens to spend.",
    },
    whyWrong: {
      b: "The context does not change during generation — it is fixed at request time.",
      c: "That is caching — about cost and latency, not about context selectivity.",
      d: "That is about thinking and effort, not about data delivery.",
    },
    explanation:
      "Just-in-time is the opposite of preloading: instead of a knowledge-base dump, the agent gets search tools and pulls exactly what the current step needs.",
  },
  "cr-4-q2": {
    prompt: "When is preloading all the material into the context still justified?",
    choices: {
      a: "When the material is small, stable and needed in nearly every request — then it is also worth caching.",
      b: "When there is a great deal of material and search might miss something.",
      c: "When the model has a large context window.",
      d: "Never — retrieval is always better.",
    },
    whyWrong: {
      b: "Large volume is precisely what makes preloading the most expensive and the most damaging to quality.",
      c: "Possibility does not make it sensible: you pay for the whole volume on every request.",
      d: "For a small stable set, retrieval adds latency and a point of failure with no benefit.",
    },
    explanation:
      "Three criteria: small volume, stable content, needed almost always. Then a cached prefix is cheaper and more reliable than search; in every other case retrieval wins.",
  },
  "cr-4-q3": {
    prompt: "What improves retrieval quality for an agent?",
    choices: {
      a: "Return fragments with source metadata so they can be referenced.",
      b: "Allow the query to be refined with filters — by date, type, section.",
      c: "Limit the number of results by default, leaving room for a follow-up query.",
      d: "Return as many results as possible so nothing relevant is missed.",
      e: "Hide the relevance score from the model.",
    },
    whyWrong: {
      d: "It fills the context with noise; the useful signal drowns among dozens of irrelevant fragments.",
      e: "The score helps the model judge how much to trust the results and whether to refine the query.",
    },
    explanation:
      "A good search tool gives the model control: filters, a sensible limit and enough metadata to judge what was found and refine the query if needed.",
  },
  "cr-4-q4": {
    scenario:
      "An agent answers questions from documentation. It finds relevant fragments but often answers from an outdated version of a document, because every version is in the index.",
    prompt: "What do you fix?",
    choices: {
      a: "Add version and date metadata to the fragments, filter by the current version by default and show the date in the search output.",
      b: "Ask the model in the prompt to pick the newest one.",
      c: "Delete old versions from the index.",
      d: "Increase the number of search results.",
    },
    whyWrong: {
      b: "The model cannot choose by date if the date is not in the fragment it sees.",
      c: "Historical versions are sometimes exactly what is needed; losing data for the sake of a filter is too expensive.",
      d: "More mixed versions in the context will only deepen the confusion.",
    },
    explanation:
      "The model judges only by what it sees. Version metadata in the fragment plus a default filter move the currency decision out of guesswork and into the data.",
  },

  // ── Level 5: Reliability and errors ─────────────────────────────────────
  "cr-5-q1": {
    prompt: "How should API errors be handled in production code?",
    choices: {
      a: "Catch the SDK's typed error classes from most specific to most general, distinguishing retryable from non-retryable failures.",
      b: "Catch one general API error class.",
      c: "Check the error message text with string matching.",
      d: "Rely on the SDK's built-in retries and not handle errors at all.",
    },
    whyWrong: {
      b: "You lose the distinction between a 429 worth retrying and a 400 that is pointless to retry.",
      c: "Error texts change without warning — such a check breaks silently.",
      d: "The SDK retries a limited number of times and only certain classes; the rest reaches your code.",
    },
    explanation:
      "A chain of typed handlers separates the scenarios: 404 — fix the request, 429 — wait and retry, 5xx — back off, connection error — retry as well.",
  },
  "cr-5-q2": {
    prompt: "You received a 429. What do you do?",
    choices: {
      a: "Wait as indicated by the `retry-after` header and retry with exponential backoff and jitter.",
      b: "Retry immediately.",
      c: "Switch to a different model.",
      d: "Return the error to the user.",
    },
    whyWrong: {
      b: "An immediate retry deepens the overload and extends the throttling period.",
      c: "It does not always help, and it changes behaviour and discards the cache for the sake of a temporary problem.",
      d: "429 is an expected transient state that your code should handle, not something the user should see.",
    },
    explanation:
      "Jitter matters here no less than backoff: without it every client retries in lockstep and creates the next wave of throttling itself.",
  },
  "cr-5-q3": {
    prompt: "What should you log for observability of an agentic system?",
    choices: {
      a: "Token counts and cache metrics from each response's `usage` field.",
      b: "The `stop_reason` of every response.",
      c: "Tool calls, their arguments and their results.",
      d: "The API key, to correlate requests.",
      e: "The full text of all user data without limits.",
    },
    whyWrong: {
      d: "Secrets in logs are a security incident; use a request identifier for correlation.",
      e: "It creates privacy risk and bloats the logs; personal data is logged minimally and deliberately.",
    },
    explanation:
      "These three signals answer production's most frequent questions: why it is expensive (`usage`), why it was truncated or refused (`stop_reason`) and what the agent actually did (tool calls).",
  },
  "cr-5-q4": {
    prompt: 'A response was cut off with `stop_reason: "max_tokens"`. What does that mean and what do you do?',
    choices: {
      a: "The model hit the output limit — raise `max_tokens` and use streaming for long responses.",
      b: "The context ran out — the history needs trimming.",
      c: "The model finished its answer naturally.",
      d: "A safety filter fired.",
    },
    whyWrong: {
      b: "Overflowing the input context produces a request error, not this `stop_reason`.",
      c: "Natural completion is `end_turn`; `max_tokens` means a cut-off at the ceiling.",
      d: "A safety refusal arrives as `refusal` with `stop_details`.",
    },
    explanation:
      "A `max_tokens` set too low truncates the answer mid-sentence and forces a second request — the saving turns into a double charge. Large values require streaming, otherwise the request runs into the HTTP timeout.",
  },

  // ── Boss: Long-running agent ────────────────────────────────────────────
  "cr-b-q1": {
    scenario:
      "A data-migration agent runs for several hours. Once a week the process dies — network, a deployment, memory exhaustion — and the work starts from zero.",
    prompt: "What do you change in the architecture?",
    choices: {
      a: "Make progress durable: a checkpoint after each unit of work in external storage and resumption from the last checkpoint on restart.",
      b: "Increase timeouts and process resources.",
      c: "Split the work across five parallel agents.",
      d: "Rely on compaction so the session lives longer.",
    },
    whyWrong: {
      b: "It lowers the failure rate, but a multi-hour process without checkpoints will still eventually die — and again from zero.",
      c: "Parallelism shortens the wall-clock time, but a failure of one agent still loses its share of the work.",
      d: "Compaction manages context, not survival of a process crash.",
    },
    explanation:
      "For long-running processes the question is not \"will it crash\" but \"what happens afterwards\". Checkpoints with external state turn a catastrophe into a pause — and give visibility into progress along the way.",
  },
  "cr-b-q2": {
    scenario:
      "The monthly bill for a research agent has tripled. The logs show: the average request is 240 thousand input tokens, `cache_read_input_tokens` is almost always zero, and most of the tokens are results from a search tool that returns full documents.",
    prompt: "In what order do you tackle the optimisation?",
    choices: {
      a: "First shrink the tool output to relevant fragments, then stabilise the prefix for caching, and only then consider the model or effort.",
      b: "Immediately move the agent to a cheaper model.",
      c: "Lower `effort` to `low`.",
      d: "Move to the Batch API.",
    },
    whyWrong: {
      b: "That trades quality before the free wins are used: smaller tool output and a working cache cost nothing in quality.",
      c: "The same premature trade-off: the cost driver is input volume, not reasoning depth.",
      d: "Batch offers a discount but does not suit an interactive agent and does not remove the 240 thousand redundant tokens per request.",
    },
    explanation:
      "The optimisation order is constant: first the free wins — input-token hygiene and caching — and only then quality trade-offs such as a weaker model or lower effort.",
  },
  "cr-b-q3": {
    scenario:
      "A monitoring agent runs around the clock: it checks metrics, investigates anomalies and writes reports. It needs to remember previously investigated incidents without bloating the context.",
    prompt: "Which combination of mechanisms is appropriate?",
    choices: {
      a: "External memory with incident records plus search over it, compaction for long sessions, and a stable cached system prompt.",
      b: "Keep the entire incident history in the system prompt.",
      c: "Rely on compaction alone.",
      d: "Restart the agent every hour with a clean context.",
    },
    whyWrong: {
      b: "The history grows daily: the prefix becomes enormous, expensive and almost entirely irrelevant to any specific check.",
      c: "Compaction compresses the current session but gives no memory across sessions and restarts.",
      d: "A clean start means total amnesia: every anomaly is investigated as if for the first time.",
    },
    explanation:
      "A long-running agent needs a separation: standing instructions in a cached prefix, current work in the session context with compaction, accumulated knowledge in external memory with search.",
  },
};
