import DeptReports from "../common/DeptReports.jsx";
import HodAnubhav from "./HodAnubhav.jsx";
import OfficeGrievances from "../hoo/OfficeGrievances.jsx";
export const HOD_MODULES = { dept_reports: DeptReports, hod_anubhav: HodAnubhav, hoo_grievance: OfficeGrievances };
export function getHodModule(key) { return HOD_MODULES[key] || null; }
