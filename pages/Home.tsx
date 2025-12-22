import React, { useState } from 'react';
import { useNavigate, Link } from '../router';
import { 
  GraduationCap, ShieldCheck, Sparkles, 
  Globe, ChevronRight, MapPin, Users, ArrowRight
} from 'lucide-react';
import { MUNICIPALITY_NAME } from '../constants';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const startRegistration = () => {
    setIsLoading(true);
    setTimeout(() => navigate('/registration'), 500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white page-transition">
      <section className="relative pt-12 pb-20 px-8 overflow-hidden bg-slate-50/30">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 shadow-sm">
              <Sparkles className="h-3 w-3 text-emerald-600" />
              <span className="text-emerald-800 text-[8px] font-bold uppercase tracking-widest">SME Digital • Rede Síncrona 2025</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-[0.95]">
              Gestão <br/>
              <span className="text-emerald-600">Inteligente.</span>
            </h1>
            
            <p className="text-base text-slate-500 max-w-md leading-relaxed font-medium">
              Plataforma oficial de rede nominal com geoprocessamento síncrono para o município de {MUNICIPALITY_NAME}.
            </p>
            
            <div className="flex flex-wrap gap-3 pt-4">
              <button
                onClick={startRegistration}
                className="btn-primary !h-12 !px-8 !text-[10px] !bg-slate-900 hover:!bg-emerald-700 shadow-deep"
              >
                {isLoading ? "Processando..." : <>Iniciar Inscrição <ChevronRight className="h-4 w-4" /></>}
              </button>
              <Link to="/status" className="btn-secondary !h-12 !px-8 !text-[10px] shadow-sm">Consultar Protocolo</Link>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-slate-200">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase leading-tight">
                    Base Auditada <br/> <span className="text-slate-900">100% Segura</span>
                  </p>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase leading-tight">
                    Território <br/> <span className="text-slate-900">Georeferenciado</span>
                  </p>
               </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="rounded-[2.5rem] overflow-hidden shadow-deep border-[8px] border-white bg-white relative">
              <img 
                src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80" 
                className="w-full h-[400px] object-cover"
                alt="Educação Municipal"
              />
              <div className="absolute inset-0 bg-[#064e3b]/5"></div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-luxury-float">
              <div className="bg-[#064e3b] p-2 rounded-lg text-white shadow-sm">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-black text-slate-900 leading-none tracking-tighter">40+</p>
                <p className="text-[7px] font-bold text-emerald-600 uppercase tracking-widest">Unidades Ativas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Globe className="h-5 w-5" />, title: "Territorialidade", desc: "Alocação inteligente por endereço nominal, priorizando a proximidade residencial." },
              { icon: <Sparkles className="h-5 w-5" />, title: "IA Assistiva", desc: "Suporte 24h via inteligência artificial para dúvidas e processos de matrícula." },
              { icon: <ShieldCheck className="h-5 w-5" />, title: "Transparência", desc: "Processos 100% auditáveis com acompanhamento de protocolo em tempo real." }
            ].map((f, i) => (
              <div key={i} className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                <div className="text-emerald-700 mb-6 bg-white w-10 h-10 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">{f.icon}</div>
                <h4 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-tight">{f.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};