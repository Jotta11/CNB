import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Loader2, User, MapPin, Calendar, Mail, Phone, Shield,
  ShieldCheck, ShieldOff, Plus, Settings2, UserPlus, KeyRound
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  regiao: string | null;
  created_at: string;
}

interface Leitor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  area_atuacao: string;
  created_at: string;
}

interface AdminUser {
  user_id: string;
  role: string;
  created_at: string;
  profile: Profile | null;
  permissions: string[] | null; // null = acesso total
  auth_email: string | null;
  auth_full_name: string | null;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const AREAS_LABEL: Record<string, string> = {
  pecuaria_corte: 'Pecuária de corte',
  pecuaria_leite: 'Pecuária de leite',
  agricultura: 'Agricultura',
  integracao_lavoura: 'Integração lavoura-pecuária',
  consultor_tecnico: 'Consultor / Técnico',
  investidor: 'Investidor',
};

const TODAS_ABAS: { key: string; label: string }[] = [
  { key: 'leads',       label: 'Leads' },
  { key: 'usuarios',    label: 'Usuários' },
  { key: 'lotes',       label: 'Lotes' },
  { key: 'parceiros',   label: 'Parceiros' },
  { key: 'candidatos',  label: 'Candidatos Parceiros' },
  { key: 'noticias',    label: 'Notícias' },
  { key: 'calendario',  label: 'Calendário Editorial' },
  { key: 'settings',    label: 'Configurações' },
];

// ─── Componente principal ─────────────────────────────────────────────────────

const AdminUsers = () => {
  const [abaAtiva, setAbaAtiva] = useState<'usuarios' | 'leitores' | 'equipe'>('usuarios');
  const [convidarOpen, setConvidarOpen] = useState(false);
  const queryClient = useQueryClient();

  // ── Dados: Usuários do site ─────────────────────────────────────────────────

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Profile[];
    },
  });

  // ── Dados: Leitores do blog ─────────────────────────────────────────────────

  const { data: leitores, isLoading: leitoresLoading } = useQuery({
    queryKey: ['admin-leitores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leitores')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Leitor[];
    },
  });

  // ── Dados: Equipe Admin ─────────────────────────────────────────────────────

  const { data: adminUsers, isLoading: adminLoading } = useQuery({
    queryKey: ['admin-equipe'],
    queryFn: async () => {
      const [rolesResult, permissionsResult] = await Promise.all([
        supabase.from('user_roles').select('user_id, role, created_at').eq('role', 'admin'),
        supabase.from('admin_permissions').select('user_id, tabs'),
      ]);

      if (rolesResult.error) throw rolesResult.error;

      const roles = rolesResult.data || [];
      const permissions = permissionsResult.data || [];

      const userIds = roles.map((r) => r.user_id);

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      const profilesMap = Object.fromEntries(
        (profilesData || []).map((p: Profile) => [p.user_id, p])
      );
      const permissionsMap = Object.fromEntries(
        permissions.map((p) => [p.user_id, p.tabs as string[]])
      );

      // Busca dados do auth para todos os admins (garante email e nome mesmo sem profile legível)
      let authInfoMap: Record<string, { email: string; full_name: string | null }> = {};
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
          const res = await fetch(`${supabaseUrl}/functions/v1/admin-user-actions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
              apikey: anonKey,
            },
            body: JSON.stringify({ action: 'get-users-info', userIds }),
          });
          if (res.ok) {
            const json = await res.json();
            authInfoMap = Object.fromEntries(
              (json.users || []).map((u: { id: string; email: string; full_name: string | null }) => [
                u.id,
                { email: u.email, full_name: u.full_name },
              ])
            );
          }
        }
      } catch { /* silently ignore, fallback para UUID */ }

      return roles.map((r) => ({
        user_id: r.user_id,
        role: r.role,
        created_at: r.created_at,
        profile: profilesMap[r.user_id] ?? null,
        permissions: permissionsMap[r.user_id] ?? null,
        auth_email: authInfoMap[r.user_id]?.email ?? null,
        auth_full_name: authInfoMap[r.user_id]?.full_name ?? null,
      })) as AdminUser[];
    },
  });

  // ── Stats ──────────────────────────────────────────────────────────────────

  const usersByRegion = users?.reduce((acc, u) => {
    const region = u.regiao || 'Não informado';
    acc[region] = (acc[region] || []).concat(u);
    return acc;
  }, {} as Record<string, Profile[]>);

  const stats = {
    total: users?.length || 0,
    ultimaSemana: users?.filter((u) => {
      const d = new Date(u.created_at);
      const semana = new Date();
      semana.setDate(semana.getDate() - 7);
      return d >= semana;
    }).length || 0,
    regioes: Object.keys(usersByRegion || {}).length,
  };

  return (
    <div className="space-y-6">
      {/* Seletor de aba + botão convidar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'usuarios', label: 'Usuários Cadastrados' },
            { key: 'leitores', label: 'Leitores do Blog' },
            { key: 'equipe',   label: 'Equipe Admin' },
          ].map((aba) => (
            <button
              key={aba.key}
              onClick={() => setAbaAtiva(aba.key as typeof abaAtiva)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                abaAtiva === aba.key
                  ? 'bg-primary text-white'
                  : 'bg-white border border-input text-muted-foreground hover:border-primary'
              }`}
            >
              {aba.label}
            </button>
          ))}
        </div>
        <Button
          onClick={() => setConvidarOpen(true)}
          className="bg-primary hover:bg-primary-medium text-sm gap-2"
          size="sm"
        >
          <UserPlus className="w-4 h-4" />
          Criar Usuário
        </Button>
      </div>

      {/* ── Usuários Cadastrados ──────────────────────────────────────────────── */}
      {abaAtiva === 'usuarios' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-primary">{stats.total}</div><p className="text-sm text-muted-foreground">Total de Usuários</p></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-accent">{stats.ultimaSemana}</div><p className="text-sm text-muted-foreground">Novos (última semana)</p></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-secondary">{stats.regioes}</div><p className="text-sm text-muted-foreground">Regiões</p></CardContent></Card>
          </div>

          {usersByRegion && Object.keys(usersByRegion).length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">Por Região</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(usersByRegion)
                  .sort((a, b) => b[1].length - a[1].length)
                  .map(([region, ru]) => (
                    <Badge key={region} variant="outline" className="text-sm py-1.5 px-3">
                      {region}: {ru.length}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Lista de Usuários</h3>
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : users?.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhum usuário cadastrado ainda.</CardContent></Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {users?.map((u) => (
                  <Card key={u.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-primary/10"><User className="w-5 h-5 text-primary" /></div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">{u.full_name || 'Sem nome'}</CardTitle>
                          <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                            <Mail className="w-3.5 h-3.5" />
                            <span className="truncate">{u.email || 'Sem email'}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2 text-sm">
                      {u.regiao && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{u.regiao}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(u.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Leitores do Blog ─────────────────────────────────────────────────── */}
      {abaAtiva === 'leitores' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-primary">{leitores?.length || 0}</div><p className="text-sm text-muted-foreground">Total de Leitores</p></CardContent></Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-accent">
                  {leitores?.filter((l) => {
                    const d = new Date(l.created_at);
                    const semana = new Date();
                    semana.setDate(semana.getDate() - 7);
                    return d >= semana;
                  }).length || 0}
                </div>
                <p className="text-sm text-muted-foreground">Novos (última semana)</p>
              </CardContent>
            </Card>
          </div>

          {leitoresLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : leitores?.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhum leitor registrado ainda.</CardContent></Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {leitores?.map((leitor) => (
                <Card key={leitor.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-accent/10"><User className="w-5 h-5 text-accent" /></div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{leitor.nome}</CardTitle>
                        <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="truncate">{leitor.email}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><span>{leitor.telefone}</span></div>
                    <Badge variant="outline" className="text-xs">{AREAS_LABEL[leitor.area_atuacao] || leitor.area_atuacao}</Badge>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(leitor.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Equipe Admin ─────────────────────────────────────────────────────── */}
      {abaAtiva === 'equipe' && (
        <EquipeAdmin
          adminUsers={adminUsers || []}
          loading={adminLoading}
          onRefresh={() => queryClient.invalidateQueries({ queryKey: ['admin-equipe'] })}
        />
      )}

      <CriarUsuarioModal
        open={convidarOpen}
        onClose={() => setConvidarOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['admin-users'] });
          queryClient.invalidateQueries({ queryKey: ['admin-equipe'] });
        }}
      />
    </div>
  );
};

// ─── Sub-componente: Equipe Admin ─────────────────────────────────────────────

interface EquipeAdminProps {
  adminUsers: AdminUser[];
  loading: boolean;
  onRefresh: () => void;
}

const EquipeAdmin = ({ adminUsers, loading, onRefresh }: EquipeAdminProps) => {
  const [addEmail, setAddEmail] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [trocarSenhaUser, setTrocarSenhaUser] = useState<AdminUser | null>(null);

  // Helper: email de exibição
  const displayEmail = (u: AdminUser) =>
    u.profile?.email || u.auth_email || null;
  const displayName = (u: AdminUser) =>
    u.profile?.full_name || u.auth_full_name || displayEmail(u) || u.user_id.slice(0, 8) + '...';

  const handleAddAdmin = async () => {
    if (!addEmail.trim()) return;
    setAddLoading(true);
    try {
      // Busca usuário pelo email no profiles
      const { data: profile, error: pErr } = await supabase
        .from('profiles')
        .select('user_id, email')
        .eq('email', addEmail.trim().toLowerCase())
        .maybeSingle();

      if (pErr) throw pErr;
      if (!profile) {
        toast.error('Usuário não encontrado. Ele precisa ter se cadastrado primeiro.');
        return;
      }

      // Verifica se já é admin
      const existe = adminUsers.some((a) => a.user_id === profile.user_id);
      if (existe) {
        toast.error('Este usuário já é admin.');
        return;
      }

      const { error } = await supabase
        .from('user_roles')
        .insert([{ user_id: profile.user_id, role: 'admin' }]);
      if (error) throw error;

      toast.success(`${addEmail} agora é admin`);
      setAddEmail('');
      onRefresh();
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao adicionar admin');
    } finally {
      setAddLoading(false);
    }
  };

  const handleRevokeAdmin = async (userId: string, email: string | null) => {
    if (!confirm(`Remover acesso admin de ${email || userId}?`)) return;
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');
      if (error) throw error;

      // Remove permissões também
      await supabase.from('admin_permissions').delete().eq('user_id', userId);

      toast.success('Acesso admin revogado');
      onRefresh();
    } catch {
      toast.error('Erro ao revogar acesso');
    }
  };

  const handleOpenPermissions = (u: AdminUser) => {
    setEditingUser(u);
    // Se null = acesso total, pré-seleciona tudo
    setEditPermissions(u.permissions ?? TODAS_ABAS.map((a) => a.key));
  };

  const handleSavePermissions = async () => {
    if (!editingUser) return;
    setSaveLoading(true);
    try {
      const acessoTotal = editPermissions.length === TODAS_ABAS.length;

      if (acessoTotal) {
        // Remove o registro → acesso total
        await supabase.from('admin_permissions').delete().eq('user_id', editingUser.user_id);
      } else {
        // Upsert com as abas selecionadas
        const { error } = await supabase
          .from('admin_permissions')
          .upsert({ user_id: editingUser.user_id, tabs: editPermissions }, { onConflict: 'user_id' });
        if (error) throw error;
      }

      toast.success('Permissões salvas');
      setEditingUser(null);
      onRefresh();
    } catch {
      toast.error('Erro ao salvar permissões');
    } finally {
      setSaveLoading(false);
    }
  };

  const toggleAba = (key: string) => {
    setEditPermissions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bebas text-primary tracking-wide">EQUIPE ADMINISTRATIVA</h3>
          <p className="text-sm text-muted-foreground">Gerencie quem tem acesso ao CMS e quais abas cada um pode ver</p>
        </div>
      </div>

      {/* Adicionar novo admin */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            Adicionar Membro à Equipe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            O usuário precisa já ter se cadastrado no site. Busque pelo e-mail de cadastro.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="email@exemplo.com"
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddAdmin()}
              className="flex-1"
            />
            <Button
              onClick={handleAddAdmin}
              disabled={addLoading || !addEmail.trim()}
              className="bg-primary hover:bg-primary-medium"
            >
              {addLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Shield className="w-4 h-4 mr-1" />Adicionar</>}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de admins */}
      <div className="space-y-3">
        {adminUsers.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-muted-foreground">Nenhum admin cadastrado.</CardContent></Card>
        ) : (
          adminUsers.map((u) => {
            const temRestricao = u.permissions !== null;
            return (
              <Card key={u.user_id} className="border-cream-dark">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${temRestricao ? 'bg-amber-100' : 'bg-primary/10'}`}>
                        {temRestricao
                          ? <Shield className="w-5 h-5 text-amber-600" />
                          : <ShieldCheck className="w-5 h-5 text-primary" />
                        }
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{displayName(u)}</p>
                        {u.profile?.full_name && displayEmail(u) && (
                          <p className="text-xs text-muted-foreground">{displayEmail(u)}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${temRestricao ? 'border-amber-300 text-amber-700' : 'border-primary/30 text-primary'}`}
                          >
                            {temRestricao ? `${u.permissions!.length} aba(s)` : 'Acesso total'}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            desde {format(new Date(u.created_at), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenPermissions(u)}
                        className="text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10"
                      >
                        <Settings2 className="w-3.5 h-3.5" />
                        Permissões
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTrocarSenhaUser(u)}
                        className="text-xs gap-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        Senha
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeAdmin(u.user_id, displayEmail(u))}
                        className="text-destructive hover:bg-destructive/10 text-xs gap-1"
                      >
                        <ShieldOff className="w-3.5 h-3.5" />
                        Revogar
                      </Button>
                    </div>
                  </div>

                  {/* Preview das abas permitidas */}
                  {temRestricao && (
                    <div className="mt-3 pt-3 border-t border-cream-dark flex flex-wrap gap-1">
                      {TODAS_ABAS.map((aba) => {
                        const tem = u.permissions!.includes(aba.key);
                        return (
                          <span
                            key={aba.key}
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              tem
                                ? 'bg-primary/10 text-primary'
                                : 'bg-gray-100 text-gray-400 line-through'
                            }`}
                          >
                            {aba.label}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Modal de trocar senha */}
      {trocarSenhaUser && (
        <TrocarSenhaModal
          user={trocarSenhaUser}
          onClose={() => setTrocarSenhaUser(null)}
        />
      )}

      {/* Modal de permissões */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="max-w-md bg-cream border-2 border-primary">
          <DialogHeader>
            <DialogTitle className="font-bebas text-xl text-primary tracking-wider">
              PERMISSÕES — {editingUser?.profile?.full_name || editingUser?.profile?.email || editingUser?.auth_email || 'Admin'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Marque as abas que este usuário pode acessar. Se todas estiverem marcadas, ele terá acesso total.
            </p>

            {/* Selecionar/desmarcar tudo */}
            <div className="flex gap-2">
              <button
                onClick={() => setEditPermissions(TODAS_ABAS.map((a) => a.key))}
                className="text-xs text-primary underline"
              >
                Marcar todas
              </button>
              <span className="text-muted-foreground">·</span>
              <button
                onClick={() => setEditPermissions([])}
                className="text-xs text-muted-foreground underline"
              >
                Desmarcar todas
              </button>
            </div>

            <div className="space-y-1">
              {TODAS_ABAS.map((aba) => {
                const marcado = editPermissions.includes(aba.key);
                return (
                  <button
                    key={aba.key}
                    onClick={() => toggleAba(aba.key)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-cream-dark hover:border-primary/30 transition-colors"
                  >
                    <span className={`text-sm font-medium ${marcado ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {aba.label}
                    </span>
                    {/* Switch estilo Apple */}
                    <span
                      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ease-in-out ${
                        marcado ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 mt-0.5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out ${
                          marcado ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </span>
                  </button>
                );
              })}
            </div>

            {editPermissions.length === TODAS_ABAS.length && (
              <p className="text-xs text-primary bg-primary/5 border border-primary/20 rounded-lg p-2">
                Todas as abas marcadas = acesso total (sem restrições)
              </p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setEditingUser(null)}>CANCELAR</Button>
            <Button
              className="bg-primary hover:bg-primary-medium font-bold"
              onClick={handleSavePermissions}
              disabled={saveLoading || editPermissions.length === 0}
            >
              {saveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SALVAR PERMISSÕES'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─── Modal: Trocar Senha ──────────────────────────────────────────────────────

interface TrocarSenhaModalProps {
  user: AdminUser;
  onClose: () => void;
}

const TrocarSenhaModal = ({ user, onClose }: TrocarSenhaModalProps) => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const displayLabel = user.profile?.full_name || user.profile?.email || user.auth_email || user.user_id.slice(0, 8) + '...';

  const handleSubmit = async () => {
    if (newPassword.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Sessão expirada');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
      const res = await fetch(`${supabaseUrl}/functions/v1/admin-user-actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
          apikey: anonKey,
        },
        body: JSON.stringify({ action: 'change-password', targetUserId: user.user_id, newPassword }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erro ao trocar senha');

      toast.success(`Senha de ${displayLabel} alterada com sucesso`);
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erro ao trocar senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm bg-cream border-2 border-primary">
        <DialogHeader>
          <DialogTitle className="font-bebas text-xl text-primary tracking-wider flex items-center gap-2">
            <KeyRound className="w-5 h-5" />
            TROCAR SENHA
          </DialogTitle>
        </DialogHeader>
        <div className="py-2 space-y-3">
          <p className="text-sm text-muted-foreground">
            Definindo nova senha para <span className="font-semibold text-foreground">{displayLabel}</span>
          </p>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nova senha</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose}>CANCELAR</Button>
          <Button
            className="bg-primary hover:bg-primary-medium font-bold"
            onClick={handleSubmit}
            disabled={loading || newPassword.length < 6}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SALVAR SENHA'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Modal: Criar Usuário ─────────────────────────────────────────────────────

interface CriarUsuarioModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CriarUsuarioModal = ({ open, onClose, onSuccess }: CriarUsuarioModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [permissions, setPermissions] = useState<string[]>(TODAS_ABAS.map((a) => a.key));
  const [loading, setLoading] = useState(false);

  const toggleAba = (key: string) => {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setRole('user');
    setPermissions(TODAS_ABAS.map((a) => a.key));
    onClose();
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Sessão expirada');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
      const res = await fetch(`${supabaseUrl}/functions/v1/invite-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
          apikey: supabaseAnonKey,
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          fullName: fullName.trim() || undefined,
          role,
          permissions: role === 'admin' ? permissions : undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erro ao criar usuário');

      if (json.confirmed === false) {
        toast.success(`Usuário ${email} criado — aguardando confirmação de e-mail`);
      } else {
        toast.success(`Usuário ${email} criado com sucesso`);
      }
      onSuccess();
      handleClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-md bg-cream border-2 border-primary">
        <DialogHeader>
          <DialogTitle className="font-bebas text-xl text-primary tracking-wider flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            CRIAR USUÁRIO
          </DialogTitle>
        </DialogHeader>

        <div className="pt-3 pb-2 space-y-4 overflow-y-auto max-h-[65vh] px-1 -mx-1">
          <div className="space-y-2">
            <Label htmlFor="create-email">E-mail *</Label>
            <Input
              id="create-email"
              type="email"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-password">Senha *</Label>
            <Input
              id="create-password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-name">Nome completo</Label>
            <Input
              id="create-name"
              placeholder="João da Silva"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Tipo de usuário */}
          <div className="space-y-2">
            <Label>Tipo de acesso</Label>
            <div className="flex gap-2">
              {[
                { value: 'user', label: 'Usuário Regular' },
                { value: 'admin', label: 'Membro Admin' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRole(opt.value as 'user' | 'admin')}
                  className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold border transition-colors ${
                    role === opt.value
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-muted-foreground border-input hover:border-primary'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Permissões (só para admin) */}
          {role === 'admin' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Permissões de abas</Label>
                <div className="flex gap-2 text-xs">
                  <button onClick={() => setPermissions(TODAS_ABAS.map((a) => a.key))} className="text-primary underline">
                    Marcar todas
                  </button>
                  <span className="text-muted-foreground">·</span>
                  <button onClick={() => setPermissions([])} className="text-muted-foreground underline">
                    Desmarcar
                  </button>
                </div>
              </div>
              <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                {TODAS_ABAS.map((aba) => {
                  const marcado = permissions.includes(aba.key);
                  return (
                    <button
                      key={aba.key}
                      onClick={() => toggleAba(aba.key)}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white border border-cream-dark hover:border-primary/30 transition-colors"
                    >
                      <span className={`text-sm font-medium ${marcado ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {aba.label}
                      </span>
                      <span className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${marcado ? 'bg-primary' : 'bg-gray-200'}`}>
                        <span className={`inline-block h-5 w-5 mt-0.5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ${marcado ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </span>
                    </button>
                  );
                })}
              </div>
              {permissions.length === TODAS_ABAS.length && (
                <p className="text-xs text-primary bg-primary/5 border border-primary/20 rounded-lg p-2">
                  Todas as abas marcadas = acesso total
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={handleClose}>CANCELAR</Button>
          <Button
            className="bg-primary hover:bg-primary-medium font-bold"
            onClick={handleSubmit}
            disabled={loading || !email.trim() || !password.trim()}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserPlus className="w-4 h-4 mr-1" />CRIAR USUÁRIO</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminUsers;
