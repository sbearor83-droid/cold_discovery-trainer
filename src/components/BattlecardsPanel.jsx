import React, { useState } from 'react';
import { BILL_BATTLECARDS } from '../services/billDomain';
import { ShieldAlert, ChevronDown, ChevronUp, Zap, HelpCircle } from 'lucide-react';

export default function BattlecardsPanel({ isOpen, onClose }) {
  const [expandedId, setExpandedId] = useState('qbo-billpay');

  if (!isOpen) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col h-full max-h-[580px] overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-sm tracking-wide">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>IN-CALL OBJECTION BATTLECARDS</span>
        </div>
        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
          BILL Wedges
        </span>
      </div>

      <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 text-xs">
        {BILL_BATTLECARDS.map((card) => {
          const isExpanded = expandedId === card.id;

          return (
            <div
              key={card.id}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? 'border-blue-500/50 bg-blue-950/20 shadow-md shadow-blue-500/5'
                  : 'border-slate-800/80 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : card.id)}
                className="w-full text-left p-3 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {card.title}
                  </div>
                  <div className="text-[11px] text-amber-400/90 mt-0.5 font-medium italic">
                    "{card.trigger}"
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-800/60 space-y-2">
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-sky-300 mb-1">
                      <Zap className="w-3 h-3 text-amber-400" /> Value Wedge:
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {card.wedge}
                    </p>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-slate-400 mb-1">
                      Recommended Talk Tracks:
                    </div>
                    <ul className="space-y-1.5">
                      {card.talkTrack.map((line, idx) => (
                        <li
                          key={idx}
                          className="bg-blue-950/30 border border-blue-900/30 p-2 rounded-lg text-slate-200 text-[11px] leading-normal"
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-950 p-1.5 rounded">
                    <HelpCircle className="w-3 h-3 text-slate-500" />
                    <span>Prospect doubt: {card.prospectDoubt}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
