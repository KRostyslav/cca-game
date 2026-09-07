import type { Domain, DomainId, Level, Question, QuestionEn, QuestionSource } from "@/lib/content/types";
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

import { questionsMore as aaMore } from "./domains/01-agentic-architecture/questions-more";
import { questionsMore as ccMore } from "./domains/02-claude-code/questions-more";
import { questionsMore as peMore } from "./domains/03-prompt-engineering/questions-more";
import { questionsMore as tdMore } from "./domains/04-tool-design-mcp/questions-more";
import { questionsMore as crMore } from "./domains/05-context-reliability/questions-more";

import { questionsEn as aaEn } from "./domains/01-agentic-architecture/questions.en";
import { questionsEn as ccEn } from "./domains/02-claude-code/questions.en";
import { questionsEn as peEn } from "./domains/03-prompt-engineering/questions.en";
import { questionsEn as tdEn } from "./domains/04-tool-design-mcp/questions.en";
import { questionsEn as crEn } from "./domains/05-context-reliability/questions.en";

import { questionsMoreEn as aaMoreEn } from "./domains/01-agentic-architecture/questions-more.en";
import { questionsMoreEn as ccMoreEn } from "./domains/02-claude-code/questions-more.en";
import { questionsMoreEn as peMoreEn } from "./domains/03-prompt-engineering/questions-more.en";
import { questionsMoreEn as tdMoreEn } from "./domains/04-tool-design-mcp/questions-more.en";
import { questionsMoreEn as crMoreEn } from "./domains/05-context-reliability/questions-more.en";

export const allDomains: Domain[] = [...domains].sort((a, b) => a.index - b.index);

export const allLevels: Level[] = [
  ...aaLevels,
  ...ccLevels,
  ...peLevels,
  ...tdLevels,
  ...crLevels,
];

const translations: Record<string, QuestionEn> = {
  ...aaEn,
  ...ccEn,
  ...peEn,
  ...tdEn,
  ...crEn,
  ...aaMoreEn,
  ...ccMoreEn,
  ...peMoreEn,
  ...tdMoreEn,
  ...crMoreEn,
};

/**
 * Поки переклад питання не написаний, англійська версія дзеркалить українську:
 * гра лишається робочою, а прогалину ловить `npm run validate:content`.
 */
function withTranslation(question: QuestionSource): Question {
  const en = translations[question.id];
  if (en) return { ...question, en };
  return {
    ...question,
    en: {
      prompt: question.prompt,
      scenario: question.scenario,
      explanation: question.explanation,
      choices: Object.fromEntries(question.choices.map((c) => [c.id, c.text])),
      whyWrong: Object.fromEntries(
        question.choices.filter((c) => c.whyWrong).map((c) => [c.id, c.whyWrong!]),
      ),
    },
  };
}

export const allQuestions: Question[] = [
  ...aaQuestions,
  ...ccQuestions,
  ...peQuestions,
  ...tdQuestions,
  ...crQuestions,
  ...aaMore,
  ...ccMore,
  ...peMore,
  ...tdMore,
  ...crMore,
].map(withTranslation);

/** Скільки питань уже мають справжній англійський дубль — для валідатора. */
export function translatedQuestionIds(): Set<string> {
  return new Set(Object.keys(translations));
}

const domainById = new Map(allDomains.map((d) => [d.id, d]));
const levelById = new Map(allLevels.map((l) => [l.id, l]));
const questionById = new Map(allQuestions.map((q) => [q.id, q]));

const questionsByLevel = new Map<string, Question[]>();
for (const question of allQuestions) {
  const bucket = questionsByLevel.get(question.levelId);
  if (bucket) bucket.push(question);
  else questionsByLevel.set(question.levelId, [question]);
}

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

/** Пул питань рівня. Зв'язок задається полем levelId самого питання — одне джерело правди. */
export function questionsOfLevel(id: string): Question[] {
  return questionsByLevel.get(id) ?? [];
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
