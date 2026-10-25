import React from 'react';
import { Layers, Search, Compass, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'DECONSTRUCT',
      subtitle: 'Break complex claims into independently checkable statements.',
      description:
        'Viral posts often fuse real events with speculative accusations. SignalCheck decomposes sensational claims into atomic, testable propositions using logical premise isolation.',
      icon: Layers,
      highlight: 'Atomic Decomposition',
    },
    {
      number: '02',
      title: 'INVESTIGATE',
      subtitle: 'Examine supporting and contradicting evidence from identifiable sources.',
      description:
        'Instead of crawling biased opinion aggregators, our system targets primary archival registries, peer-reviewed databases, and cryptographic sensor feeds with clear citation provenance.',
      icon: Search,
      highlight: 'Identifiable Provenance',
    },
    {
      number: '03',
      title: 'UNDERSTAND',
      subtitle: 'See what the evidence establishes, what conflicts, and what remains uncertain.',
      description:
        'Truth is rarely a binary switch. We present transparent stance alignments, document direct refutations, and explicitly map remaining unknowns so you can reason with confidence.',
      icon: Compass,
      highlight: 'Uncertainty-Aware Reports',
    },
  ];

  return (
    <section id="how-it-works" className="relative py-20 sm:py-28 bg-[#F8FAFC] border-t border-slate-200/60 overflow-hidden">
      {/* Subtle hairline boundary */}
      <div className="absolute top-0 inset-x-0 h-px bg-zinc-200" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-zinc-200" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-slate-800 text-xs font-semibold uppercase tracking-wider mb-3 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
            The Investigative Process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight text-balance">
            From viral claim to visible evidence.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Move past emotional reaction into structured evidentiary analysis. Our three-stage methodology replaces opaque verdicts with traceable research trails.
          </p>
        </div>

        {/* Numbered Steps with Connecting Line */}
        <div className="relative">
          
          {/* Connecting Line (Desktop) in black liquid shades */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 -translate-y-8 h-0.5 bg-gradient-to-r from-zinc-800 via-zinc-950 to-zinc-800 z-0 opacity-40" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.number}
                  className="group relative bg-white/95 rounded-3xl p-8 border border-slate-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-zinc-400 hover:-translate-y-1.5 transition-all duration-300 backdrop-blur-xs flex flex-col justify-between"
                >
                  {/* Black liquid top edge highlight on hover */}
                  <div className="absolute top-0 inset-x-8 h-0.5 bg-zinc-950 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {/* Header: Number and Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-200 group-hover:text-blue-500/30 transition-colors">
                        {step.number}
                      </span>
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-xs">
                        <StepIcon className="w-6 h-6 stroke-[2]" />
                      </div>
                    </div>

                    {/* Step Title & Subtitle */}
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
                      {step.number} — {step.title}
                    </h3>
                    <p className="text-sm font-semibold text-blue-700 mb-3 leading-snug">
                      "{step.subtitle}"
                    </p>

                    {/* Descriptive Prose */}
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Bottom Highlight */}
                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{step.highlight}</span>
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
