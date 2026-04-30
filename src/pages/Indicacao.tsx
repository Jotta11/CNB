import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Search, Send, ClipboardList } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import BackToTop from '@/components/BackToTop';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import logoSymbol from '@/assets/logo-symbol.svg';
import {
  FLUXOS, URGENCIAS, CATEGORIAS, RACAS, UFS,
} from '@/data/parceiros-constants';
import type { Fluxo, Urgencia, Categoria, Raca, Uf } from '@/data/parceiros-constants';

const db = supabase as any;

interface FormState {
  cupom: string;
  cliente_nome: string;
  cliente_telefone: string;
  cliente_municipio: string;
  cliente_uf: Uf | '';
  fluxo: Fluxo;
  urgencia: Urgencia;
  categoria: Categoria;
  raca: Raca;
  num_cabecas: string;
  peso_atual: string;
  observacoes: string;
}

const empty: FormState = {
  cupom: '',
  cliente_nome: '',
  cliente_telefone: '',
  cliente_municipio: '',
  cliente_uf: '',
  fluxo: 'Demanda',
  urgencia: 'Imediata',
  categoria: 'Bezerro',
  raca: 'Nelore',
  num_cabecas: '',
  peso_atual: '',
  observacoes: '',
};

const labelCls = 'text-foreground/80 text-sm font-medium';

const Indicacao = () => {
  const [form, setForm] = useState<FormState>(empty);
  const [parceiroId, setParceiroId] = useState<string | null>(null);
  const [parceiroNome, setParceiroNome] = useState<string | null>(null);
  const [cupomStatus, setCupomStatus] = useState<'idle' | 'loading' | 'found' | 'not_found'>('idle');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const lookupCupom = async (cupom: string) => {
    const trimmed = cupom.trim();
    if (!trimmed) return;
    setCupomStatus('loading');
    setParceiroId(null);
    setParceiroNome(null);
    const { data } = await db
      .from('parceiros')
      .select('id, nome_completo')
      .ilike('nome_completo', `%${trimmed}%`)
      .limit(1);
    if (data && data.length > 0) {
      setParceiroId(data[0].id);
      setParceiroNome(data[0].nome_completo);
      setCupomStatus('found');
    } else {
      setCupomStatus('not_found');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cliente_nome || !form.num_cabecas) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }
    if (!parceiroId) {
      toast.error('Cupom inválido. Verifique com seu consultor CNB.');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await db.from('indicacoes').insert({
        parceiro_id: parceiroId,
        cliente_nome: form.cliente_nome,
        cliente_telefone: form.cliente_telefone || null,
        cliente_municipio: form.cliente_municipio || null,
        cliente_uf: form.cliente_uf || null,
        fluxo: form.fluxo,
        urgencia: form.urgencia,
        categoria: form.categoria,
        raca: form.raca,
        num_cabecas: Number(form.num_cabecas),
        peso_atual: form.peso_atual ? Number(form.peso_atual) : null,
        observacoes_ia: form.observacoes || null,
        cupom_utilizado: form.cupom.trim(),
        status: 'em_validacao',
        origem: 'link_parceiro',
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message ?? 'Erro ao enviar. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Header />

      <section className="min-h-screen flex items-center relative overflow-hidden py-24">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary/80 to-primary" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-light/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />
        <div className="absolute bottom-10 right-10 opacity-[0.03]">
          <img src={logoSymbol} alt="" className="w-[400px] h-[400px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">

            {/* Left — header copy */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:sticky lg:top-32"
            >
              <span className="inline-flex items-center gap-2 bg-accent/20 text-accent border border-accent/30 text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-widest uppercase backdrop-blur-sm">
                <ClipboardList className="w-3.5 h-3.5" />
                Parceiros CNB
              </span>
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-white tracking-wider leading-[0.9] mb-6">
                CADASTRE SUA
                <br />
                <span className="text-accent">INDICAÇÃO</span>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed max-w-md">
                Registre uma oportunidade de compra ou venda de gado. Nossa equipe entra em contato e cuida de toda a operação.
              </p>
            </motion.div>

            {/* Right — form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {submitted ? (
                <div className="bg-white rounded-3xl p-12 border border-border text-center shadow-xl">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="font-display text-4xl text-primary tracking-wide mb-3">INDICAÇÃO ENVIADA!</h2>
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    Recebemos sua indicação. Nossa equipe vai analisar e entrar em contato em breve.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => { setForm(empty); setSubmitted(false); setParceiroId(null); setParceiroNome(null); setCupomStatus('idle'); }}
                  >
                    Nova Indicação
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-3xl p-8 md:p-10 border border-border shadow-xl space-y-5"
                >
                  {/* Cupom */}
                  <div className="space-y-2">
                    <Label className={labelCls}>Seu Cupom *</Label>
                    <div className="relative">
                      <Input
                        placeholder="Digite seu sobrenome / cupom"
                        value={form.cupom}
                        onChange={(e) => { set('cupom', e.target.value); setCupomStatus('idle'); setParceiroId(null); setParceiroNome(null); }}
                        onBlur={() => lookupCupom(form.cupom)}
                        className="pr-10"
                        required
                      />
                      {cupomStatus === 'loading' && (
                        <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-white/40" />
                      )}
                      {cupomStatus === 'found' && (
                        <CheckCircle2 className="absolute right-3 top-3 w-4 h-4 text-accent" />
                      )}
                      {cupomStatus === 'not_found' && (
                        <Search className="absolute right-3 top-3 w-4 h-4 text-destructive" />
                      )}
                    </div>
                    {cupomStatus === 'found' && parceiroNome && (
                      <p className="text-xs text-accent font-medium">Parceiro: {parceiroNome}</p>
                    )}
                    {cupomStatus === 'not_found' && (
                      <p className="text-xs text-destructive/80">Cupom não encontrado. Verifique com seu consultor CNB.</p>
                    )}
                  </div>

                  <div className="border-t border-border" />

                  {/* Cliente */}
                  <div className="space-y-2">
                    <Label className={labelCls}>Nome do Cliente *</Label>
                    <Input
                      value={form.cliente_nome}
                      onChange={(e) => set('cliente_nome', e.target.value)}
                      placeholder="Nome completo"
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className={labelCls}>Telefone do Cliente</Label>
                    <Input
                      placeholder="(00) 00000-0000"
                      value={form.cliente_telefone}
                      onChange={(e) => set('cliente_telefone', e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className={labelCls}>Município</Label>
                      <Input
                        value={form.cliente_municipio}
                        onChange={(e) => set('cliente_municipio', e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className={labelCls}>UF</Label>
                      <Select value={form.cliente_uf} onValueChange={(v) => set('cliente_uf', v)}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="UF" />
                        </SelectTrigger>
                        <SelectContent>
                          {UFS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="border-t border-border" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className={labelCls}>Fluxo *</Label>
                      <Select value={form.fluxo} onValueChange={(v) => set('fluxo', v)}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FLUXOS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className={labelCls}>Urgência *</Label>
                      <Select value={form.urgencia} onValueChange={(v) => set('urgencia', v)}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {URGENCIAS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className={labelCls}>Categoria *</Label>
                      <Select value={form.categoria} onValueChange={(v) => set('categoria', v)}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIAS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className={labelCls}>Raça *</Label>
                      <Select value={form.raca} onValueChange={(v) => set('raca', v)}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RACAS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className={labelCls}>Nº de Cabeças *</Label>
                      <Input
                        type="number"
                        min={1}
                        value={form.num_cabecas}
                        onChange={(e) => set('num_cabecas', e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className={labelCls}>Peso Atual (kg)</Label>
                      <Input
                        type="number"
                        value={form.peso_atual}
                        onChange={(e) => set('peso_atual', e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className={labelCls}>Observações</Label>
                    <Textarea
                      rows={3}
                      value={form.observacoes}
                      onChange={(e) => set('observacoes', e.target.value)}
                      className="resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting || !parceiroId}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base h-14 shadow-lg shadow-accent/20 border-0"
                  >
                    {submitting ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> ENVIANDO...</>
                    ) : (
                      <><Send className="w-5 h-5 mr-2" /> ENVIAR INDICAÇÃO</>
                    )}
                  </Button>

                  {!parceiroId && form.cupom.trim() && cupomStatus === 'not_found' && (
                    <p className="text-xs text-center text-muted-foreground">
                      Confirme seu cupom para habilitar o envio.
                    </p>
                  )}
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
    </div>
  );
};

export default Indicacao;
