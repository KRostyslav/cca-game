import type { QuestionEn } from "@/lib/content/types";

/** Англійський дубль питань цього домену: id питання → переклад. */
export const questionsEn: Record<string, QuestionEn> = {
  // ── Level 1: First day in Claude Code ───────────────────────────────────
  "dc-1-q1": {
    prompt: "Where is the best place to run `claude` to start working on a project?",
    choices: {
      a: "From your home directory, so Claude can see all your projects at once.",
      b: "From the repository root: it becomes the session's working directory, and the project CLAUDE.md is loaded from there.",
      c: "From `node_modules/.bin`, where the executable lives.",
      d: "It doesn't matter: Claude Code finds the right repository by itself.",
    },
    whyWrong: {
      a: "Your whole home directory becomes the working directory: the project CLAUDE.md is not loaded, and searches are slow and noisy.",
      c: "Where the binary lives is irrelevant: `claude` is on PATH, and what matters is the current directory.",
      d: "Claude Code does not go looking for a project: the current directory determines which files it works with and which memory it loads.",
    },
    explanation:
      "The launch directory becomes the session's working directory. From the repository root Claude gets the project CLAUDE.md and natural boundaries for searching and editing files.",
  },
  "dc-1-q2": {
    prompt: "What does the `/init` command do in a new repository?",
    choices: {
      a: "Initialises a git repository and makes the first commit.",
      b: "Installs the project's dependencies from `package.json` or `requirements.txt`.",
      c: "Analyses the codebase and creates a starter CLAUDE.md with build and test commands and notable conventions.",
      d: "Creates `.claude/settings.json` with default permissions.",
    },
    whyWrong: {
      a: "Git has nothing to do with it: `/init` neither creates a repository nor commits anything.",
      b: "Installing dependencies is a separate action; `/init` only analyses the code and writes a memory file.",
      d: "Permissions are configured separately (`/permissions` or the settings file); `/init` deals with project memory.",
    },
    explanation:
      "`/init` produces a draft CLAUDE.md from an analysis of the repository. Reread it, trim what's unnecessary, add the non-obvious rules and commit it.",
  },
  "dc-1-q3": {
    prompt: "What does `@` do in this prompt?",
    choices: {
      a: "Mentions a user with that name in the team chat.",
      b: "Locks the file against edits for the duration of the session.",
      c: "Imports the file into CLAUDE.md permanently.",
      d: "Explicitly adds the file to the prompt's context, so Claude doesn't have to search for it.",
    },
    whyWrong: {
      a: "It's not a mention of a person: in a Claude Code prompt `@` refers to a file or directory.",
      b: "`@` locks nothing; write restrictions are set via permissions or hooks.",
      c: "An `@path` import in CLAUDE.md and a file mention in a prompt are different things; a prompt writes nothing to memory.",
    },
    explanation:
      "An `@path` mention hands Claude the right file straight away (paths autocomplete). It's cheaper and more precise than asking it to \"find where the session stuff is\".",
  },
  "dc-1-q4": {
    scenario:
      "You want Claude to see fresh output from `npm run lint`, but you don't want to spend a turn on Claude deciding to run the command itself. The command is safe; you run it every day.",
    prompt: "How do you do that right inside the session?",
    choices: {
      a: "Type `! npm run lint`: the command runs in bash mode and its output goes into the conversation.",
      b: "Run the linter in another terminal and paraphrase the errors to Claude.",
      c: "Add a rule \"always run the linter\" to CLAUDE.md.",
      d: "Exit the session, run the linter, and start a new session with `--continue`.",
    },
    whyWrong: {
      b: "Paraphrasing loses exact lines and messages; it's simpler to give Claude the original output.",
      c: "A rule governs the model's future actions, whereas you need the output now and without the model deciding.",
      d: "A pointless round trip: output produced outside the session doesn't land in the conversation by itself.",
    },
    explanation:
      "The `!` prefix runs a shell command directly, without involving the model, and adds the result to the context. Handy for quick checks, logs and git status.",
  },
  "dc-1-q5": {
    prompt: "Which of these are ways to give Claude Code context for a task?",
    choices: {
      a: "Mention files or directories with `@path` in the prompt.",
      b: "Paste a screenshot or drag an image into the session.",
      c: "Pass data via stdin: `cat error.log | claude -p \"...\"`.",
      d: "Nothing needed: at startup Claude Code indexes the whole repository and keeps it in context.",
      e: "Put the files in `node_modules`, since Claude reads those first.",
    },
    whyWrong: {
      d: "Only memory (CLAUDE.md) is loaded automatically; Claude reads files on demand through tools.",
      e: "There's no such priority; if anything, generated and third-party directories are best kept out of context.",
    },
    explanation:
      "The developer supplies the context: file mentions, images, stdin. Claude finds the rest itself by searching and reading, so the more precise the input, the fewer wasted steps.",
  },
  "dc-1-q6": {
    scenario:
      "You asked Claude to fix form validation. The status shows it has started editing a completely different module — a server handler you had no intention of touching.",
    prompt: "What's the best move?",
    choices: {
      a: "Wait until it finishes, then ask it to revert everything.",
      b: "Kill the terminal with Ctrl+C and start from scratch.",
      c: "Press Esc to interrupt, and clarify: change only the client-side validation in the specified file.",
      d: "Write \"don't touch server code\" in CLAUDE.md and carry on.",
    },
    whyWrong: {
      a: "The longer the wrong path runs, the more there is to revert and the more context is spent; correct course immediately.",
      b: "You lose all the context gathered so far; interrupting the current action and redirecting is enough.",
      d: "A memory rule doesn't stop an action already in progress, nor fix an imprecise task description.",
    },
    explanation:
      "Esc stops Claude while keeping the conversation context. Correcting course early is a cheap way to keep changes within the intended scope.",
  },
  "dc-1-q7": {
    prompt: "Put the steps of your first day with Claude Code in a new repository in order.",
    choices: {
      a: "Review and extend CLAUDE.md, then commit it.",
      b: "Install Claude Code and authenticate.",
      c: "Give it a first small, well-scoped task.",
      d: "Go to the repository root and run `claude`.",
      e: "Run `/init` to get a draft CLAUDE.md.",
    },
    explanation:
      "First the tool and access, then a session in the right directory, then project memory. A small first task shows whether CLAUDE.md really provides the context needed.",
  },

  // ── Level 2: Plan mode and iteration ────────────────────────────────────
  "dc-2-q1": {
    prompt: "How do you switch to plan mode in an interactive session that's already running?",
    choices: {
      a: "Write \"always plan first\" in CLAUDE.md.",
      b: "Press Ctrl+C and restart with `claude -p`.",
      c: "Ask Claude \"don't write code\" — that's enough.",
      d: "Press Shift+Tab until the plan mode indicator appears.",
    },
    whyWrong: {
      a: "That's a request to the model, not a mode: edits remain available.",
      b: "`-p` is a one-shot non-interactive query and has nothing to do with planning mode.",
      c: "Asking helps but guarantees nothing: in plan mode the harness itself prevents edits.",
    },
    explanation:
      "Shift+Tab cycles through the permission modes, plan mode among them. In it Claude researches and proposes a plan, and only edits after you approve.",
  },
  "dc-2-q2": {
    prompt: "What does this launch do?",
    choices: {
      a: "Starts the session directly in plan mode: Claude reads code and prepares a plan without changing anything until approval.",
      b: "Generates a plan into `PLAN.md` and exits.",
      c: "Disables all permission prompts so the plan runs without stopping.",
      d: "Starts Claude in a mode where it only answers questions with no file access.",
    },
    whyWrong: {
      b: "It's an interactive session in a given mode, not a one-shot file generation.",
      c: "The opposite: plan mode is the most cautious mode; edits are forbidden in it.",
      d: "Reading and searching files is allowed in plan mode; otherwise the plan would have nothing to rest on.",
    },
    explanation:
      "`--permission-mode plan` sets the session's starting mode. Useful when you know up front that the task is big and should begin with research.",
  },
  "dc-2-q3": {
    scenario:
      "The project needs to move from `moment` to `date-fns`. The library is used in about 40 files, some of them involving time zones and localisation.",
    prompt: "How should you start working on this with Claude Code?",
    choices: {
      a: "Immediately ask it to replace all imports and run the tests at the end.",
      b: "In plan mode, ask it to find all usages, group them by difficulty and propose a phased plan saved to a file.",
      c: "Rewrite the first 20 files yourself and hand the rest to Claude.",
      d: "Ask Claude to read all 40 files one by one in the main session to \"get the full picture\".",
    },
    whyWrong: {
      a: "Without research you don't know where the tricky time-zone cases are; errors will surface late and en masse.",
      c: "Doing half the work by hand gives you neither a plan nor a consistent approach for the other half.",
      d: "Reading everything floods the context; a usage search plus selective analysis of the risky spots gives the picture.",
    },
    explanation:
      "A multi-file change first needs a map: where things are used and which spots are risky. A plan in a file becomes a checklist you can return to across sessions.",
  },
  "dc-2-q4": {
    prompt: "What can Claude do in plan mode?",
    choices: {
      a: "Edit files, if the change is small.",
      b: "Read files and search the code.",
      c: "Ask clarifying questions and propose a plan for approval.",
      d: "Run state-changing commands such as database migrations.",
    },
    whyWrong: {
      a: "Size doesn't matter: in plan mode edits are forbidden until the plan is approved.",
      d: "State-changing actions are exactly what plan mode defers until approval.",
    },
    explanation:
      "Plan mode is read-only: research, analysis, questions, a plan. Changes begin only after you've approved the plan and left the mode.",
  },
  "dc-2-q5": {
    prompt: "Why ask Claude to write the agreed plan to a file (e.g. `docs/plan-auth.md`) or a GitHub issue?",
    choices: {
      a: "That way the plan automatically becomes part of the system prompt.",
      b: "Without a file Claude can't leave plan mode.",
      c: "The plan survives `/clear`, compaction and a new session; you can return to it if the implementation goes wrong.",
      d: "So that Claude can't deviate from the plan even by one step.",
    },
    whyWrong: {
      a: "The file isn't wired in anywhere by itself; you use it by mentioning it in a prompt or importing it.",
      b: "Leaving plan mode is your approval; no file is required.",
      d: "A file is a guide, not a technical constraint; adherence to the plan is checked in the diff.",
    },
    explanation:
      "The conversation is temporary; a file isn't. A written plan acts as a recovery point and a progress checklist for a long task.",
  },
  "dc-2-q6": {
    scenario:
      "You need to fix a typo in the README heading and update the year in the copyright line. The change is obvious and takes two lines.",
    prompt: "Is plan mode needed here?",
    choices: {
      a: "Yes, plan mode is mandatory for any change to the repository.",
      b: "Yes, otherwise Claude won't have access to the README.",
      c: "No, because plan mode only works with code, not documentation.",
      d: "No: the task is simple and unambiguous; just ask for the edit and review the diff.",
    },
    whyWrong: {
      a: "Planning pays off where there's uncertainty; for an obvious edit it's a wasted round trip.",
      b: "File access doesn't depend on plan mode; the default mode reads and edits too.",
      c: "Plan mode isn't restricted by file type; the reason is the simplicity of the task, not that.",
    },
    explanation:
      "Planning is a tool against uncertainty. When a change fits in one sentence and can be verified with one glance at the diff, a plan only slows you down.",
  },
  "dc-2-q7": {
    prompt: "Put the steps of working with a plan in order, from stating the task to verification.",
    choices: {
      a: "Read the plan and ask for corrections if something is off.",
      b: "Verify the result with tests and a diff review.",
      c: "Enable plan mode and describe the goal and constraints.",
      d: "Approve the plan and allow implementation.",
    },
    explanation:
      "A plan is only valuable if you actually read and correct it before approving. After implementation you verify the result, not the report about it.",
  },

  // ── Level 3: Git, commits and PRs ───────────────────────────────────────
  "dc-3-q1": {
    prompt: "What does Claude Code rely on when you ask it to \"commit the changes with a meaningful message\"?",
    choices: {
      a: "Only its memory of the conversation: it doesn't read git.",
      b: "`git status`, `git diff` and recent `git log` history, to describe the changes in the project's style.",
      c: "A message template, which must be defined in the settings.",
      d: "The branch name: the message is built from it.",
    },
    whyWrong: {
      a: "Claude runs git commands and sees the real state, not just what it remembers from the conversation.",
      c: "A template isn't required: Claude picks up the style from existing commit history.",
      d: "A branch name carries little information; the substance of a commit is in the diff.",
    },
    explanation:
      "A good commit message explains what changed and why. Claude takes that from the diff and follows the format in `git log` (conventional commits, for example).",
  },
  "dc-3-q2": {
    scenario:
      "You're on `master` and about to start a new feature with Claude Code. Team rules forbid committing directly to `master`.",
    prompt: "What should you do before the first edit?",
    choices: {
      a: "Work on `master` and move the commits to a new branch before pushing.",
      b: "Add `master` to `deny` so Claude can't read files.",
      c: "Ask Claude to create a `feature/...` branch and work there.",
      d: "Nothing: Claude Code creates a branch for every session automatically.",
    },
    whyWrong: {
      a: "Possible, but it's needless risk and manual work; creating the branch up front is cheaper.",
      b: "Permission rules apply to tools and paths, not branches; and Claude does need to read files.",
      d: "There are no automatic branches; Claude works with the repository in whatever state it's in.",
    },
    explanation:
      "A branch at the start isolates the changes and gives you a simple rollback point. Ask for it explicitly or create it yourself before the session.",
  },
  "dc-3-q3": {
    prompt: "What does Claude Code need in order to create and view GitHub pull requests from the terminal by itself?",
    choices: {
      a: "An installed and authenticated `gh` CLI.",
      b: "A separate paid GitHub Enterprise plan.",
      c: "GitHub open in a browser, from which Claude reads the page.",
      d: "Nothing: Claude Code has a built-in GitHub API client.",
    },
    whyWrong: {
      b: "PR work only needs the regular `gh`; no special plan is required.",
      c: "Claude Code works through terminal commands, not through your browser.",
      d: "The standard path is `gh`; without it Claude would have to assemble API requests by hand.",
    },
    explanation:
      "`gh` gives Claude commands such as `gh pr create`, `gh pr view` and `gh issue view`. It's the simplest way to work with PRs and issues without a browser.",
  },
  "dc-3-q4": {
    prompt: "Which commit practices with Claude Code are correct?",
    choices: {
      a: "One big commit at the end of the day, to keep history short.",
      b: "Review `git diff` before every commit instead of relying on Claude's report.",
      c: "Commit after each logical step with green tests.",
      d: "Make sure `.env`, keys and local artefacts don't end up in the commit.",
      e: "Allow `git add -A` without review: Claude knows which files are needed.",
    },
    whyWrong: {
      a: "A big commit is hard to review and to partially revert; short history isn't worth that.",
      e: "`git add -A` also picks up unexpected files — secrets, logs, temporary scripts.",
    },
    explanation:
      "Small verified commits are natural rollback points when working with an agent. A human reviews the diff: the model's report doesn't replace looking at the actual changes.",
  },
  "dc-3-q5": {
    scenario:
      "After `git rebase main` there's a conflict in `pricing.ts`: `main` changed the rounding, your branch added discounts. You ask Claude for help.",
    prompt: "Which approach is right?",
    choices: {
      a: "Always take the `main` version, since it's newer.",
      b: "Always take your version, since the feature matters more.",
      c: "Delete the conflict markers and keep both lines.",
      d: "Ask Claude to work out the intent of both changes (via `git log` on both sides), merge them into one piece of logic and run the tests.",
    },
    whyWrong: {
      a: "The discount logic is lost; a conflict means both changes are needed.",
      b: "The new rounding rule from `main` is lost — a silent regression.",
      c: "Two declarations of `total` won't even compile, and it doesn't combine the meaning.",
    },
    explanation:
      "Resolving a conflict means merging intents, not picking a side. Here you need one formula — discount first, then the new rounding — and tests that confirm it.",
  },
  "dc-3-q6": {
    prompt: "You want to work on two independent tasks in parallel, with two Claude Code sessions in one repository. How do you do it properly?",
    choices: {
      a: "Run two sessions in the same directory: they coordinate automatically.",
      b: "Create a separate git worktree for each task and run a session in it.",
      c: "Clone the repository from scratch for each session, since worktrees aren't supported.",
      d: "Switch branches with `git checkout` between the sessions' replies.",
    },
    whyWrong: {
      a: "There's no coordination: the sessions will overwrite the same files and working tree.",
      c: "Worktrees are supported and lighter than a full clone: shared history, separate working directories.",
      d: "Switching branches changes the files under both sessions' feet — a direct route to confusion.",
    },
    explanation:
      "A worktree is a separate working directory on its own branch with shared history. Each session gets isolated files, and the results are merged with ordinary git.",
  },
  "dc-3-q7": {
    prompt: "Put the steps from starting a feature to an open PR in order.",
    choices: {
      a: "Review `git diff` and remove anything unnecessary.",
      b: "Create a feature branch.",
      c: "Push the branch and create a PR with `gh pr create`.",
      d: "Implement the changes and run the tests.",
      e: "Commit with a meaningful message.",
    },
    explanation:
      "The diff is reviewed before committing, not after pushing: that way only what you've consciously approved ends up in the PR.",
  },

  // ── Level 4: Tests and TDD ──────────────────────────────────────────────
  "dc-4-q1": {
    prompt: "Why explicitly tell Claude \"we're doing TDD\" at the start of a task?",
    choices: {
      a: "Otherwise Claude refuses to run tests.",
      b: "So that Claude writes tests for the expected behaviour of code that doesn't exist yet, rather than jumping to an implementation or stubs for it.",
      c: "So that Claude automatically enables a coverage report.",
      d: "TDD mode turns on a separate set of Claude Code tools.",
    },
    whyWrong: {
      a: "Running tests doesn't depend on that phrase; it changes the order and way of working.",
      c: "Coverage is a separate test-runner setting, not directly tied to TDD.",
      d: "There's no special TDD mode with its own tools; it's a way of framing the task.",
    },
    explanation:
      "Without an explicit instruction, the model tends to write the implementation or a mock implementation straight away and fit tests to it. Stating TDD fixes the order: the specification in tests first, then the code.",
  },
  "dc-4-q2": {
    prompt: "Put the steps of a TDD cycle with Claude Code in order.",
    choices: {
      a: "Commit the tests.",
      b: "Write tests based on expected inputs and outputs.",
      c: "Write the implementation without changing the tests until they pass.",
      d: "Run the tests and confirm they fail.",
      e: "Commit the implementation.",
    },
    explanation:
      "Committing the tests before the implementation locks in the specification: any later edit to the tests shows up in the diff immediately. The red run proves the tests really check the new behaviour.",
  },
  "dc-4-q3": {
    scenario:
      "Claude reports: \"All tests pass.\" In the diff you see that besides the implementation it changed a test: `expect(total).toBe(42)` became `expect(total).toBeDefined()`.",
    prompt: "How do you respond?",
    choices: {
      a: "Accept it: the tests are green, so the task is done.",
      b: "Accept it, but add a TODO to restore the check later.",
      c: "Reject the test change, restore the assertion and state explicitly: don't change the tests, fix the implementation.",
      d: "Delete that test, since it's getting in the way.",
    },
    whyWrong: {
      a: "A green test that checks nothing is worse than a red one: it hides the bug.",
      b: "A weakened specification lands in main; \"later\" usually never comes.",
      d: "The test is in the way because the implementation is wrong; deleting it just hides the defect.",
    },
    explanation:
      "In TDD the tests are the specification. Weakening an assertion is the classic way to \"pass\" a test without a correct implementation, which is why the test diff deserves separate review.",
  },
  "dc-4-q4": {
    prompt: "Why must a new test be run and seen failing before the implementation exists?",
    choices: {
      a: "To warm up the test runner's cache.",
      b: "Most CI systems require it.",
      c: "The red run is only for the report; it doesn't affect the outcome.",
      d: "A test that passes without the implementation checks nothing, or checks the wrong thing.",
    },
    whyWrong: {
      a: "The runner's cache is irrelevant; the point is to verify the test itself.",
      b: "CI doesn't know in what order you wrote the code; it's a requirement of the method, not the infrastructure.",
      c: "It directly matters: without it you don't know whether the test is capable of failing.",
    },
    explanation:
      "The red state proves the test is sensitive to the missing behaviour. If a test is green straight away, it's either tautological or testing code that already exists.",
  },
  "dc-4-q5": {
    prompt: "Which changes in a diff are signs that the tests were gamed rather than the task solved?",
    choices: {
      a: "The implementation gained a branch that only triggers on the specific input data from the test.",
      b: "A new test was added for an edge case that wasn't checked before.",
      c: "A test was marked `skip` or commented out.",
      d: "An exact assertion was replaced with a weaker one (e.g. `toBeTruthy`).",
      e: "After the green run, a refactor was done without changing the tests.",
    },
    whyWrong: {
      b: "That's a normal extension of the specification, not a workaround.",
      e: "Refactoring on green tests is the third step of red-green-refactor.",
    },
    explanation:
      "Hard-coding for test data, disabled tests and weakened assertions produce a green result without correct code. That's why in TDD with an agent the test diff gets closer scrutiny than the implementation diff.",
  },
  "dc-4-q6": {
    scenario: "Users report that a promo-code discount is applied twice if they refresh the checkout page.",
    prompt: "Where do you start fixing this with Claude Code?",
    choices: {
      a: "Ask for a test that reproduces the double application and fails, then fix the code.",
      b: "Ask for an immediate fix, and add a test if there's time left.",
      c: "Ask it to rewrite the whole checkout module.",
      d: "Add a UI check so the button can't be pressed twice.",
    },
    whyWrong: {
      b: "Without a test you don't know whether the bug was actually reproduced and fixed, and it may come back.",
      c: "A disproportionate change with a high risk of new defects instead of a targeted fix.",
      d: "The symptom is treated in one place while the cause in the discount logic remains.",
    },
    explanation:
      "A failing test is both an exact reproduction of the bug and the definition of done. After the fix it guards against regression for good.",
  },
  "dc-4-q7": {
    prompt: "Why put these lines in CLAUDE.md?",
    choices: {
      a: "So Claude doesn't run tests at all without separate permission.",
      b: "So Vitest can find the test files.",
      c: "So Claude has a fast, targeted verification loop and doesn't have to guess how tests run in this project.",
      d: "So tests run automatically after every edit.",
    },
    whyWrong: {
      a: "Describing commands doesn't restrict permissions; that's what `permissions` is for.",
      b: "Vitest reads its own configuration; only Claude reads CLAUDE.md.",
      d: "Running automatically on an event is a hook's job, not text in memory.",
    },
    explanation:
      "An agent iterates faster the cheaper verification is. An exact command for a single file gives feedback in seconds, while the full suite is kept for the final check.",
  },

  // ── Level 5: Automation ─────────────────────────────────────────────────
  "dc-5-q1": {
    prompt: "Where does this hook command get the path of the edited file from?",
    choices: {
      a: "From the command-line argument `$1`, which Claude Code passes to the script.",
      b: "From an environment variable you have to declare in `env`.",
      c: "From the JSON Claude Code feeds to the hook's stdin: the `tool_input.file_path` field.",
      d: "From the last line of Claude's output in the terminal.",
    },
    whyWrong: {
      a: "There are no positional arguments with call data; the data arrives through a different channel.",
      b: "You don't have to declare anything: Claude Code passes the call data automatically.",
      d: "A hook doesn't read terminal output; it receives structured data about the tool call.",
    },
    explanation:
      "A hook command receives JSON describing the event on stdin: the tool name, its `tool_input`, `session_id`, `cwd` and so on. `jq` extracts the field you need.",
  },
  "dc-5-q2": {
    prompt: "What happens if a hook on the `Stop` event exits with code 2 and writes \"tests are red: 3 failures\" to stderr?",
    choices: {
      a: "Claude won't end its turn: it receives the stderr message and keeps working.",
      b: "The session crashes with an error.",
      c: "Only the user sees the message; Claude never learns about it.",
      d: "Nothing: exit codes are ignored for `Stop`.",
    },
    whyWrong: {
      b: "Code 2 is a controlled blocking signal, not a session failure.",
      c: "For code 2, stderr is passed to Claude itself as feedback.",
      d: "For `Stop`, code 2 does have an effect: it prevents the turn from ending.",
    },
    explanation:
      "A blocking `Stop` hook forces Claude to keep going until the condition is met. The script should check the `stop_hook_active` field in the input JSON to avoid an infinite loop.",
  },
  "dc-5-q3": {
    scenario:
      "You created a command `.claude/commands/fix-issue.md` that injects a GitHub issue description into the prompt via `!` bash execution. When you call `/fix-issue 123`, the `gh` command doesn't run.",
    prompt: "What is the file most likely missing?",
    choices: {
      a: "`$1` instead of `$ARGUMENTS`: otherwise the number isn't substituted.",
      b: "An `allowed-tools` field in the frontmatter permitting `Bash(gh issue view:*)`.",
      c: "The file must live in `.claude/skills/`, not `commands/`.",
      d: "The file name must start with `/`.",
    },
    whyWrong: {
      a: "`$ARGUMENTS` substitutes the whole argument string; for a single number it works.",
      c: "Slash commands with `$ARGUMENTS` and `!` execution belong in `.claude/commands/`.",
      d: "The command name comes from the file name without the extension; the slash is only typed when invoking.",
    },
    explanation:
      "Bash execution via `!` in a slash command is subject to permissions. `allowed-tools` in the frontmatter permits exactly the commands this template needs.",
  },
  "dc-5-q4": {
    prompt: "What does this pipeline print?",
    choices: {
      a: "The whole JSON response object with its metadata.",
      b: "Nothing: `-p` doesn't read stdin.",
      c: "A stream of streaming events, one per line.",
      d: "Only the text of Claude's final answer — the finished changelog.",
    },
    whyWrong: {
      a: "`jq -r '.result'` selects a single field, not the whole object.",
      b: "In `-p` mode, stdin content is added to the prompt as context.",
      c: "An event stream comes from `stream-json`; `json` returns one object at the end.",
    },
    explanation:
      "`--output-format json` returns a single object with fields such as `result`, `session_id` and `total_cost_usd`. The script takes `result` for the text and the rest for logging and cost control.",
  },
  "dc-5-q5": {
    prompt: "You need to migrate 500 files following one pattern. Which of these describe a correct headless fan-out setup?",
    choices: {
      a: "One interactive session that processes all 500 files in a row in a single context.",
      b: "A script generates the file list, and a loop calls `claude -p` separately for each file.",
      c: "Each call gets a narrow `--allowedTools`, sufficient only for this migration.",
      d: "Results are verified (tests, linter), and failed files are queued for reprocessing.",
      e: "`--dangerously-skip-permissions` on your work laptop so confirmations don't get in the way.",
    },
    whyWrong: {
      a: "The context will overflow long before the end, and quality degrades with every file.",
      e: "Bypassing permissions outside an isolated container exposes your whole account to mistakes and prompt injection.",
    },
    explanation:
      "Fan-out gives each file a fresh context and the same prompt. Narrow permissions and automated verification make a mass change predictable.",
  },
  "dc-5-q6": {
    scenario:
      "The team wants to write `@claude` in PR and issue comments on GitHub so that Claude answers questions and proposes changes. Nothing like this has been set up in the repository before.",
    prompt: "What's the simplest way to set it up?",
    choices: {
      a: "Add a line to CLAUDE.md: \"respond to GitHub mentions\".",
      b: "Write a cron script that polls the GitHub API every minute and runs `claude -p`.",
      c: "Run `/install-github-app` in Claude Code: it installs the GitHub App and adds a workflow using `anthropics/claude-code-action` with the API key secret.",
      d: "Give every developer an API key and ask them to run Claude locally when mentioned.",
    },
    whyWrong: {
      a: "Only a running Claude Code reads CLAUDE.md; it doesn't listen to anything on GitHub.",
      b: "Reinventing the wheel with delays and your own secret handling; there's a ready-made GitHub Action for this.",
      d: "A manual process with no automatic trigger and keys scattered around.",
    },
    explanation:
      "`/install-github-app` walks you through installing the app and creating the workflow. From then on the GitHub Action reacts to `@claude` mentions in comments and runs on a runner with the key from secrets.",
  },
  "dc-5-q7": {
    prompt: "Put the steps of creating a hook that formats files after every edit in order.",
    choices: {
      a: "Confirm via `/hooks` that the hook is registered.",
      b: "Write a script that reads JSON from stdin and formats the file at `tool_input.file_path`.",
      c: "Commit `.claude/settings.json` so the hook applies to the whole team.",
      d: "Register the script in `.claude/settings.json` under `PostToolUse` with matcher `Edit|Write`.",
      e: "Ask Claude to make a test edit and check that the file got formatted.",
    },
    explanation:
      "A hook is code, so you write it, register it, test it on a real event, and only then roll it out to the team.",
  },

  // ── Boss: Refactoring a large repo ──────────────────────────────────────
  "dc-boss-q1": {
    scenario:
      "A 1,200-file monorepo. The internal API `getUserCtx()` must be renamed to `resolveSession()` and its signature changed: it's now asynchronous. There are call sites in 12 packages.",
    prompt: "Where do you start?",
    choices: {
      a: "Ask Claude to replace all calls and add `await` right away, then fix whatever breaks.",
      b: "Read all 1,200 files in one session so Claude sees everything.",
      c: "Start with the package you know best and proceed by intuition.",
      d: "In plan mode, research the usages (including via per-package subagents), build an impact map and a phased plan in a file.",
    },
    whyWrong: {
      a: "Going async breaks callers' contracts; without an impact map, \"whatever breaks\" means dozens of packages at once.",
      b: "The context overflows long before any understanding emerges; you need a selective map, not a full read.",
      c: "Without a plan, the order is dictated by convenience rather than by dependencies between packages.",
    },
    explanation:
      "A large-scale change starts with a map: where the calls are, which are in synchronous contexts, in what order to go through the packages. Subagents deliver summaries without flooding the main context.",
  },
  "dc-boss-q2": {
    scenario:
      "The plan is agreed: 6 phases by package. After the second phase you notice the session context is nearly full, and Claude has started mixing up details of the first phase.",
    prompt: "How do you continue?",
    choices: {
      a: "Commit the phase, mark it done in the plan file, run `/clear` and start the next phase from the plan.",
      b: "Keep going in the same session: auto-compaction will sort it out.",
      c: "Ask Claude to \"remember everything important\" and move on.",
      d: "Revert both phases and start over with a bigger model.",
    },
    whyWrong: {
      b: "Compaction compresses history lossily; for long multi-phase work, state in a file and in git is more reliable.",
      c: "Asking doesn't enlarge the context window; memory has to be external — the plan and the commits.",
      d: "The completed, verified work has no flaws; the problem is how sessions are organised, not the model.",
    },
    explanation:
      "The state of a long task lives in git and the plan file, not in the conversation. Then each phase starts with a fresh context without losing progress.",
  },
  "dc-boss-q3": {
    prompt: "What safety net do you need before a large-scale refactor?",
    choices: {
      a: "Temporarily disable CI so intermediate red builds don't get in the way.",
      b: "A dedicated branch for the refactor.",
      c: "A recorded green test run before the changes — a baseline.",
      d: "Characterisation tests for critical paths with weak coverage.",
      e: "`bypassPermissions` mode, to avoid being distracted by confirmations.",
    },
    whyWrong: {
      a: "CI is your main check; disabling it precisely during a risky change is backwards.",
      e: "The wider the change, the more boundaries matter; bypassing permissions removes the last safeguard.",
    },
    explanation:
      "A baseline answers the question \"did I break this, or was it already broken?\". Characterisation tests pin down current behaviour where no specification exists.",
  },
  "dc-boss-q4": {
    scenario:
      "The mechanical part of the refactor — renaming an import and a call — is identical across ~300 files. Claude offers to go through them and edit each file individually.",
    prompt: "What's the better approach?",
    choices: {
      a: "Agree: that way each file gets individual attention.",
      b: "Ask Claude to write a codemod (e.g. with `ts-morph` or `jscodeshift`), run it, review the diff, and finish the unusual cases by hand.",
      c: "Do a global `sed` replacement across the repo without checking.",
      d: "Split the 300 files among colleagues for manual edits.",
    },
    whyWrong: {
      a: "For an identical mechanical change, \"individual attention\" only adds slowness, cost and a chance of inconsistency.",
      c: "A text replacement will hit strings, comments and similar names; without an AST and verification it's a lottery.",
      d: "Manual mechanical work is slow and inconsistent; automation is clearly better here.",
    },
    explanation:
      "A deterministic script makes an identical change identically, and it can be re-run and reviewed. Claude is valuable as the codemod's author and for handling the unusual cases.",
  },
  "dc-boss-q5": {
    prompt: "Put the stages of a safe large-scale refactor with Claude Code in order.",
    choices: {
      a: "Run the codemod for the mechanical part and review the diff.",
      b: "Create a branch and record a green test baseline.",
      c: "Full test run, type-check and diff review before the PR.",
      d: "Research in plan mode and write a phased plan to a file.",
      e: "Finish the unusual cases package by package, committing each phase.",
    },
    explanation:
      "Safety net and map first, then the cheap mechanical part, then targeted manual work with commits. The final check covers the whole repository, not just the changed files.",
  },
};
