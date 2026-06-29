// Universal AI case-summary engine.
// Pure, deterministic generator. Produces a COMPACT summary (≤1000 chars, the
// card) and a DETAILED payload (≤1800 chars, the slide-in panel) plus dynamic
// signal KPIs — all derived from the case data already in the application.
// Used by every HOO case detail page (Pension Cases, Family Pension, EOP, and
// any future case service).

function pct(cur, total) { return total ? Math.max(0, Math.min(100, Math.round((cur / total) * 100))) : 0; }
const shortOwner = (o) => o.replace("You (HOO)", "HOO").replace(/\s*\(rework\)/, "");

// ctx = { typeLabel, subject, why, steps:[{label,actor}], current, returned, figures:[[k,v]], missing:[..], domain, reference }
export function buildCaseSummary(ctx) {
  const steps = ctx.steps || [];
  const total = steps.length;
  const cur = Math.max(0, Math.min(ctx.current ?? 0, total));
  const completed = steps.slice(0, cur);
  const current = steps[cur] || null;
  const pending = steps.slice(cur);
  const progressPct = cur >= total ? 100 : pct(cur, total);
  const closed = cur >= total;
  const owner = closed ? "Closed" : ctx.returned ? "HOO (rework)" : (current ? current.actor : "HOO");
  const extWait = !!(current && /PAO|retiree|bank|board|external/i.test(current.actor));
  const figs = (ctx.figures || []).slice(0, 4);
  const figText = figs.length ? figs.map(([k, v]) => `${k} ${v}`).join(", ") : "key figures pending computation";

  // ---- risk ----
  const items = [];
  if (ctx.returned) items.push({ tone: "amber", text: "Returned by the PAO — correct before re-submission." });
  if ((ctx.missing || []).length) items.push({ tone: "amber", text: `${ctx.missing.length} item(s) of information still to be captured.` });
  if (extWait) items.push({ tone: "slate", text: `Current step owned by ${shortOwner(current.actor)} — depends on an external authority.` });
  if (!items.length) items.push({ tone: "emerald", text: "No blockers detected; progressing within normal timelines." });
  const level = items.some((i) => i.tone === "rose") ? "Critical" : items.some((i) => i.tone === "amber") ? "Moderate" : "Low";
  const riskScore = level === "Critical" ? 84 : level === "Moderate" ? 52 : 20;

  // ---- decision ----
  let decision, action, options;
  if (closed) { decision = "Case closed"; action = "No action — PPO issued and SSA sent to the bank."; options = ["Archive", "Issue intimation"]; }
  else if (extWait) { decision = `Monitor — awaiting ${shortOwner(current.actor)}`; action = `Track ${shortOwner(current.actor)} for "${current.label}"; escalate on SLA breach.`; options = ["Monitor", "Follow-up", "Escalate"]; }
  else if (ctx.returned) { decision = "Review & correct"; action = `Address the PAO objection and re-forward "${current ? current.label : "the case"}".`; options = ["Correct & re-forward", "Seek clarification"]; }
  else { decision = `Proceed — ${current ? current.label : "next step"}`; action = `Complete "${current ? current.label : "the next step"}" on the evidence on record, then advance.`; options = ["Verify & proceed", "Request documents", "Hold"]; }

  const priority = closed ? "Low" : extWait ? "Medium" : "High";
  const perStep = ctx.domain === "superannuation" ? 22 : 9;
  const remaining = Math.max(0, total - cur);
  const estDays = closed ? 0 : Math.max(perStep, remaining * perStep);
  const confidence = closed ? 100 : Math.max(72, 96 - items.filter((i) => i.tone !== "emerald" && i.tone !== "slate").length * 9 - (ctx.returned ? 6 : 0));
  const expectedClosure = closed ? "Closed" : estDays <= 14 ? "≤ 2 weeks" : estDays <= 45 ? "4–6 weeks" : "2–3 months";
  const nextMilestone = pending[1] ? pending[1].label : (closed ? "Closed" : "Sanction → PAO");

  // ---- COMPACT (4 short sections, target 700–900, hard cap 1000) ----
  const compact = {
    understanding: `${ctx.typeLabel} for ${ctx.subject}. ${ctx.why || "Initiated on the claim received via the portal."} On record: ${figText}.`,
    status: `Currently at "${current ? current.label : "—"}" — ${progressPct}% complete, owned by ${owner}; ${completed.length} of ${total} stages done. Next milestone: ${nextMilestone}.`,
    action: `${action}${pending[1] ? ` This precedes "${pending[1].label}".` : ""}`,
    risk: `Risk ${level.toLowerCase()} — ${items[0].text} ${decision}; priority ${priority.toLowerCase()}.`,
  };
  compact.text = `${compact.understanding} ${compact.status} ${compact.action} ${compact.risk}`;
  if (compact.text.length > 1000) { compact.understanding = `${ctx.typeLabel} for ${ctx.subject}. On record: ${figText}.`; compact.text = `${compact.understanding} ${compact.status} ${compact.action} ${compact.risk}`; }

  // ---- highlights (3–4) ----
  const highlights = [];
  if (figs[0]) highlights.push(`${figs[0][0]}: ${figs[0][1]}`);
  highlights.push(`Now at: ${current ? current.label : "Completed"}`);
  if (!closed) highlights.push(`Next: ${nextMilestone}`);
  highlights.push((ctx.missing || []).length ? (ctx.missing[0]) : "No information outstanding");

  // ---- dynamic signal KPIs (max 4, all derived) ----
  const signals = [
    { label: "Progress", value: `${progressPct}%`, tone: progressPct > 66 ? "emerald" : progressPct > 33 ? "amber" : "slate" },
    { label: "Risk", value: level, tone: level === "Critical" ? "rose" : level === "Moderate" ? "amber" : "emerald" },
    { label: "Owner", value: shortOwner(owner), tone: "violet" },
    { label: "Closure", value: expectedClosure, tone: "cyan" },
  ];

  // ---- DETAILED (panel, ≤1800) ----
  const detailed = {
    executive: `${decision}. Risk ${level.toLowerCase()}, ${progressPct}% complete, expected closure ${expectedClosure}. ${action} Confidence ${confidence}%.`,
    overview: `${ctx.typeLabel} for ${ctx.subject}. ${ctx.why || "Initiated on the claim received via the portal."} The objective is to verify entitlement, complete the statutory forms and computation, sanction, and have the PAO issue the PPO. On record: ${figText}.`,
    journey: { completed: completed.map((s) => s.label), current: current ? current.label : null, pending: pending.map((s) => s.label) },
    progress: { progressPct, owner, bottleneck: current ? current.label : "—", nextMilestone },
    pending: closed ? [] : pending.slice(0, 4).map((s, i) => ({ action: s.label, owner: shortOwner(s.actor), priority: i === 0 ? "High" : i === 1 ? "Medium" : "Normal" })),
    missing: (ctx.missing || []).slice(),
    risks: { level, score: riskScore, items },
    recommendations: { decision, action, options },
    predictions: `If the pace holds, closure is expected ${expectedClosure}${closed ? "." : ` (≈ ${estDays} working days across ${remaining} stage(s))`}. Success confidence ${confidence}%.`,
    observations: [`On record: ${figText}.`, `Next milestone: ${nextMilestone}.`],
  };
  detailed.text = [detailed.executive, detailed.overview, detailed.predictions].join(" ");

  return {
    engineLabel: "Pension Insights Engine",
    headline: closed ? "Case analysis · closed" : "Auto-generated case analysis",
    reference: ctx.reference || "—",
    serviceName: ctx.typeLabel,
    statusLabel: closed ? "Completed" : (current ? current.label : "In progress"),
    confidence, progressPct, closed,
    signals, compact, highlights, detailed,
    charCount: compact.text.length, detailedChars: detailed.text.length,
  };
}
