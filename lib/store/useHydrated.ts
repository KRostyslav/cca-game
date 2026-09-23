"use client";

import { useSyncExternalStore } from "react";
import { useGameStoreApi, type GameStoreApi } from "./gameStore";

/**
 * Стан із localStorage доступний лише після гідратації persist-middleware.
 * На сервері та в першому клієнтському рендері повертає false, тож розмітка збігається.
 */
export function useStoreHydrated(store: GameStoreApi): boolean {
  return useSyncExternalStore(
    (onChange) => store.persist.onFinishHydration(onChange),
    () => store.persist.hasHydrated(),
    () => false,
  );
}

/** Чи гідратований стор поточного тренажера. */
export function useHydrated(): boolean {
  return useStoreHydrated(useGameStoreApi());
}
