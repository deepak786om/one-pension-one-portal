export const ASSOC_INFO = { name: "Pensioners' Welfare Association, Delhi", regNo: "PWA/DEL/2009/0471", nodal: "Verified by DoPPW Nodal" };

export const ASSOC_MEMBERS = [
  { id: "M1", name: "Anand Kumar Singh", ppo: "PPO-2024-DEL-0098231", mobile: "+91 98xxx xx210", status: "Active" },
  { id: "M2", name: "R. Subramanian", ppo: "PPO-2018-DEL-0061120", mobile: "+91 99xxx xx441", status: "Active" },
  { id: "M3", name: "Harpreet Kaur", ppo: "PPO-2025-DEL-0099880", mobile: "+91 97xxx xx889", status: "Active" },
  { id: "M4", name: "T. Joseph", ppo: "PPO-2016-DEL-0048810", mobile: "+91 96xxx xx012", status: "Lapsed" },
];

export const ASSOC_GRIEVANCES = [
  { id: "AG1", regNo: "DOPPW/E/2026/0030551", member: "R. Subramanian", subject: "CGHS card not renewed", lodged: "26 Apr 2026", status: "In progress" },
  { id: "AG2", regNo: "DOPPW/E/2026/0027330", member: "Harpreet Kaur", subject: "Pension revision pending", lodged: "14 Mar 2026", status: "Resolved" },
];

export const ASSOC_CATEGORIES = ["Non-revision of PPO", "Non-payment of arrears", "CGHS facility / Medical benefits", "Delay in starting of pension", "Other"];

let SEQ = 31500;
export function newRegNo() { SEQ += Math.floor(Math.random() * 30) + 7; return `DOPPW/E/2026/00${SEQ}`; }
