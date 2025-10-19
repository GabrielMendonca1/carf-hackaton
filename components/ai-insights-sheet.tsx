"use client";

import type { Processo } from "@/lib/types/processo";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  Brain,
  AlertTriangle,
  TrendingUp,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Scale,
  X,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Card, CardContent } from "./ui/card";

interface AIInsightsSheetProps {
  processos: Processo[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Insight {
  id: string;
  type: "warning" | "suggestion" | "success" | "info";
  title: string;
  description: string;
  icon: typeof AlertTriangle;
  priority: "high" | "medium" | "low";
  actionLabel?: string;
  relatedProcessos?: string[];
}

export function AIInsightsSheet({
  processos,
  open,
  onOpenChange,
}: AIInsightsSheetProps) {
  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];

    const servidoresSobrecarregados = new Map<string, number>();
    processos.forEach((p) => {
      if (
        p.servidorAtual &&
        p.servidorAtual.disponibilidade === "sobrecarregado"
      ) {
        const count = servidoresSobrecarregados.get(p.servidorAtual.id) || 0;
        servidoresSobrecarregados.set(p.servidorAtual.id, count + 1);
      }
    });

    servidoresSobrecarregados.forEach((count, servidorId) => {
      const servidor = processos.find((p) => p.servidorAtual?.id === servidorId)
        ?.servidorAtual;
      if (servidor) {
        insights.push({
          id: `overload-${servidorId}`,
          type: "warning",
          title: `Servidor ${servidor.nome} sobrecarregado`,
          description: `Com ${count} processos ativos, está acima da capacidade recomendada. Considere redistribuir processos de menor complexidade.`,
          icon: AlertTriangle,
          priority: "high",
          actionLabel: "Ver processos",
        });
      }
    });

    const processosRedistribuicao = processos.filter(
      (p) => p.situacao === "redistribuicao_sugerida"
    );
    if (processosRedistribuicao.length > 0) {
      insights.push({
        id: "redistribution-suggested",
        type: "suggestion",
        title: `${processosRedistribuicao.length} processos para redistribuição`,
        description:
          "A IA identificou processos que podem ser redistribuídos para otimizar a carga de trabalho da equipe.",
        icon: TrendingUp,
        priority: "high",
        actionLabel: "Revisar sugestões",
        relatedProcessos: processosRedistribuicao.map((p) => p.numeroProcesso),
      });
    }

    const processosAtrasados = processos.filter((p) =>
      p.prazos.some((prazo) => prazo.status === "atrasado")
    );
    if (processosAtrasados.length > 0) {
      insights.push({
        id: "delayed-processes",
        type: "warning",
        title: `${processosAtrasados.length} processos com prazos vencidos`,
        description:
          "Estes processos requerem atenção imediata para evitar penalidades ou prejuízos administrativos.",
        icon: Clock,
        priority: "high",
        actionLabel: "Ver processos atrasados",
      });
    }

    const temasPorServidor = new Map<string, Set<string>>();
    processos.forEach((p) => {
      if (p.servidorAtual && p.tema) {
        if (!temasPorServidor.has(p.servidorAtual.id)) {
          temasPorServidor.set(p.servidorAtual.id, new Set());
        }
        temasPorServidor.get(p.servidorAtual.id)?.add(p.tema);
      }
    });

    const processosCompeciaSimilar = processos.filter((p) => {
      if (!p.servidorAtual || !p.tema) return false;
      const especialidades = p.servidorAtual.especialidades || [];
      return !especialidades.includes(p.tema) && especialidades.length > 0;
    });

    if (processosCompeciaSimilar.length > 0) {
      insights.push({
        id: "competency-mismatch",
        type: "suggestion",
        title: "Oportunidades de matching por competência",
        description: `${processosCompeciaSimilar.length} processos podem ser melhor alocados considerando as especialidades dos servidores.`,
        icon: Users,
        priority: "medium",
        actionLabel: "Ver sugestões",
      });
    }

    const processosAltaComplexidade = processos.filter(
      (p) =>
        p.nivelComplexidade === 4 &&
        p.servidorAtual?.disponibilidade === "sobrecarregado"
    );
    if (processosAltaComplexidade.length > 0) {
      insights.push({
        id: "high-complexity-overload",
        type: "warning",
        title: "Processos complexos em servidores sobrecarregados",
        description: `${processosAltaComplexidade.length} processos de alta complexidade estão com servidores acima da capacidade.`,
        icon: Scale,
        priority: "high",
        actionLabel: "Revisar alocação",
      });
    }

    const processosSimilares = processos.filter(
      (p) => p.pecasSimilares.length > 0
    );
    if (processosSimilares.length >= 3) {
      insights.push({
        id: "similar-cases",
        type: "info",
        title: "Peças similares detectadas",
        description: `A IA encontrou ${processosSimilares.length} processos com peças similares que podem acelerar a análise.`,
        icon: Sparkles,
        priority: "low",
        actionLabel: "Ver similaridades",
      });
    }

    const processosEncerrados = processos.filter(
      (p) => p.status === "encerrado"
    );
    if (processosEncerrados.length > 0) {
      const percentualConclusao =
        (processosEncerrados.length / processos.length) * 100;
      if (percentualConclusao > 20) {
        insights.push({
          id: "good-completion-rate",
          type: "success",
          title: "Ótima taxa de conclusão!",
          description: `${percentualConclusao.toFixed(0)}% dos processos foram encerrados. A equipe está mantendo um bom ritmo de trabalho.`,
          icon: CheckCircle2,
          priority: "low",
        });
      }
    }

    return insights.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const insights = generateInsights();

  const getInsightStyles = (type: Insight["type"]) => {
    switch (type) {
      case "warning":
        return {
          bg: "bg-red-50 dark:bg-red-950/20",
          border: "border-red-200 dark:border-red-800",
          iconColor: "text-red-600 dark:text-red-400",
          badgeColor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        };
      case "suggestion":
        return {
          bg: "bg-blue-50 dark:bg-blue-950/20",
          border: "border-blue-200 dark:border-blue-800",
          iconColor: "text-blue-600 dark:text-blue-400",
          badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        };
      case "success":
        return {
          bg: "bg-green-50 dark:bg-green-950/20",
          border: "border-green-200 dark:border-green-800",
          iconColor: "text-green-600 dark:text-green-400",
          badgeColor:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        };
      case "info":
        return {
          bg: "bg-purple-50 dark:bg-purple-950/20",
          border: "border-purple-200 dark:border-purple-800",
          iconColor: "text-purple-600 dark:text-purple-400",
          badgeColor:
            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        };
    }
  };

  const getPriorityLabel = (priority: Insight["priority"]) => {
    switch (priority) {
      case "high":
        return "Alta Prioridade";
      case "medium":
        return "Média Prioridade";
      case "low":
        return "Baixa Prioridade";
    }
  };

  const highPriorityCount = insights.filter((i) => i.priority === "high").length;
  const mediumPriorityCount = insights.filter((i) => i.priority === "medium")
    .length;
  const lowPriorityCount = insights.filter((i) => i.priority === "low").length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-2xl overflow-hidden p-0"
      >
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 pt-6 pb-4 border-b space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <SheetTitle className="text-xl">Insights da IA</SheetTitle>
                  <SheetDescription className="text-sm mt-1">
                    Análise inteligente de {processos.length} processos
                  </SheetDescription>
                </div>
              </div>
            </div>

            {insights.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {highPriorityCount > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {highPriorityCount} Alta
                  </Badge>
                )}
                {mediumPriorityCount > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {mediumPriorityCount} Média
                  </Badge>
                )}
                {lowPriorityCount > 0 && (
                  <Badge variant="outline" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {lowPriorityCount} Baixa
                  </Badge>
                )}
              </div>
            )}
          </SheetHeader>

          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 py-6">
              {insights.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="inline-flex p-4 rounded-full bg-muted/50 mb-4">
                    <Sparkles className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    Nenhum insight disponível
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    A IA está analisando os processos. Novos insights aparecerão
                    aqui assim que estiverem disponíveis.
                  </p>
                </div>
              ) : (
                insights.map((insight, index) => {
                  const styles = getInsightStyles(insight.type);
                  const Icon = insight.icon;

                  return (
                    <Card
                      key={insight.id}
                      className={cn(
                        "border-l-4 transition-all hover:shadow-lg animate-in fade-in slide-in-from-right duration-300",
                        styles.bg,
                        styles.border
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <CardContent className="p-5 space-y-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "p-2.5 rounded-lg bg-background shadow-sm",
                              styles.iconColor
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-base leading-tight">
                                {insight.title}
                              </h4>
                              <Badge
                                variant="outline"
                                className={cn("text-xs shrink-0", styles.badgeColor)}
                              >
                                {getPriorityLabel(insight.priority)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {insight.description}
                            </p>

                            {insight.relatedProcessos &&
                              insight.relatedProcessos.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-2">
                                  {insight.relatedProcessos
                                    .slice(0, 3)
                                    .map((num) => (
                                      <Badge
                                        key={num}
                                        variant="secondary"
                                        className="text-xs font-mono"
                                      >
                                        {num}
                                      </Badge>
                                    ))}
                                  {insight.relatedProcessos.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{insight.relatedProcessos.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                          </div>
                        </div>

                        {insight.actionLabel && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            {insight.actionLabel}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
