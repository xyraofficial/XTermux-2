
import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Server } from 'lucide-react';

interface Props {
    onBack: () => void;
}

const Privacy: React.FC<Props> = ({ onBack }) => {
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
                    <div className="p-3 bg-green-500/10 rounded-2xl">
                        <Shield size={28} className="text-green-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Privacy Policy</h1>
                        <p className="text-zinc-500 text-sm">Last updated: October 2024</p>
                    </div>
                </div>

                <div className="space-y-8 text-sm text-zinc-400 leading-relaxed text-justify">
                    <section className="space-y-3">
                        <h2 className="text-zinc-200 font-bold text-base flex items-center gap-2">
                            <div className="p-1.5 bg-zinc-900 rounded-lg"><Eye size={14} className="text-green-500"/></div>
                            Data Collection
                        </h2>
                        <p>
                            We collect minimal data necessary to provide our services. This includes:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 marker:text-zinc-600">
                            <li>Account Information: Name, email address, and profile picture (via Google Auth/Firebase).</li>
                            <li>Usage Data: Anonymous analytics to improve app performance and stability.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-zinc-200 font-bold text-base flex items-center gap-2">
                            <div className="p-1.5 bg-zinc-900 rounded-lg"><Lock size={14} className="text-blue-500"/></div>
                            Data Usage & Security
                        </h2>
                        <p>
                            Your data is used solely to maintain your account and personalize your experience within XTermux.
                        </p>
                        <ul className="list-disc pl-5 space-y-1 marker:text-zinc-600">
                            <li>We do not sell your personal data to third parties.</li>
                            <li>All data is encrypted in transit and at rest using industry-standard protocols (Firebase Security).</li>
                            <li>You retain full ownership of your data.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-zinc-200 font-bold text-base flex items-center gap-2">
                            <div className="p-1.5 bg-zinc-900 rounded-lg"><Server size={14} className="text-purple-500"/></div>
                            Third-Party Services
                        </h2>
                        <p>
                            We use the following third-party services to operate the application:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 marker:text-zinc-600">
                            <li><strong>Google Firebase</strong>: For authentication and hosting infrastructure.</li>
                            <li><strong>Google Gemini API</strong>: To provide AI-powered assistance features.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-zinc-200 font-bold text-base">Contact Us</h2>
                        <p>
                            If you have questions about this privacy policy, please contact us at: <a href="mailto:xyraofficialsup@gmail.com" className="text-green-500 hover:underline">xyraofficialsup@gmail.com</a>
                        </p>
                    </section>
                </div>
                
                <div className="pt-8 text-center border-t border-zinc-900/50 mt-8">
                    <p className="text-xs text-zinc-600">
                        &copy; 2024 XTermux Project. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
