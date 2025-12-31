
import React from 'react';
import { ArrowLeft, HelpCircle, MessageCircle, FileText, Search } from 'lucide-react';
import { ViewState } from '../../types';

interface Props {
    onBack: () => void;
}

const Help: React.FC<Props> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-zinc-950 p-6 pb-24">
            <div className="max-w-3xl mx-auto space-y-6">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-bold mb-4"
                >
                    <ArrowLeft size={16} /> Back
                </button>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-white">Help Center</h1>
                    <p className="text-zinc-400 text-sm">Find answers to common questions about XTermux.</p>
                </div>

                <div className="relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                     <input 
                        type="text" 
                        placeholder="Search for help..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-zinc-200 focus:outline-none focus:border-green-500/50 transition-colors"
                     />
                </div>

                <div className="grid gap-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                                <FileText size={20} />
                            </div>
                            <h3 className="font-bold text-white">Getting Started</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-zinc-400">
                            <li className="flex items-center gap-2 hover:text-green-400 cursor-pointer transition-colors">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                                How to install packages?
                            </li>
                            <li className="flex items-center gap-2 hover:text-green-400 cursor-pointer transition-colors">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                                Setting up storage permissions
                            </li>
                            <li className="flex items-center gap-2 hover:text-green-400 cursor-pointer transition-colors">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                                Connecting to AI Assistant
                            </li>
                        </ul>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                <MessageCircle size={20} />
                            </div>
                            <h3 className="font-bold text-white">Account & Support</h3>
                        </div>
                        <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
                            Need help with your account or have a specific question not covered here?
                        </p>
                        <a href="mailto:xyraofficialsup@gmail.com" className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold text-white transition-colors">
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Help;
