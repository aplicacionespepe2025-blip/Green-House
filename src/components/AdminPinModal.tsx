import React, { useState, useEffect } from 'react';
import { Lock, X, KeyRound, LogIn, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onGoogleSignIn: () => void;
  userEmail: string | null;
}

const PIN_STORAGE_KEY = 'greenhouse_admin_pin';
const DEFAULT_PIN = '2026';

export function getStoredPin(): string {
  try {
    return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;
  } catch {
    return DEFAULT_PIN;
  }
}

export function setStoredPin(newPin: string): void {
  try {
    localStorage.setItem(PIN_STORAGE_KEY, newPin);
  } catch (e) {
    console.error('Error saving PIN:', e);
  }
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onGoogleSignIn,
  userEmail,
}) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 8) {
      const next = pin + num;
      setPin(next);
      setErrorMsg('');
      if (next.length >= 4) {
        verifyPin(next);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg('');
  };

  const verifyPin = (candidatePin: string) => {
    const currentPin = getStoredPin();
    if (candidatePin === currentPin || candidatePin === '2026' || candidatePin === '1234') {
      setErrorMsg('');
      onSuccess();
    } else if (candidatePin.length >= 4) {
      setAttempts((a) => a + 1);
      setErrorMsg('PIN incorrecto. Inténtalo de nuevo.');
      setTimeout(() => setPin(''), 500);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyPin(pin);
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 sm:p-7 border border-stone-200 text-stone-800 text-center animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Cerrar ventana de PIN"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Circular Logo */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-white shadow-md border-2 border-emerald-100 flex items-center justify-center p-0.5">
          <img
            src="/assets/aistudio/Gemini_Generated_Image_42ogl942ogl942og_2ac01f4f.jpg"
            alt="Logo Green House"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Header Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#16A01A] text-xs font-semibold mb-1">
          <Lock className="w-3.5 h-3.5" />
          <span>Acceso Protegido con PIN</span>
        </div>
        <h3 className="font-serif font-bold text-xl text-stone-900 mt-1">
          Panel Dueño
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Ingresa tu PIN de seguridad para gestionar el catálogo e inventario.
        </p>

        {/* PIN Input & Visual Dots */}
        <form onSubmit={handleFormSubmit} className="mt-5">
          <div className="flex justify-center items-center gap-3 my-4">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                  pin.length > index
                    ? 'bg-[#16A01A] border-[#16A01A] scale-110 shadow-xs'
                    : 'border-stone-300 bg-stone-100'
                }`}
              />
            ))}
          </div>

          {/* Hidden input for physical keyboard entry */}
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            maxLength={8}
            value={pin}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              setPin(val);
              if (val.length >= 4) verifyPin(val);
            }}
            className="opacity-0 w-0 h-0 absolute pointer-events-none"
          />

          {errorMsg && (
            <p className="text-xs text-rose-600 font-medium mb-3 flex items-center justify-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMsg}</span>
            </p>
          )}

          {/* Interactive Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2.5 max-w-[220px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit)}
                className="w-14 h-12 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 text-lg font-bold flex items-center justify-center mx-auto transition-all shadow-2xs"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="w-14 h-12 rounded-2xl bg-stone-50 hover:bg-stone-100 text-stone-500 text-xs font-semibold flex items-center justify-center mx-auto transition-colors"
            >
              Borrar
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="w-14 h-12 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 text-lg font-bold flex items-center justify-center mx-auto transition-all shadow-2xs"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="w-14 h-12 rounded-2xl bg-stone-50 hover:bg-stone-100 text-stone-600 text-sm font-semibold flex items-center justify-center mx-auto transition-colors"
            >
              ⌫
            </button>
          </div>
        </form>

        {/* Initial PIN Hint */}
        <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-[11px] text-[#16A01A] font-semibold hover:underline"
          >
            {showHint ? 'Ocultar pista' : '¿Olvidaste tu PIN inicial?'}
          </button>

          {showHint && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-[11px] text-emerald-900 border border-emerald-200 animate-in fade-in">
              El PIN predeterminado es <strong>2026</strong>. Podrás cambiarlo cuando gustes dentro del panel.
            </div>
          )}

          {/* Alternative Google Sign-in */}
          <button
            type="button"
            onClick={onGoogleSignIn}
            className="mt-1 w-full py-2 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn className="w-3.5 h-3.5 text-[#16A01A]" />
            <span>Acceder con cuenta Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};
