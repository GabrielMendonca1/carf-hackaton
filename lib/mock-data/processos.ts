import type { Processo } from "@/lib/types/processo";

export const mockProcessos: Processo[] = [
  {
    id: "1",
    numeroProcesso: "12345.789/2024-99",
    descricaoResumida: "Recurso sobre compensação de IRPJ – exercício 2019",
    status: "em_analise",
    prazos: [
      {
        tipo: "legal",
        dataLimite: new Date("2025-11-15"),
        diasRestantes: 28,
        status: "em_dia",
      },
      {
        tipo: "interno",
        dataLimite: new Date("2025-11-10"),
        diasRestantes: 23,
        status: "em_dia",
      },
    ],
    participantes: [
      { id: "p1", nome: "João Silva", cargo: "servidor" },
      { id: "p2", nome: "Maria Santos", cargo: "relator" },
    ],
    tempoEstimadoConclusao: 45,
    pecasSimilares: [
      {
        id: "s1",
        numeroProcesso: "11234.456/2023-88",
        descricao: "Compensação IRPJ 2018",
        indiceSimilaridade: 0.92,
      },
      {
        id: "s2",
        numeroProcesso: "13456.789/2024-77",
        descricao: "Recurso IRPJ exercício anterior",
        indiceSimilaridade: 0.87,
      },
    ],
    nivelComplexidade: 2,
    valorDisputa: 1500000,
    numeroDocumentos: 24,
    criadoEm: new Date("2024-09-15"),
    atualizadoEm: new Date("2025-10-12"),
  },
  {
    id: "2",
    numeroProcesso: "98765.432/2024-11",
    descricaoResumida: "Impugnação de multa qualificada por sonegação fiscal",
    status: "aguardando_manifestacao",
    prazos: [
      {
        tipo: "legal",
        dataLimite: new Date("2025-10-25"),
        diasRestantes: 7,
        status: "proximo_vencimento",
      },
    ],
    participantes: [
      { id: "p3", nome: "Pedro Oliveira", cargo: "servidor" },
      { id: "p4", nome: "Ana Costa", cargo: "revisor" },
    ],
    tempoEstimadoConclusao: 120,
    pecasSimilares: [
      {
        id: "s3",
        numeroProcesso: "87654.321/2023-55",
        descricao: "Multa qualificada por omissão",
        indiceSimilaridade: 0.78,
      },
    ],
    nivelComplexidade: 4,
    valorDisputa: 8500000,
    numeroDocumentos: 187,
    criadoEm: new Date("2024-06-10"),
    atualizadoEm: new Date("2025-10-15"),
  },
  {
    id: "3",
    numeroProcesso: "54321.098/2025-33",
    descricaoResumida: "Consulta sobre tributação de criptoativos",
    status: "em_relatoria",
    prazos: [
      {
        tipo: "interno",
        dataLimite: new Date("2025-11-30"),
        diasRestantes: 43,
        status: "em_dia",
      },
    ],
    participantes: [
      { id: "p5", nome: "Carlos Mendes", cargo: "relator" },
      { id: "p6", nome: "Juliana Lima", cargo: "servidor" },
    ],
    tempoEstimadoConclusao: 60,
    pecasSimilares: [
      {
        id: "s4",
        numeroProcesso: "44444.333/2024-22",
        descricao: "Tributação ativos digitais",
        indiceSimilaridade: 0.95,
      },
      {
        id: "s5",
        numeroProcesso: "55555.666/2024-11",
        descricao: "Criptomoedas e IRPF",
        indiceSimilaridade: 0.89,
      },
    ],
    nivelComplexidade: 3,
    valorDisputa: 450000,
    numeroDocumentos: 56,
    criadoEm: new Date("2025-08-01"),
    atualizadoEm: new Date("2025-10-16"),
  },
  {
    id: "4",
    numeroProcesso: "11111.222/2024-44",
    descricaoResumida: "Restituição de CSLL recolhida indevidamente",
    status: "encerrado",
    prazos: [
      {
        tipo: "legal",
        dataLimite: new Date("2025-09-30"),
        diasRestantes: -18,
        status: "atrasado",
      },
    ],
    participantes: [
      { id: "p7", nome: "Roberto Alves", cargo: "servidor" },
      { id: "p8", nome: "Fernanda Dias", cargo: "relator" },
    ],
    tempoEstimadoConclusao: 0,
    pecasSimilares: [
      {
        id: "s6",
        numeroProcesso: "22222.333/2023-99",
        descricao: "Restituição CSLL período anterior",
        indiceSimilaridade: 0.85,
      },
    ],
    nivelComplexidade: 1,
    valorDisputa: 280000,
    numeroDocumentos: 12,
    criadoEm: new Date("2024-05-20"),
    atualizadoEm: new Date("2025-09-30"),
  },
  {
    id: "5",
    numeroProcesso: "77777.888/2024-66",
    descricaoResumida: "Questionamento sobre PIS/COFINS não cumulativo",
    status: "em_analise",
    prazos: [
      {
        tipo: "legal",
        dataLimite: new Date("2025-10-20"),
        diasRestantes: 2,
        status: "proximo_vencimento",
      },
      {
        tipo: "interno",
        dataLimite: new Date("2025-10-18"),
        diasRestantes: 0,
        status: "atrasado",
      },
    ],
    participantes: [
      { id: "p9", nome: "Luciana Souza", cargo: "servidor" },
      { id: "p10", nome: "Marcos Ferreira", cargo: "revisor" },
    ],
    tempoEstimadoConclusao: 90,
    pecasSimilares: [
      {
        id: "s7",
        numeroProcesso: "66666.777/2024-33",
        descricao: "Crédito PIS/COFINS",
        indiceSimilaridade: 0.91,
      },
      {
        id: "s8",
        numeroProcesso: "88888.999/2023-44",
        descricao: "Regime não cumulativo PIS",
        indiceSimilaridade: 0.88,
      },
    ],
    nivelComplexidade: 3,
    valorDisputa: 3200000,
    numeroDocumentos: 98,
    criadoEm: new Date("2024-07-15"),
    atualizadoEm: new Date("2025-10-17"),
  },
  {
    id: "6",
    numeroProcesso: "33333.444/2025-55",
    descricaoResumida: "Revisão de auto de infração – ICMS operações interestaduais",
    status: "aguardando_manifestacao",
    prazos: [
      {
        tipo: "legal",
        dataLimite: new Date("2025-12-10"),
        diasRestantes: 53,
        status: "em_dia",
      },
    ],
    participantes: [
      { id: "p11", nome: "Beatriz Rocha", cargo: "servidor" },
      { id: "p12", nome: "Ricardo Nunes", cargo: "relator" },
    ],
    tempoEstimadoConclusao: 75,
    pecasSimilares: [
      {
        id: "s9",
        numeroProcesso: "99999.111/2024-88",
        descricao: "Auto infração ICMS substituição tributária",
        indiceSimilaridade: 0.82,
      },
    ],
    nivelComplexidade: 2,
    valorDisputa: 920000,
    numeroDocumentos: 43,
    criadoEm: new Date("2025-09-01"),
    atualizadoEm: new Date("2025-10-10"),
  },
  {
    id: "7",
    numeroProcesso: "22222.333/2024-77",
    descricaoResumida: "Mandado de segurança – suspensão de exigibilidade",
    status: "em_relatoria",
    prazos: [
      {
        tipo: "legal",
        dataLimite: new Date("2025-11-05"),
        diasRestantes: 18,
        status: "em_dia",
      },
    ],
    participantes: [
      { id: "p13", nome: "Eduardo Santos", cargo: "relator" },
      { id: "p14", nome: "Camila Martins", cargo: "revisor" },
    ],
    tempoEstimadoConclusao: 40,
    pecasSimilares: [],
    nivelComplexidade: 1,
    valorDisputa: 150000,
    numeroDocumentos: 8,
    criadoEm: new Date("2024-08-20"),
    atualizadoEm: new Date("2025-10-14"),
  },
  {
    id: "8",
    numeroProcesso: "44444.555/2024-22",
    descricaoResumida:
      "Discussão sobre base de cálculo IRPJ – lucro presumido vs real",
    status: "em_analise",
    prazos: [
      {
        tipo: "interno",
        dataLimite: new Date("2025-11-20"),
        diasRestantes: 33,
        status: "em_dia",
      },
    ],
    participantes: [
      { id: "p15", nome: "Patricia Gomes", cargo: "servidor" },
      { id: "p16", nome: "Sergio Campos", cargo: "relator" },
    ],
    tempoEstimadoConclusao: 55,
    pecasSimilares: [
      {
        id: "s10",
        numeroProcesso: "33333.222/2023-66",
        descricao: "Opção lucro presumido",
        indiceSimilaridade: 0.79,
      },
    ],
    nivelComplexidade: 2,
    valorDisputa: 2100000,
    numeroDocumentos: 67,
    criadoEm: new Date("2024-06-25"),
    atualizadoEm: new Date("2025-10-13"),
  },
];
