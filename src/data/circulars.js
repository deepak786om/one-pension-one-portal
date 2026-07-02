// Circular / Knowledge Hub — data model (single source for landing, search, matrix, chatbot).
// Content is a representative mock set; the record schema is production-ready and can be
// swapped for the live repository without any UI change.

// ---- Pillars & actionable sub-service boxes shown on the hub landing ----
export const HUB_PILLARS = [
  {
    id: "circulars", label: "Circulars & Compendia", icon: "fileText", accent: "#1B3A6B",
    desc: "Search the circular repository and consolidated compendia.",
    boxes: [
      { key: "circulars", label: "Circulars", action: "search", desc: "Search & filter DoPPW circulars.", status: "live" },
      { key: "compendia", label: "Compendia", action: "search", desc: "Consolidated compendia by theme.", status: "live" },
      { key: "outreach", label: "Outreach Programme", action: "search", desc: "Outreach material & schedules.", status: "soon" },
    ],
  },
  {
    id: "legal", label: "Legal & Judgements", icon: "scale", accent: "#6D5AE0",
    desc: "Judgements, the Validation Act and legal tools.",
    boxes: [
      { key: "judgements", label: "Important Judgements", action: "search", desc: "Filterable case list with headnotes.", status: "live" },
      { key: "validation_act", label: "Validation Act, 2025", action: "explainer", desc: "Key provisions at a glance.", status: "soon" },
      { key: "legal_docs", label: "Legal Documentation", action: "generate", desc: "Affidavit drafting & case-law match (AI).", status: "soon" },
      { key: "litigation", label: "Litigation Management", action: "tracker", desc: "Track cases and hearings.", status: "soon" },
    ],
  },
  {
    id: "cpc", label: "Pay Commission & Revision", icon: "activity", accent: "#1B9C57",
    desc: "Pay-commission revisions and pension know-how.",
    boxes: [
      { key: "cpc_compare", label: "6th / 7th / 8th CPC", action: "matrix", desc: "Compare pay-commission provisions.", status: "soon" },
      { key: "revision", label: "Revision of Pension", action: "search", desc: "Revision circulars & orders.", status: "soon" },
      { key: "kyp", label: "Know Your Pension", action: "explainer", desc: "A guided walk-through of entitlements.", status: "live" },
    ],
  },
  {
    id: "qs", label: "Qualifying Service", icon: "clock", accent: "#E98A1E",
    desc: "Counting of service and general conditions.",
    boxes: [
      { key: "qs_calc", label: "Counting of Service", action: "calculator", desc: "Past service, military & mobility — eligibility.", status: "live" },
      { key: "mobility", label: "Mobility (Centre / State / Autonomous)", action: "search", desc: "Rules on inter-government mobility.", status: "soon" },
      { key: "general_conditions", label: "General Conditions", action: "explainer", desc: "Regulation of pension — key conditions.", status: "soon" },
    ],
  },
  {
    id: "benefit", label: "Retirement Benefit", icon: "calculator", accent: "#0e7490",
    desc: "Benefit components across pension schemes.",
    boxes: [
      { key: "benefit_matrix", label: "Retirement Benefit Matrix", action: "matrix", desc: "Components × schemes (OPS / NPS / UPS / QS).", status: "live" },
    ],
  },
];

// ---- Circular / judgement / compendium records ----
// schema: { id, type, number, date, subject, pillar, schemes[], keywords[], summary, pdfUrl }
export const CIRCULARS = [
  { id: "C1", type: "circular", number: "38/37/16-P&PW(A)", date: "2024-06-11", subject: "Restoration of commuted portion of pension after 15 years",
    pillar: "benefit", schemes: ["OPS"], keywords: ["commutation", "restoration", "15 years"],
    summary: "Clarifies restoration of the commuted portion on completion of fifteen years from the date of commutation.", pdfUrl: "#C1" },
  { id: "C2", type: "circular", number: "42/15/2024-P&PW(D)", date: "2024-10-03", subject: "Dearness Relief to Central Government pensioners — revised rate",
    pillar: "benefit", schemes: ["OPS", "UPS"], keywords: ["dearness relief", "DR", "revised rate"],
    summary: "Revises the rate of Dearness Relief payable to pensioners and family pensioners from the stated date.", pdfUrl: "#C2" },
  { id: "C3", type: "circular", number: "1/3/2023-P&PW(E)", date: "2023-09-19", subject: "Enhanced family pension — eligibility and duration",
    pillar: "benefit", schemes: ["OPS"], keywords: ["family pension", "enhanced", "eligibility"],
    summary: "Consolidates conditions for grant of enhanced family pension and its period of payment.", pdfUrl: "#C3" },
  { id: "C4", type: "circular", number: "28/30/2022-P&PW(B)", date: "2022-12-05", subject: "Counting of past service on absorption in autonomous bodies",
    pillar: "qs", schemes: ["OPS", "QS"], keywords: ["past service", "absorption", "autonomous body", "counting"],
    summary: "Lays down how past service is counted for pension on absorption between Government and autonomous bodies.", pdfUrl: "#C4" },
  { id: "C5", type: "circular", number: "28/1/2021-P&PW(B)", date: "2021-07-22", subject: "Counting of military service for civil pension",
    pillar: "qs", schemes: ["OPS", "QS"], keywords: ["military service", "civil pension", "counting", "ex-serviceman"],
    summary: "Prescribes conditions for counting former military service towards qualifying service for civil pension.", pdfUrl: "#C5" },
  { id: "C6", type: "circular", number: "4/34/2017-P&PW(D)", date: "2020-02-14", subject: "Mobility of personnel between Central and State Governments",
    pillar: "qs", schemes: ["QS"], keywords: ["mobility", "central", "state", "deputation"],
    summary: "Guidelines on pensionary benefits where personnel move between Central and State Government service.", pdfUrl: "#C6" },
  { id: "C7", type: "circular", number: "38/37/2016-P&PW(A)(ii)", date: "2017-05-12", subject: "Revision of pension of pre-2016 pensioners on 7th CPC",
    pillar: "cpc", schemes: ["OPS"], keywords: ["revision", "7th CPC", "pre-2016", "notional pay"],
    summary: "Method of revision of pension/family pension of pre-2016 pensioners by notional pay fixation.", pdfUrl: "#C7" },
  { id: "C8", type: "circular", number: "57/04/2024-P&PW(B)", date: "2024-08-30", subject: "Unified Pension Scheme (UPS) — operational guidelines",
    pillar: "benefit", schemes: ["UPS", "NPS"], keywords: ["UPS", "unified pension scheme", "assured payout", "option"],
    summary: "Operational framework for the Unified Pension Scheme, including the option window and assured payout.", pdfUrl: "#C8" },
  { id: "C9", type: "circular", number: "7/5/2012-P&PW(F)", date: "2019-03-08", subject: "Gratuity — enhancement of the ceiling",
    pillar: "benefit", schemes: ["OPS"], keywords: ["gratuity", "ceiling", "enhancement"],
    summary: "Revises the maximum ceiling on retirement/death gratuity with effect from the stated date.", pdfUrl: "#C9" },
  { id: "C10", type: "circular", number: "45/86/97-P&PW(F)", date: "2018-11-20", subject: "CGEGIS — savings fund benefit tables",
    pillar: "benefit", schemes: ["OPS", "NPS"], keywords: ["CGEGIS", "insurance", "savings fund", "tables"],
    summary: "Notifies the CGEGIS savings-fund benefit tables applicable for the relevant quarter.", pdfUrl: "#C10" },
  { id: "C11", type: "judgement", number: "SC Civil Appeal 1234/2023", date: "2023-04-27", subject: "Notional pay fixation for pension parity",
    pillar: "legal", schemes: ["OPS"], keywords: ["judgement", "notional pay", "parity", "supreme court"],
    summary: "Apex court upholds notional pay fixation as the basis for parity of pension across retirement dates.", pdfUrl: "#C11" },
  { id: "C12", type: "judgement", number: "CAT OA 5678/2022", date: "2022-08-16", subject: "Rounding of qualifying service to the next half-year",
    pillar: "legal", schemes: ["QS"], keywords: ["judgement", "qualifying service", "rounding", "CAT"],
    summary: "Tribunal directs that qualifying service be rounded to the next completed half-year for pension.", pdfUrl: "#C12" },
  { id: "C13", type: "compendium", number: "COMP/FP/2024", date: "2024-01-10", subject: "Family pension provisions — consolidated compendium",
    pillar: "circulars", schemes: ["OPS"], keywords: ["compendium", "family pension", "consolidated"],
    summary: "A single consolidated compendium of all standing instructions on family pension.", pdfUrl: "#C13" },
  { id: "C14", type: "circular", number: "VA/2025/01", date: "2025-02-01", subject: "The Pension Validation Act, 2025 — overview note",
    pillar: "legal", schemes: [], keywords: ["validation act", "2025", "legislation"],
    summary: "An overview of the key provisions introduced by the Pension Validation Act, 2025.", pdfUrl: "#C14" },
];

export const SCHEMES = ["OPS", "NPS", "UPS", "QS"];
export const CIRC_TYPES = ["circular", "judgement", "compendium"];

// Count of records mapped to a pillar (for landing badges).
export function pillarCount(pillarId) {
  return CIRCULARS.filter((c) => c.pillar === pillarId).length;
}
