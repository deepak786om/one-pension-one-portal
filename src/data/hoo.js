// Mock data for the Head of Office (HOO) journey.

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
    note: "Family pension @30% + DA; enhanced rate for 10 years." },
  { id: "F2", name: "Master Aryan Singh (minor)", deceased: "Late Smt. Sunita Singh", relation: "Son (guardian: father)", kind: "Death after retirement",
    dol: "02 May 2026", ppo: "", stage: "Eligibility check", quarter: "No",
    note: "Conversion from pension to family pension; guardian certificate required." },
  { id: "E1", name: "Smt. Reena Yadav", deceased: "Late Const. Mahesh Yadav", relation: "Spouse", kind: "EOP / EOFP",
    dol: "21 Mar 2026", ppo: "", stage: "Attributability under examination", quarter: "No",
    note: "Death attributable to government service — extraordinary family pension." },
];

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
