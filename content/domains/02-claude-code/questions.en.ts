import type { QuestionEn } from "@/lib/content/types";

/** Англійський дубль питань цього домену: id питання → переклад. */
export const questionsEn: Record<string, QuestionEn> = {
  // ── Level 1: Claude Code fundamentals ───────────────────────────────────
  "cc-1-q1": {
    prompt: "What is plan mode in Claude Code?",
    choices: {
      a: "A mode in which Claude explores the code and proposes a plan but makes no changes until the plan is approved.",
      b: "A mode in which Claude makes the changes and then shows a summary.",
      c: "A mode in which Claude only answers questions and does not read files.",
      d: "A mode that automatically approves all file edits.",
    },
    whyWrong: {
      b: "That is ordinary execution mode: the changes are already made by the time you see the summary.",
      c: "Reading and exploration are exactly what plan mode allows — it is changes that are forbidden.",
      d: "That is the behaviour of `acceptEdits` — the opposite of plan mode.",
    },
    explanation:
      "Plan mode gives you a cheap checkpoint: you see the intent before any change and correct it while the correction costs one paragraph of text rather than a rollback across ten files.",
  },
  "cc-1-q2": {
    prompt: "How does `/clear` differ from `/compact`?",
    choices: {
      a: "`/clear` starts the conversation from a blank slate; `/compact` summarises the existing history and continues from that summary.",
      b: "`/clear` deletes project files, `/compact` does not.",
      c: "`/clear` clears the prompt cache, `/compact` clears the history.",
      d: "They are synonyms from different CLI versions.",
    },
    whyWrong: {
      b: "Neither command touches files on disk — both work only with the conversation context.",
      c: "Cache management is not what these commands do.",
      d: "They are different operations with different consequences for the retained context.",
    },
    explanation:
      "`/compact` preserves the substance of the work by compressing the history — right in the middle of a long task. `/clear` leaves nothing — right when you move to an unrelated task and the old context only gets in the way.",
  },
  "cc-1-q3": {
    prompt: "Which statements about Claude Code permission modes are correct?",
    choices: {
      a: "`acceptEdits` automatically accepts file edits without asking every time.",
      b: "`plan` forbids changes until the plan is approved.",
      c: "`bypassPermissions` skips confirmation prompts and is intended for isolated environments.",
      d: "The permission mode overrides `deny` rules from settings.json.",
    },
    whyWrong: {
      d: "Deny rules have the highest priority — a mode cannot override them.",
    },
    explanation:
      "Modes define how often you are asked. They do not replace permission rules: `deny` remains a hard barrier in every mode.",
  },
  "cc-1-q4": {
    prompt: "You closed the terminal in the middle of a long task. How do you return to the same conversation?",
    choices: {
      a: "Run `claude --resume` and pick the session (or `claude --continue` for the most recent one).",
      b: "Run `claude` and ask it to recall the previous conversation.",
      c: "Restore the context from CLAUDE.md.",
      d: "Sessions cannot be resumed — you have to start over.",
    },
    whyWrong: {
      b: "A fresh start begins with an empty context; the model has no access to history it was never given.",
      c: "CLAUDE.md holds standing project instructions, not the history of a specific session.",
      d: "Claude Code stores sessions locally precisely so they can be resumed.",
    },
    explanation:
      "`--continue` takes the latest session in this directory, `--resume` lets you pick from a list. It is also the basis for resumable workflows in scripts.",
  },
  "cc-1-q5": {
    scenario:
      "A developer complains: in a large monorepo Claude Code keeps editing the wrong files and ignores the team's style conventions.",
    prompt: "Where do you start?",
    choices: {
      a: "Add a CLAUDE.md at the root describing the repository structure and the rules, plus CLAUDE.md files in the key subdirectories.",
      b: "Repeat the style rules in every request.",
      c: "Forbid edits through `deny` rules.",
      d: "Switch to a larger model.",
    },
    whyWrong: {
      b: "It works for one session but does not scale to a team, and it is forgotten exactly when it matters.",
      c: "That stops the wrong edits at the price of stopping the right ones too — the tool becomes unusable.",
      d: "A model cannot guess a team's unwritten conventions; what it lacks is context, not capability.",
    },
    explanation:
      "CLAUDE.md is project memory that is read automatically. A file in a subdirectory is picked up when working in that part of the tree, so local rules live next to the code they describe.",
  },

  // ── Level 2: CLAUDE.md hierarchy ────────────────────────────────────────
  "cc-2-q1": {
    prompt: "Where does the CLAUDE.md that applies to all of a given user's projects live?",
    choices: {
      a: "`~/.claude/CLAUDE.md`",
      b: "`./CLAUDE.md` at the project root",
      c: "`./.claude/settings.json`",
      d: "`./CLAUDE.local.md`",
    },
    whyWrong: {
      b: "That is project memory: it applies only in that repository and is usually committed with it.",
      c: "That is the settings file (permissions, hooks, variables), not a memory file.",
      d: "That is a personal file for a single project; the approach is deprecated in favour of imports.",
    },
    explanation:
      "User memory in `~/.claude/CLAUDE.md` applies across all projects — the right place for personal preferences, not for the rules of a specific repository.",
  },
  "cc-2-q2": {
    prompt: "Order the memory levels from the broadest scope to the narrowest.",
    choices: {
      a: "Enterprise policy — organisation-managed memory",
      b: "User — ~/.claude/CLAUDE.md",
      c: "Project — ./CLAUDE.md at the repository root",
      d: "Directory — CLAUDE.md in a subdirectory",
    },
    explanation:
      "From the organisation down to a single directory. The narrower the scope, the more specific the rules: a subdirectory is the place for details about that module, not for general principles.",
  },
  "cc-2-q3": {
    prompt: "How do you pull an external file into CLAUDE.md without copying its contents?",
    choices: {
      a: "With an `@path/to/file` import — the contents are loaded when memory is read.",
      b: "With a markdown link `[text](path)`.",
      c: "With an `!include` directive.",
      d: "By copying the contents into CLAUDE.local.md.",
    },
    whyWrong: {
      b: "A plain link stays text: the file behind it is not read automatically.",
      c: "No such directive exists; the import syntax is `@`.",
      d: "That is the copying the question asks you to avoid, and in a deprecated file at that.",
    },
    explanation:
      "`@path` imports let you split rules into topical files and reuse them, keeping CLAUDE.md a short table of contents instead of a wall of text.",
  },
  "cc-2-q4": {
    prompt: "What belongs in a project CLAUDE.md?",
    choices: {
      a: "The build, test and lint commands the team uses.",
      b: "Style and structure conventions that are not visible from the code.",
      c: "Environment quirks and the project's typical pitfalls.",
      d: "A complete list of every file in the repository.",
      e: "Secrets and access keys.",
    },
    whyWrong: {
      d: "It bloats the context and goes stale instantly; Claude will discover the structure by searching.",
      e: "CLAUDE.md is usually committed to the repository — secrets have no place there under any circumstances.",
    },
    explanation:
      "A good CLAUDE.md contains what cannot be derived from the code in a minute. Anything easily found by search only wastes context.",
  },
  "cc-2-q5": {
    scenario:
      "In a monorepo the frontend uses Tailwind and Vitest while the backend uses Django and pytest. The shared CLAUDE.md has grown to 400 lines, and Claude regularly proposes frontend approaches in backend tasks.",
    prompt: "How do you reorganise the memory?",
    choices: {
      a: "Keep only shared rules in the root CLAUDE.md and move the specifics into `apps/web/CLAUDE.md` and `services/api/CLAUDE.md`.",
      b: 'Split the file into sections with large "FRONTEND" and "BACKEND" headings.',
      c: "Move everything into the user-level `~/.claude/CLAUDE.md`.",
      d: "Shorten the file, keeping only the most important parts.",
    },
    whyWrong: {
      b: "Both sections still enter the context together and compete with each other — which is exactly what causes the confusion.",
      c: "Repository rules would leak into every other project and would stop being committed alongside the code.",
      d: "Shortening loses rules you need; the problem is not size but the absence of a binding to a part of the tree.",
    },
    explanation:
      "Directory-level CLAUDE.md files are picked up when working in that part of the tree. The rules arrive together with the area they describe — and stop competing with each other.",
  },

  // ── Level 3: Settings and permissions ───────────────────────────────────
  "cc-3-q1": {
    prompt: "Which settings file do you commit to the repository so the rules apply to the whole team?",
    choices: {
      a: "`.claude/settings.json`",
      b: "`.claude/settings.local.json`",
      c: "`~/.claude/settings.json`",
      d: "`CLAUDE.md`",
    },
    whyWrong: {
      b: "Those are personal settings for this project; they are not committed and are usually gitignored.",
      c: "That is the user level: it applies to all of that person's projects and does not belong to the repository.",
      d: "That is memory with instructions, not permission and hook configuration.",
    },
    explanation:
      "`.claude/settings.json` is the shared project configuration: permissions, hooks, environment variables. `settings.local.json` next to it stays a personal layer on top.",
  },
  "cc-3-q2": {
    prompt:
      "`Bash(rm:*)` is in `allow` in the project settings and in `deny` in the managed enterprise settings. What happens?",
    choices: {
      a: "The command is denied: managed enterprise settings have the highest priority, and `deny` overrides `allow`.",
      b: "The command is allowed: project settings are closer to the code.",
      c: "Claude asks the user for confirmation.",
      d: "A configuration error occurs and Claude does not start.",
    },
    whyWrong: {
      b: "The hierarchy works the other way round — corporate policy must override local settings, otherwise it would not be policy.",
      c: "An explicit denial does not turn into a prompt: it rejects the action.",
      d: "Conflicting rules are a normal situation resolved by priority, not by a crash.",
    },
    explanation:
      "Two rules at once: managed enterprise settings override local ones, and within any level `deny` beats `allow`. Denial always wins.",
  },
  "cc-3-q3": {
    prompt: "Which rule allows running only the test npm scripts and nothing else through npm?",
    choices: {
      a: "`Bash(npm run test:*)` — a prefix rule covering only commands that begin with `npm run test`.",
      b: "`Bash(npm:*)` — all npm commands.",
      c: "`Bash(*test*)` — anything containing the word test.",
      d: "`Bash(npm run test)` without the wildcard — an exact match.",
    },
    whyWrong: {
      b: "That would also allow `npm publish` and installing arbitrary packages — far broader than needed.",
      c: "A wildcard in the middle is far too broad: it would also match `rm -rf ./test-data`.",
      d: "An exact match would not cover `npm run test:unit` or `npm run test:e2e` — precisely what you wanted.",
    },
    explanation:
      "Permission rules work on the command prefix. Least privilege: a rule should cover what is needed and no more — `npm run test:*`, not all of npm.",
  },
  "cc-3-q4": {
    prompt: "What belongs in `settings.json` rather than in CLAUDE.md?",
    choices: {
      a: "Permissions for tools and commands.",
      b: "Hooks on events.",
      c: "Environment variables for the session.",
      d: "An explanation of the project architecture.",
      e: "Code style conventions.",
    },
    whyWrong: {
      d: "That is an instruction for the model — it belongs in CLAUDE.md, because settings.json never enters the context as text.",
      e: "Also memory, not configuration: settings.json has no influence on how the model writes code.",
    },
    explanation:
      "The distinction is simple: settings.json is what the harness executes (permissions, hooks, environment); CLAUDE.md is what the model reads. Mixing them means writing rules where nothing will enforce them.",
  },
  "cc-3-q5": {
    scenario:
      "The team wants Claude Code to run tests and the linter freely, but never read `.env` and never make network requests with curl without asking.",
    prompt: "How do you express that in settings?",
    choices: {
      a: "`allow` for the specific test and lint commands, `deny` for `Read(./.env)`, `ask` for `Bash(curl:*)`.",
      b: "`allow` everything and describe the restrictions in CLAUDE.md.",
      c: "`deny` everything except tests and work in `bypassPermissions`.",
      d: "Use a hook that checks every command with a script.",
    },
    whyWrong: {
      b: "CLAUDE.md is not an enforcement mechanism — it is text the model may interpret freely.",
      c: "`bypassPermissions` is meant for isolated environments and contradicts the whole idea of configured permissions.",
      d: "A workable solution, but overkill: for static rules, permissions are simpler, more reliable and declarative.",
    },
    explanation:
      "Three permission categories cover three intents: `allow` for routine without questions, `ask` for \"allowed, but supervised\", `deny` for a hard barrier. Hooks are reserved for dynamic checks.",
  },

  // ── Level 4: Hooks ──────────────────────────────────────────────────────
  "cc-4-q1": {
    prompt: "How does a hook fundamentally differ from an instruction in CLAUDE.md?",
    choices: {
      a: "A hook is code the harness runs deterministically on every event; an instruction is text the model may or may not act on.",
      b: "A hook is faster because it requires no model call.",
      c: "A hook only works in headless mode.",
      d: "A hook can modify the system prompt.",
    },
    whyWrong: {
      b: "Speed is a pleasant side effect, but the point is the guarantee of execution, not latency.",
      c: "Hooks work in interactive sessions too.",
      d: "Hooks react to events and can block an action or add context, but they do not rewrite the system prompt.",
    },
    explanation:
      "If something must always happen — formatting after an edit, a check before a commit — that is a job for a hook. A request in a prompt happens \"usually\", and it is that \"usually\" that eventually fails.",
  },
  "cc-4-q2": {
    prompt: "You want to block edits to files in `dist/` before they happen. Which event do you need?",
    choices: {
      a: "`PreToolUse` — fires before the tool runs and can reject the action.",
      b: "`PostToolUse` — immediately after the tool runs.",
      c: "`UserPromptSubmit` — when the user submits a request.",
      d: "`Stop` — when Claude finishes its response.",
    },
    whyWrong: {
      b: "The file has already been changed: after the fact you can only roll back, not block.",
      c: "At that moment it is not yet known which files Claude will decide to edit.",
      d: "That is the end of the turn — far too late for any blocking.",
    },
    explanation:
      "You can only block what has not happened yet: `PreToolUse` receives the tool name and arguments before execution and can reject the call.",
  },
  "cc-4-q3": {
    prompt: "What does exit code 2 from a hook script mean?",
    choices: {
      a: "The action is blocked, and the contents of stderr are passed to Claude as the reason.",
      b: "The hook failed, and execution continues as normal.",
      c: "The hook succeeded.",
      d: "The session will be terminated.",
    },
    whyWrong: {
      b: "That is how other non-zero codes behave — a non-blocking error.",
      c: "Success is exit code 0.",
      d: "A hook blocks a specific action, it does not end the session.",
    },
    explanation:
      "Exit code 2 is both a denial and feedback: stderr reaches the model, so it learns why the action was rejected and can take a different route instead of blindly retrying.",
  },
  "cc-4-q4": {
    prompt: "Which tasks are good candidates for a hook?",
    choices: {
      a: "Run a formatter after every file edit.",
      b: "Forbid writes to protected directories.",
      c: "Log every executed bash command for audit.",
      d: "Explain the project architecture to Claude.",
      e: "Choose the model based on task complexity.",
    },
    whyWrong: {
      d: "That is a standing instruction — the place for CLAUDE.md, not for an event script.",
      e: "That is a configuration- or request-level decision, not a reaction to a tool event.",
    },
    explanation:
      "Hooks are about deterministic side effects around events: formatting, denials, auditing. Anything that is knowledge for the model stays in project memory.",
  },
  "cc-4-q5": {
    scenario:
      "The team requires that every Python file Claude modifies is automatically run through `ruff format`. Right now this is requested in CLAUDE.md, and in roughly a quarter of cases the formatting does not happen.",
    prompt: "What is the right solution?",
    choices: {
      a: "A `PostToolUse` hook on the editing tools that runs `ruff format` on the changed file.",
      b: 'Strengthen the wording in CLAUDE.md and add "ALWAYS" in capital letters.',
      c: "A `PreToolUse` hook that rejects unformatted edits.",
      d: "Run the formatter manually at the end of the session.",
    },
    whyWrong: {
      b: "That leaves the same probabilistic guarantee, just in a louder font; the quarter of misses will not disappear.",
      c: "There is nothing to format before the write: the content is not on disk yet, and rejecting the edit would only stop the work.",
      d: "That is a human step again — one that gets forgotten, which is exactly what you were escaping.",
    },
    explanation:
      "\"Must always happen\" = hook. `PostToolUse` fires after every edit and makes formatting deterministic rather than a matter of the model's mood.",
  },

  // ── Level 5: Commands, skills and subagents ─────────────────────────────
  "cc-5-q1": {
    prompt: "Where do you put a custom slash command that should be available to the whole project team?",
    choices: {
      a: "`.claude/commands/<name>.md` in the repository.",
      b: "`~/.claude/commands/<name>.md`",
      c: "`.claude/skills/<name>/SKILL.md`",
      d: "`.claude/agents/<name>.md`",
    },
    whyWrong: {
      b: "That is a personal user command: available in all of their projects, but not to colleagues.",
      c: "That is an Agent Skill — invoked by the model based on its description, not by the user with `/`.",
      d: "That is a subagent definition, not a slash command.",
    },
    explanation:
      "Slash commands are markdown files containing a prompt. A file in `.claude/commands/` is committed with the project and becomes a shared team tool.",
  },
  "cc-5-q2": {
    prompt: "What is the key difference between a slash command and an Agent Skill?",
    choices: {
      a: "A command is invoked explicitly by the user; a skill is picked up by the model itself when its description matches the task.",
      b: "A skill can run bash and a command cannot.",
      c: "A command is project-only, a skill is global-only.",
      d: "A skill cannot contain additional files.",
    },
    whyWrong: {
      b: "Commands can run bash too and interpolate its output into the prompt.",
      c: "Both come in project and user flavours.",
      d: "The opposite: a skill is a directory where scripts and reference material live next to SKILL.md.",
    },
    explanation:
      "A command is a button for a human. A skill is a capability the model takes off the shelf based on the description in its frontmatter — which is why that description effectively acts as the trigger.",
  },
  "cc-5-q3": {
    prompt: "What does `$ARGUMENTS` do in a slash command file?",
    choices: {
      a: "It substitutes the text the user typed after the command name.",
      b: "It lists all command-line arguments of `claude`.",
      c: "It passes the contents of the file named in the argument.",
      d: "It declares the command's required parameters.",
    },
    whyWrong: {
      b: "The substitution applies to the slash command's own arguments, not to the CLI invocation.",
      c: "File contents are pulled in by an `@path` reference; `$ARGUMENTS` substitutes text only.",
      d: "The hint about expected arguments is set by `argument-hint` in the frontmatter; the substitution itself requires nothing.",
    },
    explanation:
      "`$ARGUMENTS` inserts the whole typed text, while `$1`, `$2` insert individual positional arguments. That lets one prompt template work for any input.",
  },
  "cc-5-q4": {
    prompt: "What is true about custom subagents in `.claude/agents/`?",
    choices: {
      a: "Each subagent is described by a markdown file with frontmatter: name, description and optionally a tool set and model.",
      b: "A subagent works in its own context window and returns a summary to the main agent.",
      c: "The `description` field deserves attention — the main agent decides when to delegate based on it.",
      d: "A subagent has access to the main session's history.",
      e: "Subagents can only call read tools.",
    },
    whyWrong: {
      d: "Context isolation is the essence of the mechanism: a subagent sees only what its task statement contains.",
      e: "The tool set is configurable; by default it is not limited to reading.",
    },
    explanation:
      "A subagent file is its system prompt plus metadata. The `description` acts as the delegation trigger, so vague wording means the subagent is either never invoked or invoked for the wrong thing.",
  },
  "cc-5-q5": {
    scenario:
      "The team has a 12-step release procedure with exact commands. Developers want to run it with a single action and want Claude not to improvise on the steps.",
    prompt: "What do you create?",
    choices: {
      a: "A slash command with the step-by-step procedure in `.claude/commands/release.md`.",
      b: 'An Agent Skill described as "releases".',
      c: "A subagent with the procedure in its system prompt.",
      d: "A section in CLAUDE.md describing the release.",
    },
    whyWrong: {
      b: "A skill fires at the model's discretion — a procedure launched deliberately at a specific moment needs an explicit command.",
      c: "An isolated context is not needed here, and the invocation would still be implicit.",
      d: "The procedure would enter the context of every session, but you could not run it with a single action.",
    },
    explanation:
      "A deliberate launch of an exact procedure is a slash command. The steps in its file set the frame instead of leaving Claude to invent the sequence each time.",
  },

  // ── Boss: Claude Code in CI/CD ──────────────────────────────────────────
  "cc-b-q1": {
    prompt:
      "How do you run Claude Code non-interactively so that the pipeline receives a structured response for further processing?",
    choices: {
      a: "`claude -p \"...\"` with `--output-format json` and an explicit list of allowed tools.",
      b: "`claude` with no flags, feeding the prompt on stdin.",
      c: "`claude --resume` with a session id.",
      d: "`claude -p \"...\" --permission-mode bypassPermissions` as the standard way for CI.",
    },
    whyWrong: {
      b: "Without `-p` the session tries to be interactive, and the output has no machine-readable structure.",
      c: "That resumes a previous session rather than starting a new task in CI.",
      d: "Bypassing permissions in CI turns the agent into an unrestricted command executor — precisely where that is most dangerous.",
    },
    explanation:
      "Headless mode: `-p` for a one-shot request, `--output-format json` for machine processing, an explicit tool allowlist. Permissions in automation should be narrower than local ones, never wider.",
  },
  "cc-b-q2": {
    scenario:
      "You are setting up automatic pull-request review in GitHub Actions. The workflow runs on every PR, including PRs from external contributors.",
    prompt: "Which permission setup is safest?",
    choices: {
      a: "Read and search only, no writes and no arbitrary bash commands; the result is posted as a comment.",
      b: "Full tool access — the review should be thorough.",
      c: "`bypassPermissions`, since CI is isolated anyway.",
      d: "Allow writes so the agent can fix the problems it finds right away.",
    },
    whyWrong: {
      b: "External PR code may contain injections; an agent with full rights would execute them with access to CI secrets.",
      c: "The runner has access to tokens and the network — \"isolated\" here does not mean \"harmless\".",
      d: "Automatic writes into an external PR branch are both a security risk and a modification of someone else's code without consent.",
    },
    explanation:
      "CI operates under a hostile-input assumption: PR content is untrusted data. A review needs only reading, so the tool set should be limited to exactly that.",
  },
  "cc-b-q3": {
    prompt: "Why set `--max-turns` or a similar limit in CI?",
    choices: {
      a: "So a task that goes off the rails does not spin and burn budget — in CI there is no human to press stop.",
      b: "To make the model respond faster.",
      c: "To reduce the size of the context.",
      d: "It is a required parameter of headless mode.",
    },
    whyWrong: {
      b: "The limit has no effect on generation speed; it only cuts the loop short.",
      c: "Context is constrained by compaction and tool design, not by a turn counter.",
      d: "The parameter is optional — but highly advisable precisely in automation.",
    },
    explanation:
      "An interactive session has a built-in safeguard: a human. Automation has none, which makes a turn limit and a budget a mandatory part of the configuration.",
  },
  "cc-b-q4": {
    prompt: "What should you do when preparing Claude Code to run in CI?",
    choices: {
      a: "Keep the API key in CI secrets rather than in the repository configuration.",
      b: "Provide an explicit tool allowlist instead of relying on defaults.",
      c: "Limit the number of turns and watch the cost of runs.",
      d: "Commit `.claude/settings.local.json` to the repository so CI sees the same settings.",
      e: "Disable hooks, since they are not needed in CI.",
    },
    whyWrong: {
      d: "That file is deliberately personal and is not committed; shared rules belong in `.claude/settings.json`.",
      e: "Hooks are especially useful in CI — they provide deterministic checks and auditing without a human.",
    },
    explanation:
      "CI is an unsupervised agent: secrets kept apart, permissions narrower, limits stricter. The shared configuration lives in `.claude/settings.json`, visible to both people and the pipeline.",
  },
  "cc-b-q5": {
    scenario:
      "A nightly job asks Claude to update dependencies and open a PR. Sometimes it changes not only the lock file but also application code, adapting it to the new versions — edits nobody asked for.",
    prompt: "How do you reliably constrain the scope of changes?",
    choices: {
      a: "Restrict write permissions to the specific dependency files and add a hook that rejects edits outside that list.",
      b: 'Write in the prompt: "only change package.json and the lock file".',
      c: "Review the diff in the PR and reject the extras manually.",
      d: "Lower `--max-turns` so the agent has no time to touch the code.",
    },
    whyWrong: {
      b: "That is a request: as soon as an update breaks something, the model will \"logically\" decide that fixing the code is part of the task.",
      c: "It works as a last line, but it shifts work onto a human every night — exactly what the job was meant to avoid.",
      d: "A turn limit does not control which files the agent picks first; it just truncates the work arbitrarily.",
    },
    explanation:
      "Boundaries on the scope of changes must be technical: permissions define where writing is possible at all, and a hook catches the rest. The prompt sets intent, permissions set the perimeter.",
  },
};
