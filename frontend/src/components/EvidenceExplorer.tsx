import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
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
  const mouseX = useMotionValue(120);
  const mouseY = useMotionValue(120);

  // Smooth springs for fluid trailing of the magnifying glass
  const springX = useSpring(mouseX, { stiffness: 420, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 420, damping: 28 });

  // Numerical display transformations for HUD readout
  const displayX = useTransform(springX, (val) => Math.round(val));
  const displayY = useTransform(springY, (val) => Math.round(val));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <motion.div
      ref={cardRef}
      key={doc.id}
      drag
      dragSnapToOrigin
      dragElastic={0.32}
      dragTransition={{ bounceStiffness: 580, bounceDamping: 24 }}
      whileDrag={{
        scale: 1.045,
        rotate: index % 2 === 0 ? 2 : -2,
        cursor: 'grabbing',
        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.35), 0 0 1px rgba(0, 0, 0, 0.8)',
        zIndex: 50,
      }}
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-3xl cursor-grab active:cursor-grabbing touch-none select-none transition-all duration-300 ${
        isFeatured ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'
      }`}
    >
      {/* =========================================================================
          1. BLACK LIQUID BORDER SYSTEM (Multiple flowing streams of viscous black ink)
          No colored gradients: Jet black, deep onyx, obsidian, dark charcoal & graphite
         ========================================================================= */}
      <div className="absolute inset-0 rounded-3xl p-[1.5px] overflow-hidden pointer-events-none z-0">
        {/* Base dark neutral hairline track */}
        <div className="absolute inset-0 bg-zinc-200/90 group-hover:bg-zinc-300/80 transition-colors duration-300" />

        {/* Viscous Black Liquid Stream 1 (Deep Onyx & Jet Black Flow) */}
        <div 
          className="absolute inset-[-220%] animate-liquid-border pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 150deg, rgba(39, 39, 42, 0.45) 210deg, #18181b 270deg, #09090b 320deg, #000000 360deg)',
          }}
        />

        {/* Viscous Black Liquid Stream 2 (Counter-flowing Charcoal & Obsidian, 180° offset) */}
        <div 
          className="absolute inset-[-220%] animate-liquid-border-reverse pointer-events-none opacity-70 group-hover:opacity-95 transition-opacity duration-300"
          style={{
            background: 'conic-gradient(from 180deg at 50% 50%, transparent 0deg, transparent 160deg, rgba(63, 63, 70, 0.4) 230deg, #27272a 290deg, #09090b 335deg, #000000 360deg)',
          }}
        />

        {/* Viscous Black Liquid Stream 3 (Dark Graphite Wave - accelerates on hover) */}
        <div 
          className="absolute inset-[-220%] animate-liquid-border-fast pointer-events-none opacity-0 group-hover:opacity-60 transition-opacity duration-300"
          style={{
            background: 'conic-gradient(from 90deg at 50% 50%, transparent 0deg, transparent 200deg, rgba(24, 24, 27, 0.3) 260deg, #000000 360deg)',
          }}
        />
      </div>

      {/* =========================================================================
          2. INNER CARD CONTAINER WITH TECHNICAL "ZOOM OUT" ON HOVER
             When user hovers, card zooms out slightly (scale: 0.98) with precision spring,
             revealing forensic camera framing / inspection viewport feel.
         ========================================================================= */}
      <motion.div 
        animate={{
          scale: isHovered ? 0.98 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 420,
          damping: 26,
        }}
        className="relative z-10 m-[1.5px] rounded-[22.5px] overflow-hidden bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.09)] transition-shadow duration-300 flex flex-col justify-between p-6 sm:p-7 min-h-[340px]"
      >
        {/* Subtle technical background grid */}
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

        {/* =====================================================================
            3. TECHNICAL MAGNIFYING GLASS ANIMATION RUNNING OUT & FOLLOWING HOVER
               Runs out from resting point on hover, smoothly follows mouse pointer
               in the background with optical lens bezel, handle, crosshair & HUD.
           ===================================================================== */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute z-0 select-none"
          style={{
            left: springX,
            top: springY,
            x: '-50%',
            y: '-50%',
          }}
          animate={{
            scale: isHovered ? 1 : 0.15,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 340,
            damping: 24,
          }}
        >
          {/* Magnifying Glass Assembly Container */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            
            {/* Magnifying Glass Handle (Angled 45° from lower-right rim) */}
            <div 
              className="absolute left-1/2 top-1/2 w-4 h-18 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black rounded-b-lg border border-zinc-700/80 shadow-[0_8px_16px_rgba(0,0,0,0.35)] origin-top pointer-events-none"
              style={{
                transform: 'translate(44px, 44px) rotate(-45deg)',
              }}
            >
              {/* Grip ridges on handle */}
              <div className="w-full h-1 bg-zinc-700/70 mt-3" />
              <div className="w-full h-1 bg-zinc-700/70 mt-1.5" />
              <div className="w-full h-1 bg-zinc-700/70 mt-1.5" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 mx-auto mt-4" />
            </div>

            {/* Magnifying Glass Lens Outer Metallic Ring (Shades of dark liquid steel & onyx) */}
            <div className="relative w-40 h-40 rounded-full border-2 border-zinc-900 bg-black/[0.02] shadow-[0_12px_36px_rgba(0,0,0,0.18),inset_0_0_24px_rgba(0,0,0,0.06)] flex items-center justify-center overflow-hidden">
              
              {/* Secondary precision bezel step ring */}
              <div className="absolute inset-1.5 rounded-full border border-zinc-800/40" />
              
              {/* Concentric millimeter tick ring */}
              <div className="absolute inset-4 rounded-full border border-dashed border-zinc-600/30" />
              
              {/* Inner focus target circle */}
              <div className="absolute w-12 h-12 rounded-full border border-zinc-800/40 bg-black/[0.03]" />

              {/* Optical Radar Sweep line running inside the lens */}
              <div className="absolute inset-0 animate-radar-sweep pointer-events-none origin-center">
                <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-zinc-900/10 to-transparent" />
              </div>

              {/* Crosshair Horizontal Line */}
              <div className="absolute left-2 right-2 h-[1px] bg-zinc-800/35 flex items-center justify-between px-1">
                <span className="w-1.5 h-[1px] bg-zinc-900" />
                <span className="w-1.5 h-[1px] bg-zinc-900" />
              </div>

              {/* Crosshair Vertical Line */}
              <div className="absolute top-2 bottom-2 w-[1px] bg-zinc-800/35 flex flex-col items-center justify-between py-1">
                <span className="h-1.5 w-[1px] bg-zinc-900" />
                <span className="h-1.5 w-[1px] bg-zinc-900" />
              </div>

              {/* Center Target Microdot */}
              <div className="absolute w-1.5 h-1.5 rounded-full bg-zinc-950 shadow-xs" />

              {/* Technical Lens HUD Overlay (Monochrome dark readouts) */}
              <div className="absolute top-4 text-[8px] font-mono font-bold tracking-widest text-zinc-800 bg-white/70 px-1 rounded border border-zinc-300/60 uppercase">
                2.50X LOUPE
              </div>

              <div className="absolute bottom-4 flex items-center gap-1 text-[7.5px] font-mono text-zinc-700 bg-white/70 px-1 rounded border border-zinc-300/60">
                <span>POS:</span>
                <motion.span>{displayX}</motion.span>
                <span>,</span>
                <motion.span>{displayY}</motion.span>
              </div>

              {/* Angle Calibration Degree Marks (0°, 90°, 180°, 270°) */}
              <div className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[6px] font-mono text-zinc-500">
                180°
              </div>
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[6px] font-mono text-zinc-500">
                0°
              </div>
              <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[6px] font-mono text-zinc-500">
                90°
              </div>
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[6px] font-mono text-zinc-500">
                270°
              </div>
            </div>

          </div>
        </motion.div>

        {/* =====================================================================
            4. TECHNICAL VIEWPORT CORNER BRACKETS (Reveal on Hover Zoom-out)
           ===================================================================== */}
        <div className="pointer-events-none absolute inset-3 z-10 flex flex-col justify-between transition-opacity duration-300 opacity-20 group-hover:opacity-100">
          <div className="flex justify-between items-start">
            <span className="w-2.5 h-2.5 border-t-2 border-l-2 border-zinc-900" />
            <span className="w-2.5 h-2.5 border-t-2 border-r-2 border-zinc-900" />
          </div>
          <div className="flex justify-between items-end">
            <span className="w-2.5 h-2.5 border-b-2 border-l-2 border-zinc-900" />
            <span className="w-2.5 h-2.5 border-b-2 border-r-2 border-zinc-900" />
          </div>
        </div>

        {/* Tactile Magnetic Drag Grip & Inspect Affordance */}
        <div className="absolute top-4 right-4 flex items-center gap-2 text-zinc-400 z-20">
          <span className="inline-flex items-center gap-1 text-[10px] font-mono select-none text-zinc-600 bg-zinc-100/90 group-hover:bg-zinc-900 group-hover:text-white px-2 py-0.5 rounded-md border border-zinc-200/80 group-hover:border-zinc-900 font-medium transition-all duration-200">
            <GripHorizontal className="w-3 h-3" /> drag & snap
          </span>
          <div className="text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Top Content Area */}
        <div className="relative z-20">
          {/* Top Metadata Strip */}
          <div className="flex items-center gap-2 mb-3">
            {getStatusTag(doc.status)}
            <span className="text-zinc-300">·</span>
            <span className="text-xs font-mono text-zinc-500">{doc.primaryMetricOrDate}</span>
            {isFeatured && (
              <span className="text-[10px] font-mono text-zinc-900 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider ml-auto pr-8">
                OFFICIAL RECORD
              </span>
            )}
          </div>

          {/* Document Title */}
          <h3 className="text-lg sm:text-xl font-extrabold text-zinc-900 tracking-tight group-hover:text-black transition-colors mb-2 pr-8">
            {doc.title}
          </h3>

          {/* Summary */}
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-4">
            {doc.summary}
          </p>

          {/* Excerpt callout */}
          <div className="p-3.5 rounded-xl bg-zinc-50/90 border border-zinc-200/80 group-hover:border-zinc-400 group-hover:bg-zinc-100/60 transition-all duration-200 text-xs text-zinc-800 italic leading-relaxed relative">
            "{doc.excerpt}"
          </div>
        </div>

        {/* Bottom Source & Action Bar */}
        <div className="relative z-20 mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-zinc-800 truncate">{doc.source.name}</span>
            <span className="text-zinc-300">·</span>
            <span className="text-zinc-400 font-mono text-[11px] truncate">{doc.source.tier}</span>
          </div>

          <span className="text-zinc-900 font-semibold group-hover:underline whitespace-nowrap shrink-0 pl-2 flex items-center gap-1">
            <Search className="w-3.5 h-3.5 text-zinc-700" />
            Inspect Provenance →
          </span>
        </div>

      </motion.div>
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
    <section id="evidence-explorer" className="relative py-20 sm:py-28 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
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

          {/* Interactive Filter Segmented Controls */}
          <div className="flex items-center gap-1 p-1 bg-zinc-200/70 rounded-xl self-start md:self-auto shrink-0 shadow-2xs">
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
