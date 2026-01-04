import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Eraser, Menu, X, Code, Terminal, Cpu, Zap, Settings, MessageSquare, Box, Layers, ShieldCheck, Info, ChevronRight, Sparkles, ChevronDown, Check, Globe, Search, CpuIcon, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from '../components/CodeBlock';
import { showToast } from '../components/Toast';
import { supabase } from '../supabase';
import { useLanguage } from '../LanguageContext';

type AIMode = 'CHAT' | 'ARCHITECT';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  icon: React.ReactNode;
}

const AVAILABLE_MODELS: AIModel[] = [
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3', provider: 'DeepSeek', description: 'Powerhouse for coding & logic', icon: <CpuIcon size={14} /> },
  { id: 'google/gemini-pro-1.5', name: 'Gemini 1.5 Pro', provider: 'Google', description: 'Massive context & multimodal', icon: <Globe size={14} /> },
  { id: 'google/gemini-flash-1.5', name: 'Gemini 1.5 Flash', provider: 'Google', description: 'Ultra-fast & efficient', icon: <Zap size={14} /> },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', description: 'Most human-like & creative', icon: <Sparkles size={14} /> },
  { id: 'meta-llama/llama-3.1-405b', name: 'Llama 3.1 405B', provider: 'Meta', description: 'State-of-the-art open model', icon: <Activity size={14} /> },
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', description: 'The industry standard', icon: <Bot size={14} /> },
  { id: 'mistralai/mistral-large', name: 'Mistral Large', provider: 'Mistral', description: 'European coding excellence', icon: <Terminal size={14} /> }
];

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
  const [selectedModel, setSelectedModel] = useState<string>('deepseek/deepseek-chat');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [architectResult, setArchitectResult] = useState<ArchitectResponse | null>(null);

  const translations = {
    en: { chat: "Neural Link", architect: "X-Architect", placeholder: "Ask anything...", modeLabel: "Select Matrix", modelSelect: "Model Core" },
    id: { chat: "Tautan Syaraf", architect: "X-Arsitek", placeholder: "Tanya apa saja...", modeLabel: "Pilih Matriks", modelSelect: "Inti Model" },
    hi: { chat: "न्यूरल लिंक", architect: "X-आर्किटेक्ट", placeholder: "कुछ भी पूछें...", modeLabel: "मैट्रिक्स चुनें", modelSelect: "मॉडल कोर" }
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
        setSessions(data.map((s: any) => ({
          id: s.id, title: s.title,
          messages: (s.chat_messages || []).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        })));
      }
    } catch (err) { console.error(err); }
  };

  const currentModelData = AVAILABLE_MODELS.find(m => m.id === selectedModel);

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
            messages: [{ role: "system", content: "You are XTermux AI. Professional, concise, tech-focused." }, ...newMessages],
            model: selectedModel,
            max_tokens: 2048
          })
        });
        const data = await response.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.choices[0]?.message?.content || 'Error link.' }]);
      } catch (err) { showToast("AI Link Failed", "error"); }
    } else {
      setArchitectResult(null);
      try {
        const response = await fetch('/api/ai/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: "system", content: "You are a professional Termux script architect. Return ONLY valid JSON: { \"scriptName\": \"\", \"description\": \"\", \"language\": \"\", \"dependencies\": [], \"code\": \"\", \"instructions\": \"\" }" },
              { role: "user", content: userMsg }
            ],
            model: selectedModel,
            max_tokens: 2048
          })
        });
        const data = await response.json();
        const apiContent = data.choices[0]?.message?.content || '';
        const jsonMatch = apiContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) setArchitectResult(JSON.parse(jsonMatch[0]));
        else throw new Error("Format error");
      } catch (err) { showToast("Build sequence failed.", "error"); }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex h-full w-full bg-[#030303] overflow-hidden text-zinc-300 font-sans">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative z-[110] w-72 h-full bg-[#080808] border-r border-white/5 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-[0_0_20px_var(--accent-color)]">
                <Cpu size={20} className="text-black" />
              </div>
              <h1 className="text-sm font-black uppercase tracking-[0.25em] text-white">X-Core</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-zinc-500 hover:text-white transition-colors"><X size={20} /></button>
          </div>

          <div className="space-y-1 mb-8">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] px-2 mb-3">{t.modeLabel}</p>
            <button onClick={() => { setMode('CHAT'); setArchitectResult(null); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${mode === 'CHAT' ? 'bg-accent/10 border border-accent/20 text-accent' : 'hover:bg-white/5 text-zinc-500'}`}>
              <MessageSquare size={18} /> <span className="text-xs font-bold">{t.chat}</span>
            </button>
            <button onClick={() => { setMode('ARCHITECT'); setMessages([]); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${mode === 'ARCHITECT' ? 'bg-accent/10 border border-accent/20 text-accent' : 'hover:bg-white/5 text-zinc-500'}`}>
              <Box size={18} /> <span className="text-xs font-bold">{t.architect}</span>
            </button>
          </div>

          <div className="mb-8">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] px-2 mb-3">{t.modelSelect}</p>
            <div className="relative">
              <button onClick={() => setShowModelDropdown(!showModelDropdown)} className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-[#0d0d0d] border border-white/5 text-xs font-bold text-zinc-300 hover:border-accent/30 transition-all">
                <div className="flex items-center gap-2">
                  <span className="text-accent">{currentModelData?.icon}</span>
                  <span className="truncate">{currentModelData?.name}</span>
                </div>
                <ChevronDown size={14} className={`transition-transform duration-300 ${showModelDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showModelDropdown && (
                <div className="absolute top-full left-0 right-0 mt-3 z-[120] bg-[#121212] border border-white/10 rounded-[2rem] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300 overflow-hidden">
                  <div className="max-h-80 overflow-y-auto no-scrollbar space-y-1">
                    {AVAILABLE_MODELS.map(model => (
                      <button 
                        key={model.id}
                        onClick={() => { setSelectedModel(model.id); setShowModelDropdown(false); }}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left ${selectedModel === model.id ? 'bg-accent/10 border border-accent/20' : 'hover:bg-white/5 border border-transparent'}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedModel === model.id ? 'bg-accent text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                          {model.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-black ${selectedModel === model.id ? 'text-accent' : 'text-zinc-200'}`}>{model.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{model.description}</p>
                        </div>
                        {selectedModel === model.id && <Check size={14} className="text-accent shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] px-2 mb-3">History</p>
            {sessions.map(s => (
              <button key={s.id} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-xs text-zinc-500 transition-all truncate text-left mb-1">
                <Terminal size={14} className="opacity-40" /> <span className="truncate">{s.title}</span>
              </button>
            ))}
          </div>

          <button onClick={() => { setMessages([]); setArchitectResult(null); }} className="mt-4 flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-zinc-900/50 hover:bg-red-500/10 hover:text-red-400 transition-all text-xs font-black uppercase tracking-widest text-zinc-500 border border-transparent hover:border-red-500/20">
            <Eraser size={14} /> Purge Buffer
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative bg-[#030303]">
        <header className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-[#050505]/80 backdrop-blur-3xl sticky top-0 z-[50]">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400"><Menu size={20} /></button>
            <div className="flex items-center gap-2.5">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-accent animate-ping' : 'bg-zinc-700'}`} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{isLoading ? 'Processing' : mode}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[10px] font-black text-white uppercase tracking-tighter leading-none">{currentModelData?.name}</span>
              <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{currentModelData?.provider}</span>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center"><User size={18} className="text-zinc-500" /></div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-12 space-y-10 no-scrollbar pb-40">
          {mode === 'CHAT' ? (
            messages.length > 0 ? messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 sm:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-6 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-zinc-900 border-white/10' : 'bg-accent/5 border-accent/20'}`}>
                  {msg.role === 'user' ? <User size={18} className="text-zinc-400" /> : <Bot size={20} className="text-accent" />}
                </div>
                <div className={`relative max-w-[90%] sm:max-w-[80%] lg:max-w-[75%] p-5 sm:p-7 rounded-[2rem] text-[13px] sm:text-sm leading-relaxed border shadow-2xl ${msg.role === 'user' ? 'bg-accent text-black font-bold border-transparent rounded-tr-none' : 'bg-zinc-900/50 border-white/5 text-zinc-200 backdrop-blur-3xl rounded-tl-none'}`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: ({node, ...props}) => <code className="bg-black/50 px-1.5 py-0.5 rounded text-accent" {...props} /> }}>{msg.content}</ReactMarkdown>
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-in zoom-in-90 duration-1000">
                <div className="w-24 h-24 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 flex items-center justify-center mb-8 shadow-inner relative">
                  <div className="absolute inset-0 bg-accent/10 rounded-[2.5rem] blur-2xl animate-pulse" />
                  <Bot size={48} className="text-accent relative z-10" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-[0.3em]">X-Neural Link</h3>
                <p className="text-[11px] text-zinc-600 max-w-xs mt-3 uppercase font-black tracking-widest leading-loose">Waiting for uplink. Describe your request to the Core.</p>
              </div>
            )
          ) : architectResult ? (
            <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-700">
              <div className="bg-gradient-to-br from-[#0a0a0a] to-black p-8 sm:p-12 rounded-[3.5rem] border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-3 mb-8">
                  <span className="px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-[10px] font-black text-accent uppercase tracking-widest">{architectResult.language}</span>
                  <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-zinc-600 uppercase tracking-widest">Optimized Build</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white mb-6 tracking-tighter leading-tight">{architectResult.scriptName}</h3>
                <p className="text-zinc-400 text-sm sm:text-base italic mb-12 leading-relaxed opacity-80">"{architectResult.description}"</p>
                <div className="flex flex-wrap gap-2.5 mb-12">
                  {architectResult.dependencies.map((dep, idx) => (
                    <span key={idx} className="px-4 py-2 bg-zinc-900 border border-white/5 rounded-xl text-[10px] font-black text-zinc-500 uppercase">{dep}</span>
                  ))}
                </div>
                <div className="rounded-[2.5rem] overflow-hidden border border-white/5 shadow-inner">
                  <CodeBlock code={architectResult.code} label={architectResult.language} />
                </div>
                <div className="mt-12 p-8 sm:p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-headings:tracking-widest">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{architectResult.instructions}</ReactMarkdown>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-in zoom-in-90 duration-1000">
              <div className="w-24 h-24 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 flex items-center justify-center mb-8 shadow-inner relative">
                <div className="absolute inset-0 bg-accent/10 rounded-[2.5rem] blur-2xl animate-pulse" />
                <Box size={48} className="text-accent relative z-10" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-[0.3em]">X-Architect</h3>
              <p className="text-[11px] text-zinc-600 max-w-xs mt-3 uppercase font-black tracking-widest leading-loose">Blueprint mode active. Enter your tool specifications to begin compilation.</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 sm:p-8 lg:p-12 bg-gradient-to-t from-[#030303] via-[#030303]/90 to-transparent sticky bottom-0 z-[60]">
          <div className="max-w-5xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-transparent rounded-[3rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className={`relative flex items-center bg-[#0d0d0d] p-2.5 rounded-[3rem] border transition-all duration-700 ${isLoading ? 'border-accent/50 shadow-[0_0_50px_rgba(34,197,94,0.15)]' : 'border-white/5 shadow-3xl group-focus-within:border-accent/30'}`}>
              <textarea 
                value={input} onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={t.placeholder} 
                className="flex-1 bg-transparent text-white py-4 px-6 resize-none focus:outline-none text-sm placeholder:text-zinc-700 max-h-40 no-scrollbar font-medium" rows={1} 
              />
              <button onClick={handleSend} disabled={!input.trim() || isLoading} className={`p-5 rounded-full transition-all duration-500 ${!input.trim() || isLoading ? 'bg-zinc-800 text-zinc-600' : 'bg-accent text-black shadow-[0_10px_25px_rgba(34,197,94,0.3)] hover:-translate-y-1 active:scale-95'}`}>
                {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
              </button>
            </div>
            <div className="flex justify-center mt-5 gap-6">
              <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em]">{isLoading ? 'Uplink active' : 'System ready'}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UnifiedAI;
