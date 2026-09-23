/** Тренажер: кожен має власні світи, питання, довідник і окреме збереження. */
export type TrackId = "architect" | "developer";

export type ArchitectDomainId =
  | "agentic-architecture"
  | "claude-code"
  | "prompt-engineering"
  | "tool-design-mcp"
  | "context-reliability";

export type DeveloperDomainId =
  | "dev-api"
  | "dev-tools"
  | "dev-claude-code"
  | "dev-agents-mcp"
  | "dev-production";

export type DomainId = ArchitectDomainId | DeveloperDomainId;

export type QuestionKind = "single" | "multi" | "scenario" | "order";

export type Difficulty = 1 | 2 | 3;

export interface Choice {
  /** Стабільний ідентифікатор варіанта в межах питання: "a", "b", "c"... */
  id: string;
  text: string;
  /** Чому цей варіант хибний. Для правильних варіантів не заповнюється. */
  whyWrong?: string;
}

/** Англійський дубль: реальний екзамен CCA-F складається англійською. */
export interface QuestionEn {
  prompt: string;
  scenario?: string;
  explanation: string;
  /** id варіанта → текст англійською */
  choices: Record<string, string>;
  /** id хибного варіанта → розбір англійською */
  whyWrong?: Record<string, string>;
}

/** Питання так, як воно записане у файлі контенту — без англійського дубля. */
export interface QuestionSource {
  id: string;
  domainId: DomainId;
  levelId: string;
  kind: QuestionKind;
  difficulty: Difficulty;
  /** Короткий контекст/кейс перед самим питанням (для scenario). */
  scenario?: string;
  prompt: string;
  /** Блок коду або конфіга, що показується під питанням. */
  code?: { lang: string; source: string };
  choices: Choice[];
  /**
   * single: рівно один id. multi: два і більше id.
   * order: усі id у правильному порядку.
   */
  correct: string[];
  explanation: string;
  /** Слаг статті довідника: content/codex/<codexRef>.md */
  codexRef: string;
}

/** Питання, готове до показу: український оригінал плюс англійський дубль. */
export interface Question extends QuestionSource {
  en: QuestionEn;
}

export interface Level {
  id: string;
  domainId: DomainId;
  index: number;
  title: string;
  /** Одне речення про те, чого рівень навчає. */
  subtitle: string;
  boss: boolean;
  codexRef: string;
}

export interface Domain {
  id: DomainId;
  track: TrackId;
  index: number;
  /** Офіційна англійська назва домену — саме так вона звучить на екзамені. */
  title: string;
  /** Українська назва світу. */
  titleUk: string;
  /** Частка домену в екзамені, 0..1 */
  weight: number;
  blurb: string;
  icon: string;
  /** HEX акцентного кольору світу. */
  accent: string;
}

export interface CodexEntry {
  slug: string;
  domainId: DomainId;
  title: string;
  summary: string;
  body: string;
}

export interface Track {
  id: TrackId;
  /** Короткий код сертифікації для логотипа: CCA-F, CCD-F. */
  code: string;
  /** Повна англійська назва сертифікації. */
  title: string;
  /** Коротка назва для перемикача. */
  label: string;
  /** Як звати гравця в цьому тренажері. */
  playerNoun: string;
  /** Кличний відмінок для звертання: «архітекторе», «розробнику». */
  playerVocative: string;
  /** Ім'я гравця, якщо він нічого не ввів. */
  defaultPlayerName: string;
  blurb: string;
  accent: string;
}
