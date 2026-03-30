import { useState } from 'react';
import { Eye, EyeOff, Loader2, Phone, User, Mail, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cidadesPorEstado, estados } from '@/data/cidadesPorEstado';
import logoVertical from '@/assets/logo-vert.png';

const CICLOS = [
  { id: 'cria', label: 'Cria' },
  { id: 'recria', label: 'Recria' },
  { id: 'engorda', label: 'Engorda' },
] as const;

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const AuthModal = ({ open, onOpenChange, onSuccess }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ciclosProdutivos, setCiclosProdutivos] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    estado: '',
    cidade: '',
    password: '',
    receber_tabela_precos: false,
  });

  const { signIn, signUp } = useAuth();

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === 'estado') {
      setFormData(prev => ({ ...prev, estado: value as string, cidade: '' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const toggleCiclo = (ciclo: string) => {
    setCiclosProdutivos(prev =>
      prev.includes(ciclo) ? prev.filter(c => c !== ciclo) : [...prev, ciclo]
    );
  };

  const cidadesDisponiveis = formData.estado ? cidadesPorEstado[formData.estado] || [] : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        toast.success('Bem-vindo de volta!');
        onOpenChange(false);
        onSuccess?.();
      } else {
        if (!formData.nome || !formData.estado || !formData.cidade || !formData.telefone) {
          throw new Error('Preencha todos os campos obrigatórios');
        }
        const regiaoCompleta = `${formData.cidade} - ${formData.estado}`;
        const { error } = await signUp(formData.email, formData.password, formData.nome, {
          regiao: regiaoCompleta,
          telefone: formData.telefone,
          ciclo_produtivo: ciclosProdutivos,
          receber_tabela_precos: formData.receber_tabela_precos,
        });
        if (error) throw error;
        toast.success('Conta criada com sucesso!');
        onOpenChange(false);
        onSuccess?.();
      }
    } catch (error: any) {
      toast.error(error.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', email: '', telefone: '', estado: '', cidade: '', password: '', receber_tabela_precos: false });
    setCiclosProdutivos([]);
    setIsLogin(true);
    setShowPassword(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetForm(); }}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">
          {isLogin ? 'Entrar na conta' : 'Criar nova conta'}
        </DialogTitle>

        {/* Header do modal */}
        <div className="flex flex-col items-center pt-8 pb-4 px-8">
          <img src={logoVertical} alt="CNB" className="h-16 mb-4" />
          <h2 className="font-display text-2xl text-primary tracking-wide">
            {isLogin ? 'ENTRAR NA CONTA' : 'CRIAR CONTA'}
          </h2>
          <p className="text-muted-foreground text-sm text-center mt-1">
            {isLogin
              ? 'Acesse sua conta para ver seus lotes favoritos'
              : 'Cadastre-se para acompanhar os melhores lotes'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
          {!isLogin && (
            <>
              {/* Nome */}
              <div className="space-y-1.5">
                <Label htmlFor="modal-nome">Nome completo *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="modal-nome"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              {/* Telefone */}
              <div className="space-y-1.5">
                <Label htmlFor="modal-telefone">Telefone / WhatsApp *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="modal-telefone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              {/* Estado */}
              <div className="space-y-1.5">
                <Label>Estado *</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(v) => handleInputChange('estado', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estados.map((e) => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cidade */}
              <div className="space-y-1.5">
                <Label>Cidade *</Label>
                <Select
                  value={formData.cidade}
                  onValueChange={(v) => handleInputChange('cidade', v)}
                  disabled={!formData.estado}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.estado ? 'Selecione sua cidade' : 'Selecione o estado primeiro'} />
                  </SelectTrigger>
                  <SelectContent>
                    {cidadesDisponiveis.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ciclo produtivo */}
              <div className="space-y-2">
                <Label>Ciclo produtivo</Label>
                <div className="flex gap-2 flex-wrap">
                  {CICLOS.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleCiclo(id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        ciclosProdutivos.includes(id)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-muted-foreground border-input hover:border-primary'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle tabela de preços */}
              <div className="flex items-center justify-between rounded-xl bg-cream px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Receber tabela semanal de preços</p>
                  <p className="text-xs text-muted-foreground">Preço do @ atualizado toda semana</p>
                </div>
                <Switch
                  checked={formData.receber_tabela_precos}
                  onCheckedChange={(v) => handleInputChange('receber_tabela_precos', v)}
                />
              </div>
            </>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="modal-email">E-mail *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="modal-email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          {/* Senha */}
          <div className="space-y-1.5">
            <Label htmlFor="modal-password">Senha *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="modal-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="pl-9 pr-10"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 font-bold text-base" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isLogin ? 'ENTRAR' : 'CRIAR CONTA'}
          </Button>

          {/* Toggle login/cadastro */}
          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); }}
              className="ml-1 text-primary font-semibold hover:underline"
            >
              {isLogin ? 'Cadastre-se' : 'Entrar'}
            </button>
          </p>

          {!isLogin && (
            <p className="text-center text-xs text-muted-foreground/60 pt-2">
              Em breve: acesso via código no WhatsApp, sem necessidade de senha.
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
