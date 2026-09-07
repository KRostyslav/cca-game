"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { allDomains } from "@/content";
import { QuestionView } from "@/components/game/QuestionView";
import { Button, ButtonLink } from "@/components/ui/Button";
import {
  EXAM_DURATION_MS,
  EXAM_QUESTIONS,
} from "@/lib/game/constants";
import { buildExam } from "@/lib/game/examBuilder";
import { partialScore, passed, scaledScore } from "@/lib/game/scoring";
import { useNow } from "@/lib/game/useNow";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydrated } from "@/lib/store/useHydrated";

export default function ExamRunPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const recordAnswer = useGameStore((s) => s.recordAnswer);
  const recordExamRun = useGameStore((s) => s.recordExamRun);

  // Сесію створює натискання кнопки: у тілі рендера час і випадкові числа не читаємо.
  const [session, setSession] = useState<{ seed: number; startedAt: number } | null>(null);
  const questions = useMemo(
    () => (session ? buildExam(session.seed) : []),
    [session],
  );

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const submitted = useRef(false);

  const now = useNow(1000);
  const startedAt = session?.startedAt ?? 0;
  const msLeft = session ? EXAM_DURATION_MS - (now - startedAt) : EXAM_DURATION_MS;

  const question = questions[index];
  const selected = answers[question?.id] ?? [];

  const finish = useCallback(
    () => {
      if (submitted.current) return;
      submitted.current = true;

      let earned = 0;
      const perDomain: Record<string, { correct: number; total: number }> = Object.fromEntries(
        allDomains.map((d) => [d.id, { correct: 0, total: 0 }]),
      );
      const wrong: string[] = [];

      for (const q of questions) {
        const answer = answers[q.id] ?? [];
        const score = partialScore(q, answer);
        earned += score;
        perDomain[q.domainId].total += 1;
        perDomain[q.domainId].correct += score;
        const isRight = score === 1;
        if (!isRight) wrong.push(q.id);
        recordAnswer({ questionId: q.id, domainId: q.domainId, correct: isRight });
      }

      const score = scaledScore(earned, questions.length);
      recordExamRun({
        id: `run-${startedAt}`,
        startedAt,
        finishedAt: Date.now(),
        score,
        passed: passed(score),
        perDomain,
        wrongQuestionIds: wrong,
      });
      router.replace("/exam/result");
    },
    [answers, questions, recordAnswer, recordExamRun, router, startedAt],
  );

  // Час вийшов — здаємо роботу автоматично.
  useEffect(() => {
    if (session && msLeft <= 0) finish();
  }, [session, msLeft, finish]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
        <p className="eyebrow">Завантаження…</p>
      </div>
    );
  }

  if (!session || !question) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 sm:px-8">
        <p className="eyebrow">Симуляція екзамену</p>
        <h1 className="display mt-4 text-[clamp(1.8rem,5vw,2.6rem)]">Готові починати?</h1>
        <p className="mt-4 text-parchment-dim">
          Таймер на 120 хвилин запуститься одразу після натискання. Перервати екзамен
          можна будь-коли — результат тоді не зарахується.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            variant="primary"
            onClick={() =>
              setSession({
                seed: Math.floor(Math.random() * 1_000_000),
                startedAt: Date.now(),
              })
            }
          >
            Запустити таймер →
          </Button>
          <ButtonLink href="/exam" variant="ghost">
            Назад
          </ButtonLink>
        </div>
      </div>
    );
  }

  const answeredCount = questions.filter((q) => (answers[q.id]?.length ?? 0) > 0).length;
  const minutes = Math.max(0, Math.floor(msLeft / 60000));
  const seconds = Math.max(0, Math.floor((msLeft % 60000) / 1000));
  const lowTime = msLeft < 10 * 60 * 1000;

  const setAnswer = (ids: string[]) =>
    setAnswers((a) => ({ ...a, [question.id]: ids }));

  const toggle = (id: string) => {
    if (question.kind === "multi") {
      setAnswer(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
    } else {
      setAnswer([id]);
    }
  };

  const toggleFlag = () =>
    setFlagged((f) => {
      const next = new Set(f);
      if (next.has(question.id)) next.delete(question.id);
      else next.add(question.id);
      return next;
    });

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
      <div className="sticky top-[57px] z-20 -mx-5 border-b border-hairline bg-void/92 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="eyebrow">Екзамен</span>
          <span className="mono text-[0.7rem] text-parchment-dim">
            {index + 1}/{EXAM_QUESTIONS} · відповіли {answeredCount}
          </span>
          <span
            className={`mono ml-auto text-sm ${lowTime ? "text-crimson" : "text-parchment"}`}
          >
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
        </div>
        <div className="mt-2 flex gap-px">
          {questions.map((q, i) => {
            const done = (answers[q.id]?.length ?? 0) > 0;
            return (
              <button
                key={q.id}
                type="button"
                aria-label={`Питання ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 flex-1 transition-colors ${
                  i === index
                    ? "bg-coral"
                    : flagged.has(q.id)
                      ? "bg-gold"
                      : done
                        ? "bg-hairline-bright"
                        : "bg-hairline"
                }`}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <QuestionView
          key={question.id}
          question={question}
          seed={session.seed}
          selected={selected}
          eliminated={[]}
          locked={false}
          onToggle={toggle}
          onReorder={setAnswer}
        />
      </div>

      <div className="mt-9 flex flex-wrap items-center gap-3 border-t border-hairline pt-6">
        <Button onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
          ← Назад
        </Button>
        <Button onClick={toggleFlag} variant={flagged.has(question.id) ? "primary" : "ghost"}>
          {flagged.has(question.id) ? "Знято позначку" : "Позначити"}
        </Button>
        <div className="ml-auto flex gap-3">
          {index + 1 < questions.length ? (
            <Button variant="primary" onClick={() => setIndex((i) => i + 1)}>
              Далі →
            </Button>
          ) : (
            <Button variant="primary" onClick={() => setSubmitting(true)}>
              Завершити
            </Button>
          )}
        </div>
      </div>

      {submitting && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-void/85 p-5 backdrop-blur-sm">
          <div className="panel w-full max-w-md p-7">
            <p className="eyebrow">Завершити екзамен</p>
            <p className="mt-4 text-parchment-dim">
              Ви відповіли на {answeredCount} із {EXAM_QUESTIONS} питань.
              {answeredCount < EXAM_QUESTIONS &&
                " Питання без відповіді зарахуються як неправильні."}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="primary" onClick={finish}>
                Завершити й побачити результат
              </Button>
              <Button variant="ghost" onClick={() => setSubmitting(false)}>
                Повернутися
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
