"use client";

import { artifacts, type ArtifactId } from "@/lib/game/artifacts";

export function ArtifactTray({
  artifacts: owned,
  disabledIds = [],
  onUse,
}: {
  artifacts: Record<ArtifactId, number>;
  disabledIds?: ArtifactId[];
  onUse: (id: ArtifactId) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {artifacts.map((def) => {
        const count = owned[def.id] ?? 0;
        const disabled = count <= 0 || disabledIds.includes(def.id);
        return (
          <button
            key={def.id}
            type="button"
            disabled={disabled}
            onClick={() => onUse(def.id)}
            title={`${def.name} — ${def.description}`}
            className="mono flex items-center gap-1.5 border border-hairline px-2.5 py-1.5 text-[0.68rem] text-parchment-dim transition-colors hover:border-coral hover:text-coral disabled:opacity-25 disabled:hover:border-hairline disabled:hover:text-parchment-dim"
          >
            <span>{def.icon}</span>
            <span className="hidden sm:inline">{def.name}</span>
            <span className="text-muted">×{count}</span>
          </button>
        );
      })}
    </div>
  );
}
