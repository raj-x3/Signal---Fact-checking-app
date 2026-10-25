import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  ExternalLink, 
  Radio, 
  FileCheck, 
  AlertTriangle, 
  Satellite, 
  Compass, 
  Sparkles,
  Layers,
  Database
} from 'lucide-react';

interface HeroSectionProps {
  onStartInvestigation: () => void;
  onExploreTechnology: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartInvestigation,
  onExploreTechnology,
}) => {
  // Cursor-responsive perspective state
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt (max 6 degrees to maintain elegance and legibility)
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 6;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <section className="relative pt-32 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32 overflow-hidden bg-[#F8FAFC]">
      {/* Delicate background illumination and grid */}
      <div className="absolute inset-0 bg-grid-subtle opacity-70 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-zinc-900/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Kinetic Typography & Content */}
          <div className="lg:col-span-6 flex flex-col items-start z-10">
            {/* Pill/Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/80 border border-blue-200/80 text-blue-700 text-xs font-semibold tracking-wide uppercase shadow-xs mb-6 backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              AI-Powered Evidence Investigation
            </div>

            {/* Staggered Word Reveal Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 text-balance">
              <span className="block transform transition-transform duration-500 ease-out">
                Don't just believe it.
              </span>
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent animate-light-sweep font-black">
                Investigate it.
              </span>
            </h1>

            {/* Supporting Prose */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
              Turn viral claims, screenshots, and conflicting information into evidence-backed investigations. Discover what is supported, what is disputed, and what remains unknown.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                onClick={onStartInvestigation}
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <span>Start an Investigation</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreTechnology}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-xs hover:border-slate-300 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Explore the Technology</span>
              </button>
            </div>

            {/* Trust Markers without pills */}
            <div className="mt-10 pt-6 border-t border-slate-200/70 w-full flex items-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <FileCheck className="w-3.5 h-3.5 text-blue-600" /> Primary Archival Sources
              </span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Layers className="w-3.5 h-3.5 text-cyan-600" /> Structured Decomposition
              </span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Database className="w-3.5 h-3.5 text-violet-600" /> Gemma 4 Grounding
              </span>
            </div>
          </div>

          {/* Right Column: 3D Interactive Evidence Visualization */}
          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="lg:col-span-6 relative perspective-1200 py-6 select-none"
          >
            <div
              className="relative w-full max-w-lg mx-auto transform-style-3d transition-transform duration-200 ease-out"
              style={{
                transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
              }}
            >
              {/* Connecting Ambient SVG Pulse Lines */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
                viewBox="0 0 500 420"
                fill="none"
              >
                <defs>
                  <linearGradient id="blackLiquidLine" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#000000" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#27272a" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#09090b" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                {/* Node connection curves */}
                <path d="M 250 170 C 180 130, 90 100, 70 80" stroke="url(#blackLiquidLine)" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M 280 230 C 350 260, 420 280, 440 320" stroke="url(#blackLiquidLine)" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M 170 240 C 130 290, 110 330, 90 360" stroke="url(#blackLiquidLine)" strokeWidth="1.5" strokeDasharray="4 4" />

                {/* Pulsing light rings */}
                <circle cx="250" cy="190" r="3" fill="#09090b" className="animate-ping origin-center" />
                <circle cx="70" cy="80" r="3" fill="#18181b" />
                <circle cx="440" cy="320" r="3" fill="#27272a" />
              </svg>

              {/* CARD 1: Central White Investigation Card with Black Liquid Border */}
              <div 
                className="relative z-20 bg-white/95 rounded-2xl p-6 border border-zinc-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-md transform-style-3d hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] transition-shadow duration-300 overflow-hidden"
                style={{ transform: 'translateZ(40px)' }}
              >
                {/* Animated Black Liquid Scanning Beam sweeping across central card */}
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-zinc-950 to-transparent pointer-events-none z-30 animate-scanline shadow-[0_0_8px_rgba(0,0,0,0.6)]" />

                {/* Subtle top edge track */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">
                      INVESTIGATION // CASE-9842
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    Mixed Evidence
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Investigated Claim</p>
                  <p className="text-sm font-semibold text-slate-800 mt-1 leading-snug">
                    "Stratospheric solar research platform exploded over maritime radar exclusion zone."
                  </p>
                </div>

                {/* Sub-assertions decomposition breakdown */}
                <div className="mt-4 space-y-2">
                  <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start justify-between gap-3 text-xs hover:border-cyan-200 transition-colors">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <span className="text-slate-700">Balloon transponder logged at 65,000 ft</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200/60 shrink-0">
                      Supported
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start justify-between gap-3 text-xs hover:border-rose-200 transition-colors">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span className="text-slate-700">Explosion & localized frequency jamming</span>
                    </div>
                    <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200/60 shrink-0">
                      Contradicted
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-600" /> Gemma 4 decomposed 3 atomic statements
                  </span>
                  <span className="font-mono text-slate-400">4 primary records</span>
                </div>
              </div>

              {/* FLOATING CARD 2: Primary Geological/Flight Telemetry (Top Left with Gentle Float & Magnetic Snap) */}
              <motion.div 
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.25}
                dragTransition={{ bounceStiffness: 600, bounceDamping: 22 }}
                whileHover={{ scale: 1.04, y: -6 }}
                whileTap={{ scale: 0.97 }}
                className="absolute -top-8 -left-6 z-30 bg-white/95 rounded-xl p-3.5 border border-slate-200/90 shadow-[0_12px_30px_rgba(15,23,42,0.09)] hover:shadow-[0_16px_35px_rgba(37,99,235,0.18)] hover:border-blue-400 w-56 transform-style-3d transition-colors duration-200 backdrop-blur-md animate-float-gentle cursor-grab active:cursor-grabbing"
                style={{ transform: 'translateZ(65px)' }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Satellite className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-[11px] font-bold text-slate-800">Civil Telemetry Log</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  Beacon frequency: <span className="font-mono text-blue-700 font-semibold">1090 MHz</span>
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
                  <span>Cryptographic hash verified</span>
                  <span className="text-blue-600 font-semibold">98% match</span>
                </div>
              </motion.div>

              {/* FLOATING CARD 3: Contradicting Official Notice (Bottom Right with Delayed Float & Magnetic Snap) */}
              <motion.div 
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.25}
                dragTransition={{ bounceStiffness: 600, bounceDamping: 22 }}
                whileHover={{ scale: 1.04, y: -6 }}
                whileTap={{ scale: 0.97 }}
                className="absolute -bottom-8 -right-6 z-30 bg-white/95 rounded-xl p-3.5 border border-slate-200/90 shadow-[0_12px_30px_rgba(15,23,42,0.09)] hover:shadow-[0_16px_35px_rgba(244,63,94,0.18)] hover:border-rose-400 w-60 transform-style-3d transition-colors duration-200 backdrop-blur-md animate-float-delayed cursor-grab active:cursor-grabbing"
                style={{ transform: 'translateZ(75px)' }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Pre-scheduled NOTAM
                  </span>
                  <span className="text-[9px] font-mono text-rose-700 bg-rose-50 px-1 py-0.5 rounded border border-rose-200">
                    Refutation
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  Radar outage was announced 4 days in advance for coastal maintenance.
                </p>
                <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span>Official Aviation Archive</span>
                  <span className="text-slate-500 font-mono">14:00 UTC</span>
                </div>
              </motion.div>

              {/* FLOATING CARD 4: Source Graph Snippet (Bottom Left) */}
              <div 
                className="absolute bottom-6 -left-10 z-10 hidden sm:block bg-white/90 rounded-lg p-2.5 border border-slate-200/80 shadow-md w-48 backdrop-blur-xs transform-style-3d"
                style={{ transform: 'translateZ(30px)' }}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-700">
                  <Radio className="w-3 h-3 text-cyan-600" /> Source Cross-Check
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  6 independent sensors confirmed baseline stability.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
