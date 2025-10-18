export type StatusProcesso =
  | "em_analise"
  | "aguardando_manifestacao"
  | "em_relatoria"
  | "encerrado";

export type NivelComplexidade = 1 | 2 | 3 | 4;

export type TemaProcesso =
  | "IRPJ"
  | "IPI"
  | "COFINS"
  | "PIS"
  | "CSLL"
  | "ICMS"
  | "ISS"
  | "OUTROS";

export type DisponibilidadeServidor =
  | "disponivel"
  | "moderado"
  | "sobrecarregado";

export type SituacaoProcesso =
  | "normal"
  | "redistribuicao_sugerida"
  | "atrasado"
  | "aguardando_parecer_tecnico";

export interface Participante {
  id: string;
  nome: string;
  cargo: "servidor" | "relator" | "revisor";
  email?: string;
  turma?: string;
  disponibilidade?: DisponibilidadeServidor;
  cargaAtual?: number;
  especialidades?: TemaProcesso[];
}

export interface PrazoProcesso {
  tipo: "legal" | "interno";
  dataLimite: Date;
  diasRestantes: number;
  status: "em_dia" | "proximo_vencimento" | "atrasado";
}

export interface PecaSimilar {
  id: string;
  numeroProcesso: string;
  descricao: string;
  indiceSimilaridade: number;
}

export interface Processo {
  id: string;
  numeroProcesso: string;
  descricaoResumida: string;
  status: StatusProcesso;
  prazos: PrazoProcesso[];
  participantes: Participante[];
  tempoEstimadoConclusao: number;
  pecasSimilares: PecaSimilar[];
  nivelComplexidade: NivelComplexidade;
  valorDisputa?: number;
  numeroDocumentos: number;
  criadoEm: Date;
  atualizadoEm: Date;
  setorResponsavel?: string;
  turma?: string;
  tema?: TemaProcesso;
  situacao?: SituacaoProcesso;
  tempoMedioTramitacao?: number;
  servidorAtual?: Participante;
}
