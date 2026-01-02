
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, RotateCcw, X, Trash2, CheckSquare, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GUIDES } from '../constants';
import CodeBlock from '../components/CodeBlock';
import { showToast } from '../components/Toast';

const GUIDE_PROGRESS_KEY = 'xtermux_guide_progress';

const Guides: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('setup-1');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  
  // Reset Modal State
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedGuidesToReset, setSelectedGuidesToReset] = useState<string[]>([]);

  // Load progress from local storage
  useEffect(() => {
    const saved = localStorage.getItem(GUIDE_PROGRESS_KEY);
    if (saved) {
      try {
        setCompletedSteps(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse guide progress", e);
      }
    }
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleStep = (guideId: string, stepIndex: number) => {
    const key = `${guideId}-${stepIndex}`;
    setCompletedSteps(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(GUIDE_PROGRESS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const getProgress = (guideId: string, totalSteps: number) => {
    let completed = 0;
    for (let i = 0; i < totalSteps; i++) {
      if (completedSteps[`${guideId}-${i}`]) completed++;
    }
    return Math.round((completed / totalSteps) * 100);
  };

  // Reset Logic
  const openResetModal = () => {
      // Pre-select all guides that have at least some progress
      const guidesWithProgress = GUIDES.filter(g => getProgress(g.id, g.steps.length) > 0).map(g => g.id);
      
      if (guidesWithProgress.length === 0) {
          showToast('No progress to reset yet.', 'info');
          return;
      }
      
      setSelectedGuidesToReset(guidesWithProgress);
      setShowResetModal(true);
  };

  const toggleGuideSelection = (id: string) => {
      setSelectedGuidesToReset(prev => 
        prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
      );
  };

  const toggleSelectAll = () => {
      if (selectedGuidesToReset.length === GUIDES.length) {
          setSelectedGuidesToReset([]);
      } else {
          setSelectedGuidesToReset(GUIDES.map(g => g.id));
      }
  };

  const executeReset = () => {
      if (selectedGuidesToReset.length === 0) return;

      const newCompletedSteps = { ...completedSteps };
      
      // Filter out steps belonging to selected guides
      Object.keys(newCompletedSteps).forEach(key => {
          // key format: "guideId-stepIndex"
          // We check if the key starts with any of the selected guide IDs followed by a dash
          const guideId = key.substring(0, key.lastIndexOf('-'));
          if (selectedGuidesToReset.includes(guideId)) {
              delete newCompletedSteps[key];
          }
      });

      setCompletedSteps(newCompletedSteps);
      localStorage.setItem(GUIDE_PROGRESS_KEY, JSON.stringify(newCompletedSteps));
      setShowResetModal(false);
      showToast(`Reset progress for ${selectedGuidesToReset.length} guides.`, 'success');
  };

  return (
    <div className="p-6 space-y-6 pb-32 relative">
      <div className="px-2 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
            Operational Protocols
          </p>
        </div>
        <button 
            onClick={openResetModal}
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-400 flex items-center gap-2 transition-all px-4 py-2 bg-zinc-900/50 backdrop-blur-md rounded-xl border border-white/5 hover:border-red-500/30 hover:bg-red-500/5"
        >
            <RotateCcw size={12} />
            Reset
        </button>
      </div>

      {GUIDES.map((guide) => {
        const isExpanded = expandedId === guide.id;
        const progress = getProgress(guide.id, guide.steps.length);
        const isComplete = progress === 100;

        return (
          <div 
            key={guide.id} 
            className={`group relative rounded-[2.5rem] transition-all duration-500 overflow-hidden ${
              isExpanded 
                ? 'shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
                : ''
            }`}
          >
            <div className={`absolute inset-0 transition-all duration-500 ${isExpanded ? 'bg-zinc-900/60' : 'bg-zinc-900/30'} backdrop-blur-xl border border-white/5 ${isExpanded ? 'border-accent/30' : 'group-hover:border-white/10'}`} />
            
            <button
              onClick={() => toggleExpand(guide.id)}
              className="relative w-full flex items-center justify-between p-6 md:p-8 text-left"
            >
              <div className="flex-1 pr-6">
                <div className="flex items-center gap-3 mb-2">
                    <h3 className={`font-black text-xl tracking-tight transition-colors ${isExpanded ? 'text-white' : 'text-zinc-300'}`}>
                    {guide.title}
                    </h3>
                    {isComplete && (
                      <div className="p-1 bg-accent rounded-full shadow-[0_0_10px_var(--accent-color)]">
                        <CheckCircle2 size={12} className="text-black" />
                      </div>
                    )}
                </div>
                <p className="text-xs text-zinc-500 mb-5 font-medium leading-relaxed max-w-md">{guide.description}</p>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden max-w-[120px]">
                      <div 
                          className={`h-full transition-all duration-1000 ease-out shadow-[0_0_8px_var(--accent-color)] ${isComplete ? 'bg-accent' : 'bg-accent/60'}`} 
                          style={{ width: `${progress}%` }}
                      />
                  </div>
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{progress}%</span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${isExpanded ? 'bg-accent text-black rotate-180 shadow-[0_0_20px_var(--accent-color)]' : 'bg-zinc-800/50 text-zinc-500 border border-white/5'}`}>
                <ChevronDown size={20} />
              </div>
            </button>

            {isExpanded && (
              <div className="relative px-6 md:px-8 pb-8 animate-in slide-in-from-top-4 duration-500">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mb-8" />
                <div className="space-y-10 pt-2">
                  {guide.steps.map((step, index) => {
                    const stepKey = `${guide.id}-${index}`;
                    const isStepDone = !!completedSteps[stepKey];

                    return (
                        <div key={index} className={`relative pl-12 transition-all duration-500 ${isStepDone ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}>
                        {/* Interactive Checkbox Line */}
                        <button 
                            onClick={() => toggleStep(guide.id, index)}
                            className={`absolute left-0 top-0 w-8 h-8 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-10 border ${isStepDone ? 'bg-accent border-accent text-black shadow-[0_0_15px_var(--accent-color)]' : 'bg-zinc-900 border-white/5 text-zinc-600 hover:text-zinc-400'}`}
                        >
                            {isStepDone ? (
                                <CheckCircle2 size={18} />
                            ) : (
                                <Circle size={18} />
                            )}
                        </button>
                        
                        {/* Connecting Line */}
                        {index !== guide.steps.length - 1 && (
                            <div className={`absolute left-4 top-10 bottom-[-40px] w-0.5 ${isStepDone ? 'bg-accent/20' : 'bg-white/5'}`} />
                        )}

                        <div 
                            onClick={() => !isStepDone && toggleStep(guide.id, index)}
                            className={`cursor-pointer group/step ${isStepDone ? '' : 'hover:bg-white/5 -m-3 p-3 rounded-2.5xl transition-all duration-300'}`}
                        >
                            <h4 className={`text-[15px] font-black mb-2 tracking-tight flex items-center gap-2 ${isStepDone ? 'text-zinc-500 line-through' : 'text-white'}`}>
                                <span className="text-[10px] text-zinc-600 font-mono tracking-normal">0{index + 1}</span>
                                {step.title}
                            </h4>
                            <div className={`text-sm mb-4 prose prose-invert prose-sm max-w-none leading-relaxed ${isStepDone ? 'text-zinc-600' : 'text-zinc-400 font-medium'}`}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {step.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                        {step.command && (
                            <div className={`transition-all duration-500 ${isStepDone ? 'pointer-events-none' : ''}`}>
                                <div className="relative group/code">
                                  <div className="absolute -inset-1 bg-gradient-to-r from-accent/10 to-transparent rounded-2xl blur opacity-0 group-hover/code:opacity-100 transition duration-500" />
                                  <CodeBlock code={step.command} />
                                </div>
                            </div>
                        )}
                        </div>
                    );
                  })}
                </div>
                
                {progress === 100 && (
                    <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 animate-in zoom-in duration-300">
                        <div className="p-2 bg-green-500 rounded-full text-black">
                            <CheckCircle2 size={18} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-green-500">Guide Completed!</h4>
                            <p className="text-xs text-green-200/70">You're all set with this configuration.</p>
                        </div>
                    </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* RESET SELECTION MODAL */}
      {showResetModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-300">
                  <div className="p-4 border-b border-zinc-800 flex items-center justify-between shrink-0">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <RotateCcw size={16} className="text-red-400" />
                          Reset Progress
                      </h3>
                      <button onClick={() => setShowResetModal(false)} className="text-zinc-500 hover:text-white">
                          <X size={18} />
                      </button>
                  </div>
                  
                  <div className="p-2 border-b border-zinc-800 bg-zinc-950/30">
                      <button 
                        onClick={toggleSelectAll}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition-colors text-sm text-zinc-300"
                      >
                         {selectedGuidesToReset.length === GUIDES.length ? (
                             <CheckSquare size={18} className="text-green-500" />
                         ) : (
                             <Square size={18} className="text-zinc-600" />
                         )}
                         Select All
                      </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                      {GUIDES.map(guide => {
                          const progress = getProgress(guide.id, guide.steps.length);
                          if (progress === 0) return null; // Only show guides with progress

                          const isSelected = selectedGuidesToReset.includes(guide.id);

                          return (
                              <button
                                key={guide.id}
                                onClick={() => toggleGuideSelection(guide.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                    isSelected ? 'bg-red-500/10 border-red-500/30' : 'bg-zinc-900 border-transparent hover:bg-zinc-800'
                                }`}
                              >
                                  {isSelected ? (
                                      <CheckSquare size={18} className="text-red-400 shrink-0" />
                                  ) : (
                                      <Square size={18} className="text-zinc-600 shrink-0" />
                                  )}
                                  <div className="text-left flex-1 min-w-0">
                                      <p className={`text-xs font-bold truncate ${isSelected ? 'text-red-200' : 'text-zinc-300'}`}>
                                          {guide.title}
                                      </p>
                                      <p className="text-[10px] text-zinc-500">{progress}% Completed</p>
                                  </div>
                              </button>
                          )
                      })}
                  </div>

                  <div className="p-4 border-t border-zinc-800 shrink-0 flex gap-3">
                      <button 
                        onClick={() => setShowResetModal(false)}
                        className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 transition-colors"
                      >
                          Cancel
                      </button>
                      <button 
                        onClick={executeReset}
                        disabled={selectedGuidesToReset.length === 0}
                        className="flex-[2] py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold text-white transition-colors flex items-center justify-center gap-2"
                      >
                          <Trash2 size={14} />
                          Reset Selected ({selectedGuidesToReset.length})
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Guides;
