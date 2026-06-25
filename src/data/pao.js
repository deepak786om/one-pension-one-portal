// Pay & Accounts Officer (PAO) mock data — receives sanctioned cases from HOOs.

export const PAO_OFFICE = {
  officer: "Sridevi Rao",
  designation: "Pay & Accounts Officer",
  office: "PAO (Northern Railway), New Delhi",
  code: "PAO-NR-DELHI",
  cpao: "CPAO-DELHI",
};

function hist(...rows) { return rows.map(([date, actor, action, remark]) => ({ date, actor, action, remark })); }

// status: "Pending scrutiny" | "Objection raised" | "PPO issued"
export const PAO_CASES = [
  { id: "P1", name: "Suresh Patel", pan: "SURPP1122M", hoo: "NR — Personnel Branch", type: "Superannuation",
    received: "02 Feb 2026", emoluments: 144200, qualifyingYears: 34, quarter: "No", status: "Pending scrutiny", ppo: "",
    history: hist(["02 Feb 2026", "HOO (NR Personnel)", "Case received with Forms 7 & 8", "Forwarded for sanction."]) },
  { id: "P2", name: "Mohd Arif Khan", pan: "MKHPK4456L", hoo: "MeitY — Estab.", type: "Superannuation",
    received: "28 Jan 2026", emoluments: 121800, qualifyingYears: 30, quarter: "No", status: "Pending scrutiny", ppo: "",
    history: hist(["28 Jan 2026", "HOO (MeitY)", "Case received with Forms 7 & 8", ""]) },
  { id: "P3", name: "Arjun Rao", pan: "ARJPR8890Q", hoo: "NR — Personnel Branch", type: "Superannuation",
    received: "20 Jan 2026", emoluments: 118600, qualifyingYears: 29, quarter: "No", status: "Objection raised", ppo: "",
    history: hist(
      ["20 Jan 2026", "HOO (NR Personnel)", "Case received", ""],
      ["05 Feb 2026", "You (PAO)", "Objection raised", "Qualifying-service break (2009) not condoned — returned to HOO."]) },
  { id: "P4", name: "Lakshmi Menon", pan: "LAKPM2211T", hoo: "NR — Personnel Branch", type: "Superannuation",
    received: "05 Dec 2025", emoluments: 84600, qualifyingYears: 32, quarter: "No", status: "PPO issued", ppo: "PPO-2026-DEL-0101887",
    history: hist(
      ["05 Dec 2025", "HOO (NR Personnel)", "Case received", ""],
      ["12 Jan 2026", "You (PAO)", "Scrutiny completed", "No discrepancy."],
      ["18 Jan 2026", "You (PAO)", "PPO issued", "PPO-2026-DEL-0101887 generated; SSA to bank, CPAO updated."]) },
  { id: "P5", name: "Fatima Sheikh", pan: "FATPS3322U", hoo: "DoPPW — Admin", type: "Family Pension",
    received: "30 Jan 2026", emoluments: 96000, qualifyingYears: 0, quarter: "No", status: "Pending scrutiny", ppo: "",
    history: hist(["30 Jan 2026", "HOO (DoPPW Admin)", "Family pension case received", "Death-in-service; spouse beneficiary."]) },
];

export const PAO_REVISIONS = [
  { id: "RV1", name: "P. Ramachandran", ppo: "PPO-2016-DEL-0044120", reason: "7th CPC notional fixation", old: 41000, revised: 49200, status: "Pending authority" },
  { id: "RV2", name: "S. Banerjee", ppo: "PPO-2014-DEL-0039004", reason: "Restoration of commuted portion", old: 38600, revised: 52000, status: "Authority issued" },
];

export const COMPACT_BATCH = [
  { id: "C1", name: "Lakshmi Menon", ppo: "PPO-2026-DEL-0101887", issued: "18 Jan 2026", exported: false },
  { id: "C2", name: "G. Subramaniam", ppo: "PPO-2026-DEL-0101120", issued: "10 Jan 2026", exported: false },
  { id: "C3", name: "Harpreet Kaur", ppo: "PPO-2025-DEL-0099880", issued: "22 Dec 2025", exported: true },
];

let SEQ = 102200;
export function newPPO() { SEQ += Math.floor(Math.random() * 30) + 5; return `PPO-2026-DEL-0${SEQ}`; }
