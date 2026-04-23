import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Loader2, Image as ImageIcon, Calendar, User, Newspaper, Upload, X, Clock } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';

type Noticia = Database["public"]["Tables"]["noticias"]["Row"];
type NoticiaInsert = Database["public"]["Tables"]["noticias"]["Insert"];

const AdminNews = () => {
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNews, setEditingNews] = useState<Noticia | null>(null);
    const [imageUploading, setImageUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<Partial<NoticiaInsert>>({
        titulo: '',
        slug: '',
        conteudo: '',
        resumo: '',
        imagem_url: '',
        autor: '',
        data_publicacao: new Date().toISOString()
    });

    const fetchNews = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('noticias')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNoticias(data || []);
        } catch (error) {
            toast.error('Erro ao buscar notícias');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleOpenCreate = () => {
        setEditingNews(null);
        setFormData({
            titulo: '',
            slug: '',
            conteudo: '',
            resumo: '',
            imagem_url: '',
            autor: '',
            data_publicacao: new Date().toISOString()
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (noticia: Noticia) => {
        setEditingNews(noticia);
        setFormData({
            titulo: noticia.titulo,
            slug: noticia.slug,
            conteudo: noticia.conteudo,
            resumo: noticia.resumo || '',
            imagem_url: noticia.imagem_url || '',
            autor: noticia.autor || '',
            data_publicacao: noticia.data_publicacao
        });
        setIsModalOpen(true);
    };

    const handleImageUpload = async (file: File) => {
        if (!file) return;
        const ext = file.name.split('.').pop();
        const fileName = `${Date.now()}.${ext}`;
        try {
            setImageUploading(true);
            const { error } = await supabase.storage
                .from('noticias')
                .upload(fileName, file);
            if (error) throw error;
            const { data: urlData } = supabase.storage.from('noticias').getPublicUrl(fileName);
            setFormData(prev => ({ ...prev, imagem_url: urlData.publicUrl }));
            toast.success('Imagem enviada!');
        } catch (err: any) {
            console.error('Upload error:', err);
            toast.error(`Erro: ${err?.message || err?.error || JSON.stringify(err)}`);
        } finally {
            setImageUploading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.titulo || !formData.conteudo) {
            toast.error('Preencha os campos obrigatórios');
            return;
        }

        const slug = formData.slug || formData.titulo.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
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
                toast.success('Notícia publicada');
            }
            setIsModalOpen(false);
            fetchNews();
        } catch (error) {
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
            fetchNews();
        } catch (error) {
            toast.error('Erro ao excluir');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bebas text-primary tracking-tight uppercase">Gestão de Notícias</h2>
                    <p className="text-muted-foreground">Publique dicas e novidades para os usuários</p>
                </div>
                <Button onClick={handleOpenCreate} className="bg-primary hover:bg-primary-medium font-bold">
                    <Plus className="w-4 h-4 mr-2" />
                    PUBLICAR NOTÍCIA
                </Button>
            </div>

            <div className="grid gap-3">
                {noticias.length === 0 ? (
                    <Card className="bg-cream/50 border-dashed"><CardContent className="py-12 text-center text-muted-foreground">Nenhuma matéria publicada.</CardContent></Card>
                ) : (
                    noticias.map((n) => (
                        <Card key={n.id} className="border-cream-dark shadow-sm">
                            <CardHeader className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-cream rounded-lg border border-cream-dark flex items-center justify-center overflow-hidden">
                                            {n.imagem_url ? <img src={n.imagem_url} className="w-full h-full object-cover" /> : <Newspaper className="w-5 h-5 text-primary opacity-20" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-lg font-bebas text-primary uppercase tracking-wide">{n.titulo}</CardTitle>
                                                {new Date(n.data_publicacao) > new Date() && (
                                                    <span className="flex items-center gap-1 text-[9px] font-bold uppercase bg-amber-100 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5">
                                                        <Clock className="w-2.5 h-2.5" />Agendada
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-3 text-[10px] font-bold text-muted-foreground uppercase opacity-70">
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(n.data_publicacao), 'dd/MM/yy HH:mm')}</span>
                                                <span className="flex items-center gap-1"><User className="w-3 h-3" />{n.autor || 'CNB'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(n)}><Edit className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(n.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))
                )}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-cream border-2 border-primary">
                    <DialogHeader><DialogTitle className="font-bebas text-2xl text-primary tracking-wider">{editingNews ? 'EDITAR MATÉRIA' : 'NOVA MATÉRIA'}</DialogTitle></DialogHeader>
                    <div className="grid gap-5 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1"><Label className="text-[10px] uppercase font-bold text-primary">Título *</Label><Input className="border-cream-dark" value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} /></div>
                            <div className="space-y-1"><Label className="text-[10px] uppercase font-bold text-primary">Link Amigável (Slug)</Label><Input className="border-cream-dark" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="vazio para auto-gerar" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1"><Label className="text-[10px] uppercase font-bold text-primary">Autor</Label><Input className="border-cream-dark" value={formData.autor || ''} onChange={(e) => setFormData({ ...formData, autor: e.target.value })} /></div>
                            <div className="space-y-1"><Label className="text-[10px] uppercase font-bold text-primary">Data Publicação</Label><Input type="datetime-local" className="border-cream-dark" value={formData.data_publicacao?.substring(0, 16)} onChange={(e) => setFormData({ ...formData, data_publicacao: new Date(e.target.value).toISOString() })} /></div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-primary">Imagem de Capa</Label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }}
                            />
                            {formData.imagem_url ? (
                                <div className="relative w-full h-40 rounded-lg overflow-hidden border border-cream-dark">
                                    <img src={formData.imagem_url} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, imagem_url: '' }))}
                                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={imageUploading}
                                    className="w-full h-32 border-2 border-dashed border-cream-dark rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                                >
                                    {imageUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                                    <span className="text-xs font-bold uppercase">{imageUploading ? 'Enviando...' : 'Clique para selecionar imagem'}</span>
                                </button>
                            )}
                            {formData.imagem_url && (
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs text-primary underline">Trocar imagem</button>
                            )}
                        </div>
                        <div className="space-y-1"><Label className="text-[10px] uppercase font-bold text-primary">Resumo Curto (Lead)</Label><Textarea className="border-cream-dark h-20" value={formData.resumo || ''} onChange={(e) => setFormData({ ...formData, resumo: e.target.value })} /></div>
                        <div className="space-y-1"><Label className="text-[10px] uppercase font-bold text-primary">Texto Completo *</Label><Textarea className="border-cream-dark h-60" value={formData.conteudo || ''} onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })} /></div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>CANCELAR</Button>
                        <Button className="bg-primary hover:bg-primary-medium px-8 font-bold" onClick={handleSave}>
                            {actionLoading === 'save'
                                ? <Loader2 className="animate-spin" />
                                : formData.data_publicacao && new Date(formData.data_publicacao) > new Date()
                                    ? <span className="flex items-center gap-2"><Clock className="w-4 h-4" />AGENDAR PUBLICAÇÃO</span>
                                    : 'SALVAR E PUBLICAR'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminNews;
