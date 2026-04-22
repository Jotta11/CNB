import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import BackToTop from "@/components/BackToTop";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Database } from "@/integrations/supabase/types";

type Noticia = Database["public"]["Tables"]["noticias"]["Row"];

const News = () => {
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllNews = async () => {
            try {
                const { data, error } = await supabase
                    .from("noticias")
                    .select("*")
                    .lte("data_publicacao", new Date().toISOString())
                    .order("data_publicacao", { ascending: false });

                if (error) throw error;
                setNoticias(data || []);
            } catch (error) {
                console.error("Erro ao buscar notícias:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllNews();
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-cream">
            <Header />

            <main className="pt-40 pb-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-5xl md:text-7xl font-bebas text-primary mb-6 tracking-tighter uppercase">
                            NOTÍCIAS E <span className="text-primary-light">ARTIGOS</span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                            Mantenha-se informado sobre as tendências do mercado pecuário, novidades do setor e insights exclusivos da CNB.
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px]">
                            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                            <p className="text-muted-foreground font-medium">Carregando conteúdo...</p>
                        </div>
                    ) : noticias.length === 0 ? (
                        <div className="text-center py-24 bg-white/50 rounded-3xl border border-cream-dark border-dashed">
                            <p className="text-muted-foreground text-xl font-medium">Aguardando as próximas publicações.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {noticias.map((noticia) => (
                                <NewsCard key={noticia.id} noticia={noticia} />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
            <FloatingWhatsApp />
            <BackToTop />
        </div>
    );
};

export default News;
