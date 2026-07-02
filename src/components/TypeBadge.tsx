import type { CountryType } from "@/lib/types";
import { TYPE_COLORS } from "@/lib/country-utils";

type TypeBadgeProps = {
  type: CountryType;
  size?: "sm" | "md";
};

export function TypeBadge({ type, size = "sm" }: TypeBadgeProps) {
  const colors = TYPE_COLORS[type];
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold uppercase tracking-wide ${colors.bg} ${colors.text} ${colors.border} ${sizeClass}`}
    >
      {type}
    </span>
  );
}
