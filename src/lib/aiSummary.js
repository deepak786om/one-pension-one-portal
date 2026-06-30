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

// ---------------------------------------------------------------------------
// Generic content/grievance summaries (shared shape for AiContentInsight):
// { engineLabel, headline, reference, serviceName, statusLabel, confidence,
//   signals:[{label,value,tone}], compact:{sections:[{label,text}],text,chars},
//   highlights:[str], detailed:{ sections:[{id,title,icon,accent,body}], analytics:{confidence,meters,signals} } }
// body = string | {list:[...]} | {timeline:[{date,actor,action,remark}]}
// ---------------------------------------------------------------------------
const clampText = (secs, cap = 1000) => {
  let t = secs.map((s) => s.text).join(" ");
  return { text: t, chars: t.length };
};

export function buildAnubhavSummary(sub) {
  const innov = (sub.innovation || "").trim();
  const sugg = (sub.suggestions || "").trim();
  const lead = (sub.leadership || "").trim();
  const skills = sub.skills || [];
  const hasAward = !!(sub.award && sub.award.trim());
  const firstPara = (sub.content || "").split("\n").filter((x) => x.trim())[0] || "";
  const gist = firstPara.length > 240 ? firstPara.slice(0, 237).trim() + "…" : firstPara;
  const score = Math.min(98, 52 + (hasAward ? 14 : 0) + Math.min(18, Math.round(innov.length / 14)) + (sugg ? 9 : 0) + Math.min(8, skills.length * 2));
  const impact = score >= 80 ? "High" : score >= 62 ? "Medium" : "Emerging";
  const priority = score >= 80 ? "High" : score >= 62 ? "Medium" : "Normal";
  const reco = sub.status === "Published" ? "Published to the Anubhav portal." :
    sub.status === "Returned" ? "Returned to the author for revision." :
    sub.status === "Awaiting HOD approval" ? `Recommended by the HOO — suitable for publication; ${priority.toLowerCase()} priority.` :
    `Suitable to recommend to the HOD; ${priority.toLowerCase()} priority.`;

  const sections = [
    { label: "What it conveys", text: `${sub.author} (${sub.designation}, ${sub.ministry}) recounts ${sub.category.toLowerCase()}. ${gist}` },
    { label: "Innovation & impact", text: `${innov || "Process improvements described in the narrative."} Assessed impact: ${impact.toLowerCase()}.` },
    { label: "Suggestion to the system", text: sugg || "No specific systemic suggestion was offered." },
    { label: "Recommendation", text: reco },
  ];
  const compact = { sections, ...clampText(sections) };

  const highlights = [
    sub.category,
    `${impact} impact${hasAward ? " · awarded" : ""}`,
    skills[0] ? `Strength: ${skills[0]}` : "Practitioner account",
    sub.volunteer === "Yes" ? "Willing to volunteer further" : "Experience-sharing",
  ];
  const signals = [
    { label: "Category", value: sub.category.split(" ").slice(0, 2).join(" "), tone: "violet" },
    { label: "Innovation", value: innov ? "Present" : "Narrative", tone: innov ? "emerald" : "slate" },
    { label: "Impact", value: impact, tone: impact === "High" ? "emerald" : impact === "Medium" ? "amber" : "slate" },
    { label: "Priority", value: priority, tone: priority === "High" ? "rose" : priority === "Medium" ? "amber" : "slate" },
  ];

  const detailed = {
    sections: [
      { id: "exec", title: "Executive summary", icon: "scale", accent: "slate", body: `A ${impact.toLowerCase()}-impact experience on ${sub.category.toLowerCase()} by ${sub.author}. ${reco} Confidence ${score}%.` },
      { id: "overview", title: "What the author conveys", icon: "info", accent: "slate", body: `${gist} The account documents first-hand practice rather than theory, which is the core value of an Anubhav write-up.` },
      { id: "innovation", title: "Innovation", icon: "sparkles", accent: "cyan", body: innov || "No distinct innovation was separately highlighted; improvements are embedded in the narrative." },
      { id: "impact", title: "Impact & benefits", icon: "arrowUpRight", accent: "emerald", body: `Impact is assessed as ${impact.toLowerCase()}.${hasAward ? ` Recognised externally: ${sub.award}` : ""} The practice benefits the author's office and is transferable to similar offices.` },
      { id: "scale", title: "Scalability", icon: "activity", accent: "cyan", body: sugg ? `Scalable nationally: ${sugg}` : "Scalable to comparable offices with light adaptation." },
      { id: "lead", title: "Leadership", icon: "userCheck", accent: "violet", body: lead || "Leadership is demonstrated through the change described." },
      { id: "rec", title: "Recommendation & priority", icon: "check", accent: "emerald", body: `${reco} Suggested priority: ${priority}. Recommended action: ${sub.status === "Awaiting HOO recommendation" ? "recommend to the HOD" : sub.status === "Awaiting HOD approval" ? "publish to the portal" : "no further action"}.` },
    ],
    analytics: { confidence: score, meters: [{ label: "Impact", value: impact, pct: score, color: "#00C896" }], signals },
  };

  return { engineLabel: "Anubhav Insights Engine", headline: "Auto-generated write-up analysis", reference: sub.ref, serviceName: sub.title, statusLabel: sub.status, confidence: score, signals, compact, highlights, detailed };
}

const REPLY_BY_CAT = {
  "Non-revision of PPO": "The revised PPO under the applicable pay-commission fixation is under process; the e-PPO is expected to be issued and reflected in the bank within 15 working days.",
  "Delay in starting of pension": "The pension/family-pension authorisation is being expedited with the PAO; first credit is expected within the next disbursement cycle.",
  "CGHS facility / Medical benefits": "The matter has been taken up with the CGHS wellness centre; renewal status will be communicated on receipt of the card particulars.",
  "Non-payment of arrears": "The arrears have been re-verified and forwarded to the disbursing bank for credit; confirmation will follow on settlement.",
};
export function buildGrievanceSummary(g, ctx = {}) {
  const sla = g.sla || "";
  const slaOver = /overdue/i.test(sla);
  const slaSafe = /within|closed/i.test(sla);
  const riskLevel = slaOver ? "Critical" : (!slaSafe && /left/i.test(sla)) ? "Moderate" : "Low";
  const riskScore = riskLevel === "Critical" ? 86 : riskLevel === "Moderate" ? 50 : 18;
  const closed = /disposed|resolved|closed/i.test(g.status);
  const stage = /awaiting/i.test(g.status) ? "Awaiting pensioner clarification" : /forward/i.test(g.status) ? "With the concerned office" : closed ? "Closed" : "Under examination";
  const nextAction = closed ? "No action — the grievance has been disposed with an Action Taken Report."
    : /awaiting/i.test(g.status) ? "Follow up on the clarification sought from the pensioner."
    : /forward/i.test(g.status) ? "Track the concerned office for its Action Taken Report."
    : "Examine the case and dispose with an ATR, or forward to the concerned office.";
  const reply = g.atr || REPLY_BY_CAT[g.category] || "A reasoned reply with the action taken will be recorded on disposal.";
  const conf = closed ? 100 : riskLevel === "Critical" ? 74 : riskLevel === "Moderate" ? 84 : 92;
  const last = (g.history || [])[g.history.length - 1];

  const sections = [
    { label: "Understanding", text: `Grievance ${g.regNo} from ${g.from} concerning "${g.subject}" (${g.category}).` },
    { label: "Current status", text: `${g.status} — ${stage}. SLA: ${sla || "—"}.` },
    { label: "Action required", text: nextAction },
    { label: "Risk & recommendation", text: `SLA risk ${riskLevel.toLowerCase()}. ${closed ? "Closed appropriately." : "Prioritise disposal to remain within SLA."}` },
  ];
  const compact = { sections, ...clampText(sections) };

  const highlights = [g.category, `Lodged ${g.lodged}`, `From ${g.from}`, last ? `${last.action}` : "Awaiting first action"];
  const signals = [
    { label: "Status", value: g.status, tone: closed ? "emerald" : "amber" },
    { label: "SLA", value: sla || "—", tone: slaOver ? "rose" : slaSafe ? "emerald" : "amber" },
    { label: "Category", value: g.category.split(" ").slice(0, 2).join(" "), tone: "violet" },
    { label: "Priority", value: riskLevel === "Critical" ? "High" : riskLevel === "Moderate" ? "Medium" : "Normal", tone: riskLevel === "Critical" ? "rose" : riskLevel === "Moderate" ? "amber" : "slate" },
  ];

  const detailed = {
    sections: [
      { id: "exec", title: "Executive summary", icon: "scale", accent: "slate", body: `${g.category} grievance from ${g.from}, ${stage.toLowerCase()}. SLA risk ${riskLevel.toLowerCase()}. ${nextAction} Confidence ${conf}%.` },
      { id: "overview", title: "Overview", icon: "info", accent: "slate", body: `The pensioner reports: "${g.subject}". Registered as ${g.regNo} under the category "${g.category}", lodged on ${g.lodged}.` },
      { id: "journey", title: "Grievance journey", icon: "activity", accent: "cyan", body: { timeline: g.history || [] } },
      { id: "action", title: "Recommended action", icon: "listChecks", accent: "amber", body: nextAction },
      { id: "risk", title: "SLA & risk", icon: "shieldCheck", accent: riskLevel === "Critical" ? "rose" : "amber", body: `Service-level position: ${sla || "—"} → risk ${riskLevel.toLowerCase()}. ${slaOver ? "This case is past its SLA and should be disposed on priority." : "Dispose within the remaining window to stay compliant."}` },
      { id: "reply", title: "Suggested reply (ATR)", icon: "check", accent: "emerald", body: reply },
    ],
    analytics: { confidence: conf, meters: [{ label: "SLA risk", value: riskLevel, pct: riskScore, color: riskLevel === "Critical" ? "#FF7A59" : riskLevel === "Moderate" ? "#F6C445" : "#00C896" }], signals },
  };

  return { engineLabel: "Grievance Insights Engine", headline: "Auto-generated grievance analysis", reference: g.regNo, serviceName: g.subject, statusLabel: g.status, confidence: conf, signals, compact, highlights, detailed };
}
