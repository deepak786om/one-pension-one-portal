import PPOView from "./PPOView.jsx";
import TrackPension from "./TrackPension.jsx";
import DLC from "./DLC.jsx";
import Grievances from "./Grievances.jsx";
import Calculators from "./Calculators.jsx";
import Anubhav from "./Anubhav.jsx";
import FamilyNominee from "./FamilyNominee.jsx";
import TransferAccount from "./TransferAccount.jsx";
import Profile from "./Profile.jsx";
import Form6A from "./Form6A.jsx";

// keys match ROLES.PENSIONER.modules in data/rbac.js (+ "profile", "form6a")
export const PENSIONER_MODULES = {
  ppo_view: PPOView,
  track_pension: TrackPension,
  dlc_submit: DLC,
  grievance_lodge: Grievances,
  calculators: Calculators,
  anubhav_share: Anubhav,
  family_update: FamilyNominee,
  account_transfer: TransferAccount,
  profile: Profile,
  form6a: Form6A,
};

export function getPensionerModule(key) {
  return PENSIONER_MODULES[key] || null;
}
