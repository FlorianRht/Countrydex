import { motion } from "framer-motion";
import type { Country } from "@/lib/types";
import { STAT_LABELS } from "@/lib/country-utils";

type StatBarsProps = {
  stats: Country["stats"];
  compact?: boolean;
  tone?: "default" | "explore";
};

const STAT_EASE = [0.22, 1, 0.36, 1] as const;

export function StatBars({ stats, compact = false, tone = "default" }: StatBarsProps) {
  const barClass =
    tone === "explore"
      ? "bg-gradient-to-r from-sky-500 to-cyan-400"
      : "bg-gradient-to-r from-dex-red to-dex-red-light";

  return (
    <div className={compact ? "space-y-2.5" : "space-y-3"}>
      {(Object.keys(stats) as Array<keyof Country["stats"]>).map((key, index) => (
        <div key={key} className="grid grid-cols-[88px_1fr_36px] items-center gap-2">
          <span className={`font-medium text-dex-muted ${compact ? "text-xs" : "text-sm"}`}>
            {STAT_LABELS[key]}
          </span>
          <div className="h-2 overflow-hidden rounded-full bg-dex-panel-dark/80">
            <motion.div
              className={`h-full rounded-full ${barClass}`}
              initial={{ width: 0 }}
              animate={{ width: `${stats[key]}%` }}
              transition={{ duration: 0.55, ease: STAT_EASE, delay: index * 0.06 }}
            />
          </div>
          <motion.span
            className={`text-right font-mono text-dex-cream ${compact ? "text-xs" : "text-sm"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.06 + 0.2 }}
          >
            {stats[key]}
          </motion.span>
        </div>
      ))}
    </div>
  );
}
