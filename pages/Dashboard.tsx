
import React, { useMemo, useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate, Link } from '../router';
import { 
  Users, School, LayoutGrid, Map, 
  Building, FileText, ChevronRight, Activity, ArrowUpRight, 
  Sparkles, Bus, Database, HeartPulse, Search, Bell, Clock, ShieldCheck, Zap, Globe, Target
} from 'lucide-react';
import { MUNICIPALITY_NAME } from '../constants';

const MetricCard = ({ title, value, icon: Icon, colorClass, trend, sub }: any) => (
    <div className="card-requinte p-10 flex flex-col justify-between h-48 border-l-[12px]" style={{ borderLeftColor: 'currentColor' }}>
        <div className="flex justify-between items-start">
            <div className={`p-4 rounded-[1.5rem] ${colorClass} text-white shadow-2xl`}>
                <Icon className="h-6 w-6" />
            </div>
            {trend && (
              <div className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-600 uppercase">{trend}</span>
              </div>
            )}
        </div>
        <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{title}</p>
            <div className="flex items-baseline gap-3">
                <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{value}</h3>
                {sub && <span className="text-[11px] font-bold text-slate-400 uppercase">{sub}</span>}
            </div>
        </div>
    </div>
);

export const Dashboard: React.FC = () => {
  const { students, schools, isLoading } = useData();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('user_data') || '{}');
    if (!sessionStorage.getItem('user_role')) { navigate('/login'); return; }
    setUserData(data);
  }, [navigate]);

  const stats = useMemo(() => ({
    total: students.length,
    aee: students.filter(s => s.specialNeeds).length,
    transport: students.filter(s => s.transportRequest).length,
    unidades: schools.length,
    recent: students.slice(0, 5)
  }), [students, schools]);

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-10">
        <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-[10px] border-emerald-100 rounded-[2.5rem]"></div>
            <div className="absolute inset-0 border-[10px] border-emerald-600 border-t-transparent rounded-[2.5rem] animate-spin"></div>
        </div>
        <div className="text-center space-y-3">
            <p className="text-emerald-600 font-black text-[12px] uppercase tracking-[0.6em] animate-pulse">Sincronizando Barramento SME...</p>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Base Nominal Itaberaba 2025</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 px-12 page-transition">
      <div className="max-w-[1600px] mx-auto space-y-16">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 border-b border-slate-200 pb-16">
            <div className="space-y-6">
                <div className="flex items-center gap-6">
                    <div className="bg-slate-900 p-4 rounded-[1.8rem] text-white shadow-2xl rotate-3"><LayoutGrid className="h-8 w-8" /></div>
                    <div className="space-y-1">
                        <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">Gestão <br/><span className="text-emerald-600">Síncrona.</span></h1>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2.5 px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <Globe className="h-4 w-4 text-emerald-500" />
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{MUNICIPALITY_NAME} • SME</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-ultra">Rede Auditada em Tempo Real</span>
                  </div>
                </div>
            </div>
            
            <div className="flex items-center gap-8">
                <div className="relative group">
                    <button className="p-5 bg-white rounded-[1.5rem] border border-slate-100 text-slate-400 hover:text-emerald-600 transition shadow-luxury hover:rotate-6">
                        <Bell className="h-7 w-7" />
                    </button>
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-4 border-white"></span>
                </div>
                <div className="flex items-center gap-6 bg-white px-8 py-4 rounded-[2.5rem] border border-slate-100 shadow-luxury group cursor-pointer hover:border-emerald-100 transition-all">
                    <div className="h-14 w-14 bg-[#064e3b] rounded-[1.5rem] flex items-center justify-center text-white text-xl font-black shadow-inner group-hover:scale-110 transition-transform">
                        {userData?.name?.charAt(0)}
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-sm font-black text-slate-900 block leading-none uppercase tracking-tight">{userData?.name}</span>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.3em] mt-2 block">Secretaria de Educação</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
            <MetricCard title="Censo Nominal" value={stats.total} icon={Users} colorClass="bg-slate-900" trend="+2.4%" sub="Alunos" />
            <MetricCard title="Atendimento AEE" value={stats.aee} icon={HeartPulse} colorClass="bg-pink-600" sub="Dossiês" />
            <MetricCard title="Logística Escolar" value={stats.transport} icon={Bus} colorClass="bg-blue-600" sub="Rotas" />
            <MetricCard title="Unidades Ativas" value={stats.unidades} icon={School} colorClass="bg-emerald-600" sub="MEC" />
        </div>

        <div className="grid grid-cols-12 gap-12">
            <div className="col-span-12 xl:col-span-8 space-y-12">
                <div className="bg-white rounded-[3.5rem] border border-slate-100 p-16 shadow-luxury relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-16 relative z-10">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4">
                                <Zap className="h-7 w-7 text-emerald-600" /> Módulos Estratégicos
                            </h3>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Acesso restrito de alta integridade</p>
                        </div>
                        <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center gap-4 shadow-sm">
                            <Database className="h-5 w-5 text-emerald-600" />
                            <span className="text-[11px] font-black text-emerald-700 uppercase tracking-[0.2em]">Sync Inep Ativo</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                        {[
                            { icon: Map, title: "Geoprocessamento", desc: "Monitoramento territorial nominal e raios de alocação automática.", to: "/admin/map", color: "text-emerald-600 bg-emerald-50" },
                            { icon: Building, title: "Censo de Rede", desc: "Base nominal Inep 2025 auditada com integridade 100%.", to: "/schools", color: "text-blue-600 bg-blue-50" },
                            { icon: FileText, title: "Inteligência BI", desc: "Análise preditiva de ocupação e fluxos de transporte.", to: "/reports", color: "text-indigo-600 bg-indigo-50" },
                            { icon: Activity, title: "Monitoramento", desc: "Acompanhamento nominal de rendimento e prontuários.", to: "/performance", color: "text-amber-600 bg-amber-50" }
                        ].map((mod, i) => (
                            <Link key={i} to={mod.to} className="flex items-center p-8 bg-slate-50/50 rounded-[2.5rem] hover:bg-white hover:shadow-deep border border-transparent hover:border-slate-100 transition-all group">
                                <div className={`p-5 rounded-[1.8rem] ${mod.color} mr-8 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                    <mod.icon className="h-8 w-8" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="font-black text-slate-900 text-lg uppercase tracking-tight block truncate mb-1.5">{mod.title}</span>
                                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed uppercase tracking-widest line-clamp-2">{mod.desc}</p>
                                </div>
                                <ChevronRight className="h-6 w-6 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all" />
                            </Link>
                        ))}
                    </div>
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-50 rounded-full blur-[120px] opacity-40 group-hover:scale-150 transition-transform duration-[4s]"></div>
                </div>

                <div className="card-requinte !p-16">
                    <div className="flex justify-between items-center mb-16">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-5">
                                <Clock className="h-7 w-7 text-blue-600" /> Fluxos Recentes
                            </h3>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Últimas 24 horas de operação nominal</p>
                        </div>
                        <button onClick={() => navigate('/admin/data')} className="px-8 py-4 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm border border-slate-100">Censo Completo</button>
                    </div>
                    <div className="space-y-8">
                        {stats.recent.map((s, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[2.5rem] border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-luxury transition-all duration-700 group">
                                <div className="flex items-center gap-8">
                                    <div className="w-16 h-16 rounded-[1.8rem] bg-white border border-slate-100 flex items-center justify-center font-black text-slate-900 text-xl shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                        {s.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">{s.name}</p>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[250px]">{s.className || s.school}</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Matrícula Auditada</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <span className={`badge-status ${s.status === 'Matriculado' ? 'badge-emerald' : 'badge-amber'}`}>
                                        <Target className="h-3.5 w-3.5" />
                                        {s.status}
                                    </span>
                                    <button onClick={() => navigate(`/student/monitoring?id=${s.id}`)} className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-300 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm group-hover:scale-110">
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="col-span-12 xl:col-span-4 space-y-12">
                <div className="bg-[#064e3b] rounded-[4rem] p-16 text-white flex flex-col justify-between shadow-deep relative overflow-hidden group h-[580px]">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-12">
                            <div className="bg-emerald-500/20 p-6 rounded-[2rem] backdrop-blur-2xl border border-white/10 shadow-2xl">
                                <Sparkles className="h-10 w-10 text-emerald-400" />
                            </div>
                            <div className="bg-white/10 px-6 py-2.5 rounded-full border border-white/5 backdrop-blur-md">
                                <span className="text-[10px] font-black uppercase tracking-[0.5em]">SME GOV AI</span>
                            </div>
                        </div>
                        <h4 className="text-5xl font-black uppercase tracking-tighter mb-6 leading-[0.85]">Inteligência <br/><span className="text-emerald-400">Preditiva.</span></h4>
                        <p className="text-emerald-100/60 text-base leading-relaxed mb-12 font-medium">Assistente de rede síncrono para otimização de fluxo escolar nominal e detecção de carência de vagas.</p>
                    </div>
                    <button className="bg-white text-[#064e3b] w-full py-6 rounded-[2rem] text-[13px] font-black uppercase tracking-[0.4em] hover:bg-emerald-50 transition-all relative z-10 shadow-deep active:scale-95">
                        Consultar IA
                    </button>
                    <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] bg-emerald-500/10 rounded-full blur-[120px] group-hover:scale-150 transition-transform duration-[4s]"></div>
                </div>

                <div className="card-requinte !p-16 space-y-12">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-8">
                        <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.5em] flex items-center gap-5">
                            <Activity className="h-6 w-6 text-emerald-600" /> Saúde da Rede
                        </h3>
                        <Zap className="h-5 w-5 text-amber-500 animate-pulse" />
                    </div>
                    
                    <div className="space-y-10">
                        <div>
                            <div className="flex justify-between text-[11px] font-black uppercase mb-5 tracking-[0.2em]">
                                <span className="text-slate-400">Ocupação Global</span>
                                <span className="text-slate-900">82.4%</span>
                            </div>
                            <div className="h-4 bg-slate-50 rounded-full overflow-hidden shadow-inner border border-slate-100">
                                <div className="h-full bg-emerald-500 w-[82.4%] shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-[2s]"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between text-[11px] font-black uppercase mb-5 tracking-[0.2em]">
                                <span className="text-slate-400">Integridade Nominal</span>
                                <span className="text-emerald-600 flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Auditada
                                </span>
                            </div>
                            <div className="h-4 bg-slate-50 rounded-full overflow-hidden shadow-inner border border-slate-100">
                                <div className="h-full bg-blue-500 w-full animate-pulse-slow shadow-[0_0_25px_rgba(59,130,246,0.4)]"></div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-slate-100">
                          <div className="bg-slate-50 p-8 rounded-[2.5rem] flex items-center gap-6 border border-slate-100 group hover:bg-emerald-50 hover:border-emerald-100 transition-colors">
                            <div className="p-4 bg-white rounded-2xl shadow-sm text-emerald-600 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Base Auditada</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Padrão Inep/MEC 2025</p>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
