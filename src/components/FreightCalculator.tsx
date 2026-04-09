import { AlertTriangle, Truck, MapPin, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useFreightRates } from '@/hooks/useFreightRates';
import { getDistanceBetweenStates, formatDistance } from '@/utils/distance';
import type { Lote } from '@/hooks/useLotes';

interface FreightCalculatorProps {
  lote: Lote & { localizacao?: string };
  onClose?: () => void;
}

const IMPLEMENTO_LABELS: Record<string, string> = {
  'nove_eixos': '9 eixos',
  'truck': 'Truck',
  'bitrem': 'Bitrem',
};

const FreightCalculator = ({ lote, onClose }: FreightCalculatorProps) => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { getRateForRegion } = useFreightRates();

  const loteLocation = lote.localizacao || lote.estado || 'Tocantins';
  const userRegion = profile?.regiao;
  const distance = userRegion ? getDistanceBetweenStates(userRegion, loteLocation) : null;

  // Calculate freight values
  const valorKm = getRateForRegion(loteLocation, lote.tipo_implemento || 'nove_eixos');
  const capacidadeCarga = lote.capacidade_carga || 96;
  const qtdCarretas = lote.qtd_carretas || 1;
  const tipoImplemento = lote.tipo_implemento || 'nove_eixos';

  // Freight calculation
  const custoFreteTotal = distance ? distance * valorKm * qtdCarretas : 0;
  const fretePorCabeca = capacidadeCarga > 0 ? custoFreteTotal / capacidadeCarga : 0;
  const precoLivre = lote.preco;
  const precoPosto = precoLivre + fretePorCabeca;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Content for non-authenticated users
  if (!user) {
    return (
      <div className="bg-muted/50 rounded-xl p-6 border border-border">
        <h3 className="font-display text-2xl text-primary mb-4">Cálculo do Preço Posto</h3>
        
        <div className="relative">
          {/* Blurred content */}
          <div className="blur-md select-none pointer-events-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-card p-4 rounded-lg">
                <span className="text-sm text-muted-foreground block">Preço</span>
                <span className="font-display text-2xl">R$ XX,XX</span>
                <span className="text-muted-foreground">/cab</span>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <span className="text-sm text-primary block">Preço posto (aprox.)</span>
                <span className="font-display text-2xl text-primary">R$ XX,XX</span>
                <span className="text-primary">/cab</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Distância</span>
                <span>XXX km</span>
              </div>
              <div className="flex justify-between">
                <span>Frete por cabeça</span>
                <span>R$ XXX,XX</span>
              </div>
            </div>
          </div>

          {/* CTA overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Link
              to="/auth"
              onClick={onClose}
              className="flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-primary/90 transition-colors"
            >
              <Lock className="w-5 h-5" />
              <span>Cadastre-se para ver os valores</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Content for authenticated users without region set
  if (!userRegion) {
    return (
      <div className="bg-muted/50 rounded-xl p-6 border border-border">
        <h3 className="font-display text-2xl text-primary mb-4">Cálculo do Preço Posto</h3>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 font-medium">Configure sua localização</p>
            <p className="text-amber-700 text-sm mt-1">
              Para calcular o frete até sua propriedade, atualize seu perfil com a localização.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/50 rounded-xl p-6 border border-border">
      <h3 className="font-display text-2xl text-primary mb-4">Cálculo do Preço Posto</h3>
      
      {/* Warning banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 mb-6">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-800 font-medium">Atenção:</p>
          <p className="text-amber-700 text-sm">
            Os valores podem sofrer alteração dependendo da data do transporte, disponibilidade das carretas e condições logísticas.
          </p>
        </div>
      </div>

      {/* Price comparison cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-card p-4 rounded-lg border border-border">
          <span className="text-sm text-muted-foreground block mb-1">Preço</span>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-xl sm:text-2xl">{formatPrice(precoLivre)}</span>
            <span className="text-muted-foreground text-sm">/cab</span>
          </div>
        </div>
        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm text-primary font-medium">Preço posto</span>
            <span className="text-xs text-primary/70">(aprox.)</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-xl sm:text-2xl text-primary">{formatPrice(precoPosto)}</span>
            <span className="text-primary/70 text-sm">/cab</span>
          </div>
        </div>
      </div>

      {/* Distance */}
      <div className="mb-6">
        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Distância
        </h4>
        <div className="bg-card rounded-lg p-3 border-l-4 border-primary">
          <span className="font-display text-xl">{distance?.toLocaleString('pt-BR')} km</span>
          <span className="text-muted-foreground text-sm ml-2">
            ({loteLocation} → {userRegion})
          </span>
        </div>
      </div>

      {/* Load composition */}
      <div className="mb-6">
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4 text-primary" />
          Composição de Carga Sugerida
        </h4>
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-3 text-muted-foreground">Capacidade total</td>
                <td className="px-4 py-3 font-semibold text-right">{capacidadeCarga} cabeças</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 text-muted-foreground">Carretas</td>
                <td className="px-4 py-3 text-right">
                  <span className="font-semibold">{qtdCarretas} {IMPLEMENTO_LABELS[tipoImplemento] || tipoImplemento}</span>
                  <ul className="text-sm text-muted-foreground mt-1">
                    <li>• Capacidade máxima de {capacidadeCarga} cabeças</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Values table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Valores</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">R$/cab</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-muted-foreground">Livre</td>
              <td className="px-4 py-3 font-semibold text-right">{formatPrice(precoLivre)}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 text-muted-foreground">Frete estimado</td>
              <td className="px-4 py-3 font-semibold text-right text-amber-600">+ {formatPrice(fretePorCabeca)}</td>
            </tr>
            <tr className="bg-primary/5">
              <td className="px-4 py-3 font-medium text-primary">Preço posto</td>
              <td className="px-4 py-3 font-bold text-right text-primary">{formatPrice(precoPosto)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Additional info */}
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Valor do km: {formatPrice(valorKm)}/km • Este valor é uma estimativa e pode variar
      </p>
    </div>
  );
};

export default FreightCalculator;
