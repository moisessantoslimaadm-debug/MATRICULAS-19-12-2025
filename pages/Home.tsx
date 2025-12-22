import React, { useState } from 'react';
import { useNavigate, Link } from '../router';
import { 
  GraduationCap, ShieldCheck, Sparkles, 
  Globe, ChevronRight, MapPin, Users, ArrowRight, Zap, Database
} from 'lucide-react';
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
      <section className="relative pt-20 pb-28 px-8 overflow-hidden bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 animate-in fade-in slide-in-from-left-12 duration-1000">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 shadow-sm">
              <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
              <span className="text-emerald-800 text-[9px] font-black uppercase tracking-[0.3em]">SME Digital • Rede Síncrona 2025</span>
            </div>
            
            <div className="space-y-4">
                <h1 className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-[0.85] text-display">
                  Gestão <br/>
                  <span className="text-emerald-600">Inteligente.</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-medium">
                  Plataforma oficial de rede nominal com geoprocessamento síncrono para o município de {MUNICIPALITY_NAME}. Eficiência e transparência na educação.
                </p>
            </div>
            
            <div className="flex flex-wrap gap-5">
              <button
                onClick={startRegistration}
                className="btn-primary !h-16 !px-12 !text-[12px] !bg-slate-900 hover:!bg-emerald-700 shadow-2xl shadow-slate-900/20 active:scale-95 transition-all group"
              >
                {isLoading ? <Zap className="h-6 w-6 animate-spin" /> : <>Iniciar Inscrição <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></>}
              </button>
              <Link to="/status" className="btn-secondary !h-16 !px-12 !text-[12px] shadow-sm active:scale-95">Consultar Protocolo</Link>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-12 pt-12 border-t border-slate-200">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-lg">
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Base de Dados</p>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">100% Auditada</p>
                  </div>
               </div>
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-lg">
                    <Database className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Tecnologia</p>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Dados Síncronos</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="relative hidden lg:block animate-in fade-in zoom-in-95 duration-1000">
            <div className="rounded-[4rem] overflow-hidden shadow-deep border-[12px] border-white bg-white relative ring-1 ring-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80" 
                className="w-full h-[550px] object-cover"
                alt="Educação Municipal"
              />
              <div className="absolute inset-0 bg-[#064e3b]/10 mix-blend-multiply"></div>
              
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 flex items-center gap-5 animate-luxury-float">
                <div className="bg-[#064e3b] p-4 rounded-2xl text-white shadow-xl shadow-emerald-900/20">
                    <Users className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-3xl font-black text-slate-900 leading-none tracking-tighter">40+</p>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-2">Unidades Ativas</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-30 -z-10"></div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Globe className="h-6 w-6" />, title: "Territorialidade", desc: "Alocação inteligente por endereço nominal, priorizando a proximidade residencial absoluta.", color: "bg-blue-50 text-blue-600" },
              { icon: <Sparkles className="h-6 w-6" />, title: "IA de Suporte", desc: "Assistente virtual de rede 24h para orientação técnica sobre processos de matrícula.", color: "bg-emerald-50 text-emerald-600" },
              { icon: <ShieldCheck className="h-6 w-6" />, title: "Transparência Síncrona", desc: "Todos os processos são 100% auditáveis com rastreabilidade nominal completa.", color: "bg-amber-50 text-amber-600" }
            ].map((f, i) => (
              <div key={i} className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all group">
                <div className={`mb-8 w-14 h-14 rounded-2xl flex items-center justify-center border border-white shadow-lg group-hover:scale-110 transition-transform ${f.color}`}>{f.icon}</div>
                <h4 className="text-base font-black text-slate-900 mb-3 uppercase tracking-tight">{f.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      </section>
    </div>
  );
};