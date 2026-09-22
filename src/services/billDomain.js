// Domain knowledge base and roleplay personas for BILL.com Account Executives in the Accounting Channel
// ICP: Accounting / CAS Firms & Property Management Firms (<= 25 employees)

export const BILL_BATTLECARDS = [
  {
    id: 'qbo-billpay',
    title: 'QuickBooks Bill Pay vs. BILL',
    trigger: 'We already use QuickBooks / QBO Bill Pay',
    wedge: 'QBO Bill Pay is basic payment routing without multi-tiered approval policies, client collaboration portals, or multi-entity management.',
    talkTrack: [
      '"QuickBooks is the gold standard for general ledger, but most firm partners tell us QBO Bill Pay breaks down once you have multiple clients or non-accountants who need to approve bills."',
      '"With BILL, your clients get their own secure portal on mobile or web to approve invoices with 1 click—without ever needing a costly QuickBooks license or access to your books."',
      '"Plus, BILL gives you multi-tiered approvals, ACH, international wires, and vendor choice, with full 2-way sync so you never enter data twice."'
    ],
    prospectDoubt: 'Why pay for another tool when QBO is already included?'
  },
  {
    id: 'paper-checks',
    title: 'Clients Prefer Paper Checks',
    trigger: 'Our clients are old-school and insist on paper checks',
    wedge: 'Check fraud is up 385% nationally. Writing paper checks forces your staff to print, sign, stuff envelopes, and buy stamps.',
    talkTrack: [
      '"Totally understand—a lot of clients feel that check-in-hand equals control."',
      '"What many partners do with BILL is keep the check option, but let BILL print and mail the check on your behalf with dual-control digital approval signatures."',
      '"The client still \'approves\' the check, but your team never touches MICR toner, paper stock, or envelopes again, and your firm\'s bank account number is shielded from fraud."'
    ],
    prospectDoubt: 'My older clients will push back on change.'
  },
  {
    id: 'w9-1099',
    title: 'W-9 Chasing & 1099 Chaos',
    trigger: 'We dread January 1099 season / chasing subcontractors for W-9s',
    wedge: 'Collecting W-9s after payment is near-impossible. BILL requests and verifies W-9s digitally BEFORE payments are released, then does 1-click 1099 e-filing.',
    talkTrack: [
      '"How many hours did your team spend this past January tracking down missing TINs and addresses for 1099-NECs?"',
      '"With BILL, when a new vendor or contractor is added, the system automatically sends a secure portal link requesting their W-9 and banking info before their first invoice is paid."',
      '"Come January, your 1099-MISC and 1099-NEC reports are already compiled with verified TINs, and you can e-file directly to the IRS and state in minutes."'
    ],
    prospectDoubt: 'Does it sync with our tax software / ledger?'
  },
  {
    id: 'divvy-spend',
    title: 'Divvy Spend & Expense Cards',
    trigger: 'We don\'t need spend management / staff just use company credit cards',
    wedge: 'Traditional cards have no pre-spend controls; staff share cards or submit crumpled receipts weeks later.',
    talkTrack: [
      '"In property management and accounting, sharing one physical card or reimbursing personal cards is a recipe for budget overruns and lost receipts."',
      '"With BILL Spend & Expense (formerly Divvy), you issue smart corporate cards with enforceable real-time budgets—e.g. $500/month for property maintenance."',
      '"When a tech or team member swipes, they get a text asking for a receipt photo on the spot, and it automatically categorizes and syncs to QuickBooks without expense reports."'
    ],
    prospectDoubt: 'Is it hard to set up? Do we have to pay extra for the cards?'
  },
  {
    id: 'send-email',
    title: '"Just Send Me An Email" Brush-Off',
    trigger: 'Can you just send me an email?',
    wedge: 'Permission-based pivot to qualify which pain point matters before sending generic collateral.',
    talkTrack: [
      '"I can definitely do that, Bob. I have a 1-page overview specifically for accounting practices your size."',
      '"So I don\'t flood your inbox with generic info—are you currently spending more time chasing client approval signatures, or is the upcoming 1099/W-9 crunch the bigger headache?"',
      '"(If they answer): Got it. That\'s exactly what we help streamline. Let\'s do this: take a look at the 1-page summary, and could we grab just 10 minutes this Thursday morning to see if it\'s worth exploring?"'
    ],
    prospectDoubt: 'I just want to get you off the phone.'
  }
];

export const SCENARIOS = [
  // COLD CALLS - GATEKEEPER
  {
    id: 'cc-gk-easy',
    type: 'cold-call',
    targetRole: 'gatekeeper',
    difficulty: 'easy',
    title: 'Friendly Practice Coordinator (Accounting Firm)',
    firmName: 'Apex Accounting & Tax Partners',
    firmType: 'Accounting & CAS Firm',
    firmSize: '11 employees, 40 business clients',
    prospectName: 'Kelly Taylor',
    prospectTitle: 'Office Manager & Executive Assistant',
    voiceType: 'friendly-female',
    context: 'Apex is a boutique CPA firm. Kelly manages the front desk and calendar for the Managing Partner, Dave Miller. Dave has been complaining about how much time the team wastes printing client checks.',
    initialGreeting: 'Good morning, Apex Accounting Partners, this is Kelly. How can I direct your call?',
    temperament: 'Helpful and polite. If the AE sounds professional and explains they help firms eliminate client check-signing and 1099 prep, Kelly will check Dave\'s availability or provide his direct line/calendar.',
    voicePitch: 1.1,
    voiceRate: 1.0,
    painPoints: ['Manual check signing', 'Chasing client approvals', 'Tax season overload'],
    hiddenStakeholders: ['Dave Miller (Managing Partner)']
  },
  {
    id: 'cc-gk-med',
    type: 'cold-call',
    targetRole: 'gatekeeper',
    difficulty: 'medium',
    title: 'Protective Operations Coordinator (Property Management)',
    firmName: 'Highland Property Management',
    firmType: 'Property Management Firm',
    firmSize: '16 employees, 450 residential doors',
    prospectName: 'Marcus Vance',
    prospectTitle: 'Operations & Office Lead',
    voiceType: 'cautious-male',
    context: 'Marcus filters all calls for the Owner, Rick Sanders. Marcus knows Rick gets 15 sales pitches a day and hates cold callers. He will grill the caller on what the call is regarding.',
    initialGreeting: 'Highland Property Management, Marcus speaking. Who may I say is calling?',
    temperament: 'Skeptical and guarded. Asks: "What is this regarding?", "Is he expecting your call?", "We don\'t take vendor solicitations." If the AE offers a crisp, tailored hook mentioning vendor W-9s or maintenance spend, Marcus warms up slightly.',
    voicePitch: 0.95,
    voiceRate: 1.05,
    painPoints: ['Maintenance vendor payments', 'Subcontractor W-9 collection', 'Shared credit card receipts'],
    hiddenStakeholders: ['Rick Sanders (Owner & Principal)', 'Lisa Chen (Head of Accounting)']
  },
  {
    id: 'cc-gk-hard',
    type: 'cold-call',
    targetRole: 'gatekeeper',
    difficulty: 'hard',
    title: 'The Iron-Wall Executive Assistant (CPA Firm)',
    firmName: 'Sterling Financial & Advisory Group',
    firmType: 'Accounting & Bookkeeping Practice',
    firmSize: '19 employees, 65 clients',
    prospectName: 'Eleanor Vance',
    prospectTitle: 'Senior Executive Assistant to Managing Partner',
    voiceType: 'stern-female',
    context: 'Eleanor takes pride in shutting down salespeople. If you sound like you are pitching or reading a script, she will immediately say "Send an email to info@ and we will review it" and hang up.',
    initialGreeting: 'Sterling Group. Eleanor speaking. How can I help?',
    temperament: 'Sharp, brisk, and uncompromising. Demands to know: "Are you a client?", "Why does Robert need to speak with you today?", "We have a strict no-pitch policy." Only an exceptionally polite, assertive, and peer-to-peer hook will get anywhere.',
    voicePitch: 0.9,
    voiceRate: 1.1,
    painPoints: ['Overworked senior bookkeepers', 'W-9 verification bottlenecks'],
    hiddenStakeholders: ['Robert Sterling (Managing Partner)']
  },

  // COLD CALLS - DECISION MAKER
  {
    id: 'cc-dm-easy',
    type: 'cold-call',
    targetRole: 'decision-maker',
    difficulty: 'easy',
    title: 'Curious CPA Partner (Between Meetings)',
    firmName: 'Summit Bookkeeping & Advisory',
    firmType: 'Accounting & CAS Firm',
    firmSize: '8 employees, 30 clients',
    prospectName: 'Brian Morales',
    prospectTitle: 'Founding Partner & CPA',
    voiceType: 'approachable-male',
    context: 'Brian just finished a client call and has 2 minutes before his next appointment. He is open to talking if the hook is relevant to accounting firm efficiency.',
    initialGreeting: 'This is Brian Morales. What\'s going on?',
    temperament: 'Fair and curious. Listens to the opening hook. Will test with 1-2 standard questions like: "Is this like Melio or QuickBooks?" but will agree to a 10-minute demo if the value makes sense.',
    voicePitch: 1.0,
    voiceRate: 1.0,
    painPoints: ['Manual data entry into QuickBooks', 'Chasing clients for check sign-offs', '1099 season panic'],
    hiddenStakeholders: ['Sarah (Senior CAS Manager)']
  },
  {
    id: 'cc-dm-med',
    type: 'cold-call',
    targetRole: 'decision-maker',
    difficulty: 'medium',
    title: 'Rushed Property Management Owner',
    firmName: 'BlueSky Residential Properties',
    firmType: 'Property Management Firm',
    firmSize: '14 employees, 380 doors',
    prospectName: 'Danielle Miller',
    prospectTitle: 'Owner & Managing Broker',
    voiceType: 'busy-female',
    context: 'Danielle is at her desk reviewing property maintenance expenses. She answers her direct line quickly and wants to know why you are calling.',
    initialGreeting: 'Danielle here. Make it quick, I\'m looking at work orders right now.',
    temperament: 'Fast-paced, direct. Hits you with objections: "We already use QuickBooks for bill pay", "Our vendors just invoice our property management software", "Can\'t you just shoot me an email?" Needs a strong pattern interrupt and clear focus on maintenance spend or W-9s.',
    voicePitch: 1.05,
    voiceRate: 1.1,
    painPoints: ['Maintenance technicians losing receipts', 'Collecting W-9s from plumbers and landscapers', 'QuickBooks sync issues'],
    hiddenStakeholders: ['Danielle Miller (Final sign-off)', 'Tom (Lead Property Manager)']
  },
  {
    id: 'cc-dm-hard',
    type: 'cold-call',
    targetRole: 'decision-maker',
    difficulty: 'hard',
    title: 'Brutal Skeptic & CPA Managing Partner',
    firmName: 'Vanguard Tax & Accounting',
    firmType: 'Accounting Firm',
    firmSize: '22 employees, 80 clients',
    prospectName: 'Greg Kowalski',
    prospectTitle: 'Managing Partner',
    voiceType: 'skeptical-male',
    context: 'Greg is exhausted by software reps claiming to "revolutionize" accounting. He is cynical about tech vendors and will challenge every word you say.',
    initialGreeting: 'Greg Kowalski. Who is this, and how did you get this cell number?',
    temperament: 'Hostile, time-protective, and razor-sharp. Says: "I have 15 seconds. If this is a cold pitch, don\'t waste my time." If you give fluff, he will say "Not interested, take me off your list" and hang up. Respects confidence, directness, and immediate peer-level accounting knowledge.',
    voicePitch: 0.9,
    voiceRate: 1.15,
    painPoints: ['Staff turnover due to manual AP grunt work', 'Check fraud attempts', 'Clients refusing to adopt modern portals'],
    hiddenStakeholders: ['Greg Kowalski', 'Janet (Director of CAS)', 'Partner Committee']
  },

  // DISCOVERY CALLS - DECISION MAKER ONLY
  {
    id: 'disc-dm-easy',
    type: 'discovery',
    targetRole: 'decision-maker',
    difficulty: 'easy',
    title: 'CAS Director Scaling Client Advisory Services',
    firmName: 'ClearPath Accounting Advisors',
    firmType: 'Accounting Firm',
    firmSize: '15 employees, 50 business clients',
    prospectName: 'Amanda Brooks',
    prospectTitle: 'Director of Client Accounting Services (CAS)',
    voiceType: 'collaborative-female',
    context: 'Amanda booked a discovery call after seeing an ad for BILL Accountant Console. She wants to standardize firm AP and eliminate paper checks.',
    initialGreeting: 'Hi! Thanks for jumping on. I\'m excited to dig in—we\'re really feeling the pain with our manual AP workflows across our 50 clients.',
    temperament: 'Open, transparent, and eager for solutions. Shares workflow metrics freely (losing 15 hours a week per bookkeeper). Proactively brings up other stakeholders when asked.',
    voicePitch: 1.05,
    voiceRate: 1.0,
    painPoints: [
      'Each client has a separate QuickBooks login (no unified console)',
      'Chasing clients for days to approve vendor checks',
      'Missing receipts from client employee cards',
      'Terrified of 1099 compliance for 150+ contractors'
    ],
    hiddenStakeholders: [
      'Amanda Brooks (Day-to-day sponsor & evaluator)',
      'Brad Wilson (Senior Partner - holds the checkbook and signs off on firm-wide tech contracts)',
      'Chloe (Lead Senior Bookkeeper - must confirm QuickBooks sync reliability)'
    ],
    stakeholderHint: 'If the AE asks who else would need to be involved in evaluating or signing off, Amanda will readily introduce Brad and Chloe.'
  },
  {
    id: 'disc-dm-med',
    type: 'discovery',
    targetRole: 'decision-maker',
    difficulty: 'medium',
    title: 'Controller at Growing Property Management Firm',
    firmName: 'Pacific Crest Property Group',
    firmType: 'Property Management Firm',
    firmSize: '18 employees, 600 units across 25 property LLCs',
    prospectName: 'Jason Ramirez',
    prospectTitle: 'Controller & Head of Finance',
    voiceType: 'methodical-male',
    context: 'Jason agreed to a 15-minute call. He is frustrated with property maintenance spend chaos and vendor 1099s, but is cautious about adding new software.',
    initialGreeting: 'Hi there. Jason speaking. I have about 15 minutes before my next meeting. Where would you like to start?',
    temperament: 'Professional, analytical, but guarded. Will share pain only when asked thoughtful, open-ended questions. Will NOT mention the other key decision-makers unless the AE explicitly asks: "Who else besides yourself would be involved in deciding on a platform like BILL?"',
    voicePitch: 0.95,
    voiceRate: 1.02,
    painPoints: [
      'Managing 25 separate property LLC bank accounts manually',
      'Over 200 maintenance vendors with missing W-9s',
      'Field technicians using shared credit cards without receipt tracking',
      'Board approvals for HOA invoices take 2+ weeks'
    ],
    hiddenStakeholders: [
      'Jason Ramirez (Financial evaluator)',
      'Elena Vance (Managing Principal & Majority Owner - makes all financial commitments over $2,000/yr)',
      'Carlos (VP of Property Operations - manages the field technicians using spend cards)'
    ],
    stakeholderHint: 'Keeps Elena and Carlos quiet until the AE asks about decision criteria, timeline, or stakeholder involvement.'
  },
  {
    id: 'disc-dm-hard',
    type: 'discovery',
    targetRole: 'decision-maker',
    difficulty: 'hard',
    title: 'Managing Partner Defending Current Workarounds',
    firmName: 'Oakwood CPA & Business Services',
    firmType: 'Accounting & Tax Firm',
    firmSize: '24 employees, 90 business clients',
    prospectName: 'Robert Lang',
    prospectTitle: 'Managing Partner & Founder',
    voiceType: 'skeptical-male',
    context: 'Robert agreed to the call reluctantly because his senior manager complained about paper checks. He believes their current system in QuickBooks Desktop & Excel works "well enough".',
    initialGreeting: 'Alright, we have this call on the calendar. To be frank, we\'ve been running our firm for 18 years without BILL. Convince me why I shouldn\'t just stick with what we have.',
    temperament: 'Challenging, skeptical, and proud of the firm\'s heritage. Downplays problems. Resists answering stakeholder questions: "I make all decisions, just show me what you have first." Requires the AE to uncover deep business risks (fraud, staff churn, lost billable hours) before admitting that his 2 equity partners and IT lead have veto power.',
    voicePitch: 0.9,
    voiceRate: 1.08,
    painPoints: [
      'Senior accountants spending 20% of their billable hours doing manual AP data entry',
      'Recently had an intercepted paper check fraud incident ($14,000)',
      'Dreading 1099-NEC filing for 300+ contractors in January',
      'Junior staff complaining about lack of modern tools'
    ],
    hiddenStakeholders: [
      'Robert Lang (Managing Partner)',
      'Karen & David (Equity Partners - must unanimously approve new SaaS tools)',
      'Timothy (External IT & Security Consultant - requires SOC 2 and data privacy review)'
    ],
    stakeholderHint: 'If pressed on who else signs off without proving value first, Robert will push back. But if the AE links security/fraud and billable capacity to firm equity, Robert will reveal Karen, David, and Timothy.'
  }
];
