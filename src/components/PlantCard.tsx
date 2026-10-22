import React from 'react';
import {
  Droplets,
  Sun,
  ShieldCheck,
  ShieldAlert,
  Heart,
  MessageCircle,
  Eye,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Plant } from '../types';

interface PlantCardProps {
  plant: Plant;
  onOpenDetail: (plant: Plant) => void;
  onAddToGarden: (plant: Plant) => void;
  isInGarden?: boolean;
}

export const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  onOpenDetail,
  onAddToGarden,
  isInGarden = false,
}) => {
  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use first WhatsApp number +56993714077
    const phone = '56993714077';
    const text = encodeURIComponent(
      `¡Hola Green House! Me encantó la planta *${plant.name}* que vi en su catálogo web. ¿Tienen disponible para coordinar retiro o entrega? ¡Muchas gracias!`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div
      onClick={() => onOpenDetail(plant)}
      className="group relative bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
    >
      {/* Top Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
        <img
          src={plant.imageUrl}
          alt={plant.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient overlay for badges readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1 pointer-events-none">
          {/* Stock status */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-xs ${
              plant.inStock
                ? 'bg-[#16A01A]/90 text-white'
                : 'bg-stone-800/85 text-stone-200'
            }`}
          >
            {plant.inStock ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Disponible</span>
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5" />
                <span>Agotada temporalmente</span>
              </>
            )}
          </span>

          {/* Add to garden bookmark */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToGarden(plant);
            }}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
              isInGarden
                ? 'bg-[#E643AC] text-white shadow-md'
                : 'bg-white/90 text-stone-600 hover:text-[#E643AC] hover:bg-white'
            }`}
            title={isInGarden ? 'Guardada en Mi Jardín' : 'Guardar en Mi Jardín'}
            aria-label="Guardar en Mi Jardín"
          >
            <Heart className={`w-4 h-4 ${isInGarden ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Category & Pet Friendly pills at bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 pointer-events-none">
          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/90 text-stone-800 backdrop-blur-xs">
            {plant.category}
          </span>
          {plant.isPetFriendly ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100/90 text-emerald-900 backdrop-blur-xs">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Pet Friendly
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100/90 text-amber-900 backdrop-blur-xs">
              <ShieldAlert className="w-3 h-3 text-amber-600" />
              Precaución mascotas
            </span>
          )}
        </div>
      </div>

      {/* Card Body (Values/Prices eliminated as requested) */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900 leading-snug group-hover:text-[#16A01A] transition-colors">
              {plant.name}
            </h3>
            <p className="text-xs italic text-stone-500 font-serif mt-0.5">
              {plant.scientificName}
            </p>
          </div>

          <p className="text-xs text-stone-600 mt-2.5 line-clamp-2 leading-relaxed">
            {plant.description}
          </p>

          {/* Quick Care Snapshot */}
          <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px] text-stone-600">
            <div className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate" title={plant.careLight}>
                {plant.careLight.split('.')[0]}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span className="truncate" title={plant.careWater}>
                {plant.careWater.split('.')[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex items-center gap-2">
          <button
            onClick={() => onOpenDetail(plant)}
            className="flex-1 py-2.5 px-3 rounded-xl border border-stone-200 text-stone-700 hover:text-stone-900 hover:border-stone-300 hover:bg-stone-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Cuidados</span>
          </button>
          <button
            onClick={handleWhatsAppInquiry}
            className="py-2.5 px-3.5 rounded-xl bg-[#16A01A] hover:bg-[#127e15] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            title="Consultar por WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Consultar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
