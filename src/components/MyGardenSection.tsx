import React, { useState } from 'react';
import {
  Heart,
  Droplets,
  Calendar,
  Sparkles,
  CheckCircle,
  Plus,
  Trash2,
  FileText,
  Clock,
  AlertTriangle,
  User,
  LogIn,
} from 'lucide-react';
import { UserPlant, Plant } from '../types';
import {
  waterPlantRecord,
  removePlantFromGarden,
  addPlantToGarden,
} from '../services/gardenService';

interface MyGardenSectionProps {
  userPlants: UserPlant[];
  catalogPlants: Plant[];
  userId: string | null;
  userEmail: string | null;
  onSignIn: () => void;
  onOpenPlantModal: (plant: Plant) => void;
}

export const MyGardenSection: React.FC<MyGardenSectionProps> = ({
  userPlants,
  catalogPlants,
  userId,
  userEmail,
  onSignIn,
  onOpenPlantModal,
}) => {
  const [selectedCatalogId, setSelectedCatalogId] = useState('');
  const [customNickname, setCustomNickname] = useState('');
  const [waterInterval, setWaterInterval] = useState(7);
  const [notes, setNotes] = useState('');
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleWater = async (recordId: string) => {
    setActionLoading(recordId);
    try {
      await waterPlantRecord(userId, recordId);
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemove = async (recordId: string) => {
    if (confirm('¿Deseas quitar esta planta de tu jardín personal?')) {
      try {
        await removePlantFromGarden(userId, recordId);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatalogId) return;

    const plant = catalogPlants.find((p) => p.id === selectedCatalogId);
    if (!plant) return;

    try {
      await addPlantToGarden(userId, {
        plantId: plant.id,
        plantName: plant.name,
        nickname: customNickname.trim() || plant.name,
        location: 'Interior / Living',
        lastWatered: new Date().toISOString(),
        waterFrequencyDays: Number(waterInterval) || 7,
        notes: notes.trim(),
      });

      setSelectedCatalogId('');
      setCustomNickname('');
      setNotes('');
      setIsAddingOpen(false);
    } catch (e) {
      console.error(e);
      alert('Error al agregar planta');
    }
  };

  // Helper to calculate watering urgency
  const getWateringStatus = (lastWateredStr: string, frequencyDays: number) => {
    const last = new Date(lastWateredStr).getTime();
    const now = Date.now();
    const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    const daysRemaining = frequencyDays - diffDays;

    if (daysRemaining < 0) {
      return {
        label: `¡Riego atrasado por ${Math.abs(daysRemaining)} días!`,
        urgency: 'high',
        bg: 'bg-rose-50 text-rose-800 border-rose-200',
      };
    } else if (daysRemaining === 0) {
      return {
        label: '¡Toca regar hoy!',
        urgency: 'due_today',
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
      };
    } else {
      return {
        label: `Próximo riego en ${daysRemaining} ${daysRemaining === 1 ? 'día' : 'días'}`,
        urgency: 'ok',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      };
    }
  };

  return (
    <section id="mi-jardin" className="py-16 sm:py-24 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E643AC]/10 text-[#E643AC] mb-3">
              <Heart className="w-3.5 h-3.5 fill-current" />
              Diario Botánico Personal
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Mi Jardín & Recordatorio de Riego
            </h2>
            <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              Guarda las plantas que compraste o tienes en casa. Lleva el registro de cuándo las regaste y recibe alertas para mantenerlas siempre radiantes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!userId ? (
              <button
                onClick={onSignIn}
                className="py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 hover:text-stone-900 hover:bg-stone-50 text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
              >
                <LogIn className="w-4 h-4 text-[#16A01A]" />
                <span>Sincronizar con Google</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs text-stone-600 px-3 py-1.5 rounded-xl bg-stone-100">
                <User className="w-3.5 h-3.5 text-[#16A01A]" />
                <span className="font-medium truncate max-w-[160px]">{userEmail}</span>
              </div>
            )}

            <button
              onClick={() => setIsAddingOpen(!isAddingOpen)}
              className="py-2.5 px-4 rounded-xl bg-[#16A01A] hover:bg-[#127e15] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir a mi diario</span>
            </button>
          </div>
        </div>

        {/* Add Plant to Garden Modal/Inline Form */}
        {isAddingOpen && (
          <form
            onSubmit={handleCreateEntry}
            className="my-8 p-6 rounded-3xl bg-[#FAF8F5] border border-stone-200 shadow-sm animate-in fade-in duration-200"
          >
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-4">
              Registrar una planta en tu jardín
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Selecciona la especie del vivero *
                </label>
                <select
                  required
                  value={selectedCatalogId}
                  onChange={(e) => setSelectedCatalogId(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-stone-300 bg-white text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#16A01A]"
                >
                  <option value="">-- Elige una planta --</option>
                  {catalogPlants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Apodo o lugar (ej. "Living de la abuela")
                </label>
                <input
                  type="text"
                  placeholder="Mi consentida del balcón"
                  value={customNickname}
                  onChange={(e) => setCustomNickname(e.target.value)}
                  maxLength={60}
                  className="w-full py-2.5 px-3 rounded-xl border border-stone-300 bg-white text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#16A01A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Frecuencia de riego recomendada (en días)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={waterInterval}
                  onChange={(e) => setWaterInterval(Number(e.target.value))}
                  className="w-full py-2.5 px-3 rounded-xl border border-stone-300 bg-white text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#16A01A]"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Notas de cuidado o anécdota
              </label>
              <textarea
                rows={2}
                placeholder="Le cambié de maceta el mes pasado, le gusta pulverizarle agua..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={400}
                className="w-full py-2 px-3 rounded-xl border border-stone-300 bg-white text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#16A01A]"
              />
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingOpen(false)}
                className="py-2 px-4 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="py-2 px-5 rounded-xl bg-[#16A01A] hover:bg-[#127e15] text-white text-xs font-semibold shadow-xs"
              >
                Guardar Planta
              </button>
            </div>
          </form>
        )}

        {/* User Garden List */}
        <div className="mt-8">
          {userPlants.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-[#FAF8F5] border border-dashed border-stone-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-100/60 text-[#16A01A] flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-stone-800">
                Tu jardín personal está esperando
              </h3>
              <p className="text-sm text-stone-500 mt-1 max-w-md mx-auto">
                Haz clic en el icono del corazón ❤️ en cualquier planta del catálogo para guardarla aquí y recibir recordatorios de riego.
              </p>
              <button
                onClick={() => {
                  const catalogElem = document.getElementById('catalogo');
                  catalogElem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-5 py-2.5 px-5 rounded-xl bg-[#16A01A] hover:bg-[#127e15] text-white text-xs font-semibold shadow-xs"
              >
                Explorar Catálogo de Plantas
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {userPlants.map((item) => {
                const catalogMatch = catalogPlants.find((p) => p.id === item.plantId);
                const status = getWateringStatus(item.lastWatered, item.waterFrequencyDays);

                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {catalogMatch ? (
                            <img
                              src={catalogMatch.imageUrl}
                              alt={item.plantName}
                              className="w-12 h-12 rounded-2xl object-cover shrink-0 cursor-pointer"
                              onClick={() => onOpenPlantModal(catalogMatch)}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#16A01A] flex items-center justify-center shrink-0">
                              <Heart className="w-6 h-6" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-serif font-bold text-base text-stone-900 leading-snug">
                              {item.nickname || item.plantName}
                            </h4>
                            <p className="text-xs text-stone-500 font-serif">
                              {item.plantName}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Eliminar de mi jardín"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Watering Badge */}
                      <div className={`mt-4 p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium ${status.bg}`}>
                        {status.urgency === 'high' ? (
                          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                        ) : status.urgency === 'due_today' ? (
                          <Clock className="w-4 h-4 shrink-0 text-amber-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 shrink-0 text-[#16A01A]" />
                        )}
                        <span>{status.label}</span>
                      </div>

                      {/* Care Stats */}
                      <div className="mt-3.5 space-y-1.5 text-xs text-stone-600">
                        <div className="flex items-center justify-between">
                          <span className="text-stone-400">Frecuencia:</span>
                          <span className="font-medium text-stone-700">
                            Cada {item.waterFrequencyDays} días
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-stone-400">Último riego:</span>
                          <span className="font-medium text-stone-700">
                            {new Date(item.lastWatered).toLocaleDateString('es-AR', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </div>
                      </div>

                      {item.notes && (
                        <p className="mt-3 p-2.5 rounded-xl bg-stone-50 text-[11px] text-stone-600 italic">
                          "{item.notes}"
                        </p>
                      )}
                    </div>

                    {/* Action */}
                    <div className="mt-5 pt-3 border-t border-stone-100 flex items-center gap-2">
                      <button
                        onClick={() => handleWater(item.id)}
                        disabled={actionLoading === item.id}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#16A01A] hover:bg-[#127e15] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Droplets className="w-3.5 h-3.5 fill-current" />
                        <span>{actionLoading === item.id ? 'Registrando...' : '¡Regada hoy!'}</span>
                      </button>

                      {catalogMatch && (
                        <button
                          onClick={() => onOpenPlantModal(catalogMatch)}
                          className="py-2 px-3 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors"
                        >
                          Cuidados
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
