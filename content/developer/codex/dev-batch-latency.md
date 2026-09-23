---
title: Batches і latency
domain: dev-production
summary: Message Batches API для масової асинхронної обробки та прийоми зменшення затримки в інтерактивних фічах.
---

## Коли Batches

Message Batches API обробляє **незалежні** запити асинхронно зі знижкою **50%** на всі токени. Обробка — до 24 годин (більшість батчів значно швидше), результати доступні 29 днів. У батчі до 100 000 запитів або 256 МБ.

| Підходить | Не підходить |
|---|---|
| Нічна класифікація, розмітка датасету | Чат у реальному часі |
| Прогін eval-набору | Агентний цикл, де крок залежить від попереднього |
| Масове перегенерування описів | Автодоповнення коду |

Батч ще й знімає масовий трафік зі звичайних rate limits, тож нічні задачі не заважають інтерактивним.

## Цикл роботи

```ts
const batch = await client.messages.batches.create({
  requests: docs.map((d) => ({
    custom_id: `doc-${d.id}`,
    params: { model: MODEL, max_tokens: 512, messages: [{ role: "user", content: d.text }] },
  })),
});
// опитувати retrieve, доки processing_status !== "ended"
for await (const r of await client.messages.batches.results(batch.id)) {
  byId.set(r.custom_id, r.result);
}
```

1. Сформувати запити з унікальним `custom_id`.
2. `batches.create` — повертається одразу.
3. Опитувати `retrieve`, доки `processing_status` не стане `ended` (`in_progress` → `canceling` → `ended`). Webhook у `create` немає.
4. Читати результати й **ключувати за `custom_id`**: порядок не гарантований.
5. Обробити неуспішні.

## Типи результатів

| `result.type` | Дія |
|---|---|
| `succeeded` | Взяти `result.message` |
| `errored` | Виправити запит (`invalid_request_error` сам не зникне), потім повторити |
| `expired` | Повторити як є |
| `canceled` | Повторити, якщо потрібно |

API не повторює запити всередині батча. Новим батчем надсилайте лише неуспішні, а не весь набір заново.

## Latency

- **Вивід домінує**: токени генеруються послідовно, тож загальний час приблизно пропорційний довжині відповіді. Стислий формат — найсильніший важіль.
- **Streaming** не скорочує загальний час, але різко зменшує час до першого токена (TTFT), який бачить користувач.
- **Prompt caching** довгого префікса скорочує TTFT ([[dev-caching-cost]]).
- **Швидша модель** для простих кроків, якщо [[dev-evals]] підтверджує якість.
- **Паралельність** незалежних запитів.
- `max_tokens` — стеля, а не швидкість; Batches для інтерактиву лише повільніші.

## Streaming-події

`message_start` → `content_block_start` / `content_block_delta` / `content_block_stop` → **`message_delta`** (тут `stop_reason` і підсумкові `usage.output_tokens`) → `message_stop`.

Для довгих генерацій з великим `max_tokens` SDK розраховують на streaming, щоб уникнути HTTP-таймаутів:

```ts
const stream = client.messages.stream({ model: MODEL, max_tokens: 64000, messages });
const message = await stream.finalMessage();
```

Деталі подій — у [[dev-api-streaming]].
