import React, { useState } from 'react';
import {
  Heart,
  Bell,
  Shield,
  Menu,
  X,
  MessageCircle,
} from 'lucide-react';

interface NavbarProps {
  gardenCount: number;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenAdmin: () => void;
  isAdmin: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  gardenCount,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenAdmin,
  isAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openWhatsApp = (phone = '56993714077') => {
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(
        '¡Hola Green House! Me gustaría consultar sobre sus plantas y disponibilidad.'
      )}`,
      '_blank'
    );
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Green House Brand */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Logo in a pristine circle without modification */}
            <div className="w-13 h-13 rounded-full overflow-hidden bg-white shadow-md border-2 border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/assets/aistudio/Gemini_Generated_Image_42ogl942ogl942og_2ac01f4f.jpg"
                alt="Logo Green House"
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div>
              <span className="font-serif font-extrabold text-xl sm:text-2xl text-stone-900 tracking-tight block leading-none">
                Green <span className="text-[#16A01A]">House</span>
              </span>
              <span className="text-[11px] sm:text-xs text-[#E643AC] italic font-medium tracking-wide block mt-1">
                "Porque amamos las plantas"
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-stone-700">
            <button
              onClick={() => scrollTo('catalogo')}
              className="hover:text-[#16A01A] transition-colors"
            >
              Catálogo de Plantas
            </button>
            <button
              onClick={() => scrollTo('cuidados')}
              className="hover:text-[#16A01A] transition-colors"
            >
              Consejos de Cuidado
            </button>
            <button
              onClick={() => scrollTo('mi-jardin')}
              className="hover:text-[#E643AC] transition-colors flex items-center gap-1.5"
            >
              <span>Mi Jardín</span>
              {gardenCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#E643AC] text-white font-bold">
                  {gardenCount}
                </span>
              )}
            </button>
            <button
              onClick={() => scrollTo('opiniones')}
              className="hover:text-[#16A01A] transition-colors"
            >
              Opiniones
            </button>
            <button
              onClick={() => scrollTo('contacto')}
              className="hover:text-[#16A01A] transition-colors"
            >
              Contacto & Ubicación
            </button>
          </div>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-2xl text-stone-600 hover:text-stone-900 hover:bg-white border border-stone-200/80 transition-all"
              title="Alertas de inventario y reingresos"
              aria-label="Notificaciones"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E643AC] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Admin Management Button */}
            <button
              onClick={onOpenAdmin}
              className={`p-2.5 sm:px-3.5 sm:py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                isAdmin
                  ? 'bg-stone-900 text-white hover:bg-stone-800'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
              title="Panel de control de Green House"
            >
              <Shield className="w-4 h-4 text-[#16A01A]" />
              <span className="hidden sm:inline">
                {isAdmin ? 'Admin' : 'Panel Dueño'}
              </span>
            </button>

            {/* Direct WhatsApp Callout */}
            <button
              onClick={() => openWhatsApp('56993714077')}
              className="hidden lg:flex items-center gap-1.5 py-2.5 px-4 rounded-2xl bg-[#16A01A] hover:bg-[#127e15] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-2xl text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Menú principal"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-6 py-5 space-y-3.5 animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => scrollTo('catalogo')}
            className="w-full text-left py-2 text-sm font-semibold text-stone-800 hover:text-[#16A01A]"
          >
            Catálogo de Plantas
          </button>
          <button
            onClick={() => scrollTo('cuidados')}
            className="w-full text-left py-2 text-sm font-semibold text-stone-800 hover:text-[#16A01A]"
          >
            Consejos de Cuidado
          </button>
          <button
            onClick={() => scrollTo('mi-jardin')}
            className="w-full text-left py-2 text-sm font-semibold text-stone-800 hover:text-[#E643AC] flex items-center justify-between"
          >
            <span>Mi Jardín & Recordatorios</span>
            {gardenCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-[#E643AC] text-white font-bold">
                {gardenCount}
              </span>
            )}
          </button>
          <button
            onClick={() => scrollTo('opiniones')}
            className="w-full text-left py-2 text-sm font-semibold text-stone-800 hover:text-[#16A01A]"
          >
            Opiniones de Clientas
          </button>
          <button
            onClick={() => scrollTo('contacto')}
            className="w-full text-left py-2 text-sm font-semibold text-stone-800 hover:text-[#16A01A]"
          >
            Contacto & Ubicación
          </button>

          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => openWhatsApp('56993714077')}
                className="py-2.5 px-3 rounded-xl bg-[#16A01A] text-white text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>WSP 1</span>
              </button>
              <button
                onClick={() => openWhatsApp('56941546441')}
                className="py-2.5 px-3 rounded-xl bg-[#16A01A] text-white text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>WSP 2</span>
              </button>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-100 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-[#16A01A]" />
              <span>Panel Dueño</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
