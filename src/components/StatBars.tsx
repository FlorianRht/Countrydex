import type { Country } from "@/lib/types";
import { STAT_LABELS } from "@/lib/country-utils";

type StatBarsProps = {
  stats: Country["stats"];
  compact?: boolean;
};

export function StatBars({ stats, compact = false }: StatBarsProps) {
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {(Object.keys(stats) as Array<keyof Country["stats"]>).map((key) => (
        <div key={key} className="grid grid-cols-[88px_1fr_36px] items-center gap-2">
          <span className={`font-medium text-dex-muted ${compact ? "text-xs" : "text-sm"}`}>
            {STAT_LABELS[key]}
          </span>
          <div className="h-2.5 overflow-hidden rounded-full bg-dex-panel-dark">
            <div
              className="h-full rounded-full bg-gradient-to-r from-dex-red to-dex-red-light transition-all duration-500"
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
