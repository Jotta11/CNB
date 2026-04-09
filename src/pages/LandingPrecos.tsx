import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, TrendingUp, CheckCircle2, Lock } from 'lucide-react';
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
import logoHorizontal from '@/assets/logo-horizontal2.png';
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

const tableImg = '/WhatsApp Image 2026-03-31 at 15.21.17.jpeg';

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
      <div className="min-h-screen bg-background flex flex-col">
        <header className="py-6 px-4 flex justify-center">
          <img src={logoHorizontal} alt="CNB - Conexão Norte Bovino" className="h-12 object-contain" />
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-8 text-center w-full max-w-2xl mx-auto">
          <CheckCircle2 className="w-16 h-16 text-primary" />
          <h2 className="font-display text-4xl tracking-wider text-primary">Cadastro Confirmado!</h2>
          <p className="text-foreground/70 text-lg">
            Você receberá a tabela semanal de preços diretamente no seu e-mail.
            Bem-vindo à CNB!
          </p>
          <img
            src={tableImg}
            alt="Tabela de Preços CNB"
            className="w-full max-w-sm rounded-xl shadow-2xl"
          />
        </main>
        <footer className="py-4 text-center text-xs text-foreground/30 px-4">
          © {new Date().getFullYear()} Conexão Norte Bovino — Todos os direitos reservados
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="py-6 px-4 flex justify-center">
        <img src={logoHorizontal} alt="CNB - Conexão Norte Bovino" className="h-12 object-contain" />
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Painel esquerdo — imagem esmaecida */}
          <div className="relative rounded-2xl overflow-hidden min-h-[340px] lg:min-h-[520px] flex items-center justify-center">
            <img
              src={tableImg}
              alt="Tabela de Preços CNB"
              className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="relative z-10 flex flex-col items-center text-center px-6 space-y-4">
              <Lock className="w-10 h-10 text-accent" />
              <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 rounded-full px-4 py-1.5">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-accent text-sm font-medium uppercase tracking-widest">
                  Atualizada semanalmente
                </span>
              </div>
              <h2 className="font-display text-4xl lg:text-5xl text-white tracking-wider leading-tight">
                Tabela de Preços<br />do Boi
              </h2>
              <p className="text-white/75 text-base max-w-xs">
                Cadastre-se gratuitamente para receber os valores desta semana no seu e-mail.
              </p>
            </div>
          </div>

          {/* Painel direito — formulário em card verde */}
          <div className="bg-primary rounded-2xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 rounded-full px-4 py-1.5">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-accent text-sm font-medium uppercase tracking-widest">Gratuito</span>
              </div>
              <h1 className="font-display text-4xl text-white tracking-wider leading-tight">
                Receba a Tabela<br />toda semana
              </h1>
              <p className="text-white/75 text-base max-w-sm mx-auto">
                Sem custo, sem compromisso. Preços atualizados do mercado bovino direto no seu e-mail.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="nome" className="text-white/90">Nome completo</Label>
                <Input
                  id="nome"
                  placeholder="Seu nome completo"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-accent"
                  {...register('nome')}
                />
                {errors.nome && <p className="text-accent text-sm">{errors.nome.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="telefone" className="text-white/90">Telefone / WhatsApp</Label>
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-accent"
                  {...register('telefone')}
                />
                {errors.telefone && <p className="text-accent text-sm">{errors.telefone.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-white/90">E-mail</Label>
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
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.area_atuacao && <p className="text-accent text-sm">{errors.area_atuacao.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-accent/90 text-white font-bold text-lg py-6 mt-2"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Quero Receber a Tabela'}
              </Button>
            </form>

            <p className="text-center text-white/40 text-xs">
              Seus dados estão seguros. Não enviamos spam.
            </p>
          </div>

        </div>
      </main>
      <footer className="py-4 text-center text-xs text-foreground/30 px-4">
        © {new Date().getFullYear()} Conexão Norte Bovino — Todos os direitos reservados
      </footer>
    </div>
  );
};

export default LandingPrecos;
