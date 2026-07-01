// ===== Service catalogue =====
export const MODULES = {
  ppo_view: { label: "View & Verify PPO", icon: "badgeCheck", desc: "Inspect your Pension Payment Order and flag corrections." },
  track_pension: { label: "Track My Pension", icon: "activity", desc: "Real-time status of sanction and monthly payment." },
  dlc_submit: { label: "Submit Digital Life Certificate", icon: "fingerprint", desc: "Annual Jeevan Pramaan via Aadhaar (Face/Finger/IRIS)." },
  grievance_lodge: { label: "Lodge & Track Grievance", icon: "messageCircle", desc: "Raise a pension grievance via CPENGRAMS." },
  calculators: { label: "Pension Calculators", icon: "calculator", desc: "Pension, gratuity, commutation and DR estimators." },
  anubhav_share: { label: "Share your Anubhav", icon: "bookOpen", desc: "Publish your service experience for recognition." },
  family_update: { label: "Update Family / Nominee", icon: "heartHandshake", desc: "Maintain family and nominee particulars." },
  account_transfer: { label: "Transfer Pension Account", icon: "repeat", desc: "Move between disbursing agencies / banks." },
  service_verification: { label: "Service Verification", icon: "fileCheck", desc: "Verify Service Book and qualifying service." },
  forms_computation: { label: "Forms 7 / 8 Computation", icon: "fileText", desc: "Prepare the pension computation forms." },
  send_to_pao: { label: "Forward Case to PAO", icon: "arrowUpRight", desc: "Send the sanctioned case to PAO (eSign/DSC)." },
  family_pension: { label: "Family Pension", icon: "heartHandshake", desc: "Death-in-service and death/ineligibility family pension." },
  eop: { label: "Extraordinary Pension (EOP)", icon: "shieldCheck", desc: "Disability pension and extraordinary family pension (EOFP)." },
  hoo_grievance: { label: "Office Grievances", icon: "messageCircle", desc: "View and act on office-level grievances." },
  case_workbench: { label: "Pension Cases", icon: "briefcase", desc: "Process retiring employees end-to-end: verify, forms, compute, forward to PAO." },
  pension_revision: { label: "Pension Revision", icon: "repeat", desc: "Revise pension on pay-commission / restoration and forward to PAO." },
  hoo_utility: { label: "Utilities", icon: "database", desc: "Download ePPO / eSSA, identity card, undertakings and manual PPO." },
  pension_sanction: { label: "Pension Sanction & PPO", icon: "badgeCheck", desc: "Compute, sanction and issue the PPO." },
  pao_workbench: { label: "Sanction & Issue PPO", icon: "badgeCheck", desc: "Scrutinise HOO cases, raise objections and issue the e-PPO." },
  pao_revision: { label: "Revision Authorities", icon: "repeat", desc: "Issue revised pension authorities on CPC / restoration." },
  ddo_cases: { label: "My Forwarded Cases", icon: "arrowUpRight", desc: "Track retiree cases forwarded to the Head of Office." },
  hoo_anubhav: { label: "Anubhav Recommendations", icon: "bookOpen", desc: "Review and recommend pensioners' experiences to the HOD." },
  hod_anubhav: { label: "Anubhav Recommendations", icon: "bookOpen", desc: "Review recommended experiences and publish them." },
  assoc_members: { label: "Member Registry", icon: "users", desc: "Maintain your association's member list." },
  compact_export: { label: "Export to COMPACT", icon: "database", desc: "Generate XML for CPAO / COMPACT." },
  retiree_records: { label: "Maintain Retiree Records", icon: "fileText", desc: "Add and update retiree details." },
  eis_import: { label: "Import from EIS", icon: "repeat", desc: "Pull employee data from EIS / HRMS." },
  dept_reports: { label: "Department Reports / MIS", icon: "bookMarked", desc: "Oversight reports across the department." },
  reg_approval: { label: "Approve Registrations", icon: "badgeCheck", desc: "Process official registration requests." },
  nodal_registry: { label: "Nodal Officer Registry", icon: "users", desc: "Maintain the nodal officer registry." },
  grievance_queue: { label: "Grievance Redressal Queue", icon: "messageCircle", desc: "Work the queue; coded actions 4A / 20 / 10." },
  atr: { label: "Action Taken Reports", icon: "fileCheck", desc: "Record ATR and dispose with a reply." },
  appeals: { label: "Appeals", icon: "scale", desc: "Decide appeals within the 30-day SLA." },
  lodge_on_behalf: { label: "Lodge on Behalf of Members", icon: "messageCircle", desc: "Raise grievances for association members." },
  assoc_dashboard: { label: "Association Dashboard", icon: "bookMarked", desc: "Total / Pending / Disposed for your members." },
  camp_log: { label: "Log DLC Camp", icon: "fingerprint", desc: "Record camp date, location and DLC count." },
  campaign_dashboard: { label: "Campaign MIS Dashboard", icon: "database", desc: "National DLC coverage and daily progress." },
  jp_import: { label: "Jeevan Pramaan Import", icon: "repeat", desc: "Import aggregate DLC counts by date range." },
  user_mgmt: { label: "User & Role Management", icon: "users", desc: "Create / modify users; assign roles (RBAC)." },
  masters: { label: "Master Data", icon: "database", desc: "Ministries, categories, banks and offices." },
  mis: { label: "System MIS", icon: "bookMarked", desc: "Cross-module monitoring and analytics." },
};

// field tuple: [label, type, required]
const reg = (fields, verify, approver) => ({ fields, verify, approver });

const officialReg = reg(
  [
    ["Full Name", "text", true],
    ["Official Email (nic.in / gov.in)", "email", true],
    ["Designation", "text", true],
    ["Ministry / Department / Office", "text", true],
    ["DDO Code", "text", true],
    ["PAO Code", "text", true],
    ["Mobile Number", "tel", true],
    ["Upload Signed Registration Form", "file", true],
  ],
  ["Mobile OTP", "Official-email OTP", "DSC / eSign", "Signed-form upload"],
  "Ministry **Nodal Officer** processes and approves the request."
);

const parichay = [["Parichay ID", "text"], ["Password", "password"]];

export const ROLES = [
  {
    id: "PENSIONER", label: "Pensioner / Family Pensioner", icon: "users", group: "Pensioners & Citizens",
    authTitle: "PAN / PPO Number + Aadhaar OTP", authFields: [["PAN or PPO Number", "panppo", "e.g. ABCPS1234K or PPO-2024-DEL-0098231"], ["Registered Mobile", "tel"]], otp: true,
    modules: ["ppo_view", "track_pension", "dlc_submit", "grievance_lodge", "calculators", "anubhav_share", "family_update", "account_transfer"],
    reg: reg(
      [["Full Name", "text", true], ["PPO Number", "text", true], ["Aadhaar Number", "text", true], ["Date of Birth", "date", true], ["Bank Account (for DBT)", "text", true], ["Registered Mobile", "tel", true], ["Email", "email", false]],
      ["Aadhaar OTP", "Mobile OTP", "PPO validation against the pension record"],
      "Auto-provisioned from the verified pension record — no manual approval."
    ),
  },
  {
    id: "HOO", label: "Head of Office (HOO)", icon: "briefcase", group: "Government Officials",
    authTitle: "Parichay (GoI SSO)", authFields: parichay,
    modules: ["case_workbench", "retiree_records", "family_pension", "eop", "pension_revision", "hoo_grievance", "hoo_anubhav", "hoo_utility", "dept_reports"], reg: officialReg,
  },
  {
    id: "PAO", label: "Pay & Accounts Officer (PAO)", icon: "badgeCheck", group: "Government Officials",
    authTitle: "Parichay (GoI SSO)", authFields: parichay,
    modules: ["pao_workbench", "pao_revision", "compact_export", "dept_reports"], reg: officialReg,
  },
  {
    id: "DDO", label: "Drawing & Disbursing Officer (DDO)", icon: "fileText", group: "Government Officials",
    authTitle: "Parichay (GoI SSO)", authFields: parichay,
    modules: ["retiree_records", "eis_import", "ddo_cases", "dept_reports"], reg: officialReg,
  },
  {
    id: "HOD", label: "Head of Department (HOD)", icon: "shieldCheck", group: "Government Officials",
    authTitle: "Parichay (GoI SSO)", authFields: parichay,
    modules: ["dept_reports", "hod_anubhav", "hoo_grievance"], reg: officialReg,
  },
  {
    id: "NODAL", label: "Nodal Officer", icon: "userCheck", group: "Government Officials",
    authTitle: "Parichay (GoI SSO)", authFields: parichay,
    modules: ["reg_approval", "nodal_registry", "dept_reports"],
    reg: reg(
      [["Full Name", "text", true], ["Official Email (nic.in / gov.in)", "email", true], ["Designation", "text", true], ["Ministry / Department", "text", true], ["Mobile Number", "tel", true], ["Upload Signed Nodal Officer Form", "file", true]],
      ["Official-email OTP", "Signed Nodal Officer form"],
      "**DoPPW / System Admin** onboards the Nodal Officer."
    ),
  },
  {
    id: "GRIEVANCE", label: "Grievance Officer", icon: "messageCircle", group: "Grievance & Campaign",
    authTitle: "Parichay (GoI SSO)", authFields: parichay,
    modules: ["grievance_queue", "atr", "appeals", "dept_reports"],
    reg: reg(
      [["Full Name", "text", true], ["Official Email", "email", true], ["Office / Mapping", "text", true], ["Mobile Number", "tel", true]],
      ["Official-email OTP", "Office mapping"],
      "**System Admin (NIC) / DoPPW** provisions the officer."
    ),
  },
  {
    id: "ASSOCIATION", label: "Pensioners' Association", icon: "users", group: "Grievance & Campaign",
    authTitle: "Username + Password + CAPTCHA", authFields: [["Username", "text"], ["Password", "password"], ["CAPTCHA", "text"]],
    modules: ["assoc_dashboard", "lodge_on_behalf", "assoc_members"],
    reg: reg(
      [["Association Name", "text", true], ["Registration Number", "text", true], ["Nodal Officer Name", "text", true], ["Official Contact Email", "email", true], ["Mobile Number", "tel", true], ["Upload Recognition Document", "file", true]],
      ["Mobile OTP", "Recognition document upload"],
      "**DoPPW** approves via the Nodal Officer registry."
    ),
  },
  {
    id: "DLC_ADMIN", label: "DLC Campaign Admin", icon: "fingerprint", group: "Grievance & Campaign",
    authTitle: "Mobile / Email + OTP", authFields: [["Mobile or Email", "text"]], otp: true,
    modules: ["campaign_dashboard", "camp_log", "jp_import"],
    reg: reg(
      [["Full Name", "text", true], ["Designation", "text", true], ["Mobile Number", "tel", true], ["Email", "email", true]],
      ["Mobile OTP"],
      "**Department / Campaign Admin** approves the registration."
    ),
  },
  {
    id: "ADMIN", label: "Organisation / System Admin", icon: "database", group: "Administration",
    authTitle: "Username + Password", authFields: [["Username", "text"], ["Password", "password"]],
    modules: ["user_mgmt", "masters", "mis"],
    // No self-registration — provisioned from the backend.
  },
];

// Registration excludes Organisation / System Admin (backend-provisioned).
export const REG_ROLES = ROLES.filter((r) => r.id !== "ADMIN");

export const ROLE_GROUPS = ROLES.reduce((acc, r) => {
  if (!acc.includes(r.group)) acc.push(r.group);
  return acc;
}, []);

export function getRole(id) {
  return ROLES.find((r) => r.id === id) || ROLES[0];
}
