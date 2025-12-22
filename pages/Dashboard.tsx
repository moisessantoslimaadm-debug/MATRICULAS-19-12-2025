
import React, { useMemo, useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate, Link } from '../router';
import { 
  Users, School, LayoutGrid, Map, 
  Building, FileText, ChevronRight, Activity, ArrowUpRight, 
  Sparkles, Bus, Database, HeartPulse, Search, Bell, Clock, ShieldCheck, Zap
} from 'lucide-react';
import { MUNICIPALITY_NAME } from '../constants';

const MetricCard = ({ title, value, icon: Icon, colorClass, trend }: any) => (
    <div className="card-requinte p-8 flex flex-col justify-between h-36 border-l-8" style={{ borderLeftColor: 'currentColor' }}>
        <div className="flex justify-between items-center text-slate-400">
            <div className={`p-3 rounded-2xl ${colorClass} text-white shadow-xl`}>
                <Icon className="h-5 w-5" />
            </div>
            {trend && (
              <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-600 uppercase">
                  {trend}
                </span>
              </div>
            )}
        </div>
        <div className="mt-4">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{title}</p>
            <h3 className="text-4xl font-black text-slate-900 leading-none tracking-tighter">{value}</h3>
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
    recent: students.slice(0, 6)
  }), [students, schools]);

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-8">
        <div className="relative">
            <div className="w-20 h-20 border-[8px] border-emerald-100 rounded-[2.5rem]"></div>
            <div className="absolute inset-0 w-20 h-20 border-[8px] border-emerald-600 border-t-transparent rounded-[2.5rem] animate-spin"></div>
        </div>
        <div className="text-center space-y-2">
            <span className="text-emerald-600 font-black text-[11px] uppercase tracking-[0.5em] block animate-pulse">Sincronizando Rede Nominal...</span>
            <span className="text-slate-400 text-[8px] font-bold uppercase tracking-widest">Base MEC Itaberaba 2025</span>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-16 px-8 page-transition">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 border-b border-slate-100 pb-12">
            <div className="space-y-3">
                <div className="flex items-center gap-5">
                    <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-xl"><LayoutGrid className="h-6 w-6" /></div>
                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight leading-none text-display">Gestão <br/><span className="text-emerald-600">Síncrona.</span></h1>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{MUNICIPALITY_NAME} • SME ITINERÁRIO</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Auditado</span>
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                <button className="p-4 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-emerald-600 transition shadow-luxury">
                  <Bell className="h-6 w-6" />
                </button>
                <div className="flex items-center gap-5 bg-white px-6 py-3 rounded-[2rem] border border-slate-100 shadow-luxury group hover:border-emerald-100 transition-all">
                    <div className="h-12 w-12 bg-[#064e3b] rounded-[1.2rem] flex items-center justify-center text-white text-[14px] font-black shadow-deep group-hover:scale-110 transition-transform">
                        {userData?.name?.charAt(0)}
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-[12px] font-black text-slate-900 block leading-none uppercase tracking-tight">{userData?.name}</span>
                      <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-[0.3em] mt-1.5 block">Gestor Municipal</span>
                    </div>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <MetricCard title="Censo Nominal" value={stats.total} icon={Users} colorClass="bg-slate-900" trend="+2.4%" />
            <MetricCard title="Dossiês AEE" value={stats.aee} icon={HeartPulse} colorClass="bg-pink-600" />
            <MetricCard title="Logística" value={stats.transport} icon={Bus} colorClass="bg-blue-600" />
            <MetricCard title="Unidades Ativas" value={stats.unidades} icon={School} colorClass="bg-emerald-600" />
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
                <div className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-luxury relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-12 relative z-10">
                      <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] flex items-center gap-4">
                          <Zap className="h-5 w-5 text-emerald-600" /> Módulos Estratégicos
                      </h3>
                      <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-3">
                        <Database className="h-4 w-4 text-emerald-600" />
                        <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Barramento Nominal Ativo</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 relative z-10">
                        {[
                            { icon: Map, title: "Geoprocessamento", desc: "Gestão territorial nominal e fluxos de alocação.", to: "/admin/map", color: "text-emerald-600 bg-emerald-50" },
                            { icon: Building, title: "Censo de Rede", desc: "Base nominal Inep 2025 auditada síncrona.", to: "/schools", color: "text-blue-600 bg-blue-50" },
                            { icon: FileText, title: "Inteligência BI", desc: "Dossiês analíticos de rede e ocupação global.", to: "/reports", color: "text-indigo-600 bg-indigo-50" },
                            { icon: Activity, title: "Monitoramento", desc: "Acompanhamento pedagógico e prontuários.", to: "/performance", color: "text-amber-600 bg-amber-50" }
                        ].map((mod, i) => (
                            <Link key={i} to={mod.to} className="flex items-center p-6 bg-slate-50/50 rounded-[2rem] hover:bg-white hover:shadow-deep border border-transparent hover:border-slate-100 transition-all group">
                                <div className={`p-4 rounded-2xl ${mod.color} mr-6 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                                    <mod.icon className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="font-black text-slate-800 text-[13px] uppercase tracking-tight block truncate mb-1.5">{mod.title}</span>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate leading-relaxed">{mod.desc}</p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all" />
                            </Link>
                        ))}
                    </div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[100px] opacity-40 -mr-32 -mb-32 group-hover:scale-125 transition-transform duration-[3s]"></div>
                </div>

                <div className="card-requinte !p-12">
                    <div className="flex justify-between items-center mb-12">
                        <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] flex items-center gap-4">
                            <Clock className="h-5 w-5 text-blue-600" /> Fluxos Recentes na Rede
                        </h3>
                        <button onClick={() => navigate('/admin/data')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline underline-offset-4">Relatório Nominal Completo</button>
                    </div>
                    <div className="space-y-6">
                        {stats.recent.map((s, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.8rem] border border-slate-100 group hover:bg-white hover:shadow-luxury transition-all duration-500">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-900 text-lg shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                        {s.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-black text-slate-900 uppercase tracking-tight leading-none mb-2">{s.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[200px]">{s.className || s.school}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className={`badge-status ${s.status === 'Matriculado' ? 'badge-emerald' : 'badge-amber'}`}>
                                        {s.status}
                                    </span>
                                    <button onClick={() => navigate(`/student/monitoring?id=${s.id}`)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-300 hover:text-emerald-600 hover:border-emerald-200 transition shadow-sm">
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="space-y-12">
                <div className="bg-[#064e3b] rounded-[3.5rem] p-12 text-white flex flex-col justify-between shadow-deep relative overflow-hidden group h-[480px]">
                    <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                        <div className="bg-emerald-500/20 p-5 rounded-[1.8rem] backdrop-blur-xl border border-white/10 shadow-2xl">
                        <Sparkles className="h-10 w-10 text-emerald-400" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-white/10 px-4 py-2 rounded-full border border-white/5">SME Gov AI</span>
                    </div>
                    <h4 className="text-3xl font-black uppercase tracking-tighter mb-5 leading-tight">Inteligência <br/>Preditiva.</h4>
                    <p className="text-emerald-100/60 text-sm leading-relaxed mb-12 font-medium">Assistente de rede sincronizado com a base do Educacenso para otimização de fluxo escolar nominal.</p>
                    </div>
                    <button className="bg-white text-[#064e3b] w-full py-5 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] hover:bg-emerald-50 transition-all relative z-10 shadow-deep active:scale-95">
                    Consultar Inteligência
                    </button>
                    <div className="absolute -bottom-20 -right-20 h-64 w-64 bg-emerald-500/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-[3s]"></div>
                </div>

                <div className="card-requinte !p-12 space-y-8">
                    <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] flex items-center gap-4 border-b border-slate-50 pb-6">
                        <Activity className="h-5 w-5 text-emerald-600" /> Saúde da Rede
                    </h3>
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between text-[10px] font-black uppercase mb-4 tracking-widest">
                                <span className="text-slate-400">Ocupação Global</span>
                                <span className="text-slate-900">82.4%</span>
                            </div>
                            <div className="h-3 bg-slate-50 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-emerald-500 w-[82.4%] shadow-[0_0_20px_rgba(16,185,129,0.3)]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[10px] font-black uppercase mb-4 tracking-widest">
                                <span className="text-slate-400">Sincronismo Inep</span>
                                <span className="text-emerald-600 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Ativo
                                </span>
                            </div>
                            <div className="h-3 bg-slate-50 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-blue-500 w-full animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-slate-50">
                          <div className="bg-slate-50 p-6 rounded-2xl flex items-center gap-5">
                            <ShieldCheck className="h-6 w-6 text-emerald-600" />
                            <div>
                              <p className="text-[10px] font-black text-slate-900 uppercase">Integridade Nominal</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Dados 100% Auditados</p>
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
