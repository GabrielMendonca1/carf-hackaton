"use client";

import { useState, useMemo, useEffect } from "react";
import { AppHeader } from "@/components/app-header";
import { ConsultarFilters, type ConsultarFiltersState } from "@/components/consultar-filters";
import { ConsultarTable } from "@/components/consultar-table";
import { WorkloadDashboard } from "@/components/workload-dashboard";
import { AIInsightsPanel } from "@/components/ai-insights-panel";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { TableSkeleton } from "@/components/table-skeleton";
import { EmptyState } from "@/components/empty-state";
import { consultarProcessos } from "@/lib/mock-data/consultar-processos";
import { Button } from "@/components/ui/button";
import { BarChart3, Table, Brain, Download, RefreshCw, FileSearch, LayoutList, Maximize2, Minimize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success("Dados atualizados com sucesso!");
  };

  const handleExport = () => {
    toast.success(`Exportando ${filteredProcessos.length} processos...`);
  };

  const handleViewModeChange = (mode: "dashboard" | "table") => {
    setIsLoading(true);
    setViewMode(mode);
    setTimeout(() => setIsLoading(false), 300);
  };

  useEffect(() => {
    const savedCompactMode = localStorage.getItem("consultar-compact-mode");
    if (savedCompactMode) {
      setCompactMode(JSON.parse(savedCompactMode));
    }
  }, []);

  const toggleCompactMode = () => {
    const newMode = !compactMode;
    setCompactMode(newMode);
    localStorage.setItem("consultar-compact-mode", JSON.stringify(newMode));
    toast.success(newMode ? "Modo compacto ativado" : "Modo confortável ativado");
  };

  return (
    <div className="flex flex-col w-full h-full">
      <AppHeader />

      <main className="flex-1 overflow-auto">
        <div className="container max-w-[1800px] mx-auto py-6 px-4 md:px-6 lg:px-8">
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  Consultar Processos
                </h1>
                <p className="text-muted-foreground mt-1">
                  Visão panorâmica de todos os processos em andamento no CARF
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline">Atualizar</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
                  onClick={handleExport}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Exportar</span>
                </Button>
              </div>
            </div>

            <ConsultarFilters
              filters={filters}
              onFiltersChange={setFilters}
              turmasDisponiveis={turmasDisponiveis}
            />

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground animate-in fade-in duration-500">
                  Exibindo{" "}
                  <span className="font-semibold text-foreground tabular-nums">
                    {filteredProcessos.length}
                  </span>{" "}
                  de{" "}
                  <span className="font-semibold text-foreground tabular-nums">
                    {consultarProcessos.length}
                  </span>{" "}
                  processos
                </span>
                {filteredProcessos.length !== consultarProcessos.length && (
                  <Badge variant="secondary" className="animate-in zoom-in duration-300">
                    Filtrado
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "dashboard" ? "default" : "outline"}
                  size="sm"
                  className="gap-2 transition-all hover:scale-105"
                  onClick={() => handleViewModeChange("dashboard")}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  className="gap-2 transition-all hover:scale-105"
                  onClick={() => handleViewModeChange("table")}
                >
                  <Table className="h-4 w-4" />
                  <span className="hidden sm:inline">Tabela</span>
                </Button>
                {viewMode === "table" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 transition-all hover:scale-105 animate-in slide-in-from-right duration-300"
                    onClick={toggleCompactMode}
                  >
                    {compactMode ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    <span className="hidden sm:inline">{compactMode ? "Expandir" : "Compacto"}</span>
                  </Button>
                )}
                <Button
                  variant={showInsights ? "default" : "outline"}
                  size="sm"
                  className="gap-2 transition-all hover:scale-105"
                  onClick={() => setShowInsights(!showInsights)}
                >
                  <Brain className="h-4 w-4" />
                  <span className="hidden sm:inline">Insights IA</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
              <div className="space-y-6">
                {isLoading ? (
                  viewMode === "dashboard" ? (
                    <DashboardSkeleton />
                  ) : (
                    <TableSkeleton />
                  )
                ) : filteredProcessos.length === 0 ? (
                  <EmptyState
                    icon={FileSearch}
                    title="Nenhum processo encontrado"
                    description={
                      filters.search ||
                      filters.temas.length > 0 ||
                      filters.status !== "todos" ||
                      filters.complexidade !== "todos" ||
                      filters.situacao !== "todos" ||
                      filters.turma !== "todos"
                        ? "Tente ajustar os filtros para encontrar o que procura. Use a busca ou remova alguns filtros ativos."
                        : "Não há processos cadastrados no sistema no momento."
                    }
                    actionLabel="Limpar Filtros"
                    onAction={() =>
                      setFilters({
                        search: "",
                        temas: [],
                        status: "todos",
                        complexidade: "todos",
                        situacao: "todos",
                        turma: "todos",
                        disponibilidadeServidor: "todos",
                      })
                    }
                  />
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {viewMode === "dashboard" ? (
                      <WorkloadDashboard processos={filteredProcessos} />
                    ) : (
                      <ConsultarTable
                        processos={filteredProcessos}
                        compactMode={compactMode}
                        onProcessoClick={(processo) => {
                          toast.info(`Abrindo detalhes do processo ${processo.numeroProcesso}`);
                        }}
                      />
                    )}
                  </div>
                )}
              </div>

              {showInsights && (
                <div className="lg:sticky lg:top-6 lg:self-start animate-in slide-in-from-right duration-500">
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
