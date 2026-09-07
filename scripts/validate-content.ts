/**
 * Перевіряє цілісність навчального контенту перед білдом.
 * Запуск: npm run validate:content
 */
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { allDomains, allLevels, allQuestions, levelsOfDomain, questionsOfLevel } from "../content";
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

console.log(`Доменів: ${allDomains.length}`);
console.log(`Рівнів: ${allLevels.length} (босів: ${allLevels.filter((l) => l.boss).length})`);
console.log(`Питань: ${allQuestions.length}`);
console.log(`Статей довідника: ${codexFiles.size}`);
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
