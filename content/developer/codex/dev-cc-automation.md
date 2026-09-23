---
title: Автоматизація Claude Code
domain: dev-claude-code
summary: Slash-команди, hooks, subagents, headless-режим claude -p і GitHub Actions у щоденній розробці.
---

## Що для чого

| Потреба | Механізм |
|---|---|
| Повторювана процедура, яку ви запускаєте свідомо | slash-команда в `.claude/commands/` |
| Має відбуватися **завжди** на подію | hook у `.claude/settings.json` |
| Шумна підзадача (тести, логи) | subagent у `.claude/agents/` |
| Скрипти, конвеєри, CI | `claude -p` |

## Slash-команди

```markdown
---
description: Виправити issue з GitHub
allowed-tools: Bash(gh issue view:*)
---
Опис задачі: !`gh issue view $ARGUMENTS`
Відтвори проблему тестом, виправ і закоміть.
```

`!`-виконання bash підпадає під дозволи, тому потрібен `allowed-tools`. Ім'я команди — ім'я файлу: `/fix-issue 123`.

## Hooks

Hook-команда отримує **JSON на stdin**: `tool_name`, `tool_input`, `session_id`, `cwd`.

```json
{ "hooks": { "PostToolUse": [ { "matcher": "Edit|Write",
  "hooks": [ { "type": "command",
    "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write" } ] } ] } }
```

- **Matcher** фільтрує за назвою інструмента. Hook на `rm -rf` із matcher `Edit|Write` не спрацює ніколи: shell-команди виконує `Bash`.
- Код **2** блокує, stderr іде Claude. Для `Stop` це означає «не завершуй хід» — зручно для «поки тести червоні»; перевіряйте `stop_hook_active`, щоб не зациклитися.
- Шляхи будуйте від `"$CLAUDE_PROJECT_DIR"`, а не `./scripts/...`: Claude може працювати в підкаталозі.
- Послідовність: скрипт → реєстрація → перевірка через `/hooks` → тестова правка → коміт налаштувань.
- Hooks — довільні shell-команди з вашими правами: у чужому репо їх переглядають перед роботою.

## Subagents

Власне контекстне вікно: багатослівний вивід тестів лишається там, у головну сесію повертається зведення. Поле `tools` необов'язкове; **без нього subagent успадковує всі інструменти**, тож test-runner-у краще явно дати `Read, Grep, Glob, Bash`.

## Headless: `claude -p`

```bash
git diff main...HEAD | claude -p "Склади changelog" --output-format json | jq -r '.result'
SID=$(claude -p "Проаналізуй auth" --output-format json | jq -r '.session_id')
claude -p "Запропонуй план" --resume "$SID"
```

- `json` — один об'єкт наприкінці (`result`, `session_id`, `total_cost_usd`); `stream-json` — потік подій по рядку, для прогресу й логування викликів.
- Доречно: аналіз логів, release notes, рев'ю в CI. Діалог з уточненнями — в інтерактивній сесії.

**Fan-out** для масових змін: скрипт складає список файлів, цикл викликає `claude -p` на кожен із вузьким `--allowedTools`, результати перевіряються тестами, збійні — повторно. `--dangerously-skip-permissions` — лише в ізольованому контейнері.

## GitHub Actions

`/install-github-app` встановлює GitHub App і додає workflow з `anthropics/claude-code-action` та секретом API-ключа. Після цього `@claude` у коментарях PR та issue запускає Claude у раннері.
