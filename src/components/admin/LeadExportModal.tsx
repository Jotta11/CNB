// src/components/admin/LeadExportModal.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import type { Lead, LeadTipo } from './leads.types';
import { tipoLabels } from './leads.types';

interface LeadExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: Set<string>;
  allLeads: Lead[];
}

type ExportScope = 'selecionados' | 'todos' | 'por_canal';

const ALL_TIPOS: LeadTipo[] = ['comprar', 'vender', 'tabela_precos', 'ofertas_direcionadas'];

function leadsToCSV(leads: Lead[]): string {
  const headers: (keyof Lead)[] = [
    'id', 'nome', 'telefone', 'tipo', 'status', 'fazenda',
    'localizacao', 'tipo_cultura', 'numero_cabecas', 'mensagem',
    'utm_source', 'utm_medium', 'utm_campaign', 'created_at',
  ];

  const escape = (v: unknown): string => {
    const s = v == null ? '' : String(v);
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };

  const rows = leads.map(l => headers.map(h => escape(l[h])).join(','));
  return [headers.join(','), ...rows].join('\n');
}

function downloadCSV(content: string): void {
  const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `leads-cnb-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const LeadExportModal = ({ open, onOpenChange, selectedIds, allLeads }: LeadExportModalProps) => {
  const [scope, setScope] = useState<ExportScope>('todos');
  const [selectedTipos, setSelectedTipos] = useState<Set<LeadTipo>>(new Set(ALL_TIPOS));

  useEffect(() => {
    if (open) {
      setScope('todos');
      setSelectedTipos(new Set(ALL_TIPOS));
    }
  }, [open]);

  const toggleTipo = (tipo: LeadTipo) => {
    setSelectedTipos(prev => {
      const next = new Set(prev);
      next.has(tipo) ? next.delete(tipo) : next.add(tipo);
      return next;
    });
  };

  const countByTipo = (tipo: LeadTipo) => allLeads.filter(l => l.tipo === tipo).length;

  const getLeadsToExport = (): Lead[] => {
    if (scope === 'selecionados') return allLeads.filter(l => selectedIds.has(l.id));
    if (scope === 'todos') return allLeads;
    return allLeads.filter(l => selectedTipos.has(l.tipo));
  };

  const exportCount = getLeadsToExport().length;
  const canExport = exportCount > 0 && (scope !== 'por_canal' || selectedTipos.size > 0);

  const handleExport = () => {
    downloadCSV(leadsToCSV(getLeadsToExport()));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Exportar leads (CSV)</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">O que exportar</p>
            <RadioGroup
              value={scope}
              onValueChange={(v) => setScope(v as ExportScope)}
              className="space-y-2"
            >
              <label
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                  ${scope === 'selecionados' ? 'bg-primary/5 border-primary/30' : 'border-border'}
                  ${selectedIds.size === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RadioGroupItem value="selecionados" disabled={selectedIds.size === 0} />
                <span className="text-sm">Selecionados ({selectedIds.size} leads)</span>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                  ${scope === 'todos' ? 'bg-primary/5 border-primary/30' : 'border-border'}`}
              >
                <RadioGroupItem value="todos" />
                <span className="text-sm">Todos os leads ({allLeads.length})</span>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                  ${scope === 'por_canal' ? 'bg-primary/5 border-primary/30' : 'border-border'}`}
              >
                <RadioGroupItem value="por_canal" />
                <span className="text-sm">Por canal</span>
              </label>
            </RadioGroup>
          </div>

          {scope === 'por_canal' && (
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Canais</p>
              <div className="space-y-2">
                {ALL_TIPOS.map(tipo => (
                  <label
                    key={tipo}
                    className="flex items-center gap-3 p-2 rounded-lg border border-border cursor-pointer hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={selectedTipos.has(tipo)}
                      onCheckedChange={() => toggleTipo(tipo)}
                    />
                    <span className="text-sm flex-1">{tipoLabels[tipo]}</span>
                    <span className="text-xs text-muted-foreground">{countByTipo(tipo)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <Button className="w-full" disabled={!canExport} onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Baixar CSV{canExport ? ` (${exportCount} leads)` : ''}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadExportModal;
