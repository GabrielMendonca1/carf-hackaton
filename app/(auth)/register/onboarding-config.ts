import type { UserProfile } from "@/lib/types/user";

export type OnboardingProfile = UserProfile;

export const REGISTER_ONBOARDING_COOKIE = "register-onboarding";
export const REGISTER_ONBOARDING_DATA_COOKIE = "register-onboarding-data";

export const onboardingAreas = [
  { value: "1", label: "1 - Jurídico Tributário" },
  { value: "2", label: "2 - Fiscalização e Auditoria" },
  { value: "3", label: "3 - Tecnologia e Dados" },
  { value: "4", label: "4 - Administração e Gestão" },
] as const;

export const onboardingRolesByArea: Record<string, { value: string; label: string }[]> = {
  "1": [
    { value: "procurador", label: "Procurador(a) / Representante Legal" },
    { value: "advogado", label: "Advogado(a) Tributarista" },
    { value: "consultor", label: "Consultor(a) Tributário" },
  ],
  "2": [
    { value: "auditor", label: "Auditor(a) Fiscal" },
    { value: "analista-fiscal", label: "Analista Fiscal" },
    { value: "inspetor", label: "Inspetor(a) / Supervisor(a)" },
  ],
  "3": [
    { value: "engenheiro-dados", label: "Engenheiro(a) de Dados" },
    { value: "cientista-dados", label: "Cientista de Dados" },
    { value: "analista-sistemas", label: "Analista de Sistemas" },
  ],
  "4": [
    { value: "gestor-projetos", label: "Gestor(a) de Projetos" },
    { value: "analista-processos", label: "Analista de Processos" },
    { value: "coordenador-operacoes", label: "Coordenador(a) de Operações" },
  ],
};

export const getAreaLabel = (value: string): string => {
  return onboardingAreas.find((area) => area.value === value)?.label ?? value;
};

export const getRoleLabel = (area: string, roleValue: string): string => {
  return onboardingRolesByArea[area]?.find((role) => role.value === roleValue)?.label ?? roleValue;
};

export const onboardingHighlights = [
  {
    title: "Centralize o conhecimento",
    description:
      "Crie um espaço único para documentos, conversas e decisões do time com histórico completo.",
  },
  {
    title: "Automatize tarefas repetitivas",
    description:
      "Aproveite fluxos com IA para gerar relatórios, atualizar código e revisar entregas com agilidade.",
  },
  {
    title: "Garanta segurança e visibilidade",
    description:
      "Defina permissões granulares e acompanhe o impacto de cada pessoa em tempo real.",
  },
];
