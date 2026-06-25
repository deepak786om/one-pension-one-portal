export const CAMPAIGN_INFO = { name: "National DLC Campaign 3.0", admin: "Priya Menon", scope: "All India" };

export const CAMPAIGN_STATS = { target: 7000000, covered: 4820000, today: 38420, camps: 1240 };

export const DLC_REGIONS = [
  { region: "North", covered: 1180000, target: 1600000 },
  { region: "South", covered: 1420000, target: 1700000 },
  { region: "East", covered: 760000, target: 1300000 },
  { region: "West", covered: 980000, target: 1500000 },
  { region: "North-East", covered: 480000, target: 900000 },
];

export const CAMPS_LOGGED = [
  { id: "C1", date: "24 Jun 2026", location: "Connaught Place, New Delhi", bank: "SBI", count: 142, operator: "R. Sharma" },
  { id: "C2", date: "23 Jun 2026", location: "T. Nagar, Chennai", bank: "Indian Bank", count: 208, operator: "K. Murthy" },
  { id: "C3", date: "23 Jun 2026", location: "Salt Lake, Kolkata", bank: "PNB", count: 96, operator: "S. Das" },
];

export const JP_IMPORTS = [
  { id: "J1", range: "01–20 Jun 2026", source: "Jeevan Pramaan API", count: 612400, date: "21 Jun 2026" },
  { id: "J2", range: "May 2026", source: "IPPB bulk", count: 884100, date: "02 Jun 2026" },
];

let SEQ = 4;
export function newCampId() { return "C" + (++SEQ); }
