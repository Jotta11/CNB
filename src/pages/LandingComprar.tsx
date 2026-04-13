import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LandingLayout from '@/components/landing/LandingLayout';
import { useLeadSubmit } from '@/hooks/useLeadSubmit';
import { trackFormInicio } from '@/utils/analytics';

const schema = z.object({
  nome: z.string().min(3, 'Informe seu nome completo'),
  telefone: z.string().min(10, 'Informe um telefone válido'),
  email: z.string().email('Informe um e-mail válido'),
  estado: z.string().min(1, 'Selecione seu estado'),
  categoria_gado: z.string().min(1, 'Selecione a categoria'),
  volume: z.string().min(1, 'Selecione o volume desejado'),
});

type FormData = z.infer<typeof schema>;

const estados = [
  'AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT',
  'PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO',
];

const categorias = [
  'Boi Gordo',
  'Vaca Gorda',
  'Novilha',
  'Garrote / Fraldinha',
  'Bezerro',
  'Bezerra',
  'Touro',
  'Vaca Parida',
  'Reprodutor',
  'Misto',
];

const volumes = [
  'Até 100 cabeças',
  '101 – 500 cabeças',
  '501 – 2.000 cabeças',
  '2.001 – 10.000 cabeças',
  'Acima de 10.000 cabeças',
];

const LandingComprar = () => {
  const { submitLead, isSubmitting, submitted } = useLeadSubmit();
  const formIniciadoRef = useRef(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await submitLead({
        tipo: 'comprar',
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        localizacao: data.estado,
        categoria_gado: data.categoria_gado,
        volume_rebanho: data.volume,
      });
    } catch {
      toast.error('Erro ao enviar. Tente novamente.');
    }
  };

  const handleFormStart = () => {
    if (formIniciadoRef.current) return;
    formIniciadoRef.current = true;
    trackFormInicio('comprar');
  };

  if (submitted) {
    return (
      <LandingLayout bgClass="bg-primary">
        <div className="text-center space-y-4 py-12">
          <CheckCircle2 className="w-16 h-16 mx-auto text-accent" />
          <h2 className="font-display text-4xl text-white tracking-wider">
            Cadastro Realizado!
          </h2>
          <p className="text-white/80 text-lg">
            Nossa equipe vai buscar os melhores lotes para o seu perfil e entrará em
            contato em breve. Bem-vindo à CNB!
          </p>
        </div>
      </LandingLayout>
    );
  }

  return (
    <LandingLayout bgClass="bg-primary">
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5">
            <ShoppingCart className="w-4 h-4 text-accent" />
            <span className="text-accent text-sm font-medium uppercase tracking-widest">
              Para Compradores
            </span>
          </div>
          <h1 className="font-display text-5xl text-white tracking-wider leading-tight">
            Compre Gado com
            <br />
            Segurança e Agilidade
          </h1>
          <p className="text-white/80 text-lg max-w-sm mx-auto">
            Acesse lotes selecionados e curados pela nossa equipe. Preencha o cadastro
            e receba ofertas alinhadas ao seu perfil de compra.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          onFocusCapture={handleFormStart}
          className="space-y-4 bg-white/10 border border-white/20 rounded-2xl p-6"
        >
          <div className="space-y-1.5">
            <Label htmlFor="nome" className="text-white">Nome completo</Label>
            <Input
              id="nome"
              placeholder="Seu nome completo"
              className="bg-white/90 border-white/30 placeholder:text-muted-foreground"
              {...register('nome')}
            />
            {errors.nome && (
              <p className="text-accent text-sm">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="telefone" className="text-white">Telefone / WhatsApp</Label>
            <Input
              id="telefone"
              placeholder="(00) 00000-0000"
              className="bg-white/90 border-white/30 placeholder:text-muted-foreground"
              {...register('telefone')}
            />
            {errors.telefone && (
              <p className="text-accent text-sm">{errors.telefone.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-white">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="bg-white/90 border-white/30 placeholder:text-muted-foreground"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-accent text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-white">Estado</Label>
            <Select onValueChange={(v) => setValue('estado', v)}>
              <SelectTrigger className="bg-white/90 border-white/30">
                <SelectValue placeholder="Selecione seu estado" />
              </SelectTrigger>
              <SelectContent>
                {estados.map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.estado && (
              <p className="text-accent text-sm">{errors.estado.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-white">Categoria de interesse</Label>
            <Select onValueChange={(v) => setValue('categoria_gado', v)}>
              <SelectTrigger className="bg-white/90 border-white/30">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoria_gado && (
              <p className="text-accent text-sm">{errors.categoria_gado.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-white">Volume desejado</Label>
            <Select onValueChange={(v) => setValue('volume', v)}>
              <SelectTrigger className="bg-white/90 border-white/30">
                <SelectValue placeholder="Selecione o volume" />
              </SelectTrigger>
              <SelectContent>
                {volumes.map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.volume && (
              <p className="text-accent text-sm">{errors.volume.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent hover:bg-accent/90 text-white font-bold text-lg py-6"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Quero Receber Ofertas'
            )}
          </Button>
        </form>

        <p className="text-center text-white/60 text-xs">
          Seus dados estão seguros. Não fazemos spam.
        </p>
      </div>
    </LandingLayout>
  );
};

export default LandingComprar;
