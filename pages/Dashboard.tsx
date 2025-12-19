
import React, { useMemo, useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate, Link } from '../router';
import { 
  Users, School, AlertTriangle, Award, LayoutGrid, Map, 
  Building, FileText, ChevronRight, Activity, ArrowUpRight, 
  Sparkles, Target, Bus, ShieldCheck
} from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, colorClass, trend }: any) => (
    <div className="card-requinte !p-10 flex flex-col justify-between group cursor-default">
        <div className="flex justify-between items-start mb-10">
            <div className={`p-4 rounded-[1.5rem] ${colorClass} text-white shadow-xl shadow-opacity-20 transition-transform group-hover:scale-110 duration-700`}>
                <Icon className="h-6 w-6" />
            </div>
            {trend && (
              <span className="flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 uppercase tracking-widest">
                <ArrowUpRight className="h-4 w-4" /> {trend}
              </span>
            )}
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">{title}</p>
            <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
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
    pendentes: students.filter(s => s.status !== 'Matriculado').length
  }), [students]);

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-8 bg-[#fcfdfe]">
      <div className="w-16 h-16 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Sincronizando BI Municipal...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-20 px-12 page-transition">
      <div className="max-w-7xl mx-auto space-y-16">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SME BI • Itaberaba Digital v2.5</span>
                </div>
                <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">Gestão <br/><span className="text-blue-600">Estratégica.</span></h1>
            </div>
            <div className="flex items-center gap-8 bg-white p-4 pr-12 rounded-[2.5rem] shadow-luxury border border-slate-50 group hover:border-blue-200 transition-all cursor-pointer">
                <div className="h-16 w-16 bg-[#0F172A] rounded-[1.8rem] flex items-center justify-center text-blue-400 font-black text-2xl shadow-2xl transition-transform group-hover:scale-110">
                    {userData?.name?.charAt(0)}
                </div>
                <div>
                  <span className="text-xl font-black text-slate-900 uppercase block leading-none mb-2 tracking-tighter">{userData?.name}</span>
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] block">Gestor Municipal de Rede</span>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <MetricCard title="Censo Nominal" value={stats.total} icon={Users} colorClass="bg-[#0F172A]" trend="12%" />
            <MetricCard title="Educação Especial" value={stats.aee} icon={Award} colorClass="bg-pink-600" />
            <MetricCard title="Transp. Escolar" value={stats.transport} icon={Bus} colorClass="bg-blue-600" />
            <MetricCard title="Unidades Ativas" value={schools.length} icon={School} colorClass="bg-emerald-600" />
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 bg-white rounded-[4rem] border border-slate-100 p-12 space-y-12 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center relative z-10">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-4">
                      <LayoutGrid className="h-5 w-5 text-blue-600" /> Ecossistema Integrado
                  </h3>
                  <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">Configurações de Rede</button>
                </div>
                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                    {[
                        { icon: Map, title: "Geoprocess", desc: "Análise territorial e mapas de calor nominais.", to: "/admin/map", color: "bg-blue-600" },
                        { icon: Building, title: "Censo Nominal", desc: "Gestão inteligente da base nominal SME.", to: "/admin/data", color: "bg-[#0F172A]" },
                        { icon: FileText, title: "Indicadores", desc: "Relatórios de rendimento e fluxo global.", to: "/reports", color: "bg-emerald-600" },
                        { icon: Activity, title: "Monitoramento", desc: "Controle individualizado e prontuários.", to: "/student/monitoring", color: "bg-indigo-600" }
                    ].map((mod, i) => (
                        <Link key={i} to={mod.to} className="flex flex-col p-10 bg-slate-50/50 rounded-[3rem] hover:bg-white hover:shadow-luxury transition-all border border-transparent hover:border-blue-100 group">
                            <div className="flex items-center justify-between mb-8">
                              <div className={`p-4 rounded-[1.2rem] ${mod.color} text-white shadow-xl`}><mod.icon className="h-5 w-5" /></div>
                              <ChevronRight className="h-6 w-6 text-slate-200 group-hover:translate-x-2 transition-transform" />
                            </div>
                            <span className="font-black text-slate-900 uppercase text-2xl leading-none mb-3 tracking-tighter">{mod.title}</span>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">{mod.desc}</p>
                        </Link>
                    ))}
                </div>
                <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-50 rounded-full blur-[100px] opacity-40"></div>
            </div>
            
            <div className="lg:col-span-4 bg-[#0F172A] rounded-[4rem] p-16 text-white space-y-10 relative overflow-hidden group shadow-2xl">
                <div className="relative z-10">
                  <div className="bg-blue-600 w-20 h-20 rounded-[1.8rem] flex items-center justify-center mb-12 shadow-2xl transition-transform duration-1000 group-hover:rotate-[15deg]">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <h4 className="text-4xl font-black tracking-tighter leading-[0.9] mb-6 uppercase">IA Preditiva <br/> <span className="text-blue-400">'Edu'.</span></h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-12 font-medium">Análise cognitiva de vazios demográficos e projeções de evasão em tempo real.</p>
                  <button className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl active:scale-95">Consultar Estratégia</button>
                </div>
                <div className="absolute -bottom-24 -right-24 h-64 w-64 bg-blue-600/20 rounded-full blur-[100px] transition-all duration-1000 group-hover:scale-150"></div>
            </div>
        </div>
        
        <div className="bg-white rounded-[4rem] p-16 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-8">
                <div className="bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100">
                    <ShieldCheck className="h-10 w-10 text-emerald-600" />
                </div>
                <div>
                    <h5 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">Segurança Nominal Ativa</h5>
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Base de dados em conformidade com o Censo INEP 2025.</p>
                </div>
            </div>
            <div className="flex items-center gap-10">
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-1">Status de Rede</p>
                    <p className="text-lg font-black text-emerald-500 uppercase tracking-tight">100% Sincronizado</p>
                </div>
                <div className="h-12 w-px bg-slate-100"></div>
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center">
                    <Activity className="h-8 w-8 text-slate-200" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
