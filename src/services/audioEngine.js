// CallCraft Live Voice Engine
// Handles: Speech Recognition (STT), Speech Synthesis (TTS), Sound Effects (DTMF, Ringing),
// Web Audio API Frequency Analysis for Visualizers, and Barge-In/Interruption support.

class AudioEngine {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis || null;
    this.audioCtx = null;
    this.micStream = null;
    this.analyser = null;
    this.dataArray = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.isRinging = false;
    this.ringInterval = null;

    // Callbacks
    this.onTranscriptUpdate = null;
    this.onUserSpeechEnd = null;
    this.onProspectSpeakingStart = null;
    this.onProspectSpeakingEnd = null;
    this.onStateChange = null;

    // Config
    this.silenceTimer = null;
    this.silenceThresholdMs = 1400; // ms of silence before prospect responds
    this.currentTranscript = '';
    this.voices = [];
    this.selectedVoice = null;
    this.speechRate = 1.0;
    this.speechPitch = 1.0;
    this.pushToTalkMode = false;
    this.bargeInEnabled = true;

    this.initVoices();
  }

  initVoices() {
    if (!this.synthesis) return;
    const loadVoices = () => {
      this.voices = this.synthesis.getVoices().filter(v => v.lang.startsWith('en'));
    };
    loadVoices();
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = loadVoices;
    }
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Initialize Microphone & Analyser for visualizer
  async initMicrophone() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return false;

      if (!this.micStream) {
        this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      }

      const source = ctx.createMediaStreamSource(this.micStream);
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      return true;
    } catch (err) {
      console.warn('Microphone permission or audio context error:', err);
      return false;
    }
  }

  // Real-time audio energy (0 to 100) for visualizer
  getMicVolume() {
    if (!this.analyser || !this.dataArray) return 0;
    this.analyser.getByteFrequencyData(this.dataArray);
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }
    const avg = sum / this.dataArray.length;
    return Math.min(100, Math.round((avg / 255) * 100 * 2.2));
  }

  // Setup Speech Recognition
  setupRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API is not supported in this browser.');
      return false;
    }

    if (this.recognition) {
      try { this.recognition.abort(); } catch (_) {}
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStateChange) this.onStateChange({ isListening: true });
    };

    this.recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      const activeText = final || interim;
      if (activeText.trim()) {
        this.currentTranscript = activeText.trim();
        if (this.onTranscriptUpdate) {
          this.onTranscriptUpdate(this.currentTranscript, false);
        }

        // Barge-in check: If user speaks while prospect is speaking, interrupt the prospect!
        if (this.bargeInEnabled && this.isSpeaking) {
          this.stopSpeaking();
        }

        // Silence detection for auto-turn-taking
        if (!this.pushToTalkMode) {
          if (this.silenceTimer) clearTimeout(this.silenceTimer);
          this.silenceTimer = setTimeout(() => {
            this.commitUserTurn();
          }, this.silenceThresholdMs);
        }
      }
    };

    this.recognition.onerror = (event) => {
      // Don't treat 'no-speech' or 'aborted' as fatal
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.warn('Speech recognition error:', event.error);
      }
    };

    this.recognition.onend = () => {
      // If we are supposed to be listening (and not in ring/disconnected mode), restart recognition
      if (this.isListening && !this.pushToTalkMode) {
        try {
          this.recognition.start();
        } catch (_) {}
      }
    };

    return true;
  }

  startListening() {
    if (!this.recognition) {
      this.setupRecognition();
    }
    this.currentTranscript = '';
    this.isListening = true;
    try {
      this.recognition.start();
    } catch (_) {
      // If already started, ignore
    }
    if (this.onStateChange) this.onStateChange({ isListening: true });
  }

  stopListening() {
    this.isListening = false;
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (_) {}
    }
    if (this.onStateChange) this.onStateChange({ isListening: false });
  }

  commitUserTurn() {
    if (!this.currentTranscript.trim()) return;
    const finalSpeech = this.currentTranscript.trim();
    this.currentTranscript = '';
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    if (this.onUserSpeechEnd) {
      this.onUserSpeechEnd(finalSpeech);
    }
  }

  // Speak prospect reply with synthesized voice
  speak(text, options = {}) {
    if (!this.synthesis) return;

    // Stop any ongoing speech
    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || this.speechRate;
    utterance.pitch = options.pitch || this.speechPitch;

    // Find best voice match based on gender / persona preference
    if (this.voices.length > 0) {
      let matchedVoice = null;
      if (options.voiceType === 'friendly-female' || options.voiceType === 'busy-female' || options.voiceType === 'stern-female') {
        matchedVoice = this.voices.find(v => v.name.includes('Zira') || v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('Google US English'));
      } else {
        matchedVoice = this.voices.find(v => v.name.includes('David') || v.name.includes('Male') || v.name.includes('Mark') || v.name.includes('Guy') || v.name.includes('Natural'));
      }
      utterance.voice = matchedVoice || this.voices[0];
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onProspectSpeakingStart) this.onProspectSpeakingStart();
      if (this.onStateChange) this.onStateChange({ isSpeaking: true });
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.onProspectSpeakingEnd) this.onProspectSpeakingEnd();
      if (this.onStateChange) this.onStateChange({ isSpeaking: false });
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      if (this.onProspectSpeakingEnd) this.onProspectSpeakingEnd();
      if (this.onStateChange) this.onStateChange({ isSpeaking: false });
    };

    this.synthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.synthesis && this.synthesis.speaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
      if (this.onProspectSpeakingEnd) this.onProspectSpeakingEnd();
      if (this.onStateChange) this.onStateChange({ isSpeaking: false });
    }
  }

  // Phone Ring Tone Generator (Synthesized US Ringback: 440Hz + 480Hz)
  playRinging(durationSeconds = 4, onComplete = null) {
    const ctx = this.getAudioContext();
    if (!ctx) {
      setTimeout(() => { if (onComplete) onComplete(); }, 2000);
      return;
    }

    this.isRinging = true;
    let elapsed = 0;

    const ringBurst = () => {
      if (!this.isRinging) return;
      try {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.frequency.value = 440;
        osc2.frequency.value = 480;

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime + 1.6);
        gainNode.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1.8);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start(ctx.currentTime);
        osc2.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 1.85);
        osc2.stop(ctx.currentTime + 1.85);
      } catch (e) {
        console.warn('Ring burst sound error:', e);
      }
    };

    ringBurst();
    this.ringInterval = setInterval(() => {
      elapsed += 3;
      if (elapsed >= durationSeconds || !this.isRinging) {
        this.stopRinging();
        this.playPickupSound();
        if (onComplete) onComplete();
      } else {
        ringBurst();
      }
    }, 3000);
  }

  stopRinging() {
    this.isRinging = false;
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
  }

  // Phone Pick-Up "Click" Sound Effect
  playPickupSound() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.09);
    } catch (_) {}
  }

  // DTMF Keypress Tone (for dialing effect)
  playDtmfTone(freq1 = 697, freq2 = 1209, duration = 0.12) {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.value = freq1;
      osc2.frequency.value = freq2;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + duration);
      osc2.stop(ctx.currentTime + duration);
    } catch (_) {}
  }

  cleanup() {
    this.stopListening();
    this.stopSpeaking();
    this.stopRinging();
    if (this.micStream) {
      this.micStream.getTracks().forEach(t => t.stop());
      this.micStream = null;
    }
  }
}

export const audioEngine = new AudioEngine();
