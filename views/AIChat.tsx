
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Mic, MicOff, Eraser, X, Plus, Sparkles, Volume2, VolumeX, Copy, ThumbsUp, ThumbsDown, Share2, RotateCcw, Check, Globe, ExternalLink, ShieldCheck, Cpu } from 'lucide-react';
import Groq from 'groq-sdk';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from '../components/CodeBlock';
import { showToast } from '../components/Toast';

const groq = new Groq({
  apiKey: "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",
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
  liked?: boolean;
  disliked?: boolean;
  sources?: GroundingSource[];
  isStreaming?: boolean;
}

const CHAT_STORAGE_KEY = 'xtermux_ai_history_final_v3';

const SUGGESTIONS = [
    { title: "Network Audit", prompt: "Berikan langkah audit jaringan dengan nmap di Termux", icon: <Globe size={14}/> },
    { title: "Fix Signal 9", prompt: "Cara mengatasi error Signal 9 di Android 12/13/14", icon: <ShieldCheck size={14}/> },
    { title: "Metasploit", prompt: "Cara install Metasploit di Termux terbaru", icon: <Cpu size={14}/> }
];

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.filter(m => !m.isStreaming)));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearChat = () => {
    if(window.confirm("Hapus seluruh percakapan?")) {
        setMessages([]);
        localStorage.removeItem(CHAT_STORAGE_KEY);
        showToast('Memori dibersihkan', 'info');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (customPrompt?: string) => {
    const finalInput = customPrompt || input;
    if ((!finalInput.trim() && !selectedImage) || isLoading) return;
    
    const userMessage = finalInput.trim() || (selectedImage ? "Analisis gambar ini." : "");
    const currentImage = selectedImage;
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage, image: currentImage || undefined }]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // Create assistant message with streaming state
      setMessages(prev => [...prev, { role: 'model', content: '', isStreaming: true }]);

      const stream = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Anda adalah 'X-Intelligence'. Berikan jawaban teknis, singkat, dan gunakan Markdown.",
          },
          {
            role: "user",
            content: userMessage,
          },
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
            if (last.role === 'model' && last.isStreaming) {
              return [...prev.slice(0, -1), { ...last, content: fullContent }];
            }
            return prev;
          });
        }
      }

      setMessages(prev => {
        const last = prev[prev.length - 1];
        return [...prev.slice(0, -1), { ...last, isStreaming: false }];
      });

    } catch (err) {
      console.error(err);
      showToast("Gagal terhubung ke AI.", "error");
      setMessages(prev => prev.filter(m => m.content !== '' || !m.isStreaming));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    showToast('Berhasil disalin', 'success');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden relative">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl z-30 shrink-0">
        <div className="flex justify-between items-center">
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
            <button onClick={handleClearChat} className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-red-400 transition-all active:scale-90">
                <Eraser size={20} />
            </button>
        </div>
      </div>

      {/* Chat Area - Menggunakan flex-1 agar memenuhi ruang tengah */}
      <div className="flex-1 overflow-y-auto p-4 md:px-12 space-y-6 no-scrollbar">
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
                        {/* Bubble hanya muncul jika ada konten atau sedang streaming (dengan syarat konten tidak kosong untuk kursor) */}
                        {(msg.content || (msg.isStreaming && isLoading)) && (
                            <div className={`p-4 rounded-[1.8rem] text-[14px] leading-relaxed shadow-lg ${
                                msg.role === 'user' 
                                ? 'bg-accent text-black font-black rounded-tr-none' 
                                : 'bg-zinc-900/60 border border-zinc-800 text-zinc-100 rounded-tl-none'
                            }`}>
                                <div className="prose prose-invert prose-sm max-w-none prose-p:my-1.5 prose-code:text-accent prose-headings:text-white">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                                        code({inline, children}: any) {
                                            return !inline ? <CodeBlock code={String(children).replace(/\n$/, '')} /> : <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-accent font-mono text-[12px]">{children}</code>
                                        }
                                    }}>
                                        {/* PERBAIKAN: Kursor hanya muncul jika content sudah ada teksnya agar tidak kotak kosong sendirian */}
                                        {msg.content + (msg.isStreaming && msg.content ? "▍" : "")}
                                    </ReactMarkdown>
                                </div>

                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-wrap gap-2">
                                        {msg.sources.map((s, i) => (
                                            <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800/50 border border-zinc-700 rounded-lg text-[9px] text-zinc-400 hover:text-accent transition-colors font-bold uppercase tracking-tight">
                                                <span className="truncate max-w-[120px]">{s.title}</span>
                                                <ExternalLink size={10} />
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {msg.role === 'model' && !msg.isStreaming && msg.content && (
                            <div className="flex gap-4 px-2 py-1 opacity-60 hover:opacity-100 transition-opacity">
                                <button onClick={() => handleCopy(msg.content, idx)} className={`transition-colors ${copiedIdx === idx ? 'text-green-500' : 'text-zinc-700 hover:text-zinc-400'}`}>
                                    {copiedIdx === idx ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                                <button className="text-zinc-700 hover:text-zinc-400"><Share2 size={14}/></button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            
            {/* Thinking Animation muncul SAAT menunggu teks pertama */}
            {isLoading && messages.length > 0 && !messages[messages.length - 1].content && (
                <div className="flex gap-3 animate-in fade-in duration-300">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center"><Bot size={16} className="text-accent animate-pulse" /></div>
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-[1.5rem] rounded-tl-none p-4 flex flex-col gap-2 min-w-[140px]">
                        <div className="flex items-center gap-2">
                            <Loader2 size={12} className="text-accent animate-spin" />
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">INISIASI DATA...</span>
                        </div>
                        <div className="w-full h-0.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-accent w-1/3 animate-[loading_1.5s_infinite_ease-in-out]" />
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} className="h-2" />
        </div>
      </div>

      {/* Input Bar - Tetap di bawah tapi tidak menutupi chat */}
      <div className="p-4 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-900 shrink-0 z-40">
        <div className="max-w-4xl mx-auto space-y-4">
            {!isLoading && messages.length < 5 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {SUGGESTIONS.map((s, i) => (
                        <button key={i} onClick={() => handleSend(s.prompt)} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-black text-zinc-400 hover:text-accent hover:border-accent/40 transition-all whitespace-nowrap active:scale-95 shadow-lg">
                            {s.icon}
                            {s.title}
                        </button>
                    ))}
                </div>
            )}

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
                <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
                
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tanyakan log error atau perintah..."
                    className="flex-1 bg-transparent text-white py-3 px-1 resize-none focus:outline-none text-[15px] font-medium leading-tight max-h-32 no-scrollbar placeholder:text-zinc-700 self-center"
                    rows={1}
                />

                <div className="flex items-center gap-1.5 pr-1.5 shrink-0">
                    <button className="p-3 text-zinc-500 hover:text-accent transition-all rounded-full hover:bg-zinc-800">
                        <Mic size={22} />
                    </button>
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

      <style>{`
        @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default AIChat;
