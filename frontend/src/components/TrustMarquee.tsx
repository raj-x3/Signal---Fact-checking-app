import React from 'react';
import { ShieldCheck, Database, Satellite, Radio, FileText, Globe, CheckCircle2 } from 'lucide-react';

export const TrustMarquee: React.FC = () => {
  const partners = [
    { name: 'Reuters Fact Archive', icon: Globe, category: 'Primary Wire' },
    { name: 'ESA Stratospheric Registry', icon: Satellite, category: 'Atmospheric Telemetry' },
    { name: 'Bellingcat Open Source Archive', icon: Database, category: 'Geospatial Intelligence' },
    { name: 'Baltic Air & Marine Navigation', icon: Radio, category: 'Surveillance NOTAM' },
    { name: 'Poynter IFCN Network', icon: ShieldCheck, category: 'Global Fact Checking' },
    { name: 'NOAA Environmental Satellite Data', icon: Satellite, category: 'Sensory Observation' },
    { name: 'ProPublica Investigative Lab', icon: FileText, category: 'Institutional Audit' },
    { name: 'OpenSanctions Research Index', icon: CheckCircle2, category: 'Regulatory Registry' },
  ];

  // Duplicate for continuous seamless marquee loop
  const marqueeItems = [...partners, ...partners];

  return (
    <section className="relative py-10 bg-slate-50/80 border-y border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
        <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-slate-400">
          COMPATIBLE WITH VERIFIED PRIMARY ARCHIVES & INVESTIGATIVE CONSORTIUMS
        </span>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Left & Right Gradient Masks for Seamless Edge Fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-10" />

        {/* Marquee Track */}
        <div className="animate-marquee flex items-center gap-6 sm:gap-8 py-2">
          {marqueeItems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={`${item.name}-${idx}`}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-blue-300 transition-colors whitespace-nowrap shrink-0 group cursor-default"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-none">{item.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.category}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
