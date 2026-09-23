/**
 * Перевірка одного каталогу домену Developer під час написання контенту.
 * Використання: npx tsx scripts/check-domain.ts content/developer/domains/01-api
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { questionSchema } from "@/lib/content/schema";
import type { Level, QuestionEn, QuestionSource } from "@/lib/content/types";

async function main() {
  const dir = resolve(process.argv[2] ?? "");
  const errors: string[] = [];

  const { levels } = (await import(join(dir, "levels.ts"))) as { levels: Level[] };
  const { questions } = (await import(join(dir, "questions.ts"))) as { questions: QuestionSource[] };
  const { questionsMore } = (await import(join(dir, "questions-more.ts"))) as { questionsMore: QuestionSource[] };
  const { questionsEn } = (await import(join(dir, "questions.en.ts"))) as { questionsEn: Record<string, QuestionEn> };
  const { questionsMoreEn } = (await import(join(dir, "questions-more.en.ts"))) as {
    questionsMoreEn: Record<string, QuestionEn>;
  };

  const all = [...questions, ...questionsMore];
  const en = { ...questionsEn, ...questionsMoreEn };
  const ids = new Set<string>();
  for (const q of all) {
    if (ids.has(q.id)) errors.push(`дублікат id ${q.id}`);
    ids.add(q.id);
    const parsed = questionSchema.safeParse(q);
    if (!parsed.success) errors.push(...parsed.error.issues.map((i) => `${q.id}: ${i.message}`));
    const level = levels.find((l) => l.id === q.levelId);
    if (!level) errors.push(`${q.id}: невідомий levelId ${q.levelId}`);
    else if (level.domainId !== q.domainId) errors.push(`${q.id}: domainId не збігається з рівнем`);
    if (!existsSync(join("content/developer/codex", `${q.codexRef}.md`))) errors.push(`${q.id}: немає статті ${q.codexRef}.md`);
    const t = en[q.id];
    if (!t) {
      errors.push(`${q.id}: немає англійського дубля`);
      continue;
    }
    const cids = q.choices.map((c) => c.id).sort().join(",");
    if (Object.keys(t.choices).sort().join(",") !== cids) errors.push(`${q.id}: en.choices не збігаються 1:1`);
    for (const c of q.choices) if (c.whyWrong && !t.whyWrong?.[c.id]) errors.push(`${q.id}: немає en.whyWrong для ${c.id}`);
    if (Boolean(q.scenario) !== Boolean(t.scenario)) errors.push(`${q.id}: scenario лише в одній мові`);
    if (t.explanation.trim().length < 20) errors.push(`${q.id}: коротке en.explanation`);
  }
  for (const id of Object.keys(en)) if (!ids.has(id)) errors.push(`EN-переклад для неіснуючого питання ${id}`);

  for (const l of levels) {
    const n = all.filter((q) => q.levelId === l.id).length;
    console.log(`${l.id.padEnd(8)} ${String(n).padStart(3)} питань`);
    const path = join("content/developer/codex", `${l.codexRef}.md`);
    if (!existsSync(path)) errors.push(`немає статті ${path}`);
    else if (!readFileSync(path, "utf8").startsWith("---\ntitle:")) errors.push(`${path}: frontmatter має починатися з title`);
  }
  const kinds: Record<string, number> = {};
  const pos: Record<string, number> = {};
  for (const q of all) {
    kinds[q.kind] = (kinds[q.kind] ?? 0) + 1;
    if (q.kind !== "order") {
      const at = String.fromCharCode(97 + q.choices.findIndex((c) => q.correct.includes(c.id)));
      pos[at] = (pos[at] ?? 0) + 1;
    }
  }
  console.log(`Усього: ${all.length}`, kinds, "позиція першої правильної:", pos);
  if (errors.length) {
    console.error(`\n${errors.length} помилок:\n` + errors.map((e) => "  • " + e).join("\n"));
    process.exit(1);
  }
  console.log("OK");
}

void main();
