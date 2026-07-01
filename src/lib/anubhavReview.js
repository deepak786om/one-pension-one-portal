// In-session shared store for Anubhav review actions, visible across HOO and HOD roles.
// Keyed by submission id: { flagged, hooRating, hooRemarks, hodRating, hodRemarks }
const R = {};
export function getReview(id) { return R[id] || {}; }
export function setReview(id, patch) { R[id] = { ...(R[id] || {}), ...patch }; return R[id]; }
export function toggleFlag(id) { const cur = !!getReview(id).flagged; setReview(id, { flagged: !cur }); return !cur; }
