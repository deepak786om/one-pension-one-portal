import RegApproval from "./RegApproval.jsx";
import NodalRegistry from "./NodalRegistry.jsx";
import DeptReports from "../common/DeptReports.jsx";
export const NODAL_MODULES = { reg_approval: RegApproval, nodal_registry: NodalRegistry, dept_reports: DeptReports };
export function getNodalModule(key) { return NODAL_MODULES[key] || null; }
