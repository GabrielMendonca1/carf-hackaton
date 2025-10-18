import type { SituacaoProcesso } from "@/lib/types/processo";
import { cn } from "@/lib/utils";
import { AlertTriangle, Clock, FileWarning, CheckCircle2 } from "lucide-react";

const situacaoConfig: Record<
  SituacaoProcesso,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: typeof AlertTriangle;
  }
> = {
  normal: {
    label: "Normal",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: CheckCircle2,
  },
  redistribuicao_sugerida: {
    label: "Redistribuição Sugerida",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: AlertTriangle,
  },
  atrasado: {
    label: "Atrasado",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: Clock,
  },
  aguardando_parecer_tecnico: {
    label: "Aguardando Parecer Técnico",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: FileWarning,
  },
};

interface SituacaoBadgeProps {
  situacao: SituacaoProcesso;
  className?: string;
  showIcon?: boolean;
}

export function SituacaoBadge({
  situacao,
  className,
  showIcon = true,
}: SituacaoBadgeProps) {
  const config = situacaoConfig[situacao];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors",
        config.bgColor,
        config.color,
        config.borderColor,
        className
      )}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      <span>{config.label}</span>
    </div>
  );
}
