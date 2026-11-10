import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

        {/* Accordion List with Smooth Height Transition */}
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.question}
                initial={false}
                animate={{
                  backgroundColor: isOpen ? 'rgba(248, 250, 252, 0.9)' : 'rgba(255, 255, 255, 1)',
                  borderColor: isOpen ? 'rgba(147, 197, 253, 1)' : 'rgba(226, 232, 240, 0.9)',
                }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="rounded-2xl border overflow-hidden shadow-2xs hover:shadow-xs transition-shadow"
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
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/80">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
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
