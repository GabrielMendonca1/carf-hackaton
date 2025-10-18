"use client";

import type { Processo } from "@/lib/types/processo";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  PieChart,
  Users,
  TrendingUp,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { LoadIndicator } from "./load-indicator";
import { TemaBadge } from "./tema-badge";
import { ComplexityBadge } from "./complexity-badge";

interface WorkloadDashboardProps {
  processos: Processo[];
}

export function WorkloadDashboard({ processos }: WorkloadDashboardProps) {
  const totalProcessos = processos.length;

  const processosPorTurma = processos.reduce(
    (acc, p) => {
      const turma = p.turma || "Sem turma";
      acc[turma] = (acc[turma] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const turmasOrdenadas = Object.entries(processosPorTurma).sort(
    ([, a], [, b]) => b - a
  );

  const processosPorTema = processos.reduce(
    (acc, p) => {
      const tema = p.tema || "OUTROS";
      acc[tema] = (acc[tema] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const temaColors: Record<string, string> = {
    IRPJ: "bg-blue-500",
    IPI: "bg-purple-500",
    COFINS: "bg-green-500",
    PIS: "bg-emerald-500",
    CSLL: "bg-indigo-500",
    ICMS: "bg-orange-500",
    ISS: "bg-pink-500",
    OUTROS: "bg-gray-500",
  };

  const processosPorComplexidade = processos.reduce(
    (acc, p) => {
      acc[p.nivelComplexidade] = (acc[p.nivelComplexidade] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  const servidoresUnicos = new Map();
  processos.forEach((p) => {
    if (p.servidorAtual) {
      servidoresUnicos.set(p.servidorAtual.id, p.servidorAtual);
    }
  });

  const servidores = Array.from(servidoresUnicos.values());

  const servidoresSobrecarregados = servidores.filter(
    (s) => s.disponibilidade === "sobrecarregado"
  ).length;

  const processosAtrasados = processos.filter((p) =>
    p.prazos.some((prazo) => prazo.status === "atrasado")
  ).length;

  const processosRedistribuicao = processos.filter(
    (p) => p.situacao === "redistribuicao_sugerida"
  ).length;

  const complexidadeMedia =
    processos.reduce((acc, p) => acc + p.nivelComplexidade, 0) /
      totalProcessos || 0;

  const maxProcessosTurma = Math.max(...Object.values(processosPorTurma), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total de Processos
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProcessos}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Distribuídos em {turmasOrdenadas.length} turmas
            </p>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "border-l-4",
            servidoresSobrecarregados > 0
              ? "border-l-red-500"
              : "border-l-green-500"
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Servidores Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servidores.length}</div>
            <p
              className={cn(
                "text-xs mt-1 font-medium",
                servidoresSobrecarregados > 0
                  ? "text-red-600"
                  : "text-green-600"
              )}
            >
              {servidoresSobrecarregados > 0
                ? `${servidoresSobrecarregados} sobrecarregados`
                : "Capacidade adequada"}
            </p>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "border-l-4",
            processosAtrasados > 0 ? "border-l-red-500" : "border-l-green-500"
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Processos Atrasados
            </CardTitle>
            <AlertTriangle
              className={cn(
                "h-4 w-4",
                processosAtrasados > 0 ? "text-red-600" : "text-green-600"
              )}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processosAtrasados}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((processosAtrasados / totalProcessos) * 100).toFixed(1)}% do
              total
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Redistribuições Sugeridas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processosRedistribuicao}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requer atenção da equipe
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Distribuição por Turma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {turmasOrdenadas.map(([turma, count]) => {
              const percentage = (count / maxProcessosTurma) * 100;
              return (
                <div key={turma} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{turma}</span>
                    <span className="text-muted-foreground">
                      {count}{" "}
                      {count === 1 ? "processo" : "processos"}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Processos por Tema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(processosPorTema)
                .sort(([, a], [, b]) => b - a)
                .map(([tema, count]) => (
                  <div
                    key={tema}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <TemaBadge
                        tema={tema as any}
                        size="sm"
                        showIcon={false}
                      />
                      <span className="text-xs text-muted-foreground">
                        {count} {count === 1 ? "processo" : "processos"}
                      </span>
                    </div>
                    <div className="text-lg font-bold">{count}</div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Carga por Servidor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {servidores
              .sort((a, b) => (b.cargaAtual || 0) - (a.cargaAtual || 0))
              .slice(0, 6)
              .map((servidor) => (
                <div
                  key={servidor.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">
                      {servidor.nome}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {servidor.turma}
                    </span>
                  </div>
                  {servidor.disponibilidade && (
                    <LoadIndicator
                      disponibilidade={servidor.disponibilidade}
                      cargaAtual={servidor.cargaAtual}
                      showLabel={false}
                    />
                  )}
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Distribuição por Complexidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {([1, 2, 3, 4] as const).map((nivel) => {
              const count = processosPorComplexidade[nivel] || 0;
              const percentage = (count / totalProcessos) * 100;
              return (
                <div key={nivel} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <ComplexityBadge nivel={nivel} />
                    <span className="text-sm text-muted-foreground">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all",
                        nivel === 1 && "bg-green-500",
                        nivel === 2 && "bg-yellow-500",
                        nivel === 3 && "bg-orange-500",
                        nivel === 4 && "bg-red-500"
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="pt-3 mt-3 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Complexidade Média:</span>
                <span className="text-lg font-bold">
                  {complexidadeMedia.toFixed(1)}/4
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
