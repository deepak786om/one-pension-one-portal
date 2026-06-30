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
      "Over the last five years of my service I led a paperless overhaul of the pension sanction process in the division, and I want to set down honestly both what we changed and what it cost us to get there. " +
      "When I joined the personnel branch, a single pension case moved physically between six desks — the dealing assistant, the section officer, the bill clerk, the establishment officer, the Head of Office and finally the despatch desk — and routinely took ninety days to reach the Pay & Accounts Office. Files were carried by hand, registers were maintained in triplicate, and at least one case in ten was either misplaced or returned for a trivial reason such as a missing initial.\n\n" +
      "My first step was simply to watch and measure, without changing anything, for six weeks. I mapped every hand-off on a single sheet of brown paper and timed how long a case actually waited at each desk versus how long it was actively worked on. The truth was uncomfortable: of the ninety days, fewer than four were spent doing real work; the rest was waiting. Three of the six approvals were confirming what an earlier desk had already confirmed.\n\n" +
      "With that evidence I proposed a shared digital case-file so that Forms 7 and 8 were computed once, at the start, and then reused at every subsequent stage rather than re-entered. I removed the three redundant approvals after getting written agreement from each desk that they were duplicating a check. We piloted the new flow on twenty live cases, measured the cycle-time honestly against a control group, and only then scaled it across the whole division.\n\n" +
      "The result was that the average case now reaches the PAO in forty-two days instead of ninety, no case has been lost in transit in the last two years, and the dealing assistants — who had feared the change would expose them — became its strongest defenders because it removed the drudgery they hated most. I am most proud that the improvement survived my own transfer out of the section, which to me is the real test of whether a reform was built properly.",
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
      "Much of our correspondence with pensioners went out in English, which many of our older pensioners — and a fair number who had retired from non-clerical posts — could not read comfortably. " +
      "I would watch elderly visitors hand our carefully drafted letters to a younger relative or to whoever in the queue could read English, and it struck me that a letter that cannot be read with dignity is not really a reply at all.\n\n" +
      "I did not have the authority to change office policy, so I started small. I set up an informal peer-mentoring circle: staff who were fluent in Malayalam, Tamil and Hindi sat with colleagues for half an hour a week and helped them draft clear, respectful replies in the pensioner's own language. We were careful never to make anyone feel that their language skills were lacking; the framing was always that we were learning from each other.\n\n" +
      "To make it stick beyond enthusiasm, we built a shared glossary of the commonest pension terms — commutation, dearness relief, life certificate, family pension — in three regional languages, agreed on the most respectful phrasing for difficult letters, and kept a folder of model replies that any desk could adapt.\n\n" +
      "Over two years this stopped being a special project and simply became how the office worked. The quality of our regional-language correspondence improved across every desk, complaints about 'not understanding the letter' fell away almost entirely, and several pensioners wrote back to say it was the first time a government office had written to them in their own tongue. The glossary and model-reply folder are still in daily use, which matters more to me than any single letter we sent.",
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
      "Most days our reception was crowded with pensioners who had travelled long distances only to ask one simple question: where has my case reached? " +
      "They would wait an hour for a two-minute answer, and the front-desk clerk spent most of the day repeating the same three replies instead of helping people with genuinely difficult problems.\n\n" +
      "I proposed a simple self-service touch-screen kiosk in the reception where a pensioner could enter a PPO or case number and immediately see three things: the current stage of the case, the expected PPO date, and any documents still pending from their side. " +
      "I deliberately kept it to those three questions, because they accounted for the overwhelming majority of footfall, and a tool that does three things reliably is worth more than one that does twenty things confusingly.\n\n" +
      "Rather than ask for a budget I could not justify, I re-used an old monitor that was gathering dust in the store and a low-cost mini-computer, so the kiosk cost almost nothing to set up. I convinced a reluctant administration to try it for just one month before deciding, on the understanding that if it did not help we would quietly remove it.\n\n" +
      "Within that month the queue at the front desk visibly shortened, the clerk was freed to handle the complicated cases that genuinely needed a human, and — to my quiet satisfaction — several elderly visitors who had been nervous about a touch-screen were soon showing newer visitors how to use it. The administration not only kept it but asked whether a second unit could be placed at the divisional office.",
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
    content:
      "For years our monthly account closure was a source of quiet dread in the unit. " +
      "Mismatches between the pension payment scrolls, the bank's debit advice and our own ledgers would surface only at the end of the month, and we would lose three or four working days every cycle hunting for errors that had crept in weeks earlier.\n\n" +
      "I sat down and traced where the mismatches actually originated, and found that nearly all of them came from a handful of recurring causes — a wrong head of account, a transposed figure, a missing recovery entry. " +
      "From that I designed a one-page reconciliation checklist that the dealing accountant completes at each stage rather than at month-end, so that an error is caught the day it is made instead of three weeks later.\n\n" +
      "To remove human drudgery I also automated the recurring reconciliation in a spreadsheet that flagged mismatches instantly, in red, the moment figures were entered. " +
      "I then trained the whole unit on the checklist, because a control that only one person understands is a single point of failure.\n\n" +
      "The checklist was adopted as a divisional standard, our monthly closure moved to a near zero-defect state, and the unit was recognised as the Best Accounts Unit in 2022. More importantly, the month-end panic simply disappeared, and the staff got their evenings back during closing week.",
    innovation: "Automated the recurring reconciliation in a spreadsheet that flagged mismatches instantly.",
    award: "Best Accounts Unit, 2022.",
    leadership: "Trained the whole unit on the new checklist.",
    skills: ["Accounting", "Attention to detail", "Automation"],
    suggestions: "The checklist could be built into the accounting software itself.",
    volunteer: "Yes", feedbackEmail: "Yes",
  },
];
