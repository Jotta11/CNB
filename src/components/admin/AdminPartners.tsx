import { useState } from 'react';
import { usePartners, Partner } from '@/hooks/usePartners';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, ExternalLink, Loader2, GripVertical } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface PartnerFormData {
  nome: string;
  logo_url: string;
  link: string;
  ordem: number;
  ativo: boolean;
}

const emptyForm: PartnerFormData = {
  nome: '',
  logo_url: '',
  link: '',
  ordem: 0,
  ativo: true,
};

const AdminPartners = () => {
  const { partners, isLoading, createPartner, updatePartner, deletePartner } = usePartners();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState<PartnerFormData>(emptyForm);

  const handleOpenCreate = () => {
    setEditingPartner(null);
    setFormData({
      ...emptyForm,
      ordem: partners.length,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      nome: partner.nome,
      logo_url: partner.logo_url,
      link: partner.link,
      ordem: partner.ordem,
      ativo: partner.ativo,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPartner) {
      await updatePartner.mutateAsync({
        id: editingPartner.id,
        ...formData,
      });
    } else {
      await createPartner.mutateAsync(formData);
    }
    
    setIsDialogOpen(false);
    setFormData(emptyForm);
    setEditingPartner(null);
  };

  const handleDelete = async (id: string) => {
    await deletePartner.mutateAsync(id);
  };

  const handleToggleActive = async (partner: Partner) => {
    await updatePartner.mutateAsync({
      id: partner.id,
      ativo: !partner.ativo,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Empresas Parceiras</CardTitle>
            <CardDescription>Gerencie as logos das empresas parceiras que aparecem no site</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreate} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Parceiro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingPartner ? 'Editar Parceiro' : 'Novo Parceiro'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Empresa</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome da empresa"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo_url">URL da Logo</Label>
                  <Input
                    id="logo_url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    placeholder="https://exemplo.com/logo.png"
                    required
                  />
                  {formData.logo_url && (
                    <div className="mt-2 p-4 bg-muted rounded-lg flex items-center justify-center">
                      <img 
                        src={formData.logo_url} 
                        alt="Preview" 
                        className="max-h-16 max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Link (Instagram ou Site)</Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://instagram.com/empresa ou https://empresa.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ordem">Ordem de Exibição</Label>
                  <Input
                    id="ordem"
                    type="number"
                    value={formData.ordem}
                    onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })}
                    min={0}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="ativo">Ativo</Label>
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={createPartner.isPending || updatePartner.isPending}
                  >
                    {(createPartner.isPending || updatePartner.isPending) && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingPartner ? 'Salvar' : 'Adicionar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {partners.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum parceiro cadastrado ainda.</p>
            <p className="text-sm mt-1">Clique em "Adicionar Parceiro" para começar.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead className="w-20">Logo</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="w-20">Status</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <GripVertical className="w-4 h-4" />
                      {partner.ordem}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-16 h-10 bg-muted rounded flex items-center justify-center">
                      <img
                        src={partner.logo_url}
                        alt={partner.nome}
                        className="max-h-8 max-w-14 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{partner.nome}</TableCell>
                  <TableCell>
                    <a
                      href={partner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 text-sm"
                    >
                      {partner.link.length > 30 ? partner.link.substring(0, 30) + '...' : partner.link}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={partner.ativo}
                      onCheckedChange={() => handleToggleActive(partner)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(partner)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover parceiro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. O parceiro "{partner.nome}" será removido permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(partner.id)}
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
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminPartners;
