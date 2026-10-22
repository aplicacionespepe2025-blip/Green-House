import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle, Heart, X } from 'lucide-react';
import { Review, Plant } from '../types';
import { addReview } from '../services/reviewsService';

interface CustomerReviewsSectionProps {
  reviews: Review[];
  plants: Plant[];
  onReviewAdded?: () => void;
}

export const CustomerReviewsSection: React.FC<CustomerReviewsSectionProps> = ({
  reviews,
  plants,
  onReviewAdded,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedPlant, setSelectedPlant] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      await addReview({
        userName: name.trim(),
        rating,
        comment: comment.trim(),
        plantName: selectedPlant.trim() || 'Plantas del vivero',
        date: new Date().toLocaleDateString('es-AR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        verified: true,
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsModalOpen(false);
        setName('');
        setComment('');
        setSelectedPlant('');
      }, 1500);

      if (onReviewAdded) onReviewAdded();
    } catch (e) {
      console.error(e);
      alert('Hubo un inconveniente al enviar tu opinión. Por favor, reintenta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <section id="opiniones" className="py-16 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E643AC]/10 text-[#E643AC] mb-3">
              <Heart className="w-3.5 h-3.5 fill-current" />
              Opiniones Reales
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Lo que dicen nuestras clientas
            </h2>
            <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-xl">
              Historias de hogares llenos de verde y consejos que dieron vida a balcones y salas de estar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm font-bold text-stone-900">{averageRating} / 5</span>
              <span className="text-xs text-stone-400">({reviews.length} opiniones)</span>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-[#E643AC] hover:bg-[#c93293] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Dejar mi opinión</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Rating stars */}
                <div className="flex text-amber-400 gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating ? 'fill-current' : 'text-stone-200'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900">{rev.userName}</h4>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                      <CheckCircle className="w-3 h-3 text-[#16A01A]" />
                      Compradora
                    </span>
                  )}
                </div>
                {rev.plantName && (
                  <p className="text-[11px] text-[#16A01A] font-medium mt-1 truncate">
                    Planta: {rev.plantName}
                  </p>
                )}
                <span className="text-[10px] text-stone-400 block mt-1">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Review Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            role="dialog"
          >
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-7 border border-stone-200 text-stone-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-serif font-bold text-stone-900">
                Comparte tu experiencia con el vivero
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Tu opinión ayuda a otras personas a llenar sus hogares de plantas sanas.
              </p>

              {submitSuccess ? (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#16A01A] mx-auto flex items-center justify-center mb-3">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-stone-900">
                    ¡Muchas gracias por tu mensaje!
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    Tu reseña fue guardada exitosamente en nuestro vivero.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Tu Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Florencia Morales"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={70}
                      className="w-full py-2.5 px-3 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#E643AC]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Calificación *
                    </label>
                    <div className="flex items-center gap-1.5 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating ? 'fill-current' : 'text-stone-200'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-stone-700 ml-2">
                        {rating} de 5 estrellas
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      ¿Qué planta compraste o consultaste?
                    </label>
                    <select
                      value={selectedPlant}
                      onChange={(e) => setSelectedPlant(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#E643AC]"
                    >
                      <option value="">-- Elige una planta (opcional) --</option>
                      {plants.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Tu comentario y consejo *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Cuéntanos cómo está creciendo tu planta, cómo te atendimos..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      maxLength={600}
                      className="w-full py-2 px-3 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#E643AC]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="py-2.5 px-4 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="py-2.5 px-5 rounded-xl bg-[#E643AC] hover:bg-[#c93293] text-white text-xs font-semibold shadow-xs"
                    >
                      {isSubmitting ? 'Guardando...' : 'Publicar Opinión'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
