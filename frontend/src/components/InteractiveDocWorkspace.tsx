import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Search, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  Clock, 
  Hash, 
  Sliders, 
  ExternalLink,
  ChevronRight,
  Maximize2,
  FileCheck
} from 'lucide-react';

interface DocItem {
  id: string;
  name: string;
  docCode: string;
  source: string;
  timestamp: string;
  classification: 'SUPPORTED' | 'CONTRADICTED' | 'FLAGGED';
  stampText: string;
  stampColor: 'cyan' | 'rose' | 'amber';
  excerpt: string;
  highlightedPhrase: string;
  marginNote: string;
  sha256: string;
  ocrScore: string;
}

export const InteractiveDocWorkspace: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedDocIndex, setSelectedDocIndex] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);

  const docs: DocItem[] = [
    {
      id: 'doc-1',
      name: 'Stratospheric Flight Telemetry',
      docCode: 'ESA-CIV-884/STRAT',
      source: 'European Stratospheric Aviation Registry',
      timestamp: '2026-10-18 14:22:04 UTC',
      classification: 'SUPPORTED',
      stampText: 'VERIFIED PRIMARY TELEMETRY',
      stampColor: 'cyan',
      excerpt: 'Platform SB-7 maintained nominal differential envelope pressure of 10.4 mbar at altitude FL650. Transponder frequency was logged at 1090 MHz Mode S with zero electromagnetic interference registered on civil maritime VHF channels.',
      highlightedPhrase: 'zero electromagnetic interference registered on civil maritime VHF channels',
      marginNote: 'ADS-B transponder logs confirm nominal pressure relief; no thermal anomaly recorded.',
      sha256: 'e89d...4f21',
      ocrScore: '99.4%',
    },
    {
      id: 'doc-2',
      name: 'Maritime NOTAM Maintenance Notice',
      docCode: 'NAV-BALTIC-4912/26',
      source: 'Baltic Air Navigation & Marine Agency',
      timestamp: '2026-10-14 09:00:00 UTC (4 days prior)',
      classification: 'CONTRADICTED',
      stampText: 'CONTRADICTION CONFIRMED',
      stampColor: 'rose',
      excerpt: 'Notice to Mariners & Airmen: Utö Coastal Doppler Station scheduled for primary pulse timing calibration between 13:00 and 16:30 UTC on Oct 18. Planned outage is non-emergency routine preventive maintenance.',
      highlightedPhrase: 'Planned outage is non-emergency routine preventive maintenance',
      marginNote: 'Published 96 hours before the viral claim alleged an emergency radar explosion.',
      sha256: '9a3b...c712',
      ocrScore: '98.8%',
    },
    {
      id: 'doc-3',
      name: 'Optical Video Frame Exif Metadata',
      docCode: 'VIRAL-ARTIFACT-X184',
      source: 'Public Social Video Capture Analysis',
      timestamp: '2026-10-18 15:10:22 UTC',
      classification: 'FLAGGED',
      stampText: 'DISCREPANCY FLAGGED',
      stampColor: 'amber',
      excerpt: 'Visual footage compression index: 84.2%. Focal length: 85mm. Detected optical condensation plume corresponds to standard high-altitude aerosol contrail dissipation, contrary to explosive pulse claims.',
      highlightedPhrase: 'corresponds to standard high-altitude aerosol contrail dissipation',
      marginNote: 'Video timestamp was captured 2 hours after scheduled downtime had already commenced.',
      sha256: '7c4e...189a',
      ocrScore: '97.2%',
    },
  ];

  // Auto-play steps gently if user isn't hovering
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
      setSelectedDocIndex((prev) => (prev + 1) % docs.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isAutoPlay, docs.length]);

  const steps = [
    {
      step: '01',
      title: 'Deconstruct Claims into Testable Assertions',
      subtitle: 'Sensational headlines are parsed into independent, falsifiable hypotheses.',
      metric: '3 Atomic Predicates',
    },
    {
      step: '02',
      title: 'Retrieve & Cross-Examine Primary Records',
      subtitle: 'Target cryptographically verified flight logs, not opinion aggregators.',
      metric: '4 Official Archives',
    },
    {
      step: '03',
      title: 'Detect Discrepancies & Synthesize Evidence',
      subtitle: 'Highlight contradictions, audit timestamps, and establish uncertainty bounds.',
      metric: 'Uncertainty Mapped',
    },
  ];

  const currentDoc = docs[selectedDocIndex];

  return (
    <section className="relative py-20 sm:py-28 bg-[#F8FAFC] border-t border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Live Forensic Workspace
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight text-balance">
            Watch evidence come to life.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            See how SignalCheck’s automated document scanner cross-references claims in real-time with optical highlight sweeps, citation hashes, and official archival stamps.
          </p>
        </div>

        {/* 2-Column Side-by-Side: Steps on Left, Interactive Animated Doc on Right */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch"
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          
          {/* Left Column: Interactive Step Controller */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {steps.map((st, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={st.step}
                    onClick={() => {
                      setActiveStep(idx);
                      setSelectedDocIndex(idx);
                      setIsAutoPlay(false);
                    }}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                      isActive
                        ? 'bg-white border-zinc-400 shadow-md ring-2 ring-zinc-900/10 translate-x-1'
                        : 'bg-white/60 hover:bg-white border-slate-200/90 shadow-2xs hover:border-slate-300'
                    }`}
                  >
                    {/* Active vertical progress indicator on left border */}
                    {isActive && (
                      <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-zinc-950 rounded-r" />
                    )}

                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-mono text-xs font-bold ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                        STEP {st.step}
                      </span>
                      <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                        isActive ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {st.metric}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {st.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {st.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Document Selector Pills */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider block mb-2.5">
                Switch Forensic Artifact Preview:
              </span>
              <div className="flex flex-col gap-1.5">
                {docs.map((d, index) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setSelectedDocIndex(index);
                      setActiveStep(index);
                      setIsAutoPlay(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      selectedDocIndex === index
                        ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/80 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <span className="truncate pr-2">{d.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">{d.docCode}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Animated Forensic Document Workspace */}
          <div className="lg:col-span-7 flex flex-col">
            <motion.div 
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.16}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 25 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative flex-1 p-[1.5px] rounded-3xl overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-shadow duration-300 cursor-grab active:cursor-grabbing"
            >
              {/* Base dark neutral hairline track */}
              <div className="absolute inset-0 bg-zinc-200/90 pointer-events-none" />

              {/* Viscous Black Liquid Stream 1 (Deep Onyx & Jet Black Flow) */}
              <div 
                className="absolute inset-[-220%] animate-liquid-border pointer-events-none opacity-85"
                style={{
                  background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 150deg, rgba(39, 39, 42, 0.45) 210deg, #18181b 270deg, #09090b 320deg, #000000 360deg)',
                }}
              />

              {/* Viscous Black Liquid Stream 2 (Charcoal & Obsidian Flow) */}
              <div 
                className="absolute inset-[-220%] animate-liquid-border-reverse pointer-events-none opacity-70"
                style={{
                  background: 'conic-gradient(from 180deg at 50% 50%, transparent 0deg, transparent 160deg, rgba(63, 63, 70, 0.4) 230deg, #27272a 290deg, #09090b 335deg, #000000 360deg)',
                }}
              />

              <div className="relative z-10 h-full w-full bg-white rounded-[22.5px] overflow-hidden flex flex-col justify-between">
                
                {/* Top Window Bar (Simulating Forensic OS Viewer) */}
                <div className="px-5 py-3.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  </div>
                  <span className="text-slate-300">|</span>
                  <span className="font-mono text-xs font-bold text-slate-700 flex items-center gap-1.5 truncate">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    {currentDoc.docCode}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                    OCR Conf: <strong className="text-slate-700 font-semibold">{currentDoc.ocrScore}</strong>
                  </span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>

              {/* Document Search / Filter Bar */}
              <div className="px-6 py-2.5 bg-slate-100/50 border-b border-slate-200/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-500 flex-1 max-w-xs">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search inside document..."
                    className="bg-transparent border-0 text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full"
                  />
                </div>
                <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                  <span>SHA256: {currentDoc.sha256}</span>
                </div>
              </div>

              {/* Document Paper Body with Live Animated Laser Scan Line */}
              <div className="relative p-6 sm:p-8 flex-1 min-h-[300px] overflow-hidden bg-white select-text">
                
                {/* ANIMATED SCAN LINE BEAM (Sweeps down the document in black liquid tone) */}
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-zinc-950 to-transparent pointer-events-none z-20 animate-scanline shadow-[0_0_8px_rgba(0,0,0,0.6)]" />

                {/* Subtle Document Grid Lines in background */}
                <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

                {/* Rubber Stamp Overlay (Authentic Forensic Look) */}
                <div 
                  className={`absolute top-6 right-6 z-10 pointer-events-none transform -rotate-6 border-2 px-3 py-1 rounded-md text-[11px] font-mono font-black tracking-widest uppercase transition-all duration-300 ${
                    currentDoc.stampColor === 'cyan'
                      ? 'border-cyan-600 text-cyan-700 bg-cyan-50/70'
                      : currentDoc.stampColor === 'rose'
                      ? 'border-rose-600 text-rose-700 bg-rose-50/70'
                      : 'border-amber-600 text-amber-700 bg-amber-50/70'
                  }`}
                >
                  {currentDoc.stampText}
                </div>

                {/* Document Metadata Header */}
                <div className="pb-4 mb-4 border-b border-slate-100 relative z-0">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    OFFICIAL EVIDENCE RECORD // REPOSITORY DISCLOSURE
                  </p>
                  <h4 className="text-xl font-extrabold text-slate-900 mt-1">
                    {currentDoc.name}
                  </h4>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">
                    {currentDoc.source}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Timestamp: {currentDoc.timestamp}
                  </p>
                </div>

                {/* Document Body Text with Glowing Highlight */}
                <div className="relative z-0 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                  <p className="leading-relaxed">
                    {currentDoc.excerpt.split(currentDoc.highlightedPhrase)[0]}
                    <mark className="bg-cyan-100 text-cyan-900 font-semibold px-1 py-0.5 rounded shadow-xs relative inline-block group">
                      {currentDoc.highlightedPhrase}
                      <span className="absolute -top-7 left-0 bg-slate-900 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                        Discrepancy Match
                      </span>
                    </mark>
                    {currentDoc.excerpt.split(currentDoc.highlightedPhrase)[1]}
                  </p>
                </div>

                {/* Analyst Marginalia Callout */}
                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-3 shadow-2xs">
                  <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Eye className="w-3 h-3" />
                  </div>
                  <div>
                    <strong className="text-slate-900 font-bold block mb-0.5">Forensic Cross-Check:</strong>
                    <span>{currentDoc.marginNote}</span>
                  </div>
                </div>

              </div>

              {/* Bottom Document Status Bar */}
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Source verified against primary cryptographic index
                </span>
                <span className="text-slate-400">Status: {currentDoc.classification}</span>
              </div>

            </div>
          </motion.div>
        </div>

        </div>

      </div>
    </section>
  );
};
