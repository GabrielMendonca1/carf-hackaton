import type { StatusProcesso } from "@/lib/types/processo";
import { cn } from "@/lib/utils";

const statusConfig = {
  em_analise: {
    label: "Em análise",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    dotColor: "bg-blue-500",
  },
  aguardando_manifestacao: {
    label: "Aguardando manifestação",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    dotColor: "bg-yellow-500",
  },
  em_relatoria: {
    label: "Em relatoria",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    dotColor: "bg-purple-500",
  },
  encerrado: {
    label: "Encerrado",
    color: "bg-green-100 text-green-800 border-green-200",
    dotColor: "bg-green-500",
  },
} as const;

interface StatusBadgeProps {
  status: StatusProcesso;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({
  status,
  className,
  showDot = true,
}: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors",
        config.color,
        className
      )}
    >
      {showDot && (
        <div
          className={cn("h-1.5 w-1.5 rounded-full animate-pulse", config.dotColor)}
        />
      )}
      <span>{config.label}</span>
    </div>
  );
}
