// Full Anubhav submissions as shared by the pensioner — reviewed by HOO then HOD.
// status flow: "Awaiting HOO recommendation" -> "Awaiting HOD approval" -> "Published" (or "Returned")

export const ANUBHAV_SUBMISSIONS = [
  {
    id: "AN1", ref: "ANB-2026-4471", date: "18 Jun 2026", status: "Awaiting HOD approval",
    author: "Anand Kumar Singh", designation: "Senior Section Engineer", ministry: "Ministry of Railways",
    pan: "ABCPS1234K", ppo: "PPO-2024-DEL-0098231", office: "NR — Personnel Branch", photo: true,
    category: "Government process re-engineering",
    title: "Re-engineering the pension sanction workflow",
    content:
      "Over my last five years of service I led a paperless overhaul of the pension sanction process in the division. " +
      "When I joined the personnel branch, a single pension case moved physically between six desks and routinely took ninety days to reach the Pay & Accounts Office.\n\n" +
      "I mapped every hand-off, removed three redundant approvals, and introduced a shared digital case-file so that Forms 7 and 8 were computed once and reused. " +
      "We piloted it on twenty cases, measured the cycle-time honestly, and then scaled it across the division. The average case now reaches the PAO in forty-two days, and no case is lost in transit.",
    innovation:
      "Designed a one-page reconciliation checklist that the dealing assistant completes before a case leaves the office, which cut PAO objections by nearly two-thirds.",
    award: "Divisional Railway Manager's commendation, 2023, for process improvement.",
    leadership:
      "Mentored four dealing assistants through the transition and ran weekly fifteen-minute reviews so the team owned the new process rather than having it imposed on them.",
    skills: ["Process re-engineering", "Team mentoring", "Data-driven decisions", "Stakeholder management"],
    suggestions:
      "A standard digital case-file format should be mandated nationally so that every division speaks the same language to its PAO, and objection reasons should be coded so they can be analysed.",
    volunteer: "Yes", feedbackEmail: "Yes",
  },
  {
    id: "AN2", ref: "ANB-2026-4488", date: "20 Jun 2026", status: "Awaiting HOD approval",
    author: "Lakshmi Menon", designation: "Office Superintendent", ministry: "Ministry of Railways",
    pan: "LAKPM2211T", ppo: "PPO-2026-DEL-0101887", office: "NR — Personnel Branch", photo: false,
    category: "Development of personal traits while in service",
    title: "Mentoring translators for regional outreach",
    content:
      "Much of our correspondence with pensioners was in English, which many of our older pensioners could not read comfortably. " +
      "I set up a small peer-mentoring circle where staff fluent in regional languages helped others draft clear, respectful replies.\n\n" +
      "Over two years this became an office habit rather than a special project, and the quality of our regional-language correspondence improved across every desk.",
    innovation: "Built a shared glossary of pension terms in three regional languages that new staff still use.",
    award: "",
    leadership: "Led by example and quietly, never making anyone feel that their language skills were lacking.",
    skills: ["Mentoring", "Communication", "Empathy", "Knowledge-sharing"],
    suggestions: "Regional-language templates for the commonest pensioner letters should be made available centrally.",
    volunteer: "Yes", feedbackEmail: "No",
  },
  {
    id: "AN3", ref: "ANB-2026-4502", date: "22 Jun 2026", status: "Awaiting HOO recommendation",
    author: "Suresh Patel", designation: "Section Officer", ministry: "Ministry of Railways",
    pan: "SURPP1122M", ppo: "(pre-PPO)", office: "NR — Personnel Branch", photo: false,
    category: "Innovation / exceptional work",
    title: "A self-service kiosk for pensioner queries",
    content:
      "I proposed and helped commission a simple touch-screen kiosk in the office reception where visiting pensioners could check their case status without waiting in a queue.\n\n" +
      "It handled the three most common questions — case stage, expected PPO date, and the documents still pending — and freed the front desk to handle the genuinely difficult cases.",
    innovation: "Re-used an old monitor and a low-cost mini-PC, so the kiosk cost almost nothing to set up.",
    award: "",
    leadership: "Convinced a reluctant administration to try it for a month before deciding.",
    skills: ["Innovation", "Frugal engineering", "Citizen service"],
    suggestions: "Such kiosks could be standardised and placed in every divisional office.",
    volunteer: "No", feedbackEmail: "Yes",
  },
  {
    id: "AN4", ref: "ANB-2026-4310", date: "02 May 2026", status: "Published",
    author: "G. Subramaniam", designation: "Accounts Officer", ministry: "Ministry of Railways",
    pan: "GSUBR9087P", ppo: "PPO-2026-DEL-0101120", office: "PAO-NR-DELHI", photo: false,
    category: "Accounts",
    title: "Zero-defect accounts reconciliation",
    content: "I designed a reconciliation checklist that was adopted as a divisional standard and brought our monthly account closure to a near zero-defect state.",
    innovation: "Automated the recurring reconciliation in a spreadsheet that flagged mismatches instantly.",
    award: "Best Accounts Unit, 2022.",
    leadership: "Trained the whole unit on the new checklist.",
    skills: ["Accounting", "Attention to detail", "Automation"],
    suggestions: "The checklist could be built into the accounting software itself.",
    volunteer: "Yes", feedbackEmail: "Yes",
  },
];
