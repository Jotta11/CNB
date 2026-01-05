import { useState } from 'react';
import { useLotes, type Lote } from '@/hooks/useLotes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import LoteFormModal from './LoteFormModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AdminLotes = () => {
  const { lotes, loading, updateLote, deleteLote } = useLotes(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLote, setEditingLote] = useState<Lote | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleEdit = (lote: Lote) => {
    setEditingLote(lote);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingLote(null);
    setIsFormOpen(true);
  };

  const handleToggleActive = async (lote: Lote) => {
    try {
      setActionLoading(lote.id);
      await updateLote(lote.id, { ativo: !lote.ativo });
      toast.success(lote.ativo ? 'Lote desativado' : 'Lote ativado');
    } catch (err) {
      toast.error('Erro ao alterar status do lote');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setActionLoading(deleteId);
      await deleteLote(deleteId);
      toast.success('Lote excluído com sucesso');
    } catch (err) {
      toast.error('Erro ao excluir lote');
    } finally {
      setDeleteId(null);
      setActionLoading(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bebas text-primary">Gerenciar Lotes</h2>
          <p className="text-muted-foreground">Adicione, edite ou remova lotes</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary-medium">
          <Plus className="w-4 h-4 mr-2" />
          Novo Lote
        </Button>
      </div>

      {lotes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nenhum lote cadastrado</p>
            <Button onClick={handleCreate} variant="outline" className="mt-4">
              Adicionar primeiro lote
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {lotes.map((lote) => (
            <Card key={lote.id} className={!lote.ativo ? 'opacity-60' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 text-xs font-medium bg-primary text-white rounded">
                      {lote.numero}
                    </span>
                    <CardTitle className="text-lg">{lote.titulo}</CardTitle>
                    {!lote.ativo && (
                      <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                        Inativo
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(lote)}
                      disabled={actionLoading === lote.id}
                    >
                      {actionLoading === lote.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : lote.ativo ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(lote)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(lote.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Raça:</span>
                    <p className="font-medium">{lote.raca}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Idade:</span>
                    <p className="font-medium">{lote.idade}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Peso:</span>
                    <p className="font-medium">{lote.peso}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quantidade:</span>
                    <p className="font-medium">{lote.quantidade} cabeças</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sexo:</span>
                    <p className="font-medium">{lote.sexo}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Preço:</span>
                    <p className="font-medium text-primary">{formatPrice(lote.preco)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <LoteFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingLote(null);
        }}
        lote={editingLote}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este lote? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminLotes;
