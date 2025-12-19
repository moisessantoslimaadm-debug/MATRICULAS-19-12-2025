import React, { useState } from 'react';
import { useNavigate, Link } from '../router';
import { ArrowRight, GraduationCap, ShieldCheck, Sparkles, Globe, Zap, Loader2, ChevronRight, MapPin } from 'lucide-react';
import { MUNICIPALITY_NAME } from '../constants';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const startRegistration = () => {
    setIsLoading(true);
    setTimeout(() => navigate('/registration'), 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white page-transition">
      {/* Hero Section - Institutional Luxury */}
      <section className="relative pt-32 pb-48 px-8 lg:px-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-2/5 h-full bg-slate-50/50 -skew-x-12 -z-10 translate-x-32 blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50/50 rounded-full -z-10 -translate-x-32 translate-y-32 blur-[100px] opacity-40"></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12 animate-in fade-in slide-in-from-left-12 duration-1000">
            <div className="inline-flex items-center gap-4 px-6 py-2 bg-blue-50 rounded-full border border-blue-100 shadow-sm group cursor-default">
              <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
              <span className="text-blue-700 text-[9px] font-black uppercase tracking-[0.3em]">Rede Municipal • Matrícula Digital 2025</span>
            </div>
            
            <h1 className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter text-display leading-none">
              Inovação <br/>
              <span className="text-blue-600">Educacional.</span>
            </h1>
            
            <p className="text-2xl text-slate-500 max-w-xl leading-relaxed font-medium tracking-tight">
              A Secretaria de Educação de {MUNICIPALITY_NAME} integra geoprocessamento nominal para garantir transparência e eficiência absoluta.
            </p>
            
            <div className="flex flex-wrap gap-6 pt-6">
              <button
                onClick={startRegistration}
                disabled={isLoading}
                className="btn-primary !h-20 !px-16 !text-[12px] shadow-blue-200"
              >
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Iniciar Matrícula"}
                <ChevronRight className="h-6 w-6" />
              </button>
              <Link to="/status" className="btn-secondary !h-20 !px-16 !text-[12px] hover:border-blue-200">Consultar Protocolo</Link>
            </div>

            <div className="flex items-center gap-12 pt-10 border-t border-slate-100">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                    Base de Dados <br/> <span className="text-slate-900">Auditável INEP</span>
                  </p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                    Geolocalização <br/> <span className="text-slate-900">Nominal Ativa</span>
                  </p>
               </div>
            </div>
          </div>

          <div className="relative hidden lg:block animate-in fade-in slide-in-from-right-16 duration-[1500ms]">
            <div className="rounded-[4rem] overflow-hidden shadow-luxury border-[16px] border-slate-50 bg-slate-100 relative group aspect-square">
              <img 
                src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80" 
                className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110"
                alt="Composição Educacional"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-transparent to-transparent opacity-60"></div>
            </div>
            
            <div className="absolute -bottom-12 -left-12 bg-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-100 flex items-center gap-8 animate-luxury-float">
              <div className="bg-emerald-500 p-5 rounded-[1.8rem] text-white shadow-2xl shadow-emerald-100">
                <Zap className="h-8 w-8" />
              </div>
              <div>
                <p className="text-5xl font-black text-slate-900 leading-none tracking-tighter">100%</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Digital & Síncrono</p>
              </div>
            </div>

            <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-600 rounded-[2.5rem] shadow-2xl flex items-center justify-center text-white border-8 border-white animate-bounce-slow">
                <GraduationCap className="h-12 w-12" />
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Values */}
      <section className="py-32 bg-slate-50/30 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <div className="text-center mb-24">
            <h2 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.6em] mb-6">Metodologia de Rede</h2>
            <p className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Pilares da Gestão Municipal.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: <Globe className="h-9 w-9" />, title: "Territorialidade", desc: "Alocação automatizada baseada na menor distância nominal entre residência e unidade escolar." },
              { icon: <Sparkles className="h-9 w-9" />, title: "Assistência IA", desc: "Consultoria técnica através do assistente 'Edu' para suporte total em fluxos administrativos." },
              { icon: <ShieldCheck className="h-9 w-9" />, title: "Transparência", desc: "Painel de indicadores aberto para acompanhamento do movimento de matrículas em tempo real." }
            ].map((f, i) => (
              <div key={i} className="bg-white p-12 rounded-[3rem] border border-slate-100 hover:shadow-luxury transition-all duration-700 group flex flex-col items-center text-center">
                <div className="text-blue-600 mb-10 bg-blue-50/50 w-20 h-20 rounded-[2rem] flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">{f.icon}</div>
                <h4 className="text-2xl font-black text-slate-900 mb-5 tracking-tighter uppercase">{f.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium px-4">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refined Footer */}
      <footer className="py-20 bg-white px-8 lg:px-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-6">
            <div className="bg-slate-900 p-4 rounded-[1.5rem] shadow-xl">
              <GraduationCap className="h-8 w-8 text-blue-400" />
            </div>
            <div className="flex flex-col">
                <span className="font-black text-3xl text-slate-900 tracking-tighter uppercase leading-none">SME <span className="text-blue-600">Digital</span></span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">v2.5 • {MUNICIPALITY_NAME}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Link to="/login" className="hover:text-blue-600 transition-colors">Acesso Servidor</Link>
            <Link to="/schools" className="hover:text-blue-600 transition-colors">Rede Escolar</Link>
            <Link to="/registration" className="hover:text-blue-600 transition-colors">Portal Matrícula</Link>
            <span className="text-slate-300">© 2025 Governança Municipal</span>
          </div>
        </div>
      </footer>
    </div>
  );
};