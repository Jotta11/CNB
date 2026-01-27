import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, MapPin, Calendar, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  regiao: string | null;
  created_at: string;
}

const AdminUsers = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Profile[];
    }
  });

  // Group users by region
  const usersByRegion = users?.reduce((acc, user) => {
    const region = user.regiao || 'Não informado';
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(user);
    return acc;
  }, {} as Record<string, Profile[]>);

  const stats = {
    total: users?.length || 0,
    comRegiao: users?.filter(u => u.regiao).length || 0,
    ultimaSemana: users?.filter(u => {
      const createdAt = new Date(u.created_at);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return createdAt >= oneWeekAgo;
    }).length || 0
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total de Usuários</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.ultimaSemana}</div>
            <p className="text-sm text-muted-foreground">Novos (última semana)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{Object.keys(usersByRegion || {}).length}</div>
            <p className="text-sm text-muted-foreground">Regiões</p>
          </CardContent>
        </Card>
      </div>

      {/* Users by Region */}
      {usersByRegion && Object.keys(usersByRegion).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Usuários por Região</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(usersByRegion)
              .sort((a, b) => b[1].length - a[1].length)
              .map(([region, regionUsers]) => (
                <Badge key={region} variant="outline" className="text-sm py-1.5 px-3">
                  {region}: {regionUsers.length}
                </Badge>
              ))}
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Lista de Usuários Cadastrados</h3>
        
        {users?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhum usuário cadastrado ainda.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users?.map(user => (
              <Card key={user.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">
                        {user.full_name || 'Sem nome'}
                      </CardTitle>
                      <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="truncate">{user.email || 'Sem email'}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    {user.regiao && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{user.regiao}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(user.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
