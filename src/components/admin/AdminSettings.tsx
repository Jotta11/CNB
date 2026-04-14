import { useState, useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Upload, X, Image, Phone, Tag } from 'lucide-react';
import AdminHeroSlides from '@/components/admin/AdminHeroSlides';

const AdminSettings = () => {
  const { settings, loading, updateSetting, fetchSettings } = useSiteSettings();
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [whatsapp, setWhatsapp] = useState('');
  const [gtmId, setGtmId] = useState('');
  const [ga4Id, setGa4Id] = useState('');
  const [metaPixelId, setMetaPixelId] = useState('');

  useEffect(() => {
    if (!loading) {
      setWhatsapp(settings.whatsapp_number || '');
      setGtmId(settings.gtm_id || '');
      setGa4Id(settings.ga4_id || '');
      setMetaPixelId(settings.meta_pixel_id || '');
    }
  }, [loading, settings.whatsapp_number, settings.gtm_id, settings.ga4_id, settings.meta_pixel_id]);

  const handleImageUpload = async (key: string, file: File) => {
    try {
      setUploading(key);
      const fileExt = file.name.split('.').pop();
      const fileName = `settings/${key}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);

      await updateSetting(key, urlData.publicUrl);
      toast.success('Imagem atualizada com sucesso');
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error('Erro ao enviar imagem');
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveImage = async (key: string) => {
    try {
      await updateSetting(key, null);
      toast.success('Imagem removida');
    } catch (err) {
      toast.error('Erro ao remover imagem');
    }
  };

  const handleSaveTags = async () => {
    try {
      setSaving(true);
      await updateSetting('gtm_id', gtmId.trim() || null);
      await updateSetting('ga4_id', ga4Id.trim() || null);
      await updateSetting('meta_pixel_id', metaPixelId.trim() || null);
      toast.success('Tags de rastreamento salvas');
    } catch {
      toast.error('Erro ao salvar tags');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWhatsapp = async () => {
    try {
      setSaving(true);
      await updateSetting('whatsapp_number', whatsapp);
      toast.success('WhatsApp atualizado com sucesso');
    } catch (err) {
      toast.error('Erro ao salvar WhatsApp');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bebas text-primary">Configurações do Site</h2>
        <p className="text-muted-foreground">Altere logos, imagens e configurações gerais</p>
      </div>

      {/* ── Carrossel Hero ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Carrossel Hero
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdminHeroSlides />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Logo Horizontal
            </CardTitle>
            <CardDescription>Logo usada no header do site</CardDescription>
          </CardHeader>
          <CardContent>
            {settings.logo_horizontal ? (
              <div className="relative inline-block">
                <img
                  src={settings.logo_horizontal}
                  alt="Logo Horizontal"
                  className="max-h-20 object-contain bg-primary p-2 rounded"
                />
                <button
                  onClick={() => handleRemoveImage('logo_horizontal')}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload('logo_horizontal', e.target.files[0])}
                  className="hidden"
                  disabled={uploading === 'logo_horizontal'}
                />
                {uploading === 'logo_horizontal' ? (
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground mt-2">Clique para enviar</span>
                  </>
                )}
              </label>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Logo Vertical
            </CardTitle>
            <CardDescription>Logo usada no footer do site</CardDescription>
          </CardHeader>
          <CardContent>
            {settings.logo_vertical ? (
              <div className="relative inline-block">
                <img
                  src={settings.logo_vertical}
                  alt="Logo Vertical"
                  className="max-h-24 object-contain bg-primary p-2 rounded"
                />
                <button
                  onClick={() => handleRemoveImage('logo_vertical')}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload('logo_vertical', e.target.files[0])}
                  className="hidden"
                  disabled={uploading === 'logo_vertical'}
                />
                {uploading === 'logo_vertical' ? (
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground mt-2">Clique para enviar</span>
                  </>
                )}
              </label>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Arte Quem Somos
            </CardTitle>
            <CardDescription>Imagem/arte da seção "Quem Somos" (400x500px recomendado)</CardDescription>
          </CardHeader>
          <CardContent>
            {settings.about_image ? (
              <div className="relative inline-block">
                <img
                  src={settings.about_image}
                  alt="Arte Quem Somos"
                  className="max-h-40 object-cover rounded"
                />
                <button
                  onClick={() => handleRemoveImage('about_image')}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload('about_image', e.target.files[0])}
                  className="hidden"
                  disabled={uploading === 'about_image'}
                />
                {uploading === 'about_image' ? (
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground mt-2">Clique para enviar</span>
                  </>
                )}
              </label>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Background Hero
            </CardTitle>
            <CardDescription>Imagem de fundo da seção principal</CardDescription>
          </CardHeader>
          <CardContent>
            {settings.hero_background ? (
              <div className="relative inline-block">
                <img
                  src={settings.hero_background}
                  alt="Hero Background"
                  className="max-h-32 object-cover rounded"
                />
                <button
                  onClick={() => handleRemoveImage('hero_background')}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload('hero_background', e.target.files[0])}
                  className="hidden"
                  disabled={uploading === 'hero_background'}
                />
                {uploading === 'hero_background' ? (
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground mt-2">Clique para enviar</span>
                  </>
                )}
              </label>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Tags de Rastreamento
            </CardTitle>
            <CardDescription>
              IDs do Google Tag Manager e Google Analytics 4. Alterações entram em vigor no próximo carregamento da página.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gtm_id">Google Tag Manager (GTM)</Label>
                <Input
                  id="gtm_id"
                  value={gtmId}
                  onChange={(e) => setGtmId(e.target.value)}
                  placeholder="GTM-XXXXXXX"
                />
                <p className="text-xs text-muted-foreground">Formato: GTM-XXXXXXX</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ga4_id">Google Analytics 4 (GA4)</Label>
                <Input
                  id="ga4_id"
                  value={ga4Id}
                  onChange={(e) => setGa4Id(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="text-xs text-muted-foreground">Formato: G-XXXXXXXXXX</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_pixel_id">Meta Pixel (Facebook Ads)</Label>
                <Input
                  id="meta_pixel_id"
                  value={metaPixelId}
                  onChange={(e) => setMetaPixelId(e.target.value)}
                  placeholder="1234567890123456"
                />
                <p className="text-xs text-muted-foreground">ID numérico do Pixel (ex: 1234567890123456)</p>
              </div>
            </div>
            <Button
              onClick={handleSaveTags}
              disabled={saving}
              className="bg-primary hover:bg-primary-medium"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Tags'
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              WhatsApp
            </CardTitle>
            <CardDescription>Número de contato do WhatsApp</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp">Número (com código do país)</Label>
              <Input
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="5563992628916"
              />
            </div>
            <Button
              onClick={handleSaveWhatsapp}
              disabled={saving}
              className="bg-primary hover:bg-primary-medium"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
