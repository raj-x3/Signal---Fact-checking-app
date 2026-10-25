import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  GitFork, 
  Search, 
  FileCheck, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  FileSearch, 
  Scale, 
  AlertCircle 
} from 'lucide-react';

export const Gemma4TechSection: React.FC = () => {
  const [activeNode, setActiveNode] = useState<number>(2);

  const processNodes = [
    {
      id: 0,
      label: 'Claim',
      subtitle: 'Multimodal input',
      description: 'Ingests user prompt, headline, or screenshot with vision OCR and entity recognition.',
    },
    {
      id: 1,
      label: 'Claim Decomposition',
      subtitle: 'Atomic statements',
      description: 'Gemma 4 parses compound sentences into distinct, falsifiable sub-hypotheses.',
    },
    {
      id: 2,
      label: 'Evidence Retrieval',
      subtitle: 'Identifiable sources',
      description: 'System queries external primary archives, academic registries, and official databases.',
    },
    {
      id: 3,
      label: 'Evidence Comparison',
      subtitle: 'Stance cross-exam',
      description: 'Model evaluates textual entailment, direct contradictions, and source provenance.',
    },
    {
      id: 4,
      label: 'Investigation Report',
      subtitle: 'Uncertainty-aware',
      description: 'Synthesizes transparent evidence dossier with explicit boundaries and unverified gaps.',
    },
  ];

  const features = [
    {
      icon: Eye,
      title: 'Multimodal Claim Understanding',
      description:
        'Analyzes both viral text claims and compressed social media screenshot artifacts with forensic optical analysis to isolate exact timestamps, channel watermarks, and cropped context.',
    },
    {
      icon: FileSearch,
      title: 'Structured Evidence Analysis',
      description:
        'Instead of hallucinating a summary, Gemma 4 is restricted to rigorous predicate logic, isolating what each retrieved document establishes vs. what it merely alleges.',
    },
    {
      icon: Scale,
      title: 'Transparent, Uncertainty-Aware Reports',
      description:
        'Replaces simplistic binary True/False tags with four-way stance alignments and documented open questions. Lack of evidence is never mislabeled as proof of falsehood.',
    },
  ];

  return (
    <section id="technology" className="relative py-20 sm:py-28 bg-[#EEF4FF]/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3 shadow-2xs">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            System Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            AI reasoning. Evidence first.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Gemma 4 structures the reasoning and analyzes source alignment, while our independent retrieval architecture fetches verifiable citations.
          </p>
        </div>

        {/* Process Diagram: CLAIM → DECOMPOSITION → RETRIEVAL → COMPARISON → REPORT */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-[0_10px_40px_rgba(15,23,42,0.05)] mb-16">
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100">
            <div>
              <span className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider">
                Interactive Pipeline Architecture
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                5-Stage Forensic Verification Sequence
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Click any node to explore reasoning
            </span>
          </div>

          {/* Node Chain */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            {processNodes.map((node, index) => {
              const isSelected = activeNode === node.id;
              return (
                <div key={node.id} className="relative">
                  <button
                    onClick={() => setActiveNode(node.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-400 shadow-md ring-2 ring-blue-500/20 translate-y-[-2px]'
                        : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-blue-600">0{index + 1}</span>
                      <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-500 animate-pulse' : 'bg-slate-300'}`} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{node.label}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">{node.subtitle}</p>
                  </button>

                  {/* Arrow indicator between nodes on desktop */}
                  {index < processNodes.length - 1 && (
                    <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300 pointer-events-none">
                      ›
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detail View for Selected Node */}
          <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                Stage 0{activeNode + 1} Details:
              </span>
              <p className="text-sm font-semibold text-slate-800 mt-1">
                {processNodes[activeNode].description}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold shrink-0">
              <Sparkles className="w-4 h-4" />
              <span>Gemma 4 Reasoning Bound</span>
            </div>
          </div>
        </div>

        {/* 3 Core Capability Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature) => {
            const FeatIcon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6 shadow-2xs">
                  <FeatIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Transparent Model Disclaimer Box */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3.5 text-xs text-slate-600">
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-slate-900 font-semibold block mb-0.5">
              Architectural & Integrity Notice
            </strong>
            Gemma 4 serves as an analytical reasoning engine that decomposes claims and identifies structural contradictions. The platform independently retrieves sources and validates digital citations. The model does not independently guarantee truth or accuracy; users are always encouraged to inspect primary archive links.
          </div>
        </div>

      </div>
    </section>
  );
};
