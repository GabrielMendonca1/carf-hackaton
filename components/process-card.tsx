"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  Calendar,
  Clock,
  FileText,
  Scale,
  Users,
} from "lucide-react";
import type { Processo } from "@/lib/types/processo";
import { cn } from "@/lib/utils";
import { ComplexityBadge } from "./complexity-badge";
import { StatusBadge } from "./status-badge";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface ProcessCardProps {
  processo: Processo;
  onClick?: () => void;
}

export function ProcessCard({ processo, onClick }: ProcessCardProps) {
  const prazoMaisProximo = processo.prazos.sort(
    (a, b) => a.diasRestantes - b.diasRestantes
  )[0];

  const prazoStatus = prazoMaisProximo?.status;
  const prazoColor =
    prazoStatus === "atrasado"
      ? "text-red-600"
      : prazoStatus === "proximo_vencimento"
        ? "text-yellow-600"
        : "text-green-600";

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
              {processo.numeroProcesso}
            </CardTitle>
            <CardDescription className="text-sm line-clamp-2">
              {processo.descricaoResumida}
            </CardDescription>
          </div>
          <ComplexityBadge nivel={processo.nivelComplexidade} showLabel={false} />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={processo.status} />
          {processo.valorDisputa && (
            <Badge variant="outline" className="gap-1">
              <Scale className="h-3 w-3" />
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(processo.valorDisputa)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Calendar className={cn("h-4 w-4", prazoColor)} />
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Prazo</span>
                  <span className={cn("font-medium", prazoColor)}>
                    {prazoMaisProximo
                      ? `${Math.abs(prazoMaisProximo.diasRestantes)} ${prazoMaisProximo.diasRestantes < 0 ? "dias atrás" : "dias"}`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                {processo.prazos.map((prazo, idx) => (
                  <div key={idx} className="text-xs">
                    <span className="font-medium capitalize">{prazo.tipo}:</span>{" "}
                    {prazo.dataLimite.toLocaleDateString("pt-BR")}
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Estimativa</span>
                  <span className="font-medium">
                    {processo.tempoEstimadoConclusao > 0
                      ? `${processo.tempoEstimadoConclusao}d`
                      : "Concluído"}
                  </span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              Tempo estimado para conclusão do processo
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Documentos</span>
                  <span className="font-medium">{processo.numeroDocumentos}</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>Total de documentos no processo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">
                    Participantes
                  </span>
                  <span className="font-medium">
                    {processo.participantes.length}
                  </span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                {processo.participantes.map((p) => (
                  <div key={p.id} className="text-xs">
                    {p.nome} ({p.cargo})
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

        {processo.pecasSimilares.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Peças similares encontradas:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {processo.pecasSimilares.slice(0, 2).map((peca) => (
                <Tooltip key={peca.id}>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="gap-1 text-xs">
                      {peca.numeroProcesso}
                      <span className="text-green-600 font-semibold">
                        {Math.round(peca.indiceSimilaridade * 100)}%
                      </span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-xs">
                      <p className="text-xs font-medium">{peca.descricao}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Similaridade: {Math.round(peca.indiceSimilaridade * 100)}%
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
              {processo.pecasSimilares.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{processo.pecasSimilares.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="pt-2 border-t text-xs text-muted-foreground">
          Atualizado{" "}
          {formatDistanceToNow(processo.atualizadoEm, {
            addSuffix: true,
            locale: ptBR,
          })}
        </div>
      </CardContent>
    </Card>
  );
}
