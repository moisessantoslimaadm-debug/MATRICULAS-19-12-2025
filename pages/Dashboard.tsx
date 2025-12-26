import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { useLog } from '../contexts/LogContext';
import { useNavigate, Link } from '../router';
import { 
  Users, School, LayoutGrid, Map, Building, FileText, 
  ChevronRight, Activity, ArrowUpRight, Bus, Database, 
  HeartPulse, ShieldCheck, Zap, Globe, Terminal, RefreshCw, MapPin
} from 'lucide-react';
import { MUNICIPALITY_NAME } from '../constants';

// Otimização: React.memo evita re-render se as props não mudarem
const MetricCard = React.memo(({ title, value, icon: Icon, colorClass, trend, sub }: any) => (
    <div className="card-requinte p-6 md:p-10 flex flex-col justify-between h-40 md:h-48 border-l-[8px] md:border-l-[12px]" style={{ borderLeftColor: 'currentColor' }}>
        <div className="flex justify-between items-start">
            <div className={`p-3 md:p-4 rounded-[1.2rem] md:rounded-[1.5rem] ${colorClass} text-white shadow-2xl`}><Icon className="h-5 w-5 md:h-6 md:w-6" /></div>
            {trend && (
              <div className="bg-emerald-50 px-2 md:px-3 py-1 md:py-1.5 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                <ArrowUpRight className="h-3 w-3 md:h-3.5 md:w-3.5 text-emerald-600" />
                <span className="text-[9px] md:text-[10px] font-black text-emerald-600 uppercase">{trend}</span>
              </div>
            )}
        </div>
        <div className="space-y-1">
            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{title}</p>
            <div className="flex items-baseline gap-3">
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">{value}</h3>
                {sub && <span className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase">{sub}</span>}
            </div>
        </div>
    </div>
));

export const Dashboard: React.FC = () => {
  const { students, schools, isLoading } = useData();
  const { logs } = useLog();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Efeito para auto-scroll do terminal
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = 0; // Mostra os mais recentes (top da lista invertida)
    }
  }, [logs]);

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('user_data') || '{}');
    if (!sessionStorage.getItem('user_role')) { navigate('/login'); return; }
    setUserData(data);
  }, [navigate]);

  const stats = useMemo(() => {
    const totalCapacity = schools.reduce((acc, s) => acc + (s.availableSlots || 0), 0);
    const totalStudents = students.length;
    const occupancyRate = totalCapacity > 0 ? (totalStudents / totalCapacity) * 100 : 0;
    
    return {
      total: totalStudents,
      aee: students.filter(s => s.specialNeeds).length,
      transport: students.filter(s => s.transportRequest).length,
      unidades: schools.length,
      avgDistance: students.reduce((acc, curr) => acc + (curr.geoDistance || 0), 0) / (students.length || 1),
      occupancy: occupancyRate
    };
  }, [students, schools]);

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-10">
        <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-[10px] border-emerald-100 rounded-[2.5rem]"></div>
            <div className="absolute inset-0 border-[10px] border-emerald-600 border-t-transparent rounded-[2.5rem] animate-spin"></div>
        </div>
        <div className="text-center space-y-3">
            <p className="text-emerald-600 font-black text-[12px] uppercase tracking-[0.6em] animate-pulse">Sincronizando Barramento SME...</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-6 md:py-20 md:px-12 page-transition">
      <div className="max-w-[1600px] mx-auto space-y-10 md:space-y-16">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 md:gap-12 border-b border-slate-200 pb-10 md:pb-16">
            <div className="space-y-6">
                <div className="flex items-center gap-6">
                    <div className="bg-slate-900 p-3 md:p-4 rounded-[1.5rem] md:rounded-[1.8rem] text-white shadow-2xl rotate-3"><LayoutGrid className="h-6 w-6 md:h-8 md:w-8" /></div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none break-words">Gestão <br/><span className="text-emerald-600">Síncrona.</span></h1>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                  <div className="flex items-center gap-2.5 px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <Globe className="h-4 w-4 text-emerald-500" />
                    <span className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">{MUNICIPALITY_NAME} • SME</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]"></div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-ultra">Base Auditada MEC</span>
                  </div>
                </div>
            </div>
            
            <div className="flex items-center gap-8 w-full lg:w-auto">
                <div className="flex items-center gap-6 bg-white px-6 py-4 md:px-8 rounded-[2.5rem] border border-slate-100 shadow-luxury group cursor-pointer w-full lg:w-auto">
                    <div className="h-12 w-12 md:h-14 md:w-14 bg-[#064e3b] rounded-[1.5rem] flex items-center justify-center text-white text-xl font-black shrink-0">{userData?.name?.charAt(0)}</div>
                    <div>
                      <span className="text-xs md:text-sm font-black text-slate-900 block leading-none uppercase tracking-tight truncate max-w-[200px]">{userData?.name}</span>
                      <span className="text-[9px] md:text-[10px] font-bold text-emerald-600 uppercase tracking-[0.3em] mt-2 block">Gestor Municipal</span>
                    </div>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-10">
            <MetricCard title="Censo Nominal" value={stats.total} icon={Users} colorClass="bg-slate-900" trend="+2.4%" sub="Alunos" />
            <MetricCard title="Pastas AEE" value={stats.aee} icon={HeartPulse} colorClass="bg-pink-600" sub="Atendimentos" />
            <MetricCard title="Frotas Ativas" value={stats.transport} icon={Bus} colorClass="bg-blue-600" sub="Rotas" />
            <MetricCard title="Unidades" value={stats.unidades} icon={School} colorClass="bg-emerald-600" sub="Inep" />
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-12">
            <div className="col-span-12 xl:col-span-8 space-y-6 md:space-y-12">
                <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 p-8 md:p-16 shadow-luxury relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-10 md:mb-16 relative z-10">
                        <h3 className="text-lg md:text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4"><Zap className="h-6 w-6 md:h-7 md:w-7 text-emerald-600" /> Módulos Estratégicos</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 relative z-10">
                        {[
                            { icon: Map, title: "Geoprocessamento", desc: "Monitoramento territorial nominal.", to: "/admin/map", color: "text-emerald-600 bg-emerald-50" },
                            { icon: Building, title: "Gestão de Rede", desc: "Base nominal profissional e física.", to: "/admin/escolas", color: "text-blue-600 bg-blue-50" },
                            { icon: FileText, title: "Inteligência BI", desc: "Análise preditiva de ocupação.", to: "/reports", color: "text-indigo-600 bg-indigo-50" },
                            { icon: Activity, title: "Monitoramento", desc: "Acompanhamento nominal de rendimento.", to: "/performance", color: "text-amber-600 bg-amber-50" }
                        ].map((mod, i) => (
                            <Link key={i} to={mod.to} className="flex items-center p-6 md:p-8 bg-slate-50/50 rounded-[2rem] md:rounded-[2.5rem] hover:bg-white hover:shadow-deep border border-transparent hover:border-slate-100 transition-all group">
                                <div className={`p-4 md:p-5 rounded-[1.5rem] md:rounded-[1.8rem] ${mod.color} mr-6 md:mr-8 shadow-xl transition-all duration-500`}><mod.icon className="h-6 w-6 md:h-8 md:w-8" /></div>
                                <div className="flex-1 min-w-0">
                                    <span className="font-black text-slate-900 text-sm md:text-lg uppercase tracking-tight block truncate mb-1.5">{mod.title}</span>
                                    <p className="text-[10px] md:text-[11px] font-medium text-slate-500 leading-relaxed uppercase tracking-widest line-clamp-2">{mod.desc}</p>
                                </div>
                                <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-slate-300 group-hover:text-emerald-600 transition-all" />
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                  <div className="card-requinte !p-10 md:!p-16 flex flex-col justify-between group overflow-hidden relative min-h-[250px]">
                    <div className="relative z-10">
                      <div className="flex items-center gap-5 mb-8 md:mb-10">
                        <div className="bg-blue-600 p-3 md:p-4 rounded-2xl text-white shadow-xl"><MapPin className="h-5 w-5 md:h-6 md:w-6" /></div>
                        <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tighter">Logística Geo</h3>
                      </div>
                      <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-widest mb-6 md:mb-10">Raio médio de alocação:</p>
                      <div className="flex items-baseline gap-4">
                        <span className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter">{stats.avgDistance.toFixed(1)}</span>
                        <span className="text-lg md:text-xl font-black text-blue-600 uppercase tracking-widest">KM</span>
                      </div>
                    </div>
                    <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-blue-50 rounded-full blur-[80px] group-hover:scale-150 transition-transform"></div>
                  </div>

                  <div className="bg-emerald-600 rounded-[2.5rem] md:rounded-[3.5rem] p-10 md:p-16 text-white shadow-deep relative overflow-hidden group min-h-[250px]">
                     <div className="relative z-10 flex flex-col h-full justify-between">
                        <ShieldCheck className="h-8 w-8 md:h-10 md:w-10 text-emerald-300 mb-8 md:mb-10" />
                        <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">Integridade <br/>Auditada MEC.</h3>
                        <p className="text-emerald-100/60 text-xs md:text-sm mt-6 font-medium">Sincronismo Nominal Ativo</p>
                     </div>
                  </div>
                </div>
            </div>
            
            <div className="col-span-12 xl:col-span-4 space-y-6 md:space-y-12">
                <div className="bg-slate-900 rounded-[3rem] md:rounded-[4rem] p-8 md:p-12 text-white shadow-deep relative overflow-hidden min-h-[400px] md:min-h-[500px]">
                    <div className="relative z-10 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-8 md:mb-10 shrink-0">
                            <div className="flex items-center gap-4">
                                <Terminal className="h-5 w-5 md:h-6 md:w-6 text-emerald-400" />
                                <h3 className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em]">Barramento Síncrono</h3>
                            </div>
                            <RefreshCw className="h-4 w-4 text-emerald-400 animate-spin" />
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-4 font-mono text-[9px] md:text-[10px] scrollbar-hide pr-2" ref={scrollRef}>
                            {logs.length === 0 ? (
                                <span className="text-slate-500 italic">Aguardando eventos do sistema...</span>
                            ) : logs.slice(0, 20).map((log, i) => (
                                <div key={log.id} className="border-l border-emerald-500/30 pl-4 py-1 animate-in fade-in slide-in-from-left-2 duration-300 break-words">
                                    <span className="text-emerald-500/50 mr-2">[{log.timestamp.toLocaleTimeString()}]</span>
                                    <span className={log.type === 'error' ? 'text-red-400 font-bold' : log.type === 'warning' ? 'text-amber-400' : 'text-slate-300'}>
                                        {log.message}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                </div>

                <div className="card-requinte !p-10 md:!p-16 space-y-8 md:space-y-12">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-6 md:pb-8">
                        <h3 className="text-[11px] md:text-[13px] font-black text-slate-900 uppercase tracking-[0.5em] flex items-center gap-4 md:gap-5"><Activity className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" /> Saúde da Rede</h3>
                        <Zap className="h-4 w-4 md:h-5 md:w-5 text-amber-500 animate-pulse" />
                    </div>
                    <div className="space-y-8 md:space-y-10">
                        <div>
                            <div className="flex justify-between text-[10px] md:text-[11px] font-black uppercase mb-4 md:mb-5 tracking-[0.2em]">
                                <span className="text-slate-400">Ocupação Global</span>
                                <span className="text-slate-900">{stats.occupancy.toFixed(1)}%</span>
                            </div>
                            <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                <div className={`h-full transition-all duration-[2s] ${stats.occupancy > 90 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(stats.occupancy, 100)}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[10px] md:text-[11px] font-black uppercase mb-4 md:mb-5 tracking-[0.2em]">
                                <span className="text-slate-400">Integridade de Dados</span>
                                <span className="text-emerald-600">Síncrona</span>
                            </div>
                            <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                <div className="h-full bg-blue-500 w-full animate-pulse"></div>
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