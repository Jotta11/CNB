import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LgpdCheckbox from '@/components/LgpdCheckbox';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import logoVertical from '@/assets/logo-vert.png';
import { cidadesPorEstado, estados } from '@/data/cidadesPorEstado';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lgpdAceito, setLgpdAceito] = useState(false);
  const [lgpdError, setLgpdError] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    estado: '',
    cidade: '',
    password: ''
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isLogin && !lgpdAceito) {
      setLgpdError('Você precisa aceitar a Política de Privacidade para criar sua conta');
      setLoading(false);
      return;
    }
    if (!isLogin) setLgpdError('');

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        toast({
          title: 'Bem-vindo de volta!',
          description: 'Login realizado com sucesso.'
        });
        navigate('/');
      } else {
        if (!formData.nome || !formData.estado || !formData.cidade) {
          throw new Error('Preencha todos os campos');
        }
        const regiaoCompleta = `${formData.cidade} - ${formData.estado}`;
        const { error } = await signUp(formData.email, formData.password, formData.nome, regiaoCompleta);
        if (error) throw error;
        
        toast({
          title: 'Conta criada!',
          description: 'Sua conta foi criada com sucesso.'
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'estado') {
      // Quando muda o estado, limpa a cidade
      setFormData(prev => ({ ...prev, estado: value, cidade: '' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  // Cidades disponíveis baseadas no estado selecionado
  const cidadesDisponiveis = formData.estado ? cidadesPorEstado[formData.estado] || [] : [];

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-primary hover:text-primary/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao início
        </Button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={logoVertical}
              alt="Conexão Norte Bovino"
              className="h-20"
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-primary text-center mb-2">
            {isLogin ? 'Entrar na sua conta' : 'Criar nova conta'}
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            {isLogin 
              ? 'Acesse sua conta para ver seus lotes favoritos' 
              : 'Cadastre-se para acompanhar os melhores lotes'
            }
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Seu nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    required={!isLogin}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={formData.estado}
                    onValueChange={(value) => handleInputChange('estado', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {estados.map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Select
                    value={formData.cidade}
                    onValueChange={(value) => handleInputChange('cidade', value)}
                    disabled={!formData.estado}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.estado ? "Selecione sua cidade" : "Selecione o estado primeiro"} />
                    </SelectTrigger>
                    <SelectContent>
                      {cidadesDisponiveis.map((cidade) => (
                        <SelectItem key={cidade} value={cidade}>
                          {cidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
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

            {!isLogin && (
              <LgpdCheckbox
                checked={lgpdAceito}
                onChange={(v) => { setLgpdAceito(v); if (v) setLgpdError(''); }}
                error={lgpdError}
              />
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isLogin ? 'Entrar' : 'Criar conta'}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-primary font-medium hover:underline"
              >
                {isLogin ? 'Cadastre-se' : 'Entrar'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
