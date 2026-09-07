"use client";

import { useEffect, useState } from "react";
import { BOSS_SECONDS_PER_QUESTION } from "@/lib/game/constants";
import { useNow } from "@/lib/game/useNow";

/**
 * Таймер бос-питання. Монтується з key={questionId}, тому відлік
 * починається заново на кожному питанні без ручного скидання стану.
 */
export function BossTimer({ onExpire }: { onExpire: () => void }) {
  const now = useNow(250);
  const [startedAt] = useState(now);
  const left = BOSS_SECONDS_PER_QUESTION - Math.floor((now - startedAt) / 1000);
  const expired = left <= 0;

  useEffect(() => {
    if (expired) onExpire();
  }, [expired, onExpire]);

  return (
    <span className={`mono text-[0.68rem] ${left <= 15 ? "text-crimson" : "text-muted"}`}>
      ⏱ {Math.max(0, left)}с
    </span>
  );
}
