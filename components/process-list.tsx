"use client";

import { useState, useMemo } from "react";
import { FileSearch } from "lucide-react";
import type { Processo } from "@/lib/types/processo";
import { ProcessCard } from "./process-card";
import { ProcessFilters, type ProcessFiltersState } from "./process-filters";
import { ProcessMetrics } from "./process-metrics";

interface ProcessListProps {
  processos: Processo[];
}

export function ProcessList({ processos }: ProcessListProps) {
  const [filters, setFilters] = useState<ProcessFiltersState>({
    search: "",
    status: "todos",
    ordenacao: "prazo",
    metricFilter: null,
  });

  const handleMetricClick = (metric: ProcessFiltersState["metricFilter"]) => {
    setFilters((prev) => ({ ...prev, metricFilter: metric }));
  };

  const filteredAndSortedProcessos = useMemo(() => {
    let result = [...processos];

    if (filters.metricFilter) {
      switch (filters.metricFilter) {
        case "atrasados":
          result = result.filter((p) =>
            p.prazos.some((prazo) => prazo.status === "atrasado")
          );
          break;
        case "proximo_vencimento":
          result = result.filter((p) =>
            p.prazos.some((prazo) => prazo.status === "proximo_vencimento")
          );
          break;
        case "encerrados":
          result = result.filter((p) => p.status === "encerrado");
          break;
        case "todos":
        default:
          break;
      }
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.numeroProcesso.toLowerCase().includes(searchLower) ||
          p.descricaoResumida.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status !== "todos") {
      result = result.filter((p) => p.status === filters.status);
    }

    result.sort((a, b) => {
      switch (filters.ordenacao) {
        case "prazo": {
          const prazoA = Math.min(...a.prazos.map((p) => p.diasRestantes));
          const prazoB = Math.min(...b.prazos.map((p) => p.diasRestantes));
          return prazoA - prazoB;
        }
        case "data":
          return b.atualizadoEm.getTime() - a.atualizadoEm.getTime();
        case "numero":
          return a.numeroProcesso.localeCompare(b.numeroProcesso);
        default:
          return 0;
      }
    });

    return result;
  }, [processos, filters]);

  return (
    <div className="space-y-6">
      <ProcessMetrics
        processos={processos}
        selectedMetric={filters.metricFilter}
        onMetricClick={handleMetricClick}
      />

      <ProcessFilters filters={filters} onFiltersChange={setFilters} />

      {filteredAndSortedProcessos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileSearch className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            Nenhum processo encontrado
          </h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            {filters.search || filters.status !== "todos"
              ? "Tente ajustar os filtros para encontrar o que procura."
              : "Você ainda não possui processos sob sua responsabilidade."}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Exibindo <span className="font-semibold">{filteredAndSortedProcessos.length}</span>{" "}
              {filteredAndSortedProcessos.length === 1 ? "processo" : "processos"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedProcessos.map((processo) => (
              <ProcessCard
                key={processo.id}
                processo={processo}
                onClick={() => {
                  console.log("Abrir detalhes do processo:", processo.id);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
