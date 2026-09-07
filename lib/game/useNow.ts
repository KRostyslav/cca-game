"use client";

import { useSyncExternalStore } from "react";

/**
 * Поточний час як зовнішнє джерело — без Date.now() у тілі рендера й без setState в ефекті.
 * Знімок округлюється до кроку, щоб між рендерами лишатися стабільним.
 */
export function useNow(stepMs = 60_000): number {
  return useSyncExternalStore(
    (onChange) => {
      const id = setInterval(onChange, stepMs);
      return () => clearInterval(id);
    },
    () => Math.floor(Date.now() / stepMs) * stepMs,
    () => 0,
  );
}
