import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Database } from "@/integrations/supabase/types";
import { trackNoticiaClick } from "@/utils/analytics";

type Noticia = Database["public"]["Tables"]["noticias"]["Row"];

interface NewsCardProps {
    noticia: Noticia;
}

const NewsCard = ({ noticia }: NewsCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-cream-dark group"
        >
            <div className="aspect-[16/9] overflow-hidden bg-cream relative">
                {noticia.imagem_url ? (
                    <img
                        src={noticia.imagem_url}
                        alt={noticia.titulo}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center p-8 opacity-20">
                        <span className="font-bebas text-4xl text-primary font-bold">CNB</span>
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <span className="bg-primary/90 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                        Novidades
                    </span>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 font-medium">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(noticia.data_publicacao), "dd 'de' MMM, yyyy", { locale: ptBR })}
                    </div>
                    <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {noticia.autor || "Redação CNB"}
                    </div>
                </div>

                <h3 className="text-xl font-bebas text-primary mb-3 line-clamp-2 leading-tight group-hover:text-primary-light transition-colors uppercase tracking-wide">
                    <Link
                        to={`/noticias/${noticia.slug}`}
                        onClick={() => trackNoticiaClick({ noticia_slug: noticia.slug, noticia_titulo: noticia.titulo, acao: 'titulo' })}
                    >
                        {noticia.titulo}
                    </Link>
                </h3>

                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 leading-relaxed">
                    {noticia.resumo || noticia.conteudo.substring(0, 150) + "..."}
                </p>

                <Link
                    to={`/noticias/${noticia.slug}`}
                    onClick={() => trackNoticiaClick({ noticia_slug: noticia.slug, noticia_titulo: noticia.titulo, acao: 'ler_materia' })}
                    className="inline-flex items-center gap-2 text-primary font-bold text-xs group/link hover:text-primary-light transition-colors tracking-widest"
                >
                    LER MATÉRIA COMPLETA
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
            </div>
        </motion.div>
    );
};

export default NewsCard;
