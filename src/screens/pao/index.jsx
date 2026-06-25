import PaoWorkbench from "./PaoWorkbench.jsx";
import PaoRevision from "./PaoRevision.jsx";
import CompactExport from "./CompactExport.jsx";
import DeptReports from "../common/DeptReports.jsx";
export const PAO_MODULES = { pao_workbench: PaoWorkbench, pao_revision: PaoRevision, compact_export: CompactExport, dept_reports: DeptReports };
export function getPaoModule(key) { return PAO_MODULES[key] || null; }
