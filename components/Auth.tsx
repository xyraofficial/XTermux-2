import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Mail, Lock, Loader2, UserPlus, LogIn, Eye, EyeOff, KeyRound, MessageSquare, Shield, Globe, ChevronDown, MoreVertical } from 'lucide-react';
import { showToast } from './Toast';

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
      next: 'NEXT',
      cancel: 'Cancel',
      enterEmail: 'Login Account',
      createAccount: 'Create Account',
      resetPassword: 'Reset Password',
      loginInfo: 'Login Info',
      signupInfo: 'Signup Info',
      resetInfo: 'Reset Password Info',
      loginHelp: 'To access your account, enter your registered email and password. Use "Forgot password" if you cannot sign in.',
      signupHelp: 'Create a new account by providing a valid email address and setting a secure password. You will need to verify your email.',
      resetHelp: 'If you lost your password, enter your email address and we will send you a secure link to create a new one.',
      yourEmail: 'Your email',
      back: 'Back',
      emailPlaceholder: 'email@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: '••••••••',
      signIn: 'SIGN IN',
      sendReset: 'SEND RESET LINK',
      whatsMyEmail: "What's my email?",
      forgotPassword: 'Forgot password?',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',
      supportDisclaimer: 'By continuing, you authorize the XTermux Support Team to review technical information about your account to help answer your question. Messages from the XTermux Support Team may be AI-generated using secure technology from Meta. Your personal messages and calls remain end-to-end encrypted.',
      learnMore: 'Learn more',
      visitHelpCenter: 'Visit our Help Center',
      lastUpdated: 'Last updated: January 2, 2026',
      privacySection1Title: '1. Information We Collect',
      privacySection1Content: 'We collect information you provide directly to us, such as your email address when you create an account or contact support.',
      privacySection2Title: '2. How We Use Information',
      privacySection2Content: 'We use your information to provide, maintain, and improve our services, including to personalize your experience and provide support.',
      privacySection3Title: '3. Data Security',
      privacySection3Content: 'We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access.',
      privacySection4Title: '4. Contact Us',
      privacySection4Content: 'If you have any questions about this Privacy Policy, please contact us at xyraofficialsup@gmail.com.',
      termsSection1Title: '1. Agreement to Terms',
      termsSection1Content: 'By accessing XTermux, you agree to be bound by these Terms of Service.',
      termsSection2Title: '2. Use of Services',
      termsSection2Content: 'You agree to use XTermux only for lawful purposes and in accordance with our guidelines.',
      termsSection3Title: '3. User Responsibility',
      termsSection3Content: 'You are responsible for maintaining the confidentiality of your account and password.',
      termsSection4Title: '4. Termination',
      termsSection4Content: 'We reserve the right to terminate or suspend your account for violations of these terms.',
      verifyingEmail: 'XTermux will need to verify your email address.',
      verifyingReset: 'XTermux will send an email to verify your address.'
    },
    id: {
      welcome: 'Selamat datang di XTermux',
      privacy: 'Kebijakan Privasi',
      terms: 'Ketentuan Layanan',
      agree: 'Setuju dan lanjutkan',
      help: 'Bantuan',
      support: 'Hubungi dukungan',
      describe: 'Jelaskan masalah Anda',
      next: 'LANJUT',
      cancel: 'Batal',
      enterEmail: 'Masuk Akun',
      createAccount: 'Buat Akun',
      resetPassword: 'Atur Ulang Sandi',
      loginInfo: 'Info Login',
      signupInfo: 'Info Daftar',
      resetInfo: 'Info Atur Ulang Sandi',
      loginHelp: 'Untuk mengakses akun Anda, masukkan email dan kata sandi yang terdaftar. Gunakan "Lupa kata sandi" jika Anda tidak dapat masuk.',
      signupHelp: 'Buat akun baru dengan memberikan alamat email yang valid dan mengatur kata sandi yang aman. Anda perlu memverifikasi email Anda.',
      resetHelp: 'Jika Anda kehilangan kata sandi, masukkan alamat email Anda dan kami akan mengirimkan tautan aman untuk membuat yang baru.',
      yourEmail: 'Email Anda',
      back: 'Kembali',
      emailPlaceholder: 'email@contoh.com',
      passwordLabel: 'Kata Sandi',
      passwordPlaceholder: '••••••••',
      signIn: 'MASUK',
      sendReset: 'KIRIM LINK RESET',
      whatsMyEmail: 'Apa email saya?',
      forgotPassword: 'Lupa kata sandi?',
      dontHaveAccount: 'Belum punya akun?',
      alreadyHaveAccount: 'Sudah punya akun?',
      supportDisclaimer: 'Dengan melanjutkan, Anda mengizinkan Tim Dukungan XTermux meninjau informasi teknis tentang akun Anda guna membantu menjawab pertanyaan Anda. Pesan dari Tim Dukungan XTermux mungkin dibuat oleh AI menggunakan teknologi yang aman dari Meta. Pesan dan panggilan pribadi Anda tetap terenkripsi secara end-to-end.',
      learnMore: 'Pelajari selengkapnya',
      visitHelpCenter: 'Kunjungi Pusat Bantuan kami',
      lastUpdated: 'Terakhir diperbarui: 2 Januari 2026',
      privacySection1Title: '1. Informasi yang Kami Kumpulkan',
      privacySection1Content: 'Kami mengumpulkan informasi yang Anda berikan langsung kepada kami, seperti alamat email Anda saat membuat akun atau menghubungi dukungan.',
      privacySection2Title: '2. Cara Kami Menggunakan Informasi',
      privacySection2Content: 'Kami menggunakan informasi Anda untuk menyediakan, memelihara, dan meningkatkan layanan kami, termasuk untuk mempersonalisasi pengalaman Anda dan memberikan dukungan.',
      privacySection3Title: '3. Keamanan Data',
      privacySection3Content: 'Kami mengambil langkah-langkah wajar untuk membantu melindungi informasi tentang Anda dari kehilangan, pencurian, penyalahgunaan, dan akses tidak sah.',
      privacySection4Title: '4. Hubungi Kami',
      privacySection4Content: 'Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di xyraofficialsup@gmail.com.',
      termsSection1Title: '1. Persetujuan Ketentuan',
      termsSection1Content: 'Dengan mengakses XTermux, Anda setuju untuk terikat oleh Ketentuan Layanan ini.',
      termsSection2Title: '2. Penggunaan Layanan',
      termsSection2Content: 'Anda setuju untuk menggunakan XTermux hanya untuk tujuan yang sah dan sesuai dengan pedoman kami.',
      termsSection3Title: '3. Tanggung Jawab Pengguna',
      termsSection3Content: 'Anda bertanggung jawab untuk menjaga kerahasiaan akun dan kata sandi Anda.',
      termsSection4Title: '4. Pemutusan',
      termsSection4Content: 'Kami berhak menghentikan atau menangguhkan akun Anda karena pelanggaran ketentuan ini.',
      verifyingEmail: 'XTermux perlu memverifikasi alamat email Anda.',
      verifyingReset: 'XTermux akan mengirim email untuk memverifikasi alamat Anda.'
    },
    hi: {
      welcome: 'XTermux में आपका स्वागत है',
      privacy: 'गोपनीयता नीति',
      terms: 'सेवा की शर्तें',
      agree: 'सहमत हों और जारी रखें',
      help: 'सहायता',
      support: 'सहायता से संपर्क करें',
      describe: 'अपनी समस्या का वर्णन करें',
      next: 'अगला',
      cancel: 'रद्द करें',
      enterEmail: 'खाता लॉगिन करें',
      createAccount: 'खाता बनाएं',
      resetPassword: 'पासवर्ड रीसेट करें',
      loginInfo: 'लॉगिन जानकारी',
      signupInfo: 'साइनअप जानकारी',
      resetInfo: 'पासवर्ड रीसेट जानकारी',
      loginHelp: 'अपने खाते तक पहुँचने के लिए, अपना पंजीकृत ईमेल और पासवर्ड दर्ज करें। यदि आप साइन इन नहीं कर सकते हैं तो "पासवर्ड भूल गए" का उपयोग करें।',
      signupHelp: 'एक वैध ईमेल पता प्रदान करके और एक सुरक्षित पासवर्ड सेट करके एक नया खाता बनाएं। आपको अपना ईमेल सत्यापित करना होगा।',
      resetHelp: 'यदि आप अपना पासवर्ड भूल गए हैं, तो अपना ईमेल पता दर्ज करें और हम आपको एक नया पासवर्ड बनाने के लिए एक सुरक्षित लिंक भेजेंगे।',
      yourEmail: 'आपका ईमेल',
      back: 'पीछे',
      emailPlaceholder: 'email@example.com',
      passwordLabel: 'पासवर्ड',
      passwordPlaceholder: '••••••••',
      signIn: 'साइन इन करें',
      sendReset: 'रीसेट लिंक भेजें',
      whatsMyEmail: 'मेरा ईमेल क्या है?',
      forgotPassword: 'पासवर्ड भूल गए?',
      dontHaveAccount: 'खाता नहीं है?',
      alreadyHaveAccount: 'पहले से ही एक खाता है?',
      supportDisclaimer: 'जारी रखते हुए, आप XTermux सहायता टीम को आपके प्रश्न का उत्तर देने में सहायता के लिए आपके खाते के बारे में तकनीकी जानकारी की समीक्षा करने के लिए अधिकृत करते हैं। XTermux सहायता टीम के संदेश मेटा की सुरक्षित तकनीक का उपयोग करके AI-जनरेटेड हो सकते हैं। आपके व्यक्तिगत संदेश और कॉल एंड-टू-एंड एन्क्रिप्टेड रहते हैं।',
      learnMore: 'और जानें',
      visitHelpCenter: 'हमारे सहायता केंद्र पर जाएँ',
      lastUpdated: 'अंतिम अपडेट: 2 जनवरी, 2026',
      privacySection1Title: '1. जानकारी जो हम एकत्र करते हैं',
      privacySection1Content: 'हम आपके द्वारा सीधे हमें प्रदान की गई जानकारी एकत्र करते हैं, जैसे कि जब आप खाता बनाते हैं या सहायता से संपर्क करते हैं तो आपका ईमेल पता।',
      privacySection2Title: '2. हम जानकारी का उपयोग कैसे करते हैं',
      privacySection2Content: 'हम आपकी जानकारी का उपयोग अपनी सेवाओं को प्रदान करने, बनाए रखने और सुधारने के लिए करते हैं, जिसमें आपके अनुभव को वैयक्तिकृत करना और सहायता प्रदान करना शामिल है।',
      privacySection3Title: '3. डेटा सुरक्षा',
      privacySection3Content: 'हम आपकी जानकारी को हानि, चोरी, दुरुपयोग और अनधिकृत पहुंच से बचाने में मदद के लिए उचित उपाय करते हैं।',
      privacySection4Title: '4. हमसे संपर्क करें',
      privacySection4Content: 'यदि आपके पास इस गोपनीयता नीति के बारे में कोई प्रश्न हैं, तो कृपया हमसे xyraofficialsup@gmail.com पर संपर्क करें।',
      termsSection1Title: '1. शर्तों से सहमति',
      termsSection1Content: 'XTermux का उपयोग करके, आप इन सेवा शर्तों से बंधे होने के लिए सहमत हैं।',
      termsSection2Title: '2. सेवाओं का उपयोग',
      termsSection2Content: 'आप XTermux का उपयोग केवल वैध उद्देश्यों के लिए और हमारे दिशानिर्देशों के अनुसार करने के लिए सहमत हैं।',
      termsSection3Title: '3. उपयोगकर्ता की जिम्मेदारी',
      termsSection3Content: 'आप अपने खाते और पासवर्ड की गोपनीयता बनाए रखने के लिए जिम्मेदार हैं।',
      termsSection4Title: '4. समाप्ति',
      termsSection4Content: 'हम इन शर्तों के उल्लंघन के लिए आपके खाते को समाप्त या निलंबित करने का अधिकार सुरक्षित रखते हैं।',
      verifyingEmail: 'XTermux को आपके ईमेल पते को सत्यापित करने की आवश्यकता होगी।',
      verifyingReset: 'XTermux आपके पते को सत्यापित करने के लिए एक ईमेल भेजेगा।'
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
          <p className="text-sm text-[#8696a0]">{t.lastUpdated}</p>
          <section className="space-y-2">
            <h3 className="text-[#00a884] font-medium">{t.privacySection1Title}</h3>
            <p className="text-sm">{t.privacySection1Content}</p>
          </section>
          <section className="space-y-2">
            <h3 className="text-[#00a884] font-medium">{t.privacySection2Title}</h3>
            <p className="text-sm">{t.privacySection2Content}</p>
          </section>
          <section className="space-y-2">
            <h3 className="text-[#00a884] font-medium">{t.privacySection3Title}</h3>
            <p className="text-sm">{t.privacySection3Content}</p>
          </section>
          <section className="space-y-2">
            <h3 className="text-[#00a884] font-medium">{t.privacySection4Title}</h3>
            <p className="text-sm">{t.privacySection4Content}</p>
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
          <p className="text-sm text-[#8696a0]">{t.lastUpdated}</p>
          <section className="space-y-2">
            <h3 className="text-[#00a884] font-medium">{t.termsSection1Title}</h3>
            <p className="text-sm">{t.termsSection1Content}</p>
          </section>
          <section className="space-y-2">
            <h3 className="text-[#00a884] font-medium">{t.termsSection2Title}</h3>
            <p className="text-sm">{t.termsSection2Content}</p>
          </section>
          <section className="space-y-2">
            <h3 className="text-[#00a884] font-medium">{t.termsSection3Title}</h3>
            <p className="text-sm">{t.termsSection3Content}</p>
          </section>
          <section className="space-y-2">
            <h3 className="text-[#00a884] font-medium">{t.termsSection4Title}</h3>
            <p className="text-sm">{t.termsSection4Content}</p>
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
            {t.supportDisclaimer} <span onClick={(e) => handlePrivacyClick(e)} className="text-[#53bdeb] cursor-pointer">{t.learnMore}</span>.
          </p>
        </div>

        <div className="p-6 flex flex-col gap-4 bg-[#0b141a] border-t border-[#202c33]">
          <button onClick={(e) => handleHelpCenterClick(e)} className="text-[#53bdeb] text-left text-sm font-medium">
            {t.visitHelpCenter}
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

        <div className="flex flex-col items-center gap-8 flex-1 justify-center max-w-sm w-full">
          <div className="relative">
            <div className="w-48 h-48 bg-[#111b21] rounded-full flex items-center justify-center relative overflow-hidden animate-breathing">
              <div className="absolute inset-0 opacity-10 flex flex-wrap gap-3 p-4 animate-parallax">
                {[...Array(20)].map((_, i) => (
                  <MessageSquare key={i} size={14} />
                ))}
              </div>
              <div className="relative z-10 flex flex-col items-center scale-90">
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#25d366] rounded-xl flex items-center justify-center transform -rotate-6 animate-float-delayed">
                    <MessageSquare size={20} className="text-[#0b141a]" />
                  </div>
                  <div className="w-10 h-10 bg-[#34b7f1] rounded-xl flex items-center justify-center transform rotate-6 animate-float-delayed delay-700">
                    <Globe size={20} className="text-[#0b141a]" />
                  </div>
                </div>
                <div className="w-14 h-14 bg-[#00a884] rounded-full flex items-center justify-center animate-glow-pulse">
                  <Shield size={28} className="text-[#0b141a]" />
                </div>
              </div>
            </div>
            
            {/* Ambient glow effect around the circle */}
            <div className="absolute inset-0 bg-[#00a884]/5 blur-3xl rounded-full -z-10 animate-ambient-glow" />
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes breathing {
              0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(0, 168, 132, 0); }
              50% { transform: scale(1.02); box-shadow: 0 0 40px rgba(0, 168, 132, 0.1); }
            }
            @keyframes parallax {
              0%, 100% { transform: translate(0, 0); }
              25% { transform: translate(4px, -4px); }
              50% { transform: translate(-2px, 4px); }
              75% { transform: translate(-4px, -2px); }
            }
            @keyframes float-delayed {
              0%, 100% { transform: translateY(0) rotate(-6deg); }
              50% { transform: translateY(-10px) rotate(0deg); }
            }
            @keyframes glow-pulse {
              0%, 100% { filter: drop-shadow(0 0 2px rgba(0, 168, 132, 0.4)); transform: scale(1); }
              50% { filter: drop-shadow(0 0 10px rgba(0, 168, 132, 0.8)); transform: scale(1.05); }
            }
            @keyframes ambient-glow {
              0%, 100% { opacity: 0.3; transform: scale(1); }
              50% { opacity: 0.6; transform: scale(1.2); }
            }
            .animate-breathing { animation: breathing 5s ease-in-out infinite; }
            .animate-parallax { animation: parallax 10s ease-in-out infinite; }
            .animate-float-delayed { animation: float-delayed 4s ease-in-out infinite; }
            .animate-glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }
            .animate-ambient-glow { animation: ambient-glow 6s ease-in-out infinite; }
            .delay-700 { animation-delay: 700ms; }
          `}} />

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
          <p className="text-[#8696a0] text-[10px] uppercase tracking-widest font-bold">from XYRAOFFICIAL</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0b141a] text-[#e9edef] p-6">
      <div className="w-full flex items-center justify-between mb-8 relative">
        <button 
          onClick={() => setStep('welcome')}
          className="text-[#00a884] p-1 -ml-1"
        >
          <LogIn className="rotate-180" size={24} />
        </button>
        <h2 className="text-xl font-medium">
          {isResetting ? t.resetPassword : (isSignUp ? t.createAccount : t.enterEmail)}
        </h2>
        <button 
          onClick={() => setShowMenu(!showMenu)} 
          className="p-2 text-[#8696a0]"
        >
          <MoreVertical size={20} />
        </button>
        
        {showMenu && (
          <div className="absolute top-12 right-0 w-64 bg-[#233138] rounded-lg shadow-xl z-50 py-2 border border-white/5 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-2 border-b border-white/5 mb-1">
              <p className="text-xs font-bold text-[#00a884] uppercase tracking-wider">
                {isResetting ? t.resetInfo : (isSignUp ? t.signupInfo : t.loginInfo)}
              </p>
            </div>
            <div className="px-4 py-2 text-sm text-[#8696a0] leading-relaxed">
              {isResetting ? t.resetHelp : (isSignUp ? t.signupHelp : t.loginHelp)}
            </div>
            <div className="border-t border-white/5 mt-1 pt-1">
              <button
                onClick={() => {
                  setStep('support');
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-[#111b21] transition-colors text-sm flex items-center gap-2"
              >
                <MessageSquare size={16} />
                {t.help}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <p className="text-[#8696a0] text-sm leading-relaxed">
            {isResetting ? t.verifyingReset : t.verifyingEmail}
          </p>
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
