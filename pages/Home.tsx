import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from '../router';
import { useData } from '../contexts/DataContext';
import { 
  ShieldCheck, Sparkles, Globe, 
  Users, ArrowRight, Zap, Building2, 
  Map as MapIcon, BarChart3, Fingerprint
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { schools, students } = useData();
  
  // Estados para animação dos números
  const [schoolCount, setSchoolCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);

  // Efeito para animar contadores baseados nos dados reais
  useEffect(() => {
    const targetSchools = schools.length || 1; // Fallback visual inicial
    const targetStudents = students.length || 1;

    // Animação Escolas
    const timerSchools = setInterval(() => {
      setSchoolCount(prev => {
        if (prev >= targetSchools) {
          clearInterval(timerSchools);
          return targetSchools;
        }
        return prev + Math.ceil(targetSchools / 50);
      });
    }, 30);

    // Animação Alunos (incremento maior por ser número maior)
    const timerStudents = setInterval(() => {
        setStudentCount(prev => {
          if (prev >= targetStudents) {
            clearInterval(timerStudents);
            return targetStudents;
          }
          return prev + Math.ceil(targetStudents / 40);
        });
      }, 20);

    return () => {
        clearInterval(timerSchools);
        clearInterval(timerStudents);
    };
  }, [schools.length, students.length]);

  const startRegistration = () => {
    navigate('/registration');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfdfe] page-transition overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-40 px-6 md:px-8 overflow-hidden">
        {/* Background Decors */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-emerald-50/50 rounded-full blur-[80px] md:blur-[120px] -mr-20 md:-mr-96 -mt-20 md:-mt-96 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-50/30 rounded-full blur-[80px] md:blur-[100px] -ml-20 md:-ml-48 -mb-20 md:-mb-48 -z-10"></div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-left-12 duration-1000 text-center lg:text-left">
              <div className="inline-flex items-center gap-4 px-4 py-2 md:px-5 md:py-2.5 bg-white rounded-full border border-slate-100 shadow-luxury mx-auto lg:mx-0">
                <div className="bg-emerald-500 p-1.5 rounded-full animate-pulse">
                  <Zap className="h-3 w-3 md:h-3.5 md:w-3.5 text-white" />
                </div>
                <span className="text-slate-800 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Rede Nominal Síncrona 2025</span>
              </div>
              
              <div className="space-y-4 md:space-y-8">
                <h1 className="text-6xl md:text-8xl lg:text-[110px] font-black text-slate-900 tracking-tighter leading-[0.9] md:leading-[0.8] break-words drop-shadow-md">
                  <span className="font-sans uppercase">SME</span> <br/>
                  <span className="text-emerald-600 font-script font-bold tracking-normal">Digital.</span>
                </h1>
                <p className="text-base md:text-xl text-slate-500 max-w-xl leading-relaxed font-medium mx-auto lg:mx-0">
                  Bem-vindo à plataforma oficial da Secretaria Municipal de Educação. 
                  Inovação tecnológica para alocação inteligente e gestão nominal de rede.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-4 justify-center lg:justify-start">
                <button
                  onClick={startRegistration}
                  className="btn-primary !h-16 md:!h-20 !px-8 md:!px-16 !text-[11px] md:!text-[13px] !bg-slate-900 hover:!bg-emerald-600 shadow-deep active:scale-95 transition-all group w-full sm:w-auto"
                >
                  Iniciar Matrícula <ArrowRight className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-2 transition-transform" />
                </button>
                <Link to="/status" className="btn-secondary !h-16 md:!h-20 !px-8 md:!px-12 !text-[11px] md:!text-[13px] hover:border-emerald-200 transition-all active:scale-95 shadow-luxury w-full sm:w-auto">
                  Acompanhar Protocolo
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-10 pt-10 md:pt-16 border-t border-slate-100 text-left">
                 <div className="space-y-1 md:space-y-2 text-center lg:text-left">
                    <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">{schoolCount}</p>
                    <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Escolas Ativas</p>
                 </div>
                 <div className="space-y-1 md:space-y-2 border-l border-slate-100 pl-6 md:pl-10 text-center lg:text-left">
                    <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">{studentCount}</p>
                    <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Alunos na Rede</p>
                 </div>
                 <div className="space-y-1 md:space-y-2 border-l border-slate-100 pl-6 md:pl-10 hidden sm:block text-center lg:text-left">
                    <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">Sync</p>
                    <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Tempo Real</p>
                 </div>
              </div>
            </div>

            <div className="relative hidden lg:block animate-in fade-in zoom-in-95 duration-1000">
              <div className="relative z-10 rounded-[5rem] overflow-hidden shadow-deep border-[16px] border-white bg-white group ring-1 ring-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]"
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
      <section className="py-20 md:py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <h2 className="text-[10px] md:text-[12px] font-black text-emerald-600 uppercase tracking-[0.5em] mb-4 md:mb-6">Módulos Governamentais</h2>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Tecnologia Aplicada à <br/>Inteligência Pedagógica.</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: <MapIcon className="h-6 w-6 md:h-8 md:w-8" />, title: "Geo-Alocação", desc: "Sistema síncrono que aloca estudantes automaticamente na unidade mais próxima de sua residência nominal.", color: "bg-blue-50 text-blue-600", border: "hover:border-blue-200" },
              { icon: <ShieldCheck className="h-6 w-6 md:h-8 md:w-8" />, title: "Pasta Digital", desc: "Rastreabilidade completa de cada matrícula (Pasta do Aluno), garantindo integridade de dados perante o MEC e Inep.", color: "bg-emerald-50 text-emerald-600", border: "hover:border-emerald-200" },
              { icon: <BarChart3 className="h-6 w-6 md:h-8 md:w-8" />, title: "BI de Gestão", desc: "Indicadores em tempo real sobre ocupação de salas, carência de vagas e fluxos de transporte escolar.", color: "bg-indigo-50 text-indigo-600", border: "hover:border-indigo-200" }
            ].map((f, i) => (
              <div key={i} className={`bg-white p-8 md:p-14 rounded-[3rem] md:rounded-[4rem] border border-slate-100 hover:shadow-deep transition-all duration-700 group ${f.border}`}>
                <div className={`mb-6 md:mb-10 w-16 h-16 md:w-20 md:h-20 rounded-[1.8rem] md:rounded-[2.2rem] flex items-center justify-center border border-white shadow-xl transition-transform group-hover:rotate-12 duration-500 ${f.color}`}>{f.icon}</div>
                <h4 className="text-xl md:text-2xl font-black text-slate-900 mb-3 md:mb-5 uppercase tracking-tight">{f.title}</h4>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium mb-6 md:mb-10">{f.desc}</p>
                <div className="h-1 w-12 bg-slate-100 group-hover:w-full transition-all duration-700 group-hover:bg-emerald-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gov CTA Section */}
      <section className="py-16 md:py-24 px-6 md:px-8 mb-12 md:mb-24">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0f172a] rounded-[3rem] md:rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden group shadow-deep">
            <div className="relative z-10 grid lg:grid-cols-2 items-center gap-10 md:gap-16">
              <div className="space-y-6 md:space-y-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center backdrop-blur-xl border border-white/10">
                  <Building2 className="h-8 w-8 md:h-10 md:w-10 text-emerald-400" />
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">Unidade de <br/><span className="text-emerald-400">Resposta SME.</span></h2>
                <p className="text-slate-400 text-sm md:text-lg font-medium leading-relaxed max-w-md">Equipe técnica disponível para auditoria e suporte nominal ao cidadão durante todo o ciclo de matrículas 2025.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="px-8 md:px-10 py-4 md:py-5 bg-emerald-500 text-white rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-900/20 w-full sm:w-auto">Solicitar Suporte</button>
                  <button className="px-8 md:px-10 py-4 md:py-5 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all w-full sm:w-auto">Ver Editais</button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {[
                  { label: "Sincronismo", val: "100%", icon: <Zap className="h-4 w-4 md:h-5 md:w-5" /> },
                  { label: "Transparência", val: "Nível A", icon: <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" /> },
                  { label: "Territórios", val: "42 Áreas", icon: <Globe className="h-4 w-4 md:h-5 md:w-5" /> },
                  { label: "IA Ativa", val: "24h/7", icon: <Sparkles className="h-4 w-4 md:h-5 md:w-5" /> }
                ].map((item, i) => (
                  <div key={i} className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] hover:bg-white/10 transition-colors">
                    <div className="text-emerald-400 mb-3 md:mb-4">{item.icon}</div>
                    <p className="text-2xl md:text-3xl font-black tracking-tighter">{item.val}</p>
                    <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Abstract glow */}
            <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-500/10 rounded-full blur-[80px] md:blur-[100px] -mr-32 md:-mr-64 -mt-32 md:-mt-64 group-hover:scale-150 transition-transform duration-[3s]"></div>
          </div>
        </div>
      </section>

      {/* Footer minimal gov */}
      <footer className="py-12 border-t border-slate-100 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
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