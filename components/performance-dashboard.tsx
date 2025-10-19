"use client";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Clock,
  MessageSquare,
  Network,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const kpis = [
  {
    title: "Tempo médio de tramitação",
    value: "61 dias",
    change: "-12% vs. último trimestre",
    trend: "down" as const,
    icon: Clock,
  },
  {
    title: "Produtividade média por servidor",
    value: "46 processos",
    change: "+8 p.p. dentro do prazo",
    trend: "up" as const,
    icon: TrendingUp,
  },
  {
    title: "Redistribuições concluídas",
    value: "34 operações",
    change: "82% concluídas sem atraso",
    trend: "neutral" as const,
    icon: Network,
  },
  {
    title: "Feedback de qualidade",
    value: "4,2 / 5",
    change: "+0,3 no ciclo mais recente",
    trend: "up" as const,
    icon: MessageSquare,
  },
];

const monthlyProductivity = [
  { month: "Jan", servidores: 42, unidades: 48, tipos: 44 },
  { month: "Fev", servidores: 45, unidades: 50, tipos: 45 },
  { month: "Mar", servidores: 47, unidades: 53, tipos: 47 },
  { month: "Abr", servidores: 46, unidades: 51, tipos: 46 },
  { month: "Mai", servidores: 52, unidades: 58, tipos: 50 },
  { month: "Jun", servidores: 55, unidades: 60, tipos: 52 },
  { month: "Jul", servidores: 49, unidades: 54, tipos: 48 },
  { month: "Ago", servidores: 57, unidades: 63, tipos: 55 },
  { month: "Set", servidores: 54, unidades: 59, tipos: 53 },
  { month: "Out", servidores: 56, unidades: 61, tipos: 54 },
  { month: "Nov", servidores: 59, unidades: 65, tipos: 57 },
  { month: "Dez", servidores: 61, unidades: 67, tipos: 59 },
];

const productivityChartConfig: ChartConfig = {
  servidores: {
    label: "Por servidor",
    color: "var(--chart-1)",
  },
  unidades: {
    label: "Por unidade",
    color: "var(--chart-2)",
  },
  tipos: {
    label: "Por tipo de processo",
    color: "var(--chart-3)",
  },
};

const tramitationData = [
  { month: "Jan", tempo: 74, meta: 64 },
  { month: "Fev", tempo: 72, meta: 63 },
  { month: "Mar", tempo: 69, meta: 62 },
  { month: "Abr", tempo: 68, meta: 61 },
  { month: "Mai", tempo: 66, meta: 60 },
  { month: "Jun", tempo: 63, meta: 59 },
  { month: "Jul", tempo: 62, meta: 59 },
  { month: "Ago", tempo: 61, meta: 58 },
  { month: "Set", tempo: 59, meta: 58 },
  { month: "Out", tempo: 58, meta: 57 },
  { month: "Nov", tempo: 57, meta: 56 },
  { month: "Dez", tempo: 56, meta: 56 },
];

const tramitationConfig: ChartConfig = {
  tempo: {
    label: "Tempo médio (dias)",
    color: "var(--chart-4)",
  },
  meta: {
    label: "Meta planejada",
    color: "var(--chart-5)",
  },
};

const redistributionData = [
  { month: "Jan", redistribuicao: 12.5, cooperacao: 6.8 },
  { month: "Fev", redistribuicao: 13.1, cooperacao: 7.2 },
  { month: "Mar", redistribuicao: 15.4, cooperacao: 8.9 },
  { month: "Abr", redistribuicao: 14.7, cooperacao: 9.5 },
  { month: "Mai", redistribuicao: 17.2, cooperacao: 10.3 },
  { month: "Jun", redistribuicao: 18.6, cooperacao: 11.8 },
  { month: "Jul", redistribuicao: 16.9, cooperacao: 11.1 },
  { month: "Ago", redistribuicao: 19.3, cooperacao: 12.6 },
  { month: "Set", redistribuicao: 18.8, cooperacao: 12.1 },
  { month: "Out", redistribuicao: 20.1, cooperacao: 13.4 },
  { month: "Nov", redistribuicao: 21.4, cooperacao: 14.2 },
  { month: "Dez", redistribuicao: 22.0, cooperacao: 14.8 },
];

const redistributionConfig: ChartConfig = {
  redistribuicao: {
    label: "% Redistribuição",
    color: "var(--chart-1)",
  },
  cooperacao: {
    label: "% Cooperação",
    color: "var(--chart-2)",
  },
};

const complexityData = [
  { month: "Jan", baixa: 32, media: 51, alta: 78 },
  { month: "Fev", baixa: 31, media: 50, alta: 75 },
  { month: "Mar", baixa: 30, media: 48, alta: 73 },
  { month: "Abr", baixa: 30, media: 47, alta: 72 },
  { month: "Mai", baixa: 29, media: 46, alta: 69 },
  { month: "Jun", baixa: 29, media: 45, alta: 68 },
  { month: "Jul", baixa: 28, media: 44, alta: 67 },
  { month: "Ago", baixa: 28, media: 43, alta: 65 },
  { month: "Set", baixa: 27, media: 42, alta: 64 },
  { month: "Out", baixa: 27, media: 41, alta: 62 },
  { month: "Nov", baixa: 26, media: 41, alta: 61 },
  { month: "Dez", baixa: 26, media: 40, alta: 60 },
];

const complexityConfig: ChartConfig = {
  baixa: {
    label: "Baixa complexidade",
    color: "var(--chart-1)",
  },
  media: {
    label: "Média complexidade",
    color: "var(--chart-3)",
  },
  alta: {
    label: "Alta complexidade",
    color: "var(--chart-4)",
  },
};

const feedbackTrend = [
  { month: "Jan", internos: 3.6, contribuintes: 3.1 },
  { month: "Fev", internos: 3.7, contribuintes: 3.3 },
  { month: "Mar", internos: 3.8, contribuintes: 3.4 },
  { month: "Abr", internos: 3.9, contribuintes: 3.5 },
  { month: "Mai", internos: 4.0, contribuintes: 3.6 },
  { month: "Jun", internos: 4.1, contribuintes: 3.7 },
  { month: "Jul", internos: 4.1, contribuintes: 3.8 },
  { month: "Ago", internos: 4.2, contribuintes: 3.9 },
  { month: "Set", internos: 4.2, contribuintes: 4.0 },
  { month: "Out", internos: 4.3, contribuintes: 4.1 },
  { month: "Nov", internos: 4.4, contribuintes: 4.2 },
  { month: "Dez", internos: 4.4, contribuintes: 4.3 },
];

const feedbackConfig: ChartConfig = {
  internos: {
    label: "Avaliação interna",
    color: "var(--chart-5)",
  },
  contribuintes: {
    label: "Avaliação dos contribuintes",
    color: "var(--chart-2)",
  },
};

const employees = [
  {
    nome: "Ana Souza",
    unidade: "Turma 01 / Unidade Norte",
    processos: 58,
    tempoMedio: 44,
    feedback: 4.6,
    habilidades: ["Simplificação de fluxos", "IA assistiva"],
    alertas: [
      {
        tipo: "Boas práticas",
        descricao: "Compartilhar estratégia de triagem que reduziu 18 dias no fluxo.",
      },
    ],
  },
  {
    nome: "Bruno Oliveira",
    unidade: "Turma 02 / Unidade Centro",
    processos: 52,
    tempoMedio: 61,
    feedback: 4.3,
    habilidades: ["Processos complexos", "Coordenação"],
    alertas: [
      {
        tipo: "Questionário em andamento",
        descricao: "Processo 24.991/2024 em 92 dias. Identificar gargalos de perícia.",
      },
    ],
  },
  {
    nome: "Camila Ferreira",
    unidade: "Turma 03 / Unidade Especial",
    processos: 43,
    tempoMedio: 72,
    feedback: 4.0,
    habilidades: ["Julgamento colegiado", "Comunicação"],
    alertas: [
      {
        tipo: "Atenção",
        descricao: "Dois processos com cooperação externa solicitada há 15 dias.",
      },
    ],
  },
  {
    nome: "Diego Martins",
    unidade: "Turma 01 / Unidade Norte",
    processos: 47,
    tempoMedio: 52,
    feedback: 4.4,
    habilidades: ["Analytics", "Redistribuição"],
    alertas: [],
  },
  {
    nome: "Elisa Gomes",
    unidade: "Turma 04 / Unidade Sul",
    processos: 40,
    tempoMedio: 59,
    feedback: 3.9,
    habilidades: ["Treinamentos", "Operações complexas"],
    alertas: [
      {
        tipo: "Questionário previsto",
        descricao:
          "Processo 19.104/2024 ultrapassará 90 dias em 11 dias. Alerta preventivo emitido.",
      },
    ],
  },
];

const questionnaireEvents = [
  {
    titulo: "Processo 24.991/2024",
    motivo: "Atraso acima de 90 dias para processos de média complexidade.",
    data: "Emitido em 14/10",
    responsavel: "Turma 02 / Bruno Oliveira",
    status: "Em andamento",
  },
  {
    titulo: "Processo 19.104/2024",
    motivo: "Projeção indica extrapolação da meta de 60 dias.",
    data: "Agendado para 22/10",
    responsavel: "Turma 04 / Elisa Gomes",
    status: "Agendado",
  },
  {
    titulo: "Processo 18.745/2024",
    motivo: "Execução concluída 28 dias antes do benchmark histórico.",
    data: "Finalizado em 05/10",
    responsavel: "Turma 01 / Ana Souza",
    status: "Boas práticas",
  },
];

export function PerformanceDashboard() {
  const topPerformers = [...employees]
    .sort((a, b) => b.processos - a.processos)
    .slice(0, 3);

  return (
    <div className="space-y-8 pb-10">

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => {
          const Icon = item.icon;
          const trendClass =
            item.trend === "up"
              ? "text-emerald-600"
              : item.trend === "down"
                ? "text-rose-500"
                : "text-muted-foreground";
          const TrendIcon =
            item.trend === "up"
              ? ArrowUpRight
              : item.trend === "down"
                ? ArrowDownRight
                : ArrowRight;

          return (
            <Card key={item.title}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-sm font-medium">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Dados consolidados nos últimos 30 dias
                  </CardDescription>
                </div>
                <span className="rounded-full bg-primary/10 p-2 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <span className="text-2xl font-semibold">{item.value}</span>
                <span className={cn("flex items-center gap-1 text-xs", trendClass)}>
                  <TrendIcon className="h-3 w-3" />
                  {item.change}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-6">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-primary" />
              Produtividade consolidada
            </CardTitle>
            <CardDescription>
              Volume médio concluído por servidor, unidade e tipo de processo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="servidores" className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <TabsList className="w-full md:w-auto">
                  <TabsTrigger className="w-full md:w-auto" value="servidores">
                    Servidores
                  </TabsTrigger>
                  <TabsTrigger className="w-full md:w-auto" value="unidades">
                    Unidades
                  </TabsTrigger>
                  <TabsTrigger className="w-full md:w-auto" value="tipos">
                    Tipo de processo
                  </TabsTrigger>
                </TabsList>
                <Badge variant="secondary" className="justify-center text-xs">
                  Meta trimestral: 52 processos
                </Badge>
              </div>

              <TabsContent value="servidores" className="mt-0">
                <ChartContainer config={{ servidores: productivityChartConfig.servidores }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      accessibilityLayer
                      data={monthlyProductivity}
                      margin={{ left: 8, right: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        width={40}
                      />
                      <RechartsTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="servidores"
                        stroke="var(--color-servidores)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>

              <TabsContent value="unidades" className="mt-0">
                <ChartContainer config={{ unidades: productivityChartConfig.unidades }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      accessibilityLayer
                      data={monthlyProductivity}
                      margin={{ left: 8, right: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                      <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
                      <RechartsTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="unidades"
                        stroke="var(--color-unidades)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>

              <TabsContent value="tipos" className="mt-0">
                <ChartContainer config={{ tipos: productivityChartConfig.tipos }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      accessibilityLayer
                      data={monthlyProductivity}
                      margin={{ left: 8, right: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                      <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
                      <RechartsTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="tipos"
                        stroke="var(--color-tipos)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5 text-primary" />
              Destaques por servidor
            </CardTitle>
            <CardDescription>
              Servidores com melhor combinação tempo/qualidade nos últimos 90 dias.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {topPerformers.map((servidor, index) => (
                <div
                  key={servidor.nome}
                  className="flex items-start justify-between rounded-lg border p-3"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 font-medium">
                      <span className="text-sm text-muted-foreground">#{index + 1}</span>
                      {servidor.nome}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {servidor.unidade}
                    </span>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {servidor.habilidades.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-medium text-foreground">
                      {servidor.processos} processos
                    </div>
                    <div className="text-muted-foreground">
                      {servidor.tempoMedio} dias · {servidor.feedback.toFixed(1)}★
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                Recomendar estudo de caso para onboarding de novos servidores.
              </div>
              <div className="flex items-center gap-2">
                <ArrowDownRight className="h-3 w-3 text-rose-500" />
                12 servidores acima de 70 dias médios — priorizar redistribuição assistida.
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Tempo médio de tramitação</CardTitle>
            <CardDescription>
              Comparativo entre desempenho real e metas planejadas por trimestre.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[260px]"
              config={tramitationConfig}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  accessibilityLayer
                  data={tramitationData}
                  margin={{ left: 8, right: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} width={48} />
                  <RechartsTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="tempo"
                    stroke="var(--color-tempo)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="meta"
                    stroke="var(--color-meta)"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            <p className="mt-3 text-xs text-muted-foreground">
              Queda consistente de 19 dias no ciclo — redução sustentada desde março.
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Redistribuição e cooperação</CardTitle>
            <CardDescription>
              Percentual de processos que acionaram suporte de outras unidades.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[260px]" config={redistributionConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  accessibilityLayer
                  data={redistributionData}
                  margin={{ left: 8, right: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} width={48} />
                  <RechartsTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="redistribuicao"
                    stroke="var(--color-redistribuicao)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="cooperacao"
                    stroke="var(--color-cooperacao)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            <p className="mt-3 text-xs text-muted-foreground">
              64% das redistribuições geram cooperação cruzada — tendência positiva de integração.
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Feedback de qualidade</CardTitle>
            <CardDescription>
              Pontuação média dos questionários internos e dos contribuintes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[260px]" config={feedbackConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  accessibilityLayer
                  data={feedbackTrend}
                  margin={{ left: 8, right: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis
                    domain={[3, 5]}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={48}
                    allowDecimals
                  />
                  <RechartsTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="internos"
                    stroke="var(--color-internos)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="contribuintes"
                    stroke="var(--color-contribuintes)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            <p className="mt-3 text-xs text-muted-foreground">
              Crescimento contínuo após implantação dos lembretes proativos e formulários adaptados.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Correlação entre complexidade e tempo</CardTitle>
            <CardDescription>
              Monitoramento da relação entre o nível de complexidade e o tempo médio de conclusão.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[260px]" config={complexityConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  accessibilityLayer
                  data={complexityData}
                  margin={{ left: 8, right: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} width={48} />
                  <RechartsTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="baixa"
                    stroke="var(--color-baixa)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="media"
                    stroke="var(--color-media)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="alta"
                    stroke="var(--color-alta)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            <p className="mt-3 text-xs text-muted-foreground">
              Projetos complexos ainda acima de 60 dias — reforçar treinamentos específicos e squad de apoio.
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Insights imediatos</CardTitle>
            <CardDescription>
              Ações sugeridas com base nas métricas das últimas duas semanas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-muted-foreground">
            <div className="rounded-lg border bg-muted/30 p-3 text-foreground">
              <p className="font-medium text-sm text-foreground">Alerta de prazo</p>
              <p>Seis processos de alta complexidade a 10 dias do limite. Disparar reforço de equipe compartilhada.</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3 text-foreground">
              <p className="font-medium text-sm text-foreground">Boas práticas</p>
              <p>Registro de Ana Souza sobre automação de parecer preliminar disponível — avaliar replicação.</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3 text-foreground">
              <p className="font-medium text-sm text-foreground">Qualidade</p>
              <p>Feedback externo sugere checklist adicional para processos com perícia: integração com onboarding.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Microdados por servidor</CardTitle>
            <CardDescription>
              Métricas individuais alimentadas pelas abas Meus Processos e Consultar Processos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border">
              <ScrollArea className="h-[280px]">
                <table className="w-full min-w-max text-sm">
                  <thead className="sticky top-0 z-10 bg-background/95 backdrop-blur">
                    <tr className="text-left text-xs uppercase text-muted-foreground">
                      <th className="px-4 py-3 font-medium">Servidor</th>
                      <th className="px-4 py-3 font-medium">Processos</th>
                      <th className="px-4 py-3 font-medium">Tempo médio</th>
                      <th className="px-4 py-3 font-medium">Feedback</th>
                      <th className="px-4 py-3 font-medium">Habilidades</th>
                      <th className="px-4 py-3 font-medium">Alertas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {employees.map((servidor) => (
                      <tr key={servidor.nome} className="align-top">
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground">{servidor.nome}</div>
                          <div className="text-xs text-muted-foreground">{servidor.unidade}</div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {servidor.processos}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {servidor.tempoMedio} dias
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {servidor.feedback.toFixed(1)} / 5
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {servidor.habilidades.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-[10px]">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-2">
                            {servidor.alertas.length === 0 && (
                              <Badge variant="secondary" className="text-[10px]">
                                Nenhum alerta
                              </Badge>
                            )}
                            {servidor.alertas.map((alerta) => (
                              <div
                                key={alerta.descricao}
                                className="rounded-md border bg-muted/40 p-2 text-xs text-muted-foreground"
                              >
                                <span className="font-medium text-foreground">
                                  {alerta.tipo}
                                </span>
                                <p>{alerta.descricao}</p>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </div>
            <p className="text-xs text-muted-foreground">
              Dados coletados automaticamente com base em status dos processos e formulários respondidos.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Questionários automáticos</CardTitle>
              <CardDescription>
                Disparos configurados para entender gargalos, atrasos e oportunidades de melhoria.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {questionnaireEvents.map((evento) => (
                <div
                  key={evento.titulo}
                  className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-sm font-medium text-foreground">
                      {evento.titulo}
                      <Badge variant="outline" className="text-[10px]">
                        {evento.status}
                      </Badge>
                    </div>
                    <p>{evento.motivo}</p>
                    <div className="flex flex-wrap gap-3 pt-1">
                      <span>{evento.data}</span>
                      <span>{evento.responsavel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Próximas ações do time</CardTitle>
              <CardDescription>
                Recomendações para manter o desempenho e antecipar gargalos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <ArrowUpRight className="mt-1 h-3 w-3 text-emerald-600" />
                <p>
                  Incorporar boas práticas da Turma 01 ao manual de processos — ganho médio de 18 dias.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight className="mt-1 h-3 w-3 text-primary" />
                <p>
                  Criar trilha de reciclagem em complexidade alta com foco em perícia e pareceres.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <ArrowDownRight className="mt-1 h-3 w-3 text-rose-500" />
                <p>
                  Monitorar redistribuições acima de 20 dias com cooperação ativa — potencial gargalo logístico.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
