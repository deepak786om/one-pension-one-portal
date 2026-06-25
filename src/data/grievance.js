export const GO_INFO = { officer: "Karthik Nair", designation: "Grievance Officer", office: "DoPPW — Grievance Cell" };

function hist(...rows) { return rows.map(([date, actor, action, remark]) => ({ date, actor, action, remark })); }

// status: "Open" | "Awaiting clarification" | "Forwarded" | "Disposed"
export const GO_QUEUE = [
  { id: "Q1", regNo: "DOPPW/E/2026/0031187", from: "Anand Kumar Singh", category: "Non-revision of PPO", subject: "PPO not revised after 7th CPC", lodged: "02 May 2026", sla: "12 days left", status: "Open", atr: "",
    history: hist(["02 May 2026", "Pensioner", "Grievance lodged", "Revised PPO awaited after pay-commission fixation."]) },
  { id: "Q2", regNo: "DOPPW/E/2026/0031990", from: "Kamla Devi (via son)", category: "Delay in starting of pension", subject: "Family pension not started", lodged: "18 May 2026", sla: "5 days left", status: "Open", atr: "",
    history: hist(["18 May 2026", "Pensioner", "Grievance lodged", "Family pension not started after demise."]) },
  { id: "Q3", regNo: "DOPPW/E/2026/0030551", from: "R. Subramanian", category: "CGHS facility / Medical benefits", subject: "CGHS card not renewed", lodged: "26 Apr 2026", sla: "Overdue 1 day", status: "Awaiting clarification", atr: "",
    history: hist(["26 Apr 2026", "Pensioner", "Grievance lodged", ""], ["30 Apr 2026", "You (GO)", "Clarification sought (Action 20)", "Asked for CGHS card number."]) },
  { id: "Q4", regNo: "DOPPW/E/2026/0028841", from: "Anand Kumar Singh", category: "Non-payment of arrears", subject: "DR arrears not paid", lodged: "12 Mar 2026", sla: "Closed", status: "Disposed", atr: "Arrears of ₹6,240 verified and credited by SBI on 25 Mar 2026; grievance disposed.",
    history: hist(["12 Mar 2026", "Pensioner", "Grievance lodged", ""], ["26 Mar 2026", "You (GO)", "Disposed with reply (Action 10)", "Arrears credited."]) },
];

export const GO_APPEALS = [
  { id: "A1", regNo: "DOPPW/E/2026/0026102", from: "Anand Kumar Singh", reason: "FMA was credited for one month only; it has stopped again.", filed: "20 Feb 2026", sla: "Within SLA", status: "Pending" },
  { id: "A2", regNo: "DOPPW/E/2026/0024410", from: "T. Joseph", reason: "Resolution did not address the commutation arrears.", filed: "10 Feb 2026", sla: "Within SLA", status: "Pending" },
];

export const ACTION_CODES = [
  { code: "4A", label: "Forward to concerned office", icon: "arrowUpRight" },
  { code: "20", label: "Seek clarification", icon: "messageCircle" },
  { code: "10", label: "Dispose with reply (ATR)", icon: "check" },
];
