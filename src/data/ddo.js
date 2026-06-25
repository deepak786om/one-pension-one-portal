export const DDO_INFO = { officer: "Anil Kapoor", designation: "Drawing & Disbursing Officer", office: "Northern Railway — Drawing Section", code: "DDO-NR-2207" };

// employees in EIS/HRMS nearing retirement, available to pull into a pension case
export const EIS_POOL = [
  { id: "E1", name: "Vinod Gupta", pan: "VINPG9900S", designation: "Senior Section Engineer", dob: "1965-03-31", dor: "31 Mar 2027", imported: false },
  { id: "E2", name: "Sarla Devi", pan: "SARPD2010R", designation: "Office Superintendent", dob: "1964-11-30", dor: "30 Nov 2026", imported: false },
  { id: "E3", name: "Imran Ali", pan: "IMRPA7755T", designation: "Technician Gr-I", dob: "1965-06-30", dor: "30 Jun 2027", imported: false },
  { id: "E4", name: "Naveen Reddy", pan: "NAVPR4321U", designation: "Chief Clerk", dob: "1964-09-30", dor: "30 Sep 2026", imported: true },
];

export const DDO_CASES = [
  { id: "D1", name: "Naveen Reddy", forwarded: "10 Jun 2026", hoo: "NR — Personnel Branch", status: "Acknowledged by HOO" },
  { id: "D2", name: "Sarla Devi", forwarded: "—", hoo: "NR — Personnel Branch", status: "Draft (not forwarded)" },
];
