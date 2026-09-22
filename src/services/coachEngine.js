// Automated Sales Coach and Transcript Analyzer for BILL.com Account Executives
// Evaluates Talk-to-Listen ratio, objection handling, discovery depth, stakeholder uncovering, and next-step execution.

export function evaluateCallSession({
  scenario,
  transcript, // array of { role: 'user' | 'assistant', text: string, timestamp: number }
  callDurationSeconds = 0
}) {
  const userMessages = transcript.filter(m => m.role === 'user');
  const prospectMessages = transcript.filter(m => m.role === 'assistant');

  // 1. Calculate Talk vs. Listen Ratio (word count based)
  let repWordCount = 0;
  let prospectWordCount = 0;

  userMessages.forEach(m => {
    repWordCount += m.text.trim().split(/\s+/).filter(Boolean).length;
  });
  prospectMessages.forEach(m => {
    prospectWordCount += m.text.trim().split(/\s+/).filter(Boolean).length;
  });

  const totalWords = repWordCount + prospectWordCount || 1;
  const repTalkPercentage = Math.round((repWordCount / totalWords) * 100);
  const prospectTalkPercentage = 100 - repTalkPercentage;

  const fullRepText = userMessages.map(m => m.text.toLowerCase()).join(' ');

  // 2. Sales Competency Checks
  const checks = {
    // Upfront contract / permission opener
    permissionHook: fullRepText.includes('30 seconds') || fullRepText.includes('minute') || fullRepText.includes('caught you') || fullRepText.includes('fair to say') || fullRepText.includes('time to chat'),
    
    // Core Value Drivers mentioned
    apAutomation: fullRepText.includes('ap') || fullRepText.includes('accounts payable') || fullRepText.includes('invoice') || fullRepText.includes('approval') || fullRepText.includes('sync'),
    checkElimination: fullRepText.includes('check') || fullRepText.includes('paper') || fullRepText.includes('mail') || fullRepText.includes('fraud') || fullRepText.includes('positive pay'),
    taxCompliance: fullRepText.includes('1099') || fullRepText.includes('w-9') || fullRepText.includes('w9') || fullRepText.includes('tax') || fullRepText.includes('subcontractor'),
    spendManagement: fullRepText.includes('spend') || fullRepText.includes('divvy') || fullRepText.includes('card') || fullRepText.includes('budget') || fullRepText.includes('receipt'),
    
    // Objection Handling Checks
    qboHandled: fullRepText.includes('quickbooks') || fullRepText.includes('qbo') || fullRepText.includes('ledger') || fullRepText.includes('portal'),
    emailHandled: fullRepText.includes('send') && (fullRepText.includes('before i do') || fullRepText.includes('so i don\'t') || fullRepText.includes('which')),

    // Stakeholder Uncovering (Vital for Discovery)
    stakeholdersAsked: (
      fullRepText.includes('who else') ||
      fullRepText.includes('stakeholder') ||
      fullRepText.includes('involved') ||
      fullRepText.includes('team') ||
      fullRepText.includes('partner') ||
      fullRepText.includes('sign off') ||
      fullRepText.includes('evaluat') ||
      fullRepText.includes('decision')
    ),

    // Closed for specific next step
    closedNextStep: (
      fullRepText.includes('calendar') ||
      fullRepText.includes('demo') ||
      fullRepText.includes('walkthrough') ||
      fullRepText.includes('tuesday') ||
      fullRepText.includes('wednesday') ||
      fullRepText.includes('thursday') ||
      fullRepText.includes('friday') ||
      fullRepText.includes('next week') ||
      fullRepText.includes('15 minutes')
    )
  };

  // 3. Calculate Score (0 - 100)
  let score = 50; // base score

  // Talk ratio scoring
  if (scenario.type === 'cold-call') {
    // For cold calls, rep usually talks 55-65%
    if (repTalkPercentage >= 45 && repTalkPercentage <= 70) score += 15;
    else if (repTalkPercentage > 75) score -= 10; // pitch slap
  } else {
    // For discovery, prospect should talk 50-65%
    if (prospectTalkPercentage >= 45 && prospectTalkPercentage <= 70) score += 15;
    else if (repTalkPercentage > 65) score -= 15; // talking too much on discovery!
  }

  if (checks.permissionHook) score += 8;
  if (checks.apAutomation) score += 8;
  if (checks.checkElimination) score += 6;
  if (checks.taxCompliance) score += 6;
  if (checks.spendManagement) score += 6;
  if (checks.closedNextStep) score += 12;

  if (scenario.type === 'discovery') {
    if (checks.stakeholdersAsked) score += 15;
    else score -= 10; // penalty for missing other decision makers
  }

  // Bound score 0-100
  score = Math.max(20, Math.min(100, score));

  // Determine Letter Grade
  let grade = 'B';
  if (score >= 93) grade = 'A+';
  else if (score >= 88) grade = 'A';
  else if (score >= 80) grade = 'B+';
  else if (score >= 73) grade = 'B';
  else if (score >= 65) grade = 'C';
  else grade = 'Needs Work';

  // 4. Annotated Transcript Items
  const annotatedTranscript = transcript.map((item, idx) => {
    let annotation = null;
    let type = 'neutral'; // 'positive', 'warning', 'neutral'
    const lower = item.text.toLowerCase();

    if (item.role === 'user') {
      if (lower.includes('who else') || lower.includes('involved in this decision')) {
        annotation = '⭐ Excellent stakeholder discovery question! Pinpointing other evaluators early saves the deal from stalling.';
        type = 'positive';
      } else if (lower.includes('quickbooks') && (lower.includes('approval') || lower.includes('portal') || lower.includes('license'))) {
        annotation = '💡 Great wedge on QBO Bill Pay vs BILL client approval portals.';
        type = 'positive';
      } else if (lower.includes('1099') || lower.includes('w-9')) {
        annotation = '🎯 Strong focus on the 1099/W-9 bottleneck—top headache for firms.';
        type = 'positive';
      } else if (item.text.length > 250) {
        annotation = '⚠️ Pitch Slap Warning: This statement was over 50 words without a checking question. Keep it concise.';
        type = 'warning';
      }
    } else if (item.role === 'assistant') {
      if (scenario.hiddenStakeholders && scenario.hiddenStakeholders.some(s => lower.includes(s.toLowerCase().split(' ')[0]))) {
        annotation = '🔑 Stakeholder Revealed! The prospect mentioned another decision-maker.';
        type = 'positive';
      }
    }

    return {
      ...item,
      annotation,
      type
    };
  });

  // 5. Strengths & Opportunities
  const strengths = [];
  const improvements = [];

  if (checks.permissionHook) strengths.push('Used a permission-based opener ("30 seconds" / upfront contract).');
  if (checks.apAutomation) strengths.push('Clearly articulated Accounts Payable automation and approval workflows.');
  if (checks.taxCompliance) strengths.push('Highlighted W-9 collection automation and 1099 e-filing relief.');
  if (checks.spendManagement) strengths.push('Leveraged BILL Spend & Expense (Divvy) smart budget controls.');
  if (checks.stakeholdersAsked) strengths.push('Discovered other decision-makers and key stakeholders for the next demo call.');
  if (checks.closedNextStep) strengths.push('Locked down a firm commitment with a specific time/next step.');

  if (!checks.closedNextStep) improvements.push('Always end the conversation proposing a firm day and time for a 15-minute partner consultation.');
  if (scenario.type === 'discovery' && !checks.stakeholdersAsked) {
    improvements.push('Stakeholder Gap: You didn\'t ask who else needs to be on the call. Ask: "Who else on the partner or ops side needs to be in the loop?"');
  }
  if (scenario.type === 'discovery' && repTalkPercentage > 55) {
    improvements.push(`High Talk Ratio (${repTalkPercentage}%): In discovery calls, aim for the prospect to speak 60% of the time by asking open-ended questions.`);
  }
  if (!checks.taxCompliance && !checks.spendManagement) {
    improvements.push('Expand the value wedge: Mentioning automated W-9 collection or Divvy spend cards often triggers immediate pain for accounting and property management firms.');
  }

  // 6. Generate Suggested Follow-Up Email
  const followUpEmail = generateFollowUpEmail(scenario, checks, fullRepText);

  return {
    score,
    grade,
    repTalkPercentage,
    prospectTalkPercentage,
    repWordCount,
    prospectWordCount,
    callDurationSeconds,
    checks,
    strengths: strengths.length ? strengths : ['Engaged the prospect in live dialogue.'],
    improvements: improvements.length ? improvements : ['Maintain this rhythm and continue challenging status-quo workarounds.'],
    annotatedTranscript,
    followUpEmail
  };
}

function generateFollowUpEmail(scenario, checks, fullRepText) {
  const isAccounting = scenario.firmType.toLowerCase().includes('accounting') || scenario.firmType.toLowerCase().includes('cas');

  return `Subject: Recap: Streamlining client AP & 1099 workflows for ${scenario.firmName}

Hi ${scenario.prospectName.split(' ')[0]},

Thanks for taking a few minutes to connect today regarding ${scenario.firmName}'s current accounting operations.

Based on our discussion, it sounds like the biggest bottlenecks right now are:
• Eliminating manual client check-signing and invoice entry into QuickBooks
• Removing the headache of chasing subcontractors for W-9s ahead of 1099 filing
• ${isAccounting ? 'Standardizing multi-client AP approval workflows across all firm clients' : 'Enforcing real-time budgets on property maintenance spend without lost receipts'}

As discussed, I've tentatively penciled in a 15-minute consultation for us this Thursday at 10:30 AM to walk through the BILL Accountant Console and see firsthand how other firms your size save 15+ hours a week.

${checks.stakeholdersAsked ? `Please feel free to forward the calendar invite to your colleagues so we can address everyone's questions.` : `If there's anyone else on the partner or operations team who helps evaluate firm software, feel free to add them to the invite.`}

Looking forward to connecting!

Best regards,

[Your Name]
Account Executive | Accounting Channel
BILL (bill.com)
`;
}
