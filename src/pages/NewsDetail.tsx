import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, Calendar, User, Share2, Lock, Phone, Mail, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Noticia = Database["public"]["Tables"]["noticias"]["Row"];

const NewsDetail = () => {
    const { slug } = useParams();
    const [noticia, setNoticia] = useState<Noticia | null>(null);
    const [loading, setLoading] = useState(true);
    const [leitorLiberado, setLeitorLiberado] = useState(false);
    const [leitorForm, setLeitorForm] = useState({ nome: '', email: '', telefone: '', area_atuacao: '' });
    const [leitorLoading, setLeitorLoading] = useState(false);

    useEffect(() => {
        const salvo = localStorage.getItem('cnb_leitor');
        if (salvo) {
            setLeitorLiberado(true);
        }
    }, []);

    const handleLeitorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!leitorForm.nome || !leitorForm.email || !leitorForm.telefone || !leitorForm.area_atuacao) return;
        setLeitorLoading(true);
        try {
            const { error: insertError } = await supabase.from('leitores').insert({
                nome: leitorForm.nome,
                email: leitorForm.email,
                telefone: leitorForm.telefone,
                area_atuacao: leitorForm.area_atuacao,
            });
            if (insertError) console.error('[leitor] Erro ao salvar leitor:', insertError);
            localStorage.setItem('cnb_leitor', JSON.stringify({ nome: leitorForm.nome, email: leitorForm.email }));
            setLeitorLiberado(true);
        } catch {
            localStorage.setItem('cnb_leitor', JSON.stringify({ nome: leitorForm.nome, email: leitorForm.email }));
            setLeitorLiberado(true);
        } finally {
            setLeitorLoading(false);
        }
    };

    useEffect(() => {
        const fetchNewsDetail = async () => {
            if (!slug) return;

            try {
                const { data, error } = await supabase
                    .from("noticias")
                    .select("*")
                    .eq("slug", slug)
                    .single();

                if (error) throw error;
                setNoticia(data);
            } catch (error) {
                console.error("Erro ao buscar detalhe da notícia:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNewsDetail();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-cream">
                <Header />
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground font-medium tracking-wide">BUSCANDO MATÉRIA...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!noticia) {
        return (
            <div className="min-h-screen bg-cream">
                <Header />
                <div className="container mx-auto px-4 pt-40 pb-24 text-center">
                    <h1 className="text-4xl md:text-5xl font-bebas text-primary mb-8 tracking-wide">CONTEÚDO NÃO LOCALIZADO</h1>
                    <Button asChild className="font-bold">
                        <Link to="/noticias">VOLTAR PARA TODAS AS NOTÍCIAS</Link>
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: noticia.titulo,
                text: noticia.resumo || '',
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link de acesso copiado!");
        }
    };

    return (
        <div className="min-h-screen bg-cream">
            <Header />

            <main className="pt-40 pb-24">
                <article className="container mx-auto px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Link
                            to="/noticias"
                            className="inline-flex items-center gap-2 text-primary font-bold text-sm mb-12 hover:text-primary-light transition-colors group tracking-widest"
                        >
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            VOLTAR PARA O BLOG
                        </Link>

                        <h1 className="text-4xl md:text-7xl font-bebas text-primary mb-8 leading-[1] tracking-tighter uppercase">
                            {noticia.titulo}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 mb-12 py-6 border-y border-cream-dark text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary-light opacity-60" />
                                {format(new Date(noticia.data_publicacao), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-primary-light opacity-60" />
                                {noticia.autor || "Redação CNB"}
                            </div>
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 hover:text-primary transition-colors ml-auto group"
                            >
                                <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Compartilhar
                            </button>
                        </div>

                        {noticia.imagem_url && (
                            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl mb-16 border-[12px] border-white ring-1 ring-black/5">
                                <img
                                    src={noticia.imagem_url}
                                    alt={noticia.titulo}
                                    className="w-full h-auto object-cover max-h-[600px]"
                                />
                            </div>
                        )}

                        {/* Conteúdo do artigo */}
                        {leitorLiberado ? (
                          <div
                            className="prose prose-lg prose-stone max-w-none text-muted-foreground leading-relaxed text-lg"
                            style={{ whiteSpace: 'pre-wrap' }}
                          >
                            {noticia.conteudo}
                          </div>
                        ) : (
                          <div className="relative">
                            {/* Primeira metade — visível */}
                            <div
                              className="prose prose-lg prose-stone max-w-none text-muted-foreground leading-relaxed text-lg"
                              style={{ whiteSpace: 'pre-wrap' }}
                            >
                              {noticia.conteudo.slice(0, Math.floor(noticia.conteudo.length / 2))}
                            </div>

                            {/* Segunda metade — embaçada */}
                            <div className="relative mt-0 overflow-hidden">
                              <div
                                className="prose prose-lg prose-stone max-w-none text-muted-foreground leading-relaxed text-lg blur-sm select-none pointer-events-none"
                                style={{ whiteSpace: 'pre-wrap' }}
                                aria-hidden="true"
                              >
                                {noticia.conteudo.slice(Math.floor(noticia.conteudo.length / 2))}
                              </div>

                              {/* Gradiente de fade */}
                              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cream to-transparent pointer-events-none" />

                              {/* Formulário de leitor sobreposto */}
                              <div className="absolute inset-0 flex items-center justify-center px-4">
                                <motion.div
                                  initial={{ opacity: 0, y: 16 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.5, delay: 0.2 }}
                                  className="bg-primary rounded-3xl px-6 py-8 shadow-2xl shadow-primary/30 w-full max-w-md"
                                >
                                  <div className="flex flex-col items-center gap-2 mb-6 text-center">
                                    <Lock className="w-7 h-7 text-accent" />
                                    <p className="font-display text-2xl md:text-3xl text-white tracking-wide leading-none">
                                      QUER LER A MATÉRIA COMPLETA?
                                    </p>
                                    <p className="text-white/70 text-xs">
                                      Acesso gratuito — preencha seus dados uma única vez.
                                    </p>
                                  </div>

                                  <form onSubmit={handleLeitorSubmit} className="space-y-3">
                                    <div className="relative">
                                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                      <input
                                        type="text"
                                        placeholder="Nome completo *"
                                        value={leitorForm.nome}
                                        onChange={(e) => setLeitorForm(prev => ({ ...prev, nome: e.target.value }))}
                                        className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 text-sm focus:outline-none focus:border-accent focus:bg-white/15"
                                        required
                                      />
                                    </div>

                                    <div className="relative">
                                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                      <input
                                        type="email"
                                        placeholder="E-mail *"
                                        value={leitorForm.email}
                                        onChange={(e) => setLeitorForm(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 text-sm focus:outline-none focus:border-accent focus:bg-white/15"
                                        required
                                      />
                                    </div>

                                    <div className="relative">
                                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                      <input
                                        type="tel"
                                        placeholder="Telefone / WhatsApp *"
                                        value={leitorForm.telefone}
                                        onChange={(e) => setLeitorForm(prev => ({ ...prev, telefone: e.target.value }))}
                                        className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 text-sm focus:outline-none focus:border-accent focus:bg-white/15"
                                        required
                                      />
                                    </div>

                                    <div className="relative">
                                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                                      <select
                                        value={leitorForm.area_atuacao}
                                        onChange={(e) => setLeitorForm(prev => ({ ...prev, area_atuacao: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-sm focus:outline-none focus:border-accent appearance-none cursor-pointer text-white"
                                        required
                                      >
                                        <option value="" disabled className="text-gray-800">Área de atuação *</option>
                                        <option value="pecuaria_corte" className="text-gray-800">Pecuária de corte</option>
                                        <option value="pecuaria_leite" className="text-gray-800">Pecuária de leite</option>
                                        <option value="agricultura" className="text-gray-800">Agricultura</option>
                                        <option value="integracao_lavoura" className="text-gray-800">Integração lavoura-pecuária</option>
                                        <option value="consultor_tecnico" className="text-gray-800">Consultor / Técnico</option>
                                        <option value="investidor" className="text-gray-800">Investidor</option>
                                      </select>
                                    </div>

                                    <Button
                                      type="submit"
                                      disabled={leitorLoading}
                                      className="w-full h-11 bg-accent hover:bg-accent/90 text-white font-bold shadow-lg shadow-accent/30 mt-1"
                                    >
                                      {leitorLoading
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : 'LER ARTIGO COMPLETO'}
                                    </Button>
                                  </form>
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-20 pt-16 border-t border-cream-dark flex flex-col items-center bg-white/30 rounded-[3rem] p-12 shadow-sm">
                            <p className="font-bebas text-3xl text-primary mb-8 tracking-wide">INTERESSADO NESTE TEMA?</p>
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <Button size="lg" onClick={handleShare} variant="outline" className="gap-2 border-primary text-primary font-bold px-8 h-14">
                                    <Share2 className="w-4 h-4" />
                                    COMPARTILHAR ESTE ARTIGO
                                </Button>
                                <Button size="lg" asChild className="font-bold px-10 h-14 shadow-lg shadow-primary/20">
                                    <Link to="/noticias">EXPLORAR MAIS CONTEÚDOS</Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </article>
            </main>

            <Footer />
            <FloatingWhatsApp />
            <BackToTop />
        </div>
    );
};

export default NewsDetail;
