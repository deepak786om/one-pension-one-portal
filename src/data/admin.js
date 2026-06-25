export const ADMIN_INFO = { name: "System Administrator", org: "NIC — DoPPW" };

export const USERS = [
  { id: "U1", name: "Rajeev Menon", role: "HOO", office: "NR — Personnel Branch", status: "Active", last: "Today" },
  { id: "U2", name: "Sridevi Rao", role: "PAO", office: "PAO-NR-DELHI", status: "Active", last: "Yesterday" },
  { id: "U3", name: "Anil Kapoor", role: "DDO", office: "NR — Drawing Section", status: "Active", last: "2 days ago" },
  { id: "U4", name: "Meera Iyer", role: "Nodal Officer", office: "Ministry of Railways", status: "Active", last: "Today" },
  { id: "U5", name: "Karthik Nair", role: "Grievance Officer", office: "DoPPW — Grievance Cell", status: "Active", last: "Today" },
  { id: "U6", name: "Priya Menon", role: "DLC Campaign Admin", office: "All India", status: "Active", last: "Today" },
  { id: "U7", name: "Old Operator", role: "DDO", office: "NR — Drawing Section", status: "Suspended", last: "40 days ago" },
];

export const ADMIN_ROLES = ["HOO", "PAO", "DDO", "HOD", "Nodal Officer", "Grievance Officer", "DLC Campaign Admin", "Association"];

export const MASTERS = {
  Ministries: ["Ministry of Railways", "Ministry of Defence", "Ministry of Home Affairs", "MeitY", "Department of Posts"],
  Banks: ["State Bank of India", "Punjab National Bank", "Bank of Baroda", "Canara Bank", "India Post Payments Bank"],
  "Grievance categories": ["Non-revision of PPO", "Non-payment of arrears", "FMA", "CGHS / Medical", "Delay in starting pension"],
  Offices: ["NR — Personnel Branch", "PAO-NR-DELHI", "DoPPW — Admin", "MeitY — Estab."],
};

export const SYS_MIS = { pensioners: 1284500, cases: 41, grievances: 9, dlcToday: 38420, activeUsers: 6, ppoIssued: 27 };
