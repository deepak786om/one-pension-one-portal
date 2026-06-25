// Central role → module / dashboard wiring.
import { getPensionerModule } from "./pensioner/index.jsx";
import { getHooModule } from "./hoo/index.jsx";
import { getPaoModule } from "./pao/index.jsx";
import { getDdoModule } from "./ddo/index.jsx";
import { getHodModule } from "./hod/index.jsx";
import { getNodalModule } from "./nodal/index.jsx";
import { getGrievanceModule } from "./grievance/index.jsx";
import { getAssociationModule } from "./association/index.jsx";
import { getDlcAdminModule } from "./dlc/index.jsx";
import { getAdminModule } from "./admin/index.jsx";

import { HOO_OFFICE, RETIREES, HOO_GRIEVANCES } from "../data/hoo.js";
import { PAO_OFFICE, PAO_CASES, COMPACT_BATCH } from "../data/pao.js";
import { DDO_INFO, EIS_POOL, DDO_CASES } from "../data/ddo.js";
import { HOD_INFO, HOD_ANUBHAV } from "../data/hod.js";
import { NODAL_INFO, REG_REQUESTS, NODAL_REGISTRY } from "../data/nodal.js";
import { GO_INFO, GO_QUEUE, GO_APPEALS } from "../data/grievance.js";
import { ASSOC_INFO, ASSOC_MEMBERS, ASSOC_GRIEVANCES } from "../data/association.js";
import { CAMPAIGN_INFO, CAMPAIGN_STATS } from "../data/dlc_admin.js";
import { ADMIN_INFO, USERS, ADMIN_ROLES } from "../data/admin.js";

const RESOLVERS = {
  PENSIONER: getPensionerModule,
  HOO: getHooModule,
  PAO: getPaoModule,
  DDO: getDdoModule,
  HOD: getHodModule,
  NODAL: getNodalModule,
  GRIEVANCE: getGrievanceModule,
  ASSOCIATION: getAssociationModule,
  DLC_ADMIN: getDlcAdminModule,
  ADMIN: getAdminModule,
};

export function getModuleForRole(roleId, key) {
  const r = RESOLVERS[roleId];
  return r ? r(key) : null;
}

export function roleHeader(roleId) {
  switch (roleId) {
    case "HOO": return { welcome: HOO_OFFICE.officer, subtitle: `${HOO_OFFICE.office} · ${HOO_OFFICE.code}` };
    case "PAO": return { welcome: PAO_OFFICE.officer, subtitle: `${PAO_OFFICE.office} · ${PAO_OFFICE.code}` };
    case "DDO": return { welcome: DDO_INFO.officer, subtitle: `${DDO_INFO.office} · ${DDO_INFO.code}` };
    case "HOD": return { welcome: HOD_INFO.officer, subtitle: HOD_INFO.department };
    case "NODAL": return { welcome: NODAL_INFO.officer, subtitle: NODAL_INFO.ministry };
    case "GRIEVANCE": return { welcome: GO_INFO.officer, subtitle: GO_INFO.office };
    case "ASSOCIATION": return { welcome: ASSOC_INFO.name, subtitle: ASSOC_INFO.regNo };
    case "DLC_ADMIN": return { welcome: CAMPAIGN_INFO.admin, subtitle: `${CAMPAIGN_INFO.name} · ${CAMPAIGN_INFO.scope}` };
    case "ADMIN": return { welcome: ADMIN_INFO.name, subtitle: ADMIN_INFO.org };
    default: return null;
  }
}

const k = (label, value, sub, icon, tone) => ({ label, value, sub, icon, tone });

export function roleSummary(roleId) {
  switch (roleId) {
    case "HOO": return [
      k("Retiring cases", RETIREES.filter((r) => r.stage < 6).length, "in pipeline", "briefcase", "primary"),
      k("Awaiting PPO", RETIREES.filter((r) => !r.ppo && r.stage >= 4).length, "with PAO", "badgeCheck", "saffron"),
      k("Office grievances", HOO_GRIEVANCES.filter((g) => g.status === "Open").length, "open", "messageCircle", "primary"),
      k("PPOs issued", RETIREES.filter((r) => r.ppo).length, "this year", "check", "success"),
    ];
    case "PAO": return [
      k("Pending scrutiny", PAO_CASES.filter((c) => c.status === "Pending scrutiny").length, "to action", "listChecks", "saffron"),
      k("Objections", PAO_CASES.filter((c) => c.status === "Objection raised").length, "returned", "repeat", "primary"),
      k("PPOs issued", PAO_CASES.filter((c) => c.ppo).length, "this year", "badgeCheck", "success"),
      k("Ready to export", COMPACT_BATCH.filter((c) => !c.exported).length, "to CPAO", "database", "primary"),
    ];
    case "DDO": return [
      k("EIS pool", EIS_POOL.length, "nearing retirement", "database", "primary"),
      k("Imported", EIS_POOL.filter((e) => e.imported).length, "cases created", "check", "success"),
      k("Forwarded", DDO_CASES.filter((c) => !c.status.includes("Draft")).length, "to HOO", "arrowUpRight", "saffron"),
      k("Drafts", DDO_CASES.filter((c) => c.status.includes("Draft")).length, "to forward", "fileText", "primary"),
    ];
    case "HOD": return [
      k("Anubhav to review", HOD_ANUBHAV.filter((a) => a.status === "Awaiting HOD").length, "recommendations", "bookOpen", "saffron"),
      k("Live cases", RETIREES.filter((r) => r.stage < 6).length, "department-wide", "briefcase", "primary"),
      k("Office grievances", HOO_GRIEVANCES.filter((g) => g.status === "Open").length, "open", "messageCircle", "primary"),
      k("Published", HOD_ANUBHAV.filter((a) => a.status === "Published").length, "on Anubhav", "check", "success"),
    ];
    case "NODAL": return [
      k("Pending requests", REG_REQUESTS.filter((r) => r.status === "Pending").length, "to approve", "listChecks", "saffron"),
      k("Approved", REG_REQUESTS.filter((r) => r.status === "Approved").length, "onboarded", "check", "success"),
      k("Registry", NODAL_REGISTRY.length, "officials & bodies", "users", "primary"),
      k("Active", NODAL_REGISTRY.filter((r) => r.status === "Active").length, "in registry", "badgeCheck", "primary"),
    ];
    case "GRIEVANCE": return [
      k("Open", GO_QUEUE.filter((g) => g.status === "Open").length, "in queue", "listChecks", "saffron"),
      k("Overdue", GO_QUEUE.filter((g) => g.sla.includes("Overdue")).length, "past SLA", "info", "saffron"),
      k("Appeals", GO_APPEALS.filter((a) => a.status === "Pending").length, "to decide", "scale", "primary"),
      k("Disposed", GO_QUEUE.filter((g) => g.status === "Disposed").length, "with ATR", "check", "success"),
    ];
    case "ASSOCIATION": return [
      k("Members", ASSOC_MEMBERS.length, `${ASSOC_MEMBERS.filter((m) => m.status === "Active").length} active`, "users", "primary"),
      k("Grievances", ASSOC_GRIEVANCES.length, "on behalf", "messageCircle", "saffron"),
      k("Pending", ASSOC_GRIEVANCES.filter((g) => g.status !== "Resolved").length, "in progress", "listChecks", "primary"),
      k("Disposed", ASSOC_GRIEVANCES.filter((g) => g.status === "Resolved").length, "resolved", "check", "success"),
    ];
    case "DLC_ADMIN": {
      const pct = Math.round((CAMPAIGN_STATS.covered / CAMPAIGN_STATS.target) * 100);
      return [
        k("Coverage", pct + "%", "of target", "activity", "success"),
        k("DLCs today", CAMPAIGN_STATS.today.toLocaleString("en-IN"), "submitted", "fingerprint", "primary"),
        k("Camps", CAMPAIGN_STATS.camps.toLocaleString("en-IN"), "nationwide", "mapPin", "saffron"),
        k("Pending", (CAMPAIGN_STATS.target - CAMPAIGN_STATS.covered).toLocaleString("en-IN"), "to cover", "listChecks", "primary"),
      ];
    }
    case "ADMIN": return [
      k("Users", USERS.length, "provisioned", "users", "primary"),
      k("Active", USERS.filter((u) => u.status === "Active").length, "signed-in roles", "check", "success"),
      k("Suspended", USERS.filter((u) => u.status === "Suspended").length, "blocked", "info", "saffron"),
      k("Roles", ADMIN_ROLES.length, "in RBAC", "shieldCheck", "primary"),
    ];
    default: return null;
  }
}
