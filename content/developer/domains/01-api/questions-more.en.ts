import type { QuestionEn } from "@/lib/content/types";

/** Англійський дубль додаткового пулу. */
export const questionsMoreEn: Record<string, QuestionEn> = {
  // ── da-1: Messages API (additional pool) ─────────────────────────────────
  "da-1-q9": {
    prompt: "Which headers does a raw HTTP request to the Messages API need when using an API key?",
    choices: {
      a: "`Authorization: Bearer <key>` and `content-type: application/json`",
      b: "`x-api-key` and `anthropic-model`",
      c: "Only `x-api-key`: the SDK adds the rest.",
      d: "`x-api-key`, `anthropic-version` and `content-type: application/json`",
    },
    whyWrong: {
      a: "An API key goes in `x-api-key`; `Authorization: Bearer` is for OAuth tokens, and without `anthropic-version` the request still fails.",
      b: "The model is set in the request body with `model`; there is no `anthropic-model` header.",
      c: "The question is about raw HTTP: without an SDK nobody adds `anthropic-version` for you.",
    },
    explanation:
      "The key goes in `x-api-key`, the API version in `anthropic-version` (for example `2023-06-01`), and the body is JSON. The SDK sets these headers automatically.",
  },
  "da-1-q10": {
    prompt: "What does the `anthropic-version: 2023-06-01` header pin?",
    choices: {
      a: "The version of the API's format and behaviour, so protocol changes do not break your client.",
      b: "The model snapshot released before that date.",
      c: "The date until which your API key is valid.",
      d: "The set of enabled beta features.",
    },
    whyWrong: {
      b: "The `model` field selects the model; the version header has no effect on which model answers.",
      c: "Key validity has nothing to do with this header.",
      d: "Beta features are enabled with a separate `anthropic-beta` header.",
    },
    explanation:
      "`anthropic-version` is the API contract version, not the model's. Beta capabilities are enabled by `anthropic-beta`, the model by the `model` field in the body.",
  },
  "da-1-q11": {
    prompt: "How do you send an image from disk in a Messages API request?",
    choices: {
      a: "Attach the file as multipart/form-data to the same request.",
      b: "Paste the base64 string into a text block after the word `image:`.",
      c: "Add a block `{\"type\": \"image\", \"source\": {\"type\": \"base64\", \"media_type\": \"image/png\", \"data\": data}}` to `content`.",
      d: "Put the base64 in the `system` parameter.",
    },
    whyWrong: {
      a: "The Messages API accepts only JSON; binary data is embedded in the body as base64 or referenced.",
      b: "The model receives it as text, not as an image, and thousands of tokens are wasted.",
      d: "An image is a block in message `content`, not part of the system prompt.",
    },
    explanation:
      "An image is a separate `image` block with a `base64` source (plus `media_type`) or a `url`. It goes in the `user` message `content`, usually before the text question.",
  },
  "da-1-q12": {
    scenario:
      "A service must answer questions about a 40-page PDF contract. The code currently extracts text with a library and loses tables and structure.",
    prompt: "Which way of sending the document is better?",
    choices: {
      a: "Send the PDF as a `document` block with `media_type: \"application/pdf\"` in base64, before the text question.",
      b: "Send every page as a separate request and join the answers.",
      c: "Paste the PDF as base64 into a text block.",
      d: "Convert the PDF into one huge image.",
    },
    whyWrong: {
      b: "Contract questions often span several pages; separate requests lose the links between them.",
      c: "The model does not parse base64 in text as a document — it is just a string of characters.",
      d: "A huge image gets downscaled and text becomes unreadable; the `document` block handles pages itself.",
    },
    explanation:
      "A `document` block gives the model both the text and the visual layout of the pages, so tables and structure survive. The document goes before the question in one `user` message.",
  },
  "da-1-q13": {
    prompt: "What does a Messages API response object contain?",
    choices: {
      a: "A `conversation_id` for continuing the conversation",
      b: "The full conversation history including the new reply",
      c: "`stop_reason` — why the model stopped",
      d: "`usage` with input and output token counts",
      e: "`id`, `role: \"assistant\"` and `model`",
    },
    whyWrong: {
      a: "There is no such field: the API does not store the conversation; continuing means a new request with the full history.",
      b: "Only the new `assistant` message is returned; you assemble the history.",
    },
    explanation:
      "The response is a single `assistant` message: `id`, `model`, a `content` array, `stop_reason`, `stop_sequence` and `usage`. There is no server-side conversation state.",
  },
  "da-1-q14": {
    prompt: "Where does the Python `anthropic.Anthropic()` client get the API key when none is passed explicitly?",
    choices: {
      a: "From a `.anthropic` file in the home directory; there are no other sources.",
      b: "Nowhere: without an `api_key` argument the constructor raises.",
      c: "From the first message in `messages`.",
      d: "From the `ANTHROPIC_API_KEY` environment variable.",
    },
    whyWrong: {
      a: "The SDK reads no such fixed file; the main source is an environment variable.",
      b: "The no-argument constructor is the recommended way: the SDK finds credentials in the environment itself.",
      c: "Credentials are never passed in message content.",
    },
    explanation:
      "The SDK reads the key from `ANTHROPIC_API_KEY`, so it never has to be hard-coded or committed. An explicit `api_key=` is needed only when the key comes from another secret store.",
  },
  "da-1-q15": {
    prompt: "How does `\"content\": \"Hi\"` differ from `\"content\": [{\"type\": \"text\", \"text\": \"Hi\"}]`?",
    choices: {
      a: "A string sends the text as a system instruction, an array as a turn.",
      b: "Nothing essential: a string is shorthand for a single text block; an array is needed for several blocks, images or `cache_control`.",
      c: "A string is tokenised more cheaply.",
      d: "Arrays are allowed only in `assistant` messages.",
    },
    whyWrong: {
      a: "The role is set by the `role` field, not by the shape of `content`.",
      c: "The same text is tokenised; the difference is only the JSON shape.",
      d: "An array of blocks is the main form for `user` too: that is how images and `tool_result` are sent.",
    },
    explanation:
      "A string `content` is equivalent to an array with one `text` block. An array is needed to mix block types or mark a block with `cache_control`.",
  },
  "da-1-q16": {
    scenario:
      "In an assistant app, each next message in a long conversation costs noticeably more than the last, although users type short messages.",
    prompt: "What explains the growth and how do you contain it?",
    choices: {
      a: "Every request carries the full history as input tokens; prompt caching of the stable prefix and compressing or trimming old turns help.",
      b: "The model \"thinks\" longer in a long conversation; lower `max_tokens`.",
      c: "The API adds a surcharge for session length.",
      d: "It is a counting bug: restarting the SDK client resets the counter.",
    },
    whyWrong: {
      b: "`max_tokens` caps only the output; the growth comes from the history's input tokens.",
      c: "There are no sessions in the API; you pay only for the tokens of each request.",
      d: "There is no client-side counter; `usage` reflects the real size of each request.",
    },
    explanation:
      "A stateless history means turn N contains all previous turns, so total cost grows roughly quadratically. Caching makes the repeated prefix cheaper, and compression keeps the history compact.",
  },
  "da-1-q17": {
    prompt: "The request returns a 400. What is wrong with it?",
    choices: {
      a: "Ukrainian text in `content` requires a separate `language` parameter.",
      b: "`max_tokens=512` is too small for this model.",
      c: "The `system` parameter is missing.",
      d: "The `messages` array must start with a `user` message.",
    },
    whyWrong: {
      a: "There is no `language` parameter; the model handles any language in the text.",
      b: "A small `max_tokens` does not cause a 400; it can only truncate the reply with `stop_reason: \"max_tokens\"`.",
      c: "`system` is optional.",
    },
    explanation:
      "A Messages API conversation starts with a user turn. If the model needs the bot's greeting, describe it in `system` or move it into the first `user` message.",
  },
  "da-1-q18": {
    prompt: "Order the steps to ask the model about a screenshot on disk.",
    choices: {
      a: "Read the file's bytes",
      b: "Encode them as base64 without line breaks",
      c: "Build an `image` block with `media_type` and `data`",
      d: "Put the `image` block, followed by the text question, into the `user` message `content`",
      e: "Call `messages.create`",
    },
    explanation:
      "Binary data enters the JSON as base64 in an `image` block with the correct `media_type`. Image before question is the recommended order within `content`.",
  },
  "da-1-q19": {
    prompt: "What is true about the `system` parameter?",
    choices: {
      a: "It can be a string or an array of text blocks.",
      b: "It is billed as input tokens on every request.",
      c: "The server keeps it between requests, so you send it only once.",
      d: "It takes no space in the context window.",
      e: "You can put `cache_control` on its text block.",
    },
    whyWrong: {
      c: "The API is stateless: `system` must be sent with every request.",
      d: "The system prompt is part of the input and takes context just like messages.",
    },
    explanation:
      "`system` is an ordinary part of the input: it takes context and costs tokens every time. The array-of-blocks form lets you cache a large, stable system prompt.",
  },
  "da-1-q20": {
    scenario:
      "A team is porting a chat from another LLM API, where the system instruction was the first array message with role `system`. After switching to the Anthropic SDK, requests fail with a 400.",
    prompt: "What change is needed?",
    choices: {
      a: "Rename the role to `developer`.",
      b: "Merge the instruction into the first `assistant` message.",
      c: "Move the instruction into the `system` parameter and keep only `user`/`assistant` in `messages`.",
      d: "Add the header `anthropic-beta: system-role`.",
    },
    whyWrong: {
      a: "The Messages API has no `developer` role; the dialogue is built from `user` and `assistant` messages.",
      b: "The conversation must start with `user`, and instructions inside an assistant turn lack system-prompt status.",
      d: "No such beta flag exists; the main system prompt already has its own field.",
    },
    explanation:
      "The Messages API separates the operator instruction (`system`) from the dialogue (`messages`). When porting from other APIs, this is the most common cause of a 400.",
  },
  // ── da-2: Models and parameters (additional pool) ────────────────────────
  "da-2-q9": {
    prompt: "Old code enables thinking with `thinking={\"type\": \"enabled\", \"budget_tokens\": 8000}`. What happens on `claude-sonnet-5`?",
    choices: {
      a: "The parameter is silently ignored, and the model answers without thinking.",
      b: "The budget is automatically converted to `effort: \"medium\"`.",
      c: "The model will think for exactly 8000 tokens.",
      d: "The API returns a 400; switch to `thinking: {type: \"adaptive\"}` and control depth with `effort`.",
    },
    whyWrong: {
      a: "The obsolete form is not silently ignored; it is rejected with an error.",
      b: "There is no auto-conversion; the migration must be done in code.",
      c: "Even on older models the budget was a ceiling, not an exact count; on this model the form is not accepted at all.",
    },
    explanation:
      "A fixed `budget_tokens` has been removed on the newest models. Adaptive thinking decides how much to think, and `effort` sets the overall depth.",
  },
  "da-2-q10": {
    scenario:
      "An agent with thinking enabled calls tools. To save tokens, the code strips `thinking` blocks from the `assistant` reply before the next request, keeping only `text` and `tool_use`.",
    prompt: "What is correct?",
    choices: {
      a: "It is a safe optimisation: thinking is needed for one turn only.",
      b: "Replace the `thinking` blocks with a text summary of the reasoning.",
      c: "Pass the `thinking` blocks back unchanged together with the rest of `content`.",
      d: "Disable thinking on turns with tools.",
    },
    whyWrong: {
      a: "In the middle of a tool loop the model relies on its earlier reasoning; stripping it breaks continuation.",
      b: "Altered or substituted thinking blocks fail signature verification; they are passed only unchanged.",
      d: "That treats the symptom at the cost of quality; the right fix is simply not to touch the blocks.",
    },
    explanation:
      "`thinking` blocks carry a signature and belong to the model's turn. In a tool-use loop they are returned together with `tool_use`, unchanged — simplest is to append `response.content` whole.",
  },
  "da-2-q11": {
    prompt: "The reply stopped mid-sentence with `stop_reason: \"max_tokens\"`. What does that mean?",
    choices: {
      a: "The model hit the `max_tokens` ceiling and did not finish; raise it or shrink the task.",
      b: "The model's context window is exhausted; switch models.",
      c: "The model decided the answer was complete.",
      d: "A server error occurred; retry the request unchanged.",
    },
    whyWrong: {
      b: "This is the output limit from your request, not context overflow.",
      c: "A natural finish is marked `end_turn`.",
      d: "This is a successful 200 response; retrying with the same `max_tokens` gives the same truncation.",
    },
    explanation:
      "`max_tokens` is a hard ceiling. Code must check `stop_reason` before using the result: truncated JSON or code cannot simply be parsed.",
  },
  "da-2-q12": {
    prompt: "How do you find a model's context window and maximum output programmatically?",
    choices: {
      a: "Read the `context_window` field from any Messages API response.",
      b: "Call the Models API (`GET /v1/models/{id}`) and read `max_input_tokens` and `max_tokens`.",
      c: "Send a request with a huge `max_tokens` and read the error text.",
      d: "Derive it from the model name: the number in it is the window size in thousands of tokens.",
    },
    whyWrong: {
      a: "A Messages API response has no such field.",
      c: "Parsing error text is brittle and wastes requests; there is a dedicated API for this.",
      d: "The number in the name is the model version, not the window size.",
    },
    explanation:
      "The Models API returns a model's capabilities: `max_input_tokens` (the context window) and `max_tokens` (the output cap). This beats hard-coding, since values differ between models.",
  },
  "da-2-q13": {
    scenario:
      "A chat on `claude-sonnet-5` with `thinking: {type: \"adaptive\"}` streams reasoning to the user. `thinking` blocks arrive, but their text is empty, and the user sees a long pause.",
    prompt: "What should you change?",
    choices: {
      a: "Nothing: the model did not actually think.",
      b: "Go back to `budget_tokens` to see the raw reasoning.",
      c: "Increase `max_tokens` so the thinking fits.",
      d: "Explicitly set `thinking: {type: \"adaptive\", display: \"summarized\"}`.",
    },
    whyWrong: {
      a: "The blocks arrive, so thinking happens and is billed; only the text is not shown.",
      b: "`budget_tokens` returns a 400 on this model, and the raw chain of thought is never returned under any setting.",
      c: "Empty text has nothing to do with the limit; it is a display setting.",
    },
    explanation:
      "On newer models the default is `display: \"omitted\"`: the blocks exist but their text is empty. `\"summarized\"` returns a readable summary; thinking billing is unaffected.",
  },
  "da-2-q14": {
    prompt: "How are thinking tokens billed?",
    choices: {
      a: "Free when `display: \"omitted\"`.",
      b: "As input tokens of the next request.",
      c: "As output tokens, and they count toward `max_tokens`.",
      d: "At a separate rate not reflected in `usage`.",
    },
    whyWrong: {
      a: "`display` only controls visibility; reasoning happens and is billed the same.",
      b: "Thinking tokens are generated by the model in the current request, so they count as output here.",
      d: "There is no separate rate; they are included in `output_tokens`.",
    },
    explanation:
      "Thinking is model-generated tokens, so it goes into `output_tokens` and uses room within `max_tokens`. For deep-reasoning tasks, budget `max_tokens` generously.",
  },
  "da-2-q15": {
    prompt: "What is true about `stop_sequences`?",
    choices: {
      a: "It is an array of plain strings.",
      b: "A match yields `stop_reason: \"stop_sequence\"`.",
      c: "You can pass regular expressions, e.g. `\"\\d+\\.\"`.",
      d: "The stop sequence is also checked in the input messages and truncates them.",
      e: "The matched sequence is not appended to the response text.",
    },
    whyWrong: {
      c: "Sequences are matched as literal strings; regular expressions are not supported.",
      d: "It applies only to generated output; the input is not changed.",
    },
    explanation:
      "`stop_sequences` stops generation at the first match of any of the strings. Which string fired is shown in the response's `stop_sequence` field.",
  },
  "da-2-q16": {
    prompt: "Order the steps for choosing a model for a new feature.",
    choices: {
      a: "Define the task and quality criteria",
      b: "Build an eval set of realistic examples",
      c: "Run the cheapest candidate model",
      d: "Compare with a stronger model or higher `effort`",
      e: "Choose the cheapest configuration that meets the quality bar",
    },
    explanation:
      "Choosing a model is a data-driven engineering decision: criteria and an eval first, then measurement from cheap to expensive. Otherwise it is easy to overpay for Opus where Haiku would do.",
  },
  "da-2-q17": {
    scenario:
      "After moving from `claude-opus-5` to `claude-opus-5-5`, a refactoring agent makes shallower changes and runs tests less often. The prompt and other parameters are unchanged; `effort` is not set in the request.",
    prompt: "What should you check first?",
    choices: {
      a: "Whether the new model has a smaller context.",
      b: "The default `effort`: it is lower on the new model, so set it explicitly (`high` or `xhigh`).",
      c: "Whether `temperature: 0` needs to come back.",
      d: "Whether a rate limit is being hit.",
    },
    whyWrong: {
      a: "The context window is the same for these models; the cause is the thoroughness setting.",
      c: "Sampling parameters are not accepted on this model at all.",
      d: "Rate limits produce 429 errors, not shallower answers.",
    },
    explanation:
      "Relying on defaults during a migration is risky: `claude-opus-5-5` defaults to `effort: medium`. For coding and agentic tasks, set it explicitly.",
  },
  "da-2-q18": {
    prompt: "Code on `claude-sonnet-5` gets a 400 because it sends `{\"role\": \"assistant\", \"content\": \"{\"}` as the last message to force the model to start with JSON. How do you get guaranteed JSON?",
    choices: {
      a: "Set `stop_sequences: [\"}\"]`.",
      b: "Retry until the 400 goes away.",
      c: "Add \"reply with JSON only\" to `system` and parse whatever arrives.",
      d: "Use structured outputs: `output_config.format` with a JSON schema.",
    },
    whyWrong: {
      a: "That truncates JSON at the first nested brace and guarantees nothing about how the reply starts.",
      b: "Prefill is not supported on these models, so the 400 is permanent.",
      c: "An instruction raises the odds but does not guarantee schema validity.",
    },
    explanation:
      "Prefilling the last `assistant` turn returns a 400 on current models. Structured outputs (`output_config.format`) with a JSON schema guarantee the format.",
  },
  "da-2-q19": {
    prompt: "On Haiku 4.5 thinking is enabled via `budget_tokens`. Which request is valid?",
    choices: {
      a: "`max_tokens=16000`, `thinking={\"type\": \"enabled\", \"budget_tokens\": 4000}`",
      b: "`max_tokens=2000`, `thinking={\"type\": \"enabled\", \"budget_tokens\": 4000}`",
      c: "`max_tokens=16000`, `thinking={\"type\": \"enabled\", \"budget_tokens\": 256}`",
      d: "`max_tokens=16000`, `thinking={\"type\": \"adaptive\", \"budget_tokens\": 4000}`",
    },
    whyWrong: {
      b: "`budget_tokens` must be less than `max_tokens`, since thinking is part of the output.",
      c: "The minimum budget is 1024 tokens; a smaller value is rejected.",
      d: "Adaptive mode takes no budget, and Haiku 4.5 uses `enabled` with `budget_tokens`.",
    },
    explanation:
      "Models that use `budget_tokens` follow two rules: at least 1024 and less than `max_tokens`. The newest models use adaptive thinking with `effort` instead.",
  },
  "da-2-q20": {
    scenario:
      "After a deploy, every request fails with `not_found_error`; the message mentions `model: claude-sonnet-5.0`. The key and network are fine.",
    prompt: "What happened?",
    choices: {
      a: "The model is overloaded; wait.",
      b: "The key has no API access; create a new one.",
      c: "The model id is misspelled; the correct one is `claude-sonnet-5`, and `GET /v1/models` lists available models.",
      d: "A beta header is needed for the new model.",
    },
    whyWrong: {
      a: "Overload is a 529 `overloaded_error`, not `not_found_error`.",
      b: "Key problems return 401 `authentication_error`.",
      d: "No beta header is needed for a regular model; an unknown beta flag would give a 400, not a 404.",
    },
    explanation:
      "A 404 mentioning `model: ...` means the model was not found or is not available to your organisation. Ids use hyphens, not dots; verify them through the Models API.",
  },
  // ── da-3: Streaming (additional pool) ────────────────────────────────────
  "da-3-q9": {
    prompt: "Where in the stream do you find token counters?",
    choices: {
      a: "Only in the last `content_block_delta`.",
      b: "`message_start` carries `usage` with input tokens; `message_delta` carries the cumulative `output_tokens`.",
      c: "The stream does not report tokens; call `count_tokens` separately.",
      d: "In the HTTP response headers.",
    },
    whyWrong: {
      a: "Block deltas do not carry `usage`.",
      c: "The stream reports `usage`; `count_tokens` is for estimating before a request.",
      d: "Headers carry rate limits and `request-id`, not the `usage` of this generation.",
    },
    explanation:
      "`usage` in streaming is split: input is known immediately in `message_start`, output in `message_delta`. The `message_delta` counter is cumulative, so it must not be summed.",
  },
  "da-3-q10": {
    prompt: "Why is streaming recommended for requests with a large `max_tokens` (tens of thousands) even without a UI?",
    choices: {
      a: "A long generation with no data flowing risks HTTP timeouts; for such values the SDK requires or recommends streaming.",
      b: "Streaming is cheaper for the same tokens.",
      c: "Without streaming `max_tokens` is clipped to 4096.",
      d: "Only streaming returns `stop_reason`.",
    },
    whyWrong: {
      b: "The price is the same: the tokens are the same.",
      c: "The API does not clip `max_tokens` by mode; the problem is connection duration.",
      d: "`stop_reason` is present in both modes.",
    },
    explanation:
      "Streaming keeps the connection active while the model generates. If individual events are not needed, use `stream()` together with `finalMessage()` / `get_final_message()`.",
  },
  "da-3-q11": {
    scenario:
      "Chat users complain that the reply \"hangs\" for 8–10 seconds and then appears all at once. The backend calls `messages.create` without streaming and returns the result to the frontend.",
    prompt: "What gives the biggest gain in perceived speed?",
    choices: {
      a: "Increase `max_tokens`.",
      b: "Cache finished replies on the frontend.",
      c: "Show the spinner for longer.",
      d: "Stream the response and forward `text_delta` fragments to the frontend as they arrive.",
    },
    whyWrong: {
      a: "`max_tokens` is a ceiling; it does not speed up the first word.",
      b: "Conversational replies are unique; caching finished replies will barely hit.",
      c: "That masks the problem instead of reducing the wait.",
    },
    explanation:
      "Streaming barely changes total generation time but sharply reduces time to first token. For interactive interfaces that is the main perceived-speed metric.",
  },
  "da-3-q12": {
    prompt: "What is the `index` field in `content_block_*` events for?",
    choices: {
      a: "It is the event's sequence number in the stream.",
      b: "It is the attempt number after a retry.",
      c: "It tells which `content` block the delta belongs to when the response has several blocks (e.g. `thinking`, `text`, `tool_use`).",
      d: "It is the token's position in the text.",
    },
    whyWrong: {
      a: "`index` belongs to the block, not the event: all deltas of one block share the same `index`.",
      b: "Retries happen at the HTTP request level and are not reflected in block events.",
      d: "Token positions are not transmitted in the stream.",
    },
    explanation:
      "A response can contain several blocks, and their events carry an `index`. A stream assembler keeps a buffer per `index` and closes it on `content_block_stop`.",
  },
  "da-3-q13": {
    prompt: "Which deltas arrive in a `thinking` block during streaming?",
    choices: {
      a: "Only `text_delta`, just like ordinary text.",
      b: "`thinking_delta` with reasoning text, then `signature_delta` before the block closes.",
      c: "`input_json_delta`, since thinking is JSON.",
      d: "None: the thinking block arrives complete in `content_block_start`.",
    },
    whyWrong: {
      a: "A thinking block has its own delta type so it is not confused with answer text.",
      c: "`input_json_delta` is for `tool_use` arguments.",
      d: "Thinking streams in deltas just like other blocks.",
    },
    explanation:
      "A `thinking` block receives `thinking_delta` and a `signature_delta`. The signature is needed to return the block to the model on the next turn; with `display: omitted` the reasoning text is empty.",
  },
  "da-3-q14": {
    prompt: "What does NOT change when the same request is run with streaming?",
    choices: {
      a: "Total time to finish generation drops substantially.",
      b: "The token count and cost of the request.",
      c: "The model's capabilities and response quality.",
      d: "The `max_tokens` limit stops applying.",
      e: "The set of possible `stop_reason` values.",
    },
    whyWrong: {
      a: "Streaming reduces time to first token, not total generation time.",
      d: "`max_tokens` applies the same way in both modes.",
    },
    explanation:
      "Streaming is a delivery method, not a different generation. Same tokens, same price, same `stop_reason` values; only when the client sees the first data changes.",
  },
  "da-3-q15": {
    prompt: "What does a single event look like in the raw SSE stream of the Messages API?",
    choices: {
      a: "An `event: <type>` line, a `data: <JSON>` line and a blank separator line.",
      b: "One JSON array of all events at the end of the response.",
      c: "A binary WebSocket frame.",
      d: "An NDJSON line without an event name.",
    },
    whyWrong: {
      b: "Then it would not be a stream: events arrive one by one as they are ready.",
      c: "The Messages API uses SSE over plain HTTP, not WebSocket.",
      d: "Each SSE event has an `event:` line with the type; it is also repeated in the `type` field inside `data`.",
    },
    explanation:
      "SSE is a text format: `event:`/`data:` pairs separated by a blank line. You rarely need your own parser — SDKs do this and return typed events.",
  },
  "da-3-q16": {
    scenario:
      "Locally streaming works: text appears word by word. In production behind a reverse proxy the whole response reaches the browser as one chunk at the end. The code is identical.",
    prompt: "Most likely cause?",
    choices: {
      a: "Production uses a different API key that does not support streaming.",
      b: "The model generates more slowly in production.",
      c: "The SDK disables streaming when `NODE_ENV=production`.",
      d: "The proxy buffers the response; buffering must be disabled for this route.",
    },
    whyWrong: {
      a: "Streaming does not depend on the key; the API sends events the same way.",
      b: "Slower generation would give a slower stream, not a single chunk at the end.",
      c: "The SDK does not change mode based on the environment.",
    },
    explanation:
      "Intermediate proxies and some frameworks buffer responses whole. For SSE routes buffering must be disabled, or the user loses streaming's main benefit.",
  },
  "da-3-q17": {
    prompt: "How does `client.messages.stream(...)` in Python differ from `client.messages.create(..., stream=True)`?",
    choices: {
      a: "Nothing, they are synonyms.",
      b: "`stream()` does not support tools.",
      c: "`stream()` accumulates message state and provides helpers (`text_stream`, `get_final_message()`); `create(stream=True)` yields only raw events.",
      d: "`create(stream=True)` does not return `stop_reason`.",
    },
    whyWrong: {
      a: "`create(stream=True)` yields raw events without accumulation; it has no `text_stream` or `get_final_message()` helpers.",
      b: "The helper works with tools and assembles `tool_use` inputs itself.",
      d: "`stop_reason` arrives in `message_delta` in both cases; you just have to collect it yourself.",
    },
    explanation:
      "`stream()` is a high-level helper, usually in a `with` block that closes the connection. `create(stream=True)` is useful when you only need a raw event stream with minimal overhead.",
  },
  "da-3-q18": {
    prompt: "Order the steps for handling a tool call in a stream.",
    choices: {
      a: "`content_block_start` of type `tool_use`: store `id` and `name`",
      b: "Accumulate `partial_json` from `input_json_delta`",
      c: "On `content_block_stop`, parse the accumulated JSON",
      d: "Receive `stop_reason: \"tool_use\"` in `message_delta`",
      e: "Run the tool and send a `tool_result` with the same `tool_use_id`",
    },
    explanation:
      "A `tool_use` block streams like text: start with metadata, deltas with JSON, stop. Run the tool after `stop_reason: \"tool_use\"`, once the whole response is assembled.",
  },
  "da-3-q19": {
    prompt: "The user presses \"Stop\" during generation. What is the right way to interrupt the stream in the TypeScript SDK?",
    choices: {
      a: "Just stop showing text and let the stream finish.",
      b: "Call `stream.abort()` to close the connection and stop generation.",
      c: "Send a new request with `max_tokens: 0`.",
      d: "Send a `message_stop` event into the stream.",
    },
    whyWrong: {
      a: "Generation and the connection continue, spending tokens and resources nobody needs.",
      c: "A new request has no effect on the stream already running.",
      d: "SSE is one-way: the client cannot send events into the stream.",
    },
    explanation:
      "Stopping means closing the connection via the SDK (`abort()` in TypeScript; in Python, leaving the `with` block or `close()`). Keep the partial text in the history marked as unfinished.",
  },
  "da-3-q20": {
    scenario:
      "A nightly job generates short 150-token descriptions for 5,000 products and writes them to a database. The developer handles every stream event by hand: deltas, `index`, `message_delta`.",
    prompt: "What is more appropriate?",
    choices: {
      a: "A plain non-streaming `messages.create`: replies are short, there is no UI, and hand-handling events only complicates the code.",
      b: "Keep hand-handling: streaming is mandatory for all requests.",
      c: "Write every `text_delta` to the database separately.",
      d: "Start all 5,000 streams at once.",
    },
    whyWrong: {
      b: "Streaming is optional; it is needed for UX or long generations.",
      c: "Thousands of tiny writes for nothing; store the finished result.",
      d: "That hits rate limits regardless of mode.",
    },
    explanation:
      "Streaming is for interactive UX and long outputs. For short background jobs a plain request is simpler; for large offline volumes consider Message Batches too.",
  },
  // ── da-4: Tokens and usage (additional pool) ─────────────────────────────
  "da-4-q9": {
    prompt: "Where in `usage` do extended thinking tokens go?",
    choices: {
      a: "Into `output_tokens`.",
      b: "Into `input_tokens`.",
      c: "Into a separate, unbilled `thinking_tokens` field.",
      d: "Nowhere, if the reasoning text is hidden.",
    },
    whyWrong: {
      b: "The model generates thinking in this request, so it is output.",
      c: "There is no separate free field; thinking is billed as output.",
      d: "Hiding the text cancels neither generation nor billing.",
    },
    explanation:
      "Thinking is output tokens even when the reasoning text is not shown. So `output_tokens` in a thinking request can be much larger than the visible text.",
  },
  "da-4-q10": {
    scenario:
      "A developer marked a large system prompt with `cache_control`, but `usage` always shows `cache_read_input_tokens: 0`. The system prompt begins with `Current time: {datetime.now()}`.",
    prompt: "What is wrong?",
    choices: {
      a: "Caching works only with streaming.",
      b: "The timestamp changes the prefix on every request, so the cache never matches; move dynamic data after the cache breakpoint.",
      c: "`cache_control` cannot be placed on `system`.",
      d: "You must call `count_tokens` before each request to warm the cache.",
    },
    whyWrong: {
      a: "Caching does not depend on the delivery mode.",
      c: "It can: a system prompt block is a typical place for a cache breakpoint.",
      d: "Token counting writes nothing to the cache.",
    },
    explanation:
      "The cache is an exact prefix match. Any changing part before the breakpoint resets it every time; `cache_read_input_tokens` shows whether the cache actually hit.",
  },
  "da-4-q11": {
    prompt: "What should you do for correct API cost accounting?",
    choices: {
      a: "Log `usage` from every response together with `model`.",
      b: "Multiply each `usage` field by the rate for that model and token type.",
      c: "Count tokens from the length of the response string.",
      d: "Call `count_tokens` after each response, since `usage` is inaccurate.",
      e: "Aggregate spend by feature or customer.",
    },
    whyWrong: {
      c: "String length is not tokens and ignores thinking and cache fields.",
      d: "`usage` is the actual accounting; `count_tokens` is for pre-request estimates.",
    },
    explanation:
      "Accurate cost is `usage` × the specific model's rates, including cache fields. Aggregating by feature shows where the money actually goes.",
  },
  "da-4-q12": {
    prompt: "How do total input tokens of a long chat grow without caching or history trimming?",
    choices: {
      a: "Linearly: each turn adds only its own message.",
      b: "They do not grow: the API stores the history.",
      c: "Logarithmically, since old messages are compressed automatically.",
      d: "Roughly quadratically: the Nth request contains all previous turns.",
    },
    whyWrong: {
      a: "Each turn resends the whole previous history, so a single request grows linearly, not the total.",
      b: "The API is stateless; the history is sent and billed every time.",
      c: "Without explicitly enabled compaction nothing is compressed automatically.",
    },
    explanation:
      "The Nth request grows linearly, so the conversation total grows roughly quadratically. Caching the stable prefix and compressing history are the main levers.",
  },
  "da-4-q13": {
    prompt: "Order the steps for guarding against context overflow before a request.",
    choices: {
      a: "Count the request's input tokens with `count_tokens`",
      b: "Compare with the model's `max_input_tokens` minus room for `max_tokens`",
      c: "If it does not fit, compress or drop old turns while keeping key facts",
      d: "Send the request and check the actual `usage`",
    },
    explanation:
      "The context budget is shared between input and output. Checking before the request is cheaper than a 400 or a truncated reply, and `usage` afterwards confirms the estimate.",
  },
  "da-4-q14": {
    prompt: "What is true about the `count_tokens` endpoint?",
    choices: {
      a: "It is billed like a regular model request.",
      b: "It accepts only `messages` text, without `tools` or `system`.",
      c: "It is free, has its own rate limits and returns `input_tokens` for the given model.",
      d: "It returns both input and output tokens of the future reply.",
    },
    whyWrong: {
      a: "Token counting generates no reply and is not billed as a model request.",
      b: "It accepts the same structure as message creation, including `tools` and `system`.",
      d: "The output has not been generated yet, so it cannot be counted in advance.",
    },
    explanation:
      "`count_tokens` counts only input for a specific model. It can be called often, subject to its own request limits.",
  },
  "da-4-q15": {
    scenario:
      "A service shows the user `response.content[0].text`. Some requests return HTTP 200 but the screen stays blank. Logs show these responses have `stop_reason: \"refusal\"`.",
    prompt: "How should the handling be fixed?",
    choices: {
      a: "Retry these requests until text arrives.",
      b: "Check `stop_reason` before reading `content` and show a dedicated message for `refusal`.",
      c: "Treat it as a network error.",
      d: "Increase `max_tokens`.",
    },
    whyWrong: {
      a: "A refusal is a classifier decision about this request; an unchanged retry usually gives the same result.",
      c: "The 200 response arrived in full; the network is not involved.",
      d: "Truncation gives `max_tokens`; here the model declined to answer.",
    },
    explanation:
      "`refusal` arrives with status 200, so without checking `stop_reason` code treats it as success. Category details, when present, are in `stop_details`.",
  },
  "da-4-q16": {
    prompt: "How do you cut input tokens for a request with high-resolution screenshots?",
    choices: {
      a: "Downscale images to the size the task needs before base64-encoding them.",
      b: "Send the image as base64 text — it is cheaper.",
      c: "Set a lower `max_tokens`.",
      d: "Nothing: images are not billed.",
    },
    whyWrong: {
      b: "Base64 as text means thousands of text tokens and no image for the model.",
      c: "`max_tokens` caps output and does not affect image tokens.",
      d: "Images are billed as input tokens, and the count depends on their size.",
    },
    explanation:
      "Images turn into input tokens roughly in proportion to their area. Downscaling to the needed resolution saves tokens without hurting the task, as long as details stay legible.",
  },
  "da-4-q17": {
    prompt: "A developer sets `max_tokens: 200` to get short replies. What actually happens?",
    choices: {
      a: "The model plans its reply to fit within 200 tokens.",
      b: "The API compresses the reply to 200 tokens after generation.",
      c: "The request returns a 400 if the reply is longer.",
      d: "Long replies are cut mid-thought; control length with an instruction in the prompt and keep `max_tokens` generous.",
    },
    whyWrong: {
      a: "The model does not see the `max_tokens` value and does not plan length around it.",
      b: "Nothing is compressed: generation is simply cut off at the limit.",
      c: "Hitting the limit is not an error but `stop_reason: \"max_tokens\"`.",
    },
    explanation:
      "`max_tokens` is a safety cap the model is unaware of. Desired length is set in the prompt (\"up to three sentences\"), with the limit set so it fires only in abnormal cases.",
  },
  "da-4-q18": {
    scenario:
      "A service rejects requests for which `count_tokens` reports over 150,000 tokens. Accounting noticed that the actual `usage.input_tokens` sometimes differs slightly from the estimate.",
    prompt: "How should this be treated?",
    choices: {
      a: "It is an SDK bug; count tokens yourself.",
      b: "Stop using `count_tokens`, since it is inaccurate.",
      c: "This is expected: `count_tokens` is an estimate, billing uses `usage`; set the threshold with a small margin.",
      d: "Send every request twice and take the smaller value.",
    },
    whyWrong: {
      a: "Your own count would be far less accurate than the endpoint.",
      b: "A small error does not negate the estimate's value for overflow protection.",
      d: "Double the cost for information you already have; accounting uses the actual `usage`.",
    },
    explanation:
      "The documentation describes the `count_tokens` result as an estimate that may differ slightly from actual accounting. Thresholds get a margin, and billing uses `usage`.",
  },
  "da-4-q19": {
    prompt: "After adding 30 tools, every request's `input_tokens` grew by several thousand although the messages are the same. Why?",
    choices: {
      a: "The API charges a flat fee per tool.",
      b: "Tool names, descriptions and schemas are sent as input on every request.",
      c: "The model reads the tool code from your server.",
      d: "It is temporary until the tools are cached automatically.",
    },
    whyWrong: {
      a: "There is no flat fee; you pay for the definition tokens.",
      c: "The model sees only the definitions sent in the request; it has no access to your code.",
      d: "Nothing is cached without `cache_control`; and cached tokens still occupy the context window.",
    },
    explanation:
      "Tool definitions are part of the prompt, so they take context and cost on every request. Drop unused tools or cache a stable list.",
  },
  "da-4-q20": {
    prompt: "What actually reduces input token spend on repeated requests?",
    choices: {
      a: "A lower `max_tokens`.",
      b: "Switching to streaming.",
      c: "Prompt caching of the stable prefix (tools, `system`, shared documents).",
      d: "Removing unneeded tools and old history turns.",
      e: "Downscaling images to the needed resolution.",
    },
    whyWrong: {
      a: "`max_tokens` caps output only.",
      b: "Streaming changes neither token count nor price.",
    },
    explanation:
      "Input gets cheaper either through caching (cheaper reads of the same prefix) or simply by having fewer tokens. Output parameters and delivery mode do not affect input.",
  },
  // ── da-5: Errors and retries (additional pool) ───────────────────────────
  "da-5-q9": {
    prompt: "A request with a large PDF returns 413 `request_too_large`. What should you do?",
    choices: {
      a: "Retry with backoff.",
      b: "Switch to streaming.",
      c: "Increase `max_tokens`.",
      d: "Shrink the request body: split the document, compress images, or upload the file via the Files API and reference its `file_id`.",
    },
    whyWrong: {
      a: "The request size will not change on retry.",
      b: "Streaming concerns the response, not the size of the request body.",
      c: "`max_tokens` is about output; a 413 is about the input body size.",
    },
    explanation:
      "A 413 means the request body exceeds the allowed size. It is not transient: shrink the input or pass large files by reference.",
  },
  "da-5-q10": {
    prompt: "What should you watch to slow your request rate before getting a 429?",
    choices: {
      a: "`usage.output_tokens` of the last response.",
      b: "The `anthropic-ratelimit-*` response headers with remaining requests and tokens and reset times.",
      c: "A `rate_limit` field in the response body.",
      d: "The number of open TCP connections.",
    },
    whyWrong: {
      a: "`usage` describes one request and says nothing about remaining limits.",
      c: "There is no such body field; this information comes in headers.",
      d: "Limits are counted in requests and tokens per minute, not connections.",
    },
    explanation:
      "Limits are counted in requests, input and output tokens per minute. The `anthropic-ratelimit-*` headers let you throttle smoothly before the server starts returning 429.",
  },
  "da-5-q11": {
    scenario:
      "A service makes non-streaming requests with a large `max_tokens` for long reports. Occasionally a user waits three times longer than the configured timeout and then still gets a timeout error.",
    prompt: "What is happening and how do you fix it?",
    choices: {
      a: "The API ignores the client timeout.",
      b: "The network is unstable; increase `max_retries`.",
      c: "The SDK retries timed-out requests, so total time reaches `timeout × (max_retries + 1)`; move long generations to streaming.",
      d: "Lower `max_tokens` to 100.",
    },
    whyWrong: {
      a: "The timeout is a client setting, and the SDK honours it for each attempt.",
      b: "More retries only lengthen the wait: each retry hits the same timeout again.",
      d: "That breaks the reports themselves, which need to be long.",
    },
    explanation:
      "The SDK treats timeouts as transient and retries them. For long generations, streaming removes the root problem, and an overall deadline must account for retries.",
  },
  "da-5-q12": {
    prompt: "After this setting, every request in a TypeScript service times out almost instantly. Why?",
    choices: {
      a: "In the TypeScript SDK `timeout` is in milliseconds; 60 means 60 ms, and a minute needs `60_000`.",
      b: "60 seconds is too short for any request.",
      c: "The `timeout` constructor parameter is ignored.",
      d: "The timeout applies only to streaming.",
    },
    whyWrong: {
      b: "A minute is enough for many requests; here the value is actually far less than a minute.",
      c: "It works, just in different units.",
      d: "The timeout applies to all client requests.",
    },
    explanation:
      "Timeout units differ between SDKs: seconds in Python, milliseconds in TypeScript. Code ported between languages should be checked for exactly this.",
  },
  "da-5-q13": {
    prompt: "What should you log so Anthropic support can find a specific problematic request?",
    choices: {
      a: "The full API key.",
      b: "Only the request time to the second.",
      c: "The error message text.",
      d: "The request id from the `request-id` header (in the SDK, the response's `_request_id`).",
    },
    whyWrong: {
      a: "The key is a secret; it is never logged or sent around.",
      b: "Among an organisation's thousands of requests, time alone makes it hard to find one.",
      c: "The text is the same for many requests and does not identify a specific one.",
    },
    explanation:
      "Every response has a unique `request-id`. Log it alongside `usage` and `stop_reason` to correlate your logs with API-side data.",
  },
  "da-5-q14": {
    prompt: "A tool-using agent runs with automatic retries. What must be made idempotent so a retry does no harm?",
    choices: {
      a: "The `messages.create` call itself: it creates server-side state that must be cleaned up.",
      b: "Prompt cache reads.",
      c: "A tool that charges the customer.",
      d: "A tool that sends an email.",
      e: "A tool that creates a database record.",
    },
    whyWrong: {
      a: "Generation has no external side effects; a retry costs only tokens.",
      b: "Cache reads have no side effects.",
    },
    explanation:
      "The danger is not API retries but re-running your own side-effecting actions. Use your own idempotency keys for them (e.g. derived from `tool_use_id`) and an \"already done\" check.",
  },
  "da-5-q15": {
    scenario:
      "At peak hours some requests get a 529 even after all automatic SDK retries. The feature is non-critical: the user needs some answer within a few seconds.",
    prompt: "What is appropriate?",
    choices: {
      a: "Retry in a loop without pauses until it works.",
      b: "Once retries are exhausted, degrade: a fallback model, a queue for later, or a clear message to the user.",
      c: "Show the user the raw 529 error text.",
      d: "Turn off retries to show the error faster.",
    },
    whyWrong: {
      a: "Without pauses you worsen the overload and blow the time budget.",
      c: "A technical error with no explanation is the worst UX.",
      d: "A few short retries often save the request; turning them off entirely is a loss.",
    },
    explanation:
      "Backoff retries are the first line and a degradation plan the second. For non-critical features, a fallback model or deferred work beats a long wait or a raw error.",
  },
  "da-5-q16": {
    prompt: "How do you correctly distinguish a rate limit from other API errors in the Python SDK?",
    choices: {
      a: "`except anthropic.RateLimitError:` — a typed exception class.",
      b: "`if \"rate limit\" in str(e):`",
      c: "`if e.args[0] == 429:`",
      d: "Check `response.content` for `\"error\"`.",
    },
    whyWrong: {
      b: "Message text can change; string matching is brittle when typed classes exist.",
      c: "The status lives in the exception's `status_code` attribute, not `args`; catching the specific class is better.",
      d: "API errors are raised as exceptions; there is no response `content` at all.",
    },
    explanation:
      "The SDK maps statuses to classes: `BadRequestError`, `AuthenticationError`, `RateLimitError`, `InternalServerError` and so on, with base `APIStatusError`. Network failures are separate: `APIConnectionError` and `APITimeoutError`.",
  },
  "da-5-q17": {
    prompt: "Why does the `RateLimitError` branch in this code never run?",
    choices: {
      a: "`RateLimitError` is raised only by the async client.",
      b: "The SDK never raises a 429 because it retries them itself.",
      c: "`RateLimitError` must be caught in `finally`.",
      d: "`RateLimitError` is a subclass of `APIStatusError`, so the first branch catches it earlier; specific classes must be caught first.",
    },
    whyWrong: {
      a: "Both clients raise the same typed exceptions.",
      b: "Once retries run out, the SDK raises `RateLimitError`.",
      c: "`finally` catches nothing; it always runs.",
    },
    explanation:
      "Python checks `except` clauses top to bottom, and a base class catches all subclasses. Write the chain from most specific to most general.",
  },
  "da-5-q18": {
    prompt: "What does a 404 `not_found_error` with a `model: ...` message most often mean?",
    choices: {
      a: "A transient failure; retry.",
      b: "A mistake in the `/v1/messages` endpoint path.",
      c: "The model id is misspelled or the model is not available to your organisation; check with `GET /v1/models`.",
      d: "The account balance ran out.",
    },
    whyWrong: {
      a: "A 404 is deterministic: retrying with the same id gives the same result.",
      b: "A message with `model:` points at the model, not the path.",
      d: "Billing problems have their own error type, not a 404 about the model.",
    },
    explanation:
      "The API responds the same way to a nonexistent model and to one not available to your organisation. The Models API returns the list of available models.",
  },
  "da-5-q19": {
    scenario:
      "The client is configured with `max_retries=4`. During streaming, after a few hundred tokens, an `overloaded_error` arrives in the stream and the code fails immediately with an exception, without any retry.",
    prompt: "Why did the automatic retries not kick in?",
    choices: {
      a: "`max_retries` does not apply to Opus models.",
      b: "SDK retries cover establishing the request; an error in the middle of an already started stream is raised to your code, and you decide how to retry given partial output.",
      c: "`overloaded_error` is never retried.",
      d: "`max_retries` has to be passed to `stream()` itself.",
    },
    whyWrong: {
      a: "The retry setting does not depend on the model.",
      c: "The SDK retries a 529 before the response starts; the issue is when the error happened.",
      d: "A per-call override also covers only establishing the request.",
    },
    explanation:
      "Once the 200 has been sent and some text shown, an automatic retry would alter output already displayed. So handling mid-stream errors is the application's responsibility.",
  },
  "da-5-q20": {
    prompt: "Why is setting `max_retries=50` \"for reliability\" a bad idea?",
    choices: {
      a: "The API blocks clients with more than 10 retries.",
      b: "Retries are billed double.",
      c: "The SDK does not allow more than 5 retries.",
      d: "A request may hang for a very long time, hold resources and add load during an outage; better a few retries and an explicit degradation plan.",
    },
    whyWrong: {
      a: "There is no such rule; the problem is the client's own behaviour.",
      b: "There is no separate rate for retries.",
      c: "The SDK accepts any value; the question is whether it makes sense.",
    },
    explanation:
      "With backoff each retry waits longer, so dozens of attempts mean minutes of waiting. Reliability comes from bounded retries, a deadline and a fallback path, not endless attempts.",
  },
  // ── da-boss: BOSS: Production API client (additional pool) ───────────────
  "da-boss-q7": {
    scenario:
      "A nightly job processes 50,000 documents by firing 200 parallel requests. Most requests get a 429, and the job takes twice as long as without concurrency. Results are needed by morning, not instantly.",
    prompt: "What is the best solution?",
    choices: {
      a: "Raise concurrency to 500 to get through the 429 wave faster.",
      b: "Remove retries so failed documents are skipped.",
      c: "Move to the Message Batches API: asynchronous processing at a reduced price; or at least throttle concurrency using the `anthropic-ratelimit-*` headers.",
      d: "Spread requests across several keys of one organisation.",
    },
    whyWrong: {
      a: "More parallel requests mean more 429s; the limits do not grow.",
      b: "Some documents simply will not get processed.",
      d: "Limits are counted at the organisation level.",
    },
    explanation:
      "For large offline volumes the Batches API is cheaper and removes the real-time limit problem. If the synchronous API is needed, match concurrency to the limits instead of storming them.",
  },
  "da-boss-q8": {
    scenario:
      "An agent calls a `charge_customer` tool. After a network timeout between your server and the payment provider, the code retried the whole agent turn, and the customer was charged twice.",
    prompt: "What should be fixed?",
    choices: {
      a: "Disable retries in the SDK.",
      b: "Ask the model in the prompt not to call the tool twice.",
      c: "Increase the timeout to the payment provider.",
      d: "Make the tool idempotent: an idempotency key derived from `tool_use_id` or the order id, and an \"already charged\" check before acting.",
    },
    whyWrong: {
      a: "The API retry is irrelevant here: the duplicate happened in your tool.",
      b: "Your code initiated the retry, not the model; a prompt gives no guarantee.",
      c: "It lowers the odds, but a duplicate remains possible on the next failure.",
    },
    explanation:
      "Retrying model generation is safe; side-effecting actions are not. Idempotency belongs at the level of your tools, because that is where the real consequences are.",
  },
  "da-boss-q9": {
    scenario:
      "An agent on `claude-opus-5-5` uses tools and thinking. To keep logs compact, the code stores only `tool_use` blocks in the `assistant` history, dropping the rest. Mid-loop the API started returning a 400 about mismatched thinking blocks.",
    prompt: "How do you fix it?",
    choices: {
      a: "Disable thinking for this model.",
      b: "Store the whole `response.content` in history unchanged and build a compact representation separately for logs.",
      c: "Generate `thinking` blocks with empty text in place of the dropped ones.",
      d: "Retry the request with backoff.",
    },
    whyWrong: {
      a: "Thinking cannot be disabled on this model, and the problem is the altered history anyway.",
      c: "Forged blocks fail signature verification.",
      d: "A 400 is deterministic; the history stays the same.",
    },
    explanation:
      "The API history and human logs are different things. Return the model's reply to the API unchanged, especially `thinking` and `tool_use` blocks; build a separate representation for logs.",
  },
  "da-boss-q10": {
    prompt: "A service moves from `claude-haiku-4-5-20251001` to `claude-sonnet-5`. What must be checked in the client code?",
    choices: {
      a: "Change the endpoint to `/v2/messages`.",
      b: "Remove `temperature`, `top_p` and `top_k` if present.",
      c: "Replace `thinking` with `budget_tokens` by `{type: \"adaptive\"}` with `effort`.",
      d: "Run the eval set and recalculate the budget from actual `usage`.",
      e: "Convert `messages` to a new format with a `turns` field.",
    },
    whyWrong: {
      a: "The endpoint is the same for all models.",
      e: "The `messages` format does not change between models.",
    },
    explanation:
      "A model migration means changing request parameters the new model rejects, plus re-measuring quality and cost. The API format and endpoint stay the same.",
  },
  "da-boss-q11": {
    scenario:
      "At peak hours a response stream sometimes stops halfway, then an `error` event with `overloaded_error` arrives. The user sees cut-off text with no explanation.",
    prompt: "Which strategy is right?",
    choices: {
      a: "Show the user that the reply was interrupted and retry with backoff (or offer a \"regenerate\" button), without saving the fragment as a finished reply.",
      b: "Save the partial text as a normal assistant reply.",
      c: "Increase `max_retries`: the SDK will retry the stream automatically.",
      d: "Hide the error and wait for the stream to resume by itself.",
    },
    whyWrong: {
      b: "An unfinished reply in history confuses both the user and the model on later turns.",
      c: "The SDK raises an error in the middle of an already started stream to your code.",
      d: "After an `error` event the stream is over; it will not resume on its own.",
    },
    explanation:
      "A mid-stream error is the application's responsibility: show the state honestly, keep the fragment out of history, and retry after a pause.",
  },
  "da-boss-q12": {
    prompt: "An interactive feature has an SLA on time to first character. What gives the biggest effect without losing quality where it is not needed?",
    choices: {
      a: "Lower `max_tokens` to a minimum.",
      b: "Remove the system prompt.",
      c: "Streaming plus a lower `effort` or a faster model for this route, confirmed by measurement.",
      d: "Fire every request twice in parallel and take the faster one.",
    },
    whyWrong: {
      a: "It truncates replies but does not bring the first token sooner.",
      b: "Losing instructions hurts quality; there are better speed levers.",
      d: "Double the cost and rate-limit pressure for a marginal gain.",
    },
    explanation:
      "Time to first token is cut by streaming and less upfront model work: a lower `effort` or a faster model. Quality is confirmed with an eval for that specific route.",
  },
  "da-boss-q13": {
    scenario:
      "A support chat runs conversations of hundreds of turns. Beyond a certain length, requests started failing with a context-exceeded error, and long conversations are disproportionately expensive.",
    prompt: "Which solution is comprehensive?",
    choices: {
      a: "Switch to a model with a bigger window and change nothing else.",
      b: "Send only the last 5 messages each time.",
      c: "Increase `max_tokens` so the reply fits.",
      d: "Track size via `usage`/`count_tokens`, compress old turns while keeping key facts in structured state, and cache the stable prefix.",
    },
    whyWrong: {
      a: "A bigger window only moves the boundary, while quadratic cost growth remains.",
      b: "Hard truncation loses early key facts: order numbers, agreements.",
      c: "A larger `max_tokens` only leaves less room for input.",
    },
    explanation:
      "Long conversations require context management: measurement, fact-preserving compression and caching. No single request parameter replaces it.",
  },
  "da-boss-q14": {
    prompt: "A user complains about a strange reply yesterday at 14:32. What from your logs lets you investigate fastest together with Anthropic support?",
    choices: {
      a: "The user's screenshot.",
      b: "That request's `request-id` together with the model, `stop_reason` and `usage`.",
      c: "A hash of the API key.",
      d: "A full dump of all requests that day.",
    },
    whyWrong: {
      a: "A screenshot does not identify the request in the API system.",
      c: "The key identifies the organisation, not a specific request.",
      d: "Excessive and risky for user data; you need one specific request.",
    },
    explanation:
      "The `request-id` is the correlation key between your logs and API data. Together with the model, `stop_reason` and `usage`, it answers most investigation questions.",
  },
  "da-boss-q15": {
    prompt: "Which response handler is the most complete for a production client without tools?",
    choices: {
      a: "This one: separate branches for normal completion, truncation, refusal, and a fallback branch for unknown values.",
      b: "Checking only `end_turn` is enough; the rest are rare cases.",
      c: "`stop_reason` can be ignored; checking that `content` is not empty is enough.",
      d: "Catch exceptions instead of `match`: the SDK raises on `max_tokens`.",
    },
    whyWrong: {
      b: "`max_tokens` and `refusal` happen in real traffic, and without handling the user gets a fragment or a blank.",
      c: "A truncated reply has non-empty `content`, yet it is incomplete.",
      d: "`max_tokens` is a successful 200 response; no exception is raised.",
    },
    explanation:
      "`stop_reason` is the completion contract. A robust client handles every expected value explicitly and has a fallback branch for new ones the API may add in future.",
  },
};
