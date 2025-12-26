import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { 
  Printer, Download, 
  School as SchoolIcon, Users, HeartPulse, Bus, 
  TrendingUp, Database, ArrowRight, Layers, Target, ShieldCheck
} from 'lucide-react';

// Otimização: Gráfico memoizado para evitar recalculo visual desnecessário
const CustomPieChart = React.memo(({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  if (total === 0) return <div className="text-center text-slate-400 py-10">Sem dados síncronos</div>;

  return (
    <div className="flex flex-col xl:flex-row items-center gap-10 md:gap-16 justify-center">
      <div className="relative w-48 h-48 md:w-64 md:h-64 shrink-0 drop-shadow-2xl">
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
            <div className="bg-white/80 backdrop-blur-xl w-20 h-20 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center shadow-inner border border-white/40">
                <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</span>
                <span className="text-xl md:text-2xl font-black text-slate-900">{total}</span>
            </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:gap-5 w-full">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 md:p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-luxury transition-all group">
            <div className="flex items-center gap-4 md:gap-6">
                <span className="w-4 h-4 md:w-5 md:h-5 rounded-[0.8rem] shadow-sm group-hover:rotate-45 transition-transform" style={{ backgroundColor: item.color }}></span>
                <div>
                    <span className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.label}</span>
                    <p className="text-lg md:text-xl font-black text-slate-900 mt-1">{item.value} <span className="text-[9px] md:text-[10px] text-slate-400 ml-2">({((item.value/total)*100).toFixed(1)}%)</span></p>
                </div>
            </div>
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-slate-200 group-hover:text-slate-900 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
});

// Otimização: Componente estático memoizado
const HighDensityStat = React.memo(({ title, value, icon: Icon, colorClass, sub }: any) => (
    <div className="card-requinte !p-8 md:!p-12 flex flex-col justify-between group h-56 md:h-64">
        <div className="flex justify-between items-start">
            <div className={`p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] ${colorClass} text-white shadow-2xl transition-all group-hover:rotate-12 group-hover:scale-110 duration-700`}>
                <Icon className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <div className="bg-slate-50 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <Target className="h-3 w-3 md:h-4 md:w-4 text-slate-400" />
            </div>
        </div>
        <div>
            <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2 md:mb-3">{title}</p>
            <h3 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-2 md:mb-3">{value}</h3>
            <p className="text-[9px] md:text-[10px] font-bold text-slate-300 uppercase tracking-widest">{sub}</p>
        </div>
    </div>
));

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

    const handleExportCSV = () => {
        const headers = ["ESCOLA", "TOTAL_ALUNOS", "AEE", "CAPACIDADE_VAGAS", "TAXA_OCUPACAO"];
        const csvContent = [
            headers.join(';'),
            ...schoolComparison.map(s => [
                `"${s.name}"`,
                s.total,
                s.aee,
                s.capacity,
                s.occupancy.toFixed(2) + '%'
            ].join(';'))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `relatorio_rede_sme_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast("Base analítica exportada com sucesso.", "success");
    };

    return (
        <div className="min-h-screen bg-[#fcfdfe] py-16 px-6 md:py-24 md:px-12 page-transition">
            <div className="max-w-[1600px] mx-auto space-y-16 md:space-y-24">
                <header className="flex flex-col 2xl:flex-row justify-between items-start 2xl:items-end gap-10 md:gap-12 no-print">
                    <div className="space-y-6 md:space-y-10">
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-blue-600 animate-pulse shadow-[0_0_20px_rgba(37,99,235,0.6)]"></div>
                            <span className="text-[10px] md:text-[12px] font-black text-slate-400 uppercase tracking-[0.5em]">Núcleo de Inteligência SME Itaberaba</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl xl:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9] text-display break-words">Informações <br/><span className="text-blue-600">Gerais.</span></h1>
                    </div>
                    <div className="flex flex-wrap gap-4 md:gap-6 w-full md:w-auto">
                        <button onClick={() => window.print()} className="btn-primary !h-16 md:!h-24 !px-8 md:!px-16 !bg-white !text-slate-900 border border-slate-100 shadow-luxury hover:!bg-slate-50 flex-1 md:flex-none">
                            <Printer className="h-5 w-5 md:h-7 md:w-7" /> PDF
                        </button>
                        <button onClick={handleExportCSV} className="btn-primary !h-16 md:!h-24 !px-8 md:!px-16 !bg-slate-900 shadow-blue-900/10 flex-1 md:flex-none">
                            <Download className="h-5 w-5 md:h-7 md:w-7" /> CSV MEC
                        </button>
                    </div>
                </header>

                <div className="flex flex-col md:flex-row p-3 md:p-4 bg-white border border-slate-100 rounded-[2.5rem] md:rounded-[3rem] w-full md:w-fit shadow-luxury no-print gap-2 md:gap-0">
                    <button 
                        onClick={() => setActiveTab('overview')} 
                        className={`px-8 md:px-16 py-4 md:py-6 rounded-[2rem] md:rounded-[2.2rem] text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${activeTab === 'overview' ? 'bg-[#0F172A] text-white shadow-2xl scale-100 md:scale-105' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                        Visão Estratégica
                    </button>
                    <button 
                        onClick={() => setActiveTab('audit')} 
                        className={`px-8 md:px-16 py-4 md:py-6 rounded-[2rem] md:rounded-[2.2rem] text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${activeTab === 'audit' ? 'bg-[#0F172A] text-white shadow-2xl scale-100 md:scale-105' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                        Auditoria Nominal
                    </button>
                </div>

                {activeTab === 'overview' && (
                    <div className="space-y-12 md:space-y-20 animate-in fade-in duration-1000">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 md:gap-12">
                             <HighDensityStat title="Censo Total" value={students.length} icon={Users} colorClass="bg-slate-900" sub="Registros Auditados" />
                             <HighDensityStat title="Pastas AEE" value={students.filter(s => s.specialNeeds).length} icon={HeartPulse} colorClass="bg-pink-600" sub="Inclusão Ativa" />
                             <HighDensityStat title="Frotas Rurais" value={students.filter(s => s.transportRequest).length} icon={Bus} colorClass="bg-blue-600" sub="Itinerários Logísticos" />
                             <HighDensityStat title="Unidades" value={schools.length} icon={SchoolIcon} colorClass="bg-emerald-600" sub="Rede Municipal Ativa" />
                        </div>

                        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8 md:gap-12">
                            <div className="card-requinte !p-8 md:!p-20 relative overflow-hidden group">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-4">
                                    <h3 className="text-[11px] md:text-[13px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-4 md:gap-5">
                                        <Layers className="h-5 w-5 md:h-7 md:w-7 text-blue-600" /> Fluxo de Operação
                                    </h3>
                                    <span className="text-[9px] md:text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-blue-100 uppercase">Tempo Real</span>
                                </div>
                                <CustomPieChart data={statusDistribution} />
                                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-50 rounded-full blur-[100px] opacity-40 group-hover:scale-150 transition-transform duration-[4s]"></div>
                            </div>

                            <div className="card-requinte !p-8 md:!p-20 flex flex-col justify-between group">
                                <div className="space-y-8 md:space-y-12">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[11px] md:text-[13px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-4 md:gap-5">
                                            <TrendingUp className="h-5 w-5 md:h-7 md:w-7 text-emerald-600" /> Rendimento de Vagas
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span className="text-[9px] md:text-[11px] font-black text-emerald-600 uppercase hidden sm:block">Base MEC</span>
                                        </div>
                                    </div>
                                    <div className="space-y-6 md:space-y-10">
                                        {schoolComparison.slice(0, 4).map(s => (
                                            <div key={s.name} className="space-y-3 md:space-y-5">
                                                <div className="flex justify-between items-end">
                                                    <div className="space-y-1 flex-1 pr-4">
                                                        <p className="text-base md:text-xl font-black text-slate-900 tracking-tight uppercase truncate">{s.name}</p>
                                                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.total} de {s.capacity} Vagas Nominais</p>
                                                    </div>
                                                    <span className="text-lg md:text-2xl font-black text-slate-900">{s.occupancy.toFixed(0)}%</span>
                                                </div>
                                                <div className="h-3 md:h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                                                    <div className={`h-full ${s.occupancy > 90 ? 'bg-red-500' : 'bg-blue-600'} transition-all duration-[2s] group-hover:animate-pulse`} style={{ width: `${Math.min(s.occupancy, 100)}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => setActiveTab('audit')} className="mt-10 md:mt-16 w-full py-5 md:py-6 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] md:text-[11px] uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all shadow-xl">Ver Relatório Completo</button>
                            </div>
                        </div>

                        <div className="card-requinte !p-8 md:!p-20 overflow-hidden">
                            <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-20 gap-8 md:gap-10">
                                <div className="space-y-4 text-center md:text-left">
                                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Mapa de <br/><span className="text-blue-600">Lotação Síncrona.</span></h3>
                                    <p className="text-slate-400 text-sm md:text-base font-medium">Consolidado nominal por unidade escolar ativa no Educacenso 2025.</p>
                                </div>
                                <div className="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] text-white flex items-center gap-6 md:gap-8 shadow-2xl relative overflow-hidden w-full md:w-auto justify-center md:justify-start">
                                    <Database className="h-8 w-8 md:h-10 md:w-10 text-emerald-400" />
                                    <div>
                                        <p className="text-[9px] md:text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-1 md:mb-2">Base MEC Itaberaba</p>
                                        <p className="text-xl md:text-2xl font-black tracking-tight uppercase">Sincronismo Ativo</p>
                                    </div>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'audit' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                         <div className="card-requinte !p-12 md:!p-20 text-center">
                            <ShieldCheck className="h-16 w-16 md:h-24 md:w-24 text-slate-200 mx-auto mb-6 md:mb-8" />
                            <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Auditoria de Conformidade</h3>
                            <p className="text-slate-400 mt-4 font-medium text-lg max-w-xl mx-auto">Os relatórios de auditoria nominal e compliance com o Educacenso estão sendo gerados pelo núcleo de processamento.</p>
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};