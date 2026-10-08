import React from 'react';
import { ChildProfile } from '../../types';
import { X, Printer, Award, Sparkles, Check } from 'lucide-react';

interface CertificateModalProps {
  profile: ChildProfile;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ profile, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in print:bg-white print:p-0">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto print:bg-white print:border-none print:shadow-none print:text-black">
        {/* Controls Bar (Hidden during print) */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-base text-white">
              Official Milestone Certificate
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Parchment Body */}
        <div className="mt-4 p-8 rounded-3xl bg-amber-50 text-slate-900 border-4 border-amber-500/80 shadow-inner relative text-center print:border-8 print:p-12">
          {/* Ornamental corner brackets */}
          <div className="absolute top-2 left-2 text-amber-600 text-lg">✦</div>
          <div className="absolute top-2 right-2 text-amber-600 text-lg">✦</div>
          <div className="absolute bottom-2 left-2 text-amber-600 text-lg">✦</div>
          <div className="absolute bottom-2 right-2 text-amber-600 text-lg">✦</div>

          <div className="text-xs font-bold uppercase tracking-widest text-amber-800">
            Odyssey 10-Year Adventure Journal
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-2 tracking-wide uppercase">
            Certificate of Honor
          </h2>

          <p className="text-xs text-slate-600 mt-1 uppercase tracking-wider">
            For Outstanding Character, Consistency, and Growth
          </p>

          <div className="my-6">
            <p className="text-xs text-slate-500 italic">This is proudly awarded to</p>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-amber-900 border-b-2 border-amber-400/60 pb-2 inline-block px-6 mt-1">
              {profile.name}
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
            In recognition of completing remarkable chapters in your 10-year growth journey, achieving{' '}
            <strong>Level {profile.stats.level} Explorer</strong> with an honorable accumulation of{' '}
            <strong>{profile.stats.currentPoints.toLocaleString()} Adventure Points</strong> and practicing
            the noble virtues of daily learning, kindness, and patience.
          </p>

          {/* Badges / Stats Row */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-800 font-semibold">
            <div>
              <span className="block text-slate-500 text-[10px] uppercase">Class / Grade</span>
              <span>{profile.schoolGrade}</span>
            </div>
            <div className="w-[1px] h-6 bg-slate-300" />
            <div>
              <span className="block text-slate-500 text-[10px] uppercase">Longest Streak</span>
              <span>{profile.stats.bestStreak} Days Active</span>
            </div>
            <div className="w-[1px] h-6 bg-slate-300" />
            <div>
              <span className="block text-slate-500 text-[10px] uppercase">Date Certified</span>
              <span>{today}</span>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-10 pt-6 border-t border-amber-300 flex items-center justify-between px-6 text-xs text-slate-700">
            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1" />
              <span className="text-[10px] uppercase font-bold text-slate-500">Parent Guardian Signature</span>
            </div>

            {/* Gold Seal */}
            <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex flex-col items-center justify-center font-display font-extrabold shadow-md border-2 border-amber-300 text-center leading-tight">
              <span className="text-xs">SEAL</span>
              <span className="text-[9px]">ODYSSEY</span>
            </div>

            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1" />
              <span className="text-[10px] uppercase font-bold text-slate-500">Explorer Signature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
