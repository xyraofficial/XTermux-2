
import React, { useState } from 'react';
import { AlertTriangle, Wrench, ShieldAlert, Search, X, Microscope, Sparkles, Loader2, Copy, CheckCircle2, ChevronRight } from 'lucide-react';
import { ERRORS } from '../constants';
import CodeBlock from '../components/CodeBlock';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { showToast } from '../components/Toast';

const Troubleshoot: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorLog, setErrorLog] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const filteredErrors = ERRORS.filter(err => 
    err.errorTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    err.symptoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
    err.solution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAnalyzeError = async () => {
    if (!errorLog.trim()) return;

    const apiKey = process.env.API_KEY || process.env.GROQ_API_KEY;
    if (!apiKey) {
        showToast("API Key missing", "error");
        return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `You are a Termux and Linux expert. Analyze the following error log and provide a specific, short solution. 
            
            Error Log:
            """
            ${errorLog}
            """

            Format the response as Markdown:
            1. **Cause**: One sentence explaining what went wrong.
            2. **Fix**: The exact command to run (in a code block).
            Keep it concise.`,
        });
        
        setAnalysisResult(response.text);
    } catch (e) {
        console.error(e);
        showToast("Analysis failed. Check connection.", "error");
    } finally {
        setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Header */}
      <div className="sticky top-[-1px] z-40 bg-zinc-950 border-b border-zinc-900/50 pt-2 pb-4 px-4 space-y-3">
          
          {/* AI Scanner Input */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 focus-within:ring-1 focus-within:ring-green-500/30 focus-within:border-green-500/30">
             {!analysisResult ? (
                 <div className="p-1">
                    <textarea 
                        value={errorLog}
                        onChange={(e) => setErrorLog(e.target.value)}
                        placeholder="Paste terminal error log here to analyze..."
                        className="w-full bg-transparent text-[13px] text-zinc-300 placeholder:text-zinc-600 p-3 resize-none focus:outline-none min-h-[80px] font-mono leading-relaxed"
                    />
                    <div className="flex justify-between items-center px-2 pb-2">
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1">
                            <Microscope size={12} /> AI Diagnostic
                        </span>
                        <button 
                            onClick={handleAnalyzeError}
                            disabled={!errorLog.trim() || isAnalyzing}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                                errorLog.trim() && !isAnalyzing
                                ? 'bg-green-500 text-black hover:bg-green-400' 
                                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            }`}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 size={12} className="animate-spin" /> Scanning...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={12} /> Analyze Error
                                </>
                            )}
                        </button>
                    </div>
                 </div>
             ) : (
                 <div className="p-4 bg-zinc-900/50 relative">
                     <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-green-500/10 rounded-lg">
                            <CheckCircle2 size={16} className="text-green-500" />
                        </div>
                        <h3 className="text-sm font-bold text-green-100">Diagnosis Result</h3>
                        <button 
                            onClick={() => { setAnalysisResult(null); setErrorLog(''); }}
                            className="absolute top-3 right-3 text-zinc-500 hover:text-white"
                        >
                            <X size={16} />
                        </button>
                     </div>
                     <div className="text-[13px] text-zinc-300 prose prose-invert prose-p:my-1 prose-pre:my-2 prose-code:text-green-400 prose-sm max-w-none">
                        <ReactMarkdown>{analysisResult}</ReactMarkdown>
                     </div>
                 </div>
             )}
          </div>

          {/* Static Search */}
          <div className="relative group">
            <Search 
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                searchTerm ? 'text-green-500' : 'text-zinc-500'
              }`} 
              size={18} 
            />
            <input 
              type="text"
              placeholder="Or search common error database..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/80 text-white pl-12 pr-10 py-3 rounded-xl border border-zinc-800 focus:outline-none focus:border-green-500/20 transition-all text-[13px] font-medium placeholder:text-zinc-600"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {filteredErrors.length > 0 ? (
          filteredErrors.map((err) => (
            <div key={err.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 animate-in fade-in slide-in-from-bottom-2 group hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20 group-hover:bg-red-500/20 transition-colors">
                    <AlertTriangle size={18} className="text-red-400" />
                </div>
                <h3 className="font-bold text-zinc-200 text-sm">{err.errorTitle}</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                    Symptoms
                  </span>
                  <div className="text-xs text-zinc-400 font-mono bg-zinc-950/50 p-2.5 rounded-lg border border-zinc-800/50 break-all leading-relaxed">
                    {err.symptoms}
                  </div>
                </div>

                <div>
                   <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                    Solution
                  </span>
                  <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">
                    {err.solution}
                  </p>
                </div>

                {err.prevention && (
                  <div>
                    <CodeBlock code={err.prevention} />
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
            <ShieldAlert className="mx-auto text-zinc-600 mb-3" size={32} />
            <p className="text-zinc-500 font-bold text-sm">No matching errors found.</p>
            <p className="text-zinc-600 text-xs mt-1">Try using the AI Diagnostic tool above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Troubleshoot;
