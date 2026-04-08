// src/pages/Admin.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { LogOut, Lock, Mail, Loader2 } from 'lucide-react';

import AdminSidebar, { type SectionKey, ALL_SECTIONS } from '@/components/admin/AdminSidebar';
import AdminLeads from '@/components/admin/AdminLeads';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminLotes from '@/components/admin/AdminLotes';
import AdminPartners from '@/components/admin/AdminPartners';
import AdminNews from '@/components/admin/AdminNews';
import AdminCalendario from '@/components/admin/AdminCalendario';
import AdminSettings from '@/components/admin/AdminSettings';
import ParceiroDashboard from '@/components/admin/parceiros/ParceiroDashboard';
import ParceiroCRM from '@/components/admin/parceiros/ParceiroCRM';
import ParceiroIndicacoes from '@/components/admin/parceiros/ParceiroIndicacoes';
import ParceiroMetricas from '@/components/admin/parceiros/ParceiroMetricas';
import ParceiroContratos from '@/components/admin/parceiros/ParceiroContratos';

const SECTION_COMPONENTS: Record<SectionKey, React.ComponentType> = {
  'leads':               AdminLeads,
  'usuarios':            AdminUsers,
  'lotes':               AdminLotes,
  'parceiros':           AdminPartners,
  'noticias':            AdminNews,
  'calendario':          AdminCalendario,
  'settings':            AdminSettings,
  'parceiro-dashboard':  ParceiroDashboard,
  'parceiro-crm':        ParceiroCRM,
  'parceiro-indicacoes': ParceiroIndicacoes,
  'parceiro-metricas':   ParceiroMetricas,
  'parceiro-contratos':  ParceiroContratos,
};

// ─── Formulário de login ──────────────────────────────────────────────────────

const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) toast.error('Credenciais inválidas');
    } catch {
      toast.error('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bebas text-primary">Área Administrativa</h1>
            <p className="text-muted-foreground mt-2">Faça login para acessar o CMS</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@exemplo.com" className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" className="pl-10" required />
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary-medium" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Entrando...</> : 'Entrar'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Página Admin ─────────────────────────────────────────────────────────────

const Admin = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionKey>('leads');

  const { data: permissionsData, isLoading: permissionsLoading } = useQuery({
    queryKey: ['minha-permissao', user?.id],
    enabled: !!user && isAdmin,
    queryFn: async () => {
      const { data } = await supabase
        .from('admin_permissions')
        .select('tabs')
        .eq('user_id', user!.id)
        .maybeSingle();
      return data?.tabs as string[] | null;
    },
  });

  const handleSignOut = async () => {
    await signOut();
    toast.success('Logout realizado com sucesso');
  };

  if (loading || (isAdmin && permissionsLoading)) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) return <AdminLoginForm />;

  const visibleKeys = permissionsData
    ? ALL_SECTIONS.filter((s) => permissionsData.includes(s.key)).map((s) => s.key)
    : ALL_SECTIONS.map((s) => s.key);

  const currentSection = (visibleKeys.includes(activeSection) ? activeSection : visibleKeys[0]) as SectionKey ?? 'leads';
  const ActiveComponent = SECTION_COMPONENTS[currentSection];

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="bg-primary text-white py-3 px-6 sticky top-0 z-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bebas">CNB — Painel Administrativo</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/80">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-white hover:text-white hover:bg-white/10">
              <LogOut className="w-4 h-4 mr-2" />Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar
          allowedKeys={permissionsData ?? null}
          activeSection={currentSection}
          onSelect={setActiveSection}
        />
        <main className="flex-1 overflow-y-auto p-8">
          <motion.div key={currentSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
            <ActiveComponent />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
