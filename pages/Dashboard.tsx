
import React, { useMemo, useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate, Link } from '../router';
import { 
  Users, School, LayoutGrid, Map, 
  Building, FileText, ChevronRight, Activity, ArrowUpRight, 
  Sparkles, Bus, Database, HeartPulse, Search, Bell, Clock, ShieldCheck
} from 'lucide-react';
import { MUNICIPALITY_NAME } from '../constants';

const MetricCard = ({ title, value, icon: Icon, colorClass, trend }: any) => (
    <div className="card-requinte p-5 flex flex-col justify-between h-28 border-l-4" style={{ borderColor: 'transparent', borderLeftColor: 'currentColor' }}>
        <div className="flex justify-between items-center text-slate-400">
            <div className={`p-2 rounded-xl ${colorClass} text-white shadow-lg`}>
                <Icon className="h-4 w-4" />
            </div>
            {trend && (
              <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <ArrowUpRight className="h-2.5 w-2.5 text-emerald-600" />
                <span className="text-[9px] font-black text-emerald-600 uppercase">
                  {trend}
                </span>
              </div>
            )}
        </div>
        <div className="mt-3">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
            <h3 className="text-2xl font-black text-slate-900 leading-none tracking-tighter">{value}</h3>
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
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-6">
        <div className="w-16 h-16 border-[6px] border-emerald-100 border-t-emerald-600 rounded-3xl animate-spin"></div>
        <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.5em] animate-pulse">Sincronizando Rede Nominal...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-8 page-transition">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8">
            <div className="space-y-1">
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Painel de <span className="text-emerald-600">Gestão Síncrona</span></h1>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{MUNICIPALITY_NAME} • SME Digital 2025</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">Base MEC Auditada</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-emerald-600 transition shadow-sm">
                  <Bell className="h-4.5 w-4.5" />
                </button>
                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="h-10 w-10 bg-[#064e3b] rounded-xl flex items-center justify-center text-white text-[12px] font-black shadow-inner">
                        {userData?.name?.charAt(0)}
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-[11px] font-black text-slate-900 block leading-none uppercase tracking-tight">{userData?.name}</span>
                      <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1 block">Gestor Municipal</span>
                    </div>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <MetricCard title="Censo Escolar" value={stats.total} icon={Users} colorClass="bg-[#064e3b]" trend="+2.4%" />
            <MetricCard title="AEE Especial" value={stats.aee} icon={HeartPulse} colorClass="bg-pink-600" />
            <MetricCard title="Transp. Escolar" value={stats.transport} icon={Bus} colorClass="bg-blue-600" />
            <MetricCard title="Unidades Ativas" value={stats.unidades} icon={School} colorClass="bg-emerald-600" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8 relative z-10">
                      <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                          <LayoutGrid className="h-4 w-4 text-emerald-600" /> Módulos Estratégicos
                      </h3>
                      <div className="bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 flex items-center gap-2">
                        <Database className="h-3 w-3 text-emerald-600" />
                        <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest">Sincronismo MEC Ativo</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 relative z-10">
                        {[
                            { icon: Map, title: "Geoprocessamento", desc: "Gestão territorial nominal.", to: "/admin/map", color: "text-emerald-600 bg-emerald-50" },
                            { icon: Building, title: "Censo de Rede", desc: "Base nominal Inep 2025.", to: "/schools", color: "text-blue-600 bg-blue-50" },
                            { icon: FileText, title: "BI de Rede", desc: "Indicadores e ocupação.", to: "/reports", color: "text-indigo-600 bg-indigo-50" },
                            { icon: Activity, title: "Monitoramento", desc: "Prontuário técnico aluno.", to: "/performance", color: "text-amber-600 bg-amber-50" }
                        ].map((mod, i) => (
                            <Link key={i} to={mod.to} className="flex items-center p-4 bg-slate-50/50 rounded-2xl hover:bg-emerald-50/40 border border-slate-100 transition-all group">
                                <div className={`p-3 rounded-xl ${mod.color} mr-5 shadow-sm group-hover:scale-110 transition-transform`}>
                                    <mod.icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="font-black text-slate-800 text-[11px] uppercase tracking-tight block truncate mb-1">{mod.title}</span>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">{mod.desc}</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="card-requinte !p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                            <Clock className="h-4 w-4 text-blue-600" /> Atividades Nominais Recentes
                        </h3>
                        <button onClick={() => navigate('/admin/data')} className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">Ver Censo Completo</button>
                    </div>
                    <div className="space-y-4">
                        {stats.recent.map((s, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white transition-all shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-900 text-xs">
                                        {s.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{s.name}</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{s.className || s.school}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest border ${s.status === 'Matriculado' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                        {s.status}
                                    </span>
                                    <button onClick={() => navigate(`/student/monitoring?id=${s.id}`)} className="p-2 text-slate-300 hover:text-emerald-600 transition">
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="space-y-8">
                <div className="bg-[#064e3b] rounded-[2rem] p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group h-80">
                    <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-emerald-500/20 p-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl">
                        <Sparkles className="h-7 w-7 text-emerald-400" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] bg-white/10 px-3 py-1 rounded-full border border-white/5">Gov AI 2025</span>
                    </div>
                    <h4 className="text-lg font-black uppercase tracking-tight mb-3">Assistente de Rede</h4>
                    <p className="text-emerald-100/60 text-[10px] leading-relaxed mb-8 font-medium">IA preditiva sincronizada com a base do Educacenso para otimização de fluxo escolar.</p>
                    </div>
                    <button className="bg-white text-[#064e3b] w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-emerald-50 transition-all relative z-10 shadow-2xl active:scale-95">
                    Consultar Inteligência
                    </button>
                    <div className="absolute -bottom-20 -right-20 h-48 w-48 bg-emerald-500/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-[2s]"></div>
                </div>

                <div className="card-requinte p-8 space-y-6">
                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3 border-b border-slate-100 pb-4">
                        <Activity className="h-4 w-4 text-emerald-600" /> Saúde da Rede
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-[9px] font-black uppercase mb-2">
                                <span className="text-slate-400">Ocupação Global</span>
                                <span className="text-slate-900">82%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[82%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[9px] font-black uppercase mb-2">
                                <span className="text-slate-400">Sincronismo Inep</span>
                                <span className="text-slate-900 text-emerald-600">Online</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[100%] shadow-[0_0_10px_#3b82f6]"></div>
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
