import type { QuestionSource } from "@/lib/content/types";

const d = "dev-agents-mcp" as const;

export const questions: QuestionSource[] = [
  // ── Рівень 1: Agent SDK: перший агент ───────────────────────────────────
  {
    id: "dm-1-q1",
    domainId: d,
    levelId: "dm-1",
    kind: "single",
    difficulty: 1,
    prompt: "Що повертає функція `query()` з `@anthropic-ai/claude-agent-sdk`?",
    choices: [
      { id: "a", text: "`Promise<string>` з фінальним текстом відповіді агента.", whyWrong: "Агент робить багато кроків; SDK віддає їх потоком повідомлень, а фінальний текст лежить у повідомленні `result`." },
      { id: "b", text: "Асинхронний ітератор повідомлень, який читають через `for await`." },
      { id: "c", text: "Один об'єкт `Message`, як `messages.create()` у Messages API.", whyWrong: "Це поведінка клієнта Messages API; `query()` проганяє цілий цикл агента і стрімить усі його кроки." },
      { id: "d", text: "`EventEmitter`, на який підписуються через `.on(\"message\")`.", whyWrong: "SDK не використовує подієву модель Node: повідомлення споживаються як async iterable." },
    ],
    correct: ["b"],
    explanation:
      "`query()` запускає агентний цикл і віддає асинхронний потік повідомлень: `system`, `assistant`, `user` (результати інструментів) і наприкінці `result`. Код споживає їх через `for await` і сам вирішує, що логувати чи показувати.",
    codexRef: "dev-agent-sdk-basics",
  },
  {
    id: "dm-1-q2",
    domainId: d,
    levelId: "dm-1",
    kind: "single",
    difficulty: 2,
    prompt: "Яке повідомлення потоку містить фінальну відповідь агента разом із вартістю запуску і кількістю ходів?",
    code: {
      lang: "ts",
      source: `import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Знайди всі TODO у src/ і згрупуй їх за файлами",
  options: { allowedTools: ["Read", "Grep", "Glob"] },
})) {
  // ...
}`,
    },
    choices: [
      { id: "a", text: "`system` з `subtype: \"init\"`.", whyWrong: "`init` приходить першим: у ньому `session_id`, список інструментів і статус MCP-серверів, але ще немає ні відповіді, ні вартості." },
      { id: "b", text: "Останнє повідомлення типу `assistant`.", whyWrong: "`assistant` містить блоки контенту одного ходу моделі; агрегованих метрик запуску в ньому немає." },
      { id: "c", text: "`result` з полями `result`, `total_cost_usd` і `num_turns`." },
      { id: "d", text: "Повідомлення `user` з останнім `tool_result`.", whyWrong: "`user` у потоці SDK несе результати інструментів назад моделі, а не підсумок запуску." },
    ],
    correct: ["c"],
    explanation:
      "Повідомлення `result` завершує кожен запуск. Там фінальний текст (для `subtype: \"success\"`), вартість, кількість ходів, тривалість, usage і `session_id`: усе, що варто залогувати.",
    codexRef: "dev-agent-sdk-basics",
  },
  {
    id: "dm-1-q3",
    domainId: d,
    levelId: "dm-1",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "Команда будує внутрішнього агента для рефакторингу на Agent SDK. Потрібна поведінка Claude Code (робота з файлами, стиль відповідей, безпечні звички з bash), плюс кілька власних правил компанії. Зараз у `systemPrompt` передано рядок із правилами, і агент поводиться «не як Claude Code».",
    prompt: "Як правильно задати системний промпт?",
    choices: [
      { id: "a", text: "Дописувати правила компанії на початок кожного `prompt`.", whyWrong: "Це змішує інструкції з задачею користувача і не повертає базовий промпт Claude Code." },
      { id: "b", text: "Залишити рядок у `systemPrompt`: SDK сам додасть його до промпту Claude Code.", whyWrong: "Рядок повністю замінює системний промпт; нічого автоматично не додається." },
      { id: "c", text: "Задати `settingSources: [\"project\"]`, це підключить системний промпт Claude Code.", whyWrong: "`settingSources` керує завантаженням налаштувань і CLAUDE.md з файлової системи, а не пресетом системного промпту." },
      { id: "d", text: "`systemPrompt: { type: \"preset\", preset: \"claude_code\", append: \"…правила…\" }`." },
    ],
    correct: ["d"],
    explanation:
      "За замовчуванням SDK не використовує повний промпт Claude Code, а рядок у `systemPrompt` замінює промпт цілком. Пресет `claude_code` з `append` дає базову поведінку Claude Code і дописує ваші правила в кінець.",
    codexRef: "dev-agent-sdk-basics",
  },
  {
    id: "dm-1-q4",
    domainId: d,
    levelId: "dm-1",
    kind: "single",
    difficulty: 3,
    prompt: "Агент на Agent SDK працює в репозиторії з детальним `CLAUDE.md`, але ігнорує описані там домовленості. Найімовірніша причина?",
    choices: [
      { id: "a", text: "SDK за замовчуванням не читає налаштування з файлової системи; потрібно `settingSources: [\"project\"]`." },
      { id: "b", text: "`CLAUDE.md` читається лише в інтерактивному CLI і в SDK не підтримується взагалі.", whyWrong: "Підтримується, але вмикається явно через `settingSources`." },
      { id: "c", text: "Файл занадто великий, і SDK його обрізає.", whyWrong: "Проблема не в розмірі: файл взагалі не завантажується, поки не ввімкнено відповідне джерело налаштувань." },
      { id: "d", text: "Треба передати вміст `CLAUDE.md` у `prompt` кожного запиту.", whyWrong: "Це обхідний шлях, який дублює механізм SDK і змішує інструкції з задачею." },
    ],
    correct: ["a"],
    explanation:
      "SDK ізольований від локальних налаштувань, щоб поведінка на сервері не залежала від випадкових файлів. `settingSources` явно вмикає джерела: `project` читає `CLAUDE.md` і `.claude/settings.json` репозиторію.",
    codexRef: "dev-agent-sdk-basics",
  },
  {
    id: "dm-1-q5",
    domainId: d,
    levelId: "dm-1",
    kind: "multi",
    difficulty: 2,
    prompt: "Які з цих інструментів агент на Agent SDK отримує як вбудовані, без жодного вашого коду?",
    choices: [
      { id: "a", text: "`SendEmail`", whyWrong: "Такого вбудованого інструмента немає; інтеграції з пошта-сервісами підключають як власний tool або MCP-сервер." },
      { id: "b", text: "`Read`" },
      { id: "c", text: "`Bash`" },
      { id: "d", text: "`Grep`" },
    ],
    correct: ["b", "c", "d"],
    explanation:
      "Agent SDK несе набір інструментів Claude Code: `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`, `WebSearch`, `WebFetch` та інші. Усе специфічне для вашого домену додається через власні tools чи MCP.",
    codexRef: "dev-agent-sdk-basics",
  },
  {
    id: "dm-1-q6",
    domainId: d,
    levelId: "dm-1",
    kind: "single",
    difficulty: 2,
    prompt: "Бекенд обслуговує багатьох користувачів. Як продовжити попередню розмову конкретного користувача з агентом?",
    choices: [
      { id: "a", text: "Склеїти всі попередні повідомлення в один рядок і передати його в `prompt`.", whyWrong: "SDK уже зберігає історію сесії; ручна склейка губить структуру викликів інструментів і марнує токени." },
      { id: "b", text: "Передати `continue: true`.", whyWrong: "`continue` підхоплює найсвіжішу сесію в робочому каталозі, а не сесію конкретного користувача." },
      { id: "c", text: "Передати `forkSession: true` без інших опцій.", whyWrong: "`forkSession` лише змінює спосіб відновлення; без `resume` незрозуміло, від якої сесії відгалужуватися." },
      { id: "d", text: "Зберегти `session_id` з повідомлення `init` і передати його в `resume` наступного `query()`." },
    ],
    correct: ["d"],
    explanation:
      "Кожен запуск отримує `session_id`, який приходить у першому `system`-повідомленні. Збережіть його разом із користувачем і передайте в `resume`, щоб агент продовжив із повним контекстом, включно з результатами інструментів.",
    codexRef: "dev-agent-sdk-basics",
  },
  {
    id: "dm-1-q7",
    domainId: d,
    levelId: "dm-1",
    kind: "order",
    difficulty: 2,
    prompt: "Розставте події одного запуску `query()` у порядку, в якому їх побачить ваш код.",
    choices: [
      { id: "a", text: "SDK перевіряє дозвіл, виконує інструмент і повертає `tool_result` у повідомленні `user`." },
      { id: "b", text: "`result` із підсумком, вартістю та `num_turns`." },
      { id: "c", text: "`system` з `subtype: \"init\"`: `session_id`, інструменти, MCP-сервери." },
      { id: "d", text: "`assistant` з блоком `tool_use`." },
      { id: "e", text: "`assistant` з фінальним текстом без викликів інструментів." },
    ],
    correct: ["c", "d", "a", "e", "b"],
    explanation:
      "Спершу `init` описує середовище запуску, далі йдуть ходи моделі й результати інструментів, поки модель не відповість без `tool_use`. Останнім завжди приходить `result`.",
    codexRef: "dev-agent-sdk-basics",
  },

  // ── Рівень 2: Інструменти й дозволи в SDK ───────────────────────────────
  {
    id: "dm-2-q1",
    domainId: d,
    levelId: "dm-2",
    kind: "single",
    difficulty: 1,
    prompt: "Ви додали in-process MCP-сервер `weather` з інструментом `get_forecast`. Яке ім'я інструмента писати в `allowedTools`?",
    choices: [
      { id: "a", text: "`get_forecast`", whyWrong: "Інструменти MCP-серверів отримують префікс із назвою сервера, щоб імена різних серверів не конфліктували." },
      { id: "b", text: "`weather.get_forecast`", whyWrong: "Роздільник не крапка: SDK використовує формат `mcp__<сервер>__<інструмент>`." },
      { id: "c", text: "`mcp__weather__get_forecast`" },
      { id: "d", text: "`mcp:weather/get_forecast`", whyWrong: "Такого формату в SDK немає; неправильне ім'я просто не збіжеться з жодним інструментом." },
    ],
    correct: ["c"],
    explanation:
      "Усі MCP-інструменти в Agent SDK і Claude Code називаються `mcp__<server>__<tool>`, де `<server>` — ключ у `mcpServers`. Під цим самим ім'ям інструмент з'являється і в `init`, і в `tool_use`.",
    codexRef: "dev-agent-sdk-tools",
  },
  {
    id: "dm-2-q2",
    domainId: d,
    levelId: "dm-2",
    kind: "single",
    difficulty: 2,
    prompt: "Як зробити цей інструмент доступним агентові?",
    code: {
      lang: "ts",
      source: `import { tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

const getForecast = tool(
  "get_forecast",
  "Повертає прогноз погоди для міста на найближчі 3 дні",
  { city: z.string().describe("Назва міста латиницею") },
  async ({ city }) => ({
    content: [{ type: "text", text: await fetchForecast(city) }],
  }),
);

const weather = createSdkMcpServer({
  name: "weather",
  version: "1.0.0",
  tools: [getForecast],
});`,
    },
    choices: [
      { id: "a", text: "Передати `mcpServers: { weather }` в опціях `query()` і дозволити `mcp__weather__get_forecast`." },
      { id: "b", text: "Запустити `weather` окремим процесом і зареєструвати через `claude mcp add`.", whyWrong: "`createSdkMcpServer` працює в тому ж процесі, що й ваш код; окремий процес і CLI-реєстрація не потрібні." },
      { id: "c", text: "Передати `getForecast` напряму в поле `tools` запиту, як у Messages API.", whyWrong: "Власні інструменти в Agent SDK підключаються через MCP-сервер у `mcpServers`, а не як сирі визначення Messages API." },
      { id: "d", text: "Нічого: `createSdkMcpServer` реєструє сервер глобально для всіх `query()`.", whyWrong: "Глобальної реєстрації немає: кожен запуск отримує лише сервери зі своїх опцій." },
    ],
    correct: ["a"],
    explanation:
      "`tool()` описує інструмент зі схемою zod, `createSdkMcpServer` загортає його в in-process MCP-сервер. Сервер передають у `mcpServers` під ключем, який стає частиною імені `mcp__weather__get_forecast`.",
    codexRef: "dev-agent-sdk-tools",
  },
  {
    id: "dm-2-q3",
    domainId: d,
    levelId: "dm-2",
    kind: "multi",
    difficulty: 2,
    prompt: "Які значення є коректними для `permissionMode` в Agent SDK?",
    choices: [
      { id: "a", text: "`readOnly`", whyWrong: "Такого режиму немає; обмеження лише на читання задають набором дозволених і заборонених інструментів." },
      { id: "b", text: "`acceptEdits`" },
      { id: "c", text: "`plan`" },
      { id: "d", text: "`bypassPermissions`" },
    ],
    correct: ["b", "c", "d"],
    explanation:
      "Базові режими: `default` (звичайні перевірки), `acceptEdits` (автоматично схвалює редагування файлів), `plan` (лише планування без змін) і `bypassPermissions` (пропускає запити на дозвіл). Режим задає поведінку за замовчуванням, а не список інструментів.",
    codexRef: "dev-agent-sdk-tools",
  },
  {
    id: "dm-2-q4",
    domainId: d,
    levelId: "dm-2",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "Агент на Agent SDK вбудований у вебзастосунок. Перед кожною командою `Bash` користувач має побачити діалог «Дозволити?», а шляхи до файлів у командах треба нормалізувати під робочий каталог користувача.",
    prompt: "Який механізм SDK для цього призначений?",
    choices: [
      { id: "a", text: "`permissionMode: \"acceptEdits\"`.", whyWrong: "Цей режим автоматично схвалює редагування файлів і не показує користувачу жодного діалогу." },
      { id: "b", text: "Hook `PostToolUse` на `Bash`.", whyWrong: "`PostToolUse` спрацьовує після виконання: питати дозволу вже пізно." },
      { id: "c", text: "Callback `canUseTool`, що повертає `{ behavior: \"allow\", updatedInput }` або `{ behavior: \"deny\", message }`." },
      { id: "d", text: "Інструкція в системному промпті питати користувача перед кожною командою.", whyWrong: "Промпт не є технічним контролем: модель може його не виконати, і в UI не з'явиться справжнього діалогу." },
    ],
    correct: ["c"],
    explanation:
      "`canUseTool` викликається, коли дозвіл на інструмент не визначено правилами чи режимом. Тут можна показати діалог, дочекатися рішення й повернути `allow` зі зміненим `updatedInput` або `deny` з поясненням для моделі.",
    codexRef: "dev-agent-sdk-tools",
  },
  {
    id: "dm-2-q5",
    domainId: d,
    levelId: "dm-2",
    kind: "single",
    difficulty: 3,
    prompt: "Як зареєструвати цей hook, щоб він спрацьовував лише перед викликами `Bash`?",
    code: {
      lang: "ts",
      source: `const blockRmRf: HookCallback = async (input) => {
  const { command } = (input as PreToolUseHookInput).tool_input as { command: string };
  if (command.includes("rm -rf")) {
    return {
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: "Рекурсивне видалення заборонене політикою",
      },
    };
  }
  return {};
};`,
    },
    choices: [
      { id: "a", text: "`hooks: { Bash: [blockRmRf] }`", whyWrong: "Ключі в `hooks` — це назви подій (`PreToolUse`, `PostToolUse`…), а не назви інструментів." },
      { id: "b", text: "`hooks: { PreToolUse: [{ matcher: \"Bash\", hooks: [blockRmRf] }] }`" },
      { id: "c", text: "`hooks: { PostToolUse: [{ matcher: \"Bash\", hooks: [blockRmRf] }] }`", whyWrong: "Після виконання команду вже не заблокувати, а `hookEventName` у відповіді не збігатиметься з подією." },
      { id: "d", text: "`canUseTool: blockRmRf`", whyWrong: "`canUseTool` має іншу сигнатуру і формат відповіді (`behavior: \"allow\" | \"deny\"`), а не `hookSpecificOutput`." },
    ],
    correct: ["b"],
    explanation:
      "Hooks у SDK групуються за подією, а всередині — за `matcher` з назвою інструмента. Блокувати можна лише те, що ще не сталося, тому для заборони потрібен `PreToolUse` з `permissionDecision: \"deny\"`.",
    codexRef: "dev-agent-sdk-tools",
  },
  {
    id: "dm-2-q6",
    domainId: d,
    levelId: "dm-2",
    kind: "single",
    difficulty: 2,
    prompt: "`PreToolUse`-hook повернув `permissionDecision: \"deny\"` з поясненням. Що відбувається далі?",
    choices: [
      { id: "a", text: "`query()` кидає виняток, і весь запуск завершується помилкою.", whyWrong: "Заборона одного виклику — штатна ситуація, а не збій запуску." },
      { id: "b", text: "Інструмент мовчки пропускається, модель нічого не дізнається.", whyWrong: "Мовчазний пропуск змусив би модель повторювати ту саму спробу; тому причина повертається їй." },
      { id: "c", text: "Сесія завершується, і її вже не можна відновити через `resume`.", whyWrong: "Сесія лишається цілою; заборона стосується лише одного виклику." },
      { id: "d", text: "Інструмент не виконується, модель отримує причину відмови і може обрати інший шлях." },
    ],
    correct: ["d"],
    explanation:
      "`permissionDecisionReason` потрапляє до моделі як результат заблокованого виклику. Це і заборона, і зворотний зв'язок: агент продовжує роботу, знаючи, чому дію відхилено.",
    codexRef: "dev-agent-sdk-tools",
  },
  {
    id: "dm-2-q7",
    domainId: d,
    levelId: "dm-2",
    kind: "order",
    difficulty: 3,
    prompt: "Розставте етапи обробки одного виклику інструмента в Agent SDK.",
    choices: [
      { id: "a", text: "Перевірка дозволу: правила, режим, за потреби `canUseTool`." },
      { id: "b", text: "Модель повертає блок `tool_use`." },
      { id: "c", text: "Спрацьовує `PostToolUse`-hook." },
      { id: "d", text: "Спрацьовує `PreToolUse`-hook." },
      { id: "e", text: "Інструмент виконується." },
      { id: "f", text: "`tool_result` повертається моделі." },
    ],
    correct: ["b", "d", "a", "e", "c", "f"],
    explanation:
      "Hooks стоять першими в ланцюжку дозволів, а `canUseTool` — останнім, коли нічого інше не вирішило. `PostToolUse` бачить уже готовий результат перед тим, як він піде моделі.",
    codexRef: "dev-agent-sdk-tools",
  },

  // ── Рівень 3: MCP-сервер з нуля ─────────────────────────────────────────
  {
    id: "dm-3-q1",
    domainId: d,
    levelId: "dm-3",
    kind: "single",
    difficulty: 1,
    prompt: "Який високорівневий API офіційного Python SDK для MCP дозволяє написати сервер кількома декораторами?",
    choices: [
      { id: "a", text: "`Flask` з маршрутом `/mcp`.", whyWrong: "Flask — вебфреймворк; протокол MCP (JSON-RPC, lifecycle, схеми) довелося б реалізовувати вручну." },
      { id: "b", text: "`anthropic.Anthropic().tools`.", whyWrong: "Клієнт Messages API не створює MCP-серверів; це інший бік інтеграції." },
      { id: "c", text: "`claude_agent_sdk.create_sdk_mcp_server` як окремий процес.", whyWrong: "Це in-process сервер для агента на Agent SDK, а не самостійний MCP-сервер для будь-якого клієнта." },
      { id: "d", text: "`FastMCP` з `mcp.server.fastmcp`." },
    ],
    correct: ["d"],
    explanation:
      "`FastMCP` з пакета `mcp` бере на себе протокол: декоратори `@mcp.tool()`, `@mcp.resource()`, `@mcp.prompt()` реєструють примітиви, а `mcp.run()` запускає транспорт.",
    codexRef: "dev-mcp-server",
  },
  {
    id: "dm-3-q2",
    domainId: d,
    levelId: "dm-3",
    kind: "single",
    difficulty: 2,
    prompt: "Звідки клієнт дізнається схему вводу та опис інструмента `get_forecast`?",
    code: {
      lang: "python",
      source: `from mcp.server.fastmcp import FastMCP

mcp = FastMCP("weather")

@mcp.tool()
async def get_forecast(latitude: float, longitude: float) -> str:
    """Прогноз погоди на 3 дні для заданих координат."""
    return await fetch_forecast(latitude, longitude)

if __name__ == "__main__":
    mcp.run(transport="stdio")`,
    },
    choices: [
      { id: "a", text: "FastMCP генерує JSON Schema з анотацій типів, а опис бере з docstring." },
      { id: "b", text: "Нізвідки: схему треба вручну передати в `@mcp.tool(schema=...)`.", whyWrong: "FastMCP спеціально виводить схему з сигнатури функції; ручна схема тут не потрібна." },
      { id: "c", text: "Клієнт вгадує параметри з назви функції під час першого виклику.", whyWrong: "Клієнт отримує точну схему через `tools/list` ще до будь-якого виклику." },
      { id: "d", text: "З коментарів у коді, які FastMCP парсить під час запуску.", whyWrong: "Використовуються анотації типів і docstring, а не довільні коментарі." },
    ],
    correct: ["a"],
    explanation:
      "Сигнатура функції стає `inputSchema` (`latitude: number`, `longitude: number`, обидва обов'язкові), а docstring — `description`. Тому анотації типів і docstring у FastMCP — частина контракту з моделлю.",
    codexRef: "dev-mcp-server",
  },
  {
    id: "dm-3-q3",
    domainId: d,
    levelId: "dm-3",
    kind: "single",
    difficulty: 2,
    prompt: "Чого бракує, щоб цей сервер працював як локальний stdio-сервер?",
    code: {
      lang: "ts",
      source: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({ name: "tickets", version: "1.0.0" });

server.registerTool(
  "get_ticket",
  {
    description: "Повертає тікет за його ідентифікатором",
    inputSchema: { id: z.string() },
  },
  async ({ id }) => ({
    content: [{ type: "text", text: JSON.stringify(await db.find(id)) }],
  }),
);`,
    },
    choices: [
      { id: "a", text: "`server.listen(3000)`", whyWrong: "stdio-сервер не слухає порт: він спілкується з клієнтом через stdin/stdout." },
      { id: "b", text: "`await server.connect(new StdioServerTransport())`" },
      { id: "c", text: "Нічого: `McpServer` стартує автоматично після реєстрації першого інструмента.", whyWrong: "Без підключеного транспорту сервер не отримає жодного повідомлення." },
      { id: "d", text: "`export default server`, щоб клієнт імпортував модуль.", whyWrong: "Клієнт не імпортує сервер: він запускає його як підпроцес і обмінюється JSON-RPC." },
    ],
    correct: ["b"],
    explanation:
      "`McpServer` описує примітиви, а транспорт визначає, звідки приходять повідомлення. `StdioServerTransport` з `@modelcontextprotocol/sdk/server/stdio.js` читає JSON-RPC зі stdin і пише відповіді у stdout.",
    codexRef: "dev-mcp-server",
  },
  {
    id: "dm-3-q4",
    domainId: d,
    levelId: "dm-3",
    kind: "multi",
    difficulty: 2,
    prompt: "Які типи блоків можна повертати в масиві `content` результату MCP-інструмента?",
    choices: [
      { id: "a", text: "`text`" },
      { id: "b", text: "`tool_use`", whyWrong: "`tool_use` — блок моделі в Messages API; сервер повертає результат, а не новий виклик." },
      { id: "c", text: "`image` (base64-дані з `mimeType`)" },
      { id: "d", text: "`resource` — вбудований ресурс з `uri` і вмістом" },
    ],
    correct: ["a", "c", "d"],
    explanation:
      "Результат інструмента — масив блоків `text`, `image`, `audio`, вбудованих `resource` або посилань `resource_link`. Клієнт перетворює їх на `tool_result` для моделі.",
    codexRef: "dev-mcp-server",
  },
  {
    id: "dm-3-q5",
    domainId: d,
    levelId: "dm-3",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "Інструмент `get_order` викликає внутрішній API. Для неіснуючого замовлення API відповідає 404. Зараз хендлер кидає виняток, клієнт показує загальну помилку, а агент тричі повторює той самий виклик.",
    prompt: "Як правильно повернути цю ситуацію з інструмента?",
    choices: [
      { id: "a", text: "Повернути порожній `content: []`, щоб не засмічувати контекст.", whyWrong: "Порожня відповідь нічого не пояснює: модель не зрозуміє, що сталося, і спробує знову." },
      { id: "b", text: "Відповісти JSON-RPC-помилкою `-32602 Invalid params`.", whyWrong: "Протокольні помилки призначені для збоїв протоколу; бізнес-результат «не знайдено» має дійти до моделі як результат інструмента." },
      { id: "c", text: "Повернути `isError: true` і текст: замовлення не знайдено, перевірте id через `search_orders`." },
      { id: "d", text: "Повернути звичайний успішний результат із текстом «error».", whyWrong: "Без `isError` клієнт і модель трактують це як успіх; помилка має бути явно позначена." },
    ],
    correct: ["c"],
    explanation:
      "Помилки виконання інструмента повертаються в результаті з `isError: true`, щоб модель їх побачила й скоригувала дії. Корисний текст помилки підказує наступний крок замість сліпого повтору.",
    codexRef: "dev-mcp-server",
  },
  {
    id: "dm-3-q6",
    domainId: d,
    levelId: "dm-3",
    kind: "single",
    difficulty: 3,
    prompt: "Клієнт надіслав `tools/call` з назвою інструмента, якого на сервері немає. Як має відповісти сервер?",
    choices: [
      { id: "a", text: "Протокольною помилкою JSON-RPC у полі `error` відповіді." },
      { id: "b", text: "Результатом з `isError: true` і текстом «unknown tool».", whyWrong: "`isError` призначений для помилок виконання існуючого інструмента; невідоме ім'я — порушення протоколу." },
      { id: "c", text: "Завершити процес сервера, щоб клієнт перепідключився.", whyWrong: "Одна хибна заявка не привід обривати з'єднання для всіх інших викликів." },
      { id: "d", text: "Мовчки проігнорувати запит.", whyWrong: "На кожен JSON-RPC-запит з `id` сервер зобов'язаний відповісти; інакше клієнт висітиме до тайм-ауту." },
    ],
    correct: ["a"],
    explanation:
      "MCP розрізняє два шари: протокольні помилки (невідомий інструмент, неправильний запит) повертаються як JSON-RPC `error`, а збої всередині інструмента — як результат з `isError: true`.",
    codexRef: "dev-mcp-server",
  },
  {
    id: "dm-3-q7",
    domainId: d,
    levelId: "dm-3",
    kind: "single",
    difficulty: 3,
    prompt: "Інструмент оголошує `outputSchema`. Що має містити його успішний результат?",
    choices: [
      { id: "a", text: "Лише текстовий блок із JSON; клієнт сам звірить його зі схемою.", whyWrong: "Для інструмента з `outputSchema` структуровані дані передаються окремим полем, а не лише текстом." },
      { id: "b", text: "Поле `structuredContent`, що відповідає схемі; для сумісності той самий JSON варто дублювати в текстовому блоці." },
      { id: "c", text: "Блок `resource` з URI схеми.", whyWrong: "Схема вже відома клієнту з `tools/list`; результат несе дані, а не посилання на схему." },
      { id: "d", text: "Нічого особливого: `outputSchema` — лише документація для людей.", whyWrong: "Клієнти можуть валідувати `structuredContent` за схемою; це частина контракту." },
    ],
    correct: ["b"],
    explanation:
      "`outputSchema` обіцяє клієнту форму даних, а `structuredContent` її виконує. Дубль у `content` як текст допомагає клієнтам, які ще не підтримують структурований вивід.",
    codexRef: "dev-mcp-server",
  },

  // ── Рівень 4: Транспорти, resources, prompts ────────────────────────────
  {
    id: "dm-4-q1",
    domainId: d,
    levelId: "dm-4",
    kind: "single",
    difficulty: 1,
    prompt: "Як клієнт працює з MCP-сервером через транспорт stdio?",
    choices: [
      { id: "a", text: "Під'єднується до локального порту, який сервер відкриває при старті.", whyWrong: "Портів у stdio немає: це робота Streamable HTTP." },
      { id: "b", text: "Запускає сервер як підпроцес і обмінюється JSON-RPC через його stdin і stdout." },
      { id: "c", text: "Відкриває WebSocket до сервера.", whyWrong: "WebSocket не є стандартним транспортом MCP." },
      { id: "d", text: "Передає запити через хмару Anthropic, яка викликає сервер.", whyWrong: "stdio — суто локальний канал між двома процесами на одній машині." },
    ],
    correct: ["b"],
    explanation:
      "Для stdio клієнт сам стартує процес сервера (`command` + `args`) і пише JSON-RPC-повідомлення в його stdin, по одному на рядок; відповіді читає зі stdout.",
    codexRef: "dev-mcp-transports",
  },
  {
    id: "dm-4-q2",
    domainId: d,
    levelId: "dm-4",
    kind: "single",
    difficulty: 2,
    prompt: "Що сервер відкриває назовні для транспорту Streamable HTTP?",
    choices: [
      { id: "a", text: "Два ендпоінти: `/sse` для потоку подій і `/messages` для запитів.", whyWrong: "Це застарілий транспорт HTTP+SSE, який Streamable HTTP замінив." },
      { id: "b", text: "gRPC-сервіс зі згенерованими стабами.", whyWrong: "MCP використовує JSON-RPC 2.0, а не gRPC." },
      { id: "c", text: "Один ендпоінт (наприклад, `/mcp`), що приймає POST, а за потреби GET для потоку SSE." },
      { id: "d", text: "Окремий REST-маршрут на кожен інструмент.", whyWrong: "Інструменти викликаються методом `tools/call` через той самий ендпоінт, а не окремими маршрутами." },
    ],
    correct: ["c"],
    explanation:
      "У Streamable HTTP клієнт надсилає кожне повідомлення POST-ом на один ендпоінт. Сервер відповідає звичайним JSON або відкриває SSE-потік, якщо треба надіслати кілька повідомлень.",
    codexRef: "dev-mcp-transports",
  },
  {
    id: "dm-4-q3",
    domainId: d,
    levelId: "dm-4",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "Stateful MCP-сервер на Streamable HTTP масштабували до трьох інстансів за балансувальником з round-robin. Після цього клієнти стабільно отримують помилку невідомої сесії на другому-третьому запиті, хоча `initialize` проходить успішно.",
    prompt: "У чому причина і що робити?",
    choices: [
      { id: "a", text: "Сесія, видана в `Mcp-Session-Id`, живе в пам'яті одного інстансу; потрібні sticky sessions, спільне сховище сесій або stateless-режим." },
      { id: "b", text: "Клієнти мають перейти на stdio.", whyWrong: "Віддалений сервер для багатьох клієнтів не можна запускати як локальний підпроцес." },
      { id: "c", text: "Треба збільшити тайм-аут на балансувальнику.", whyWrong: "Тайм-аут тут ні до чого: запит просто потрапляє на інстанс, який не знає цієї сесії." },
      { id: "d", text: "Треба вимкнути перевірку заголовка `Origin`.", whyWrong: "Перевірка `Origin` захищає від DNS rebinding і не пов'язана з маршрутизацією сесій." },
    ],
    correct: ["a"],
    explanation:
      "Сервер видає `Mcp-Session-Id` під час ініціалізації, і клієнт шле його в кожному запиті. Якщо стан сесії локальний, всі запити сесії мають потрапляти на той самий інстанс, або стан треба винести назовні.",
    codexRef: "dev-mcp-transports",
  },
  {
    id: "dm-4-q4",
    domainId: d,
    levelId: "dm-4",
    kind: "single",
    difficulty: 2,
    prompt: "Яким методом JSON-RPC клієнт отримає вміст цього ресурсу?",
    code: {
      lang: "ts",
      source: `server.registerResource(
  "app-config",
  "config://app",
  { title: "Конфігурація застосунку", mimeType: "application/json" },
  async (uri) => ({
    contents: [{ uri: uri.href, text: JSON.stringify(config) }],
  }),
);`,
    },
    choices: [
      { id: "a", text: "`tools/call` з `name: \"app-config\"`.", whyWrong: "Ресурс не є інструментом і не з'являється в `tools/list`." },
      { id: "b", text: "`resources/list`.", whyWrong: "`resources/list` повертає лише перелік ресурсів з метаданими, без вмісту." },
      { id: "c", text: "`prompts/get` з `name: \"app-config\"`.", whyWrong: "Prompts — окремий примітив для шаблонів повідомлень." },
      { id: "d", text: "`resources/read` з `uri: \"config://app\"`." },
    ],
    correct: ["d"],
    explanation:
      "Ресурси адресуються за URI: `resources/list` показує, які є, а `resources/read` повертає `contents` конкретного URI. Вирішує, коли читати ресурс, застосунок, а не модель.",
    codexRef: "dev-mcp-transports",
  },
  {
    id: "dm-4-q5",
    domainId: d,
    levelId: "dm-4",
    kind: "single",
    difficulty: 3,
    prompt: "Сервер має віддавати профіль будь-якого користувача за адресою `users://{userId}/profile`. Як це реалізувати?",
    choices: [
      { id: "a", text: "При старті зареєструвати окремий ресурс для кожного користувача з бази.", whyWrong: "Не масштабується і застаріває при появі нових користувачів." },
      { id: "b", text: "Ресурс-шаблон (`ResourceTemplate`) з URI template; клієнт бачить його через `resources/templates/list`." },
      { id: "c", text: "Інструмент `get_profile`, бо ресурси не підтримують параметрів.", whyWrong: "Параметризовані ресурси підтримуються шаблонами URI; інструмент тут доречний, лише якщо рішення має ухвалювати модель." },
      { id: "d", text: "Prompt з аргументом `userId`.", whyWrong: "Prompts повертають шаблони повідомлень, а не дані за адресою." },
    ],
    correct: ["b"],
    explanation:
      "Resource templates описують цілий простір URI за шаблоном RFC 6570. Клієнт підставляє параметри й читає конкретний URI звичайним `resources/read`.",
    codexRef: "dev-mcp-transports",
  },
  {
    id: "dm-4-q6",
    domainId: d,
    levelId: "dm-4",
    kind: "multi",
    difficulty: 2,
    prompt: "Що правда про примітив prompts у MCP?",
    choices: [
      { id: "a", text: "Prompt виконується на сервері: сервер сам викликає модель і повертає відповідь.", whyWrong: "Сервер лише повертає шаблон повідомлень; модель викликає клієнт." },
      { id: "b", text: "`prompts/get` приймає аргументи і повертає список `messages`." },
      { id: "c", text: "Зазвичай їх явно викликає користувач, наприклад як slash-команду в Claude Code." },
      { id: "d", text: "Сервер оголошує аргументи prompt-а, зокрема які з них обов'язкові." },
    ],
    correct: ["b", "c", "d"],
    explanation:
      "Prompts — це шаблони, керовані користувачем. Claude Code показує їх як команди `/mcp__<server>__<prompt>`, а сервер лише підставляє аргументи й повертає готові повідомлення.",
    codexRef: "dev-mcp-transports",
  },
  {
    id: "dm-4-q7",
    domainId: d,
    levelId: "dm-4",
    kind: "single",
    difficulty: 3,
    prompt: "Віддалений MCP-сервер з OAuth отримав запит без токена. Як він має відповісти за специфікацією авторизації MCP?",
    choices: [
      { id: "a", text: "HTTP 302 на сторінку логіну.", whyWrong: "MCP-клієнт — не браузер; сторінку логіну відкриває сам клієнт після discovery." },
      { id: "b", text: "HTTP 403 з HTML-формою входу.", whyWrong: "403 означає «доступ заборонено» автентифікованому користувачу; клієнту треба машиночитна вказівка, куди йти по токен." },
      { id: "c", text: "HTTP 401 із заголовком `WWW-Authenticate`, що вказує на Protected Resource Metadata сервера." },
      { id: "d", text: "Успішний результат з проханням передати API-ключ аргументом інструмента.", whyWrong: "Секрети в аргументах проходять через контекст моделі; автентифікація має бути на рівні транспорту." },
    ],
    correct: ["c"],
    explanation:
      "401 з `WWW-Authenticate` запускає discovery: клієнт читає `/.well-known/oauth-protected-resource`, знаходить сервер авторизації та проходить OAuth 2.1 з PKCE, після чого повторює запит з bearer-токеном.",
    codexRef: "dev-mcp-transports",
  },

  // ── Рівень 5: Тестування та налагодження MCP ────────────────────────────
  {
    id: "dm-5-q1",
    domainId: d,
    levelId: "dm-5",
    kind: "single",
    difficulty: 1,
    prompt: "Як запустити MCP Inspector для локального stdio-сервера `build/index.js`?",
    choices: [
      { id: "a", text: "`node --inspect build/index.js`", whyWrong: "Це відлагоджувач Node.js; він не говорить протоколом MCP і не показує інструменти." },
      { id: "b", text: "`claude mcp inspect build/index.js`", whyWrong: "Такої підкоманди в Claude Code немає; Inspector — окремий інструмент." },
      { id: "c", text: "`npx @modelcontextprotocol/inspector node build/index.js`" },
      { id: "d", text: "`curl -X POST localhost:3000/mcp`", whyWrong: "stdio-сервер не слухає порт; до того ж так вручну не пройти ініціалізацію." },
    ],
    correct: ["c"],
    explanation:
      "Inspector запускає ваш сервер як підпроцес і відкриває вебінтерфейс: можна переглянути `tools/list`, викликати інструменти з довільними аргументами, читати ресурси й бачити сповіщення.",
    codexRef: "dev-mcp-debugging",
  },
  {
    id: "dm-5-q2",
    domainId: d,
    levelId: "dm-5",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "Python-сервер на FastMCP проходить юніт-тести хендлерів, але в Claude Code з'єднання падає одразу після запуску або інструменти час від часу «зникають». У коді хендлерів розставлено `print(\"debug:\", args)`.",
    prompt: "Що ламає роботу сервера?",
    choices: [
      { id: "a", text: "`print` пише у stdout, змішуючи сміття з JSON-RPC; логи треба писати в stderr (через `logging` або `file=sys.stderr`)." },
      { id: "b", text: "Claude Code не підтримує Python-сервери.", whyWrong: "Мова сервера не важлива: клієнт бачить лише JSON-RPC через stdio." },
      { id: "c", text: "Потрібен транспорт Streamable HTTP, бо stdio нестабільний.", whyWrong: "stdio стабільний, якщо у stdout не пишуть нічого, крім повідомлень протоколу." },
      { id: "d", text: "Інструменти треба реєструвати після `mcp.run()`.", whyWrong: "`mcp.run()` блокує виконання; реєстрація має бути до запуску." },
    ],
    correct: ["a"],
    explanation:
      "Для stdio-сервера stdout — канал протоколу: будь-який рядок, що не є JSON-RPC, ламає парсинг на боці клієнта. Діагностика йде в stderr.",
    codexRef: "dev-mcp-debugging",
  },
  {
    id: "dm-5-q3",
    domainId: d,
    levelId: "dm-5",
    kind: "single",
    difficulty: 3,
    prompt: "Який спосіб логування безпечний у TypeScript stdio-сервері?",
    choices: [
      { id: "a", text: "`console.info(...)`: інформаційні повідомлення йдуть окремим каналом.", whyWrong: "У Node.js `console.info` — псевдонім `console.log` і пише у stdout." },
      { id: "b", text: "`process.stdout.write(...)` з префіксом `LOG:`.", whyWrong: "Префікс не допоможе: клієнт очікує у stdout лише JSON-RPC." },
      { id: "c", text: "`console.log(...)`, якщо обгорнути повідомлення в JSON.", whyWrong: "Валідний JSON — ще не валідне JSON-RPC-повідомлення; клієнт зламається або проігнорує його з помилкою." },
      { id: "d", text: "`console.error(...)`, бо він пише в stderr." },
    ],
    correct: ["d"],
    explanation:
      "`console.error` і `console.warn` пишуть у stderr, який клієнт не парсить як протокол. `console.log`, `console.info` і `console.debug` пишуть у stdout і в stdio-сервері небезпечні.",
    codexRef: "dev-mcp-debugging",
  },
  {
    id: "dm-5-q4",
    domainId: d,
    levelId: "dm-5",
    kind: "multi",
    difficulty: 3,
    prompt: "Що варто перевіряти в контрактних тестах MCP-сервера?",
    choices: [
      { id: "a", text: "Що модель обирає саме цей інструмент для типового запиту користувача.", whyWrong: "Це вже eval поведінки моделі: недетермінований і дорогий, він не замінює контрактних тестів." },
      { id: "b", text: "Імена інструментів і їхні `inputSchema` у `tools/list` збігаються зі збереженим знімком." },
      { id: "c", text: "Виклик із валідними аргументами повертає очікуваний `content` або `structuredContent`." },
      { id: "d", text: "Збій зовнішньої залежності дає результат з `isError: true` і зрозумілим текстом." },
    ],
    correct: ["b", "c", "d"],
    explanation:
      "Контракт сервера — це його інструменти, схеми та форма результатів, включно з помилками. Їх можна перевірити детерміновано через MCP-клієнт без жодної моделі.",
    codexRef: "dev-mcp-debugging",
  },
  {
    id: "dm-5-q5",
    domainId: d,
    levelId: "dm-5",
    kind: "single",
    difficulty: 3,
    prompt: "Яка головна перевага такого тесту перед запуском сервера як підпроцесу через stdio?",
    code: {
      lang: "ts",
      source: `import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
await server.connect(serverTransport);

const client = new Client({ name: "contract-test", version: "1.0.0" });
await client.connect(clientTransport);

const res = await client.callTool({ name: "get_ticket", arguments: { id: "T-1" } });
expect(res.isError).toBeFalsy();`,
    },
    choices: [
      { id: "a", text: "Він також ловить сміття у stdout сервера.", whyWrong: "Навпаки: in-memory транспорт обходить stdio, тож забруднення stdout він не виявить." },
      { id: "b", text: "Він швидкий і детермінований: справжній протокол (ініціалізація, схеми, серіалізація) без процесів і портів." },
      { id: "c", text: "Він перевіряє, чи модель правильно заповнює аргументи.", whyWrong: "Моделі в тесті немає; аргументи задає сам тест." },
      { id: "d", text: "Він не потребує жодного коду сервера, лише його схеми.", whyWrong: "Тест піднімає справжній `server` з хендлерами; саме це він і перевіряє." },
    ],
    correct: ["b"],
    explanation:
      "`InMemoryTransport.createLinkedPair()` з'єднує клієнт і сервер у межах одного процесу. Тест проходить увесь протокольний шар, але лишається швидким; окремий smoke-тест через stdio все одно корисний для перевірки запуску.",
    codexRef: "dev-mcp-debugging",
  },
  {
    id: "dm-5-q6",
    domainId: d,
    levelId: "dm-5",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "У новій версії MCP-сервера параметр `ticketId` інструмента `get_ticket` перейменували на `id`. Після деплою кілька команд поскаржилися, що їхні агенти й скрипти на прямих `tools/call` почали отримувати помилки валідації.",
    prompt: "Як треба було випустити цю зміну?",
    choices: [
      { id: "a", text: "Змінити `protocolVersion` у відповіді на `initialize`, щоб клієнти помітили новий контракт.", whyWrong: "`protocolVersion` — версія специфікації MCP, а не вашого API; довільні значення зламають узгодження." },
      { id: "b", text: "Покластися на `notifications/tools/list_changed`: клієнти самі підхоплять нову схему.", whyWrong: "Сповіщення оновить список у клієнта, але не виправить код і скрипти, що передають старий параметр." },
      { id: "c", text: "Так само, але одночасно оновити опис інструмента.", whyWrong: "Ламаюча зміна лишається ламаючою незалежно від опису." },
      { id: "d", text: "Зберегти сумісність: приймати обидва параметри на перехідний період, позначити старий як deprecated і підняти `version` сервера; ламаючі зміни — через нову назву інструмента." },
    ],
    correct: ["d"],
    explanation:
      "Схема інструмента — публічний контракт. Додавати опційні поля безпечно, а перейменування й видалення варто проводити через перехідний період або нову назву інструмента, фіксуючи зміни у версії сервера.",
    codexRef: "dev-mcp-debugging",
  },
  {
    id: "dm-5-q7",
    domainId: d,
    levelId: "dm-5",
    kind: "single",
    difficulty: 2,
    prompt: "MCP-сервер у Claude Code не з'являється серед доступних. З чого почати діагностику в самому Claude Code?",
    choices: [
      { id: "a", text: "Подивитися у stdout сервера: там і протокол, і логи.", whyWrong: "stdout — канал протоколу; логи мають бути в stderr, а стан з'єднання показує сам клієнт." },
      { id: "b", text: "Команда `/mcp` для статусу серверів і запуск `claude --debug` для детальних логів." },
      { id: "c", text: "Попросити модель у промпті повідомляти про помилки MCP.", whyWrong: "Модель не бачить сервер, який не під'єднався; вона просто не матиме його інструментів." },
      { id: "d", text: "Перезапускати Claude Code, поки сервер не під'єднається.", whyWrong: "Детермінована помилка (шлях, змінні середовища, падіння при старті) повторюватиметься щоразу." },
    ],
    correct: ["b"],
    explanation:
      "`/mcp` показує, які сервери під'єднані, які впали і скільки інструментів вони надали. `--debug` виводить подробиці запуску й помилок, зокрема вивід сервера в stderr.",
    codexRef: "dev-mcp-debugging",
  },

  // ── Бос: Агент на MCP у продакшні ───────────────────────────────────────
  {
    id: "dm-boss-q1",
    domainId: d,
    levelId: "dm-boss",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "Сервіс на Agent SDK у Docker-контейнері підключає stdio MCP-сервер тікетів. Локально все працює, а в продакшні агент відповідає «у мене немає доступу до тікетів». У повідомленні `init` видно `mcp_servers: [{ name: \"tickets\", status: \"failed\" }]`.",
    prompt: "Що зробити в першу чергу?",
    choices: [
      { id: "a", text: "Додати в системний промпт: «Завжди використовуй інструменти тікетів».", whyWrong: "Інструментів немає в контексті взагалі: сервер не запустився, і промпт цього не змінить." },
      { id: "b", text: "Увімкнути `bypassPermissions`, щоб зняти обмеження доступу.", whyWrong: "Проблема не в дозволах: сервер не під'єднався, тож дозволяти нема чого." },
      { id: "c", text: "Відтворити команду сервера всередині контейнера (шлях, runtime, змінні середовища) і в коді перевіряти статус у `init`, зупиняючи запуск, якщо сервер не `connected`." },
      { id: "d", text: "Повторювати `query()`, поки сервер не під'єднається.", whyWrong: "Падіння при старті в контейнері зазвичай детерміноване: відсутній файл чи змінна середовища." },
    ],
    correct: ["c"],
    explanation:
      "`init` чесно повідомляє стан кожного MCP-сервера. Продакшн-код має перевіряти його й падати голосно, а причина `failed` майже завжди в середовищі контейнера: інший шлях, немає runtime або секрету.",
    codexRef: "dev-agents-boss",
  },
  {
    id: "dm-boss-q2",
    domainId: d,
    levelId: "dm-boss",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "Агент підтримки на Agent SDK використовує MCP-сервер `tickets`: `get_ticket`, `search_tickets` і `close_ticket`. Читати тікети він має вільно, а кожне закриття має підтвердити людина через Slack.",
    prompt: "Як налаштувати дозволи?",
    choices: [
      { id: "a", text: "Додати `close_ticket` у `disallowedTools`, а закривати тікети вручну.", whyWrong: "Так агент ніколи не зможе закрити тікет навіть після схвалення людини." },
      { id: "b", text: "Дозволити `mcp__tickets__get_ticket` і `mcp__tickets__search_tickets` в `allowedTools`, а `close_ticket` пропускати через `canUseTool`, який чекає рішення зі Slack." },
      { id: "c", text: "Увімкнути `bypassPermissions` і в промпті попросити питати людину перед закриттям.", whyWrong: "У `bypassPermissions` запитів на дозвіл немає, а прохання в промпті не є технічним контролем." },
      { id: "d", text: "`PostToolUse`-hook на `close_ticket`, що надсилає повідомлення в Slack.", whyWrong: "`PostToolUse` спрацьовує після закриття: людина дізнається постфактум." },
    ],
    correct: ["b"],
    explanation:
      "`allowedTools` схвалює безпечні читальні виклики без питань, а все, що не вирішили правила й режим, потрапляє в `canUseTool`. Там і реалізується людське підтвердження з `allow` або `deny`.",
    codexRef: "dev-agents-boss",
  },
  {
    id: "dm-boss-q3",
    domainId: d,
    levelId: "dm-boss",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "Один MCP-сервер на Streamable HTTP обслуговує агентів кількох клієнтів компанії. Інструмент `search_invoices` приймає `tenant_id` аргументом, і на рев'ю безпеки питають, що завадить агентові клієнта A передати `tenant_id` клієнта B.",
    prompt: "Як правильно ізолювати дані?",
    choices: [
      { id: "a", text: "Визначати tenant з перевіреного OAuth-токена запиту на боці сервера й ігнорувати будь-які tenant-аргументи від моделі." },
      { id: "b", text: "Прописати `tenant_id` у системному промпті кожного агента.", whyWrong: "Модель може помилитися або піддатися prompt injection; значення з контексту не є доказом прав." },
      { id: "c", text: "Додати в опис інструмента: «Використовуй лише свій tenant_id».", whyWrong: "Опис — прохання до моделі, а не перевірка доступу." },
      { id: "d", text: "Шифрувати `tenant_id` в аргументі.", whyWrong: "Шифрування не доводить, що викликач має право на цього tenant-а." },
    ],
    correct: ["a"],
    explanation:
      "Межа довіри проходить на рівні транспорту: сервер валідує токен (зокрема його audience) і бере з нього ідентичність. Усе, що заповнює модель, — недовірений ввід.",
    codexRef: "dev-agents-boss",
  },
  {
    id: "dm-boss-q4",
    domainId: d,
    levelId: "dm-boss",
    kind: "multi",
    difficulty: 3,
    prompt: "Що з переліченого входить у мінімальну готовність до продакшну для агента на Agent SDK з власним MCP-сервером?",
    choices: [
      { id: "a", text: "`bypassPermissions`, щоб headless-агент ніколи не зависав на запиті дозволу.", whyWrong: "Це прибирає контроль саме там, де його ніхто не дублює; краще явні `allowedTools` і `canUseTool`." },
      { id: "b", text: "`maxTurns` і обробка `result` з `subtype: \"error_max_turns\"`." },
      { id: "c", text: "Логування `session_id`, `total_cost_usd` і `num_turns` з повідомлення `result`." },
      { id: "d", text: "Контрактні тести MCP-сервера в CI." },
      { id: "e", text: "Логи MCP-сервера у stdout, щоб їх збирав Docker.", whyWrong: "Для stdio-сервера stdout — канал протоколу; логи — в stderr, який Docker так само збирає." },
    ],
    correct: ["b", "c", "d"],
    explanation:
      "Продакшн-агенту потрібні межа на кількість ходів, спостережуваність кожного запуску та автоматична перевірка контракту інструментів. Послаблення дозволів і логи у stdout створюють нові аварії замість того, щоб їх запобігати.",
    codexRef: "dev-agents-boss",
  },
  {
    id: "dm-boss-q5",
    domainId: d,
    levelId: "dm-boss",
    kind: "order",
    difficulty: 3,
    prompt: "Після деплою нової версії MCP-сервера агент почав провалювати задачі з `create_invoice`. Розставте кроки розслідування.",
    choices: [
      { id: "a", text: "Написати контрактний тест, що відтворює збій." },
      { id: "b", text: "За `session_id` з логів знайти запуск і виклик, що впав, разом з аргументами." },
      { id: "c", text: "Прогнати eval агента на сценаріях з рахунками, щоб підтвердити виправлення." },
      { id: "d", text: "Відтворити виклик з тими самими аргументами в MCP Inspector." },
      { id: "e", text: "Виправити хендлер або схему зі збереженням сумісності й задеплоїти." },
    ],
    correct: ["b", "d", "a", "e", "c"],
    explanation:
      "Спершу локалізувати збій за логами, потім відтворити його без моделі, зафіксувати тестом, виправити й наприкінці перевірити поведінку агента цілком.",
    codexRef: "dev-agents-boss",
  },
];
