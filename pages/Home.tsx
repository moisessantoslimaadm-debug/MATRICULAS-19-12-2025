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
      <section className="relative pt-20 pb-32 px-6 lg:px-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/30 -skew-x-12 -z-10 translate-x-16 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-blue-700 text-[10px] font-bold uppercase tracking-wider">Gestão Digital 2025</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight text-display">
              Educação Municipal <br/>
              <span className="text-blue-600">Conectada.</span>
            </h1>
            
            <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-medium">
              A Secretaria de Educação de {MUNICIPALITY_NAME} integra geoprocessamento e inteligência nominal para uma gestão eficiente.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={startRegistration}
                disabled={isLoading}
                className="btn-primary !px-10"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Iniciar Matrícula"}
                <ChevronRight className="h-4 w-4" />
              </button>
              <Link to="/status" className="btn-secondary !px-10">Consultar Protocolo</Link>
            </div>

            <div className="flex items-center gap-10 pt-8 border-t border-slate-100">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                    Auditoria <br/> <span className="text-slate-900">Base INEP</span>
                  </p>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                    Rede <br/> <span className="text-slate-900">Georeferenciada</span>
                  </p>
               </div>
            </div>
          </div>

          <div className="relative hidden lg:block animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="rounded-3xl overflow-hidden shadow-xl border-8 border-slate-50 bg-slate-100 relative group aspect-square max-w-md ml-auto">
              <img 
                src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Educação"
              />
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4 animate-in zoom-in-90 duration-500 delay-300">
              <div className="bg-emerald-500 p-3 rounded-xl text-white">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 leading-none">100%</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Digital</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em] mb-3">Padrão SME</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">Infraestrutura Escolar</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Globe className="h-6 w-6" />, title: "Territorialidade", desc: "Otimização logística baseada na proximidade via geoprocessamento." },
              { icon: <Sparkles className="h-6 w-6" />, title: "Inteligência IA", desc: "Suporte administrativo assistido por motor cognitivo de rede." },
              { icon: <ShieldCheck className="h-6 w-6" />, title: "Transparência", desc: "Monitoramento em tempo real de vagas e ocupação de rede municipal." }
            ].map((f, i) => (
              <div key={i} className="bg-white p-10 rounded-2xl border border-slate-100 hover:shadow-md transition-all duration-300 group">
                <div className="text-blue-600 mb-6 bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">{f.icon}</div>
                <h4 className="text-lg font-bold text-slate-900 mb-3 uppercase tracking-tight">{f.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};