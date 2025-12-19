import React, { useMemo, useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate, Link } from '../router';
import { 
  Users, School, AlertTriangle, Award, LayoutGrid, Map, 
  Building, FileText, ChevronRight, Activity, ArrowUpRight, 
  Sparkles, Target, Bus, ShieldCheck, Database, Zap
} from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, colorClass, trend }: any) => (
    <div className="card-requinte !p-12 flex flex-col justify-between group cursor-default relative overflow-hidden">
        <div className="flex justify-between items-start mb-12 relative z-10">
            <div className={`p-5 rounded-[1.8rem] ${colorClass} text-white shadow-2xl transition-transform group-hover:scale-110 duration-700`}>
                <Icon className="h-7 w-7" />
            </div>
            {trend && (
              <span className="flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 px-5 py-2.5 rounded-full border border-emerald-100 uppercase tracking-ultra">
                <ArrowUpRight className="h-4 w-4" /> {trend}
              </span>
            )}
        </div>
        <div className="relative z-10">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">{title}</p>
            <h3 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-slate-50 rounded-full blur-3xl group-hover:bg-blue-50 transition-colors duration-700"></div>
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
    <div className="h-screen flex flex-col items-center justify-center gap-10 bg-[#fcfdfe]">
      <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-8 border-blue-50 rounded-[2.5rem]"></div>
          <div className="absolute inset-0 border-8 border-blue-600 border-t-transparent rounded-[2.5rem] animate-spin"></div>
      </div>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] animate-pulse">Sincronizando BI Municipal...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-24 px-12 page-transition">
      <div className="max-w-7xl mx-auto space-y-20">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
            <div className="space-y-8">
                <div className="flex items-center gap-5">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]"></div>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Núcleo Executivo SME • v2.5 Digital</span>
                </div>
                <h1 className="text-8xl font-black text-slate-900 tracking-tighter uppercase leading-[0.85]">Visão <br/><span className="text-blue-600">Estratégica.</span></h1>
            </div>
            <div className="flex items-center gap-10 bg-white p-5 pr-16 rounded-[3rem] shadow-luxury border border-slate-50 group hover:border-blue-100 transition-all duration-700 cursor-pointer">
                <div className="h-20 w-20 bg-[#0F172A] rounded-[2rem] flex items-center justify-center text-blue-400 font-black text-3xl shadow-2xl transition-transform group-hover:scale-105">
                    {userData?.name?.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900 uppercase block leading-none mb-3 tracking-tighter">{userData?.name}</span>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] block">Gestor Municipal Autenticado</span>
                  </div>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <MetricCard title="Censo Nominal" value={stats.total} icon={Users} colorClass="bg-[#0F172A]" trend="+4.2%" />
            <MetricCard title="Educação Especial" value={stats.aee} icon={Award} colorClass="bg-pink-600" />
            <MetricCard title="Transp. Escolar" value={stats.transport} icon={Bus} colorClass="bg-blue-600" />
            <MetricCard title="Rede Ativa" value={schools.length} icon={School} colorClass="bg-emerald-600" />
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 bg-white rounded-[4rem] border border-slate-100 p-16 space-y-16 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center relative z-10">
                  <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-5">
                      <LayoutGrid className="h-6 w-6 text-blue-600" /> Módulos Operacionais
                  </h3>
                  <div className="flex items-center gap-3 bg-slate-50 px-5 py-2 rounded-full border border-slate-100">
                    <Database className="h-3 w-3 text-slate-400" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sincronismo: 100%</span>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-10 relative z-10">
                    {[
                        { icon: Map, title: "Geoprocess", desc: "Análise territorial e mapas de calor nominais.", to: "/admin/map", color: "bg-blue-600" },
                        { icon: Building, title: "Censo Nominal", desc: "Gestão inteligente da base de dados nominal SME.", to: "/admin/data", color: "bg-[#0F172A]" },
                        { icon: FileText, title: "Indicadores", desc: "Relatórios de rendimento e fluxo de rede global.", to: "/reports", color: "bg-emerald-600" },
                        { icon: Activity, title: "Monitoramento", desc: "Prontuários individuais e controle de assiduidade.", to: "/student/monitoring", color: "bg-indigo-600" }
                    ].map((mod, i) => (
                        <Link key={i} to={mod.to} className="flex flex-col p-12 bg-slate-50/50 rounded-[3.5rem] hover:bg-white hover:shadow-luxury transition-all duration-700 border border-transparent hover:border-blue-100 group">
                            <div className="flex items-center justify-between mb-10">
                              <div className={`p-5 rounded-[1.5rem] ${mod.color} text-white shadow-2xl group-hover:rotate-[10deg] transition-transform duration-500`}><mod.icon className="h-6 w-6" /></div>
                              <div className="bg-white p-3 rounded-full shadow-sm text-slate-200 group-hover:text-blue-600 transition-colors">
                                <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                            <span className="font-black text-slate-900 uppercase text-3xl leading-none mb-4 tracking-tighter">{mod.title}</span>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed opacity-80">{mod.desc}</p>
                        </Link>
                    ))}
                </div>
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-50 rounded-full blur-[120px] opacity-40"></div>
            </div>
            
            <div className="lg:col-span-4 bg-[#0F172A] rounded-[4.5rem] p-20 text-white space-y-12 relative overflow-hidden group shadow-2xl border border-slate-800">
                <div className="relative z-10">
                  <div className="bg-blue-600 w-24 h-24 rounded-[2.2rem] flex items-center justify-center mb-16 shadow-2xl transition-transform duration-1000 group-hover:rotate-[15deg]">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-5xl font-black tracking-tighter leading-[0.9] mb-8 uppercase">IA Preditiva <br/> <span className="text-blue-400">'Edu'.</span></h4>
                  <p className="text-slate-400 text-base leading-relaxed mb-16 font-medium">Motor cognitivo para análise de vazios demográficos e projeções de evasão escolar.</p>
                  <button className="w-full py-8 bg-blue-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-ultra hover:bg-blue-700 transition-all shadow-xl active:scale-95 border border-blue-500">
                    Consultar IA
                  </button>
                </div>
                <div className="absolute -bottom-32 -right-32 h-80 w-80 bg-blue-600/20 rounded-full blur-[100px] transition-all duration-1000 group-hover:scale-150"></div>
                <div className="absolute top-10 right-10 flex gap-1 opacity-20">
                    <Zap className="h-5 w-5 fill-white" />
                    <Zap className="h-5 w-5 fill-white" />
                    <Zap className="h-5 w-5 fill-white" />
                </div>
            </div>
        </div>
        
        <div className="bg-white rounded-[4rem] p-16 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
            <div className="flex items-center gap-10 relative z-10">
                <div className="bg-emerald-50 p-8 rounded-[3rem] border border-emerald-100 shadow-sm">
                    <ShieldCheck className="h-12 w-12 text-emerald-600" />
                </div>
                <div>
                    <h5 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-3">Auditoria de Rede Ativa</h5>
                    <p className="text-base font-medium text-slate-400 uppercase tracking-widest leading-none">Conformidade integral com o Censo INEP 2025.</p>
                </div>
            </div>
            <div className="flex items-center gap-12 relative z-10">
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-2">Status da Base de Dados</p>
                    <p className="text-2xl font-black text-emerald-500 uppercase tracking-tighter">Integridade Total</p>
                </div>
                <div className="h-16 w-px bg-slate-100"></div>
                <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center border border-slate-100">
                    <Activity className="h-10 w-10 text-slate-200" />
                </div>
            </div>
            <div className="absolute right-0 top-0 h-full w-2 bg-emerald-500"></div>
        </div>
      </div>
    </div>
  );
};