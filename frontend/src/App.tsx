/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FloatingNavbar } from './components/FloatingNavbar';
import { HeroSection } from './components/HeroSection';
import { TrustMarquee } from './components/TrustMarquee';
import { ClaimInputPanel } from './components/ClaimInputPanel';
import { InteractiveDocWorkspace } from './components/InteractiveDocWorkspace';
import { HowItWorksSection } from './components/HowItWorksSection';
import { EvidenceExplorer } from './components/EvidenceExplorer';
import { Gemma4TechSection } from './components/Gemma4TechSection';
import { TrustTransparencySection } from './components/TrustTransparencySection';
import { FaqSection } from './components/FaqSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { InvestigationPipelineModal } from './components/InvestigationPipelineModal';
import {
  PresetClaim,
  EvidenceDocument,
  BackendFactCheckResponse,
  convertSourcesToEvidenceDocs,
} from './types/investigation';

export default function App() {
  const [isPipelineOpen, setIsPipelineOpen] = useState(false);
  const [activeClaimText, setActiveClaimText] = useState('');
  const [activePreset, setActivePreset] = useState<PresetClaim | undefined>(undefined);
  const [liveEvidenceDocs, setLiveEvidenceDocs] = useState<EvidenceDocument[] | null>(null);
  const [liveVerdict, setLiveVerdict] = useState<string | null>(null);

  const handleScrollToInvestigate = () => {
    const el = document.getElementById('investigate-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Focus textarea
      setTimeout(() => {
        const textarea = document.getElementById('claim-input');
        if (textarea) textarea.focus();
      }, 500);
    }
  };

  const handleScrollToTech = () => {
    const el = document.getElementById('technology');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToExplorer = () => {
    const el = document.getElementById('evidence-explorer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartInvestigation = (
    claimText: string,
    file: File | null,
    preset?: PresetClaim
  ) => {
    setActiveClaimText(claimText);
    setActivePreset(preset);
    setIsPipelineOpen(true);
  };

  const handleViewInEvidenceExplorer = (result?: BackendFactCheckResponse) => {
    if (result && result.sources && result.sources.length > 0) {
      const converted = convertSourcesToEvidenceDocs(
        result.sources,
        result.verdict,
        result.summary
      );
      setLiveEvidenceDocs(converted);
      setLiveVerdict(result.verdict);
    }
    handleScrollToExplorer();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Floating Glass Navbar */}
      <FloatingNavbar onStartInvestigation={handleScrollToInvestigate} />

      {/* Hero Section with 3D Evidence Card Stage & Live Scanning Beam */}
      <main>
        <HeroSection
          onStartInvestigation={handleScrollToInvestigate}
          onExploreTechnology={handleScrollToTech}
        />

        {/* Infinite Trust Marquee of Verified Archives (MagicUI style) */}
        <TrustMarquee />

        {/* Interactive Claim Input Panel */}
        <ClaimInputPanel onStartInvestigation={handleStartInvestigation} />

        {/* Interactive Live Document Forensic Workspace with Scanning Laser */}
        <InteractiveDocWorkspace />

        {/* Scroll-Triggered How-It-Works (01-02-03) */}
        <HowItWorksSection />

        {/* Interactive Evidence Explorer Bento Grid */}
        <EvidenceExplorer
          liveDocs={liveEvidenceDocs}
          liveVerdict={liveVerdict}
          targetClaim={activeClaimText}
        />

        {/* Gemma 4 Technology & Process Flow */}
        <Gemma4TechSection />

        {/* Trust & Epistemic Rigor (4 Statuses) */}
        <TrustTransparencySection />

        {/* Animated FAQ Accordion */}
        <FaqSection />

        {/* Final Conversion Section */}
        <FinalCtaSection onStartInvestigation={handleScrollToInvestigate} />
      </main>

      {/* Clean White Footer */}
      <Footer />

      {/* Real-Time Investigation Pipeline Modal */}
      <InvestigationPipelineModal
        isOpen={isPipelineOpen}
        onClose={() => setIsPipelineOpen(false)}
        claimText={activeClaimText}
        preset={activePreset}
        onViewInEvidenceExplorer={handleViewInEvidenceExplorer}
      />
    </div>
  );
}
