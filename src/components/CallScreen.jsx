import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ShieldAlert,
  Send,
  User,
  Building,
  Users,
  Timer,
  Sparkles,
  Info,
  HandMetal
} from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';
import BattlecardsPanel from './BattlecardsPanel';
import { audioEngine } from '../services/audioEngine';
import { generateProspectReply } from '../services/salesEngine';

export default function CallScreen({
  scenario,
  settings,
  onEndCall
}) {
  const [callStatus, setCallStatus] = useState('ringing'); // 'ringing' | 'connected' | 'ended'
  const [callDuration, setCallDuration] = useState(0);
  const [transcript, setTranscript] = useState([]);
  const [liveRepSpeech, setLiveRepSpeech] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProspectSpeaking, setIsProspectSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showBattlecards, setShowBattlecards] = useState(true);
  const [isThinking, setIsThinking] = useState(false);

  const transcriptEndRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, liveRepSpeech]);

  // Start Call Lifecycle
  useEffect(() => {
    let isCancelled = false;

    // 1. Initialize Mic & Speech Recognition
    audioEngine.speechRate = settings.speechRate || 1.0;
    audioEngine.speechPitch = settings.speechPitch || 1.0;
    audioEngine.pushToTalkMode = settings.inputMode === 'push-to-talk';
    audioEngine.silenceThresholdMs = settings.silenceDelay || 1300;

    audioEngine.initMicrophone();
    audioEngine.setupRecognition();

    // Hook listeners
    audioEngine.onTranscriptUpdate = (text) => {
      if (!isMutedRef.current) {
        setLiveRepSpeech(text);
      }
    };

    audioEngine.onUserSpeechEnd = (finalSpeech) => {
      if (!isMutedRef.current && finalSpeech.trim()) {
        handleUserSpeechCommitted(finalSpeech);
      }
    };

    audioEngine.onProspectSpeakingStart = () => {
      setIsProspectSpeaking(true);
    };

    audioEngine.onProspectSpeakingEnd = () => {
      setIsProspectSpeaking(false);
      // Resume listening to user after prospect finishes talking
      if (!audioEngine.pushToTalkMode && !isMutedRef.current) {
        audioEngine.startListening();
      }
    };

    // 2. Play Ringing sound
    audioEngine.playRinging(3, () => {
      if (isCancelled) return;

      // Connected!
      setCallStatus('connected');
      startTimer();

      // Prospect gives initial greeting
      const greeting = scenario.initialGreeting;
      setTranscript([{ role: 'assistant', text: greeting, timestamp: Date.now() }]);

      // Speak greeting
      audioEngine.speak(greeting, {
        voiceType: scenario.voiceType,
        rate: scenario.voiceRate || 1.0,
        pitch: scenario.voicePitch || 1.0
      });
    });

    return () => {
      isCancelled = true;
      audioEngine.cleanup();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [scenario]);

  const startTimer = () => {
    timerIntervalRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // When user speech is committed (either via silence detection, push-to-talk release, or Send click)
  const handleUserSpeechCommitted = async (speechText) => {
    if (!speechText.trim() || isThinking) return;

    setLiveRepSpeech('');
    const newTranscript = [...transcript, { role: 'user', text: speechText.trim(), timestamp: Date.now() }];
    setTranscript(newTranscript);

    // Stop listening temporarily while AI prospect thinks and speaks
    audioEngine.stopListening();
    setIsThinking(true);

    try {
      const prospectReply = await generateProspectReply({
        scenario,
        conversationHistory: newTranscript,
        userSpeech: speechText.trim(),
        apiKey: settings.apiKey,
        apiProvider: settings.apiProvider
      });

      setIsThinking(false);

      if (prospectReply) {
        const updatedTranscript = [
          ...newTranscript,
          { role: 'assistant', text: prospectReply, timestamp: Date.now() }
        ];
        setTranscript(updatedTranscript);

        // Speak reply
        audioEngine.speak(prospectReply, {
          voiceType: scenario.voiceType,
          rate: scenario.voiceRate || 1.0,
          pitch: scenario.voicePitch || 1.0
        });
      }
    } catch (err) {
      console.error('Failed to generate prospect reply:', err);
      setIsThinking(false);
      if (!audioEngine.pushToTalkMode) {
        audioEngine.startListening();
      }
    }
  };

  // Mute / Unmute
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      audioEngine.stopListening();
      setIsListening(false);
    } else {
      audioEngine.startListening();
      setIsListening(true);
    }
  };

  // Interrupt prospect if speaking
  const handleInterrupt = () => {
    if (isProspectSpeaking) {
      audioEngine.stopSpeaking();
      setIsProspectSpeaking(false);
      if (!isMuted) {
        audioEngine.startListening();
        setIsListening(true);
      }
    }
  };

  // End Call & Trigger Coaching Scorecard
  const handleHangup = () => {
    audioEngine.cleanup();
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setCallStatus('ended');
    onEndCall({
      scenario,
      transcript,
      callDurationSeconds: callDuration
    });
  };

  // Manual trigger if user prefers clicking Send
  const handleManualSend = () => {
    if (liveRepSpeech.trim()) {
      handleUserSpeechCommitted(liveRepSpeech);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto px-4 py-4 gap-4">
      {/* Top Banner: Prospect Profile & Call Status */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
        {/* Prospect Details */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
            {scenario.prospectName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">{scenario.prospectName}</h2>
              <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {scenario.targetRole}
              </span>
              <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                scenario.difficulty === 'hard'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : scenario.difficulty === 'medium'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {scenario.difficulty}
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{scenario.prospectTitle}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Building className="w-3 h-3 text-slate-500" />
                {scenario.firmName} ({scenario.firmSize})
              </span>
            </div>
          </div>
        </div>

        {/* Call Timer & Battlecard Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-sky-400">
            <Timer className="w-4 h-4 text-sky-400 animate-pulse" />
            <span>{formatTimer(callDuration)}</span>
          </div>

          <button
            onClick={() => setShowBattlecards(!showBattlecards)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              showBattlecards
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
            <span>{showBattlecards ? 'Hide Battlecards' : 'Show Battlecards'}</span>
          </button>

          {/* Big Hangup Button */}
          <button
            onClick={handleHangup}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all active:scale-95"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call & Grade</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Call Visualizer & Conversation vs. Battlecards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[500px]">
        {/* Left Column: Visualizer, Live Audio & Transcript (8 or 12 cols) */}
        <div className={`flex flex-col gap-3 transition-all ${showBattlecards ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          {/* Dual Audio Visualizer */}
          <AudioVisualizer
            isCallActive={callStatus === 'connected'}
            isListening={isListening || (!isProspectSpeaking && callStatus === 'connected')}
            isProspectSpeaking={isProspectSpeaking}
            isRinging={callStatus === 'ringing'}
          />

          {/* Transcript / Conversation History Box */}
          <div className="flex-1 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Live Call Dialogue
              </span>
              {isProspectSpeaking && (
                <button
                  onClick={handleInterrupt}
                  className="text-[11px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg hover:bg-amber-500/20 transition-all flex items-center gap-1"
                >
                  <HandMetal className="w-3 h-3" />
                  <span>Interrupt / Barge-in</span>
                </button>
              )}
            </div>

            {/* Conversation Flow */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 max-h-[340px]">
              {transcript.map((msg, index) => {
                const isRep = msg.role === 'user';
                return (
                  <div
                    key={index}
                    className={`flex flex-col ${isRep ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1 font-semibold">
                      {isRep ? (
                        <>
                          <span>YOU (BILL AE)</span>
                          <User className="w-3 h-3 text-sky-400" />
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 text-emerald-400" />
                          <span>{scenario.prospectName} ({scenario.targetRole})</span>
                        </>
                      )}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-md ${
                        isRep
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {/* AI Prospect Thinking Indicator */}
              {isThinking && (
                <div className="flex items-start">
                  <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs text-slate-400 flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span>{scenario.prospectName} is responding...</span>
                  </div>
                </div>
              )}

              <div ref={transcriptEndRef} />
            </div>

            {/* Live User Speech Buffer & Mic Bar */}
            <div className="pt-3 mt-2 border-t border-slate-800">
              <div className="flex items-center gap-2 bg-slate-950/90 rounded-xl border border-slate-800 p-2.5">
                <button
                  onClick={toggleMute}
                  title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
                  className={`p-2 rounded-lg transition-all ${
                    isMuted
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  }`}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <div className="flex-1 text-xs">
                  {liveRepSpeech ? (
                    <span className="text-sky-300 font-medium">{liveRepSpeech}</span>
                  ) : (
                    <span className="text-slate-500 italic">
                      {isProspectSpeaking
                        ? `${scenario.prospectName} is speaking (speak or click Interrupt to cut in)...`
                        : settings.inputMode === 'push-to-talk'
                        ? 'Push-to-Talk mode active: Hold Spacebar or click Send to speak.'
                        : 'Hands-Free Voice Active: Just speak naturally into your mic...'}
                    </span>
                  )}
                </div>

                {liveRepSpeech && (
                  <button
                    onClick={handleManualSend}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    <span>Send</span>
                    <Send className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: In-Call Objection Battlecards (4 cols) */}
        {showBattlecards && (
          <div className="lg:col-span-4 h-full">
            <BattlecardsPanel
              isOpen={showBattlecards}
              onClose={() => setShowBattlecards(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
