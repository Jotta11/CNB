import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, TrendingUp, CheckCircle2 } from 'lucide-react';
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
  area_atuacao: z.string().min(1, 'Selecione sua área de atuação'),
});

type FormData = z.infer<typeof schema>;

const areasAtuacao = [
  'Pecuarista / Produtor Rural',
  'Trader / Revendedor',
  'Frigorífico',
  'Investidor',
  'Consultor / Técnico',
  'Outro',
];

const LandingPrecos = () => {
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
      await submitLead({ tipo: 'tabela_precos', ...data });
    } catch {
      toast.error('Erro ao enviar. Tente novamente.');
    }
  };

  if (submitted) {
    return (
      <LandingLayout bgClass="bg-primary">
        <div className="text-center text-white space-y-4 py-12">
          <CheckCircle2 className="w-16 h-16 mx-auto text-accent" />
          <h2 className="font-display text-4xl tracking-wider">Cadastro Confirmado!</h2>
          <p className="text-white/80 text-lg">
            Você receberá a tabela semanal de preços diretamente no seu e-mail.
            Bem-vindo à CNB!
          </p>
        </div>
      </LandingLayout>
    );
  }

  return (
    <LandingLayout bgClass="bg-primary">
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 rounded-full px-4 py-1.5">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-accent text-sm font-medium uppercase tracking-widest">
              Gratuito
            </span>
          </div>
          <h1 className="font-display text-5xl text-white tracking-wider leading-tight">
            Tabela Semanal
            <br />
            de Preços do Boi
          </h1>
          <p className="text-white/75 text-lg max-w-sm mx-auto">
            Receba toda semana os preços atualizados do mercado bovino diretamente no seu
            e-mail. Sem custo, sem compromisso.
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
            <Label className="text-white/90">Área de atuação</Label>
            <Select onValueChange={(v) => setValue('area_atuacao', v)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-accent">
                <SelectValue placeholder="Selecione sua área" />
              </SelectTrigger>
              <SelectContent>
                {areasAtuacao.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.area_atuacao && (
              <p className="text-accent text-sm">{errors.area_atuacao.message}</p>
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
              'Quero Receber a Tabela'
            )}
          </Button>
        </form>

        <p className="text-center text-white/40 text-xs">
          Seus dados estão seguros. Não enviamos spam.
        </p>
      </div>
    </LandingLayout>
  );
};

export default LandingPrecos;
