import GrievanceQueue from "./GrievanceQueue.jsx";
import Atr from "./Atr.jsx";
import Appeals from "./Appeals.jsx";
import DeptReports from "../common/DeptReports.jsx";
export const GRIEVANCE_MODULES = { grievance_queue: GrievanceQueue, atr: Atr, appeals: Appeals, dept_reports: DeptReports };
export function getGrievanceModule(key) { return GRIEVANCE_MODULES[key] || null; }
