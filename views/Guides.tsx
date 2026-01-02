import React, { useState, useEffect } from 'react';
import { ChevronDown, CheckCircle2, Circle, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GUIDES } from '../constants';
import CodeBlock from '../components/CodeBlock';
import { showToast } from '../components/Toast';

const Guides: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem('xtermux_guide_progress');
    if (saved) try { setCompletedSteps(JSON.parse(saved)); } catch (e) {}
  }, []);

  const toggleStep = (guideId: string, idx: number) => {
    const key = `${guideId}-${idx}`;
    const next = { ...completedSteps, [key]: !completedSteps[key] };
    setCompletedSteps(next);
    localStorage.setItem('xtermux_guide_progress', JSON.stringify(next));
  };

  return (
    <div className="p-4 space-y-4 pb-32 bg-black min-h-full">
      <header className="flex items-center justify-between px-2 mb-6">
        <div>
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Codex</h2>
          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Protocols</p>
        </div>
        <button onClick={() => { setCompletedSteps({}); localStorage.removeItem('xtermux_guide_progress'); }} className="p-2 bg-zinc-900 border border-white/5 rounded-xl text-zinc-600 hover:text-red-400 transition-all">
          <RotateCcw size={16} />
        </button>
      </header>

      {GUIDES.map((guide) => {
        const isExpanded = expandedId === guide.id;
        const steps = guide.steps.length;
        const done = guide.steps.filter((_, i) => completedSteps[`${guide.id}-${i}`]).length;
        const progress = Math.round((done / steps) * 100);

        return (
          <div key={guide.id} className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden transition-all">
            <button onClick={() => setExpandedId(isExpanded ? null : guide.id)} className="w-full p-5 text-left flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="font-black text-white text-base truncate mb-1">{guide.title}</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 bg-black rounded-full overflow-hidden max-w-[80px]">
                    <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-[9px] font-black text-zinc-600 uppercase">{progress}%</span>
                </div>
              </div>
              <ChevronDown size={20} className={`text-zinc-600 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-accent' : ''}`} />
            </button>

            {isExpanded && (
              <div className="p-5 pt-0 space-y-8 animate-in slide-in-from-top-2 duration-300">
                <div className="h-px bg-white/5 mb-6" />
                {guide.steps.map((step, i) => {
                  const isDone = !!completedSteps[`${guide.id}-${i}`];
                  return (
                    <div key={i} className={`relative pl-10 ${isDone ? 'opacity-40' : ''}`}>
                      <button onClick={() => toggleStep(guide.id, i)} className={`absolute left-0 top-0 w-7 h-7 rounded-xl border flex items-center justify-center transition-all ${isDone ? 'bg-accent border-accent text-black' : 'bg-zinc-900 border-white/10 text-zinc-700'}`}>
                        {isDone ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      </button>
                      <h4 className={`text-xs font-black mb-2 uppercase tracking-widest ${isDone ? 'text-zinc-500 line-through' : 'text-white'}`}>{step.title}</h4>
                      <div className="text-[11px] text-zinc-500 leading-relaxed font-medium mb-4"><ReactMarkdown remarkPlugins={[remarkGfm]}>{step.content}</ReactMarkdown></div>
                      {step.command && <CodeBlock code={step.command} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Guides;
