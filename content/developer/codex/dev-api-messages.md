---
title: Messages API
domain: dev-api
summary: Структура запиту й відповіді `POST /v1/messages`, ролі, system, content blocks і stateless-історія.
---

## Мінімальний запит

Усе йде через `POST /v1/messages`. Обов'язкові поля: `model`, `max_tokens`, `messages`. Для сирого HTTP потрібні заголовки `x-api-key`, `anthropic-version` (версія контракту API, наприклад `2023-06-01`, а не моделі) і `content-type: application/json`. Бета-можливості вмикає окремий `anthropic-beta`.

```python
import anthropic

client = anthropic.Anthropic()  # ключ з ANTHROPIC_API_KEY
msg = client.messages.create(
    model="claude-sonnet-5",
    max_tokens=1024,
    system="Ти — асистент служби підтримки.",
    messages=[{"role": "user", "content": "Привіт"}],
)
```

Ключ не зашивають у код: SDK сам читає `ANTHROPIC_API_KEY`.

## Ролі та system

- Діалог у `messages` складається з повідомлень `user` і `assistant`; перше — завжди `user`.
- Основний системний промпт — окремий параметр верхнього рівня `system` (рядок або масив текстових блоків), а не `messages[0]` з `role: "system"`, як в інших API. Під час міграції це найчастіша причина 400.
- `system` тарифікується як вхідні токени й займає контекст у **кожному** запиті. На його блок можна поставити `cache_control`.

## Content blocks

`content` — рядок (скорочення для одного блоку `text`) або масив блоків:

| Блок | Де | Призначення |
|---|---|---|
| `text` | `user`, `assistant` | Текст |
| `image` | `user` | `source`: `base64` + `media_type` або `url` |
| `document` | `user` | PDF (`application/pdf`) — текст і вигляд сторінок |
| `tool_result` | `user` | Результат інструмента з `tool_use_id` |
| `tool_use`, `thinking` | `assistant` | Виклик інструмента, міркування |

Зображення чи документ кладуть **перед** текстовим питанням. Base64 у текстовому блоці — просто символи, а не зображення.

## Відповідь

Об'єкт `Message`: `id`, `role: "assistant"`, `model`, масив `content`, `stop_reason`, `stop_sequence`, `usage`. Полів `text` чи `conversation_id` немає.

`content[0]` — ненадійний доступ: першим може бути `thinking` або `tool_use`, а тексту — кілька блоків. Фільтруйте за `type`:

```ts
const text = response.content
  .filter((b) => b.type === "text")
  .map((b) => b.text)
  .join("");
```

## Stateless-історія

API не зберігає розмову. Кожен запит містить усю історію, яку веде ваш код:

1. Додати `user` в історію.
2. Викликати `messages.create` з повною історією.
3. Перевірити `stop_reason`.
4. Додати **весь** `response.content` як `assistant`.

Якщо зберігати лише текст, губляться `tool_use` і `thinking`, і наступний `tool_result` отримає 400. Оскільки N-й запит містить усі попередні ходи, сумарна вартість довгої розмови росте приблизно квадратично; допомагають кешування префікса ([[dev-caching-cost]]) і стискання історії ([[dev-api-tokens]]).
