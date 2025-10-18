import type { DisponibilidadeServidor } from "@/lib/types/processo";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const loadConfig: Record<
  DisponibilidadeServidor,
  {
    label: string;
    color: string;
    bgColor: string;
    barColor: string;
    description: string;
  }
> = {
  disponivel: {
    label: "Disponível",
    color: "text-green-700",
    bgColor: "bg-green-100 border-green-300",
    barColor: "bg-green-500",
    description: "Capacidade disponível para novos processos",
  },
  moderado: {
    label: "Moderado",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100 border-yellow-300",
    barColor: "bg-yellow-500",
    description: "Carga de trabalho moderada",
  },
  sobrecarregado: {
    label: "Sobrecarregado",
    color: "text-red-700",
    bgColor: "bg-red-100 border-red-300",
    barColor: "bg-red-500",
    description: "Acima da capacidade recomendada",
  },
};

interface LoadIndicatorProps {
  disponibilidade: DisponibilidadeServidor;
  cargaAtual?: number;
  className?: string;
  showLabel?: boolean;
  showBar?: boolean;
}

export function LoadIndicator({
  disponibilidade,
  cargaAtual,
  className,
  showLabel = true,
  showBar = true,
}: LoadIndicatorProps) {
  const config = loadConfig[disponibilidade];

  const percentage =
    disponibilidade === "disponivel"
      ? 30
      : disponibilidade === "moderado"
        ? 65
        : 95;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn("inline-flex items-center gap-2", className)}>
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors",
              config.bgColor,
              config.color
            )}
          >
            <Activity className="h-3 w-3" />
            {showLabel && <span>{config.label}</span>}
            {cargaAtual !== undefined && (
              <span className="ml-0.5 font-bold">{cargaAtual}</span>
            )}
          </div>

          {showBar && (
            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full transition-all", config.barColor)}
                style={{ width: `${percentage}%` }}
              />
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-xs">
          <p className="font-medium">{config.label}</p>
          <p className="text-muted-foreground">{config.description}</p>
          {cargaAtual !== undefined && (
            <p className="mt-1">
              Processos ativos: <span className="font-semibold">{cargaAtual}</span>
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
