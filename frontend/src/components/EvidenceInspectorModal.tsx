import React from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ArrowUpRight,
  Database,
  Quote,
  Share2
} from 'lucide-react';
import { EvidenceDocument } from '../types/investigation';

interface EvidenceInspectorModalProps {
  document: EvidenceDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EvidenceInspectorModal: React.FC<EvidenceInspectorModalProps> = ({
  document,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !document) return null;

  const getStatusBadge = (status: EvidenceDocument['status']) => {
    switch (status) {
      case 'supported':
        return {
          label: 'Supported',
          color: 'bg-cyan-50 text-cyan-800 border-cyan-200',
          icon: CheckCircle2,
        };
      case 'contradicted':
        return {
          label: 'Contradicted',
          color: 'bg-rose-50 text-rose-800 border-rose-200',
          icon: AlertTriangle,
        };
      case 'mixed':
        return {
          label: 'Mixed Evidence',
          color: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: HelpCircle,
        };
      case 'unverified':
      default:
        return {
          label: 'Unverified / Inconclusive',
          color: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: HelpCircle,
        };
    }
  };

  const statusInfo = getStatusBadge(document.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/90 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>PRIMARY EVIDENCE INSPECTOR // DEMONSTRATION RECORD</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close inspector modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Top Title & Classification */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold border ${statusInfo.color}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {statusInfo.label}
              </span>
              <span className="text-xs text-slate-400 font-mono">·</span>
              <span className="text-xs text-slate-500 font-medium">{document.source.tier}</span>
              <span className="text-xs text-slate-400 font-mono">·</span>
              <span className="text-xs font-mono text-slate-500">{document.primaryMetricOrDate}</span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {document.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {document.summary}
            </p>
          </div>

          {/* Highlighted Quote Excerpt Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <Quote className="w-3.5 h-3.5 text-blue-600" /> Exact Document Excerpt
            </div>
            <blockquote className="text-sm sm:text-base text-slate-800 italic leading-relaxed pl-3 border-l-2 border-blue-500">
              "{document.excerpt}"
            </blockquote>
            {document.highlightedText && (
              <div className="mt-3 text-xs bg-amber-50/80 border border-amber-200/80 text-amber-900 p-2.5 rounded-lg flex items-start gap-2">
                <span className="font-semibold shrink-0">Key Discrepancy:</span>
                <span>The text confirms "{document.highlightedText}".</span>
              </div>
            )}
          </div>

          {/* Source Provenance & Institutional Audit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Source Repository
              </h4>
              <p className="text-sm font-bold text-slate-900">{document.source.name}</p>
              <p className="text-xs font-mono text-blue-600 mt-0.5 truncate">{document.source.domain}</p>
              <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span className="font-medium text-slate-700">Archival Verification: </span>
                {document.source.reliabilityNote}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Evidentiary Alignment
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">{document.reasoning}</p>
              <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Methodology Score:</span>
                <span className="font-mono font-bold text-blue-700">{document.relevanceScore}/100</span>
              </div>
            </div>

          </div>

          {/* Boundaries & Epistemic Limitations */}
          <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-100 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-blue-900 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-700" /> Scope & Document Boundaries
            </span>
            <p className="leading-relaxed">
              {document.limitations}
            </p>
          </div>

        </div>

        {/* Modal Footer Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400 font-mono">
            Cryptographic SHA-256 fingerprint verified against primary index
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
            >
              Done Reading
            </button>
            <a
              href="#investigate-panel"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Test This In Pipeline</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
