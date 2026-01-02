import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Mail, Lock, Loader2, UserPlus, LogIn, Eye, EyeOff, KeyRound, MessageSquare, Shield, Globe, ChevronDown, MoreVertical } from 'lucide-react';
import { showToast } from './Toast';
import Lottie from 'lottie-react';

const splashAnimation = {
  v: "5.7.1",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "Splash",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Shield",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: { a: 0, k: [100, 100, 0], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1 },
        s: {
          a: 1,
          k: [
            { t: 0, s: [0, 0, 100], e: [100, 100, 100], i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 } },
            { t: 30, s: [100, 100, 100] }
          ],
          ix: 6
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [80, 100], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              r: { a: 0, k: 10, ix: 4 },
              nm: "Rect",
              mn: "ADBE Vector Shape - Rect",
              hd: false
            },
            {
              ty: "fl",
              c: { a: 0, k: [0, 0.659, 0.518, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill",
              mn: "ADBE Vector Graphic - Fill",
              hd: false
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform"
            }
          ]
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    }
  ]
};

export const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'welcome' | 'form' | 'support' | 'privacy' | 'terms'>('welcome');
  const [supportMessage, setSupportMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [language, setLanguage] = useState<'en' | 'id' | 'hi'>('en');
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  
  const translations = {
    en: {
      welcome: 'Welcome to XTermux',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      agree: 'Agree and continue',
      help: 'Help',
      support: 'Contact Support',
      describe: 'Describe your problem',
      screenshot: 'Add screenshots (optional)',
      next: 'NEXT',
      cancel: 'Cancel',
      enterEmail: 'Enter email',
      createAccount: 'Create account',
      resetPassword: 'Reset password',
      yourEmail: 'Your email',
      back: 'Back'
    },
    id: {
      welcome: 'Selamat datang di XTermux',
      privacy: 'Kebijakan Privasi',
      terms: 'Ketentuan Layanan',
      agree: 'Setuju dan lanjutkan',
      help: 'Bantuan',
      support: 'Hubungi dukungan',
      describe: 'Jelaskan masalah Anda',
      screenshot: 'Tambah tangkapan layar (opsional)',
      next: 'LANJUT',
      cancel: 'Batal',
      enterEmail: 'Masukkan email',
      createAccount: 'Buat akun',
      resetPassword: 'Atur ulang sandi',
      yourEmail: 'Email Anda',
      back: 'Kembali'
    },
    hi: {
      welcome: 'XTermux में आपका स्वागत है',
      privacy: 'गोपनीयता नीति',
      terms: 'सेवा की शर्तें',
      agree: 'सहमत हों और जारी रखें',
      help: 'सहायता',
      support: 'सहायता से संपर्क करें',
      describe: 'अपनी समस्या का वर्णन करें',
      screenshot: 'स्क्रीनशॉट जोड़ें (वैकल्पिक)',
      next: 'अगला',
      cancel: 'रद्द करें',
      enterEmail: 'ईमेल दर्ज करें',
      createAccount: 'खाता बनाएं',
      resetPassword: 'पासवर्ड रीसेट करें',
      yourEmail: 'आपका ईमेल',
      back: 'पीछे'
    }
  };

  const t = translations[language];

  const handleSupportSubmit = async (e: React.FormEvent, platform: 'email' | 'whatsapp') => {
    e.preventDefault();
    
    const title = 'XTermux Support Request';
    const description = supportMessage;
    const supportInfo = `\n\n--Support Info--\nApp: XTermux\nLanguage: ${language}`;
    const fullMessage = `Title: ${title}\nDescription: ${description}${supportInfo}`;
    
    if (platform === 'whatsapp') {
      const whatsappUrl = `https://wa.me/62895325844493?text=${encodeURIComponent(fullMessage)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      const mailto = `mailto:xyraofficialsup@gmail.com?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(fullMessage)}`;
      window.location.href = mailto;
    }

    setStep('welcome');
    setSupportMessage('');
  };

  const handlePrivacyClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setStep('privacy');
  };

  const handleTermsClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setStep('terms');
  };

  const handleHelpCenterClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setStep('support');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isResetting) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        showToast('Password reset link has been sent to your email!', 'success');
        setIsResetting(false);
        setStep('welcome');
      } else if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        
        if (error) {
          if (error.message.includes('User already registered')) {
            throw new Error('This email is already registered. Please sign in.');
          }
          throw error;
        }

        if (data.user && !data.session && data.user.identities && data.user.identities.length === 0) {
          throw new Error('This email is already registered. Please sign in.');
        }

        showToast('Account created! Please check your email.', 'success');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Incorrect email or password.');
          }
          throw error;
        }
      }
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'privacy') {
    return (
      <div className="flex flex-col min-h-screen bg-[#0b141a] text-[#e9edef]">
        <div className="flex items-center gap-4 p-4 border-b border-[#202c33]">
          <button onClick={() => setStep('welcome')} className="p-1">
            <LogIn className="rotate-180" size={24} />
          </button>
          <h2 className="text-xl font-medium">{t.privacy}</h2>
        </div>
        <div className="p-6 space-y-6 flex-1 overflow-y-auto leading-relaxed">
          <p className="text-sm text-[#8696a0]">Last updated: January 2, 2026</p>
          <section className="space-y-2">
            <h3 className="text-[#00a884] font-medium">1. Information We Collect</h3>
            <p className="text-sm">We collect information you provide directly to us, such as your email address when you create an account or contact support.</p>
          </section>
          <section className="space-y-2">
            <h3 className="text-[#00a884] font-medium">2. How We Use Information</h3>
            <p className="text-sm">We use your information to provide, maintain, and improve our services, including to personalize your experience and provide support.</p>
          </section>
          <section className="space-y-2">
            <h3 className="text-[#00a884] font-medium">3. Data Security</h3>
            <p className="text-sm">We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access.</p>
          </section>
          <section className="space-y-2">
            <h3 className="text-[#00a884] font-medium">4. Contact Us</h3>
            <p className="text-sm">If you have any questions about this Privacy Policy, please contact us at xyraofficialsup@gmail.com.</p>
          </section>
        </div>
        <div className="p-6">
          <button onClick={() => setStep('welcome')} className="w-full bg-[#00a884] text-[#0b141a] font-medium py-3 rounded-full hover:bg-[#06cf9c]">
            {t.back}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'terms') {
    return (
      <div className="flex flex-col min-h-screen bg-[#0b141a] text-[#e9edef]">
        <div className="flex items-center gap-4 p-4 border-b border-[#202c33]">
          <button onClick={() => setStep('welcome')} className="p-1">
            <LogIn className="rotate-180" size={24} />
          </button>
          <h2 className="text-xl font-medium">{t.terms}</h2>
        </div>
        <div className="p-6 space-y-6 flex-1 overflow-y-auto leading-relaxed">
          <p className="text-sm text-[#8696a0]">Last updated: January 2, 2026</p>
          <section className="space-y-2">
            <h3 className="text-[#00a884] font-medium">1. Agreement to Terms</h3>
            <p className="text-sm">By accessing XTermux, you agree to be bound by these Terms of Service.</p>
          </section>
          <section className="space-y-2">
            <h3 className="text-[#00a884] font-medium">2. Use of Services</h3>
            <p className="text-sm">You agree to use XTermux only for lawful purposes and in accordance with our guidelines.</p>
          </section>
          <section className="space-y-2">
            <h3 className="text-[#00a884] font-medium">3. User Responsibility</h3>
            <p className="text-sm">You are responsible for maintaining the confidentiality of your account and password.</p>
          </section>
          <section className="space-y-2">
            <h3 className="text-[#00a884] font-medium">4. Termination</h3>
            <p className="text-sm">We reserve the right to terminate or suspend your account for violations of these terms.</p>
          </section>
        </div>
        <div className="p-6">
          <button onClick={() => setStep('welcome')} className="w-full bg-[#00a884] text-[#0b141a] font-medium py-3 rounded-full hover:bg-[#06cf9c]">
            {t.back}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'support') {
    return (
      <div className="flex flex-col min-h-screen bg-[#0b141a] text-[#e9edef]">
        <div className="flex items-center gap-4 p-4 border-b border-[#202c33]">
          <button onClick={() => setStep('welcome')} className="p-1">
            <LogIn className="rotate-180" size={24} />
          </button>
          <h2 className="text-xl font-medium">{t.support}</h2>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div className="space-y-2">
            <textarea
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              placeholder={t.describe}
              className="w-full bg-[#202c33] rounded-lg p-4 min-h-[150px] outline-none border-none resize-none"
            />
          </div>

          <p className="text-xs text-[#8696a0] leading-relaxed">
            Dengan melanjutkan, Anda mengizinkan Tim Dukungan XTermux meninjau informasi teknis tentang akun Anda guna membantu menjawab pertanyaan Anda. Pesan dari Tim Dukungan XTermux mungkin dibuat oleh AI menggunakan teknologi yang aman dari Meta. Pesan dan panggilan pribadi Anda tetap terenkripsi secara end-to-end. <span onClick={(e) => handlePrivacyClick(e)} className="text-[#53bdeb] cursor-pointer">Pelajari selengkapnya</span>.
          </p>
        </div>

        <div className="p-6 flex flex-col gap-4 bg-[#0b141a] border-t border-[#202c33]">
          <button onClick={(e) => handleHelpCenterClick(e)} className="text-[#53bdeb] text-left text-sm font-medium">
            Kunjungi Pusat Bantuan kami
          </button>
          <div className="flex gap-3">
            <button
              onClick={(e) => handleSupportSubmit(e, 'email')}
              disabled={!supportMessage || loading}
              className="flex-1 bg-[#202c33] text-[#e9edef] font-medium py-3 rounded-full hover:bg-[#2a3942] transition-colors active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Mail size={18} />
              Email
            </button>
            <button
              onClick={(e) => handleSupportSubmit(e, 'whatsapp')}
              disabled={!supportMessage || loading}
              className="flex-1 bg-[#25d366] text-[#0b141a] font-medium py-3 rounded-full hover:bg-[#20bd59] transition-colors active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <MessageSquare size={18} />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'welcome') {
    return (
      <div className="flex flex-col items-center justify-between min-h-screen bg-[#0b141a] text-[#e9edef] p-6">
        <div className="w-full flex justify-end relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-2 text-[#8696a0]">
            <MoreVertical size={20} />
          </button>
          {showMenu && (
            <div className="absolute top-10 right-0 w-48 bg-[#233138] rounded-lg shadow-xl z-50 py-2 border border-white/5 animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => {
                  setStep('support');
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-[#111b21] transition-colors text-sm"
              >
                {t.help}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-12 flex-1 justify-center max-w-sm w-full">
          <div className="relative">
            <div className="w-64 h-64 flex items-center justify-center">
              <Lottie 
                animationData={{
                  v: "5.7.1",
                  fr: 30,
                  ip: 0,
                  op: 60,
                  w: 400,
                  h: 400,
                  nm: "XTermux Logo",
                  ddd: 0,
                  assets: [],
                  layers: [
                    {
                      ddd: 0,
                      ind: 1,
                      ty: 4,
                      nm: "Circle",
                      sr: 1,
                      ks: {
                        o: { a: 0, k: 20 },
                        r: { a: 0, k: 0 },
                        p: { a: 0, k: [200, 200] },
                        a: { a: 0, k: [0, 0] },
                        s: { a: 0, k: [100, 100] }
                      },
                      shapes: [
                        {
                          ty: "gr",
                          it: [
                            { ty: "el", s: { a: 0, k: [300, 300] }, p: { a: 0, k: [0, 0] } },
                            { ty: "fl", c: { a: 0, k: [0.1, 0.15, 0.18, 1] } }
                          ]
                        }
                      ],
                      ip: 0, op: 60, st: 0
                    },
                    {
                      ddd: 0, ind: 2, ty: 4, nm: "Shield", sr: 1,
                      ks: {
                        o: { a: 0, k: 100 },
                        r: { a: 0, k: 0 },
                        p: { a: 0, k: [200, 220] },
                        a: { a: 0, k: [0, 0] },
                        s: {
                          a: 1,
                          k: [
                            { t: 0, s: [0, 0], e: [100, 100], i: { x: 0.6, y: 1 }, o: { x: 0.4, y: 0 } },
                            { t: 20, s: [100, 100] }
                          ]
                        }
                      },
                      shapes: [
                        {
                          ty: "gr",
                          it: [
                            { ty: "rc", s: { a: 0, k: [80, 100] }, r: 20 },
                            { ty: "fl", c: { a: 0, k: [0, 0.66, 0.52, 1] } }
                          ]
                        }
                      ],
                      ip: 0, op: 60, st: 0
                    },
                    {
                      ddd: 0, ind: 3, ty: 4, nm: "LeftIcon", sr: 1,
                      ks: {
                        o: { a: 0, k: 100 },
                        r: { a: 0, k: -12 },
                        p: { a: 1, k: [
                          { t: 5, s: [200, 200], e: [150, 160] },
                          { t: 25, s: [150, 160] }
                        ]},
                        a: { a: 0, k: [0, 0] },
                        s: { a: 0, k: [100, 100] }
                      },
                      shapes: [
                        {
                          ty: "gr",
                          it: [
                            { ty: "rc", s: { a: 0, k: [60, 60] }, r: 15 },
                            { ty: "fl", c: { a: 0, k: [0.15, 0.83, 0.4, 1] } }
                          ]
                        }
                      ],
                      ip: 5, op: 60, st: 5
                    },
                    {
                      ddd: 0, ind: 4, ty: 4, nm: "RightIcon", sr: 1,
                      ks: {
                        o: { a: 0, k: 100 },
                        r: { a: 0, k: 12 },
                        p: { a: 1, k: [
                          { t: 10, s: [200, 200], e: [250, 160] },
                          { t: 30, s: [250, 160] }
                        ]},
                        a: { a: 0, k: [0, 0] },
                        s: { a: 0, k: [100, 100] }
                      },
                      shapes: [
                        {
                          ty: "gr",
                          it: [
                            { ty: "rc", s: { a: 0, k: [60, 60] }, r: 15 },
                            { ty: "fl", c: { a: 0, k: [0.2, 0.72, 0.95, 1] } }
                          ]
                        }
                      ],
                      ip: 10, op: 60, st: 10
                    }
                  ]
                }}
                loop={true}
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-3xl font-normal">{t.welcome}</h1>
            <p className="text-[#8696a0] text-sm leading-relaxed px-4">
              Read our <span onClick={(e) => handlePrivacyClick(e)} className="text-[#53bdeb] cursor-pointer">{t.privacy}</span>. Tap "{t.agree}" to accept the <span onClick={(e) => handleTermsClick(e)} className="text-[#53bdeb] cursor-pointer">{t.terms}</span>.
            </p>
          </div>

          <div className="w-full space-y-6 relative">
            <div 
              onClick={() => setShowLanguagePicker(!showLanguagePicker)}
              className="flex items-center justify-center gap-2 text-[#00a884] bg-[#111b21] py-2 px-4 rounded-full w-fit mx-auto cursor-pointer hover:bg-[#202c33] transition-colors"
            >
              <Globe size={18} />
              <span className="text-sm">
                {language === 'en' ? 'English' : language === 'id' ? 'Bahasa Indonesia' : 'हिंदी (Hindi)'}
              </span>
              <ChevronDown size={16} />
            </div>

            {showLanguagePicker && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#233138] rounded-lg shadow-xl py-2 border border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                {[
                  { id: 'en', label: 'English' },
                  { id: 'id', label: 'Bahasa Indonesia' },
                  { id: 'hi', label: 'हिंदी (Hindi)' }
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setLanguage(lang.id as any);
                      setShowLanguagePicker(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-[#111b21] transition-colors text-sm ${language === lang.id ? 'text-[#00a884]' : 'text-[#e9edef]'}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setStep('form')}
              className="w-full bg-[#00a884] text-[#0b141a] font-medium py-3 rounded-full hover:bg-[#06cf9c] transition-colors active:scale-95"
            >
              {t.agree}
            </button>
          </div>
        </div>

        <div className="py-6 text-center">
          <p className="text-[#8696a0] text-[10px] uppercase tracking-widest font-bold">from REPLIT</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0b141a] text-[#e9edef] p-6">
      <div className="w-full flex items-center justify-between mb-8">
        <button 
          onClick={() => setStep('welcome')}
          className="text-[#00a884] font-medium"
        >
          {t.cancel}
        </button>
        <h2 className="text-xl font-medium">
          {isResetting ? t.resetPassword : (isSignUp ? t.createAccount : t.enterEmail)}
        </h2>
        <button className="p-2 text-[#8696a0]">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <p className="text-[#8696a0] text-sm leading-relaxed">
            {isResetting 
              ? 'XTermux will send an email to verify your address.'
              : 'XTermux will need to verify your email address.'}
          </p>
          <button className="text-[#53bdeb] text-sm mt-2 font-medium">
            What's my email?
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="group space-y-2">
            <div className="flex items-center justify-between text-[#8696a0] text-xs font-semibold uppercase tracking-wider transition-colors group-focus-within:text-[#00a884] px-1">
              <span>{t.yourEmail}</span>
            </div>
            <div className="relative bg-[#233138] rounded-xl p-4 transition-all border border-transparent group-focus-within:border-[#00a884]/30 group-focus-within:bg-[#2a3942]">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-[#8696a0]" />
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-[#e9edef] text-lg placeholder:text-[#8696a0]/30"
                  required
                />
              </div>
            </div>
          </div>

          {!isResetting && (
            <div className="group space-y-2">
              <div className="flex items-center justify-between text-[#8696a0] text-xs font-semibold uppercase tracking-wider transition-colors group-focus-within:text-[#00a884] px-1">
                <span>Password</span>
              </div>
              <div className="relative bg-[#233138] rounded-xl transition-all border border-transparent group-focus-within:border-[#00a884]/30 group-focus-within:bg-[#2a3942] overflow-hidden">
                <div className="flex items-center px-4 py-4">
                  <Lock size={20} className="text-[#8696a0]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-[#e9edef] text-lg placeholder:text-[#8696a0]/30 tracking-wider pr-2 ml-3"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#8696a0] hover:text-[#00a884] transition-colors flex items-center justify-center p-1"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00a884] text-[#0b141a] font-bold py-4 rounded-xl hover:bg-[#06cf9c] shadow-lg shadow-[#00a884]/10 transition-all active:scale-[0.98] disabled:bg-[#111b21] disabled:text-[#8696a0] flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={20} />}
              <span className="tracking-wide">
                {isResetting ? 'SEND RESET LINK' : (isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN')}
              </span>
            </button>
          </div>
        </form>

        <div className="flex flex-col gap-4 text-center">
          {!isResetting && !isSignUp && (
            <button
              type="button"
              onClick={() => setIsResetting(true)}
              className="text-[#53bdeb] text-sm font-medium"
            >
              Forgot password?
            </button>
          )}
          
          <button
            onClick={() => {
              if (isResetting) {
                setIsResetting(false);
              } else {
                setIsSignUp(!isSignUp);
              }
            }}
            className="text-[#8696a0] text-sm"
          >
            {isResetting ? 'Back to login' : (
              isSignUp ? (
                <>Already have an account? <span className="text-[#53bdeb]">Sign in</span></>
              ) : (
                <>Don't have an account? <span className="text-[#53bdeb]">Sign up</span></>
              )
            )}
          </button>
        </div>
      </div>

      <div className="mt-auto py-6 text-center text-[#8696a0] text-[12px]">
        <p>You must be at least 13 years old to register. Learn how XTermux works with the <span className="text-[#53bdeb]">Meta Companies</span>.</p>
      </div>
    </div>
  );
};
