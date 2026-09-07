/** Скільки питань пул рівня видає за одну спробу. Пул більший — набори різні. */
export const QUESTIONS_PER_LEVEL = 6;
/** Бос-рівень коротший: питання складніші й з таймером. */
export const QUESTIONS_PER_BOSS = 4;
/** Стартова кількість сердець у бою. */
export const MAX_HEARTS = 5;
/** Кількість питань у симуляції екзамену. */
export const EXAM_QUESTIONS = 60;
/** Тривалість симуляції екзамену, мс. */
export const EXAM_DURATION_MS = 120 * 60 * 1000;
/** Прохідний бал зі шкали 0..1000. */
export const EXAM_PASS_SCORE = 720;
/** Секунд на одне питання бос-рівня. */
export const BOSS_SECONDS_PER_QUESTION = 90;
/** Інтервали Leitner-боксів у днях: box 1..5. */
export const SRS_INTERVALS_DAYS = [1, 3, 7, 14, 30] as const;
export const DAY_MS = 24 * 60 * 60 * 1000;
