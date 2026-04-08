// src/components/admin/parceiros/ParceiroDashboard.tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, TrendingUp, TrendingDown, Clock, UserX } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Parceiro, Indicacao, ParceiroContato } from '@/types/parceiros';

const db = supabase as any;

// ─── Geração de tarefas ───────────────────────────────────────────────────────

interface Tarefa {
  title: string;
  description: string;
  urgency: 'alta' | 'média' | 'baixa';
}

function gerarTarefas(
  indicacoes: Indicacao[],
  parceiros: Parceiro[],
  contatos: ParceiroContato[],
): Tarefa[] {
  const tarefas: Tarefa[] = [];
  const now = new Date();

  // Indicações em validação há mais de 24h
  indicacoes.forEach((ind) => {
    if (ind.status === 'em_validacao') {
      const horasAgo = (now.getTime() - new Date(ind.created_at).getTime()) / (1000 * 60 * 60);
      if (horasAgo > 24) {
        tarefas.push({
          title: 'Indicação aguardando validação',
          description: `"${ind.cliente_nome}" aguarda há ${formatDistanceToNow(new Date(ind.created_at), { locale: ptBR })}`,
          urgency: 'alta',
        });
      }
    }
  });

  // Oportunidades futuras paradas há mais de 7 dias
  indicacoes.forEach((ind) => {
    if (ind.urgencia === 'Futura' && ind.status === 'em_validacao') {
      const diasAgo = (now.getTime() - new Date(ind.created_at).getTime()) / (1000 * 60 * 60 * 24);
      if (diasAgo > 7) {
        tarefas.push({
          title: 'Oportunidade Futura — reativar contato',
          description: `Cliente "${ind.cliente_nome}" — ${ind.categoria} ${ind.raca}`,
          urgency: 'média',
        });
      }
    }
  });

  // Parceiros inativos há mais de 15 dias
  const ultimoContato = new Map<string, Date>();
  contatos.forEach((c) => {
    const d = new Date(c.created_at);
    const ex = ultimoContato.get(c.parceiro_id);
    if (!ex || d > ex) ultimoContato.set(c.parceiro_id, d);
  });

  parceiros.forEach((p) => {
    const last = ultimoContato.get(p.id) ?? new Date(p.created_at);
    const diasAgo = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
    if (diasAgo > 15) {
      tarefas.push({
        title: `Parceiro inativo há ${Math.floor(diasAgo)} dias`,
        description: `"${p.nome_completo}" — última interação: ${formatDistanceToNow(last, { locale: ptBR, addSuffix: true })}`,
        urgency: 'média',
      });
    }
  });

  return tarefas;
}

// ─── Componente ───────────────────────────────────────────────────────────────

const ParceiroDashboard = () => {
  const { data: parceiros = [] } = useQuery<Parceiro[]>({
    queryKey: ['crm-parceiros'],
    queryFn: async () => {
      const { data } = await db.from('parceiros').select('*');
      return data ?? [];
    },
  });

  const { data: indicacoes = [] } = useQuery<Indicacao[]>({
    queryKey: ['crm-indicacoes'],
    queryFn: async () => {
      const { data } = await db.from('indicacoes').select('*, parceiros(nome_completo)');
      return data ?? [];
    },
  });

  const { data: contatos = [] } = useQuery<ParceiroContato[]>({
    queryKey: ['crm-contatos-recentes'],
    queryFn: async () => {
      const { data } = await db.from('parceiro_contatos').select('*').order('created_at', { ascending: false }).limit(100);
      return data ?? [];
    },
  });

  const demandasCabecas = indicacoes.filter((i) => i.fluxo === 'Demanda').reduce((s, i) => s + i.num_cabecas, 0);
  const ofertasCabecas  = indicacoes.filter((i) => i.fluxo === 'Oferta').reduce((s, i) => s + i.num_cabecas, 0);
  const tarefas = gerarTarefas(indicacoes, parceiros, contatos);

  const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
    <div className="bg-white rounded-lg p-4 border border-border flex items-center gap-4">
      <div className="p-2 bg-primary/10 rounded-lg text-primary">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-primary">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bebas text-primary">Dashboard de Parceiros</h1>
        <p className="text-muted-foreground text-sm">Resumo geral do programa de indicações</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Parceiros"      value={parceiros.length}                      icon={<Users className="w-5 h-5" />} />
        <StatCard title="Total Indicações"     value={indicacoes.length}                     icon={<Target className="w-5 h-5" />} />
        <StatCard title="Demandas (cabeças)"   value={demandasCabecas.toLocaleString('pt-BR')} icon={<TrendingUp className="w-5 h-5" />} />
        <StatCard title="Ofertas (cabeças)"    value={ofertasCabecas.toLocaleString('pt-BR')}  icon={<TrendingDown className="w-5 h-5" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Feed de Tarefas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tarefas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma tarefa pendente. Sistema atualizado!</p>
          ) : (
            tarefas.slice(0, 8).map((t, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                <UserX className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                </div>
                <Badge variant={t.urgency === 'alta' ? 'destructive' : 'secondary'} className="text-[10px] shrink-0">
                  {t.urgency}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ParceiroDashboard;
