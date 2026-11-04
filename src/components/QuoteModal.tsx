import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { lockScroll, unlockScroll } from '../utils/scrollLock';

export interface QuotePrefillData {
  serviceInterest?: string;
  city?: string;
  bill?: string;
  notes?: string;
}

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefill?: QuotePrefillData;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, prefill }) => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [serviceInterest, setServiceInterest] = useState<string>('pmsuryaghar');
  const [selectedCity, setSelectedCity] = useState<string>('varanasi');
  const [bill, setBill] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
      return;
    }

    const lockToken = lockScroll('quote-modal');

    if (prefill?.serviceInterest) setServiceInterest(prefill.serviceInterest);
    if (prefill?.city) setSelectedCity(prefill.city);
    if (prefill?.bill) setBill(prefill.bill);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unlockScroll(lockToken);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, prefill]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="quote-modal-title"
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 overflow-y-auto pointer-events-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-solar-ink/60"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-lg bg-[#FAF9F5] rounded-3xl p-5 sm:p-7 shadow-2xl border border-white/60 my-auto max-h-[92vh] overflow-y-auto no-scrollbar"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-solar-amber shadow-[0_0_8px_#E9AD59]" />
                <span className="font-display font-semibold text-xs tracking-wider uppercase text-solar-ink">
                  {t('quoteModal.badge')}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-solar-ink/5 hover:bg-solar-ink/10 text-solar-charcoal transition-colors active:scale-90"
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
                <p className="text-xs sm:text-sm text-solar-charcoal/80 max-w-xs mx-auto mb-6">
                  {t('quoteModal.submittedDesc')}
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide text-solar-ivory glass-dark-pill active:scale-95 transition-transform"
                >
                  {t('quoteModal.closeButton')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-normal text-solar-ink mb-1">
                    {t('quoteModal.title')}
                  </h2>
                  <p className="text-xs text-solar-charcoal/70">
                    {t('quoteModal.subtitle')}
                  </p>
                </div>

                {/* Service Area Verified Badge */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-solar-amber/10 border border-solar-amber/20 text-solar-ink text-xs">
                  <MapPin className="w-4 h-4 text-solar-amber shrink-0" />
                  <span className="font-medium">
                    {t('quoteModal.serviceAreaNotice')}
                  </span>
                </div>

                {/* Service Interest Selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-solar-charcoal/80 mb-1.5">
                    {t('quoteModal.serviceInterestLabel')}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setServiceInterest('pmsuryaghar')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                        serviceInterest === 'pmsuryaghar'
                          ? 'bg-solar-amber/15 border-solar-amber text-solar-ink font-semibold shadow-sm'
                          : 'bg-white border-solar-charcoal/15 text-solar-charcoal hover:bg-white/80'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-solar-amber shrink-0" />
                      <span>{t('quoteModal.serviceTypeSuryaGhar')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setServiceInterest('residential')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                        serviceInterest === 'residential'
                          ? 'bg-solar-ink/10 border-solar-ink text-solar-ink font-semibold shadow-sm'
                          : 'bg-white border-solar-charcoal/15 text-solar-charcoal hover:bg-white/80'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-solar-amber shrink-0" />
                      <span>{t('quoteModal.serviceTypeResidential')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setServiceInterest('commercial')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                        serviceInterest === 'commercial'
                          ? 'bg-solar-ink/10 border-solar-ink text-solar-ink font-semibold shadow-sm'
                          : 'bg-white border-solar-charcoal/15 text-solar-charcoal hover:bg-white/80'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-solar-ink/40 shrink-0" />
                      <span>{t('quoteModal.serviceTypeCommercial')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setServiceInterest('hardware')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                        serviceInterest === 'hardware'
                          ? 'bg-solar-ink/10 border-solar-ink text-solar-ink font-semibold shadow-sm'
                          : 'bg-white border-solar-charcoal/15 text-solar-charcoal hover:bg-white/80'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-solar-ink/40 shrink-0" />
                      <span>{t('quoteModal.serviceTypeHardware')}</span>
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-solar-charcoal/80 mb-1">
                        {t('quoteModal.fullNameLabel')} *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder={t('quoteModal.fullNamePlaceholder')}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white border border-solar-charcoal/15 focus:outline-none focus:border-solar-amber transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-solar-charcoal/80 mb-1">
                        {t('quoteModal.phoneLabel')} *
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder={t('quoteModal.phonePlaceholder')}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white border border-solar-charcoal/15 focus:outline-none focus:border-solar-amber transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-solar-charcoal/80 mb-1">
                        {t('quoteModal.serviceStateLabel')}
                      </label>
                      <input
                        type="text"
                        disabled
                        value={t('quoteModal.serviceStateValue')}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-solar-ink/5 border border-solar-charcoal/10 text-solar-charcoal font-medium cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-solar-charcoal/80 mb-1">
                        {t('quoteModal.serviceCityLabel')}
                      </label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm bg-white border border-solar-charcoal/15 focus:outline-none focus:border-solar-amber transition-colors"
                      >
                        <option value="varanasi">{t('quoteModal.cityVaranasi')}</option>
                        <option value="nearby_up">{t('quoteModal.cityNearbyUP')}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-solar-charcoal/80 mb-1">
                      {t('quoteModal.billLabel')}
                    </label>
                    <input
                      type="text"
                      value={bill}
                      onChange={(e) => setBill(e.target.value)}
                      placeholder={t('quoteModal.billPlaceholder')}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white border border-solar-charcoal/15 focus:outline-none focus:border-solar-amber transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full py-3 sm:py-3.5 rounded-full text-xs font-semibold tracking-wide text-solar-ivory glass-dark-pill flex items-center justify-center gap-2 group transition-all"
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
