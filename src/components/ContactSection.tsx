import React, { useState } from 'react';
import {
  MessageCircle,
  MapPin,
  Clock,
  Phone,
  Mail,
  Send,
  CheckCircle,
  Heart,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { submitInquiry } from '../services/inquiriesService';

interface ContactSectionProps {
  onOpenGitHubPagesGuide: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onOpenGitHubPagesGuide,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [plantInterest, setPlantInterest] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await submitInquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        plantInterest: plantInterest.trim(),
        message: message.trim(),
      });

      setIsSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setPlantInterest('');
      setMessage('');
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (e) {
      console.error(e);
      alert('Error al enviar la consulta. También puedes escribirnos directo a WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = (phoneNum: string) => {
    const text = encodeURIComponent(
      '¡Hola Green House! Quisiera consultar sobre la disponibilidad y cuidados de sus plantas.'
    );
    window.open(`https://wa.me/${phoneNum}?text=${text}`, '_blank');
  };

  const openGoogleMaps = () => {
    const query = encodeURIComponent('Poblacion Domingo Ortiz de Rozas, Los Alamos 11');
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <section id="contacto" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Brand, Address with Maps, Phones and Socials */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-xs border border-emerald-100 shrink-0">
                  <img
                    src="/assets/aistudio/Gemini_Generated_Image_42ogl942ogl942og_2ac01f4f.jpg"
                    alt="Logo Green House"
                    className="w-full h-full object-contain p-0.5"
                  />
                </div>
                <span className="text-xs font-semibold text-[#E643AC] tracking-wide">
                  "Porque amamos las plantas"
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                Green <span className="text-[#16A01A]">House</span>
              </h2>
              <p className="mt-2 text-stone-600 text-sm sm:text-base leading-relaxed">
                Te asesoramos con cariño para que encuentres la planta perfecta para tu luz y espacio. Escríbenos o visítanos en nuestro vivero.
              </p>
            </div>

            {/* Interactive Address with Google Maps button */}
            <div
              onClick={openGoogleMaps}
              className="p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-[#16A01A] hover:bg-emerald-50/50 cursor-pointer transition-all group shadow-2xs"
              title="Abrir en Google Maps"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#16A01A] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                        Dirección del Vivero
                      </h4>
                      <span className="text-[10px] bg-[#16A01A] text-white px-2 py-0.2 rounded-full font-semibold">
                        Ver Mapa
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-800 font-medium mt-1">
                      Población Domingo Ortiz de Rozas, Los Álamos 11
                    </p>
                    <p className="text-[11px] text-[#16A01A] font-semibold mt-1 flex items-center gap-1">
                      <span>Tocar para abrir en Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Buttons */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Teléfonos de Contacto & WhatsApp (Atención Inmediata)
              </h4>

              {/* Phone 1 */}
              <div
                onClick={() => openWhatsApp('56993714077')}
                className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between cursor-pointer hover:bg-emerald-100/90 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#16A01A] text-white flex items-center justify-center shadow-xs">
                    <MessageCircle className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-semibold block">
                      WhatsApp 1
                    </span>
                    <span className="text-xs font-bold text-stone-900 font-mono">
                      +56 9 9371 4077
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#16A01A] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Abrir chat &rarr;
                </span>
              </div>

              {/* Phone 2 */}
              <div
                onClick={() => openWhatsApp('56941546441')}
                className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between cursor-pointer hover:bg-emerald-100/90 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#16A01A] text-white flex items-center justify-center shadow-xs">
                    <MessageCircle className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-semibold block">
                      WhatsApp 2
                    </span>
                    <span className="text-xs font-bold text-stone-900 font-mono">
                      +56 9 4154 6441
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#16A01A] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Abrir chat &rarr;
                </span>
              </div>
            </div>

            {/* Social Networks: Facebook & Instagram Green House */}
            <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-200 space-y-2.5">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#E643AC] fill-current" />
                Síguenos en Redes Sociales
              </h4>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/search/top?q=Green%20House"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white border border-stone-200 hover:border-blue-500 hover:text-blue-600 flex items-center gap-2.5 transition-colors group text-stone-700"
                >
                  <svg className="w-5 h-5 text-blue-600 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <div>
                    <span className="text-[10px] text-stone-400 block leading-none">Facebook</span>
                    <span className="text-xs font-bold text-stone-900">Green House</span>
                  </div>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white border border-stone-200 hover:border-pink-500 hover:text-pink-600 flex items-center gap-2.5 transition-colors group text-stone-700"
                >
                  <svg className="w-5 h-5 text-[#E643AC] fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <div>
                    <span className="text-[10px] text-stone-400 block leading-none">Instagram</span>
                    <span className="text-xs font-bold text-stone-900">Green House</span>
                  </div>
                </a>
              </div>
            </div>

            {/* GitHub Pages quick banner */}
            <div className="p-4 rounded-2xl bg-stone-900 text-white flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold">Despliegue en GitHub Pages</h4>
                  <p className="text-[11px] text-stone-300">
                    Alojamiento gratuito y rápido para tu web.
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenGitHubPagesGuide}
                className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold shrink-0 transition-colors"
              >
                Ver Guía
              </button>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
            <h3 className="text-xl font-serif font-bold text-stone-900">
              Envíanos un mensaje o consulta
            </h3>
            <p className="text-xs text-stone-500 mt-1 mb-6">
              Te respondemos a la brevedad con información sobre cuidados y disponibilidad.
            </p>

            {isSuccess ? (
              <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-[#16A01A] text-white mx-auto flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-lg text-emerald-950">
                  ¡Mensaje enviado con éxito!
                </h4>
                <p className="text-xs text-emerald-800 mt-1 max-w-sm mx-auto">
                  Gracias por contactar a Green House. Te responderemos pronto a tu correo o teléfono.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Francisca Silva"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={80}
                      className="w-full py-2.5 px-3 rounded-xl border border-stone-300 bg-white text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#16A01A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="francisca@ejemplo.cl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={100}
                      className="w-full py-2.5 px-3 rounded-xl border border-stone-300 bg-white text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#16A01A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Teléfono o WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+56 9 1234 5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={30}
                      className="w-full py-2.5 px-3 rounded-xl border border-stone-300 bg-white text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#16A01A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Planta de tu interés
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Cuna de Moisés, Hortensias..."
                      value={plantInterest}
                      onChange={(e) => setPlantInterest(e.target.value)}
                      maxLength={80}
                      className="w-full py-2.5 px-3 rounded-xl border border-stone-300 bg-white text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#16A01A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tu mensaje o pregunta *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Hola Green House, me gustaría saber si tienen en stock plantas para balcón con mucho sol..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={1000}
                    className="w-full py-2.5 px-3 rounded-xl border border-stone-300 bg-white text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#16A01A]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <p className="text-[11px] text-stone-400">
                    * Tus datos se gestionan de forma segura.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-3 px-6 rounded-xl bg-[#16A01A] hover:bg-[#127e15] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-98"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Enviando...' : 'Enviar Consulta'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
