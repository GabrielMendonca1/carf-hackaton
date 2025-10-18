import type { NivelComplexidade } from "@/lib/types/processo";
import { cn } from "@/lib/utils";

const complexidadeConfig = {
  1: {
    label: "BAIXO",
    color: "bg-green-500 text-white",
    description: "Processo de baixa complexidade",
  },
  2: {
    label: "MÉDIO",
    color: "bg-yellow-500 text-white",
    description: "Processo de média complexidade",
  },
  3: {
    label: "ALTO",
    color: "bg-orange-500 text-white",
    description: "Processo de alta complexidade",
  },
  4: {
    label: "MUITO ALTO",
    color: "bg-red-500 text-white",
    description: "Processo de complexidade muito alta",
  },
} as const;

interface ComplexityBadgeProps {
  nivel: NivelComplexidade;
  className?: string;
  showLabel?: boolean;
}

export function ComplexityBadge({
  nivel,
  className,
  showLabel = true,
}: ComplexityBadgeProps) {
  const config = complexidadeConfig[nivel];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
        config.color,
        className
      )}
      title={config.description}
    >
      <div className="flex gap-0.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 w-1 rounded-sm",
              i < nivel ? "bg-current" : "bg-white/30"
            )}
          />
        ))}
      </div>
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}
