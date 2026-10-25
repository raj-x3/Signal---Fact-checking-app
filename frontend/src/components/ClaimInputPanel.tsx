import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { PRESET_CLAIMS } from '../data/mockInvestigationData';
import { PresetClaim } from '../types/investigation';
import { FileUpload } from './ui/file-upload';

interface ClaimInputPanelProps {
  onStartInvestigation: (claimText: string, file: File | null, preset?: PresetClaim) => void;
}

export const ClaimInputPanel: React.FC<ClaimInputPanelProps> = ({ onStartInvestigation }) => {
  const [claimText, setClaimText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);

  const maxChars = 500;

  const handleSelectPreset = (preset: PresetClaim) => {
    setClaimText(preset.claimText);
    setSelectedPresetId(preset.id);
    setInputError(null);
  };

  const handleTriggerInvestigation = () => {
    if (!claimText.trim() && !uploadedFile) {
      setInputError('Please enter a claim or upload a screenshot to investigate.');
      return;
    }

    const matchedPreset = PRESET_CLAIMS.find((p) => p.id === selectedPresetId);
    onStartInvestigation(claimText, uploadedFile, matchedPreset);
  };

  return (
    <section id="investigate-panel" className="relative py-16 sm:py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Interactive Investigation Sandbox
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            What have you heard?
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Bring us a claim. Let's investigate the evidence.
          </p>
        </div>

        {/* Preset Selector Chips (Functional Buttons with click handlers) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Try a sample claim:
            </span>
            <span className="text-xs text-slate-400 font-mono">3 Domains Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {PRESET_CLAIMS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">{preset.category}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    "{preset.claimText}"
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Large Input Card */}
        <div className="relative rounded-3xl bg-white border border-slate-200/90 shadow-[0_8px_30px_rgba(15,23,42,0.06)] hover:border-slate-300 transition-all duration-300 p-6 sm:p-8">

            {/* Claim Textarea */}
            <div className="relative">
              <label htmlFor="claim-input" className="sr-only">
                Paste a claim, headline, or social media post
              </label>
              <textarea
                id="claim-input"
                rows={4}
                value={claimText}
                maxLength={maxChars}
                onChange={(e) => {
                  setClaimText(e.target.value);
                  setInputError(null);
                }}
                placeholder="Paste a claim, headline, or social media post to decompose..."
                className="w-full text-base sm:text-lg text-slate-900 placeholder-slate-400 bg-transparent border-0 resize-none focus:outline-none focus:ring-0 leading-relaxed"
              />

              {/* Character Counter */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-slate-500">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    Multimodal claim analysis ready
                  </span>
                </div>
                <span className={claimText.length >= maxChars ? 'text-amber-600 font-bold' : ''}>
                  {claimText.length}/{maxChars}
                </span>
              </div>
            </div>

            {/* Aceternity Animated FileUpload Component */}
            <div className="mt-5">
              <FileUpload
                onChange={(files) => {
                  setUploadedFile(files[0] || null);
                  setInputError(null);
                }}
              />
            </div>

            {/* Error Message if empty */}
            {inputError && (
              <div className="mt-3 flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{inputError}</span>
              </div>
            )}

            {/* Bottom Controls & Main CTA */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5 text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Multimodal Evidence Engine Active
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  PDF / PNG / WebP OCR
                </span>
              </div>

              <button
                type="button"
                onClick={handleTriggerInvestigation}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 cursor-pointer"
              >
                <span>Investigate Claim</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

        </div>

        {/* Educational Demonstration Label */}
        <p className="mt-4 text-center text-xs text-slate-400">
          Demonstration sandbox. SignalCheck decomposes claims into falsifiable atomic statements and maps citations.
        </p>

      </div>
    </section>
  );
};
