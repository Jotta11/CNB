# Design — Redesign do Admin CMS com Módulo de Parceiros

**Data:** 2026-04-08  
**Status:** Aprovado

---

## Visão Geral

Redesenhar o painel administrativo do CNB para suportar dois módulos distintos com navegação lateral (sidebar), e integrar o sistema de gestão de parceiros de indicação que hoje existe como repositório separado (`sistema-de-indica-o-cnb`).

---

## Estrutura de Navegação

O layout atual (abas horizontais) é substituído por uma **sidebar lateral fixa** com dois grupos de seções.

### Módulo Site (7 seções)
| Seção | Componente atual | Observação |
|---|---|---|
| Leads | `AdminLeads` | sem alteração |
| Usuários | `AdminUsers` | sem alteração |
| Lotes | `AdminLotes` | sem alteração |
| Empresas | `AdminPartners` | renomeado de "Parceiros" — são os parceiros institucionais com logo/link |
| Notícias | `AdminNews` | sem alteração |
| Calendário | `AdminCalendario` | sem alteração |
| Configurações | `AdminSettings` | sem alteração |

> **Removido:** "Candidatos Parceiros" (`AdminCandidatosParceiros`) é descontinuado — o fluxo de cadastro de parceiros vai direto para o CRM (ver Fluxos abaixo). A tabela `partner_applications` fica obsoleta e pode ser ignorada; novos registros vão direto para `parceiros`.

### Módulo Parceiros (5 seções)
| Seção | Componente novo | Origem |
|---|---|---|
| Dashboard | `ParceiroDashboard` | Portado de `sistema-de-indica-o-cnb/Dashboard.tsx` |
| CRM Parceiros | `ParceiroCRM` | Portado de `sistema-de-indica-o-cnb/ParceirosPage.tsx` |
| Indicações | `ParceiroIndicacoes` | Portado de `sistema-de-indica-o-cnb/IndicacoesPage.tsx` |
| Métricas | `ParceiroMetricas` | Portado de `sistema-de-indica-o-cnb/MetricasPage.tsx` |
| Contratos | `ParceiroContratos` | Portado de `sistema-de-indica-o-cnb/ContratosPage.tsx` |

---

## Layout

- **Header:** mantido (logo, email do usuário, botão Sair)
- **Sidebar fixa à esquerda:** largura ~200px, fundo `bg-primary` (#1a3a2a), dois grupos separados por divisor
  - Grupo "🌐 Site" — label uppercase em cinza claro
  - Grupo "🤝 Parceiros" — label uppercase em cinza claro
  - Item ativo: fundo semitransparente + borda esquerda em `accent` (#c17f24)
- **Área de conteúdo:** ocupa o restante da largura, fundo `bg-background` (creme)
- **Permissões:** o sistema `admin_permissions` existente (tabela `admin_permissions`, campo `tabs`) precisa reconhecer as novas chaves. As chaves do módulo Parceiros serão: `parceiro-dashboard`, `parceiro-crm`, `parceiro-indicacoes`, `parceiro-metricas`, `parceiro-contratos`. A chave `candidatos` é removida. A chave `parceiros` passa a se referir a "Empresas" (sem alteração de chave para não quebrar permissões existentes).

---

## Banco de Dados

As tabelas abaixo precisam ser criadas no Supabase do CNB via nova migration. Todas existem no projeto `sistema-de-indica-o-cnb` e devem ser portadas:

| Tabela | Função |
|---|---|
| `parceiros` | CRM de parceiros de indicação (nome, CPF, profissão, UF, cidade, chave_pix, status_funil, origem) |
| `indicacoes` | Oportunidades indicadas (parceiro_id, cliente, fluxo, raça, cabeças, urgência, status) |
| `parceiro_contatos` | Timeline de relacionamento com cada parceiro |
| `contratos` | Contratos vinculados a indicações |

RLS: todas as tabelas seguem o padrão do CNB — acesso restrito a admins via `has_role(auth.uid(), 'admin')`.

---

## Fluxos Automáticos

### Fluxo 1 — Candidato a Parceiro
```
Formulário "Quero ser parceiro" (página /indicacao-conectada)
  → INSERT direto em `parceiros` com status_funil = 'prospeccao' e origem = 'landing_page'
  (NÃO insere em `partner_applications` — essa tabela fica obsoleta)
```
- Sem etapa de aprovação manual
- O parceiro entra direto no CRM e aparece na coluna "Em Prospecção" do kanban
- O formulário existente em `IndicacaoConectada.tsx` precisa ser ajustado para inserir em `parceiros` em vez de `partner_applications`

### Fluxo 2 — Indicação Submetida
```
Indicação enviada (via CRM ou formulário público)
  → INSERT em `indicacoes` com status = 'em_validacao'
```
- Aparece na primeira coluna do kanban de Indicações para validação pela equipe

---

## Módulo Parceiros — Detalhamento das Seções

### Dashboard
- Cards de resumo: total de parceiros, total de indicações, cabeças em demanda, cabeças em oferta
- Feed de tarefas automáticas: parceiros inativos há +15 dias, indicações pendentes há +24h

### CRM Parceiros
- Kanban com colunas: Prospecção → Fechamento → Ativo → Com Indicação
- Drag-and-drop entre colunas para mover parceiro de estágio
- Modo lista alternativo (toggle)
- Card do parceiro: nome, profissão, cidade/UF, último contato, badge "Inativo" se +15 dias sem contato, cupom de indicação (2º sobrenome em maiúsculo)
- Drawer/modal "Carteira": indicações vinculadas + timeline de contatos + botão "Registrar Contato"

### Indicações
- Kanban por status: Em Validação → Em Andamento → Concluída → Perdida
- Formulário de nova indicação: parceiro, cliente, fluxo (Demanda/Oferta), raça, nº cabeças, urgência (Imediata/Futura)
- Modo lista alternativo

### Métricas
- Cards: total indicações, total contratos/negócios, taxa de conversão
- Gráfico de barras: cabeças por UF (top 10)
- Gráfico de pizza: convertidas vs pendentes

### Contratos
- Listagem de contratos vinculados a indicações
- Editor de modelos com campos dinâmicos

---

## Arquitetura de Componentes

```
src/pages/Admin.tsx              ← redesenhado (sidebar + roteamento interno)
src/components/admin/
  AdminSidebar.tsx               ← novo — sidebar com dois grupos
  AdminPartners.tsx              ← existente (renomeado "Empresas" apenas no label)
  parceiros/
    ParceiroDashboard.tsx        ← novo
    ParceiroCRM.tsx              ← novo
    ParceiroIndicacoes.tsx       ← novo
    ParceiroMetricas.tsx         ← novo
    ParceiroContratos.tsx        ← novo
```

---

## O que NÃO muda

- `AdminCandidatosParceiros` é removido da navegação mas o arquivo pode ser mantido temporariamente
- Todos os demais componentes do módulo Site continuam sem alteração de lógica
- Sistema de permissões (`admin_permissions`) continua funcionando — apenas as chaves das novas seções precisam ser adicionadas ao enum de tabs permitidas

---

## Fora de Escopo

- Assistente IA (descartado pelo usuário)
- Tarefas IA como seção separada (apenas o feed no Dashboard)
- Formulário público de indicação (já existe em `/indicacao-conectada` — apenas integrar o INSERT)
