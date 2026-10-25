import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface FinalCtaSectionProps {
  onStartInvestigation: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onStartInvestigation }) => {
  return (
    <section className="relative py-24 sm:py-32 bg-[#F8FAFC] border-t border-slate-200/60 overflow-hidden">
      {/* Background subtle grid */}
      <div className="absolute inset-0 bg-grid-subtle opacity-50 pointer-events-none" />

      {/* Floating evidence node hints in monochrome black liquid tones */}
      <div className="hidden md:block absolute top-16 left-1/4 w-3 h-3 rounded-full bg-zinc-800/40 animate-ping" />
      <div className="hidden md:block absolute bottom-20 right-1/4 w-2.5 h-2.5 rounded-full bg-zinc-950/50" />
      <div className="hidden md:block absolute top-1/3 right-16 w-2 h-2 rounded-full bg-zinc-700/40" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        
        {/* Subtle Brand Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/90 text-slate-800 text-xs font-semibold uppercase tracking-wider mb-6 shadow-xs backdrop-blur-xs">
          <ShieldCheck className="w-4 h-4 text-slate-700" />
          Evidence-First Intelligence
        </div>

        {/* Cinematic Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6 text-balance">
          Before you share it,
          <span className="block mt-2 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
            investigate it.
          </span>
        </h2>

        {/* Supporting Copy */}
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
          Make room for evidence. Understand the claim. Follow the sources.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartInvestigation}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 cursor-pointer"
          >
            <span>Start Your Investigation</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Micro-assurances */}
        <p className="mt-6 text-xs text-slate-400">
          No credit card or login required for demonstration investigation.
        </p>

      </div>
    </section>
  );
};
