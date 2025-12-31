
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
    <div className="p-4 space-y-4 pb-24 relative">
      <div className="px-1 py-2 flex items-center justify-between">
        <p className="text-zinc-400 text-sm">
          Tap circle to complete steps.
        </p>
        <button 
            onClick={openResetModal}
            className="text-[10px] font-bold text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors px-2 py-1.5 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800"
        >
            <RotateCcw size={12} />
            Reset Progress
        </button>
      </div>

      {GUIDES.map((guide) => {
        const isExpanded = expandedId === guide.id;
        const progress = getProgress(guide.id, guide.steps.length);
        const isComplete = progress === 100;

        return (
          <div 
            key={guide.id} 
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              isExpanded 
                ? 'bg-zinc-900 border-zinc-700 shadow-xl' 
                : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900'
            }`}
          >
            <button
              onClick={() => toggleExpand(guide.id)}
              className="w-full flex items-center justify-between p-5 text-left group"
            >
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-bold text-lg transition-colors ${isExpanded ? 'text-green-400' : 'text-zinc-200'}`}>
                    {guide.title}
                    </h3>
                    {isComplete && <CheckCircle2 size={16} className="text-green-500" />}
                </div>
                <p className="text-xs text-zinc-500 mb-3">{guide.description}</p>
                
                {/* Progress Bar */}
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden max-w-[150px]">
                    <div 
                        className={`h-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-green-500/60'}`} 
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-[10px] text-zinc-600 mt-1 font-mono">{progress}% Complete</p>
              </div>
              <div className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-zinc-800' : 'bg-transparent group-hover:bg-zinc-800'}`}>
                {isExpanded ? <ChevronUp size={20} className="text-zinc-400" /> : <ChevronDown size={20} className="text-zinc-500" />}
              </div>
            </button>

            {isExpanded && (
              <div className="px-5 pb-5 border-t border-zinc-800 bg-zinc-950/30">
                <div className="space-y-8 pt-6">
                  {guide.steps.map((step, index) => {
                    const stepKey = `${guide.id}-${index}`;
                    const isStepDone = !!completedSteps[stepKey];

                    return (
                        <div key={index} className={`relative pl-8 transition-opacity duration-300 ${isStepDone ? 'opacity-60' : 'opacity-100'}`}>
                        {/* Interactive Checkbox Line */}
                        <button 
                            onClick={() => toggleStep(guide.id, index)}
                            className="absolute -left-1.5 top-0 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-10 bg-zinc-950"
                        >
                            {isStepDone ? (
                                <CheckCircle2 size={20} className="text-green-500 fill-green-500/10" />
                            ) : (
                                <Circle size={20} className="text-zinc-600 hover:text-zinc-400" />
                            )}
                        </button>
                        
                        {/* Connecting Line */}
                        {index !== guide.steps.length - 1 && (
                            <div className={`absolute left-[3px] top-6 bottom-[-32px] w-[2px] ${isStepDone ? 'bg-green-500/20' : 'bg-zinc-800'}`} />
                        )}

                        <div 
                            onClick={() => !isStepDone && toggleStep(guide.id, index)}
                            className={`cursor-pointer ${isStepDone ? '' : 'hover:bg-zinc-900/50 -m-2 p-2 rounded-xl transition-colors'}`}
                        >
                            <h4 className={`text-sm font-bold mb-1 ${isStepDone ? 'text-zinc-500 line-through decoration-zinc-700' : 'text-zinc-200'}`}>
                                Step {index + 1}: {step.title}
                            </h4>
                            <div className={`text-sm mb-3 prose prose-invert prose-sm max-w-none ${isStepDone ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {step.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                        {step.command && (
                            <div className={isStepDone ? 'opacity-50 pointer-events-none grayscale' : ''}>
                                <CodeBlock code={step.command} />
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
