import React, { useState, useEffect } from 'react';
import { 
  Printer, ArrowLeft, TrendingUp, Save, 
  Loader2, Award, ShieldCheck, Activity,
  BookOpen, Target, ArrowUpRight, Zap
} from 'lucide-react';
import { useSearchParams, useNavigate } from '../router';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { PerformanceRow, RegistryStudent } from '../types';

const CONCEPTS = {
  'DI': { label: 'Insatisfatório', color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', val: 1 },
  'EP': { label: 'Em Processo', color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', val: 2 },
  'DB': { label: 'Bom', color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', val: 3 },
  'DE': { label: 'Excelente', color: 'bg-indigo-600', text: 'text-indigo-700', bg: 'bg-indigo-50', val: 4 },
  '': { label: 'Pendente', color: 'bg-slate-200', text: 'text-slate-400', bg: 'bg-slate-50', val: 0 }
};

const ProgressionVisual = ({ data }: { data: PerformanceRow[] }) => {
    const units = ['Unidade I', 'Unidade II', 'Unidade III'];
    const scores = units.map((_, idx) => {
        let count = 0; let sum = 0;
        data.forEach(row => {
            const concept = row.g1?.[idx] as keyof typeof CONCEPTS;
            if (concept && CONCEPTS[concept]) { sum += CONCEPTS[concept].val; count++; }
        });
        return count > 0 ? (sum / count) : 0;
    });

    const height = 140; const width = 500; const padding = 40;
    const points = scores.map((s, i) => {
        const x = padding + (i * (width - padding * 2) / (units.length - 1));
        const y = height - padding - (s * (height - padding * 2) / 4);
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="bg-white p-14 rounded-[4.5rem] border border-slate-100 shadow-luxury flex flex-col lg:flex-row items-center gap-14 overflow-hidden relative group fade-in-premium">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full -mr-40 -mt-40 opacity-40 group-hover:scale-110 transition-transform duration-1000"></div>
            
            <div className="shrink-0 relative z-10 text-center lg:text-left">
                <div className="bg-emerald-600 w-20 h-20 rounded-[2rem] shadow-xl shadow-emerald-100 flex items-center justify-center mb-8 animate-luxury-float mx-auto lg:mx-0">
                    <Activity className="h-10 w-10 text-white" />
                </div>
                <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-1">Rendimento Global</h4>
                <p className="text-7xl font-black text-slate-900 mt-4 tracking-tighter leading-none">
                  {(scores.reduce((a,b)=>a+b,0)/3).toFixed(1)} 
                  <span className="text-xs font-black text-emerald-500 ml-3 uppercase tracking-ultra">Score Nom.</span>
                </p>
            </div>

            <div className="flex-1 h-[180px] relative z-10 w-full px-10">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="gradPath" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopColorOpacity="0.2" />
                            <stop offset="100%" stopColor="#10b981" stopColorOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d={`M ${padding} ${height - padding} L ${points} L ${width - padding} ${height - padding} Z`} fill="url(#gradPath)" />
                    <polyline points={points} fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    {scores.map((s, i) => {
                        const x = padding + (i * (width - padding * 2) / (units.length - 1));
                        const y = height - padding - (s * (height - padding * 2) / 4);
                        return (
                            <g key={i} className="hover:scale-125 transition-transform origin-center cursor-pointer">
                                <circle cx={x} cy={y} r="12" fill="#10b981" />
                                <circle cx={x} cy={y} r="6" fill="white" />
                                <text x={x} y={y - 30} textAnchor="middle" fontSize="12" fontWeight="900" className="fill-slate-900 uppercase tracking-widest">{units[i]}</text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="bg-slate-900 p-14 rounded-[3.5rem] text-white min-w-[280px] shadow-2xl relative overflow-hidden group/card">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -mr-12 -mt-12 group-hover/card:scale-150 transition-transform duration-700"></div>
                <Zap className="h-8 w-8 text-emerald-400 mb-8" />
                <p className="text-[11px] font-black uppercase tracking-widest opacity-40 mb-4">Vigência de Rede</p>
                <div className="flex items-center gap-5">
                    <div className="h-4 w-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]"></div>
                    <span className="text-3xl font-black tracking-tight">Sincronizado</span>
                </div>
            </div>
        </div>
    );
};

export const PerformanceIndicators: React.FC = () => {
  const { students, updateStudents } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const studentId = params.get('studentId');
  const [currentStudent, setCurrentStudent] = useState<RegistryStudent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [performanceData, setPerformanceData] = useState<PerformanceRow[]>([]);

  useEffect(() => {
    if (studentId) {
        const student = students.find(s => s.id === studentId);
        if (student) {
            setCurrentStudent(student);
            setPerformanceData(student.performanceHistory?.length ? student.performanceHistory : [
                { subject: 'LÍNGUA PORTUGUESA', g1: ['', '', ''] },
                { subject: 'MATEMÁTICA', g1: ['', '', ''] },
                { subject: 'CIÊNCIAS', g1: ['', '', ''] },
                { subject: 'ARTES', g1: ['', '', ''] },
                { subject: 'EDUCAÇÃO FÍSICA', g1: ['', '', ''] }
            ]);
        }
    }
  }, [studentId, students]);

  const handleConceptCycle = (rowIdx: number, colIdx: number) => {
    const order: (keyof typeof CONCEPTS)[] = ['', 'DI', 'EP', 'DB', 'DE'];
    const current = (performanceData[rowIdx].g1?.[colIdx] || '') as keyof typeof CONCEPTS;
    const nextIdx = (order.indexOf(current) + 1) % order.length;
    const newData = [...performanceData];
    if (!newData[rowIdx].g1) newData[rowIdx].g1 = ['', '', ''];
    newData[rowIdx].g1[colIdx] = order[nextIdx];
    setPerformanceData(newData);
  };

  const handleSave = async () => {
      if (!currentStudent) return;
      setIsSaving(true);
      try {
          await updateStudents([{ ...currentStudent, performanceHistory: performanceData }]);
          addToast("Prontuário nominal atualizado.", "success");
      } catch (e) { addToast("Erro na comunicação.", "error"); }
      finally { setIsSaving(false); }
  };

  if (!currentStudent) return null;

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-24 px-8 fade-in-premium page-transition">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-24 gap-12">
            <div className="space-y-10">
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition group">
                    <div className="bg-slate-100 p-3 rounded-2xl group-hover:bg-emerald-50 transition-colors">
                      <ArrowLeft className="h-5 w-5" />
                    </div> Voltar ao Painel
                </button>
                <h1 className="text-8xl font-black text-slate-900 tracking-tighter leading-none mb-6 text-display uppercase">
                  Monitor de <br/><span className="text-emerald-600">Aprendizado.</span>
                </h1>
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-[2.5rem] bg-slate-900 flex items-center justify-center overflow-hidden shadow-2xl border-[6px] border-white">
                        {currentStudent.photo ? <img src={currentStudent.photo} className="w-full h-full object-cover" /> : <BookOpen className="h-8 w-8 text-white" />}
                    </div>
                    <div>
                        <p className="text-slate-900 font-black text-3xl tracking-tighter leading-none uppercase">{currentStudent.name}</p>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-4">Matrícula nominal SME: {currentStudent.enrollmentId || currentStudent.id}</p>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                <button onClick={() => window.print()} className="p-8 bg-white border border-slate-100 text-slate-400 rounded-[3rem] hover:text-emerald-600 transition-all hover:shadow-2xl shadow-slate-100 active:scale-95"><Printer className="h-7 w-7" /></button>
                <button 
                    onClick={handleSave} disabled={isSaving}
                    className="flex items-center gap-7 px-16 py-8 bg-slate-900 text-white rounded-[3.5rem] font-black text-[12px] uppercase tracking-ultra hover:bg-emerald-600 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                    Sincronizar Boletim
                </button>
            </div>
        </header>

        <div className="mb-24">
            <ProgressionVisual data={performanceData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
                <div className="card-requinte overflow-hidden">
                    <div className="bg-slate-50/50 px-16 py-12 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-5">
                            <Target className="h-6 w-6 text-emerald-600" /> Matriz BNCC de Competências
                        </h3>
                        <div className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-ultra border border-emerald-100">
                            Ciclo Digital 2025
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-16 py-12 text-[12px] font-black text-slate-500 uppercase tracking-widest w-1/3">Área de Conhecimento</th>
                                    {['UNID I', 'UNID II', 'UNID III'].map(u => (
                                        <th key={u} className="px-8 py-12 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">{u}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {performanceData.map((row, rIdx) => (
                                    <tr key={row.subject} className="group transition-all hover:bg-emerald-50/20">
                                        <td className="px-16 py-14">
                                            <p className="font-black text-slate-800 text-2xl tracking-tighter uppercase">{row.subject}</p>
                                        </td>
                                        {[0, 1, 2].map(cIdx => {
                                            const val = (row.g1?.[cIdx] || '') as keyof typeof CONCEPTS;
                                            const style = CONCEPTS[val];
                                            return (
                                                <td key={cIdx} className="px-8 py-14 text-center">
                                                    <button 
                                                        onClick={() => handleConceptCycle(rIdx, cIdx)}
                                                        className={`w-28 h-28 mx-auto rounded-[2.5rem] border-2 flex flex-col items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 ${val ? `${style.bg} ${style.text} border-transparent shadow-xl` : 'bg-slate-50/30 border-dashed border-slate-200 text-slate-300'}`}
                                                    >
                                                        <span className="text-3xl font-black tracking-tighter leading-none">{val || '--'}</span>
                                                        <span className="text-[9px] font-black uppercase tracking-tighter opacity-70 mt-2">{style.label}</span>
                                                    </button>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-12">
                <div className="bg-white p-16 rounded-[4.5rem] border border-slate-100 shadow-xl shadow-slate-100">
                    <h3 className="font-black text-slate-900 mb-16 flex items-center gap-6 text-4xl tracking-tighter">
                        <Award className="h-12 w-12 text-emerald-600" /> Legenda
                    </h3>
                    <div className="space-y-10">
                        {Object.entries(CONCEPTS).filter(([k]) => k !== '').map(([key, info]) => (
                            <div key={key} className="flex items-center gap-10 group">
                                <div className={`${info.bg} ${info.text} w-24 h-24 rounded-[2.5rem] flex items-center justify-center font-black text-3xl shadow-sm transition-all group-hover:scale-110`}>{key}</div>
                                <div>
                                    <p className="font-black text-slate-800 text-2xl tracking-tighter leading-none">{info.label}</p>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4">Competência Nível {info.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-emerald-600 p-16 rounded-[5rem] text-white shadow-2xl shadow-emerald-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
                    <ShieldCheck className="h-16 w-16 mb-12 opacity-50" />
                    <h3 className="text-5xl font-black tracking-tighter mb-8 leading-tight">Certificação SME</h3>
                    <p className="text-emerald-50 text-xl font-medium leading-relaxed mb-16">Documento validado via rede municipal de ensino para fins de histórico escolar digital.</p>
                    <div className="flex items-center justify-between pt-10 border-t border-emerald-500/50">
                        <span className="text-[12px] font-black uppercase tracking-ultra">ITABERABA • 2025</span>
                        <ArrowUpRight className="h-10 w-10" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};