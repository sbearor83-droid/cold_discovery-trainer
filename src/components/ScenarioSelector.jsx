import React, { useState } from 'react';
import { SCENARIOS } from '../services/billDomain';
import {
  PhoneCall,
  Users,
  Building2,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Sliders,
  Sparkles,
  Search,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

export default function ScenarioSelector({ onSelectScenario }) {
  const [activeTab, setActiveTab] = useState('cold-call'); // 'cold-call' | 'discovery' | 'custom'
  const [targetRole, setTargetRole] = useState('all'); // 'all' | 'gatekeeper' | 'decision-maker'
  const [difficulty, setDifficulty] = useState('all'); // 'all' | 'easy' | 'medium' | 'hard'
  const [icpFilter, setIcpFilter] = useState('all'); // 'all' | 'accounting' | 'property'

  // Custom scenario state
  const [customForm, setCustomForm] = useState({
    title: 'Custom Accounting Firm Practice',
    prospectName: 'Sarah Jenkins',
    prospectTitle: 'Managing Partner',
    firmName: 'Apex Advisors LLC',
    firmType: 'Accounting & CAS Firm',
    firmSize: '15 employees, 45 clients',
    type: 'cold-call',
    targetRole: 'decision-maker',
    difficulty: 'medium',
    context: 'Uses QuickBooks Online for bill pay, but bookkeepers spend 12 hours a week manually chasing check signatures.',
    initialGreeting: 'This is Sarah. Make it quick, I have a client meeting in two minutes.',
    temperament: 'Busy and skeptical of new software tools.',
    painPoints: ['Manual check signing', 'Chasing client approvals', '1099 season panic'],
    hiddenStakeholders: ['Sarah Jenkins', 'David (Tax Partner)']
  });

  // Filter scenarios
  const filteredScenarios = SCENARIOS.filter((s) => {
    if (s.type !== activeTab) return false;
    if (activeTab === 'cold-call' && targetRole !== 'all' && s.targetRole !== targetRole) return false;
    if (difficulty !== 'all' && s.difficulty !== difficulty) return false;
    if (icpFilter === 'accounting' && !s.firmType.toLowerCase().includes('accounting')) return false;
    if (icpFilter === 'property' && !s.firmType.toLowerCase().includes('property')) return false;
    return true;
  });

  const handleStartCustom = () => {
    onSelectScenario({
      ...customForm,
      id: `custom-${Date.now()}`,
      voiceType: customForm.targetRole === 'gatekeeper' ? 'friendly-female' : 'busy-female',
      voicePitch: 1.0,
      voiceRate: 1.0
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner / Goal Description */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-800/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              BILL ACCOUNTING CHANNEL LIVE TRAINER
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Cold Call & Discovery Call Voice Simulator
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl">
              Real-time voice practice tailored for your core ICPs (Accounting/CAS & Property Management firms ≤ 25 employees). Master objections around QuickBooks Bill Pay, paper checks, 1099/W-9 chaos, and Divvy spend cards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 text-center min-w-[110px]">
              <div className="text-xs text-slate-400 font-semibold">Your Role</div>
              <div className="text-sm font-extrabold text-sky-400">BILL AE</div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 text-center min-w-[120px]">
              <div className="text-xs text-slate-400 font-semibold">Target ICP</div>
              <div className="text-sm font-extrabold text-emerald-400">Firms ≤ 25 Emp</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => { setActiveTab('cold-call'); setTargetRole('all'); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'cold-call'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Cold Call Simulator</span>
          </button>

          <button
            onClick={() => { setActiveTab('discovery'); setTargetRole('decision-maker'); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'discovery'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Discovery Call Trainer</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'custom'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Custom Scenario Builder</span>
          </button>
        </div>
      </div>

      {/* Discovery Challenge Alert Banner */}
      {activeTab === 'discovery' && (
        <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-indigo-200">
          <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white">Discovery Call Training Objective: </span>
            Uncover the prospect's AP bottlenecks, paper check risks, and 1099/W-9 headaches—and <span className="font-semibold text-sky-300">discover who else on their leadership or operations team needs to be on the demo call</span>. The post-call coach checks whether you successfully uncovered other decision-makers!
          </div>
        </div>
      )}

      {/* Filter Toolbar (for Cold Call & Discovery) */}
      {activeTab !== 'custom' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Target Role Filter (Cold Call only) */}
            {activeTab === 'cold-call' && (
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 px-2">Contact:</span>
                <button
                  onClick={() => setTargetRole('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    targetRole === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTargetRole('gatekeeper')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    targetRole === 'gatekeeper' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Gatekeeper
                </button>
                <button
                  onClick={() => setTargetRole('decision-maker')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    targetRole === 'decision-maker' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Decision Maker
                </button>
              </div>
            )}

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 px-2">Difficulty:</span>
              <button
                onClick={() => setDifficulty('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  difficulty === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDifficulty('easy')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  difficulty === 'easy' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:bg-emerald-950/40'
                }`}
              >
                Easy
              </button>
              <button
                onClick={() => setDifficulty('medium')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  difficulty === 'medium' ? 'bg-amber-600 text-white' : 'text-amber-400 hover:bg-amber-950/40'
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => setDifficulty('hard')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  difficulty === 'hard' ? 'bg-rose-600 text-white' : 'text-rose-400 hover:bg-rose-950/40'
                }`}
              >
                Hard
              </button>
            </div>

            {/* ICP Filter */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 px-2">ICP:</span>
              <button
                onClick={() => setIcpFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  icpFilter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setIcpFilter('accounting')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  icpFilter === 'accounting' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Accounting / CAS
              </button>
              <button
                onClick={() => setIcpFilter('property')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  icpFilter === 'property' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Property Mgmt
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing <span className="font-bold text-white">{filteredScenarios.length}</span> practice scenario{filteredScenarios.length === 1 ? '' : 's'}
          </div>
        </div>
      )}

      {/* Scenarios Grid */}
      {activeTab !== 'custom' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScenarios.map((scenario) => {
            const isHard = scenario.difficulty === 'hard';
            const isMed = scenario.difficulty === 'medium';
            const isGK = scenario.targetRole === 'gatekeeper';

            return (
              <div
                key={scenario.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 group backdrop-blur-md"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {isGK ? 'Gatekeeper' : 'Decision Maker'}
                    </span>
                    <span
                      className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        isHard
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : isMed
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {scenario.difficulty}
                    </span>
                  </div>

                  {/* Prospect Header */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                      {scenario.title}
                    </h3>
                    <div className="text-xs font-semibold text-slate-300 mt-1">
                      {scenario.prospectName} • <span className="text-slate-400 font-normal">{scenario.prospectTitle}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{scenario.firmName} ({scenario.firmSize})</span>
                    </div>
                  </div>

                  {/* Context & Opening Greeting Preview */}
                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-xs space-y-2">
                    <p className="text-slate-400 line-clamp-2">
                      {scenario.context}
                    </p>
                    <div className="text-amber-400/90 italic font-mono text-[11px] border-t border-slate-800/60 pt-1.5">
                      "{scenario.initialGreeting}"
                    </div>
                  </div>

                  {/* Pain Points Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {scenario.painPoints.map((pain, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60"
                      >
                        {pain}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Call Action Button */}
                <button
                  onClick={() => onSelectScenario(scenario)}
                  className="mt-5 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-98 transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {scenario.prospectName.split(' ')[0]}</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* Custom Scenario Builder Form */
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl max-w-3xl mx-auto space-y-5 backdrop-blur-md">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Create Custom Roleplay Practice</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Scenario Title</label>
              <input
                type="text"
                value={customForm.title}
                onChange={(e) => setCustomForm({ ...customForm, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Firm Name & Size</label>
              <input
                type="text"
                value={customForm.firmName}
                onChange={(e) => setCustomForm({ ...customForm, firmName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Prospect Name & Title</label>
              <input
                type="text"
                value={customForm.prospectName}
                onChange={(e) => setCustomForm({ ...customForm, prospectName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Call Type</label>
              <select
                value={customForm.type}
                onChange={(e) => setCustomForm({ ...customForm, type: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="cold-call">Cold Call</option>
                <option value="discovery">Discovery Call</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Target Contact</label>
              <select
                value={customForm.targetRole}
                onChange={(e) => setCustomForm({ ...customForm, targetRole: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="decision-maker">Decision Maker (Partner / Owner)</option>
                <option value="gatekeeper">Gatekeeper (Office Manager / Assistant)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Difficulty</label>
              <select
                value={customForm.difficulty}
                onChange={(e) => setCustomForm({ ...customForm, difficulty: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="easy">Easy (Open, Cooperative)</option>
                <option value="medium">Medium (Busy, Typical Objections)</option>
                <option value="hard">Hard (Brutal Skeptic, Defensive)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-400 font-semibold mb-1">Opening Greeting When They Pick Up</label>
              <input
                type="text"
                value={customForm.initialGreeting}
                onChange={(e) => setCustomForm({ ...customForm, initialGreeting: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-400 font-semibold mb-1">Background Context / Current Setup</label>
              <textarea
                rows={2}
                value={customForm.context}
                onChange={(e) => setCustomForm({ ...customForm, context: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleStartCustom}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Launch Custom Live Call</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
