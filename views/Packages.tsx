
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Package, Database, RefreshCw, X, Code, Globe, Settings, Wrench, History, Trash2, ChevronDown, Info, Heart, ArrowDownAZ, ArrowUpAZ, Plus, Check, ShoppingCart, Copy } from 'lucide-react';
import { PACKAGES } from '../constants';
import { PackageItem } from '../types';
import CodeBlock from '../components/CodeBlock';
import { showToast } from '../components/Toast';

type CategoryType = 'All' | 'Development' | 'System' | 'Network' | 'Utility' | 'Saved';
type SortOrder = 'AZ' | 'ZA';

const CATEGORIES: { name: CategoryType; icon: React.ReactNode }[] = [
  { name: 'All', icon: <Package size={14} /> },
  { name: 'Saved', icon: <Heart size={14} /> },
  { name: 'Development', icon: <Code size={14} /> },
  { name: 'System', icon: <Settings size={14} /> },
  { name: 'Network', icon: <Globe size={14} /> },
  { name: 'Utility', icon: <Wrench size={14} /> },
];

const RECENTLY_VIEWED_KEY = 'xtermux_recently_viewed';
const FAVORITES_KEY = 'xtermux_favorites';
const INSTALL_QUEUE_KEY = 'xtermux_install_queue';
const ITEMS_PER_PAGE = 20;

const Packages: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('AZ');
  const [recentlyViewed, setRecentlyViewed] = useState<PackageItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [installQueue, setInstallQueue] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showQueueOverlay, setShowQueueOverlay] = useState(false);

  // Load persistence
  useEffect(() => {
    const savedRecent = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (savedRecent) {
      try {
        const parsedIds = JSON.parse(savedRecent) as string[];
        const validRecent = parsedIds
          .map(id => PACKAGES.find(p => p.id === id))
          .filter((p): p is PackageItem => !!p);
        setRecentlyViewed(validRecent);
      } catch (e) { console.error(e); }
    }

    const savedFavs = localStorage.getItem(FAVORITES_KEY);
    if (savedFavs) {
        try { setFavorites(JSON.parse(savedFavs)); } catch (e) { console.error(e); }
    }

    const savedQueue = localStorage.getItem(INSTALL_QUEUE_KEY);
    if (savedQueue) {
        try { setInstallQueue(JSON.parse(savedQueue)); } catch (e) { console.error(e); }
    }
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => {
        const exists = prev.includes(id);
        const newFavs = exists ? prev.filter(fid => fid !== id) : [...prev, id];
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavs));
        showToast(exists ? 'Removed from favorites' : 'Added to favorites', exists ? 'info' : 'success');
        return newFavs;
    });
  };

  const toggleQueue = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setInstallQueue(prev => {
        const exists = prev.includes(id);
        const newQueue = exists ? prev.filter(qid => qid !== id) : [...prev, id];
        localStorage.setItem(INSTALL_QUEUE_KEY, JSON.stringify(newQueue));
        showToast(exists ? 'Removed from queue' : 'Added to install queue', 'info');
        return newQueue;
    });
  };

  const clearQueue = () => {
      setInstallQueue([]);
      localStorage.setItem(INSTALL_QUEUE_KEY, JSON.stringify([]));
      showToast('Queue cleared', 'info');
  };

  const generateBulkCommand = () => {
      if (installQueue.length === 0) return "";
      const pkgNames = installQueue.map(id => PACKAGES.find(p => p.id === id)?.name || id).join(' ');
      return `pkg install ${pkgNames.toLowerCase()}`;
  };

  const filteredPackages = useMemo(() => {
    const filtered = PACKAGES.filter(pkg => {
      const matchesSearch = 
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesCategory = true;
      if (selectedCategory === 'Saved') {
        matchesCategory = favorites.includes(pkg.id);
      } else if (selectedCategory !== 'All') {
        matchesCategory = pkg.category === (selectedCategory as string);
      }

      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => sortOrder === 'AZ' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  }, [searchTerm, selectedCategory, favorites, sortOrder]);

  const visiblePackages = useMemo(() => filteredPackages.slice(0, visibleCount), [filteredPackages, visibleCount]);

  return (
    <div className="flex flex-col relative">
      {/* Search & Filter Header */}
      <div className="sticky top-[-1px] z-40 bg-zinc-950 border-b border-zinc-900/50">
        <div className="px-4 pt-2 pb-2">
          <div className="relative group">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchTerm ? 'text-accent' : 'text-zinc-500'}`} size={18} />
            <input 
              type="text"
              placeholder={`Search packages...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/80 text-white pl-12 pr-10 py-3.5 rounded-2xl border border-zinc-800 focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all text-[14px] font-medium placeholder:text-zinc-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-4 pb-4 gap-2">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1">
            {CATEGORIES.map((cat) => (
                <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap text-[12px] font-bold transition-all ${
                    selectedCategory === cat.name
                    ? 'bg-accent/10 border-accent/50 text-accent'
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'
                }`}
                >
                {cat.icon}{cat.name}
                </button>
            ))}
            </div>
            <button onClick={() => setSortOrder(prev => prev === 'AZ' ? 'ZA' : 'AZ')} className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 active:scale-95 transition-all">
                {sortOrder === 'AZ' ? <ArrowDownAZ size={18} /> : <ArrowUpAZ size={18} />}
            </button>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-40">
        <div className="grid gap-4">
            {visiblePackages.map((pkg) => {
              const isFav = favorites.includes(pkg.id);
              const isInQueue = installQueue.includes(pkg.id);
              return (
                <div key={pkg.id} className="group bg-zinc-900/40 border border-zinc-800/60 rounded-[1.5rem] p-5 hover:border-zinc-700 transition-all duration-300 relative">
                  <div className="absolute top-5 right-5 flex items-center gap-2">
                      <button 
                        onClick={(e) => toggleQueue(e, pkg.id)}
                        className={`p-2 rounded-xl transition-all active:scale-90 ${isInQueue ? 'bg-accent text-black' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}
                        title="Add to Bulk Install Queue"
                      >
                        {isInQueue ? <Check size={18} /> : <Plus size={18} />}
                      </button>
                      <button 
                        onClick={(e) => toggleFavorite(e, pkg.id)}
                        className={`p-2 rounded-xl transition-all active:scale-90 ${isFav ? 'text-red-500 bg-red-500/10' : 'text-zinc-600 bg-zinc-800/50'}`}
                      >
                        <Heart size={18} className={isFav ? 'fill-current' : ''} />
                      </button>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:border-accent/30 transition-colors">
                      <Package size={20} className="text-zinc-400 group-hover:text-accent" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-[16px] tracking-tight">{pkg.name}</h4>
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{pkg.category}</span>
                    </div>
                  </div>

                  <p className="text-[13px] text-zinc-400 mb-5 leading-relaxed font-medium line-clamp-2 pr-12">{pkg.description}</p>
                  <CodeBlock code={pkg.installCommand} />
                </div>
              );
            })}
        </div>

        {visibleCount < filteredPackages.length && (
            <button onClick={() => setVisibleCount(v => v + ITEMS_PER_PAGE)} className="w-full py-4 rounded-[1.5rem] bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                Load More Packages
            </button>
        )}
      </div>

      {/* Bulk Install Queue FAB */}
      {installQueue.length > 0 && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 duration-500">
              <button 
                onClick={() => setShowQueueOverlay(true)}
                className="bg-accent text-black font-black text-xs uppercase px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
              >
                  <ShoppingCart size={18} />
                  Install Queue ({installQueue.length})
              </button>
          </div>
      )}

      {/* Queue Modal */}
      {showQueueOverlay && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden flex flex-col max-h-[70vh] shadow-2xl">
                  <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <ShoppingCart className="text-accent" />
                          <h3 className="font-black text-white uppercase tracking-widest">Install Queue</h3>
                      </div>
                      <button onClick={() => setShowQueueOverlay(false)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors"><X size={20} className="text-zinc-500" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      <div className="flex flex-wrap gap-2">
                          {installQueue.map(id => {
                              const pkg = PACKAGES.find(p => p.id === id);
                              return (
                                  <div key={id} className="flex items-center gap-2 bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
                                      <span className="text-xs font-bold text-zinc-300">{pkg?.name || id}</span>
                                      <button onClick={(e) => toggleQueue(e, id)} className="text-zinc-500 hover:text-red-400"><X size={14} /></button>
                                  </div>
                              );
                          })}
                      </div>
                      <div className="pt-4 space-y-2">
                          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Final Bulk Command</p>
                          <CodeBlock code={generateBulkCommand()} />
                      </div>
                  </div>
                  <div className="p-6 bg-zinc-950/50 border-t border-zinc-800 flex gap-3">
                      <button onClick={clearQueue} className="flex-1 py-4 bg-zinc-800 text-zinc-400 font-bold uppercase text-[10px] rounded-xl">Clear All</button>
                      <button onClick={() => {
                          navigator.clipboard.writeText(generateBulkCommand());
                          showToast('Bulk command copied!', 'success');
                      }} className="flex-[2] py-4 bg-accent text-black font-bold uppercase text-[10px] rounded-xl flex items-center justify-center gap-2">
                          <Copy size={14} /> Copy Final Command
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Packages;
