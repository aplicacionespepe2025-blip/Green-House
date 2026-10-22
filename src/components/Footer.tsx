import React from 'react';
import { Heart, MessageCircle, MapPin, Phone, Globe, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenGitHubPagesGuide: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenGitHubPagesGuide,
  onOpenAdmin,
}) => {
  const scrollTo = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const openGoogleMaps = () => {
    const query = encodeURIComponent('Poblacion Domingo Ortiz de Rozas, Los Alamos 11');
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-md border-2 border-emerald-200 shrink-0">
                <img
                  src="/assets/aistudio/Gemini_Generated_Image_42ogl942ogl942og_2ac01f4f.jpg"
                  alt="Logo Green House"
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <div>
                <span className="font-serif font-extrabold text-xl text-white block leading-tight">
                  Green <span className="text-[#16A01A]">House</span>
                </span>
                <span className="text-[11px] text-[#E643AC] italic font-semibold">
                  "Porque amamos las plantas"
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Cultivando el amor por las plantas en cada hogar. Te acompañamos con asesoría y los mejores consejos botánicos para que tu jardín y tus espacios florezcan siempre.
            </p>

            {/* Social links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://www.facebook.com/search/top?q=Green%20House"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-blue-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                title="Facebook: Green House"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-[#E643AC] text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                title="Instagram: Green House"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <span className="text-xs text-stone-400">@Green House</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Secciones
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => scrollTo('catalogo')}
                  className="hover:text-white transition-colors"
                >
                  Catálogo de Especies
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('cuidados')}
                  className="hover:text-white transition-colors"
                >
                  Consejos de Cuidado
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('mi-jardin')}
                  className="hover:text-white transition-colors"
                >
                  Mi Jardín & Recordatorios
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('opiniones')}
                  className="hover:text-white transition-colors"
                >
                  Opiniones de Clientes
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('contacto')}
                  className="hover:text-white transition-colors"
                >
                  Ubicación & Contacto
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details & Address with Maps */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Ubicación & Teléfonos
            </h4>
            <ul className="space-y-3 text-xs text-stone-400">
              <li>
                <button
                  onClick={openGoogleMaps}
                  className="flex items-start gap-2 text-left hover:text-emerald-400 transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-[#16A01A] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-stone-200 block font-medium">
                      Población Domingo Ortiz de Rozas, Los Álamos 11
                    </span>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      Abrir en Google Maps <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </button>
              </li>

              <li>
                <a
                  href="https://wa.me/56993714077?text=Hola%20Green%20House"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#16A01A] shrink-0" />
                  <span className="font-mono text-stone-200">+56 9 9371 4077</span>
                  <span className="text-[10px] text-[#16A01A] font-semibold">(WSP 1)</span>
                </a>
              </li>

              <li>
                <a
                  href="https://wa.me/56941546441?text=Hola%20Green%20House"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#16A01A] shrink-0" />
                  <span className="font-mono text-stone-200">+56 9 4154 6441</span>
                  <span className="text-[10px] text-[#16A01A] font-semibold">(WSP 2)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Deployment & Admin Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Sitio Web & Gestión
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              Web optimizada para despliegue rápido y gratuito en GitHub Pages.
            </p>
            <div className="space-y-2">
              <button
                onClick={onOpenGitHubPagesGuide}
                className="w-full py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-stone-700"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Guía Despliegue GitHub Pages</span>
              </button>

              <button
                onClick={onOpenAdmin}
                className="w-full py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-stone-700"
              >
                <span>Acceso Administración Vivero</span>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright bottom bar */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} Green House. Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-1">
            "Porque amamos las plantas" &bull; #16A01A & #E643AC
          </p>
        </div>
      </div>
    </footer>
  );
};
