"use client";

import { useState } from "react";
import type {
  TemaProcesso,
  StatusProcesso,
  NivelComplexidade,
  SituacaoProcesso,
  DisponibilidadeServidor,
} from "@/lib/types/processo";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Search, SlidersHorizontal, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConsultarFiltersState {
  search: string;
  temas: TemaProcesso[];
  status: StatusProcesso | "todos";
  complexidade: NivelComplexidade | "todos";
  situacao: SituacaoProcesso | "todos";
  turma: string | "todos";
  disponibilidadeServidor: DisponibilidadeServidor | "todos";
}

interface ConsultarFiltersProps {
  filters: ConsultarFiltersState;
  onFiltersChange: (filters: ConsultarFiltersState) => void;
  turmasDisponiveis: string[];
}

const TEMAS: TemaProcesso[] = [
  "IRPJ",
  "IPI",
  "COFINS",
  "PIS",
  "CSLL",
  "ICMS",
  "ISS",
  "OUTROS",
];

export function ConsultarFilters({
  filters,
  onFiltersChange,
  turmasDisponiveis,
}: ConsultarFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const toggleTema = (tema: TemaProcesso) => {
    const newTemas = filters.temas.includes(tema)
      ? filters.temas.filter((t) => t !== tema)
      : [...filters.temas, tema];
    onFiltersChange({ ...filters, temas: newTemas });
  };

  const handleReset = () => {
    onFiltersChange({
      search: "",
      temas: [],
      status: "todos",
      complexidade: "todos",
      situacao: "todos",
      turma: "todos",
      disponibilidadeServidor: "todos",
    });
    setIsOpen(false);
  };

  const activeFiltersCount =
    (filters.temas.length > 0 ? 1 : 0) +
    (filters.status !== "todos" ? 1 : 0) +
    (filters.complexidade !== "todos" ? 1 : 0) +
    (filters.situacao !== "todos" ? 1 : 0) +
    (filters.turma !== "todos" ? 1 : 0) +
    (filters.disponibilidadeServidor !== "todos" ? 1 : 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por número, descrição, servidor..."
            type="search"
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant={activeFiltersCount > 0 ? "default" : "outline"}
              className="gap-2 sm:w-auto w-full"
            >
              <Filter className="h-4 w-4" />
              Filtros Avançados
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="absolute z-50 left-0 right-0 mt-3">
            <div className="border rounded-lg bg-background shadow-lg p-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold">Temas Tributários</label>
                  {filters.temas.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        onFiltersChange({ ...filters, temas: [] })
                      }
                      className="h-7 text-xs"
                    >
                      Limpar
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {TEMAS.map((tema) => (
                    <Badge
                      key={tema}
                      variant={
                        filters.temas.includes(tema) ? "default" : "outline"
                      }
                      className={cn(
                        "cursor-pointer transition-all hover:scale-105",
                        filters.temas.includes(tema) &&
                          "shadow-sm ring-2 ring-primary/20"
                      )}
                      onClick={() => toggleTema(tema)}
                    >
                      {tema}
                      {filters.temas.includes(tema) && (
                        <X className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      onFiltersChange({
                        ...filters,
                        status: value as StatusProcesso | "todos",
                      })
                    }
                  >
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
                    Complexidade
                  </label>
                  <Select
                    value={filters.complexidade.toString()}
                    onValueChange={(value) =>
                      onFiltersChange({
                        ...filters,
                        complexidade:
                          value === "todos"
                            ? "todos"
                            : (Number(value) as NivelComplexidade),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="1">Baixo</SelectItem>
                      <SelectItem value="2">Médio</SelectItem>
                      <SelectItem value="3">Alto</SelectItem>
                      <SelectItem value="4">Muito Alto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Situação
                  </label>
                  <Select
                    value={filters.situacao}
                    onValueChange={(value) =>
                      onFiltersChange({
                        ...filters,
                        situacao: value as SituacaoProcesso | "todos",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="atrasado">Atrasado</SelectItem>
                      <SelectItem value="redistribuicao_sugerida">
                        Redistribuição Sugerida
                      </SelectItem>
                      <SelectItem value="aguardando_parecer_tecnico">
                        Aguardando Parecer Técnico
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Turma/Setor
                  </label>
                  <Select
                    value={filters.turma}
                    onValueChange={(value) =>
                      onFiltersChange({ ...filters, turma: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas</SelectItem>
                      {turmasDisponiveis.map((turma) => (
                        <SelectItem key={turma} value={turma}>
                          {turma}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Disponibilidade do Servidor
                  </label>
                  <Select
                    value={filters.disponibilidadeServidor}
                    onValueChange={(value) =>
                      onFiltersChange({
                        ...filters,
                        disponibilidadeServidor: value as
                          | DisponibilidadeServidor
                          | "todos",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas</SelectItem>
                      <SelectItem value="disponivel">Disponível</SelectItem>
                      <SelectItem value="moderado">Moderado</SelectItem>
                      <SelectItem value="sobrecarregado">
                        Sobrecarregado
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Limpar Todos
                </Button>
                <Button size="sm" onClick={() => setIsOpen(false)}>
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">
            Filtros ativos:
          </span>
          {filters.temas.map((tema) => (
            <Badge
              key={tema}
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() => toggleTema(tema)}
            >
              {tema}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          {filters.status !== "todos" && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() =>
                onFiltersChange({ ...filters, status: "todos" })
              }
            >
              Status: {filters.status}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {filters.complexidade !== "todos" && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() =>
                onFiltersChange({ ...filters, complexidade: "todos" })
              }
            >
              Complexidade: {filters.complexidade}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {filters.situacao !== "todos" && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() =>
                onFiltersChange({ ...filters, situacao: "todos" })
              }
            >
              Situação: {filters.situacao}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {filters.turma !== "todos" && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() =>
                onFiltersChange({ ...filters, turma: "todos" })
              }
            >
              Turma: {filters.turma}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {filters.disponibilidadeServidor !== "todos" && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  disponibilidadeServidor: "todos",
                })
              }
            >
              Disponibilidade: {filters.disponibilidadeServidor}
              <X className="h-3 w-3" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
