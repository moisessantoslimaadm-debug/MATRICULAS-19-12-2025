import React, { useMemo, useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate, Link } from '../router';
import { 
  Users, School, AlertTriangle, Award, LayoutGrid, Map, 
  Building, FileText, ChevronRight, Activity, ArrowUpRight, 
  Sparkles, Target, Bus, ShieldCheck, Database, Zap,
  TrendingUp, Search, Calendar, LogOut
} from 'lucide-react';
import { MUNICIPALITY_NAME } from '../constants';

const MetricCard = ({ title, value, icon: Icon, colorClass, trend, label }: any) => (
    <div className="card-requinte !p-8 flex flex-col justify-between group cursor-default relative overflow-hidden">
        <div className="flex justify-between items-start mb-10 relative z-10">
            <div className={`p-4 rounded-2xl ${colorClass} text-white shadow-lg transition-transform group-hover:scale-105 duration-500`}>
                <Icon className="h-6 w-6" />
            </div>
            {trend && (
              <span className="flex items-center gap-2 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 uppercase tracking-widest">
                <ArrowUpRight className="h-3 w-3" /> {trend}
              </span>
            )}
        </div>
        <div className="relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{title}</p>
            <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
            {label && <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4 opacity-60">{label}</p>}
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
    ativos: students.filter(s => s.status === 'Matriculado').length
  }), [students]);

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-8 bg-[#fcfdfe]">
      <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-50 rounded-2xl"></div>
          <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-2xl animate-spin"></div>
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] animate-pulse">Sincronizando BI...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-8 lg:px-16 page-transition">
      <div className="max-w-7xl mx-auto space-y-16">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-sm"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Painel Estratégico SME • {MUNICIPALITY_NAME}</span>
                </div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Dashboard <br/><span className="text-blue-600">Executivo.</span></h1>
            </div>
            
            <div className="flex items-center gap-6 bg-white p-4 pr-10 rounded-[2rem] shadow-sm border border-slate-100 group cursor-pointer relative overflow-hidden">
                <div className="h-16 w-16 bg-[#0F172A] rounded-2xl flex items-center justify-center text-blue-400 font-bold text-2xl shadow-md transition-transform group-hover:scale-105">
                    {userData?.name?.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-slate-900 uppercase block leading-none mb-2 tracking-tight">{userData?.name}</span>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest block">Gestor Municipal</span>
                  </div>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <MetricCard title="Censo Nominal" value={stats.total} icon={Users} colorClass="bg-[#0F172A]" trend="+4%" label="Identificados" />
            <MetricCard title="Atendimento AEE" value={stats.aee} icon={Award} colorClass="bg-pink-600" label="Inclusão" />
            <MetricCard title="Transp. Escolar" value={stats.transport} icon={Bus} colorClass="bg-blue-600" label="Rotas" />
            <MetricCard title="Rede Ativa" value={schools.length} icon={School} colorClass="bg-emerald-600" label="Unidades" />
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 p-12 space-y-12 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center relative z-10">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-4">
                      <LayoutGrid className="h-5 w-5 text-blue-600" /> Módulos Operacionais
                  </h3>
                  <div className="flex items-center gap-3 bg-slate-50 px-6 py-2 rounded-full border border-slate-100">
                    <Database className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">100% Sincronizado</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                    {[
                        { icon: Map, title: "Geoprocess", desc: "Territorialidade e mapas.", to: "/admin/map", color: "bg-blue-600" },
                        { icon: Building, title: "Censo Nominal", desc: "Gestão da base nominal.", to: "/admin/data", color: "bg-[#0F172A]" },
                        { icon: FileText, title: "Indicadores BI", desc: "Relatórios de rede.", to: "/reports", color: "bg-emerald-600" },
                        { icon: Activity, title: "Prontuário", desc: "Monitoramento individual.", to: "/student/monitoring", color: "bg-indigo-600" }
                    ].map((mod, i) => (
                        <Link key={i} to={mod.to} className="flex flex-col p-8 bg-slate-50 rounded-[2rem] hover:bg-white hover:shadow-lg transition-all duration-500 border border-transparent hover:border-blue-100 group">
                            <div className="flex items-center justify-between mb-8">
                              <div className={`p-4 rounded-2xl ${mod.color} text-white shadow-md group-hover:rotate-6 transition-transform`}><mod.icon className="h-5 w-5" /></div>
                              <div className="bg-white p-2.5 rounded-full shadow-sm text-slate-200 group-hover:text-blue-600 transition-colors">
                                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                            <span className="font-bold text-slate-900 uppercase text-2xl leading-none mb-3 tracking-tight">{mod.title}</span>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">{mod.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
            
            <div className="lg:col-span-4 bg-[#0F172A] rounded-[2.5rem] p-12 text-white space-y-10 relative overflow-hidden group shadow-xl border border-slate-800">
                <div className="relative z-10">
                  <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-12 shadow-md">
                    <Sparkles className="h-7 w-7 text-white" />
                  </div>
                  <h4 className="text-4xl font-black tracking-tighter leading-none mb-8 uppercase">Assistente <br/> <span className="text-blue-400">'Edu'.</span></h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-12 font-medium">Análise de vazios demográficos e projeções de rede escolar.</p>
                  <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                    Consultar IA
                  </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};