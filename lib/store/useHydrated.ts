"use client";

import { useSyncExternalStore } from "react";
import { useGameStore } from "./gameStore";

/**
 * Стан із localStorage доступний лише після гідратації persist-middleware.
 * На сервері та в першому клієнтському рендері повертає false, тож розмітка збігається.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useGameStore.persist.onFinishHydration(onChange),
    () => useGameStore.persist.hasHydrated(),
    () => false,
  );
}
