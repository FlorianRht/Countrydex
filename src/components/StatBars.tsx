import type { Country } from "@/lib/types";
import { STAT_LABELS } from "@/lib/country-utils";

type StatBarsProps = {
  stats: Country["stats"];
  compact?: boolean;
  tone?: "default" | "explore";
};

export function StatBars({ stats, compact = false, tone = "default" }: StatBarsProps) {
  const barClass =
    tone === "explore"
      ? "bg-gradient-to-r from-sky-500 to-cyan-400"
      : "bg-gradient-to-r from-dex-red to-dex-red-light";

  return (
    <div className={compact ? "space-y-2.5" : "space-y-3"}>
      {(Object.keys(stats) as Array<keyof Country["stats"]>).map((key) => (
        <div key={key} className="grid grid-cols-[88px_1fr_36px] items-center gap-2">
          <span className={`font-medium text-dex-muted ${compact ? "text-xs" : "text-sm"}`}>
            {STAT_LABELS[key]}
          </span>
          <div className="h-2 overflow-hidden rounded-full bg-dex-panel-dark/80">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barClass}`}
              style={{ width: `${stats[key]}%` }}
            />
          </div>
          <span className={`text-right font-mono text-dex-cream ${compact ? "text-xs" : "text-sm"}`}>
            {stats[key]}
          </span>
        </div>
      ))}
    </div>
  );
}
