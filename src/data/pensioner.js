// Single mock pensioner identity that every module reads from.

export const PENSIONER = {
  name: "Anand Kumar Singh",
  ppo: "PPO-2024-DEL-0098231",
  ppoGenerated: true, // when false, the Form 6A (pre-PPO) service is shown
  pan: "ABCPS1234K",
  aadhaarMasked: "XXXX XXXX 4417",
  dob: "1964-03-12",
  fatherSpouse: "Late Shri Ram Singh",
  retiredOn: "2024-03-31",
  joinedOn: "1991-07-01",
  pensionType: "Superannuation",
  ministry: "Ministry of Railways",
  office: "Northern Railway, Baroda House, New Delhi",
  designation: "Senior Section Engineer",
  designationLevel: "Level 8 (7th CPC)",
  bank: { name: "State Bank of India", branch: "Connaught Place, New Delhi", accountMasked: "XXXXXX8842", ifsc: "SBIN0000691" },
  mobile: "+91 98xxx xx210",
  email: "anand.singh@example.in",
  presentAddress: "B-42, Sector 12, Dwarka, New Delhi 110078",
  emoluments: 112000,
  qualifyingYears: 33,
  basicPension: 56000,
  drPercent: 50,
};

export const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ---- lifecycle with drill-down detail ----
export const LIFECYCLE = [
  { key: "verify", label: "Service Verification", date: "12 Jun 2023", icon: "badgeCheck",
    detail: { by: "Head of Office, Northern Railway", note: "Service Book verified for 33 years of qualifying service; no break in service.", docs: ["Service Book", "Form 24"] } },
  { key: "forms", label: "Forms 6/6A Submitted", date: "20 Aug 2023", icon: "fileText",
    detail: { by: "Pensioner (you)", note: "Single Comprehensive Pension Form (6A) submitted with nominations and bank details.", docs: ["Form 6A", "Nomination", "Bank mandate"] } },
  { key: "computation", label: "Computation (Forms 7 & 8)", date: "05 Jan 2024", icon: "calculator",
    detail: { by: "Head of Office", note: "Pension, commutation and gratuity computed and forwarded.", docs: ["Form 7", "Form 8"] } },
  { key: "pao", label: "Forwarded to PAO", date: "28 Jan 2024", icon: "repeat",
    detail: { by: "Pay & Accounts Office", note: "Case scrutinised by the PAO; no objections raised.", docs: ["Forwarding memo"] } },
  { key: "ppo", label: "PPO Issued", date: "18 Mar 2024", icon: "badgeCheck",
    detail: { by: "Pay & Accounts Office", note: "Pension Payment Order generated and shared with the disbursing bank.", docs: ["e-PPO"] } },
  { key: "dbt", label: "First Pension Credited", date: "31 Mar 2024", icon: "activity",
    detail: { by: "State Bank of India (DBT)", note: "First monthly pension credited to your account via DBT.", docs: ["Payment advice"] } },
  { key: "live", label: "Pension Active", date: "Ongoing", icon: "check",
    detail: { by: "System", note: "Monthly pension running. Submit your Digital Life Certificate every year (due November).", docs: [] } },
];

// ---- payment ledger (powers the calendar) ----
export const PENSION_START = { y: 2024, m: 4 }; // April 2024
const NOW = { y: 2026, m: 6 }; // current month (Jun 2026)
export function disbursementFor(year, month /* 1-12 */) {
  const idx = year * 12 + (month - 1);
  const start = PENSION_START.y * 12 + (PENSION_START.m - 1);
  const now = NOW.y * 12 + (NOW.m - 1);
  if (idx < start || idx > now) return null;
  let amount = 78400;            // 2024 (DR 40%)
  if (year === 2025) amount = 82320; // DR 47%
  if (year >= 2026) amount = 84000;  // DR 50%
  return { amount, date: `01 ${MONTHS[month - 1]} ${year}` };
}
export const PAYMENTS = [
  { month: "Jun 2026", credited: "01 Jun 2026", gross: 84000, status: "Credited" },
  { month: "May 2026", credited: "01 May 2026", gross: 84000, status: "Credited" },
  { month: "Apr 2026", credited: "01 Apr 2026", gross: 84000, status: "Credited" },
  { month: "Mar 2026", credited: "01 Mar 2026", gross: 84000, status: "Credited" },
  { month: "Feb 2026", credited: "01 Feb 2026", gross: 84000, status: "Credited" },
  { month: "Jan 2026", credited: "01 Jan 2026", gross: 84000, status: "Credited" },
];

// ---- DLC ----
export const DLC_METHODS = [
  { key: "face", title: "Face Authentication", sub: "Scan your face in the One Pension app", icon: "scanFace" },
  { key: "finger", title: "Fingerprint", sub: "Use a registered biometric device", icon: "fingerprint" },
  { key: "iris", title: "IRIS Scan", sub: "Use a registered IRIS device", icon: "eye" },
];
export const DLC_HISTORY = [
  { year: "2025", date: "14 Nov 2025", mode: "Face Authentication", id: "JP-2025-9087-2231", status: "Submitted" },
  { year: "2024", date: "08 Nov 2024", mode: "Fingerprint", id: "JP-2024-7741-1180", status: "Submitted" },
  { year: "2023", date: "21 Nov 2023", mode: "IRIS", id: "JP-2023-5521-7741", status: "Submitted" },
];
export const DLC_STATUS = { current: "Submitted", validTill: "30 Nov 2026", nextDue: "Nov 2026" };

// nearest DLC camps (sorted by distance at runtime)
export const DLC_CAMPS = [
  { name: "SBI Pension Seva — Connaught Place", address: "PC-7, Connaught Place, New Delhi 110001", contact: "011-2345 6701", city: "New Delhi", pincode: "110001", distanceKm: 1.2, from: "01 Jul 2026", to: "05 Jul 2026", lat: 28.6328, lng: 77.2197 },
  { name: "CSC e-Governance — Dwarka Sector 12", address: "Plot 9, Sector 12, Dwarka, New Delhi 110078", contact: "011-2890 4412", city: "New Delhi", pincode: "110078", distanceKm: 2.4, from: "02 Jul 2026", to: "04 Jul 2026", lat: 28.5921, lng: 77.0460 },
  { name: "India Post — Janakpuri Head Office", address: "C-4 Block, Janakpuri, New Delhi 110058", contact: "011-2555 1188", city: "New Delhi", pincode: "110058", distanceKm: 3.9, from: "03 Jul 2026", to: "06 Jul 2026", lat: 28.6219, lng: 77.0878 },
  { name: "PNB Pension Cell — Rajouri Garden", address: "A-2, Rajouri Garden, New Delhi 110027", contact: "011-2510 7723", city: "New Delhi", pincode: "110027", distanceKm: 5.1, from: "04 Jul 2026", to: "05 Jul 2026", lat: 28.6469, lng: 77.1200 },
  { name: "Bank of Baroda — Vikaspuri", address: "Main Market, Vikaspuri, New Delhi 110018", contact: "011-2856 9034", city: "New Delhi", pincode: "110018", distanceKm: 6.0, from: "06 Jul 2026", to: "08 Jul 2026", lat: 28.6380, lng: 77.0739 },
  { name: "CSC — Uttam Nagar", address: "Metro Pillar 612, Uttam Nagar, New Delhi 110059", contact: "011-2536 8890", city: "New Delhi", pincode: "110059", distanceKm: 7.3, from: "07 Jul 2026", to: "09 Jul 2026", lat: 28.6225, lng: 77.0594 },
  { name: "India Post — Gurugram Sector 14", address: "Old DC Road, Sector 14, Gurugram 122001", contact: "0124-230 1145", city: "Gurugram", pincode: "122001", distanceKm: 12.6, from: "08 Jul 2026", to: "10 Jul 2026", lat: 28.4595, lng: 77.0266 },
];

// ---- grievances ----
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
  {
    id: "g1", regNo: "DOPPW/E/2026/0031187", category: "Non-revision of PPO",
    subject: "PPO not revised after 7th CPC", pertains: "Department / Ministry", pensionType: "Superannuation",
    lodged: "02 May 2026", status: "With Ministry/Dept", sla: "21 days left", onBehalf: null, appeal: null,
    history: [
      { date: "02 May 2026", actor: "You", action: "Grievance lodged", remark: "Revised PPO awaited after pay-commission fixation." },
      { date: "04 May 2026", actor: "DoPPW (Nodal)", action: "Forwarded to Ministry of Railways", remark: "Routed to the concerned PAO for examination." },
      { date: "11 May 2026", actor: "PAO, Northern Railway", action: "Under examination", remark: "Service records being re-checked for revision." },
    ],
  },
  {
    id: "g2", regNo: "DOPPW/E/2026/0028841", category: "Non-payment of arrears",
    subject: "DR arrears for Jan–Mar not paid", pertains: "Pension Disbursing Bank", pensionType: "Superannuation",
    lodged: "12 Mar 2026", status: "Resolved", sla: "Closed", onBehalf: null, appeal: null,
    history: [
      { date: "12 Mar 2026", actor: "You", action: "Grievance lodged", remark: "Dearness Relief arrears not credited." },
      { date: "15 Mar 2026", actor: "SBI Pension Cell", action: "Acknowledged", remark: "Arrears calculation initiated." },
      { date: "26 Mar 2026", actor: "SBI Pension Cell", action: "Resolved", remark: "Arrears of ₹6,240 credited on 25 Mar 2026." },
    ],
  },
  {
    id: "g3", regNo: "DOPPW/E/2026/0026102", category: "Non-payment of Fixed Medical Allowance (FMA)",
    subject: "FMA stopped since January", pertains: "Pension Disbursing Bank", pensionType: "Superannuation",
    lodged: "08 Feb 2026", status: "Resolved", sla: "Closed", onBehalf: null,
    appeal: {
      date: "20 Feb 2026", reason: "FMA was credited for one month only; February onward it has stopped again.",
      status: "Under appeal",
      history: [
        { date: "20 Feb 2026", actor: "You", action: "Appeal filed", remark: "Resolution incomplete — FMA stopped again." },
        { date: "24 Feb 2026", actor: "Appellate Authority (DoPPW)", action: "Appeal admitted", remark: "Bank asked to fix the standing instruction." },
      ],
    },
    history: [
      { date: "08 Feb 2026", actor: "You", action: "Grievance lodged", remark: "FMA of ₹1,000/month not being paid." },
      { date: "16 Feb 2026", actor: "SBI Pension Cell", action: "Resolved", remark: "FMA enabled for January." },
    ],
  },
  {
    id: "g4", regNo: "DOPPW/E/2026/0031990", category: "Delay in starting of pension",
    subject: "Family pension not started for my mother", pertains: "Department / Ministry", pensionType: "Family Pension",
    lodged: "18 May 2026", status: "With Bank", sla: "9 days left",
    onBehalf: { name: "Kamla Devi", ppo: "PPO-2025-DEL-0114552", relation: "Mother", bank: "Punjab National Bank", account: "XXXXXX2210", ifsc: "PUNB0123400", mobile: "+91 99xxx xx118" },
    appeal: null,
    history: [
      { date: "18 May 2026", actor: "You (on behalf of Kamla Devi)", action: "Grievance lodged", remark: "Family pension not started after father's demise." },
      { date: "21 May 2026", actor: "DoPPW (Nodal)", action: "Forwarded to PNB", remark: "Bank to verify family-pension authorisation." },
    ],
  },
];

// ---- family / nominees ----
export const NOMINEES = [
  { name: "Sunita Singh", relation: "Spouse", share: 100, type: "Family Pension", dob: "1968-07-22", id: "n1" },
  { name: "Rohit Singh", relation: "Disabled child", share: 0, type: "Contingent", dob: "2006-02-10", id: "n2" },
];

// ---- Anubhav ----
export const ANUBHAV_CATEGORIES = [
  "Accounts", "Admin Work", "Good Governance", "Government process re-engineering",
  "Information Technology", "Research", "Simplification of procedures", "Learning from Failure",
  "Public Dealing", "Contribution to field work", "Development of personal traits while in service",
  "Disclosure of experience for others", "Instances of great strength / valor / bravery",
  "Constructive feedback or suggestion", "Others",
];
export const ANUBHAV_SKILLS = [
  "Project Writing", "English Conversation", "Regional Language", "Public Speaking",
  "Computer Skill - General", "Computer Skill - Programming", "Computer Skill - Web designing",
  "Driving", "Cooking", "Carpentry", "Gardening", "Photography", "Mathematics", "Other",
];
// the user has not yet written one (one write-up per user allowed)
export const ANUBHAV = { submitted: false };

// ---- Form 6A (Single Comprehensive Pension Form) ----
export const FORM6A = {
  deadline: "10 Aug 2026",
  daysLeft: 46,
  // auto-pulled from EIS (read-only to the pensioner)
  eis: [
    { label: "Full name", value: PENSIONER.name },
    { label: "Father's / Spouse's name", value: PENSIONER.fatherSpouse },
    { label: "Date of birth", value: "12 Mar 1964" },
    { label: "Date of joining", value: "01 Jul 1991" },
    { label: "Date of retirement", value: "31 Mar 2024" },
    { label: "Designation", value: `${PENSIONER.designation} · ${PENSIONER.designationLevel}` },
    { label: "Office / Ministry", value: PENSIONER.office },
    { label: "Qualifying service", value: `${PENSIONER.qualifyingYears} years` },
    { label: "Last basic pay", value: "₹1,12,000" },
    { label: "PAN", value: PENSIONER.pan },
  ],
};

// ---- helpers ----
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
