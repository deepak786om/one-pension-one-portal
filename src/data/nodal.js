export const NODAL_INFO = { officer: "Meera Iyer", designation: "Nodal Officer", ministry: "Ministry of Railways" };

function hist(...rows) { return rows.map(([date, actor, action, remark]) => ({ date, actor, action, remark })); }

// official registration requests awaiting the Nodal Officer's approval
export const REG_REQUESTS = [
  { id: "G1", name: "Rohit Verma", role: "Head of Office (HOO)", email: "rohit.verma@nic.in", office: "NR — Personnel Branch", ddo: "DDO-NR-2210", pao: "PAO-NR-DELHI", submitted: "20 Jun 2026", status: "Pending",
    checks: { "Mobile OTP": true, "Official-email OTP": true, "Signed form": true, "DSC / eSign": false },
    history: hist(["20 Jun 2026", "Applicant", "Registration submitted", "HOO role requested with signed form."]) },
  { id: "G2", name: "Sunita Rao", role: "Drawing & Disbursing Officer (DDO)", email: "sunita.rao@gov.in", office: "NR — Accounts", ddo: "DDO-NR-2211", pao: "PAO-NR-DELHI", submitted: "22 Jun 2026", status: "Pending",
    checks: { "Mobile OTP": true, "Official-email OTP": true, "Signed form": true, "DSC / eSign": true },
    history: hist(["22 Jun 2026", "Applicant", "Registration submitted", ""]) },
  { id: "G3", name: "Pensioners' Welfare Assn., Delhi", role: "Pensioners' Association", email: "contact@pwadelhi.org", office: "Recognised Association", ddo: "—", pao: "—", submitted: "12 Jun 2026", status: "Approved",
    checks: { "Mobile OTP": true, "Recognition document": true },
    history: hist(["12 Jun 2026", "Applicant", "Registration submitted", ""], ["14 Jun 2026", "You (Nodal)", "Approved", "Recognition verified; added to registry."]) },
];

export const NODAL_REGISTRY = [
  { id: "N1", name: "Rajeev Menon", role: "Head of Office (HOO)", office: "NR — Personnel Branch", status: "Active" },
  { id: "N2", name: "Sridevi Rao", role: "Pay & Accounts Officer (PAO)", office: "PAO-NR-DELHI", status: "Active" },
  { id: "N3", name: "Anil Kapoor", role: "Drawing & Disbursing Officer (DDO)", office: "NR — Drawing Section", status: "Active" },
  { id: "N4", name: "Pensioners' Welfare Assn., Delhi", role: "Association", office: "Recognised body", status: "Active" },
  { id: "N5", name: "Old DDO (transferred)", role: "Drawing & Disbursing Officer (DDO)", office: "NR — Drawing Section", status: "Suspended" },
];
