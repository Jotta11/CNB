// src/components/admin/parceiros/ParceiroContratos.tsx
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Plus, Edit2, FileText, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { TEMPLATE_VARS_PARCERIA, TEMPLATE_VARS_NEGOCIO } from '@/data/parceiros-constants';

const db = supabase as any;

// ─── Types ────────────────────────────────────────────────────────────────────

type ContratoStatus = 'rascunho' | 'enviado' | 'assinado' | 'cancelado';

interface ContratoRow {
  id: string;
  indicacao_id: string;
  modelo_id: string | null;
  conteudo: string;
  status: ContratoStatus;
  created_at: string;
  updated_at: string;
  indicacoes?: {
    cliente_nome: string;
    parceiros?: { nome_completo: string } | null;
  } | null;
}

interface IndicacaoOption {
  id: string;
  cliente_nome: string;
  parceiros?: { nome_completo: string } | null;
}

interface ModeloRow {
  id: string;
  nome: string;
  conteudo_template: string;
  variaveis: string[];
  created_at: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<ContratoStatus, string> = {
  rascunho: 'Rascunho',
  enviado: 'Enviado',
  assinado: 'Assinado',
  cancelado: 'Cancelado',
};

const ALL_TEMPLATE_VARS = [
  ...TEMPLATE_VARS_PARCERIA,
  ...TEMPLATE_VARS_NEGOCIO.filter(
    (v) => !TEMPLATE_VARS_PARCERIA.some((p) => p.key === v.key),
  ),
];

// ─── Badge helper ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ContratoStatus }) {
  const classMap: Record<ContratoStatus, string> = {
    rascunho: 'bg-gray-100 text-gray-600 border-gray-300',
    enviado: 'bg-blue-100 text-blue-700 border-blue-300',
    assinado: 'bg-green-100 text-green-700 border-green-300',
    cancelado: 'bg-red-100 text-red-600 border-red-300',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${classMap[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

// ─── Contrato Dialog ──────────────────────────────────────────────────────────

interface ContratoDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  indicacoes: IndicacaoOption[];
  modelos: ModeloRow[];
  editing: ContratoRow | null;
  onSaved: () => void;
}

function ContratoDialog({
  open, onOpenChange, indicacoes, modelos, editing, onSaved,
}: ContratoDialogProps) {
  const qc = useQueryClient();
  const [indicacaoId, setIndicacaoId] = useState('');
  const [modeloId, setModeloId] = useState<string>('');
  const [conteudo, setConteudo] = useState('');
  const [status, setStatus] = useState<ContratoStatus>('rascunho');

  useEffect(() => {
    if (open) {
      if (editing) {
        setIndicacaoId(editing.indicacao_id);
        setModeloId(editing.modelo_id ?? '');
        setConteudo(editing.conteudo);
        setStatus(editing.status);
      } else {
        setIndicacaoId('');
        setModeloId('');
        setConteudo('');
        setStatus('rascunho');
      }
    }
  }, [open, editing]);

  // Prefill conteudo when modelo is selected
  const handleModeloChange = (id: string) => {
    setModeloId(id);
    if (id) {
      const modelo = modelos.find((m) => m.id === id);
      if (modelo) setConteudo(modelo.conteudo_template);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await db.from('contratos').update({
          status,
          conteudo,
          modelo_id: modeloId || null,
          updated_at: new Date().toISOString(),
        }).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await db.from('contratos').insert({
          indicacao_id: indicacaoId,
          modelo_id: modeloId || null,
          conteudo,
          status,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['crm-contratos'] });
      toast.success(editing ? 'Contrato atualizado!' : 'Contrato criado!');
      onOpenChange(false);
      onSaved();
    },
    onError: (err: any) => toast.error(err.message ?? 'Erro ao salvar contrato'),
  });

  const isValid = !!indicacaoId && !!conteudo.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar Contrato' : 'Novo Contrato'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Indicação */}
          <div>
            <Label>Indicação *</Label>
            <Select value={indicacaoId} onValueChange={setIndicacaoId} disabled={!!editing}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a indicação" />
              </SelectTrigger>
              <SelectContent>
                {indicacoes.map((ind) => (
                  <SelectItem key={ind.id} value={ind.id}>
                    {ind.cliente_nome}
                    {ind.parceiros?.nome_completo ? ` — ${ind.parceiros.nome_completo}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Modelo (opcional) */}
          <div>
            <Label>Modelo de Contrato (opcional)</Label>
            <Select value={modeloId} onValueChange={handleModeloChange}>
              <SelectTrigger>
                <SelectValue placeholder="Nenhum modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhum modelo</SelectItem>
                {modelos.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {modeloId && (
              <p className="text-xs text-muted-foreground mt-1">
                O conteúdo foi preenchido a partir do modelo. Edite conforme necessário.
              </p>
            )}
          </div>

          {/* Conteúdo */}
          <div>
            <Label>Conteúdo *</Label>
            <Textarea
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              rows={10}
              className="font-mono text-sm"
              placeholder="Conteúdo do contrato..."
            />
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as ContratoStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(STATUS_LABELS) as ContratoStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={!isValid || saveMutation.isPending}
          >
            {saveMutation.isPending
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Salvando...</>
              : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Modelo Dialog ────────────────────────────────────────────────────────────

interface ModeloDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: ModeloRow | null;
  onSaved: () => void;
}

function ModeloDialog({ open, onOpenChange, editing, onSaved }: ModeloDialogProps) {
  const qc = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [nome, setNome] = useState('');
  const [conteudoTemplate, setConteudoTemplate] = useState('');
  const [variaveis, setVariaveis] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      if (editing) {
        setNome(editing.nome);
        setConteudoTemplate(editing.conteudo_template);
        setVariaveis(editing.variaveis ?? []);
      } else {
        setNome('');
        setConteudoTemplate('');
        setVariaveis([]);
      }
    }
  }, [open, editing]);

  // Track which variables are used in the template
  const detectVars = (template: string) =>
    ALL_TEMPLATE_VARS.filter((v) => template.includes(v.key)).map((v) => v.key);

  const handleConteudoChange = (value: string) => {
    setConteudoTemplate(value);
    setVariaveis(detectVars(value));
  };

  // Insert variable at cursor position
  const insertVar = (varKey: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setConteudoTemplate((prev) => {
        const next = prev + varKey;
        setVariaveis(detectVars(next));
        return next;
      });
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue =
      conteudoTemplate.slice(0, start) + varKey + conteudoTemplate.slice(end);
    setConteudoTemplate(newValue);
    setVariaveis(detectVars(newValue));
    // Restore cursor position after state update
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + varKey.length, start + varKey.length);
    });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await db.from('modelos_contrato').update({
          nome,
          conteudo_template: conteudoTemplate,
          variaveis,
        }).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await db.from('modelos_contrato').insert({
          nome,
          conteudo_template: conteudoTemplate,
          variaveis,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['crm-modelos'] });
      toast.success(editing ? 'Modelo atualizado!' : 'Modelo criado!');
      onOpenChange(false);
      onSaved();
    },
    onError: (err: any) => toast.error(err.message ?? 'Erro ao salvar modelo'),
  });

  const isValid = !!nome.trim() && !!conteudoTemplate.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar Modelo' : 'Novo Modelo de Contrato'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nome */}
          <div>
            <Label>Nome do Modelo *</Label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Contrato de Parceria Padrão"
            />
          </div>

          {/* Variáveis disponíveis */}
          <div>
            <Label className="mb-2 block">Variáveis disponíveis — clique para inserir</Label>
            <div className="flex flex-wrap gap-1.5 p-3 bg-secondary/30 rounded-lg border">
              {ALL_TEMPLATE_VARS.map((v) => {
                const used = variaveis.includes(v.key);
                return (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => insertVar(v.key)}
                    className={`
                      px-2 py-0.5 rounded text-[11px] font-mono border transition-colors cursor-pointer
                      ${used
                        ? 'bg-primary/10 text-primary border-primary/30 font-semibold'
                        : 'bg-white text-muted-foreground border-border hover:border-primary/50 hover:text-primary'}
                    `}
                    title={v.label}
                  >
                    {v.key}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Variáveis em destaque já estão presentes no template.
            </p>
          </div>

          {/* Template */}
          <div>
            <Label>Template do Contrato *</Label>
            <Textarea
              ref={textareaRef}
              value={conteudoTemplate}
              onChange={(e) => handleConteudoChange(e.target.value)}
              rows={14}
              className="font-mono text-sm"
              placeholder="Digite o conteúdo do contrato. Use as variáveis acima para campos dinâmicos..."
            />
          </div>

          {/* Variáveis detectadas */}
          {variaveis.length > 0 && (
            <div>
              <Label className="text-xs text-muted-foreground">
                Variáveis detectadas neste template ({variaveis.length})
              </Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {variaveis.map((v) => (
                  <Badge key={v} variant="secondary" className="text-[10px] font-mono">{v}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={!isValid || saveMutation.isPending}
          >
            {saveMutation.isPending
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Salvando...</>
              : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ParceiroContratos() {
  const qc = useQueryClient();

  // Contratos state
  const [contratoDialogOpen, setContratoDialogOpen] = useState(false);
  const [editingContrato, setEditingContrato] = useState<ContratoRow | null>(null);

  // Modelos state
  const [modeloDialogOpen, setModeloDialogOpen] = useState(false);
  const [editingModelo, setEditingModelo] = useState<ModeloRow | null>(null);

  // ── Queries ──────────────────────────────────────────────────────────────

  const {
    data: contratos = [],
    isLoading: contratosLoading,
    error: contratosError,
  } = useQuery<ContratoRow[]>({
    queryKey: ['crm-contratos'],
    queryFn: async () => {
      const { data, error } = await db
        .from('contratos')
        .select('*, indicacoes(cliente_nome, parceiros(nome_completo))')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const {
    data: indicacoesAtivas = [],
    error: indicacoesError,
  } = useQuery<IndicacaoOption[]>({
    queryKey: ['crm-indicacoes-ativas'],
    queryFn: async () => {
      const { data, error } = await db
        .from('indicacoes')
        .select('id, cliente_nome, parceiros(nome_completo)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const {
    data: modelos = [],
    isLoading: modelosLoading,
    error: modelosError,
  } = useQuery<ModeloRow[]>({
    queryKey: ['crm-modelos'],
    queryFn: async () => {
      const { data, error } = await db
        .from('modelos_contrato')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  // Error handling
  useEffect(() => {
    if (contratosError) toast.error('Erro ao carregar contratos');
  }, [contratosError]);

  useEffect(() => {
    if (indicacoesError) toast.error('Erro ao carregar indicações');
  }, [indicacoesError]);

  useEffect(() => {
    if (modelosError) toast.error('Erro ao carregar modelos');
  }, [modelosError]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const openNewContrato = () => {
    setEditingContrato(null);
    setContratoDialogOpen(true);
  };

  const openEditContrato = (row: ContratoRow) => {
    setEditingContrato(row);
    setContratoDialogOpen(true);
  };

  const openNewModelo = () => {
    setEditingModelo(null);
    setModeloDialogOpen(true);
  };

  const openEditModelo = (row: ModeloRow) => {
    setEditingModelo(row);
    setModeloDialogOpen(true);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bebas text-primary">Contratos</h1>
        <p className="text-muted-foreground text-sm">Gestão de contratos e modelos de parceria</p>
      </div>

      <Tabs defaultValue="contratos">
        <TabsList>
          <TabsTrigger value="contratos" className="flex items-center gap-1.5">
            <FileText className="w-4 h-4" /> Contratos
          </TabsTrigger>
          <TabsTrigger value="modelos" className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Modelos
          </TabsTrigger>
        </TabsList>

        {/* ── Tab: Contratos ── */}
        <TabsContent value="contratos" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {contratos.length} contrato{contratos.length !== 1 ? 's' : ''} registrado{contratos.length !== 1 ? 's' : ''}
            </p>
            <Button onClick={openNewContrato}>
              <Plus className="w-4 h-4 mr-1" /> Novo Contrato
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              {contratosLoading ? (
                <div className="flex items-center justify-center py-16 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" /> Carregando contratos...
                </div>
              ) : contratos.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Nenhum contrato cadastrado ainda.</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={openNewContrato}>
                    <Plus className="w-3 h-3 mr-1" /> Criar primeiro contrato
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Parceiro</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="w-20">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contratos.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium">
                          {row.indicacoes?.cliente_nome ?? '—'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {row.indicacoes?.parceiros?.nome_completo ?? '—'}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={row.status} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {row.created_at
                            ? format(new Date(row.created_at), 'dd/MM/yyyy', { locale: ptBR })
                            : '—'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditContrato(row)}
                            className="h-7 px-2"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab: Modelos ── */}
        <TabsContent value="modelos" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {modelos.length} modelo{modelos.length !== 1 ? 's' : ''} cadastrado{modelos.length !== 1 ? 's' : ''}
            </p>
            <Button onClick={openNewModelo}>
              <Plus className="w-4 h-4 mr-1" /> Novo Modelo
            </Button>
          </div>

          {modelosLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Carregando modelos...
            </div>
          ) : modelos.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhum modelo de contrato cadastrado.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={openNewModelo}>
                <Plus className="w-3 h-3 mr-1" /> Criar primeiro modelo
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {modelos.map((modelo) => (
                <Card key={modelo.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{modelo.nome}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModelo(modelo)}
                        className="h-7 px-2 flex-shrink-0"
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1" /> Editar
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Criado em {format(new Date(modelo.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-mono bg-secondary/30 rounded p-2 text-[11px] leading-relaxed line-clamp-3">
                      {modelo.conteudo_template.slice(0, 200)}
                      {modelo.conteudo_template.length > 200 ? '...' : ''}
                    </p>
                    {modelo.variaveis?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {modelo.variaveis.map((v: string) => (
                          <Badge key={v} variant="outline" className="text-[10px] font-mono">
                            {v}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ContratoDialog
        open={contratoDialogOpen}
        onOpenChange={setContratoDialogOpen}
        indicacoes={indicacoesAtivas}
        modelos={modelos}
        editing={editingContrato}
        onSaved={() => {
          qc.invalidateQueries({ queryKey: ['crm-contratos'] });
        }}
      />

      <ModeloDialog
        open={modeloDialogOpen}
        onOpenChange={setModeloDialogOpen}
        editing={editingModelo}
        onSaved={() => {
          qc.invalidateQueries({ queryKey: ['crm-modelos'] });
        }}
      />
    </div>
  );
}
