// Single mock pensioner identity that every module reads from,
// so the dashboard feels like one connected account.

export const PENSIONER = {
  name: "Anand Kumar Singh",
  ppo: "PPO-2024-DEL-0098231",
  pan: "ABCPS1234K",
  aadhaarMasked: "XXXX XXXX 4417",
  dob: "1964-03-12",
  retiredOn: "2024-03-31",
  pensionType: "Superannuation",
  ministry: "Ministry of Railways",
  designation: "Senior Section Engineer",
  bank: { name: "State Bank of India", branch: "Connaught Place, New Delhi", accountMasked: "XXXXXX8842", ifsc: "SBIN0000691" },
  mobile: "+91 98xxx xx210",
  email: "anand.singh@example.in",
  emoluments: 112000, // last basic pay (for calculators default)
  qualifyingYears: 33,
  basicPension: 56000,
  commutedReduction: 0,
  drPercent: 50,
};

// 7-stage pension lifecycle (Track My Pension)
export const LIFECYCLE = [
  { key: "verify", label: "Service Verification", desc: "Service Book verified by HOO.", done: true, date: "12 Jun 2023" },
  { key: "forms", label: "Forms 6/6A Submitted", desc: "Pension application & nominations filed.", done: true, date: "20 Aug 2023" },
  { key: "computation", label: "Computation (Forms 7 & 8)", desc: "Pension & gratuity computed by HOO.", done: true, date: "05 Jan 2024" },
  { key: "pao", label: "Forwarded to PAO", desc: "Case sent to Pay & Accounts Office.", done: true, date: "28 Jan 2024" },
  { key: "ppo", label: "PPO Issued", desc: "Pension Payment Order generated.", done: true, date: "18 Mar 2024" },
  { key: "dbt", label: "First Pension Credited (DBT)", desc: "Disbursed to your bank account.", done: true, date: "31 Mar 2024" },
  { key: "live", label: "Pension Active", desc: "Monthly pension running; submit DLC yearly.", done: true, date: "Ongoing" },
];

export const PAYMENTS = [
  { month: "May 2026", credited: "01 May 2026", gross: 84000, status: "Credited" },
  { month: "Apr 2026", credited: "01 Apr 2026", gross: 84000, status: "Credited" },
  { month: "Mar 2026", credited: "01 Mar 2026", gross: 84000, status: "Credited" },
  { month: "Feb 2026", credited: "01 Feb 2026", gross: 82320, status: "Credited" },
  { month: "Jan 2026", credited: "01 Jan 2026", gross: 82320, status: "Credited" },
  { month: "Dec 2025", credited: "01 Dec 2025", gross: 82320, status: "Credited" },
];

// Digital Life Certificate
export const DLC_METHODS = [
  { key: "face", title: "Face Authentication", sub: "Jeevan Pramaan smartphone app", icon: "fingerprint" },
  { key: "finger", title: "Fingerprint", sub: "Biometric device at CSC / bank", icon: "fingerprint" },
  { key: "iris", title: "IRIS Scan", sub: "Biometric IRIS device", icon: "fingerprint" },
  { key: "camp", title: "At a DLC Camp", sub: "Find a nearby Nationwide DLC camp", icon: "mapPin" },
];

export const DLC_HISTORY = [
  { year: "2025", date: "14 Nov 2025", mode: "Face Authentication", id: "JP-2025-9087-2231", status: "Submitted" },
  { year: "2024", date: "08 Nov 2024", mode: "Fingerprint", id: "JP-2024-7741-1180", status: "Submitted" },
  { year: "2023", date: "21 Nov 2023", mode: "IRIS", id: "JP-2023-5521-7741", status: "Submitted" },
];
export const DLC_STATUS = { current: "Submitted", validTill: "30 Nov 2026", nextDue: "Nov 2026" };

// Grievances (CPENGRAMS)
export const GRIEVANCE_CATEGORIES = [
  "Delay in starting of pension",
  "Non-payment of arrears",
  "Non-payment of Fixed Medical Allowance (FMA)",
  "CGHS facility / Medical benefits",
  "7th CPC issues",
  "Non-revision of PPO",
  "New Pension Scheme (NPS) issue",
  "Disability pension",
  "Other",
];
export const GRIEVANCE_PERTAINS = ["Department / Ministry", "Pension Disbursing Bank", "Not aware"];
export const PENSION_TYPES = ["Superannuation", "Voluntary Retirement", "Family Pension", "Family Pension (NPS)", "NPS", "Other"];

export const GRIEVANCES = [
  { regNo: "DOPPW/E/2026/0031187", category: "Non-revision of PPO", lodged: "02 May 2026", status: "With Ministry/Dept", sla: "21 days left", canAppeal: false },
  { regNo: "DOPPW/E/2026/0028841", category: "Non-payment of arrears", lodged: "12 Mar 2026", status: "Resolved", sla: "Closed", canAppeal: true },
];

// Family / nominees
export const NOMINEES = [
  { name: "Sunita Singh", relation: "Spouse", share: 100, type: "Family Pension", dob: "1968-07-22", id: "n1" },
  { name: "Rohit Singh", relation: "Son (minor/disabled)", share: 0, type: "Contingent", dob: "2006-02-10", id: "n2" },
];

// Anubhav write-up
export const ANUBHAV = { status: "Published", submittedOn: "10 Apr 2024", grade: "Outstanding", published: true, title: "33 years on the rails: lessons in safety and service" };

// Helpers
let SEQ = 31200;
export function newGrievanceRegNo() {
  SEQ += Math.floor(Math.random() * 40) + 7;
  return `DOPPW/E/2026/00${SEQ}`;
}
export function newPramaanId() {
  const a = Math.floor(1000 + Math.random() * 8999);
  const b = Math.floor(1000 + Math.random() * 8999);
  return `JP-2026-${a}-${b}`;
}
