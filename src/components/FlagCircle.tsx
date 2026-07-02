import { getFlagUrl } from "@/lib/country-utils";

const SIZE_CLASS = {
  sm: "flag-circle-sm",
  md: "flag-circle-md",
  lg: "flag-circle-lg",
} as const;

type FlagCircleProps = {
  code: string;
  name: string;
  size?: keyof typeof SIZE_CLASS;
  className?: string;
};

export function FlagCircle({
  code,
  name,
  size = "md",
  className = "",
}: FlagCircleProps) {
  return (
    <span className={`flag-circle ${SIZE_CLASS[size]} ${className}`.trim()}>
      {/* SVG vectoriel : net à toute échelle */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={getFlagUrl(code)}
        alt={`Drapeau ${name}`}
        className="flag-circle-img"
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}
