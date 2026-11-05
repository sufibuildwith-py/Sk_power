/**
 * Centralised WhatsApp and Phone contact routing for SK SOLAR WALA.
 * 
 * Primary Enquiry Channel: WhatsApp (+91 8004195835)
 * Secondary Contact Option: Direct Phone Calls (+91 9569831451)
 */

export const WHATSAPP_PHONE_NUMBER = '918004195835';
export const WHATSAPP_DISPLAY_NUMBER = '+91 8004195835';

export const CALL_PHONE_NUMBER = '+919569831451';
export const CALL_DISPLAY_NUMBER = '+91 9569831451';

/**
 * Generates an official wa.me URL for the primary enquiry WhatsApp number.
 */
export function buildWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_PHONE_NUMBER}`;
  if (!message || !message.trim()) {
    return base;
  }
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

/**
 * Opens WhatsApp conversation in a safe, standard new tab/window for the user to review and send.
 * Never automatically sends messages.
 */
export function openWhatsApp(message?: string): void {
  if (typeof window === 'undefined') return;
  const url = buildWhatsAppUrl(message);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Generates official tel: URL for phone calls.
 */
export function getPhoneCallUrl(): string {
  return `tel:${CALL_PHONE_NUMBER}`;
}

/**
 * Standardised message builders for different enquiry sources across the site.
 */

export function buildGeneralEnquiryMessage(): string {
  return 'Hello SK SOLAR WALA, I would like to enquire about your solar solutions.';
}

export function buildSuryaGharEnquiryMessage(): string {
  return 'Hello SK SOLAR WALA, I would like assistance with PM Surya Ghar: Muft Bijli Yojana rooftop solar installation.';
}

export function buildServiceEnquiryMessage(serviceName: string): string {
  return `Hello SK SOLAR WALA, I would like to enquire about your ${serviceName} solar solutions.`;
}

export interface CalculatorEnquiryData {
  districtName?: string;
  actualCapacityKwp?: number;
  monthlyGenerationKwh?: number;
  monthlySavingsInr?: number;
  annualSavingsInr?: number;
  subsidyInr?: number;
  netInvestmentInr?: number;
  paybackYears?: number | string;
}

export function buildCalculatorEnquiryMessage(data: CalculatorEnquiryData): string {
  const lines: string[] = [
    'Hello SK SOLAR WALA, I have used your solar calculator and would like to discuss my estimated system size and savings.'
  ];

  if (data.districtName) {
    lines.push(`Location: ${data.districtName}, Uttar Pradesh`);
  }
  if (data.actualCapacityKwp) {
    lines.push(`Estimated Capacity: ${data.actualCapacityKwp} kWp`);
  }
  if (data.monthlyGenerationKwh) {
    lines.push(`Estimated Monthly Generation: ${Math.round(data.monthlyGenerationKwh)} kWh`);
  }
  if (data.monthlySavingsInr) {
    lines.push(`Estimated Monthly Savings: ₹${Math.round(data.monthlySavingsInr).toLocaleString('en-IN')}`);
  }
  if (data.subsidyInr && data.subsidyInr > 0) {
    lines.push(`Estimated PM Surya Ghar Subsidy: ₹${Math.round(data.subsidyInr).toLocaleString('en-IN')}`);
  }
  if (data.netInvestmentInr) {
    lines.push(`Estimated Net Investment: ₹${Math.round(data.netInvestmentInr).toLocaleString('en-IN')}`);
  }

  return lines.join('\n');
}

export interface QuoteModalEnquiryData {
  name: string;
  phone: string;
  serviceInterest?: string;
  city?: string;
  bill?: string;
}

export function buildQuoteModalEnquiryMessage(data: QuoteModalEnquiryData): string {
  const lines: string[] = [
    'Hello SK SOLAR WALA, I would like to request an energy consultation / quote.'
  ];

  if (data.name?.trim()) lines.push(`Name: ${data.name.trim()}`);
  if (data.phone?.trim()) lines.push(`Phone: ${data.phone.trim()}`);
  if (data.serviceInterest?.trim()) lines.push(`Interest: ${data.serviceInterest.trim()}`);
  if (data.city?.trim()) lines.push(`Location: ${data.city.trim()}, Uttar Pradesh`);
  if (data.bill?.trim()) lines.push(`Estimated Monthly Bill: ${data.bill.trim()}`);

  return lines.join('\n');
}

export interface ContactFormEnquiryData {
  name: string;
  phone: string;
  location?: string;
  message?: string;
}

export function buildContactFormEnquiryMessage(data: ContactFormEnquiryData): string {
  const parts: string[] = [
    'Hello SK SOLAR WALA, I would like to request a callback regarding my solar enquiry.'
  ];

  if (data.name?.trim()) parts.push(`Name: ${data.name.trim()}`);
  if (data.phone?.trim()) parts.push(`Phone: ${data.phone.trim()}`);
  if (data.location?.trim()) parts.push(`Location: ${data.location.trim()}`);
  if (data.message?.trim()) parts.push(`Enquiry: ${data.message.trim()}`);

  return parts.join('\n');
}
