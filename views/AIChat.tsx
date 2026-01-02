import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Eraser, Plus, MessageSquare, Trash2, Menu, X } from 'lucide-react';
import Groq from 'groq-sdk';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from '../components/CodeBlock';
import { showToast } from '../components/Toast';
import { supabase } from '../supabase';

const AIChat: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);
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

  const handleSend = async () => {
    if (!currentSessionId || !input.trim() || isLoading) return;
    const userMsg = input.trim();
    
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
        const { data: newSession } = await supabase
          .from('chat_sessions')
          .insert([{ user_id: user.id, title: userMsg.slice(0, 30) }])
          .select()
          .single();
        if (newSession) {
          sessionId = newSession.id;
          setCurrentSessionId(sessionId);
          setSessions(prev => [{ id: newSession.id, title: newSession.title, messages: [] }, ...prev]);
        } else {
          throw new Error("Failed to create session");
        }
      }

      const { data: msgData, error: msgError } = await supabase.from('chat_messages').insert([{ session_id: sessionId, role: 'user', content: userMsg }]).select().single();
      
      if (msgError) throw msgError;

      const groqInstance = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_API_KEY || 'dummy_key',
        dangerouslyAllowBrowser: true
      });

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
      console.error(err);
      showToast("AI Link Failed", "error"); 
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <div className="flex flex-col h-[100dvh] bg-black overflow-hidden relative pb-safe">
      <header className="px-4 py-3 border-b border-white/5 bg-black/80 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400"><Menu size={18} /></button>
          <div>
            <h2 className="text-xs font-black text-white uppercase tracking-widest">Neural Link</h2>
            <div className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-accent animate-pulse" /><span className="text-[8px] font-bold text-zinc-600 uppercase">Active</span></div>
          </div>
        </div>
        <button onClick={() => setMessages([])} className="p-2 text-zinc-600"><Eraser size={18} /></button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-32">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-zinc-800 border-white/10' : 'bg-zinc-900 border-accent/20'}`}>
              {msg.role === 'user' ? <User size={14} className="text-zinc-400" /> : <Bot size={14} className="text-accent" />}
            </div>
            <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-accent text-black font-bold rounded-tr-none' : 'bg-zinc-900/50 border border-white/5 text-zinc-300 rounded-tl-none'}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: ({ children }) => <code className="bg-white/10 px-1 rounded text-accent font-mono">{children}</code> }}>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-black/80 backdrop-blur-xl border-t border-white/5 pb-24">
        <div className="flex items-center gap-2 bg-zinc-900 p-1.5 rounded-2xl border border-white/5">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a command..." className="flex-1 bg-transparent text-white py-2 px-3 resize-none focus:outline-none text-xs max-h-24 no-scrollbar" rows={1} />
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
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Sessions</h3>
              <button onClick={() => setIsSidebarOpen(false)} className="text-zinc-600"><X size={18} /></button>
            </div>
            
            <div className="p-4">
              <button 
                onClick={createNewChat}
                className="w-full p-3 bg-accent/10 border border-accent/20 rounded-xl text-accent text-xs font-bold flex items-center justify-center gap-2 hover:bg-accent/20 transition-all"
              >
                <Plus size={16} />
                New Conversation
              </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-4 pt-0 no-scrollbar">
              {sessions.map(s => (
                <div key={s.id} onClick={() => { setCurrentSessionId(s.id); setMessages(s.messages); setIsSidebarOpen(false); }} className={`p-3 rounded-xl border transition-all truncate text-xs font-bold ${currentSessionId === s.id ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-transparent border-transparent text-zinc-500'}`}>
                  {s.title}
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
