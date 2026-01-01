import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Mic, MicOff, Eraser, X, Plus, Sparkles, Volume2, VolumeX, Copy, ThumbsUp, ThumbsDown, Share2, RotateCcw, Check, Globe, ExternalLink, ShieldCheck, Cpu, MessageSquare, Trash2, Menu, ChevronLeft } from 'lucide-react';
import Groq from 'groq-sdk';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from '../components/CodeBlock';
import { showToast } from '../components/Toast';
import IOSModal from '../components/IOSModal';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || process.env.API_KEY || '',
  dangerouslyAllowBrowser: true
});

interface GroundingSource {
  title: string;
  uri: string;
}

interface Message {
  role: 'user' | 'model';
  content: string;
  image?: string;
  isStreaming?: boolean;
}

interface ChatSession {
  id: number;
  title: string;
  createdAt: string;
}

const AIChat: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const res = await fetch('/api/sessions');
      if (!res.ok) throw new Error('Failed to fetch sessions');
      const data = await res.json();
      setSessions(data);
      if (data.length > 0 && !currentSessionId) {
        selectSession(data[0].id);
      } else if (data.length === 0) {
        createNewChat();
      }
    } catch (err) {
      console.error('Session load error:', err);
      showToast("Gagal memuat chat. Pastikan backend aktif.", "error");
    }
  };

  const createNewChat = async () => {
    // Check if we already have an empty session to avoid duplicates
    const emptySession = sessions.find(s => s.title === 'New Chat');
    if (emptySession) {
      if (currentSessionId !== emptySession.id) {
        selectSession(emptySession.id);
      }
      setIsSidebarOpen(false);
      return;
    }

    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Chat' })
      });
      const newSession = await res.json();
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      setMessages([]);
      setIsSidebarOpen(false);
    } catch (err) {
      console.error(err);
      showToast("Gagal membuat chat baru", "error");
    }
  };

  const selectSession = async (id: number) => {
    setCurrentSessionId(id);
    setIsSidebarOpen(false);
    try {
      const res = await fetch(`/api/messages/${id}`);
      const data = await res.json();
      setMessages(data.map((m: any) => ({
        role: m.role,
        content: m.content,
        image: m.image || undefined
      })));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSession = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
      setSessions(prev => prev.filter(s => s.id !== id));
      if (currentSessionId === id) {
        setCurrentSessionId(null);
        setMessages([]);
        if (sessions.length > 1) {
          const next = sessions.find(s => s.id !== id);
          if (next) selectSession(next.id);
        } else {
          createNewChat();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSend = async (customPrompt?: string) => {
    if (!currentSessionId) return;
    const finalInput = customPrompt || input;
    if ((!finalInput.trim() && !selectedImage) || isLoading) return;
    
    const userMessage = finalInput.trim() || (selectedImage ? "Analisis gambar ini." : "");
    const currentImage = selectedImage;
    
    const newUserMsg: Message = { role: 'user', content: userMessage, image: currentImage || undefined };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // Update session title if it's the first message
      if (messages.length === 0) {
        const title = userMessage.length > 30 ? userMessage.substring(0, 30) + "..." : userMessage;
        await fetch(`/api/sessions/${currentSessionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title })
        });
        setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, title } : s));
      }

      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newUserMsg, sessionId: currentSessionId })
      });

      setMessages(prev => [...prev, { role: 'model', content: '', isStreaming: true }]);

      const stream = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "Anda adalah 'X-Intelligence'. Berikan jawaban teknis, singkat, dan gunakan Markdown." },
          { role: "user", content: userMessage }
        ],
        model: "llama-3.3-70b-versatile",
        stream: true,
      });

      let fullContent = '';
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
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...finalModelMsg, sessionId: currentSessionId })
      });

      setMessages(prev => [...prev.slice(0, -1), finalModelMsg]);
    } catch (err) {
      console.error(err);
      showToast("Gagal terhubung ke AI.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-zinc-950 overflow-hidden relative">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header */}
        <header className="px-5 py-4 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl z-30 shrink-0">
          <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 lg:hidden bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400"
                  >
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
              <div className="flex items-center gap-2">
                <button onClick={() => setIsClearModalOpen(true)} className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-red-400 transition-all active:scale-90">
                    <Eraser size={20} />
                </button>
              </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:px-12 space-y-6 no-scrollbar">
          {messages.length === 0 && !isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-700">
                  <div className="w-20 h-20 bg-accent/5 rounded-[2.5rem] border border-accent/20 flex items-center justify-center mb-6 shadow-2xl">
                      <Bot size={40} className="text-accent" />
                  </div>
                  <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">INTERFACE READY</h1>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest max-w-[220px]">Menunggu inisiasi input dari pengguna.</p>
              </div>
          )}

          <div className="max-w-4xl mx-auto space-y-8 pb-4">
              {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                      <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${msg.role === 'user' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-900 border-zinc-800'}`}>
                          {msg.role === 'user' ? <User size={16} className="text-zinc-500" /> : <Bot size={16} className="text-accent" />}
                      </div>
                      <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          {msg.image && (
                              <img src={msg.image} className="w-60 rounded-2xl border border-zinc-800 mb-2 shadow-2xl" alt="Input" />
                          )}
                          {(msg.content || (msg.isStreaming && isLoading)) && (
                              <div className={`p-4 rounded-[1.8rem] text-[14px] leading-relaxed shadow-lg ${
                                  msg.role === 'user' 
                                  ? 'bg-accent text-black font-black rounded-tr-none' 
                                  : 'bg-zinc-900/60 border border-zinc-800 text-zinc-100 rounded-tl-none'
                              }`}>
                                  <div className="prose prose-invert prose-sm max-w-none prose-p:my-1.5 prose-code:text-accent prose-headings:text-white">
                                      <ReactMarkdown 
                                          remarkPlugins={[remarkGfm]} 
                                          components={{
                                              p: ({children}) => <div className="mb-4 last:mb-0">{children}</div>,
                                              code({inline, children}: any) {
                                                  return !inline ? <CodeBlock code={String(children).replace(/\n$/, '')} /> : <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-accent font-mono text-[12px]">{children}</code>
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

        {/* Input area */}
        <div className="p-4 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-900 shrink-0 z-40">
          <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 bg-zinc-900 p-2 rounded-[2.2rem] border border-zinc-800 focus-within:border-accent/40 transition-all shadow-2xl relative group">
                  {selectedImage && (
                      <div className="absolute -top-16 left-4 animate-in zoom-in duration-200">
                          <div className="relative p-1 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
                              <img src={selectedImage} className="w-12 h-12 rounded-lg object-cover" />
                              <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-lg"><X size={12} /></button>
                          </div>
                      </div>
                  )}

                  <button onClick={() => fileInputRef.current?.click()} className="p-3 text-zinc-500 hover:text-accent transition-all active:scale-90 rounded-full hover:bg-zinc-800">
                      <Plus size={22} strokeWidth={2.5} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setSelectedImage(reader.result as string);
                          reader.readAsDataURL(file);
                      }
                  }} accept="image/*" className="hidden" />
                  
                  <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Tanyakan log error atau perintah..."
                      className="flex-1 bg-transparent text-white py-3 px-1 resize-none focus:outline-none text-[15px] font-medium leading-tight max-h-32 no-scrollbar placeholder:text-zinc-700 self-center"
                      rows={1}
                  />

                  <div className="flex items-center gap-1.5 pr-1.5 shrink-0">
                      <button 
                          onClick={() => handleSend()} 
                          disabled={(!input.trim() && !selectedImage) || isLoading} 
                          className={`p-3 rounded-full transition-all active:scale-95 ${
                              (input.trim() || selectedImage) && !isLoading 
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
                  await fetch(`/api/messages/${currentSessionId}`, { method: 'DELETE' });
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
