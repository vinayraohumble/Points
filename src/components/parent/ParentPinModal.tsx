import React, { useState } from 'react';
import { Shield, Lock, Fingerprint, Delete, X } from 'lucide-react';
import { sound } from '../../utils/audio';

interface ParentPinModalProps {
  storedPin: string;
  onSuccess: () => void;
  onClose: () => void;
  soundEnabled?: boolean;
}

export const ParentPinModal: React.FC<ParentPinModalProps> = ({
  storedPin,
  onSuccess,
  onClose,
  soundEnabled = true,
}) => {
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleKeyPress = (num: string) => {
    sound.playTap(soundEnabled);
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    sound.playTap(soundEnabled);
    setPin((prev) => prev.slice(0, -1));
    setIsError(false);
  };

  const verifyPin = (candidatePin: string) => {
    if (candidatePin === storedPin) {
      sound.playLevelUp(soundEnabled);
      onSuccess();
    } else {
      setIsError(true);
      setAttempts((prev) => prev + 1);
      setTimeout(() => {
        setPin('');
        setIsError(false);
      }, 700);
    }
  };

  const handleBiometricSim = () => {
    sound.playLevelUp(soundEnabled);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border border-white/20 rounded-3xl p-6 shadow-2xl text-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Shield Icon */}
        <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400/20 border-2 border-amber-400/40 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
          <Shield className="w-8 h-8" />
        </div>

        <h3 className="font-display font-extrabold text-xl text-white">
          Parent Verification
        </h3>
        <p className="text-xs text-slate-300 mt-1">
          Enter 4-digit PIN to access parent ledger & controls
        </p>
        <span className="text-[10px] text-slate-400 mt-0.5 block">
          (Default PIN: 1234)
        </span>

        {/* PIN Dots Display */}
        <div
          className={`flex items-center justify-center gap-4 my-6 transition-transform ${
            isError ? 'animate-shake' : ''
          }`}
        >
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  isError
                    ? 'border-red-500 bg-red-500'
                    : isFilled
                    ? 'border-amber-400 bg-amber-400 scale-110 shadow-sm'
                    : 'border-slate-600 bg-slate-800'
                }`}
              />
            );
          })}
        </div>

        {isError && (
          <p className="text-xs text-red-400 font-semibold mb-2">
            Incorrect PIN. Try again.
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="w-16 h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-white/10 text-white font-display font-bold text-xl shadow cursor-pointer transition-transform active:scale-95 mx-auto flex items-center justify-center"
            >
              {digit}
            </button>
          ))}

          {/* Biometric Simulation button */}
          <button
            type="button"
            onClick={handleBiometricSim}
            className="w-16 h-14 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 shadow cursor-pointer transition-transform active:scale-95 mx-auto flex items-center justify-center"
            title="Quick Biometric Unlock (FaceID / TouchID)"
          >
            <Fingerprint className="w-6 h-6" />
          </button>

          {/* 0 Key */}
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="w-16 h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-white/10 text-white font-display font-bold text-xl shadow cursor-pointer transition-transform active:scale-95 mx-auto flex items-center justify-center"
          >
            0
          </button>

          {/* Backspace Key */}
          <button
            type="button"
            onClick={handleBackspace}
            className="w-16 h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-white/10 text-slate-300 shadow cursor-pointer transition-transform active:scale-95 mx-auto flex items-center justify-center"
            title="Delete"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel and Return to Adventure
          </button>
        </div>
      </div>
    </div>
  );
};
