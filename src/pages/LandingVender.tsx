import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Tag, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  localizacao: z.string().min(2, 'Informe seu estado/cidade'),
  categoria_gado: z.string().min(1, 'Selecione a categoria'),
  numero_cabecas: z.coerce.number().min(1, 'Informe o número de cabeças'),
  mensagem: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

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

const LandingVender = () => {
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
      await submitLead({ tipo: 'vender', ...data });
    } catch {
      toast.error('Erro ao enviar. Tente novamente.');
    }
  };

  if (submitted) {
    return (
      <LandingLayout bgClass="bg-background">
        <div className="text-center space-y-4 py-12">
          <CheckCircle2 className="w-16 h-16 mx-auto text-primary" />
          <h2 className="font-display text-4xl text-primary tracking-wider">
            Proposta Recebida!
          </h2>
          <p className="text-muted-foreground text-lg">
            Nossa equipe analisará seu lote e entrará em contato em breve com uma proposta.
            Obrigado por confiar na CNB!
          </p>
        </div>
      </LandingLayout>
    );
  }

  return (
    <LandingLayout bgClass="bg-background">
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5">
            <Tag className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium uppercase tracking-widest">
              Para Vendedores
            </span>
          </div>
          <h1 className="font-display text-5xl text-primary tracking-wider leading-tight">
            Venda seu Gado
            <br />
            com Facilidade
          </h1>
          <p className="text-muted-foreground text-lg max-w-sm mx-auto">
            Conectamos seu lote com compradores qualificados em todo o Brasil. Preencha o
            formulário e nossa equipe cuida do resto.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 bg-white border border-primary/20 rounded-2xl p-6 shadow-sm"
        >
          <div className="space-y-1.5">
            <Label htmlFor="nome">Nome completo</Label>
            <Input
              id="nome"
              placeholder="Seu nome completo"
              {...register('nome')}
            />
            {errors.nome && (
              <p className="text-destructive text-sm">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="telefone">Telefone / WhatsApp</Label>
            <Input
              id="telefone"
              placeholder="(00) 00000-0000"
              {...register('telefone')}
            />
            {errors.telefone && (
              <p className="text-destructive text-sm">{errors.telefone.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="localizacao">Estado / Cidade</Label>
            <Input
              id="localizacao"
              placeholder="Ex: Araguaína - TO"
              {...register('localizacao')}
            />
            {errors.localizacao && (
              <p className="text-destructive text-sm">{errors.localizacao.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Categoria do gado</Label>
            <Select onValueChange={(v) => setValue('categoria_gado', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoria_gado && (
              <p className="text-destructive text-sm">{errors.categoria_gado.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="numero_cabecas">Número de cabeças</Label>
            <Input
              id="numero_cabecas"
              type="number"
              min={1}
              placeholder="Ex: 150"
              {...register('numero_cabecas')}
            />
            {errors.numero_cabecas && (
              <p className="text-destructive text-sm">{errors.numero_cabecas.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mensagem">
              Informações adicionais{' '}
              <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Textarea
              id="mensagem"
              placeholder="Raça, peso médio, condição, localização da fazenda..."
              rows={3}
              {...register('mensagem')}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-6"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Quero Vender Meu Gado'
            )}
          </Button>
        </form>

        <p className="text-center text-muted-foreground text-xs">
          Seus dados estão seguros. Nossa equipe entrará em contato em breve.
        </p>
      </div>
    </LandingLayout>
  );
};

export default LandingVender;
