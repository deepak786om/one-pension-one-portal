import CaseProcessor from "./CaseProcessor.jsx";
import { FAMILY_CASES, familyElig, familyDocs, familySanction, beneficiaryRows, eisFetch } from "../../data/hoo.js";
import { formatINR } from "../../lib/pension.js";

function deathGratuityFactor(y) { if (y < 1) return 2; if (y < 5) return 6; if (y < 11) return 12; if (y < 20) return 20; return 33; }

// Family pension computation — differs by sub-type.
export function computeFamily(c) {
  const inService = c.subtype === "In-Service Death";
  const isInelig = c.trigger && c.trigger.includes("Ineligibility");
  const normal = Math.round(c.lastPay * 0.30);
  const enhanced = Math.round(c.lastPay * 0.50);
  const dr = 50;
  const gratuity = inService ? Math.min(deathGratuityFactor(c.qualifyingYears) * c.lastPay, 2500000) : 0;
  const note = inService
    ? "Enhanced 50% for 10 years from the day after death, then normal 30%. Death gratuity payable."
    : isInelig
      ? "Family pension continues at the authorised rate to the next eligible member (no fresh enhanced period). No death gratuity."
      : "Enhanced 50% for 7 years or until the pensioner would have reached age 67, whichever is earlier. No death gratuity.";
  const rows = [
    ["Last pay of the deceased", formatINR(c.lastPay)],
    ["Normal family pension (30%)", formatINR(normal)],
    ["Enhanced family pension (50%)", formatINR(enhanced)],
    ["Dearness Relief", dr + "%"],
    ["Monthly (enhanced + DR)", formatINR(enhanced + Math.round(enhanced * dr / 100))],
    ["Monthly (normal + DR)", formatINR(normal + Math.round(normal * dr / 100))],
    ...(gratuity ? [["Death gratuity", formatINR(gratuity)]] : [["Death gratuity", "N.A. (post-retirement)"]]),
  ];
  return { rows, note };
}

const RELATIONS = ["Spouse", "Son (guardian: father)", "Daughter", "Dependent parent"];

const familyAdd = {
  subtypes: ["In-Service Death", "Death / Ineligibility"],
  // death certificate is required for in-service death and for death-of-pensioner triggers
  deathDoc: (sub, nf) => sub === "In-Service Death" || (nf?.trigger || "").startsWith("Death"),
  hint: (s) => s === "In-Service Death"
    ? "Death of a serving employee — enhanced 50% for 10 years + death gratuity."
    : "Death of a pensioner after retirement, or ineligibility of the current recipient (next-in-line) — no death gratuity.",
  fields: (s) => s === "In-Service Death" ? [
    { key: "deceased", label: "Deceased employee", type: "text", required: true, placeholder: "Late Shri / Smt …" },
    { key: "deceasedDesig", label: "Designation", type: "text", required: true, placeholder: "e.g. Section Officer" },
    { key: "lastPay", label: "Last pay (₹)", type: "number", required: true },
    { key: "qualifyingYears", label: "Qualifying service (years)", type: "number", required: true },
    { key: "dol", label: "Date of death", type: "text", required: true, placeholder: "e.g. 12 Apr 2026" },
    { key: "name", label: "Claimant name", type: "text", required: true },
    { key: "relation", label: "Relationship", type: "select", options: RELATIONS, required: true },
    { key: "age", label: "Claimant age", type: "number", required: true },
    { key: "bank", label: "Bank", type: "text", required: true, placeholder: "Bank & branch" },
    { key: "account", label: "Account (masked)", type: "text", required: true, placeholder: "XXXXXX1234" },
    { key: "ifsc", label: "IFSC", type: "text", required: true },
    { key: "aadhaar", label: "Aadhaar (masked)", type: "text", placeholder: "XXXX-XXXX-1234" },
  ] : [
    { key: "deceased", label: "Deceased pensioner", type: "text", required: true, placeholder: "Late Shri / Smt … (pensioner)" },
    { key: "deceasedPpo", label: "Deceased's PPO number", type: "text", required: true, placeholder: "PPO-YYYY-DEL-…" },
    { key: "trigger", label: "Trigger", type: "select", required: true, options: ["Death of pensioner after retirement", "Ineligibility of previous recipient (remarriage)"] },
    { key: "lastPay", label: "Last pay / pension base (₹)", type: "number", required: true },
    { key: "deceasedDesig", label: "Deceased's designation", type: "text", placeholder: "e.g. Superintendent (Retd.)" },
    { key: "name", label: "Claimant name", type: "text", required: true },
    { key: "relation", label: "Relationship", type: "select", options: RELATIONS, required: true },
    { key: "age", label: "Claimant age", type: "number", required: true },
    { key: "bank", label: "Bank", type: "text", required: true, placeholder: "Bank & branch" },
    { key: "account", label: "Account (masked)", type: "text", required: true, placeholder: "XXXXXX1234" },
    { key: "ifsc", label: "IFSC", type: "text", required: true },
    { key: "aadhaar", label: "Aadhaar (masked)", type: "text", placeholder: "XXXX-XXXX-1234" },
  ],
  build: (f, sub) => ({
    ...f,
    lastPay: Number(f.lastPay) || 0,
    qualifyingYears: Number(f.qualifyingYears) || 0,
    age: Number(f.age) || 0,
    aadhaar: f.aadhaar || "XXXX-XXXX-XXXX",
    quarter: "No",
    note: sub === "In-Service Death" ? "Newly registered in-service death case." : "Newly registered death / ineligibility case.",
  }),
  fetch: (pan, sub) => {
    const r = eisFetch(pan);
    return sub === "In-Service Death"
      ? { deceased: r.holder, deceasedDesig: r.designation, lastPay: String(r.lastPay), qualifyingYears: String(r.qualifyingYears) }
      : { deceased: r.holder, deceasedDesig: r.designation, deceasedPpo: r.ppo || ("PPO-" + pan.slice(-4)), lastPay: String(r.lastPay) };
  },
};

export default function FamilyPension({ onBack }) {
  return (
    <CaseProcessor
      title="Family Pension" icon="heartHandshake"
      desc="Death-in-service and death/ineligibility cases — different forms, eligibility and computation."
      cases={FAMILY_CASES} onBack={onBack}
      subtypeTone={(s) => s === "In-Service Death" ? "warn" : "info"}
      claim={{ label: "Intimation & claim (Form 14)", doc: "Form 14 (application for family pension)" }}
      eligTitle={(c) => c.subtype === "In-Service Death" ? "Eligibility determination" : "Eligibility & trigger (next-in-line)"}
      sanctionLabel="Sanction (Form 18) → PAO"
      eligFor={familyElig} docsFor={familyDocs} sanctionFor={familySanction}
      computeFor={computeFamily} computeTitle="Family pension — computation"
      beneficiaryFor={beneficiaryRows} beneficiaryTitle={() => "Beneficiary & bank details"}
      addConfig={familyAdd}
    />
  );
}
