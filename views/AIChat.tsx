import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Eraser, Plus, MessageSquare, Trash2, Menu, X } from 'lucide-react';
import Groq from 'groq-sdk';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from '../components/CodeBlock';
import { showToast } from '../components/Toast';
import IOSModal from '../components/IOSModal';
import { supabase } from '../supabase';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_API_KEY || 'dummy_key',
  dangerouslyAllowBrowser: true
});

interface Message {
  role: 'user' | 'model';
  content: string;
  isStreaming?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
}

const AIChat: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: sessionsData, error } = await supabase
      .from('chat_sessions')
      .select('*, chat_messages(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
      return;
    }

    if (sessionsData && sessionsData.length > 0) {
      const formattedSessions: ChatSession[] = sessionsData.map((s: any) => ({
        id: s.id,
        title: s.title,
        createdAt: s.created_at,
        messages: (s.chat_messages || []).sort((a: any, b: any) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ).map((m: any) => ({
          role: m.role as 'user' | 'model',
          content: m.content,
        }))
      }));

      setSessions(formattedSessions);
      selectSession(formattedSessions[0].id, formattedSessions);
    } else {
      createNewChat();
    }
  };

  const createNewChat = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert([{ user_id: user.id, title: 'New Chat' }])
      .select()
      .single();

    if (error) {
      showToast('Gagal membuat chat baru', 'error');
      return;
    }

    const newSession: ChatSession = {
      id: data.id,
      title: data.title,
      createdAt: data.created_at,
      messages: []
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
    setIsSidebarOpen(false);
  };

  const selectSession = (id: string, currentSessions = sessions) => {
    const session = currentSessions.find(s => s.id === id);
    if (session) {
      setCurrentSessionId(id);
      setMessages(session.messages);
      setIsSidebarOpen(false);
    }
  };

  const deleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const { error } = await supabase.from('chat_sessions').delete().eq('id', id);
    
    if (error) {
      showToast('Gagal menghapus chat', 'error');
      return;
    }

    const updatedSessions = sessions.filter(s => s.id !== id);
    setSessions(updatedSessions);
    
    if (currentSessionId === id) {
      if (updatedSessions.length > 0) {
        selectSession(updatedSessions[0].id, updatedSessions);
      } else {
        createNewChat();
      }
    }
  };

  const handleSend = async () => {
    if (!currentSessionId || !input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    const newUserMsg: Message = { role: 'user', content: userMessage };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const { data: insertData, error: insertError } = await supabase.from('chat_messages').insert([
        { session_id: currentSessionId, role: 'user', content: userMessage }
      ]);
      if (insertError) {
        console.error('Supabase Insert Error (User):', insertError);
        showToast(`Database Error: ${insertError.message}`, "error");
        setIsLoading(false);
        return;
      }

      const stream = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "Anda adalah 'X-Intelligence'. Berikan jawaban teknis, singkat, dan gunakan Markdown." },
          ...messages.map(m => ({ 
            role: (m.role === 'model' ? 'assistant' : 'user') as "assistant" | "user" | "system", 
            content: m.content 
          })),
          { role: 'user', content: userMessage }
        ],
        model: "llama-3.3-70b-versatile",
        stream: true,
      });

      let fullContent = '';
      setMessages(prev => [...prev, { role: 'model', content: '', isStreaming: true }]);

      for await (const chunk of stream) {
        const chunkText = chunk.choices[0]?.delta?.content || '';
        if (chunkText) {
          fullContent += chunkText;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.role === 'model' && last.isStreaming) {
              return [...prev.slice(0, -1), { ...last, content: fullContent }];
            }
            return prev;
          });
        }
      }

      const finalModelMsg: Message = { role: 'model', content: fullContent, isStreaming: false };
      setMessages(prev => [...prev.slice(0, -1), finalModelMsg]);

      await supabase.from('chat_messages').insert([
        { session_id: currentSessionId, role: 'model', content: fullContent }
      ]);

      if (messages.length === 0) {
        const title = userMessage.length > 30 ? userMessage.substring(0, 30) + "..." : userMessage;
        await supabase.from('chat_sessions').update({ title }).eq('id', currentSessionId);
        setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, title } : s));
      }

    } catch (err) {
      console.error(err);
      showToast("Gagal terhubung ke AI.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex h-full bg-zinc-950 overflow-hidden relative">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-zinc-950 border-r border-zinc-900 z-50 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full p-4">
          <button 
            onClick={createNewChat}
            className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-bold hover:bg-zinc-800 transition-all mb-6 active:scale-95"
          >
            <Plus size={20} className="text-accent" />
            <span className="uppercase tracking-tighter text-[13px]">New Terminal Chat</span>
          </button>

          <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] px-2 mb-4">Chat Logs</h3>
            {sessions.map(s => (
              <div 
                key={s.id}
                onClick={() => selectSession(s.id)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${currentSessionId === s.id ? 'bg-accent/10 border-accent/20 text-accent' : 'border-transparent text-zinc-400 hover:bg-zinc-900'}`}
              >
                <div className="flex items-center gap-3 truncate">
                  <MessageSquare size={16} className={currentSessionId === s.id ? 'text-accent' : 'text-zinc-600'} />
                  <span className="text-[13px] font-bold truncate tracking-tight">{s.title}</span>
                </div>
                <button 
                  onClick={(e) => deleteSession(e, s.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="px-5 py-4 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl z-30 shrink-0">
          <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                  <button onClick={() => setIsSidebarOpen(true)} className="p-2 lg:hidden bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
                    <Menu size={20} />
                  </button>
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center relative shadow-lg">
                          <Bot size={22} className="text-accent" />
                          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-zinc-950 rounded-full" />
                      </div>
                      <div className="space-y-0.5">
                          <h2 className="text-[14px] font-black text-white uppercase tracking-tighter">X-INTELLIGENCE</h2>
                          <div className="flex items-center gap-1.5">
                              <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">NEURAL LINK ACTIVE</span>
                          </div>
                      </div>
                  </div>
              </div>
              <button onClick={() => setIsClearModalOpen(true)} className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-red-400 transition-all active:scale-90">
                  <Eraser size={20} />
              </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:px-16 space-y-10 no-scrollbar">
          {messages.length === 0 && !isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-1000">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-accent/20 rounded-[3rem] blur-2xl group-hover:bg-accent/40 transition-all duration-700" />
                    <div className="relative w-24 h-24 bg-zinc-900/50 backdrop-blur-xl rounded-[2.5rem] border border-white/10 flex items-center justify-center mb-8 shadow-2xl">
                        <Bot size={48} className="text-accent group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>
                  <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-3 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                    Neural Link Ready
                  </h1>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em] max-w-[280px] leading-relaxed">
                    Awaiting synaptic input for system diagnostics and creative generation.
                  </p>
              </div>
          )}

          <div className="max-w-4xl mx-auto space-y-10 pb-8">
              {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                      <div className={`relative group shrink-0`}>
                        {msg.role === 'model' && <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-md opacity-50 group-hover:opacity-100 transition-opacity" />}
                        <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center border shadow-2xl transition-all duration-500 ${msg.role === 'user' ? 'bg-zinc-800 border-white/10 group-hover:border-white/20' : 'bg-zinc-900 border-accent/20 group-hover:border-accent/40'}`}>
                            {msg.role === 'user' ? <User size={22} className="text-zinc-400" /> : <Bot size={22} className="text-accent" />}
                        </div>
                      </div>
                      <div className={`max-w-[85%] space-y-3 ${msg.role === 'user' ? 'items-end text-right' : 'items-start'}`}>
                          {(msg.content || (msg.isStreaming && isLoading)) && (
                              <div className={`relative group/msg transition-all duration-300 ${
                                  msg.role === 'user' 
                                  ? 'bg-accent text-black font-bold rounded-[2.5rem] rounded-tr-lg p-6 shadow-[0_10px_30px_rgba(var(--accent-color-rgb),0.2)]' 
                                  : 'bg-zinc-900/40 backdrop-blur-xl border border-white/5 text-zinc-100 rounded-[2.5rem] rounded-tl-lg p-6 md:p-8 shadow-2xl'
                              }`}>
                                  <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-headings:font-black prose-code:text-accent">
                                      <ReactMarkdown 
                                          remarkPlugins={[remarkGfm]} 
                                          components={{
                                              p: ({children}) => <div className="mb-4 last:mb-0">{children}</div>,
                                              code({inline, children}: any) {
                                                  return !inline ? (
                                                    <div className="my-6 relative group/codebox">
                                                      <div className="absolute -inset-2 bg-gradient-to-r from-accent/10 to-transparent rounded-3xl blur opacity-0 group-hover/codebox:opacity-100 transition duration-500" />
                                                      <CodeBlock code={String(children).replace(/\n$/, '')} />
                                                    </div>
                                                  ) : <code className="bg-white/10 px-2 py-0.5 rounded-lg text-accent font-bold font-mono text-[13px]">{children}</code>
                                              }
                                          }}
                                      >
                                          {msg.content + (msg.isStreaming && msg.content ? "▍" : "")}
                                      </ReactMarkdown>
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>
              ))}
              {isLoading && messages.length > 0 && !messages[messages.length - 1].content && (
                  <div className="flex gap-3 animate-in fade-in duration-300">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center"><Bot size={16} className="text-accent animate-pulse" /></div>
                      <div className="bg-zinc-900/40 border border-zinc-800 rounded-[1.5rem] rounded-tl-none p-4 flex flex-col gap-2 min-w-[140px]">
                          <div className="flex items-center gap-2">
                              <Loader2 size={12} className="text-accent animate-spin" />
                              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">INISIASI DATA...</span>
                          </div>
                      </div>
                  </div>
              )}
              <div ref={messagesEndRef} className="h-2" />
          </div>
        </div>

        <div className="p-4 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-900 shrink-0 z-40 pb-[80px]">
          <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 bg-zinc-900 p-2 rounded-[2.2rem] border border-zinc-800 focus-within:border-accent/40 transition-all shadow-2xl relative group">
                  <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Tanyakan log error atau perintah..."
                      className="flex-1 bg-transparent text-white py-3 px-6 resize-none focus:outline-none text-[15px] font-medium leading-tight max-h-32 no-scrollbar placeholder:text-zinc-700 self-center"
                      rows={1}
                  />

                  <div className="flex items-center gap-1.5 pr-1.5 shrink-0">
                      <button 
                          onClick={() => handleSend()} 
                          disabled={!input.trim() || isLoading} 
                          className={`p-3 rounded-full transition-all active:scale-95 ${
                              input.trim() && !isLoading 
                              ? 'bg-accent text-black shadow-[0_0_20px_rgba(var(--accent-color-rgb),0.3)]' 
                              : 'bg-zinc-800 text-zinc-600 opacity-50'
                          }`}
                      >
                          {isLoading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} strokeWidth={2.5} />}
                      </button>
                  </div>
              </div>
          </div>
        </div>

        <IOSModal 
          isOpen={isClearModalOpen}
          title="Hapus Chat"
          message="Hapus seluruh pesan di sesi ini?"
          onConfirm={async () => {
              if (currentSessionId) {
                  await supabase.from('chat_messages').delete().eq('session_id', currentSessionId);
                  setMessages([]);
                  setIsClearModalOpen(false);
                  showToast("Chat dibersihkan", "info");
              }
          }}
          onCancel={() => setIsClearModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default AIChat;
