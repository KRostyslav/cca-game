"use client";

import { useMemo } from "react";
import type { Question } from "@/lib/content/types";

const KIND_LABEL: Record<Question["kind"], string> = {
  single: "Одна правильна відповідь",
  multi: "Кілька правильних відповідей",
  scenario: "Сценарій · одна відповідь",
  order: "Розставте у правильному порядку",
};

export function QuestionView({
  question,
  selected,
  eliminated,
  locked,
  onToggle,
  onReorder,
}: {
  question: Question;
  selected: string[];
  eliminated: string[];
  locked: boolean;
  onToggle: (id: string) => void;
  onReorder: (ids: string[]) => void;
}) {
  const correct = useMemo(() => new Set(question.correct), [question]);
  const isOrder = question.kind === "order";

  // Для order працюємо зі списком: обраний порядок + ще не розставлені.
  const orderPool = isOrder
    ? [...selected, ...question.choices.map((c) => c.id).filter((id) => !selected.includes(id))]
    : [];

  return (
    <div>
      <p className="eyebrow">{KIND_LABEL[question.kind]}</p>

      {question.scenario && (
        <div className="mt-4 border-l-2 border-gold/70 bg-panel/60 py-3 pl-4 pr-3 text-[0.92rem] leading-relaxed text-parchment-dim">
          {question.scenario}
        </div>
      )}

      <h2 className="display mt-5 text-[clamp(1.25rem,3.2vw,1.7rem)] leading-snug text-parchment">
        {question.prompt}
      </h2>

      {question.code && (
        <div className="table-scroll mt-5 border border-hairline border-l-2 border-l-coral-dim bg-[#0e0d0b]">
          <pre className="mono px-4 py-3.5 text-[0.78rem] leading-relaxed text-parchment-dim">
            {question.code.source}
          </pre>
        </div>
      )}

      {isOrder ? (
        <ol className="mt-7 space-y-2">
          {orderPool.map((id, index) => {
            const choice = question.choices.find((c) => c.id === id)!;
            const rightPlace = locked && question.correct[index] === id;
            return (
              <li
                key={id}
                className={`flex items-center gap-3 border px-4 py-3 transition-colors ${
                  locked
                    ? rightPlace
                      ? "border-jade/60 bg-jade/5"
                      : "border-crimson/50 bg-crimson/5"
                    : "border-hairline bg-panel hover:border-hairline-bright"
                }`}
              >
                <span
                  className={`mono w-5 shrink-0 text-xs ${
                    locked ? (rightPlace ? "text-jade" : "text-crimson") : "text-muted"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="flex-1 text-[0.95rem] text-parchment-dim">{choice.text}</span>
                {!locked && (
                  <span className="flex shrink-0 gap-1">
                    <ReorderButton
                      label="Вгору"
                      disabled={index === 0}
                      onClick={() => onReorder(move(orderPool, index, index - 1))}
                    >
                      ↑
                    </ReorderButton>
                    <ReorderButton
                      label="Вниз"
                      disabled={index === orderPool.length - 1}
                      onClick={() => onReorder(move(orderPool, index, index + 1))}
                    >
                      ↓
                    </ReorderButton>
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      ) : (
        <ul className="mt-7 space-y-2.5">
          {question.choices.map((choice) => {
            const isSelected = selected.includes(choice.id);
            const isEliminated = eliminated.includes(choice.id);
            const isCorrect = correct.has(choice.id);
            const state = locked
              ? isCorrect
                ? "correct"
                : isSelected
                  ? "wrong"
                  : "idle"
              : isSelected
                ? "selected"
                : "idle";

            return (
              <li key={choice.id}>
                <button
                  type="button"
                  disabled={locked || isEliminated}
                  onClick={() => onToggle(choice.id)}
                  className={`flex w-full items-start gap-3.5 border px-4 py-3.5 text-left transition-all duration-200 ${
                    isEliminated
                      ? "border-hairline/60 bg-transparent opacity-30 line-through"
                      : state === "correct"
                        ? "border-jade bg-jade/8"
                        : state === "wrong"
                          ? "border-crimson bg-crimson/8"
                          : state === "selected"
                            ? "border-coral bg-coral/8"
                            : "border-hairline bg-panel hover:border-hairline-bright hover:bg-raised"
                  }`}
                >
                  <span
                    className={`mono mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border text-[0.65rem] uppercase ${
                      state === "correct"
                        ? "border-jade text-jade"
                        : state === "wrong"
                          ? "border-crimson text-crimson"
                          : state === "selected"
                            ? "border-coral bg-coral text-void"
                            : "border-hairline-bright text-muted"
                    }`}
                  >
                    {locked ? (isCorrect ? "✓" : isSelected ? "✕" : choice.id) : choice.id}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[0.95rem] leading-relaxed text-parchment">
                      {choice.text}
                    </span>
                    {locked && !isCorrect && choice.whyWrong && (
                      <span className="mt-2 block text-[0.85rem] leading-relaxed text-muted">
                        {choice.whyWrong}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ReorderButton({
  children,
  label,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="mono flex h-7 w-7 items-center justify-center border border-hairline text-xs text-muted transition-colors hover:border-coral hover:text-coral disabled:opacity-25 disabled:hover:border-hairline disabled:hover:text-muted"
    >
      {children}
    </button>
  );
}

function move<T>(items: T[], from: number, to: number): T[] {
  const out = [...items];
  const [item] = out.splice(from, 1);
  out.splice(to, 0, item);
  return out;
}
