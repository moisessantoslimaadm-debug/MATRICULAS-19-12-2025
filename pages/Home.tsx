import React, { useState } from 'react';
import { useNavigate, Link } from '../router';
import { 
  ArrowRight, GraduationCap, ShieldCheck, Sparkles, 
  Globe, Zap, Loader2, ChevronRight, MapPin, 
  ArrowUpRight, Building2, Users
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
      <section className="relative pt-24 pb-48 px-8 lg:px-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-2/5 h-full bg-slate-50/50 -skew-x-12 -z-10 translate-x-32 blur-3xl opacity-60"></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-50 rounded-full border border-blue-100 shadow-sm">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-blue-700 text-[10px] font-bold uppercase tracking-widest">SME 2025 • Gestão Digital</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter text-display leading-tight">
              Educação <br/>
              <span className="text-blue-600">Conectada.</span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
              A Secretaria de Educação de {MUNICIPALITY_NAME} integra geoprocessamento e inteligência de rede para uma gestão eficiente e transparente.
            </p>
            
            <div className="flex flex-wrap gap-5 pt-4">
              <button
                onClick={startRegistration}
                disabled={isLoading}
                className="btn-primary !px-12"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Iniciar Matrícula"}
                <ChevronRight className="h-5 w-5" />
              </button>
              <Link to="/status" className="btn-secondary !px-12">Consultar Protocolo</Link>
            </div>

            <div className="flex items-center gap-12 pt-10 border-t border-slate-100">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Auditoria <br/> <span className="text-slate-900">Base INEP</span>
                  </p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Rede <br/> <span className="text-slate-900">Georeferenciada</span>
                  </p>
               </div>
            </div>
          </div>

          <div className="relative hidden lg:block animate-in fade-in slide-in-from-right-12 duration-1000">
            <div className="rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-slate-50 bg-slate-100 relative group aspect-square max-w-md ml-auto">
              <img 
                src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80" 
                className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-105"
                alt="Educação"
              />
            </div>
            
            <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center gap-6 animate-luxury-float z-20">
              <div className="bg-emerald-500 p-4 rounded-2xl text-white shadow-lg">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-4xl font-black text-slate-900 leading-none tracking-tighter">100%</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Digital</p>
              </div>
            </div>

            <div className="absolute top-1/2 -right-12 w-28 h-28 bg-blue-600 rounded-3xl shadow-xl flex items-center justify-center text-white border-[6px] border-white z-20">
                <GraduationCap className="h-10 w-10" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <div className="text-center mb-20">
            <h2 className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.4em] mb-4">Padrão SME</h2>
            <p className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Infraestrutura Escolar</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: <Globe className="h-8 w-8" />, title: "Territorialidade", desc: "Otimização logística baseada na proximidade nominal via GPS." },
              { icon: <Sparkles className="h-8 w-8" />, title: "Inteligência IA", desc: "Suporte administrativo assistido por motor cognitivo de rede." },
              { icon: <ShieldCheck className="h-8 w-8" />, title: "Transparência", desc: "Monitoramento em tempo real de vagas e ocupação de rede." }
            ].map((f, i) => (
              <div key={i} className="bg-white p-12 rounded-[2.5rem] border border-slate-100 hover:shadow-lg transition-all duration-500 group text-center">
                <div className="text-blue-600 mb-8 mx-auto bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">{f.icon}</div>
                <h4 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-tight">{f.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-16 bg-white px-8 lg:px-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-6">
            <div className="bg-slate-900 p-3 rounded-2xl shadow-lg">
              <GraduationCap className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex flex-col">
                <span className="font-black text-2xl text-slate-900 tracking-tighter uppercase leading-none">SME <span className="text-blue-600">Digital</span></span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">v2.5 • {MUNICIPALITY_NAME}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Link to="/login" className="hover:text-blue-600 transition-colors">Acesso Restrito</Link>
            <Link to="/schools" className="hover:text-blue-600 transition-colors">Rede Escolar</Link>
            <Link to="/registration" className="hover:text-blue-600 transition-colors">Matrícula</Link>
            <span className="text-slate-200">© 2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
};