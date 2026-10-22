import React, { useState } from 'react';
import {
  Sun,
  Droplets,
  Calendar,
  Sparkles,
  ShieldCheck,
  Bug,
  ThermometerSnowflake,
  Flame,
  Check,
} from 'lucide-react';

export const CareGuideSection: React.FC = () => {
  const [activeSeason, setActiveSeason] = useState<'primavera' | 'verano' | 'otono' | 'invierno'>('primavera');

  const seasons = [
    {
      id: 'primavera' as const,
      label: 'Primavera',
      icon: Sparkles,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      tips: [
        'Despertar vegetativo: Aumenta la frecuencia de riego gradualmente.',
        'Época ideal para trasplantes y cambio de maceta con compost fresco.',
        'Abona cada 15 días con fertilizante orgánico o humus de lombriz.',
        'Poda ramas secas de invierno para favorecer nuevos brotes.',
      ],
    },
    {
      id: 'verano' as const,
      label: 'Verano',
      icon: Flame,
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      tips: [
        'Riega temprano en la mañana o al atardecer, nunca bajo el sol pico.',
        'Protege plantas de hojas tiernas del sol ardiente con semisombra.',
        'Pulveriza el follaje en especies de interior como helechos y marantas.',
        'Vigila la aparición de plagas como cochinilla y pulgón.',
      ],
    },
    {
      id: 'otono' as const,
      label: 'Otoño',
      icon: Calendar,
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      tips: [
        'Comienza a espaciar los riegos conforme bajan las temperaturas.',
        'Entra a resguardo las especies tropicales antes de las primeras heladas.',
        'Suspende la fertilización nitrogenada para que los tallos lignifiquen.',
        'Aprovecha para plantar bulbos de floración invernal como la violeta de los Alpes.',
      ],
    },
    {
      id: 'invierno' as const,
      label: 'Invierno',
      icon: ThermometerSnowflake,
      color: 'bg-sky-100 text-sky-800 border-sky-300',
      tips: [
        'Riego mínimo: deja secar muy bien el sustrato antes de volver a regar.',
        'Usa agua a temperatura ambiente, nunca agua helada de canilla directa.',
        'Aleja las macetas de estufas, caloventores y corrientes heladas.',
        'Limpia el polvo de las hojas para maximizar la absorción de luz reducida.',
      ],
    },
  ];

  return (
    <section id="cuidados" className="py-16 sm:py-24 bg-gradient-to-b from-[#FAF8F5] via-white to-[#FAF8F5] border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#16A01A]/10 text-[#16A01A] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Secretos del Vivero Familiar
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Consejos de Cuidado & Sabiduría Botánica
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
            Tres generaciones cultivando con amor. Queremos que cada planta que lleves a tu hogar prospere y te acompañe por muchos años.
          </p>
        </div>

        {/* 3 Golden Rules Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rule 1 */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              1. La Prueba del Dedo
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
              Mueren muchas más plantas por exceso de agua que por falta de ella. Introduce un dedo 3 cm en la tierra: si sale húmedo y con tierra adherida, no riegues. Si sale seco y limpio, es momento de hidratar.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              2. La Regla de la Luz
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
              "Luz indirecta brillante" significa que un libro se puede leer cómodamente sin encender la lámpara, pero sin que los rayos solares peguen directo en las hojas como una lupa ardiente.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#E643AC] flex items-center justify-center mb-4">
              <Bug className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              3. Receta Eco Casera
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
              Disuelve 1 cucharada sopera de jabón blanco neutro rallado en 1 litro de agua tibia con 1 cucharadita de alcohol. Pulveriza al caer la tarde para eliminar cochinillas y pulgones sin químicos tóxicos.
            </p>
          </div>
        </div>

        {/* Seasonal Care Interactive Tabs */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Calendario Estacional de Mantenimiento
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Adapta las tareas de tu jardín o balcón según la época del año
              </p>
            </div>

            {/* Season Selector */}
            <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-stone-100">
              {seasons.map((s) => {
                const IconComponent = s.icon;
                const isActive = activeSeason === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSeason(s.id)}
                    className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Season Tips */}
          <div className="mt-6">
            {seasons
              .filter((s) => s.id === activeSeason)
              .map((s) => (
                <div key={s.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {s.tips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#16A01A]/10 text-[#16A01A] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};
