import { useRef } from 'react';
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
import logoBgLp from '@/assets/logo-bg-lp.png';
import { useLeadSubmit } from '@/hooks/useLeadSubmit';
import { trackFormInicio } from '@/utils/analytics';

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

const tableImg = '/TABELA CNB.png';

const LandingPrecos = () => {
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
        tipo: 'tabela_precos',
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        area_atuacao: data.area_atuacao,
      });
    } catch {
      toast.error('Erro ao enviar. Tente novamente.');
    }
  };

  const handleFormStart = () => {
    if (formIniciadoRef.current) return;
    formIniciadoRef.current = true;
    trackFormInicio('tabela_precos');
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-primary flex flex-col relative overflow-hidden">
        <img src={logoBgLp} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 m-auto w-[55%] max-w-xs opacity-[0.06] select-none" />
        <header className="py-6 px-4 flex justify-center relative z-10">
          <img src={logoHorizontal} alt="CNB - Conexão Norte Bovino" className="h-12 object-contain" />
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-8 text-center w-full max-w-2xl mx-auto relative z-10">
          <CheckCircle2 className="w-16 h-16 text-accent" />
          <h2 className="font-display text-4xl tracking-wider text-white">Cadastro Confirmado!</h2>
          <p className="text-white/70 text-lg">
            Você receberá a tabela semanal de preços diretamente no seu e-mail.
            Bem-vindo à CNB!
          </p>
          <div className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-2xl">
            <img
              src={tableImg}
              alt="Tabela de Preços CNB"
              className="w-full blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-3">
              <Lock className="w-10 h-10 text-accent" />
              <p className="font-display text-2xl text-white tracking-wider text-center px-4">
                Tabela desta semana
              </p>
              <p className="text-white/70 text-sm text-center px-4">
                A tabela será enviada para o seu e-mail
              </p>
            </div>
          </div>
        </main>
        <footer className="py-4 text-center text-xs text-white/30 px-4">
          © {new Date().getFullYear()} Conexão Norte Bovino — Todos os direitos reservados
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex flex-col relative overflow-hidden">
      <img src={logoBgLp} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 m-auto w-[55%] max-w-md opacity-[0.06] select-none" />
      <header className="py-6 px-4 flex justify-center relative z-10">
        <img src={logoHorizontal} alt="CNB - Conexão Norte Bovino" className="h-12 object-contain" />
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
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

          {/* Painel direito — formulário em card branco */}
          <div className="bg-white rounded-2xl p-8 space-y-6 shadow-xl">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-4 py-1.5">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-accent text-sm font-medium uppercase tracking-widest">Gratuito</span>
              </div>
              <h1 className="font-display text-4xl text-primary tracking-wider leading-tight">
                Receba a Tabela<br />toda semana
              </h1>
              <p className="text-foreground/60 text-base max-w-sm mx-auto">
                Sem custo, sem compromisso. Preços atualizados do mercado bovino direto no seu e-mail.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              onFocusCapture={handleFormStart}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="nome" className="text-foreground/80">Nome completo</Label>
                <Input
                  id="nome"
                  placeholder="Seu nome completo"
                  {...register('nome')}
                />
                {errors.nome && <p className="text-destructive text-sm">{errors.nome.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="telefone" className="text-foreground/80">Telefone / WhatsApp</Label>
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  {...register('telefone')}
                />
                {errors.telefone && <p className="text-destructive text-sm">{errors.telefone.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-foreground/80">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                />
                {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-foreground/80">Área de atuação</Label>
                <Select onValueChange={(v) => setValue('area_atuacao', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione sua área" />
                  </SelectTrigger>
                  <SelectContent>
                    {areasAtuacao.map((area) => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.area_atuacao && <p className="text-destructive text-sm">{errors.area_atuacao.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-accent/90 text-white font-bold text-lg py-6 mt-2"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Quero Receber a Tabela'}
              </Button>
            </form>

            <p className="text-center text-foreground/40 text-xs">
              Seus dados estão seguros. Não enviamos spam.
            </p>
          </div>

        </div>
      </main>
      <footer className="py-4 text-center text-xs text-white/30 px-4 relative z-10">
        © {new Date().getFullYear()} Conexão Norte Bovino — Todos os direitos reservados
      </footer>
    </div>
  );
};

export default LandingPrecos;
