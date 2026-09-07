import { z } from "zod";

export const domainIdSchema = z.enum([
  "agentic-architecture",
  "claude-code",
  "prompt-engineering",
  "tool-design-mcp",
  "context-reliability",
]);

export const choiceSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  whyWrong: z.string().min(1).optional(),
});

export const questionSchema = z
  .object({
    id: z.string().min(1),
    domainId: domainIdSchema,
    levelId: z.string().min(1),
    kind: z.enum(["single", "multi", "scenario", "order"]),
    difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    scenario: z.string().min(1).optional(),
    prompt: z.string().min(1),
    code: z.object({ lang: z.string().min(1), source: z.string().min(1) }).optional(),
    choices: z.array(choiceSchema).min(2),
    correct: z.array(z.string().min(1)).min(1),
    explanation: z.string().min(20),
    codexRef: z.string().min(1),
  })
  .superRefine((q, ctx) => {
    const ids = new Set(q.choices.map((c) => c.id));
    if (ids.size !== q.choices.length) {
      ctx.addIssue({ code: "custom", message: `${q.id}: дублікати id варіантів` });
    }
    for (const id of q.correct) {
      if (!ids.has(id)) {
        ctx.addIssue({ code: "custom", message: `${q.id}: correct "${id}" не існує серед choices` });
      }
    }
    if (new Set(q.correct).size !== q.correct.length) {
      ctx.addIssue({ code: "custom", message: `${q.id}: дублікати у correct` });
    }
    if ((q.kind === "single" || q.kind === "scenario") && q.correct.length !== 1) {
      ctx.addIssue({ code: "custom", message: `${q.id}: ${q.kind} має мати рівно одну правильну відповідь` });
    }
    if (q.kind === "multi" && q.correct.length < 2) {
      ctx.addIssue({ code: "custom", message: `${q.id}: multi має мати щонайменше дві правильні відповіді` });
    }
    if (q.kind === "order" && q.correct.length !== q.choices.length) {
      ctx.addIssue({ code: "custom", message: `${q.id}: order має перелічити всі варіанти у correct` });
    }
    if (q.kind !== "order") {
      const wrong = q.choices.filter((c) => !q.correct.includes(c.id));
      const missing = wrong.filter((c) => !c.whyWrong).map((c) => c.id);
      if (missing.length > 0) {
        ctx.addIssue({ code: "custom", message: `${q.id}: без whyWrong для варіантів ${missing.join(", ")}` });
      }
    }
  });

export const levelSchema = z.object({
  id: z.string().min(1),
  domainId: domainIdSchema,
  index: z.number().int().positive(),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  boss: z.boolean(),
  codexRef: z.string().min(1),
});

export const domainSchema = z.object({
  id: domainIdSchema,
  index: z.number().int().positive(),
  title: z.string().min(1),
  titleUk: z.string().min(1),
  weight: z.number().gt(0).lt(1),
  blurb: z.string().min(1),
  icon: z.string().min(1),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const codexEntrySchema = z.object({
  slug: z.string().min(1),
  domainId: domainIdSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  body: z.string().min(1),
});
