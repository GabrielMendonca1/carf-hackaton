# Nova Tela: Consultar Processos

## Visão Geral

Implementação completa da funcionalidade "Consultar Processos" - uma ferramenta que permite aos servidores visualizar o panorama geral dos processos em andamento no CARF, com foco em colaboração, distribuição e análise de capacidade operacional.

## Funcionalidades Implementadas

### 1. Type System Estendido (`lib/types/processo.ts`)

Novos tipos adicionados:
- `TemaProcesso`: IRPJ, IPI, COFINS, PIS, CSLL, ICMS, ISS, OUTROS
- `DisponibilidadeServidor`: disponivel, moderado, sobrecarregado
- `SituacaoProcesso`: normal, redistribuicao_sugerida, atrasado, aguardando_parecer_tecnico

Campos adicionados ao `Processo`:
- `setorResponsavel`: string
- `turma`: string
- `tema`: TemaProcesso
- `situacao`: SituacaoProcesso
- `tempoMedioTramitacao`: number
- `servidorAtual`: Participante

### 2. Mock Data (`lib/mock-data/consultar-processos.ts`)

- 25 processos de exemplo
- 8 servidores com diferentes níveis de carga
- Distribuição realista entre turmas (1A, 1B, 2A, 2B, 3A, 3B)
- Todos os temas tributários representados
- Diferentes níveis de complexidade e situações

### 3. Componentes UI

#### Badges e Indicadores
- **`TemaBadge`**: Badge colorido para temas tributários com ícones
- **`LoadIndicator`**: Indicador visual de carga de trabalho do servidor
- **`SituacaoBadge`**: Badge para diferentes situações dos processos

#### Visualização de Dados
- **`ConsultarTable`**: Tabela inteligente com:
  - Ordenação por múltiplas colunas
  - Expansão de linhas para detalhes
  - Informações completas sobre participantes, prazos e peças similares
  - Design responsivo

- **`WorkloadDashboard`**: Dashboard analítico com:
  - 4 cards de métricas principais
  - Gráfico de distribuição por turma
  - Grid de processos por tema
  - Lista de servidores com carga atual
  - Distribuição por complexidade

#### Filtros
- **`ConsultarFilters`**: Sistema de filtros avançados com:
  - Busca textual
  - Multi-select de temas (chips interativos)
  - Filtros por status, complexidade, situação
  - Filtro por turma/setor
  - Filtro por disponibilidade de servidor
  - Chips de filtros ativos com remoção rápida

#### IA e Insights
- **`AIInsightsPanel`**: Painel lateral de insights com:
  - Detecção de servidores sobrecarregados
  - Sugestões de redistribuição
  - Alertas de processos atrasados
  - Matching de competências
  - Identificação de peças similares
  - Priorização automática de alertas

### 4. Página Principal (`app/(chat)/consultar/`)

Estrutura:
- `page.tsx`: Server Component para autenticação
- `page-client.tsx`: Client Component principal

Recursos:
- Toggle entre Dashboard e Tabela
- Painel de insights da IA (pode ser ocultado)
- Contador de processos filtrados
- Botões de atualização e exportação
- Layout responsivo com grid adaptativo

## Estrutura Visual

```
┌─────────────────────────────────────────────────────────────┐
│ Header: Consultar Processos                    [Atualizar] │
│                                                  [Exportar] │
├─────────────────────────────────────────────────────────────┤
│ Filtros Avançados                                           │
│ [Busca] [Temas: IRPJ IPI COFINS...] [Status] [...]        │
├─────────────────────────────────────────────────────────────┤
│ Exibindo X de Y processos    [Dashboard] [Tabela] [IA]    │
├──────────────────────────────────┬──────────────────────────┤
│                                  │                          │
│  Dashboard / Tabela              │   Insights da IA        │
│                                  │   ┌──────────────────┐  │
│  ┌────────────────────────────┐  │   │ 🧠 Insights      │  │
│  │ Métricas Principais        │  │   │                  │  │
│  ├────────────────────────────┤  │   │ ⚠️ Servidor      │  │
│  │ Gráficos e Visualizações   │  │   │    sobrecarrega  │  │
│  │ - Por Turma                │  │   │                  │  │
│  │ - Por Tema                 │  │   │ 💡 Redistribuir  │  │
│  │ - Por Servidor             │  │   │    processos     │  │
│  │ - Por Complexidade         │  │   │                  │  │
│  └────────────────────────────┘  │   │ ✅ Boa taxa de   │  │
│                                  │   │    conclusão     │  │
│                                  │   └──────────────────┘  │
└──────────────────────────────────┴──────────────────────────┘
```

## Design Highlights

### UX Features
1. **Feedback Visual Imediato**: Badges coloridos e indicadores de status
2. **Navegação Intuitiva**: Toggle entre visualizações sem perder filtros
3. **Filtros Interativos**: Chips com X para remoção rápida
4. **Informação Hierárquica**: Detalhes expandidos em dois níveis
5. **Priorização Clara**: Insights organizados por prioridade

### Responsividade
- Grid adaptativo (1 coluna mobile → 2 colunas desktop)
- Painel lateral sticky no desktop
- Tabela com scroll horizontal em telas pequenas
- Botões com ícones + texto em desktop, só ícones em mobile

### Acessibilidade
- Tooltips informativos
- Contraste adequado em todos os badges
- Estados hover e focus visíveis
- Labels descritivos

## Fluxo de Dados

```typescript
Mock Data (25 processos)
    ↓
Filtros (search, temas, status, etc.)
    ↓
Processos Filtrados
    ↓
    ├─→ WorkloadDashboard (métricas agregadas)
    ├─→ ConsultarTable (visualização detalhada)
    └─→ AIInsightsPanel (insights gerados)
```

## Como os Insights da IA Funcionam

A IA analisa os processos e gera insights baseados em:

1. **Carga de Trabalho**: Identifica servidores com muitos processos
2. **Complexidade vs Disponibilidade**: Detecta processos complexos em servidores sobrecarregados
3. **Competências**: Verifica se processos estão com servidores especialistas
4. **Prazos**: Alerta sobre processos atrasados
5. **Similaridade**: Identifica oportunidades de reuso de análises
6. **Performance**: Reconhece boas taxas de conclusão

## Próximos Passos Sugeridos

### Backend Integration
- [ ] Conectar com API real de processos
- [ ] Implementar paginação server-side
- [ ] Cache de dados com SWR/React Query
- [ ] WebSocket para atualizações em tempo real

### Features Adicionais
- [ ] Exportação para CSV/Excel
- [ ] Salvamento de filtros favoritos
- [ ] Visualização de histórico de redistribuições
- [ ] Sistema de notificações push
- [ ] Gráficos interativos com recharts/visx
- [ ] Drag-and-drop para redistribuição de processos
- [ ] Tour guiado para novos usuários

### Otimizações
- [ ] Virtualização da tabela (react-window)
- [ ] Lazy loading de insights
- [ ] Debounce na busca
- [ ] Memoização de cálculos pesados

## Tecnologias Utilizadas

- **React 19** (Server & Client Components)
- **Next.js 15** (App Router)
- **TypeScript** (Type-safe)
- **Tailwind CSS** (Styling)
- **shadcn/ui** (Components)
- **Lucide React** (Icons)
- **date-fns** (Date formatting)

## Arquivos Criados/Modificados

### Novos Arquivos
```
components/
  ├── tema-badge.tsx
  ├── load-indicator.tsx
  ├── situacao-badge.tsx
  ├── consultar-table.tsx
  ├── consultar-filters.tsx
  ├── workload-dashboard.tsx
  └── ai-insights-panel.tsx

lib/
  └── mock-data/
      └── consultar-processos.ts

app/(chat)/consultar/
  ├── page.tsx
  └── page-client.tsx
```

### Arquivos Modificados
```
lib/types/processo.ts (estendido com novos tipos)
```

## Performance

- Uso de `useMemo` para cálculos pesados
- Filtragem client-side otimizada
- Componentes de UI leves (shadcn/ui)
- Lazy evaluation de insights
- Sticky positioning para painel lateral

## Testando

```bash
# Desenvolvimento
npm run dev

# Acessar
http://localhost:3000/consultar
```

A tela requer autenticação. Após login, você verá:
- 25 processos de exemplo
- Dashboard completo com gráficos
- 8 servidores com diferentes cargas
- Múltiplos insights da IA
