import Icon from "../../lib/icons.jsx";
import { SectionCard, InfoRow, StatusPill } from "../../components/ui/kit.jsx";

function Block({ title, children }) {
  if (!children) return null;
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{title}</div>
      <p className="mt-1.5 whitespace-pre-line rounded-xl bg-muted/30 p-3.5 text-sm leading-relaxed text-foreground">{children}</p>
    </div>
  );
}

// Full read-only view of everything the pensioner shared in their Anubhav write-up.
export default function AnubhavDetail({ sub }) {
  const tone = sub.status === "Published" ? "ok" : sub.status === "Returned" ? "warn" : undefined;
  return (
    <>
      <SectionCard title="Submitted by" desc="Identity and service details, auto-pulled from the pensioner's profile." icon="userCheck">
        <div className="flex items-start gap-4">
          <div className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-light text-2xl font-black text-white shadow-soft">
            {sub.author.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </div>
          <div className="grid flex-1 gap-x-8 sm:grid-cols-2">
            <InfoRow label="Name" value={sub.author} />
            <InfoRow label="Designation" value={sub.designation} />
            <InfoRow label="Ministry / Dept." value={sub.ministry} />
            <InfoRow label="Office" value={sub.office} />
            <InfoRow label="PAN" value={sub.pan} />
            <InfoRow label="PPO" value={sub.ppo} />
          </div>
        </div>
        {!sub.photo && <p className="mt-3 text-xs text-muted-foreground"><Icon name="info" size={12} className="mr-1 inline text-primary" /> No photograph was uploaded with this write-up.</p>}
      </SectionCard>

      <SectionCard title={sub.title} desc={`${sub.category} · submitted ${sub.date}`} icon="bookOpen"
        action={<StatusPill tone={tone}>{sub.status}</StatusPill>}>
        <div className="grid gap-x-8 sm:grid-cols-3">
          <InfoRow label="Reference" value={<span className="font-mono">{sub.ref}</span>} />
          <InfoRow label="Category" value={sub.category} />
          <InfoRow label="Submitted on" value={sub.date} />
        </div>
        <div className="mt-4 space-y-4">
          <Block title="The Anubhav (experience highlighted)">{sub.content}</Block>
          <Block title="Innovation / exceptional work">{sub.innovation}</Block>
          <Block title="Awards / medals / certificates">{sub.award}</Block>
          <Block title="Leadership qualities">{sub.leadership}</Block>
          {sub.skills && sub.skills.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Skills</div>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {sub.skills.map((s) => <span key={s} className="rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">{s}</span>)}
              </div>
            </div>
          )}
          <Block title="Suggestions to improve the line of work">{sub.suggestions}</Block>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm">
              <span className="text-muted-foreground">Willing to volunteer for social work</span>
              <span className={"font-bold " + (sub.volunteer === "Yes" ? "text-success" : "text-muted-foreground")}>{sub.volunteer}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm">
              <span className="text-muted-foreground">Receive feedback by email</span>
              <span className={"font-bold " + (sub.feedbackEmail === "Yes" ? "text-success" : "text-muted-foreground")}>{sub.feedbackEmail}</span>
            </div>
          </div>
        </div>
      </SectionCard>
    </>
  );
}
