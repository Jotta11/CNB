import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { convertToWebP } from '@/utils/mediaUpload';
import { useHeroSlidesAdmin, type HeroSlide } from '@/hooks/useHeroSlides';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Upload, X, Plus, Trash2, Image, Layers } from 'lucide-react';

type BotaoModo = 'nenhum' | 'url' | 'secao';

const SECOES_SITE: { id: string; label: string }[] = [
  { id: '#inicio', label: 'Início' },
  { id: '#lotes', label: 'Lotes' },
  { id: '#vender', label: 'Quero Vender' },
  { id: '#sobre', label: 'Sobre Nós' },
  { id: '#faq', label: 'FAQ' },
];

// ── Tipos locais ──────────────────────────────────────────────────────────────

interface SlideForm {
  id: string | null;
  titulo: string;
  subtitulo: string;
  botao_modo: BotaoModo;
  botao_texto: string;
  botao_url: string;   // URL livre
  botao_secao: string; // âncora ex: #lotes
  imagem_mobile: string | null;
  imagem_desktop: string | null;
  ordem: number;
  ativo: boolean;
  isNew: boolean;
}

const deriveModo = (url: string | null): BotaoModo => {
  if (!url) return 'nenhum';
  if (url.startsWith('#')) return 'secao';
  return 'url';
};

const emptySlide = (): SlideForm => ({
  id: null,
  titulo: '',
  subtitulo: '',
  botao_modo: 'url',
  botao_texto: 'Ver Lotes',
  botao_url: '/lotes',
  botao_secao: '#lotes',
  imagem_mobile: null,
  imagem_desktop: null,
  ordem: 0,
  ativo: true,
  isNew: true,
});

const slideToForm = (s: HeroSlide): SlideForm => {
  const modo = deriveModo(s.botao_url);
  return {
    id: s.id,
    titulo: s.titulo,
    subtitulo: s.subtitulo ?? '',
    botao_modo: modo,
    botao_texto: s.botao_texto ?? '',
    botao_url: modo === 'url' ? (s.botao_url ?? '') : '/lotes',
    botao_secao: modo === 'secao' ? (s.botao_url ?? '#lotes') : '#lotes',
    imagem_mobile: s.imagem_mobile,
    imagem_desktop: s.imagem_desktop,
    ordem: s.ordem,
    ativo: s.ativo,
    isNew: false,
  };
};

// ── Upload helper ─────────────────────────────────────────────────────────────

const uploadSlideImage = async (file: File, slot: 'mobile' | 'desktop', slideId: string): Promise<string> => {
  const maxWidth = slot === 'mobile' ? 750 : 1920;
  const webpFile = await convertToWebP(file, maxWidth, 0.75);
  const path = `hero-slides/${slideId}-${slot}-${Date.now()}.webp`;
  const { error } = await supabase.storage
    .from('site-assets')
    .upload(path, webpFile, { contentType: 'image/webp', upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('site-assets').getPublicUrl(path);
  return data.publicUrl;
};

// ── Campo de upload de imagem (módulo-nível para evitar re-montagem) ──────────

const ImageUploadField = ({
  slot,
  label,
  hint,
  url,
  uploading,
  onUpload,
  onClear,
}: {
  slot: 'mobile' | 'desktop';
  label: string;
  hint: string;
  url: string | null;
  uploading: 'mobile' | 'desktop' | null;
  onUpload: (file: File) => void;
  onClear: () => void;
}) => {
  return (
    <div className="space-y-1">
      <Label className="flex items-center gap-1">
        <Image className="w-3.5 h-3.5" /> {label}
        <span className="text-xs text-muted-foreground ml-1">({hint})</span>
      </Label>
      {url ? (
        <div className="relative inline-block">
          <img src={url} alt={label} className="h-20 object-cover rounded border" />
          <button
            onClick={onClear}
            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary transition-colors">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading === slot}
            onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
          />
          {uploading === slot
            ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            : <><Upload className="w-5 h-5 text-muted-foreground" /><span className="text-xs text-muted-foreground mt-1">Clique para enviar</span></>
          }
        </label>
      )}
    </div>
  );
};

// ── Card de um slide ──────────────────────────────────────────────────────────

const SlideCard = ({
  form,
  onChange,
  onSave,
  onDelete,
  saving,
  deleting,
}: {
  form: SlideForm;
  onChange: (updated: SlideForm) => void;
  onSave: () => Promise<void>;
  onDelete: () => Promise<void>;
  saving: boolean;
  deleting: boolean;
}) => {
  const [uploading, setUploading] = useState<'mobile' | 'desktop' | null>(null);

  const handleImageUpload = async (slot: 'mobile' | 'desktop', file: File) => {
    try {
      setUploading(slot);
      // Para slides novos, usa um ID temporário para o path do storage
      const refId = form.id ?? `temp-${Date.now()}`;
      const url = await uploadSlideImage(file, slot, refId);
      onChange({
        ...form,
        imagem_mobile: slot === 'mobile' ? url : form.imagem_mobile,
        imagem_desktop: slot === 'desktop' ? url : form.imagem_desktop,
      });
      toast.success(`Imagem ${slot} enviada`);
    } catch {
      toast.error(`Erro ao enviar imagem ${slot}`);
    } finally {
      setUploading(null);
    }
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            {form.isNew ? 'Novo slide' : (form.titulo || 'Slide sem título')}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={form.ativo}
                onCheckedChange={(v) => onChange({ ...form, ativo: v })}
              />
              <span className="text-xs text-muted-foreground">{form.ativo ? 'Ativo' : 'Inativo'}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              disabled={deleting}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 px-2"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>Título</Label>
            <Textarea
              value={form.titulo}
              onChange={(e) => onChange({ ...form, titulo: e.target.value })}
              placeholder={"Ex: Conectando os melhores\nlotes para a sua fazenda"}
              rows={2}
              className="resize-none"
            />
          </div>
          <div className="space-y-1">
            <Label>Subtítulo</Label>
            <Input value={form.subtitulo} onChange={(e) => onChange({ ...form, subtitulo: e.target.value })} placeholder="Texto opcional abaixo do título" />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>Botão de ação</Label>
            <div className="flex flex-wrap gap-2">
              {(['nenhum', 'url', 'secao'] as BotaoModo[]).map((modo) => (
                <button
                  key={modo}
                  type="button"
                  onClick={() => onChange({ ...form, botao_modo: modo })}
                  className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                    form.botao_modo === modo
                      ? 'bg-primary text-white border-primary'
                      : 'border-input hover:border-primary/50'
                  }`}
                >
                  {modo === 'nenhum' ? 'Sem botão' : modo === 'url' ? 'URL' : 'Seção do site'}
                </button>
              ))}
            </div>
          </div>
          {form.botao_modo !== 'nenhum' && (
            <div className="space-y-1">
              <Label>Texto do botão</Label>
              <Input value={form.botao_texto} onChange={(e) => onChange({ ...form, botao_texto: e.target.value })} placeholder="Ex: Ver Lotes" />
            </div>
          )}
          {form.botao_modo === 'url' && (
            <div className="space-y-1">
              <Label>URL do botão</Label>
              <Input value={form.botao_url} onChange={(e) => onChange({ ...form, botao_url: e.target.value })} placeholder="Ex: /lotes ou https://..." />
            </div>
          )}
          {form.botao_modo === 'secao' && (
            <div className="space-y-1">
              <Label>Seção do site</Label>
              <Select value={form.botao_secao} onValueChange={(v) => onChange({ ...form, botao_secao: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha uma seção" />
                </SelectTrigger>
                <SelectContent>
                  {SECOES_SITE.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-1">
            <Label>Ordem</Label>
            <Input
              type="number"
              value={form.ordem}
              onChange={(e) => onChange({ ...form, ordem: Number(e.target.value) })}
              min={0}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ImageUploadField
            slot="mobile"
            label="Imagem Mobile"
            hint="retrato, ex: 750×1200px"
            url={form.imagem_mobile}
            uploading={uploading}
            onUpload={(file) => handleImageUpload('mobile', file)}
            onClear={() => onChange({ ...form, imagem_mobile: null })}
          />
          <ImageUploadField
            slot="desktop"
            label="Imagem Desktop"
            hint="paisagem, ex: 1920×800px"
            url={form.imagem_desktop}
            uploading={uploading}
            onUpload={(file) => handleImageUpload('desktop', file)}
            onClear={() => onChange({ ...form, imagem_desktop: null })}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={onSave} disabled={saving} className="bg-primary hover:bg-primary-medium">
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Salvando...</> : 'Salvar Slide'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// ── Componente principal ──────────────────────────────────────────────────────

const AdminHeroSlides = () => {
  const { slides, loading } = useHeroSlidesAdmin();
  const queryClient = useQueryClient();
  const [forms, setForms] = useState<SlideForm[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Sincroniza forms com dados do banco (apenas na primeira carga)
  useEffect(() => {
    if (!loading && !initialized) {
      setInitialized(true);
      setForms(slides.map(slideToForm));
    }
  }, [loading, initialized, slides]);

  const updateForm = (index: number, updated: SlideForm) => {
    setForms((prev) => prev.map((f, i) => (i === index ? updated : f)));
  };

  const handleAddSlide = () => {
    setForms((prev) => [...prev, emptySlide()]);
  };

  const handleSave = async (index: number) => {
    const form = forms[index];
    if (form.botao_modo !== 'nenhum' && !form.botao_texto.trim()) {
      toast.error('Informe o texto do botão ou selecione "Sem botão"');
      return;
    }
    if (form.botao_modo === 'url' && !form.botao_url.trim()) {
      toast.error('Informe a URL do botão');
      return;
    }

    const resolvedUrl =
      form.botao_modo === 'nenhum' ? null :
      form.botao_modo === 'secao' ? form.botao_secao :
      form.botao_url;

    const key = form.id ?? `new-${index}`;
    try {
      setSaving(key);
      const payload = {
        titulo: form.titulo,
        subtitulo: form.subtitulo || null,
        botao_texto: form.botao_modo === 'nenhum' ? null : form.botao_texto,
        botao_url: resolvedUrl,
        imagem_mobile: form.imagem_mobile,
        imagem_desktop: form.imagem_desktop,
        ordem: form.ordem,
        ativo: form.ativo,
      };

      if (form.isNew) {
        const { data, error } = await supabase.from('hero_slides').insert(payload).select().single();
        if (error) throw error;
        // Atualiza o form local com o ID retornado e marca como não-novo
        setForms((prev) => prev.map((f, i) => i === index ? { ...f, id: data.id, isNew: false } : f));
      } else {
        const { error } = await supabase.from('hero_slides').update(payload).eq('id', form.id!);
        if (error) throw error;
      }

      toast.success('Slide salvo com sucesso');
      queryClient.invalidateQueries({ queryKey: ['hero-slides-ativos'] });
    } catch {
      toast.error('Erro ao salvar slide');
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (index: number) => {
    const form = forms[index];
    if (form.isNew) {
      setForms((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    const key = form.id!;
    try {
      setDeleting(key);
      const { error } = await supabase.from('hero_slides').delete().eq('id', key);
      if (error) throw error;
      setForms((prev) => prev.filter((_, i) => i !== index));
      toast.success('Slide removido');
      queryClient.invalidateQueries({ queryKey: ['hero-slides-ativos'] });
    } catch {
      toast.error('Erro ao remover slide');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-primary">Slides do Carrossel</h3>
          <p className="text-sm text-muted-foreground">Gerencie os banners do hero. Slides inativos não aparecem no site.</p>
        </div>
        <Button onClick={handleAddSlide} size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/5">
          <Plus className="w-4 h-4 mr-1" />Adicionar Slide
        </Button>
      </div>

      {forms.length === 0 && (
        <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
          <Layers className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Nenhum slide cadastrado. Clique em "Adicionar Slide" para começar.</p>
        </div>
      )}

      {forms.map((form, i) => (
        <SlideCard
          key={form.id ?? `new-${i}`}
          form={form}
          onChange={(updated) => updateForm(i, updated)}
          onSave={() => handleSave(i)}
          onDelete={() => handleDelete(i)}
          saving={saving === (form.id ?? `new-${i}`)}
          deleting={form.id !== null && deleting === form.id}
        />
      ))}
    </div>
  );
};

export default AdminHeroSlides;
