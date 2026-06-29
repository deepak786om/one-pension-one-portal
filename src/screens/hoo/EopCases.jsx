import CaseProcessor from "./CaseProcessor.jsx";
import { EOP_CASES, eopElig, eopDocs, eopSanction, beneficiaryRows, eisFetch } from "../../data/hoo.js";
import { formatINR } from "../../lib/pension.js";

// Disability (extraordinary) pension to the employee = service element + disability element (broad-banded).
export function computeDisability(c) {
  const serviceElement = Math.round(c.lastPay * 0.50);
  const d = c.disabilityPct;
  const bb = d < 50 ? 50 : d <= 75 ? 75 : 100;           // broad-banding
  const disabilityElement = Math.round(c.lastPay * 0.30 * bb / 100); // 30% of pay at 100%, scaled
  const dr = 50;
  const total = serviceElement + disabilityElement;
  const rows = [
    ["Last pay", formatINR(c.lastPay)],
    ["Category of disablement", "Category " + c.eopCategory],
    ["Assessed disability", d + "%"],
    ["Broad-banded to", bb + "%"],
    ["Service element (50% of pay)", formatINR(serviceElement)],
    ["Disability element (30% × broad-band)", formatINR(disabilityElement)],
    ["Total disability pension", formatINR(total)],
    ["Monthly (total + DR)", formatINR(total + Math.round(total * dr / 100))],
  ];
  return { rows, note: "Paid to the employee: service element (for life) + disability element (revisable on re-assessment of the Medical Board)." };
}

// Extraordinary family pension (EOFP) — flat special rate by category (death attributable to service).
export function computeEOFP(c) {
  const cat = c.eopCategory;
  const pct = cat === "E" ? 100 : cat === "D" ? 60 : 40;
  const special = Math.round(c.lastPay * pct / 100);
  const ordinary = Math.round(c.lastPay * 0.30);
  const dr = 50;
  const basis = cat === "E" ? "Liberalized family pension — 100% of last pay (Category E)"
    : cat === "D" ? "Special family pension — 60% of last pay (Category D/E)"
    : "Special family pension — 40% of last pay (Category B/C)";
  const rows = [
    ["Last pay of the deceased", formatINR(c.lastPay)],
    ["Category", "Category " + cat],
    ["Special family pension rate", pct + "%"],
    ["Special family pension", formatINR(special)],
    ["Ordinary family pension (30% floor)", formatINR(ordinary)],
    ["Dearness Relief", dr + "%"],
    ["Monthly (special + DR)", formatINR(special + Math.round(special * dr / 100))],
  ];
  return { rows, note: basis + ". Flat special rate (not the enhanced-then-normal structure) as death is attributable to service." };
}

const eopAdd = {
  subtypes: ["Disability Pension", "Extraordinary Family Pension (EOFP)"],
  hint: (s) => s === "Disability Pension"
    ? "To the disabled employee: service element (50%) + disability element (30% × broad-banded degree)."
    : "To the family on attributable death: flat special rate by category (B/C 40%, D 60%, E 100%).",
  fields: (s) => s === "Disability Pension" ? [
    { key: "name", label: "Employee name", type: "text", required: true },
    { key: "deceasedDesig", label: "Designation", type: "text", required: true, placeholder: "e.g. Sub-Inspector" },
    { key: "lastPay", label: "Last pay (₹)", type: "number", required: true },
    { key: "qualifyingYears", label: "Qualifying service (years)", type: "number", required: true },
    { key: "eopCategory", label: "Category of disablement", type: "select", options: ["B", "C", "D", "E"], required: true },
    { key: "disabilityPct", label: "Assessed disability (%)", type: "number", required: true },
    { key: "event", label: "Event", type: "select", options: ["Invalidated out of service", "Retained in service with disability"], required: true },
    { key: "dol", label: "Date of event", type: "text", required: true, placeholder: "e.g. 18 Feb 2026" },
    { key: "bank", label: "Bank", type: "text", required: true },
    { key: "account", label: "Account (masked)", type: "text", required: true, placeholder: "XXXXXX1234" },
    { key: "ifsc", label: "IFSC", type: "text", required: true },
    { key: "aadhaar", label: "Aadhaar (masked)", type: "text", placeholder: "XXXX-XXXX-1234" },
  ] : [
    { key: "deceased", label: "Deceased employee", type: "text", required: true, placeholder: "Late … " },
    { key: "deceasedDesig", label: "Designation", type: "text", required: true, placeholder: "e.g. Constable" },
    { key: "lastPay", label: "Last pay (₹)", type: "number", required: true },
    { key: "eopCategory", label: "Category (A–E)", type: "select", options: ["B", "C", "D", "E"], required: true },
    { key: "dol", label: "Date of death", type: "text", required: true, placeholder: "e.g. 21 Mar 2026" },
    { key: "name", label: "Claimant name", type: "text", required: true },
    { key: "relation", label: "Relationship", type: "select", options: ["Spouse", "Son (guardian: father)", "Daughter", "Dependent parent"], required: true },
    { key: "age", label: "Claimant age", type: "number", required: true },
    { key: "bank", label: "Bank", type: "text", required: true },
    { key: "account", label: "Account (masked)", type: "text", required: true, placeholder: "XXXXXX1234" },
    { key: "ifsc", label: "IFSC", type: "text", required: true },
    { key: "aadhaar", label: "Aadhaar (masked)", type: "text", placeholder: "XXXX-XXXX-1234" },
  ],
  build: (f, sub) => sub === "Disability Pension"
    ? { ...f, relation: "Self (employee)", lastPay: Number(f.lastPay) || 0, qualifyingYears: Number(f.qualifyingYears) || 0, disabilityPct: Number(f.disabilityPct) || 0, aadhaar: f.aadhaar || "XXXX-XXXX-XXXX", quarter: "No", note: "Newly registered disability pension case." }
    : { ...f, lastPay: Number(f.lastPay) || 0, age: Number(f.age) || 0, aadhaar: f.aadhaar || "XXXX-XXXX-XXXX", quarter: "No", note: "Newly registered EOFP case." },
  fetch: (pan, sub) => {
    const r = eisFetch(pan);
    return sub === "Disability Pension"
      ? { name: r.holder.replace(/^Late\s+/, ""), deceasedDesig: r.designation, lastPay: String(r.lastPay), qualifyingYears: String(r.qualifyingYears), bank: r.bank, account: r.account, ifsc: r.ifsc, aadhaar: r.aadhaar }
      : { deceased: r.holder, deceasedDesig: r.designation, lastPay: String(r.lastPay) };
  },
};

export default function EopCases({ onBack }) {
  return (
    <CaseProcessor
      title="Extraordinary Pension (EOP)" icon="shieldCheck"
      desc="Disability pension to the employee, and extraordinary family pension (EOFP) on attributable death — different forms and computation."
      cases={EOP_CASES} onBack={onBack}
      subtypeTone={(s) => s === "Disability Pension" ? "info" : "ok"}
      claim={{ label: "Intimation & claim", doc: "Invalidation / death intimation" }}
      eligTitle={(c) => c.subtype === "Disability Pension" ? "Attributability & Medical Board" : "Attributability & Category"}
      sanctionLabel="Sanction → PAO"
      eligFor={eopElig} docsFor={eopDocs} sanctionFor={eopSanction}
      computeFor={(c) => c.subtype === "Disability Pension" ? computeDisability(c) : computeEOFP(c)}
      computeTitle="Extraordinary pension — computation"
      beneficiaryFor={beneficiaryRows}
      beneficiaryTitle={(c) => c.relation.includes("Self") ? "Employee & bank details" : "Beneficiary & bank details"}
      addConfig={eopAdd}
    />
  );
}
