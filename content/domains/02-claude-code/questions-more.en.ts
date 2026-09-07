import type { QuestionEn } from "@/lib/content/types";

/** Англійський дубль додаткового пулу. */
export const questionsMoreEn: Record<string, QuestionEn> = {
  "cc-1-q6": {
    prompt: "When is `/compact` the right choice rather than `/clear`?",
    choices: {
      a: "In the middle of a long task, when the context has grown but the work so far is still needed.",
      b: "When moving to a completely different task.",
      c: "When Claude starts making syntax mistakes.",
      d: "Before every new request.",
    },
    whyWrong: {
      b: "Then the old context only gets in the way — `/clear` is the better fit.",
      c: "That is unrelated to context size; the cause is usually missing instructions.",
      d: "Constant summarising loses detail and adds calls for no reason.",
    },
    explanation:
      "Compaction is a trade: you pay in detail for space. It fits where the substance matters more than the specifics and the work is still ongoing.",
  },
  "cc-1-q7": {
    prompt: "What does working in plan mode before a large change achieve?",
    choices: {
      a: "It lets you see the intent before anything on disk changes.",
      b: "It provides a cheap point to correct course.",
      c: "It makes the agent explore the code before proposing anything.",
      d: "It guarantees execution will not deviate from the plan.",
      e: "It speeds up completing the task.",
    },
    whyWrong: {
      d: "A plan is an intent, not a contract; boundaries come from permissions.",
      e: "Planning adds a step and time; the gain is in quality, not speed.",
    },
    explanation:
      "Plan mode moves the discussion to a stage where a correction costs a paragraph of text. But it is not a control mechanism — permissions play that role.",
  },
  "cc-1-q8": {
    prompt: "Claude Code has started proposing changes that contradict team conventions. Where do you look first?",
    choices: {
      a: "In CLAUDE.md: conventions absent from the context do not exist for the model.",
      b: "In the permission settings.",
      c: "In the CLI version.",
      d: "In the size of the context window.",
    },
    whyWrong: {
      b: "Permissions govern what may be done, not which style counts as correct.",
      c: "Knowledge of your team's conventions does not ship with a tool version.",
      d: "The window affects volume, not the presence of rules nobody wrote down.",
    },
    explanation:
      "Before blaming the tool, check whether the rules are written where the model reads them. Most often they simply are not there.",
  },
  "cc-1-q9": {
    prompt: "Why is `bypassPermissions` dangerous even on a developer's local machine?",
    choices: {
      a: "Any mistake or injection from the code being read executes with no barrier at all — including access to keys and the network.",
      b: "It disables session saving.",
      c: "It switches the model to a weaker one.",
      d: "It forbids the use of hooks.",
    },
    whyWrong: {
      b: "Sessions are saved regardless of the permission mode.",
      c: "The permission mode has no effect on model choice.",
      d: "Hooks work in every mode.",
    },
    explanation:
      "A local machine usually holds more secrets than CI: keys, tokens, internal network access. A no-confirmation mode is meant for isolated environments, not for convenience.",
  },
  "cc-1-q10": {
    prompt: "Put a typical Claude Code working cycle on a non-trivial task in order.",
    choices: {
      a: "Give context: what we are doing and what the constraints are",
      b: "Get and agree a plan in plan mode",
      c: "Make the changes with permissions matching the risk",
      d: "Verify the result with tests and review the diff",
    },
    explanation:
      "The cycle mirrors the agentic one: context, plan, act, verify. Skipping the first step means working from guesses; skipping the last means unnoticed regressions.",
  },
  "cc-1-q11": {
    prompt: 'A developer complains that Claude Code "forgot" an agreement made early in a long session. What is the most likely cause?',
    choices: {
      a: "The context was compacted and that detail from the early exchange did not make it into the summary.",
      b: "The model deliberately ignores old messages.",
      c: "The session was resumed from a different project.",
      d: "The agreement contradicted CLAUDE.md.",
    },
    whyWrong: {
      b: "There is no deliberate ignoring: the model sees what is in the context.",
      c: "Resuming a session does not mix contexts across projects.",
      d: "That would produce a visible contradiction, not forgetting.",
    },
    explanation:
      "Anything that must survive a long session belongs where it is read every time — in CLAUDE.md or a notes file — rather than relying on the conversation's memory.",
  },
  "cc-1-q12": {
    prompt: "What happens to uncommitted changes after `/clear`?",
    choices: {
      a: "Nothing: the command clears only the conversation context, files on disk stay as they are.",
      b: "They are reverted to the last commit.",
      c: "They are committed automatically.",
      d: "They are moved to a stash.",
    },
    whyWrong: {
      b: "Claude Code does not touch git state when clearing context.",
      c: "No automatic commits happen.",
      d: "A stash is created only on an explicit request.",
    },
    explanation:
      "The separation is simple: context lives in the session, changes live on disk. Clearing the conversation is not an operation on your code.",
  },
  "cc-1-q13": {
    scenario:
      "A team has five developers. For three of them Claude Code behaves as expected; for two it constantly asks confirmation for commands that run without questions for the others.",
    prompt: "Where do you look for the cause?",
    choices: {
      a: "In local settings: shared rules belong in a committed `.claude/settings.json`, not in everyone's personal files.",
      b: "In different model versions across developers.",
      c: "In different operating systems.",
      d: "In the size of the repository on disk.",
    },
    whyWrong: {
      b: "The model does not determine which commands require confirmation.",
      c: "Permission rules do not depend on the OS.",
      d: "The volume of code has no bearing on permission policy.",
    },
    explanation:
      "Behaviour that differs between people almost always means the rules live in local files. The shared configuration belongs in the repository.",
  },
  "cc-1-q14": {
    prompt: "What helps Claude Code work more effectively in a large repository?",
    choices: {
      a: "A description of the project structure and entry points in CLAUDE.md.",
      b: "Directory-level CLAUDE.md files for parts with their own conventions.",
      c: "Build and test commands written where the model can see them.",
      d: "The broadest possible permissions, so nothing interrupts.",
      e: "A regular `/clear` after every response.",
    },
    whyWrong: {
      d: "That speeds up work at the price of losing control over irreversible actions.",
      e: "Constant clearing forces you to explain the context from scratch every time.",
    },
    explanation:
      "Effectiveness in a large repository rests on context, not permissions: the less the model has to guess, the fewer steps it spends.",
  },
  "cc-1-q15": {
    prompt: "How does `claude --continue` differ from `claude --resume`?",
    choices: {
      a: "`--continue` takes the latest session in this directory, `--resume` lets you pick from the saved list.",
      b: "`--continue` continues with fresh context, `--resume` with the old one.",
      c: "`--continue` only works in headless mode.",
      d: "`--resume` creates a copy of the session.",
    },
    whyWrong: {
      b: "Both commands restore the saved session context.",
      c: "Both are available in interactive use.",
      d: "The session is continued, not copied.",
    },
    explanation:
      "The only difference is how the session is chosen: automatically the latest, or manually the one you need. Both return you to context already built up.",
  },
  "cc-1-q16": {
    scenario:
      'A developer asks Claude Code to "fix the failing test". Claude edits the test itself so it passes, although the bug was in the code.',
    prompt: "How do you avoid this in future?",
    choices: {
      a: "Write a rule in CLAUDE.md: a test expresses expected behaviour; if it fails, the code is checked first, and changing the test requires explicit justification.",
      b: "Forbid editing test files with a `deny` rule.",
      c: "Rephrase the task every time.",
      d: "Lower `effort`.",
    },
    whyWrong: {
      b: "Tests legitimately need changes too; a blanket ban breaks normal work.",
      c: "That shifts onto a human what can be written once as a project rule.",
      d: "Reasoning depth has nothing to do with which file counts as the source of truth.",
    },
    explanation:
      '"Fix the test" is ambiguous: the model took the shortest path to green. A rule in project memory removes that ambiguity for the whole team, permanently.',
  },
  "cc-2-q6": {
    prompt: "A developer wants personal project notes that never reach the repository. Where should they go?",
    choices: {
      a: "Into a file outside the repository, pulled in with an `@path` import from user memory.",
      b: 'Into the project `CLAUDE.md` marked "personal".',
      c: "Into `.claude/settings.json`.",
      d: "Into comments inside the code.",
    },
    whyWrong: {
      b: "The file is committed: a label will not stop it reaching the repository.",
      c: "That is a configuration file; text instructions there never enter the context.",
      d: "Comments are committed too and clutter the code with one person's notes.",
    },
    explanation:
      "Imports let content live outside the repository while remaining available to the model. This is the replacement for the deprecated `CLAUDE.local.md`.",
  },
  "cc-2-q7": {
    prompt: "Which signs indicate CLAUDE.md needs reorganising?",
    choices: {
      a: "The file has grown and rules for different parts of the project compete inside it.",
      b: "A significant part of the content is stale and nobody notices.",
      c: "It duplicates what a minute of searching would reveal from the code.",
      d: "It contains test and build commands.",
      e: "Other files reference it through imports.",
    },
    whyWrong: {
      d: "That is exactly what belongs there: commands are not obvious from the code and are needed daily.",
      e: "Imports are the recommended structure, not a problem.",
    },
    explanation:
      "Project memory degrades like documentation: it grows, goes stale and starts restating the obvious. It deserves review alongside the code.",
  },
  "cc-2-q8": {
    prompt: "A rule in user-level `~/.claude/CLAUDE.md` contradicts one in the project `CLAUDE.md`. Why is the project rule better for the team?",
    choices: {
      a: "The project rule has narrower scope and describes this specific repository, so it should win over personal preference.",
      b: "User memory is not read at all when project memory exists.",
      c: "The project file is always longer.",
      d: "The user file does not support imports.",
    },
    whyWrong: {
      b: "Both are read; the question is which rule fits this repository better.",
      c: "Length does not determine priority.",
      d: "It supports them just as the project file does.",
    },
    explanation:
      "The logic of the hierarchy: the narrower the scope, the more specific the rules. Personal preferences belong where the repository dictates nothing.",
  },
  "cc-2-q9": {
    prompt: "What happens if the import `@docs/style.md` points to a file that does not exist?",
    choices: {
      a: "Its rules simply never enter the context — the model works without them and says nothing about it.",
      b: "Claude Code refuses to start.",
      c: "The file is created automatically.",
      d: "The import is replaced by the root CLAUDE.md's content.",
    },
    whyWrong: {
      b: "A missing import is not a fatal configuration error.",
      c: "No files are created automatically.",
      d: "There is no default substitution.",
    },
    explanation:
      "Silently missing rules are the most dangerous kind: everything looks functional while the conventions go unapplied. Check import paths after moving files.",
  },
  "cc-2-q10": {
    scenario:
      "A project contains a legacy module that must not be changed without agreement from another team. New developers regularly ask Claude to \"clean it up\".",
    prompt: "How do you make the constraint reliable?",
    choices: {
      a: "A `deny` rule on writes to that directory plus an explanation in the directory-level CLAUDE.md of why.",
      b: "Just the explanation in CLAUDE.md.",
      c: "Just the `deny` rule.",
      d: "Move the module to a separate repository.",
    },
    whyWrong: {
      b: "An explanation influences behaviour but will not stop a change the model deems appropriate.",
      c: "The ban will hold, but nobody will understand why — and workarounds will begin.",
      d: "A large architectural change for a constraint that configuration solves.",
    },
    explanation:
      "The technical barrier and the explanation work as a pair: `deny` guarantees the change cannot happen, while the text in memory explains why and points to the right path.",
  },
  "cc-2-q11": {
    prompt: "Why describe the project's typical pitfalls in CLAUDE.md?",
    choices: {
      a: "That knowledge cannot be derived from the code: it saves the model steps and prevents repeating known mistakes.",
      b: "To reduce the size of the context.",
      c: "To replace comments in the code.",
      d: "It is a requirement of the file format.",
    },
    whyWrong: {
      b: "The description adds tokens; the gain is in quality, not volume.",
      c: "Comments and project memory solve different problems and do not replace one another.",
      d: "The format requires nothing — this is a practice recommendation.",
    },
    explanation:
      "The most valuable thing in project memory is what a newcomer learns only by getting burned. Written down once, it saves everyone hours.",
  },
  "cc-2-q12": {
    prompt: "Put the steps of organising memory in a large monorepo in order.",
    choices: {
      a: "Identify the rules common to the whole repository",
      b: "Move them into the root CLAUDE.md",
      c: "Create directory-level CLAUDE.md files for parts with their own stack",
      d: "Replace long blocks with imports of topical files",
    },
    explanation:
      "First separate the shared from the local, then spread it across levels, and only at the end shorten the root file with imports.",
  },
  "cc-2-q13": {
    prompt: "A team added a detailed description of all 40 project modules to CLAUDE.md. What is wrong with that?",
    choices: {
      a: "It is a large permanent context cost in every session, and the description will go stale faster than anyone updates it.",
      b: "CLAUDE.md does not support long texts.",
      c: "Module descriptions belong only in code comments.",
      d: "Nothing: more context is always better.",
    },
    whyWrong: {
      b: "There is no length limit — the question is whether it is worthwhile.",
      c: "Placement is not dogma; the problem is volume and freshness, not location.",
      d: "Excess context dilutes attention and costs money on every request.",
    },
    explanation:
      "The model will discover the project structure by searching in seconds. Memory should hold what searching cannot reveal: conventions, reasons for decisions, traps.",
  },
  "cc-2-q14": {
    prompt: "What is true about the enterprise level of memory?",
    choices: {
      a: "It has the widest scope — the whole organisation.",
      b: "It is meant for policies that must not be overridden locally.",
      c: "It is managed centrally rather than by an individual developer.",
      d: "It replaces the project CLAUDE.md.",
      e: "Each developer edits it to suit themselves.",
    },
    whyWrong: {
      d: "The levels complement each other: project rules remain necessary.",
      e: "That would be the user level, not corporate policy.",
    },
    explanation:
      "The corporate level exists precisely for rules that must not depend on what an individual developer wrote in their own file.",
  },
  "cc-2-q15": {
    scenario:
      "After a repository restructure, Claude Code started proposing approaches typical of the old architecture.",
    prompt: "What do you check?",
    choices: {
      a: "Whether CLAUDE.md was updated and whether it still describes a structure that no longer exists.",
      b: "Whether the model version changed.",
      c: "Whether the context window is large enough.",
      d: "Whether permissions broke.",
    },
    whyWrong: {
      b: "The behaviour changed after the restructure, not after a tool update.",
      c: "The problem is stale content, not volume.",
      d: "Permissions do not affect which architecture the model considers current.",
    },
    explanation:
      "Project memory is as much part of the code as anything else: after a restructure it must be updated in the same pull request, otherwise it starts misinforming.",
  },
  "cc-2-q16": {
    prompt: "Which style of writing rules in CLAUDE.md works best?",
    choices: {
      a: "Short, specific statements with a reason wherever it is not obvious.",
      b: "Long, expansive explanations with the history of decisions.",
      c: 'The most general principles, such as "write quality code".',
      d: "A list of prohibitions with no explanations.",
    },
    whyWrong: {
      b: "Decision history is valuable elsewhere; in memory it crowds out what is needed daily.",
      c: "General wishes change no behaviour: they carry no information.",
      d: "Without a reason, a ban is easily misread and formally circumvented.",
    },
    explanation:
      "A rule must be actionable: a specific requirement plus a reason wherever its absence would tempt someone to do otherwise.",
  },
  "cc-3-q6": {
    prompt: "Which rule correctly closes access to every secret file in a directory?",
    choices: {
      a: "`Read(./secrets/**)` — the recursive pattern covers nested directories.",
      b: "`Read(./secrets)` — pointing at the directory is enough.",
      c: "`Read(secrets)` — without a path prefix.",
      d: "`Bash(cat ./secrets/*)` — forbid reading through bash.",
    },
    whyWrong: {
      b: "Without a pattern the rule applies to that path itself, not to the files inside it.",
      c: "The rule loses its binding to the specific project directory.",
      d: "It closes one route among many: other reading tools remain.",
    },
    explanation:
      "A denial must cover the whole subdirectory and be independent of which tool does the reading. Otherwise workarounds appear.",
  },
  "cc-3-q7": {
    prompt: "What belongs in `settings.local.json` rather than in the shared `settings.json`?",
    choices: {
      a: "Personal permission relaxations agreed only for yourself.",
      b: "Paths to local tools on your machine.",
      c: "Experimental hooks you are only trying out.",
      d: "A ban on reading the project's secrets.",
      e: "Test commands used by CI.",
    },
    whyWrong: {
      d: "That rule is needed by the whole team — it belongs in the committed file.",
      e: "CI takes its configuration from the repository; it never sees the local file.",
    },
    explanation:
      "Personal stays local, shared goes in the repository. A security rule in a local file protects one machine and creates a false sense of safety.",
  },
  "cc-3-q8": {
    prompt: "The rule `Bash(git:*)` allows every git command. Why is that dangerous?",
    choices: {
      a: "It covers destructive operations such as `git reset --hard` and `git push --force`.",
      b: "Git commands run slowly.",
      c: "Git does not support patterns in permissions.",
      d: "The rule blocks work with remote repositories.",
    },
    whyWrong: {
      b: "Speed has nothing to do with the risk of a permission.",
      c: "Patterns work the same for any command.",
      d: "On the contrary — it allows them, which is the problem.",
    },
    explanation:
      "A broad rule is convenient right up until the first `--force`. It is safer to allow reads and local operations while leaving destructive ones on `ask` or `deny`.",
  },
  "cc-3-q9": {
    scenario:
      "A team wants to let the agent install dependencies, but only those already in the lock file, and to forbid adding new packages.",
    prompt: "How do you express that?",
    choices: {
      a: "Allow `npm ci` (installation strictly from the lock file) and do not allow `npm install <package>`.",
      b: "Allow `npm:*` and rely on pull-request review.",
      c: "Forbid all npm commands.",
      d: "Describe the constraint in CLAUDE.md.",
    },
    whyWrong: {
      b: "Review catches file changes, but the package is already installed in the environment during the run.",
      c: "Then the agent cannot perform even a legitimate dependency installation.",
      d: "A description is not a technical barrier and will not prevent the command from being called.",
    },
    explanation:
      "Different subcommands carry different risk. Permissions distinguish them precisely: deterministic install from the lock file yes, arbitrary packages no.",
  },
  "cc-3-q10": {
    prompt: "Why is the `ask` category needed when `allow` and `deny` exist?",
    choices: {
      a: "For actions that are occasionally needed but carry consequences: a human decides in the specific context.",
      b: "To log actions without blocking them.",
      c: "To slow the agent down.",
      d: "It is a legacy category kept for compatibility.",
    },
    whyWrong: {
      b: "Logging is what hooks are for; `ask` halts execution until an answer arrives.",
      c: "The delay is a side effect, not a purpose.",
      d: "It is actively used as the middle level of control.",
    },
    explanation:
      "The world does not divide into \"always allowed\" and \"never allowed\". `ask` covers the middle, where whether an action is appropriate depends on the situation.",
  },
  "cc-3-q11": {
    prompt: "Order the settings levels by priority, highest first.",
    choices: {
      a: "Managed enterprise settings",
      b: "Personal project settings (settings.local.json)",
      c: "Shared project settings (settings.json)",
      d: "User settings (~/.claude/settings.json)",
    },
    explanation:
      "Corporate policy overrides everything, then comes the local layer closest to the developer, then the shared project layer, and finally the user-wide one.",
  },
  "cc-3-q12": {
    prompt: "A developer added a rule to `allow`, but Claude Code still asks for confirmation. What do you check?",
    choices: {
      a: "Whether a broader `deny` or `ask` rule at a higher settings level overrides the permission.",
      b: "Whether CLAUDE.md has enough context.",
      c: "Whether the model is outdated.",
      d: "Whether hooks are enabled.",
    },
    whyWrong: {
      b: "Project memory plays no part in computing permissions.",
      c: "Permissions are computed by the harness, not the model.",
      d: "Hooks can block an action, but then you get a refusal rather than a confirmation prompt.",
    },
    explanation:
      "Rule conflicts are resolved by priority, and `deny` always wins. You have to check the whole hierarchy, not just the file you have edited.",
  },
  "cc-3-q13": {
    prompt: "Which permissions suit an agent that works only with documentation?",
    choices: {
      a: "Reading files in the documentation directory.",
      b: "Writing to that same documentation directory.",
      c: "Denying reads of configuration and secret directories.",
      d: "Executing arbitrary bash commands.",
      e: "Writing to the source-code directory.",
    },
    whyWrong: {
      d: "For text work these are excessive powers with a large risk surface.",
      e: "It exceeds the task: a documentation agent should not change code.",
    },
    explanation:
      "Permissions describe the task technically: read and write documentation, do not see secrets, do not touch code. That is least privilege expressed as configuration.",
  },
  "cc-3-q14": {
    scenario:
      "After adding a `deny` rule for an entire directory, the agent stopped performing even safe tasks: it cannot read the build configuration that lives in the same directory.",
    prompt: "How do you resolve the conflict?",
    choices: {
      a: "Narrow the denial to the specific sensitive files or subdirectory, leaving access to the rest.",
      b: "Remove the denial entirely.",
      c: "Change the rule from `deny` to `ask`.",
      d: "Copy the build configuration into another directory.",
    },
    whyWrong: {
      b: "That reintroduces the risk of access to sensitive data for the sake of convenience.",
      c: "For genuinely sensitive files a confirmation is weaker protection than a denial.",
      d: "Duplicating configuration creates two sources of truth and new mistakes.",
    },
    explanation:
      "An overly broad denial is as harmful as an overly broad permission: it forces people to find workarounds. Rules should be exactly as wide as needed.",
  },
  "cc-3-q15": {
    prompt: "Where do you set environment variables the agent needs to work with the project?",
    choices: {
      a: "In the project's `settings.json` — for non-secret values needed by the whole team.",
      b: "In CLAUDE.md as a text instruction.",
      c: "In a prompt at the start of every session.",
      d: "Hard-coded in the tools' source.",
    },
    whyWrong: {
      b: "Project memory does not set environment variables — that is harness configuration.",
      c: "A prompt has no effect on the environment of processes the agent launches.",
      d: "Hard-coding configuration makes changes and portability harder.",
    },
    explanation:
      "Environment variables are part of execution configuration, so they belong in `settings.json`. Secrets do not go there: they must come from external storage.",
  },
  "cc-3-q16": {
    prompt: "Why are permissions considered more reliable protection than prompt instructions?",
    choices: {
      a: "They are checked by the harness at call time and do not depend on how the model interpreted some text.",
      b: "The model cannot see permissions, so it cannot bypass them.",
      c: "Permissions are updated more often than prompts.",
      d: "Prompts only work in interactive mode.",
    },
    whyWrong: {
      b: "It is not about invisibility: even knowing the rule, the model cannot violate it.",
      c: "Update frequency has nothing to do with the reliability of the mechanism.",
      d: "Prompts apply in every mode — the point is that they are not a control.",
    },
    explanation:
      "The difference between a request and a mechanism: an instruction can be argued away, a permission check cannot. So anything critical is expressed as a permission.",
  },
  "cc-4-q6": {
    prompt: "Which event is right for adding context to every user request?",
    choices: {
      a: "`UserPromptSubmit` — it fires when the request is submitted, before the model processes it.",
      b: "`SessionStart` — at the beginning of the session.",
      c: "`PreToolUse` — before a tool call.",
      d: "`Stop` — after the response completes.",
    },
    whyWrong: {
      b: "It fires once; adding context to each individual request is not possible there.",
      c: "By that point the request is already processed and the model has chosen an action.",
      d: "That is the end of the turn: too late to add context.",
    },
    explanation:
      "`UserPromptSubmit` is the only point where you can affect every request before the model sees it: adding the current branch state, a ticket number or clipboard content.",
  },
  "cc-4-q7": {
    prompt: "A `PostToolUse` hook runs slowly — 15 seconds per edit. What do you do?",
    choices: {
      a: "Narrow the matcher and the check itself to the changed files, or move the heavy part into a separate stage.",
      b: "Remove the hook and check manually.",
      c: "Increase the hook timeout.",
      d: "Move the hook to `Stop`.",
    },
    whyWrong: {
      b: "That returns you to unguaranteed checks — exactly what the hook was saving you from.",
      c: "The delay does not go away: every edit still costs 15 seconds of waiting.",
      d: "Then the check stops being step-by-step and errors accumulate until the end of the work.",
    },
    explanation:
      "A hook runs synchronously and directly affects the pace of work. The check must be targeted: only what changed, and only what genuinely must happen immediately.",
  },
  "cc-4-q8": {
    prompt: "What does a hook script have available to make its decision?",
    choices: {
      a: "The name of the tool about to be called or just called.",
      b: "The call arguments — for example a file path or a command.",
      c: "The ability to return a message to the model through stderr when blocking.",
      d: "The full conversation context with the model.",
      e: "The ability to modify the model's response.",
    },
    whyWrong: {
      d: "A hook receives event data, not the dialogue history.",
      e: "Hooks operate around actions; they do not rewrite response text.",
    },
    explanation:
      "A hook is a reaction to an event and its data. That is enough for checks, auditing and blocking, but not enough to intervene in the model's reasoning itself.",
  },
  "cc-4-q9": {
    scenario:
      "A team wants the linter and quick tests to run automatically before every commit the agent makes, and a commit with errors to be rejected.",
    prompt: "What is the most reliable implementation?",
    choices: {
      a: "A `PreToolUse` hook on the commit command: it runs the checks and returns exit code 2 with an explanation if they fail.",
      b: "A request in CLAUDE.md to always run tests before committing.",
      c: "A `PostToolUse` hook after the commit.",
      d: "Forbid the agent from making commits.",
    },
    whyWrong: {
      b: 'A request is honoured "most of the time" — and that "most of the time" will one day let a broken commit through.',
      c: "The commit already exists: all that remains is rolling it back.",
      d: "That removes a useful capability instead of making it safe.",
    },
    explanation:
      "A textbook `PreToolUse` case: a check before the action plus exit code 2 with stderr explaining to the model exactly what failed — so it can fix it before retrying.",
  },
  "cc-4-q10": {
    prompt: "How is `SessionEnd` useful in team work?",
    choices: {
      a: "Cleanup and wrap-up: remove temporary files, save the session log, send a report.",
      b: "Blocking the agent's last action.",
      c: "Compressing the context before finishing.",
      d: "Resetting permissions to defaults.",
    },
    whyWrong: {
      b: "Blocking is only possible before execution — in `PreToolUse`.",
      c: "Compaction has its own event and its own purpose.",
      d: "Permissions come from configuration and are not reset by events.",
    },
    explanation:
      "Session start and end events are natural places for setup and cleanup. Anything that must happen exactly once per session belongs there.",
  },
  "cc-4-q11": {
    prompt: "Put the steps of a blocking hook in the correct order.",
    choices: {
      a: "The `PreToolUse` event passes the tool name and arguments to the script",
      b: "The script checks the arguments against its rules",
      c: "The script writes the reason for refusal to stderr and exits with code 2",
      d: "The tool call is cancelled and the model receives the explanation",
    },
    explanation:
      "The key part of this chain is the last step: the model sees the reason for refusal and can take a different route instead of blindly repeating the same action.",
  },
  "cc-4-q12": {
    prompt: "What happens if the hook script itself has a bug and exits with a non-zero code other than 2?",
    choices: {
      a: "It is a non-blocking error: the action proceeds and the broken hook goes unnoticed unless it is logged.",
      b: "The action is blocked just in case.",
      c: "The session ends with an error.",
      d: "The hook is disabled until restart.",
    },
    whyWrong: {
      b: "Only exit code 2 blocks; other codes do not stop execution.",
      c: "A hook error is not fatal to the session.",
      d: "There is no automatic disabling — it will fire again next time.",
    },
    explanation:
      "A broken hook silently stops protecting you. That is why scripts your safety depends on deserve their own checks and logging.",
  },
  "cc-4-q13": {
    prompt: "When is a hook the wrong tool?",
    choices: {
      a: "When a static `deny` rule in permissions is enough.",
      b: "When what is needed is knowledge for the model rather than an action.",
      c: "When CI already runs the check on every pull request and the delay is not critical.",
      d: "When a dynamic check depending on file content is needed.",
      e: "When an audit trail of all executed commands is needed.",
    },
    whyWrong: {
      d: "That is precisely a hook case: static rules cannot do it.",
      e: "Auditing is typical hook work and nothing else replaces it.",
    },
    explanation:
      "A hook is justified where logic is needed. If the task is expressible as a declarative rule, or is knowledge for the model, permissions or CLAUDE.md fit better.",
  },
  "cc-4-q14": {
    scenario:
      "A hook formats every saved file. Sometimes the agent re-reads the file afterwards and is surprised that the content differs from what it just wrote.",
    prompt: "How do you reduce the confusion?",
    choices: {
      a: "Report the fact of formatting in the hook's output, so the change does not look unexpected to the agent.",
      b: "Remove automatic formatting.",
      c: "Forbid the agent from re-reading files.",
      d: "Format only once per session.",
    },
    whyWrong: {
      b: "That sacrifices a guarantee to remove a minor inconvenience.",
      c: "Re-reading is normal practice for verifying a result.",
      d: "Then some files would stay unformatted and the guarantee would be gone.",
    },
    explanation:
      "A hook's side effects should be visible. When the agent knows a formatter changed the file, it does not spend steps investigating a \"mysterious\" difference.",
  },
  "cc-4-q15": {
    prompt: "Why does a hook need a matcher if the script can check everything itself?",
    choices: {
      a: "A matcher filters out irrelevant events before the process starts — faster, and easier to read in the configuration.",
      b: "Without a matcher the hook never fires.",
      c: "A matcher lets you block an action without exit code 2.",
      d: "A matcher replaces argument checking.",
    },
    whyWrong: {
      b: "A hook without a matcher fires on all matching events.",
      c: "Blocking is determined by the exit code, not by the matcher.",
      d: "It filters by tool, not by argument content.",
    },
    explanation:
      "A matcher makes the configuration self-documenting: you can see what the hook reacts to, and no extra processes launch on every event.",
  },
  "cc-4-q16": {
    prompt: "A team wants hooks to behave identically for every developer and in CI. Where should they be defined?",
    choices: {
      a: "In a committed `.claude/settings.json` together with scripts stored in the repository.",
      b: "In each developer's `settings.local.json`.",
      c: "In user settings at `~/.claude/settings.json`.",
      d: "In CLAUDE.md as a description of the desired behaviour.",
    },
    whyWrong: {
      b: "Local files are not committed: CI will not see them and behaviour will diverge between people.",
      c: "That is a personal level, invisible to colleagues and to the pipeline.",
      d: "Project memory does not execute scripts.",
    },
    explanation:
      "Hooks are part of the project configuration. Together with scripts in the repository they give identical behaviour on any machine and in the pipeline.",
  },
  "cc-5-q6": {
    prompt: "What does the `@path/to/file` syntax do inside a slash command?",
    choices: {
      a: "It substitutes the file's contents into the command's prompt.",
      b: "It creates a link the model can open later.",
      c: "It sends the file as an attachment to the API.",
      d: "It checks the file exists before execution.",
    },
    whyWrong: {
      b: "It is not a deferred link: the content enters the prompt immediately.",
      c: "There are no attachments here — it is a text substitution.",
      d: "The syntax performs no such checks.",
    },
    explanation:
      "Combining `$ARGUMENTS` and `@path` gives templates that work with any input: the user names a file and the command pulls in its contents.",
  },
  "cc-5-q7": {
    prompt: "What is worth putting in a slash command's frontmatter?",
    choices: {
      a: "`description` — so the command is understandable in the list.",
      b: "`argument-hint` — which arguments it expects.",
      c: "Tool restrictions, if the command is meant to be read-only.",
      d: "The full text of the expected answer.",
      e: "The name of the user who created the command.",
    },
    whyWrong: {
      d: "The answer is generated by the model; the file describes the task, not the result.",
      e: "Authorship is kept by git, not by frontmatter.",
    },
    explanation:
      "Frontmatter describes how to invoke the command and within what boundaries it works. It is like a function signature: short, precise and useful at the call site.",
  },
  "cc-5-q8": {
    prompt: "A skill does not fire when it should. What do you check first?",
    choices: {
      a: "The description in the frontmatter: it is what the model uses to decide whether the skill fits the current task.",
      b: "The size of the SKILL.md file.",
      c: "Whether the text contains code examples.",
      d: "File permissions on the skills directory.",
    },
    whyWrong: {
      b: "Length has no effect on relevance matching.",
      c: "Examples help during execution, but the trigger is the description.",
      d: "File permissions are rarely the cause: the skill simply did not match by description.",
    },
    explanation:
      'A skill\'s description is its trigger. Vague phrasing such as "helps with code" matches nothing specific, which is why the skill stays unused.',
  },
  "cc-5-q9": {
    scenario:
      "A team has a complex incident-analysis procedure: gathering logs, correlating them, building a timeline. It runs infrequently but always under stress.",
    prompt: "What is better to create?",
    choices: {
      a: "A slash command with the step-by-step procedure: during an incident you need a predictable launch, not the model's guesswork.",
      b: "A skill, so the model recognises an incident itself.",
      c: "A section in CLAUDE.md.",
      d: "A subagent with the procedure in its prompt.",
    },
    whyWrong: {
      b: "During an incident it is unacceptable to depend on whether the model recognises the situation correctly.",
      c: "The procedure would enter the context of every session, but you could not launch it with one action.",
      d: "The invocation would stay implicit, and an isolated context is not needed here.",
    },
    explanation:
      "The higher the cost of a mistake at execution time, the more important an explicit deterministic launch. Incidents are exactly where a command beats a skill.",
  },
  "cc-5-q10": {
    prompt: "What is the benefit of restricting the tool set in a subagent definition?",
    choices: {
      a: "The subagent cannot step outside its task — a research one, for instance, will not start editing files.",
      b: "It makes its response twice as fast.",
      c: "It lets it see the main agent's context.",
      d: "Without a restriction the subagent will not start.",
    },
    whyWrong: {
      b: "A speed-up is neither guaranteed nor the point of the restriction.",
      c: "Context isolation does not depend on the tool set.",
      d: "It will start: the default set is perfectly workable.",
    },
    explanation:
      "A narrow task means narrow powers. That both reduces the risk of side changes and makes the subagent's behaviour more predictable.",
  },
  "cc-5-q11": {
    prompt: "Put the steps of creating a useful slash command in order.",
    choices: {
      a: "Describe the task the command should solve the same way every time",
      b: "Write the step-by-step procedure into a markdown file",
      c: "Add frontmatter: a description and an argument hint",
      d: "Commit the file to `.claude/commands/` so the command becomes shared",
    },
    explanation:
      "A command is valuable when it captures a repeatable procedure. The last step makes it the team's asset rather than one person's.",
  },
  "cc-5-q12": {
    prompt: "How does an Agent Skill differ from an ordinary section in CLAUDE.md?",
    choices: {
      a: "A skill loads only when relevant and can bundle supporting files; CLAUDE.md content enters the context every time.",
      b: "A skill has higher priority than project memory.",
      c: "CLAUDE.md cannot contain instructions.",
      d: "A skill works only in headless mode.",
    },
    whyWrong: {
      b: "There is no priority between them — they are different mechanisms for delivering knowledge.",
      c: "It can, and that is exactly what it exists for.",
      d: "Skills are available in ordinary interactive sessions.",
    },
    explanation:
      "A skill's main advantage is selectivity: heavy instructions do not occupy context every time, they arrive when the task actually reaches them.",
  },
  "cc-5-q13": {
    prompt: "What makes a subagent definition good?",
    choices: {
      a: "A specific `description` that makes clear when to delegate.",
      b: "A system prompt with a clear result contract.",
      c: "A tool set sufficient for the task and no wider.",
      d: "The broadest possible wording, so the subagent fits everywhere.",
      e: "A requirement to return the full work log.",
    },
    whyWrong: {
      d: "A universal subagent either never gets invoked or gets invoked inappropriately.",
      e: "That contradicts the contract: what goes out should be a concise result.",
    },
    explanation:
      "A subagent is three things: when to call it, what it must return and what it is allowed to do. Vagueness in any of them makes it useless.",
  },
  "cc-5-q14": {
    scenario:
      "A developer created a refactoring slash command, but colleagues do not use it: they say they cannot remember which arguments it expects.",
    prompt: "What do you fix?",
    choices: {
      a: "Add an `argument-hint` and a clear `description`, and handle the no-arguments case in the command body.",
      b: "Write documentation in the README.",
      c: "Turn the command into a skill.",
      d: "Send instructions to the team chat.",
    },
    whyWrong: {
      b: "The hint is needed at the call site, not in a separate file you also have to remember.",
      c: "Then the launch becomes implicit while the confusing-arguments problem remains.",
      d: "A chat message is forgotten faster than the need for the command arises.",
    },
    explanation:
      "An interface should explain itself in place. `argument-hint` and the description are what a person sees at the moment of invocation, without a trip to the docs.",
  },
  "cc-5-q15": {
    prompt: "A slash command runs bash and substitutes its output into the prompt. Why is that useful?",
    choices: {
      a: "It gives the model current state — such as the diff or the list of changed files — without a separate step.",
      b: "It lets the task be completed without the model.",
      c: "It bypasses permission restrictions.",
      d: "It speeds up the model's response.",
    },
    whyWrong: {
      b: "If a script solved the task entirely, the command would not need the model at all.",
      c: "Permissions apply here too: a command is not a way around them.",
      d: "Substitution adds input tokens; it does not speed up generation.",
    },
    explanation:
      "It saves a step: instead of the model calling a tool and waiting for the result, the data it needs is already in the prompt when work begins.",
  },
  "cc-5-q16": {
    prompt: 'A project has both a `/review` command and a skill described as "code review". Why is that a problem?',
    choices: {
      a: "Duplicated logic: two sources of truth drift apart, and behaviour depends on which path fired.",
      b: "It is technically impossible to have a command and a skill on a similar topic.",
      c: "A skill always overrides a command.",
      d: "It doubles the cost of every request.",
    },
    whyWrong: {
      b: "It is technically possible — the problem is organisational, not technical.",
      c: "They are invoked differently and do not override one another.",
      d: "Cost only grows if both are genuinely engaged, which is rare.",
    },
    explanation:
      "Pick one: an explicit launch by command or an automatic skill. Two implementations of one procedure inevitably diverge, and the team stops knowing which one ran.",
  },
  "cc-b-q6": {
    scenario:
      "A pipeline runs Claude Code to update the changelog. Sometimes the job hangs until the runner's 60-minute timeout and the team pays for the idle time.",
    prompt: "What do you add?",
    choices: {
      a: "A turn limit and your own step timeout, shorter than the runner's, with a clear failure status.",
      b: "Increase the runner timeout.",
      c: "Automatically restart the job on timeout.",
      d: "Run the job less often.",
    },
    whyWrong: {
      b: "That extends the idle time rather than removing its cause.",
      c: "A restart repeats the same hang and doubles the cost.",
      d: "The hang remains, it just happens less often.",
    },
    explanation:
      "In automation every boundary should be your own and tighter than the external ones. Then a failure looks like a clear error rather than silent idling until the infrastructure gives up.",
  },
  "cc-b-q7": {
    prompt: "Why use `--output-format json` in CI rather than plain text?",
    choices: {
      a: "Subsequent pipeline steps receive a structure they can check, instead of parsing text with regexes.",
      b: "JSON reduces the cost of the request.",
      c: "Permissions only work in that mode.",
      d: "Text output is not supported in headless mode.",
    },
    whyWrong: {
      b: "Output format does not affect the model's token count.",
      c: "Permissions apply regardless of output format.",
      d: "It is supported — it is simply awkward for machine processing.",
    },
    explanation:
      "A pipeline is a program. Parsing free text with regexes breaks on the first change of wording, while structured output stays a contract.",
  },
  "cc-b-q8": {
    prompt: "What risks come with running an agent in CI on fork pull requests?",
    choices: {
      a: "The PR code may contain injections aimed at the agent.",
      b: "Project scripts from the fork may execute during build or tests.",
      c: "Runner secrets may end up in output or be sent outward.",
      d: "The model may refuse to work with someone else's code.",
      e: "Fork PRs cannot be checked automatically.",
    },
    whyWrong: {
      d: "A refusal is not a security risk and happens rarely.",
      e: "They can be — the only question is with what privileges.",
    },
    explanation:
      "A fork PR is untrusted code and untrusted data at once. That is why the agent gets read-only access and secrets are removed from such jobs entirely.",
  },
  "cc-b-q9": {
    scenario:
      "The automatic review job produces useful comments, but there are 40 per pull request and developers have stopped reading them.",
    prompt: "What do you change?",
    choices: {
      a: "Limit the output to the most important findings with an explicit significance criterion, and do not publish the rest.",
      b: "Publish all comments but collapsed.",
      c: "Run the review less often.",
      d: "Raise `effort` so the comments get better.",
    },
    whyWrong: {
      b: "The volume remains; nobody expands collapsed comments.",
      c: "Then some pull requests would go unreviewed entirely.",
      d: "Deeper comments do not solve a quantity problem.",
    },
    explanation:
      "Automated review competes for human attention. Forty remarks read as noise; five substantive ones read as help. The significance criterion must be explicit in the prompt.",
  },
  "cc-b-q10": {
    prompt: "How do you safely give an agent in CI access to a private repository?",
    choices: {
      a: "Through a minimally scoped token stored in CI secrets and not directly reachable by the agent's tools.",
      b: "Write the token into `.claude/settings.json`.",
      c: "Pass the token in the prompt at the start of the session.",
      d: "Give the agent access to the password manager.",
    },
    whyWrong: {
      b: "That file is committed to the repository — the secret becomes public to everyone with code access.",
      c: "The secret would land in the context, the logs and potentially in the model's output.",
      d: "That widens access to every secret instead of the one needed.",
    },
    explanation:
      "The secret must be available to the process, not to the model. Anything that enters the context can be reproduced in output — so tokens do not go there.",
  },
  "cc-b-q11": {
    prompt: "Put the steps of configuring a safe Claude Code job in order.",
    choices: {
      a: "Determine the minimal tool set the task requires",
      b: "Write them into an explicit launch allowlist",
      c: "Set limits on turns, time and budget",
      d: "Configure structured output and a check of it in the next step",
    },
    explanation:
      "The order reflects the logic: first what is allowed, then how much is allowed, and only then how to verify the result. Skipping the first step makes the rest decorative.",
  },
  "cc-b-q12": {
    prompt: "An agent job occasionally fails because of temporary API unavailability. What is the right response?",
    choices: {
      a: "A pipeline-level retry with a limited number of attempts — and only for errors that are genuinely transient.",
      b: "Retry any job failure.",
      c: "Ignore failures and treat the job as successful.",
      d: "Increase the turn limit.",
    },
    whyWrong: {
      b: "An error in the task itself will repeat identically, only costing more money and time.",
      c: "That hides real problems and makes the check decorative.",
      d: "The number of turns has nothing to do with an external service's availability.",
    },
    explanation:
      "The same principle as inside the agent loop: retry only what has a chance of succeeding on the second attempt. Blanket retries mask genuine defects.",
  },
  "cc-b-q13": {
    scenario:
      "A team wants the CI agent to be able to open pull requests but never to merge anything into the main branch.",
    prompt: "How do you ensure that?",
    choices: {
      a: "A token allowed to create branches and PRs but not to merge, plus branch protection on the repository side.",
      b: "A rule in CLAUDE.md not to merge branches.",
      c: "Denying the `git merge` command in permissions.",
      d: "Manual review of every run.",
    },
    whyWrong: {
      b: "A text rule is not an access-rights restriction.",
      c: "A merge can also be performed through the repository API — banning one command does not close the hole.",
      d: "That removes the automation and relies on human attention.",
    },
    explanation:
      "Authority boundaries are set where they are enforced — in token scopes and branch-protection settings. Neither a prompt nor a different command choice gets around them.",
  },
  "cc-b-q14": {
    prompt: "What should be logged from every agent run in CI?",
    choices: {
      a: "The tools executed with their arguments, token usage and the reason for finishing.",
      b: "The full text of all messages, secrets included.",
      c: "Only the job's final status.",
      d: "Nothing: logs are unnecessary in CI.",
    },
    whyWrong: {
      b: "Logs containing secrets are a security incident, not observability.",
      c: "A status cannot tell you what went wrong or what it cost.",
      d: "Without logs, every failure has to be reproduced by hand.",
    },
    explanation:
      "Three signals give the full picture without excess: what the agent did, what it cost and why it stopped. Personal data and secrets stay out of the logs.",
  },
  "cc-b-q15": {
    prompt: "Why should a CI prompt usually be more detailed than one for an interactive session?",
    choices: {
      a: "There is no human to clarify the task mid-run — everything the agent needs must be given up front.",
      b: "The model performs worse in CI.",
      c: "A detailed prompt lowers the cost.",
      d: "CLAUDE.md and permissions do not work in CI.",
    },
    whyWrong: {
      b: "The model is the same; the difference is the absence of feedback.",
      c: "It rather raises it, but improves the odds of a correct result first time.",
      d: "They work exactly as they do locally.",
    },
    explanation:
      "An interactive session forgives an incomplete statement: a human is right there. In automation, every ambiguity either produces a wrong result or burns turns on guesswork.",
  },
};
