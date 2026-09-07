"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { getDomain, getLevel, nextLevelId, questionsOfLevel } from "@/content";
import type { Question } from "@/lib/content/types";
import { QuestionView } from "./QuestionView";
import { BossTimer } from "./BossTimer";
import { HeartBar } from "./HeartBar";
import { ComboMeter } from "./ComboMeter";
import { ArtifactTray } from "./ArtifactTray";
import { Bilingual } from "@/components/ui/Bilingual";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import { Meter } from "@/components/ui/Meter";
import { MAX_HEARTS } from "@/lib/game/constants";
import { attemptSeed, presentChoices } from "@/lib/game/present";
import { isCorrect, starsFor } from "@/lib/game/scoring";
import { awardXp } from "@/lib/game/xp";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydrated } from "@/lib/store/useHydrated";

interface Attempt {
  question: Question;
  answer: string[];
  correct: boolean;
  skipped: boolean;
}

export function BattleScreen({ levelId }: { levelId: string }) {
  const hydrated = useHydrated();
  const level = getLevel(levelId);
  const questions = questionsOfLevel(levelId);
  const domain = level ? getDomain(level.domainId) : undefined;

  const recordAnswer = useGameStore((s) => s.recordAnswer);
  const completeLevel = useGameStore((s) => s.completeLevel);
  const spendArtifact = useGameStore((s) => s.spendArtifact);
  const artifacts = useGameStore((s) => s.player.artifacts);
  // Номер спроби робить порядок варіантів іншим при кожному перепроходженні рівня.
  const attemptNo = useGameStore((s) => s.progress[levelId]?.attempts ?? 0);
  const seed = attemptSeed(attemptNo);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [streak, setStreak] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [xp, setXp] = useState(0);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [eliminated, setEliminated] = useState<string[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [outcome, setOutcome] = useState<"win" | "lose" | null>(null);

  const question = questions[index];
  const isBoss = Boolean(level?.boss);

  const finish = useCallback(
    (finalAttempts: Attempt[], failed: boolean, heartsLeft: number, earnedXp: number, combo: number) => {
      const mistakes = finalAttempts.filter((a) => !a.correct).length;
      const answered = finalAttempts.length;
      const stars = starsFor(mistakes, failed);
      completeLevel({
        levelId,
        stars,
        accuracy: answered === 0 ? 0 : (answered - mistakes) / answered,
        xpEarned: earnedXp,
        maxCombo: combo,
        heartsLeft,
        failed,
      });
      setOutcome(failed ? "lose" : "win");
    },
    [completeLevel, levelId],
  );

  const submit = useCallback(
    (forcedWrong = false) => {
      if (!question || locked) return;
      const ok = !forcedWrong && isCorrect(question, selected);
      setLocked(true);
      recordAnswer({ questionId: question.id, domainId: question.domainId, correct: ok });

      const attempt: Attempt = { question, answer: selected, correct: ok, skipped: false };
      const nextAttempts = [...attempts, attempt];
      setAttempts(nextAttempts);

      if (ok) {
        const gained = awardXp(question.difficulty, isBoss, streak);
        setXp((v) => v + gained);
        setStreak((s) => {
          const next = s + 1;
          setMaxCombo((m) => Math.max(m, next));
          return next;
        });
      } else {
        setStreak(0);
        setWrongFlash(true);
        setTimeout(() => setWrongFlash(false), 420);
        const left = hearts - 1;
        setHearts(left);
        if (left <= 0) {
          finish(nextAttempts, true, 0, xp, maxCombo);
        }
      }
    },
    [attempts, finish, hearts, isBoss, locked, maxCombo, question, recordAnswer, selected, streak, xp],
  );

  const onTimeout = useCallback(() => submit(true), [submit]);

  if (!level || !domain || questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
        <p className="eyebrow">Рівень не знайдено</p>
        <ButtonLink href="/" className="mt-6">
          На карту
        </ButtonLink>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
        <p className="eyebrow">Завантаження…</p>
      </div>
    );
  }

  if (outcome) {
    return (
      <ResultScreen
        levelId={levelId}
        outcome={outcome}
        attempts={attempts}
        xp={xp}
        accent={domain.accent}
      />
    );
  }

  const toggle = (id: string) => {
    if (locked) return;
    if (question.kind === "multi") {
      setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    } else {
      setSelected([id]);
    }
  };

  const advance = () => {
    if (index + 1 >= questions.length) {
      finish(attempts, false, hearts, xp, maxCombo);
      return;
    }
    setIndex((i) => i + 1);
    setSelected([]);
    setLocked(false);
    setEliminated([]);
    setHint(null);
  };

  const skip = () => {
    if (!spendArtifact("compact-context")) return;
    recordAnswer({ questionId: question.id, domainId: question.domainId, correct: false });
    const nextAttempts = [...attempts, { question, answer: [], correct: false, skipped: true }];
    setAttempts(nextAttempts);
    setStreak(0);
    if (index + 1 >= questions.length) {
      finish(nextAttempts, false, hearts, xp, maxCombo);
      return;
    }
    setIndex((i) => i + 1);
    setSelected([]);
    setLocked(false);
    setEliminated([]);
    setHint(null);
  };

  const eliminateWrong = (count: number) => {
    // Беремо з показаного порядку, а не з порядку в даних: інакше підказка
    // щоразу гасила б ті самі варіанти.
    const wrong = presentChoices(question, seed)
      .map((c) => c.id)
      .filter((id) => !question.correct.includes(id) && !eliminated.includes(id));
    const taken = wrong.slice(0, count);
    setEliminated((e) => [...e, ...taken]);
    setSelected((s) => s.filter((id) => !taken.includes(id)));
  };

  const answerReady =
    question.kind === "order" ? true : selected.length > 0;
  const lastAttempt = attempts[attempts.length - 1];

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      {/* HUD */}
      <div className="mb-8 border border-hairline bg-panel">
        <div
          className="h-0.5 transition-[width] duration-500"
          style={{
            width: `${((index + (locked ? 1 : 0)) / questions.length) * 100}%`,
            background: domain.accent,
          }}
        />
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3">
          <Link href={`/world/${domain.id}`} className="mono text-[0.68rem] text-muted hover:text-parchment">
            ← {domain.titleUk}
          </Link>
          <span className="mono text-[0.68rem] text-parchment-dim">
            {level.boss && <span className="text-crimson">БОС · </span>}
            {index + 1}/{questions.length}
          </span>
          <div className="ml-auto flex items-center gap-4">
            <ComboMeter streak={streak} />
            {isBoss && !locked && <BossTimer key={question.id} onExpire={onTimeout} />}
            <HeartBar hearts={hearts} max={MAX_HEARTS} />
          </div>
        </div>
      </div>

      <div className={wrongFlash ? "shake" : ""}>
        <QuestionView
          key={question.id}
          question={question}
          seed={seed}
          selected={selected}
          eliminated={eliminated}
          locked={locked}
          onToggle={toggle}
          onReorder={setSelected}
        />
      </div>

      {hint && !locked && (
        <p className="mono mt-5 border-l-2 border-gold/70 bg-panel/60 py-2.5 pl-4 text-[0.78rem] text-gold">
          ◎ {hint}
        </p>
      )}

      {/* Фідбек */}
      {locked && lastAttempt && (
        <div
          className={`rise mt-7 border-l-2 bg-panel p-5 ${
            lastAttempt.correct ? "border-jade" : "border-crimson"
          }`}
        >
          <p className={`eyebrow ${lastAttempt.correct ? "text-jade" : "text-crimson"}`}>
            {lastAttempt.correct ? "Правильно" : "Помилка · −1 ◆"}
          </p>
          <div className="mt-3 text-[0.95rem] leading-relaxed text-parchment-dim">
            <Bilingual en={question.en.explanation} uk={question.explanation} />
          </div>
          <Link
            href={`/codex/${question.codexRef}`}
            className="mono mt-4 inline-block text-[0.68rem] uppercase tracking-[0.14em] text-coral hover:underline"
          >
            Довідник: {question.codexRef} →
          </Link>
        </div>
      )}

      {/* Дії */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        {!locked ? (
          <ArtifactTray
            artifacts={artifacts}
            disabledIds={question.kind === "order" ? ["extended-thinking", "subagent"] : []}
            onUse={(id) => {
              if (!spendArtifact(id)) return;
              if (id === "prompt-cache") setHearts((h) => Math.min(MAX_HEARTS, h + 1));
              if (id === "extended-thinking") eliminateWrong(2);
              if (id === "subagent") {
                eliminateWrong(1);
                setHint(`Субагент радить статтю «${question.codexRef}» і прибирає один хибний варіант.`);
              }
              if (id === "compact-context") skip();
            }}
          />
        ) : (
          <span className="mono text-[0.68rem] text-muted">+{xp} XP за рівень</span>
        )}

        {locked ? (
          <Button variant="primary" onClick={advance} autoFocus>
            {index + 1 >= questions.length ? "Підсумок" : "Далі"} →
          </Button>
        ) : (
          <Button variant="primary" disabled={!answerReady} onClick={() => submit()}>
            Відповісти
          </Button>
        )}
      </div>
    </div>
  );
}

function ResultScreen({
  levelId,
  outcome,
  attempts,
  xp,
  accent,
}: {
  levelId: string;
  outcome: "win" | "lose";
  attempts: Attempt[];
  xp: number;
  accent: string;
}) {
  const level = getLevel(levelId)!;
  const mistakes = attempts.filter((a) => !a.correct).length;
  const stars = starsFor(mistakes, outcome === "lose");
  const next = nextLevelId(levelId);
  const accuracy = attempts.length === 0 ? 0 : (attempts.length - mistakes) / attempts.length;

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <div className="rise panel hatch p-8 text-center">
        <p className="eyebrow">{outcome === "win" ? "Рівень пройдено" : "Серця вичерпано"}</p>
        <h1 className="display mt-4 text-[clamp(1.8rem,5vw,2.6rem)]">{level.title}</h1>
        <div className="mt-6 flex justify-center">
          <Stars value={stars} size="lg" />
        </div>

        <dl className="mono mt-9 grid grid-cols-3 gap-px border border-hairline bg-hairline text-left">
          <div className="bg-panel p-4">
            <dt className="eyebrow">Точність</dt>
            <dd className="mt-1 text-xl">{Math.round(accuracy * 100)}%</dd>
          </div>
          <div className="bg-panel p-4">
            <dt className="eyebrow">Помилок</dt>
            <dd className="mt-1 text-xl">{mistakes}</dd>
          </div>
          <div className="bg-panel p-4">
            <dt className="eyebrow">XP</dt>
            <dd className="mt-1 text-xl" style={{ color: accent }}>
              +{xp}
            </dd>
          </div>
        </dl>

        <div className="mt-4">
          <Meter value={accuracy} color={accent} />
        </div>

        {outcome === "win" && (
          <p className="mono mt-6 text-[0.7rem] text-muted">
            Стаття довідника «{level.codexRef}» відкрита назавжди
          </p>
        )}

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {outcome === "win" && next ? (
            <ButtonLink href={`/play/${next}`} variant="primary">
              Наступний рівень →
            </ButtonLink>
          ) : (
            <ButtonLink href={`/play/${levelId}`} variant="primary">
              {outcome === "win" ? "Пройти знову" : "Спробувати ще раз"}
            </ButtonLink>
          )}
          <ButtonLink href={`/world/${level.domainId}`}>До світу</ButtonLink>
          <ButtonLink href={`/codex/${level.codexRef}`} variant="ghost">
            Читати довідник
          </ButtonLink>
        </div>
      </div>

      {mistakes > 0 && (
        <section className="mt-10">
          <h2 className="display text-lg">Розбір помилок</h2>
          <p className="mono mt-1 text-[0.7rem] text-muted">
            Ці питання додано до черги повторення
          </p>
          <ul className="mt-5 space-y-3">
            {attempts
              .filter((a) => !a.correct)
              .map((a) => (
                <li key={a.question.id} className="border-l-2 border-crimson bg-panel p-4">
                  <div className="text-[0.92rem] text-parchment">
                    <Bilingual en={a.question.en.prompt} uk={a.question.prompt} />
                  </div>
                  <div className="mt-2 text-[0.85rem] leading-relaxed text-parchment-dim">
                    <Bilingual en={a.question.en.explanation} uk={a.question.explanation} />
                  </div>
                  <Link
                    href={`/codex/${a.question.codexRef}`}
                    className="mono mt-3 inline-block text-[0.66rem] uppercase tracking-[0.14em] text-coral hover:underline"
                  >
                    {a.question.codexRef} →
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      )}
    </div>
  );
}
