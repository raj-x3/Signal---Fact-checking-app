import React, { useState, useEffect } from 'react';
import { Shield, Search, ArrowRight, Menu, X } from 'lucide-react';
import { FloatingDock, FloatingDockItem } from './ui/floating-dock';
import { 
  IconLayersLinked, 
  IconFileSearch, 
  IconTerminal2, 
  IconCpu, 
  IconShieldCheck, 
  IconSparkles,
  IconHome
} from '@tabler/icons-react';

interface FloatingNavbarProps {
  onStartInvestigation: () => void;
}

export const FloatingNavbar: React.FC<FloatingNavbarProps> = ({ onStartInvestigation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dockItems: FloatingDockItem[] = [
    {
      title: 'Top',
      icon: <IconHome className="w-full h-full text-slate-600 group-hover:text-blue-600" />,
      href: '#',
    },
    {
      title: 'How It Works',
      icon: <IconLayersLinked className="w-full h-full text-slate-600 group-hover:text-blue-600" />,
      href: '#how-it-works',
    },
    {
      title: 'Evidence Explorer',
      icon: <IconFileSearch className="w-full h-full text-slate-600 group-hover:text-blue-600" />,
      href: '#evidence-explorer',
    },
    {
      title: 'Gemma 4 Tech',
      icon: <IconCpu className="w-full h-full text-slate-600 group-hover:text-blue-600" />,
      href: '#technology',
    },
    {
      title: 'Trust & Rigor',
      icon: <IconShieldCheck className="w-full h-full text-slate-600 group-hover:text-blue-600" />,
      href: '#trust-rigor',
    },
    {
      title: 'Test Claim',
      icon: <IconSparkles className="w-full h-full text-blue-600 group-hover:text-cyan-500" />,
      href: '#investigate-panel',
      onClick: onStartInvestigation,
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 py-3 px-4 sm:px-6 lg:px-8 pointer-events-none">
      <div
        className={`max-w-6xl mx-auto rounded-2xl transition-all duration-300 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 border pointer-events-auto ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm border-slate-200/90 shadow-slate-900/5'
            : 'bg-white/75 backdrop-blur-sm border-slate-200/60 shadow-[0_4px_20px_rgba(37,99,235,0.03)]'
        }`}
      >
        {/* Zone 1: Single Brand Wordmark with Shield & Magnifier */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-slate-900 font-bold tracking-tight text-lg group whitespace-nowrap shrink-0"
        >
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <Shield className="w-4 h-4 text-white stroke-[2.2]" />
            <Search className="w-2.5 h-2.5 text-cyan-100 absolute -bottom-0.5 -right-0.5 stroke-[2.5]" />
          </div>
          <span className="text-slate-900 font-extrabold tracking-tight hidden sm:inline">
            Signal<span className="text-blue-600">Check</span>
          </span>
        </a>

        {/* Zone 2: Aceternity FloatingDock with Magnification Physics */}
        <div className="flex items-center justify-center">
          <FloatingDock items={dockItems} />
        </div>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onStartInvestigation}
            className="relative group overflow-hidden px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 rounded-xl shadow-sm hover:shadow-md hover:shadow-blue-500/20 transition-all duration-200 active:scale-[0.98] whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <span>Start Investigation</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </button>
        </div>

      </div>
    </header>
  );
};
