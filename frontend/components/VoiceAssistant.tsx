import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, X, Activity } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

interface VoiceAssistantProps {
  onTranscript: (text: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onTranscript, isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState("Initializing...");
  const videoRef = useRef<HTMLVideoElement>(null); // For future video expansion
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [volume, setVolume] = useState(0);

  // Audio Contexts
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  
  // Initialize AI
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  useEffect(() => {
    if (isOpen && !isActive) {
      startSession();
    }
    return () => {
      stopSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const startSession = async () => {
    try {
      setStatus("Connecting to Gemini Live...");
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const inputCtx = inputContextRef.current;
      const outputCtx = outputContextRef.current;
      
      // Connect to Gemini Live
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus("Listening...");
            setIsActive(true);
            
            // Audio Process Setup
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              // Calculate volume for visualizer
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
              setVolume(Math.sqrt(sum / inputData.length) * 100);

              const pcm16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                pcm16[i] = inputData[i] * 32768;
              }
              
              const uint8 = new Uint8Array(pcm16.buffer);
              const base64 = btoa(String.fromCharCode.apply(null, Array.from(uint8)));
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  media: {
                    mimeType: "audio/pcm;rate=16000",
                    data: base64
                  }
                });
              });
            };
            
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            // Handle Audio Output
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && outputCtx) {
               playAudio(audioData, outputCtx);
            }
            
            // Handle Transcription (if enabled in config, though prompt didn't strictly require display of live transcript, good for debugging/UX)
            // Ideally we parse `msg.serverContent?.modelTurn` for text parts if available, or rely on audio.
            
            // Checking for turn complete to update symptom field in parent if we extracted text
            // Note: Native Audio API emphasizes audio-in/audio-out. Text extraction might need `inputAudioTranscription`.
          },
          onclose: () => {
            setStatus("Session Closed");
            setIsActive(false);
          },
          onerror: (e) => {
            console.error(e);
            setStatus("Error connecting.");
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          systemInstruction: "You are a helpful triage nurse assistant. Ask the patient briefly about their main symptoms, onset, and severity. Keep responses short and empathetic.",
        }
      });

    } catch (e) {
      console.error("Failed to start voice session", e);
      setStatus("Error accessing microphone.");
    }
  };

  const playAudio = async (base64: string, ctx: AudioContext) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    
    // Decode PCM 24000Hz 1 channel (approximate manual decode since createBuffer is cleaner for raw PCM)
    // Actually, the example code uses manual float conversion.
    const float32 = new Float32Array(bytes.length / 2);
    const dataInt16 = new Int16Array(bytes.buffer);
    
    for (let i = 0; i < dataInt16.length; i++) {
      float32[i] = dataInt16[i] / 32768.0;
    }

    const buffer = ctx.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    
    const now = ctx.currentTime;
    const start = Math.max(now, nextStartTimeRef.current);
    source.start(start);
    nextStartTimeRef.current = start + buffer.duration;
    
    sourcesRef.current.add(source);
    source.onended = () => sourcesRef.current.delete(source);
  };

  const stopSession = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    inputContextRef.current?.close();
    outputContextRef.current?.close();
    setIsActive(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <div className="flex flex-col items-center gap-6">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-red-100' : 'bg-gray-100'}`}>
             {isActive ? (
                 <div className="relative">
                     <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-25"></div>
                     <Mic size={40} className="text-red-600 relative z-10" />
                 </div>
             ) : (
                 <MicOff size={40} className="text-gray-400" />
             )}
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Voice Triage Assistant</h3>
            <p className="text-sm text-gray-500">{status}</p>
          </div>

          {/* Audio Visualizer Mock */}
          <div className="flex items-center gap-1 h-8">
            {[...Array(8)].map((_, i) => (
                <div 
                    key={i} 
                    className="w-2 bg-blue-500 rounded-full transition-all duration-75"
                    style={{ height: `${Math.max(10, Math.min(100, volume * (Math.random() + 0.5)))}%` }}
                />
            ))}
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 w-full text-center">
            Say: "I have chest pain and shortness of breath..."
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            End Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;