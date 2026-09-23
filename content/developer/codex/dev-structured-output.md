---
title: Структурований вивід
domain: dev-tools
summary: output_config.format, strict tool use, обмеження схем і цикл валідація–ретрай для надійного JSON.
---

## Два механізми

| Механізм | Що гарантує |
|---|---|
| `output_config.format` | Текстова відповідь — валідний JSON за схемою |
| `strict: true` на інструменті | `tool_use.input` відповідає `input_schema` |

Агент може поєднувати обидва: strict-інструменти для дій, формат — для фінального звіту.

```ts
const res = await client.messages.create({
  model, max_tokens: 1024, messages,
  output_config: {
    format: {
      type: "json_schema",
      schema: {
        type: "object",
        properties: { sentiment: { type: "string", enum: ["positive", "negative", "neutral"] } },
        required: ["sentiment"],
        additionalProperties: false,
      },
    },
  },
});
```

JSON приходить рядком у text-блоці `res.content`. Помічник `messages.parse()` будує схему з Pydantic/Zod, валідує і повертає типізований об'єкт.

⚠️ Не `response_format`, не `json_mode` і не застарілий верхньорівневий `output_format`. Prefill `{` на сучасних моделях — 400.

## Вимоги до схеми

- `additionalProperties: false` для **кожного** об'єкта, зокрема вкладених;
- підтримуються типи, `enum`, `const`, `anyOf`, `$ref`, частина `format` (`date-time`, `email`, `uuid`…);
- **не** підтримуються `minimum`/`maximum`, `minLength`/`maxLength`, рекурсія — SDK прибирає їх зі схеми й перевіряє на клієнті.

Перший запит з новою схемою повільніший: схема компілюється, далі береться з кешу. Тримайте схеми стабільними.

## Межі гарантії

Гарантія діє при `end_turn`. Перевіряйте `stop_reason` **до** парсингу:

- `max_tokens` — JSON може бути обрізаним;
- `refusal` — вивід може не відповідати схемі.

Citations несумісні з `output_config.format` — запит отримає 400.

## Форма ≠ зміст

Схема гарантує валідний JSON, `required`-поля, типи й `enum`. Вона **не** перевіряє, що `end_date` пізніша за `start_date` чи що сума збігається з позиціями. Для скінченних множин (категорії) — `enum`, за потреби з явним `other`, а не словник синонімів.

## Валідація і ретрай

1. Запит зі схемою.
2. Перевірити `stop_reason`, розпарсити.
3. Перевірити бізнес-правила в коді.
4. При порушенні — повтор із **конкретною** помилкою.
5. Після кількох невдач — черга ручної перевірки.

Для інструментів без `strict` помилку валідації повертають як `tool_result` з `is_error: true`: «`amount` має бути числом, отримано рядок "12,50"». Повтор того самого запиту без нової інформації, тиха нормалізація чи `{}` у `catch` — антипатерни. Див. [[dev-tool-definitions]].
