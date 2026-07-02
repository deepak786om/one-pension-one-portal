import CaseWorkbench from "./CaseWorkbench.jsx";
import RetireeRecords from "./RetireeRecords.jsx";
import FamilyPension from "./FamilyPension.jsx";
import PensionRevision from "./PensionRevision.jsx";
import OfficeGrievances from "./OfficeGrievances.jsx";
import HooUtilities from "./HooUtilities.jsx";
import Reports from "./Reports.jsx";
import HooAnubhav from "./HooAnubhav.jsx";
import EopCases from "./EopCases.jsx";
import CircularHub from "./CircularHub.jsx";

export const HOO_MODULES = {
  case_workbench: CaseWorkbench,
  retiree_records: RetireeRecords,
  family_pension: FamilyPension,
  eop: EopCases,
  pension_revision: PensionRevision,
  hoo_grievance: OfficeGrievances,
  hoo_anubhav: HooAnubhav,
  circular_hub: CircularHub,
  hoo_utility: HooUtilities,
  dept_reports: Reports,
};

export function getHooModule(key) {
  return HOO_MODULES[key] || null;
}
