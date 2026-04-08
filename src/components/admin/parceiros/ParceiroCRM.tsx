// src/components/admin/parceiros/ParceiroCRM.tsx
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
import { Plus, Pencil, Briefcase, Phone, Copy, Ticket, Users, UserPlus, UserCheck, Star } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  PROFISSOES, UFS, UF_NAMES, FUNIL_STATUS, FUNIL_LABELS,
  INDICACAO_STATUS_LABELS, CONTATO_TIPO_LABELS, CONTATO_MANUAL_TIPOS,
} from '@/data/parceiros-constants';
import type { Parceiro, Indicacao, ParceiroContato, ParceiroInsert } from '@/types/parceiros';

const db = supabase as any;

const emptyForm: Omit<ParceiroInsert, 'status_funil' | 'origem'> = {
  nome_completo: '', cpf: '', telefone: null, email: null,
  endereco: null, chave_pix: null, profissao: 'Corretor', uf: 'GO', cidade: '',
};

const getCupom = (nome: string) => {
  const partes = nome.trim().split(/\s+/);
  return partes.length > 1 ? partes[1].toUpperCase() : '';
};

const ParceiroCRM = () => {
  const qc = useQueryClient();
  const [viewMode, setViewMode]           = useState<'kanban' | 'list'>('kanban');
  const [formOpen, setFormOpen]           = useState(false);
  const [carteiraOpen, setCarteiraOpen]   = useState(false);
  const [contatoOpen, setContatoOpen]     = useState(false);
  const [editingId, setEditingId]         = useState<string | null>(null);
  const [selected, setSelected]           = useState<Parceiro | null>(null);
  const [form, setForm]                   = useState(emptyForm);
  const [contatoTipo, setContatoTipo]     = useState('');
  const [contatoDesc, setContatoDesc]     = useState('');

  const { data: parceiros = [], isLoading } = useQuery<Parceiro[]>({
    queryKey: ['crm-parceiros'],
    queryFn: async () => {
      const { data } = await db.from('parceiros').select('*').order('nome_completo');
      return data ?? [];
    },
  });

  const { data: lastContacts } = useQuery<Map<string, string>>({
    queryKey: ['crm-last-contacts'],
    queryFn: async () => {
      const { data } = await db.from('parceiro_contatos').select('parceiro_id, created_at').order('created_at', { ascending: false });
      const map = new Map<string, string>();
      data?.forEach((c: any) => { if (!map.has(c.parceiro_id)) map.set(c.parceiro_id, c.created_at); });
      return map;
    },
  });

  const { data: carteiraIndicacoes = [] } = useQuery<Indicacao[]>({
    queryKey: ['crm-carteira', selected?.id],
    enabled: !!selected,
    queryFn: async () => {
      const { data } = await db.from('indicacoes').select('*').eq('parceiro_id', selected!.id).order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const { data: timeline = [] } = useQuery<ParceiroContato[]>({
    queryKey: ['crm-timeline', selected?.id],
    enabled: !!selected,
    queryFn: async () => {
      const { data } = await db.from('parceiro_contatos').select('*').eq('parceiro_id', selected!.id).order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      if (editingId) {
        const { error } = await db.from('parceiros').update(data).eq('id', editingId);
        if (error) throw error;
        await db.from('parceiro_contatos').insert({ parceiro_id: editingId, tipo: 'edicao_cadastro', descricao: 'Cadastro atualizado' });
      } else {
        const { error } = await db.from('parceiros').insert({ ...data, status_funil: 'prospeccao', origem: 'manual' });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['crm-parceiros'] });
      qc.invalidateQueries({ queryKey: ['crm-last-contacts'] });
      setFormOpen(false); setEditingId(null); setForm(emptyForm);
      toast.success(editingId ? 'Parceiro atualizado!' : 'Parceiro cadastrado!');
    },
    onError: (err: any) => toast.error(err.message ?? 'Erro ao salvar'),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await db.from('parceiros').update({ status_funil: status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['crm-parceiros'] }); toast.success('Status atualizado!'); },
    onError: (err: any) => toast.error(err.message),
  });

  const contatoMutation = useMutation({
    mutationFn: async () => {
      if (!selected) return;
      const { error } = await db.from('parceiro_contatos').insert({
        parceiro_id: selected.id, tipo: 'contato_manual', descricao: `${contatoTipo}: ${contatoDesc}`,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['crm-timeline', selected?.id] });
      qc.invalidateQueries({ queryKey: ['crm-last-contacts'] });
      setContatoOpen(false); setContatoTipo(''); setContatoDesc('');
      toast.success('Contato registrado!');
    },
  });

  const openEdit = (p: Parceiro) => {
    setEditingId(p.id);
    setForm({ nome_completo: p.nome_completo, cpf: p.cpf, telefone: p.telefone,
      email: p.email, endereco: p.endereco, chave_pix: p.chave_pix, profissao: p.profissao, uf: p.uf, cidade: p.cidade });
    setFormOpen(true);
  };

  const getLastContact = (parceiroId: string) => {
    const last = lastContacts?.get(parceiroId);
    return last ? formatDistanceToNow(new Date(last), { locale: ptBR, addSuffix: true }) : 'Sem registro';
  };

  const getInactiveDays = (parceiroId: string, createdAt: string) => {
    const last = lastContacts?.get(parceiroId);
    const d = last ? new Date(last) : new Date(createdAt);
    return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleDragStart = (e: React.DragEvent, id: string) => e.dataTransfer.setData('parceiroId', id);
  const handleDragOver  = (e: React.DragEvent) => e.preventDefault();
  const handleDrop      = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('parceiroId');
    if (id) statusMutation.mutate({ id, status });
  };

  const countByStatus = (s: string) => parceiros.filter((p) => p.status_funil === s).length;

  const StatusIcons: Record<string, React.ElementType> = {
    prospeccao: UserPlus, fechamento: Users, ativo: UserCheck, com_indicacao: Star,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bebas text-primary">CRM Parceiros</h1>
          <p className="text-muted-foreground text-sm">Gestão da carteira e funil de indicação</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'kanban' ? 'list' : 'kanban')}>
            {viewMode === 'kanban' ? 'Modo Lista' : 'Modo Kanban'}
          </Button>
          <Button onClick={() => { setEditingId(null); setForm(emptyForm); setFormOpen(true); }}>
            <Plus className="w-4 h-4 mr-1" /> Novo Parceiro
          </Button>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {FUNIL_STATUS.map((s) => {
          const Icon = StatusIcons[s] ?? Users;
          return (
            <div key={s} className="bg-white rounded-lg p-3 border border-border flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded text-primary"><Icon className="w-4 h-4" /></div>
              <div>
                <p className="text-xs text-muted-foreground">{FUNIL_LABELS[s]}</p>
                <p className="text-xl font-bold text-primary">{countByStatus(s)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kanban */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FUNIL_STATUS.map((status) => {
            const col = parceiros.filter((p) => p.status_funil === status);
            return (
              <div key={status} className="bg-secondary/30 rounded-lg p-3 min-h-[200px]"
                onDrop={(e) => handleDrop(e, status)} onDragOver={handleDragOver}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-primary">{FUNIL_LABELS[status]}</h3>
                  <Badge variant="secondary" className="text-xs">{col.length}</Badge>
                </div>
                <div className="space-y-2">
                  {col.map((p) => {
                    const inativo = getInactiveDays(p.id, p.created_at) > 15;
                    const cupom = getCupom(p.nome_completo);
                    return (
                      <Card key={p.id} draggable onDragStart={(e) => handleDragStart(e, p.id)}
                        className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <p className="font-semibold text-sm">{p.nome_completo}</p>
                          {p.origem === 'landing_page' && (
                            <Badge className="text-[10px] bg-accent text-accent-foreground mt-1">Landing Page</Badge>
                          )}
                          <p className="text-xs text-muted-foreground">{p.profissao}</p>
                          <p className="text-xs text-muted-foreground">{p.cidade}/{p.uf}</p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-[10px] text-muted-foreground">{getLastContact(p.id)}</span>
                            {inativo && <Badge variant="destructive" className="text-[10px]">Inativo</Badge>}
                          </div>
                          {cupom && (
                            <div className="flex items-center gap-1 mt-1">
                              <Ticket className="w-3 h-3 text-accent" />
                              <span className="text-[10px] font-mono font-bold text-accent">{cupom}</span>
                              <Button variant="ghost" size="icon" className="h-4 w-4"
                                onClick={() => { navigator.clipboard.writeText(cupom); toast.success(`Cupom "${cupom}" copiado!`); }}>
                                <Copy className="w-2.5 h-2.5" />
                              </Button>
                            </div>
                          )}
                          <div className="flex gap-1 mt-2">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(p)}>
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setSelected(p); setCarteiraOpen(true); }}>
                              <Briefcase className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead><TableHead>Profissão</TableHead><TableHead>UF</TableHead>
                  <TableHead>Status</TableHead><TableHead>Último Contato</TableHead><TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Carregando...</TableCell></TableRow>
                ) : parceiros.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      {p.nome_completo}
                      {p.origem === 'landing_page' && <Badge className="ml-2 text-[10px] bg-accent text-accent-foreground">LP</Badge>}
                    </TableCell>
                    <TableCell>{p.profissao}</TableCell>
                    <TableCell>{p.uf}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {FUNIL_LABELS[p.status_funil as keyof typeof FUNIL_LABELS] ?? p.status_funil}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {getLastContact(p.id)}
                      {getInactiveDays(p.id, p.created_at) > 15 && <Badge variant="destructive" className="ml-2 text-[10px]">Inativo</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelected(p); setCarteiraOpen(true); }}><Briefcase className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dialog — Form */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? 'Editar Parceiro' : 'Novo Parceiro'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Nome Completo *</Label><Input value={form.nome_completo} onChange={(e) => setForm({ ...form, nome_completo: e.target.value })} /></div>
            <div><Label>CPF *</Label><Input value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} /></div>
            <div><Label>Telefone</Label><Input value={form.telefone ?? ''} onChange={(e) => setForm({ ...form, telefone: e.target.value || null })} /></div>
            <div><Label>E-mail</Label><Input type="email" value={form.email ?? ''} onChange={(e) => setForm({ ...form, email: e.target.value || null })} /></div>
            <div><Label>Endereço</Label><Input value={form.endereco ?? ''} onChange={(e) => setForm({ ...form, endereco: e.target.value || null })} /></div>
            <div><Label>Chave Pix</Label><Input value={form.chave_pix ?? ''} onChange={(e) => setForm({ ...form, chave_pix: e.target.value || null })} /></div>
            <div>
              <Label>Profissão *</Label>
              <Select value={form.profissao} onValueChange={(v) => setForm({ ...form, profissao: v as typeof form.profissao })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{PROFISSOES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>UF *</Label>
                <Select value={form.uf} onValueChange={(v) => setForm({ ...form, uf: v as typeof form.uf, cidade: '' })}>
                  <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                  <SelectContent>{UFS.map((u) => <SelectItem key={u} value={u}>{u} — {UF_NAMES[u]}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Cidade *</Label><Input value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
            <Button onClick={() => saveMutation.mutate(form)}
              disabled={!form.nome_completo || !form.cpf || !form.cidade || saveMutation.isPending}>
              {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog — Carteira */}
      <Dialog open={carteiraOpen} onOpenChange={setCarteiraOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Carteira — {selected?.nome_completo}</DialogTitle></DialogHeader>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{selected?.profissao} — {selected?.cidade}/{selected?.uf}</p>
            <Button size="sm" variant="outline" onClick={() => setContatoOpen(true)}>
              <Phone className="w-4 h-4 mr-1" /> Registrar Contato
            </Button>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Indicações ({carteiraIndicacoes.length})</h3>
            {carteiraIndicacoes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma indicação vinculada</p>
            ) : carteiraIndicacoes.map((ind) => (
              <div key={ind.id} className="p-3 mb-2 rounded-lg bg-secondary/30 border border-border text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{ind.cliente_nome}</span>
                  <div className="flex gap-1">
                    <Badge variant={ind.fluxo === 'Demanda' ? 'default' : 'secondary'} className="text-[10px]">{ind.fluxo}</Badge>
                    <Badge variant={ind.urgencia === 'Imediata' ? 'destructive' : 'outline'} className="text-[10px]">{ind.urgencia}</Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {INDICACAO_STATUS_LABELS[ind.status as keyof typeof INDICACAO_STATUS_LABELS] ?? ind.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{ind.categoria} • {ind.raca} • {ind.num_cabecas} cabeças</p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Timeline de Relacionamento</h3>
            {timeline.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum registro de contato</p>
            ) : timeline.map((c) => (
              <div key={c.id} className="flex items-start gap-3 p-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs">{CONTATO_TIPO_LABELS[c.tipo] ?? c.tipo}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(c.created_at), { locale: ptBR, addSuffix: true })}
                    </span>
                  </div>
                  {c.descricao && <p className="text-xs text-muted-foreground">{c.descricao}</p>}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog — Registrar Contato */}
      <Dialog open={contatoOpen} onOpenChange={setContatoOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Registrar Contato</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tipo de Contato</Label>
              <Select value={contatoTipo} onValueChange={setContatoTipo}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{CONTATO_MANUAL_TIPOS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea value={contatoDesc} onChange={(e) => setContatoDesc(e.target.value)} placeholder="Detalhes do contato..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContatoOpen(false)}>Cancelar</Button>
            <Button onClick={() => contatoMutation.mutate()} disabled={!contatoTipo || contatoMutation.isPending}>
              {contatoMutation.isPending ? 'Salvando...' : 'Registrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParceiroCRM;
