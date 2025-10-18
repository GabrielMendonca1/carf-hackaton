"use client";

import { useState, useMemo } from "react";
import { AppHeader } from "@/components/app-header";
import { ConsultarFilters, type ConsultarFiltersState } from "@/components/consultar-filters";
import { ConsultarTable } from "@/components/consultar-table";
import { WorkloadDashboard } from "@/components/workload-dashboard";
import { AIInsightsPanel } from "@/components/ai-insights-panel";
import { consultarProcessos } from "@/lib/mock-data/consultar-processos";
import { Button } from "@/components/ui/button";
import { BarChart3, Table, Brain, Download, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ConsultarPageClient() {
  const [filters, setFilters] = useState<ConsultarFiltersState>({
    search: "",
    temas: [],
    status: "todos",
    complexidade: "todos",
    situacao: "todos",
    turma: "todos",
    disponibilidadeServidor: "todos",
  });

  const [viewMode, setViewMode] = useState<"dashboard" | "table">("dashboard");
  const [showInsights, setShowInsights] = useState(true);

  const turmasDisponiveis = useMemo(() => {
    const turmas = new Set<string>();
    consultarProcessos.forEach((p) => {
      if (p.turma) turmas.add(p.turma);
    });
    return Array.from(turmas).sort();
  }, []);

  const filteredProcessos = useMemo(() => {
    let result = [...consultarProcessos];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.numeroProcesso.toLowerCase().includes(searchLower) ||
          p.descricaoResumida.toLowerCase().includes(searchLower) ||
          p.servidorAtual?.nome.toLowerCase().includes(searchLower) ||
          p.setorResponsavel?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.temas.length > 0) {
      result = result.filter((p) => p.tema && filters.temas.includes(p.tema));
    }

    if (filters.status !== "todos") {
      result = result.filter((p) => p.status === filters.status);
    }

    if (filters.complexidade !== "todos") {
      result = result.filter((p) => p.nivelComplexidade === filters.complexidade);
    }

    if (filters.situacao !== "todos") {
      result = result.filter((p) => p.situacao === filters.situacao);
    }

    if (filters.turma !== "todos") {
      result = result.filter((p) => p.turma === filters.turma);
    }

    if (filters.disponibilidadeServidor !== "todos") {
      result = result.filter(
        (p) => p.servidorAtual?.disponibilidade === filters.disponibilidadeServidor
      );
    }

    return result;
  }, [filters]);

  return (
    <div className="flex flex-col w-full h-full">
      <AppHeader />

      <main className="flex-1 overflow-auto">
        <div className="container max-w-[1800px] mx-auto py-6 px-4 md:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Consultar Processos
                </h1>
                <p className="text-muted-foreground mt-1">
                  Visão panorâmica de todos os processos em andamento no CARF
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Atualizar
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>

            <ConsultarFilters
              filters={filters}
              onFiltersChange={setFilters}
              turmasDisponiveis={turmasDisponiveis}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Exibindo{" "}
                  <span className="font-semibold text-foreground">
                    {filteredProcessos.length}
                  </span>{" "}
                  de{" "}
                  <span className="font-semibold text-foreground">
                    {consultarProcessos.length}
                  </span>{" "}
                  processos
                </span>
                {filteredProcessos.length !== consultarProcessos.length && (
                  <Badge variant="secondary">Filtrado</Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "dashboard" ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={() => setViewMode("dashboard")}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={() => setViewMode("table")}
                >
                  <Table className="h-4 w-4" />
                  <span className="hidden sm:inline">Tabela</span>
                </Button>
                <Button
                  variant={showInsights ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={() => setShowInsights(!showInsights)}
                >
                  <Brain className="h-4 w-4" />
                  <span className="hidden sm:inline">Insights IA</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
              <div className="space-y-6">
                {viewMode === "dashboard" ? (
                  <WorkloadDashboard processos={filteredProcessos} />
                ) : (
                  <ConsultarTable
                    processos={filteredProcessos}
                    onProcessoClick={(processo) => {
                      console.log("Ver detalhes:", processo.id);
                    }}
                  />
                )}
              </div>

              {showInsights && (
                <div className="lg:sticky lg:top-6 lg:self-start">
                  <AIInsightsPanel processos={filteredProcessos} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
