import AssocDashboard from "./AssocDashboard.jsx";
import LodgeOnBehalf from "./LodgeOnBehalf.jsx";
import AssocMembers from "./AssocMembers.jsx";
export const ASSOCIATION_MODULES = { assoc_dashboard: AssocDashboard, lodge_on_behalf: LodgeOnBehalf, assoc_members: AssocMembers };
export function getAssociationModule(key) { return ASSOCIATION_MODULES[key] || null; }
