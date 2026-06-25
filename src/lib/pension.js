// Pure pension math — no React, fully unit-testable.
// All figures are INDICATIVE estimators based on standard CCS (Pension) Rules
// conventions. Real sanction is computed by the PAO; UI must say "indicative".

export const MIN_PENSION = 9000; // CCS minimum monthly pension (indicative)
export const GRATUITY_CEILING = 2500000; // ₹25 lakh (after DA crossed 50%)
export const DEFAULT_COMMUTATION_FACTOR = 8.194; // CCS table, superannuation at 60
export const MAX_COMMUTATION_PCT = 40; // max commutable fraction of pension
export const MAX_HALF_YEARS = 66; // qualifying six-monthly periods cap (33 yrs)

const r = (n) => Math.round(n);

// Indian-grouped currency, e.g. 123456 -> "₹1,23,456"
export function formatINR(n) {
  if (n == null || isNaN(n)) return "₹0";
  const sign = n < 0 ? "-" : "";
  let s = Math.abs(Math.round(n)).toString();
  let last3 = s.slice(-3);
  let rest = s.slice(0, -3);
  if (rest) last3 = "," + last3;
  rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${sign}₹${rest}${last3}`;
}

// Basic monthly pension (indicative): 50% of emoluments, min 10 yrs service.
export function basicPension({ emoluments, qualifyingYears }) {
  emoluments = Number(emoluments) || 0;
  qualifyingYears = Number(qualifyingYears) || 0;
  if (qualifyingYears < 10) {
    return { eligible: false, pension: 0, note: "Service pension needs at least 10 years of qualifying service." };
  }
  let pension = r(emoluments * 0.5);
  let floored = false;
  if (pension < MIN_PENSION) {
    pension = MIN_PENSION;
    floored = true;
  }
  return { eligible: true, pension, floored, note: floored ? `Raised to the minimum pension of ${formatINR(MIN_PENSION)}.` : "" };
}

// Dearness Relief amount on pension.
export function dearnessRelief({ pension, drPercent }) {
  return r((Number(pension) || 0) * (Number(drPercent) || 0) / 100);
}

// Total monthly (pension + DR).
export function totalMonthly({ pension, drPercent }) {
  pension = Number(pension) || 0;
  return pension + dearnessRelief({ pension, drPercent });
}

// Commutation of pension.
export function commutation({ pension, fractionPercent, factor }) {
  pension = Number(pension) || 0;
  let fraction = Number(fractionPercent) || 0;
  if (fraction > MAX_COMMUTATION_PCT) fraction = MAX_COMMUTATION_PCT;
  if (fraction < 0) fraction = 0;
  factor = Number(factor) || DEFAULT_COMMUTATION_FACTOR;
  const commutedPortion = r(pension * fraction / 100);
  const lumpSum = r(commutedPortion * 12 * factor);
  const reducedPension = pension - commutedPortion;
  return { fraction, commutedPortion, lumpSum, reducedPension };
}

// Retirement gratuity (indicative).
// = 1/4 × (emoluments + DA) × qualifying six-monthly periods,
//   capped at 16.5 × (emoluments + DA) and at the absolute ceiling.
export function retirementGratuity({ emoluments, drPercent, qualifyingYears, ceiling = GRATUITY_CEILING }) {
  emoluments = Number(emoluments) || 0;
  drPercent = Number(drPercent) || 0;
  qualifyingYears = Number(qualifyingYears) || 0;
  const withDA = emoluments * (1 + drPercent / 100);
  const halfYears = Math.min(Math.floor(qualifyingYears * 2), MAX_HALF_YEARS);
  const byService = 0.25 * withDA * halfYears;
  const byCap = 16.5 * withDA;
  const gratuity = r(Math.min(byService, byCap, ceiling));
  return { gratuity, halfYears, cappedBy: gratuity === r(ceiling) ? "ceiling" : (byService > byCap ? "16.5x" : "service") };
}
