
import React from 'react';
import { ArrowLeft, FileText, AlertTriangle, Scale } from 'lucide-react';

interface Props {
    onBack: () => void;
}

const Terms: React.FC<Props> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-zinc-950 p-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-3xl mx-auto space-y-8">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-bold mb-4"
                >
                    <ArrowLeft size={16} /> Back
                </button>

                <div className="flex items-center gap-3 pb-6 border-b border-zinc-900">
                    <div className="p-3 bg-blue-500/10 rounded-2xl">
                        <Scale size={28} className="text-blue-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Terms of Service</h1>
                        <p className="text-zinc-500 text-sm">Last updated: October 2024</p>
                    </div>
                </div>

                <div className="space-y-8 text-sm text-zinc-400 leading-relaxed text-justify">
                    <section className="space-y-3">
                        <h2 className="text-zinc-200 font-bold text-base flex items-center gap-2">
                            <span className="text-blue-500">1.</span> Acceptance of Terms
                        </h2>
                        <p>
                            By accessing and using XTermux ("the Application"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this Application.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-zinc-200 font-bold text-base flex items-center gap-2">
                            <span className="text-blue-500">2.</span> Educational Purpose Only
                        </h2>
                        <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-xl">
                            <div className="flex items-start gap-3">
                                <AlertTriangle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                                <p className="text-zinc-300 font-medium">
                                    XTermux is a documentation and utility tool designed strictly for <strong>educational purposes, security research, and system administration</strong>.
                                </p>
                            </div>
                        </div>
                        <p>
                            The developer is not responsible for any misuse of the tools listed in this application. Users are strictly prohibited from using this Application for any illegal activities, including but not limited to unauthorized access to systems, data theft, or disruption of services.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-zinc-200 font-bold text-base flex items-center gap-2">
                            <span className="text-blue-500">3.</span> Disclaimer of Warranties
                        </h2>
                        <p>
                            The Application is provided "as is" without any representations or warranties, express or implied. We do not warrant that the information in this Application is complete, true, accurate, or non-misleading.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-zinc-200 font-bold text-base flex items-center gap-2">
                            <span className="text-blue-500">4.</span> Termination
                        </h2>
                        <p>
                            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                        </p>
                    </section>
                </div>
                
                <div className="pt-8 text-center">
                    <p className="text-xs text-zinc-600">
                        &copy; 2024 XTermux Project. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
