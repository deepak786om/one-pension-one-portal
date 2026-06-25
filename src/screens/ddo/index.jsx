import RetireeRecords from "../hoo/RetireeRecords.jsx";
import EisImport from "./EisImport.jsx";
import DdoCases from "./DdoCases.jsx";
import DeptReports from "../common/DeptReports.jsx";
export const DDO_MODULES = { retiree_records: RetireeRecords, eis_import: EisImport, ddo_cases: DdoCases, dept_reports: DeptReports };
export function getDdoModule(key) { return DDO_MODULES[key] || null; }
