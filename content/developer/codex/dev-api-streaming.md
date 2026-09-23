---
title: Streaming
domain: dev-api
summary: Server-sent events у Messages API — типи подій, збирання відповіді, помилки посеред потоку та UX.
---

## Навіщо

Streaming вмикають полем `"stream": true` у тілі того самого `POST /v1/messages`. Він не змінює токенів, ціни, якості, `max_tokens` чи набору `stop_reason` — лише доставку. Два виграші:

- **час до першого токена** для інтерактивного UI (загальний час генерації майже той самий);
- **немає HTTP-таймаутів** на довгих генераціях: для великих `max_tokens` SDK вимагає або радить streaming.

Для коротких фонових задач без UI звичайний `create` простіший.

## Формат і порядок подій

Кожна подія — рядок `event: <тип>`, рядок `data: <JSON>` і порожній рядок.

1. `message_start` — повідомлення з порожнім `content`; `usage` з вхідними токенами.
2. `content_block_start` — новий блок з `index` (`text`, `thinking`, `tool_use` з `id` і `name`).
3. `content_block_delta` — фрагменти блоку.
4. `content_block_stop` — блок закрито.
5. `message_delta` — `stop_reason`, `stop_sequence`, кумулятивний `usage.output_tokens`.
6. `message_stop`.

`ping` — службова подія, її ігнорують. SSE односпрямований: клієнт нічого не надсилає в потік.

## Типи дельт

| `delta.type` | Блок | Вміст |
|---|---|---|
| `text_delta` | `text` | `delta.text` |
| `input_json_delta` | `tool_use` | `partial_json` — шматок рядка JSON |
| `thinking_delta`, `signature_delta` | `thinking` | міркування і підпис |

`partial_json` не розбирають поштучно: склеюють за `index` і парсять після `content_block_stop`. Інструмент виконують після `stop_reason: "tool_use"`.

## Хелпери SDK

```python
with client.messages.stream(model="claude-sonnet-5", max_tokens=64000, messages=msgs) as stream:
    for text in stream.text_stream:
        send_to_client(text)
    final = stream.get_final_message()
```

У TypeScript — `stream.on("text", ...)` і `await stream.finalMessage()`; власні Promise-обгортки не потрібні. `create(stream=True)` віддає лише сирі події без накопичення. Кнопка «Зупинити» — `stream.abort()` у TS, вихід з `with` чи `close()` у Python.

## Помилки посеред потоку

Статус 200 надсилається до початку генерації, тож збій може прийти подією `error` (наприклад, `overloaded_error`) уже після частини тексту. SDK піднімає її як виняток під час ітерації; автоматичні повтори SDK стосуються лише встановлення запиту. Застосунок має позначити відповідь як незавершену, не зберігати обривок як готову відповідь і повторити з backoff ([[dev-api-errors]]).

## Інфраструктура

Якщо локально текст іде по словах, а за reverse proxy приходить одним шматком, проксі буферизує відповідь — для SSE-маршруту буферизацію вимикають.
