import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Eraser, Menu, X, Code, Terminal, Cpu, Zap, Settings, MessageSquare, Box, Layers, ShieldCheck, Info, ChevronRight, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from '../components/CodeBlock';
import { showToast } from '../components/Toast';
import { supabase } from '../supabase';
import { useLanguage } from '../LanguageContext';

type AIMode = 'CHAT' | 'ARCHITECT';

interface ArchitectResponse {
  scriptName: string;
  description: string;
  language: string;
  dependencies: string[];
  code: string;
  instructions: string;
}

const UnifiedAI: React.FC = () => {
  const { language } = useLanguage();
  const [mode, setMode] = useState<AIMode>('CHAT');
  const [sessions, setSessions] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Architect specific state
  const [architectResult, setArchitectResult] = useState<ArchitectResponse | null>(null);

  const translations = {
    en: { chat: "Neural Link", architect: "X-Architect", placeholder: "Ask anything or describe a tool...", modeLabel: "Select Matrix" },
    id: { chat: "Tautan Syaraf", architect: "X-Arsitek", placeholder: "Tanya apa saja atau jelaskan alat...", modeLabel: "Pilih Matriks" },
    hi: { chat: "न्यूरल लिंक", architect: "X-आर्किटेक्ट", placeholder: "कुछ भी पूछें या टूल का वर्णन करें...", modeLabel: "मैट्रिक्स चुनें" }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => { fetchSessions(); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, architectResult]);

  const fetchSessions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('chat_sessions').select('*, chat_messages(*)').eq('user_id', user.id).order('created_at', { ascending: false });
      if (data) {
        const formatted = data.map((s: any) => ({
          id: s.id, title: s.title,
          messages: (s.chat_messages || []).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        }));
        setSessions(formatted);
      }
    } catch (err) { console.error(err); }
  };

  const handleSend = async () => {
    const userMsg = input.trim();
    if (!userMsg || isLoading) return;
    setInput('');
    setIsLoading(true);

    if (mode === 'CHAT') {
      const newMessages = [...messages, { role: 'user', content: userMsg }];
      setMessages(newMessages);
      try {
        const response = await fetch('/api/ai/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: "system", content: "You are XTermux AI. Professional, concise, tech-focused. Use Markdown." }, ...newMessages],
            model: "deepseek/deepseek-chat",
            max_tokens: 1024
          })
        });
        const data = await response.json();
        const content = data.choices[0]?.message?.content || 'Link failed. Retry.';
        setMessages(prev => [...prev, { role: 'assistant', content }]);
      } catch (err) { showToast("AI Link Failed", "error"); }
    } else {
      setArchitectResult(null);
      try {
        const response = await fetch('/api/ai/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: "system", content: "You are a professional Termux script architect. Return ONLY valid JSON block. Schema: { \"scriptName\": string, \"description\": string, \"language\": string, \"dependencies\": string[], \"code\": string, \"instructions\": string }. No markdown outside the JSON block." },
              { role: "user", content: `Build this tool: ${userMsg}` }
            ],
            model: "deepseek/deepseek-chat",
            max_tokens: 1024
          })
        });
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '';
        
        // Improved JSON extraction
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setArchitectResult(parsed);
        } else {
          throw new Error("Invalid output format");
        }
      } catch (err) { 
        console.error("Architect Error:", err);
        // Fallback parsing for common LLM markdown pollution
        try {
          const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          setArchitectResult(parsed);
        } catch (innerErr) {
          showToast("Build sequence failed. Try simpler prompt.", "error"); 
        }
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex h-full w-full bg-[#050505] overflow-hidden text-zinc-300 font-sans">
      {/* Sidebar / Left Control Panel */}
      <aside className={`fixed lg:relative z-[100] w-72 h-full bg-[#0a0a0a] border-r border-white/5 transition-all duration-500 ease-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-[0_0_15px_var(--accent-color)]">
                <Cpu size={18} className="text-black" />
              </div>
              <h1 className="text-sm font-black uppercase tracking-[0.2em] text-white">Core Link</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-zinc-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-1 mb-10">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-2 mb-3">{t.modeLabel}</p>
            <button 
              onClick={() => { setMode('CHAT'); setArchitectResult(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${mode === 'CHAT' ? 'bg-accent/10 border border-accent/20 text-accent' : 'hover:bg-white/5 border border-transparent text-zinc-500'}`}
            >
              <MessageSquare size={18} className={mode === 'CHAT' ? 'text-accent' : 'group-hover:text-zinc-300'} />
              <span className="text-xs font-bold">{t.chat}</span>
              {mode === 'CHAT' && <Sparkles size={12} className="ml-auto animate-pulse" />}
            </button>
            <button 
              onClick={() => { setMode('ARCHITECT'); setMessages([]); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${mode === 'ARCHITECT' ? 'bg-accent/10 border border-accent/20 text-accent' : 'hover:bg-white/5 border border-transparent text-zinc-500'}`}
            >
              <Box size={18} className={mode === 'ARCHITECT' ? 'text-accent' : 'group-hover:text-zinc-300'} />
              <span className="text-xs font-bold">{t.architect}</span>
              {mode === 'ARCHITECT' && <Sparkles size={12} className="ml-auto animate-pulse" />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-2 mb-3">Recent Uplinks</p>
            {sessions.length > 0 ? sessions.map(s => (
              <button key={s.id} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-xs text-zinc-500 hover:text-zinc-200 transition-all text-left truncate">
                <Terminal size={14} className="opacity-50 shrink-0" />
                <span className="truncate">{s.title}</span>
              </button>
            )) : (
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-center">
                <p className="text-[10px] text-zinc-600 italic">No stored sessions</p>
              </div>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-white/5">
            <button onClick={() => { setMessages([]); setArchitectResult(null); }} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-zinc-400 hover:text-white transition-all">
              <Eraser size={14} />
              <span>Purge Buffer</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-black/50">
        <header className="px-6 py-5 border-b border-white/5 flex items-center justify-between shrink-0 bg-black/40 backdrop-blur-xl">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-accent animate-pulse shadow-[0_0_8px_var(--accent-color)]' : 'bg-zinc-700'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {isLoading ? 'Processing Request...' : `${mode} Active`}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-500 hover:text-white transition-colors"><Settings size={18} /></button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-accent/50 p-[1px]">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <User size={14} className="text-accent" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 no-scrollbar pb-40">
          {mode === 'CHAT' ? (
            messages.length > 0 ? messages.map((msg, i) => (
              <div key={i} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border shadow-2xl ${msg.role === 'user' ? 'bg-zinc-800 border-white/10' : 'bg-zinc-900 border-accent/20'}`}>
                  {msg.role === 'user' ? <User size={18} className="text-zinc-400" /> : <Bot size={18} className="text-accent" />}
                </div>
                <div className={`relative max-w-[85%] lg:max-w-[70%] p-5 rounded-[2rem] text-sm leading-relaxed border transition-all ${msg.role === 'user' ? 'bg-accent text-black font-bold border-transparent shadow-[0_10px_30px_rgba(34,197,94,0.1)]' : 'bg-zinc-900/40 border-white/5 text-zinc-300 backdrop-blur-md'}`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  {msg.role === 'assistant' && (
                    <div className="absolute -bottom-6 left-2 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-[10px] text-zinc-600 hover:text-accent font-bold uppercase tracking-tighter">Copy</button>
                      <button className="text-[10px] text-zinc-600 hover:text-accent font-bold uppercase tracking-tighter">Retry</button>
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40 grayscale">
                <div className="w-20 h-20 rounded-[2.5rem] bg-zinc-900 border border-white/10 flex items-center justify-center mb-4">
                  <Bot size={40} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-widest">Neural Link Established</h3>
                  <p className="text-xs text-zinc-500 max-w-xs mx-auto mt-2">Initialize conversation with XTermux Core AI. Ask for commands, scripts, or system info.</p>
                </div>
              </div>
            )
          ) : architectResult ? (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700">
              <div className="bg-gradient-to-br from-zinc-900 to-black p-8 lg:p-12 rounded-[3rem] border border-white/10 shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Box size={200} className="text-accent" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                      <span className="text-[10px] font-black text-accent uppercase tracking-widest">{architectResult.language}</span>
                    </div>
                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Verified Build</span>
                    </div>
                  </div>

                  <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">{architectResult.scriptName}</h3>
                  <p className="text-zinc-400 text-sm italic mb-10 leading-relaxed max-w-2xl">"{architectResult.description}"</p>
                  
                  <div className="space-y-4 mb-10">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                      <Layers size={12} />
                      Required Dependencies
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {architectResult.dependencies.map((dep, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-zinc-800 rounded-lg text-[10px] font-bold text-zinc-300 border border-white/5">{dep}</span>
                      ))}
                    </div>
                  </div>

                  <div className="group relative">
                    <div className="absolute -inset-2 bg-accent/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                      <CodeBlock code={architectResult.code} label={architectResult.language} />
                    </div>
                  </div>

                  <div className="mt-12 p-8 bg-black/40 border border-white/5 rounded-3xl">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <ShieldCheck size={14} className="text-accent" />
                      Execution Instructions
                    </p>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{architectResult.instructions}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40 grayscale">
              <div className="w-20 h-20 rounded-[2.5rem] bg-zinc-900 border border-white/10 flex items-center justify-center mb-4">
                <Box size={40} className="text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-widest">X-Architect Ready</h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto mt-2">Describe the tool or automation you need. The architect will generate a full build with code and instructions.</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Matrix */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10 bg-gradient-to-t from-black via-black/90 to-transparent">
          <div className="max-w-5xl mx-auto">
            <div className={`relative flex items-center bg-zinc-900/80 backdrop-blur-2xl p-2 rounded-[2.5rem] border transition-all duration-500 ${isLoading ? 'border-accent/40 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : 'border-white/5 shadow-2xl'}`}>
              <div className="hidden lg:flex items-center gap-2 pl-4 pr-2 border-r border-white/5 mr-2">
                <Zap size={16} className={isLoading ? 'text-accent animate-pulse' : 'text-zinc-600'} />
              </div>
              <textarea 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={t.placeholder} 
                className="flex-1 bg-transparent text-white py-4 px-4 resize-none focus:outline-none text-sm placeholder:text-zinc-600 max-h-40 no-scrollbar" 
                rows={1} 
              />
              <button 
                onClick={handleSend} 
                disabled={!input.trim() || isLoading} 
                className={`p-5 rounded-full transition-all duration-300 ${!input.trim() || isLoading ? 'bg-zinc-800 text-zinc-600' : 'bg-accent text-black shadow-[0_5px_15px_rgba(34,197,94,0.3)] hover:-translate-y-1 active:scale-95'}`}
              >
                {isLoading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
              </button>
            </div>
            <div className="flex items-center justify-center mt-4 gap-6">
              <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">Press Enter to Send</p>
              <div className="w-1 h-1 rounded-full bg-zinc-800" />
              <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">Shift+Enter for New Line</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UnifiedAI;
