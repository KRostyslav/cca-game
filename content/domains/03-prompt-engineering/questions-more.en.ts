import type { QuestionEn } from "@/lib/content/types";

/** Англійський дубль додаткового пулу. */
export const questionsMoreEn: Record<string, QuestionEn> = {
  "pe-1-q6": {
    prompt: "The model gives substantively correct but far too long answers. What do you change in the prompt?",
    choices: {
      a: "Set explicit boundaries: format, length and what must not appear in the answer.",
      b: 'Add "answer briefly".',
      c: "Reduce `max_tokens`.",
      d: "Lower the temperature.",
    },
    whyWrong: {
      b: 'That is the vaguest possible requirement: "briefly" means different things to you and to the model.',
      c: "The answer will be cut off mid-sentence instead of becoming more compact.",
      d: "Temperature affects variety, not verbosity.",
    },
    explanation:
      "Length is set by structure: \"three bullets, up to two sentences each, no preamble or summary\". A concrete form works where a general request does not.",
  },
  "pe-1-q7": {
    prompt: "What belongs in the system prompt of a production application?",
    choices: {
      a: "The assistant's role and the boundaries of its competence.",
      b: "Standing rules about response format.",
      c: "Policies that must always be followed.",
      d: "The specific user's question.",
      e: "Search results for the current request.",
    },
    whyWrong: {
      d: "That is the variable part: it belongs in the user message and would break caching in the system prompt.",
      e: "Request data is variable too — its place is after the stable prefix.",
    },
    explanation:
      "The system prompt holds what is identical across requests. That also makes it the best candidate for caching.",
  },
  "pe-1-q8": {
    prompt: 'Why does a "do not do X" instruction often work worse than "do Y"?',
    choices: {
      a: "A prohibition does not say what to do instead, so the model picks an alternative at random.",
      b: "The model does not understand negation.",
      c: "Prohibitions increase the cost of the request.",
      d: "Prohibitions conflict with the system prompt.",
    },
    whyWrong: {
      b: "It does understand; the problem is not grammar but the absence of a positive instruction.",
      c: "A difference of a few tokens has no practical significance.",
      d: "A conflict arises only when rules genuinely contradict each other.",
    },
    explanation:
      "A positive instruction narrows the space of answers; a prohibition merely removes one option among many. \"Write in the present tense\" is more reliable than \"do not use the past tense\".",
  },
  "pe-1-q9": {
    scenario:
      "An assistant answers customer questions. Sometimes it confidently invents product details absent from the context it was given.",
    prompt: "What do you add to the prompt?",
    choices: {
      a: "An explicit rule for missing data: if the answer is not in the supplied material, say so and suggest whom to ask.",
      b: 'A requirement to "be accurate".',
      c: "A prohibition on inventing things.",
      d: "A request to double-check the answer.",
    },
    whyWrong: {
      b: "The model already considers itself accurate: the requirement adds no information about how to act without data.",
      c: "Fabrication is not a deliberate decision you can forbid: what is needed is a defined path for \"I do not know\".",
      d: "Re-checking against the same context produces the same confident answer.",
    },
    explanation:
      "The model fills gaps when given no legitimate way out. An explicit permissible path — \"this is not in the materials\" — sharply reduces fabrication.",
  },
  "pe-1-q10": {
    prompt: "Why describe in the prompt who the answer is for?",
    choices: {
      a: "The audience determines the level of detail, terminology and tone — without it the model picks them at random.",
      b: "It is a requirement of the message format.",
      c: "It reduces the number of tokens in the answer.",
      d: "It affects the choice of model.",
    },
    whyWrong: {
      b: "No such requirement exists.",
      c: "It may increase it, if the audience needs explanations.",
      d: "You choose the model with a request parameter, not with an audience description.",
    },
    explanation:
      "\"An explanation for a backend developer\" and \"for a manager with no technical background\" are two different correct answers to the same question.",
  },
  "pe-1-q11": {
    prompt: "Put the prompt blocks for a task with large material in the recommended order.",
    choices: {
      a: "Role and standing rules",
      b: "Reference material and documents",
      c: "Data for this specific request",
      d: "The question itself and the response format requirements",
    },
    explanation:
      "The order serves two goals at once: quality on long context (material before the request) and caching (stable in front, variable behind).",
  },
  "pe-1-q12": {
    prompt: "A prompt contains five rules, two of which contradict each other. How will the model behave?",
    choices: {
      a: "Unpredictably: it will follow one or the other depending on the request, and the behaviour will look random.",
      b: "It will follow the rule that comes last.",
      c: "It will return an error about conflicting rules.",
      d: "It will ignore both conflicting rules.",
    },
    whyWrong: {
      b: "There is no guarantee of priority by position — a common but mistaken intuition.",
      c: "No validation of prompts for contradictions exists.",
      d: "It will try to honour them rather than discard them.",
    },
    explanation:
      "Contradictory instructions are the main cause of \"drifting\" behaviour. Before adding a new rule, check whether it conflicts with the existing ones.",
  },
  "pe-1-q13": {
    prompt: "Which signs indicate a prompt needs rewriting?",
    choices: {
      a: "It has grown from layers of patches for individual edge cases.",
      b: "It contains rules nobody remembers adding or why.",
      c: "It holds workarounds for an older model.",
      d: "It is longer than a hundred lines.",
      e: "It contains example answers.",
    },
    whyWrong: {
      d: "Length alone is not a problem: a complex task may need detailed instructions.",
      e: "Examples are a useful tool, not a sign of decay.",
    },
    explanation:
      "Prompts degrade like code: accumulated layers, forgotten rules, crutches for old conditions. Periodic refactoring with a dataset check restores their shape.",
  },
  "pe-1-q14": {
    prompt: 'What does a "success criterion" in a prompt mean and why does it matter?',
    choices: {
      a: "It describes what a good answer looks like; it gives the model a target and you a basis for evaluation.",
      b: "It is a technical request parameter.",
      c: "It is a synonym for output format.",
      d: "It is a requirement on answer length.",
    },
    whyWrong: {
      b: "No such parameter exists in the API — the criterion is expressed in text.",
      c: "Format is about structure, the criterion is about substance and quality.",
      d: "Length may be part of the criterion but does not exhaust it.",
    },
    explanation:
      "Without a criterion neither the model nor you know when the task is done. It also becomes the basis for evaluation: what is not stated cannot be measured.",
  },
  "pe-1-q15": {
    scenario:
      "The same prompt produces good answers on short texts and noticeably worse ones on 20-page documents.",
    prompt: "What do you check first?",
    choices: {
      a: "Where the instruction sits: with long input it must come after the material, not before it.",
      b: "Whether `max_tokens` is sufficient.",
      c: "Whether the temperature is too low.",
      d: "Whether the model supports that length.",
    },
    whyWrong: {
      b: "That would affect truncation of the answer, not its quality.",
      c: "Temperature does not explain a difference between short and long input.",
      d: "Twenty pages fit comfortably inside modern models' windows.",
    },
    explanation:
      "With long input, block placement has the strongest effect. An instruction lost in front of twenty pages of text competes with them for attention.",
  },
  "pe-1-q16": {
    prompt: "Why is an example of the desired answer more useful than describing it in words?",
    choices: {
      a: "It shows format, tone and level of detail unambiguously at once — things a description conveys slowly and imprecisely.",
      b: "It costs fewer tokens than a description.",
      c: "It guarantees the answer will be identical.",
      d: "It replaces the success criterion.",
    },
    whyWrong: {
      b: "An example is usually longer than a description; the gain is precision, not economy.",
      c: "An example sets a model to follow, not a template to copy.",
      d: 'An example shows "how", the criterion explains "what counts as good".',
    },
    explanation:
      "One well-chosen example conveys more than a paragraph of requirements. That is why few-shot remains the fastest way to fix the shape of an answer.",
  },
  "pe-2-q6": {
    prompt: "A prompt contains ten documents. What do numbering and a source name in the tags give you?",
    choices: {
      a: "The ability to demand an answer referencing a specific source, and to verify it.",
      b: "A reduction in token count.",
      c: "Automatic sorting of documents by relevance.",
      d: "A guarantee the model reads every document.",
    },
    whyWrong: {
      b: "Metadata adds tokens; the gain is in verifiability of the answer.",
      c: "Markup performs no sorting.",
      d: "Tags do not force reading — they only mark boundaries.",
    },
    explanation:
      "Named sources turn \"the model said\" into \"the model cited policy-2026.pdf\". That is the difference between a claim and a claim you can check.",
  },
  "pe-2-q7": {
    prompt: "Which parts of a prompt are worth marking up with tags?",
    choices: {
      a: "Documents and reference material.",
      b: "Examples of desired answers.",
      c: "Data arriving from the user.",
      d: "Every sentence of the instruction.",
      e: "Individual terminology words.",
    },
    whyWrong: {
      d: "That is noise: markup should separate blocks, not fragment the text.",
      e: "Terms are handled by a glossary or an explanation, not by tags.",
    },
    explanation:
      "Markup is needed where it would otherwise be unclear where one thing ends and another begins. Inside homogeneous text it only gets in the way.",
  },
  "pe-2-q8": {
    prompt: "The user text itself contains XML-like tags. Why is that dangerous?",
    choices: {
      a: "It can imitate the boundaries of your blocks and read as part of the instruction rather than as data.",
      b: "The API will reject such a request.",
      c: "The model will be unable to read such text.",
      d: "It doubles the token count.",
    },
    whyWrong: {
      b: "The API does not parse tags and has no reason to reject the request.",
      c: "It will read it — the question is only how it interprets it.",
      d: "The token count grows negligibly and has nothing to do with security.",
    },
    explanation:
      "Markup is a convention, not a protected format. If input data may contain tags, escape them or use less obvious block names.",
  },
  "pe-2-q9": {
    scenario:
      "A prompt contains the instruction, examples and documents as one continuous text. The model sometimes takes a document fragment for part of the instruction.",
    prompt: "What do you do?",
    choices: {
      a: "Separate the blocks with named tags and reference them from the instruction itself.",
      b: "Shorten the documents.",
      c: "Move the instruction to the beginning.",
      d: "Use a different model.",
    },
    whyWrong: {
      b: "The confusion comes from missing boundaries, not from volume.",
      c: "With long input that tends to make things worse and does not stop the blocks blending.",
      d: "The problem is structural: any model works worse with undivided text.",
    },
    explanation:
      "Explicit boundaries remove the need to guess. Referencing the tag in the instruction (\"based on <documents>\") further reinforces what is data and what is a directive.",
  },
  "pe-2-q10": {
    prompt: "Do tags in a prompt need to be closed?",
    choices: {
      a: "Yes — paired tags make block boundaries unambiguous, even though there is no formal validator.",
      b: "No, an opening tag is enough.",
      c: "Yes, otherwise the API returns an error.",
      d: "It does not matter, tags are ignored.",
    },
    whyWrong: {
      b: "Without a closing tag it is unclear where the block ends — the boundary becomes guesswork again.",
      c: "The API does not check markup and returns no such error.",
      d: "They are not ignored: the model uses them as a structural signal.",
    },
    explanation:
      "There is no validator, but the point of markup is clarity of boundaries. An unclosed tag defeats the very reason the tags were added.",
  },
  "pe-2-q11": {
    prompt: "Put the steps of preparing a prompt containing untrusted data in order.",
    choices: {
      a: "Check what powers the agent has in the first place",
      b: "Wrap the user data in a separate named block",
      c: "Add a rule not to follow instructions from that block",
      d: "Test the behaviour against sample injection attempts",
    },
    explanation:
      "Start with permissions: if the dangerous action does not exist, an injection achieves nothing. Markup and the rule are later layers, and an injection test shows whether they hold.",
  },
  "pe-2-q12": {
    prompt: "How should tags be named to be useful?",
    choices: {
      a: "Semantically: `<policy>`, `<user_message>`, `<examples>` — so the instruction can reference them.",
      b: "As short as possible: `<a>`, `<b>`, `<c>`.",
      c: "As random strings for uniqueness.",
      d: "Identically for all blocks.",
    },
    whyWrong: {
      b: "Short names save a few tokens and lose the main thing — the meaning of the block.",
      c: "Uniqueness is not needed; clarity for the model and for you is.",
      d: "Then the markup stops distinguishing blocks and loses its purpose.",
    },
    explanation:
      "A tag works like a variable name: it should explain the content. Then \"summarise <policy> without relying on <user_message>\" reads unambiguously.",
  },
  "pe-2-q13": {
    prompt: "What is true about the role of markup in defending against injections?",
    choices: {
      a: "It lowers the chance that text from data is taken as a command.",
      b: "It only works together with limiting the agent's powers.",
      c: "It is not a technical barrier and blocks nothing.",
      d: "It escapes special characters in the input data.",
      e: "It makes injections impossible.",
    },
    whyWrong: {
      d: "No escaping takes place — it is ordinary text in the prompt.",
      e: "A probabilistic layer offers no guarantees; only permissions do.",
    },
    explanation:
      "Markup is a useful but supporting layer. It reduces risk, which is exactly why it must not be mistaken for the mechanism that removes it.",
  },
  "pe-2-q14": {
    scenario:
      "An assistant receives search results in the prompt as a dozen fragments. It blends them in the answer so that it is impossible to tell which claim came from where.",
    prompt: "How do you fix that?",
    choices: {
      a: "Give each fragment an identifier in the markup and require a reference to it beside every claim.",
      b: "Reduce the number of fragments to three.",
      c: "Ask for shorter answers.",
      d: "Merge the fragments into a single text.",
    },
    whyWrong: {
      b: "Attribution does not appear by reducing the count — it just becomes a less visible problem.",
      c: "A shorter answer without references stays equally unverifiable.",
      d: "That removes the boundaries entirely and makes attribution impossible.",
    },
    explanation:
      "Attribution requires addressability: without fragment identifiers the model physically cannot cite a source. Markup provides those addresses.",
  },
  "pe-2-q15": {
    prompt: "Does markup affect prompt caching?",
    choices: {
      a: "Indirectly: it helps keep stable blocks separate from variable ones, which is the precondition for caching.",
      b: "No, the cache only works with plain text.",
      c: "Yes, tags extend the cache's lifetime.",
      d: "Yes, tags make caching impossible.",
    },
    whyWrong: {
      b: "The cache works on prefix bytes regardless of whether they contain tags.",
      c: "TTL is determined by caching parameters, not by markup.",
      d: "Markup creates no obstacle to caching.",
    },
    explanation:
      "Markup itself is neutral for the cache. But a structured prompt is easier to compose correctly: stable blocks in front, variable ones after the cache breakpoint.",
  },
  "pe-2-q16": {
    prompt: "The prompt is well structured with tags, yet the model still followed an instruction from the user message. What does that mean?",
    choices: {
      a: "Markup did its job, but it is probabilistic: the guarantee comes only from the dangerous action being absent from permissions.",
      b: "The tags were named incorrectly.",
      c: "Another level of tag nesting is needed.",
      d: "The model is faulty.",
    },
    whyWrong: {
      b: "Naming affects clarity, but even perfect names do not turn markup into a barrier.",
      c: "Deeper nesting does not change the nature of the mechanism.",
      d: "This is an expected property of a probabilistic system, not a defect.",
    },
    explanation:
      "The key lesson of this domain: everything living in prompt text influences but does not guarantee. Guarantees begin where the agent's powers end.",
  },
  "pe-3-q6": {
    prompt: "How many examples are usually enough for few-shot?",
    choices: {
      a: "Three to five varied ones covering typical and borderline cases.",
      b: "One, if it is very detailed.",
      c: "Twenty or more — the more the better.",
      d: "As many as there are categories, one per category.",
    },
    whyWrong: {
      b: "A single example does not show what varies from case to case.",
      c: "Past a point, examples only add tokens and bias the model toward the most frequent pattern.",
      d: "Categories differ in difficulty: some need several examples, some none at all.",
    },
    explanation:
      "Examples define boundaries, not statistics. A few well-chosen borderline cases are more useful than a dozen alike ones.",
  },
  "pe-3-q7": {
    prompt: "What does the `effort` parameter control on current models?",
    choices: {
      a: "The overall level of deliberation and thoroughness — from `low` to `max`.",
      b: "The number of tokens in the answer.",
      c: "Generation speed.",
      d: "The size of the context window.",
    },
    whyWrong: {
      b: "Answer length is capped by `max_tokens`; `effort` affects how deeply the work is done.",
      c: "Speed is a consequence, not the thing being configured.",
      d: "The window is a property of the model, not of this parameter.",
    },
    explanation:
      "`effort` lives inside `output_config` and replaces the old fixed-budget logic: you set a level of thoroughness rather than a number of reasoning tokens.",
  },
  "pe-3-q8": {
    prompt: "What makes a few-shot example bad?",
    choices: {
      a: "It contains a mistake the model will reproduce as a pattern.",
      b: "Its format differs from what is expected in the answer.",
      c: "It describes a case that never occurs in practice.",
      d: "It is short.",
      e: "It covers a borderline case.",
    },
    whyWrong: {
      d: "Brevity is not a flaw: an example should be illustrative, not long.",
      e: "Borderline examples are the most valuable — they show the edge of the category.",
    },
    explanation:
      "An example is a pattern to imitate. A mistake in it becomes systematic, a mismatched format breaks the output, and an unrealistic case wastes context.",
  },
  "pe-3-q9": {
    prompt: "You show users the model's line of reasoning. What must be configured?",
    choices: {
      a: '`thinking.display: "summarized"` — on newer models the reasoning text is not returned by default.',
      b: "Nothing: reasoning is always returned.",
      c: "Increase `max_tokens`.",
      d: "Enable a separate beta header.",
    },
    whyWrong: {
      b: "On newer models the default is `omitted`, meaning empty reasoning text.",
      c: "The output limit does not determine whether reasoning text is returned.",
      d: "Adaptive thinking and its display need no beta flag.",
    },
    explanation:
      "Visibility is controlled separately from the reasoning itself: it always happens and is always billed, while `display` only decides whether you see a summary.",
  },
  "pe-3-q10": {
    scenario:
      "A classifier with five examples works well on typical enquiries but systematically errs on short two- or three-word messages.",
    prompt: "What do you do?",
    choices: {
      a: "Add several examples of exactly those short enquiries with correct labels.",
      b: "Add five more examples of typical enquiries.",
      c: "Require users to write more fully.",
      d: "Raise `effort` to `max`.",
    },
    whyWrong: {
      b: "That reinforces what already works and says nothing about short messages.",
      c: "Changing user behaviour for the classifier's convenience is not a solution.",
      d: "Deeper reasoning does not compensate for a missing pattern for this input type.",
    },
    explanation:
      "Examples describe the input distribution. If they contain no short messages, the model treats them as an anomaly — which is exactly where systematic errors appear.",
  },
  "pe-3-q11": {
    prompt: "Why should `budget_tokens` not be used in new code?",
    choices: {
      a: "It has been removed on current models: a request containing it returns a 400 error.",
      b: "It makes answers too long.",
      c: "It is incompatible with tool use.",
      d: "It is only available in beta.",
    },
    whyWrong: {
      b: "It limited reasoning rather than lengthening the answer.",
      c: "There was no incompatibility with tools; the parameter is simply obsolete.",
      d: "This is not about beta status: the parameter is removed on newer models.",
    },
    explanation:
      "A fixed reasoning budget was replaced by adaptive thinking plus `effort`. It still works on older models, but new code should not rely on it.",
  },
  "pe-3-q12": {
    prompt: "Put the steps of adding few-shot examples to a prompt in order.",
    choices: {
      a: "Gather real cases, including ones where the model errs",
      b: "Pick three to five varied ones with correct answers",
      c: "Normalise them to the format expected in the response",
      d: "Check the result on a separate set that excludes those examples",
    },
    explanation:
      "The last step is mandatory: examples that went into the prompt cannot be used for evaluation — otherwise the metric measures memorisation.",
  },
  "pe-3-q13": {
    prompt: "When is it worth lowering `effort` to `low`?",
    choices: {
      a: "On simple high-volume tasks where deeper reasoning does not improve the result and cost and latency matter.",
      b: "When maximum accuracy is required.",
      c: "When the answer must be shorter.",
      d: "Always — it is a safe default.",
    },
    whyWrong: {
      b: "For accuracy you raise the level, not lower it.",
      c: "Answer length is governed by the shape of the request, not by reasoning depth.",
      d: "The `high` default was not chosen by accident; lowering it should be justified.",
    },
    explanation:
      "`effort` is the first lever in the quality-versus-cost trade-off. Lower it where measurement shows quality does not suffer.",
  },
  "pe-3-q14": {
    prompt: "What is true about handling thinking blocks in a multi-turn conversation?",
    choices: {
      a: "They are returned unchanged when continuing on the same model.",
      b: "They must not be edited or trimmed before sending.",
      c: "They are billed regardless of whether you see them.",
      d: "They should be deleted to save context.",
      e: "They can be shown to the user in raw form.",
    },
    whyWrong: {
      d: "Deleting them breaks continuation on the same model — the saving turns into errors.",
      e: "The raw chain of thought is never returned; only a summary is available.",
    },
    explanation:
      "Thinking blocks are part of the conversation state, not decorative output. Treat them as data: pass them back as they are.",
  },
  "pe-3-q15": {
    scenario:
      "A prompt contains a detailed seven-step instruction. After moving to a model with adaptive thinking, answer quality on hard cases dropped.",
    prompt: "What do you try first?",
    choices: {
      a: "Simplify the instruction down to the goal and the constraints, leaving the model free to choose the path.",
      b: "Add three more steps for precision.",
      c: "Lower `effort`.",
      d: "Go back to the previous model.",
    },
    whyWrong: {
      b: "More prescriptiveness reinforces exactly what stops the model planning for itself.",
      c: "That reduces reasoning depth where it is needed most.",
      d: "It postpones the problem and forfeits the new model's advantages.",
    },
    explanation:
      "A rigid step-by-step script was written for a model that did not plan on its own. For a reasoning model it becomes a constraint rather than help.",
  },
  "pe-3-q16": {
    prompt: "Where in the prompt should few-shot examples go?",
    choices: {
      a: "In a separate named block after the instruction and before the current request's data.",
      b: "Interleaved with the request data.",
      c: "At the very end, after the question.",
      d: "Duplicated at the start and at the end.",
    },
    whyWrong: {
      b: "The model would stop distinguishing the pattern from the material it must process.",
      c: "Then the examples compete with the question for attention and serve worse as a pattern.",
      d: "Duplication doubles the tokens for no benefit.",
    },
    explanation:
      "Examples are a stable part of the prompt, so they belong beside the instruction and inside the cached prefix, not among the variable request data.",
  },
  "pe-4-q6": {
    prompt: "Your response schema has a `category: string` field. The model returns values you did not expect. What do you change?",
    choices: {
      a: "Replace the type with an `enum` listing the allowed categories.",
      b: "Add a field description listing the categories in text.",
      c: "Check the value after the response and reject unknown ones.",
      d: "Lower the temperature.",
    },
    whyWrong: {
      b: "A description helps but is not validated: an unexpected value still passes.",
      c: "A workable safety net, but it is cheaper to stop such values appearing at all.",
      d: "Stability does not narrow the set of possible field values.",
    },
    explanation:
      "`enum` is the most direct way to close a value set. It documents the intent and is checked automatically.",
  },
  "pe-4-q7": {
    prompt: "What is required for `strict: true` to work?",
    choices: {
      a: "`additionalProperties: false` in the schema.",
      b: "A `required` list for mandatory fields.",
      c: "The flag set on the tool itself.",
      d: "A beta header on the request.",
      e: "Disabling parallel tool calls.",
    },
    whyWrong: {
      d: "Strict mode is available without beta flags.",
      e: "These settings are independent of one another.",
    },
    explanation:
      "A guarantee is only possible for a closed schema: without forbidding extra properties and listing required ones there is nothing to enforce.",
  },
  "pe-4-q8": {
    prompt: "When is structured output unnecessary?",
    choices: {
      a: "When a human reads the result rather than a program: a rigid schema only constrains a useful explanation.",
      b: "When the answer has many fields.",
      c: "When working with tools.",
      d: "When high precision is needed.",
    },
    whyWrong: {
      b: "A complex structure is, on the contrary, the best case for a schema.",
      c: "Tool use and structured output combine perfectly well.",
      d: "Precision of form is exactly what a schema provides.",
    },
    explanation:
      "A schema is needed where code consumes the answer. For text a human will read, it removes flexibility while adding nothing.",
  },
  "pe-4-q9": {
    scenario:
      'A pipeline requires JSON with ten fields. The model returns valid JSON, but two fields are often filled meaninglessly — "n/a", "unknown", "-".',
    prompt: "What does that mean?",
    choices: {
      a: "The schema forces filling fields for which the input has no data: make them optional or allow null with explicit semantics.",
      b: "The model understands JSON poorly.",
      c: "`max_tokens` needs increasing.",
      d: "`strict: true` is needed.",
    },
    whyWrong: {
      b: "The JSON is valid — the problem is field semantics, not format.",
      c: "Volume is unrelated to missing data for specific fields.",
      d: "Strict mode guarantees the shape but will not make data appear.",
    },
    explanation:
      "A required field with no data is an invitation to invent. Explicit optionality or `null` describes reality honestly and keeps the data usable downstream.",
  },
  "pe-4-q10": {
    prompt: "How many times is it worth retrying after a failed validation?",
    choices: {
      a: "Once or twice with the error explained, then into a review queue: a persistent error will not fix itself.",
      b: "Until it succeeds, with no limit.",
      c: "Never: a validation error should go straight to the user.",
      d: "Five times with a random temperature.",
    },
    whyWrong: {
      b: "A persistent schema or prompt defect turns that into an infinite loop with a bill attached.",
      c: "Often a single retry with an explanation is enough to get a correct answer.",
      d: "Randomness does not address the cause, it only widens the spread of results.",
    },
    explanation:
      "A retry with an explanation cures random failures. If it has not helped twice, the problem is systemic — and belongs in a review queue, not in more attempts.",
  },
  "pe-4-q11": {
    prompt: "Put the steps of reliably obtaining structured data in order.",
    choices: {
      a: "Describe the schema with types, enums and required fields",
      b: "Enable structured output or strict tool use",
      c: "Validate the response on your own side",
      d: "Retry failures with an explanation and record the ones that still fail",
    },
    explanation:
      "The schema removes most problems, your own validation catches the remainder, and recording failures stops them disappearing silently.",
  },
  "pe-4-q12": {
    prompt: "Why does a field description in the schema affect how well it is filled?",
    choices: {
      a: "The schema enters the context as an instruction: the description tells the model what exactly belongs in the field.",
      b: "Descriptions are used only to generate documentation.",
      c: "Descriptions affect validation.",
      d: "Descriptions reduce the cost of the request.",
    },
    whyWrong: {
      b: "They go to the model together with the schema and influence the result.",
      c: "Validation checks types and structure, not conformance to a description.",
      d: "They add tokens to the input.",
    },
    explanation:
      "A schema is also a prompt. An `amount` field described as \"amount in cents, no currency\" is filled differently from a bare `amount: number`.",
  },
  "pe-4-q13": {
    prompt: "What do you do with responses that fail validation in production?",
    choices: {
      a: "Retry a limited number of times with the specific error explained.",
      b: "Record the failing cases together with their input for analysis.",
      c: "Track their share as a quality metric.",
      d: "Silently skip such records.",
      e: "Fix the output by hand with regular expressions.",
    },
    whyWrong: {
      d: "A silent skip hides the problem and distorts data downstream.",
      e: "A brittle approach that masks the cause and breaks on the first unusual case.",
    },
    explanation:
      "A failed validation is a signal, not an obstacle. A retry rescues random failures, a log reveals systemic ones, and the failure rate becomes a health metric for the pipeline.",
  },
  "pe-4-q14": {
    scenario:
      "Code parses the model's response with string search, because JSON sometimes arrives inside a markdown fence. Occasionally parsing breaks on responses with several code blocks.",
    prompt: "What is the right solution?",
    choices: {
      a: "Move to structured output with a schema — then the response is data rather than text you must extract data from.",
      b: "Improve the regular expression that finds the blocks.",
      c: "Ask the model not to use markdown.",
      d: "Take the last code block in the response.",
    },
    whyWrong: {
      b: "That cures one more individual case and leaves the class of problem in place.",
      c: "A request reduces the frequency but gives no format guarantee.",
      d: "A heuristic that breaks the moment block order changes.",
    },
    explanation:
      "Extracting data from free text is a permanent race against new cases. A schema removes the extraction step entirely.",
  },
  "pe-4-q15": {
    prompt: "How does `strict: true` differ from structured output via `output_config.format`?",
    choices: {
      a: "The first guarantees the shape of tool arguments, the second the shape of the model's own response.",
      b: "They are two names for the same mechanism.",
      c: "`strict` only works in beta.",
      d: "`output_config.format` is deprecated.",
    },
    whyWrong: {
      b: "They apply to different parts of the request: call arguments and the response.",
      c: "Strict mode is available without a beta header.",
      d: "What is deprecated is the `output_format` parameter; the current form is exactly `output_config.format`.",
    },
    explanation:
      "Both provide schema guarantees, but in different places. For tools use `strict`, for the answer to the user use structured output.",
  },
  "pe-4-q16": {
    prompt: "A response schema has 40 fields and the fill quality is poor. What do you try?",
    choices: {
      a: "Split the task: extract groups of fields in separate requests with smaller schemas.",
      b: "Add a description to every field and keep the schema as is.",
      c: "Remove `required` from all fields.",
      d: "Increase `max_tokens`.",
    },
    whyWrong: {
      b: "Descriptions will help, but they do not remove the load of filling forty fields at once.",
      c: "Then the model will simply skip the hard fields and the data becomes incomplete.",
      d: "The problem is task complexity, not room for the answer.",
    },
    explanation:
      "Forty fields in one pass is forty decisions at once. Splitting into groups improves quality and lets you verify each part separately.",
  },
  "pe-5-q6": {
    prompt: "How many examples should a minimally useful evaluation set contain?",
    choices: {
      a: "Enough to cover the important categories and typical borderline cases — even 20–30 examples beat none at all.",
      b: "At least a thousand, otherwise the result is unreliable.",
      c: "Exactly as many as there are examples in the prompt.",
      d: "One illustrative example.",
    },
    whyWrong: {
      b: "Demanding a thousand examples up front usually means the evaluation never appears at all.",
      c: "These sets must be different: shared examples create leakage.",
      d: "One example shows neither the distribution of errors nor regressions.",
    },
    explanation:
      "A perfect set is unattainable; a small measurable one is real. What matters is that it covers the categories where an error costs the most.",
  },
  "pe-5-q7": {
    prompt: "What should an LLM judge's rubric contain?",
    choices: {
      a: "Specific criteria the score is assigned against.",
      b: "Example answers at different quality levels.",
      c: "Guidance on what to do in ambiguous cases.",
      d: "A request to be strict.",
      e: "The name of the model being assessed.",
    },
    whyWrong: {
      d: "Strictness without criteria only shifts the scores, it does not make them accurate.",
      e: "Knowing who wrote the answer can only bias the judge.",
    },
    explanation:
      "A judge without a rubric grades by taste. Criteria, level examples and a rule for the grey zone make its scores reproducible.",
  },
  "pe-5-q8": {
    prompt: "Your evaluation shows 95% on your set, but users complain. What is the most likely cause?",
    choices: {
      a: "The set does not reflect the real distribution of requests: the cases where the system fails are missing from it.",
      b: "The metric is computed incorrectly.",
      c: "Users have wrong expectations.",
      d: "A more capable model is needed.",
    },
    whyWrong: {
      b: "Possible, but far more often the problem is the set's representativeness.",
      c: "That is the most convenient and most dangerous explanation: it closes off the path to finding the cause.",
      d: "The model does not explain a gap between laboratory numbers and reality.",
    },
    explanation:
      "An evaluation measures what is in the set. If the genuinely hard real cases never made it in, a high score only means you solve the easy tasks well.",
  },
  "pe-5-q9": {
    scenario:
      "A team adds every user-reported case to the evaluation set. Six months later 80% of the set consists of rare edge cases.",
    prompt: "What is wrong with that?",
    choices: {
      a: "The metric no longer reflects real traffic: an improvement on it may mean nothing for most users.",
      b: "The set has become too large.",
      c: "Edge cases cannot be evaluated automatically.",
      d: "Nothing: hard cases matter most.",
    },
    whyWrong: {
      b: "Size alone is not the problem; the skewed distribution is.",
      c: "They can be — the question is only their share relative to typical cases.",
      d: "They matter, but they should not crowd typical traffic out of the metric.",
    },
    explanation:
      "The set must mirror reality. It helps to keep edge cases as a separate group and watch both metrics rather than blending them into one number.",
  },
  "pe-5-q10": {
    prompt: "Why fix the model version when evaluating prompts?",
    choices: {
      a: "Otherwise you cannot tell what changed: your prompt or the model's behaviour.",
      b: "To reduce the cost of runs.",
      c: "To make caching work.",
      d: "It is an API requirement.",
    },
    whyWrong: {
      b: "Cost depends on the model, not on whether the version is pinned.",
      c: "Caching depends on the request prefix, not on a pin in the test configuration.",
      d: "The API requires nothing to be pinned — this is methodological discipline.",
    },
    explanation:
      "An evaluation compares changes. If two things change at once the result is uninterpretable: that is why an experiment holds everything fixed except one variable.",
  },
  "pe-5-q11": {
    prompt: "Put the steps of verifying a prompt change in order.",
    choices: {
      a: "State what exactly should improve",
      b: "Run the baseline and the new version on the same set",
      c: "Compare the numbers and the per-category breakdown",
      d: "Check for regressions where an error costs the most",
    },
    explanation:
      "Without the first step you look for improvement where none was planned; without the last you ship a change that raised the average and broke the critical case.",
  },
  "pe-5-q12": {
    prompt: "What is LLM-judge drift?",
    choices: {
      a: "A gradual divergence of its scores from human ones — through a model change, a rubric change or a change in the data.",
      b: "The cost of evaluation rising over time.",
      c: "The judge's response time increasing.",
      d: "A change in its output format.",
    },
    whyWrong: {
      b: "That is a budget question, not one of judging quality.",
      c: "Latency has nothing to do with whether the scores match reality.",
      d: "Format is caught by validation; drift concerns the judgements themselves.",
    },
    explanation:
      "A judge is a system like the prompt it grades and needs checking too. Periodic comparison with human ratings catches drift before it distorts every metric.",
  },
  "pe-5-q13": {
    prompt: "What can be checked deterministically, without a judge model?",
    choices: {
      a: "Conformance of the response to the schema and field types.",
      b: "Presence of required elements in the answer.",
      c: "Exact match for tasks with a single correct answer.",
      d: "How convincing an explanation is.",
      e: "Whether the tone suits the audience.",
    },
    whyWrong: {
      d: "That is a subjective property, which is exactly what a judge or a human is for.",
      e: "Tone is judged subjectively and formalises poorly as rules.",
    },
    explanation:
      "The rule is simple: anything checkable by code is checked by code. A judge model is reserved for what genuinely requires judgement.",
  },
  "pe-5-q14": {
    scenario:
      "Two prompt versions score 84% and 86% on a set of a hundred examples. The team is ready to ship the second.",
    prompt: "What should be taken into account?",
    choices: {
      a: "A two-example difference out of a hundred may be noise: look at the breakdown and repeat the run before concluding.",
      b: "The second version is definitively better.",
      c: "Pick whichever is shorter.",
      d: "Raise the temperature and repeat.",
    },
    whyWrong: {
      b: "On a set that size, 2 percentage points is two examples — easily explained by chance.",
      c: "Prompt length is not a quality criterion.",
      d: "That adds spread and makes the comparison even less reliable.",
    },
    explanation:
      "A small set gives a coarse scale. Before celebrating +2 points, make sure it is not two random examples that changed sign.",
  },
  "pe-5-q15": {
    prompt: "What do you do with examples both prompt versions always answer correctly?",
    choices: {
      a: "Keep them as regression protection, but do not rely on them when comparing versions.",
      b: "Delete them: they are uninformative.",
      c: "Duplicate them to raise the average score.",
      d: "Move them into the prompt as few-shot examples.",
    },
    whyWrong: {
      b: "They are precisely what catches a regression when a new version breaks what used to work.",
      c: "That artificially inflates the metric and hides real problems.",
      d: "Then they become leakage and stop being usable for evaluation.",
    },
    explanation:
      "Easy examples show no progress, but they serve another purpose — signalling when a change has broken baseline behaviour.",
  },
  "pe-5-q16": {
    prompt: "When should an evaluation run automatically?",
    choices: {
      a: "On every change of prompt, schema or model — otherwise users will be the ones to notice the regression.",
      b: "Once a quarter before a release.",
      c: "Only when the model changes.",
      d: "When complaints arrive.",
    },
    whyWrong: {
      b: "In a quarter so many changes accumulate that finding the culprit becomes hard.",
      c: "Prompt changes break quality no less often than model changes.",
      d: "Then the evaluation stops being a safeguard and becomes an investigation.",
    },
    explanation:
      "An evaluation is valuable as part of the pipeline, not as a one-off exercise. Running it on every change makes a regression visible before a user sees it.",
  },
  "pe-b-q6": {
    scenario:
      "An assistant works with a 200-page knowledge base. The whole base sits in the system prompt, caching is on and working, and the cost is acceptable. But on narrow questions the model gives vague answers.",
    prompt: "What do you do?",
    choices: {
      a: "Switch to search over the base: only relevant fragments enter the context, while the stable system prompt stays cached.",
      b: "Raise `effort` to `max`.",
      c: "Split the base into four prompts and query all four.",
      d: "Nothing: caching makes the solution optimal.",
    },
    whyWrong: {
      b: "Deeper reasoning does not compensate for relevant material drowning among two hundred pages.",
      c: "Four times more expensive, and the vagueness remains in each of them.",
      d: "Caching solves cost, not quality — and the complaint is about quality.",
    },
    explanation:
      "Caching removes the price question but not the model's attention. When less than a percent of the context is relevant, only selectivity helps, not volume.",
  },
  "pe-b-q7": {
    scenario:
      "A classification prompt has worked steadily for a year. Suddenly accuracy drops 15% in a week, although neither the code nor the prompt changed.",
    prompt: "What do you check first?",
    choices: {
      a: "Whether the nature of the input changed: new enquiry types, a different language, a different format.",
      b: "Whether the response parser broke.",
      c: "Whether the temperature should be raised.",
      d: "Whether it is time to rewrite the prompt from scratch.",
    },
    whyWrong: {
      b: "Then the successful-parse rate would drop, not accuracy — and that is visible separately.",
      c: "Temperature was not the reason it worked for a year, and it will not be the cure.",
      d: "Rewriting without knowing the cause is the road to a second drop.",
    },
    explanation:
      "A prompt does not degrade on its own. A sudden drop with unchanged code almost always means the input distribution shifted — and that is what must be measured.",
  },
  "pe-b-q8": {
    scenario:
      "The product requires that the assistant never give legal advice. This is currently written in the system prompt, and occasionally the model gives it anyway.",
    prompt: "How do you strengthen the guarantee?",
    choices: {
      a: "Add a check before display: a classifier or rules that detect legal advice and replace the answer with a referral to a professional.",
      b: "Rewrite the rule in the prompt more emphatically.",
      c: 'Forbid the word "law" in answers.',
      d: "Lower the temperature.",
    },
    whyWrong: {
      b: "That is the same probabilistic layer that has already failed.",
      c: "Word matching does not catch the substance of advice and breaks legitimate answers.",
      d: "Stable phrasing does not guarantee policy compliance.",
    },
    explanation:
      'A "never" policy cannot be enforced by a prompt alone. It needs a verification layer on the output — just as business rules are moved into tool code.',
  },
  "pe-b-q9": {
    scenario:
      "One system prompt serves three different products. Every change made for one of them breaks something in the other two.",
    prompt: "How do you resolve that?",
    choices: {
      a: "Extract the shared part and give each product its own overlay, evaluating them with independent sets.",
      b: "Freeze the prompt and stop changing it.",
      c: 'Add conditional instructions: "if product A, then…".',
      d: "Evaluate changes only on the product they were made for.",
    },
    whyWrong: {
      b: "That halts development of all three products to avoid conflicts.",
      c: "Conditional logic in prose quickly becomes unreadable and self-conflicting.",
      d: "That is exactly how regressions reach the other two products unnoticed.",
    },
    explanation:
      "A shared prompt for different products is like a shared function with three different contracts. Separating responsibilities and using separate evaluation sets removes the conflict.",
  },
  "pe-b-q10": {
    scenario:
      "A team plans to update the system prompt of a large service. The change is big and everyone is nervous.",
    prompt: "How do you ship it safely?",
    choices: {
      a: "Run it against the set with a per-category breakdown, roll it out to a share of traffic and compare the metrics with the baseline.",
      b: "Roll it out to all traffic at night when load is lower.",
      c: "Have a few engineers test it manually.",
      d: "Ship it and roll back quickly if complaints arrive.",
    },
    whyWrong: {
      b: "Lower load does not make the change safer — fewer people simply see the consequences right away.",
      c: "Manual checking does not scale and misses regressions in rare categories.",
      d: "Complaints are the slowest and most expensive regression detector.",
    },
    explanation:
      "A production prompt deserves the same discipline as code: measurement before shipping, gradual rollout and comparison against the baseline.",
  },
  "pe-b-q11": {
    scenario:
      "A cost analysis shows that 70% of input tokens go to few-shot examples, of which the prompt has twenty.",
    prompt: "What do you do?",
    choices: {
      a: "Cut down to the few most informative ones and measure quality: surplus examples often add nothing.",
      b: "Remove all the examples.",
      c: "Leave it as is: the examples are critical.",
      d: "Move the examples into the user message.",
    },
    whyWrong: {
      b: "The format and category boundaries would go with them — quality would drop.",
      c: "Not all twenty are critical; that assumption is worth testing by measurement.",
      d: "That only breaks caching without reducing the volume.",
    },
    explanation:
      "The number of examples is rarely revisited after they are added. Trimming with measurement often preserves quality and noticeably lowers the fixed cost.",
  },
  "pe-b-q12": {
    scenario:
      "An assistant must answer in several languages. Each language currently has its own system prompt, and they have gradually drifted apart in their rules.",
    prompt: "How do you tidy this up?",
    choices: {
      a: "Keep a single prompt with the rules, set the response language separately, and put language specifics into short overlays.",
      b: "Keep separate prompts and synchronise them by hand.",
      c: "Translate a single prompt on the fly.",
      d: "Use different models for different languages.",
    },
    whyWrong: {
      b: "Manual synchronisation of five texts drifts apart again within a few releases.",
      c: "The prompt need not be in the response language, and machine-translating instructions adds distortion.",
      d: "That is unrelated to prompt language and only multiplies configurations.",
    },
    explanation:
      "Behaviour rules do not depend on the response language. Splitting into shared logic plus a language overlay removes duplication and drift between versions.",
  },
  "pe-b-q13": {
    scenario:
      "The prompt contains ten rules added over a year. Nobody remembers which are still needed, and removing them feels risky.",
    prompt: "How do you clean it up safely?",
    choices: {
      a: "Remove one rule at a time with a run against the set: whatever changes nothing can go.",
      b: "Remove them all at once and see what happens.",
      c: "Leave it as is: the rules do no harm.",
      d: "Rewrite the prompt from scratch.",
    },
    whyWrong: {
      b: "If quality drops, you will not know which rule was the necessary one.",
      c: "They do harm: they compete with one another, cost tokens and complicate every future change.",
      d: "Risky without knowing which rules carry value.",
    },
    explanation:
      "A prompt is cleaned like dead code: one change at a time with measurement. An evaluation set turns the fear of deletion into a testable hypothesis.",
  },
  "pe-b-q14": {
    scenario:
      "A service generates descriptions for a marketplace. Legal requires that a description never contain comparisons with competitors.",
    prompt: "What is the most reliable approach?",
    choices: {
      a: "A rule in the prompt plus an automatic check of the generated text for competitor mentions before publication.",
      b: "Only a clear rule in the system prompt.",
      c: "A check after the fact, once published.",
      d: "Manual moderation of every description.",
    },
    whyWrong: {
      b: 'For a "never" requirement a prompt gives probability, not a guarantee.',
      c: "The description is already published — exactly what legal asked you to avoid.",
      d: "It does not scale for a marketplace and duplicates what the automatic check does.",
    },
    explanation:
      "Two layers: the prompt lowers the frequency, the pre-publication check provides the guarantee. For absolute requirements the second layer is mandatory.",
  },
  "pe-b-q15": {
    scenario:
      "Caching works, but the saving is smaller than expected: `cache_read_input_tokens` is non-zero yet accounts for only a third of the input tokens.",
    prompt: "Where do you look?",
    choices: {
      a: "At the size of the variable part: if request data outweighs the stable prefix, the cache could never have saved more.",
      b: "At the cache TTL.",
      c: "At the model.",
      d: "At the number of cache breakpoints.",
    },
    whyWrong: {
      b: "TTL affects whether the cache hits, not the prefix's share of the total volume.",
      c: "The model sets the minimum cacheable size but not the proportions of your blocks.",
      d: "Extra breakpoints will not enlarge the stable part if there simply is not much of it.",
    },
    explanation:
      "The cache saves exactly on the stable prefix. If variable data outweighs the fixed part, the ceiling on savings is set by the request's own structure.",
  },
};
