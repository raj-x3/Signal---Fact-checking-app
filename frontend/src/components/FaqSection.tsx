import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'How does SignalCheck prevent AI hallucinations in evidence reports?',
      answer:
        'SignalCheck enforces a strict evidence-first architecture: Gemma 4 is restricted to decomposing statements and comparing semantic entailment. The platform never allows the language model to synthesize facts from memory—every conclusion must link directly to an identifiable, retrieved primary document with cryptographic provenance.',
    },
    {
      question: 'What types of multimodal claims can be investigated?',
      answer:
        'Users can paste raw text claims, social media post links, headlines, or upload screenshots (PNG, JPG, WebP) and PDFs. Our multimodal optical parser extracts text, isolates compression artifacts, and evaluates camera focal metadata to detect context stripping.',
    },
    {
      question: 'Why does SignalCheck emphasize uncertainty rather than a simple True/False badge?',
      answer:
        'Binary fact-checking stamps frequently obscure critical nuance—for instance, when a viral claim contains a genuine flight test but falsely pairs it with an unrelated scheduled radar outage. By breaking claims into atomic assertions and tracking open inquiries, we empower users with the full evidentiary trail.',
    },
    {
      question: 'Can investigative journalists export raw citation dossiers?',
      answer:
        'Yes. Every investigation can be exported as a structured JSON dossier containing the decomposed atomic statements, primary source URLs, exact excerpt quotations, SHA-256 archival hashes, and explicit methodology limitations.',
    },
    {
      question: 'Is SignalCheck affiliated with any government or commercial platform?',
      answer:
        'No. SignalCheck is built as an independent, transparent evidence reasoning platform designed to cross-reference public registries, open scientific pre-prints, and official freedom-of-information archival disclosures.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-20 sm:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Transparent Answers
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Everything you need to know about our evidence retrieval, reasoning boundaries, and cryptographic verification trails.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-slate-50/70 border-blue-300 shadow-xs'
                    : 'bg-white hover:bg-slate-50/50 border-slate-200/90'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-6 py-4.5 flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 bg-blue-100 text-blue-700' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in slide-in-from-top-1 duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Link */}
        <p className="mt-10 text-center text-xs text-slate-400">
          Still have questions? Explore our{' '}
          <a href="#how-it-works" className="text-blue-600 font-semibold hover:underline">
            forensic methodology guide
          </a>{' '}
          or test a claim in the sandbox above.
        </p>

      </div>
    </section>
  );
};
