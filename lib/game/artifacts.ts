export type ArtifactId = "prompt-cache" | "extended-thinking" | "subagent" | "compact-context";

export interface ArtifactDef {
  id: ArtifactId;
  name: string;
  description: string;
  icon: string;
  cost: number;
}

export const artifacts: ArtifactDef[] = [
  {
    id: "prompt-cache",
    name: "Prompt Cache",
    description: "Відновлює одне серце під час бою.",
    icon: "❤",
    cost: 120,
  },
  {
    id: "extended-thinking",
    name: "Extended Thinking",
    description: "Прибирає два хибні варіанти з поточного питання.",
    icon: "◇",
    cost: 150,
  },
  {
    id: "subagent",
    name: "Subagent",
    description: "Субагент прибирає один хибний варіант і називає статтю довідника.",
    icon: "◎",
    cost: 100,
  },
  {
    id: "compact-context",
    name: "Compact Context",
    description: "Пропускає питання без втрати серця. Питання йде на повторення.",
    icon: "⇥",
    cost: 90,
  },
];

export const artifactById = new Map(artifacts.map((a) => [a.id, a]));

export const startingArtifacts: Record<ArtifactId, number> = {
  "prompt-cache": 1,
  "extended-thinking": 1,
  subagent: 1,
  "compact-context": 0,
};
