import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  Loader2,
  Newspaper,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday, isPast, addMonths, subMonths, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Database } from '@/integrations/supabase/types';

type Noticia = Database['public']['Tables']['noticias']['Row'];
type NoticiaInsert = Database['public']['Tables']['noticias']['Insert'];

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const AdminCalendario = () => {
  const [mesAtual, setMesAtual] = useState(new Date());
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<Noticia | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<NoticiaInsert>>({
    titulo: '',
    slug: '',
    conteudo: '',
    resumo: '',
    imagem_url: '',
    autor: '',
    data_publicacao: new Date().toISOString(),
  });

  const inicioMes = startOfMonth(mesAtual);
  const fimMes = endOfMonth(mesAtual);
  const inicioGrid = startOfWeek(inicioMes, { locale: ptBR });
  const fimGrid = endOfWeek(fimMes, { locale: ptBR });

  const { data: noticias = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-noticias-calendario', format(mesAtual, 'yyyy-MM')],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .gte('data_publicacao', format(inicioGrid, 'yyyy-MM-dd'))
        .lte('data_publicacao', format(addDays(fimGrid, 1), 'yyyy-MM-dd'))
        .order('data_publicacao', { ascending: true });
      if (error) throw error;
      return data as Noticia[];
    },
  });

  // Build grid of days
  const dias: Date[] = [];
  let cur = inicioGrid;
  while (cur <= fimGrid) {
    dias.push(cur);
    cur = addDays(cur, 1);
  }

  const noticiasDoDia = (dia: Date) =>
    noticias.filter((n) => isSameDay(parseISO(n.data_publicacao), dia));

  const handleOpenCreate = (dia?: Date) => {
    setEditingNews(null);
    const dataBase = dia || new Date();
    setFormData({
      titulo: '',
      slug: '',
      conteudo: '',
      resumo: '',
      imagem_url: '',
      autor: '',
      data_publicacao: dataBase.toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (n: Noticia) => {
    setEditingNews(n);
    setFormData({
      titulo: n.titulo,
      slug: n.slug,
      conteudo: n.conteudo,
      resumo: n.resumo || '',
      imagem_url: n.imagem_url || '',
      autor: n.autor || '',
      data_publicacao: n.data_publicacao,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.titulo || !formData.conteudo) {
      toast.error('Preencha título e texto completo');
      return;
    }
    const slug =
      formData.slug ||
      formData.titulo!
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    try {
      setActionLoading('save');
      if (editingNews) {
        const { error } = await supabase
          .from('noticias')
          .update({ ...formData, slug })
          .eq('id', editingNews.id);
        if (error) throw error;
        toast.success('Notícia atualizada');
      } else {
        const { error } = await supabase
          .from('noticias')
          .insert([{ ...formData, slug } as NoticiaInsert]);
        if (error) throw error;
        toast.success('Notícia agendada no calendário');
      }
      setIsModalOpen(false);
      refetch();
    } catch {
      toast.error('Erro ao salvar');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta notícia permanentemente?')) return;
    try {
      setActionLoading(id);
      const { error } = await supabase.from('noticias').delete().eq('id', id);
      if (error) throw error;
      toast.success('Notícia removida');
      setIsModalOpen(false);
      refetch();
    } catch {
      toast.error('Erro ao excluir');
    } finally {
      setActionLoading(null);
    }
  };

  // Dia selecionado para popover lateral
  const noticiasDiaSelecionado = diaSelecionado ? noticiasDoDia(diaSelecionado) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bebas text-primary tracking-tight uppercase">
            Calendário Editorial
          </h2>
          <p className="text-muted-foreground text-sm">
            Planeje e visualize o agendamento de publicações
          </p>
        </div>
        <Button
          onClick={() => handleOpenCreate()}
          className="bg-primary hover:bg-primary-medium font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          NOVA PUBLICAÇÃO
        </Button>
      </div>

      {/* Navegação de mês */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMesAtual((m) => subMonths(m, 1))}
          className="border-primary/30"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-xl font-bebas text-primary tracking-wide min-w-[200px] text-center">
          {format(mesAtual, 'MMMM yyyy', { locale: ptBR }).toUpperCase()}
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMesAtual((m) => addMonths(m, 1))}
          className="border-primary/30"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMesAtual(new Date())}
          className="text-primary text-xs font-bold uppercase"
        >
          Hoje
        </Button>

        {/* Legenda */}
        <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-green-500/70 inline-block" />
            Publicado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-500/70 inline-block" />
            Agendado
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="flex gap-4">
          {/* Grade do calendário */}
          <div className="flex-1 bg-white rounded-xl border border-cream-dark overflow-hidden shadow-sm">
            {/* Headers de dias da semana */}
            <div className="grid grid-cols-7 border-b border-cream-dark">
              {DIAS_SEMANA.map((d) => (
                <div
                  key={d}
                  className="py-2 text-center text-[11px] font-bold text-muted-foreground uppercase tracking-wider"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Células dos dias */}
            <div className="grid grid-cols-7">
              {dias.map((dia, idx) => {
                const noticiasNoDia = noticiasDoDia(dia);
                const eDoMesAtual = isSameMonth(dia, mesAtual);
                const eHoje = isToday(dia);
                const eSelecionado = diaSelecionado && isSameDay(dia, diaSelecionado);
                const MAX_VISIBLE = 3;

                return (
                  <div
                    key={idx}
                    onClick={() => setDiaSelecionado(eSelecionado ? null : dia)}
                    className={`
                      min-h-[100px] border-b border-r border-cream-dark p-1.5 cursor-pointer transition-colors group
                      ${!eDoMesAtual ? 'bg-gray-50/50' : 'bg-white hover:bg-cream/30'}
                      ${eSelecionado ? 'ring-2 ring-inset ring-primary/40 bg-primary/5' : ''}
                    `}
                  >
                    {/* Número do dia */}
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`
                          text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full
                          ${eHoje ? 'bg-primary text-white' : ''}
                          ${!eDoMesAtual ? 'text-muted-foreground/40' : 'text-foreground'}
                        `}
                      >
                        {format(dia, 'd')}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCreate(dia);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/10"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Itens do dia */}
                    <div className="space-y-0.5">
                      {noticiasNoDia.slice(0, MAX_VISIBLE).map((n) => {
                        const publicado = isPast(parseISO(n.data_publicacao));
                        return (
                          <button
                            key={n.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(n);
                            }}
                            className={`
                              w-full text-left text-[11px] font-medium px-1.5 py-0.5 rounded truncate block
                              ${publicado
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              }
                            `}
                            title={n.titulo}
                          >
                            {n.titulo}
                          </button>
                        );
                      })}
                      {noticiasNoDia.length > MAX_VISIBLE && (
                        <span className="text-[10px] text-muted-foreground pl-1">
                          +{noticiasNoDia.length - MAX_VISIBLE} mais
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Painel lateral — dia selecionado */}
          {diaSelecionado && (
            <div className="w-72 bg-white rounded-xl border border-cream-dark shadow-sm p-4 space-y-3 self-start sticky top-24">
              <div className="flex items-center justify-between">
                <h4 className="font-bebas text-primary text-lg tracking-wide">
                  {format(diaSelecionado, "dd 'de' MMMM", { locale: ptBR }).toUpperCase()}
                </h4>
                <Button
                  size="sm"
                  onClick={() => handleOpenCreate(diaSelecionado)}
                  className="bg-primary hover:bg-primary-medium h-7 px-2 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Novo
                </Button>
              </div>

              {noticiasDiaSelecionado.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-xs">Nenhuma publicação neste dia</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {noticiasDiaSelecionado.map((n) => {
                    const publicado = isPast(parseISO(n.data_publicacao));
                    return (
                      <button
                        key={n.id}
                        onClick={() => handleOpenEdit(n)}
                        className="w-full text-left p-2.5 rounded-lg border border-cream-dark hover:border-primary/40 hover:bg-cream/30 transition-colors group"
                      >
                        <div className="flex items-start gap-2">
                          <Newspaper className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{n.titulo}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Badge
                                className={`text-[10px] px-1.5 py-0 ${
                                  publicado
                                    ? 'bg-green-100 text-green-700 border-green-200'
                                    : 'bg-blue-100 text-blue-700 border-blue-200'
                                }`}
                                variant="outline"
                              >
                                {publicado ? 'Publicado' : 'Agendado'}
                              </Badge>
                              {n.autor && (
                                <span className="text-[10px] text-muted-foreground truncate">
                                  {n.autor}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal criar/editar */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-cream border-2 border-primary">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl text-primary tracking-wider">
              {editingNews ? 'EDITAR MATÉRIA' : 'NOVA MATÉRIA'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-primary">Título *</Label>
                <Input
                  className="border-cream-dark"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-primary">Autor</Label>
                <Input
                  className="border-cream-dark"
                  value={formData.autor || ''}
                  onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-primary">Data de Publicação</Label>
                <Input
                  type="datetime-local"
                  className="border-cream-dark"
                  value={formData.data_publicacao?.substring(0, 16)}
                  onChange={(e) =>
                    setFormData({ ...formData, data_publicacao: new Date(e.target.value).toISOString() })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-primary">Slug (opcional)</Label>
                <Input
                  className="border-cream-dark"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-gerado pelo título"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-primary">Resumo</Label>
              <Textarea
                className="border-cream-dark h-16"
                value={formData.resumo || ''}
                onChange={(e) => setFormData({ ...formData, resumo: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-primary">Texto Completo *</Label>
              <Textarea
                className="border-cream-dark h-40"
                value={formData.conteudo || ''}
                onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            {editingNews && (
              <Button
                variant="ghost"
                className="text-destructive mr-auto"
                onClick={() => handleDelete(editingNews.id)}
                disabled={!!actionLoading}
              >
                {actionLoading === editingNews.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Excluir'
                )}
              </Button>
            )}
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              CANCELAR
            </Button>
            <Button
              className="bg-primary hover:bg-primary-medium px-8 font-bold"
              onClick={handleSave}
              disabled={!!actionLoading}
            >
              {actionLoading === 'save' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'SALVAR'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCalendario;
