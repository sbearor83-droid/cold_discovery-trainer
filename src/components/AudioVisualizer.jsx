import React, { useEffect, useRef } from 'react';
import { Mic, Volume2, PhoneCall } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

export default function AudioVisualizer({
  isCallActive = false,
  isListening = false,
  isProspectSpeaking = false,
  isRinging = false
}) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw middle dividing line
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      const numBars = 32;
      const barWidth = 4;
      const gap = 3;

      // Get real mic level if listening, or synthesize wave if ringing/speaking
      const micLevel = isListening ? audioEngine.getMicVolume() : 0;

      // LEFT SIDE: USER / REP (Blue / Cyan)
      for (let i = 0; i < numBars; i++) {
        const x = (width / 2) - 30 - (i * (barWidth + gap));
        if (x < 10) break;

        let barHeight = 4;
        if (isListening && micLevel > 5) {
          const wave = Math.sin((Date.now() / 150) + i * 0.4) * 0.5 + 0.5;
          barHeight = Math.max(4, (micLevel / 100) * 45 * wave);
        }

        ctx.fillStyle = isListening && micLevel > 10 ? '#38bdf8' : '#1e3a8a';
        ctx.fillRect(x - barWidth, centerY - (barHeight / 2), barWidth, barHeight);
      }

      // RIGHT SIDE: PROSPECT (Emerald / Amber)
      for (let i = 0; i < numBars; i++) {
        const x = (width / 2) + 30 + (i * (barWidth + gap));
        if (x > width - 10) break;

        let barHeight = 4;
        if (isProspectSpeaking) {
          const wave = Math.sin((Date.now() / 130) + i * 0.35) * 0.5 + 0.5;
          barHeight = Math.max(6, 40 * wave);
        } else if (isRinging) {
          const pulse = Math.sin(Date.now() / 200) > 0 ? 15 : 4;
          barHeight = pulse;
        }

        ctx.fillStyle = isProspectSpeaking ? '#34d399' : (isRinging ? '#fbbf24' : '#064e3b');
        ctx.fillRect(x, centerY - (barHeight / 2), barWidth, barHeight);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isListening, isProspectSpeaking, isRinging]);

  return (
    <div className="relative w-full bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl backdrop-blur-md">
      {/* Header labels */}
      <div className="flex items-center justify-between text-xs font-semibold px-4 mb-2">
        <div className={`flex items-center gap-1.5 transition-colors ${isListening ? 'text-sky-400 font-bold' : 'text-slate-500'}`}>
          <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-sky-400 animate-ping' : 'bg-slate-700'}`} />
          <Mic className="w-3.5 h-3.5" />
          <span>YOU (BILL AE)</span>
        </div>

        {/* Center Status Badge */}
        <div className="px-3 py-1 rounded-full text-xs font-medium border">
          {isRinging && (
            <span className="text-amber-400 border-amber-500/30 bg-amber-500/10 flex items-center gap-1.5 animate-pulse">
              <PhoneCall className="w-3 h-3" /> Ringing...
            </span>
          )}
          {isProspectSpeaking && (
            <span className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 flex items-center gap-1.5">
              <Volume2 className="w-3 h-3 animate-bounce" /> Prospect Speaking
            </span>
          )}
          {isListening && !isProspectSpeaking && !isRinging && (
            <span className="text-sky-400 border-sky-500/30 bg-sky-500/10 flex items-center gap-1.5">
              <Mic className="w-3 h-3 animate-pulse" /> Listening to you...
            </span>
          )}
          {!isListening && !isProspectSpeaking && !isRinging && (
            <span className="text-slate-400 border-slate-700 bg-slate-800">
              Call Connected
            </span>
          )}
        </div>

        <div className={`flex items-center gap-1.5 transition-colors ${isProspectSpeaking ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
          <span>PROSPECT</span>
          <Volume2 className="w-3.5 h-3.5" />
          <div className={`w-2 h-2 rounded-full ${isProspectSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-slate-700'}`} />
        </div>
      </div>

      {/* Waveform Canvas */}
      <canvas
        ref={canvasRef}
        width={720}
        height={90}
        className="w-full h-20 rounded-xl bg-slate-950/80 border border-slate-800/80"
      />
    </div>
  );
}
