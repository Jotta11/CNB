import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Target, CheckCircle2 } from 'lucide-react';
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

const schema = z.object({
  nome: z.string().min(3, 'Informe seu nome completo'),
  telefone: z.string().min(10, 'Informe um telefone válido'),
  email: z.string().email('Informe um e-mail válido'),
  localizacao: z.string().min(2, 'Informe seu estado'),
  ciclo_produtivo: z.string().min(1, 'Selecione o ciclo produtivo'),
  volume_rebanho: z.string().min(1, 'Informe o volume aproximado'),
});

type FormData = z.infer<typeof schema>;

const ciclos = [
  'Cria',
  'Recria',
  'Engorda',
  'Cria e Recria',
  'Ciclo Completo',
];

const volumes = [
  'Até 100 cabeças',
  '101 a 500 cabeças',
  '501 a 2.000 cabeças',
  '2.001 a 10.000 cabeças',
  'Acima de 10.000 cabeças',
];

const LandingOfertas = () => {
  const { submitLead, isSubmitting, submitted } = useLeadSubmit();
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
      await submitLead({ tipo: 'ofertas_direcionadas', ...data });
    } catch {
      toast.error('Erro ao enviar. Tente novamente.');
    }
  };

  if (submitted) {
    return (
      <LandingLayout bgClass="bg-secondary">
        <div className="text-center text-white space-y-4 py-12">
          <CheckCircle2 className="w-16 h-16 mx-auto text-accent" />
          <h2 className="font-display text-4xl tracking-wider">Cadastro Realizado!</h2>
          <p className="text-white/80 text-lg">
            Nossa equipe vai analisar seu perfil e te enviar ofertas alinhadas com a sua
            operação. Em breve entraremos em contato!
          </p>
        </div>
      </LandingLayout>
    );
  }

  return (
    <LandingLayout bgClass="bg-secondary">
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 rounded-full px-4 py-1.5">
            <Target className="w-4 h-4 text-accent" />
            <span className="text-accent text-sm font-medium uppercase tracking-widest">
              Para Compradores
            </span>
          </div>
          <h1 className="font-display text-5xl text-white tracking-wider leading-tight">
            Receba Ofertas
            <br />
            Feitas para Você
          </h1>
          <p className="text-white/75 text-lg max-w-sm mx-auto">
            Diga o que você busca e nós garimparemos os melhores lotes bovinos do mercado
            de acordo com o seu perfil e operação.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nome" className="text-white/90">
              Nome completo
            </Label>
            <Input
              id="nome"
              placeholder="Seu nome completo"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-accent"
              {...register('nome')}
            />
            {errors.nome && <p className="text-accent text-sm">{errors.nome.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="telefone" className="text-white/90">
              Telefone / WhatsApp
            </Label>
            <Input
              id="telefone"
              placeholder="(00) 00000-0000"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-accent"
              {...register('telefone')}
            />
            {errors.telefone && (
              <p className="text-accent text-sm">{errors.telefone.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-white/90">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-accent"
              {...register('email')}
            />
            {errors.email && <p className="text-accent text-sm">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="localizacao" className="text-white/90">
              Estado
            </Label>
            <Input
              id="localizacao"
              placeholder="Ex: Mato Grosso"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-accent"
              {...register('localizacao')}
            />
            {errors.localizacao && (
              <p className="text-accent text-sm">{errors.localizacao.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/90">Ciclo produtivo</Label>
            <Select onValueChange={(v) => setValue('ciclo_produtivo', v)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-accent">
                <SelectValue placeholder="Selecione o ciclo" />
              </SelectTrigger>
              <SelectContent>
                {ciclos.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ciclo_produtivo && (
              <p className="text-accent text-sm">{errors.ciclo_produtivo.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/90">Volume anual de rebanho</Label>
            <Select onValueChange={(v) => setValue('volume_rebanho', v)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-accent">
                <SelectValue placeholder="Selecione o volume" />
              </SelectTrigger>
              <SelectContent>
                {volumes.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.volume_rebanho && (
              <p className="text-accent text-sm">{errors.volume_rebanho.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent hover:bg-accent/90 text-white font-bold text-lg py-6 mt-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Quero Receber Ofertas'
            )}
          </Button>
        </form>

        <p className="text-center text-white/40 text-xs">
          Seus dados estão seguros. Nossa equipe entrará em contato em breve.
        </p>
      </div>
    </LandingLayout>
  );
};

export default LandingOfertas;
