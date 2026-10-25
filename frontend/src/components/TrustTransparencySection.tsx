import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  FileQuestion, 
  ShieldCheck, 
  Info,
  Scale,
  ExternalLink
} from 'lucide-react';

export const TrustTransparencySection: React.FC = () => {
  const statuses = [
    {
      title: 'Supported',
      accent: 'border-cyan-200 bg-cyan-50/50 text-cyan-900',
      badgeBg: 'bg-cyan-100/80 text-cyan-800 border-cyan-300/80',
      icon: CheckCircle2,
      iconColor: 'text-cyan-600',
      definition:
        'Multiple verified primary records, institutional archives, or reproducible empirical datasets confirm the key premises of the assertion.',
      rule: 'Requires corroborated provenance and no unresolved counter-indications.',
    },
    {
      title: 'Contradicted',
      accent: 'border-rose-200 bg-rose-50/50 text-rose-900',
      badgeBg: 'bg-rose-100/80 text-rose-800 border-rose-300/80',
      icon: AlertTriangle,
      iconColor: 'text-rose-600',
      definition:
        'Official notices, timestamped registries, or primary scientific measurements directly refute the core claims or chronology.',
      rule: 'Refutation must be anchored in primary data, not secondary opinion.',
    },
    {
      title: 'Mixed Evidence',
      accent: 'border-amber-200 bg-amber-50/50 text-amber-900',
      badgeBg: 'bg-amber-100/80 text-amber-800 border-amber-300/80',
      icon: Scale,
      iconColor: 'text-amber-600',
      definition:
        'Some decomposed sub-claims are confirmed while others are refuted or exaggerated; or credible repositories present conflicting conclusions.',
      rule: 'Avoids flattening nuanced disputes into an oversimplified verdict.',
    },
    {
      title: 'Unverified',
      accent: 'border-slate-200 bg-slate-50/60 text-slate-900',
      badgeBg: 'bg-slate-200/80 text-slate-700 border-slate-300/80',
      icon: FileQuestion,
      iconColor: 'text-slate-600',
      definition:
        'Public records, FOI filings, or empirical evidence are currently insufficient to substantiate or refute the stated claim.',
      rule: 'Absence of evidence is never treated as positive proof of falsity.',
    },
  ];

  return (
    <section id="trust-rigor" className="relative py-20 sm:py-28 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Epistemic Rigor
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Confidence is not the same as certainty.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Most false narratives exploit the space between fact and uncertainty. We categorize evidence using four transparent criteria designed to preserve nuance.
          </p>
        </div>

        {/* 4 Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {statuses.map((item) => {
            const ItemIcon = item.icon;
            return (
              <div
                key={item.title}
                className={`rounded-3xl p-6 sm:p-7 border ${item.accent} transition-all duration-300 hover:-translate-y-1 shadow-[0_6px_25px_rgba(15,23,42,0.03)] bg-white`}
              >
                {/* Header with icon and status chip */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shadow-2xs">
                    <ItemIcon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${item.badgeBg}`}>
                    {item.title}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {item.definition}
                </p>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Audit Rule: </span>
                  {item.rule}
                </div>
              </div>
            );
          })}
        </div>

        {/* Epistemic Golden Rule Banner with Black Liquid Accent */}
        <div className="relative rounded-3xl p-8 bg-white border border-zinc-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Black liquid top hairline accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-zinc-950 via-zinc-800 to-black" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700">
                Foundational Principle
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Insufficient evidence is not proof that a claim is false.
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                When documents are withheld or scientific experiments are still in progress, honest investigation records what remains unproven. We never force speculative true/false verdicts when primary records are incomplete.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center items-start lg:items-end">
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-blue-700 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 shadow-2xs transition-colors"
              >
                <span>Read our Methodology Guide</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
