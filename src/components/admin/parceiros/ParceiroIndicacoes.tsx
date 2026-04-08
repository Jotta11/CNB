// src/components/admin/parceiros/ParceiroIndicacoes.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Target, Zap, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  FLUXOS, URGENCIAS, CATEGORIAS, RACAS, UFS,
  INDICACAO_STATUS, INDICACAO_STATUS_LABELS,
} from '@/data/parceiros-constants';
import type { Indicacao, IndicacaoInsert, Parceiro } from '@/types/parceiros';

const db = supabase as any;

const emptyForm: Omit<IndicacaoInsert, 'status' | 'origem'> = {
  parceiro_id: '', cliente_nome: '', cliente_telefone: null, cliente_municipio: null,
  cliente_uf: null, fluxo: 'Demanda', urgencia: 'Imediata', categoria: 'Bezerro', raca: 'Nelore',
  num_cabecas: 0, idade: null, peso_atual: null, data_projetada: null, observacoes_ia: null, cupom_utilizado: null,
};

const ParceiroIndicacoes = () => {
  const qc = useQueryClient();
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [formOpen, setFormOpen] = useState(false);
  const [filterFluxo, setFilterFluxo] = useState<string>('all');
  const [form, setForm] = useState(emptyForm);

  const { data: parceirosAtivos = [] } = useQuery<Parceiro[]>({
    queryKey: ['crm-parceiros-ativos'],
    queryFn: async () => {
      const { data } = await db.from('parceiros').select('id, nome_completo, status_funil').order('nome_completo');
      return data ?? [];
    },
  });

  const { data: indicacoes = [], isLoading } = useQuery<Indicacao[]>({
    queryKey: ['crm-indicacoes'],
    queryFn: async () => {
      const { data } = await db.from('indicacoes').select('*, parceiros(nome_completo)').order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const filtered = filterFluxo === 'all' ? indicacoes : indicacoes.filter((i) => i.fluxo === filterFluxo);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await db.from('indicacoes').insert({
        ...form,
        num_cabecas: Number(form.num_cabecas),
        status: 'em_validacao',
        origem: 'manual',
        peso_atual: form.peso_atual ? Number(form.peso_atual) : null,
      });
      if (error) throw error;
      await db.from('parceiro_contatos').insert({
        parceiro_id: form.parceiro_id, tipo: 'indicacao_criada',
        descricao: `Nova indicação: ${form.cliente_nome}`,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['crm-indicacoes'] });
      qc.invalidateQueries({ queryKey: ['crm-timeline'] });
      setFormOpen(false); setForm(emptyForm);
      toast.success('Indicação cadastrada!');
    },
    onError: (err: any) => toast.error(err.message ?? 'Erro ao salvar'),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await db.from('indicacoes').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['crm-indicacoes'] }); toast.success('Status atualizado!'); },
    onError: (err: any) => toast.error(err.message),
  });

  const handleDragStart = (e: React.DragEvent, id: string) => e.dataTransfer.setData('indicacaoId', id);
  const handleDragOver  = (e: React.DragEvent) => e.preventDefault();
  const handleDrop      = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('indicacaoId');
    if (id) statusMutation.mutate({ id, status });
  };

  const totalDemanda = indicacoes.filter((i) => i.fluxo === 'Demanda').reduce((s, i) => s + i.num_cabecas, 0);
  const totalOferta  = indicacoes.filter((i) => i.fluxo === 'Oferta').reduce((s, i) => s + i.num_cabecas, 0);
  const imediatas    = indicacoes.filter((i) => i.urgencia === 'Imediata').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bebas text-primary">Indicações</h1>
          <p className="text-muted-foreground text-sm">Oportunidades indicadas pelos parceiros</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'list' ? 'kanban' : 'list')}>
            {viewMode === 'list' ? 'Modo Kanban' : 'Modo Lista'}
          </Button>
          <Button onClick={() => setFormOpen(true)}><Plus className="w-4 h-4 mr-1" /> Nova Indicação</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg p-3 border border-border flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded text-primary"><Target className="w-4 h-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total</p><p className="text-xl font-bold">{indicacoes.length}</p></div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-border flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded text-accent"><Zap className="w-4 h-4" /></div>
          <div><p className="text-xs text-muted-foreground">Imediatas</p><p className="text-xl font-bold">{imediatas}</p></div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-border flex items-center gap-3">
          <div className="p-2 bg-secondary/50 rounded"><BarChart3 className="w-4 h-4" /></div>
          <div><p className="text-xs text-muted-foreground">Demanda / Oferta</p><p className="text-xl font-bold">{totalDemanda} / {totalOferta}</p></div>
        </div>
      </div>

      {/* Filtro de fluxo */}
      <div className="flex gap-2">
        {['all', 'Demanda', 'Oferta'].map((f) => (
          <Button key={f} size="sm" variant={filterFluxo === f ? 'default' : 'outline'} onClick={() => setFilterFluxo(f)}>
            {f === 'all' ? 'Todos' : f}
          </Button>
        ))}
      </div>

      {viewMode === 'list' ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead><TableHead>Parceiro</TableHead><TableHead>Fluxo</TableHead>
                  <TableHead>Categoria / Raça</TableHead><TableHead>Cabeças</TableHead>
                  <TableHead>Urgência</TableHead><TableHead>Status</TableHead><TableHead>Criado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Carregando...</TableCell></TableRow>
                ) : filtered.map((ind) => (
                  <TableRow key={ind.id}>
                    <TableCell className="font-medium">{ind.cliente_nome}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{ind.parceiros?.nome_completo ?? '—'}</TableCell>
                    <TableCell><Badge variant={ind.fluxo === 'Demanda' ? 'default' : 'secondary'} className="text-[10px]">{ind.fluxo}</Badge></TableCell>
                    <TableCell className="text-sm">{ind.categoria} • {ind.raca}</TableCell>
                    <TableCell className="text-sm font-mono">{ind.num_cabecas}</TableCell>
                    <TableCell><Badge variant={ind.urgencia === 'Imediata' ? 'destructive' : 'outline'} className="text-[10px]">{ind.urgencia}</Badge></TableCell>
                    <TableCell>
                      <Select value={ind.status} onValueChange={(s) => statusMutation.mutate({ id: ind.id, status: s })}>
                        <SelectTrigger className="h-7 text-[11px] w-36"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {INDICACAO_STATUS.map((s) => (
                            <SelectItem key={s} value={s} className="text-[11px]">{INDICACAO_STATUS_LABELS[s]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(ind.created_at), { locale: ptBR, addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {INDICACAO_STATUS.map((status) => {
            const col = filtered.filter((i) => i.status === status);
            return (
              <div key={status} className="bg-secondary/30 rounded-lg p-3 min-h-[180px]"
                onDrop={(e) => handleDrop(e, status)} onDragOver={handleDragOver}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-primary">{INDICACAO_STATUS_LABELS[status]}</h3>
                  <Badge variant="secondary" className="text-xs">{col.length}</Badge>
                </div>
                <div className="space-y-2">
                  {col.map((ind) => (
                    <Card key={ind.id} draggable onDragStart={(e) => handleDragStart(e, ind.id)}
                      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <p className="font-semibold text-sm">{ind.cliente_nome}</p>
                        <p className="text-xs text-muted-foreground">{ind.categoria} • {ind.raca}</p>
                        <p className="text-xs text-muted-foreground">{ind.num_cabecas} cabeças</p>
                        <div className="flex gap-1 mt-1.5">
                          <Badge variant={ind.fluxo === 'Demanda' ? 'default' : 'secondary'} className="text-[10px]">{ind.fluxo}</Badge>
                          <Badge variant={ind.urgencia === 'Imediata' ? 'destructive' : 'outline'} className="text-[10px]">{ind.urgencia}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog — Nova Indicação */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Nova Indicação</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Parceiro *</Label>
              <Select value={form.parceiro_id} onValueChange={(v) => setForm({ ...form, parceiro_id: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione o parceiro" /></SelectTrigger>
                <SelectContent>{parceirosAtivos.map((p) => <SelectItem key={p.id} value={p.id}>{p.nome_completo}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Nome do Cliente *</Label><Input value={form.cliente_nome} onChange={(e) => setForm({ ...form, cliente_nome: e.target.value })} /></div>
            <div><Label>Telefone do Cliente</Label><Input value={form.cliente_telefone ?? ''} onChange={(e) => setForm({ ...form, cliente_telefone: e.target.value || null })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Município</Label><Input value={form.cliente_municipio ?? ''} onChange={(e) => setForm({ ...form, cliente_municipio: e.target.value || null })} /></div>
              <div>
                <Label>UF</Label>
                <Select value={form.cliente_uf ?? ''} onValueChange={(v) => setForm({ ...form, cliente_uf: v as typeof form.cliente_uf })}>
                  <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                  <SelectContent>{UFS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Fluxo *</Label>
                <Select value={form.fluxo} onValueChange={(v) => setForm({ ...form, fluxo: v as typeof form.fluxo })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{FLUXOS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Urgência *</Label>
                <Select value={form.urgencia} onValueChange={(v) => setForm({ ...form, urgencia: v as typeof form.urgencia })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{URGENCIAS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Categoria *</Label>
                <Select value={form.categoria} onValueChange={(v) => setForm({ ...form, categoria: v as typeof form.categoria })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIAS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Raça *</Label>
                <Select value={form.raca} onValueChange={(v) => setForm({ ...form, raca: v as typeof form.raca })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{RACAS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Nº de Cabeças *</Label><Input type="number" min={1} value={form.num_cabecas || ''} onChange={(e) => setForm({ ...form, num_cabecas: Number(e.target.value) })} /></div>
              <div><Label>Peso Atual (kg)</Label><Input type="number" value={form.peso_atual ?? ''} onChange={(e) => setForm({ ...form, peso_atual: e.target.value ? Number(e.target.value) : null })} /></div>
            </div>
            <div><Label>Observações</Label><Textarea value={form.observacoes_ia ?? ''} onChange={(e) => setForm({ ...form, observacoes_ia: e.target.value || null })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
            <Button onClick={() => saveMutation.mutate()}
              disabled={!form.parceiro_id || !form.cliente_nome || !form.num_cabecas || saveMutation.isPending}>
              {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParceiroIndicacoes;
