// src/components/admin/parceiros/ParceiroMetricas.tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { INDICACAO_STATUS_LABELS } from '@/data/parceiros-constants';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = [
  'hsl(152, 42%, 18%)',
  'hsl(38, 92%, 50%)',
  'hsl(152, 55%, 35%)',
  'hsl(0, 72%, 51%)',
];

const db = supabase as any;

export default function ParceiroMetricas() {
  const { data: indicacoes = [] } = useQuery({
    queryKey: ['crm-indicacoes'],
    queryFn: async () => {
      const { data } = await db
        .from('indicacoes')
        .select('*, parceiros(nome_completo)');
      return data ?? [];
    },
  });

  const { data: parceiros = [] } = useQuery({
    queryKey: ['crm-parceiros'],
    queryFn: async () => {
      const { data } = await db.from('parceiros').select('*');
      return data ?? [];
    },
  });

  const { data: contratos = [] } = useQuery({
    queryKey: ['crm-contratos'],
    queryFn: async () => {
      const { data } = await db.from('contratos').select('*');
      return data ?? [];
    },
  });

  // ─── Stat card metrics ────────────────────────────────────────────────────

  const totalIndicacoes = indicacoes.length;
  const negociosFechados = indicacoes.filter(
    (i: any) => i.status === 'finalizada',
  ).length;
  const taxaConversao =
    totalIndicacoes === 0
      ? '0%'
      : `${Math.round((negociosFechados / totalIndicacoes) * 100)}%`;
  const totalParceiros = parceiros.length;

  // ─── Bar chart: Cabeças por UF (top 10) ──────────────────────────────────

  const cabecasPorUF = Object.entries(
    indicacoes.reduce((acc: Record<string, number>, ind: any) => {
      const uf = ind.cliente_uf ?? 'N/A';
      acc[uf] = (acc[uf] ?? 0) + (ind.num_cabecas ?? 0);
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([uf, cabecas]) => ({ uf, cabecas }));

  // ─── Pie chart: Status das Indicações ────────────────────────────────────

  const statusCounts = indicacoes.reduce((acc: Record<string, number>, ind: any) => {
    const s = ind.status ?? 'desconhecido';
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(statusCounts).map(([status, value]) => ({
    name: (INDICACAO_STATUS_LABELS as Record<string, string>)[status] ?? status,
    value,
  }));

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Indicações</p>
            <p className="text-3xl font-bold text-primary mt-1">{totalIndicacoes}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Negócios Fechados</p>
            <p className="text-3xl font-bold text-primary mt-1">{negociosFechados}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
            <p className="text-3xl font-bold text-primary mt-1">{taxaConversao}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Parceiros</p>
            <p className="text-3xl font-bold text-primary mt-1">{totalParceiros}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Cabeças por UF (Top 10)</CardTitle>
          </CardHeader>
          <CardContent>
            {cabecasPorUF.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Sem dados disponíveis</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cabecasPorUF} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <YAxis dataKey="uf" type="category" width={32} tick={{ fontSize: 12 }} />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => [v.toLocaleString('pt-BR'), 'Cabeças']} />
                  <Bar dataKey="cabecas" fill="hsl(152, 42%, 18%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Status das Indicações</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Sem dados disponíveis</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                  >
                    {statusData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [v, 'Indicações']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
