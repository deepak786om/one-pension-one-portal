import UserMgmt from "./UserMgmt.jsx";
import Masters from "./Masters.jsx";
import Mis from "./Mis.jsx";
export const ADMIN_MODULES = { user_mgmt: UserMgmt, masters: Masters, mis: Mis };
export function getAdminModule(key) { return ADMIN_MODULES[key] || null; }
