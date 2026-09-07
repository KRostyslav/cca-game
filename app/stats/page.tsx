"use client";

import { useRef, useState } from "react";
import { allDomains, allLevels } from "@/content";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Meter } from "@/components/ui/Meter";
import { achievements } from "@/lib/game/achievements";
import { artifacts } from "@/lib/game/artifacts";
import { isMastered } from "@/lib/game/srs";
import { totalStars } from "@/lib/game/selectors";
import { levelProgress, titleForLevel } from "@/lib/game/xp";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydrated } from "@/lib/store/useHydrated";

export default function StatsPage() {
  const hydrated = useHydrated();
  const store = useGameStore();
  const buyArtifact = useGameStore((s) => s.buyArtifact);
  const resetProgress = useGameStore((s) => s.resetProgress);
  const importSave = useGameStore((s) => s.importSave);
  const exportSave = useGameStore((s) => s.exportSave);
  const setSetting = useGameStore((s) => s.setSetting);
  const fileRef = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-24 sm:px-8">
        <p className="eyebrow">Завантаження…</p>
      </div>
    );
  }

  const progress = levelProgress(store.player.xp);
  const stars = totalStars(store);
  const mastered = Object.values(store.srs).filter(isMastered).length;
  const cleared = allLevels.filter((l) => (store.progress[l.id]?.stars ?? 0) > 0).length;
  const bestExam = store.stats.examRuns.reduce((acc, r) => Math.max(acc, r.score), 0);

  const download = () => {
    const blob = new Blob([exportSave()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cca-quest-save-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice("Збереження завантажено.");
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <header className="border-b border-hairline pb-8">
        <p className="eyebrow">Профіль</p>
        <h1 className="display mt-4 text-[clamp(2rem,6vw,3rem)]">{store.player.name}</h1>
        <p className="mono mt-2 text-sm text-coral">
          {titleForLevel(progress.level)} · рівень {progress.level}
        </p>
        <div className="mt-6 max-w-md">
          <div className="mono mb-2 flex justify-between text-[0.68rem] text-muted">
            <span>{store.player.xp} XP</span>
            <span>
              {progress.needed ? `${progress.current}/${progress.needed} до наступного` : "максимум"}
            </span>
          </div>
          <Meter value={progress.ratio} />
        </div>
      </header>

      <dl className="mono mt-8 grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-4">
        <Cell label="Рівнів пройдено" value={`${cleared}/${allLevels.length}`} />
        <Cell label="Зірок" value={`${stars.stars}/${stars.max}`} tone="var(--gold)" />
        <Cell label="Відповідей" value={String(store.stats.totalAnswers)} />
        <Cell label="Макс. комбо" value={`×${store.stats.maxCombo}`} tone="var(--coral)" />
        <Cell label="Стрік" value={`${store.stats.streakDays} дн.`} />
        <Cell label="Вивчено в SRS" value={String(mastered)} tone="var(--jade)" />
        <Cell label="Кредити" value={String(store.player.credits)} tone="var(--gold)" />
        <Cell
          label="Найкращий екзамен"
          value={bestExam ? String(bestExam) : "—"}
          tone={bestExam >= 720 ? "var(--jade)" : undefined}
        />
      </dl>

      <section className="mt-14">
        <h2 className="display text-lg">Точність за доменами</h2>
        <ul className="mt-5 space-y-3.5">
          {allDomains.map((d) => {
            const stat = store.stats.perDomain[d.id] ?? { seen: 0, correct: 0 };
            const ratio = stat.seen === 0 ? 0 : stat.correct / stat.seen;
            return (
              <li key={d.id}>
                <div className="mono mb-1.5 flex items-baseline justify-between text-[0.7rem]">
                  <span className="text-parchment-dim">
                    <span style={{ color: d.accent }}>{d.icon}</span> {d.titleUk}
                  </span>
                  <span className="text-muted">
                    {stat.seen === 0 ? "немає даних" : `${Math.round(ratio * 100)}% з ${stat.seen}`}
                  </span>
                </div>
                <Meter value={ratio} color={d.accent} />
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-14">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="display text-lg">Магазин контексту</h2>
          <span className="mono text-[0.7rem] text-gold">◈ {store.player.credits}</span>
        </div>
        <ul className="grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
          {artifacts.map((a) => {
            const owned = store.player.artifacts[a.id] ?? 0;
            const affordable = store.player.credits >= a.cost;
            return (
              <li key={a.id} className="flex flex-col justify-between gap-4 bg-panel p-4">
                <div>
                  <p className="display text-[0.98rem]">
                    <span className="mr-2 text-coral">{a.icon}</span>
                    {a.name}
                  </p>
                  <p className="mt-1.5 text-[0.85rem] leading-relaxed text-parchment-dim">
                    {a.description}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="mono text-[0.68rem] text-muted">у вас: {owned}</span>
                  <Button
                    disabled={!affordable}
                    onClick={() => {
                      if (buyArtifact(a.id)) setNotice(`Придбано: ${a.name}`);
                    }}
                  >
                    ◈ {a.cost}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mono mt-3 text-[0.66rem] text-muted">
          Кредити нараховуються разом із XP і витрачаються лише тут — рівень персонажа не падає.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="display text-lg">Ачівки</h2>
        <ul className="mt-5 grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => {
            const got = store.achievements[a.id];
            return (
              <li key={a.id} className={`bg-panel p-4 ${got ? "" : "opacity-45"}`}>
                <p className="flex items-baseline gap-2.5">
                  <span className={got ? "text-gold" : "text-hairline-bright"}>{a.icon}</span>
                  <span className="display text-[0.95rem]">{a.title}</span>
                </p>
                <p className="mt-1.5 text-[0.83rem] leading-relaxed text-parchment-dim">
                  {a.description}
                </p>
                {got && (
                  <p className="mono mt-2 text-[0.62rem] text-muted">
                    {new Date(got.unlockedAt).toLocaleDateString("uk-UA")}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-14 border-t border-hairline pt-8">
        <h2 className="display text-lg">Збереження й налаштування</h2>
        <p className="mt-2 max-w-2xl text-[0.9rem] text-parchment-dim">
          Увесь прогрес живе лише в localStorage цього браузера. Очищення даних сайту
          зітре його — зробіть експорт, якщо шкода втратити.
        </p>

        <label className="mono mt-6 flex w-fit cursor-pointer items-center gap-2.5 text-[0.72rem] text-parchment-dim">
          <input
            type="checkbox"
            checked={store.settings.reducedMotion}
            onChange={(e) => setSetting("reducedMotion", e.target.checked)}
            className="h-4 w-4 accent-[var(--coral)]"
          />
          Менше анімацій
        </label>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={download}>Експорт JSON</Button>
          <Button onClick={() => fileRef.current?.click()}>Імпорт JSON</Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const result = importSave(await file.text());
              setNotice(result.ok ? "Збереження відновлено." : result.error);
              e.target.value = "";
            }}
          />
          {confirmReset ? (
            <>
              <Button
                variant="danger"
                onClick={() => {
                  resetProgress();
                  setConfirmReset(false);
                  setNotice("Прогрес скинуто.");
                }}
              >
                Точно скинути все
              </Button>
              <Button variant="ghost" onClick={() => setConfirmReset(false)}>
                Скасувати
              </Button>
            </>
          ) : (
            <Button variant="danger" onClick={() => setConfirmReset(true)}>
              Скинути прогрес
            </Button>
          )}
        </div>

        {notice && <p className="mono mt-4 text-[0.72rem] text-jade">{notice}</p>}
      </section>

      <div className="mt-12">
        <ButtonLink href="/">← На карту</ButtonLink>
      </div>
    </div>
  );
}

function Cell({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="bg-panel p-4">
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-1.5 text-xl" style={tone ? { color: tone } : undefined}>
        {value}
      </dd>
    </div>
  );
}
