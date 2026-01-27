import { useState, useRef } from 'react';
import { usePartners, Partner } from '@/hooks/usePartners';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, ExternalLink, Loader2, GripVertical, Upload, ImageIcon } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

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
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenCreate = () => {
    setEditingPartner(null);
    setFormData({
      ...emptyForm,
      ordem: partners.length,
    });
    setPreviewUrl('');
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
    setPreviewUrl(partner.logo_url);
    setIsDialogOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 2MB');
      return;
    }

    setUploading(true);
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('partner-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('partner-logos')
        .getPublicUrl(data.path);

      setFormData({ ...formData, logo_url: publicUrl });
      setPreviewUrl(publicUrl);
      toast.success('Logo enviada com sucesso!');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erro ao enviar a logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.logo_url) {
      toast.error('Por favor, envie uma logo para o parceiro');
      return;
    }
    
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
    setPreviewUrl('');
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
                  <Label>Logo da Empresa</Label>
                  <div 
                    className={`
                      border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                      ${previewUrl ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
                    `}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2 py-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Enviando...</span>
                      </div>
                    ) : previewUrl ? (
                      <div className="flex flex-col items-center gap-3">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="max-h-20 max-w-full object-contain"
                        />
                        <span className="text-sm text-muted-foreground">
                          Clique para alterar a imagem
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 py-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="flex items-center gap-1 text-primary font-medium">
                          <Upload className="w-4 h-4" />
                          Clique para enviar a logo
                        </div>
                        <span className="text-xs text-muted-foreground">
                          PNG, JPG ou SVG (máx. 2MB)
                        </span>
                      </div>
                    )}
                  </div>
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
                    disabled={createPartner.isPending || updatePartner.isPending || uploading}
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
