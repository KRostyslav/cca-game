/**
 * Перевіряє цілісність навчального контенту перед білдом.
 * Запуск: npm run validate:content
 */
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  allDomains,
  allLevels,
  allQuestions,
  levelsOfDomain,
  questionsOfLevel,
  translatedQuestionIds,
} from "../content";
import { domainSchema, levelSchema, questionSchema } from "../lib/content/schema";
import { EXAM_QUESTIONS } from "../lib/game/constants";
import { examQuota } from "../lib/game/examBuilder";

const errors: string[] = [];
const warnings: string[] = [];

for (const domain of allDomains) {
  const parsed = domainSchema.safeParse(domain);
  if (!parsed.success) {
    errors.push(`Домен ${domain.id}: ${parsed.error.issues.map((i) => i.message).join("; ")}`);
  }
}

const weightSum = allDomains.reduce((acc, d) => acc + d.weight, 0);
if (Math.abs(weightSum - 1) > 0.001) {
  errors.push(`Сума ваг доменів = ${weightSum.toFixed(3)}, має бути 1.000`);
}

const levelIds = new Set<string>();
for (const level of allLevels) {
  const parsed = levelSchema.safeParse(level);
  if (!parsed.success) {
    errors.push(`Рівень ${level.id}: ${parsed.error.issues.map((i) => i.message).join("; ")}`);
  }
  if (levelIds.has(level.id)) errors.push(`Дубльований id рівня: ${level.id}`);
  levelIds.add(level.id);
}

const questionIds = new Set<string>();
for (const question of allQuestions) {
  const parsed = questionSchema.safeParse(question);
  if (!parsed.success) {
    errors.push(`Питання ${question.id}: ${parsed.error.issues.map((i) => i.message).join("; ")}`);
  }
  if (questionIds.has(question.id)) errors.push(`Дубльований id питання: ${question.id}`);
  questionIds.add(question.id);
  if (!levelIds.has(question.levelId)) {
    errors.push(`Питання ${question.id} посилається на неіснуючий рівень ${question.levelId}`);
  }
  const level = allLevels.find((l) => l.id === question.levelId);
  if (level && level.domainId !== question.domainId) {
    errors.push(`Питання ${question.id}: домен не збігається з доменом рівня ${level.id}`);
  }
}

// Кожен questionId рівня має існувати; кожне питання має бути прив'язане до рівня.
for (const level of allLevels) {
  for (const qid of level.questionIds) {
    if (!questionIds.has(qid)) {
      errors.push(`Рівень ${level.id} посилається на неіснуюче питання ${qid}`);
    }
  }
  if (questionsOfLevel(level.id).length === 0) {
    errors.push(`Рівень ${level.id} не має жодного питання`);
  }
}
const attached = new Set(allLevels.flatMap((l) => l.questionIds));
for (const question of allQuestions) {
  if (!attached.has(question.id)) {
    errors.push(`Питання ${question.id} не включене до жодного рівня`);
  }
}

// Англійський дубль: без нього гра не готує до формулювань справжнього екзамену.
const translated = translatedQuestionIds();
const missingEn: string[] = [];
for (const question of allQuestions) {
  if (!translated.has(question.id)) {
    missingEn.push(question.id);
    continue;
  }
  const ids = new Set(question.choices.map((c) => c.id));
  const enIds = new Set(Object.keys(question.en.choices));
  for (const id of ids) {
    if (!enIds.has(id)) errors.push(`${question.id}: немає англійського тексту варіанта "${id}"`);
  }
  for (const id of enIds) {
    if (!ids.has(id)) errors.push(`${question.id}: en.choices містить неіснуючий варіант "${id}"`);
  }
  for (const choice of question.choices) {
    if (choice.whyWrong && !question.en.whyWrong?.[choice.id]) {
      errors.push(`${question.id}: немає англійського whyWrong для варіанта "${choice.id}"`);
    }
  }
  if (Boolean(question.scenario) !== Boolean(question.en.scenario)) {
    errors.push(`${question.id}: scenario має бути присутній в обох мовах або в жодній`);
  }
  if (question.en.prompt.trim().length < 10) {
    errors.push(`${question.id}: англійський prompt надто короткий`);
  }
  if (question.en.explanation.trim().length < 20) {
    errors.push(`${question.id}: англійське пояснення надто коротке`);
  }
}
if (missingEn.length > 0) {
  errors.push(
    `Без англійського дубля: ${missingEn.length} питань (${missingEn.slice(0, 5).join(", ")}${missingEn.length > 5 ? ", …" : ""})`,
  );
}

// Довідники: кожен codexRef має мати файл, і кожен рівень — свою статтю.
const codexDir = join(process.cwd(), "content", "codex");
const codexFiles = existsSync(codexDir)
  ? new Set(readdirSync(codexDir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")))
  : new Set<string>();

for (const ref of new Set([...allLevels.map((l) => l.codexRef), ...allQuestions.map((q) => q.codexRef)])) {
  if (!codexFiles.has(ref)) errors.push(`Немає статті довідника: content/codex/${ref}.md`);
}
for (const slug of codexFiles) {
  if (!allLevels.some((l) => l.codexRef === slug)) {
    warnings.push(`Стаття ${slug}.md не прив'язана до жодного рівня — вона лишиться заблокованою`);
  }
}

// Розподіл питань має відповідати вагам екзамену з допуском ±3 в.п.
for (const domain of allDomains) {
  const count = allQuestions.filter((q) => q.domainId === domain.id).length;
  const share = count / allQuestions.length;
  const delta = Math.abs(share - domain.weight);
  if (delta > 0.03) {
    warnings.push(
      `Домен ${domain.id}: ${count} питань = ${(share * 100).toFixed(1)}%, вага екзамену ${(domain.weight * 100).toFixed(0)}%`,
    );
  }
  const quota = examQuota()[domain.id];
  if (count < quota) {
    errors.push(`Домен ${domain.id}: ${count} питань, а екзамен потребує ${quota}`);
  }
}

const quotaSum = Object.values(examQuota()).reduce((a, b) => a + b, 0);
if (quotaSum !== EXAM_QUESTIONS) {
  errors.push(`Квота екзамену дає ${quotaSum} питань замість ${EXAM_QUESTIONS}`);
}

// Довідково: перекос у сирих даних не критичний — порядок варіантів
// перемішується на показі (lib/game/present.ts), — але зсув видно одразу.
const positions: Record<string, number> = {};
for (const question of allQuestions) {
  if (question.kind === "order") continue;
  const at = question.choices.findIndex((c) => question.correct.includes(c.id));
  const key = String.fromCharCode(97 + at);
  positions[key] = (positions[key] ?? 0) + 1;
}

console.log(`Доменів: ${allDomains.length}`);
console.log(`Рівнів: ${allLevels.length} (босів: ${allLevels.filter((l) => l.boss).length})`);
console.log(`Питань: ${allQuestions.length}`);
console.log(`Статей довідника: ${codexFiles.size}`);
console.log(`Англійський дубль: ${translated.size}/${allQuestions.length}`);
console.log(
  `Позиція правильної відповіді в сирих даних: ${Object.entries(positions)
    .sort()
    .map(([k, v]) => `${k}=${v}`)
    .join(" ")} (на показі перемішується)`,
);
for (const domain of allDomains) {
  const count = allQuestions.filter((q) => q.domainId === domain.id).length;
  console.log(
    `  ${domain.id.padEnd(24)} ${String(levelsOfDomain(domain.id).length).padStart(2)} рівнів  ${String(count).padStart(3)} питань  вага ${(domain.weight * 100).toFixed(0)}%`,
  );
}

if (warnings.length > 0) {
  console.log("\nПопередження:");
  for (const w of warnings) console.log(`  ! ${w}`);
}

if (errors.length > 0) {
  console.error(`\nПомилки (${errors.length}):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

console.log("\n✓ Контент валідний");
