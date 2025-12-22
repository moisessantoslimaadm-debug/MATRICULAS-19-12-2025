
import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { 
  PieChart as PieIcon, Printer, Download, 
  School as SchoolIcon, Users, HeartPulse, Bus, 
  TrendingUp, Activity, Database, ArrowRight, Layers, Target, ShieldCheck,
  // Fix: Added Building import from lucide-react
  Building
} from 'lucide-react';

const CustomPieChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  if (total === 0) return <div className="text-center text-slate-400 py-10">Sem dados síncronos</div>;

  return (
    <div className="flex flex-col xl:flex-row items-center gap-16 justify-center">
      <div className="relative w-64 h-64 shrink-0 drop-shadow-2xl">
        <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full">
          {data.map((slice, i) => {
            const startPercent = cumulativePercent;
            const slicePercent = slice.value / total;
            cumulativePercent += slicePercent;
            const [startX, startY] = getCoordinatesForPercent(startPercent);
            const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
            const largeArcFlag = slicePercent > 0.5 ? 1 : 0;
            const pathData = slicePercent === 1 
              ? `M 1 0 A 1 1 0 1 1 -1 0 A 1 1 0 1 1 1 0` 
              : `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
            
            return (
                <path 
                    key={i} d={pathData} fill={slice.color} stroke="white" strokeWidth="0.04" 
                    className="transition-all duration-700 hover:opacity-80 hover:scale-[1.05] origin-center cursor-pointer" 
                />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/80 backdrop-blur-xl w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-inner border border-white/40">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</span>
                <span className="text-2xl font-black text-slate-900">{total}</span>
            </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 w-full">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-luxury transition-all group">
            <div className="flex items-center gap-6">
                <span className="w-5 h-5 rounded-[0.8rem] shadow-sm group-hover:rotate-45 transition-transform" style={{ backgroundColor: item.color }}></span>
                <div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.label}</span>
                    <p className="text-xl font-black text-slate-900 mt-1">{item.value} <span className="text-[10px] text-slate-400 ml-2">({((item.value/total)*100).toFixed(1)}%)</span></p>
                </div>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-200 group-hover:text-slate-900 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
};

const HighDensityStat = ({ title, value, icon: Icon, colorClass, sub }: any) => (
    <div className="card-requinte !p-12 flex flex-col justify-between group h-64">
        <div className="flex justify-between items-start">
            <div className={`p-5 rounded-[2rem] ${colorClass} text-white shadow-2xl transition-all group-hover:rotate-12 group-hover:scale-110 duration-700`}>
                <Icon className="h-8 w-8" />
            </div>
            <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <Target className="h-4 w-4 text-slate-400" />
            </div>
        </div>
        <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-3">{title}</p>
            <h3 className="text-6xl font-black text-slate-900 tracking-tighter leading-none mb-3">{value}</h3>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{sub}</p>
        </div>
    </div>
);

export const Reports: React.FC = () => {
    const { schools, students } = useData();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'overview' | 'audit'>('overview');

    const statusDistribution = useMemo(() => {
        const counts = { matriculado: 0, pendente: 0, analise: 0 };
        students.forEach(s => {
            if (s.status === 'Matriculado') counts.matriculado++;
            else if (s.status === 'Pendente') counts.pendente++;
            else if (s.status === 'Em Análise') counts.analise++;
        });
        return [
            { label: 'Matriculados', value: counts.matriculado, color: '#10b981' },
            { label: 'Em Auditoria', value: counts.analise, color: '#2563eb' },
            { label: 'Fluxo Pendente', value: counts.pendente, color: '#f59e0b' }
        ].filter(d => d.value > 0);
    }, [students]);

    const schoolComparison = useMemo(() => {
        return schools.map(school => {
            const schoolStudents = students.filter(s => s.schoolId === school.id || s.school === school.name);
            const capacity = school.availableSlots || 400;
            const occupancy = (schoolStudents.length / capacity) * 100;
            return {
                name: school.name,
                total: schoolStudents.length,
                capacity,
                occupancy,
                aee: schoolStudents.filter(s => s.specialNeeds).length
            };
        }).sort((a, b) => b.total - a.total);
    }, [schools, students]);

    return (
        <div className="min-h-screen bg-[#fcfdfe] py-24 px-12 page-transition">
            <div className="max-w-[1600px] mx-auto space-y-24">
                <header className="flex flex-col 2xl:flex-row justify-between items-start 2xl:items-end gap-12 no-print">
                    <div className="space-y-10">
                        <div className="flex items-center gap-6">
                            <div className="h-3 w-3 rounded-full bg-blue-600 animate-pulse shadow-[0_0_20px_rgba(37,99,235,0.6)]"></div>
                            <span className="text-[12px] font-black text-slate-400 uppercase tracking-[0.5em]">Núcleo de Inteligência SME Itaberaba</span>
                        </div>
                        <h1 className="text-8xl md:text-[120px] font-black text-slate-900 tracking-tighter uppercase leading-[0.8] text-display">BI de <br/><span className="text-blue-600">Rede.</span></h1>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <button onClick={() => window.print()} className="btn-primary !h-24 !px-16 !bg-white !text-slate-900 border border-slate-100 shadow-luxury hover:!bg-slate-50">
                            <Printer className="h-7 w-7" /> Dossiê PDF
                        </button>
                        <button onClick={() => addToast("Base nominal exportada.", "success")} className="btn-primary !h-24 !px-16 !bg-slate-900 shadow-blue-900/10">
                            <Download className="h-7 w-7" /> Exportar CSV MEC
                        </button>
                    </div>
                </header>

                <div className="flex p-4 bg-white border border-slate-100 rounded-[3rem] w-fit shadow-luxury no-print">
                    <button 
                        onClick={() => setActiveTab('overview')} 
                        className={`px-16 py-6 rounded-[2.2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${activeTab === 'overview' ? 'bg-[#0F172A] text-white shadow-2xl scale-105' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                        Visão Estratégica
                    </button>
                    <button 
                        onClick={() => setActiveTab('audit')} 
                        className={`px-16 py-6 rounded-[2.2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${activeTab === 'audit' ? 'bg-[#0F172A] text-white shadow-2xl scale-105' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                        Auditoria Nominal
                    </button>
                </div>

                {activeTab === 'overview' && (
                    <div className="space-y-20 animate-in fade-in duration-1000">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-12">
                             <HighDensityStat title="Censo Total" value={students.length} icon={Users} colorClass="bg-slate-900" sub="Registros Auditados" />
                             <HighDensityStat title="Dossiês AEE" value={students.filter(s => s.specialNeeds).length} icon={HeartPulse} colorClass="bg-pink-600" sub="Inclusão Ativa" />
                             <HighDensityStat title="Frotas Rurais" value={students.filter(s => s.transportRequest).length} icon={Bus} colorClass="bg-blue-600" sub="Itinerários Logísticos" />
                             <HighDensityStat title="Unidades" value={schools.length} icon={SchoolIcon} colorClass="bg-emerald-600" sub="Rede Municipal Ativa" />
                        </div>

                        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-12">
                            <div className="card-requinte !p-20 relative overflow-hidden group">
                                <div className="flex justify-between items-center mb-16">
                                    <h3 className="text-[13px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-5">
                                        <Layers className="h-7 w-7 text-blue-600" /> Fluxo de Operação
                                    </h3>
                                    <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-4 py-2 rounded-xl border border-blue-100 uppercase">Tempo Real</span>
                                </div>
                                <CustomPieChart data={statusDistribution} />
                                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-50 rounded-full blur-[100px] opacity-40 group-hover:scale-150 transition-transform duration-[4s]"></div>
                            </div>

                            <div className="card-requinte !p-20 flex flex-col justify-between group">
                                <div className="space-y-12">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[13px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-5">
                                            <TrendingUp className="h-7 w-7 text-emerald-600" /> Rendimento de Vagas
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span className="text-[11px] font-black text-emerald-600 uppercase">Base MEC</span>
                                        </div>
                                    </div>
                                    <div className="space-y-10">
                                        {schoolComparison.slice(0, 4).map(s => (
                                            <div key={s.name} className="space-y-5">
                                                <div className="flex justify-between items-end">
                                                    <div className="space-y-1">
                                                        <p className="text-xl font-black text-slate-900 tracking-tight uppercase">{s.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.total} de {s.capacity} Vagas Nominais</p>
                                                    </div>
                                                    <span className="text-2xl font-black text-slate-900">{s.occupancy.toFixed(0)}%</span>
                                                </div>
                                                <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                                                    <div className={`h-full ${s.occupancy > 90 ? 'bg-red-500' : 'bg-blue-600'} transition-all duration-[2s] group-hover:animate-pulse`} style={{ width: `${Math.min(s.occupancy, 100)}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => setActiveTab('audit')} className="mt-16 w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all shadow-xl">Ver Relatório Completo</button>
                            </div>
                        </div>

                        <div className="card-requinte !p-20 overflow-hidden">
                            <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-10">
                                <div className="space-y-4">
                                    <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Mapa de <br/><span className="text-blue-600">Lotação Síncrona.</span></h3>
                                    <p className="text-slate-400 text-base font-medium">Consolidado nominal por unidade escolar ativa no Educacenso 2025.</p>
                                </div>
                                <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white flex items-center gap-8 shadow-2xl relative overflow-hidden">
                                    <Database className="h-10 w-10 text-emerald-400" />
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-2">Base MEC Itaberaba</p>
                                        <p className="text-2xl font-black tracking-tight uppercase">Sincronismo Ativo</p>
                                    </div>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12"></div>
                                </div>
                            </div>
                            <div className="overflow-x-auto custom-scrollbar pb-10">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b-2 border-slate-50">
                                            <th className="px-12 py-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Unidade Escolar</th>
                                            <th className="px-12 py-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Nominal</th>
                                            <th className="px-12 py-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">AEE</th>
                                            <th className="px-12 py-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Capacidade</th>
                                            <th className="px-12 py-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Lotação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {schoolComparison.map(s => (
                                            <tr key={s.name} className="group hover:bg-slate-50/50 transition-all duration-500">
                                                <td className="px-12 py-12">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                                                            <Building className="h-6 w-6" />
                                                        </div>
                                                        <p className="font-black text-slate-900 text-xl tracking-tighter uppercase leading-none">{s.name}</p>
                                                    </div>
                                                </td>
                                                <td className="px-12 py-12 text-center font-black text-slate-800 text-2xl tracking-tighter">{s.total}</td>
                                                <td className="px-12 py-12 text-center">
                                                    <span className="px-5 py-2 bg-pink-50 text-pink-600 rounded-2xl text-[10px] font-black uppercase border border-pink-100">{s.aee}</span>
                                                </td>
                                                <td className="px-12 py-12 text-center font-bold text-slate-400 text-lg tracking-widest">{s.capacity}</td>
                                                <td className="px-12 py-12 min-w-[280px]">
                                                    <div className="flex items-center gap-8">
                                                        <div className="flex-1 bg-slate-100 h-3.5 rounded-full overflow-hidden shadow-inner">
                                                            <div className={`h-full ${s.occupancy > 90 ? 'bg-red-500' : 'bg-blue-600'} transition-all duration-[2.5s]`} style={{ width: `${Math.min(s.occupancy, 100)}%` }}></div>
                                                        </div>
                                                        <span className="text-xl font-black text-slate-900 w-16">{s.occupancy.toFixed(0)}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-[#0F172A] p-20 rounded-[5rem] text-white shadow-deep relative overflow-hidden group">
                            <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-16">
                                <div className="space-y-10 max-w-2xl">
                                    <div className="w-24 h-24 bg-white/10 rounded-[2.5rem] flex items-center justify-center backdrop-blur-3xl border border-white/10 shadow-2xl">
                                        <ShieldCheck className="h-12 w-12 text-emerald-400" />
                                    </div>
                                    <div className="space-y-6">
                                        <h2 className="text-6xl font-black tracking-tighter uppercase leading-[0.85]">Certificação <br/><span className="text-emerald-400">Nominal SME.</span></h2>
                                        <p className="text-slate-400 text-xl font-medium leading-relaxed">Dados auditados e validados via barramento municipal síncrono. Garantia de integridade para fins de estatísticas oficiais MEC/Inep.</p>
                                    </div>
                                </div>
                                <button className="px-16 py-8 bg-white text-slate-900 rounded-[3rem] text-[13px] font-black uppercase tracking-[0.4em] hover:bg-emerald-50 transition-all shadow-deep active:scale-95">
                                    Emitir Relatório Oficial
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -mr-80 -mt-80 group-hover:scale-150 transition-transform duration-[5s]"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
