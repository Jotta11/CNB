import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { LogOut, Package, Settings, ArrowLeft, Loader2 } from 'lucide-react';
import AdminLotes from '@/components/admin/AdminLotes';
import AdminSettings from '@/components/admin/AdminSettings';

const Admin = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/admin/login');
      } else if (!isAdmin) {
        toast.error('Você não tem permissão para acessar esta área');
        navigate('/');
      } else {
        setCheckingAuth(false);
      }
    }
  }, [user, loading, isAdmin, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Logout realizado com sucesso');
    navigate('/');
  };

  if (loading || checkingAuth) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-primary text-white py-4 px-6 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bebas">CNB - Painel Administrativo</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/80">{user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-white hover:text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Tabs defaultValue="lotes" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="lotes" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Lotes
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configurações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lotes">
              <AdminLotes />
            </TabsContent>

            <TabsContent value="settings">
              <AdminSettings />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;
