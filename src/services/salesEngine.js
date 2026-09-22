// Sales roleplay dialogue generator for BILL Account Executive practice
// Handles Gemini API calls or smart contextual fallback roleplay for zero-setup execution.

export async function generateProspectReply({
  scenario,
  conversationHistory, // array of { role: 'user' | 'assistant', text: string }
  userSpeech,
  apiKey = '',
  apiProvider = 'gemini'
}) {
  // If user provided a Gemini API Key, call Gemini API
  if (apiKey && apiProvider === 'gemini') {
    try {
      return await callGeminiAPI(apiKey, scenario, conversationHistory, userSpeech);
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local roleplay engine:', err);
    }
  }

  // If user provided an OpenAI API Key, call OpenAI API
  if (apiKey && apiProvider === 'openai') {
    try {
      return await callOpenAIAPI(apiKey, scenario, conversationHistory, userSpeech);
    } catch (err) {
      console.warn('OpenAI API call failed, falling back to local roleplay engine:', err);
    }
  }

  // Fallback to intelligent local contextual engine
  return generateLocalRuleBasedReply(scenario, conversationHistory, userSpeech);
}

// Google Gemini API integration (Gemini 2.0 Flash / 1.5 Flash)
async function callGeminiAPI(apiKey, scenario, history, userSpeech) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const systemInstruction = `
You are roleplaying as a prospect in a phone sales simulation with a sales rep from BILL (formerly bill.com).
Your Profile:
- Name: ${scenario.prospectName}
- Title: ${scenario.prospectTitle}
- Organization: ${scenario.firmName} (${scenario.firmType}, ${scenario.firmSize})
- Call Type: ${scenario.type === 'cold-call' ? 'COLD CALL (Unsolicited incoming phone call)' : 'DISCOVERY CALL (Scheduled 15-min call)'}
- Target Contact Type: ${scenario.targetRole.toUpperCase()} (e.g. Gatekeeper or Decision Maker)
- Difficulty Level: ${scenario.difficulty.toUpperCase()}
- Personality & Temperament: ${scenario.temperament}
- Firm Context: ${scenario.context}
- Known Pain Points: ${scenario.painPoints.join(', ')}
${scenario.hiddenStakeholders ? `- Key Stakeholders: ${scenario.hiddenStakeholders.join(', ')}. ${scenario.stakeholderHint || ''}` : ''}

ROLEPLAY RULES:
1. Speak realistically like a busy business professional on a real phone call.
2. Keep your answers conversational and concise (1 to 3 sentences maximum, usually under 35 words).
3. Do NOT break character or sound like an AI assistant.
4. Difficulty Behaviors:
   - EASY: Receptive, cooperative, answers questions directly, easily scheduled for next step.
   - MEDIUM: Realistic skepticism, brings up common objections ("we already use QuickBooks", "send me an email", "our clients like checks"), reveals other stakeholders only if explicitly asked.
   - HARD: Guarded, impatient, dismissive, pushes back hard on value, challenges time waste, tests the AE's authority and knowledge.
5. If you are a GATEKEEPER:
   - Your goal is to screen. You do NOT make software purchase decisions.
   - If the AE gives a generic sales pitch, say "Please send info to info@firm.com."
   - If they are professional, concise, and mention helping partners eliminate manual check signing or 1099 compliance, you may offer to check the partner's calendar or take a message.
6. If this is a DISCOVERY CALL:
   - Answer their questions about current workflows, but make them work for it based on difficulty.
   - STAKEHOLDER RULE: If the AE specifically asks who else is involved in the decision, who else needs to be on the demo, or who signs off on new software, respond according to your difficulty level (${scenario.difficulty}).
`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: systemInstruction }]
    },
    {
      role: 'model',
      parts: [{ text: `Understood. I will stay in character as ${scenario.prospectName}, ${scenario.prospectTitle} at ${scenario.firmName}. I will respond concisely and naturally as if on a live phone call.` }]
    }
  ];

  // Append history
  for (const msg of history) {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    });
  }

  // Append current turn
  contents.push({
    role: 'user',
    parts: [{ text: userSpeech }]
  });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        maxOutputTokens: 120,
        temperature: 0.7,
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text?.trim() || "Sorry, I missed that. What did you say?";
}

// OpenAI API integration
async function callOpenAIAPI(apiKey, scenario, history, userSpeech) {
  const messages = [
    {
      role: 'system',
      content: `You are roleplaying as ${scenario.prospectName}, ${scenario.prospectTitle} at ${scenario.firmName} (${scenario.firmSize}).
Call Type: ${scenario.type}, Role: ${scenario.targetRole}, Difficulty: ${scenario.difficulty}.
Temperament: ${scenario.temperament}.
Keep responses brief (1-3 sentences, max 40 words), realistic for a phone call, and do not break character.`
    }
  ];

  for (const msg of history) {
    messages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.text
    });
  }

  messages.push({ role: 'user', content: userSpeech });

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 100,
      temperature: 0.7
    })
  });

  if (!res.ok) throw new Error(`OpenAI API error: ${res.statusText}`);
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

// Intelligent Contextual Fallback Engine (Zero-Key Mode)
function generateLocalRuleBasedReply(scenario, history, userSpeech) {
  const lower = userSpeech.toLowerCase();
  const turnCount = history.filter(m => m.role === 'user').length + 1;

  // 1. GATEKEEPER COLD CALL LOGIC
  if (scenario.targetRole === 'gatekeeper') {
    if (scenario.difficulty === 'easy') {
      if (lower.includes('quick') || lower.includes('30 seconds') || lower.includes('ap') || lower.includes('check') || lower.includes('1099')) {
        return "Dave is actually stepping out of a client meeting in about ten minutes. If you have a quick overview, I can put you on his calendar for tomorrow morning, or give you his direct email.";
      }
      if (lower.includes('calendar') || lower.includes('tomorrow') || lower.includes('meet') || lower.includes('demo') || lower.includes('schedule')) {
        return "Sure, I have 10:30 AM open on Dave's calendar tomorrow. What was your full name and company again?";
      }
      return "Dave Miller is the Managing Partner. What firm are you with, and is this about our client accounting software?";
    }

    if (scenario.difficulty === 'medium') {
      if (turnCount === 1) {
        if (lower.includes('bill') || lower.includes('partner') || lower.includes('accounting')) {
          return "Rick is swamped with property inspections today. What is this regarding specifically? We have a strict policy against cold vendor calls.";
        }
        return "Who is calling, and does Rick know what this is about?";
      }
      if (lower.includes('w-9') || lower.includes('w9') || lower.includes('1099') || lower.includes('vendor') || lower.includes('spend') || lower.includes('maintenance')) {
        return "Okay, vendor W-9s have definitely been a headache for Lisa in accounting. Rick handles operations though. What's your number? I'll let him know, but no promises.";
      }
      if (lower.includes('email') || lower.includes('send')) {
        return "Yeah, just send whatever you have to admin@highlandpm.com. If Rick is interested he'll reach out.";
      }
      return "Look, he's in meetings. If you want to leave a 30-second message about what you do for property managers, I can pass it along.";
    }

    if (scenario.difficulty === 'hard') {
      if (lower.includes('email') || lower.includes('information')) {
        return "Send it to info@sterlinggroup.com. We review vendor submissions quarterly. Have a good day.";
      }
      if (turnCount === 1) {
        return "Robert doesn't take unsolicited sales calls. Are you a registered client of the firm?";
      }
      if (lower.includes('1099') || lower.includes('check') || lower.includes('bill') || lower.includes('ap')) {
        return "We have existing accounting software partners that we've used for years. Robert has instructed us not to transfer vendor pitches. Goodbye.";
      }
      return "I'm going to stop you there. We aren't interested. Please remove us from your calling list.";
    }
  }

  // 2. DECISION MAKER COLD CALL LOGIC
  if (scenario.type === 'cold-call' && scenario.targetRole === 'decision-maker') {
    // Objection: QuickBooks Bill Pay
    if (lower.includes('quickbooks') || lower.includes('qbo')) {
      if (scenario.difficulty === 'easy') {
        return "Yeah, we run everything through QuickBooks. Does BILL do something QuickBooks doesn't, or is this just another bill pay tool?";
      } else if (scenario.difficulty === 'medium') {
        return "We're already paying for QuickBooks Bill Pay and it does the job. Why on earth would I pay for another software subscription?";
      } else {
        return "Look, QuickBooks handles our ledger and bill pay just fine. I don't have the appetite to complicate our tech stack. I really have to run.";
      }
    }

    // Objection: Send me an email
    if (lower.includes('email') || lower.includes('send info') || lower.includes('shoot me')) {
      if (lower.includes('chasing') || lower.includes('approval') || lower.includes('1099') || lower.includes('hours')) {
        return "Fair point. Honestly, chasing client approvals is the biggest time suck for our team. If you can solve that, I might take a look. What does next week look like?";
      }
      return "Just shoot whatever you have over in an email. If it looks relevant, my team will follow up.";
    }

    // Objection: Paper checks
    if (lower.includes('check') || lower.includes('paper')) {
      return "A lot of our small business clients are stubborn. They want to see physical paper checks and sign them with a pen. How do you deal with that?";
    }

    // Objection: 1099 / W-9
    if (lower.includes('1099') || lower.includes('w-9') || lower.includes('w9') || lower.includes('tax')) {
      return "1099 season is an absolute nightmare for our bookkeepers every January. How does BILL actually automate the W-9 collection without my team having to email every vendor?";
    }

    // Objection: Divvy / Spend management
    if (lower.includes('divvy') || lower.includes('spend') || lower.includes('card') || lower.includes('expense')) {
      return "Our maintenance guys share a company card right now. Receipts get lost constantly. Are you saying you can set real-time budgets per property on individual cards?";
    }

    // Attempting to close for a meeting / demo
    if (lower.includes('tuesday') || lower.includes('thursday') || lower.includes('demo') || lower.includes('15 minutes') || lower.includes('calendar') || lower.includes('time')) {
      if (scenario.difficulty === 'easy') {
        return "Alright, you've got my attention. How does Thursday at 2:00 PM sound for a 15-minute walkthrough?";
      } else if (scenario.difficulty === 'medium') {
        return "I can give you 15 minutes, but keep it high-level. Can you do Friday at 11 AM?";
      } else {
        return "I'm not committing to a full demo yet. Send me a 2-minute video on how the approval workflows work, and if it makes sense, we can talk next month.";
      }
    }

    // First response / Hook handling
    if (turnCount === 1) {
      if (scenario.difficulty === 'easy') {
        return "I've got about 60 seconds before my next client call. What specifically are you doing for firms like ours?";
      } else if (scenario.difficulty === 'medium') {
        return "I get three calls like this a day. What's the 30-second version of why I should care?";
      } else {
        return "I'm literally walking into a meeting. You have 15 seconds—how did you get this number and what is this about?";
      }
    }

    return "Okay, I hear what you're saying about manual AP and check processing. But how long does it realistically take to get 30 clients onboarded onto something like this?";
  }

  // 3. DISCOVERY CALL LOGIC (Decision Maker)
  if (scenario.type === 'discovery') {
    // Stakeholder discovery question detection!
    const isAskingAboutStakeholders = (
      lower.includes('who else') ||
      lower.includes('stakeholder') ||
      lower.includes('decision') ||
      lower.includes('involved') ||
      lower.includes('team') ||
      lower.includes('partner') ||
      lower.includes('sign off') ||
      lower.includes('evaluat') ||
      lower.includes('next call')
    );

    if (isAskingAboutStakeholders) {
      if (scenario.id === 'disc-dm-easy') {
        return "Great question. I'm the main sponsor for our CAS division, but our Senior Managing Partner Brad Wilson holds the checkbook and signs off on firm software contracts. Also, our Lead Bookkeeper Chloe would need to join the demo to make sure the QuickBooks sync meets her standards.";
      } else if (scenario.id === 'disc-dm-med') {
        return "Well, I evaluate the financial workflows, but Elena Vance, our Managing Principal, makes all final commitments over two thousand dollars. Also, Carlos, who runs field property maintenance, would definitely need to see how the Divvy spend cards work for his techs.";
      } else {
        // Hard difficulty discovery
        if (turnCount < 4) {
          return "Right now it's just me evaluating. Show me that this actually saves us billable hours first, and then I'll decide if anyone else needs to sit in.";
        } else {
          return "Fair enough. If we take this to a full demonstration, my equity partners Karen and David will need to be in the room, and our IT advisor Timothy will need to review your SOC 2 compliance.";
        }
      }
    }

    // Pain point probing: AP / Paper Checks
    if (lower.includes('ap') || lower.includes('bill') || lower.includes('invoice') || lower.includes('check') || lower.includes('approval') || lower.includes('manual')) {
      if (scenario.difficulty === 'easy') {
        return "Right now my team spends easily 15 to 20 hours a week across all clients just printing checks, chasing signatures, and re-entering invoice data into QuickBooks. It's our biggest bottleneck.";
      } else if (scenario.difficulty === 'medium') {
        return "We manage it through a mix of QuickBooks and email approvals, but when clients take 10 days to reply to an email, vendors start calling us screaming. It's pretty frustrating.";
      } else {
        return "Our system works, but my senior managers complain that they're doing clerical data entry instead of high-value advisory work. What's the actual time savings your accounting partners see?";
      }
    }

    // Pain point probing: 1099 & W-9
    if (lower.includes('1099') || lower.includes('w-9') || lower.includes('w9') || lower.includes('tax') || lower.includes('contractor')) {
      return "Every single January we have to hire two temp workers just to hunt down missing W-9s and addresses before filing 1099-NECs. It's disorganized and we've had near-penalties with the IRS.";
    }

    // Pain point probing: Spend / Divvy / Budgets
    if (lower.includes('spend') || lower.includes('card') || lower.includes('expense') || lower.includes('budget') || lower.includes('divvy')) {
      return "Right now staff submit crumpled receipts at the end of the month, or worse, they forget what a charge was for. Having enforceable budgets on cards per property or per client would eliminate so many reconciliation headaches.";
    }

    // Next steps / scheduling demo
    if (lower.includes('next step') || lower.includes('demo') || lower.includes('schedule') || lower.includes('calendar') || lower.includes('walkthrough')) {
      return "That sounds like a logical next step. Let's schedule a 30-minute tailored walkthrough. I'll make sure the relevant team members get the calendar invite.";
    }

    return "That's an interesting question. In our practice, our main priority is freeing up staff capacity and ensuring we don't have security holes like check fraud. How does BILL handle that?";
  }

  return "I see. Tell me a bit more about how that works in practice.";
}
