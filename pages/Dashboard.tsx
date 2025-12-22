import React, { useMemo, useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate, Link } from '../router';
import { 
  Users, School, LayoutGrid, Map, 
  Building, FileText, ChevronRight, Activity, ArrowUpRight, 
  Sparkles, Bus, Database, HeartPulse
} from 'lucide-react';
import { MUNICIPALITY_NAME } from '../constants';

const MetricCard = ({ title, value, icon: Icon, colorClass, trend }: any) => (
    <div className="card-requinte p-4 flex flex-col justify-between h-24">
        <div className="flex justify-between items-center">
            <div className={`p-1.5 rounded-lg ${colorClass} text-white`}>
                <Icon className="h-3.5 w-3.5" />
            </div>
            {trend && (
              <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                {trend}
              </span>
            )}
        </div>
        <div>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{title}</p>
            <h3 className="text-xl font-bold text-slate-900 leading-none">{value}</h3>
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
    unidades: schools.length
  }), [students, schools]);

  if (isLoading) return <div className="h-screen flex items-center justify-center text-emerald-600 font-bold text-xs uppercase tracking-widest">Sincronizando Rede...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-6 page-transition">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center border-b border-slate-200 pb-4">
            <div>
                <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Painel de <span className="text-emerald-600">Gestão</span></h1>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{MUNICIPALITY_NAME} • SME Digital</p>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                <div className="h-7 w-7 bg-[#064e3b] rounded flex items-center justify-center text-white text-[10px] font-bold">
                    {userData?.name?.charAt(0)}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-900 block leading-none">{userData?.name}</span>
                  <span className="text-[7px] font-bold text-emerald-600 uppercase">Secretaria de Educação</span>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Estudantes" value={stats.total} icon={Users} colorClass="bg-[#064e3b]" trend="+2.4%" />
            <MetricCard title="Inclusão AEE" value={stats.aee} icon={HeartPulse} colorClass="bg-pink-600" />
            <MetricCard title="Transporte" value={stats.transport} icon={Bus} colorClass="bg-blue-600" />
            <MetricCard title="Unidades" value={stats.unidades} icon={School} colorClass="bg-emerald-600" />
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <LayoutGrid className="h-3.5 w-3.5 text-emerald-600" /> Módulos Administrativos
                  </h3>
                  <div className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                    <Database className="h-3 w-3 text-emerald-600" />
                    <span className="text-[8px] font-bold text-emerald-700 uppercase">Live Data</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                    {[
                        { icon: Map, title: "Geoprocessamento", desc: "Gestão territorial nominal.", to: "/admin/map", color: "text-emerald-600 bg-emerald-50" },
                        { icon: Building, title: "Censo Nominal", desc: "Base de dados síncrona.", to: "/admin/data", color: "text-blue-600 bg-blue-50" },
                        { icon: FileText, title: "BI Reports", desc: "Indicadores de desempenho.", to: "/reports", color: "text-indigo-600 bg-indigo-50" },
                        { icon: Activity, title: "Monitoramento", desc: "Frequência e inclusão.", to: "/student/monitoring", color: "text-amber-600 bg-amber-50" }
                    ].map((mod, i) => (
                        <Link key={i} to={mod.to} className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-emerald-50/30 border border-slate-100 transition-all group">
                            <div className={`p-2 rounded-md ${mod.color} mr-3 shadow-sm`}>
                                <mod.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="font-bold text-slate-800 text-[10px] uppercase tracking-tight block truncate">{mod.title}</span>
                                <p className="text-[7px] font-bold text-slate-400 uppercase truncate">{mod.desc}</p>
                            </div>
                            <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-emerald-600" />
                        </Link>
                    ))}
                </div>
            </div>
            
            <div className="bg-[#064e3b] rounded-xl p-5 text-white flex flex-col justify-between shadow-lg relative overflow-hidden group">
                <div className="relative z-10">
                  <Sparkles className="h-5 w-5 text-emerald-400 mb-3" />
                  <h4 className="text-xs font-bold uppercase tracking-tight mb-1">Assistente Edu</h4>
                  <p className="text-emerald-100/60 text-[9px] leading-relaxed mb-4">Análise preditiva de rede baseada em IA para suporte ao gestor.</p>
                </div>
                <button className="bg-white text-[#064e3b] w-full py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-50 transition-all relative z-10 shadow-sm">
                  Consultar Inteligência
                </button>
                <div className="absolute -bottom-4 -right-4 h-20 w-20 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000"></div>
            </div>
        </div>
      </div>
    </div>
  );
};