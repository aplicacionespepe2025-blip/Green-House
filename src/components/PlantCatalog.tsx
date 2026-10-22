import React, { useState, useMemo } from 'react';
import {
  Filter,
  CheckCircle2,
  SlidersHorizontal,
  Search,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Plant, UserPlant } from '../types';
import { PlantCard } from './PlantCard';

interface PlantCatalogProps {
  plants: Plant[];
  userPlants: UserPlant[];
  onOpenDetail: (plant: Plant) => void;
  onAddToGarden: (plant: Plant) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const PlantCatalog: React.FC<PlantCatalogProps> = ({
  plants,
  userPlants,
  onOpenDetail,
  onAddToGarden,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
}) => {
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'name-desc'>('featured');

  // Categories list
  const categories = [
    'Todas',
    'Interior',
    'Exterior',
    'Floración',
    'Colgantes',
    'Aromáticas',
    'Arbustos y Árboles',
  ];

  // Filtered and sorted plants
  const filteredPlants = useMemo(() => {
    return plants
      .filter((plant) => {
        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = plant.name.toLowerCase().includes(q);
          const matchSci = plant.scientificName?.toLowerCase().includes(q);
          const matchCat = plant.category.toLowerCase().includes(q);
          const matchDesc = plant.description.toLowerCase().includes(q);
          if (!matchName && !matchSci && !matchCat && !matchDesc) return false;
        }

        // Category
        if (selectedCategory === 'Pet Friendly') {
          if (!plant.isPetFriendly) return false;
        } else if (selectedCategory !== 'Todas') {
          if (plant.category !== selectedCategory) return false;
        }

        // Only in stock
        if (onlyInStock && !plant.inStock) {
          return false;
        }

        // Pet friendly checkbox
        if (petFriendlyOnly && !plant.isPetFriendly) {
          return false;
        }

        // Difficulty
        if (difficultyFilter !== 'all' && plant.difficulty !== difficultyFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        // Featured default: featured first, then in-stock first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.inStock && !b.inStock) return -1;
        if (!a.inStock && b.inStock) return 1;
        return 0;
      });
  }, [
    plants,
    searchQuery,
    selectedCategory,
    onlyInStock,
    petFriendlyOnly,
    difficultyFilter,
    sortBy,
  ]);

  const gardenPlantIds = new Set(userPlants.map((up) => up.plantId));

  const handleClearFilters = () => {
    onSearchChange('');
    onSelectCategory('Todas');
    setOnlyInStock(false);
    setPetFriendlyOnly(false);
    setDifficultyFilter('all');
    setSortBy('featured');
  };

  return (
    <section id="catalogo" className="py-16 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#16A01A]/10 text-[#16A01A] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Colección Botánica
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Catálogo de Especies Green House
            </h2>
            <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-xl">
              Explora nuestras plantas. Cada una incluye su ficha técnica detallada con cuidados específicos de luz, riego y sustrato.
            </p>
          </div>

          <div className="text-xs text-stone-500 bg-white px-4 py-2.5 rounded-2xl border border-stone-200 shadow-xs shrink-0 self-start md:self-auto">
            Mostrando <strong className="text-stone-900">{filteredPlants.length}</strong> de {plants.length} plantas
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-8 space-y-4">
          {/* Categories Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`py-2 px-4 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#16A01A] text-white shadow-xs'
                    : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary filter & sort bar (without price options) */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              {/* Only in stock toggle */}
              <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700 hover:text-stone-900 select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-[#16A01A] focus:ring-[#16A01A] w-4 h-4 cursor-pointer"
                />
                <span>Solo disponibles</span>
              </label>

              {/* Pet friendly toggle */}
              <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700 hover:text-stone-900 select-none">
                <input
                  type="checkbox"
                  checked={petFriendlyOnly}
                  onChange={(e) => setPetFriendlyOnly(e.target.checked)}
                  className="rounded text-[#16A01A] focus:ring-[#16A01A] w-4 h-4 cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#16A01A]" />
                  Pet Friendly
                </span>
              </label>

              {/* Difficulty dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-stone-400">Dificultad:</span>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="py-1 px-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 text-xs focus:outline-hidden"
                >
                  <option value="all">Todas</option>
                  <option value="Muy fácil">Muy fácil</option>
                  <option value="Fácil">Fácil</option>
                  <option value="Moderado">Moderado</option>
                  <option value="Experto">Experto</option>
                </select>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-400">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-1.5 px-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 text-xs font-semibold focus:outline-hidden"
              >
                <option value="featured">Destacadas</option>
                <option value="name-asc">Nombre (A - Z)</option>
                <option value="name-desc">Nombre (Z - A)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Plants Grid */}
        <div className="mt-8">
          {filteredPlants.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-stone-300">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-800">
                No encontramos plantas con estos filtros
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Prueba buscando otro nombre o seleccionando otra categoría.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 py-2 px-4 rounded-xl bg-stone-900 text-white text-xs font-semibold shadow-xs"
              >
                Limpiar todos los filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlants.map((plant) => (
                <PlantCard
                  key={plant.id}
                  plant={plant}
                  onOpenDetail={onOpenDetail}
                  onAddToGarden={onAddToGarden}
                  isInGarden={gardenPlantIds.has(plant.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
