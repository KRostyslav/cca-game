import type { Domain, DomainId, Level, Question } from "@/lib/content/types";
import { domains } from "./domains/domains";

import { levels as aaLevels } from "./domains/01-agentic-architecture/levels";
import { levels as ccLevels } from "./domains/02-claude-code/levels";
import { levels as peLevels } from "./domains/03-prompt-engineering/levels";
import { levels as tdLevels } from "./domains/04-tool-design-mcp/levels";
import { levels as crLevels } from "./domains/05-context-reliability/levels";

import { questions as aaQuestions } from "./domains/01-agentic-architecture/questions";
import { questions as ccQuestions } from "./domains/02-claude-code/questions";
import { questions as peQuestions } from "./domains/03-prompt-engineering/questions";
import { questions as tdQuestions } from "./domains/04-tool-design-mcp/questions";
import { questions as crQuestions } from "./domains/05-context-reliability/questions";

export const allDomains: Domain[] = [...domains].sort((a, b) => a.index - b.index);

export const allLevels: Level[] = [
  ...aaLevels,
  ...ccLevels,
  ...peLevels,
  ...tdLevels,
  ...crLevels,
];

export const allQuestions: Question[] = [
  ...aaQuestions,
  ...ccQuestions,
  ...peQuestions,
  ...tdQuestions,
  ...crQuestions,
];

const domainById = new Map(allDomains.map((d) => [d.id, d]));
const levelById = new Map(allLevels.map((l) => [l.id, l]));
const questionById = new Map(allQuestions.map((q) => [q.id, q]));

export function getDomain(id: string): Domain | undefined {
  return domainById.get(id as DomainId);
}

export function getLevel(id: string): Level | undefined {
  return levelById.get(id);
}

export function getQuestion(id: string): Question | undefined {
  return questionById.get(id);
}

export function levelsOfDomain(id: DomainId): Level[] {
  return allLevels.filter((l) => l.domainId === id).sort((a, b) => a.index - b.index);
}

export function questionsOfLevel(id: string): Question[] {
  const level = levelById.get(id);
  if (!level) return [];
  return level.questionIds
    .map((qid) => questionById.get(qid))
    .filter((q): q is Question => Boolean(q));
}

export function questionsOfDomain(id: DomainId): Question[] {
  return allQuestions.filter((q) => q.domainId === id);
}

/** Порядок світів на карті — він же порядок розблокування. */
export const worldOrder: DomainId[] = allDomains.map((d) => d.id);

export function nextLevelId(levelId: string): string | undefined {
  const index = allLevels.findIndex((l) => l.id === levelId);
  const level = allLevels[index];
  if (!level) return undefined;
  const siblings = levelsOfDomain(level.domainId);
  const pos = siblings.findIndex((l) => l.id === levelId);
  return siblings[pos + 1]?.id;
}
