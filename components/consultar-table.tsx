"use client";

import { useState } from "react";
import type { Processo } from "@/lib/types/processo";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Users,
  Clock,
  FileText,
  Scale,
} from "lucide-react";
import { TemaBadge } from "./tema-badge";
import { ComplexityBadge } from "./complexity-badge";
import { StatusBadge } from "./status-badge";
import { SituacaoBadge } from "./situacao-badge";
import { LoadIndicator } from "./load-indicator";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ConsultarTableProps {
  processos: Processo[];
  onProcessoClick?: (processo: Processo) => void;
}

type SortField =
  | "numeroProcesso"
  | "tema"
  | "complexidade"
  | "prazo"
  | "servidor"
  | "turma"
  | "situacao";
type SortDirection = "asc" | "desc";

export function ConsultarTable({
  processos,
  onProcessoClick,
}: ConsultarTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>("prazo");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const toggleRowExpansion = (processoId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(processoId)) {
      newExpanded.delete(processoId);
    } else {
      newExpanded.add(processoId);
    }
    setExpandedRows(newExpanded);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedProcessos = [...processos].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case "numeroProcesso":
        comparison = a.numeroProcesso.localeCompare(b.numeroProcesso);
        break;
      case "tema":
        comparison = (a.tema || "").localeCompare(b.tema || "");
        break;
      case "complexidade":
        comparison = a.nivelComplexidade - b.nivelComplexidade;
        break;
      case "prazo": {
        const prazoA = Math.min(...a.prazos.map((p) => p.diasRestantes));
        const prazoB = Math.min(...b.prazos.map((p) => p.diasRestantes));
        comparison = prazoA - prazoB;
        break;
      }
      case "servidor":
        comparison = (a.servidorAtual?.nome || "").localeCompare(
          b.servidorAtual?.nome || ""
        );
        break;
      case "turma":
        comparison = (a.turma || "").localeCompare(b.turma || "");
        break;
      case "situacao":
        comparison = (a.situacao || "").localeCompare(b.situacao || "");
        break;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 gap-1 font-semibold hover:bg-muted/50"
      onClick={() => handleSort(field)}
    >
      {children}
      {sortField === field ? (
        sortDirection === "asc" ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
      )}
    </Button>
  );

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="w-12 px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">

              </th>
              <th className="px-4 py-3 text-left">
                <SortButton field="numeroProcesso">Nº Processo</SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton field="tema">Tema</SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton field="turma">Setor/Turma</SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton field="servidor">Servidor Atual</SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton field="situacao">Situação</SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton field="complexidade">Complexidade</SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton field="prazo">Prazo</SortButton>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y bg-background">
            {sortedProcessos.map((processo) => {
              const isExpanded = expandedRows.has(processo.id);
              const prazoMaisProximo = processo.prazos.sort(
                (a, b) => a.diasRestantes - b.diasRestantes
              )[0];

              const prazoColor =
                prazoMaisProximo?.status === "atrasado"
                  ? "text-red-600"
                  : prazoMaisProximo?.status === "proximo_vencimento"
                    ? "text-yellow-600"
                    : "text-green-600";

              return (
                <>
                  <tr
                    key={processo.id}
                    className={cn(
                      "hover:bg-muted/30 transition-colors cursor-pointer",
                      isExpanded && "bg-muted/20"
                    )}
                    onClick={() => toggleRowExpansion(processo.id)}
                  >
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRowExpansion(processo.id);
                        }}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-sm">
                          {processo.numeroProcesso}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {processo.descricaoResumida}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {processo.tema && <TemaBadge tema={processo.tema} />}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">
                          {processo.turma || "N/A"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {processo.setorResponsavel}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {processo.servidorAtual ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium">
                            {processo.servidorAtual.nome}
                          </span>
                          {processo.servidorAtual.disponibilidade && (
                            <LoadIndicator
                              disponibilidade={
                                processo.servidorAtual.disponibilidade
                              }
                              cargaAtual={processo.servidorAtual.cargaAtual}
                              showLabel={false}
                              showBar={true}
                            />
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          N/A
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={processo.status} />
                        {processo.situacao && processo.situacao !== "normal" && (
                          <SituacaoBadge situacao={processo.situacao} />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <ComplexityBadge nivel={processo.nivelComplexidade} />
                    </td>
                    <td className="px-4 py-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2">
                            <Clock className={cn("h-4 w-4", prazoColor)} />
                            <span className={cn("font-medium text-sm", prazoColor)}>
                              {prazoMaisProximo
                                ? `${Math.abs(prazoMaisProximo.diasRestantes)} ${prazoMaisProximo.diasRestantes < 0 ? "dias atrás" : "dias"}`
                                : "N/A"}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            {processo.prazos.map((prazo, idx) => (
                              <div key={idx} className="text-xs">
                                <span className="font-medium capitalize">
                                  {prazo.tipo}:
                                </span>{" "}
                                {prazo.dataLimite.toLocaleDateString("pt-BR")}
                              </div>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-muted/10">
                      <td colSpan={8} className="px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Informações Gerais
                            </h4>
                            <div className="space-y-1 text-sm">
                              <div>
                                <span className="text-muted-foreground">
                                  Documentos:
                                </span>{" "}
                                <span className="font-medium">
                                  {processo.numeroDocumentos}
                                </span>
                              </div>
                              {processo.valorDisputa && (
                                <div>
                                  <span className="text-muted-foreground">
                                    Valor:
                                  </span>{" "}
                                  <span className="font-medium">
                                    {new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    }).format(processo.valorDisputa)}
                                  </span>
                                </div>
                              )}
                              <div>
                                <span className="text-muted-foreground">
                                  Estimativa:
                                </span>{" "}
                                <span className="font-medium">
                                  {processo.tempoEstimadoConclusao > 0
                                    ? `${processo.tempoEstimadoConclusao} dias`
                                    : "Concluído"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Participantes
                            </h4>
                            <div className="space-y-1">
                              {processo.participantes.map((p) => (
                                <div
                                  key={p.id}
                                  className="text-sm flex items-center justify-between"
                                >
                                  <span>{p.nome}</span>
                                  <span className="text-xs text-muted-foreground capitalize">
                                    {p.cargo}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Tramitação
                            </h4>
                            <div className="space-y-1 text-sm">
                              <div>
                                <span className="text-muted-foreground">
                                  Tempo médio:
                                </span>{" "}
                                <span className="font-medium">
                                  {processo.tempoMedioTramitacao || "N/A"} dias
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Criado:
                                </span>{" "}
                                <span className="font-medium">
                                  {formatDistanceToNow(processo.criadoEm, {
                                    addSuffix: true,
                                    locale: ptBR,
                                  })}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Atualizado:
                                </span>{" "}
                                <span className="font-medium">
                                  {formatDistanceToNow(processo.atualizadoEm, {
                                    addSuffix: true,
                                    locale: ptBR,
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>

                          {processo.pecasSimilares.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold flex items-center gap-2">
                                <Scale className="h-4 w-4" />
                                Peças Similares
                              </h4>
                              <div className="space-y-1">
                                {processo.pecasSimilares.slice(0, 3).map((peca) => (
                                  <div
                                    key={peca.id}
                                    className="text-sm flex items-center justify-between"
                                  >
                                    <span className="text-xs">
                                      {peca.numeroProcesso}
                                    </span>
                                    <span className="text-xs font-semibold text-green-600">
                                      {Math.round(peca.indiceSimilaridade * 100)}%
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {onProcessoClick && (
                          <div className="mt-4 flex justify-end">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onProcessoClick(processo);
                              }}
                            >
                              Ver Detalhes Completos
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedProcessos.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Nenhum processo encontrado</p>
        </div>
      )}
    </div>
  );
}
