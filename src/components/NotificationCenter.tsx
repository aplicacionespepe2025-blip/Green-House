import React, { useState } from 'react';
import { Bell, BellRing, Check, Info, Sparkles, X } from 'lucide-react';
import {
  InventoryNotification,
  requestNotificationPermission,
  getNotificationPermissionStatus,
} from '../services/notificationService';

interface NotificationCenterProps {
  notifications: InventoryNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
  onSelectPlant?: (plantId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onClearAll,
  isOpen,
  onClose,
  onSelectPlant,
}) => {
  const [permission, setPermission] = useState<NotificationPermission>(getNotificationPermissionStatus());
  const [requesting, setRequesting] = useState(false);

  const handleRequestPermission = async () => {
    setRequesting(true);
    const result = await requestNotificationPermission();
    setPermission(result);
    setRequesting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs transition-opacity">
      <div 
        className="w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-label="Centro de Notificaciones de Inventario"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#16A01A]/10 text-[#16A01A] flex items-center justify-center">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-base">Alertas de Inventario</h3>
              <p className="text-xs text-stone-500">Novedades y reingreso de plantas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
            aria-label="Cerrar notificaciones"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Push permission banner */}
        {permission !== 'granted' && (
          <div className="m-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-pink-50 border border-emerald-100 flex flex-col gap-2.5">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-[#E643AC] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-stone-800">
                  ¿Quieres avisos cuando vuelva a haber stock?
                </p>
                <p className="text-xs text-stone-600 mt-0.5">
                  Activa las notificaciones en tu navegador para enterarte al instante cuando reingresen tus plantas favoritas.
                </p>
              </div>
            </div>
            <button
              onClick={handleRequestPermission}
              disabled={requesting}
              className="mt-1 w-full py-2 px-3 text-xs font-semibold text-white bg-[#16A01A] hover:bg-[#127e15] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Bell className="w-3.5 h-3.5" />
              {requesting ? 'Activando...' : 'Activar Notificaciones Push'}
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 px-4 text-stone-500">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-stone-700">Sin notificaciones por ahora</p>
              <p className="text-xs text-stone-500 mt-1">
                Te avisaremos aquí cuando haya nuevas plantas disponibles o actualizaciones de stock.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onMarkAsRead(item.id);
                  if (item.plantId && onSelectPlant) {
                    onSelectPlant(item.plantId);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  item.read
                    ? 'bg-white border-stone-200 text-stone-700 opacity-80'
                    : 'bg-white border-[#16A01A]/30 shadow-xs ring-1 ring-[#16A01A]/10 text-stone-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E643AC]" />
                    <h4 className="text-xs font-bold text-stone-900">{item.title}</h4>
                  </div>
                  <span className="text-[10px] text-stone-400 shrink-0">{item.timestamp}</span>
                </div>
                <p className="text-xs text-stone-600 mt-1.5 pl-4">{item.body}</p>
                {item.plantId && (
                  <p className="text-[11px] font-medium text-[#16A01A] mt-2 pl-4 flex items-center gap-1 hover:underline">
                    Ver ficha de la planta &rarr;
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-stone-200 bg-white flex justify-between items-center text-xs">
            <button
              onClick={onClearAll}
              className="text-stone-500 hover:text-stone-800 transition-colors"
            >
              Borrar todas
            </button>
            <span className="text-[11px] text-stone-400">
              {notifications.filter((n) => !n.read).length} sin leer
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
