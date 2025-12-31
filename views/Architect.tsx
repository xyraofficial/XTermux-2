
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Loader2, Code, ShieldCheck, Cpu, Layers, Box, 
  Search, CheckCircle2, TerminalSquare, Command, Info
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from '../components/CodeBlock';
import { showToast } from '../components/Toast';

interface ArchitectResponse {
    scriptName: string;
    description: string;
    language: string;
    dependencies: string[];
    code: string;
    instructions: string;
}

const BUILD_PHASES = [
    { threshold: 20, label: 'Analyzing Prompt', icon: <Search size={24} /> },
    { threshold: 45, label: 'Synthesizing Layers', icon: <Layers size={24} /> },
    { threshold: 70, label: 'Forging Source', icon: <Code size={24} /> },
    { threshold: 90, label: 'Logical Optimization', icon: <Cpu size={24} /> },
    { threshold: 100, label: 'Finalizing Build', icon: <ShieldCheck size={24} /> },
];

const Architect: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ArchitectResponse | null>(null);
  const [isApiDone, setIsApiDone] = useState(false);
  const [pendingResult, setPendingResult] = useState<ArchitectResponse | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) {
        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
    }
  }, [result]);

  // Dynamic Progress Logic
  useEffect(() => {
    let interval: any;
    if (isGenerating) {
        interval = setInterval(() => {
            setProgress(prev => {
                // If API is done, rush to 100
                if (isApiDone) {
                    const next = prev + 10; 
                    return next > 100 ? 100 : next;
                }
                
                // If still waiting for API, slow down as it approaches 95%
                if (prev < 80) return prev + Math.floor(Math.random() * 2) + 1;
                if (prev < 95) return prev + 0.5;
                return prev; // Stay at 95 until API confirms
            });
        }, 100);
    } else {
        setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating, isApiDone]);

  // Handle Transition to Result
  useEffect(() => {
    if (progress >= 100 && isApiDone && pendingResult) {
        // Small delay for perceived completion
        const timer = setTimeout(() => {
            setResult(pendingResult);
            setIsGenerating(false);
            setIsApiDone(false);
            setPendingResult(null);
            showToast('Architecture Finished.', 'success');
        }, 400);
        return () => clearTimeout(timer);
    }
  }, [progress, isApiDone, pendingResult]);

  const getCurrentPhase = () => {
    const currentProgress = Math.floor(progress);
    for (let i = 0; i < BUILD_PHASES.length; i++) {
        if (currentProgress <= BUILD_PHASES[i].threshold) return BUILD_PHASES[i];
    }
    return BUILD_PHASES[BUILD_PHASES.length - 1];
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setResult(null);
    setProgress(0);
    setIsApiDone(false);
    setPendingResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `I need a professional script for Termux. User request: "${prompt}".
        
        CRITICAL RESPONSE FORMAT:
        You MUST return ONLY a valid JSON object.
        JSON Structure:
        {
          "scriptName": "String",
          "description": "Short explanation",
          "language": "bash/python",
          "dependencies": ["pkg1", "pkg2"],
          "code": "The full code here",
          "instructions": "Step-by-step markdown list on how to install and run this specific script."
        }
        
        Ensure "instructions" is NEVER empty and provides at least 3 clear steps.`,
        config: {
            responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text) as ArchitectResponse;
      setPendingResult(data);
      setIsApiDone(true);

    } catch (err) {
      console.error(err);
      showToast('Build sequence failed.', 'error');
      setIsGenerating(false);
    }
  };

  const currentPhase = getCurrentPhase();

  return (
    <div className="flex flex-col h-full bg-[#050505] relative overflow-hidden">
      {/* Background iOS Abstract */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[100px] rounded-full" />

      <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 relative z-10 no-scrollbar">
        {!result && !isGenerating && (
            <div className="mt-24 flex flex-col items-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl animate-pulse rounded-full" />
                    <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] flex items-center justify-center relative z-10 shadow-2xl">
                        <Command size={42} className="text-blue-400" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase md:text-5xl">X-Architect</h2>
                    <p className="text-zinc-500 text-sm max-w-xs mx-auto leading-relaxed font-medium">
                        Enter your vision. We will synthesize the core logic into an executable blueprint.
                    </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {['Auto Backup Tool', 'Network Guard', 'System Optimizer', 'File Encryptor'].map(tag => (
                        <button key={tag} onClick={() => setPrompt(tag)} className="px-5 py-2.5 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-blue-400 hover:border-blue-400/30 transition-all active:scale-95">
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {isGenerating && (
            <div className="h-full flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in-95 duration-700">
                {/* iOS Build Widget */}
                <div className="relative w-64 h-64 rounded-[4rem] bg-zinc-900/50 border border-zinc-800 backdrop-blur-3xl p-8 flex flex-col items-center justify-center shadow-2xl group overflow-hidden">
                    {/* Laser Scanner Effect */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] z-20 animate-[scan_2s_infinite_ease-in-out]" />
                    
                    <div className="relative z-10 text-blue-400 animate-bounce scale-125 mb-2">
                        {currentPhase.icon}
                    </div>
                    
                    <div className="mt-8 text-center z-10">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-2">
                            BUILDING {Math.floor(progress)}%
                        </p>
                        <h4 className="text-lg font-bold text-white tracking-tight transition-all duration-300">
                          {currentPhase.label}
                        </h4>
                    </div>
                    
                    {/* Inner Glass Ring */}
                    <div className="absolute inset-4 border border-zinc-800/30 rounded-[3.5rem] pointer-events-none" />
                </div>

                {/* Simplified Status Label */}
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isApiDone ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-blue-500 animate-ping'}`} />
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                        {isApiDone ? 'Blueprint Ready' : 'Processing Neural Logic...'}
                    </span>
                </div>
            </div>
        )}

        {result && (
            <div ref={resultRef} className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                {/* Result Hero Card */}
                <div className="bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/80 rounded-[3rem] p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-blue-400">
                        <Box size={280} />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 mb-10">
                        <div className="w-16 h-16 bg-blue-500 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <CheckCircle2 size={32} className="text-black" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black text-white tracking-tight">{result.scriptName}</h3>
                            <div className="flex items-center gap-3">
                                <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[10px] font-black text-blue-400 uppercase tracking-widest">
                                    {result.language}
                                </span>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest tracking-widest">ARCHITECTURE V1.0</span>
                            </div>
                        </div>
                    </div>

                    <p className="relative z-10 text-[14px] text-zinc-400 leading-relaxed italic border-l-4 border-blue-500/50 pl-5 mb-10 font-medium">
                        "{result.description}"
                    </p>

                    <div className="space-y-10 relative z-10">
                        {/* Dependencies */}
                        <div className="space-y-4">
                            <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Layers size={14} className="text-blue-500" /> Essential Modules
                            </h4>
                            <div className="flex flex-wrap gap-2.5">
                                {result.dependencies.map(dep => (
                                    <div key={dep} className="px-4 py-2 bg-black/40 border border-zinc-800 rounded-2xl text-[11px] font-mono text-zinc-300 hover:border-blue-500/30 transition-all flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-blue-500" />
                                        pkg install {dep}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Source Code */}
                        <div className="space-y-4">
                            <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <TerminalSquare size={14} className="text-blue-500" /> Source Code
                            </h4>
                            <CodeBlock code={result.code} label={result.language} />
                        </div>

                        {/* Instructions */}
                        <div className="space-y-4">
                            <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Info size={14} className="text-blue-500" /> Deployment Instructions
                            </h4>
                            <div className="bg-black/30 border border-zinc-800/50 rounded-[2.5rem] p-8 md:p-10 shadow-inner">
                                <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-li:my-2 prose-strong:text-blue-400 marker:text-blue-500">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.instructions}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => {setResult(null); setPrompt('');}}
                        className="w-full mt-12 py-5 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-500 hover:text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-[2rem] transition-all active:scale-95 border border-zinc-800"
                    >
                        Initiate New Blueprint
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* iOS Centered Input Bar */}
      <div className="p-6 bg-transparent shrink-0 relative z-20">
        <div className="max-w-4xl mx-auto">
            <div className="bg-zinc-900/70 backdrop-blur-2xl p-2.5 pr-3 rounded-[2.8rem] border border-zinc-800/50 flex items-center gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.4)] focus-within:ring-2 focus-within:ring-blue-500/20 transition-all overflow-hidden">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="What should I architect for you?"
                    className="flex-1 bg-transparent text-white py-4 px-6 resize-none focus:outline-none text-[15px] font-medium leading-tight max-h-32 no-scrollbar placeholder:text-zinc-700 text-center"
                    rows={1}
                    disabled={isGenerating}
                />
                <button 
                    onClick={handleGenerate} 
                    disabled={!prompt.trim() || isGenerating} 
                    className={`p-4 rounded-full transition-all shadow-xl active:scale-90 shrink-0 ${
                        prompt.trim() && !isGenerating 
                        ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20' 
                        : 'bg-zinc-800 text-zinc-600 opacity-50'
                    }`}
                >
                    {isGenerating ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} strokeWidth={2.5} />}
                </button>
            </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
            0% { transform: translateY(0); opacity: 0; }
            30% { opacity: 1; }
            70% { opacity: 1; }
            100% { transform: translateY(256px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Architect;
