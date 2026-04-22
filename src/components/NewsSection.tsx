import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import NewsCard from "./NewsCard";
import { Button } from "./ui/button";
import { Database } from "@/integrations/supabase/types";

type Noticia = Database["public"]["Tables"]["noticias"]["Row"];

const NewsSection = () => {
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestNews = async () => {
            try {
                const { data, error } = await supabase
                    .from("noticias")
                    .select("*")
                    .lte("data_publicacao", new Date().toISOString())
                    .order("data_publicacao", { ascending: false })
                    .limit(4);

                if (error) throw error;
                setNoticias(data || []);
            } catch (error) {
                console.error("Erro ao buscar notícias:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestNews();
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-cream">
                <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[300px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground font-medium">Carregando novidades...</p>
                </div>
            </section>
        );
    }

    if (noticias.length === 0) return null;

    return (
        <section className="py-24 bg-cream overflow-hidden border-t border-cream-dark">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <h2 className="text-4xl md:text-6xl font-bebas text-primary mb-4 tracking-tighter uppercase">
                            NOTÍCIAS E <span className="text-primary-light">ARTIGOS</span>
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Fique por dentro das novidades do agronegócio, dicas exclusivas da CNB e tendências do mercado pecuário.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Button variant="outline" size="lg" asChild className="border-primary text-primary hover:bg-primary hover:text-white transition-all group font-bold font-bebas text-xl tracking-wide">
                            <Link to="/noticias" className="flex items-center gap-2">
                                VER TODAS AS NOTÍCIAS
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {noticias.map((noticia) => (
                        <NewsCard key={noticia.id} noticia={noticia} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewsSection;
