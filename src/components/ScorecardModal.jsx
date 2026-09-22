import React, { useState } from 'react';
import {
  Award,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  UserCheck,
  TrendingUp,
  MessageSquare,
  Mail,
  ChevronRight
} from 'lucide-react';
import { evaluateCallSession } from '../services/coachEngine';

export default function ScorecardModal({
  callData, // { scenario, transcript, callDurationSeconds }
  onRetry,
  onClose
}) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'transcript' | 'email'

  if (!callData) return null;

  const analysis = evaluateCallSession(callData);
  const { scenario } = callData;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(analysis.followUpEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (grade.startsWith('B')) return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    if (grade.startsWith('C')) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                POST-CALL COACHING SCORECARD
              </div>
              <h2 className="text-xl font-extrabold text-white">
                Call with {scenario.prospectName} ({scenario.firmName})
              </h2>
            </div>
          </div>

          {/* Big Grade & Score Badge */}
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-2xl border text-center ${getGradeColor(analysis.grade)}`}>
              <div className="text-xs uppercase font-bold tracking-wider">Grade</div>
              <div className="text-2xl font-black">{analysis.grade}</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-2xl text-center">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Score</div>
              <div className="text-2xl font-black text-white">{analysis.score}<span className="text-xs text-slate-500 font-normal">/100</span></div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('summary')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'summary'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Coaching Breakdown</span>
          </button>

          <button
            onClick={() => setActiveTab('transcript')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'transcript'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Annotated Transcript ({analysis.annotatedTranscript.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'email'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Draft Follow-Up Email</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {activeTab === 'summary' && (
            <>
              {/* Talk-to-Listen Ratio Bar */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-sky-400">You Talked: {analysis.repTalkPercentage}% ({analysis.repWordCount} words)</span>
                  <span className="text-slate-400 text-[11px]">
                    {scenario.type === 'cold-call' ? 'Target: ~55-65% Rep' : 'Target: ~35-45% Rep (Listen 60% on Discovery)'}
                  </span>
                  <span className="text-emerald-400">Prospect Talked: {analysis.prospectTalkPercentage}% ({analysis.prospectWordCount} words)</span>
                </div>

                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${analysis.repTalkPercentage}%` }}
                    className="bg-blue-500 transition-all duration-500"
                  />
                  <div
                    style={{ width: `${analysis.prospectTalkPercentage}%` }}
                    className="bg-emerald-500 transition-all duration-500"
                  />
                </div>
              </div>

              {/* Competencies Checklist */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Key Sales Competencies Evaluated
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                    {analysis.checks.permissionHook ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-semibold text-slate-200">Upfront Contract / Hook</div>
                      <div className="text-[11px] text-slate-400">Established reason for call & asked for 30s</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                    {analysis.checks.apAutomation ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-semibold text-slate-200">AP Automation & Approvals</div>
                      <div className="text-[11px] text-slate-400">Addressed invoice entry & approval bottlenecks</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                    {analysis.checks.taxCompliance ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-semibold text-slate-200">W-9 Chasing & 1099 Relief</div>
                      <div className="text-[11px] text-slate-400">Mentioned automated W-9 digital collection</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                    {analysis.checks.spendManagement ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-semibold text-slate-200">Divvy Spend & Expense Cards</div>
                      <div className="text-[11px] text-slate-400">Introduced real-time budget controls on cards</div>
                    </div>
                  </div>

                  {/* STAKEHOLDER DISCOVERY BADGE */}
                  <div className={`flex items-center gap-2 p-2 rounded-xl border ${
                    analysis.checks.stakeholdersAsked
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}>
                    {analysis.checks.stakeholdersAsked ? (
                      <UserCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <span>Stakeholder Discovery</span>
                        {scenario.type === 'discovery' && (
                          <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-bold">
                            CRITICAL FOR DISCOVERY
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {analysis.checks.stakeholdersAsked
                          ? 'Asked who else needs to be on the call / signs off!'
                          : 'Missed asking who else is involved in the decision.'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                    {analysis.checks.closedNextStep ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-semibold text-slate-200">Firm Next Step Commitment</div>
                      <div className="text-[11px] text-slate-400">Proposed specific date/time for walkthrough</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4 space-y-2">
                  <div className="font-bold text-emerald-400 text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> What You Did Well
                  </div>
                  <ul className="space-y-1.5 text-slate-300 text-[11px]">
                    {analysis.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-4 space-y-2">
                  <div className="font-bold text-amber-400 text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Areas For Improvement
                  </div>
                  <ul className="space-y-1.5 text-slate-300 text-[11px]">
                    {analysis.improvements.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          {activeTab === 'transcript' && (
            <div className="space-y-3">
              <div className="text-slate-400 text-xs">
                Review your conversation turn-by-turn with automated coaching callouts.
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
                {analysis.annotatedTranscript.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border ${
                      item.role === 'user'
                        ? 'bg-blue-950/20 border-blue-900/40 ml-4'
                        : 'bg-slate-900/80 border-slate-800 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <span>{item.role === 'user' ? 'YOU (BILL AE)' : `${scenario.prospectName} (${scenario.targetRole})`}</span>
                    </div>
                    <p className="text-slate-200 text-xs leading-relaxed">
                      {item.text}
                    </p>

                    {item.annotation && (
                      <div className={`mt-2 p-2 rounded-xl text-[11px] font-medium border ${
                        item.type === 'positive'
                          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                          : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                      }`}>
                        {item.annotation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs">
                  Automated follow-up email customized to this call:
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Copied to Clipboard!' : 'Copy Email Draft'}</span>
                </button>
              </div>

              <pre className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-300 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                {analysis.followUpEmail}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950/90 border-t border-slate-800 p-4 px-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all"
          >
            ← Back to Scenarios
          </button>

          <button
            onClick={onRetry}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice This Call Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
