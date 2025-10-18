"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import type { StatusProcesso } from "@/lib/types/processo";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

export type MetricFilterType =
  | "todos"
  | "atrasados"
  | "proximo_vencimento"
  | "encerrados"
  | null;

export interface ProcessFiltersState {
  search: string;
  status: StatusProcesso | "todos";
  ordenacao: "prazo" | "data" | "numero";
  metricFilter: MetricFilterType;
}

interface ProcessFiltersProps {
  filters: ProcessFiltersState;
  onFiltersChange: (filters: ProcessFiltersState) => void;
}

export function ProcessFilters({
  filters,
  onFiltersChange,
}: ProcessFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value as ProcessFiltersState["status"],
    });
  };


  const handleOrdenacaoChange = (value: string) => {
    onFiltersChange({
      ...filters,
      ordenacao: value as ProcessFiltersState["ordenacao"],
    });
  };

  const handleReset = () => {
    onFiltersChange({
      search: "",
      status: "todos",
      ordenacao: "prazo",
      metricFilter: null,
    });
    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="relative flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por número ou descrição..."
            type="search"
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="gap-2 sm:w-auto w-full">
              <SlidersHorizontal className="h-4 w-4" />
              Filtros Avançados
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="absolute z-50 left-0 right-0 mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 border rounded-lg bg-background shadow-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <Select value={filters.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="em_analise">Em análise</SelectItem>
                    <SelectItem value="aguardando_manifestacao">
                      Aguardando manifestação
                    </SelectItem>
                    <SelectItem value="em_relatoria">Em relatoria</SelectItem>
                    <SelectItem value="encerrado">Encerrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Ordenar por
                </label>
                <Select
                  value={filters.ordenacao}
                  onValueChange={handleOrdenacaoChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prazo">Prazo</SelectItem>
                    <SelectItem value="data">Data de atualização</SelectItem>
                    <SelectItem value="numero">Número do processo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Limpar filtros
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
