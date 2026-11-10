import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { 
  FileCheck2, 
  FileWarning, 
  Image as ImageIcon, 
  GitBranch, 
  Compass, 
  HelpCircle, 
  ArrowUpRight, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  GripHorizontal,
  Search,
  Crosshair,
  Maximize2
} from 'lucide-react';
import { EVIDENCE_DOCUMENTS } from '../data/mockInvestigationData';
import { EvidenceDocument, ClaimStatus } from '../types/investigation';
import { EvidenceInspectorModal } from './EvidenceInspectorModal';
import { EvidenceConstellation } from './EvidenceConstellation';

interface EvidenceCardProps {
  doc: EvidenceDocument;
  index: number;
  isFeatured: boolean;
  onOpenDoc: (doc: EvidenceDocument) => void;
  getStatusTag: (status: ClaimStatus) => React.ReactNode;
}

const EvidenceCard: React.FC<EvidenceCardProps> = ({
  doc,
  index,
  isFeatured,
  onOpenDoc,
  getStatusTag,
}) => {
  const isDraggingRef = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Real-time cursor coordinates within the card
  const mouseX = useMotionValue(150);
  const mouseY = useMotionValue(150);

  // Smooth springs for fluid trailing of the magnifying glass
  const springX = useSpring(mouseX, { stiffness: 350, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 350, damping: 28 });

  // Numerical display transformations for HUD readout
  const displayX = useTransform(springX, (val) => Math.round(val));
  const displayY = useTransform(springY, (val) => Math.round(val));

  // Subtle 3D tilt on hover (card parallax)
  const rotateX = useTransform(mouseY, [0, 450], [2, -2]);
  const rotateY = useTransform(mouseX, [0, 650], [-2, 2]);
  const springRotateX = useSpring(rotateX, { stiffness: 220, damping: 28 });
  const springRotateY = useSpring(rotateY, { stiffness: 220, damping: 28 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    // Strict boundary clamping so loupe remains fully inside the card
    const radius = 50;
    const padding = 16;
    const clampedX = Math.max(radius + padding, Math.min(rect.width - radius - padding, rawX));
    const clampedY = Math.max(radius + padding, Math.min(rect.height - radius - padding, rawY));

    mouseX.set(clampedX);
    mouseY.set(clampedY);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;
      const radius = 50;
      const padding = 16;
      mouseX.set(Math.max(radius + padding, Math.min(rect.width - radius - padding, rawX)));
      mouseY.set(Math.max(radius + padding, Math.min(rect.height - radius - padding, rawY)));
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      key={doc.id}
      drag
      dragSnapToOrigin
      dragElastic={0.25}
      dragTransition={{ bounceStiffness: 580, bounceDamping: 24 }}
      whileDrag={{
        scale: 1.035,
        rotate: index % 2 === 0 ? 1.5 : -1.5,
        cursor: 'grabbing',
        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.35)',
        zIndex: 50,
      }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      onDragStart={() => {
        isDraggingRef.current = true;
      }}
      onDragEnd={() => {
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 120);
      }}
      onClick={() => {
        if (!isDraggingRef.current) {
          onOpenDoc(doc);
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        rotateX: isHovered ? springRotateX : 0,
        rotateY: isHovered ? springRotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      className={`group relative h-full flex flex-col rounded-3xl bg-white border border-slate-200/90 hover:border-zinc-800 shadow-[0_8px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)] transition-all duration-300 cursor-grab active:cursor-grabbing touch-none select-none overflow-hidden ${
        isFeatured ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'
      }`}
    >
      {/* Delicate hairline animated top accent on hover */}
      <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-zinc-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30" />

      {/* Subtle technical background grid */}
      <div className="absolute inset-0 bg-grid-subtle opacity-35 pointer-events-none z-0" />

      {/* Corner calibration brackets */}
      <div className="pointer-events-none absolute inset-3 z-10 flex flex-col justify-between transition-opacity duration-300 opacity-20 group-hover:opacity-90">
        <div className="flex justify-between items-start">
          <span className="w-2.5 h-2.5 border-t-2 border-l-2 border-zinc-900" />
          <span className="w-2.5 h-2.5 border-t-2 border-r-2 border-zinc-900" />
        </div>
        <div className="flex justify-between items-end">
          <span className="w-2.5 h-2.5 border-b-2 border-l-2 border-zinc-900" />
          <span className="w-2.5 h-2.5 border-b-2 border-r-2 border-zinc-900" />
        </div>
      </div>

      {/* Optical Forensic Magnifying Loupe */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute z-[5] select-none"
            style={{
              left: springX,
              top: springY,
              x: '-50%',
              y: '-50%',
            }}
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.2, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          >
            <div className="relative w-24 h-24 rounded-full border-2 border-zinc-900/80 bg-zinc-900/[0.04] shadow-[0_8px_25px_rgba(0,0,0,0.18)] flex items-center justify-center overflow-hidden backdrop-blur-[0.5px]">
              <div className="absolute inset-1 rounded-full border border-zinc-800/30" />
              <div className="absolute inset-2.5 rounded-full border border-dashed border-zinc-600/30" />
              <div className="absolute w-6 h-6 rounded-full border border-zinc-800/35 bg-black/[0.02]" />
              <div className="absolute inset-0 animate-radar-sweep pointer-events-none origin-center">
                <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-zinc-900/10 to-transparent" />
              </div>
              <div className="absolute left-1 right-1 h-[1px] bg-zinc-800/30" />
              <div className="absolute top-1 bottom-1 w-[1px] bg-zinc-800/30" />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-zinc-950 shadow-xs" />
              <div className="absolute top-1.5 text-[6px] font-mono font-bold tracking-widest text-zinc-800 bg-white/90 px-1 rounded border border-zinc-300/60 uppercase">
                2.50X LOUPE
              </div>
              <div className="absolute bottom-1.5 flex items-center gap-0.5 text-[5.5px] font-mono font-semibold text-zinc-700 bg-white/90 px-1 rounded border border-zinc-300/60">
                <span>POS:</span>
                <motion.span>{displayX}</motion.span>
                <span>,</span>
                <motion.span>{displayY}</motion.span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card Content (Full Height, Perfectly Aligned) */}
      <div className="relative z-20 flex-1 flex flex-col justify-between p-6 sm:p-7 min-h-[340px]">
        
        {/* Top Content Area */}
        <div>
          {/* Top Row: Left Status Tag & Right Toolset */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              {getStatusTag(doc.status)}
              <span className="text-zinc-300">·</span>
              <span className="text-xs font-mono text-zinc-500">{doc.primaryMetricOrDate}</span>
            </div>

            {/* Top Right Action & Badges */}
            <div className="flex items-center gap-1.5 text-zinc-400 shrink-0">
              {isFeatured && (
                <span className="text-[10px] font-mono text-zinc-900 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  OFFICIAL RECORD
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[10px] font-mono select-none text-zinc-600 bg-zinc-100/90 group-hover:bg-zinc-900 group-hover:text-white px-2 py-0.5 rounded-md border border-zinc-200/80 group-hover:border-zinc-900 font-medium transition-all duration-300 ease-out">
                <GripHorizontal className="w-3 h-3" /> drag & snap
              </span>
              <div className="text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 ease-out">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Document Title */}
          <h3 className="text-lg sm:text-xl font-extrabold text-zinc-900 tracking-tight group-hover:text-black transition-colors duration-300 mb-2">
            {doc.title}
          </h3>

          {/* Summary */}
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-4">
            {doc.summary}
          </p>

          {/* Excerpt callout */}
          <div className="p-3.5 rounded-xl bg-zinc-50/95 border border-zinc-200/80 group-hover:border-zinc-300 group-hover:bg-zinc-100/60 transition-all duration-300 text-xs text-zinc-800 italic leading-relaxed relative shadow-2xs">
            "{doc.excerpt}"
          </div>
        </div>

        {/* Bottom Source & Action Bar */}
        <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-zinc-800 truncate">{doc.source.name}</span>
            <span className="text-zinc-300">·</span>
            <span className="text-zinc-400 font-mono text-[11px] truncate">{doc.source.tier}</span>
          </div>

          <span className="text-zinc-900 font-semibold group-hover:underline whitespace-nowrap shrink-0 pl-2 flex items-center gap-1 transition-colors duration-300">
            <Search className="w-3.5 h-3.5 text-zinc-700" />
            Inspect Provenance →
          </span>
        </div>

      </div>
    </motion.div>
  );
};

export interface EvidenceExplorerProps {
  liveDocs?: EvidenceDocument[] | null;
  liveVerdict?: string | null;
  targetClaim?: string | null;
}

export const EvidenceExplorer: React.FC<EvidenceExplorerProps> = ({
  liveDocs,
  liveVerdict,
  targetClaim,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'supported' | 'contradicted' | 'unverified'>('all');
  const [selectedDoc, setSelectedDoc] = useState<EvidenceDocument | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeDocPool = liveDocs && liveDocs.length > 0 ? liveDocs : EVIDENCE_DOCUMENTS;
  const isViewingLive = Boolean(liveDocs && liveDocs.length > 0);

  const filteredDocs = activeDocPool.filter((doc) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'supported') return doc.status === 'supported';
    if (activeFilter === 'contradicted') return doc.status === 'contradicted';
    if (activeFilter === 'unverified') return doc.status === 'unverified' || doc.status === 'mixed';
    return true;
  });

  const supportedCount = activeDocPool.filter((d) => d.status === 'supported').length;
  const contradictedCount = activeDocPool.filter((d) => d.status === 'contradicted').length;
  const unverifiedCount = activeDocPool.filter((d) => d.status === 'unverified' || d.status === 'mixed').length;

  // Dynamic glow & laser color based on active evidence filter
  const beamTheme = (() => {
    switch (activeFilter) {
      case 'supported':
        return {
          color: '#10b981',
          shadow: 'rgba(16, 185, 129, 0.22)',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'contradicted':
        return {
          color: '#f43f5e',
          shadow: 'rgba(244, 63, 94, 0.22)',
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      case 'unverified':
        return {
          color: '#f59e0b',
          shadow: 'rgba(245, 158, 11, 0.22)',
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'all':
      default:
        return {
          color: '#2563eb',
          shadow: 'rgba(37, 99, 235, 0.22)',
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
        };
    }
  })();

  const handleOpenDoc = (doc: EvidenceDocument) => {
    setSelectedDoc(doc);
    setIsModalOpen(true);
  };

  const getStatusTag = (status: ClaimStatus) => {
    switch (status) {
      case 'supported':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-50/90 border border-emerald-200 px-2 py-0.5 rounded-md shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Supported
          </span>
        );
      case 'contradicted':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-rose-800 bg-rose-50/90 border border-rose-200 px-2 py-0.5 rounded-md shadow-2xs">
            <AlertTriangle className="w-3 h-3 text-rose-600" /> Contradicted
          </span>
        );
      case 'mixed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-amber-800 bg-amber-50/90 border border-amber-200 px-2 py-0.5 rounded-md shadow-2xs">
            <HelpCircle className="w-3 h-3 text-amber-600" /> Mixed
          </span>
        );
      case 'unverified':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-zinc-700 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md shadow-2xs">
            <HelpCircle className="w-3 h-3 text-zinc-500" /> Unresolved
          </span>
        );
    }
  };

  return (
    <section id="evidence-explorer" className="relative py-20 sm:py-28 bg-[#F8FAFC] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Real-Time Three.js Evidence Constellation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-300/80 text-zinc-900 text-xs font-semibold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-800" />
              {isViewingLive ? `Active Claim Dossier • ${liveVerdict?.toUpperCase() || 'VERIFIED'}` : 'Tactile Evidence Explorer'}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight">
              {isViewingLive ? 'Investigated Evidence Trail' : 'Every conclusion has a trail.'}
            </h2>
            <p className="mt-3 text-base text-zinc-600 max-w-xl">
              {isViewingLive
                ? `Directly auditing real-world citations retrieved for "${targetClaim}". Drag cards or hover to inspect provenance.`
                : 'Inspect physical digital artifacts from our demonstration archive. Hovering activates optical zoom-out with a forensic magnifying glass loupe, or drag cards with tactile magnetic snap.'}
            </p>
          </div>

          {/* Interactive 3D Three.js Evidence Holographic Radar */}
          <div 
            className="lg:col-span-5 h-52 sm:h-56 rounded-3xl bg-white/95 relative overflow-hidden flex flex-col justify-between p-4 backdrop-blur-md transition-shadow duration-500"
            style={{
              boxShadow: `0 12px 36px -4px ${beamTheme.shadow}, 0 0 1px rgba(0, 0, 0, 0.08)`,
            }}
          >
            {/* SVG Precision Glowing Border Beam (Continuous Circuit Orbit) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-3xl overflow-visible z-20">
              {/* Base Hairline Blueprint Track */}
              <rect
                x="0.75"
                y="0.75"
                width="calc(100% - 1.5px)"
                height="calc(100% - 1.5px)"
                rx="23.25"
                fill="none"
                stroke="rgba(226, 232, 240, 0.85)"
                strokeWidth="1.5"
              />
              {/* Active Traveling Laser Beam (Extended Long Sweeping Trail) */}
              <motion.rect
                x="0.75"
                y="0.75"
                width="calc(100% - 1.5px)"
                height="calc(100% - 1.5px)"
                rx="23.25"
                fill="none"
                stroke={beamTheme.color}
                strokeWidth="2.5"
                strokeDasharray="380 220"
                animate={{ strokeDashoffset: [0, -600] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
                style={{
                  filter: `drop-shadow(0 0 6px ${beamTheme.color}) drop-shadow(0 0 12px ${beamTheme.color})`,
                }}
              />
            </svg>

            {/* Corner Blueprint Calibration Reticles (Extended 12px Bracket Length) */}
            <div className="pointer-events-none absolute inset-2.5 z-20 flex flex-col justify-between opacity-60">
              <div className="flex justify-between items-start">
                <span className="w-3 h-3 border-t-2 border-l-2 transition-colors duration-300" style={{ borderColor: beamTheme.color }} />
                <span className="w-3 h-3 border-t-2 border-r-2 transition-colors duration-300" style={{ borderColor: beamTheme.color }} />
              </div>
              <div className="flex justify-between items-end">
                <span className="w-3 h-3 border-b-2 border-l-2 transition-colors duration-300" style={{ borderColor: beamTheme.color }} />
                <span className="w-3 h-3 border-b-2 border-r-2 transition-colors duration-300" style={{ borderColor: beamTheme.color }} />
              </div>
            </div>

            {/* Subtle Center Radial Aura */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-20 transition-colors duration-500 z-0"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${beamTheme.color} 0%, transparent 70%)`,
              }}
            />

            {/* Card Header */}
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider px-1 relative z-10">
              <span className="flex items-center gap-1.5">
                <span 
                  className="w-2 h-2 rounded-full animate-pulse transition-colors duration-300" 
                  style={{ backgroundColor: beamTheme.color }} 
                />
                3D Neural Evidence Graph
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono border ${beamTheme.badge} transition-colors duration-300`}>
                Live WebGL
              </span>
            </div>

            {/* Embedded 3D Scene */}
            <div className="w-full flex-1 relative z-10 my-1">
              <EvidenceConstellation filter={activeFilter} />
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between text-[9.5px] font-mono text-slate-400 pt-2 border-t border-slate-100/80 px-1 relative z-10">
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-slate-400" />
                {activeDocPool.length} Archival Nodes
              </span>
              <span className="uppercase font-semibold tracking-wider transition-colors duration-300" style={{ color: beamTheme.color }}>
                Mode: {activeFilter}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Filter Segmented Controls */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-zinc-200/70 rounded-xl shadow-2xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              All Artifacts ({activeDocPool.length})
            </button>
            <button
              onClick={() => setActiveFilter('supported')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                activeFilter === 'supported'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Supporting ({supportedCount})
            </button>
            <button
              onClick={() => setActiveFilter('contradicted')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                activeFilter === 'contradicted'
                  ? 'bg-white text-rose-800 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Contradictions ({contradictedCount})
            </button>
            <button
              onClick={() => setActiveFilter('unverified')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                activeFilter === 'unverified'
                  ? 'bg-white text-zinc-800 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Open Gaps ({unverifiedCount})
            </button>
          </div>
          
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            Drag cards with magnetic snap • Click to inspect provenance
          </span>
        </div>

        {/* Asymmetric Bento Grid with Black Liquid Borders, Optical Loupe & Magnetic Snap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc, index) => {
            const isFeatured = index === 0 || index === 3;
            return (
              <EvidenceCard
                key={doc.id}
                doc={doc}
                index={index}
                isFeatured={isFeatured}
                onOpenDoc={handleOpenDoc}
                getStatusTag={getStatusTag}
              />
            );
          })}
        </div>

        {/* Informative Disclaimer Banner */}
        <div className="mt-10 p-4 rounded-2xl bg-white border border-zinc-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 shadow-2xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-zinc-800 shrink-0" />
            <span>
              All sample documents displayed above are verified demonstration records with simulated cryptographic hashes. Move your cursor across cards to experience forensic optical inspection.
            </span>
          </div>
          <a
            href="#technology"
            className="text-zinc-900 hover:text-black font-semibold whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            How Gemma 4 parses citations →
          </a>
        </div>

      </div>

      {/* Detail Modal Component */}
      <EvidenceInspectorModal
        document={selectedDoc}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};
