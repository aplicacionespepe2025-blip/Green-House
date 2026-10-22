import React from 'react';
import {
  Search,
  Droplets,
  Heart,
  Flower2,
  MapPin,
  MessageCircle,
} from 'lucide-react';

interface HeroBannerProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onExploreCatalog: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  search,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onExploreCatalog,
}) => {
  const categories = [
    'Todas',
    'Interior',
    'Floración',
    'Colgantes',
    'Exterior',
    'Aromáticas',
    'Pet Friendly',
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#f7f2eb] to-[#FAF8F5] pt-8 pb-14 sm:pt-12 sm:pb-20 border-b border-stone-200/60">
      {/* Decorative botanical subtle background glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#16A01A]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#E643AC]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Logo Container in a perfect clean circle without modification */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-5 rounded-full overflow-hidden bg-white shadow-xl border-4 border-white ring-2 ring-emerald-200/60 flex items-center justify-center p-1">
            <img
              src="/assets/aistudio/Gemini_Generated_Image_42ogl942ogl942og_2ac01f4f.jpg"
              alt="Logo Green House"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Slogan Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-50 border border-pink-200 shadow-2xs mb-4">
            <Heart className="w-3.5 h-3.5 fill-current text-[#E643AC]" />
            <span className="text-xs font-semibold text-[#E643AC] tracking-wide">
              "Porque amamos las plantas"
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15]">
            Green <span className="text-[#16A01A]">House</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-base sm:text-lg text-stone-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Descubre nuestro catálogo botánico con guías de cuidados específicos para cada especie. Plantas criadas con amor para llenar tu hogar de frescura y armonía.
          </p>

          {/* Main Search Input */}
          <div className="mt-7 max-w-xl mx-auto">
            <div className="relative flex items-center bg-white rounded-2xl shadow-md border border-stone-200/90 p-1.5 focus-within:ring-2 focus-within:ring-[#16A01A] transition-all">
              <Search className="w-5 h-5 text-stone-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Busca por nombre (ej. Cinta, Hortensia, Yuca, Shefflera, Lavanda)..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full py-2.5 px-3 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-hidden bg-transparent"
              />
              {search && (
                <button
                  onClick={() => onSearchChange('')}
                  className="mr-2 text-xs text-stone-400 hover:text-stone-700"
                >
                  Limpiar
                </button>
              )}
              <button
                onClick={onExploreCatalog}
                className="py-2.5 px-5 rounded-xl bg-[#16A01A] hover:bg-[#127e15] text-white text-xs font-bold shrink-0 transition-colors shadow-xs"
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Category Shortcut Pills */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`py-1.5 px-3.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#16A01A] text-white shadow-xs'
                    : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-200/80 shadow-2xs'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Value Propositions without the removed "Inventario en Vivo Firebase" */}
          <div className="mt-10 pt-6 border-t border-stone-200/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 border border-stone-200/70">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#16A01A] flex items-center justify-center shrink-0">
                <Flower2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">Variedad Seleccionada</h4>
                <p className="text-[11px] text-stone-500">Plantas sanas y aclimatadas</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 border border-stone-200/70">
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-[#E643AC] flex items-center justify-center shrink-0">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">Cuidados por Especie</h4>
                <p className="text-[11px] text-stone-500">Luz, riego y trucos de cultivo</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 border border-stone-200/70">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">Asesoría Directa</h4>
                <p className="text-[11px] text-stone-500">WhatsApp directo y personalizado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
