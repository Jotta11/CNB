import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Verifica que o chamador é admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user: caller }, error: callerError } = await supabaseAdmin.auth.getUser(token);
    if (callerError || !caller) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', caller.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Acesso negado.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Lê o body
    const { email, password, fullName, role, permissions } = await req.json() as {
      email: string;
      password: string;
      fullName?: string;
      role: 'user' | 'admin';
      permissions?: string[] | null;
    };

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'E-mail e senha são obrigatórios' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Cria o usuário diretamente com senha
    const { data: newUserData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName?.trim() || null },
    });

    if (createError) {
      console.error('createUser error:', createError);
      return new Response(JSON.stringify({ error: createError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const newUserId = newUserData.user.id;
    console.log('User created:', newUserId, 'role:', role);

    // Cria o perfil na tabela profiles
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        user_id: newUserId,
        email: email.trim().toLowerCase(),
        full_name: fullName?.trim() || null,
      }, { onConflict: 'user_id' });

    if (profileError) {
      console.error('profiles upsert error:', profileError);
      // Não falha o request — o usuário foi criado mesmo sem profile
    }

    // Se for admin, insere role
    if (role === 'admin') {
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: newUserId, role: 'admin' });

      if (roleError) {
        console.error('user_roles insert error:', roleError);
        if (roleError.code !== '23505') throw roleError;
      } else {
        console.log('Admin role inserted for:', newUserId);
      }

      // Permissões restritas
      const todasAsAbas = ['leads', 'usuarios', 'lotes', 'parceiros', 'candidatos', 'noticias', 'calendario', 'settings'];
      const temRestricao = permissions && permissions.length < todasAsAbas.length;

      if (temRestricao) {
        const { error: permError } = await supabaseAdmin
          .from('admin_permissions')
          .upsert({ user_id: newUserId, tabs: permissions }, { onConflict: 'user_id' });
        if (permError) {
          console.error('admin_permissions upsert error:', permError);
          throw permError;
        }
      }
    }

    return new Response(JSON.stringify({ success: true, userId: newUserId, email: newUserData.user.email, confirmed: newUserData.user.email_confirmed_at !== null }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
