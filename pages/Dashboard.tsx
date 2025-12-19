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
    <div className="card-requinte p-8 flex flex-col justify-between group">
        <div className="flex justify-between items-start mb-8">
            <div className={`p-4 rounded-2xl ${colorClass} text-white shadow-lg shadow-blue-100/20 transition-transform group-hover:scale-110`}>
                <Icon className="h-6 w-6" />
            </div>
            {trend && (
              <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 uppercase tracking-widest">
                <ArrowUpRight className="h-3 w-3" /> {trend}
              </span>
            )}
        </div>
        <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h3>
            {label && <p className="text-[10px] font-bold text-slate-400 uppercase mt-3 tracking-widest">{label}</p>}
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
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processando Inteligência de Rede...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-8 lg:px-16 page-transition">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Portal Administrativo SME • {MUNICIPALITY_NAME}</span>
                </div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Visão de <span className="text-blue-600">Rede.</span></h1>
            </div>
            
            <div className="flex items-center gap-5 bg-white p-3 pr-8 rounded-3xl shadow-sm border border-slate-100 group">
                <div className="h-14 w-14 bg-[#0f172a] rounded-2xl flex items-center justify-center text-blue-400 font-black text-2xl shadow-md group-hover:rotate-6 transition-all">
                    {userData?.name?.charAt(0)}
                </div>
                <div>
                  <span className="text-base font-black text-slate-900 uppercase tracking-tight block leading-none mb-2">{userData?.name}</span>
                  <span className="text-[10px] font-black text-blue-600 uppercase block tracking-widest">Gestor Municipal</span>
                </div>
            </div>
        </header>

        <div className="dashboard-grid">
            <MetricCard title="Censo Nominal" value={stats.total} icon={Users} colorClass="bg-[#0f172a]" trend="+4.2%" label="Alunos Identificados" />
            <MetricCard title="Inclusão AEE" value={stats.aee} icon={Award} colorClass="bg-pink-600" label="Atendimento Especializado" />
            <MetricCard title="Transp. Escolar" value={stats.transport} icon={Bus} colorClass="bg-blue-600" label="Rotas Requeridas" />
            <MetricCard title="Unidades Ativas" value={schools.length} icon={School} colorClass="bg-emerald-600" label="Rede Escolar Síncrona" />
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
                <div className="flex justify-between items-center mb-12">
                  <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-4">
                      <LayoutGrid className="h-5 w-5 text-blue-600" /> Módulos de Gestão Digital
                  </h3>
                  <div className="bg-slate-50 px-5 py-2 rounded-full border border-slate-100 flex items-center gap-3">
                    <Database className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizado</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {[
                        { icon: Map, title: "Geoprocess", desc: "Análise territorial de vagas.", to: "/admin/map", color: "bg-blue-600" },
                        { icon: Building, title: "Censo Nominal", desc: "Controle de base municipal.", to: "/admin/data", color: "bg-slate-900" },
                        { icon: FileText, title: "Relatórios BI", desc: "Indicadores de rede 2025.", to: "/reports", color: "bg-emerald-600" },
                        { icon: Activity, title: "Monitoramento", desc: "Acompanhamento por aluno.", to: "/student/monitoring", color: "bg-indigo-600" }
                    ].map((mod, i) => (
                        <Link key={i} to={mod.to} className="flex flex-col p-8 bg-slate-50 rounded-[2rem] hover:bg-white hover:shadow-luxury transition-all border border-transparent hover:border-blue-100 group">
                            <div className="flex items-center justify-between mb-8">
                              <div className={`p-4 rounded-2xl ${mod.color} text-white shadow-md`}><mod.icon className="h-5 w-5" /></div>
                              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                            </div>
                            <span className="font-black text-slate-900 uppercase text-xl mb-2 tracking-tight">{mod.title}</span>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{mod.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
            
            <div className="lg:col-span-4 bg-[#0f172a] rounded-[2.5rem] p-12 text-white relative overflow-hidden flex flex-col justify-between group shadow-2xl border border-slate-800">
                <div className="relative z-10">
                  <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-10 shadow-lg group-hover:rotate-12 transition-transform">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-4xl font-black tracking-tighter mb-6 leading-none uppercase">Assistente <br/> <span className="text-blue-400">'Edu'.</span></h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-12 font-medium">Análise preditiva de demanda escolar e suporte técnico síncrono para gestores.</p>
                </div>
                <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl active:scale-95">
                  Iniciar Consultoria IA
                </button>
                <div className="absolute -bottom-24 -right-24 h-64 w-64 bg-blue-600/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
            </div>
        </div>
      </div>
    </div>
  );
};