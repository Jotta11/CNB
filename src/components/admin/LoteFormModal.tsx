import { useState, useEffect } from 'react';
import { useLotes, type Lote } from '@/hooks/useLotes';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Upload, X, Video } from 'lucide-react';
import { convertToWebP, uploadVideo } from '@/utils/mediaUpload';

interface LoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lote: Lote | null;
}

const estados = [
  'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
  'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
  'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
  'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
  'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
];

const defaultCaracteristicas = [
  'Certificado sanitário completo',
  'GTA (Guia de Trânsito Animal)',
  'Vacinação em dia',
  'Vermifugação recente',
  'Rastreabilidade completa',
  'Garantia de procedência',
];

const LoteFormModal = ({ isOpen, onClose, lote }: LoteFormModalProps) => {
  const { createLote, updateLote } = useLotes(true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const [form, setForm] = useState({
    numero: '',
    titulo: '',
    raca: '',
    idade: '',
    peso: '',
    quantidade: 1,
    sexo: 'Macho',
    estado: 'Vacinado',
    localizacao: 'Tocantins',
    preco: 0,
    descricao: '',
    caracteristicas: defaultCaracteristicas,
    video_url: '',
    imagem_url: '',
    ativo: true,
    ordem: 0,
    capacidade_carga: 96,
    tipo_implemento: 'nove_eixos',
    qtd_carretas: 1,
  });

  useEffect(() => {
    if (lote) {
      setForm({
        numero: lote.numero,
        titulo: lote.titulo,
        raca: lote.raca,
        idade: lote.idade,
        peso: lote.peso,
        quantidade: lote.quantidade,
        sexo: lote.sexo,
        estado: lote.estado,
        localizacao: lote.localizacao || 'Tocantins',
        preco: lote.preco,
        descricao: lote.descricao || '',
        caracteristicas: lote.caracteristicas || defaultCaracteristicas,
        video_url: lote.video_url || '',
        imagem_url: lote.imagem_url || '',
        ativo: lote.ativo,
        ordem: lote.ordem,
        capacidade_carga: lote.capacidade_carga || 96,
        tipo_implemento: lote.tipo_implemento || 'nove_eixos',
        qtd_carretas: lote.qtd_carretas || 1,
      });
    } else {
      setForm({
        numero: '',
        titulo: '',
        raca: '',
        idade: '',
        peso: '',
        quantidade: 1,
        sexo: 'Macho',
        estado: 'Vacinado',
        localizacao: 'Tocantins',
        preco: 0,
        descricao: '',
        caracteristicas: defaultCaracteristicas,
        video_url: '',
        imagem_url: '',
        ativo: true,
        ordem: 0,
        capacidade_carga: 96,
        tipo_implemento: 'nove_eixos',
        qtd_carretas: 1,
      });
    }
  }, [lote, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const webpFile = await convertToWebP(file, 1200);
      const fileName = `lotes/${Date.now()}.webp`;
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, webpFile, { contentType: 'image/webp' });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);
      setForm((prev) => ({ ...prev, imagem_url: urlData.publicUrl }));
      toast.success('Imagem enviada com sucesso');
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error('Erro ao enviar imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingVideo(true);
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `lotes/${Date.now()}-${safeName}`;
      const url = await uploadVideo(file, path);
      setForm((prev) => ({ ...prev, video_url: url }));
      toast.success('Vídeo enviado com sucesso');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao enviar vídeo';
      toast.error(message);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (lote) {
        await updateLote(lote.id, form as any);
        toast.success('Lote atualizado com sucesso');
      } else {
        await createLote(form as any);
        toast.success('Lote criado com sucesso');
      }
      onClose();
    } catch (err) {
      console.error('Error saving lote:', err);
      toast.error('Erro ao salvar lote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bebas text-2xl text-primary">
            {lote ? 'Editar Lote' : 'Novo Lote'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero">Número do Lote</Label>
              <Input
                id="numero"
                value={form.numero}
                onChange={(e) => setForm((prev) => ({ ...prev, numero: e.target.value }))}
                placeholder="LOTE #001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={form.titulo}
                onChange={(e) => setForm((prev) => ({ ...prev, titulo: e.target.value }))}
                placeholder="Nelore Premium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="raca">Raça</Label>
              <Input
                id="raca"
                value={form.raca}
                onChange={(e) => setForm((prev) => ({ ...prev, raca: e.target.value }))}
                placeholder="Nelore"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idade">Idade</Label>
              <Input
                id="idade"
                value={form.idade}
                onChange={(e) => setForm((prev) => ({ ...prev, idade: e.target.value }))}
                placeholder="24 meses"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="peso">Peso</Label>
              <Input
                id="peso"
                value={form.peso}
                onChange={(e) => setForm((prev) => ({ ...prev, peso: e.target.value }))}
                placeholder="420kg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                min="1"
                value={form.quantidade}
                onChange={(e) => setForm((prev) => ({ ...prev, quantidade: parseInt(e.target.value) || 1 }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sexo">Sexo</Label>
              <Select
                value={form.sexo}
                onValueChange={(value) => setForm((prev) => ({ ...prev, sexo: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Macho">Macho</SelectItem>
                  <SelectItem value="Fêmea">Fêmea</SelectItem>
                  <SelectItem value="Misto">Misto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="localizacao">Localização (Estado)</Label>
              <Select
                value={form.localizacao}
                onValueChange={(value) => setForm((prev) => ({ ...prev, localizacao: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Situação Sanitária</Label>
              <Select
                value={form.estado}
                onValueChange={(value) => setForm((prev) => ({ ...prev, estado: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vacinado">Vacinado</SelectItem>
                  <SelectItem value="A vacinar">A vacinar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco">Preço (R$)</Label>
              <Input
                id="preco"
                type="number"
                min="0"
                step="0.01"
                value={form.preco}
                onChange={(e) => setForm((prev) => ({ ...prev, preco: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ordem">Ordem de exibição</Label>
              <Input
                id="ordem"
                type="number"
                min="0"
                value={form.ordem}
                onChange={(e) => setForm((prev) => ({ ...prev, ordem: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          {/* Composição de Carga - Freight fields */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border">
            <h3 className="font-semibold text-primary">Composição de Carga (Frete)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacidade_carga">Capacidade (cabeças)</Label>
                <Input
                  id="capacidade_carga"
                  type="number"
                  min="1"
                  value={form.capacidade_carga}
                  onChange={(e) => setForm((prev) => ({ ...prev, capacidade_carga: parseInt(e.target.value) || 96 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_implemento">Tipo de Implemento</Label>
                <Select
                  value={form.tipo_implemento}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, tipo_implemento: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nove_eixos">9 eixos</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="bitrem">Bitrem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="qtd_carretas">Qtd. Carretas</Label>
                <Input
                  id="qtd_carretas"
                  type="number"
                  min="1"
                  value={form.qtd_carretas}
                  onChange={(e) => setForm((prev) => ({ ...prev, qtd_carretas: parseInt(e.target.value) || 1 }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={form.descricao}
              onChange={(e) => setForm((prev) => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descrição detalhada do lote..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Vídeo do Lote</Label>
            <div className="flex items-center gap-4">
              {form.video_url ? (
                <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30 flex-1">
                  <Video className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm text-muted-foreground truncate flex-1">Vídeo enviado</span>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, video_url: '' }))}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm"
                    onChange={handleVideoUpload}
                    className="hidden"
                    disabled={uploadingVideo}
                  />
                  {uploadingVideo ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">Enviando vídeo...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">MP4 / MOV / WebM — máx. 200 MB, 2 min</span>
                    </>
                  )}
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Imagem do Lote</Label>
            <div className="flex items-center gap-4">
              {form.imagem_url ? (
                <div className="relative">
                  <img
                    src={form.imagem_url}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, imagem_url: '' }))}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">Upload</span>
                    </>
                  )}
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-medium" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoteFormModal;
