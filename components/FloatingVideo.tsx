
import React, { useState } from 'react';
import { X, Play, ExternalLink } from 'lucide-react';

interface FloatingVideoProps {
  videoId: string;
  label?: string;
}

const FloatingVideo: React.FC<FloatingVideoProps> = ({ videoId, label = "#TermuxTips" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // High quality thumbnail
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  if (!isVisible) return null;

  if (isPlaying) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
         <div className="w-full max-w-3xl bg-black rounded-2xl overflow-hidden shadow-2xl relative aspect-video ring-1 ring-white/10">
             <button 
                onClick={() => setIsPlaying(false)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors backdrop-blur-md"
             >
                <X size={20} />
             </button>
             <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0"
            />
         </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 z-40 animate-in slide-in-from-right-10 duration-500 ease-out">
        {/* Close Widget Button */}
        <button 
            onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
            className="absolute -top-2 -right-2 z-50 p-1 bg-zinc-800 text-zinc-400 rounded-full border border-zinc-700 hover:text-white transition-colors shadow-lg"
        >
            <X size={12} />
        </button>

        <button 
            onClick={() => setIsPlaying(true)}
            className="group relative w-28 aspect-[9/14] rounded-2xl overflow-hidden shadow-2xl border border-zinc-700/50 hover:border-green-500/50 transition-all duration-300 hover:scale-105 active:scale-95 bg-zinc-900"
        >
            {/* Thumbnail Image */}
            <div className="absolute inset-0">
               <img 
                 src={thumbnailUrl} 
                 alt="Video Thumbnail" 
                 className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
               />
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* Play Button & Pulse Effect */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="absolute w-10 h-10 bg-red-600/30 rounded-full animate-ping" />
                <div className="relative w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:bg-red-500 transition-colors">
                    <Play size={18} className="text-white fill-white ml-1" />
                </div>
            </div>

            {/* Label Badge */}
            <div className="absolute bottom-3 left-0 right-0 text-center px-1">
                <div className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                    <span className="text-[9px] font-bold text-white truncate max-w-[80px]">
                        {label}
                    </span>
                    <ExternalLink size={8} className="text-zinc-400" />
                </div>
            </div>
        </button>
    </div>
  );
};

export default FloatingVideo;
