import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ScenarioSelector from './components/ScenarioSelector';
import CallScreen from './components/CallScreen';
import ScorecardModal from './components/ScorecardModal';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [activeScenario, setActiveScenario] = useState(null);
  const [callEndedData, setCallEndedData] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings from localStorage or defaults
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('callcraft_settings');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      apiKey: '',
      apiProvider: 'gemini',
      inputMode: 'hands-free',
      silenceDelay: 1300,
      speechRate: 1.0,
      speechPitch: 1.0
    };
  });

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('callcraft_settings', JSON.stringify(newSettings));
    } catch (_) {}
  };

  const handleSelectScenario = (scenario) => {
    setCallEndedData(null);
    setActiveScenario(scenario);
  };

  const handleEndCall = (data) => {
    setCallEndedData(data);
  };

  const handleRetryCall = () => {
    const currentScenario = callEndedData?.scenario || activeScenario;
    setCallEndedData(null);
    // Force re-mount of CallScreen
    setActiveScenario(null);
    setTimeout(() => {
      setActiveScenario(currentScenario);
    }, 50);
  };

  const handleCloseScorecard = () => {
    setCallEndedData(null);
    setActiveScenario(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navigation Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        isCallActive={Boolean(activeScenario && !callEndedData)}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {!activeScenario ? (
          <ScenarioSelector onSelectScenario={handleSelectScenario} />
        ) : (
          <CallScreen
            scenario={activeScenario}
            settings={settings}
            onEndCall={handleEndCall}
          />
        )}
      </main>

      {/* Post-Call Coaching Scorecard Modal */}
      {callEndedData && (
        <ScorecardModal
          callData={callEndedData}
          onRetry={handleRetryCall}
          onClose={handleCloseScorecard}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onSave={handleSaveSettings}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
