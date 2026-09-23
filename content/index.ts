import type {
  Domain,
  DomainId,
  Level,
  Question,
  QuestionEn,
  QuestionSource,
  TrackId,
} from "@/lib/content/types";
import { domains } from "./domains/domains";
import { domains as devDomains } from "./developer/domains/domains";

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

import { levels as daLevels } from "./developer/domains/01-api/levels";
import { levels as dtLevels } from "./developer/domains/02-tools/levels";
import { levels as dcLevels } from "./developer/domains/03-claude-code/levels";
import { levels as dmLevels } from "./developer/domains/04-agents-mcp/levels";
import { levels as dpLevels } from "./developer/domains/05-production/levels";

import { questions as daQuestions } from "./developer/domains/01-api/questions";
import { questions as dtQuestions } from "./developer/domains/02-tools/questions";
import { questions as dcQuestions } from "./developer/domains/03-claude-code/questions";
import { questions as dmQuestions } from "./developer/domains/04-agents-mcp/questions";
import { questions as dpQuestions } from "./developer/domains/05-production/questions";

import { questionsMore as daMore } from "./developer/domains/01-api/questions-more";
import { questionsMore as dtMore } from "./developer/domains/02-tools/questions-more";
import { questionsMore as dcMore } from "./developer/domains/03-claude-code/questions-more";
import { questionsMore as dmMore } from "./developer/domains/04-agents-mcp/questions-more";
import { questionsMore as dpMore } from "./developer/domains/05-production/questions-more";

import { questionsEn as daEn } from "./developer/domains/01-api/questions.en";
import { questionsEn as dtEn } from "./developer/domains/02-tools/questions.en";
import { questionsEn as dcEn } from "./developer/domains/03-claude-code/questions.en";
import { questionsEn as dmEn } from "./developer/domains/04-agents-mcp/questions.en";
import { questionsEn as dpEn } from "./developer/domains/05-production/questions.en";

import { questionsMoreEn as daMoreEn } from "./developer/domains/01-api/questions-more.en";
import { questionsMoreEn as dtMoreEn } from "./developer/domains/02-tools/questions-more.en";
import { questionsMoreEn as dcMoreEn } from "./developer/domains/03-claude-code/questions-more.en";
import { questionsMoreEn as dmMoreEn } from "./developer/domains/04-agents-mcp/questions-more.en";
import { questionsMoreEn as dpMoreEn } from "./developer/domains/05-production/questions-more.en";

/** Усі домени обох тренажерів: спершу Architect, потім Developer, у межах треку — за index. */
export const allDomains: Domain[] = [
  ...[...domains].sort((a, b) => a.index - b.index),
  ...[...devDomains].sort((a, b) => a.index - b.index),
];

export const allLevels: Level[] = [
  ...aaLevels,
  ...ccLevels,
  ...peLevels,
  ...tdLevels,
  ...crLevels,
  ...daLevels,
  ...dtLevels,
  ...dcLevels,
  ...dmLevels,
  ...dpLevels,
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
  ...daEn,
  ...dtEn,
  ...dcEn,
  ...dmEn,
  ...dpEn,
  ...daMoreEn,
  ...dtMoreEn,
  ...dcMoreEn,
  ...dmMoreEn,
  ...dpMoreEn,
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
  ...daQuestions,
  ...dtQuestions,
  ...dcQuestions,
  ...dmQuestions,
  ...dpQuestions,
  ...daMore,
  ...dtMore,
  ...dcMore,
  ...dmMore,
  ...dpMore,
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

/** Вміст одного тренажера. Id доменів, рівнів і питань унікальні між треками. */
export interface TrackContent {
  domains: Domain[];
  levels: Level[];
  questions: Question[];
  /** Порядок світів на карті — він же порядок розблокування. */
  worldOrder: DomainId[];
}

function buildTrackContent(track: TrackId): TrackContent {
  const trackDomains = allDomains.filter((d) => d.track === track);
  const ids = new Set(trackDomains.map((d) => d.id));
  return {
    domains: trackDomains,
    levels: allLevels.filter((l) => ids.has(l.domainId)),
    questions: allQuestions.filter((q) => ids.has(q.domainId)),
    worldOrder: trackDomains.map((d) => d.id),
  };
}

const contentByTrack: Record<TrackId, TrackContent> = {
  architect: buildTrackContent("architect"),
  developer: buildTrackContent("developer"),
};

export function trackContent(track: TrackId): TrackContent {
  return contentByTrack[track];
}

/** До якого тренажера належить домен. */
export function trackOfDomain(id: DomainId): TrackId {
  return domainById.get(id)?.track ?? "architect";
}

export function nextLevelId(levelId: string): string | undefined {
  const index = allLevels.findIndex((l) => l.id === levelId);
  const level = allLevels[index];
  if (!level) return undefined;
  const siblings = levelsOfDomain(level.domainId);
  const pos = siblings.findIndex((l) => l.id === levelId);
  return siblings[pos + 1]?.id;
}
