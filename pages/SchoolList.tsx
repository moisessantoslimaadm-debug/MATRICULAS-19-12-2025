import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from '../router';
import { useToast } from '../contexts/ToastContext';
import { useLog } from '../contexts/LogContext';
import { 
  MapPin, Search, Building, Users, 
  Layers, ArrowRight, ShieldCheck, 
  Clock, HeartPulse, Bus, Database, Info, MoreVertical,
  FolderOpen, AlertTriangle
} from 'lucide-react';
import { School, RegistryStudent } from '../types';

const TabButton = ({ active, label, icon: Icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${active ? 'bg-[#0F172A] text-white shadow-xl scale-105' : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-100'}`}
  >
    <Icon className={`h-3 w-3 md:h-4 md:w-4 ${active ? 'text-blue-400' : 'text-slate-300'}`} />
    {label}
  </button>
);

const SchoolCard: React.FC<{ school: School }> = ({ school }) => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { addLog } = useLog();

    // Validação robusta de coordenadas para exibição
    const hasValidGeo = 
        typeof school.lat === 'number' && 
        !isNaN(school.lat) && 
        isFinite(school.lat) &&
        Math.abs(school.lat) <= 90 &&
        typeof school.lng === 'number' && 
        !isNaN(school.lng) &&
        isFinite(school.lng) &&
        Math.abs(school.lng) <= 180;

    const handleSolicitarVaga = () => {
        if (!hasValidGeo) {
            addLog(`[SchoolCard] Tentativa de matrícula em escola com geo inválida: ${school.name}`, 'warning');
            // Não bloqueamos a matrícula, mas registramos o aviso
        }
        navigate('/registration');
    };

    return (
        <div className="card-requinte group overflow-hidden flex flex-col h-full hover:-translate-y-2 cursor-pointer">
            <div className="h-32 md:h-40 relative overflow-hidden border-b border-slate-100">
                <img src={school.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={school.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-3 left-4">
                    <span className="text-[8px] font-black text-white/70 uppercase tracking-widest">INEP: {school.inep || '---'}</span>
                </div>
            </div>
            <div className="p-6 md:p-8 flex flex-col flex-1">
                <h3 className="font-black text-slate-900 text-sm md:text-base uppercase tracking-tight mb-2 leading-tight">{school.name}</h3>
                <div className="space-y-2 mb-6">
                    <p className="text-[9px] text-slate-400 flex items-center gap-2 font-bold uppercase truncate">
                        {hasValidGeo ? (
                            <MapPin className="h-3 w-3 text-blue-500 shrink-0" />
                        ) : (
                            <span title="Localização não validada" className="shrink-0 flex items-center">
                                <AlertTriangle className="h-3 w-3 text-amber-500" />
                            </span>
                        )}
                        {school.address}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {school.types.map(t => (
                            <span key={t} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[7px] font-black uppercase rounded-md border border-blue-100">{t}</span>
                        ))}
                    </div>
                </div>
                <button 
                  onClick={handleSolicitarVaga}
                  className="mt-auto w-full py-3 bg-slate-50 hover:bg-[#0F172A] hover:text-white text-slate-900 text-[9px] font-black uppercase tracking-ultra rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-100 hover:border-[#0F172A]"
                >
                    Solicitar Vaga <ArrowRight className="h-3 w-3" />
                </button>
            </div>
        </div>
    );
};

export const SchoolList: React.FC = () => {
  const navigate = useNavigate();
  const { schools, students } = useData();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'units' | 'students' | 'classes'>('units');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = useMemo(() => students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.cpf.includes(searchTerm) ||
    s.school?.toLowerCase().includes(searchTerm.toLowerCase())
  ), [students, searchTerm]);

  const classes = useMemo(() => {
    const classMap: Record<string, any> = {};
    students.forEach(s => {
      const key = s.classCode || s.className || 'sem-turma';
      if (key !== 'sem-turma' && !classMap[key]) {
        classMap[key] = {
          name: s.className,
          code: s.classCode,
          school: s.school,
          schedule: s.classSchedule || 'Não informado',
          hours: s.weeklyHours || '---',
          count: 0
        };
      }
      if (classMap[key]) classMap[key].count++;
    });
    return Object.values(classMap);
  }, [students]);

  const handleExportPublicData = () => {
    const headers = ["NOME_ALUNO", "INEP_MEC", "ESCOLA", "TURMA", "STATUS"];
    const csvContent = [
        headers.join(';'),
        ...filteredStudents.map(s => [
            `"${s.name}"`,
            s.inepId || '',
            `"${s.school}"`,
            `"${s.className || ''}"`,
            s.status
        ].join(';'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `base_publica_inep_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Base pública baixada.", "success");
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-16 px-6 md:px-8 page-transition">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-slate-100 pb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="bg-[#0F172A] p-3 rounded-2xl text-white shadow-xl"><Building className="h-6 w-6" /></div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Censo de <br/><span className="text-blue-600">Rede Nominal.</span></h1>
                </div>
            </div>
            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Itaberaba • SME • Educacenso 2025</p>
          </div>
          
          <div className="flex gap-2 md:gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            <TabButton active={activeTab === 'units'} label="Unidades" icon={Building} onClick={() => setActiveTab('units')} />
            <TabButton active={activeTab === 'students'} label="Alunos (Inep)" icon={Users} onClick={() => setActiveTab('students')} />
            <TabButton active={activeTab === 'classes'} label="Quadro de Turmas" icon={Layers} onClick={() => setActiveTab('classes')} />
          </div>
        </header>

        <div className="relative group max-w-2xl w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
          <input 
            type="text" 
            placeholder="Buscar por unidade, nome do aluno ou CPF..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            className="input-premium pl-16 !h-14 !text-[11px] !bg-white" 
          />
        </div>

        {activeTab === 'units' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {schools.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                <SchoolCard key={s.id} school={s} />
            ))}
          </div>
        )}

        {activeTab === 'students' && (
          <div className="card-requinte !p-0 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/30">
                <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tighter">Censo Nominal de Alunos por Inep</h2>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 md:px-8 py-4 md:py-6 text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Estudante (Educacenso)</th>
                            <th className="px-6 md:px-8 py-4 md:py-6 text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Metadados Técnicos</th>
                            <th className="px-6 md:px-8 py-4 md:py-6 text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Vínculo Escolar / Turma</th>
                            <th className="px-6 md:px-8 py-4 md:py-6 text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Atributos SME</th>
                            <th className="px-6 md:px-8 py-4 md:py-6 text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-6 md:px-8 py-4 md:py-6 text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredStudents.map(s => (
                            <tr key={s.id} className="hover:bg-slate-50/50 transition-all group">
                                <td className="px-6 md:px-8 py-4 md:py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-blue-600 shadow-sm">{s.name.charAt(0)}</div>
                                        <div>
                                            <p className="text-[10px] md:text-[11px] font-black text-slate-900 uppercase tracking-tight">{s.name}</p>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">ID MEC: {s.inepId || '---'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 md:px-8 py-4 md:py-6">
                                    <p className="text-[9px] md:text-[10px] font-bold text-slate-700 font-mono tracking-tighter">{s.cpf}</p>
                                    <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{s.race} • {s.sex}</p>
                                    <p className="text-[7px] text-slate-400 font-bold uppercase mt-0.5">Zona: {s.residenceZone || 'Urbana'}</p>
                                </td>
                                <td className="px-6 md:px-8 py-4 md:py-6">
                                    <p className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase truncate max-w-[150px] md:max-w-[200px]">{s.school}</p>
                                    <div className="flex flex-col gap-0.5 mt-1">
                                        <p className="text-[7px] md:text-[8px] font-black text-blue-600 uppercase tracking-widest">{s.className || 'Não Alocado'}</p>
                                        <p className="text-[7px] text-slate-400 uppercase font-black tracking-tighter">{s.classSchedule}</p>
                                    </div>
                                </td>
                                <td className="px-6 md:px-8 py-4 md:py-6">
                                    <div className="flex justify-center gap-3 md:gap-4">
                                        <div className="flex flex-col items-center gap-1">
                                            <HeartPulse className={`h-4 w-4 ${s.specialNeeds ? 'text-pink-500' : 'text-slate-200'}`} />
                                            <span className="text-[6px] font-black text-slate-400 uppercase">AEE</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <Bus className={`h-4 w-4 ${s.transportRequest ? 'text-blue-500' : 'text-slate-200'}`} />
                                            <span className="text-[6px] font-black text-slate-400 uppercase">Transp.</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                            <span className="text-[6px] font-black text-slate-400 uppercase">Audit.</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                                    <span className={`px-3 md:px-4 py-1.5 rounded-lg text-[7px] md:text-[8px] font-black uppercase tracking-widest border ${s.status === 'Matriculado' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                        {s.status}
                                    </span>
                                </td>
                                <td className="px-6 md:px-8 py-4 md:py-6 text-right">
                                    <button 
                                        onClick={() => navigate(`/student/monitoring?id=${s.id}`)}
                                        className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-500 rounded-xl transition-all text-[8px] md:text-[9px] font-black uppercase tracking-wide group/btn"
                                    >
                                        <FolderOpen className="h-3 w-3" /> <span className="hidden md:inline">Ver Pasta</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {classes.map((c: any) => (
                    <div key={c.code || c.name} className="card-requinte !p-6 md:!p-8 flex flex-col justify-between group">
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg"><Layers className="h-5 w-5" /></div>
                                <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">Cód: {c.code}</span>
                            </div>
                            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-tight mb-4">{c.name}</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Clock className="h-4 w-4" /></div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Horário Funcionamento</p>
                                        <p className="text-[10px] font-black text-slate-700 uppercase">{c.schedule}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Building className="h-4 w-4" /></div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Unidade Alocadora</p>
                                        <p className="text-[10px] font-black text-slate-700 uppercase truncate max-w-[200px]">{c.school}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Info className="h-4 w-4" /></div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Carga Horária Semanal</p>
                                        <p className="text-[10px] font-black text-slate-700 uppercase">{c.hours}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 md:mt-10 pt-6 border-t border-slate-50 flex justify-between items-center">
                            <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Censo Nominal</p>
                                <p className="text-xl font-black text-slate-900 tracking-tighter">{c.count} Alunos</p>
                            </div>
                            <button className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}

        <div className="mt-8 md:mt-12 bg-[#0F172A] p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6 md:gap-8">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500/20 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center backdrop-blur-xl border border-white/10">
                        <Database className="h-8 w-8 md:h-10 md:w-10 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-xl md:text-2xl font-black tracking-tight uppercase">Base Síncrona MEC</h3>
                        <p className="text-blue-200/60 text-xs font-medium mt-2">Dados auditados via Educacenso 2025 • Integração Nominal SME Itaberaba.</p>
                    </div>
                </div>
                <button onClick={handleExportPublicData} className="w-full md:w-auto px-8 md:px-10 py-4 md:py-5 bg-white text-slate-900 rounded-[2rem] text-[10px] font-black uppercase tracking-ultra hover:bg-blue-50 transition-all shadow-xl">
                    Exportar Base Nominal Inep
                </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        </div>
      </div>
    </div>
  );
};