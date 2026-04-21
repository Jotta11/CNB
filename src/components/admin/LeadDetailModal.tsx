// src/components/admin/LeadDetailModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Lead, LeadStatus } from './leads.types';
import { tipoLabels, statusColors, statusLabels } from './leads.types';

interface LeadDetailModalProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
}

const LeadDetailModal = ({ lead, open, onOpenChange, onStatusChange }: LeadDetailModalProps) => {
  const utmString = lead
    ? [lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(' / ')
    : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {lead && (
          <>
            <DialogHeader className="bg-primary -mx-6 -mt-6 px-6 pt-6 pb-4 rounded-t-lg">
              <DialogTitle className="text-primary-foreground text-xl">{lead.nome}</DialogTitle>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="border-white/40 text-white bg-white/10">
                  {tipoLabels[lead.tipo]}
                </Badge>
                <Badge className={`${statusColors[lead.status]} text-white`}>
                  {statusLabels[lead.status]}
                </Badge>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Telefone</p>
                <a href={`tel:${lead.telefone}`} className="font-medium hover:text-primary text-sm">
                  {lead.telefone}
                </a>
              </div>

              {lead.localizacao && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Localização</p>
                  <p className="font-medium text-sm">{lead.localizacao}</p>
                </div>
              )}

              {lead.fazenda && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Fazenda</p>
                  <p className="font-medium text-sm">{lead.fazenda}</p>
                </div>
              )}

              {lead.numero_cabecas != null && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Cabeças</p>
                  <p className="font-medium text-sm">{lead.numero_cabecas} cabeças</p>
                </div>
              )}

              {lead.tipo_cultura && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Cultura</p>
                  <p className="font-medium text-sm">{lead.tipo_cultura}</p>
                </div>
              )}

              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Cadastro</p>
                <p className="font-medium text-sm">
                  {format(new Date(lead.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>

              {utmString && (
                <div className="bg-muted/50 rounded-lg p-3 col-span-2">
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Canal (UTM)</p>
                  <p className="font-medium text-sm">{utmString}</p>
                </div>
              )}
            </div>

            {lead.mensagem && (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Mensagem</p>
                <p className="text-sm text-muted-foreground">{lead.mensagem}</p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1 btn-whatsapp"
                onClick={() => {
                  const message = `Olá ${lead.nome}! Recebemos seu contato através do nosso site CNB.`;
                  const phone = lead.telefone.replace(/\D/g, '');
                  window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank');
                }}
              >
                <Phone className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>

              <Select
                value={lead.status}
                onValueChange={(v) => onStatusChange(lead.id, v as LeadStatus)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="novo">Novo</SelectItem>
                  <SelectItem value="em_contato">Em Contato</SelectItem>
                  <SelectItem value="convertido">Convertido</SelectItem>
                  <SelectItem value="perdido">Perdido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailModal;
