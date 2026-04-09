import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Loader2, Phone, Mail, MapPin, Calendar, Tag, Trash2, Eye, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type ApplicationStatus = 'pendente' | 'aprovado' | 'recusado';

interface PartnerApplication {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  cidade: string;
  estado: string;
  mensagem: string | null;
  codigo_parceiro: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}

const statusConfig: Record<ApplicationStatus, { label: string; color: string; icon: React.ElementType }> = {
  pendente: { label: 'Pendente', color: 'bg-yellow-500', icon: Clock },
  aprovado: { label: 'Aprovado', color: 'bg-green-500', icon: CheckCircle2 },
  recusado: { label: 'Recusado', color: 'bg-red-500', icon: XCircle },
};

const AdminCandidatosParceiros = () => {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<'todos' | ApplicationStatus>('todos');
  const [selectedApp, setSelectedApp] = useState<PartnerApplication | null>(null);
  const [codigoInput, setCodigoInput] = useState('');
  const [savingCodigo, setSavingCodigo] = useState(false);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['partner_applications', filterStatus],
    queryFn: async () => {
      let query = (supabase as any).from('partner_applications').select('*').order('created_at', { ascending: false });
      if (filterStatus !== 'todos') {
        query = query.eq('status', filterStatus);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as PartnerApplication[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PartnerApplication> & { id: string }) => {
      const { error } = await (supabase as any).from('partner_applications').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner_applications'] });
      toast.success('Candidatura atualizada!');
    },
    onError: () => toast.error('Erro ao atualizar candidatura'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from('partner_applications').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner_applications'] });
      toast.success('Candidatura removida');
    },
    onError: () => toast.error('Erro ao remover candidatura'),
  });

  const handleStatusChange = (app: PartnerApplication, status: ApplicationStatus) => {
    updateMutation.mutate({ id: app.id, status });
    if (selectedApp?.id === app.id) setSelectedApp({ ...selectedApp, status });
  };

  const handleSaveCodigo = async () => {
    if (!selectedApp || !codigoInput.trim()) return;
    setSavingCodigo(true);
    try {
      await updateMutation.mutateAsync({ id: selectedApp.id, codigo_parceiro: codigoInput.trim().toUpperCase() });
      setSelectedApp({ ...selectedApp, codigo_parceiro: codigoInput.trim().toUpperCase() });
    } finally {
      setSavingCodigo(false);
    }
  };

  const openDetail = (app: PartnerApplication) => {
    setSelectedApp(app);
    setCodigoInput(app.codigo_parceiro ?? '');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Candidatos ao Programa de Parceria</CardTitle>
              <CardDescription>Gerencie os candidatos do programa Indicação Conectada e seus códigos de parceiro</CardDescription>
            </div>
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="aprovado">Aprovados</SelectItem>
                <SelectItem value="recusado">Recusados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nenhuma candidatura encontrada.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => {
                  const cfg = statusConfig[app.status];
                  return (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.nome}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                          <span>{app.telefone}</span>
                          <span>{app.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {app.cidade} / {app.estado}
                      </TableCell>
                      <TableCell>
                        {app.codigo_parceiro ? (
                          <span className="font-mono text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                            {app.codigo_parceiro}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${cfg.color} text-white text-xs`}>{cfg.label}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(app.created_at), 'dd/MM/yy', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openDetail(app)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remover candidatura?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  A candidatura de "{app.nome}" será removida permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(app.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Remover
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Candidatura — {selectedApp?.nome}</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>{selectedApp.telefone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="truncate">{selectedApp.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{selectedApp.cidade} / {selectedApp.estado}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>{format(new Date(selectedApp.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                </div>
              </div>

              {selectedApp.mensagem && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Sobre a atuação</p>
                  <p className="text-sm bg-muted rounded-lg p-3 leading-relaxed">{selectedApp.mensagem}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Código de Parceiro</p>
                <div className="flex gap-2">
                  <Input
                    value={codigoInput}
                    onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
                    placeholder="Ex: JOAO2024"
                    className="font-mono uppercase"
                  />
                  <Button onClick={handleSaveCodigo} disabled={savingCodigo || !codigoInput.trim()}>
                    {savingCodigo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />}
                  </Button>
                </div>
                {selectedApp.codigo_parceiro && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Código atual: <span className="font-mono font-bold text-primary">{selectedApp.codigo_parceiro}</span>
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Status</p>
                <div className="flex gap-2">
                  {(['pendente', 'aprovado', 'recusado'] as ApplicationStatus[]).map((s) => {
                    const cfg = statusConfig[s];
                    const Icon = cfg.icon;
                    return (
                      <Button
                        key={s}
                        variant={selectedApp.status === s ? 'default' : 'outline'}
                        size="sm"
                        className={selectedApp.status === s ? `${cfg.color} text-white border-0 hover:opacity-90` : ''}
                        onClick={() => handleStatusChange(selectedApp, s)}
                      >
                        <Icon className="w-3.5 h-3.5 mr-1.5" />
                        {cfg.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminCandidatosParceiros;
