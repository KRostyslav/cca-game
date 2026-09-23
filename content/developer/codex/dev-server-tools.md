---
title: Server tools
domain: dev-tools
summary: Web search, web fetch, code execution, tool search і programmatic tool calling — інструменти, які виконує платформа, і як обробляти їхні блоки та pause_turn.
---

## Хто виконує

| Тип | Хто виконує | Що робить ваш код |
|---|---|---|
| Клієнтський (ваш `input_schema`) | Ваш код | Ловить `tool_use`, повертає `tool_result` |
| Anthropic-defined клієнтський (bash, text editor, memory) | Ваш код | Те саме, але схема вбудована |
| Server tool (web search, web fetch, code execution) | Платформа | Лише оголошує й читає результат |

Server tool оголошують через `type` і `name`, без `input_schema`:

```json
{ "type": "web_search_20260209", "name": "web_search", "max_uses": 3 }
```

## Як виглядає відповідь

Одна відповідь містить `server_tool_use` (запит моделі), `web_search_tool_result` (результати) і текст із цитатами. `tool_result` від вас не потрібен, але результати займають контекст і тарифікуються як токени.

## Параметри web search / web fetch

- `max_uses` — скільки разів модель може скористатися інструментом у межах запиту;
- `allowed_domains` **або** `blocked_domains` — одне з двох, не разом;
- web fetch завантажує лише URL, що вже з'явилися в розмові.

Версії `_20260209` мають вбудовану динамічну фільтрацію кодом — окремо оголошувати `code_execution` для цього не треба, друге середовище лише плутає модель.

## Помилки не кидають виняток

HTTP 200, а `content` результату — об'єкт з `error_code` (напр. `max_uses_exceeded`) замість списку:

```python
if isinstance(block.content, list):
    urls = [r.url for r in block.content]
else:
    log.warning(block.content.error_code)
```

## `pause_turn`

Серверний цикл має ліміт ітерацій. Досягнувши його, відповідь повертається зі `stop_reason: "pause_turn"`. Додайте `response.content` в історію без змін і повторіть запит — сервер продовжить сам. Не додавайте «Продовжуй» і обмежте кількість продовжень.

## Code execution

Ізольований контейнер на боці Anthropic, **без інтернету**. Контейнер можна перевикористати між запитами, щоб зберегти файли й стан. До вашої БД напряму не дістанеться.

## Tool search

Позначте рідковживані інструменти `defer_loading: true` — вони не потрапляють у контекст, доки модель їх не знайде. Знайдені схеми **додаються** до запиту, кеш не ламається. Сам пошуковий інструмент відкладати не можна; якщо відкласти всі — 400.

## Programmatic tool calling

```json
{ "name": "get_order", "input_schema": { "...": "..." }, "allowed_callers": ["code_execution_20260120"] }
```

Модель пише скрипт, що викликає ваш інструмент у циклі; виконує виклики досі ваш код, але результати йдуть у скрипт, а в контекст — лише підсумок. Несумісне зі `strict: true` і примусовим `tool_choice`. Див. також [[dev-tool-loop]].
