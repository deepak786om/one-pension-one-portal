import CampaignDashboard from "./CampaignDashboard.jsx";
import CampLog from "./CampLog.jsx";
import JpImport from "./JpImport.jsx";
export const DLC_ADMIN_MODULES = { campaign_dashboard: CampaignDashboard, camp_log: CampLog, jp_import: JpImport };
export function getDlcAdminModule(key) { return DLC_ADMIN_MODULES[key] || null; }
