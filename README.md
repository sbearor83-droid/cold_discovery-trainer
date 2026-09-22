# CallCraft AI — Cold Call & Discovery Call Voice Simulator

> **Live voice-to-voice practice simulator tailored specifically for an Account Executive at BILL (Accounting Channel), targeting Accounting/CAS and Property Management firms (≤ 25 employees).**

---

## 🌟 Key Features

### 🎙️ 1. Live Voice-to-Voice Practice Engine
- **Browser-Native Speech Recognition (STT)**: Continuous mic speech-to-text with real-time word transcription.
- **Natural Voice Synthesis (TTS)**: Conversational prospect voice output calibrated by role and temperament.
- **Hands-Free Auto-Speaking (VAD)**: Speak naturally into your mic; CallCraft detects pauses and triggers the prospect to reply automatically.
- **Live Barge-In / Interruption**: If the prospect is talking and you speak, the prospect immediately stops talking to listen.
- **Dual Audio Waveform Visualizer**: Responsive canvas frequency bars monitoring both your speech energy and prospect audio.
- **Realistic Phone FX**: 440Hz + 480Hz dual-frequency US telephone ringback audio and pick-up click.

---

### 📞 2. Targeted Sales Scenarios (Firms ≤ 25 Employees)

#### Cold Call Practice Matrix
- **Gatekeeper Options**:
  - **Easy**: Friendly receptionist/coordinator (Apex Accounting).
  - **Medium**: Protective operations manager (Highland Property Mgmt) asking: *"What is this regarding? We don't take vendor calls."*
  - **Hard**: Iron-wall executive assistant (Sterling Group) with zero tolerance for generic pitches.
- **Decision Maker Options**:
  - **Easy**: Curious CPA partner (Brian Morales) with 60 seconds between client calls.
  - **Medium**: Rushed property management owner (Danielle Miller) throwing objections (*"We already use QuickBooks Bill Pay"*, *"Our clients like checks"*, *"Send me an email"*).
  - **Hard**: Brutal CPA managing partner (Greg Kowalski) (*"How did you get this number? I have 15 seconds"*).

#### Discovery Call Practice (Decision Maker Focus)
- Uncover AP bottlenecks, paper check fraud, 1099/W-9 headaches, and unbudgeted Divvy spend.
- **Stakeholder Uncovering Challenge**: Tests whether the AE proactively asks: *"Who else on the leadership or operations team needs to be involved in evaluating this?"*
  - **Easy**: Proactively mentions co-partners and senior bookkeepers.
  - **Medium**: Keeps other decision-makers private until asked directly.
  - **Hard**: Reluctant to share other stakeholders until you prove concrete ROI.

#### Custom Scenario Builder
- Build any custom scenario with your own firm name, size, prospect name, software stack, and objection focus.

---

### 🛡️ 3. In-Call Objection Battlecards
One-click collapsible reference drawer during active calls featuring talk tracks for core BILL value pillars:
1. **QuickBooks Bill Pay vs. BILL**: Multi-tiered client approvals without requiring costly QBO licenses, fraud shielding, positive pay, and automated two-way sync.
2. **Clients Prefer Paper Checks**: Positive Pay check fraud statistics (up 385%), letting BILL print and mail checks on the firm's behalf with dual-control digital authorizations.
3. **W-9 Chasing & 1099 Season**: Eliminating January panic by digitally requesting and verifying W-9s before the first vendor payment is released, with 1-click 1099 e-filing.
4. **Divvy Spend & Expense Cards**: Enforcing real-time budgets on property maintenance cards, eliminating receipt chasing and expense reports.
5. **"Just Send Me An Email"**: How to execute a permission-based pivot to uncover which headache matters before sending generic collateral.

---

### 📊 4. Post-Call Coaching Scorecard
Instant performance review when the call concludes:
- **0–100 Score & Letter Grade** (A+, A, B, C, Needs Work).
- **Talk-to-Listen Ratio**: Word count and percentage breakdown vs benchmark.
- **Competencies Checklist**: Upfront contract, AP automation, Check elimination, W-9/1099 compliance, Divvy spend cards, Stakeholder discovery, and Closed next step.
- **Annotated Transcript**: Turn-by-turn breakdown with green tags for strong wedges and warnings for pitch monologues.
- **Auto-Generated Follow-Up Email**: 1-click copyable follow-up email personalized to the conversation.

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React
- **Audio Layer**: Web Speech API (SpeechRecognition & SpeechSynthesis), Web Audio API (OscillatorNode, AnalyserNode)
- **AI Engine**: Hybrid architecture with built-in zero-key contextual roleplay engine + optional Google Gemini / OpenAI API integration

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Google Chrome or Microsoft Edge (for full Web Speech API support)

### Installation
```bash
git clone https://github.com/sbearor83-droid/cold_discovery-trainer.git
cd cold_discovery-trainer
npm install
```

### Run Locally
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser and allow microphone permissions!
