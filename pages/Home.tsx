import React, { useState } from 'react';
import { useNavigate, Link } from '../router';
import { ArrowRight, GraduationCap, ShieldCheck, Sparkles, Globe, Zap, Loader2 } from 'lucide-react';
import { MUNICIPALITY_NAME } from '../constants';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const startRegistration = () => {
    setIsLoading(true);
    setTimeout(() => navigate('/registration'), 600);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white page-transition">
      {/* Hero Section - Executive Minimalism */}
      <section className="relative pt-24 pb-32 px-6 lg:px-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/20 -skew-x-12 -z-10 translate-x-24"></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100 shadow-sm">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-blue-700 text-[9px] font-bold uppercase tracking-widest">Matrícula Nominal 2025</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight text-display leading-[1.1]">
              Gestão Escolar <br/>
              <span className="text-blue-600">Inteligente.</span>
            </h1>
            
            <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-medium">
              A rede municipal de {MUNICIPALITY_NAME} agora opera com geoprocessamento em tempo real para alocação eficiente de vagas.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={startRegistration}
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Iniciar Matrícula"}
                <ArrowRight className="h-5 w-5" />
              </button>
              <Link to="/status" className="btn-secondary">Consultar Protocolo</Link>
            </div>

            <div className="flex items-center gap-8 pt-6 border-t border-slate-100">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Base de dados auditável INEP
               </p>
            </div>
          </div>

          <div className="relative hidden lg:block animate-in fade-in slide-in-from-right-12 duration-1000">
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-[10px] border-slate-50 bg-slate-100 relative group">
              <img 
                src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80" 
                className="w-full aspect-square object-cover transition-transform duration-[2s] group-hover:scale-105"
                alt="Educação Digital"
              />
              <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply opacity-20"></div>
            </div>
            
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-[2rem] shadow-luxury border border-slate-100 flex items-center gap-5 animate-float-soft">
              <div className="bg-emerald-500 p-3.5 rounded-2xl text-white shadow-lg shadow-emerald-100">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 leading-none">98%</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Acurácia Territorial</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Compact Cards */}
      <section className="py-24 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: <Globe className="h-7 w-7" />, title: "Geoprocesso", desc: "Alocação automática baseada na residência nominal do aluno." },
              { icon: <Sparkles className="h-7 w-7" />, title: "Assistente IA", desc: "Suporte cognitivo 'Edu' para esclarecimento de fluxos e documentação." },
              { icon: <Zap className="h-7 w-7" />, title: "Tempo Real", desc: "Painel executivo com indicadores dinâmicos de rede municipal." }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:shadow-luxury transition-all group">
                <div className="text-blue-600 mb-6 bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">{f.icon}</div>
                <h4 className="text-xl font-bold text-slate-900 mb-3 tracking-tight uppercase">{f.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Footer */}
      <footer className="py-12 bg-white px-6 lg:px-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2.5 rounded-xl">
              <GraduationCap className="h-5 w-5 text-blue-400" />
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight uppercase text-base">SME <span className="text-blue-600">Digital</span></span>
          </div>
          
          <div className="flex gap-8 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            <Link to="/login" className="hover:text-blue-600 transition-colors">Acesso Restrito</Link>
            <Link to="/schools" className="hover:text-blue-600 transition-colors">Unidades</Link>
            <span className="text-slate-300">© 2025 • Itaberaba</span>
          </div>
        </div>
      </footer>
    </div>
  );
};