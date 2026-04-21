// src/components/admin/AdminLeads.tsx
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { Lead, LeadStatus, LeadTipo } from './leads.types';
import { tipoLabels, tipoColors, statusColors, statusLabels } from './leads.types';
import LeadDetailModal from './LeadDetailModal';
import LeadExportModal from './LeadExportModal';

const ITEMS_PER_PAGE = 50;

const AdminLeads = () => {
  const [filterTipo, setFilterTipo] = useState<'todos' | LeadTipo>('todos');
  const [filterStatus, setFilterStatus] = useState<'todos' | LeadStatus>('todos');
  const [page, setPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: leadsData, isLoading } = useQuery({
    queryKey: ['admin-leads', page],
    queryFn: async () => {
      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      const { data, error, count } = await supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);
      if (error) throw error;
      return { leads: data as unknown as Lead[], totalCount: count || 0 };
    },
  });

  const leads = leadsData?.leads ?? [];
  const totalCount = leadsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: LeadStatus }) => {
      const { error } = await supabase.from('leads').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      toast.success('Status atualizado!');
    },
    onError: () => toast.error('Erro ao atualizar status'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      toast.success('Lead excluído!');
    },
    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : String(error);
      toast.error(`Erro ao excluir lead: ${msg}`);
    },
  });

  const filteredLeads = leads.filter(lead => {
    if (filterTipo !== 'todos' && lead.tipo !== filterTipo) return false;
    if (filterStatus !== 'todos' && lead.status !== filterStatus) return false;
    return true;
  });

  const allOnPageSelected =
    filteredLeads.length > 0 && filteredLeads.every(l => selectedIds.has(l.id));

  const toggleSelectAll = () => {
    if (allOnPageSelected) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredLeads.forEach(l => next.delete(l.id));
        return next;
      });
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredLeads.forEach(l => next.add(l.id));
        return next;
      });
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openDetail = (lead: Lead) => {
    setDetailLead(lead);
    setDetailOpen(true);
  };

  const handleStatusChange = (id: string, status: LeadStatus) => {
    updateStatusMutation.mutate({ id, status });
    setDetailLead(prev => (prev?.id === id ? { ...prev, status } : prev));
  };

  useEffect(() => {
    setSelectedIds(new Set());
  }, [page]);

  const stats = {
    total: totalCount,
    comprar: leads.filter(l => l.tipo === 'comprar').length,
    vender: leads.filter(l => l.tipo === 'vender').length,
    tabela_precos: leads.filter(l => l.tipo === 'tabela_precos').length,
    ofertas_direcionadas: leads.filter(l => l.tipo === 'ofertas_direcionadas').length,
    novos: leads.filter(l => l.status === 'novo').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        <Card><CardContent className="pt-4 pb-4">
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <p className="text-xs text-muted-foreground leading-tight">Total</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4">
          <div className="text-2xl font-bold text-green-600">{stats.comprar}</div>
          <p className="text-xs text-muted-foreground leading-tight">Comprar</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4">
          <div className="text-2xl font-bold text-blue-600">{stats.vender}</div>
          <p className="text-xs text-muted-foreground leading-tight">Vender</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4">
          <div className="text-2xl font-bold text-emerald-600">{stats.tabela_precos}</div>
          <p className="text-xs text-muted-foreground leading-tight">Tabela Preços</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4">
          <div className="text-2xl font-bold text-purple-600">{stats.ofertas_direcionadas}</div>
          <p className="text-xs text-muted-foreground leading-tight">Ofertas Dir.</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.novos}</div>
          <p className="text-xs text-muted-foreground leading-tight">Novos</p>
        </CardContent></Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={filterTipo} onValueChange={(v) => setFilterTipo(v as 'todos' | LeadTipo)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            <SelectItem value="comprar">Quer Comprar</SelectItem>
            <SelectItem value="vender">Quer Vender</SelectItem>
            <SelectItem value="tabela_precos">Tabela de Preços</SelectItem>
            <SelectItem value="ofertas_direcionadas">Ofertas Direcionadas</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as 'todos' | LeadStatus)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="novo">Novo</SelectItem>
            <SelectItem value="em_contato">Em Contato</SelectItem>
            <SelectItem value="convertido">Convertido</SelectItem>
            <SelectItem value="perdido">Perdido</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-2">
          {selectedIds.size > 0 && (
            <span className="text-sm text-muted-foreground">{selectedIds.size} selecionado(s)</span>
          )}
          <Button variant="outline" size="sm" onClick={() => setExportOpen(true)}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Table */}
      {filteredLeads.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum lead encontrado com os filtros selecionados.
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-3 w-10">
                  <Checkbox
                    checked={allOnPageSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">Nome / Telefone</th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">Canal</th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">Data</th>
                <th className="px-3 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(lead => (
                <tr
                  key={lead.id}
                  className={`border-t transition-colors ${
                    selectedIds.has(lead.id) ? 'bg-primary/5' : 'hover:bg-muted/30'
                  }`}
                >
                  <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(lead.id)}
                      onCheckedChange={() => toggleSelect(lead.id)}
                    />
                  </td>
                  <td className="px-3 py-3 cursor-pointer" onClick={() => openDetail(lead)}>
                    <div className="font-medium">{lead.nome}</div>
                    <div className="text-xs text-muted-foreground">{lead.telefone}</div>
                  </td>
                  <td className="px-3 py-3 cursor-pointer" onClick={() => openDetail(lead)}>
                    <Badge
                      variant="outline"
                      className={`${tipoColors[lead.tipo]?.border ?? 'border-gray-400'} ${tipoColors[lead.tipo]?.text ?? 'text-gray-600'}`}
                    >
                      {tipoLabels[lead.tipo] ?? lead.tipo}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 cursor-pointer" onClick={() => openDetail(lead)}>
                    <Badge className={`${statusColors[lead.status]} text-white`}>
                      {statusLabels[lead.status]}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-xs text-muted-foreground cursor-pointer" onClick={() => openDetail(lead)}>
                    {format(new Date(lead.created_at), "dd/MM/yy HH:mm", { locale: ptBR })}
                  </td>
                  <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive h-7 w-7"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir lead?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. O lead será removido permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMutation.mutate(lead.id)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {page * ITEMS_PER_PAGE + 1}–{Math.min((page + 1) * ITEMS_PER_PAGE, totalCount)} de {totalCount}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              Próximo
            </Button>
          </div>
        </div>
      )}

      <LeadDetailModal
        lead={detailLead}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onStatusChange={handleStatusChange}
      />

      <LeadExportModal
        open={exportOpen}
        onOpenChange={setExportOpen}
        selectedIds={selectedIds}
        allLeads={leads}
      />
    </div>
  );
};

export default AdminLeads;
