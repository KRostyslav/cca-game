"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getQuestion } from "@/content";
import type { Question } from "@/lib/content/types";
import { QuestionView } from "@/components/game/QuestionView";
import { Bilingual } from "@/components/ui/Bilingual";
import { Button, ButtonLink } from "@/components/ui/Button";
import { attemptSeed } from "@/lib/game/present";
import { isCorrect } from "@/lib/game/scoring";
import { dueQuestionIds, isMastered } from "@/lib/game/srs";
import { useNow } from "@/lib/game/useNow";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydrated } from "@/lib/store/useHydrated";

export default function TrainPage() {
  const hydrated = useHydrated();
  const srs = useGameStore((s) => s.srs);
  const recordAnswer = useGameStore((s) => s.recordAnswer);

  const [queue, setQueue] = useState<Question[] | null>(null);
  // Кожна сесія тренування отримує свій seed — порядок варіантів не запам'ятовується.
  const [sessionSeed, setSessionSeed] = useState(0);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const now = useNow();
  const stats = useMemo(() => {
    const entries = Object.entries(srs);
    return {
      total: entries.length,
      due: dueQuestionIds(srs, now).length,
      mastered: entries.filter(([, c]) => isMastered(c)).length,
    };
  }, [srs, now]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
        <p className="eyebrow">Завантаження…</p>
      </div>
    );
  }

  const start = () => {
    const ids = dueQuestionIds(srs, Date.now()); // обробник події — час читати можна
    const items = ids.map(getQuestion).filter((q): q is Question => Boolean(q));
    setQueue(items);
    setSessionSeed(attemptSeed(Date.now() % 100_000));
    setIndex(0);
    setSelected([]);
    setLocked(false);
    setCorrectCount(0);
  };

  if (!queue || index >= queue.length) {
    const finished = queue !== null;
    return (
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <p className="eyebrow">Інтервальне повторення</p>
        <h1 className="display mt-4 text-[clamp(2rem,6vw,3rem)]">
          {finished ? "Сесію завершено" : "Тренування слабких місць"}
        </h1>

        {finished ? (
          <p className="mt-4 text-parchment-dim">
            Правильно {correctCount} із {queue.length}. Питання, у яких ви помилилися,
            повернуться завтра; решта — за розкладом Leitner.
          </p>
        ) : (
          <p className="mt-4 max-w-2xl text-parchment-dim">
            Сюди потрапляють питання, у яких ви помилилися — у боях, у тренуванні й на
            екзамені. Правильна відповідь відсуває питання далі (1 → 3 → 7 → 14 → 30 днів),
            помилка повертає його на початок.
          </p>
        )}

        <dl className="mono mt-9 grid grid-cols-3 gap-px border border-hairline bg-hairline">
          <div className="bg-panel p-4">
            <dt className="eyebrow">До повторення</dt>
            <dd className="mt-1 text-2xl text-coral">{stats.due}</dd>
          </div>
          <div className="bg-panel p-4">
            <dt className="eyebrow">У черзі всього</dt>
            <dd className="mt-1 text-2xl">{stats.total}</dd>
          </div>
          <div className="bg-panel p-4">
            <dt className="eyebrow">Вивчено</dt>
            <dd className="mt-1 text-2xl text-jade">{stats.mastered}</dd>
          </div>
        </dl>

        <div className="mt-9 flex flex-wrap gap-3">
          {stats.due > 0 ? (
            <Button variant="primary" onClick={start}>
              {finished ? "Ще раз" : "Почати"} · {stats.due} питань
            </Button>
          ) : (
            <p className="mono text-sm text-muted">
              {stats.total === 0
                ? "Черга порожня — помилок ще не було."
                : "На сьогодні все повторено. Поверніться завтра."}
            </p>
          )}
          <ButtonLink href="/">На карту</ButtonLink>
        </div>
      </div>
    );
  }

  const question = queue[index];

  const submit = () => {
    const ok = isCorrect(question, selected);
    setLocked(true);
    if (ok) setCorrectCount((c) => c + 1);
    recordAnswer({ questionId: question.id, domainId: question.domainId, correct: ok });
  };

  const next = () => {
    setIndex((i) => i + 1);
    setSelected([]);
    setLocked(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <div className="mb-8 flex items-center justify-between border-b border-hairline pb-3">
        <span className="eyebrow">Тренування</span>
        <span className="mono text-[0.68rem] text-muted">
          {index + 1}/{queue.length} · правильно {correctCount}
        </span>
      </div>

      <QuestionView
        key={question.id}
        question={question}
        seed={sessionSeed}
        selected={selected}
        eliminated={[]}
        locked={locked}
        onToggle={(id) =>
          question.kind === "multi"
            ? setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
            : setSelected([id])
        }
        onReorder={setSelected}
      />

      {locked && (
        <div className="rise mt-7 border-l-2 border-coral bg-panel p-5">
          <div className="text-[0.95rem] leading-relaxed text-parchment-dim">
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

      <div className="mt-8 flex justify-end">
        {locked ? (
          <Button variant="primary" onClick={next} autoFocus>
            {index + 1 >= queue.length ? "Підсумок" : "Далі"} →
          </Button>
        ) : (
          <Button
            variant="primary"
            disabled={question.kind !== "order" && selected.length === 0}
            onClick={submit}
          >
            Відповісти
          </Button>
        )}
      </div>
    </div>
  );
}
