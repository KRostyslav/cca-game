import type { QuestionEn } from "@/lib/content/types";

/** Англійський дубль питань цього домену: id питання → переклад. */
export const questionsEn: Record<string, QuestionEn> = {
  // ── Level 1: Messages API ────────────────────────────────────────────────
  "da-1-q1": {
    prompt: "Which three parameters are required in the body of a `POST /v1/messages` request?",
    choices: {
      a: "`model`, `messages`, `temperature`",
      b: "`model`, `max_tokens`, `messages`",
      c: "`model`, `system`, `messages`",
      d: "`messages`, `max_tokens`, `stream`",
    },
    whyWrong: {
      a: "`temperature` is optional, and on the newest models it has been removed altogether.",
      c: "`system` is optional: a request without a system prompt is perfectly valid.",
      d: "Without `model` the API does not know which model to run; `stream` only turns on streaming and is off by default.",
    },
    explanation:
      "The minimal request is a model, an output token ceiling and a messages array. `max_tokens` has no default, so it must always be set.",
  },
  "da-1-q2": {
    prompt: "Where does the system prompt go in the Messages API?",
    choices: {
      a: "As the first element of `messages` with `role: \"system\"`.",
      b: "In an `anthropic-system` header.",
      c: "In the top-level `system` parameter next to `messages`.",
      d: "As the first text in the `user` message, prefixed with `System:`.",
    },
    whyWrong: {
      a: "That is another API's format. In the Messages API `messages[0]` must be `user`, and the main system prompt is a separate field.",
      b: "No such header exists; headers carry authentication and the API version, not prompt content.",
      d: "That makes the instruction part of the user's turn, and it loses the weight of an operator instruction.",
    },
    explanation:
      "`system` is a separate request parameter: a string or an array of text blocks. It sets the role and rules for the whole conversation and is not mixed into user turns.",
  },
  "da-1-q3": {
    scenario:
      "A Messages API chatbot answers a first message, \"My name is Olya\". To the second, \"What is my name?\", it says it does not know. The code sends only the latest user message each time.",
    prompt: "What is the cause?",
    choices: {
      a: "The model does not memorise names for privacy reasons.",
      b: "You need to pass the `conversation_id` from the first response.",
      c: "Enable prompt caching so the history is stored on the server.",
      d: "The API is stateless: every request must contain the whole previous `user`/`assistant` history.",
    },
    whyWrong: {
      a: "There is no such filter: if the name is in the history you send, the model sees it.",
      b: "The Messages API has no conversation id: the server keeps no state between requests.",
      c: "The cache only makes a prefix you still send cheaper; it does not replace the history.",
    },
    explanation:
      "The Messages API is stateless: the model sees only what is in the current request. Your code stores the history and sends it every time.",
  },
  "da-1-q4": {
    prompt: "TypeScript refuses to compile `response.content[0].text`. What is the right way to get the response text?",
    choices: {
      a: "Iterate over `response.content` and take the blocks where `type === \"text\"`.",
      b: "Use `response.text` — it is a shortcut for the first block.",
      c: "Cast the type: `(response.content[0] as any).text`.",
      d: "Call `JSON.parse(response.content)`.",
    },
    whyWrong: {
      b: "A `Message` object has no `text` field; text lives only inside `content` blocks.",
      c: "The cast hides the problem: the first block can be `thinking` or `tool_use`, and then you get `undefined`.",
      d: "`content` is already a parsed array of objects, not a JSON string.",
    },
    explanation:
      "`content` is an array of blocks of different types (a discriminated union). Narrowing by `type` both gives type-safe access to `text` and protects against responses where text is not first.",
  },
  "da-1-q5": {
    prompt: "Which block types can be sent in the `content` of a `user` message?",
    choices: {
      a: "`text_delta`",
      b: "`image`",
      c: "`document`",
      d: "`message_delta`",
      e: "`tool_result`",
    },
    whyWrong: {
      a: "That is a delta type in streaming events, not a request block.",
      d: "That is a response stream event; it is never sent in a request.",
    },
    explanation:
      "User message content is made of `text`, `image`, `document` and `tool_result` blocks. Names ending in `_delta` belong only to streaming events.",
  },
  "da-1-q6": {
    prompt: "Order the steps of one turn of a multi-turn chat on the Messages API.",
    choices: {
      a: "Append the new `user` message to the local history",
      b: "Call `messages.create` with the full history",
      c: "Check the response's `stop_reason`",
      d: "Append `response.content` to the history as an `assistant` message",
    },
    explanation:
      "Your code is the sole owner of the conversation: it appends the turn, sends everything, checks why the model stopped and stores the reply as whole blocks for the next turn.",
  },
  "da-1-q7": {
    prompt: "Why is `response.content[0]` an unreliable way to get the response text?",
    choices: {
      a: "The `content` array always holds exactly one block, but its type may be unknown.",
      b: "Block order is random and changes between requests.",
      c: "The first block may be `thinking` or `tool_use`, and text may span several blocks.",
      d: "The SDK returns `content` in reverse order.",
    },
    whyWrong: {
      a: "There can be several blocks: `thinking`, several `text` blocks and `tool_use` in one response.",
      b: "The order is not random: blocks come in the sequence the model generated them.",
      d: "The SDK reorders nothing; block order is the same as in the raw API response.",
    },
    explanation:
      "A response is an ordered list of blocks of different types. With thinking, a `thinking` block comes first; with tool use, text may precede `tool_use`; with citations, text is split into several blocks.",
  },
  "da-1-q8": {
    scenario:
      "A developer stores history as `history.push({ role: \"assistant\", content: textOf(response) })`, where `textOf` joins only the text blocks. After a response with `stop_reason: \"tool_use\"` he appends a `tool_result` and gets a 400.",
    prompt: "How do you fix it?",
    choices: {
      a: "Pass the `tool_result` in the `system` field instead of `messages`.",
      b: "Append the whole `response.content` to the history unchanged, including `tool_use` blocks.",
      c: "Generate your own `tool_use_id` for the `tool_result`.",
      d: "Retry the request — a 400 sometimes happens at random.",
    },
    whyWrong: {
      a: "`tool_result` is a `user` message block; it has no meaning in `system` and does not link to the call.",
      c: "`tool_use_id` must match the `id` of the `tool_use` block from the previous response; an invented id points at nothing.",
      d: "A 400 is a deterministic request-format error; resending the same body gives the same error.",
    },
    explanation:
      "Each `tool_result` refers to a `tool_use` in the previous `assistant` turn. Saving only the text drops those blocks, and the API rejects the request. The same applies to `thinking` blocks.",
  },
  // ── Level 2: Models and parameters ───────────────────────────────────────
  "da-2-q1": {
    prompt: "What does the `max_tokens` parameter do?",
    choices: {
      a: "Sets the desired response length the model aims for.",
      b: "Limits the number of input tokens in the request.",
      c: "Sets a hard ceiling on the number of tokens the model may generate in the response.",
      d: "Caps the total tokens across the whole conversation.",
    },
    whyWrong: {
      a: "The model does not aim for this number; it is a hard ceiling, not a target.",
      b: "Input is bounded by the model's context window, not by `max_tokens`.",
      d: "The API has no conversation state; the limit applies within a single request.",
    },
    explanation:
      "`max_tokens` is the output ceiling for one request. When it is hit, generation stops with `stop_reason: \"max_tokens\"`; brevity has to be requested in the prompt.",
  },
  "da-2-q2": {
    prompt: "Why use `claude-haiku-4-5-20251001` in production rather than the alias `claude-haiku-4-5`?",
    choices: {
      a: "An id with a date pins a specific model snapshot, so behaviour will not change without your decision.",
      b: "Aliases work only in the Console, not through the API.",
      c: "A dated snapshot is cheaper than the alias.",
      d: "An alias ignores `max_tokens`.",
    },
    whyWrong: {
      b: "The API accepts aliases too; the only issue is that they can point to a newer snapshot.",
      c: "Price depends on the model, not on how you name it.",
      d: "Request parameters behave the same for any form of the id.",
    },
    explanation:
      "An alias is handy for experiments but can move to a newer snapshot. For reproducibility and regression evals, production pins the exact id.",
  },
  "da-2-q3": {
    scenario:
      "About two million short support messages must be classified into 8 categories every day. Answers are needed in a fraction of a second, and the budget is limited.",
    prompt: "Which model should you start with?",
    choices: {
      a: "With the most capable Opus model: classification errors are expensive.",
      b: "With Haiku 4.5, checking quality on an eval set of real messages.",
      c: "With any model at maximum effort.",
      d: "The model does not matter; only the prompt does.",
    },
    whyWrong: {
      a: "For simple classification Opus is the most expensive and slowest option; use it only if an eval shows cheaper models fall short.",
      c: "Maximum effort adds latency and cost where the task does not need it.",
      d: "The model determines price, speed and quality; at this volume the difference is huge.",
    },
    explanation:
      "For high-volume, simple, latency-sensitive tasks, start with the fastest cheap model and confirm quality with an eval. Use a stronger model only where measurement shows the need.",
  },
  "da-2-q4": {
    prompt: "The request has `stop_sequences: [\"</answer>\"]` and the model reached that string. What does the response contain?",
    choices: {
      a: "`stop_reason: \"end_turn\"`, with `</answer>` at the end of the text.",
      b: "A 400 error: `stop_sequences` cannot be combined with XML tags.",
      c: "Generation continues, and `</answer>` is flagged in `usage`.",
      d: "`stop_reason: \"stop_sequence\"`, the `stop_sequence` field equals `\"</answer>\"`, and the marker itself is not in the text.",
    },
    whyWrong: {
      a: "Stopping on a custom sequence has its own `stop_reason`, and the marker itself is not in the text.",
      b: "A stop sequence is any string; XML tags are a very typical choice.",
      c: "A matched stop sequence stops generation; `usage` holds only token counters.",
    },
    explanation:
      "Stop sequences halt generation at a given string. The response reports that this is why it stopped and which string matched, so code can tell it apart from `end_turn` or `max_tokens`.",
  },
  "da-2-q5": {
    prompt: "On a model that supports `temperature` (e.g. Haiku 4.5), a developer sets `temperature: 0` so tests produce identical text. Which statement is true?",
    choices: {
      a: "`temperature: 0` guarantees a byte-identical reply to the same request.",
      b: "`temperature: 0` makes output more predictable but does not guarantee full determinism; tests are better built on checking properties.",
      c: "The valid range is 0 to 2, so 0 changes nothing.",
      d: "`temperature: 0` turns off thinking.",
    },
    whyWrong: {
      a: "Even at 0 the output is not fully deterministic; exact-text tests will be brittle.",
      c: "Claude's `temperature` range is 0 to 1, and 0 substantially reduces variability.",
      d: "Thinking is configured by the separate `thinking` parameter, not by temperature.",
    },
    explanation:
      "Temperature controls sampling randomness but does not make the model deterministic. Tests of LLM code check the structure and properties of a response, not an exact string.",
  },
  "da-2-q6": {
    scenario:
      "A service was moved from Haiku 4.5 to `claude-sonnet-5` without changing any other request parameters. Every call now returns a 400. The request includes `temperature: 0.2` and `top_p: 0.9`.",
    prompt: "What should you do?",
    choices: {
      a: "Set `temperature: 1`, since other values are not supported.",
      b: "Retry with backoff: this is temporary overload.",
      c: "Remove `temperature` and `top_p` from the request; steer behaviour with the prompt and `effort`.",
      d: "Rename `top_p` to `top_k`.",
    },
    whyWrong: {
      a: "On these models sampling parameters are removed entirely: their presence causes the error, not the value.",
      b: "A 400 is a request-format error; overload uses 529 or 5xx.",
      d: "`top_k` is removed on the newest models as well.",
    },
    explanation:
      "On the newest models `temperature`, `top_p` and `top_k` are no longer accepted, and a request containing them fails with a 400. A model migration includes checking request parameters, not just swapping the `model` string.",
  },
  "da-2-q7": {
    prompt: "Where do you set the `effort` level for adaptive thinking?",
    choices: {
      a: "In `output_config={\"effort\": \"high\"}`.",
      b: "In `thinking={\"type\": \"adaptive\", \"effort\": \"high\"}`.",
      c: "As a top-level parameter `effort=\"high\"`.",
      d: "Via `budget_tokens`, since effort is just an alias for it.",
    },
    whyWrong: {
      b: "`effort` is not part of `thinking`; it lives in `output_config` and affects the whole response, not only reasoning.",
      c: "There is no top-level `effort`: it is nested in `output_config`.",
      d: "`effort` is a separate mechanism; `budget_tokens` is rejected outright on the newest models.",
    },
    explanation:
      "`thinking: {type: \"adaptive\"}` lets the model decide how much to think, and `output_config.effort` (`low`…`max`) sets the overall level of thoroughness and token spend.",
  },
  "da-2-q8": {
    prompt: "What does lowering `effort` from `high` to `low` on the same model typically do?",
    choices: {
      a: "Automatically switches the request to a cheaper model.",
      b: "Fewer tokens spent and lower cost.",
      c: "Lower response latency.",
      d: "Fewer tool calls and terser responses.",
      e: "Removal of the `max_tokens` limit.",
    },
    whyWrong: {
      a: "The model stays the same; effort changes only how much work it does.",
      e: "`max_tokens` remains a hard ceiling at any effort.",
    },
    explanation:
      "`effort` is a thoroughness-versus-spend lever within one model. Low suits simple or high-volume routes; complex coding and agentic tasks call for `high` and above.",
  },
  // ── Level 3: Streaming ───────────────────────────────────────────────────
  "da-3-q1": {
    prompt: "How do you turn on streaming in a raw HTTP request to the Messages API?",
    choices: {
      a: "Call a separate `/v1/messages/stream` endpoint.",
      b: "Add an `Accept: text/event-stream` header without changing the body.",
      c: "Pass `max_tokens: -1`.",
      d: "Add `\"stream\": true` to the body; the response arrives as server-sent events.",
    },
    whyWrong: {
      a: "There is no separate endpoint: streaming is enabled by a body field on the same `POST /v1/messages`.",
      b: "The mode is set by the `stream` body field; the header alone does not enable it.",
      c: "A negative value is an invalid request; `max_tokens` has nothing to do with streaming.",
    },
    explanation:
      "Streaming is the same request with `\"stream\": true`. The response arrives as a stream of SSE events that assemble into the same message you would get without streaming.",
  },
  "da-3-q2": {
    prompt: "Order the stream events for a response with a single text block.",
    choices: {
      a: "`message_start`",
      b: "`content_block_start`",
      c: "`content_block_delta` (once or many times)",
      d: "`content_block_stop`",
      e: "`message_delta`",
      f: "`message_stop`",
    },
    explanation:
      "The stream wraps the message (`message_start` … `message_stop`), with blocks inside that have their own start/delta/stop. `message_delta` at the end carries `stop_reason` and final `usage`.",
  },
  "da-3-q3": {
    prompt: "In which stream event does the final `stop_reason` appear?",
    choices: {
      a: "In `message_delta` near the end of the stream.",
      b: "In `message_start`.",
      c: "In every `content_block_delta`.",
      d: "In `content_block_stop`.",
    },
    whyWrong: {
      b: "At the start the model does not yet know why it will stop; `stop_reason` is empty there.",
      c: "Block deltas carry only content fragments.",
      d: "This event only closes the block at `index`; it does not hold the message's stop reason.",
    },
    explanation:
      "`message_delta` updates the message's top-level fields: `stop_reason`, `stop_sequence` and `usage.output_tokens`. This is where code learns whether to run tools or handle truncation.",
  },
  "da-3-q4": {
    prompt: "How do you find the next text fragment in a raw stream?",
    choices: {
      a: "`event.type === \"message_delta\"` and `event.delta.text`.",
      b: "`event.type === \"text\"` and `event.text`.",
      c: "`event.type === \"content_block_delta\"` and `event.delta.type === \"text_delta\"`, text in `event.delta.text`.",
      d: "`event.type === \"content_block_start\"` and `event.content_block.text`.",
    },
    whyWrong: {
      a: "`message_delta` carries `stop_reason` and `usage`, not text.",
      b: "There is no `text` event in the raw stream; that is a convenience event name of an SDK helper, not an SSE type.",
      d: "At block start the text is empty; the content arrives in deltas.",
    },
    explanation:
      "Text arrives in `content_block_delta` with `delta.type: \"text_delta\"`. Checking the delta type matters because the same stream can carry `input_json_delta` and `thinking_delta`.",
  },
  "da-3-q5": {
    scenario:
      "While streaming, the model calls a tool. On every `input_json_delta` the code runs `JSON.parse(event.delta.partial_json)` and crashes with a `SyntaxError`.",
    prompt: "What is the right way?",
    choices: {
      a: "Catch the `SyntaxError` and skip fragments that do not parse.",
      b: "Concatenate `partial_json` into a string for the block with that `index` and parse it after `content_block_stop`.",
      c: "Turn off streaming for requests with tools.",
      d: "Take the arguments from `content_block_start`.",
    },
    whyWrong: {
      a: "You would lose parts of the arguments and end up with incomplete or wrong `input`.",
      c: "Streaming with tools works; the only problem is that a fragment is not complete JSON.",
      d: "At `tool_use` block start there are `id` and `name`, but `input` is still empty.",
    },
    explanation:
      "`partial_json` is a piece of a JSON string, not a standalone document. Fragments are accumulated by block `index` and parsed once the block closes; SDK helpers do this for you.",
  },
  "da-3-q6": {
    prompt: "What should you do with `ping` events in the stream?",
    choices: {
      a: "Treat them as an error sign and reconnect.",
      b: "Reply to them by sending `pong`.",
      c: "Append them to the text as a space.",
      d: "Ignore them: they are service events that keep the connection alive.",
    },
    whyWrong: {
      a: "`ping` is a normal part of the stream, not a problem signal.",
      b: "SSE is one-way; the client sends nothing back.",
      c: "They carry no response content.",
    },
    explanation:
      "A stream may contain `ping` at any point. A robust handler ignores unknown and service event types rather than crashing on them.",
  },
  "da-3-q7": {
    prompt: "Which SDK helpers actually exist for working with a stream?",
    choices: {
      a: "Python: `stream.text_stream` — an iterator over text fragments only.",
      b: "TypeScript: `await stream.finalMessage()` — the assembled message once the stream ends.",
      c: "Python: `stream.get_final_message()`.",
      d: "TypeScript: `stream.toPromise()` — a wrapper of all events in a Promise you write yourself for each request.",
      e: "Python: `stream.join_deltas()` to join tool JSON.",
    },
    whyWrong: {
      d: "No such method exists, and hand-written wrappers over `.on()` are unnecessary: that is what `finalMessage()` is for.",
      e: "No such method exists; the SDK accumulates tool `input` itself and returns it in the final message.",
    },
    explanation:
      "The SDK's `messages.stream()` accumulates events into the final message. You can show text via `text_stream` or `on(\"text\")` and still get the full `Message` via `get_final_message()` / `finalMessage()`.",
  },
  "da-3-q8": {
    scenario:
      "The stream had already delivered several paragraphs when an `error` event with `overloaded_error` arrived. The HTTP status of the response was 200.",
    prompt: "How should this be handled?",
    choices: {
      a: "Treat the reply as successful, since the status is 200.",
      b: "Append \"...\" to the text already shown and finish.",
      c: "Handle the event as an error: mark the partial reply as unfinished and retry with backoff or offer to regenerate.",
      d: "Immediately resend the same request without pausing.",
    },
    whyWrong: {
      a: "The 200 was sent before generation started; a mid-stream error means the reply is incomplete.",
      b: "The user gets a truncated reply presented as complete, and the system never learns of the failure.",
      d: "Overload calls for a pause; an instant retry only adds load.",
    },
    explanation:
      "In streaming, an error can arrive as an `error` event after the 200. The SDK raises it as an exception during iteration; code must distinguish a partial reply from a finished one.",
  },
  // ── Level 4: Tokens and usage ────────────────────────────────────────────
  "da-4-q1": {
    prompt: "What do `usage.input_tokens` and `usage.output_tokens` in a response show?",
    choices: {
      a: "Your organisation's per-minute token limits.",
      b: "The actual number of input (uncached) and generated tokens for this request.",
      c: "A token estimate made before the request.",
      d: "Total tokens of the whole conversation since the first turn.",
    },
    whyWrong: {
      a: "Limits come in `anthropic-ratelimit-*` headers, not in `usage`.",
      c: "`count_tokens` gives a pre-request estimate; `usage` holds actual numbers after generation.",
      d: "`usage` describes this request only; accumulating totals is your code's job.",
    },
    explanation:
      "`usage` is the actual accounting for a specific request, and it is what you are billed on. Log it from every response together with the model.",
  },
  "da-4-q2": {
    prompt: "How do you accurately count a request's input tokens before sending it?",
    choices: {
      a: "Divide the character count by 4.",
      b: "Use `tiktoken`.",
      c: "Send the request with `max_tokens: 1` and read `usage`.",
      d: "Call `client.messages.count_tokens(...)` (`POST /v1/messages/count_tokens`) with the same `model`, `system`, `tools` and `messages`.",
    },
    whyWrong: {
      a: "The rough rule is badly off for code, non-English text and markup.",
      b: "It is another vendor's tokenizer; it gives wrong numbers for Claude.",
      c: "That is a paid request just for an estimate, when there is a dedicated counting endpoint.",
    },
    explanation:
      "The counting endpoint accepts the same structure as `messages.create` and returns `input_tokens` for the specific model. It is the only reliable way to estimate input in advance.",
  },
  "da-4-q3": {
    scenario:
      "A team estimated a new feature's budget by counting tokens for one model, then shipped a different model. Actual `input_tokens` for the same prompts turned out noticeably higher than the estimate.",
    prompt: "What most likely explains the gap?",
    choices: {
      a: "Different models may tokenise the same text differently; re-run the estimate with `count_tokens` for the target model.",
      b: "The API adds a token surcharge for the new model.",
      c: "A bug in `usage`; it should not be trusted.",
      d: "Token count depends only on word count, so the gap is random.",
    },
    whyWrong: {
      b: "Price per token differs between models, but token counts are not inflated.",
      c: "`usage` is the actual accounting you are billed on.",
      d: "Tokens are not words: their count depends on the tokenizer and the kind of text.",
    },
    explanation:
      "The tokenizer can change between model generations, so the same text yields different token counts. When migrating models, budgets and context limits are recalculated.",
  },
  "da-4-q4": {
    prompt: "A request uses prompt caching. How do you get the full input token count?",
    choices: {
      a: "It is just `input_tokens`, i.e. 120.",
      b: "`input_tokens` + `output_tokens`.",
      c: "`input_tokens` + `cache_creation_input_tokens` + `cache_read_input_tokens`, i.e. 18,120.",
      d: "`cache_read_input_tokens`, since it is the largest.",
    },
    whyWrong: {
      a: "`input_tokens` counts only the uncached part after the last cache breakpoint.",
      b: "Output tokens are not input, and the cache fields are missing.",
      d: "That is only the part read from the cache; you would lose the rest of the input.",
    },
    explanation:
      "With caching, input is split into three differently priced fields: uncached, written to cache and read from cache. The full context size is their sum.",
  },
  "da-4-q5": {
    prompt: "What takes up room in the model's context window during a request?",
    choices: {
      a: "Tool definitions from `tools`.",
      b: "The system prompt.",
      c: "The whole `messages` history, including `tool_result`.",
      d: "The `x-api-key` and `anthropic-version` headers.",
      e: "The tokens the model generates in the response.",
    },
    whyWrong: {
      d: "Headers are transport-level; they are not passed to the model.",
    },
    explanation:
      "Context is everything the model sees and produces in a request: tools, `system`, history and output. That is why a long reply needs room reserved for output.",
  },
  "da-4-q6": {
    prompt: "What does `stop_reason: \"end_turn\"` mean?",
    choices: {
      a: "The model hit the `max_tokens` limit.",
      b: "The model finished its reply naturally.",
      c: "The model is waiting for a tool result.",
      d: "The conversation is closed; no further request is possible.",
    },
    whyWrong: {
      a: "There is a separate `max_tokens` value for that.",
      c: "That is `stop_reason: \"tool_use\"`.",
      d: "The API has no conversation state: another request is always possible.",
    },
    explanation:
      "`stop_reason` explains why generation stopped: `end_turn`, `max_tokens`, `stop_sequence`, `tool_use`, `pause_turn` or `refusal`. Code should branch on it, not on the text.",
  },
  "da-4-q7": {
    scenario:
      "A service generates JSON reports. Sometimes `JSON.parse` fails on a cut-off string. Logs show these responses have `stop_reason: \"max_tokens\"`.",
    prompt: "Which fix is right?",
    choices: {
      a: "Append missing `}` and `]` until the JSON parses.",
      b: "Catch the parse error and resend the same request.",
      c: "Lower `max_tokens` so the model writes more concisely.",
      d: "Check `stop_reason` before parsing; on `max_tokens`, raise the limit or reduce the report size per request.",
    },
    whyWrong: {
      a: "You get a syntactically valid but incomplete report and lose data silently.",
      b: "The same `max_tokens` on the same input truncates again.",
      c: "The model does not adapt length to `max_tokens`; truncation gets worse.",
    },
    explanation:
      "`stop_reason: \"max_tokens\"` signals an incomplete reply. Checking it before parsing turns a mysterious `SyntaxError` into explicit truncation handling.",
  },
  "da-4-q8": {
    prompt: "How does the price of output tokens relate to input tokens for Claude models?",
    choices: {
      a: "The same; only the total count matters.",
      b: "Output is cheaper, since there is less of it.",
      c: "Output tokens are noticeably more expensive than input, so verbose replies and thinking quickly raise request cost.",
      d: "Output is free when streaming is used.",
    },
    whyWrong: {
      a: "Input and output are billed separately at different rates.",
      b: "The opposite: generating each token costs more than reading it.",
      d: "The delivery mode does not affect token prices.",
    },
    explanation:
      "For current models the rate per output token is several times the input rate. So concise replies and a sensible `effort` materially affect the bill.",
  },
  // ── Level 5: Errors and retries ──────────────────────────────────────────
  "da-5-q1": {
    prompt: "The API returned 401 `authentication_error`. What does that mean?",
    choices: {
      a: "The request limit was exceeded; wait.",
      b: "The API is overloaded.",
      c: "The key is missing, invalid or revoked; retrying will not help, fix the credentials.",
      d: "The request body is malformed.",
    },
    whyWrong: {
      a: "Exceeding limits is 429 `rate_limit_error`.",
      b: "Overload is 529 `overloaded_error`.",
      d: "A format error is 400 `invalid_request_error`.",
    },
    explanation:
      "A 401 is an authentication problem, not a transient failure. Such errors are not retried: they recur until the key is fixed.",
  },
  "da-5-q2": {
    prompt: "How does a 429 differ from a 529?",
    choices: {
      a: "429 means your organisation exceeded its rate limits; 529 means the API is temporarily overloaded for everyone.",
      b: "They are synonyms for different regions.",
      c: "429 is a client error that must not be retried; 529 can be.",
      d: "529 means the model was not found.",
    },
    whyWrong: {
      b: "The codes mean different things: one is about your limits, the other about service state.",
      c: "Both are transient, and both are retried with a pause.",
      d: "Model not found is 404 `not_found_error`.",
    },
    explanation:
      "429 `rate_limit_error` concerns your limits and often carries `retry-after`. 529 `overloaded_error` is a service condition. Both are handled with backoff retries, but a 429 also signals you should slow your own pace.",
  },
  "da-5-q3": {
    scenario:
      "A worker gets a 429 with a `retry-after: 20` header. Its own algorithm retries after 1, 2 and 4 seconds, and all three attempts get a 429 again.",
    prompt: "What should change?",
    choices: {
      a: "Remove the pauses and retry immediately.",
      b: "Increase attempts to 50.",
      c: "Switch to another API key from the same organisation.",
      d: "Wait at least as long as `retry-after` says before retrying.",
    },
    whyWrong: {
      a: "Instant retries just burn the limit and prolong the block.",
      b: "More attempts with the same pauses give more 429s, not success.",
      c: "Limits apply at the organisation level, so another key from the same org will not help.",
    },
    explanation:
      "`retry-after` is the server's direct indication of when a retry makes sense. Exponential backoff is the fallback when the header is absent.",
  },
  "da-5-q4": {
    prompt: "Which errors make sense to retry automatically?",
    choices: {
      a: "400 `invalid_request_error`",
      b: "429 `rate_limit_error`",
      c: "529 `overloaded_error`",
      d: "403 `permission_error`",
      e: "A dropped connection or network timeout",
    },
    whyWrong: {
      a: "An invalid request stays invalid on retry.",
      d: "Missing permissions for the key or organisation will not vanish on retry; it is an access-settings issue.",
    },
    explanation:
      "Retry transient failures: limits, overload, server errors and the network. 4xx errors caused by the request itself or credentials (400, 401, 403, 404, 413) are fixed in code or configuration.",
  },
  "da-5-q5": {
    prompt: "Why add jitter (a random component) to exponential backoff?",
    choices: {
      a: "To make retries faster on average.",
      b: "Because the API requires a random delay.",
      c: "So that many clients that failed at the same moment do not retry in sync and cause a new load spike.",
      d: "To avoid duplicate `request-id` values.",
    },
    whyWrong: {
      a: "Jitter is not about speed; it can make an individual pause longer or shorter.",
      b: "The API requires no such thing; it is a client-side practice.",
      d: "The server generates a `request-id` per request; jitter does not affect it.",
    },
    explanation:
      "Without jitter, clients that got a 529 together also retry together — a \"thundering herd\". The random component spreads retries over time.",
  },
  "da-5-q6": {
    prompt: "How do you increase the number of automatic retries in the Python SDK?",
    choices: {
      a: "`anthropic.Anthropic(max_retries=5)`, or per call `client.with_options(max_retries=5)`; by default the SDK makes 2 retries.",
      b: "The SDK does not retry itself; wrap every call in your own loop.",
      c: "Pass `retries=5` to `messages.create`.",
      d: "Set the `ANTHROPIC_RETRIES=5` variable.",
    },
    whyWrong: {
      b: "The SDK has built-in backoff retries for transient errors.",
      c: "There is no such body parameter; it is a client setting.",
      d: "The SDK does not read such an environment variable.",
    },
    explanation:
      "The SDK automatically retries 408, 409, 429, 5xx and connection errors with exponential backoff. `max_retries` is set on the client or overridden per call.",
  },
  "da-5-q7": {
    scenario:
      "A wrapper retries any exception up to 5 times with a pause. After a deploy with a bug in building `messages`, the service became very slow to respond, while the request bill did not change.",
    prompt: "What is wrong with the wrapper?",
    choices: {
      a: "The pauses are too short.",
      b: "It retries deterministic 400s that will never succeed; only transient errors should be retried.",
      c: "It should retry 10 times instead of 5.",
      d: "It should catch only `Exception`, not `BaseException`.",
    },
    whyWrong: {
      a: "No pause will fix an invalid request.",
      c: "More attempts only add latency to guaranteed failures.",
      d: "The issue is not the exception hierarchy but that non-retryable errors are being retried.",
    },
    explanation:
      "Error classification is the foundation of a retry policy. Failed 400s are not billed, so the bill did not change, but each request waited through all 5 attempts before the inevitable failure.",
  },
  "da-5-q8": {
    prompt: "Order the steps of a retry policy for an API call.",
    choices: {
      a: "Catch the error and determine its type or status",
      b: "Check whether it is transient (429, 5xx, 529, network)",
      c: "Compute the pause: `retry-after` or exponential backoff with jitter",
      d: "Wait and retry, counting attempts",
      e: "After the attempt limit, surface the error or switch to a fallback path",
    },
    explanation:
      "A robust policy: classify, wait as long as the server or backoff says, cap attempts, and have a plan for when they run out.",
  },
  // ── Boss: BOSS: Production API client ────────────────────────────────────
  "da-boss-q1": {
    scenario:
      "The service has its own `fetch` wrapper around `/v1/messages`: a hand-written SSE parser, retries on any status ≥ 400 and error parsing by message text. The team keeps losing time on bugs in this wrapper.",
    prompt: "What is the best decision?",
    choices: {
      a: "Add retries for network errors to the wrapper too.",
      b: "Rewrite the wrapper on WebSocket for a more stable stream.",
      c: "Move to the official SDK: typed exceptions, built-in backoff retries for transient errors only, and streaming helpers.",
      d: "Drop streaming to get rid of the parser.",
    },
    whyWrong: {
      a: "It patches one hole while keeping the brittle parser, retries on 400 and error-text parsing.",
      b: "The Messages API serves SSE; it has no WebSocket endpoint.",
      d: "That hurts UX and causes timeouts on long replies; the problem is the home-made client, not streaming.",
    },
    explanation:
      "The official SDK already solves a production client's standard problems: error classification, retries, timeouts, stream assembly. Write your own code on top of it, not instead of it.",
  },
  "da-boss-q2": {
    scenario:
      "A chat streams replies. Some long replies stop in the middle of code, and the UI shows them as complete. The backend forwards only `text_delta` and ignores other events.",
    prompt: "What should be added?",
    choices: {
      a: "Read `stop_reason` from `message_delta`; for `max_tokens`, mark the reply as truncated, offer to continue, and revisit the limit.",
      b: "Automatically append a closing code fence at the end.",
      c: "Switch to non-streaming mode.",
      d: "Discard replies longer than a certain number of characters.",
    },
    whyWrong: {
      b: "It masks truncation: the code stays incomplete and the user does not see it.",
      c: "Truncation by `max_tokens` is independent of mode, and timeouts get worse.",
      d: "Length in characters does not say whether the reply finished.",
    },
    explanation:
      "A stream carries not only text but also completion metadata. `stop_reason` in `message_delta` is the only reliable signal of whether a reply is complete.",
  },
  "da-boss-q3": {
    scenario:
      "A cost dashboard sums `usage.input_tokens` and `usage.output_tokens` from logs. After enabling prompt caching, the dashboard showed input tokens dropping tenfold, while the Anthropic bill fell far less.",
    prompt: "What is wrong with the dashboard?",
    choices: {
      a: "The Anthropic bill lags by a month.",
      b: "Caching works only on some models.",
      c: "Streaming requests do not return `usage`.",
      d: "It ignores `cache_creation_input_tokens` and `cache_read_input_tokens`, which are also billed at their own rates.",
    },
    whyWrong: {
      a: "The mismatch is explained by what the dashboard counts.",
      b: "If caching did not work, `input_tokens` would not have dropped tenfold.",
      c: "They do: in `message_start` and `message_delta`.",
    },
    explanation:
      "With caching, part of the input moves from `input_tokens` to the cache fields: cache writes cost more than normal input, cache reads less. Accounting must include all three fields at their rates.",
  },
  "da-boss-q4": {
    prompt: "What belongs on a minimal checklist for a production Messages API client?",
    choices: {
      a: "A pinned model id and an explicit `effort` rather than relying on defaults.",
      b: "Logging `request-id`, `usage`, `stop_reason` and the model for every request.",
      c: "Retries for all 4xx so nothing gets lost.",
      d: "The API key in the frontend bundle to cut latency.",
      e: "Handling every `stop_reason`, including `max_tokens` and `refusal`.",
    },
    whyWrong: {
      c: "Most 4xx errors are deterministic; retrying them only adds latency.",
      d: "Anyone can extract a key from the browser; API calls are made only from the backend.",
    },
    explanation:
      "A production client is predictable (pinned model and settings), observable (logs with `request-id` and `usage`) and handles every outcome correctly, not just the happy path.",
  },
  "da-boss-q5": {
    scenario:
      "To avoid writing a backend, the frontend team calls the Messages API straight from the browser, sending the API key in a header. The key sits in a build variable.",
    prompt: "What should be done?",
    choices: {
      a: "Obfuscate the key in the bundle.",
      b: "Move calls to a backend that keeps the key in a secret store, authenticates users and limits their requests; revoke the key that went into the bundle.",
      c: "Set a low spend limit on the key and leave it as is.",
      d: "Generate a new key every day.",
    },
    whyWrong: {
      a: "The key still ends up in the browser's network requests, visible in DevTools.",
      c: "A limit reduces damage, but the key is still public and anyone can drain your budget.",
      d: "Every new key is just as public from the moment of deploy.",
    },
    explanation:
      "An API key is a server secret. A backend proxy also brings control: authentication, per-user limits, logging and request validation.",
  },
  "da-boss-q6": {
    prompt: "Order the steps for handling one user message in a production chat.",
    choices: {
      a: "Append the message to history and estimate its size with `count_tokens`",
      b: "If needed, compress old turns so there is room for output",
      c: "Open a stream with `messages.stream(...)` and forward `text_delta` to the client",
      d: "On `message_delta`, record `stop_reason` and `usage`",
      e: "Save the final `content` to history and write a log with the `request-id`",
    },
    explanation:
      "Context preparation, streamed delivery, capturing completion metadata and saving the full content form the skeleton of a reliable chat backend.",
  },
};
