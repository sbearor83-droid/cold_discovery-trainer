import React, { useState } from 'react';
import { Settings, Key, Mic, Volume2, Save, X, Sparkles, Check } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

export default function SettingsModal({
  isOpen,
  settings,
  onSave,
  onClose
}) {
  const [formData, setFormData] = useState({ ...settings });
  const [testSpeaking, setTestSpeaking] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTestSpeech = () => {
    setTestSpeaking(true);
    audioEngine.speak('Hello! This is a test of the synthesized prospect voice for your BILL practice calls.', {
      rate: formData.speechRate || 1.0,
      pitch: formData.speechPitch || 1.0
    });
    setTimeout(() => setTestSpeaking(false), 3000);
  };

  const handleSave = () => {
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Settings className="w-5 h-5 text-blue-400" />
            <span>Voice & AI Practice Settings</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* AI Provider & API Key */}
          <div className="space-y-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-blue-400" />
                AI Roleplay Intelligence Key (Optional)
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Zero-Key Mode Ready
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              CallCraft works immediately out-of-the-box using the built-in local sales engine. If you have a Google Gemini or OpenAI API key, paste it here for fully unscripted generative roleplay.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, apiProvider: 'gemini' })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  formData.apiProvider === 'gemini'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Google Gemini</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, apiProvider: 'openai' })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  formData.apiProvider === 'openai'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>OpenAI</span>
              </button>
            </div>

            <input
              type="password"
              placeholder={formData.apiProvider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
              value={formData.apiKey || ''}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Voice Input Mode */}
          <div className="space-y-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-sky-400" />
              Microphone & Turn-Taking Mode
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, inputMode: 'hands-free' })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  formData.inputMode === 'hands-free'
                    ? 'bg-sky-600/20 border-sky-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs text-sky-300">Hands-Free (VAD)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Natural phone conversation. System detects when you pause and replies automatically.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, inputMode: 'push-to-talk' })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  formData.inputMode === 'push-to-talk'
                    ? 'bg-sky-600/20 border-sky-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs text-sky-300">Push-to-Talk</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Click Send or hold Spacebar. Best for noisy office or background chatter.
                </div>
              </button>
            </div>

            {formData.inputMode === 'hands-free' && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>Pause silence before prospect speaks:</span>
                  <span className="font-bold text-white">{((formData.silenceDelay || 1300) / 1000).toFixed(1)}s</span>
                </div>
                <input
                  type="range"
                  min="900"
                  max="2200"
                  step="100"
                  value={formData.silenceDelay || 1300}
                  onChange={(e) => setFormData({ ...formData, silenceDelay: parseInt(e.target.value) })}
                  className="w-full accent-blue-500"
                />
              </div>
            )}
          </div>

          {/* Voice Output Pitch & Speed */}
          <div className="space-y-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                Prospect Speech Rate
              </span>
              <button
                type="button"
                onClick={handleTestSpeech}
                disabled={testSpeaking}
                className="text-xs bg-slate-800 hover:bg-slate-750 px-2.5 py-1 rounded-lg text-slate-300 border border-slate-700 flex items-center gap-1"
              >
                <Volume2 className="w-3 h-3 text-emerald-400" />
                <span>{testSpeaking ? 'Testing...' : 'Test Voice'}</span>
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span>Speaking Speed:</span>
                <span className="font-bold text-white">{(formData.speechRate || 1.0).toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={formData.speechRate || 1.0}
                onChange={(e) => setFormData({ ...formData, speechRate: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-800 flex justify-end gap-2 bg-slate-950">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Settings Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
