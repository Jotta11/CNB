import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Phone, MapPin, Users, Calendar, ShoppingCart, Tag, MessageSquare, Trash2 } from 'lucide-react';
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

type LeadStatus = 'novo' | 'em_contato' | 'convertido' | 'perdido';
type LeadTipo = 'comprar' | 'vender' | 'tabela_precos' | 'ofertas_direcionadas';

const tipoLabels: Record<LeadTipo, string> = {
  comprar: 'Quer Comprar',
  vender: 'Quer Vender',
  tabela_precos: 'Tabela de Preços',
  ofertas_direcionadas: 'Ofertas Direcionadas',
};

const tipoColors: Record<LeadTipo, { bg: string; text: string; border: string; icon: string; iconBg: string }> = {
  comprar:              { bg: 'bg-green-100',   text: 'text-green-600',   border: 'border-green-500',   icon: 'text-green-600',   iconBg: 'bg-green-100'   },
  vender:               { bg: 'bg-blue-100',    text: 'text-blue-600',    border: 'border-blue-500',    icon: 'text-blue-600',    iconBg: 'bg-blue-100'    },
  tabela_precos:        { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-500', icon: 'text-emerald-600', iconBg: 'bg-emerald-100' },
  ofertas_direcionadas: { bg: 'bg-purple-100',  text: 'text-purple-600',  border: 'border-purple-500',  icon: 'text-purple-600',  iconBg: 'bg-purple-100'  },
};

interface Lead {
  id: string;
  tipo: LeadTipo;
  nome: string;
  telefone: string;
  fazenda: string | null;
  localizacao: string | null;
  tipo_cultura: string | null;
  numero_cabecas: number | null;
  mensagem: string | null;
  status: LeadStatus;
  created_at: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

const statusLabels: Record<LeadStatus, string> = {
  novo: 'Novo',
  em_contato: 'Em Contato',
  convertido: 'Convertido',
  perdido: 'Perdido'
};

const statusColors: Record<LeadStatus, string> = {
  novo: 'bg-blue-500',
  em_contato: 'bg-yellow-500',
  convertido: 'bg-green-500',
  perdido: 'bg-red-500'
};

const ITEMS_PER_PAGE = 50;

const AdminLeads = () => {
  const [filterTipo, setFilterTipo] = useState<'todos' | LeadTipo>('todos');
  const [filterStatus, setFilterStatus] = useState<'todos' | LeadStatus>('todos');
  const [page, setPage] = useState(0);
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
    }
  });

  const leads = leadsData?.leads;
  const totalCount = leadsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: LeadStatus }) => {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      toast.success('Status atualizado!');
    },
    onError: () => {
      toast.error('Erro ao atualizar status');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      toast.success('Lead excluído!');
    },
    onError: (error: unknown) => {
      console.error('Erro ao excluir lead:', error);
      const msg = error instanceof Error ? error.message : String(error);
      toast.error(`Erro ao excluir lead: ${msg}`);
    }
  });

  const filteredLeads = leads?.filter(lead => {
    if (filterTipo !== 'todos' && lead.tipo !== filterTipo) return false;
    if (filterStatus !== 'todos' && lead.status !== filterStatus) return false;
    return true;
  });

  const stats = {
    total: leads?.length || 0,
    comprar: leads?.filter(l => l.tipo === 'comprar').length || 0,
    vender: leads?.filter(l => l.tipo === 'vender').length || 0,
    tabela_precos: leads?.filter(l => l.tipo === 'tabela_precos').length || 0,
    ofertas_direcionadas: leads?.filter(l => l.tipo === 'ofertas_direcionadas').length || 0,
    novos: leads?.filter(l => l.status === 'novo').length || 0
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
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <p className="text-xs text-muted-foreground leading-tight">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-green-600">{stats.comprar}</div>
            <p className="text-xs text-muted-foreground leading-tight">Comprar</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-blue-600">{stats.vender}</div>
            <p className="text-xs text-muted-foreground leading-tight">Vender</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-emerald-600">{stats.tabela_precos}</div>
            <p className="text-xs text-muted-foreground leading-tight">Tabela Preços</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-purple-600">{stats.ofertas_direcionadas}</div>
            <p className="text-xs text-muted-foreground leading-tight">Ofertas Dir.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.novos}</div>
            <p className="text-xs text-muted-foreground leading-tight">Novos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
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
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhum lead encontrado com os filtros selecionados.
            </CardContent>
          </Card>
        ) : (
          filteredLeads?.map(lead => (
            <Card key={lead.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${tipoColors[lead.tipo]?.iconBg ?? 'bg-gray-100'}`}>
                      {lead.tipo === 'comprar' ? (
                        <ShoppingCart className={`w-5 h-5 ${tipoColors[lead.tipo]?.icon}`} />
                      ) : (
                        <Tag className={`w-5 h-5 ${tipoColors[lead.tipo]?.icon}`} />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{lead.nome}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`${tipoColors[lead.tipo]?.border ?? 'border-gray-400'} ${tipoColors[lead.tipo]?.text ?? 'text-gray-600'}`}>
                          {tipoLabels[lead.tipo] ?? lead.tipo}
                        </Badge>
                        <Badge className={`${statusColors[lead.status]} text-white`}>
                          {statusLabels[lead.status]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select
                      value={lead.status}
                      onValueChange={(v) => updateStatusMutation.mutate({ id: lead.id, status: v as LeadStatus })}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="novo">Novo</SelectItem>
                        <SelectItem value="em_contato">Em Contato</SelectItem>
                        <SelectItem value="convertido">Convertido</SelectItem>
                        <SelectItem value="perdido">Perdido</SelectItem>
                      </SelectContent>
                    </Select>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
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
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${lead.telefone}`} className="hover:text-primary">
                        {lead.telefone}
                      </a>
                    </div>
                    
                    {lead.localizacao && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{lead.localizacao}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(lead.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}</span>
                    </div>
                    {lead.utm_source && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Origem:</span>{' '}
                        {[lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(' / ')}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {lead.fazenda && (
                      <div className="text-muted-foreground">
                        <span className="font-medium">Fazenda:</span> {lead.fazenda}
                      </div>
                    )}
                    
                    {lead.tipo_cultura && (
                      <div className="text-muted-foreground">
                        <span className="font-medium">Cultura:</span> {lead.tipo_cultura}
                      </div>
                    )}
                    
                    {lead.numero_cabecas && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{lead.numero_cabecas} cabeças</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {lead.mensagem && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm text-muted-foreground">{lead.mensagem}</p>
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const message = `Olá ${lead.nome}! Recebemos seu contato através do nosso site CNB.`;
                      const phone = lead.telefone.replace(/\D/g, '');
                      window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Entrar em contato
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {page * ITEMS_PER_PAGE + 1} - {Math.min((page + 1) * ITEMS_PER_PAGE, totalCount)} de {totalCount}
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
    </div>
  );
};

export default AdminLeads;
