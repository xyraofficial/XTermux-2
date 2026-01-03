import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Eraser, Plus, MessageSquare, Trash2, Menu, X, Copy, Check, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
import Groq from 'groq-sdk';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from '../components/CodeBlock';
import { showToast } from '../components/Toast';
import { supabase } from '../supabase';

import { LanguageProvider, useLanguage } from '../LanguageContext';

const AIChat: React.FC = () => {
  const { language } = useLanguage();
  const [sessions, setSessions] = useState<any[]>([]);
  
  const translations = {
    en: {
      header: "Neural Link",
      active: "Active",
      newChat: "New Conversation",
      placeholder: "Type a command...",
      quantum: "Quantum Processing Active",
      history: "Sessions",
      copyToast: "Copied to clipboard",
      deletedToast: "Conversation deleted",
      suggestions: ["How to install scripts?", "Best Termux tools?", "Optimization guide", "Neural Link help"]
    },
    id: {
      header: "Tautan Syaraf",
      active: "Aktif",
      newChat: "Percakapan Baru",
      placeholder: "Ketik perintah...",
      quantum: "Pemrosesan Kuantum Aktif",
      history: "Sesi",
      copyToast: "Disalin ke papan klip",
      deletedToast: "Percakapan dihapus",
      suggestions: ["Cara instal skrip?", "Alat Termux terbaik?", "Panduan optimasi", "Bantuan Tautan Syaraf"]
    },
    hi: {
      header: "न्यूरल लिंक",
      active: "सक्रिय",
      newChat: "नई बातचीत",
      placeholder: "कमांड टाइप करें...",
      quantum: "क्वांटम प्रोसेसिंग सक्रिय",
      history: "सत्र",
      copyToast: "क्लिपबोर्ड पर कॉपी किया गया",
      deletedToast: "बातचीत हटा दी गई",
      suggestions: ["स्क्रिप्ट कैसे इंस्टॉल करें?", "सर्वश्रेष्ठ Termux टूल?", "अनुकूलन मार्गदर्शिका", "न्यूरल लिंक सहायता"]
    }
  };

  const t = translations[language];
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      if (!supabase) {
        console.error('Supabase not initialized');
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase.from('chat_sessions').select('*, chat_messages(*)').eq('user_id', user.id).order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error:', error);
        return;
      }

      if (data && data.length > 0) {
        const formatted = data.map((s: any) => ({
          id: s.id, title: s.title,
          messages: (s.chat_messages || []).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        }));
        setSessions(formatted);
        setCurrentSessionId(formatted[0].id);
        setMessages(formatted[0].messages);
      } else {
        // Just set empty if no sessions
        setSessions([]);
        setCurrentSessionId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Fetch sessions failed:', err);
    }
  };

  const createNewChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: newSession, error } = await supabase
        .from('chat_sessions')
        .insert([{ user_id: user.id, title: 'New Conversation' }])
        .select()
        .single();
      
      if (newSession) {
        const sessionObj = { id: newSession.id, title: newSession.title, messages: [] };
        setSessions(prev => [sessionObj, ...prev]);
        setCurrentSessionId(newSession.id);
        setMessages([]);
        setIsSidebarOpen(false);
      }
    } catch (err) {
      showToast("Failed to create new chat", "error");
    }
  };

  const deleteSession = async (id: string) => {
    try {
      if (!supabase) return;
      const { error } = await supabase.from('chat_sessions').delete().eq('id', id);
      if (error) throw error;
      
      setSessions(prev => prev.filter(s => s.id !== id));
      if (currentSessionId === id) {
        setCurrentSessionId(null);
        setMessages([]);
      }
      showToast("Conversation deleted", "success");
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };
  const handleSend = async () => {
    const userMsg = input.trim();
    if (!userMsg || isLoading) return;
    
    // Optimistic update
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      if (!supabase) {
        showToast("Database not connected", "error");
        setIsLoading(false);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showToast("Please login to use AI", "error");
        setIsLoading(false);
        return;
      }

      // Automatically create session if it somehow went missing
      let sessionId = currentSessionId;
      if (!sessionId) {
        const { data: newSession, error: sessionError } = await supabase
          .from('chat_sessions')
          .insert([{ user_id: user.id, title: userMsg.slice(0, 30) }])
          .select()
          .single();
        
        if (sessionError || !newSession) {
          throw new Error("Failed to create session: " + (sessionError?.message || "Unknown error"));
        }
        
        sessionId = newSession.id;
        setCurrentSessionId(sessionId);
        setSessions(prev => [{ id: newSession.id, title: newSession.title, messages: [] }, ...prev]);
      }

      const { error: msgError } = await supabase.from('chat_messages').insert([{ session_id: sessionId, role: 'user', content: userMsg }]);
      if (msgError) throw msgError;

      const groqInstance = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_API_KEY || '',
        dangerouslyAllowBrowser: true
      });

      if (!groqInstance.apiKey || groqInstance.apiKey === 'dummy_key') {
        showToast("AI Key not configured", "error");
        setIsLoading(false);
        return;
      }

      const stream = await groqInstance.chat.completions.create({
        messages: [
          { role: "system" as const, content: "Short technical answers in Markdown." },
          ...messages.map(m => ({ 
            role: (m.role === 'model' || m.role === 'assistant') ? 'assistant' as const : 'user' as const, 
            content: m.content 
          })),
          { role: 'user' as const, content: userMsg }
        ],
        model: "llama-3.3-70b-versatile",
        stream: true,
      });

      let fullContent = '';
      setMessages(prev => [...prev, { role: 'model', content: '', isStreaming: true }]);
      
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || '';
        if (text) {
          fullContent += text;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            return [...prev.slice(0, -1), { ...last, content: fullContent }];
          });
        }
      }

      await supabase.from('chat_messages').insert([{ session_id: sessionId, role: 'model', content: fullContent }]);
    } catch (err) { 
      console.error('Chat error:', err);
      showToast("AI Link Failed", "error"); 
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <div className="flex flex-col h-full w-full bg-black overflow-hidden relative border-none outline-none">
      <header className="px-4 py-3 border-b border-white/5 bg-black/80 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400"><Menu size={18} /></button>
          <div>
            <h2 className="text-xs font-black text-white uppercase tracking-widest">{t.header}</h2>
            <div className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-accent animate-pulse" /><span className="text-[8px] font-bold text-zinc-600 uppercase">{t.active}</span></div>
          </div>
        </div>
        <button onClick={() => setMessages([])} className="p-2 text-zinc-600"><Eraser size={18} /></button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-10">
        {messages.length === 0 ? (
          <div className="min-h-full flex flex-col items-center justify-center space-y-6 py-10 animate-in fade-in duration-700">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
              <div className="relative w-16 h-16 bg-zinc-900 border border-white/10 rounded-[2rem] flex items-center justify-center">
                <Bot size={32} className="text-accent animate-pulse" />
              </div>
            </div>
            
            <div className="text-center space-y-1 shrink-0">
              <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">{t.header} v4.0</h3>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.3em]">{t.quantum}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full max-w-sm px-2">
              {t.suggestions.map((suggestion, i) => (
                <button 
                  key={i}
                  onClick={() => { setInput(suggestion); }}
                  className="p-3 bg-zinc-900/50 border border-white/5 rounded-xl text-[9px] font-black text-zinc-400 uppercase tracking-widest text-left hover:border-accent/30 hover:text-accent transition-all active:scale-95"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-zinc-800 border-white/10' : 'bg-zinc-900 border-accent/20'}`}>
                {msg.role === 'user' ? <User size={14} className="text-zinc-400" /> : <Bot size={14} className="text-accent" />}
              </div>
            <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'ml-auto' : ''}`}>
              <div className={`p-4 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-accent text-black font-bold rounded-tr-none' : 'bg-zinc-900/50 border border-white/5 text-zinc-300 rounded-tl-none overflow-x-auto'}`}>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]} 
                  components={{ 
                    code: ({ children, ...props }) => {
                      const inline = (props as any).inline;
                      const content = String(children).replace(/\n$/, '');
                      
                      if (inline) {
                        return <code className="bg-white/10 px-1 rounded text-accent font-mono">{children}</code>;
                      }

                      return (
                        <div className="my-4 relative group/code">
                          <div className="absolute right-2 top-2 z-10">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(content);
                                showToast("Copied to clipboard", "success");
                              }}
                              className="p-2 bg-zinc-800/80 hover:bg-zinc-700 border border-white/10 rounded-lg text-zinc-400 hover:text-white backdrop-blur-sm transition-all active:scale-90"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                          <div className="overflow-x-auto">
                            <code className="block bg-black/40 p-4 rounded-xl border border-white/5 text-accent font-mono whitespace-pre leading-relaxed">
                              {children}
                            </code>
                          </div>
                        </div>
                      );
                    }
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
              
              {msg.role === 'model' && (
                <div className="flex items-center gap-1 px-1">
                  <button onClick={() => showToast("Feedback recorded", "success")} className="p-2 text-zinc-600 hover:text-accent transition-colors active:scale-90">
                    <ThumbsUp size={14} />
                  </button>
                  <button onClick={() => showToast("Feedback recorded", "success")} className="p-2 text-zinc-600 hover:text-red-500 transition-colors active:scale-90">
                    <ThumbsDown size={14} />
                  </button>
                  <button onClick={() => {
                    navigator.clipboard.writeText(msg.content);
                    showToast("Response copied", "success");
                  }} className="p-2 text-zinc-600 hover:text-white transition-colors active:scale-90">
                    <Copy size={14} />
                  </button>
                  <button onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: 'AI Response', text: msg.content });
                    } else {
                      showToast("Sharing not supported", "info");
                    }
                  }} className="p-2 text-zinc-600 hover:text-white transition-colors active:scale-90">
                    <Share2 size={14} />
                  </button>
                </div>
              )}
            </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-black/80 backdrop-blur-xl border-t border-white/5 pb-20 shrink-0">
        <div className="flex items-center gap-2 bg-zinc-900 p-1.5 rounded-2xl border border-white/5">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.placeholder} className="flex-1 bg-transparent text-white py-2 px-3 resize-none focus:outline-none text-xs max-h-24 no-scrollbar" rows={1} />
          <button onClick={handleSend} disabled={!input.trim() || isLoading} className="p-3 bg-accent text-black rounded-xl active:scale-95 transition-all">
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <aside className="relative w-72 bg-zinc-950 h-full border-r border-white/10 flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t.history}</h3>
              <button onClick={() => setIsSidebarOpen(false)} className="text-zinc-600"><X size={18} /></button>
            </div>
            
            <div className="p-4">
              <button 
                onClick={createNewChat}
                className="w-full p-3 bg-accent/10 border border-accent/20 rounded-xl text-accent text-xs font-bold flex items-center justify-center gap-2 hover:bg-accent/20 transition-all"
              >
                <Plus size={16} />
                {t.newChat}
              </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-4 pt-0 no-scrollbar">
              {sessions.map(s => (
                <div key={s.id} className="group relative">
                  <div 
                    onClick={() => { setCurrentSessionId(s.id); setMessages(s.messages); setIsSidebarOpen(false); }} 
                    className={`p-3 pr-10 rounded-xl border transition-all truncate text-xs font-bold ${currentSessionId === s.id ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-transparent border-transparent text-zinc-500'}`}
                  >
                    {s.title}
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-500 active:text-red-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default AIChat;
