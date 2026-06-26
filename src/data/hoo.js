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
  { key: "verify", label: "Service Verification", bdr: "12–15M", icon: "fileCheck" },
  { key: "send", label: "Send Form 6A", bdr: "8M", icon: "arrowUpRight" },
  { key: "received", label: "Forms Received", bdr: "6M", icon: "fileText" },
  { key: "forms", label: "Forms Verification", bdr: "4M", icon: "fileCheck" },
  { key: "pao", label: "Sent to PAO (7 & 8)", bdr: "4M", icon: "arrowUpRight" },
  { key: "ppo", label: "PPO Status", bdr: "1M", icon: "badgeCheck" },
  { key: "done", label: "Completed", bdr: "—", icon: "check" },
];

// the action the HOO performs to MOVE OUT of a given stage
export const STAGE_PRIMARY = [
  "Verify Service Book",
  "Send Form 6A to retiree",
  "Mark forms received",
  "Verify submitted forms",
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
      ["10 Aug 2025", "You (HOO)", "Service Book verified", "33y 11m qualifying service confirmed."],
      ["12 Oct 2025", "You (HOO)", "Form 6A sent to retiree", ""],
      ["28 Nov 2025", "Retiree", "Forms received", "Form 6A + nominations submitted."],
      ["15 Jan 2026", "You (HOO)", "Forms verified", ""],
      ["02 Feb 2026", "You (HOO)", "Forms 7 & 8 sent to PAO", "Computation sheet forwarded."],
    ),
  },
  {
    id: "R2", name: "Mohd Arif Khan", pan: "MKHPK4456L", designation: "Software Developer", level: "Level 10",
    type: "Superannuation", dor: "31 Aug 2026", bdr: 2, source: "EIS", quarter: "No",
    stage: 4, ppo: "", emoluments: 121800, qualifyingYears: 30,
    history: hist(
      ["20 Sep 2025", "You (HOO)", "Service Book verified", ""],
      ["18 Nov 2025", "You (HOO)", "Form 6A sent to retiree", ""],
      ["09 Dec 2025", "Retiree", "Forms received", ""],
      ["22 Jan 2026", "You (HOO)", "Forms verified", "Ready to compute."],
    ),
  },
  {
    id: "R8", name: "Arjun Rao", pan: "ARJPR8890Q", designation: "Accounts Officer", level: "Level 10",
    type: "Superannuation", dor: "31 Aug 2026", bdr: 2, source: "EIS", quarter: "No",
    stage: 4, ppo: "", returned: true, emoluments: 118600, qualifyingYears: 29,
    history: hist(
      ["15 Sep 2025", "You (HOO)", "Service Book verified", ""],
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
      ["28 Oct 2025", "You (HOO)", "Service Book verified", ""],
      ["02 Dec 2025", "You (HOO)", "Form 6A sent to retiree", ""],
      ["10 Jan 2026", "Retiree", "Forms received", ""],
    ),
  },
  {
    id: "R4", name: "Ramesh Iyer", pan: "RAMPI5566P", designation: "Section Officer", level: "Level 8",
    type: "Superannuation", dor: "31 Oct 2026", bdr: 4, source: "EIS", quarter: "Yes",
    stage: 2, ppo: "", emoluments: 98400, qualifyingYears: 31,
    history: hist(
      ["20 Nov 2025", "You (HOO)", "Service Book verified", ""],
      ["10 Jan 2026", "You (HOO)", "Form 6A sent to retiree", "NDC from D/o Estates pending (govt quarter)."],
    ),
  },
  {
    id: "R5", name: "Priya Sharma", pan: "PRYPS7788R", designation: "Deputy Director", level: "Level 12",
    type: "Superannuation", dor: "31 Dec 2026", bdr: 6, source: "EIS", quarter: "No",
    stage: 1, ppo: "", emoluments: 165100, qualifyingYears: 27,
    history: hist(["05 Jan 2026", "You (HOO)", "Service Book verified", ""]),
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
      ["10 Jul 2025", "You (HOO)", "Service Book verified", ""],
      ["12 Sep 2025", "You (HOO)", "Form 6A sent to retiree", ""],
      ["01 Oct 2025", "Retiree", "Forms received", ""],
      ["20 Nov 2025", "You (HOO)", "Forms verified", ""],
      ["05 Dec 2025", "You (HOO)", "Forms 7 & 8 sent to PAO", ""],
      ["18 Jan 2026", "PAO", "PPO issued", "PPO-2026-DEL-0101887 generated; SSA sent to bank."],
    ),
  },
];

// Family pension / EOP
export const FAMILY_CASES = [
  { id: "F1", name: "Smt. Kamla Devi", deceased: "Late Shri R. K. Verma", relation: "Spouse", kind: "In-Service Death",
    dol: "12 Apr 2026", ppo: "", stage: "Documents under verification", quarter: "No",
    lastPay: 96000, qualifyingYears: 18, age: 54, deceasedDesig: "Section Officer",
    aadhaar: "XXXX-XXXX-2210", bank: "State Bank of India — Pension Cell", account: "XXXXXX2210", ifsc: "SBIN0001234",
    note: "Family pension @30% + DA; enhanced rate (50%) for 10 years from death; death gratuity payable." },
  { id: "F2", name: "Master Aryan Singh (minor)", deceased: "Late Smt. Sunita Singh", relation: "Son (guardian: father)", kind: "Death after retirement",
    dol: "02 May 2026", ppo: "", stage: "Eligibility check", quarter: "No",
    lastPay: 72000, qualifyingYears: 0, age: 11, deceasedDesig: "Assistant (Retd.)",
    aadhaar: "XXXX-XXXX-5521", bank: "Punjab National Bank", account: "XXXXXX5521", ifsc: "PUNB0123456",
    note: "Conversion from pension to family pension; enhanced rate for 7 years; guardian certificate required." },
  { id: "E1", name: "Smt. Reena Yadav", deceased: "Late Const. Mahesh Yadav", relation: "Spouse", kind: "EOP / EOFP",
    dol: "21 Mar 2026", ppo: "", stage: "Attributability under examination", quarter: "No",
    lastPay: 60000, qualifyingYears: 9, age: 41, deceasedDesig: "Constable",
    aadhaar: "XXXX-XXXX-8841", bank: "Canara Bank", account: "XXXXXX8841", ifsc: "CNRB0004412",
    note: "Death attributable to government service — extraordinary family pension; Category-B/C examination." },
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

// Service Book verification (Case Workbench → Verify Service Book)
export function verifyEvidence(r) {
  const m = _meta(r);
  const items = [
    { key: "id", label: "Identity & PAN confirmed against Service Book",
      data: [["Name", r.name], ["PAN", r.pan], ["Date of birth", `${m.dobYear} (retires at 60)`], ["Designation", `${r.designation} · ${r.level}`]] },
    { key: "qs", label: "Qualifying service computed — no unverified breaks",
      data: [["Date of joining", `c. ${m.joinYear}`], ["Date of retirement", r.dor], ["Gross service", `${r.qualifyingYears} years`], ["Non-qualifying breaks", "Nil"], ["Net qualifying service", `${r.qualifyingYears} years`]],
      flag: "No unverified breaks found", flagTone: "ok" },
    { key: "sb", label: "Service Book pages verified, signed & dated",
      data: [["Service Book no.", `SB/${r.id}/${m.joinYear}`], ["Volumes", r.qualifyingYears > 30 ? "2" : "1"], ["Last attestation", "31 Mar 2026"], ["Missing entries", "None"]] },
    { key: "leave", label: "Leave, deputation & suspension entries reconciled",
      data: [["EOL without medical cert.", "Nil"], ["Deputation period", "Nil"], ["Suspension", "None"], ["LTC / advance recoveries", "Cleared"]] },
  ];
  if (r.quarter === "Yes") items.push({ key: "ndc", label: "No-Dues Certificate from D/o Estates (govt quarter)",
    data: [["Quarter", "Type-IV / Block C"], ["Vacation", "On or before DOR"], ["NDC status", "Awaited from Estates"]], flag: "NDC pending — follow up", flagTone: "warn" });
  items.push({ key: "emol", label: "Last emoluments confirmed for Forms 7 & 8",
    data: [["Last basic pay", formatINR(r.emoluments)], ["Pay level", r.level], ["DA at DOR", "50%"], ["NPA", "N.A."]] });
  return items;
}

// Submitted Form 6A verification (Case Workbench → Verify submitted Form 6A)
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

// ---------- evidence for family pension / EOP ----------
export function eligEvidence(c) {
  if (c.kind === "EOP / EOFP") return [
    { key: "attr", label: "Death attributable to government service established",
      data: [["Circumstance", "While on duty"], ["Inquiry report", "On record"], ["Attributability", "Accepted"]], flag: "Attributable to service", flagTone: "ok" },
    { key: "cat", label: "Category of EOP (B/C/D/E) determined",
      data: [["Category", "Category-B"], ["Basis", "Death due to service conditions"]] },
    { key: "claim", label: "Claimant is the eligible beneficiary",
      data: [["Claimant", c.name], ["Relation", c.relation], ["Deceased", `${c.deceased} · ${c.deceasedDesig}`]] },
    { key: "med", label: "Board of enquiry / medical opinion on record",
      data: [["Medical board", "Constituted"], ["Opinion", "Received"]] },
  ];
  return [
    { key: "rel", label: "Relationship with the deceased verified",
      data: [["Claimant", c.name], ["Relation", c.relation], ["Deceased", `${c.deceased} · ${c.deceasedDesig}`], ["Record", "On the Service Book"]] },
    { key: "order", label: "Claimant first in the order of eligibility",
      data: [["Order", c.relation.includes("Son") ? "Child (after spouse)" : "Spouse (1st)"], ["Other claimants", "None on record"]] },
    { key: "cond", label: "Age / marital / dependency conditions met",
      data: [["Age", `${c.age} years`], ["Status", c.relation.includes("Son") ? "Minor — guardian: father" : "Widow / Widower"], ["Independent income", "Below limit"]] },
    { key: "noexist", label: "No other family-pension already in payment",
      data: [["Existing FP", "None found"], ["Cross-check", "DoPPW database"]], flag: "No duplicate family pension", flagTone: "ok" },
  ];
}

export function docsEvidence(c) {
  const items = [
    { key: "death", label: "Death certificate verified",
      data: [["Certificate no.", `MC/${c.id}/2026`], ["Issuing authority", "Municipal Corporation"], ["Date of death", c.dol]] },
    { key: "idv", label: "Claimant identity / Aadhaar verified",
      data: [["Aadhaar", "XXXX-XXXX-7741"], ["Photograph", "Attached"], ["Match", "Verified"]] },
    { key: "bank", label: "Bank account & IFSC verified",
      data: [["Bank", c.bank], ["Account", c.account], ["IFSC", c.ifsc], ["Penny-drop", "Name matched"]] },
  ];
  if (c.relation.includes("Son") || c.relation.includes("minor")) items.push({ key: "guard", label: "Guardianship certificate (minor claimant)",
    data: [["Guardian", "Father"], ["Certificate", "Attached & attested"], ["Minor's age", `${c.age} years`]] });
  if (c.quarter === "Yes") items.push({ key: "ndc", label: "No-Dues Certificate (govt quarter)", data: [["NDC", "Received"]] });
  return items;
}

export function sanctionEvidence(c) {
  return [
    { key: "sanc", label: "Family pension sanctioned under CCS (Pension) Rules",
      data: [["Rule", "Rule 50 / 54, CCS (Pension) Rules 2021"], ["Normal rate", "30% of last pay"], ["Enhanced rate", "50% of last pay"], ["Last pay", formatINR(c.lastPay)]] },
    { key: "form18", label: "Form 18 prepared & signed",
      data: [["Form 18", "Generated"], ["Signed by", "Head of Office"]] },
    { key: "fwd", label: "Forwarded to PAO for PPO",
      data: [["PAO", HOO_OFFICE.pao], ["Mode", "e-forwarded"]] },
  ];
}
