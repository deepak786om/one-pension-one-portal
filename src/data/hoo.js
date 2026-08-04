// Mock data for the Head of Office (HOO) journey.
import { formatINR } from "../lib/pension.js";

export const HOO_OFFICE = {
  officer: "Rajeev Menon",
  designation: "Head of Office",
  office: "Northern Railway — Personnel Branch, Baroda House",
  code: "NR-PB-DEL-014",
  ddo: "DDO-NR-2207",
  pao: "PAO-NR-DELHI",
  ministry: "Ministry of Railways",
};

// 7-stage superannuation pipeline
export const STAGES = [
  { key: "verify", label: "Service Validation", bdr: "12–15M", icon: "fileCheck" },
  { key: "send", label: "Send Form 6A", bdr: "8M", icon: "arrowUpRight" },
  { key: "received", label: "Forms Received", bdr: "6M", icon: "fileText" },
  { key: "forms", label: "Forms Validation", bdr: "4M", icon: "fileCheck" },
  { key: "pao", label: "Sent to PAO (7 & 8)", bdr: "4M", icon: "arrowUpRight" },
  { key: "ppo", label: "PPO Status", bdr: "1M", icon: "badgeCheck" },
  { key: "done", label: "Completed", bdr: "—", icon: "check" },
];

// the action the HOO performs to MOVE OUT of a given stage
export const STAGE_PRIMARY = [
  "Validate Service Book",
  "Send Form 6A to retiree",
  "Mark forms received",
  "Validate submitted forms",
  "Generate Form 7 & 8 → send to PAO",
  "Record PPO as issued",
  null,
];

export function bdrBucket(m) {
  if (m <= 1) return "1M";
  if (m <= 4) return "2-4M";
  if (m <= 6) return "5-6M";
  if (m <= 8) return "7-8M";
  return "9-15M";
}
export const BUCKETS = [
  { key: "1M", label: "1 Month" },
  { key: "2-4M", label: "2–4 Months" },
  { key: "5-6M", label: "5–6 Months" },
  { key: "7-8M", label: "7–8 Months" },
  { key: "9-15M", label: "9–15 Months" },
];

function hist(...rows) { return rows.map(([date, actor, action, remark]) => ({ date, actor, action, remark })); }

export const RETIREES = [
  {
    id: "R1", name: "Suresh Patel", pan: "SURPP1122M", designation: "Under Secretary", level: "Level 11",
    type: "Superannuation", dor: "31 Jul 2026", bdr: 1, source: "EIS", quarter: "No",
    stage: 5, ppo: "", emoluments: 144200, qualifyingYears: 34,
    history: hist(
      ["10 Aug 2025", "You (HOO)", "Service Book validated", "33y 11m qualifying service confirmed."],
      ["12 Oct 2025", "You (HOO)", "Form 6A sent to retiree", ""],
      ["28 Nov 2025", "Retiree", "Forms received", "Form 6A + nominations submitted."],
      ["15 Jan 2026", "You (HOO)", "Forms validated", ""],
      ["02 Feb 2026", "You (HOO)", "Forms 7 & 8 sent to PAO", "Computation sheet forwarded."],
    ),
  },
  {
    id: "R2", name: "Mohd Arif Khan", pan: "MKHPK4456L", designation: "Software Developer", level: "Level 10",
    type: "Superannuation", dor: "31 Aug 2026", bdr: 2, source: "EIS", quarter: "No",
    stage: 4, ppo: "", emoluments: 121800, qualifyingYears: 30,
    history: hist(
      ["20 Sep 2025", "You (HOO)", "Service Book validated", ""],
      ["18 Nov 2025", "You (HOO)", "Form 6A sent to retiree", ""],
      ["09 Dec 2025", "Retiree", "Forms received", ""],
      ["22 Jan 2026", "You (HOO)", "Forms validated", "Ready to compute."],
    ),
  },
  {
    id: "R8", name: "Arjun Rao", pan: "ARJPR8890Q", designation: "Accounts Officer", level: "Level 10",
    type: "Superannuation", dor: "31 Aug 2026", bdr: 2, source: "EIS", quarter: "No",
    stage: 4, ppo: "", returned: true, emoluments: 118600, qualifyingYears: 29,
    history: hist(
      ["15 Sep 2025", "You (HOO)", "Service Book validated", ""],
      ["20 Nov 2025", "You (HOO)", "Form 6A sent to retiree", ""],
      ["11 Dec 2025", "Retiree", "Forms received", ""],
      ["20 Jan 2026", "You (HOO)", "Forms 7 & 8 sent to PAO", ""],
      ["05 Feb 2026", "PAO", "Returned for correction", "Qualifying-service break (2009) not condoned — re-check."],
    ),
  },
  {
    id: "R3", name: "Geeta Nair", pan: "GEEPN3344N", designation: "Assistant", level: "Level 6",
    type: "Superannuation", dor: "30 Sep 2026", bdr: 3, source: "Manual", quarter: "No",
    stage: 3, ppo: "", emoluments: 71200, qualifyingYears: 28,
    history: hist(
      ["28 Oct 2025", "You (HOO)", "Service Book validated", ""],
      ["02 Dec 2025", "You (HOO)", "Form 6A sent to retiree", ""],
      ["10 Jan 2026", "Retiree", "Forms received", ""],
    ),
  },
  {
    id: "R4", name: "Ramesh Iyer", pan: "RAMPI5566P", designation: "Section Officer", level: "Level 8",
    type: "Superannuation", dor: "31 Oct 2026", bdr: 4, source: "EIS", quarter: "Yes",
    stage: 2, ppo: "", emoluments: 98400, qualifyingYears: 31,
    history: hist(
      ["20 Nov 2025", "You (HOO)", "Service Book validated", ""],
      ["10 Jan 2026", "You (HOO)", "Form 6A sent to retiree", "NDC from D/o Estates pending (govt quarter)."],
    ),
  },
  {
    id: "R5", name: "Priya Sharma", pan: "PRYPS7788R", designation: "Deputy Director", level: "Level 12",
    type: "Superannuation", dor: "31 Dec 2026", bdr: 6, source: "EIS", quarter: "No",
    stage: 2, ppo: "", emoluments: 165100, qualifyingYears: 27,
    history: hist(["05 Jan 2026", "You (HOO)", "Service Book validated", ""], ["05 Jan 2026", "System", "Form 6A auto-sent to retiree", "Sent to the pensioner portal on validation."]),
  },
  {
    id: "R6", name: "Vinod Gupta", pan: "VINPG9900S", designation: "Senior Section Engineer", level: "Level 8",
    type: "Superannuation", dor: "31 Mar 2027", bdr: 9, source: "EIS", quarter: "No",
    stage: 0, ppo: "", emoluments: 112000, qualifyingYears: 33,
    history: hist(["18 Jun 2026", "System (EIS)", "Case auto-created from EIS", "Retiring in 9 months."]),
  },
  {
    id: "R7", name: "Lakshmi Menon", pan: "LAKPM2211T", designation: "Senior Translator", level: "Level 7",
    type: "Superannuation", dor: "30 Jun 2026", bdr: 0, source: "EIS", quarter: "No",
    stage: 6, ppo: "PPO-2026-DEL-0101887", emoluments: 84600, qualifyingYears: 32,
    history: hist(
      ["10 Jul 2025", "You (HOO)", "Service Book validated", ""],
      ["12 Sep 2025", "You (HOO)", "Form 6A sent to retiree", ""],
      ["01 Oct 2025", "Retiree", "Forms received", ""],
      ["20 Nov 2025", "You (HOO)", "Forms validated", ""],
      ["05 Dec 2025", "You (HOO)", "Forms 7 & 8 sent to PAO", ""],
      ["18 Jan 2026", "PAO", "PPO issued", "PPO-2026-DEL-0101887 generated; SSA sent to bank."],
    ),
  },
];

// Family pension / EOP
export const FAMILY_CASES = [
  { id: "F1", name: "Smt. Kamla Devi", deceased: "Late Shri R. K. Verma", relation: "Spouse", subtype: "In-Service Death",
    dol: "12 Apr 2026", deceasedPpo: "", quarter: "No", start: 2,
    lastPay: 96000, qualifyingYears: 18, age: 54, deceasedDesig: "Section Officer",
    aadhaar: "XXXX-XXXX-2210", bank: "State Bank of India — Pension Cell", account: "XXXXXX2210", ifsc: "SBIN0001234",
    note: "Death in service: family pension @30% (enhanced 50% for 10 years from death) + death gratuity." },
  { id: "F2", name: "Smt. Radha Nair", deceased: "Late Shri P. Nair (pensioner)", relation: "Spouse", subtype: "Death / Ineligibility",
    dol: "02 May 2026", deceasedPpo: "PPO-2014-DEL-0039210", quarter: "No", start: 1, trigger: "Death of pensioner after retirement",
    lastPay: 84000, qualifyingYears: 33, age: 61, deceasedDesig: "Superintendent (Retd.)",
    aadhaar: "XXXX-XXXX-5521", bank: "Punjab National Bank", account: "XXXXXX5521", ifsc: "PUNB0123456",
    note: "Death after retirement: conversion of pension to family pension; enhanced 50% for 7 yrs / until age 67; no death gratuity." },
  { id: "F3", name: "Master Aryan Singh (minor)", deceased: "Late Smt. Sunita Singh (pensioner)", relation: "Son (guardian: father)", subtype: "Death / Ineligibility",
    dol: "10 Mar 2026", deceasedPpo: "PPO-2012-DEL-0031880", quarter: "No", start: 1, trigger: "Ineligibility of previous recipient (remarriage)",
    lastPay: 72000, qualifyingYears: 0, age: 11, deceasedDesig: "Assistant (Retd.)",
    aadhaar: "XXXX-XXXX-8841", bank: "Canara Bank", account: "XXXXXX8841", ifsc: "CNRB0004412",
    note: "Next-in-line transfer on ineligibility of the previous recipient; guardian certificate required; no death gratuity." },
];

// EOP — Extraordinary Pension (CCS EOP Rules). Two subtypes:
//  • Disability Pension (to the disabled employee): service element + disability element (broad-banded)
//  • Extraordinary Family Pension / EOFP (to family on attributable death): category-based special rate
export const EOP_CASES = [
  { id: "EP1", name: "Shri Manoj Kumar", relation: "Self (employee)", subtype: "Disability Pension",
    event: "Invalidated out of service", dol: "18 Feb 2026", quarter: "No", start: 1,
    lastPay: 90000, qualifyingYears: 14, eopCategory: "C", disabilityPct: 70, deceasedDesig: "Sub-Inspector",
    aadhaar: "XXXX-XXXX-3091", bank: "Bank of Baroda", account: "XXXXXX3091", ifsc: "BARB0VJNAGA",
    note: "Disablement attributable to service (Category C). Pension = service element (50%) + disability element (broad-banded)." },
  { id: "EP2", name: "Smt. Reena Yadav", deceased: "Late Const. Mahesh Yadav", relation: "Spouse", subtype: "Extraordinary Family Pension (EOFP)",
    event: "Death attributable to service", dol: "21 Mar 2026", quarter: "No", start: 1,
    lastPay: 60000, qualifyingYears: 9, eopCategory: "D", age: 41, deceasedDesig: "Constable",
    aadhaar: "XXXX-XXXX-8842", bank: "Canara Bank", account: "XXXXXX8842", ifsc: "CNRB0004412",
    note: "Death attributable to government service (Category D). Special family pension at the category rate (flat, not enhanced/normal)." },
];

// Beneficiary + bank details the HOO reviews before sanctioning a family pension.
export function beneficiaryRows(c) {
  return [
    ["Claimant", `${c.name} (${c.relation})`],
    ["Aadhaar", c.aadhaar],
    ["Bank", c.bank],
    ["Account", c.account],
    ["IFSC", c.ifsc],
    ["Penny-drop", "₹1 credited — name matched"],
  ];
}

// Revision cases
export const REVISION_CASES = [
  { id: "V1", name: "P. Ramachandran", ppo: "PPO-2016-DEL-0044120", reason: "7th CPC notional fixation", old: 41000, revised: 49200, status: "Pending computation" },
  { id: "V2", name: "S. Banerjee", ppo: "PPO-2014-DEL-0039004", reason: "Restoration of commuted portion (15y)", old: 38600, revised: 52000, status: "Forwarded to PAO" },
];

// Office grievances routed to HOO
export const HOO_GRIEVANCES = [
  { id: "HG1", regNo: "DOPPW/E/2026/0031410", from: "Geeta Nair", subject: "Form 6A not acknowledged", lodged: "08 May 2026", sla: "6 days left", status: "Open",
    history: hist(["08 May 2026", "Pensioner", "Grievance lodged", "No acknowledgement after submitting forms."]) },
  { id: "HG2", regNo: "DOPPW/E/2026/0030980", from: "Arjun Rao", subject: "Delay in forwarding case to PAO", lodged: "28 Apr 2026", sla: "Overdue 2 days", status: "Open",
    history: hist(
      ["28 Apr 2026", "Pensioner", "Grievance lodged", "Case pending with office beyond timeline."],
      ["30 Apr 2026", "Nodal Officer", "Forwarded to HOO", "Please action and file ATR."]) },
  { id: "HG3", regNo: "DOPPW/E/2026/0029550", from: "Lakshmi Menon", subject: "ePPO copy not received", lodged: "20 Jan 2026", sla: "Closed", status: "Resolved",
    history: hist(
      ["20 Jan 2026", "Pensioner", "Grievance lodged", ""],
      ["22 Jan 2026", "You (HOO)", "Resolved with ATR", "ePPO emailed and SMS sent; closed."]) },
];

export const REPORTS = {
  retiring12to15: 14,
  serviceVerifyPending: 5,
  ppoNotIssued: 3,
  casesProcessedFY: 27,
  cpaoMismatch: 2,
};

let CASE_SEQ = 101900;
export function newPPO() { CASE_SEQ += Math.floor(Math.random() * 30) + 5; return `PPO-2026-DEL-0${CASE_SEQ}`; }

// ---------- Vigilance clearance ----------
// Vigilance clearance should ideally be obtained at least 3 months before the
// date of retirement (i.e. before BDR reaches 3 months). Returns a status the
// HOO can see at a glance for each case.
const VIG_SEED = { R1: "Cleared", R2: "Cleared", R8: "Cleared", R3: "In progress", R4: "Cleared", R5: "In progress", R6: "Not initiated", R7: "Cleared" };
export function vigilance(r) {
  const status = VIG_SEED[r.id] || (r.stage >= 4 ? "Cleared" : "In progress");
  const cleared = status === "Cleared";
  // overdue = not cleared and within the 3-month window before retirement
  const overdue = !cleared && typeof r.bdr === "number" && r.bdr <= 3;
  const tone = cleared ? "ok" : overdue ? "err" : "warn";
  const icon = cleared ? "shieldCheck" : "shieldQuestion";
  const ref = cleared ? `VIG/${r.id}/2026` : "—";
  const note = cleared
    ? "No vigilance / disciplinary case pending — clearance on record."
    : overdue
      ? `Retires in ${r.bdr} month(s) — clearance overdue (should be obtained ≥ 3 months prior). Follow up with the CVO.`
      : "Reference sent to the Chief Vigilance Officer (CVO); awaiting clearance.";
  return { status, cleared, overdue, tone, icon, ref, note };
}

// Build a full retiree profile (the pensioner's record the HOO can open from a case).
export function retireeProfile(r) {
  const dorYear = parseInt((r.dor.match(/\d{4}/) || ["2026"])[0], 10);
  const joinYear = dorYear - r.qualifyingYears;
  const last4 = (r.pan || "0000").replace(/\D/g, "").padStart(4, "0").slice(-4);
  return {
    personal: [
      ["Name", r.name], ["PAN", r.pan], ["Aadhaar", `XXXX-XXXX-${last4}`],
      ["Date of birth", `Born ${dorYear - 60} (superannuates at 60)`],
      ["Mobile", "+91 9XXXXX" + last4], ["Email", r.name.toLowerCase().split(" ")[0] + "@example.gov.in"],
    ],
    service: [
      ["Designation", `${r.designation} · ${r.level}`], ["Office", "NR — Personnel Branch"],
      ["Date of joining", `c. ${joinYear}`], ["Date of retirement", r.dor],
      ["Qualifying service", `${r.qualifyingYears} years`], ["Service Book no.", `SB/${r.id}/${joinYear}`],
      ["Govt quarter", r.quarter === "Yes" ? "Yes — NDC required" : "No"], ["Case source", r.source],
    ],
    financial: [
      ["Last emoluments", "₹" + r.emoluments.toLocaleString("en-IN")],
      ["Bank", "State Bank of India — Pension Cell"], ["Account", "XXXXXX" + last4], ["IFSC", "SBIN0001234"],
    ],
    family: [
      ["Spouse", r.name.startsWith("Mohd") ? "Mrs. A. Khan" : "Spouse on record"],
      ["Nominee (LTA/gratuity)", "Spouse — 100%"], ["Disabled dependent", "None on record"],
    ],
  };
}

// ---------- evidence for verification checklists (what the HOO actually reviews) ----------

function _meta(r) {
  const dorYear = parseInt((r.dor.match(/\d{4}/) || ["2026"])[0], 10);
  const last4 = (r.pan || "0000").replace(/\D/g, "").padStart(4, "0").slice(-4);
  return { dorYear, joinYear: dorYear - r.qualifyingYears, dobYear: dorYear - 60, last4 };
}

// Service Book validation (Case Workbench → Validate Service Book).
// Each field is shown from BOTH source systems — HRMS and EIS. Where the two
// disagree, the row is a mismatch the HOO must resolve (Keep HRMS / Keep EIS).
// row: { field, hrms, eis }  ·  when hrms === eis it is a match.
export function verifyEvidence(r) {
  const m = _meta(r);
  // deterministic per-retiree "noise" so a couple of fields differ between systems
  const n = (r.pan || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const joinEis = m.joinYear;
  const joinHrms = (n % 2 === 0) ? m.joinYear : m.joinYear - 1;        // DOJ sometimes differs by a year
  const attHrms = "31 Mar 2026";
  const attEis = (n % 3 === 0) ? "28 Feb 2026" : "31 Mar 2026";        // last attestation sometimes differs
  const payEis = r.emoluments;
  const payHrms = (n % 5 === 0) ? r.emoluments - 400 : r.emoluments;   // last pay sometimes differs
  const grossHrms = joinHrms !== joinEis ? r.qualifyingYears + 1 : r.qualifyingYears;

  const items = [
    { key: "id", label: "Identity & PAN confirmed against Service Book", rows: [
      { field: "Name", hrms: r.name, eis: r.name },
      { field: "PAN", hrms: r.pan, eis: r.pan },
      { field: "Date of birth", hrms: `${m.dobYear} (retires at 60)`, eis: `${m.dobYear} (retires at 60)` },
      { field: "Designation", hrms: `${r.designation} · ${r.level}`, eis: `${r.designation} · ${r.level}` },
    ] },
    { key: "qs", label: "Qualifying service computed — no unverified breaks", rows: [
      { field: "Date of joining", hrms: `c. ${joinHrms}`, eis: `c. ${joinEis}` },
      { field: "Date of retirement", hrms: r.dor, eis: r.dor },
      { field: "Gross service", hrms: `${grossHrms} years`, eis: `${r.qualifyingYears} years` },
      { field: "Non-qualifying breaks", hrms: "Nil", eis: "Nil" },
    ] },
    { key: "sb", label: "Service Book pages validated, signed & dated", rows: [
      { field: "Service Book no.", hrms: `SB/${r.id}/${joinHrms}`, eis: `SB/${r.id}/${joinEis}` },
      { field: "Volumes", hrms: r.qualifyingYears > 30 ? "2" : "1", eis: r.qualifyingYears > 30 ? "2" : "1" },
      { field: "Last attestation", hrms: attHrms, eis: attEis },
      { field: "Missing entries", hrms: "None", eis: "None" },
    ] },
    { key: "leave", label: "Leave, deputation & suspension entries reconciled", rows: [
      { field: "EOL without medical cert.", hrms: "Nil", eis: "Nil" },
      { field: "Deputation period", hrms: "Nil", eis: "Nil" },
      { field: "Suspension", hrms: "None", eis: "None" },
      { field: "LTC / advance recoveries", hrms: "Cleared", eis: "Cleared" },
    ] },
  ];
  if (r.quarter === "Yes") items.push({ key: "ndc", label: "No-Dues Certificate from D/o Estates (govt quarter)", rows: [
    { field: "Quarter", hrms: "Type-IV / Block C", eis: "Type-IV / Block C" },
    { field: "Vacation", hrms: "On or before DOR", eis: "On or before DOR" },
    { field: "NDC status", hrms: "Awaited from Estates", eis: "Awaited from Estates" },
  ] });
  items.push({ key: "emol", label: "Last emoluments confirmed for Forms 7 & 8", rows: [
    { field: "Last basic pay", hrms: formatINR(payHrms), eis: formatINR(payEis) },
    { field: "Pay level", hrms: r.level, eis: r.level },
    { field: "DA at DOR", hrms: "50%", eis: "50%" },
    { field: "NPA", hrms: "N.A.", eis: "N.A." },
  ] });
  return items;
}

// Submitted Form 6A validation (Case Workbench → Verify submitted Form 6A)
export function formCheckEvidence(r) {
  const m = _meta(r);
  return [
    { key: "recv", label: "Form 6A received, complete & signed",
      data: [["Submitted", "received from portal"], ["Mode", "Pensioner portal"], ["Sections", "All filled"], ["e-Sign", "Verified"]] },
    { key: "nom", label: "Nomination for life-time arrears / gratuity valid",
      data: [["Nominee", "Spouse"], ["Relationship", "Wife / Husband"], ["Share", "100%"], ["Witnesses", "2"]] },
    { key: "bank", label: "Bank account & IFSC verified (penny-drop)",
      data: [["Bank", "SBI — Pension Cell"], ["Account", "XXXXXX" + m.last4], ["IFSC", "SBIN0001234"], ["Penny-drop", "₹1 credited — name matched"]],
      flag: "Penny-drop successful", flagTone: "ok" },
    { key: "photo", label: "Joint photograph & specimen signatures attached",
      data: [["Joint photograph", "On record"], ["Specimen signatures", "3 sets"], ["Thumb impression", "N.A."]] },
    { key: "fam", label: "Family details & CGHS particulars updated",
      data: [["Spouse", "On record"], ["Dependents", "1"], ["CGHS card", "Active"], ["Disabled dependent", "None"]] },
  ];
}

// ---------- evidence for FAMILY PENSION (subtype-aware) ----------
export function familyElig(c) {
  if (c.subtype === "In-Service Death") return [
    { key: "rel", label: "Relationship with the deceased verified", data: [["Claimant", c.name], ["Relation", c.relation], ["Deceased", `${c.deceased} · ${c.deceasedDesig}`]] },
    { key: "order", label: "Claimant first in the order of eligibility", data: [["Order", c.relation.includes("Son") ? "Child (after spouse)" : "Spouse (1st)"], ["Other claimants", "None on record"]] },
    { key: "cond", label: "Age / marital / dependency conditions met", data: [["Age", `${c.age} years`], ["Status", "Widow / Widower"], ["Independent income", "Below limit"]] },
    { key: "noexist", label: "No other family-pension already in payment", data: [["Existing FP", "None found"], ["Cross-check", "DoPPW database"]], flag: "No duplicate family pension", flagTone: "ok" },
  ];
  const isInelig = c.trigger && c.trigger.includes("Ineligibility");
  return [
    { key: "trigger", label: "Trigger verified (death of pensioner / ineligibility of recipient)", data: [["Trigger", c.trigger || "Death of pensioner"], ["Evidence", isInelig ? "Remarriage / majority proof" : "Death certificate of the pensioner"]], flag: "Trigger established", flagTone: "ok" },
    { key: "ppo", label: "Deceased pensioner's PPO verified", data: [["PPO", c.deceasedPpo], ["Pension drawn", "On record"], ["Authorised family pension", "Recorded in PPO"]] },
    { key: "next", label: "Claimant is next in the order of eligibility", data: [["Claimant", `${c.name} (${c.relation})`], ["Order", c.relation.includes("Son") ? "Child (after spouse)" : "Spouse (1st)"]] },
    { key: "cond", label: "Age / marital / dependency conditions met", data: [["Age", `${c.age} years`], ["Status", c.relation.includes("Son") ? "Minor — guardian: father" : "Widow / Widower"]] },
  ];
}

export function familyDocs(c) {
  const items = [];
  if (c.subtype === "In-Service Death") {
    items.push({ key: "death", label: "Death certificate verified", data: [["Certificate no.", `MC/${c.id}/2026`], ["Issuing authority", "Municipal Corporation"], ["Date of death", c.dol]] });
    items.push({ key: "form14", label: "Form 14 (claim for family pension) received", data: [["Form 14", "Complete & signed"], ["Claimant", c.name]] });
    items.push({ key: "form12", label: "Form 12 (nomination for death gratuity) on record", data: [["Form 12", "On record"], ["Death gratuity", "Payable"]] });
  } else {
    const isInelig = c.trigger && c.trigger.includes("Ineligibility");
    items.push({ key: "proof", label: isInelig ? "Proof of ineligibility of previous recipient" : "Death certificate of the pensioner", data: isInelig ? [["Document", "Remarriage / majority certificate"], ["Attested", "Yes"]] : [["Certificate no.", `MC/${c.id}/2026`], ["Date of death", c.dol]] });
    items.push({ key: "form14", label: "Form 14 (claim for family pension) received", data: [["Form 14", "Complete & signed"], ["Claimant", c.name]] });
    items.push({ key: "ppoCopy", label: "Copy of the deceased's PPO enclosed", data: [["PPO", c.deceasedPpo]] });
  }
  items.push({ key: "idv", label: "Claimant identity / Aadhaar verified", data: [["Aadhaar", c.aadhaar], ["Photograph", "Attached"], ["Match", "Verified"]] });
  items.push({ key: "bank", label: "Bank account & IFSC verified", data: [["Bank", c.bank], ["Account", c.account], ["IFSC", c.ifsc], ["Penny-drop", "Name matched"]] });
  if (c.relation.includes("Son") || c.relation.includes("minor")) items.push({ key: "guard", label: "Guardianship certificate (minor claimant)", data: [["Guardian", "Father"], ["Certificate", "Attached & attested"], ["Minor's age", `${c.age} years`]] });
  return items;
}

export function familySanction(c) {
  const inService = c.subtype === "In-Service Death";
  return [
    { key: "sanc", label: "Family pension sanctioned under CCS (Pension) Rules", data: [["Rule", "Rule 50, CCS (Pension) Rules 2021"], ["Normal rate", "30% of last pay"], ["Enhanced rate", inService ? "50% for 10 years" : "50% for 7 yrs / age 67"], ["Last pay", formatINR(c.lastPay)]] },
    ...(inService ? [{ key: "grat", label: "Death gratuity sanctioned (Form 12)", data: [["Form 12", "On record"], ["Gratuity", "Payable, within ₹25 L ceiling"]] }] : []),
    { key: "form18", label: "Form 18 prepared & signed", data: [["Form 18", "Generated"], ["Signed by", "Head of Office"]] },
    { key: "fwd", label: "Forwarded to PAO for PPO", data: [["PAO", HOO_OFFICE.pao], ["Mode", "e-forwarded"]] },
  ];
}

// ---------- evidence for EOP (subtype-aware) ----------
export function eopElig(c) {
  if (c.subtype === "Disability Pension") return [
    { key: "attr", label: "Disablement attributable to / aggravated by service", data: [["Circumstance", "Injury on duty"], ["Injury report", "On record"], ["Attributability", "Accepted"]], flag: "Attributable to service", flagTone: "ok" },
    { key: "board", label: "Medical Board assessment on record", data: [["Medical Board", "Constituted"], ["Degree of disablement", `${c.disabilityPct}%`], ["Permanent", "Yes"]] },
    { key: "cat", label: "Category of disablement determined", data: [["Category", `Category ${c.eopCategory}`], ["Basis", "CCS (EOP) Rules"]] },
    { key: "invalid", label: "Invalidation out of service approved", data: [["Status", c.event], ["Qualifying service", `${c.qualifyingYears} years`]] },
  ];
  return [
    { key: "attr", label: "Death attributable to / aggravated by service", data: [["Circumstance", "While on duty"], ["Board of enquiry", "On record"], ["Attributability", "Accepted"]], flag: "Attributable to service", flagTone: "ok" },
    { key: "cat", label: "Category (A–E) determined", data: [["Category", `Category ${c.eopCategory}`], ["Basis", "Cause of death under EOP Rules"]] },
    { key: "claim", label: "Claimant is the eligible beneficiary", data: [["Claimant", c.name], ["Relation", c.relation], ["Deceased", `${c.deceased} · ${c.deceasedDesig}`]] },
    { key: "board", label: "Board of enquiry / medical opinion on record", data: [["Board of enquiry", "Completed"], ["Opinion", "Received"]] },
  ];
}

export function eopDocs(c) {
  if (c.subtype === "Disability Pension") return [
    { key: "mb", label: "Medical Board proceedings enclosed", data: [["Report", "Invalidation form"], ["Degree", `${c.disabilityPct}%`]] },
    { key: "injury", label: "Injury / attributability report enclosed", data: [["Report", "On record"], ["Sanctioned", "Yes"]] },
    { key: "idv", label: "Employee identity / Aadhaar verified", data: [["Aadhaar", c.aadhaar], ["Photograph", "Attached"]] },
    { key: "bank", label: "Bank account & IFSC verified", data: [["Bank", c.bank], ["Account", c.account], ["IFSC", c.ifsc], ["Penny-drop", "Name matched"]] },
  ];
  return [
    { key: "death", label: "Death certificate verified", data: [["Certificate no.", `MC/${c.id}/2026`], ["Date of death", c.dol]] },
    { key: "attrib", label: "Attributability / Board of enquiry report", data: [["Report", "On record"], ["Category", `Category ${c.eopCategory}`]] },
    { key: "idv", label: "Claimant identity / Aadhaar verified", data: [["Aadhaar", c.aadhaar], ["Photograph", "Attached"]] },
    { key: "bank", label: "Bank account & IFSC verified", data: [["Bank", c.bank], ["Account", c.account], ["IFSC", c.ifsc], ["Penny-drop", "Name matched"]] },
  ];
}

export function eopSanction(c) {
  const disability = c.subtype === "Disability Pension";
  return [
    { key: "sanc", label: disability ? "Disability pension sanctioned (CCS EOP Rules)" : "Extraordinary family pension sanctioned (CCS EOP Rules)",
      data: disability ? [["Rule", "CCS (EOP) Rules"], ["Service element", "50% of pay"], ["Disability element", "Category-based"], ["Category", `Category ${c.eopCategory}`]] : [["Rule", "CCS (EOP) Rules"], ["Category", `Category ${c.eopCategory}`], ["Special rate", c.eopCategory === "E" ? "100%" : c.eopCategory === "D" ? "60%" : "40%"]] },
    { key: "form", label: disability ? "Invalidation & sanction order signed" : "Sanction order signed", data: [["Order", "Generated"], ["Signed by", "Head of Office"]] },
    { key: "fwd", label: "Forwarded to PAO for PPO", data: [["PAO", HOO_OFFICE.pao], ["Mode", "e-forwarded"]] },
  ];
}

// Simulated EIS / pension-DB lookup by PAN. In production this is a Parichay-authenticated
// call to the Employee Information System (serving) or CPAO/Bhavishya (pensioner) databases.
const EIS_SEEDED = {
  ABCPV1234L: { holder: "Late Shri R. K. Verma", designation: "Section Officer", lastPay: 96000, qualifyingYears: 18, ppo: "", bank: "State Bank of India — Salary", account: "XXXXXX2210", ifsc: "SBIN0001234", aadhaar: "XXXX-XXXX-2210" },
  PQRSM5678N: { holder: "Shri Manoj Kumar", designation: "Sub-Inspector", lastPay: 90000, qualifyingYears: 14, ppo: "", bank: "Bank of Baroda — Salary", account: "XXXXXX3091", ifsc: "BARB0VJNAGA", aadhaar: "XXXX-XXXX-3091" },
  LMNOP4321Q: { holder: "Late Shri P. Nair", designation: "Superintendent (Retd.)", lastPay: 84000, qualifyingYears: 33, ppo: "PPO-2014-DEL-0039210", bank: "Punjab National Bank", account: "XXXXXX5521", ifsc: "PUNB0123456", aadhaar: "XXXX-XXXX-5521" },
};
export function eisFetch(pan) {
  const key = (pan || "").toUpperCase();
  if (EIS_SEEDED[key]) return EIS_SEEDED[key];
  // deterministic fallback so any valid PAN returns a plausible record
  const n = key.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const tail = String(1000 + (n % 9000));
  return {
    holder: "(name as per EIS)", designation: "(designation as per EIS)",
    lastPay: 60000 + (n % 60) * 1000, qualifyingYears: 10 + (n % 25),
    ppo: "PPO-20" + (10 + (n % 14)) + "-DEL-00" + tail,
    bank: "State Bank of India", account: "XXXXXX" + tail, ifsc: "SBIN0001234", aadhaar: "XXXX-XXXX-" + tail,
  };
}
