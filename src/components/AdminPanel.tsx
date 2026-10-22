import React, { useState, useRef } from 'react';
import {
  Shield,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Bell,
  RefreshCw,
  Search,
  Package,
  Inbox,
  Lock,
  LogOut,
  LogIn,
  X,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  KeyRound,
  Check,
  MessageCircle,
} from 'lucide-react';
import { Plant, Inquiry } from '../types';
import {
  addPlant,
  updatePlant,
  togglePlantStock,
  deletePlant,
  resetCatalogToDefault,
} from '../services/plantsService';
import { updateInquiryStatus, deleteInquiry } from '../services/inquiriesService';
import { dispatchInventoryNotification } from '../services/notificationService';
import { compressImageFile } from '../utils/imageCompressor';
import { getStoredPin, setStoredPin } from './AdminPinModal';

interface AdminPanelProps {
  plants: Plant[];
  inquiries: Inquiry[];
  userEmail: string | null;
  isAdmin: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onClose: () => void;
  onNotifyRestock?: (title: string, body: string, plantId?: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  plants,
  inquiries,
  userEmail,
  isAdmin,
  onSignIn,
  onSignOut,
  onClose,
  onNotifyRestock,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'inquiries' | 'settings'>('inventory');
  const [filterStock, setFilterStock] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing state
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageUploadMode, setImageUploadMode] = useState<'file' | 'url'>('file');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PIN settings state
  const [newPin, setNewPin] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  // Form fields for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    category: 'Interior' as Plant['category'],
    price: 0,
    inStock: true,
    stockCount: 10,
    description: '',
    careLight: '',
    careWater: '',
    careTemp: '',
    careSubstrate: '',
    careTips: '',
    difficulty: 'Fácil' as Plant['difficulty'],
    isPetFriendly: true,
    imageUrl: '',
    featured: false,
  });

  const openAddModal = () => {
    setFormData({
      name: '',
      scientificName: '',
      category: 'Interior',
      price: 0,
      inStock: true,
      stockCount: 10,
      description: '',
      careLight: 'Luz natural abundante sin sol directo.',
      careWater: 'Regar cuando la tierra esté seca al tacto.',
      careTemp: 'Entre 15°C y 25°C.',
      careSubstrate: 'Sustrato fértil con buen drenaje.',
      careTips: 'Mantener alejada de corrientes de aire frío.',
      difficulty: 'Fácil',
      isPetFriendly: true,
      imageUrl: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80',
      featured: false,
    });
    setEditingPlant(null);
    setImageUploadMode('file');
    setIsAddingNew(true);
  };

  const openEditModal = (plant: Plant) => {
    setEditingPlant(plant);
    setFormData({
      name: plant.name,
      scientificName: plant.scientificName || '',
      category: plant.category,
      price: plant.price || 0,
      inStock: plant.inStock,
      stockCount: plant.stockCount,
      description: plant.description,
      careLight: plant.careLight,
      careWater: plant.careWater,
      careTemp: plant.careTemp,
      careSubstrate: plant.careSubstrate,
      careTips: plant.careTips,
      difficulty: plant.difficulty,
      isPetFriendly: plant.isPetFriendly,
      imageUrl: plant.imageUrl,
      featured: !!plant.featured,
    });
    setImageUploadMode(plant.imageUrl.startsWith('data:') ? 'file' : 'url');
    setIsAddingNew(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 900, 0.82);
      setFormData((prev) => ({ ...prev, imageUrl: compressedDataUrl }));
    } catch (err: any) {
      alert(err.message || 'Error al procesar la imagen.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleSavePlant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert('Por favor selecciona una foto (JPG/PNG) o ingresa la URL de la imagen.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingPlant) {
        await updatePlant(editingPlant.id, formData);
        if (!editingPlant.inStock && formData.inStock) {
          dispatchInventoryNotification(
            `¡Reingreso de Stock! 🌱 ${formData.name}`,
            `Ya tenemos ${formData.stockCount} unidades disponibles de ${formData.name} en Green House.`,
            { plantId: editingPlant.id, type: 'restock' }
          );
          if (onNotifyRestock) {
            onNotifyRestock(
              `¡Reingreso de Stock! 🌱 ${formData.name}`,
              `Ya tenemos ${formData.stockCount} unidades disponibles en Green House.`,
              editingPlant.id
            );
          }
        }
      } else {
        const newId = await addPlant(formData);
        dispatchInventoryNotification(
          `¡Nueva Planta en Catálogo! ✨ ${formData.name}`,
          `Acabamos de incorporar ${formData.name} a Green House.`,
          { plantId: newId, type: 'new_plant' }
        );
      }
      setIsAddingNew(false);
      setEditingPlant(null);
    } catch (e) {
      console.error(e);
      alert('Error al guardar la planta en Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStock = async (plant: Plant) => {
    try {
      await togglePlantStock(plant.id, plant.inStock);
      if (!plant.inStock) {
        dispatchInventoryNotification(
          `¡Vuelve a haber stock! 🌱 ${plant.name}`,
          `La planta ${plant.name} ya está disponible para encargo en Green House.`,
          { plantId: plant.id, type: 'restock' }
        );
      }
    } catch (e) {
      console.error(e);
      alert('Error al actualizar stock.');
    }
  };

  const handleDelete = async (plant: Plant) => {
    if (confirm(`¿Seguro que deseas eliminar definitivamente "${plant.name}" del catálogo?`)) {
      try {
        await deletePlant(plant.id);
      } catch (e) {
        console.error(e);
        alert('Error al eliminar la planta.');
      }
    }
  };

  const handleResetCatalog = async () => {
    if (
      confirm(
        '¿Deseas restablecer el catálogo a las 17 plantas originales de Green House? Esto actualizará todos los cuidados.'
      )
    ) {
      try {
        await resetCatalogToDefault();
        alert('¡Catálogo restablecido con éxito a las 17 especies familiares!');
      } catch (e) {
        console.error(e);
        alert('Error al restablecer catálogo.');
      }
    }
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      alert('El PIN debe tener al menos 4 dígitos numéricos.');
      return;
    }
    setStoredPin(newPin);
    setPinChangeSuccess(true);
    setTimeout(() => {
      setPinChangeSuccess(false);
      setNewPin('');
    }, 2500);
  };

  const filteredPlants = plants.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.scientificName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock =
      filterStock === 'all'
        ? true
        : filterStock === 'inStock'
        ? p.inStock
        : !p.inStock;
    return matchesSearch && matchesStock;
  });

  const totalInStock = plants.filter((p) => p.inStock).length;
  const totalOutOfStock = plants.filter((p) => !p.inStock).length;
  const newInquiriesCount = inquiries.filter((i) => i.status === 'nuevo').length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
    >
      <div className="relative w-full max-w-6xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-200 text-stone-800 my-auto flex flex-col max-h-[92vh] overflow-hidden">
        {/* Admin Header */}
        <div className="p-5 sm:p-6 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-white shadow-xs border border-emerald-100 flex items-center justify-center p-0.5 shrink-0">
              <img
                src="/assets/aistudio/Gemini_Generated_Image_42ogl942ogl942og_2ac01f4f.jpg"
                alt="Logo Green House"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-white">
                  Panel Dueño - Green House
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E643AC] text-white">
                  Gestión Privada
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {userEmail ? `Sesión: ${userEmail}` : 'Acceso autorizado al inventario'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSignOut}
              className="py-2 px-3 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-stone-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Bloquear / Salir</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
              aria-label="Cerrar panel de administración"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Inventory Summary Counters */}
        <div className="p-4 sm:p-6 bg-white border-b border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 uppercase block">
              Total Catálogo
            </span>
            <span className="text-2xl font-bold text-stone-900">{plants.length}</span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Especies registradas</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase block">
              En Stock
            </span>
            <span className="text-2xl font-bold text-[#16A01A]">{totalInStock}</span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">Disponibles ahora</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
            <span className="text-[11px] font-semibold text-rose-800 uppercase block">
              Sin Stock
            </span>
            <span className="text-2xl font-bold text-rose-600">{totalOutOfStock}</span>
            <span className="text-[10px] text-rose-700 block mt-0.5">Para reposición</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-200">
            <span className="text-[11px] font-semibold text-[#E643AC] uppercase block">
              Consultas Clientes
            </span>
            <span className="text-2xl font-bold text-[#E643AC]">{newInquiriesCount}</span>
            <span className="text-[10px] text-stone-500 block mt-0.5">Pendientes de respuesta</span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 py-3 bg-[#FAF8F5] border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'inventory'
                  ? 'bg-[#16A01A] text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Inventario de Plantas</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all relative ${
                activeTab === 'inquiries'
                  ? 'bg-[#16A01A] text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Bandeja de Consultas</span>
              {newInquiriesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#E643AC] absolute -top-0.5 -right-0.5" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#16A01A] text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Seguridad / Cambiar PIN</span>
            </button>
          </div>

          {activeTab === 'inventory' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetCatalog}
                className="py-2 px-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Restablece las 17 plantas originales de Green House"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Restablecer 17 Plantas</span>
              </button>

              <button
                onClick={openAddModal}
                className="py-2 px-4 rounded-xl bg-[#E643AC] hover:bg-[#c93293] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Planta</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'inventory' ? (
            <div>
              {/* Search & Stock Filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por planta, categoría..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 bg-white text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#16A01A]"
                  />
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-200/70 text-xs">
                  <button
                    onClick={() => setFilterStock('all')}
                    className={`py-1.5 px-3 rounded-lg font-medium transition-colors ${
                      filterStock === 'all'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Todas ({plants.length})
                  </button>
                  <button
                    onClick={() => setFilterStock('inStock')}
                    className={`py-1.5 px-3 rounded-lg font-medium transition-colors ${
                      filterStock === 'inStock'
                        ? 'bg-white text-[#16A01A] font-bold shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    En stock ({totalInStock})
                  </button>
                  <button
                    onClick={() => setFilterStock('outOfStock')}
                    className={`py-1.5 px-3 rounded-lg font-medium transition-colors ${
                      filterStock === 'outOfStock'
                        ? 'bg-white text-rose-600 font-bold shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Agotadas ({totalOutOfStock})
                  </button>
                </div>
              </div>

              {/* Plants Table */}
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                        <th className="p-3.5">Planta</th>
                        <th className="p-3.5">Categoría</th>
                        <th className="p-3.5">Estado Stock</th>
                        <th className="p-3.5">Dificultad</th>
                        <th className="p-3.5 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredPlants.map((plant) => (
                        <tr key={plant.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={plant.imageUrl}
                                alt={plant.name}
                                className="w-11 h-11 rounded-xl object-cover shrink-0 border border-stone-200"
                              />
                              <div>
                                <span className="font-bold text-stone-900 block text-sm">
                                  {plant.name}
                                </span>
                                <span className="text-[11px] text-stone-400 italic">
                                  {plant.scientificName}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 font-medium text-[11px]">
                              {plant.category}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <button
                              onClick={() => handleToggleStock(plant)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                                plant.inStock
                                  ? 'bg-emerald-100 text-[#16A01A] hover:bg-emerald-200'
                                  : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                              }`}
                              title="Haz clic para alternar stock"
                            >
                              {plant.inStock ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>En Stock ({plant.stockCount})</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Agotada</span>
                                </>
                              )}
                            </button>
                          </td>

                          <td className="p-3.5 text-stone-600">
                            {plant.difficulty}
                          </td>

                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openEditModal(plant)}
                                className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                                title="Editar planta y foto"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(plant)}
                                className="p-2 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                                title="Eliminar del catálogo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === 'inquiries' ? (
            /* Inquiries Tab */
            <div className="space-y-3">
              {inquiries.length === 0 ? (
                <div className="text-center py-12 text-stone-500">
                  <Inbox className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                  <p className="text-sm font-medium">No hay mensajes de contacto aún.</p>
                </div>
              ) : (
                inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">{inq.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            inq.status === 'nuevo'
                              ? 'bg-pink-100 text-[#E643AC]'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {inq.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {inq.email} {inq.phone && `• Tel: ${inq.phone}`}
                      </p>
                      {inq.plantInterest && (
                        <p className="text-xs font-semibold text-[#16A01A] mt-1">
                          Interés: {inq.plantInterest}
                        </p>
                      )}
                      <p className="text-xs text-stone-700 mt-2 bg-stone-50 p-3 rounded-xl">
                        "{inq.message}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {inq.phone && (
                        <button
                          onClick={() => {
                            const cleanPhone = inq.phone?.replace(/[^0-9]/g, '');
                            window.open(
                              `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                `¡Hola ${inq.name}! Te escribimos de Green House por tu consulta.`
                              )}`,
                              '_blank'
                            );
                          }}
                          className="py-1.5 px-3 rounded-xl bg-emerald-50 text-[#16A01A] border border-emerald-200 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      )}

                      <button
                        onClick={async () => {
                          const next = inq.status === 'nuevo' ? 'atendido' : 'nuevo';
                          await updateInquiryStatus(inq.id, next);
                        }}
                        className="py-1.5 px-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold"
                      >
                        {inq.status === 'nuevo' ? 'Marcar Atendido' : 'Marcar Pendiente'}
                      </button>

                      <button
                        onClick={async () => {
                          if (confirm('¿Eliminar mensaje?')) {
                            await deleteInquiry(inq.id);
                          }
                        }}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Eliminar consulta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Settings & PIN Tab */
            <div className="max-w-md mx-auto bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#16A01A] flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900">
                    Seguridad del Panel Dueño
                  </h4>
                  <p className="text-xs text-stone-500">
                    Cambia el PIN numérico de acceso a tu panel
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 mb-5">
                <span className="font-semibold block text-stone-900 mb-0.5">
                  PIN Actual: <code>{getStoredPin()}</code>
                </span>
                Puedes cambiarlo por uno nuevo de 4 o más números para mayor privacidad.
              </div>

              {pinChangeSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs flex items-center gap-2 mb-4">
                  <Check className="w-4 h-4 text-[#16A01A]" />
                  <span>¡PIN de seguridad actualizado con éxito!</span>
                </div>
              ) : null}

              <form onSubmit={handleUpdatePin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nuevo PIN Numérico (4 o más dígitos)
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    required
                    minLength={4}
                    maxLength={8}
                    placeholder="Ej. 7482"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full py-2.5 px-3 rounded-xl border border-stone-300 text-sm tracking-widest font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#16A01A] hover:bg-[#127e15] text-white text-xs font-semibold shadow-xs"
                >
                  Guardar Nuevo PIN
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Add/Edit Plant Modal with Image File Upload & URL support */}
        {(isAddingNew || editingPlant) && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs overflow-y-auto"
            role="dialog"
          >
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 border border-stone-200 text-stone-800 my-auto max-h-[92vh] overflow-y-auto">
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingPlant(null);
                }}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-serif font-bold text-stone-900 mb-1">
                {editingPlant ? `Editar: ${editingPlant.name}` : 'Agregar Nueva Planta al Catálogo'}
              </h3>
              <p className="text-xs text-stone-500 mb-5">
                Sube una foto desde tu equipo (JPG/PNG) o ingresa un enlace, y completa los cuidados.
              </p>

              <form onSubmit={handleSavePlant} className="space-y-4">
                {/* Image Upload / URL Selector Section */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 uppercase">
                      Foto de la Planta (JPG, PNG o URL) *
                    </span>

                    {/* Mode Toggle */}
                    <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl text-xs">
                      <button
                        type="button"
                        onClick={() => setImageUploadMode('file')}
                        className={`py-1 px-2.5 rounded-lg font-medium flex items-center gap-1 transition-colors ${
                          imageUploadMode === 'file'
                            ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <Upload className="w-3 h-3" />
                        <span>Subir Archivo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUploadMode('url')}
                        className={`py-1 px-2.5 rounded-lg font-medium flex items-center gap-1 transition-colors ${
                          imageUploadMode === 'url'
                            ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <LinkIcon className="w-3 h-3" />
                        <span>Pegar URL</span>
                      </button>
                    </div>
                  </div>

                  {/* Mode 1: File Picker */}
                  {imageUploadMode === 'file' ? (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-stone-300 hover:border-[#16A01A] rounded-2xl p-5 text-center cursor-pointer bg-white transition-colors flex flex-col items-center justify-center gap-2 group"
                      >
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#16A01A] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-stone-800">
                            {isProcessingImage
                              ? 'Optimizando foto...'
                              : 'Haz clic aquí para seleccionar archivo JPG o PNG'}
                          </p>
                          <p className="text-[11px] text-stone-400 mt-0.5">
                            Se optimiza automáticamente para cargar rápido en celulares
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Mode 2: Direct URL */
                    <div>
                      <input
                        type="url"
                        placeholder="https://ejemplo.com/mi-planta.jpg"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full py-2 px-3 rounded-xl border border-stone-300 text-xs font-mono bg-white"
                      />
                    </div>
                  )}

                  {/* Preview of current image */}
                  {formData.imageUrl && (
                    <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-stone-200">
                      <img
                        src={formData.imageUrl}
                        alt="Vista previa"
                        className="w-14 h-14 rounded-lg object-cover border border-stone-100"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-semibold text-emerald-800 block">
                          ✓ Foto cargada correctamente
                        </span>
                        <span className="text-[10px] text-stone-400 truncate block">
                          {formData.imageUrl.startsWith('data:') ? 'Imagen local procesada' : formData.imageUrl}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        className="p-1 text-stone-400 hover:text-rose-600 rounded-md"
                        title="Quitar foto"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Nombre Común *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Cinta, Lavanda, Hortensia..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-stone-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Nombre Científico / Botánico
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Chlorophytum comosum"
                      value={formData.scientificName}
                      onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-stone-300 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Categoría *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as Plant['category'],
                        })
                      }
                      className="w-full py-2 px-3 rounded-xl border border-stone-300 text-xs"
                    >
                      <option value="Interior">Interior</option>
                      <option value="Exterior">Exterior</option>
                      <option value="Floración">Floración</option>
                      <option value="Colgantes">Colgantes</option>
                      <option value="Aromáticas">Aromáticas</option>
                      <option value="Sombra">Sombra</option>
                      <option value="Arbustos y Árboles">Arbustos y Árboles</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Cantidad en Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stockCount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stockCount: Number(e.target.value),
                          inStock: Number(e.target.value) > 0,
                        })
                      }
                      className="w-full py-2 px-3 rounded-xl border border-stone-300 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 py-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="rounded text-[#16A01A] focus:ring-[#16A01A]"
                    />
                    <span>Disponible en Stock</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={formData.isPetFriendly}
                      onChange={(e) => setFormData({ ...formData, isPetFriendly: e.target.checked })}
                      className="rounded text-[#16A01A] focus:ring-[#16A01A]"
                    />
                    <span>Pet Friendly (Segura con mascotas)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded text-[#E643AC] focus:ring-[#E643AC]"
                    />
                    <span>Destacada</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-stone-300 text-xs"
                  />
                </div>

                {/* Specific Care Inputs */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <h4 className="text-xs font-bold text-stone-900 uppercase">
                    Cuidados Específicos
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                        Luz Solar
                      </label>
                      <input
                        type="text"
                        value={formData.careLight}
                        onChange={(e) => setFormData({ ...formData, careLight: e.target.value })}
                        className="w-full py-1.5 px-2.5 rounded-lg border border-stone-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                        Pauta de Riego
                      </label>
                      <input
                        type="text"
                        value={formData.careWater}
                        onChange={(e) => setFormData({ ...formData, careWater: e.target.value })}
                        className="w-full py-1.5 px-2.5 rounded-lg border border-stone-300 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                        Temperatura
                      </label>
                      <input
                        type="text"
                        value={formData.careTemp}
                        onChange={(e) => setFormData({ ...formData, careTemp: e.target.value })}
                        className="w-full py-1.5 px-2.5 rounded-lg border border-stone-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                        Sustrato
                      </label>
                      <input
                        type="text"
                        value={formData.careSubstrate}
                        onChange={(e) => setFormData({ ...formData, careSubstrate: e.target.value })}
                        className="w-full py-1.5 px-2.5 rounded-lg border border-stone-300 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                      Consejo de Oro Familiar
                    </label>
                    <input
                      type="text"
                      value={formData.careTips}
                      onChange={(e) => setFormData({ ...formData, careTips: e.target.value })}
                      className="w-full py-1.5 px-2.5 rounded-lg border border-stone-300 text-xs bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingPlant(null);
                    }}
                    className="py-2 px-4 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || isProcessingImage}
                    className="py-2 px-5 rounded-xl bg-[#16A01A] hover:bg-[#127e15] text-white text-xs font-semibold shadow-xs"
                  >
                    {isSaving ? 'Guardando...' : editingPlant ? 'Guardar Cambios' : 'Crear Planta'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
