import React from 'react';
import {
  X,
  Droplets,
  Sun,
  Thermometer,
  Layers,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Heart,
  MessageCircle,
  Share2,
  CheckCircle2,
  XCircle,
  Gauge,
} from 'lucide-react';
import { Plant } from '../types';

interface PlantDetailModalProps {
  plant: Plant | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToGarden: (plant: Plant) => void;
  isInGarden?: boolean;
}

export const PlantDetailModal: React.FC<PlantDetailModalProps> = ({
  plant,
  isOpen,
  onClose,
  onAddToGarden,
  isInGarden = false,
}) => {
  if (!isOpen || !plant) return null;

  const handleWhatsApp = (phone = '56993714077') => {
    const message = encodeURIComponent(
      `¡Hola Green House! Me gustaría consultar sobre la planta *${plant.name}* que vi en su catálogo web. ¿Tienen disponible para coordinar retiro o entrega? ¡Muchas gracias!`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${plant.name} - Green House`,
          text: `Mira esta hermosa ${plant.name} con su guía de cuidados en Green House: "Porque amamos las plantas".`,
          url: window.location.href,
        });
      } catch (e) {
        // Ignored
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-auto text-stone-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-md transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Section */}
        <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-stone-900">
          <img
            src={plant.imageUrl}
            alt={plant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

          {/* Hero Content Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col justify-end">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E643AC] text-white">
                {plant.category}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                  plant.inStock ? 'bg-[#16A01A]' : 'bg-stone-700'
                }`}
              >
                {plant.inStock ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Disponible en vivero
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    Sin stock temporal
                  </>
                )}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
              {plant.name}
            </h2>
            <p className="text-sm italic font-serif text-stone-300 mt-0.5">
              {plant.scientificName}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[calc(88vh-20rem)] overflow-y-auto">
          {/* Action Header without price */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                🌱 {plant.category}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 text-stone-700">
                Dificultad: {plant.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onAddToGarden(plant)}
                className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isInGarden
                    ? 'bg-[#E643AC] text-white shadow-xs'
                    : 'bg-pink-50 text-[#E643AC] hover:bg-pink-100 border border-pink-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${isInGarden ? 'fill-current' : ''}`} />
                <span>{isInGarden ? 'En Mi Jardín' : 'Añadir a Mi Jardín'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                title="Compartir ficha"
                aria-label="Compartir"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
              Sobre esta especie
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              {plant.description}
            </p>
          </div>

          {/* Specific Care Guide Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Guía de Cuidados Específicos
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Luz */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                    Luz Solar
                  </h4>
                  <p className="text-xs text-stone-700 mt-1 leading-normal">
                    {plant.careLight}
                  </p>
                </div>
              </div>

              {/* Riego */}
              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200/60 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-sky-100 text-sky-700 shrink-0">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-sky-950 uppercase tracking-wider">
                    Pauta de Riego
                  </h4>
                  <p className="text-xs text-stone-700 mt-1 leading-normal">
                    {plant.careWater}
                  </p>
                </div>
              </div>

              {/* Temperatura */}
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/60 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                    Temperatura y Clima
                  </h4>
                  <p className="text-xs text-stone-700 mt-1 leading-normal">
                    {plant.careTemp}
                  </p>
                </div>
              </div>

              {/* Sustrato */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    Sustrato y Drenaje
                  </h4>
                  <p className="text-xs text-stone-700 mt-1 leading-normal">
                    {plant.careSubstrate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Golden Care Secret */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-pink-50 to-amber-50 border border-pink-200 flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#E643AC] text-white shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#E643AC] uppercase tracking-wider flex items-center gap-1.5">
                Consejo de Oro Green House
              </h4>
              <p className="text-xs sm:text-sm text-stone-800 mt-1 font-medium leading-relaxed">
                "{plant.careTips}"
              </p>
            </div>
          </div>

          {/* Pet Toxicity Note */}
          <div
            className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
              plant.isPetFriendly
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/70 border-amber-200 text-amber-900'
            }`}
          >
            {plant.isPetFriendly ? (
              <>
                <ShieldCheck className="w-5 h-5 text-[#16A01A] shrink-0" />
                <p className="text-xs leading-normal">
                  <strong className="font-semibold">Planta segura para mascotas:</strong> No contiene toxinas conocidas perjudiciales para perros y gatos.
                </p>
              </>
            ) : (
              <>
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-xs leading-normal">
                  <strong className="font-semibold">Precaución con mascotas:</strong> Mantener fuera del alcance de perros o gatos mordedores por savia irritante.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Bottom Action Footer with WhatsApp options */}
        <div className="p-5 sm:p-6 bg-white border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-stone-500 text-center sm:text-left">
            Escríbenos a cualquiera de nuestros dos teléfonos para consultar disponibilidad o encargo.
          </p>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleWhatsApp('56993714077')}
              className="flex-1 sm:flex-initial py-3 px-5 rounded-2xl bg-[#16A01A] hover:bg-[#127e15] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp 1 (+56 9 9371 4077)</span>
            </button>
            <button
              onClick={() => handleWhatsApp('56941546441')}
              className="flex-1 sm:flex-initial py-3 px-5 rounded-2xl bg-stone-800 hover:bg-stone-900 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-current text-emerald-400" />
              <span>WhatsApp 2 (+56 9 4154 6441)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
