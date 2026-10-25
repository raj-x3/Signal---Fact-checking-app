import React from 'react';
import { Shield, Search, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200/90 py-14 sm:py-16 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-100">
          
          {/* Brand & Mission Statement */}
          <div className="md:col-span-5 space-y-4">
            <a href="#" className="flex items-center gap-2.5 text-slate-900 font-bold tracking-tight text-lg group">
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-xs">
                <Shield className="w-4 h-4 text-white stroke-[2.2]" />
                <Search className="w-2.5 h-2.5 text-cyan-100 absolute -bottom-0.5 -right-0.5 stroke-[2.5]" />
              </div>
              <span className="text-slate-900 font-extrabold tracking-tight">
                Signal<span className="text-blue-600">Check</span>
              </span>
            </a>

            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              The next-generation AI investigation platform. Deconstructing complex claims, verifying primary source citations, and mapping uncertainty with intellectual honesty.
            </p>

            <div className="text-xs text-slate-400 font-mono">
              Designed for researchers, analysts, journalists, and citizens.
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Platform Architecture
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#evidence-explorer" className="hover:text-blue-600 transition-colors">
                  Evidence Explorer
                </a>
              </li>
              <li>
                <a href="#technology" className="hover:text-blue-600 transition-colors">
                  Gemma 4 Reasoning System
                </a>
              </li>
              <li>
                <a href="#trust-rigor" className="hover:text-blue-600 transition-colors">
                  Trust & Rigor Principles
                </a>
              </li>
            </ul>
          </div>

          {/* Governance & Epistemic Notice */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              AI Limitations & Integrity
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              SignalCheck utilizes Gemma 4 to decompose statements and evaluate semantic alignment against independently retrieved archives. The model does not independently establish factual truth. All citations should be examined at their primary source.
            </p>
            <div className="pt-1 flex items-center gap-4 text-xs text-slate-400">
              <a href="#" className="hover:text-slate-700 transition-colors">
                Privacy Framework
              </a>
              <span>·</span>
              <a href="#" className="hover:text-slate-700 transition-colors">
                Terms of Research
              </a>
              <span>·</span>
              <a href="#" className="hover:text-slate-700 transition-colors">
                Source Guidelines
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div>
            © {new Date().getFullYear()} SignalCheck Platform. All rights reserved. Demonstration Environment.
          </div>
          <div className="flex items-center gap-2">
            <span>Built with light-theme precision</span>
            <span>·</span>
            <span className="text-blue-600 font-semibold">Evidence First</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
