"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  TrendingUp,
} from "lucide-react";
import type { Processo } from "@/lib/types/processo";
import { cn } from "@/lib/utils";
import type { MetricFilterType } from "./process-filters";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ProcessMetricsProps {
  processos: Processo[];
  selectedMetric: MetricFilterType;
  onMetricClick: (metric: MetricFilterType) => void;
}

export function ProcessMetrics({
  processos,
  selectedMetric,
  onMetricClick,
}: ProcessMetricsProps) {
  const totalProcessos = processos.length;

  const processosAtrasados = processos.filter((p) =>
    p.prazos.some((prazo) => prazo.status === "atrasado")
  ).length;

  const processosProximoVencimento = processos.filter((p) =>
    p.prazos.some((prazo) => prazo.status === "proximo_vencimento")
  ).length;

  const processosEncerrados = processos.filter(
    (p) => p.status === "encerrado"
  ).length;

  const complexidadeMedia =
    processos.reduce((acc, p) => acc + p.nivelComplexidade, 0) / totalProcessos ||
    0;

  const complexidadeMediaLabel = ["Baixo", "Médio", "Alto", "Muito Alto"][
    Math.round(complexidadeMedia) - 1
  ];

  const metrics = [
    {
      id: "todos" as MetricFilterType,
      title: "Total de Processos",
      value: totalProcessos,
      description: "Sob sua responsabilidade",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-500",
      hoverBg: "hover:bg-blue-50",
    },
    {
      id: "atrasados" as MetricFilterType,
      title: "Processos Atrasados",
      value: processosAtrasados,
      description: "Requerem atenção.",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      borderColor: "border-red-500",
      hoverBg: "hover:bg-red-50",
    },
    {
      id: "proximo_vencimento" as MetricFilterType,
      title: "Próximo do Vencimento",
      value: processosProximoVencimento,
      description: "Atenção nos próximos dias",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-500",
      hoverBg: "hover:bg-yellow-50",
    },
    {
      id: "encerrados" as MetricFilterType,
      title: "Processos Encerrados",
      value: processosEncerrados,
      description: "Concluídos com sucesso",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-500",
      hoverBg: "hover:bg-green-50",
    },
    {
      id: null,
      title: "Complexidade Média",
      value: complexidadeMediaLabel,
      description: `Nível ${complexidadeMedia.toFixed(1)} de 4`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      borderColor: "border-purple-500",
      hoverBg: "hover:bg-purple-50",
      disabled: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((metric) => {
        const isSelected = selectedMetric === metric.id;
        const isClickable = !metric.disabled;

        return (
          <Card
            key={metric.title}
            className={cn(
              "transition-all",
              isClickable && "cursor-pointer",
              isClickable && metric.hoverBg,
              isClickable && "hover:shadow-lg hover:scale-[1.02]",
              isSelected && "border-2 shadow-lg",
              isSelected && metric.borderColor,
              !isClickable && "opacity-75"
            )}
            onClick={() => {
              if (isClickable) {
                onMetricClick(isSelected ? null : metric.id);
              }
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div
                className={cn(
                  "p-2 rounded-lg transition-transform",
                  metric.bgColor,
                  isSelected && "scale-110"
                )}
              >
                <metric.icon className={cn("h-4 w-4", metric.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
              {isClickable && (
                <p className="text-xs text-primary mt-2 font-medium">
                  {isSelected ? "Filtro ativo" : "Clique para filtrar"}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
