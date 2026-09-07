/**
 * Ручний прохід гри у справжньому браузері: створення персонажа, бій,
 * перевірка збереження після перезавантаження, довідник, тренування.
 * Запуск: npm run start (в іншому терміналі), потім `node scripts/smoke.mjs`.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const SHOTS = process.env.SHOT_DIR ?? "./.smoke";
mkdirSync(SHOTS, { recursive: true });

const log = (...a) => console.log("•", ...a);
const fail = (msg) => {
  console.error("✗", msg);
  process.exitCode = 1;
};

// Використовуємо системний Chrome, щоб не тягнути окремі бінарники Playwright.
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL ?? "chrome",
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

// 1. Онбординг
await page.goto(BASE, { waitUntil: "networkidle" });
await page.fill("#player-name", "Ростислав");
await page.screenshot({ path: `${SHOTS}/01-onboarding.png` });
await page.click('button[type="submit"]');
await page.waitForSelector("text=Карта світів");
await page.waitForTimeout(1200); // даємо відпрацювати анімаціям появи
log("персонажа створено");
await page.screenshot({ path: `${SHOTS}/02-map.png`, fullPage: true });

// 2. Світ і бій
await page.click('a[href="/world/agentic-architecture"]');
await page.waitForSelector("text=Долина Агентів");
await page.waitForTimeout(1200);
await page.screenshot({ path: `${SHOTS}/03-world.png`, fullPage: true });

await page.click('a[href="/play/aa-1"]');
await page.waitForSelector("text=Одна правильна відповідь");
await page.waitForTimeout(400);
await page.screenshot({ path: `${SHOTS}/04-battle.png`, fullPage: true });

// Проходимо рівень, обираючи перший доступний варіант:
// мета — механіка бою, а не правильність відповідей.
let answered = 0;
for (let i = 0; i < 8; i++) {
  const done = await page.locator("text=Рівень пройдено").count();
  if (done) break;
  const buttons = page.locator("ul li button, ol li");
  const count = await buttons.count();
  if (count === 0) break;
  // Обираємо перший доступний варіант — мета тесту не в правильності, а в механіці.
  const kind = await page.locator(".eyebrow").first().textContent();
  if (!kind?.includes("порядку")) {
    await buttons.first().click();
  }
  await page.click("text=Відповісти");
  await page.waitForSelector("text=/Правильно|Помилка/");
  answered++;
  if (answered === 1) await page.screenshot({ path: `${SHOTS}/05-feedback.png`, fullPage: true });
  const nextBtn = page.locator("button", { hasText: /Далі|Підсумок/ });
  if (await nextBtn.count()) await nextBtn.first().click();
  await page.waitForTimeout(250);
}
log(`відповіли на ${answered} питань`);
await page.screenshot({ path: `${SHOTS}/06-result.png`, fullPage: true });

// 3. Збереження переживає перезавантаження
const saved = await page.evaluate(() => localStorage.getItem("cca-quest-save-v1"));
if (!saved) fail("localStorage порожній — прогрес не зберігся");
else {
  const state = JSON.parse(saved).state;
  log(`збережено: XP ${state.player.xp}, рівнів ${Object.keys(state.progress).length}`);
  if (state.player.name !== "Ростислав") fail("ім'я гравця не збереглося");
}

await page.goto(BASE, { waitUntil: "networkidle" });
const nameShown = await page.locator("text=Ростислав").count();
if (!nameShown) fail("після перезавантаження гравця не відновлено");
else log("прогрес відновлено після перезавантаження");

// 4. Довідник
await page.goto(`${BASE}/codex`, { waitUntil: "networkidle" });
await page.screenshot({ path: `${SHOTS}/07-codex.png`, fullPage: true });
await page.goto(`${BASE}/codex/agentic-loop`, { waitUntil: "networkidle" });
const locked = await page.locator("text=Стаття заблокована").count();
const unlockedArticle = await page.locator("text=Канонічний цикл").count();
log(locked ? "стаття заблокована (рівень не пройдено)" : "стаття відкрита");
if (!locked && !unlockedArticle) fail("вміст статті не відрендерився");
await page.screenshot({ path: `${SHOTS}/08-codex-entry.png`, fullPage: true });

// 5. Тренування та профіль
await page.goto(`${BASE}/train`, { waitUntil: "networkidle" });
await page.screenshot({ path: `${SHOTS}/09-train.png`, fullPage: true });
await page.goto(`${BASE}/stats`, { waitUntil: "networkidle" });
await page.screenshot({ path: `${SHOTS}/10-stats.png`, fullPage: true });

// 6. Мобільний вигляд
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(`${BASE}/play/aa-1`, { waitUntil: "networkidle" });
const overflow = await mobile.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
);
if (overflow > 2) fail(`горизонтальний скрол на мобільному: ${overflow}px`);
else log("мобільний вигляд без горизонтального скролу");
await mobile.screenshot({ path: `${SHOTS}/11-mobile.png`, fullPage: true });

if (errors.length) {
  fail(`помилки в консолі:\n   ${errors.slice(0, 5).join("\n   ")}`);
} else {
  log("помилок у консолі немає");
}

await browser.close();
console.log(process.exitCode ? "\n✗ Прохід із зауваженнями" : "\n✓ Прохід успішний");
