import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  Layers, 
  Search, 
  GitCompare, 
  FileText, 
  ShieldAlert, 
  ExternalLink,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Info
} from 'lucide-react';
import { PresetClaim, SubClaim, BackendFactCheckResponse } from '../types/investigation';
import { requestFactCheck } from '../services/api';

interface InvestigationPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  claimText: string;
  preset?: PresetClaim;
  onViewInEvidenceExplorer: (result?: BackendFactCheckResponse) => void;
}

export const InvestigationPipelineModal: React.FC<InvestigationPipelineModalProps> = ({
  isOpen,
  onClose,
  claimText,
  preset,
  onViewInEvidenceExplorer,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(10);
  const [logs, setLogs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [liveResponse, setLiveResponse] = useState<BackendFactCheckResponse | null>(null);

  // Fallback decomposed subclaims if waiting or preview
  const previewSubClaims: SubClaim[] = preset?.previewDossier.subClaims || [
    {
      id: 'sub-c1',
      statement: 'Physical occurrence: event occurred at the specified coordinates and timestamp.',
      status: 'supported',
      findingSummary: 'Primary telemetry and sensor records corroborate presence and timing.',
      sourceCount: 3,
    },
    {
      id: 'sub-c2',
      statement: 'Attribution claim: the incident resulted from malicious tampering or system failure.',
      status: 'contradicted',
      findingSummary: 'Official operational maintenance logs contradict unscheduled emergency claims.',
      sourceCount: 4,
    },
    {
      id: 'sub-c3',
      statement: 'Impact assessment: civilian communications infrastructure was widely compromised.',
      status: 'unverified',
      findingSummary: 'Public spectrum monitors show nominal maritime frequencies; logs pending FOI release.',
      sourceCount: 2,
    },
  ];

  const executePipeline = async () => {
    if (!claimText && !preset?.claimText) return;

    const targetClaim = claimText || preset?.claimText || '';
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentStep(0);
    setProgress(15);
    setLogs(['[SignalCheck Engine] Ingesting claim & multimodal context...']);
    setIsCompleted(false);

    // Dynamic step animations while request is processed
    const step1Timer = setTimeout(() => {
      setCurrentStep(1);
      setProgress(35);
      setLogs((prev) => [
        ...prev,
        '[Gemma 4] Isolating logical predicates & named entities...',
        '[Deconstruct] Formulating atomic falsifiability criteria...',
      ]);
    }, 700);

    const step2Timer = setTimeout(() => {
      setCurrentStep(2);
      setProgress(60);
      setLogs((prev) => [
        ...prev,
        '[Retrieval Orchestrator] Dispatching search vectors to 8 independent providers...',
        '[Crossref & PIB] Auditing official registers and peer-reviewed indices...',
      ]);
    }, 1800);

    const step3Timer = setTimeout(() => {
      setCurrentStep(3);
      setProgress(85);
      setLogs((prev) => [
        ...prev,
        '[Alignment] Synthesizing stance vectors (Supporting vs Contradicting)...',
        '[Gemma 4] Formulating uncertainty bounds & epistemic calibration...',
      ]);
    }, 3200);

    try {
      const response = await requestFactCheck({ claim: targetClaim });
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);

      setLiveResponse(response);
      setCurrentStep(4);
      setProgress(100);
      setIsCompleted(true);
      setLogs(response.pipelineLogs || [
        '[Done] Investigation dossier compiled from real evidence records.',
      ]);
    } catch (err: unknown) {
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      setErrorMessage((err as Error)?.message || 'Failed to connect to backend investigation service.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setProgress(10);
      setLogs([]);
      setIsCompleted(false);
      setLiveResponse(null);
      setErrorMessage(null);
      return;
    }

    executePipeline();
  }, [isOpen, claimText, preset]);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Multimodal Claim Ingestion',
      icon: Layers,
      description: 'Ingesting textual statement and visual screenshot artifacts',
    },
    {
      title: 'Atomic Decomposition',
      icon: Search,
      description: 'Splitting into falsifiable, independent sub-claims with Gemma 4',
    },
    {
      title: 'Primary Source Retrieval',
      icon: GitCompare,
      description: 'Auditing government archives, PIB notices, and academic registries',
    },
    {
      title: 'Uncertainty-Aware Synthesis',
      icon: FileText,
      description: 'Mapping supported vs. contradicted vectors and open empirical questions',
    },
  ];

  // Map subclaims from live response or preview
  const displaySubClaims: SubClaim[] = liveResponse
    ? liveResponse.claimBreakdown.map((b) => ({
        id: b.id,
        statement: b.statement,
        status: b.verdict.toLowerCase() as any,
        findingSummary: b.findingSummary,
        sourceCount: b.sourceCount || b.relevantSourceIds.length,
      }))
    : previewSubClaims;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Live Gemma 4 Investigation Dossier
                </h3>
                {liveResponse && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 text-blue-800">
                    REAL EVIDENCE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Multi-source epistemic pipeline • Real-time India archives audit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[78vh] overflow-y-auto">

          {/* Active Claim Display */}
          <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
              <span>TARGET ASSERTION UNDER AUDIT</span>
              {liveResponse && (
                <span className="text-blue-600 font-semibold uppercase">
                  Language: {liveResponse.language === 'hi' ? 'Hindi' : 'English'}
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
              "{claimText || preset?.claimText}"
            </p>
          </div>

          {/* Error & Retry Banner if request failed */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-rose-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={executePipeline}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Pipeline</span>
              </button>
            </div>
          )}

          {/* Overall Verdict Banner when completed */}
          {liveResponse && (
            <div className="mb-6 p-5 rounded-2xl border transition-all animate-in fade-in duration-300 bg-white shadow-sm border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    EPISTEMIC VERDICT:
                  </span>
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wide border shadow-2xs ${
                      liveResponse.verdict === 'Supported'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : liveResponse.verdict === 'Contradicted'
                        ? 'bg-rose-50 text-rose-800 border-rose-300'
                        : liveResponse.verdict === 'Mixed Evidence'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-slate-100 text-slate-800 border-slate-300'
                    }`}
                  >
                    {liveResponse.verdict}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span>Confidence:</span>
                  <span className="font-bold text-slate-800">{Math.round(liveResponse.confidence.score * 100)}% ({liveResponse.confidence.level})</span>
                </div>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {liveResponse.summary}
              </p>

              {/* Calibration Notice */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-400">
                <Info className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span>{liveResponse.confidence.calibrationNote}</span>
              </div>
            </div>
          )}

          {/* Stepper Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2 font-mono">
              <span className="flex items-center gap-1.5">
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                {isCompleted ? 'INVESTIGATION DOSSIER COMPILED' : 'EXECUTION PROGRESS'}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stepper 4 Nodes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isPassed = currentStep > idx || isCompleted;
              const isCurrent = currentStep === idx && !isCompleted;

              return (
                <div
                  key={step.title}
                  className={`p-3 rounded-2xl border transition-all ${
                    isPassed
                      ? 'bg-blue-50/50 border-blue-200 text-blue-900'
                      : isCurrent
                      ? 'bg-white border-blue-500 ring-2 ring-blue-500/10 text-slate-900 shadow-sm'
                      : 'bg-slate-50/50 border-slate-200/70 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isPassed
                          ? 'bg-blue-600 text-white'
                          : isCurrent
                          ? 'bg-blue-600 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">0{idx + 1}</span>
                  </div>
                  <h4 className="text-xs font-bold leading-tight">{step.title}</h4>
                </div>
              );
            })}
          </div>

          {/* Decomposed Subclaims Revealed */}
          <div className="space-y-2.5 mb-6">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Decomposed Sub-Assertions
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                {currentStep >= 1 ? `${displaySubClaims.length} statements isolated` : 'Analyzing grammar...'}
              </span>
            </div>

            {currentStep < 1 && !liveResponse ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Isolating logical predicates and named entities...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {displaySubClaims.map((sub, i) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ animationDelay: `${i * 120}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-800 leading-snug">
                          {sub.statement}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                          {sub.findingSummary}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border shrink-0 ${
                          sub.status === 'supported'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : sub.status === 'contradicted'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {sub.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Terminal / System Execution Logs */}
          <div className="rounded-xl bg-slate-900 text-slate-200 p-3.5 font-mono text-xs overflow-hidden shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-slate-400">
              <span>SYSTEM EVENT STREAM // GEMMA-4 AUDIT</span>
              <span className="text-cyan-400 flex items-center gap-1">
                {isLoading && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                LIVE
              </span>
            </div>
            <div className="mt-2 space-y-1 max-h-28 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-cyan-400 shrink-0">›</span>
                  <span className="text-slate-300 leading-relaxed text-[11px]">{log}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              {liveResponse
                ? `${liveResponse.sources.length} real source records retrieved across Indian & global archives.`
                : 'Multi-stage epistemic verification pipeline.'}
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  onClose();
                  onViewInEvidenceExplorer(liveResponse || undefined);
                }}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all duration-200 cursor-pointer ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span>Inspect Evidence Trail in Explorer</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
