import React, { useState } from 'react';
import { Phone, PhoneCall, ArrowRight, SunMedium, CheckCircle2, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  WHATSAPP_DISPLAY_NUMBER,
  CALL_DISPLAY_NUMBER,
  buildWhatsAppUrl,
  openWhatsApp,
  getPhoneCallUrl,
  buildGeneralEnquiryMessage,
  buildContactFormEnquiryMessage,
} from '../utils/whatsapp';

export const ContactSection: React.FC = React.memo(() => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Varanasi');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const formattedMessage = buildContactFormEnquiryMessage({
      name,
      phone,
      location,
      message,
    });

    setSubmitted(true);
    openWhatsApp(formattedMessage);
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setName('');
    setPhone('');
    setMessage('');
  };

  const defaultWhatsAppUrl = buildWhatsAppUrl(buildGeneralEnquiryMessage());
  const phoneCallUrl = getPhoneCallUrl();

  return (
    <section
      id="contact"
      aria-label={t('contact.heading')}
      className="w-full py-20 sm:py-28 px-6 sm:px-10 md:px-14 max-w-[1920px] mx-auto border-t border-solar-charcoal/10 relative overflow-hidden"
    >
      {/* Subtle Warm Amber and Sky Ambient Backlight */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[350px] bg-gradient-to-tr from-[#94ccf6]/20 via-[#bde2fa]/14 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-gradient-to-tl from-solar-amber/12 via-[#c8e6fc]/14 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Block */}
      <div className="max-w-2xl mb-12 sm:mb-16 relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-solar-amber shadow-[0_0_8px_#E9AD59] shrink-0" />
          <span
            className={`text-[10px] sm:text-[11px] font-semibold uppercase text-solar-charcoal/80 ${
              isHindi ? 'tracking-normal font-sans' : 'tracking-wide-editorial'
            }`}
          >
            {t('contact.eyebrow')}
          </span>
        </div>
        <h2
          className={`font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-solar-ink mb-4 sm:mb-5 tracking-tight ${
            isHindi ? 'font-sans leading-[1.25]' : 'leading-[1.15]'
          }`}
        >
          {t('contact.heading')}
        </h2>
        <p
          className={`text-sm sm:text-base text-solar-charcoal/80 max-w-xl ${
            isHindi ? 'leading-[1.7]' : 'leading-relaxed'
          }`}
        >
          {t('contact.supportingText')}
        </p>
      </div>

      {/* Main Grid: Contact Cards (Left) & Quick Callback Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch relative z-10">
        {/* Left Column: Direct Contact Options (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6">
          {/* 1. Primary Channel: WhatsApp Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/18 transition-all duration-300 pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] shrink-0 shadow-sm">
                  {/* Authentic WhatsApp Glyph */}
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.07s.89 2.4 1.02 2.57c.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.2-.59.2-1.09.14-1.19-.06-.1-.22-.16-.47-.29z" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-emerald-800 bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-1 rounded-full">
                  {isHindi ? 'प्राथमिक संपर्क' : 'Primary Channel'}
                </span>
              </div>

              <h3 className="font-display text-xl font-medium text-solar-ink mb-1.5">
                {t('contact.whatsappTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-solar-charcoal/75 leading-relaxed mb-4">
                {t('contact.whatsappSub')}
              </p>

              <a
                href={defaultWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-xl sm:text-2xl font-semibold text-solar-ink hover:text-[#1ebe57] transition-colors inline-block tracking-tight mb-5"
                title="WhatsApp +91 8004195835"
              >
                {WHATSAPP_DISPLAY_NUMBER}
              </a>
            </div>

            <a
              href={defaultWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-white bg-[#25D366] hover:bg-[#20bd5a] flex items-center justify-between shadow-md transition-all active:scale-[0.98]"
            >
              <span>{t('contact.whatsappCTA')}</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* 2. Secondary Channel: Phone Call Card */}
          <div className="glass-card-subtle rounded-3xl p-6 sm:p-7 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-solar-amber/10 rounded-full blur-2xl group-hover:bg-solar-amber/18 transition-all duration-300 pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-solar-amber/15 border border-solar-amber/30 flex items-center justify-center text-solar-amber shrink-0 shadow-sm">
                  <Phone className="w-5 h-5 text-solar-amber" />
                </div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-solar-charcoal/70 bg-solar-charcoal/5 border border-solar-charcoal/10 px-2.5 py-1 rounded-full">
                  {isHindi ? 'सीधी बातचीत' : 'Direct Call'}
                </span>
              </div>

              <h3 className="font-display text-xl font-medium text-solar-ink mb-1.5">
                {t('contact.phoneTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-solar-charcoal/75 leading-relaxed mb-4">
                {t('contact.phoneSub')}
              </p>

              <a
                href={phoneCallUrl}
                className="font-display text-xl sm:text-2xl font-semibold text-solar-ink hover:text-solar-amber transition-colors inline-block tracking-tight mb-5"
                title="Call +91 9569831451"
              >
                {CALL_DISPLAY_NUMBER}
              </a>
            </div>

            <a
              href={phoneCallUrl}
              className="w-full py-3.5 px-5 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-solar-ink bg-white/85 hover:bg-white border border-solar-charcoal/15 flex items-center justify-between shadow-sm transition-all active:scale-[0.98]"
            >
              <span>{t('contact.phoneCTA')}</span>
              <PhoneCall className="w-4 h-4 text-solar-amber group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Service Area & Operational Timing Notice */}
          <div className="px-4 py-3 rounded-2xl bg-solar-ink/[0.03] border border-solar-charcoal/10 flex items-center gap-2.5 text-xs text-solar-charcoal/70">
            <MapPin className="w-4 h-4 text-solar-amber shrink-0" />
            <span>{t('contact.serviceArea')}</span>
          </div>
        </div>

        {/* Right Column: Compact Callback & Solar Enquiry Form (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="glass-card rounded-3xl p-6 sm:p-9 relative overflow-hidden h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <SunMedium className="w-4 h-4 text-solar-amber animate-sun-slow shrink-0" />
                <h3 className="font-display text-xl sm:text-2xl font-medium text-solar-ink">
                  {t('contact.formTitle')}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-solar-charcoal/75 mb-6">
                {t('contact.formSubtitle')}
              </p>

              {submitted ? (
                <div className="py-10 text-center flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-display text-xl font-medium text-solar-ink mb-2">
                    {t('contact.formSuccess')}
                  </h4>
                  <p className="text-xs sm:text-sm text-solar-charcoal/75 max-w-sm mb-6 leading-relaxed">
                    {isHindi
                      ? 'यदि व्हाट्सएप स्वचालित रूप से नहीं खुला, तो आप नीचे दिए गए बटन से पुनः खोल सकते हैं।'
                      : 'If WhatsApp did not open automatically, you can open it directly using the button below.'}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const formatted = buildContactFormEnquiryMessage({
                          name,
                          phone,
                          location,
                          message,
                        });
                        openWhatsApp(formatted);
                      }}
                      className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors shadow-sm"
                    >
                      {t('contact.whatsappCTA')}
                    </button>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white border border-solar-charcoal/20 text-solar-ink hover:bg-white/80 transition-colors"
                    >
                      {isHindi ? 'नया संदेश भेजें' : 'Send Another Enquiry'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-solar-charcoal/80 mb-1.5">
                        {t('contact.formNameLabel')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('contact.formNamePlaceholder')}
                        className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border border-solar-charcoal/15 focus:outline-none focus:border-solar-amber transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-solar-charcoal/80 mb-1.5">
                        {t('contact.formPhoneLabel')} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t('contact.formPhonePlaceholder')}
                        className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border border-solar-charcoal/15 focus:outline-none focus:border-solar-amber transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-solar-charcoal/80 mb-1.5">
                      {t('contact.formLocationLabel')}
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border border-solar-charcoal/15 focus:outline-none focus:border-solar-amber transition-colors"
                    >
                      <option value="Varanasi">{t('contact.districtVaranasi')}</option>
                      <option value="Chandauli">{t('contact.districtChandauli')}</option>
                      <option value="Mirzapur">{t('contact.districtMirzapur')}</option>
                      <option value="Jaunpur">{t('contact.districtJaunpur')}</option>
                      <option value="Ghazipur">{t('contact.districtGhazipur')}</option>
                      <option value="Other Uttar Pradesh">{t('contact.districtOtherUP')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-solar-charcoal/80 mb-1.5">
                      {t('contact.formMessageLabel')}
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t('contact.formMessagePlaceholder')}
                      className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-white/90 border border-solar-charcoal/15 focus:outline-none focus:border-solar-amber transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-solar-ivory glass-dark-pill flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.99] transition-all group mt-2"
                  >
                    <span>{t('contact.formSubmit')}</span>
                    <ArrowRight className="w-4 h-4 text-solar-amber group-hover:translate-x-1 transition-transform" />
                  </button>

                  <p className="text-[11px] text-center text-solar-charcoal/60 pt-1">
                    {isHindi
                      ? 'क्लिक करने पर आपके विवरण के साथ व्हाट्सएप चैट खुलेगी। कोई स्वचालित संदेश नहीं भेजा जाता।'
                      : 'Opens a prefilled WhatsApp chat with your enquiry details. Never automatically sent.'}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
