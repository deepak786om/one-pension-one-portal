// Cross-role in-app store for Form 6A entries returned by the HOO to the retiree.
// The portal has one role logged in at a time (no backend), so this module-level
// store lets the HOO write a "return with remark" that the Pensioner (retiree)
// screen can then read and act on. Persisted to localStorage so it survives a
// reload / role switch.
const KEY = "opop_form6a_returns";

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
}
function save(v) {
  try { v ? localStorage.setItem(KEY, JSON.stringify(v)) : localStorage.removeItem(KEY); } catch { /* ignore */ }
}

let current = load();

// payload: { caseId, name, at, by, items: [{ label, remark }] }
export function setForm6aReturn(payload) { current = payload; save(current); }
export function getForm6aReturn() { return current; }
export function clearForm6aReturn() { current = null; save(null); }
