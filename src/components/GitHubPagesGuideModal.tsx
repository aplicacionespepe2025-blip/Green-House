import React, { useState } from 'react';
import { X, Check, Copy, Globe, Terminal, ShieldCheck, ExternalLink, Zap } from 'lucide-react';

interface GitHubPagesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubPagesGuideModal: React.FC<GitHubPagesGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'vercel' | 'github'>('vercel');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-stone-200 text-stone-800 my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center shadow-md">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-stone-900">
              Guía de Despliegue en Vercel & GitHub
            </h3>
            <p className="text-xs text-stone-500">
              Publicación rápida, gratuita y 100% compatible con Firebase
            </p>
          </div>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-stone-100 rounded-2xl mb-5">
          <button
            onClick={() => setActiveTab('vercel')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'vercel'
                ? 'bg-black text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M24 22.525H0l12-21.05 12 21.05z" />
            </svg>
            <span>Despliegue en Vercel (Recomendado)</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'github'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>GitHub Pages</span>
          </button>
        </div>

        {/* Vercel Content */}
        {activeTab === 'vercel' ? (
          <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#16A01A] shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-950">
                <strong className="font-semibold block mb-0.5">
                  ¡Tu proyecto ya está 100% listo para Vercel!
                </strong>
                Hemos creado el archivo <code>vercel.json</code> en el proyecto con las reglas de redirección SPA automáticas, para que todas tus rutas y recargas funcionen a la perfección.
              </div>
            </div>

            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200">
              <h4 className="font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-[#16A01A] text-white text-[11px] flex items-center justify-center font-bold">
                  1
                </span>
                Opción Web (La más fácil): Vercel Dashboard
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-xs text-stone-600 mt-2 pl-2">
                <li>Sube tu código a un repositorio en <strong>GitHub</strong>.</li>
                <li>Entra en <strong>vercel.com</strong> e inicia sesión con tu cuenta.</li>
                <li>Haz clic en <strong>"Add New..." &rarr; "Project"</strong>.</li>
                <li>Selecciona tu repositorio de Green House y haz clic en <strong>"Import"</strong>.</li>
                <li>Vercel detecta Vite automáticamente (<code>npm run build</code> / <code>dist</code>). Haz clic en <strong>"Deploy"</strong>.</li>
              </ol>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200">
              <h4 className="font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-[#16A01A] text-white text-[11px] flex items-center justify-center font-bold">
                  2
                </span>
                Opción Terminal: Vercel CLI (1 comando)
              </h4>
              <p className="text-xs text-stone-600 mb-2">
                Si prefieres publicarlo directamente desde tu consola sin abrir la web:
              </p>
              <div className="bg-stone-900 text-stone-100 p-3 rounded-xl font-mono text-xs flex justify-between items-center">
                <span>npx vercel</span>
                <button
                  onClick={() => copyToClipboard('npx vercel', 'cmd_vercel')}
                  className="text-stone-400 hover:text-white p-1"
                  title="Copiar comando"
                >
                  {copiedSection === 'cmd_vercel' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* GitHub Pages Content */
          <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200">
              <span className="font-bold text-stone-900 text-sm block mb-1">
                Comando para GitHub Pages:
              </span>
              <p className="text-xs text-stone-600 mb-2">
                Ejecuta en tu terminal para publicar en la rama <code>gh-pages</code>:
              </p>
              <div className="bg-stone-900 text-stone-100 p-3 rounded-xl font-mono text-xs flex justify-between items-center">
                <span>npm run build && npx gh-pages -d dist</span>
                <button
                  onClick={() =>
                    copyToClipboard('npm run build && npx gh-pages -d dist', 'cmd_gh')
                  }
                  className="text-stone-400 hover:text-white p-1"
                >
                  {copiedSection === 'cmd_gh' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
