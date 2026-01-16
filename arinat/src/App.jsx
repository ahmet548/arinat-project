import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // API bağlantısı için eklendi
import './index.css';
// App.jsx dosyasının en üstündeki import kısmını şu şekilde güncelle:
import {
    Menu, X, ArrowRight, Code2, Cpu, Terminal, Globe,
    Instagram, Twitter, Linkedin, Github, Mail, MapPin,
    Send, Sparkles, BookOpen, Star, ChevronDown,
    ExternalLink, Users, Zap, Award, Plus, Trash2, Edit,
    Calendar, Clock, Lock, LogOut, Layout, CheckCircle, AlertCircle,
    UserCheck, Search, Bell, Home, ChevronRight, BarChart3, Save, FileText, Download,
    Megaphone, CheckCircle2, Upload, Phone, GraduationCap,
    ChevronLeft
} from 'lucide-react';

// --- ASSETS IMPORTLARI ---
import arinatLogo from './assets/logo.png';
import aaLogo from './assets/aa-logo.png';
import about1 from './assets/about-1.jpg';
import about2 from './assets/about-2.jpg';

// --- GLOBAL AYARLAR & API BAĞLANTISI ---
// Docker üzerinde çalışan backend adresin
// App.jsx dosyasının en üstünde:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
};

// --- KAR EFEKTİ BİLEŞENİ (18 Aralık - 3 Ocak) ---
const SnowEffect = () => {
    const [showSnow, setShowSnow] = useState(false);
    const [snowflakes, setSnowflakes] = useState([]);

    useEffect(() => {
        const checkDate = () => {
            const now = new Date();
            const month = now.getMonth();
            const day = now.getDate();
            const isTimeForSnow = (month === 11 && day >= 18) || (month === 0) || (month === 1 && day <= 20);

            if (isTimeForSnow) {
                setShowSnow(true);
                const flakes = [];
                for (let i = 0; i < 50; i++) {
                    flakes.push({
                        id: i,
                        left: Math.random() * 100 + '%',
                        animationDuration: Math.random() * 5 + 5 + 's',
                        animationDelay: Math.random() * 5 + 's',
                        fontSize: Math.random() * 15 + 10 + 'px',
                        opacity: Math.random() * 0.6 + 0.2
                    });
                }
                setSnowflakes(flakes);
            }
        };
        checkDate();
    }, []);

    if (!showSnow) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden" aria-hidden="true">
            <style>{`
        @keyframes snowfall {
          0% { transform: translateY(-10vh) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(100vh) translateX(50px); opacity: 0.5; }
        }
      `}</style>
            {snowflakes.map((flake) => (
                <div key={flake.id} style={{ position: 'absolute', top: '-30px', left: flake.left, color: '#FFF', fontSize: flake.fontSize, opacity: flake.opacity, animation: `snowfall ${flake.animationDuration} linear infinite`, animationDelay: flake.animationDelay, textShadow: '0 0 5px rgba(0,0,0,0.3)', userSelect: 'none' }}>❄</div>
            ))}
        </div>
    );
};

// --- GLOBAL PROJE VERİLERİ (Statik) ---
const INITIAL_PROJECTS = [

    {
        id: 3,
        title: "Mediget: Sağlıkta Yapay Zeka",
        category: "Yapay Zeka & Sağlık",
        desc: "Mamografi görüntüleri üzerinde derin öğrenme (CNN) ile meme yoğunluğu sınıflandırması yaparak radyologlara karar destek sistemi sunan yapay zeka projesi.",
        image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=1964&auto=format&fit=crop",
        year: "2024",
        status: "Model Eğitimi"
    },
    {
        id: 4,
        title: "Otonom İnsansız Hava Aracı (İHA)",
        category: "Havacılık & Otonom Sistemler",
        desc: "Gelişmiş görüntü işleme algoritmalarıyla otonom görev icra edebilen, yüksek faydalı yük kapasiteli sabit kanatlı İHA platformu.",
        image: about1,
        year: "2025",
        status: "Uçuş Testleri"
    },
    {
        id: 5,
        title: "Yüksek İrtifa Roket Takımı",
        category: "Uzay & Havacılık",
        desc: "Özgün aviyonik sistemler ve çift kademeli kurtarma sistemi ile belirli irtifaya faydalı yük taşıma hedefli roket projesi.",
        image: about2,
        year: "2025",
        status: "Entegrasyon"
    }
];

// DİKKAT: Etkinlikler ve Duyurular artık refreshData() ile veritabanından çekildiği için 
// INITIAL_EVENTS ve INITIAL_ANNOUNCEMENTS listeleri buradan kaldırıldı.

// --- TOAST NOTIFICATION SYSTEM ---
const ToastContext = createContext();
const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(curr => curr.filter(t => t.id !== id)), 3000);
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2">
                {toasts.map(toast => (
                    <div key={toast.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white transform transition-all animate-fade-in-left ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
                        }`}>
                        {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <span className="text-sm font-medium">{toast.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
const useToast = () => useContext(ToastContext);

// --- AUTH CONTEXT (Backend Entegrasyonlu) ---
const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('arinat_admin_user');
        if (storedUser) setUser(JSON.parse(storedUser));
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            // Backend auth rotasına gerçek istek atılır
            const res = await axios.post(`${API_URL}/auth/login`, { username, password });
            setUser(res.data); // Token, kullanıcı adı ve rolü saklar
            localStorage.setItem('arinat_admin_user', JSON.stringify(res.data));
            return true;
        } catch (error) {
            console.error("Giriş hatası:", error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('arinat_admin_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
const useAuth = () => useContext(AuthContext);

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();
    // Kullanıcı yoksa giriş sayfasına yönlendir
    if (!user) return <Navigate to="/admin/login" state={{ from: location }} replace />;
    return children;
};

// -----------------------------------------------------------------------------
// --- PUBLIC UI COMPONENTS ---
// -----------------------------------------------------------------------------

const useScrollReveal = () => {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('translate-y-0', 'opacity-100');
                    entry.target.classList.remove('translate-y-10', 'opacity-0');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach((el) => {
            el.classList.add('transition-all', 'duration-1000', 'ease-out');
            observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);
};

// --- GÜNCELLENMİŞ DUYURU BANDI (BOŞLUKSUZ VE BACKEND UYUMLU) ---
const AnnouncementBanner = ({ announcements }) => {
    // Backend'den gelen 'is_active' kolonuna göre filtreliyoruz
    const activeAnnouncements = announcements.filter(a => a.is_active);

    if (activeAnnouncements.length === 0) return null;

    // 1. ADIM: İçeriğin ekranı kesinlikle doldurması için listeyi çoğaltıyoruz.
    // En az 12 adet olana kadar listeyi kopyalayarak kısa duyurularda kopukluk olmasını engeller.
    let content = [...activeAnnouncements];
    while (content.length < 12) {
        content = [...content, ...activeAnnouncements];
    }

    // 2. ADIM: Sonsuz döngü (Seamless Loop) matematiği için listeyi ikiye katlıyoruz.
    // Animasyon %-50'ye geldiğinde görsel olarak başa dönmüş olur.
    const scrollItems = [...content, ...content];

    return (
        <div className="fixed top-0 w-full z-[60] bg-[#0B111D] text-white h-[40px] shadow-md overflow-hidden flex items-center border-b border-white/10 cursor-default">

            <style>{`
        @keyframes scrollText {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); } 
        }
        .scrolling-wrapper {
          display: flex;
          width: max-content;
          /* Her bir duyuru öğesi için 4 saniyelik akış süresi tanımlayarak hızı sabit tutuyoruz */
          animation: scrollText ${scrollItems.length * 4}s linear infinite;
        }
        .scrolling-wrapper:hover {
          animation-play-state: paused;
        }
      `}</style>

            {/* Kayan İçerik Alanı */}
            <div className="scrolling-wrapper">
                {scrollItems.map((ann, index) => (
                    <div key={`${ann.id}-${index}`} className="flex items-center gap-3 px-10">

                        {/* Türlerine göre Dinamik İkonlar */}
                        {ann.type === 'important' && <Megaphone size={16} className="text-red-500 animate-pulse shrink-0" />}
                        {ann.type === 'success' && <CheckCircle size={16} className="text-emerald-500 shrink-0" />}
                        {ann.type === 'info' && <Megaphone size={16} className="text-blue-400 shrink-0" />}

                        {/* Duyuru Metni */}
                        <span className="text-sm font-medium whitespace-nowrap">{ann.title}</span>

                        {/* Ayırıcı Nokta */}
                        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full ml-3 opacity-50 shrink-0"></span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PublicHeader = ({ hasAnnouncement }) => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isNavOpen ? 'hidden' : 'unset';
    }, [isNavOpen]);

    const navLinks = [
        { text: 'Hakkında', href: '#hakkinda' },
        { text: 'Neler Yapıyoruz?', href: '#neler-yapiyoruz' },
        { text: 'Projeler', href: '#projeler' },
        { text: 'Etkinlikler', href: '#etkinlikler' },
        { text: 'Avantajlar', href: '#neden-arinat' }
    ];

    return (
        <>
            <header className={`fixed w-full z-50 transition-all duration-300 
        ${hasAnnouncement ? 'top-[40px]' : 'top-0'} 
        ${scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200/50 py-3 shadow-sm' : 'bg-transparent py-6 border-b border-transparent'}`}>
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <a href="/" className="flex items-center gap-2 group relative z-50">
                        <img src={arinatLogo} alt="ARİNAT" className="h-10 md:h-12 w-auto object-contain drop-shadow-sm" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.classList.remove('hidden') }} />
                        <span className="hidden text-2xl font-black text-emerald-500 tracking-tighter">ARİNAT</span>
                    </a>

                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((item) => (
                            <a key={item.text} href={item.href} className={`text-sm font-semibold transition-colors relative group ${scrolled ? 'text-gray-800 hover:text-emerald-600' : 'text-white hover:text-emerald-300'}`}>
                                {item.text}
                                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${scrolled ? 'bg-emerald-500' : 'bg-white'}`}></span>
                            </a>
                        ))}
                        <a href="https://topluluk.ktun.edu.tr/" target="_blank" rel="noreferrer" className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 ${scrolled ? 'bg-gray-900 text-white hover:bg-emerald-600' : 'bg-white text-emerald-600 hover:bg-emerald-50'}`}>
                            Üye Ol
                        </a>
                    </nav>

                    {/* MOBİL MENÜ AÇMA BUTONU */}
                    {/* Menü açıksa bu butonu gizliyoruz ki çakışma olmasın, yerine overlay içindeki X görünecek */}
                    <button
                        className={`md:hidden relative z-[60] p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-900' : 'text-white'} ${isNavOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        onClick={() => setIsNavOpen(true)}
                    >
                        <Menu size={32} />
                    </button>
                </div>
            </header>

            {/* MOBİL MENÜ KATMANI (OVERLAY) */}
            <div className={`fixed inset-0 bg-white/98 backdrop-blur-xl z-[70] flex flex-col items-center justify-center gap-8 transition-all duration-500 ease-in-out ${isNavOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>

                {/* MOBİL MENÜ KAPATMA (ÇARPI) BUTONU */}
                <button
                    className="absolute top-6 right-4 p-2 text-gray-900 hover:text-red-500 transition-colors md:hidden z-[80]"
                    onClick={() => setIsNavOpen(false)}
                >
                    <X size={40} />
                </button>

                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px]"></div>

                <div className="flex flex-col items-center gap-8 w-full relative z-10">
                    {navLinks.map((item, index) => (
                        <a
                            key={item.text}
                            href={item.href}
                            className={`text-4xl font-bold text-gray-900 hover:text-emerald-500 transition-all duration-500 transform ${isNavOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                            style={{ transitionDelay: `${isNavOpen ? (index * 100) : 0}ms` }}
                            onClick={() => setIsNavOpen(false)}
                        >
                            {item.text}
                        </a>
                    ))}

                    <a
                        href="https://topluluk.ktun.edu.tr/"
                        target="_blank"
                        rel="noreferrer"
                        className={`mt-6 px-12 py-5 bg-gray-900 text-white rounded-full text-xl font-bold shadow-2xl shadow-emerald-500/20 transition-all duration-500 transform ${isNavOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                        style={{ transitionDelay: `${isNavOpen ? (navLinks.length * 100) : 0}ms` }}
                        onClick={() => setIsNavOpen(false)}
                    >
                        Üye Ol
                    </a>
                </div>
            </div>
        </>
    );
};

const HeroSection = () => (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-900/80 to-gray-900 z-0"></div>

        <div className="container mx-auto px-4 relative z-20 text-center pt-20">
            <div className="space-y-8 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-sm font-medium text-emerald-300">
                    <Sparkles size={16} className="text-yellow-400 fill-yellow-400" /><span>Konya Teknik Üniversitesi'nin İnovasyon Merkezi</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none text-white drop-shadow-2xl">
                    Sınırlarını  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Keşfet.</span> <br />
                    Kendini  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400">Oluştur.</span>
                </h1>

                <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                    Arinat: Sorularla yola çıktığı, çözümle büyüdüğü; projelerin notaya, çözümlerin armoniye dönüştüğü bir topluluk.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 w-full sm:w-auto">
                    <a href="https://topluluk.ktun.edu.tr/" target="_blank" rel="noreferrer" className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full font-bold transition-all hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(52,211,153,0.5)] flex items-center justify-center gap-2 group">
                        Aramıza Katıl <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    {/* DÜZELTME: href="#etkinlikler" yerine href="#projeler" yapıldı */}
                    <a href="#projeler" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full font-bold transition-all flex items-center justify-center gap-2">
                        Projeleri İncele <ExternalLink size={18} />
                    </a>
                </div>
            </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 animate-bounce z-20"><ChevronDown size={32} /></div>
    </section>
);

const AboutSection = () => (
    <section id="hakkinda" className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500 to-blue-600 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-30 transition-duration-500"></div>
                    <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100">
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" alt="Team" className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white"><p className="font-medium text-lg">"Birlikte öğreniyor, birlikte üretiyoruz."</p></div>
                    </div>
                </div>
                <div className="space-y-8">
                    <div><span className="text-emerald-600 font-bold tracking-wider uppercase text-sm">Hakkımızda</span><h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 leading-tight">Teknolojiyi Sadece Tüketme, <span className="relative inline-block"><span className="relative z-10 text-emerald-600">Yönet.</span><span className="absolute bottom-1 left-0 w-full h-3 bg-emerald-100 -z-0"></span></span></h2></div>
                    <p className="text-lg text-gray-600 leading-relaxed">ARİNAT, Konya Teknik Üniversitesi bünyesinde kurulan, inovasyon ve Ar-Ge odaklı yeni nesil bir teknoloji topluluğudur.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[{ icon: Code2, title: "Yazılım", desc: "Web, Mobil, AI & Veri Bilimi" }, { icon: Cpu, title: "Donanım", desc: "IoT, Gömülü Sistemler, Robotik" }, { icon: Zap, title: "İnovasyon", desc: "Hackathonlar & Fikir Maratonları" }, { icon: Award, title: "Kariyer", desc: "Staj & Mentorluk Ağları" }].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-emerald-50/50 transition-colors border border-transparent hover:border-emerald-100"><div className="p-2 bg-white rounded-lg shadow-sm text-emerald-600"><item.icon size={20} /></div><div><h4 className="font-bold text-gray-900">{item.title}</h4><p className="text-xs text-gray-500 mt-1">{item.desc}</p></div></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const MissionVisionSection = () => (
    <section id="misyon-vizyon" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16"><h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Rotamız ve Hedefimiz</h2><p className="text-gray-500">Bizi motive eden değerler ve geleceğe bakış açımız.</p></div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div className="group relative overflow-hidden rounded-[2rem] bg-white shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[350px] md:h-[400px] border border-gray-100">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative p-6 md:p-10 flex flex-col h-full justify-between z-10">
                        <div>
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-xl md:text-2xl shadow-inner"><Globe /></div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Misyonumuz</h3>
                            <p className="text-sm md:text-base text-gray-600 leading-relaxed">Mühendislik disiplinleriyle önce arayışı daha sonra inşayı teşvik ederken bilgi ile uygulamayı ahenk içinde birleştirerek inovatif projeler geliştiren, teknolojiden güç alarak toplumsal fayda odaklı insanlar yetiştirmeyi amaçlayan bir mühendis orkestrası oluşturmaktır.</p>
                        </div>
                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-4">
                            <div className="w-1/3 h-full bg-emerald-500 group-hover:w-full transition-all duration-700 ease-out"></div>
                        </div>
                    </div>
                </div>
                <div className="group relative overflow-hidden rounded-[2rem] bg-gray-900 text-white shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[350px] md:h-[400px]">
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                    <div className="relative p-6 md:p-10 flex flex-col h-full justify-between z-10">
                        <div>
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-xl md:text-2xl backdrop-blur-sm border border-white/10"><BookOpen /></div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Vizyonumuz</h3>
                            <p className="text-sm md:text-base text-gray-300 leading-relaxed">Bilgiyi keşfe, keşfi yeniliğe dönüştüren; araştırma, üretim ve iş birliğini aynı armonide buluşturarak sürdürülebilir ve yenilikçi çözümler üreten bir mühendislik ekolü olmak.</p>
                        </div>

                        {/* GÜNCELLENEN KISIM: div yerine a etiketi ve href eklendi */}
                        <a href="#neler-yapiyoruz" className="flex items-center gap-2 text-xs md:text-sm text-gray-400 group-hover:text-white transition-colors cursor-pointer mt-4">
                            <span>Daha fazlasını keşfet</span> <ArrowRight size={16} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const WhatWeDoSection = () => {
    // Hangi kartın aktif olduğunu tutan state
    const [activeCardIndex, setActiveCardIndex] = useState(null);

    const activities = [
        {
            title: "Yazılım Atölyeleri",
            desc: "Java , Python, C# , C++, Modern Web Teknolojileri gibi yazılım atölyeleriyle aylık eğitimler.",
            image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop",
            icon: null, // Sadece resim olan kart
            className: "md:col-span-2", // Geniş kart
            bgClass: ""
        },
        {
            title: "Robotik & İHA",
            desc: "TEKNOFEST ve uluslararası yarışmalar için otonom araçlar, İHA ve SİHA projeleri geliştiriyoruz.",
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
            icon: <Cpu />,
            className: "md:row-span-2 bg-gray-900", // Dikey uzun kart
            bgClass: "bg-gradient-to-b from-transparent to-black/90"
        },
        {
            title: "Hackathonlar",
            desc: "48 saatlik kod maratonları ve inovasyon yarışmaları.",
            image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop",
            icon: null,
            className: "",
            bgClass: "bg-gradient-to-t from-black/90 via-black/40 to-transparent"
        },
        {
            title: "Sektör Buluşmaları",
            desc: "Alanında uzman profesyonellerle tanışma ve çay saati etkinlikleri.",
            image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop",
            icon: null,
            className: "",
            bgClass: "bg-gradient-to-t from-black/90 via-black/40 to-transparent"
        }
    ];

    const handleCardClick = (index) => {
        setActiveCardIndex(activeCardIndex === index ? null : index);
    };

    return (
        <section id="neler-yapiyoruz" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
                    <div className="text-left">
                        <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-emerald-600 inline-block"></span>
                            Faaliyetler
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Neler Yapıyoruz?</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                    {activities.map((item, index) => {
                        const isActive = activeCardIndex === index;

                        return (
                            <div
                                key={index}
                                onClick={() => handleCardClick(index)}
                                className={`group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-lg transition-transform duration-500
                                ${item.className}
                                ${isActive ? 'scale-[1.02]' : 'hover:scale-[1.02]'}`}
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 
                                    ${isActive ? 'scale-110' : 'group-hover:scale-105'}
                                    ${item.icon ? (isActive ? 'opacity-40' : 'opacity-60 group-hover:opacity-40') : ''}
                                    `}
                                />

                                <div className={`absolute inset-0 ${item.bgClass || 'bg-gradient-to-t from-black/90 via-black/20 to-transparent'}`}></div>

                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    {item.icon && (
                                        <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4 text-white">
                                            {item.icon}
                                        </div>
                                    )}

                                    <h3 className={`text-white mb-3 font-bold transition-all duration-300 
                                        ${isActive ? 'text-2xl' : item.className.includes('col-span-2') ? 'text-3xl' : 'text-xl'}`}>
                                        {item.title}
                                    </h3>

                                    <p className={`text-gray-300 text-sm mb-4 max-w-md transition-all duration-500 
                                        ${isActive ? 'opacity-100 translate-y-0' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0'}`}>
                                        {item.desc}
                                    </p>

                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

const ProjectsSection = () => {
    // Mobilde tıklanan kartı takip etmek için state
    const [activeProjectId, setActiveProjectId] = useState(null);

    const handleCardClick = (id) => {
        // Eğer zaten açıksa kapat, değilse aç
        setActiveProjectId(activeProjectId === id ? null : id);
    };

    return (
        <section id="projeler" className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
                    <div className="text-left">
                        <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-emerald-600 inline-block"></span>
                            Portfolyo
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">Öne Çıkan Projelerimiz</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
                    {INITIAL_PROJECTS.map((project, index) => {
                        const isActive = activeProjectId === project.id;

                        return (
                            <div
                                key={project.id}
                                onClick={() => handleCardClick(project.id)}
                                className={`group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-xl transition-all duration-500 bg-gray-900 border border-gray-800/50
                                ${index === 0 ? 'md:col-span-2 md:row-span-1' : 'md:col-span-1'}
                                ${isActive ? 'shadow-2xl ring-2 ring-emerald-500/50' : 'hover:shadow-2xl'}`}
                            >
                                {/* Görsel: Mobilde aktifse veya desktopta hover ise büyüsün */}
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 
                                    ${isActive ? 'scale-110 opacity-40' : 'group-hover:scale-110 opacity-50 group-hover:opacity-40'}`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-90"></div>

                                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                                    {/* Üst Kısım Animasyonu */}
                                    <div className={`flex justify-between items-start transition-all duration-500 
                                        ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100'}`}>
                                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[11px] font-bold text-emerald-300 uppercase tracking-wider shadow-sm">
                                            {project.category}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs font-medium text-gray-300 bg-gray-900/50 px-2 py-1 rounded-md">
                                            <Calendar size={12} className="text-emerald-500" /> {project.year}
                                        </span>
                                    </div>

                                    {/* Alt Kısım Animasyonu */}
                                    <div className={`transform transition-transform duration-500 
                                        ${isActive ? 'translate-y-0' : 'translate-y-4 group-hover:translate-y-0'}`}>
                                        <h3 className={`font-bold text-white mb-3 leading-tight transition-colors 
                                            ${isActive ? 'text-emerald-300' : 'group-hover:text-emerald-300'} 
                                            ${index === 0 ? 'text-3xl' : 'text-2xl'}`}>
                                            {project.title}
                                        </h3>

                                        {/* GÜNCELLENEN AÇIKLAMA ALANI: Okunabilirlik için kaydırma eklendi */}
                                        <p className={`text-gray-300 text-sm leading-relaxed mb-6 transition-all duration-700 delay-100 custom-scrollbar
                                            ${isActive
                                                ? 'opacity-100 line-clamp-none overflow-y-auto max-h-[160px] pr-2'
                                                : 'opacity-0 group-hover:opacity-100 line-clamp-3 overflow-hidden'
                                            }`}
                                        >
                                            {project.desc}
                                        </p>

                                        <div className="flex items-center justify-start pt-4 border-t border-white/10">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 size={16} className={project.status.includes('Tamamlandı') || project.status.includes('Test') ? "text-emerald-500" : "text-amber-500"} />
                                                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">{project.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

const WhyArinatSection = () => {
    const benefits = ["Gerçek dünya projelerinde deneyim", "Güçlü bir network ve kariyer fırsatı", "Sektör liderlerinden mentorluk", "Sosyal etkinlikler ve teknik geziler", "Takım çalışması ve liderlik"];
    return (
        <section id="neden-arinat" className="py-32 bg-gray-900 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="absolute right-0 top-1/4 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Neden <span className="text-emerald-400">ARİNAT?</span></h2>
                        <p className="text-gray-400 mb-10 text-lg leading-relaxed">Sadece bir topluluk değil, geleceğin mühendislerini ve liderlerini yetiştiren bir okuluz. İşte bizimle olman için sebepler:</p>
                        <ul className="space-y-6">{benefits.map((item, idx) => (<li key={idx} className="flex items-center gap-4 group"><div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-white transition-colors"><span className="text-sm font-bold">{idx + 1}</span></div><span className="text-lg text-gray-300 group-hover:text-white transition-colors">{item}</span></li>))}</ul>
                    </div>
                    <div className="relative lg:h-[600px] w-full">
                        <div className="absolute top-10 left-10 right-0 bottom-0 bg-emerald-900/30 rounded-3xl border border-white/10 backdrop-blur-sm z-0"></div>
                        <div className="absolute inset-0 right-10 bottom-10 rounded-3xl overflow-hidden shadow-2xl z-10 border border-gray-700">
                            <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop" alt="Success" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent"></div>
                            <div className="absolute bottom-8 left-8"><div className="flex items-center gap-2 mb-2">{[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} className="fill-yellow-400 text-yellow-400" />)}</div><p className="text-white font-bold text-xl">"Kariyerimin dönüm noktası oldu."</p><p className="text-gray-400 text-sm mt-1">- Mezun Üyemiz</p></div>
                        </div>
                        <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-white p-4 rounded-xl shadow-xl animate-float"><div className="flex items-center gap-3"><div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><Award /></div><div><div className="font-bold text-gray-900">Ödüllü Projeler</div><div className="text-xs text-gray-500">TEKNOFEST 2024</div></div></div></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const UpcomingEventsSection = ({ events, onRegister }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const activeEvents = events.filter(ev => ev.is_active);

    // Ekran genişliğini takip eden logic
    const [itemsToShow, setItemsToShow] = useState(window.innerWidth < 1024 ? 1 : 3);

    useEffect(() => {
        const handleResize = () => {
            setItemsToShow(window.innerWidth < 1024 ? 1 : 3);
            setCurrentIndex(0); // Boyut değişince başa sar ki hizalama bozulmasın
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, activeEvents.length - itemsToShow);

    const nextSlide = () => {
        if (currentIndex < maxIndex) setCurrentIndex(prev => prev + 1);
    };

    const prevSlide = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    const calculateStatus = (event) => {
        const now = new Date();
        const deadline = new Date(event.deadline);
        const registrationsCount = event.registrations?.length || 0;
        const quotaFilled = registrationsCount >= event.quota;

        if (quotaFilled) return { label: 'Kontenjan Dolu', color: 'bg-red-100 text-red-600', disabled: true };
        if (now > deadline) return { label: 'Başvuru Kapandı', color: 'bg-gray-100 text-gray-500', disabled: true };

        const diffTime = Math.abs(deadline - now);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 3) return { label: 'Son Günler!', color: 'bg-amber-100 text-amber-600', disabled: false };
        return { label: 'Başvuru Açık', color: 'bg-emerald-100 text-emerald-600', disabled: false };
    };

    return (
        <section id="etkinlikler" className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Üst Başlık ve Butonlar */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="text-center md:text-left">
                        <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm">Takvim</span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-2">Güncel Etkinlikler</h2>
                    </div>

                    {activeEvents.length > itemsToShow && (
                        <div className="flex gap-3">
                            <button
                                onClick={prevSlide}
                                disabled={currentIndex === 0}
                                className={`p-4 rounded-2xl border transition-all ${currentIndex === 0 ? 'border-gray-100 text-gray-200' : 'border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg'}`}
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextSlide}
                                disabled={currentIndex >= maxIndex}
                                className={`p-4 rounded-2xl border transition-all ${currentIndex >= maxIndex ? 'border-gray-100 text-gray-200' : 'border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white shadow-lg'}`}
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Carousel Alanı */}
                <div className="relative -mx-3"> {/* Negatif margin dış boşluğu dengeler */}
                    <div
                        className="flex transition-transform duration-500 ease-out"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`
                        }}
                    >
                        {activeEvents.map(event => {
                            const status = calculateStatus(event);
                            const registrationsCount = event.registrations?.length || 0;

                            return (
                                <div
                                    key={event.id}
                                    className={`shrink-0 px-3 transition-opacity duration-300 ${itemsToShow === 1 ? 'w-full' : 'w-1/3'}`}
                                >
                                    <div className="group bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-100 flex flex-col h-full hover:shadow-2xl transition-all">
                                        <div className="relative h-60 overflow-hidden shrink-0">
                                            <img src={event.image_url || 'https://via.placeholder.com/600x400'} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                            <div className="absolute top-5 left-5"><span className={`px-4 py-1.5 rounded-full text-xs font-black shadow-lg ${status.color}`}>{status.label}</span></div>
                                            <div className="absolute bottom-5 left-5 right-5 text-white">
                                                <h3 className="text-xl font-black leading-tight mb-2 drop-shadow-md">{event.title}</h3>
                                                <div className="flex items-center gap-2 text-xs text-gray-300 font-medium"><MapPin size={14} className="text-emerald-400" /> {event.location}</div>
                                            </div>
                                        </div>

                                        <div className="p-8 flex flex-col flex-1">
                                            <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">{event.short_desc}</p>

                                            <div className="mt-auto space-y-5">
                                                <div className="grid grid-cols-2 gap-4 text-[11px] font-bold text-gray-400 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                    <div className="flex items-center gap-2"><Calendar size={16} className="text-emerald-500" /><span>{formatDate(event.start_date)}</span></div>
                                                    <div className="flex items-center gap-2"><Clock size={16} className="text-blue-500" /><span>{event.start_time}</span></div>
                                                    <div className="col-span-2 border-t border-gray-200 pt-3 flex items-center justify-between">
                                                        <div className="flex items-center gap-2"><Users size={16} className="text-purple-500" /> <span>Doluluk</span></div>
                                                        <span className="text-gray-900">{registrationsCount} / {event.quota}</span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => onRegister(event)}
                                                    disabled={status.disabled}
                                                    className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 ${status.disabled ? 'bg-gray-100 text-gray-400' : 'bg-slate-900 text-white hover:bg-emerald-600 shadow-xl'}`}
                                                >
                                                    {status.disabled ? 'Kayıt Yapılamaz' : 'Hemen Başvur'} {!status.disabled && <ArrowRight size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {activeEvents.length === 0 && (
                    <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                        <h3 className="text-xl font-bold text-gray-400">Şu an aktif etkinlik bulunmuyor.</h3>
                    </div>
                )}
            </div>
        </section>
    );
};
const MembershipSection = () => {
    // Sosyal medya verilerini bir diziye alıyoruz
    const socialLinks = [
        {
            Icon: Instagram,
            href: "https://www.instagram.com/ktunarinat?igsh=MTdpZWlvczE3MHcwMA=="
        },
        { Icon: Twitter, href: "#" },
        { Icon: Linkedin, href: "https://www.linkedin.com/in/arinat-ara%C5%9Ft%C4%B1rma-in%C5%9Fa-ve-armoni-toplulu%C4%9Fu-77b674393?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" }
    ];

    return (
        <section id="uyelik" className="py-24 bg-gray-50 relative overflow-hidden">
            {/* Arka Plan Dekoratif Öğeler */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-emerald-100/50 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[25rem] h-[25rem] bg-blue-100/50 rounded-full blur-[100px]"></div>
            </div>

            <div className="container mx-auto px-4 max-w-5xl relative z-10">
                <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[450px] transition-transform hover:scale-[1.01] duration-500">

                    {/* Sol Taraf: Görsel ve Slogan */}
                    <div className="md:w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-12 flex flex-col justify-center relative overflow-hidden group">
                        {/* Arka Plan Görseli */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/30 transition-all duration-700"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-emerald-300 backdrop-blur-sm border border-white/5">
                                <Sparkles size={12} />
                                <span>Geleceği İnşa Et</span>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-bold leading-tight">
                                Sınırları <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Zorla.</span>
                            </h3>
                            <p className="text-slate-300 text-lg font-light leading-relaxed max-w-sm">
                                ARİNAT ailesine katılarak projelerde yer al, networkünü genişlet ve kariyerine güçlü bir başlangıç yap.
                            </p>

                            {/* Sosyal Medya İkonları */}
                            <div className="flex gap-4 pt-4">
                                {socialLinks.map((item, i) => (
                                    <a
                                        key={i}
                                        href={item.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 bg-white/5 rounded-lg hover:bg-white/20 hover:scale-110 transition-all duration-300 text-white/70 hover:text-white"
                                    >
                                        <item.Icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sağ Taraf: Aksiyon Çağrısı */}
                    <div className="md:w-1/2 p-12 bg-white flex flex-col justify-center items-center text-center relative">
                        <div className="absolute top-6 right-6 opacity-5 pointer-events-none">
                            <img src={arinatLogo} alt="Logo" className="w-24" />
                        </div>

                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm rotate-3 hover:rotate-6 transition-transform">
                            <ExternalLink size={32} />
                        </div>

                        <h4 className="text-2xl font-bold text-gray-900 mb-3">Resmi Başvuru Kanalı</h4>
                        <p className="text-gray-500 mb-8 leading-relaxed max-w-xs mx-auto">
                            Üyelik işlemleri üniversitemizin <strong>Topluluklar Bilgi Sistemi</strong> üzerinden yürütülmektedir.
                        </p>

                        <a
                            href="https://topluluk.ktun.edu.tr/"
                            target="_blank"
                            rel="noreferrer"
                            className="group relative w-full max-w-xs py-4 px-6 bg-slate-900 text-white rounded-xl font-bold text-lg overflow-hidden shadow-lg shadow-slate-900/20 hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Başvuru Yap <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            {/* Hover Efekti */}
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </a>

                        <p className="text-xs text-gray-400 mt-6 flex items-center gap-1">
                            <Lock size={12} /> Güvenli Dış Bağlantı
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

const PublicFooter = () => (
    <footer id="iletisim" className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
            <img src={arinatLogo} alt="ARİNAT" className="h-12 w-auto mb-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500" onError={(e) => e.target.style.display = 'none'} />
            <p className="text-gray-500 text-sm mb-6 max-w-md">Konya Teknik Üniversitesi'nin teknoloji üssü. Geleceği kodluyoruz, sen de bize katıl.</p>
            <div className="flex gap-6 mb-8">
                <a
                    href="https://www.instagram.com/ktunarinat?igsh=MTdpZWlvczE3MHcwMA=="
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-emerald-500 transition-colors"
                >
                    Instagram
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">Twitter</a>
                <a href="https://www.linkedin.com/in/arinat-ara%C5%9Ft%C4%B1rma-in%C5%9Fa-ve-armoni-toplulu%C4%9Fu-77b674393?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="text-gray-400 hover:text-emerald-500 transition-colors">LinkedIn</a>
            </div>
            <div className="w-full h-px bg-gray-100 max-w-xs mx-auto mb-8"></div>
            <div className="flex flex-col items-center gap-2">
                <p className="text-gray-400 text-xs">© {new Date().getFullYear()} ARİNAT Topluluğu. Tüm hakları saklıdır.</p>
                <a href="https://aayazilim.net" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-1.5 bg-gray-50 hover:bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group"><span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Developed by</span><img src={aaLogo} alt="AA Yazılım" className="h-4 w-auto object-contain grayscale group-hover:grayscale-0 transition-all" /></a>
            </div>
        </div>
    </footer>
);

const RegistrationModal = ({ event, onClose, onRegister }) => {
    if (!event) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const registrationData = {
            fullname: formData.get('fullname'),
            student_no: formData.get('studentNo'),
            class_info: formData.get('class'),
            phone: formData.get('phone'),
            attended_before: formData.get('attendedBefore'),
            custom_answers: event.custom_questions?.map((q, index) => ({
                question: q,
                answer: formData.get(`custom_question_${index}`)
            })) || []
        };

        onRegister(event.id, registrationData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-500" onClick={onClose}></div>

            {/* GÜNCELLEME: Telefonda h-[96vh] yapıldı, PC'de md:h-[55vh] korundu */}
            <div className="bg-white rounded-[2rem] w-full max-w-4xl relative z-10 overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-auto md:max-h-[90vh] animate-in zoom-in duration-300">

                {/* SOL TARAF: Etkinlik Detayları */}
                <div className="md:w-5/12 bg-slate-900 text-white p-8 md:p-10 flex flex-col relative shrink-0 border-b md:border-b-0 md:border-r border-white/5 overflow-hidden">
                    <img src={event.image_url || 'https://images.unsplash.com/photo-1559067515-bf7d799b6d42'} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-wider mb-6">
                                <Sparkles size={12} /> Etkinlik Bilgisi
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-6">{event.title}</h2>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-slate-300">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner"><Calendar size={20} className="text-emerald-400" /></div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tarih & Saat</p>
                                        <p className="font-bold text-sm">{formatDate(event.start_date)} — {event.start_time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-300">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner"><MapPin size={20} className="text-emerald-400" /></div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Konum</p>
                                        <p className="font-bold text-sm">{event.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detay Metni: Mobilde kısa PC'de tam alan */}
                        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar bg-white/5 rounded-2xl p-5 border border-white/5 shadow-inner max-h-40 md:max-h-none">
                            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-medium italic">
                                {event.long_desc || event.short_desc}
                            </p>
                        </div>
                    </div>
                </div>

                {/* SAĞ TARAF: Başvuru Formu */}
                <div className="md:w-7/12 p-8 md:p-12 bg-white flex flex-col overflow-hidden">
                    <div className="flex justify-between items-start mb-8 shrink-0">
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Kayıt Formu</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase mt-1 tracking-widest">Aramıza katılmak için formu doldur</p>
                        </div>
                        <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-red-500"><X size={28} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-wider">Ad Soyad</label>
                                <input name="fullname" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800" placeholder="" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-wider">Öğrenci No</label>
                                <input name="studentNo" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800" placeholder="" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-wider">Sınıf</label>
                                <select name="class" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-bold text-slate-800 appearance-none cursor-pointer">
                                    <option value="">Seçiniz</option>
                                    <option value="1">1. Sınıf</option>
                                    <option value="2">2. Sınıf</option>
                                    <option value="3">3. Sınıf</option>
                                    <option value="4">4. Sınıf</option>
                                    <option value="Diğer">Diğer</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-wider">Telefon</label>
                                <input name="phone" type="tel" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none transition-all font-bold text-slate-800" placeholder="" />
                            </div>
                        </div>

                        {/* Ek Sorular */}
                        {event.custom_questions?.length > 0 && (
                            <div className="pt-8 space-y-6 border-t border-slate-100">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-b border-emerald-50 w-fit pb-1">Etkinliğe Özel Sorular</p>
                                {event.custom_questions.map((question, index) => (
                                    <div key={index} className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{question}</label>
                                        <input
                                            name={`custom_question_${index}`}
                                            required
                                            className="w-full p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800"
                                            placeholder="Yanıtınız..."
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="pt-6 pb-2 mt-auto border-t border-slate-50">
                            <button type="submit" className="w-full py-5 bg-slate-900 hover:bg-emerald-600 text-white font-black rounded-[1.5rem] transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 group text-lg">
                                Başvuruyu Tamamla <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-center text-[10px] text-slate-400 mt-5 font-bold uppercase tracking-widest">Verileriniz Admin Paneline Bildirim Olarak Gidecektir</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// -----------------------------------------------------------------------------
// --- ADMIN PANEL COMPONENTS ---
// -----------------------------------------------------------------------------

const AdminLogin = () => {
    const [u, setU] = useState('');
    const [p, setP] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        const ok = await login(u, p);
        if (ok) {
            addToast('Hoşgeldin Admin!');
            navigate('/admin/dashboard');
        } else {
            addToast('Kullanıcı adı veya şifre hatalı.', 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans">
            {/* Premium Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[30%] -left-[10%] w-[100vh] h-[100vh] bg-emerald-500/10 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute -bottom-[30%] -right-[10%] w-[100vh] h-[100vh] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
            </div>

            <div className="w-full max-w-md p-6 relative z-10 animate-fade-in-up">
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

                    <div className="text-center mb-12 relative z-10">
                        <div className="inline-flex p-4 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/10 mb-6 shadow-xl shadow-emerald-900/20 group-hover:scale-105 transition-transform duration-500">
                            <img src={arinatLogo} alt="" className="h-16 w-auto drop-shadow-lg" />
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tight mb-2">Yönetici Paneli</h2>
                        <p className="text-slate-400 font-medium">Lütfen giriş bilgilerinizi giriniz.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-emerald-400 text-[11px] font-black uppercase tracking-widest ml-1">Kullanıcı Adı</label>
                            <div className="relative group/input">
                                <UserCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-emerald-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    required
                                    value={u}
                                    onChange={e => setU(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-slate-950/50 border border-slate-700/50 rounded-2xl text-white outline-none focus:border-emerald-500/50 focus:bg-slate-950/80 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold placeholder:text-slate-600"
                                    placeholder="Örn: arinat_admin"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-emerald-400 text-[11px] font-black uppercase tracking-widest ml-1">Şifre</label>
                            <div className="relative group/input">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-emerald-500 transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={p}
                                    onChange={e => setP(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-slate-950/50 border border-slate-700/50 rounded-2xl text-white outline-none focus:border-emerald-500/50 focus:bg-slate-950/80 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold placeholder:text-slate-600"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg group/btn">
                                <span>Giriş Yap</span>
                                <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <a href="/" className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2 group/link">
                            <ChevronLeft size={16} className="group-hover/link:-translate-x-1 transition-transform" /> Ana Sayfaya Dön
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminLayout = ({ children, title, notifications, markAsRead }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { path: '/admin/dashboard', icon: Layout, label: 'Genel Bakış' },
        { path: '/admin/events', icon: Calendar, label: 'Etkinlik Yönetimi' },
        { path: '/admin/announcements', icon: Megaphone, label: 'Duyurular' },
    ];

    const handleLogout = () => {
        if (window.confirm('Oturumu kapatmak istediğinize emin misiniz?')) {
            logout();
            navigate('/admin/login');
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="min-h-screen bg-slate-50/50 flex font-sans text-slate-800">
            {/* --- SIDEBAR --- */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static flex flex-col shadow-2xl overflow-hidden`}>
                {/* Sidebar Header */}
                <div className="h-28 flex items-center px-8 border-b border-white/5 bg-slate-950/50 relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <Sparkles size={80} className="text-emerald-500" />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg shadow-emerald-900/20">
                            <img src={arinatLogo} alt="ARİNAT" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-xl text-white tracking-tight leading-none">ARİNAT</span>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1.5">Yönetim Paneli</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar Menu */}
                <div className="flex-1 py-10 px-6 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="px-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-70">Ana Menü</div>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden text-sm font-bold tracking-wide
                                ${isActive
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30 translate-x-1'
                                        : 'hover:bg-white/5 hover:text-white hover:translate-x-1'}`}
                            >
                                <item.icon size={20} className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'} transition-colors duration-300`} />
                                <span>{item.label}</span>
                                {isActive && <ChevronRight size={16} className="absolute right-4 text-white/50" />}
                            </button>
                        )
                    })}
                </div>

                {/* Sidebar Footer */}
                <div className="p-6">
                    <div className="p-5 rounded-3xl bg-slate-800/50 border border-white/5 backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center gap-4 mb-5 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                {user?.username?.[0].toUpperCase()}
                            </div>
                            <div className="overflow-hidden text-left">
                                <div className="text-sm font-bold text-white truncate">{user?.username}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Süper Admin</div>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 py-3 rounded-xl transition-all text-xs font-black uppercase tracking-wider relative z-10">
                            <LogOut size={14} /> Çıkış Yap
                        </button>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen bg-slate-50/50 lg:ml-0 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                {/* Header */}
                <header className="h-20 sm:h-24 bg-white/80 border-b border-slate-200/60 flex items-center justify-between px-6 sm:px-10 sticky top-0 z-40 backdrop-blur-xl">
                    <div className="flex items-center gap-6">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:text-slate-900 transition-colors"><Menu size={28} /></button>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
                            <p className="hidden sm:block text-xs font-bold text-slate-400 mt-1">Hoşgeldiniz, {user?.username}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <a href="/" target="_blank" className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:text-emerald-600 transition-all shadow-sm hover:shadow-md">
                            <Globe size={14} /> <span className="uppercase tracking-wider">Web Sitesi</span>
                        </a>

                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className={`relative p-3 rounded-full transition-all duration-300 ${isNotificationOpen ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400 hover:bg-white hover:shadow-md hover:text-emerald-500'}`}
                            >
                                <Bell size={22} className={unreadCount > 0 ? 'animate-bounce-short' : ''} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                                )}
                            </button>

                            {isNotificationOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)}></div>
                                    <div className="absolute right-0 top-full mt-4 w-80 md:w-[420px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right">
                                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30 backdrop-blur-sm">
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-lg">Bildirimler</h3>
                                                <p className="text-xs text-slate-500 font-medium mt-0.5">Son etkinlik başvuruları</p>
                                            </div>
                                            {unreadCount > 0 && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-wider">{unreadCount} YENİ</span>}
                                        </div>

                                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                                            {notifications.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-12 text-slate-400 opacity-60">
                                                    <Bell size={40} className="mb-4 text-slate-200" />
                                                    <p className="text-sm font-bold">Her şey sakin...</p>
                                                </div>
                                            ) : (
                                                notifications.map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        onClick={() => markAsRead(notif.id)}
                                                        className={`p-4 mb-2 rounded-xl transition-all cursor-pointer border
                                                            ${!notif.is_read
                                                                ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                                                                : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                                                    >
                                                        {/* Header */}
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div className="flex items-center gap-2">
                                                                {!notif.is_read && (
                                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                                                )}
                                                                <span className={`font-bold text-sm ${!notif.is_read ? 'text-emerald-900' : 'text-slate-700'}`}>
                                                                    {notif.fullname}
                                                                </span>
                                                            </div>
                                                            <span className="text-[10px] font-medium text-slate-400 uppercase">
                                                                {formatDate(notif.created_at)}
                                                            </span>
                                                        </div>

                                                        {/* Event */}
                                                        <div className="mb-2 pl-4 border-l-2 border-slate-200">
                                                            <p className="text-xs text-slate-600 font-medium">{notif.event_title}</p>
                                                        </div>

                                                        {/* Info */}
                                                        <div className="flex gap-2 text-[10px] text-slate-500">
                                                            <span>{notif.student_no}</span>
                                                            <span>•</span>
                                                            <span>{notif.phone}</span>
                                                            {notif.class_info && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>{notif.class_info}. Sınıf</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {notifications.length > 0 && (
                                            <button
                                                onClick={() => notifications.forEach(n => markAsRead(n.id))}
                                                className="w-full py-4 text-center text-[10px] font-black text-slate-500 hover:bg-slate-50 hover:text-emerald-600 uppercase tracking-widest transition-all border-t border-slate-50"
                                            >
                                                Tümünü Okundu İşaretle
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 scroll-smooth relative z-0">
                    <div className="max-w-7xl mx-auto space-y-10">
                        {children}
                    </div>
                </div>
            </main>

            {sidebarOpen && <div className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)}></div>}
        </div>
    );
};

const DashboardHome = ({ events = [], notifications = [] }) => {
    // İstatistik Kartı Bileşeni (Tasarım Korundu)
    const StatCard = ({ label, value, icon: Icon, colorClass, bgClass }) => (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between group hover:shadow-md transition-all duration-300">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{label}</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
            </div>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${bgClass} ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={20} />
            </div>
        </div>
    );

    // Backend kolon isimlerine (is_active, is_read) göre dinamik hesaplamalar
    const totalRegistrations = notifications.length;
    const activeEventsCount = events.filter(e => e.is_active).length;
    const pendingNotifications = notifications.filter(n => !n.is_read).length;

    const stats = [
        { label: 'Aktif Etkinlik', value: activeEventsCount, icon: Calendar, colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50' },
        { label: 'Toplam Başvuru', value: totalRegistrations, icon: Users, colorClass: 'text-blue-600', bgClass: 'bg-blue-50' },
        { label: 'Bekleyen Başvuru', value: pendingNotifications, icon: Bell, colorClass: 'text-amber-600', bgClass: 'bg-amber-50' },
    ];

    return (
        <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
            {/* Üst İstatistik Paneli */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {stats.map((stat, idx) => <StatCard key={idx} {...stat} />)}
            </div>

            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Etkinlik Doluluk Oranları Kartı */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 text-lg">Etkinlik Katılım Durumları</h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Canlı Veritabanı</span>
                    </div>
                    <div className="p-6 space-y-6">
                        {events.length > 0 ? events.map(event => {
                            // Kayıt sayısını notification tablosundaki eşleşen id'lerden alıyoruz
                            const regCount = notifications.filter(n => n.event_id === event.id).length;
                            const percentage = Math.min((regCount / (event.quota || 1)) * 100, 100);

                            return (
                                <div key={event.id} className="group">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-slate-900">{event.title}</span>
                                        <span className="text-xs font-bold text-slate-500">{regCount} / {event.quota}</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ease-out relative ${percentage >= 100 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                            style={{ width: `${percentage}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="text-center py-10 text-slate-400 text-sm italic">Henüz görüntülenecek etkinlik verisi bulunmuyor.</div>
                        )}
                    </div>
                </div>

                {/* Sağ Taraf: Hızlı İşlemler Kartı (Tasarım Korundu) */}
                <div className="bg-slate-900 rounded-[2rem] p-6 sm:p-8 text-white shadow-xl flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                            <Zap className="text-emerald-400" size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Yönetim Kısayolları</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">
                            İçerikleri güncellemek için aşağıdaki menüleri kullanın.
                        </p>

                        <div className="space-y-3">
                            <button onClick={() => window.location.hash = '/admin/events'} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all group text-sm font-medium">
                                <span className="flex items-center gap-3"><Calendar size={16} className="text-emerald-400" /> Etkinlikleri Yönet</span>
                                <ChevronRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                            </button>
                            <button onClick={() => window.location.hash = '/admin/announcements'} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all group text-sm font-medium">
                                <span className="flex items-center gap-3"><Megaphone size={16} className="text-blue-400" /> Duyuru Yayınla</span>
                                <ChevronRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                            </button>
                        </div>
                    </div>

                    <div className="relative z-10 mt-8 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Veritabanı Bağlantısı Aktif</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AnnouncementManager = ({ announcements, refreshData }) => {
    const { addToast } = useToast();
    const [text, setText] = useState('');
    const [type, setType] = useState('info');

    // DUYURU EKLEME - TASARIM KORUNDU
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        const storedUser = JSON.parse(localStorage.getItem('arinat_admin_user'));
        try {
            // Backend'e POST isteği
            await axios.post(`${API_URL}/announcements`,
                { title: text, type: type, is_active: true },
                { headers: { Authorization: `Bearer ${storedUser.token}` } }
            );

            setText('');
            addToast('Duyuru başarıyla yayınlandı.', 'success');
            refreshData();
        } catch (error) {
            addToast("Duyuru eklenirken hata oluştu.", "error");
        }
    };

    // DUYURU SİLME - TASARIM KORUNDU
    const handleDelete = async (id) => {
        if (!window.confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) return;
        const storedUser = JSON.parse(localStorage.getItem('arinat_admin_user'));
        try {
            await axios.delete(`${API_URL}/announcements/${id}`, {
                headers: { Authorization: `Bearer ${storedUser.token}` }
            });
            addToast('Duyuru silindi.', 'info');
            refreshData();
        } catch (error) {
            addToast("Silme işlemi başarısız.", "error");
        }
    };

    // DURUM GÜNCELLEME (TOGGLE)
    const toggleStatus = async (id, currentStatus) => {
        const storedUser = JSON.parse(localStorage.getItem('arinat_admin_user'));
        try {
            await axios.patch(`${API_URL}/announcements/${id}`,
                { is_active: !currentStatus },
                { headers: { Authorization: `Bearer ${storedUser.token}` } }
            );

            addToast('Duyuru durumu güncellendi.');
            refreshData();
        } catch (error) {
            console.error("Güncelleme hatası:", error);
            addToast("Durum güncellenemedi.", "error");
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fade-in-up">
            {/* Ekleme Kartı */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-start gap-4 mb-8">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                        <Megaphone size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Yeni Duyuru Oluştur</h2>
                        <p className="text-sm text-slate-500 mt-1">Web sitesinin en üstünde görünecek bant mesajı.</p>
                    </div>
                </div>

                <form onSubmit={handleAdd} className="flex flex-col gap-4 sm:gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
                        <div className="md:col-span-3">
                            <label className="block text-sm font-bold text-slate-500 uppercase mb-2 ml-1 tracking-wider">Duyuru Metni</label>
                            <input
                                required
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold"
                                placeholder="Örn: TEKNOFEST Başvuruları Başladı!"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 uppercase mb-2 ml-1 tracking-wider">Tür</label>
                            <div className="relative">
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl appearance-none outline-none focus:border-emerald-500 cursor-pointer font-bold"
                                >
                                    <option value="info">Bilgi (Mavi)</option>
                                    <option value="important">Önemli (Kırmızı)</option>
                                    <option value="success">Başarı (Yeşil)</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="px-6 sm:px-8 py-3 sm:py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center gap-2">
                            <Send size={18} /> Yayına Al
                        </button>
                    </div>
                </form>
            </div>

            {/* Liste Kısmı (GÜNCELLENDİ) */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Aktif Duyurular</h3>
                    <span className="text-xs font-bold text-slate-400">{announcements.length} Kayıt</span>
                </div>

                <div className="grid gap-3">
                    {announcements.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-0">
                                {/* Durum Noktası */}
                                <div className={`w-3 h-3 rounded-full shrink-0 shadow-sm ${item.type === 'important' ? 'bg-red-500' :
                                    item.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                                    }`}></div>

                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-700 leading-tight">{item.title}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                        Tür: {item.type}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                                {/* Durum Değiştirme Butonu */}
                                <button
                                    onClick={() => toggleStatus(item.id, item.is_active)}
                                    className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${item.is_active
                                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                        }`}
                                >
                                    {item.is_active ? 'Yayında' : 'Pasif'}
                                </button>

                                {/* Silme Butonu */}
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
                                    title="Duyuruyu Sil"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Veri Yoksa Gösterilecek Uyarı */}
                    {announcements.length === 0 && (
                        <div className="text-center py-10 sm:py-12 bg-white rounded-2xl border-2 border-dashed border-slate-100 text-slate-400">
                            Henüz bir duyuru eklenmemiş.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


const EventsManager = ({ events, refreshData }) => {
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    // Veritabanı kolon isimlerine (is_active, short_desc vb.) göre state başlatıyoruz
    const [currentEvent, setCurrentEvent] = useState({ is_active: true, custom_questions: [] });

    // Dosya Yükleme (Tasarım Korundu)
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 3 * 1024 * 1024) {
                alert("Dosya boyutu çok büyük! Lütfen 3MB'dan küçük bir görsel seçin.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                // Veritabanı kolon adımız: image_url
                setCurrentEvent(prev => ({ ...prev, image_url: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // --- ÖZEL SORU YÖNETİMİ ---
    const addQuestion = () => {
        setCurrentEvent(prev => ({
            ...prev,
            custom_questions: [...(prev.custom_questions || []), ""]
        }));
    };

    const updateQuestion = (index, value) => {
        const newQuestions = [...(currentEvent.custom_questions || [])];
        newQuestions[index] = value;
        setCurrentEvent(prev => ({ ...prev, custom_questions: newQuestions }));
    };

    const removeQuestion = (index) => {
        const newQuestions = [...(currentEvent.custom_questions || [])];
        newQuestions.splice(index, 1);
        setCurrentEvent(prev => ({ ...prev, custom_questions: newQuestions }));
    };

    // KAYDETME İŞLEMİ (API BAĞLANTILI)
    const handleSave = async (e) => {
        e.preventDefault();
        if (!currentEvent.title || !currentEvent.start_date) return;

        const storedUser = JSON.parse(localStorage.getItem('arinat_admin_user'));
        const config = { headers: { Authorization: `Bearer ${storedUser?.token}` } };

        // Boş soruları temizle
        const cleanedEvent = {
            ...currentEvent,
            custom_questions: currentEvent.custom_questions?.filter(q => q.trim() !== "") || []
        };

        try {
            if (cleanedEvent.id) {
                // GÜNCELLEME (PUT)
                await axios.put(`${API_URL}/events/${cleanedEvent.id}`, cleanedEvent, config);
                addToast('Etkinlik başarıyla güncellendi.', 'success');
            } else {
                // YENİ EKLEME (POST)
                await axios.post(`${API_URL}/events/create`, cleanedEvent, config);
                addToast('Etkinlik başarıyla oluşturuldu.', 'success');
            }

            refreshData(); // Listeyi veritabanından tazele
            setIsEditing(false);
            setCurrentEvent({ is_active: true, custom_questions: [] });
        } catch (error) {
            addToast("Etkinlik kaydedilirken hata oluştu.", "error");
        }
    };

    // SİLME İŞLEMİ (API BAĞLANTILI)
    const handleDelete = async (id) => {
        if (window.confirm('Silmek istediğinize emin misiniz?')) {
            const storedUser = JSON.parse(localStorage.getItem('arinat_admin_user'));
            try {
                await axios.delete(`${API_URL}/events/${id}`, {
                    headers: { Authorization: `Bearer ${storedUser?.token}` }
                });
                addToast('Etkinlik silindi.', 'info');
                refreshData(); // Listeyi tazele
            } catch (error) {
                addToast("Silme işlemi başarısız.", "error");
            }
        }
    };

    // --- FORM GÖRÜNÜMÜ (DÜZENLEME MODU) ---
    if (isEditing) {
        return (
            <div className="max-w-5xl mx-auto animate-fade-in-up pb-10 sm:pb-20">
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => { setIsEditing(false); setCurrentEvent({ is_active: true, custom_questions: [] }); }} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                        <ArrowRight size={16} className="rotate-180" /> Listeye Dön
                    </button>
                    <h2 className="text-2xl font-bold text-slate-800">{currentEvent.id ? 'Etkinliği Düzenle' : 'Yeni Etkinlik'}</h2>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm text-emerald-600">
                                <Edit size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Etkinlik Detayları</h3>
                                <p className="text-slate-500 text-xs mt-0.5">Veritabanına kaydedilecek bilgileri girin.</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="p-6 sm:p-8 md:p-10 space-y-8 sm:space-y-10">
                        <div className="space-y-4 sm:space-y-6">
                            <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest border-b border-slate-100 pb-2">Genel Bilgiler</h3>
                            <div className="grid gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Başlık</label>
                                    <input required value={currentEvent.title || ''} onChange={e => setCurrentEvent({ ...currentEvent, title: e.target.value })} className="w-full p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold" placeholder="Etkinlik Adı" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Kısa Açıklama</label>
                                        <input required value={currentEvent.short_desc || ''} onChange={e => setCurrentEvent({ ...currentEvent, short_desc: e.target.value })} className="w-full p-3 sm:p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Görsel URL veya Yükle</label>
                                        <div className="flex gap-2">
                                            <input type="text" value={currentEvent.image_url || ''} onChange={e => setCurrentEvent({ ...currentEvent, image_url: e.target.value })} className="flex-1 p-3 sm:p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" placeholder="https://..." />
                                            <label className="cursor-pointer bg-slate-800 hover:bg-emerald-600 text-white px-3 sm:px-4 rounded-xl flex items-center shrink-0">
                                                <Upload size={16} />
                                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Uzun Açıklama</label>
                                    <textarea rows="5" required value={currentEvent.long_desc || ''} onChange={e => setCurrentEvent({ ...currentEvent, long_desc: e.target.value })} className="w-full p-3 sm:p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Etkinlik detayları..."></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-2">Zaman ve Konum</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tarih</label>
                                    <input type="date" required value={currentEvent.start_date || ''} onChange={e => setCurrentEvent({ ...currentEvent, start_date: e.target.value })} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Saat</label>
                                    <input type="time" required value={currentEvent.start_time || ''} onChange={e => setCurrentEvent({ ...currentEvent, start_time: e.target.value })} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Konum</label>
                                    <input required value={currentEvent.location || ''} onChange={e => setCurrentEvent({ ...currentEvent, location: e.target.value })} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Kontenjan</label>
                                    <input type="number" required value={currentEvent.quota || ''} onChange={e => setCurrentEvent({ ...currentEvent, quota: e.target.value })} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-red-600 mb-2">Son Başvuru Tarihi</label>
                                    <input type="date" required value={currentEvent.deadline || ''} onChange={e => setCurrentEvent({ ...currentEvent, deadline: e.target.value })} className="w-full p-3.5 bg-red-50 border border-red-100 rounded-xl" />
                                </div>
                                <div className="flex flex-col justify-end">
                                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                                        <span className="text-sm font-bold text-slate-700">Yayına Al</span>
                                        <button type="button" onClick={() => setCurrentEvent(prev => ({ ...prev, is_active: !prev.is_active }))} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${currentEvent.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${currentEvent.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ÖZEL SORU ALANI */}
                        <div className="space-y-4 sm:space-y-6">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                <h3 className="text-xs font-bold text-purple-600 uppercase tracking-widest">Başvuru Formu Soruları</h3>
                                <button type="button" onClick={addQuestion} className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1">
                                    <Plus size={14} /> Soru Ekle
                                </button>
                            </div>
                            <div className="space-y-3 sm:space-y-4">
                                {currentEvent.custom_questions?.map((q, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input value={q} onChange={(e) => updateQuestion(index, e.target.value)} placeholder={`Soru ${index + 1}`} className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                                        <button type="button" onClick={() => removeQuestion(index)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 sm:pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-end">
                            <button type="button" onClick={() => { setIsEditing(false); setCurrentEvent({ is_active: true, custom_questions: [] }); }} className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50">Vazgeç</button>
                            <button type="submit" className="px-8 sm:px-10 py-3 sm:py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg flex items-center gap-2">
                                <Save size={18} /> Veritabanına Kaydet
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // --- LİSTE GÖRÜNÜMÜ ---
    return (
        <div className="space-y-6 sm:space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Etkinlik Yönetimi</h2>
                    <p className="text-slate-500 text-sm mt-1">Tüm etkinlikleri buradan ekleyebilir veya düzenleyebilirsiniz.</p>
                </div>
                <button onClick={() => { setCurrentEvent({ is_active: true, custom_questions: [] }); setIsEditing(true); }} className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3.5 rounded-xl hover:bg-emerald-700 shadow-lg font-bold group">
                    <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Yeni Etkinlik
                </button>
            </div>

            <div className="grid gap-4 sm:gap-6">
                {events.map(event => (
                    <div key={event.id} className="group bg-white p-4 sm:p-2 pr-4 sm:pr-6 rounded-[1.5rem] shadow-sm border border-slate-200 hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col lg:flex-row gap-4 sm:gap-6">
                        <div className="w-full lg:w-64 h-32 sm:h-40 rounded-2xl overflow-hidden shrink-0 relative">
                            <img src={event.image_url || 'https://via.placeholder.com/400x250'} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                                <span className={`px-2 sm:px-3 py-1 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wide shadow-sm backdrop-blur-md ${event.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300'}`}>
                                    {event.is_active ? 'Yayında' : 'Taslak'}
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 py-2 sm:py-3 flex flex-col justify-between">
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{event.title}</h3>
                                <p className="text-slate-500 text-sm line-clamp-2">{event.short_desc}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-bold text-slate-400 mt-3 sm:mt-4 lg:mt-0">
                                <span className="flex items-center gap-1.5 bg-slate-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg"><Calendar size={14} className="text-emerald-400" /> {formatDate(event.start_date)}</span>
                                <span className="flex items-center gap-1.5 bg-slate-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg"><Clock size={14} className="text-blue-500" /> {event.start_time}</span>
                                <span className="flex items-center gap-1.5 ml-auto text-slate-600"><Users size={14} className="text-purple-500" /> <span className="text-slate-900">{event.registrations?.length || 0}</span> / {event.quota}</span>
                            </div>
                        </div>

                        <div className="flex lg:flex-col items-center justify-center gap-2 sm:gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 sm:pt-4 lg:pt-0 lg:pl-6">
                            <button onClick={() => { setCurrentEvent(event); setIsEditing(true); }} className="p-2 sm:p-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl"><Edit size={16} /></button>
                            <button onClick={() => handleDelete(event.id)} className="p-2 sm:p-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
                {events.length === 0 && <div className="text-center py-16 sm:py-20 bg-white border-2 border-dashed rounded-3xl text-slate-400">Henüz bir etkinlik eklemediniz.</div>}
            </div>
        </div>
    );
};

// -----------------------------------------------------------------------------
// --- MAIN APP COMPONENT ---
// -----------------------------------------------------------------------------

function App() {
    // Başlangıç state'lerini boş dizi olarak ayarlıyoruz
    const [events, setEvents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // --- API'DEN VERİ ÇEKME FONKSİYONU ---
    const refreshData = async () => {
        try {
            // 1. Duyuruları Getir
            const annRes = await axios.get(`${API_URL}/announcements`);
            setAnnouncements(annRes.data);

            // 2. Etkinlikleri Getir
            const eventRes = await axios.get(`${API_URL}/events`);
            let eventsData = eventRes.data;

            // 3. Bildirimleri (Başvuruları) Getir - Sadece admin giriş yaptıysa
            const storedUser = JSON.parse(localStorage.getItem('arinat_admin_user'));
            let notificationsData = [];
            if (storedUser?.token) {
                const notifRes = await axios.get(`${API_URL}/notifications`, {
                    headers: { Authorization: `Bearer ${storedUser.token}` }
                });
                notificationsData = notifRes.data;
                setNotifications(notificationsData);
            }

            // Etkinliklere başvuru sayısını ekle (herkes için)
            // Bildirimleri public olarak da çek (sadece saymak için)
            let publicNotifications = notificationsData;
            if (!storedUser?.token) {
                // Admin değilse, public olarak da çek
                try {
                    const notifRes = await axios.get(`${API_URL}/notifications/public`);
                    publicNotifications = notifRes.data;
                } catch { }
            }

            // Her etkinliğe registrations alanı ekle
            eventsData = eventsData.map(ev => ({
                ...ev,
                registrations: publicNotifications.filter(n => n.event_id === ev.id)
            }));

            setEvents(eventsData);
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        }
    };

    // Uygulama ilk açıldığında verileri çek
    useEffect(() => {
        refreshData();
    }, []);

    // --- BİLDİRİM OKUNDU İŞARETLEME ---
    const markNotificationAsRead = async (id) => {
        const storedUser = JSON.parse(localStorage.getItem('arinat_admin_user'));
        try {
            await axios.patch(`${API_URL}/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${storedUser.token}` }
            });
            // Veriyi yerel state'de güncelle veya tekrar çek
            refreshData();
        } catch (error) {
            console.error("Bildirim güncelleme hatası:", error);
        }
    };

    // --- ETKİNLİK BAŞVURU FONKSİYONU (Backend Kayıtlı) ---
    const handleEventRegistration = async (eventId, userData) => {
        try {
            // Backend'e başvuruyu gönderiyoruz
            await axios.post(`${API_URL}/events/${eventId}/register`, userData);

            // Başarılı olduktan sonra hem etkinlikleri hem de bildirimleri API'den tekrar çekiyoruz
            await refreshData();

            alert('Başvurunuz başarıyla alındı! Teşekkür ederiz.');
        } catch (error) {
            console.error("Kayıt hatası:", error);
            alert('Kayıt sırasında bir sorun oluştu, lütfen tekrar deneyin.');
        }
    };

    useScrollReveal();

    // Backend'den gelen is_active kolonuna göre kontrol (küçük harf dikkat)
    const hasActiveAnnouncement = announcements.some(a => a.is_active);

    return (
        <Router>
            <SnowEffect />
            <AuthProvider>
                <ToastProvider>
                    <Routes>
                        {/* --- PUBLIC ROUTES --- */}
                        <Route path="/" element={
                            <>
                                <AnnouncementBanner announcements={announcements} />
                                <PublicHeader hasAnnouncement={hasActiveAnnouncement} />
                                <main>
                                    <HeroSection />
                                    <AboutSection />
                                    <MissionVisionSection />
                                    <WhatWeDoSection />
                                    <ProjectsSection />
                                    <UpcomingEventsSection events={events} onRegister={setSelectedEvent} />
                                    <WhyArinatSection />
                                    <MembershipSection />
                                </main>
                                <PublicFooter />

                                {selectedEvent && (
                                    <RegistrationModal
                                        event={selectedEvent}
                                        onClose={() => setSelectedEvent(null)}
                                        onRegister={handleEventRegistration}
                                    />
                                )}
                            </>
                        } />

                        <Route path="/admin/login" element={<AdminLogin />} />

                        {/* --- PROTECTED ADMIN ROUTES --- */}
                        <Route path="/admin/dashboard" element={
                            <ProtectedRoute>
                                <AdminLayout
                                    title="Genel Bakış"
                                    notifications={notifications}
                                    markAsRead={markNotificationAsRead}
                                >
                                    <DashboardHome events={events} notifications={notifications} />
                                </AdminLayout>
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/events" element={
                            <ProtectedRoute>
                                <AdminLayout
                                    title="Etkinlik Yönetimi"
                                    notifications={notifications}
                                    markAsRead={markNotificationAsRead}
                                >
                                    {/* refreshData prop olarak eklendi, böylece ekleme/silme sonrası liste yenilenir */}
                                    <EventsManager events={events} refreshData={refreshData} />
                                </AdminLayout>
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/announcements" element={
                            <ProtectedRoute>
                                <AdminLayout
                                    title="Duyuru Yönetimi"
                                    notifications={notifications}
                                    markAsRead={markNotificationAsRead}
                                >
                                    {/* refreshData prop olarak eklendi */}
                                    <AnnouncementManager announcements={announcements} refreshData={refreshData} />
                                </AdminLayout>
                            </ProtectedRoute>
                        } />

                        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="*" element={<Navigate to="/" replace />} />

                    </Routes>
                </ToastProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;