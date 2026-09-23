import type { QuestionEn } from "@/lib/content/types";

/** Англійський дубль додаткового пулу. */
export const questionsMoreEn: Record<string, QuestionEn> = {
  // ── dc-1: First day in Claude Code (extra pool) ─────────────────────────
  "dc-1-q8": {
    prompt: "Which built-in command shows what exactly is taking up the current session's context window?",
    choices: {
      a: "`/context`",
      b: "`/memory`",
      c: "`/init`",
      d: "`/permissions`",
    },
    whyWrong: {
      b: "`/memory` opens memory files for editing; it doesn't show context usage.",
      c: "`/init` creates a draft CLAUDE.md; it says nothing about the state of the context.",
      d: "`/permissions` manages tool permission rules.",
    },
    explanation:
      "`/context` shows how the context is split: system part, memory, tools, messages. It helps you decide when it's time for `/clear` or `/compact`.",
  },
  "dc-1-q9": {
    prompt: "You notice Claude has, for the second time, run the tests with the wrong command. What's the quickest lasting fix from within the session?",
    choices: {
      a: "Remind it of the right command in every prompt.",
      b: "Rename the npm script so the wrong command stops working.",
      c: "Add the command to the `permissions.allow` settings.",
      d: "Open `/memory` and add the correct test command to CLAUDE.md.",
    },
    whyWrong: {
      a: "A reminder lives only in the current conversation and disappears after `/clear` or in a new session.",
      b: "Breaking working scripts for the agent's sake is an expensive workaround; giving the right instruction is simpler.",
      c: "A permission decides whether a command may run, not which command to use for tests.",
    },
    explanation:
      "A recurring mistake signals missing knowledge in project memory. An entry in CLAUDE.md applies in every future session for the whole team.",
  },
  "dc-1-q10": {
    scenario:
      "You've just finished and committed a bug fix in the payments module. Now, in the same session, you start an unrelated feature in the profile module, and Claude keeps bringing up payment details and proposing unnecessary edits.",
    prompt: "What should you do?",
    choices: {
      a: "Carry on: more context is always better for quality.",
      b: "Keep writing \"forget about payments\".",
      c: "Run `/clear` and start the feature with a clean context: CLAUDE.md will be loaded again, and the changes are already in git.",
      d: "Reinstall Claude Code to reset its memory.",
    },
    whyWrong: {
      a: "Irrelevant context distracts and costs tokens on every request.",
      b: "Asking doesn't remove history from the context; it keeps influencing replies.",
      d: "The problem is the current conversation's history, not the installation; `/clear` fixes it instantly.",
    },
    explanation:
      "Reset the context between unrelated tasks. Everything needed long-term lives in CLAUDE.md and git, so `/clear` loses nothing of value.",
  },
  "dc-1-q11": {
    prompt: "Which prompt is most likely to get the desired result on the first try?",
    choices: {
      a: "\"Add tests for `foo.py`.\"",
      b: "\"Make the code better.\"",
      c: "\"Look at the project and do whatever you think is needed.\"",
      d: "\"Write a test for `foo.py` covering the case where the user is logged out; don't use mocks.\"",
    },
    whyWrong: {
      a: "Without saying what to check, Claude will guess the scenarios, and they may not match yours.",
      b: "\"Better\" could mean anything: faster, shorter, safer. The result is unpredictable.",
      c: "No goal is set, so there's no definition of done.",
    },
    explanation:
      "A specific prompt names the file, the scenario and the constraints. The less Claude has to guess, the less often you need to correct course.",
  },
  "dc-1-q12": {
    prompt: "What happens with this invocation?",
    choices: {
      a: "The log content goes to stdin as context for a one-shot non-interactive query; Claude prints the answer and exits.",
      b: "An interactive session opens with the log in the first message.",
      c: "The log is ignored, since `-p` accepts only the quoted text.",
      d: "Claude writes fixes to files without any permissions.",
    },
    whyWrong: {
      b: "`-p` means print mode: a single query without an interactive session.",
      c: "Stdin data is added to the prompt; that's exactly what makes log analysis convenient.",
      d: "Headless mode doesn't waive permissions; without allowed tools no editing happens.",
    },
    explanation:
      "Piping into `claude -p` turns Claude into an ordinary Unix utility: input from stdin, answer on stdout. That's how it gets embedded in scripts and pipelines.",
  },
  "dc-1-q13": {
    prompt: "Which statements about how Claude Code \"sees\" a repository are correct?",
    choices: {
      a: "At startup it builds a vector index of the entire repository.",
      b: "Files outside the working directory are completely inaccessible, no exceptions.",
      c: "It reads files on demand using search and read tools.",
      d: "CLAUDE.md from the working directory is loaded automatically at session start.",
    },
    whyWrong: {
      a: "There's no index: Claude searches and reads files with tools such as Grep, Glob and Read when it needs them.",
      b: "Additional directories can be attached with `/add-dir` or `--add-dir`.",
    },
    explanation:
      "Only memory enters the context automatically. Claude explores the rest itself, like a developer new to the project, so good names and a concise CLAUDE.md save it steps.",
  },
  "dc-1-q14": {
    prompt: "The task touches your repository and a sibling library in `../shared-lib`. How do you give Claude access to both in the current session?",
    choices: {
      a: "Copy `shared-lib` into the current repository.",
      b: "Restart `claude` from the parent directory of both projects.",
      c: "Create a symlink in `node_modules`.",
      d: "Run `/add-dir ../shared-lib`.",
    },
    whyWrong: {
      a: "The copy will drift from the original, and edits will have to be carried over by hand.",
      b: "It would work, but you'd lose the current session and the project CLAUDE.md as the main memory.",
      c: "That's a package-manager mechanism, not a way to grant the agent access.",
    },
    explanation:
      "`/add-dir` (or `--add-dir` at launch) extends the session's set of working directories. The current project remains the primary one.",
  },
  "dc-1-q15": {
    prompt: "After a Node.js upgrade Claude Code behaves oddly: it won't update and complains about its installation. What do you run first?",
    choices: {
      a: "`/clear`",
      b: "`/doctor`, to check the health of the installation and settings.",
      c: "`/init`",
      d: "`/compact`",
    },
    whyWrong: {
      a: "`/clear` clears the conversation context and has nothing to do with the installation.",
      c: "`/init` generates CLAUDE.md; it doesn't diagnose installation problems.",
      d: "`/compact` compresses conversation history; the installation won't change.",
    },
    explanation:
      "`/doctor` diagnoses the installation: install type, version, auto-update and configuration problems. Diagnose first, then fix.",
  },
  "dc-1-q16": {
    scenario:
      "At mobile screen width a product card is misaligned: the price overlaps the button. The problem is hard to describe in words, and the component is large.",
    prompt: "How is it best to hand this task to Claude Code?",
    choices: {
      a: "Paste a screenshot of the problem, point to the component file with `@`, and ask it to compare with a new screenshot after the fix.",
      b: "Write \"the card is broken on phones, fix it\".",
      c: "Ask it to rewrite the component from scratch with CSS Grid.",
      d: "Paste the project's entire CSS into the prompt.",
    },
    whyWrong: {
      b: "Without an image or a file, Claude has to guess both what's broken and where.",
      c: "A disproportionate change with a risk of new regressions; the specific cause must be understood first.",
      d: "Excess context without the key piece — what the problem looks like.",
    },
    explanation:
      "For UI, an image is the most precise specification. A \"screenshot → fix → new screenshot\" loop gives Claude feedback that text can't.",
  },

  // ── dc-2: Plan mode and iteration (extra pool) ──────────────────────────
  "dc-2-q8": {
    prompt: "What does pressing Esc twice do in an interactive session?",
    choices: {
      a: "Immediately ends the session without saving.",
      b: "Turns on plan mode.",
      c: "Lets you go back to one of the previous messages to change the prompt and take a different path.",
      d: "Clears the context, like `/clear`.",
    },
    whyWrong: {
      a: "Exiting the session is a different action; double Esc leads to the message history.",
      b: "Modes are switched with Shift+Tab.",
      d: "The context isn't wiped completely: you return to the chosen point in the conversation.",
    },
    explanation:
      "Double Esc opens a jump back through the conversation: you can edit an earlier prompt and try another approach without dragging the wrong branch along.",
  },
  "dc-2-q9": {
    prompt: "Which limitation of Claude Code checkpoints is important to remember?",
    choices: {
      a: "They are kept for only 10 minutes.",
      b: "They only work in plan mode.",
      c: "They replace git, so there's no need to commit during a session.",
      d: "Changes made by bash commands (`rm`, `mv`, migration scripts) are not tracked by checkpoints.",
    },
    whyWrong: {
      a: "That's a made-up limit; the key boundary is a different one — what gets tracked.",
      b: "Plan mode makes no edits, so there's nothing to revert; checkpoints exist precisely for edits.",
      c: "Checkpoints are local to the session and don't replace the version history the team shares.",
    },
    explanation:
      "Checkpoints capture edits made with the file-editing tools. Actions via the shell stay outside them, so git is still needed as a reliable safety net.",
  },
  "dc-2-q10": {
    scenario:
      "Over the last few prompts Claude implemented the wrong approach and changed 5 files. The working tree also contains your own uncommitted edits that must be kept.",
    prompt: "What's the cleanest way to revert only Claude's changes?",
    choices: {
      a: "Use `/rewind` to restore the code (and, if needed, the conversation) to the checkpoint before the wrong approach.",
      b: "`git checkout .` or `git reset --hard`.",
      c: "Delete the 5 files and ask Claude to write them again.",
      d: "Open a new session: the old changes will be reverted automatically.",
    },
    whyWrong: {
      b: "These commands will wipe your uncommitted edits too, not just Claude's changes.",
      c: "The files existed before the session; deleting them destroys their previous content as well.",
      d: "Closing a session reverts nothing; the files on disk stay modified.",
    },
    explanation:
      "Checkpoints track Claude's own edits within the session, so reverting with `/rewind` doesn't touch your manual changes. This mechanism doesn't cover changes made via bash.",
  },
  "dc-2-q11": {
    prompt: "What does auto-accept edits mode (`acceptEdits`), reachable via Shift+Tab, change?",
    choices: {
      a: "It allows everything without exception, including any shell commands.",
      b: "File edits are applied without confirming each one; other actions remain subject to permission rules.",
      c: "It disables edits until a plan is approved.",
      d: "It commits every edit automatically.",
    },
    whyWrong: {
      a: "That's the behaviour of `bypassPermissions`; `acceptEdits` concerns file edits.",
      c: "That describes plan mode, not auto-accept.",
      d: "Commits are a separate action; the mode only concerns edit confirmations.",
    },
    explanation:
      "`acceptEdits` is handy when the plan is agreed and you'll review the final diff. Commands other than file edits are still governed by permissions.",
  },
  "dc-2-q12": {
    prompt: "Which practices help during the exploration phase before planning?",
    choices: {
      a: "State directly: \"read the relevant files, but don't write code yet\".",
      b: "Ask it to read the whole repository so nothing is missed.",
      c: "Skip exploration: Claude already knows the popular frameworks.",
      d: "Delegate specific questions to subagents so only a summary comes back to the main context.",
      e: "Name the specific files or directories to start from.",
    },
    whyWrong: {
      b: "Reading everything floods the context with noise; exploration should be targeted.",
      c: "Knowing the framework doesn't replace knowing your code, its conventions and workarounds.",
    },
    explanation:
      "Exploration should produce a map, not a dump. An entry point, a ban on premature code and subagents for side questions keep the main context clean until planning.",
  },
  "dc-2-q13": {
    prompt: "At step three of the implementation it becomes clear the plan rested on a wrong assumption about an API. What's the right thing to do?",
    choices: {
      a: "Continue with the plan and fix the mismatches at the end.",
      b: "Ask Claude to \"just make it work\".",
      c: "Stop work with Esc and discuss the new facts.",
      d: "Update the plan file to reflect the new assumption, and only then continue.",
    },
    whyWrong: {
      a: "Every subsequent step builds on a wrong foundation; there will be more to fix at the end.",
      b: "Without an updated goal Claude will patch symptoms, and the plan will drift even further from reality.",
    },
    explanation:
      "A plan is a working document, not a contract. When the facts change, update the plan first so the next steps rest on reality; revert the wrong edits if needed.",
  },
  "dc-2-q14": {
    prompt: "Why ask Claude to ask clarifying questions before drawing up a plan?",
    choices: {
      a: "So Claude spends longer in plan mode and uses fewer tokens.",
      b: "Plan mode can't finish without questions.",
      c: "To shift responsibility for decisions onto Claude.",
      d: "To surface ambiguities (edge cases, constraints, priorities) before any code is written, while they're still cheap to resolve.",
    },
    whyWrong: {
      a: "The goal isn't saving work time, it's the quality of the task definition.",
      b: "A plan can be made without questions; asking them is your deliberate choice for a complex task.",
      c: "The opposite: questions return decisions to the human where they're not obvious.",
    },
    explanation:
      "An ambiguity resolved in conversation costs one message. The same ambiguity discovered in finished code costs a rework.",
  },
  "dc-2-q15": {
    prompt: "After a config update the linter reports 180 errors across different files. How do you organise the work with Claude?",
    choices: {
      a: "Ask it to write all the errors as a checklist in a markdown file and fix them item by item, ticking off what's done.",
      b: "Ask it to fix everything in a single prompt.",
      c: "Turn off the new linter rules.",
      d: "Fix only the errors Claude finds itself without running the linter.",
    },
    whyWrong: {
      b: "Without a progress tracker some errors get lost, and after compaction it's unclear what's been done.",
      c: "That's abandoning the task, not doing it.",
      d: "The linter output is an exact list; guessing will miss some errors.",
    },
    explanation:
      "For large repetitive tasks an external checklist works as memory and as a completion criterion. Both you and Claude can see it, and it survives any loss of context.",
  },
  "dc-2-q16": {
    scenario:
      "Claude proposed a plan for adding a filter to the orders list. The plan is mostly good, but item 4 — \"while we're at it, rewrite the pagination module to use cursors\" — is something you never asked for.",
    prompt: "What do you do before approving?",
    choices: {
      a: "Approve as is: an extra refactor won't hurt.",
      b: "Reject the whole plan and start over.",
      c: "Ask it to remove item 4 from the plan and keep the scope to the filter.",
      d: "Approve, then revert the pagination changes by hand.",
    },
    whyWrong: {
      a: "Expanded scope increases the diff, the risk of regressions and review time, without anyone asking for it.",
      b: "The rest of the plan is useful; removing the extra item is enough.",
      d: "Fixing afterwards costs more than adjusting the plan before implementation.",
    },
    explanation:
      "Reviewing the plan is the cheapest moment to control the scope of changes. Extra items are removed before implementation, not from the diff.",
  },

  // ── dc-3: Git, commits and PRs (extra pool) ─────────────────────────────
  "dc-3-q8": {
    prompt: "You ask Claude: \"Why is `retryPolicy` limited to three attempts here?\" There are no comments in the code. What will help find the answer?",
    choices: {
      a: "Nothing: without comments the reason can't be established.",
      b: "Ask Claude to guess the most likely reason.",
      c: "Read the retry library's entire documentation.",
      d: "Ask Claude to investigate the history with `git log -S`/`git blame` and the related PRs.",
    },
    whyWrong: {
      a: "Change history often preserves the reason: commit messages, PRs, linked issues.",
      b: "A guess sounds convincing but isn't a fact; the data is in the history.",
      c: "Documentation explains the mechanism, not your team's decision.",
    },
    explanation:
      "Claude is good with git history: it finds the commit that introduced the line and reads its message and PR. That way the answer rests on facts, not on a plausible story.",
  },
  "dc-3-q9": {
    prompt: "The team wants Claude to run `git status` and `git diff` freely, but always ask before `git push`. Which configuration expresses this?",
    choices: {
      a: "None: git permissions can't be configured separately from the rest of bash.",
      b: "You need `deny` for `git push`; `ask` doesn't work here.",
      c: "This one exactly: `allow` for the read-only commands and `ask` for push.",
      d: "Allow `Bash(git:*)` and control pushing with an instruction in CLAUDE.md.",
    },
    whyWrong: {
      a: "`Bash(...)` rules let you specify particular commands and prefixes.",
      b: "`deny` would forbid pushing entirely, whereas the goal is confirmation — which is what `ask` is for.",
      d: "A broad permission lets push through too, and an instruction isn't a technical boundary.",
    },
    explanation:
      "Read-only git commands are safe and frequent, so they're allowed. Actions that reach beyond the local machine, like pushing, stay behind a confirmation.",
  },
  "dc-3-q10": {
    prompt: "After rebasing a shared branch, Claude proposes `git push --force`. What's safer?",
    choices: {
      a: "`git push --force-with-lease`, and for shared branches, agree on rewriting history with the team.",
      b: "`git push --force`: a rebase requires overwriting anyway.",
      c: "Delete the remote branch and push again.",
      d: "Merge on top of the rebase to avoid forcing.",
    },
    whyWrong: {
      b: "`--force` silently wipes other people's commits pushed after your last fetch.",
      c: "The same risk of losing others' commits, plus broken PR references.",
      d: "Merging on top of rewritten history duplicates commits and tangles the graph.",
    },
    explanation:
      "`--force-with-lease` refuses the push if the remote branch has changed since your fetch. For shared branches, rewriting history is a team decision, not the agent's.",
  },
  "dc-3-q11": {
    prompt: "Which commit message is best for a change that fixes double charging on a repeated request?",
    choices: {
      a: "\"Updated payment.ts, idempotency.ts, payment.test.ts\"",
      b: "\"fix(payments): don't charge twice on request retry — check idempotency key\"",
      c: "\"fix\"",
      d: "\"Changes from Claude\"",
    },
    whyWrong: {
      a: "The file list is visible in the diff anyway; the message should explain the substance.",
      c: "It explains nothing: a year from now nobody will understand what changed and why.",
      d: "The author of the change is no substitute for a description; and responsibility for the commit still lies with a human.",
    },
    explanation:
      "The message explains what changed in terms of behaviour, and why. Files are visible in the diff; intent is visible only in the message.",
  },
  "dc-3-q12": {
    prompt: "A reviewer left ten comments on your PR #248. What's the simplest way to have Claude Code address them?",
    choices: {
      a: "Copy each comment into the chat by hand.",
      b: "Wait for the reviewer to make the edits.",
      c: "Close the PR and open a new one with the fixed code.",
      d: "Ask Claude to read the comments on PR #248 via `gh`, fix the code and push to the same branch.",
    },
    whyWrong: {
      a: "It works, but it's slow and loses the link to specific code lines.",
      b: "That's offloading the work, not addressing the review.",
      c: "The discussion history is lost; the reviewer has to look at everything again.",
    },
    explanation:
      "With `gh`, Claude sees the comments together with the PR context. Pushing fixes to the same branch keeps the discussion, and the reviewer sees only the new changes.",
  },
  "dc-3-q13": {
    prompt: "Which git tasks are appropriate to delegate to Claude Code?",
    choices: {
      a: "Writing commit messages from the diff.",
      b: "Resolving rebase conflicts, followed by a test run.",
      c: "Rewriting `main` history on its own to remove \"unnecessary\" commits.",
      d: "Searching history for which changes went into a given release.",
      e: "Deciding whether to merge a PR instead of the reviewer.",
    },
    whyWrong: {
      c: "Rewriting shared history breaks things for everyone building on it; that's not the agent's decision.",
      e: "Review is human control over changes; the agent can help with it but not replace it.",
    },
    explanation:
      "Routine and analytical git work suits an agent well. Irreversible actions on shared history and decisions to accept changes stay with people.",
  },
  "dc-3-q14": {
    scenario:
      "You asked for one function to be fixed. Besides 12 changed lines, the diff contains 30 more files of reformatting: Claude ran the formatter over the whole project.",
    prompt: "How do you prepare the PR properly?",
    choices: {
      a: "Leave it all as one commit: formatting is harmless.",
      b: "Reject all the work and start over.",
      c: "Revert the formatting of unrelated files (or move it to a separate commit or PR) and keep only the fix in this PR.",
      d: "Ask the reviewer to ignore the formatting.",
    },
    whyWrong: {
      a: "The 12 meaningful lines get lost among hundreds of cosmetic ones, and review becomes a formality.",
      b: "The fix is useful; the only problem is mixing kinds of changes.",
      d: "The reviewer still has to filter out the noise, and a real change could hide in it.",
    },
    explanation:
      "One PR, one purpose. Keeping mechanical changes apart from logical ones makes review real and history understandable.",
  },
  "dc-3-q15": {
    prompt: "Claude writes the PR description based on this command. Why three dots?",
    choices: {
      a: "Three dots show working-tree changes not yet staged.",
      b: "It's the same as two dots, just a different notation.",
      c: "Three dots compare only commit messages.",
      d: "It shows the branch's changes since its common ancestor with `main` — exactly what the PR will bring.",
    },
    whyWrong: {
      a: "Uncommitted changes are shown by `git diff` with no arguments; here commits are compared.",
      b: "`main..HEAD` in `git diff` compares the two end states, so changes from `main` would also appear in the difference.",
      c: "`git diff` compares file contents, not messages.",
    },
    explanation:
      "`A...B` in `git diff` uses the branches' merge base, so new commits on `main` don't leak into the description. It's the same diff the reviewer sees in the PR.",
  },
  "dc-3-q16": {
    scenario:
      "Reviewing the latest local commit before pushing, you notice it includes `.env` with a key for a test payment API. The commit hasn't been pushed yet.",
    prompt: "What do you do?",
    choices: {
      a: "Delete `.env` in the next commit.",
      b: "Remove the file from the commit (`git rm --cached .env` and `git commit --amend`) and add `.env` to `.gitignore`.",
      c: "Push, then ask an admin to clean the history.",
      d: "Nothing: it's only a test key.",
    },
    whyWrong: {
      a: "The file stays in the previous commit's history and goes to the server with the push.",
      c: "Once pushed, the secret is already compromised; it must be removed before that.",
      d: "Test keys grant access too and often share permissions; better not to build the habit.",
    },
    explanation:
      "While the commit is local, it can be fixed without a trace. If a secret has already reached the server, it must be revoked and reissued, not just removed from history.",
  },

  // ── dc-4: Tests and TDD (extra pool) ────────────────────────────────────
  "dc-4-q8": {
    prompt: "Why, after implementation, ask a separate subagent to check whether the code was fitted to the tests?",
    choices: {
      a: "The subagent has a fresh context without the implementer's biases and judges the code, not the story of how it was written.",
      b: "A subagent runs tests faster than the main session.",
      c: "Only a subagent is allowed to read test files.",
      d: "That way the tests automatically become part of CI.",
    },
    whyWrong: {
      b: "Run speed is the same; the value is the independent perspective.",
      c: "The main session reads tests too; access restrictions are irrelevant here.",
      d: "A subagent adds nothing to CI; it's a check within the session.",
    },
    explanation:
      "An author tends to see what they intended. An independent reviewer with a clean context spots hard-coding for test data and uncovered cases.",
  },
  "dc-4-q9": {
    prompt: "Claude writes: \"Bug fixed, everything works now.\" What should you require before accepting the change?",
    choices: {
      a: "Nothing: Claude's report is reliable enough.",
      b: "A more detailed explanation of why the fix is correct.",
      c: "Evidence: the output of a test that reproduces the bug and now passes, or your own run of the check.",
      d: "For Claude to repeat \"I'm confident\".",
    },
    whyWrong: {
      a: "A report is a claim, not evidence; the model can be wrong about the outcome.",
      b: "A convincing explanation doesn't replace running it; it can be wrong too.",
      d: "The model's confidence doesn't reliably correlate with correctness.",
    },
    explanation:
      "Verify the result instead of taking it on trust. An objective signal — a test, type-check, linter or screenshot — gives both you and Claude a definition of done.",
  },
  "dc-4-q10": {
    scenario:
      "An integration test for the message queue sometimes fails in CI (roughly one run in ten). Claude proposes wrapping it in `retry(3)`.",
    prompt: "What's the better approach?",
    choices: {
      a: "Agree: three attempts will make CI stable.",
      b: "Mark the test as `skip`.",
      c: "Double the timeouts of all tests.",
      d: "Ask Claude to find the cause of the flakiness (races, order or time dependence, shared state) and reproduce it deterministically.",
    },
    whyWrong: {
      a: "A retry hides the symptom; the defect (a race, shared state) remains and may bite in production.",
      b: "A disabled test protects against no regressions at all.",
      c: "Blindly raising timeouts slows the suite and doesn't guarantee the cause is removed.",
    },
    explanation:
      "A flaky test signals non-determinism in the test or the code. Find the cause and make it reproducible; retries only reduce the check's sensitivity.",
  },
  "dc-4-q11": {
    prompt: "What can serve as an objective verification target for Claude during iteration?",
    choices: {
      a: "Claude's own confidence that the code is correct.",
      b: "A test suite that must turn green.",
      c: "A clean type-check, e.g. `tsc --noEmit`.",
      d: "A UI screenshot compared against a mockup.",
      e: "The number of changed lines.",
    },
    whyWrong: {
      a: "The model's self-assessment isn't an external signal and doesn't catch its own mistakes.",
      e: "The size of a change says nothing about its correctness.",
    },
    explanation:
      "Claude works best when it can check the result itself: tests, the compiler, the linter, visual comparison. Such a target gives a clear criterion for \"done\".",
  },
  "dc-4-q12": {
    prompt: "Claude reported that \"the suite is green\". What's wrong with this test file excerpt?",
    choices: {
      a: "`describe` can't be used without `beforeEach`.",
      b: "The promo-code string should be extracted into a constant.",
      c: "`it.only` runs only this test, so the file's other tests are skipped and the \"green\" result is misleading.",
      d: "`toBe` doesn't work with numbers; you need `toEqual`.",
    },
    whyWrong: {
      a: "`beforeEach` is optional; `describe` works without it.",
      b: "A stylistic nitpick that doesn't affect the run's outcome.",
      d: "`toBe` correctly compares primitives, numbers included.",
    },
    explanation:
      "`.only` is handy for iterating, but when forgotten in a commit it silently disables the other tests. Look for such markers in the diff or catch them with a linter.",
  },
  "dc-4-q13": {
    scenario:
      "You need to refactor an old tax calculation module: 600 lines, no tests, used by three services. There's no documentation of its behaviour.",
    prompt: "What do you do first?",
    choices: {
      a: "Ask Claude to write characterisation tests that capture current behaviour on real examples, and refactor while keeping them green.",
      b: "Ask it to rewrite the module \"cleanly\" right away and then write tests for the new code.",
      c: "Refactor without tests, relying on code review.",
      d: "First write documentation of how the module is supposed to work.",
    },
    whyWrong: {
      b: "Tests for the new code check the new code, but not that the old behaviour the services depend on is preserved.",
      c: "Reviewing 600 lines of tax logic won't catch subtle behaviour changes.",
      d: "\"Supposed to\" can differ from how it actually works and what clients already rely on.",
    },
    explanation:
      "Characterisation tests capture what is, even if it's odd. They turn refactoring into a safe operation: behaviour doesn't change as long as the tests are green.",
  },
  "dc-4-q14": {
    prompt: "What's risky about asking Claude to write the tests and the implementation in a single step?",
    choices: {
      a: "The tests will run more slowly.",
      b: "Claude won't be able to run the tests before committing.",
      c: "The tests won't appear in the coverage report.",
      d: "The tests will mirror the implementation, bugs included, instead of independently defining the expected behaviour.",
    },
    whyWrong: {
      a: "The order of writing doesn't affect execution speed.",
      b: "They can be run at any time; the problem is their content.",
      c: "Coverage is counted the same regardless of order.",
    },
    explanation:
      "A test written for already-finished code verifies that the code does what it does. Separating the steps makes the tests an independent specification.",
  },
  "dc-4-q15": {
    prompt: "Claude wrote this test for `calculatePrice`. What's the problem?",
    choices: {
      a: "The very module under test is mocked, so the test checks the mock, not the code.",
      b: "`vi.mock` must be called inside `it`.",
      c: "Numbers require `toBeCloseTo` instead of `toBe`.",
      d: "Test functions must be async.",
    },
    whyWrong: {
      b: "`vi.mock` is hoisted to the top of the file and is normally written at the top level; placement isn't the issue.",
      c: "For the integer 90 `toBe` is correct; and even with `toBeCloseTo` the test would be checking the mock.",
      d: "Synchronous code is tested synchronously; async isn't needed here.",
    },
    explanation:
      "You mock dependencies, not the subject under test. A test that checks its own mock is always green and guarantees nothing; such a substitution is a typical sign of gaming the tests.",
  },
  "dc-4-q16": {
    prompt: "The full test suite takes 10 minutes, and Claude runs it after every small edit. How do you speed up the loop without losing reliability?",
    choices: {
      a: "Don't run tests at all until the task is done.",
      b: "Ask Claude to ignore failures unrelated to the task.",
      c: "During iteration, run only the tests for the affected module or file.",
      d: "Run the full suite before committing or in CI.",
      e: "Document both commands in CLAUDE.md so Claude knows when to use which.",
    },
    whyWrong: {
      a: "Errors pile up, and at the end they're hard to tie to a specific edit.",
      b: "That makes it easy to miss a regression caused by this very change.",
    },
    explanation:
      "A fast targeted check is for iteration; the full one is for checkpoints. Commands recorded in CLAUDE.md keep this rhythm stable across sessions.",
  },

  // ── dc-5: Automation (extra pool) ───────────────────────────────────────
  "dc-5-q8": {
    prompt: "Why is it convenient to delegate running a large test suite to a subagent?",
    choices: {
      a: "A subagent has access to faster hardware.",
      b: "Only a subagent can run bash commands.",
      c: "A subagent automatically fixes failing tests.",
      d: "The verbose test output stays in the subagent's context, and only a short summary comes back to the main session.",
    },
    whyWrong: {
      a: "A subagent runs on the same machine; the benefit isn't speed.",
      b: "The main session runs bash too; what matters is where the output ends up.",
      c: "It does what its prompt describes; there are no automatic fixes.",
    },
    explanation:
      "A subagent has its own context window. Noisy tasks such as test runs or log searches are isolated there, and the main context receives only the conclusion.",
  },
  "dc-5-q9": {
    prompt: "Which tools will this subagent get if the `tools` line is removed?",
    choices: {
      a: "All the tools available to the main session, including file editing.",
      b: "None: without `tools` the subagent only answers in text.",
      c: "Only read tools: Read, Grep and Glob.",
      d: "The file becomes invalid and the subagent won't load.",
    },
    whyWrong: {
      b: "A missing field means inheritance, not an empty set.",
      c: "There's no automatic restriction to read-only; it has to be specified explicitly.",
      d: "`tools` is an optional field.",
    },
    explanation:
      "Without `tools`, a subagent inherits all tools. For a test runner, an explicit narrow list is both safer and clearer: it runs and reads, but doesn't edit.",
  },
  "dc-5-q10": {
    prompt: "Every day you type the same long prompt: \"run the linter, fix the errors, run the tests, commit with a conventional message\". What should you do about it?",
    choices: {
      a: "Keep the text in your notes and copy it.",
      b: "Write the procedure into CLAUDE.md so it runs at the start of every session.",
      c: "Create a slash command in `.claude/commands/` that you invoke explicitly.",
      d: "Make a `SessionStart` hook that runs the procedure.",
    },
    whyWrong: {
      a: "Manual copying is exactly the routine a custom command removes.",
      b: "CLAUDE.md is context, not a trigger: the procedure doesn't run by itself, and it isn't needed in every session.",
      d: "A startup hook would run every time, even when you don't need it.",
    },
    explanation:
      "A recurring procedure you launch deliberately is a perfect slash command. Committed to the repository, it's available to the whole team.",
  },
  "dc-5-q11": {
    prompt: "When should a script use `--output-format stream-json` instead of `--output-format json`?",
    choices: {
      a: "When you only need the final answer as a single line.",
      b: "When events need to be processed as they arrive: showing progress, logging tool calls during a long run.",
      c: "When you need to reduce the cost of the run.",
      d: "When Claude must work without permissions.",
    },
    whyWrong: {
      a: "For that, `text` or `json` with its `result` field is simpler.",
      c: "The output format doesn't affect the model's token count.",
      d: "The output format has nothing to do with permissions.",
    },
    explanation:
      "`json` returns one object at the end; `stream-json` returns a stream of messages, one JSON per line. The stream is needed when a script reacts to the progress of the work, not just to the result.",
  },
  "dc-5-q12": {
    prompt: "A script makes two headless runs in a row. How does the second one get the first one's context?",
    choices: {
      a: "It doesn't: every `claude -p` call always starts from scratch.",
      b: "Via CLAUDE.md, where the first run automatically writes a summary.",
      c: "Via the `SID` environment variable, which Claude reads automatically.",
      d: "`--resume` with the first run's `session_id` continues the same conversation.",
    },
    whyWrong: {
      a: "A headless session can be continued by its ID.",
      b: "A headless run writes nothing to CLAUDE.md by itself.",
      c: "The variable is only for the script; Claude receives the ID via `--resume`.",
    },
    explanation:
      "The JSON output contains `session_id`, and `--resume` restores that session. This way multi-step script scenarios keep context between calls.",
  },
  "dc-5-q13": {
    prompt: "Which tasks is `claude -p` appropriate for in scripts?",
    choices: {
      a: "Analysing logs passed through a pipe.",
      b: "Drafting release notes from `git log` between tags.",
      c: "Debugging where you need to discuss hypotheses step by step.",
      d: "Automated review of changes in CI with a narrow tool set.",
    },
    whyWrong: {
      c: "A dialogue with clarifications is a job for an interactive session; `-p` gives a single answer.",
    },
    explanation:
      "`-p` is for tasks with a clear input and output and no human in the middle. Where dialogue is needed, an interactive session is more effective.",
  },
  "dc-5-q14": {
    scenario:
      "You wrote a hook that should block `rm -rf` in Claude's commands. The script correctly exits with code 2 if it sees `rm -rf` in `.tool_input.command`. But the hook has never fired.",
    prompt: "What is the most likely cause?",
    choices: {
      a: "The event should be `PostToolUse`.",
      b: "Code 2 should be replaced with 1.",
      c: "The matcher `Edit|Write` doesn't match the `Bash` tool, so the hook is never invoked for shell commands.",
      d: "Hooks don't work for shell commands at all.",
    },
    whyWrong: {
      a: "After execution the command can no longer be blocked; `PreToolUse` is the right choice.",
      b: "The opposite: code 2 is what blocks; other non-zero codes are non-blocking errors.",
      d: "`PreToolUse` with matcher `Bash` is the standard way to check commands.",
    },
    explanation:
      "The matcher filters by tool name. Shell commands are executed by the `Bash` tool, so that's the tool the hook must be registered for.",
  },
  "dc-5-q15": {
    prompt: "Why should you review the hooks in someone else's repository before working there with Claude Code?",
    choices: {
      a: "Hooks can slow down the model's replies.",
      b: "Hooks completely disable the permission system.",
      c: "Hooks can change the model Claude uses.",
      d: "Hooks are arbitrary shell commands that run automatically, with your privileges, on session events.",
    },
    whyWrong: {
      a: "Latency is possible, but the main issue is a different one — security.",
      b: "Hooks don't disable permissions; they execute code themselves.",
      c: "The model is set by other settings; the risk of hooks lies in executing code.",
    },
    explanation:
      "A hook is code that runs on your behalf without a separate confirmation each time. Configuration from an untrusted repository deserves the same scrutiny as a script you're about to run.",
  },
  "dc-5-q16": {
    prompt: "A hook with the command `./scripts/fmt.sh` sometimes fails with \"No such file or directory\" when Claude works in a subdirectory. How do you fix it?",
    choices: {
      a: "Build the path from `$CLAUDE_PROJECT_DIR`, e.g. `\"$CLAUDE_PROJECT_DIR\"/scripts/fmt.sh`.",
      b: "Forbid Claude from entering subdirectories.",
      c: "Copy the script into every subdirectory.",
      d: "Move the hook into CLAUDE.md.",
    },
    whyWrong: {
      b: "That restricts the work rather than fixing a fragile relative path.",
      c: "Duplication that will drift; a correct path from the root solves everything.",
      d: "CLAUDE.md doesn't run commands; hooks live in settings.",
    },
    explanation:
      "`CLAUDE_PROJECT_DIR` points to the project root regardless of the current directory. An absolute path makes the hook stable.",
  },

  // ── dc-boss: Refactoring a large repo (extra pool) ──────────────────────
  "dc-boss-q6": {
    scenario:
      "After the codemod, manual finishing work remains in 8 independent packages. You want to speed things up by running several Claude Code sessions at once.",
    prompt: "How do you organise this?",
    choices: {
      a: "Run several sessions in one working directory, each assigned its own package.",
      b: "One session that switches \"in parallel\" between packages in turn.",
      c: "A separate git worktree and branch per package (or group), a session in each, then merge with a full test run.",
      d: "Switch branches in one directory between prompts to different sessions.",
    },
    whyWrong: {
      a: "A shared working tree: one session's test runs, formatter and git operations will interfere with the others.",
      b: "That's sequential work with interleaved context, not parallelism.",
      d: "Files change under every session's feet at the same time.",
    },
    explanation:
      "Parallel sessions need isolated working trees. Worktrees provide that cheaply, and independent packages minimise merge conflicts.",
  },
  "dc-boss-q7": {
    scenario:
      "At the start of the session you said: \"Don't change the public API of the `@acme/sdk` package.\" After automatic compaction, Claude proposes changing the signature of a function exported by that package.",
    prompt: "How do you prevent this reliably?",
    choices: {
      a: "Repeat the constraint in every prompt.",
      b: "Disable auto-compaction.",
      c: "Switch to a model with a larger context.",
      d: "Record the constraint in CLAUDE.md and the plan file, and if needed back it technically — with a `deny` rule or a hook on those paths.",
    },
    whyWrong: {
      a: "It depends on your memory and disappears with any new session.",
      b: "Then the session hits the context limit; the problem is where the rule lives.",
      c: "A bigger window postpones the problem but doesn't remove it.",
    },
    explanation:
      "Instructions from the conversation can get lost in compaction, while memory and the plan are loaded again. Critical constraints also get a technical boundary.",
  },
  "dc-boss-q8": {
    prompt: "How is it best to submit a large refactor for review: a codemod over 300 files plus manual logic changes in 20 files?",
    choices: {
      a: "Split it: the mechanical changes in a separate PR or commit (with the codemod script), the logic changes separately.",
      b: "One PR: that way the reviewer sees the whole picture.",
      c: "Only the manual changes go to review; merge the codemod without review.",
      d: "Ask Claude to squash everything into one commit for a clean history.",
    },
    whyWrong: {
      b: "The 20 logic files get lost among 300 mechanical ones; review becomes superficial.",
      c: "A codemod can be wrong too; its output is reviewed, just differently — via the script and sampling.",
      d: "One commit mixes kinds of changes and complicates both review and rollback.",
    },
    explanation:
      "A mechanical change is checked via the script and sampling; a logic change line by line. Splitting gives each kind of change the review it needs.",
  },
  "dc-boss-q9": {
    scenario:
      "Midway through the refactor, tests fail in three modules that the changes seemingly don't touch. Claude proposes to \"patch them up\".",
    prompt: "What do you do first?",
    choices: {
      a: "Let it patch: a green suite matters more than the cause.",
      b: "Compare with the baseline: were these tests failing before the changes, and if not, find which change affected them.",
      c: "Disable these tests until the refactor is done.",
      d: "Revert the entire refactor.",
    },
    whyWrong: {
      a: "Patching without understanding the cause can hide a real regression from the refactor.",
      c: "Disabled tests won't catch a regression exactly when the risk is highest.",
      d: "Disproportionate: first find out whether the changes are to blame at all.",
    },
    explanation:
      "A baseline separates old problems from new ones. If the failures are new, the \"unrelated\" modules are in fact related — an important finding for the plan.",
  },
  "dc-boss-q10": {
    prompt: "What should be checked before merging a large-scale refactor?",
    choices: {
      a: "Claude's summary \"all done, tests green\" — that's enough.",
      b: "Only the tests of the changed files.",
      c: "The full test suite and a type-check of the whole repository.",
      d: "Human review of the diff of the logic (not mechanical) changes.",
      e: "An independent review of the diff by a separate session or a subagent with a fresh context.",
    },
    whyWrong: {
      a: "A report isn't evidence; the check has to be seen or run yourself.",
      b: "An API refactor breaks precisely the callers in unchanged files.",
    },
    explanation:
      "A large change is verified at scale: the whole repository, a human look at the logic and a fresh independent reviewer. The implementer's self-report isn't part of it.",
  },
  "dc-boss-q11": {
    scenario:
      "In one phase Claude changed 60 files, including generated files in `dist/` and `package-lock.json`, even though the plan didn't call for it.",
    prompt: "How do you prevent this in the next phases?",
    choices: {
      a: "Ask Claude to be more careful.",
      b: "Revert these files by hand after every phase.",
      c: "Add `dist/` to `.gitignore` and leave it at that.",
      d: "Close off writes to these paths technically — with `deny` rules for Edit/Write or a `PreToolUse` hook — and mention it in CLAUDE.md.",
    },
    whyWrong: {
      a: "Asking doesn't guarantee behaviour, especially in a long session after compaction.",
      b: "It treats the consequences, not the cause, and it's easy to miss something.",
      c: "Git will stop seeing them, but Claude will still edit them; and the lockfile can't be protected that way.",
    },
    explanation:
      "Boundaries that must always hold are set with permissions and hooks. CLAUDE.md explains the reason, and the technical rule guarantees the outcome.",
  },
  "dc-boss-q12": {
    scenario:
      "In the fourth phase it turns out some modules call the old API through string keys: `registry.call(\"getUserCtx\")`. The AST codemod didn't see them, so the plan is incomplete.",
    prompt: "How do you proceed?",
    choices: {
      a: "Stop, update the plan, find all string usages by search, add a test or check that catches the old name, and only then continue.",
      b: "Continue with the plan and fix the string calls if something breaks in production.",
      c: "Keep the old name in the registry forever as an alias, with no removal plan.",
      d: "Restart the whole refactor from scratch.",
    },
    whyWrong: {
      b: "String calls fail only at runtime; tests may not cover them.",
      c: "A temporary alias is reasonable, but without a removal plan it becomes permanent debt.",
      d: "The completed phases are correct; extending the plan is enough.",
    },
    explanation:
      "New knowledge changes the plan, not just the code. A check that catches the old name (a grep in CI or a registry test) guarantees no case comes back.",
  },
};
