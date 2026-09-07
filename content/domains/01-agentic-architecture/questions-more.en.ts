import type { QuestionEn } from "@/lib/content/types";

/** Англійський дубль додаткового пулу. */
export const questionsMoreEn: Record<string, QuestionEn> = {
  "aa-1-q7": {
    prompt: "Why does the message history have to be sent in full with every request?",
    choices: {
      a: "The Messages API is stateless — the server does not remember your conversation's previous requests.",
      b: "The HTTP protocol requires it.",
      c: "So that prompt caching works.",
      d: "So the model can modify earlier messages.",
    },
    whyWrong: {
      b: "HTTP has nothing to do with it: plenty of APIs maintain server-side sessions over it.",
      c: "Caching is a consequence and an optimisation of this model of work, not its cause.",
      d: "The model changes nothing in the history; it only appends its next turn.",
    },
    explanation:
      "Statelessness means your code is the sole owner of the conversation. Hence both the quadratic cost growth in a long session and the need to manage context yourself.",
  },
  "aa-1-q8": {
    prompt: 'A response came back with `stop_reason: "pause_turn"`. What does that mean?',
    choices: {
      a: "The model paused during a long operation, and the turn can be continued by sending the history back.",
      b: "The model refused the request.",
      c: "The output token limit was exhausted.",
      d: "An API failure occurred and a full retry is needed.",
    },
    whyWrong: {
      b: "A refusal arrives as `refusal` together with `stop_details`.",
      c: "That is `max_tokens` — a cut-off at the output ceiling.",
      d: "A failure would return an HTTP error, not a successful response with a `stop_reason`.",
    },
    explanation:
      "`pause_turn` occurs in long agentic flows with server-side tools. Your loop should recognise it alongside `tool_use` and continue rather than treat it as completion.",
  },
  "aa-1-q9": {
    prompt: "What must match between a `tool_use` block and your reply?",
    choices: {
      a: "The `tool_use_id` — it is how the model matches the result to a specific call.",
      b: "The tool name in a `name` field.",
      c: "The order of blocks in the message.",
      d: "The format of the arguments the tool was called with.",
    },
    whyWrong: {
      b: "A `tool_result` has no `name` field; the link rests on the identifier.",
      c: "Order does not matter as long as each result carries the right `tool_use_id`.",
      d: "The arguments are already in the history; repeating them in the result is unnecessary.",
    },
    explanation:
      "With parallel calls the response contains several results, and the only thing tying each to its call is the `tool_use_id`. A mistake here feeds the model mismatched data with no API error at all.",
  },
  "aa-1-q10": {
    prompt: "What must your code keep between loop iterations?",
    choices: {
      a: "The full message history, including the model's responses.",
      b: "The iteration counter and the budget spent.",
      c: "The results of already executed tools as history blocks.",
      d: "The model's internal state between calls.",
      e: "A copy of the system prompt inside every message.",
    },
    whyWrong: {
      d: "The model holds no internal state between requests — it can be neither retrieved nor stored.",
      e: "The system prompt is passed once per request in its own field, not inside each message.",
    },
    explanation:
      "The loop is your state: history, counters, budget. The model starts from scratch every time and sees exactly what you sent it.",
  },
  "aa-1-q11": {
    scenario:
      "The agent calls a tool, you execute it and send back a `tool_result`. In response the model calls the same tool with the same arguments — and round it goes, until the iteration limit fires.",
    prompt: "What do you check first in the loop code?",
    choices: {
      a: "Whether the model's response (the assistant message containing the `tool_use` block) is appended to the history before the result is sent.",
      b: "Whether `max_tokens` is large enough for the response.",
      c: "Whether the tool handles its arguments correctly.",
      d: "Whether the model version is outdated.",
    },
    whyWrong: {
      b: 'A token cut-off would give `stop_reason: "max_tokens"`, not a repeated call of the same tool.',
      c: "The tool works; the problem is that the model cannot see its own previous turn.",
      d: "The behaviour is typical of any model when the history is passed incomplete.",
    },
    explanation:
      "The most common loop-implementation bug: the result is appended but the model's own turn is not. To the model it looks as though it has not called the tool yet, so it calls it again.",
  },
  "aa-1-q12": {
    prompt: "What is the best form of the verify step in an agent loop?",
    choices: {
      a: "A programmatic check of the result — tests, a linter, schema validation — whose output is returned to the model.",
      b: "Asking the same model whether everything is correct.",
      c: "Showing the result to the user at the end of the work.",
      d: "Comparing the output with the previous iteration.",
    },
    whyWrong: {
      b: "Self-assessment without an external signal tends to confirm what was just produced; it is a weaker check than any deterministic control.",
      c: "That is a final control, not a loop step: the error will already have influenced subsequent actions.",
      d: "Stable output says nothing about whether it is correct.",
    },
    explanation:
      "The most valuable verify is the one that does not depend on the model. A failing test or a validation error, returned as a tool result, gives the agent a concrete signal to correct.",
  },
  "aa-1-q13": {
    prompt: "A tool failed with an error. Put the steps of correct handling in order.",
    choices: {
      a: "Catch the error in your code so it does not abort the loop",
      b: "Compose a structured description: what happened and what to do next",
      c: "Return it as a `tool_result` with `is_error: true`",
      d: "Let the model choose the next action knowing about the error",
    },
    explanation:
      "A tool error is ordinary input for the model, not a crash. Catch it, explain it, return it through the same channel and let the model decide what follows.",
  },
  "aa-1-q14": {
    prompt: "Which `stop_reason` means the model finished its response naturally?",
    choices: {
      a: "`end_turn`",
      b: "`tool_use`",
      c: "`max_tokens`",
      d: "`stop_sequence`",
    },
    whyWrong: {
      b: "That is a pause awaiting a tool result — the loop must continue.",
      c: "That is a cut-off at the output limit, meaning the answer is incomplete.",
      d: "That is your own stop sequence firing, not a natural end of thought.",
    },
    explanation:
      "`end_turn` is the only sign that the model has said everything it wanted to. Every other value demands some reaction from your code.",
  },
  "aa-1-q15": {
    prompt: "Do parallel tool calls need to be enabled explicitly?",
    choices: {
      a: "No, they work by default; they can be switched off with a separate parameter if needed.",
      b: "Yes, a special beta header is required.",
      c: "Yes, the tools must be listed in `tool_choice`.",
      d: "No, and they cannot be switched off.",
    },
    whyWrong: {
      b: "Parallel calls are ordinary Messages API behaviour, with no beta flags.",
      c: "`tool_choice` controls whether a tool is called, not how many calls happen at once.",
      d: "They can be: that is what `disable_parallel_tool_use` is for.",
    },
    explanation:
      "The model decides on its own when to call several tools at once. Your job is to execute them and return all results in a single message.",
  },
  "aa-1-q16": {
    scenario:
      "An agent reads five independent files to compose a report. Each call takes about a second, and the full loop runs noticeably longer than expected.",
    prompt: "Where do you look for the latency win?",
    choices: {
      a: "Execute several `tool_use` blocks from one response in parallel rather than one by one, and return all results together.",
      b: "Increase `max_tokens` so the model answers in a single turn.",
      c: "Move to a faster model.",
      d: "Merge the five files into a single tool request.",
    },
    whyWrong: {
      b: "The output limit has no effect on how long the tools take to run.",
      c: "Most of the time here is spent waiting on tools sequentially, not on generation.",
      d: "A possible step, but it requires changing the tool; first use the parallelism the model is already offering.",
    },
    explanation:
      "If the model returned several `tool_use` blocks in one response, it considers them independent. Running them sequentially is latency thrown away for nothing.",
  },
  "aa-1-q17": {
    prompt: "Which signs indicate a poorly designed agent loop?",
    choices: {
      a: "There is no iteration limit and the loop can run forever.",
      b: "Tool errors abort with an exception instead of being returned to the model.",
      c: "There is no verification step between actions.",
      d: "The model sometimes answers with text without calling a tool.",
      e: "The loop makes several model requests for one task.",
    },
    whyWrong: {
      d: "That is normal behaviour: this is how the model addresses the user or summarises what it did.",
      e: "That is the very essence of an agent loop — otherwise it would be a single call.",
    },
    explanation:
      "Three classic gaps: no boundary, no error handling, no verification. Each alone can turn a working prototype into unmanageable production.",
  },
  "aa-1-q18": {
    prompt: "What does the `is_error: true` flag do in a `tool_result` block?",
    choices: {
      a: "It marks for the model that the call failed — the block's content remains its explanation.",
      b: "It makes the API retry the tool call.",
      c: "It aborts the agent loop.",
      d: "It hides the block's content from the model.",
    },
    whyWrong: {
      b: "The API performs no automatic retries: the decision about the next step is the model's.",
      c: "The loop is aborted only by your code; the flag stops nothing.",
      d: "On the contrary: the content is exactly what explains to the model what went wrong.",
    },
    explanation:
      "The flag separates a failure from a successful result that merely looks empty. Without it the model may take an error message for data.",
  },
  "aa-2-q7": {
    prompt: "Which task needs only a single model call, with no loop at all?",
    choices: {
      a: "Classifying a request against a known, fixed list of categories.",
      b: "Working out why a test fails and fixing the code.",
      c: "Running a database migration with result verification.",
      d: "Answering a question over ten documents that still have to be found.",
    },
    whyWrong: {
      b: "That requires investigation, changes and verification — a classic agentic task.",
      c: "That is a sequence of steps with checks — a workflow at the very least.",
      d: "Finding the right documents is already a loop with tools.",
    },
    explanation:
      "A single call covers input-to-output tasks that require no acting: classification, extraction, summarisation. Everything else rises to the workflow or agent tier.",
  },
  "aa-2-q8": {
    prompt: "Which signs indicate a task is better given to an agent than to a workflow?",
    choices: {
      a: "The number and content of the steps depend on what is discovered along the way.",
      b: "Success is verifiable, but the path to it differs every time.",
      c: "The task requires reacting to unexpected states of the environment.",
      d: "The task runs often and has a strict latency SLA.",
      e: "The task works with a large amount of data.",
    },
    whyWrong: {
      d: "That argues against an agent: a loop adds unpredictable time.",
      e: "Data volume is solved by tool design and retrieval, not by autonomy.",
    },
    explanation:
      "An agent is justified where the path cannot be fixed in advance. If you can draw the flowchart without an \"it depends\", it is a workflow.",
  },
  "aa-2-q9": {
    scenario:
      "Every Monday, metrics must be collected from three systems, a chart built and a report sent to a mailing list. The sources and the report format have not changed in six months.",
    prompt: "What do you build?",
    choices: {
      a: "A fixed-step workflow, involving the model only for a textual comment on the numbers.",
      b: "An agent with access to all three systems and to email.",
      c: "Orchestrator-workers for collecting the metrics in parallel.",
      d: "A single model call describing the task.",
    },
    whyWrong: {
      b: "Autonomy adds nothing here but risk: the steps are stable and known.",
      c: "There is nothing to plan: the set of sources is fixed, and parallelism is achieved by ordinary code.",
      d: "One call will not gather data from three systems or send a mailing.",
    },
    explanation:
      "A stable, repeating process is a pipeline. The model earns its cost at the node that needs judgement: explaining an anomaly in the numbers, not fetching them.",
  },
  "aa-2-q10": {
    prompt: 'The task is stated vaguely: "improve the service\'s performance". What is the correct first step for the agent?',
    choices: {
      a: "Measure the current state and narrow the task to a specific hypothesis with a success criterion.",
      b: "Start optimising the code that looks slowest.",
      c: "Ask the user to state the task more precisely and stop.",
      d: "Draft a plan of ten possible optimisations.",
    },
    whyWrong: {
      b: "Without measurement, code that \"looks slow\" often turns out to be irrelevant to real load.",
      c: "Clarification helps, but the agent can gather the data that makes the clarification concrete.",
      d: "A plan without measurements is a list of assumptions, not a plan.",
    },
    explanation:
      "A vague task is first turned into a measurable one. A success criterion (\"p95 response time under 200 ms\") makes both the plan and the verification possible.",
  },
  "aa-2-q11": {
    prompt: "Order the architecture tiers from simplest to most complex.",
    choices: {
      a: "A single model call",
      b: "A fixed-step workflow",
      c: "An agent with its own loop and tools",
      d: "Several agents with orchestration",
    },
    explanation:
      "The simplicity rule works in exactly this order: move up a tier only once the tier below has demonstrably failed.",
  },
  "aa-2-q12": {
    scenario:
      "Documentation must be updated after a big release: 60 pages, some needing small version edits, others needing a section rewritten for new behaviour.",
    prompt: "How do you split the work?",
    choices: {
      a: "First find automatically which pages the release touched, then let the agent work through only those, while trivial version replacements are done by a script.",
      b: "The agent reads all 60 pages and decides about each.",
      c: "Rewrite the whole documentation from scratch in one large request.",
      d: "Split the 60 pages across 60 subagents.",
    },
    whyWrong: {
      b: "The release did not touch most pages — that is context and money spent for nothing.",
      c: "You lose the accumulated quality of the text, and verifying that much at once is nearly impossible.",
      d: "The same redundant work, only in parallel and more expensively.",
    },
    explanation:
      "First narrow the work space with deterministic means (the release diff, a search for mentions), and only then hand the model what genuinely requires judgement.",
  },
  "aa-2-q13": {
    prompt: "Why must the exploration stage come before drafting the plan?",
    choices: {
      a: "A plan built on assumptions about the system's state falls apart at the first execution step.",
      b: "Exploration is cheaper than planning.",
      c: "Plan mode requires it.",
      d: "To reduce the number of steps in the plan.",
    },
    whyWrong: {
      b: "Exploration is usually more expensive: it reads files and calls tools.",
      c: "Plan mode dictates no internal order — this is general engineering practice.",
      d: "Exploration often grows the plan, because it reveals dependencies nobody noticed.",
    },
    explanation:
      "The cost of a mistake in the plan grows with every executed step. A few search calls up front are cheaper than a plan rewritten mid-work.",
  },
  "aa-2-q14": {
    prompt: "Which parts of the work are better given to code than to the model?",
    choices: {
      a: "Bulk text replacements following an exact pattern.",
      b: "Counting, sorting and aggregating data.",
      c: "Verifying the result with tests and a linter.",
      d: "Choosing which of several approaches suits this situation.",
      e: "Phrasing an explanation for a human.",
    },
    whyWrong: {
      d: "That is judgement — the very reason the model is in the system.",
      e: "Natural language is the model's strength; code cannot replace it.",
    },
    explanation:
      "The line is simple: deterministic work to code, subjective and contextual work to the model. Every mechanical operation given to the model adds cost and non-determinism.",
  },
  "aa-2-q15": {
    prompt: "How does the cost-of-error criterion shape an agent's design?",
    choices: {
      a: "The costlier the error, the more checks, confirmations and rollback options are needed — up to giving up autonomy entirely.",
      b: "The costlier the error, the more capable the model needs to be — and that is enough.",
      c: "Cost of error only affects the choice between a workflow and an agent.",
      d: "Cost of error is unrelated to architecture — it is a testing concern.",
    },
    whyWrong: {
      b: "A stronger model lowers the probability but provides no mechanism for detection and rollback.",
      c: "It shapes the whole design: permissions, confirmation points, observability.",
      d: "Testing does not protect against irreversible actions in production; those must be constrained architecturally.",
    },
    explanation:
      "The criterion works as a scale: cheap errors permit autonomy, expensive ones demand a human in the loop. It is what decides where confirmations and permissions go.",
  },
  "aa-2-q16": {
    scenario:
      "A team wants automatic pull-request review. Every PR is different: sometimes a style check suffices, sometimes the logic and side effects have to be understood.",
    prompt: "Which architecture is appropriate?",
    choices: {
      a: "An agent: it decides how deep to dig, which files to read and what to check in each particular PR.",
      b: "A workflow with a fixed list of checks for every PR.",
      c: "A single model call with the diff in the prompt.",
      d: "Evaluator-optimizer: the review is rewritten until the evaluator approves.",
    },
    whyWrong: {
      b: "A fixed list will either miss the complex cases or waste effort on trivial ones.",
      c: "Without the ability to read neighbouring code, review of large changes stays superficial.",
      d: "The task is not to polish the review text but to investigate the changes.",
    },
    explanation:
      "How deep the work goes depends on the content of the PR, that is, it is determined at runtime. That is the mark of a task for an agent rather than a fixed pipeline.",
  },
  "aa-2-q17": {
    prompt: "An agent spends half its steps on formatting and renaming variables to a pattern. What does that mean?",
    choices: {
      a: "That part of the work should be deterministic — a formatter or a script wired up through a hook.",
      b: "A more capable file-editing tool is needed.",
      c: "The iteration limit should be increased.",
      d: "The agent should be given examples of correct formatting.",
    },
    whyWrong: {
      b: "The tool is not at fault: the model simply should not spend steps on mechanical work.",
      c: "That would allow even more steps to be spent on the same thing.",
      d: "Examples will not make formatting guaranteed and will not return the spent steps.",
    },
    explanation:
      "An agent's steps are an expensive resource. Anything expressible as a rule should be executed by code, so the model deals only with what requires a decision.",
  },
  "aa-2-q18": {
    prompt: "What makes an agent's plan genuinely useful?",
    choices: {
      a: "It rests on the actual state of the system rather than on assumptions.",
      b: "It names the criteria the result will be checked against.",
      c: "It explicitly marks irreversible steps that need confirmation.",
      d: "It lists every possible alternative for each step.",
      e: "It is written in maximal detail, down to individual lines of code.",
    },
    whyWrong: {
      d: "A list of alternatives is material for discussion, not a plan: it does not say what to do.",
      e: "Excessive detail goes stale before execution even starts and takes flexibility away from the model.",
    },
    explanation:
      "A good plan is grounded in facts, contains success criteria and highlights the risky places. Everything else is detail better decided during execution.",
  },
  "aa-3-q7": {
    prompt: "What is a gate in prompt chaining?",
    choices: {
      a: "A programmatic check between steps that decides whether it is worth continuing.",
      b: "A cap on the number of tokens in a step.",
      c: "A mechanism for caching intermediate results.",
      d: "The point at which the chain branches into several paths.",
    },
    whyWrong: {
      b: "A token limit applies to one call and does not govern the transition between steps.",
      c: "A cache saves money but checks nothing.",
      d: "Branching is routing; a gate either lets you through or stops you.",
    },
    explanation:
      "The value of a chain is precisely that you can insert a deterministic check between steps: if an intermediate result fails validation, there is no point spending the next call.",
  },
  "aa-3-q8": {
    prompt: "Besides quality, what saving does routing provide?",
    choices: {
      a: "Simple categories can be sent to a cheaper and faster model.",
      b: "The overall number of model calls goes down.",
      c: "The need for a system prompt disappears.",
      d: "Caching works better because the requests are identical.",
    },
    whyWrong: {
      b: "The classifier adds a call; the saving comes from model choice, not from call count.",
      c: "Each branch has its own system prompt — there are more of them, not fewer.",
      d: "Requests in different branches differ; there is in fact less shared prefix between them.",
    },
    explanation:
      "Routing lets you pay for complexity only where it exists. It is one of the few patterns that raises quality and lowers the bill at the same time.",
  },
  "aa-3-q9": {
    prompt: "What does a reliable evaluator-optimizer need?",
    choices: {
      a: "An explicit rubric the evaluator judges against.",
      b: "A cap on the number of rewrite rounds.",
      c: "Feedback specific enough to act on.",
      d: "The evaluator must be a more capable model than the author.",
      e: "The author must not see the previous version of the text.",
    },
    whyWrong: {
      d: "Often useful but not required: what decides is the quality of the rubric, not the model tier.",
      e: "The opposite: without the previous version and the critique, the rewrite starts from scratch.",
    },
    explanation:
      "Without a rubric the critique becomes taste, without a round cap it becomes endless polishing, without specifics it becomes \"do better\". Each absence breaks the pattern equally.",
  },
  "aa-3-q10": {
    scenario:
      "400 product descriptions must be checked against three independent policies: legal, brand and technical. Each policy is its own set of rules.",
    prompt: "Which pattern do you choose?",
    choices: {
      a: "Sectioned parallelisation: three independent checks of the same description, with the results combined in code.",
      b: "Prompt chaining: check legal, then brand, then technical.",
      c: "One prompt containing all three policies.",
      d: "Orchestrator-workers, where the orchestrator decides which policies to apply.",
    },
    whyWrong: {
      b: "The checks are independent, so a sequence merely triples the latency with no gain.",
      c: "The rules of three policies compete for the model's attention, and afterwards an error is hard to attribute to a specific policy.",
      d: "There is nothing to decide — all three always apply.",
    },
    explanation:
      "Independent dimensions of one input are classic sectioning. Bonus: each check can be tested separately, and deterministic code combines the results.",
  },
  "aa-3-q11": {
    prompt: "What is the main risk of voting-style parallelisation?",
    choices: {
      a: "Cost grows in proportion to the number of attempts, while the reliability gain may be negligible.",
      b: "The results cannot be compared with one another.",
      c: "The model cannot run the same prompt twice.",
      d: "The API forbids parallel calls.",
    },
    whyWrong: {
      b: "Comparison is a solvable task: voting or scoring against a criterion.",
      c: "It can, and that is exactly what the pattern is built on.",
      d: "There is no such prohibition — these are ordinary independent requests.",
    },
    explanation:
      "Voting is worth using where the cost of an error exceeds three times the cost of a request. Otherwise it is an expensive way to get the same answer.",
  },
  "aa-3-q12": {
    prompt: "What should an orchestrator exchange with its workers to keep the pattern efficient?",
    choices: {
      a: "A self-contained subtask statement going in, and a concise structured result coming back.",
      b: "The orchestrator's full context, so the worker understands the big picture.",
      c: "Only a task identifier — the worker will find the rest itself.",
      d: "The worker's complete execution logs.",
    },
    whyWrong: {
      b: "That destroys the context saving: every worker would pay for the orchestrator's entire context.",
      c: "Hunting for the statement is redundant work and a source of misreadings.",
      d: "Logs are noise the orchestrator would have to read and pay for.",
    },
    explanation:
      "The pattern's efficiency rests on a narrow interface: detailed going in, concise coming out. It is the same contract as for subagents.",
  },
  "aa-3-q13": {
    prompt: "Put the steps of routing a request in execution order.",
    choices: {
      a: "Classify the incoming request",
      b: "Choose the specialised prompt and model for the category",
      c: "Process the request in the chosen branch",
      d: "Return the result in a single unified response format",
    },
    explanation:
      "The last step is often forgotten: different branches must return the same structure, otherwise the consumer is forced to know how routing works internally.",
  },
  "aa-3-q14": {
    scenario:
      "The routing classifier is wrong in about 8% of cases and the request lands in the wrong branch. The branches themselves work correctly.",
    prompt: "What do you do first?",
    choices: {
      a: 'Give branches a way to return "not my category" and re-route the request, and review the category definitions in the classifier.',
      b: "Replace routing with one general prompt.",
      c: "Duplicate the request into several branches at once.",
      d: "Raise the classifier's temperature for variety.",
    },
    whyWrong: {
      b: "That removes 8% of routing errors at the cost of lowering quality in all 100% of cases.",
      c: "Multiplicatively more expensive, and it still needs a mechanism to pick a winner.",
      d: "Classification needs stability; randomness would only raise the error rate.",
    },
    explanation:
      "Routing should allow an appeal: a branch that realises the request is not its own hands it back. In parallel, tighten the category boundaries — that is usually where the cause hides.",
  },
  "aa-3-q15": {
    prompt: "When does prompt chaining lose to a single call?",
    choices: {
      a: "When the steps are artificial and the model does it all equally well in one turn — then the chain only adds latency.",
      b: "When a check is needed between steps.",
      c: "When the task is complex.",
      d: "When structured output is required.",
    },
    whyWrong: {
      b: "That is the strongest argument for a chain, not against it.",
      c: "Complexity is usually the reason to split a task into steps.",
      d: "Output format does not depend on the number of steps.",
    },
    explanation:
      "Every link of a chain costs its own request and its own delay. Split where the step is genuinely simpler or where there is something to check in between.",
  },
  "aa-3-q16": {
    prompt: "What do orchestrator-workers and parallelisation have in common?",
    choices: {
      a: "Both can execute subtasks simultaneously.",
      b: "Both need the results combined at the end.",
      c: "Both benefit from the subtasks being independent.",
      d: "In both, the number of subtasks is known before launch.",
      e: "Both require a separate evaluator model.",
    },
    whyWrong: {
      d: "In orchestrator-workers the model determines it at runtime — that is the key difference.",
      e: "An evaluator belongs to evaluator-optimizer, not to these patterns.",
    },
    explanation:
      "The patterns are mechanically similar but differ in the source of the split: in parallelisation the code defines it, in orchestrator-workers the model does.",
  },
  "aa-3-q17": {
    prompt: "The orchestrator handed out five subtasks and one worker returned an error. What should the orchestrator do?",
    choices: {
      a: "Collect the remaining results, treat the error as data and decide: retry the subtask, proceed without it, or stop.",
      b: "Abort the whole task immediately.",
      c: "Silently ignore the error and assemble what is available.",
      d: "Retry the subtask until it succeeds, with no limit.",
    },
    whyWrong: {
      b: "Four successful results are thrown away over one failure that can often be worked around.",
      c: "The summary would be built on incomplete data and nobody would know.",
      d: "A persistent error turns that into an infinite loop with a bill attached.",
    },
    explanation:
      "Partial failure is a normal state of distributed work. The orchestrator must see it explicitly and make a decision, rather than pretend all is well or collapse entirely.",
  },
  "aa-3-q18": {
    scenario:
      "Technical documentation must be translated into 12 languages while keeping terminology consistent. Translation quality is assessed by native speakers.",
    prompt: "Which combination of patterns is appropriate?",
    choices: {
      a: "Parallelisation by language plus evaluator-optimizer within each language, with a shared glossary in the prompt.",
      b: "Prompt chaining: translate into the first language, then from it into the rest.",
      c: "A single request asking for all 12 languages at once.",
      d: "Orchestrator-workers, where the orchestrator decides which languages are needed.",
    },
    whyWrong: {
      b: "Translating a translation accumulates distortion, and terminology drifts even faster.",
      c: "A huge output, a higher chance of truncation and no way to assess each language separately.",
      d: "The list of languages is fixed in advance — there is nothing to plan.",
    },
    explanation:
      "Languages are independent — that is sectioning. Quality within each language is improved by an evaluator loop, and consistent terminology is held by a shared glossary in the stable part of the prompt.",
  },
  "aa-4-q7": {
    prompt: "How much of the main agent's context does a subagent that read 40 files consume?",
    choices: {
      a: "As much as its summary takes — the rest stays in its own window.",
      b: "The same as the main agent would have spent — the context is shared.",
      c: "Nothing — the subagent's result does not enter the context.",
      d: "Half — the API compresses the result twofold.",
    },
    whyWrong: {
      b: "The contexts are isolated: that is the whole point of delegation.",
      c: "The summary always enters, otherwise the main agent would never learn the result.",
      d: "There is no automatic compression; the subagent itself determines the size.",
    },
    explanation:
      "That trade is what makes subagents valuable: the expensive reading happens in someone else's window, and the main agent pays only for the conclusion.",
  },
  "aa-4-q8": {
    prompt: "What must a good task statement for a subagent contain?",
    choices: {
      a: "The goal and the criterion by which the result counts as sufficient.",
      b: "The boundaries of the work: what is in scope and what is not.",
      c: "The expected format of the result.",
      d: "A reference to earlier discussion in the main session.",
      e: "A list of all tools with their descriptions.",
    },
    whyWrong: {
      d: "The subagent cannot see the main session — such a reference is empty to it.",
      e: "Tools are provided by configuration, not retold in the task text.",
    },
    explanation:
      "The statement must be self-contained: goal, boundaries, format. Anything that relies on knowledge of the main session has to be written out explicitly.",
  },
  "aa-4-q9": {
    prompt: "A subagent completed its task, but its summary is 12 thousand tokens long. What does that mean?",
    choices: {
      a: "The contract is broken: the subagent returned material instead of conclusions, and the context saving is gone.",
      b: "The task was too complex for a single subagent.",
      c: "That is normal if it read many files.",
      d: "The main agent's context window needs to be larger.",
    },
    whyWrong: {
      b: "Task complexity does not dictate summary size — the result format does.",
      c: "The opposite: the more that was read, the more important it is to return concisely.",
      d: "That treats the symptom: the next subagent will return even more.",
    },
    explanation:
      "Summary size is the main quality metric of a subagent. If it is large, delegation has become an expensive way to move the same text from one session into another.",
  },
  "aa-4-q10": {
    scenario:
      "The main agent delegates a module refactor to a subagent. The subagent replies \"done, everything works\", but the tests fail and the main agent only finds out at the end.",
    prompt: "What do you fix in the delegation design?",
    choices: {
      a: "Require the subagent to run the tests itself and return their actual output as part of the summary.",
      b: "Forbid subagents from changing code.",
      c: "Ask the subagent to write more detailed reports.",
      d: "Duplicate the task to a second subagent for verification.",
    },
    whyWrong: {
      b: "That removes a useful scenario instead of adding a check.",
      c: "A more detailed report without running the tests is still a claim rather than a fact.",
      d: "Twice as expensive and slower than simply running the tests.",
    },
    explanation:
      "\"Everything works\" is a judgement, not a result. The contract must demand verifiable facts: which test was run and what output it produced.",
  },
  "aa-4-q11": {
    prompt: "Why are subagents usually given a narrower tool set than the main agent?",
    choices: {
      a: "A narrow set makes behaviour more predictable and reduces the risk of side effects outside the task.",
      b: "Subagents technically do not support most tools.",
      c: "It reduces the cost of the model call.",
      d: "The delegation protocol requires it.",
    },
    whyWrong: {
      b: "There is no technical limitation — the set is defined by configuration.",
      c: "Saving on tool descriptions is negligible next to the volume of the work.",
      d: "No protocol imposes such a requirement; this is engineering practice.",
    },
    explanation:
      "A subagent has a narrow task, so it needs fewer powers. This is the standard application of least privilege inside the system.",
  },
  "aa-4-q12": {
    prompt: "Two subagents edit the same file in parallel. What happens?",
    choices: {
      a: "One's changes overwrite the other's — they cannot see each other's work.",
      b: "The system merges the changes automatically.",
      c: "The second subagent receives a lock error.",
      d: "Both sets of changes are kept in different versions of the file.",
    },
    whyWrong: {
      b: "There is no automatic merging: these are ordinary file writes.",
      c: "There are no locks by default either.",
      d: "Versioning is git's business, and it does not protect against concurrent writes within a session.",
    },
    explanation:
      "Context isolation also isolates knowledge of changes. Shared mutable state is exactly the case where subagents must not be used.",
  },
  "aa-4-q13": {
    prompt: "Put the steps of correct delegation to a subagent in order.",
    choices: {
      a: "Define a non-overlapping area of responsibility",
      b: "Write a self-contained statement with a success criterion",
      c: "Launch the subagent with the tool set it needs",
      d: "Receive a concise summary with source references and side effects",
    },
    explanation:
      "A mistake at the first step produces duplicated work, at the second misunderstanding of the task, at the fourth a lost result. The order is itself the checklist.",
  },
  "aa-4-q14": {
    prompt: "When is delegating to a subagent more expensive than doing the work directly?",
    choices: {
      a: "When the task is short: the overhead of the statement and the summary exceeds the work itself.",
      b: "When the task requires reading many files.",
      c: "When there are several independent tasks.",
      d: "When a structured result is required.",
    },
    whyWrong: {
      b: "That is the most profitable case for delegation.",
      c: "That is the second profitable case — parallel subagents.",
      d: "Result format has no bearing on whether delegation makes sense.",
    },
    explanation:
      "A subagent costs a separate session, a statement and a summary. For two tool calls' worth of work that arithmetic never adds up.",
  },
  "aa-4-q15": {
    prompt: "Which tasks map well onto parallel subagents?",
    choices: {
      a: "Investigating several non-overlapping parts of a codebase.",
      b: "Gathering information from several independent sources.",
      c: "Checking one artefact against several independent criteria.",
      d: "Running a sequential migration where each step depends on the previous one.",
      e: "Jointly editing one document.",
    },
    whyWrong: {
      d: "Dependency between steps makes parallelism impossible.",
      e: "Shared mutable state leads to overwritten changes.",
    },
    explanation:
      "The criterion is independence. If the subtasks' results do not affect one another, parallel subagents give both speed and context savings.",
  },
  "aa-4-q16": {
    scenario:
      "The main agent launched a subagent with the task \"look into the performance problem\". The subagent returned a general description of the architecture with no concrete findings.",
    prompt: "What is the cause?",
    choices: {
      a: "The statement contains neither a success criterion nor search boundaries — the subagent did not know what would count as an answer.",
      b: "The subagent lacks profiling tools.",
      c: "The subagent's model is too weak.",
      d: "The subagent ran out of context.",
    },
    whyWrong: {
      b: "A possible side issue, but even with them it is unclear what to look for.",
      c: "A vague statement produces a vague answer on any model.",
      d: "Then the summary would be truncated, not general in substance.",
    },
    explanation:
      "A subagent does exactly what the statement says. \"Look into it\" without a success criterion and boundaries turns into a retelling of what was read.",
  },
  "aa-4-q17": {
    prompt: "What do you do if a subagent's result looks incomplete?",
    choices: {
      a: "Send a refined statement to a new subagent, specifying exactly what is missing.",
      b: 'Ask the subagent to "continue from where it left off".',
      c: "Treat the result as sufficient and move on.",
      d: "Read all the files yourself to check.",
    },
    whyWrong: {
      b: "Its session is over: the context it worked in no longer exists.",
      c: "The main agent would build further work on incomplete data.",
      d: "That defeats the point of delegation — the main agent's context fills with the same material.",
    },
    explanation:
      "A subagent is a one-shot operation, not an interlocutor. What you fix is not the agent but the statement: a more specific task yields a more specific result.",
  },
  "aa-4-q18": {
    prompt: "The main agent received a subagent's summary and started acting on it. What should be checked before irreversible actions?",
    choices: {
      a: "Whether the summary references specific sources the main agent can pull up itself.",
      b: "How confidently the conclusion is phrased.",
      c: "How long the subagent worked.",
      d: "How many tokens were spent.",
    },
    whyWrong: {
      b: "Confident phrasing says nothing about correctness.",
      c: "Duration does not correlate with the quality of the conclusion.",
      d: "That is a cost metric, not a reliability one.",
    },
    explanation:
      "Source references turn a summary from a claim into something verifiable. Before an irreversible action the main agent must be able to open the exact file or record the decision rests on.",
  },
  "aa-5-q7": {
    prompt: "Who is responsible for scaling and monitoring an agent built on the Claude Agent SDK?",
    choices: {
      a: "You: the SDK provides the harness, the infrastructure remains yours.",
      b: "Anthropic — the SDK includes a managed runtime.",
      c: "It is shared between you and Anthropic depending on the plan.",
      d: "Nobody needs to: the SDK works without a server.",
    },
    whyWrong: {
      b: "A managed runtime is what Managed Agents offer; the Agent SDK is a library inside your process.",
      c: "There is no shared hosting responsibility here.",
      d: "A library has to execute somewhere — in your service, script or function.",
    },
    explanation:
      "This is the key difference between the SDK and Managed Agents: harness only versus harness plus deployment. Choosing the SDK means deliberately taking on the infrastructure.",
  },
  "aa-5-q8": {
    prompt: "In which cases are Managed Agents more appropriate than the Claude Agent SDK?",
    choices: {
      a: "You need scheduled runs without maintaining your own scheduler.",
      b: "You need a session workspace that survives individual runs.",
      c: "The team does not want to maintain servers for the agent.",
      d: "Data must not leave the corporate perimeter.",
      e: "You need built-in file reading and editing tools.",
    },
    whyWrong: {
      d: "That argues for a self-hosted Agent SDK: in Managed Agents execution happens on Anthropic's side.",
      e: "The Agent SDK provides those too — it is not a criterion for choosing between them.",
    },
    explanation:
      "Managed Agents win where managed infrastructure itself is the value: scheduling, session state, no servers of your own. The moment a data-locality requirement appears, the choice changes.",
  },
  "aa-5-q9": {
    prompt: "What do the Tool Runner and the Claude Agent SDK have in common?",
    choices: {
      a: "Both provide only a harness — they run in your infrastructure.",
      b: "Both ship built-in filesystem tools.",
      c: "Both are part of the `@anthropic-ai/sdk` package.",
      d: "Both require a beta header.",
    },
    whyWrong: {
      b: "Built-in tools exist only in the Agent SDK; the Tool Runner works with the tools you define.",
      c: "The Agent SDK is a separate package; the Tool Runner lives inside the main SDK.",
      d: "Beta applies to the Tool Runner; the Agent SDK is a standalone product with its own versioning.",
    },
    explanation:
      "The confusion arises precisely because both are harness-only. The difference is the scope of the harness: a thin loop over your tools versus the full Claude Code set.",
  },
  "aa-5-q10": {
    scenario:
      "You need an agent that performs only a few of your own business operations through an internal API. It needs no filesystem, no bash and no code search.",
    prompt: "What do you choose?",
    choices: {
      a: "The Tool Runner in the main SDK: it closes the call loop over your tools without extra harness.",
      b: "The Claude Agent SDK with built-in tools disabled.",
      c: "Managed Agents with custom tools.",
      d: "A manual loop on the Messages API from scratch.",
    },
    whyWrong: {
      b: "You would pull in the whole Claude Code harness for a loop a simpler tool already provides.",
      c: "A managed sandbox is not needed here: the agent touches no files and keeps no state between runs.",
      d: "A workable option, but the Tool Runner already does the same with error handling and hooks.",
    },
    explanation:
      "When only your own tools are needed and nothing more, a full harness becomes a redundant dependency. The Tool Runner closes the loop while leaving you control over every tool.",
  },
  "aa-5-q11": {
    prompt: "How does the Claude Agent SDK connect external systems?",
    choices: {
      a: "Through MCP servers — exactly as Claude Code does.",
      b: "Through a built-in HTTP client with endpoint configuration.",
      c: "Through plugins installed from an Anthropic registry.",
      d: "External systems cannot be connected — only the local filesystem.",
    },
    whyWrong: {
      b: "No such mechanism exists: network integrations are described as tools or MCP servers.",
      c: "There is no plugin registry for the SDK.",
      d: "They can be: that is exactly what MCP support is for.",
    },
    explanation:
      "MCP is the shared language of integrations: one server works both in the CLI and in an SDK application. That is the main reason to package internal services as MCP servers.",
  },
  "aa-5-q12": {
    prompt: "What should be configured when embedding an Agent SDK agent into a production service?",
    choices: {
      a: "A restricted set of allowed tools.",
      b: "A step and budget limit per task.",
      c: "Logging of tool calls and token usage.",
      d: "Interactive confirmation prompts in the terminal.",
      e: "A shared session for all users.",
    },
    whyWrong: {
      d: "There is no human at a terminal in a service; confirmations must go through the product interface.",
      e: "Shared context between users is both a data leak and a source of mutual interference.",
    },
    explanation:
      "A production agent differs from a local one precisely in boundaries and visibility: what is allowed, how much is allowed, and what actually happened.",
  },
  "aa-5-q13": {
    prompt: "What do hooks in the Agent SDK offer beyond what permissions provide?",
    choices: {
      a: "They run arbitrary logic on events — dynamic checks, auditing, side effects — which static rules cannot cover.",
      b: "They are faster than a permission check.",
      c: "They replace permissions entirely.",
      d: "They change the model's behaviour directly.",
    },
    whyWrong: {
      b: "Speed is irrelevant here: both mechanisms run instantly compared with a model call.",
      c: "Permissions are simpler and declarative; hooks complement them rather than replace them.",
      d: "Hooks operate around actions, not inside the model's reasoning.",
    },
    explanation:
      "Permissions answer \"is this allowed at all\", hooks answer \"is it allowed right now and under what conditions\". Dynamic rules can only be expressed in code.",
  },
  "aa-5-q14": {
    prompt: "Put the questions worth asking when choosing how to build an agent in order.",
    choices: {
      a: "Is an agent needed at all, or would a workflow suffice",
      b: "Are built-in filesystem and bash tools needed",
      c: "Who hosts the execution: you or Anthropic",
      d: "Which permissions and limits to set on the chosen harness",
    },
    explanation:
      "First the architecture tier, then the scope of the harness, then where it runs, and only at the end the configuration of boundaries. The reverse order means picking a tool before understanding the task.",
  },
  "aa-5-q15": {
    prompt: "What does built-in subagent support in the Agent SDK give you?",
    choices: {
      a: "The ability to delegate part of the work into an isolated context without building your own orchestration.",
      b: "Parallel tool execution within a single agent.",
      c: "Automatic compression of the main agent's context.",
      d: "Shared access by several agents to one context.",
    },
    whyWrong: {
      b: "Parallel tool calls work without subagents — that is a capability of the model itself.",
      c: "Compression is handled by compaction and context editing, not by the subagent mechanism.",
      d: "Subagents isolate contexts, not share them.",
    },
    explanation:
      "A ready-made subagent mechanism saves the most on context management: expensive reading is moved outside without writing your own orchestration code.",
  },
  "aa-5-q16": {
    scenario:
      "An Agent SDK agent handles user requests in a web service. One user complained that they saw a fragment of someone else's code in the response.",
    prompt: "What most likely went wrong?",
    choices: {
      a: "User sessions or working directories are not isolated, and the agent read data from another request.",
      b: "The model invented the code fragment.",
      c: "The prompt cache returned someone else's response.",
      d: "An error in token accounting.",
    },
    whyWrong: {
      b: "Invented code would look plausible but would not belong to a specific other user.",
      c: "Caching works on the input prefix and does not return other people's responses.",
      d: "Token accounting has no effect on which files the agent read.",
    },
    explanation:
      "In a multi-tenant service isolation is not a model setting but architecture: a separate working directory and session per request, plus permissions that prevent stepping outside it.",
  },
  "aa-5-q17": {
    prompt: "Can the Claude Agent SDK be used without touching the Claude Code CLI?",
    choices: {
      a: "Yes: it is a separate library called from your application code.",
      b: "No, the SDK is a wrapper that launches the CLI.",
      c: "Yes, but only in the CLI's headless mode.",
      d: "No, an active CLI session is required on the same machine.",
    },
    whyWrong: {
      b: "The SDK is used programmatically; it does not require you to work through a terminal.",
      c: "Headless mode is a CLI capability, not a precondition for the SDK.",
      d: "There is no dependency on a running CLI.",
    },
    explanation:
      "The CLI and the SDK are two ways to use the same harness: interactive for a person, programmatic for an application.",
  },
  "aa-5-q18": {
    prompt: "A team wants to see how much each agent run costs on the Agent SDK. Where do the numbers come from?",
    choices: {
      a: "From the `usage` field of every model response: input and output tokens plus cache metrics, aggregated over the session.",
      b: "From the agent's filesystem logs.",
      c: "From the number of loop steps.",
      d: "The cost of an individual run cannot be measured.",
    },
    whyWrong: {
      b: "File operations have nothing to do with the cost of model calls.",
      c: "Steps differ in size: one can cost more than ten others.",
      d: "It is measured precisely — through the `usage` of each response.",
    },
    explanation:
      "`usage` is the only exact source: it shows both how many tokens went out and how many were served by the cache. Summed over the session, it gives the cost of the run.",
  },
  "aa-6-q7": {
    prompt: "An agent has a file-deletion tool. How do you constrain it safely?",
    choices: {
      a: "The tool accepts only paths inside an allowed directory and enforces that in its own code.",
      b: "State in the tool description which directories must not be touched.",
      c: "Ask for confirmation before every deletion.",
      d: "Log all deletions for investigation.",
    },
    whyWrong: {
      b: "A description influences the model's choice but does not prevent passing any path at all.",
      c: "Useful for irreversible actions, but without a path check the human assesses the risk blindly every time.",
      d: "Logs help after an incident, not instead of preventing one.",
    },
    explanation:
      "A boundary check inside the tool's code holds regardless of what the model decided. It is the same principle as amount thresholds: the rule lives where it cannot be bypassed.",
  },
  "aa-6-q8": {
    prompt: "Which actions should be treated as irreversible and gated behind confirmation?",
    choices: {
      a: "Sending an email or message to an external recipient.",
      b: "Deleting data without a backup.",
      c: "Publishing a release or deploying to production.",
      d: "Creating a temporary file in the working directory.",
      e: "Reading a service's configuration.",
    },
    whyWrong: {
      d: "A temporary file is easy to delete — the consequence is fully reversible.",
      e: "Reading changes nothing; restrict it with permissions, not with confirmations.",
    },
    explanation:
      "The criterion for irreversibility is whether the state can be restored cheaply and completely. A sent message, deleted data and a published release all fail that test.",
  },
  "aa-6-q9": {
    prompt: 'Why is "a human confirms every action" a poor guardrail?',
    choices: {
      a: 'Confirmation fatigue makes people click "yes" without reading, so the protection stops working exactly when it is needed.',
      b: "It is technically impossible to implement.",
      c: "The model starts performing worse.",
      d: "It increases token costs.",
    },
    whyWrong: {
      b: "It is easy to implement — the problem is human behaviour, not technology.",
      c: "The model's behaviour does not change with the number of confirmations.",
      d: "Confirmations add no tokens; they add time and fatigue.",
    },
    explanation:
      "Confirmation is a limited attention budget. The more unnecessary prompts there are, the less likely a person actually reads the one that matters.",
  },
  "aa-6-q10": {
    scenario:
      "An agent has access to a tool that sends emails to customers. During testing it sent several emails with test content to real addresses.",
    prompt: "What do you do first?",
    choices: {
      a: "Redirect sending to a sandbox in non-production environments: the tool must know which environment it runs in.",
      b: "Add a prompt requirement to send emails only to test addresses.",
      c: "Disable the tool during testing.",
      d: "Ask for confirmation before each email.",
    },
    whyWrong: {
      b: "That is a request with no technical force at the moment of the call.",
      c: "Then the sending scenario itself stays untested until production.",
      d: "In test runs a human would confirm dozens of emails and miss the mistake anyway.",
    },
    explanation:
      "Dangerous side effects are isolated at the infrastructure level: in a test environment the tool physically has no access to the production sending channel.",
  },
  "aa-6-q11": {
    prompt: "What does least privilege mean in relation to an agent?",
    choices: {
      a: "The agent gets exactly the permissions its task requires and nothing beyond that.",
      b: "The agent runs under an operating-system account with minimal rights.",
      c: "The agent is given as few tools as possible to save context.",
      d: "The agent must ask permission before every action.",
    },
    whyWrong: {
      b: "That is one expression of the principle, but the principle is broader than OS rights.",
      c: "Saving context is a different goal; this is about limiting consequences.",
      d: "That is human-in-the-loop, not least privilege.",
    },
    explanation:
      "The principle answers \"what happens if the agent errs or is talked into something\". The narrower the powers, the smaller the surface of consequences.",
  },
  "aa-6-q12": {
    prompt: "Order the layers of defence against prompt injection by reliability, strongest first.",
    choices: {
      a: "The dangerous action is not in the agent's permissions",
      b: "Untrusted data is wrapped in tags as a separate block",
      c: "The system prompt forbids following instructions found in data",
      d: "Keyword filtering of the incoming text",
    },
    explanation:
      "Only the first layer offers a guarantee: it removes the possibility of the action. The rest lower the probability, and keyword filtering is the easiest to bypass.",
  },
  "aa-6-q13": {
    prompt: "An agent in CI has access to secrets through environment variables. What is wrong with that?",
    choices: {
      a: "The agent can read them and accidentally reproduce them in output or logs — secrets must be out of reach of its tools.",
      b: "Environment variables do not work in CI.",
      c: "The model cannot read environment variables.",
      d: "Nothing: environment variables are considered safe.",
    },
    whyWrong: {
      b: "They do work — it is the standard way to pass configuration.",
      c: "It reads them through bash or environment-access tools — which is precisely the risk.",
      d: "They are safe only as long as whoever can print them has no access.",
    },
    explanation:
      "Anything the agent can read can end up in its output. Secrets either stay out of its reach or are blocked with a `deny` rule.",
  },
  "aa-6-q14": {
    prompt: "Which limits should be set for an agent running unsupervised?",
    choices: {
      a: "A maximum number of loop iterations.",
      b: "A token or money budget per task.",
      c: "A maximum execution time.",
      d: "A maximum system prompt length.",
      e: "A maximum number of tools in the configuration.",
    },
    whyWrong: {
      d: "That is a prompt-design question, not protection against runaway work.",
      e: "The number of tools affects selection quality, not execution boundaries.",
    },
    explanation:
      "Three dimensions in which an agent can run away: steps, money and time. Without human supervision each needs its own ceiling.",
  },
  "aa-6-q15": {
    prompt: "Which is better: forbidding an action, or allowing it with a confirmation prompt?",
    choices: {
      a: "It depends on whether legitimate scenarios for the action exist: if they do, `ask`; if not, `deny`.",
      b: "Always forbid: it is safer that way.",
      c: "Always confirm: the human will figure it out.",
      d: "There is no difference, it is a matter of taste.",
    },
    whyWrong: {
      b: "A blanket ban makes the agent useless where the action is occasionally needed.",
      c: "For actions that are never needed, a confirmation is just another chance to make a mistake.",
      d: "The difference is fundamental: one leaves a path open, the other does not.",
    },
    explanation:
      "`deny` is for what the agent must never do. `ask` is for actions needed occasionally but with consequences. Confusing them either paralyses the agent or trains the human to approve everything.",
  },
  "aa-6-q16": {
    scenario:
      "A support agent reads a knowledge base and customer correspondence. After one knowledge-base article was updated, it started offering customers discounts that are not in company policy.",
    prompt: "What do you check first?",
    choices: {
      a: "The content of the updated article: knowledge-base text enters the context and can be read as an instruction.",
      b: "The model version.",
      c: "The temperature setting.",
      d: "The iteration limit.",
    },
    whyWrong: {
      b: "The behaviour changed after the article was updated, not after a model change.",
      c: "Temperature affects the variety of phrasing, not the appearance of a new discount policy.",
      d: "The number of steps does not explain a change in the substance of the answers.",
    },
    explanation:
      "Any text that enters the context influences behaviour — including your own knowledge base. So changes to it deserve review like prompt changes, and discount authority belongs in code.",
  },
  "aa-6-q17": {
    prompt: "Why should an agent keep an audit trail of executed actions if permissions and limits already exist?",
    choices: {
      a: "Permissions do not explain what actually happened: without a log you cannot investigate an incident or spot recurring patterns.",
      b: "Auditing replaces permissions in simple systems.",
      c: "Auditing is only needed for reporting.",
      d: "Auditing reduces call costs.",
    },
    whyWrong: {
      b: "A log records events after the fact and prevents nothing.",
      c: "Its main value is operational: diagnosis and understanding of the agent's behaviour.",
      d: "It adds overhead, but pays for itself in understanding the system.",
    },
    explanation:
      "Permissions, limits and auditing answer different questions: what is allowed, how much is allowed, and what actually happened. Without the third, the first two cannot be tuned.",
  },
  "aa-6-q18": {
    prompt: "An agent received a task for which it lacks permissions. What is the correct behaviour?",
    choices: {
      a: "Stop and report exactly which action is missing, so a human can decide.",
      b: "Find a workaround using the available tools.",
      c: "Silently skip that part of the task.",
      d: "Retry until the permission appears.",
    },
    whyWrong: {
      b: "Working around permissions is exactly what permissions protect against; such behaviour is unsafe by definition.",
      c: "A silent skip produces an incomplete result that looks complete.",
      d: "The permission will not appear by itself, and the loop will burn budget.",
    },
    explanation:
      "A missing permission signals that the task exceeds the agreed boundary. The right reaction is to report the boundary transparently, not to look for a way around it.",
  },
  "aa-b-q5": {
    scenario:
      "An application-processing agent runs stably, but once a day it hangs for several hours. The logs show the last entry is a call to an integration tool, no response arrived, and the loop is waiting.",
    prompt: "What is missing from the architecture?",
    choices: {
      a: "A timeout on the tool call that returns a structured error to the model — so the loop does not depend on someone else's availability.",
      b: "An iteration limit.",
      c: "A more capable model.",
      d: "Context compaction.",
    },
    whyWrong: {
      b: "The limit counts steps, and the loop is stuck inside a single step — the counter never moves.",
      c: "The model plays no part in waiting for an external service's response.",
      d: "Context is irrelevant here: the problem is a hanging network call.",
    },
    explanation:
      "An iteration limit does not save you from hanging inside a step. Every external call needs its own timeout, and firing it should be returned to the model as an error it can act on.",
  },
  "aa-b-q6": {
    scenario:
      "The product team wants more agent autonomy: it currently asks for confirmation before every change in the ticket system, and operators find it irritating.",
    prompt: "How do you grant the request without losing control?",
    choices: {
      a: "Split actions by reversibility: allow comments and status changes automatically, keep deletions and refund-closing behind confirmation.",
      b: "Remove all confirmations and rely on auditing.",
      c: "Leave it as is and explain the value of confirmations to the operators.",
      d: "Ask for confirmation on every fifth action.",
    },
    whyWrong: {
      b: "Auditing records consequences after the fact — too late for irreversible operations.",
      c: "The problem is real: excessive confirmations devalue the ones that genuinely matter.",
      d: "A random sample does not correlate with risk: the skipped one may be precisely the dangerous action.",
    },
    explanation:
      "Autonomy is granted by reversibility, not all at once. That removes confirmation fatigue while keeping human attention where an error is genuinely expensive.",
  },
  "aa-b-q7": {
    scenario:
      "After moving to a new agent version quality dropped, but there are no metrics: the team is comparing impressions from a few manual runs.",
    prompt: "What do you do first?",
    choices: {
      a: "Fix a set of typical tasks with success criteria and run both versions against it, producing comparable numbers.",
      b: "Roll back to the previous version and leave it there.",
      c: "Increase the number of manual runs.",
      d: "Raise `effort` to `max`.",
    },
    whyWrong: {
      b: "A rollback without measurement explains nothing and repeats at the next update.",
      c: "More subjective impressions do not give a reproducible comparison.",
      d: "That is a blind change: the cause of the drop is unknown and the cost will rise.",
    },
    explanation:
      "Without a task set and criteria, any version comparison is an argument about impressions. Numbers make the regression visible and let you localise the cause.",
  },
  "aa-b-q8": {
    scenario:
      "A developer-assistant agent runs on a CI runner with access to the repository and the package manager. A security audit demands the risks be reduced.",
    prompt: "Which change has the biggest effect?",
    choices: {
      a: "Narrow permissions to reading and specific test commands, removing arbitrary package installs and network requests.",
      b: "Add security rules to the system prompt.",
      c: "Log every command the agent runs.",
      d: "Run the agent less often.",
    },
    whyWrong: {
      b: "A prompt is not a control: it does not hold against an injection from pull-request code.",
      c: "Logs are needed, but they record an incident rather than prevent it.",
      d: "Run frequency does not change what the agent can do in a single run.",
    },
    explanation:
      "Installing arbitrary packages on a runner holding secrets is the shortest path to compromise. Narrowing permissions removes that class of risk regardless of what the repository contains.",
  },
  "aa-b-q9": {
    scenario:
      "An agent generates daily reports. Once a week a report comes out with wrong figures, and only the readers notice. The agent pulls the data through an analytics tool.",
    prompt: "What do you add to the pipeline?",
    choices: {
      a: "A deterministic check of the figures after generation: reconcile totals and ranges against what the tool returned, blocking the mailing on any discrepancy.",
      b: "A prompt request to be careful with numbers.",
      c: "A second model that re-reads the report.",
      d: "Lower the temperature.",
    },
    whyWrong: {
      b: "Numbers get distorted exactly where a request has no force — when data is retold as prose.",
      c: "More expensive and probabilistic where simple arithmetic reconciliation suffices.",
      d: "Stable phrasing does not guarantee the transferred numbers are correct.",
    },
    explanation:
      "Numbers are precisely the case where verification is trivial and deterministic. Reconciling the generated text against the data source catches the error before a reader sees it.",
  },
  "aa-b-q10": {
    scenario:
      "An onboarding agent walks a new employee through 20 setup steps. Sometimes it skips a step and the person finds out a week later.",
    prompt: "Which solution is more reliable?",
    choices: {
      a: "Move the step list into an external stateful checklist: the agent marks what is done, and open items are visible both to the person and to the agent.",
      b: "List all 20 steps in the system prompt.",
      c: "Split onboarding into 20 separate sessions.",
      d: "Ask the agent to check itself at the end.",
    },
    whyWrong: {
      b: "A list in the prompt has no state: the agent cannot see what is already done.",
      c: "That shifts the coordination burden onto the person and loses the coherence of the process.",
      d: "Self-checking without external state relies on the same memory that already failed.",
    },
    explanation:
      "A many-step process needs explicit state outside the context. A checklist makes progress visible, survives compaction and restarts, and gives a human a control point.",
  },
  "aa-b-q11": {
    scenario:
      "One agent handles three kinds of task: short reference queries, medium analytical ones and long research ones. Everything works, but the monthly bill came out four times higher than expected.",
    prompt: "Where do you start optimising?",
    choices: {
      a: "Split the traffic with routing: short queries to a cheaper model with minimal context, long ones left as they are.",
      b: "Move every task to a cheaper model.",
      c: "Halve the system prompt.",
      d: "Cap the number of tasks per day.",
    },
    whyWrong: {
      b: "Research tasks would lose quality — that is exactly where the most capability is needed.",
      c: "It yields a small saving and may hurt quality; the bigger lever is usually model choice and context volume.",
      d: "That is not optimisation but declining part of the work.",
    },
    explanation:
      "When one agent serves streams of differing complexity, it pays for the hardest one in every case. Routing brings the cost back in line with the actual difficulty of the task.",
  },
  "aa-b-q12": {
    scenario:
      "An agent is executing a ten-step task. At step eight it discovers that an assumption made at step two was wrong, and half the work must be redone.",
    prompt: "What would help such an agent most?",
    choices: {
      a: "A verification step after each substantive action, so a wrong assumption surfaces immediately rather than six steps later.",
      b: "A longer plan at the start.",
      c: "A larger iteration limit so there is room to redo the work.",
      d: "A ban on changing the plan during execution.",
    },
    whyWrong: {
      b: "A plan cannot protect against an assumption that only proves wrong during execution.",
      c: "That allows walking the wrong path longer, not noticing it sooner.",
      d: "That would force the agent to finish work already known to be wrong.",
    },
    explanation:
      "The cost of a wrong assumption grows with every subsequent step. A check after each substantive action is the cheapest way to cap that cost, and it is the piece most often missing from the loop.",
  },
};
