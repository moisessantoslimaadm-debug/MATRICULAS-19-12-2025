import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from '../router';
import { 
  ShieldCheck, Sparkles, Globe, ChevronRight, 
  Users, ArrowRight, Zap, Database, Building2, 
  Map as MapIcon, BarChart3, Fingerprint
} from 'lucide-react';
import { MUNICIPALITY_NAME } from '../constants';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  // Estado de carregamento removido para navegação instantânea
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => (prev < 42 ? prev + 1 : 42));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const startRegistration = () => {
    // Navegação imediata sem delay artificial
    navigate('/registration');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfdfe] page-transition">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-8 overflow-hidden">
        {/* Background Decors */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-50/50 rounded-full blur-[120px] -mr-96 -mt-96 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/30 rounded-full blur-[100px] -ml-48 -mb-48 -z-10"></div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12 animate-in fade-in slide-in-from-left-12 duration-1000">
              <div className="inline-flex items-center gap-4 px-5 py-2.5 bg-white rounded-full border border-slate-100 shadow-luxury">
                <div className="bg-emerald-500 p-1.5 rounded-full animate-pulse">
                  <Zap className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-slate-800 text-[10px] font-black uppercase tracking-[0.3em]">Rede Nominal Síncrona 2025</span>
              </div>
              
              <div className="space-y-8">
                <h1 className="text-8xl md:text-[100px] font-black text-slate-900 tracking-tighter uppercase leading-[0.8] text-display">
                  Itaberaba <br/>
                  <span className="text-emerald-600">Digital.</span>
                </h1>
                <p className="text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
                  Bem-vindo à plataforma oficial da Secretaria Municipal de Educação. 
                  Inovação tecnológica para alocação inteligente e gestão nominal de rede.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-6 pt-4">
                <button
                  onClick={startRegistration}
                  className="btn-primary !h-20 !px-16 !text-[13px] !bg-slate-900 hover:!bg-emerald-600 shadow-deep active:scale-95 transition-all group"
                >
                  Iniciar Matrícula <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </button>
                <Link to="/status" className="btn-secondary !h-20 !px-12 !text-[13px] hover:border-emerald-200 transition-all active:scale-95 shadow-luxury">
                  Acompanhar Protocolo
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 pt-16 border-t border-slate-100">
                 <div className="space-y-2">
                    <p className="text-4xl font-black text-slate-900 tracking-tighter">{count}+</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Escolas Ativas</p>
                 </div>
                 <div className="space-y-2 border-l border-slate-100 pl-10">
                    <p className="text-4xl font-black text-slate-900 tracking-tighter">100%</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Auditado MEC</p>
                 </div>
                 <div className="space-y-2 border-l border-slate-100 pl-10 hidden sm:block">
                    <p className="text-4xl font-black text-slate-900 tracking-tighter">Sync</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tempo Real</p>
                 </div>
              </div>
            </div>

            <div className="relative hidden lg:block animate-in fade-in zoom-in-95 duration-1000">
              <div className="relative z-10 rounded-[5rem] overflow-hidden shadow-deep border-[16px] border-white bg-white group ring-1 ring-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80" 
                  className="w-full h-[650px] object-cover group-hover:scale-110 transition-transform duration-[3s]"
                  alt="Educação Municipal Itaberaba"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>
                
                {/* Float Card 1 */}
                <div className="absolute top-10 -right-10 bg-white p-8 rounded-[3rem] shadow-deep border border-slate-100 flex items-center gap-6 animate-luxury-float">
                  <div className="bg-emerald-500 p-4 rounded-2xl text-white shadow-xl">
                      <Fingerprint className="h-7 w-7" />
                  </div>
                  <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Validação</p>
                      <p className="text-lg font-black text-slate-900 tracking-tight leading-none mt-1">Biometria Inep</p>
                  </div>
                </div>

                {/* Float Card 2 */}
                <div className="absolute bottom-10 -left-10 bg-slate-900 p-10 rounded-[3rem] shadow-deep text-white flex items-center gap-8 animate-luxury-float" style={{ animationDelay: '1.5s' }}>
                  <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/20 flex items-center justify-center border border-white/10">
                      <Users className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div>
                      <p className="text-4xl font-black tracking-tighter">18k</p>
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mt-1">Estudantes Nominais</p>
                  </div>
                </div>
              </div>
              
              {/* Abstract decorative elements */}
              <div className="absolute -top-16 -left-16 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-100/30 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-[12px] font-black text-emerald-600 uppercase tracking-[0.5em] mb-6">Módulos Governamentais</h2>
            <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Tecnologia Aplicada à <br/>Inteligência Pedagógica.</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: <MapIcon className="h-8 w-8" />, title: "Geo-Alocação", desc: "Sistema síncrono que aloca estudantes automaticamente na unidade mais próxima de sua residência nominal.", color: "bg-blue-50 text-blue-600", border: "hover:border-blue-200" },
              { icon: <ShieldCheck className="h-8 w-8" />, title: "Pasta Digital", desc: "Rastreabilidade completa de cada matrícula (Pasta do Aluno), garantindo integridade de dados perante o MEC e Inep.", color: "bg-emerald-50 text-emerald-600", border: "hover:border-emerald-200" },
              { icon: <BarChart3 className="h-8 w-8" />, title: "BI de Gestão", desc: "Indicadores em tempo real sobre ocupação de salas, carência de vagas e fluxos de transporte escolar.", color: "bg-indigo-50 text-indigo-600", border: "hover:border-indigo-200" }
            ].map((f, i) => (
              <div key={i} className={`bg-white p-14 rounded-[4rem] border border-slate-100 hover:shadow-deep transition-all duration-700 group ${f.border}`}>
                <div className={`mb-10 w-20 h-20 rounded-[2.2rem] flex items-center justify-center border border-white shadow-xl transition-transform group-hover:rotate-12 duration-500 ${f.color}`}>{f.icon}</div>
                <h4 className="text-2xl font-black text-slate-900 mb-5 uppercase tracking-tight">{f.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium mb-10">{f.desc}</p>
                <div className="h-1 w-12 bg-slate-100 group-hover:w-full transition-all duration-700 group-hover:bg-emerald-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gov CTA Section */}
      <section className="py-24 px-8 mb-24">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0f172a] rounded-[4rem] p-20 text-white relative overflow-hidden group shadow-deep">
            <div className="relative z-10 grid lg:grid-cols-2 items-center gap-16">
              <div className="space-y-8">
                <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center backdrop-blur-xl border border-white/10">
                  <Building2 className="h-10 w-10 text-emerald-400" />
                </div>
                <h2 className="text-6xl font-black tracking-tighter uppercase leading-none">Unidade de <br/><span className="text-emerald-400">Resposta SME.</span></h2>
                <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">Equipe técnica disponível para auditoria e suporte nominal ao cidadão durante todo o ciclo de matrículas 2025.</p>
                <div className="flex gap-4">
                  <button className="px-10 py-5 bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-900/20">Solicitar Suporte</button>
                  <button className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Ver Editais</button>
                </div>
              </div>
              
              <div className="hidden lg:grid grid-cols-2 gap-6">
                {[
                  { label: "Sincronismo", val: "100%", icon: <Zap className="h-5 w-5" /> },
                  { label: "Transparência", val: "Nível A", icon: <ShieldCheck className="h-5 w-5" /> },
                  { label: "Territórios", val: "42 Áreas", icon: <Globe className="h-5 w-5" /> },
                  { label: "IA Ativa", val: "24h/7", icon: <Sparkles className="h-5 w-5" /> }
                ].map((item, i) => (
                  <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-colors">
                    <div className="text-emerald-400 mb-4">{item.icon}</div>
                    <p className="text-3xl font-black tracking-tighter">{item.val}</p>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Abstract glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -mr-64 -mt-64 group-hover:scale-150 transition-transform duration-[3s]"></div>
          </div>
        </div>
      </section>

      {/* Footer minimal gov */}
      <footer className="py-12 border-t border-slate-100 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 p-2 rounded-lg text-white"><ShieldCheck className="h-4 w-4" /></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portal da Transparência SME Itaberaba</span>
          </div>
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-ultra">© 2025 Governo de Itaberaba • Secretaria Municipal de Educação</p>
          <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Termos</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">LGPD</a>
          </div>
        </div>
      </footer>
    </div>
  );
};