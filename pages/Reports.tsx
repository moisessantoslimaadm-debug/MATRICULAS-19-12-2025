
import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { 
  PieChart as PieIcon, Printer, Download, 
  School as SchoolIcon, Users, HeartPulse, Bus, 
  TrendingUp, Activity, Database
} from 'lucide-react';

const PieChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  if (total === 0) return <div className="text-center text-slate-400 py-10">Sem dados síncronos</div>;

  return (
    <div className="flex flex-col md:flex-row items-center gap-12 justify-center">
      <div className="relative w-48 h-48 shrink-0">
        <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full drop-shadow-2xl">
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
            
            return <path key={i} d={pathData} fill={slice.color} stroke="white" strokeWidth="0.04" className="transition-all duration-700 hover:opacity-80 cursor-pointer" />;
          })}
        </svg>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-4 bg-white/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
            <span className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></span>
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                <span className="text-sm font-black text-slate-900">{item.value} ({((item.value/total)*100).toFixed(1)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const GroupedBarChart = ({ data }: { data: { label: string; v1: number; v2: number; v3: number }[] }) => {
    const maxVal = Math.max(...data.map(d => Math.max(d.v1, d.v2, d.v3)), 1);
    
    return (
        <div className="w-full h-80 flex items-end justify-between gap-6 pt-12 pb-6">
            {data.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 h-full justify-end group">
                    <div className="w-full flex justify-center items-end gap-1.5 h-full relative">
                        <div className="absolute -top-12 bg-[#0F172A] text-white text-[9px] font-black px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all z-10 whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-2xl">
                            {item.label}: {item.v1} Alunos
                        </div>
                        <div className="w-3 bg-blue-600 rounded-t-lg transition-all duration-700 group-hover:scale-y-105 shadow-lg shadow-blue-100" style={{ height: `${(item.v1 / maxVal) * 100}%` }}></div>
                        <div className="w-3 bg-pink-500 rounded-t-lg transition-all duration-700 group-hover:scale-y-105 shadow-lg shadow-pink-100" style={{ height: `${(item.v2 / maxVal) * 100}%` }}></div>
                        <div className="w-3 bg-emerald-500 rounded-t-lg transition-all duration-700 group-hover:scale-y-105 shadow-lg shadow-emerald-100" style={{ height: `${(item.v3 / maxVal) * 100}%` }}></div>
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate w-full text-center">
                        {item.label.split(' ')[0]}
                    </span>
                </div>
            ))}
        </div>
    );
};

const SimpleCardStat = ({ title, value, icon: Icon, colorClass, subtext }: any) => (
    <div className="card-requinte !p-10 flex flex-col justify-between group">
        <div className="flex justify-between items-start mb-10">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{title}</p>
                <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
            </div>
            <div className={`p-4 rounded-[1.5rem] ${colorClass} text-white shadow-2xl transition-transform group-hover:rotate-12`}>
                <Icon className="h-6 w-6" />
            </div>
        </div>
        {subtext && <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{subtext}</p>}
    </div>
);

export const Reports: React.FC = () => {
    const { schools, students } = useData();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'overview' | 'individual'>('overview');

    const statusDistribution = useMemo(() => {
        const counts = { matriculado: 0, pendente: 0, analise: 0 };
        students.forEach(s => {
            if (s.status === 'Matriculado') counts.matriculado++;
            else if (s.status === 'Pendente') counts.pendente++;
            else if (s.status === 'Em Análise') counts.analise++;
        });
        return [
            { label: 'Matriculado', value: counts.matriculado, color: '#10b981' },
            { label: 'Em Análise', value: counts.analise, color: '#2563eb' },
            { label: 'Pendente', value: counts.pendente, color: '#f59e0b' }
        ].filter(d => d.value > 0);
    }, [students]);

    const schoolComparison = useMemo(() => {
        const groups: Record<string, { total: number, aee: number, transport: number }> = {};
        schools.forEach(school => { groups[school.name] = { total: 0, aee: 0, transport: 0 }; });
        students.forEach(s => {
            if(s.school) {
                const key = s.school;
                if (!groups[key]) groups[key] = { total: 0, aee: 0, transport: 0 };
                groups[key].total += 1;
                if (s.specialNeeds) groups[key].aee += 1;
                if (s.transportRequest) groups[key].transport += 1;
            }
        });
        return Object.keys(groups).map(name => {
            const school = schools.find(s => s.name === name);
            const capacity = school?.availableSlots || 400;
            const stats = groups[name];
            return { name, ...stats, capacity, occupancy: (stats.total / capacity) * 100 };
        }).sort((a, b) => b.total - a.total);
    }, [schools, students]);

    return (
        <div className="min-h-screen bg-[#fcfdfe] py-24 px-12 page-transition">
            <div className="max-w-7xl mx-auto space-y-24">
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 no-print">
                    <div className="space-y-8">
                        <div className="flex items-center gap-5">
                            <div className="h-3 w-3 rounded-full bg-blue-600 animate-pulse shadow-[0_0_15px_#2563eb]"></div>
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Núcleo de Inteligência SME • Itaberaba Digital</span>
                        </div>
                        <h1 className="text-8xl font-black text-slate-900 tracking-tighter uppercase leading-[0.85] text-display">BI de <br/><span className="text-blue-600">Rede.</span></h1>
                    </div>
                    <div className="flex gap-6">
                        <button onClick={() => window.print()} className="btn-secondary !h-20 !px-12 shadow-luxury"><Printer className="h-6 w-6" /> Gerar Dossiê PDF</button>
                        <button onClick={() => addToast("Planilha nominal exportada.", "success")} className="btn-primary !h-20 !px-12 shadow-blue-100"><Download className="h-6 w-6" /> Exportar CSV MEC</button>
                    </div>
                </header>

                <div className="flex p-3 bg-white border border-slate-100 rounded-[2.5rem] w-fit shadow-sm no-print">
                    <button onClick={() => setActiveTab('overview')} className={`px-12 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-[#0F172A] text-white shadow-2xl scale-105' : 'text-slate-400 hover:text-slate-900'}`}>Visão Global</button>
                    <button onClick={() => setActiveTab('individual')} className={`px-12 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'individual' ? 'bg-[#0F172A] text-white shadow-2xl scale-105' : 'text-slate-400 hover:text-slate-900'}`}>Censo Nominal</button>
                </div>

                {activeTab === 'overview' && (
                    <div className="space-y-16 animate-in fade-in duration-700">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                             <SimpleCardStat title="Censo Total" value={students.length} icon={Users} colorClass="bg-[#0F172A]" subtext="Nominal Auditado" />
                             <SimpleCardStat title="Dossiês AEE" value={students.filter(s => s.specialNeeds).length} icon={HeartPulse} colorClass="bg-pink-600" subtext="Inclusão Ativa" />
                             <SimpleCardStat title="Frotas Rurais" value={students.filter(s => s.transportRequest).length} icon={Bus} colorClass="bg-blue-600" subtext="Logística Síncrona" />
                             <SimpleCardStat title="Unidades" value={schools.length} icon={SchoolIcon} colorClass="bg-emerald-600" subtext="Rede Municipal Ativa" />
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12">
                            <div className="card-requinte !p-16 relative overflow-hidden group">
                                <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] mb-12 flex items-center gap-5"><TrendingUp className="h-6 w-6 text-blue-600" /> Comparativo de Ocupação</h3>
                                <GroupedBarChart data={schoolComparison.slice(0, 5).map(s => ({ label: s.name, v1: s.total, v2: s.aee, v3: s.transport }))} />
                                <div className="absolute -bottom-24 -right-24 h-64 w-64 bg-blue-50 rounded-full blur-[80px] opacity-40 group-hover:scale-150 transition-transform duration-1000"></div>
                            </div>
                            <div className="card-requinte !p-16 relative overflow-hidden group">
                                <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] mb-12 flex items-center gap-5"><PieIcon className="h-6 w-6 text-emerald-600" /> Fluxo de Rede Nominal</h3>
                                <div className="py-10"><PieChart data={statusDistribution} /></div>
                                <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-emerald-50 rounded-full blur-[80px] opacity-40 group-hover:scale-150 transition-transform duration-1000"></div>
                            </div>
                        </div>

                        <div className="card-requinte !p-16 overflow-hidden">
                            <div className="flex justify-between items-center mb-16">
                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Quadro Geral <br/><span className="text-blue-600">de Lotação.</span></h3>
                                <div className="bg-slate-50 px-8 py-4 rounded-[1.8rem] border border-slate-100 flex items-center gap-4">
                                    <Database className="h-5 w-5 text-slate-400" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base MEC Itaberaba</span>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-50">
                                            <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidade Escolar Inep</th>
                                            <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Nominal</th>
                                            <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Capacidade</th>
                                            <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Lotação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {schoolComparison.map(s => (
                                            <tr key={s.name} className="hover:bg-slate-50/50 transition-colors duration-300">
                                                <td className="px-10 py-10">
                                                    <p className="font-black text-slate-900 text-xl uppercase tracking-tighter leading-none">{s.name}</p>
                                                </td>
                                                <td className="px-10 py-10 text-center font-black text-slate-700 text-lg">{s.total}</td>
                                                <td className="px-10 py-10 text-center font-bold text-slate-500">{s.capacity}</td>
                                                <td className="px-10 py-10">
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                                            <div className={`h-full ${s.occupancy > 90 ? 'bg-red-500' : 'bg-blue-600'} transition-all duration-[1.5s]`} style={{ width: `${Math.min(s.occupancy, 100)}%` }}></div>
                                                        </div>
                                                        <span className="text-lg font-black text-slate-900 w-12">{s.occupancy.toFixed(0)}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
