import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Eraser, Plus, Trash2, Menu, X, Copy, ThumbsUp, ThumbsDown, Share2, Box, Cpu, Layers, Code, Search, ShieldCheck, TerminalSquare, Command, Info } from 'lucide-react';
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
  sources?: Array<{
    title: string;
    domain: string;
    url: string;
  }>;
}

const UnifiedAI: React.FC = () => {
  const { language } = useLanguage();
  const [mode, setMode] = useState<AIMode>('CHAT');
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Architect specific state
  const [architectResult, setArchitectResult] = useState<ArchitectResponse | null>(null);

  const translations = {
    en: { chat: "Neural Link", architect: "X-Architect", placeholder: "Type a command...", newChat: "New Session" },
    id: { chat: "Tautan Syaraf", architect: "X-Arsitek", placeholder: "Ketik perintah...", newChat: "Sesi Baru" },
    hi: { chat: "न्यूरल लिंक", architect: "X-आर्किटेक्ट", placeholder: "कमांड टाइप करें...", newChat: "नया सत्र" }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => { fetchSessions(); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const fetchSessions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase.from('chat_sessions').select('*, chat_messages(*)').eq('user_id', user.id).order('created_at', { ascending: false });
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
      setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
      try {
        const response = await fetch('/api/ai/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: "system", content: "Short technical answers in Markdown." }, ...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })), { role: 'user', content: userMsg }],
            model: "deepseek/deepseek-chat",
          })
        });
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '';
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
              { role: "system", content: "You are a professional Termux script architect. Return ONLY valid JSON: { \"scriptName\": \"\", \"description\": \"\", \"language\": \"\", \"dependencies\": [], \"code\": \"\", \"instructions\": \"\", \"sources\": [] }" },
              { role: "user", content: userMsg }
            ],
            model: "deepseek/deepseek-chat",
          })
        });
        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        setArchitectResult(JSON.parse(content));
      } catch (err) { showToast("Build sequence failed.", "error"); }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-black overflow-hidden relative">
      <header className="px-4 py-3 border-b border-white/5 bg-black/80 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400"><Menu size={18} /></button>
          <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/5">
            <button onClick={() => setMode('CHAT')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'CHAT' ? 'bg-accent text-black' : 'text-zinc-500'}`}>{t.chat}</button>
            <button onClick={() => setMode('ARCHITECT')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'ARCHITECT' ? 'bg-accent text-black' : 'text-zinc-500'}`}>{t.architect}</button>
          </div>
        </div>
        <button onClick={() => { setMessages([]); setArchitectResult(null); }} className="p-2 text-zinc-600"><Eraser size={18} /></button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-32">
        {mode === 'CHAT' ? (
          messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-zinc-800 border-white/10' : 'bg-zinc-900 border-accent/20'}`}>
                {msg.role === 'user' ? <User size={14} className="text-zinc-400" /> : <Bot size={14} className="text-accent" />}
              </div>
              <div className={`max-w-[85%] p-4 rounded-2xl text-xs bg-zinc-900/50 border border-white/5 text-zinc-300 ${msg.role === 'user' ? 'bg-accent text-black font-bold' : ''}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))
        ) : architectResult && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-zinc-900/60 p-6 rounded-[2.5rem] border border-white/10">
              <h3 className="text-xl font-black text-white mb-2">{architectResult.scriptName}</h3>
              <p className="text-xs text-zinc-400 mb-6 italic">"{architectResult.description}"</p>
              <CodeBlock code={architectResult.code} label={architectResult.language} />
              <div className="mt-6 prose prose-invert prose-xs">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{architectResult.instructions}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="max-w-4xl mx-auto flex items-center gap-2 bg-zinc-900 p-2 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.placeholder} className="flex-1 bg-transparent text-white py-3 px-4 resize-none focus:outline-none text-sm max-h-32 no-scrollbar" rows={1} />
          <button onClick={handleSend} disabled={!input.trim() || isLoading} className="p-4 bg-accent text-black rounded-full active:scale-95 transition-all">
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <aside className="relative w-72 bg-zinc-950 h-full border-r border-white/10 p-4 animate-in slide-in-from-left duration-300">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Sessions</h3>
            {sessions.map(s => (
              <button key={s.id} onClick={() => { setCurrentSessionId(s.id); setMessages(s.messages); setIsSidebarOpen(false); }} className="w-full p-3 text-left text-xs font-bold text-zinc-400 hover:text-white transition-all truncate">{s.title}</button>
            ))}
          </aside>
        </div>
      )}
    </div>
  );
};

export default UnifiedAI;
