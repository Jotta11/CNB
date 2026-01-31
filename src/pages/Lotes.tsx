import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Filter, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import LoteCard from '@/components/LoteCard';
import { useLotes, type Lote } from '@/hooks/useLotes';
import { lotes as fallbackLotes } from '@/data/lotes';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const racas = ['Todas', 'Nelore', 'Angus', 'Brahman', 'Senepol', 'Tabapuã', 'Guzerá'];
const sexos = ['Todos', 'Macho', 'Fêmea'];

const Lotes = () => {
  const { lotes: dbLotes, loading } = useLotes();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRaca, setSelectedRaca] = useState('Todas');
  const [selectedSexo, setSelectedSexo] = useState('Todos');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [quantityRange, setQuantityRange] = useState<[number, number]>([1, 500]);
  const [showFilters, setShowFilters] = useState(false);

  // Use DB lotes if available, otherwise use fallback data
  const displayLotes: Lote[] = dbLotes.length > 0 ? dbLotes : fallbackLotes.map(l => ({
    ...l,
    preco: l.preco,
    video_url: null,
    imagem_url: null,
    ativo: true,
    ordem: 0,
    localizacao: l.localizacao || 'Tocantins',
    capacidade_carga: l.capacidade_carga || 96,
    tipo_implemento: l.tipo_implemento || 'nove_eixos',
    qtd_carretas: l.qtd_carretas || 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  // Calculate max values for sliders
  const maxPrice = useMemo(() => {
    const max = Math.max(...displayLotes.map(l => l.preco));
    return Math.ceil(max / 1000) * 1000;
  }, [displayLotes]);

  const maxQuantity = useMemo(() => {
    return Math.max(...displayLotes.map(l => l.quantidade));
  }, [displayLotes]);

  // Filter lotes
  const filteredLotes = useMemo(() => {
    return displayLotes.filter(lote => {
      const matchesSearch = lote.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lote.raca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lote.numero.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRaca = selectedRaca === 'Todas' || lote.raca === selectedRaca;
      const matchesSexo = selectedSexo === 'Todos' || lote.sexo === selectedSexo;
      const matchesPrice = lote.preco >= priceRange[0] && lote.preco <= priceRange[1];
      const matchesQuantity = lote.quantidade >= quantityRange[0] && lote.quantidade <= quantityRange[1];

      return matchesSearch && matchesRaca && matchesSexo && matchesPrice && matchesQuantity;
    });
  }, [displayLotes, searchTerm, selectedRaca, selectedSexo, priceRange, quantityRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRaca('Todas');
    setSelectedSexo('Todos');
    setPriceRange([0, maxPrice]);
    setQuantityRange([1, maxQuantity]);
  };

  const hasActiveFilters = searchTerm || selectedRaca !== 'Todas' || selectedSexo !== 'Todos' ||
                          priceRange[0] > 0 || priceRange[1] < maxPrice ||
                          quantityRange[0] > 1 || quantityRange[1] < maxQuantity;

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link to="/">
              <Button variant="ghost" className="mb-4 text-primary hover:text-primary/80">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao início
              </Button>
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
              Todos os Lotes
            </h1>
            <p className="text-muted-foreground">
              Encontre o lote ideal para você com nossos filtros avançados
            </p>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por título, raça ou número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Quick filters */}
              <div className="flex gap-3">
                <Select value={selectedRaca} onValueChange={setSelectedRaca}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue>
                      {selectedRaca === 'Todas' ? 'Raça' : selectedRaca}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {racas.map((raca) => (
                      <SelectItem key={raca} value={raca}>
                        {raca}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSexo} onValueChange={setSelectedSexo}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue>
                      {selectedSexo === 'Todos' ? 'Sexo' : selectedSexo}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {sexos.map((sexo) => (
                      <SelectItem key={sexo} value={sexo}>
                        {sexo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant={showFilters ? 'default' : 'outline'}
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Mais filtros</span>
                </Button>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Limpar</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Price Range */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Faixa de Preço</label>
                    <span className="text-sm text-muted-foreground">
                      {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                    </span>
                  </div>
                  <Slider
                    value={priceRange}
                    min={0}
                    max={maxPrice}
                    step={1000}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="w-full"
                  />
                </div>

                {/* Quantity Range */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Quantidade de Cabeças</label>
                    <span className="text-sm text-muted-foreground">
                      {quantityRange[0]} - {quantityRange[1]}
                    </span>
                  </div>
                  <Slider
                    value={quantityRange}
                    min={1}
                    max={maxQuantity}
                    step={1}
                    onValueChange={(value) => setQuantityRange(value as [number, number])}
                    className="w-full"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Results count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              {loading ? 'Carregando...' : `${filteredLotes.length} lote${filteredLotes.length !== 1 ? 's' : ''} encontrado${filteredLotes.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Lotes Grid - Horizontal cards */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredLotes.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredLotes.map((lote, index) => (
                <LoteCard
                  key={lote.id}
                  lote={lote}
                  index={index}
                  horizontal
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-xl text-muted-foreground mb-4">
                Nenhum lote encontrado com os filtros selecionados
              </p>
              <Button onClick={clearFilters}>
                Limpar filtros
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Lotes;
