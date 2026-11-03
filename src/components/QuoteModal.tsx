import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [propertyType, setPropertyType] = useState<'residential' | 'commercial'>('residential');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      setSubmitted(false);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-solar-ink/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-lg bg-[#FAF9F5] rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/60 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-solar-amber shadow-[0_0_8px_#E9AD59]" />
                <span className="font-display font-semibold text-xs tracking-wider uppercase text-solar-ink">
                  {t('quoteModal.badge')}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-solar-ink/5 hover:bg-solar-ink/10 text-solar-charcoal transition-colors"
                aria-label={t('quoteModal.closeButton')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-medium text-solar-ink mb-2">
                  {t('quoteModal.submittedTitle')}
                </h3>
                <p className="text-sm text-solar-charcoal/80 max-w-xs mx-auto mb-6">
                  {t('quoteModal.submittedDesc')}
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide text-solar-ivory glass-dark-pill"
                >
                  {t('quoteModal.closeButton')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <h2 className="font-display text-2xl font-normal text-solar-ink mb-1">
                    {t('quoteModal.title')}
                  </h2>
                  <p className="text-xs text-solar-charcoal/70">
                    {t('quoteModal.subtitle')}
                  </p>
                </div>

                {/* Property selector */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-solar-ink/5 rounded-xl text-xs font-medium mt-1">
                  <button
                    type="button"
                    onClick={() => setPropertyType('residential')}
                    className={`py-2 rounded-lg transition-all ${
                      propertyType === 'residential'
                        ? 'bg-white shadow text-solar-ink font-semibold'
                        : 'text-solar-charcoal/70 hover:text-solar-ink'
                    }`}
                  >
                    {t('quoteModal.residentialTab')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropertyType('commercial')}
                    className={`py-2 rounded-lg transition-all ${
                      propertyType === 'commercial'
                        ? 'bg-white shadow text-solar-ink font-semibold'
                        : 'text-solar-charcoal/70 hover:text-solar-ink'
                    }`}
                  >
                    {t('quoteModal.commercialTab')}
                  </button>
                </div>

                <div className="space-y-3 mt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-solar-charcoal/80 mb-1">
                      {t('quoteModal.fullNameLabel')}
                    </label>
                    <input
                      required
                      type="text"
                      placeholder={t('quoteModal.fullNamePlaceholder')}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-solar-charcoal/15 focus:outline-none focus:border-solar-amber transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-solar-charcoal/80 mb-1">
                      {t('quoteModal.emailLabel')}
                    </label>
                    <input
                      required
                      type="email"
                      placeholder={t('quoteModal.emailPlaceholder')}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-solar-charcoal/15 focus:outline-none focus:border-solar-amber transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-solar-charcoal/80 mb-1">
                      {t('quoteModal.billLabel')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('quoteModal.billPlaceholder')}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-solar-charcoal/15 focus:outline-none focus:border-solar-amber transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-3 w-full py-3.5 rounded-full text-xs font-semibold tracking-wide text-solar-ivory glass-dark-pill flex items-center justify-center gap-2 group transition-all"
                >
                  <span>{t('quoteModal.submitButton')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-solar-amber group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
