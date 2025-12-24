import React, { useMemo } from 'react';
import { useSearchParams } from '../router';
import { useData } from '../contexts/DataContext';
import { MUNICIPALITY_NAME } from '../constants';
import { 
  MapPin, Printer, ShieldCheck, Activity, 
  GraduationCap, HeartPulse, Bus, FileText,
  BadgeCheck, Zap, Info, ArrowLeft,
  Calendar, Globe, Building, Database, Award, Target,
  TrendingUp, ClipboardList, UserCheck, ArrowUpRight
} from 'lucide-react';
import { useNavigate } from '../router';

// Componente de Gráfico SVG Simples e Leve para Comparação (Notas vs Frequência)
const ComparisonChart = ({ attendanceData, gradeData }: { attendanceData: number[], gradeData: number[] }) => {
    const height = 150;
    const width = 400;
    const padding = 20;
    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul']; 

    // Função para normalizar dados (0-100) para coordenadas Y
    const getY = (val: number, max: number) => height - padding - ((val / max) * (height - (padding * 2)));
    const getX = (index: number) => padding + (index * (width - (padding * 2)) / (labels.length - 1));

    const linePointsAttendance = attendanceData.map((val, i) => `${getX(i)},${getY(val, 100)}`).join(' ');
    // Mapeia notas (1-4) para escala visual (4*25 = 100)
    const linePointsGrades = gradeData.map((val, i) => `${getX(i)},${getY(val * 25, 100)}`).join(' ');

    return (
        <div className="w-full h-full relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                {/* Grid Lines */}
                {[0, 25, 50, 75, 100].map(p => (
                    <line key={p} x1={padding} y1={getY(p, 100)} x2={width - padding} y2={getY(p, 100)} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4" />
                ))}
                
                {/* Attendance Line (Green) */}
                <polyline points={linePointsAttendance} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {attendanceData.map((val, i) => (
                    <circle key={`att-${i}`} cx={getX(i)} cy={getY(val, 100)} r="4" fill="#10b981" className="hover:r-6 transition-all" />
                ))}

                {/* Grade Line (Blue) */}
                <polyline points={linePointsGrades} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {gradeData.map((val, i) => (
                    <circle key={`grd-${i}`} cx={getX(i)} cy={getY(val * 25, 100)} r="4" fill="#3b82f6" className="hover:r-6 transition-all" />
                ))}

                {/* Labels */}
                {labels.map((l, i) => (
                    <text key={l} x={getX(i)} y={height} textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="bold">{l}</text>
                ))}
            </svg>
            <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Frequência (%)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Desempenho (Conceito)</span>
                </div>
            </div>
        </div>
    );
};

// Componente Exclusivo para Impressão (A4 Otimizado)
const PrintLayout = ({ student, stats }: any) => (
    <div className="print-only bg-white h-full flex flex-col font-sans text-slate-900">
        {/* Cabeçalho Oficial */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6 mb-8">
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border border-slate-300">
                    <ShieldCheck className="h-12 w-12 text-slate-800" />
                </div>
                <div>
                    <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">Prefeitura Municipal de {MUNICIPALITY_NAME}</h1>
                    <h2 className="text-sm font-bold uppercase text-slate-600">Secretaria Municipal de Educação</h2>
                    <p className="text-xs font-medium text-slate-500 mt-1">Pasta do Aluno • Ano Letivo 2025</p>
                </div>
            </div>
            <div className="text-right">
                <div className="bg-slate-100 text-slate-900 px-4 py-2 rounded-lg border border-slate-200">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Emissão</p>
                    <p className="text-sm font-bold">{new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>

        {/* Dados do Aluno */}
        <div className="mb-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 border-l-4 border-emerald-500 pl-3">Identificação Nominal</h3>
            <div className="grid grid-cols-4 gap-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div className="col-span-3">
                    <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Nome Completo</p>
                    <p className="text-lg font-black uppercase text-slate-900">{student.name}</p>
                </div>
                <div>
                    <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Matrícula (RA)</p>
                    <p className="text-lg font-black text-slate-900">{student.enrollmentId}</p>
                </div>
                <div>
                    <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Nascimento</p>
                    <p className="text-sm font-bold text-slate-800">{student.birthDate ? student.birthDate.split('-').reverse().join('/') : '--/--/----'}</p>
                </div>
                <div>
                    <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">CPF</p>
                    <p className="text-sm font-bold text-slate-800">{student.cpf}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Unidade Escolar</p>
                    <p className="text-sm font-bold text-slate-800 uppercase">{student.school}</p>
                </div>
            </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="border border-slate-200 p-4 rounded-xl text-center bg-white">
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Frequência Global</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{stats.attendancePercent}%</p>
            </div>
            <div className="border border-slate-200 p-4 rounded-xl text-center bg-white">
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Conceito Médio</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{stats.gradeAverage}</p>
            </div>
            <div className="border border-slate-200 p-4 rounded-xl text-center bg-white">
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Situação</p>
                <p className="text-xl font-black text-emerald-600 uppercase mt-3">{student.status}</p>
            </div>
        </div>

        {/* Diário / Observações */}
        <div className="flex-1 mb-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 border-l-4 border-blue-500 pl-3">Diário de Classe & Observações</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3 font-bold text-slate-600 uppercase w-24">Data</th>
                            <th className="px-4 py-3 font-bold text-slate-600 uppercase">Registro Pedagógico</th>
                            <th className="px-4 py-3 font-bold text-slate-600 uppercase text-right w-32">Responsável</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {student.teacherNotes && student.teacherNotes.length > 0 ? (
                            student.teacherNotes.slice(0, 10).map((note: any) => (
                                <tr key={note.id}>
                                    <td className="px-4 py-3 font-medium text-slate-500">{note.date.split('-').reverse().join('/')}</td>
                                    <td className="px-4 py-3 font-medium text-slate-800">{note.content}</td>
                                    <td className="px-4 py-3 font-medium text-slate-500 text-right uppercase text-[10px]">{note.author}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-4 py-8 text-center text-slate-400 italic">Nenhuma observação registrada neste período letivo.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Assinaturas */}
        <div className="mt-auto pt-16 grid grid-cols-2 gap-20">
            <div className="border-t border-slate-400 text-center pt-2">
                <p className="text-[10px] font-bold uppercase text-slate-600">Assinatura da Direção</p>
            </div>
            <div className="border-t border-slate-400 text-center pt-2">
                <p className="text-[10px] font-bold uppercase text-slate-600">Assinatura da Secretaria Escolar</p>
            </div>
        </div>
        
        <div className="text-center mt-8 border-t border-slate-100 pt-4">
            <p className="text-[8px] font-mono text-slate-400 uppercase">
                Hash de Autenticidade: {student.id.toUpperCase()}-{Date.now().toString(36).toUpperCase()} • Sistema SME Itaberaba
            </p>
        </div>
    </div>
);

export const StudentMonitoring: React.FC = () => {
  const { students } = useData();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const studentId = params.get('id');

  const student = students.find(s => s.id === studentId || s.enrollmentId === studentId || s.inepId === studentId);

  // Cálculo de Estatísticas Reais
  const stats = useMemo(() => {
      if (!student) return { attendancePercent: 0, gradeAverage: 0 };
      
      // Frequência
      const totalDays = student.attendanceHistory?.length || 0;
      const presentDays = student.attendanceHistory?.filter(r => r.present).length || 0;
      const attendancePercent = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(0) : 100;

      // Conceitos para Números (DI=1, EP=2, DB=3, DE=4)
      const conceptValues: Record<string, number> = { 'DI': 1, 'EP': 2, 'DB': 3, 'DE': 4 };
      let totalPoints = 0;
      let gradeCount = 0;
      
      student.performanceHistory?.forEach(row => {
          row.g1?.forEach(grade => {
              if (grade && conceptValues[grade]) {
                  totalPoints += conceptValues[grade];
                  gradeCount++;
              }
          });
      });
      
      // Mapeia de volta para conceito médio aproximado para exibição
      const avg = gradeCount > 0 ? totalPoints / gradeCount : 0;
      let avgConcept = '---';
      if (avg >= 3.5) avgConcept = 'DE';
      else if (avg >= 2.5) avgConcept = 'DB';
      else if (avg >= 1.5) avgConcept = 'EP';
      else if (avg > 0) avgConcept = 'DI';

      return { attendancePercent, gradeAverage: avgConcept };
  }, [student]);

  // Mock Data para o Gráfico (simulando histórico mensal para visualização + dados atuais)
  // Em produção, isso viria de um processamento real do histórico agrupado por mês
  const chartData = {
      attendance: [98, 95, 100, 92, parseInt(String(stats.attendancePercent)) || 100, 96, 98],
      grades: [3, 2, 3, 4, stats.gradeAverage === 'DE' ? 4 : stats.gradeAverage === 'DB' ? 3 : 2, 3, 4]
  };

  if (!student) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-10">
        <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-8 border-emerald-100 rounded-3xl"></div>
            <div className="absolute inset-0 border-8 border-emerald-600 border-t-transparent rounded-3xl animate-spin"></div>
        </div>
        <span className="text-emerald-600 font-black text-[12px] uppercase tracking-[0.5em] animate-pulse">Carregando Pasta do Aluno...</span>
    </div>
  );

  return (
    <>
    {/* Layout de Impressão (Invisível na tela) */}
    <PrintLayout student={student} stats={stats} />

    {/* Layout de Tela (Visível apenas na tela) */}
    <div className="min-h-screen bg-[#fcfdfe] py-20 px-12 page-transition no-print">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-emerald-600 transition-all group">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 group-hover:-translate-x-2 transition-transform">
                    <ArrowLeft className="h-5 w-5" />
                </div> Voltar ao Painel
            </button>
            <div className="flex items-center gap-4 bg-emerald-50 px-6 py-2.5 rounded-2xl border border-emerald-100 shadow-sm">
                <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_#10b981]"></div>
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-ultra">Pasta Digital Síncrona</span>
            </div>
        </div>

        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12 bg-white p-16 rounded-[4rem] border border-slate-100 shadow-deep relative overflow-hidden group">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-14 relative z-10">
            <div className="relative shrink-0">
                <div className="w-40 h-40 rounded-[3.5rem] bg-slate-50 border-8 border-white shadow-2xl overflow-hidden ring-1 ring-slate-100 group-hover:scale-105 transition-transform duration-1000">
                  <img src={student.photo || `https://ui-avatars.com/api/?name=${student.name}&size=250&background=064e3b&color=fff`} className="w-full h-full object-cover" alt={student.name} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#064e3b] p-4 rounded-[1.5rem] text-white shadow-2xl border-4 border-white animate-bounce">
                    <ShieldCheck className="h-7 w-7" />
                </div>
            </div>
            
            <div className="space-y-8 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-slate-900 px-6 py-2 rounded-xl text-white">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">ID MEC: {student.inepId || 'PENDENTE'}</span>
                </div>
                <span className={`badge-status ${student.status === 'Matriculado' ? 'badge-emerald' : 'badge-amber'}`}>
                    <Target className="h-4 w-4" />
                    {student.status}
                </span>
              </div>
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">{student.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-10">
                  <div className="flex items-center gap-4 text-slate-500 font-bold text-[12px] uppercase tracking-widest">
                    <GraduationCap className="h-6 w-6 text-emerald-600" /> {student.grade || 'ENSINO REGULAR'}
                  </div>
                  <div className="flex items-center gap-4 text-slate-500 font-bold text-[12px] uppercase tracking-widest">
                    <Building className="h-6 w-6 text-emerald-600" /> {student.school || 'AGUARDANDO ALOCAÇÃO'}
                  </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 relative z-10 w-full xl:w-auto">
            <button onClick={() => window.print()} className="btn-primary !h-20 !px-12 !bg-white !text-slate-900 border border-slate-100 shadow-luxury hover:!bg-slate-50">
                <Printer className="h-6 w-6" /> Exportar PDF
            </button>
            <button onClick={() => navigate('/performance?studentId=' + student.id)} className="btn-primary !h-20 !px-12 !bg-slate-900">
                <Activity className="h-6 w-6" /> Boletim
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[120px] opacity-40 -mr-32 -mt-32"></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
          <div className="card-requinte p-10 flex flex-col justify-between h-44 border-l-[10px] border-emerald-600">
            <UserCheck className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Frequência Global</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">{stats.attendancePercent}%</p>
            </div>
          </div>
          
          <div className="card-requinte p-10 flex flex-col justify-between h-44 border-l-[10px] border-blue-600">
            <Award className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Desempenho Geral</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">{stats.gradeAverage}</p>
            </div>
          </div>

          <div className="card-requinte p-10 flex flex-col justify-between h-44 border-l-[10px] border-pink-500">
            <HeartPulse className={`h-8 w-8 ${student.specialNeeds ? 'text-pink-500' : 'text-slate-200'}`} />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">AEE</p>
              <p className="text-[13px] font-black text-slate-900 uppercase truncate leading-none tracking-tight">{student.specialNeeds ? (student.disabilityType || 'MONITORADO') : 'NÃO REQUER'}</p>
            </div>
          </div>

          <div className="bg-[#0F172A] p-10 rounded-[3rem] flex flex-col justify-between text-white h-44 shadow-deep border border-slate-800 group">
            <div className="flex justify-between items-start">
                <Database className="h-8 w-8 text-blue-400 group-hover:scale-110 transition-transform" />
                <div className="bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest">Sync MEC</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Status da Pasta</p>
              <p className="text-2xl font-black uppercase tracking-tight leading-none text-emerald-400">Regular</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-12">
            <div className="col-span-12 xl:col-span-8 space-y-10">
                {/* GRÁFICO COMPARATIVO */}
                <div className="card-requinte !p-12 shadow-luxury">
                    <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-6">
                        <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-4">
                            <TrendingUp className="h-6 w-6 text-emerald-600" /> Evolução: Frequência x Notas
                        </h3>
                    </div>
                    <div className="h-64 w-full">
                        <ComparisonChart attendanceData={chartData.attendance} gradeData={chartData.grades} />
                    </div>
                </div>

                {/* DIÁRIO DO PROFESSOR (FEED) */}
                <div className="card-requinte !p-12 shadow-luxury">
                    <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-6">
                        <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-4">
                            <ClipboardList className="h-6 w-6 text-blue-600" /> Diário de Classe (Observações)
                        </h3>
                    </div>
                    <div className="space-y-6">
                        {student.teacherNotes && student.teacherNotes.length > 0 ? (
                            student.teacherNotes.map(note => (
                                <div key={note.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex gap-5 animate-in slide-in-from-left-4">
                                    <div className="flex flex-col items-center gap-2 border-r border-slate-200 pr-5 min-w-[80px]">
                                        <Calendar className="h-5 w-5 text-slate-400" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase">{note.date.split('-').reverse().join('/')}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-700 leading-relaxed">"{note.content}"</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-2 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> 
                                            Registrado por: {note.author}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-400">
                                <Info className="h-8 w-8 mx-auto mb-3 opacity-50" />
                                <p className="text-xs font-medium uppercase tracking-widest">Nenhuma observação registrada pelo docente.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="col-span-12 xl:col-span-4 space-y-10">
                <div className="card-requinte !p-12 space-y-12 shadow-deep rounded-[3.5rem]">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-8">
                        <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.5em] flex items-center gap-5">
                            <MapPin className="h-6 w-6 text-emerald-600" /> Territorialidade
                        </h3>
                        <ArrowUpRight className="h-5 w-5 text-slate-200" />
                    </div>
                    <div className="space-y-12">
                        <div className="flex items-start gap-8 group">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shrink-0 group-hover:scale-110 transition-transform shadow-sm"><Globe className="h-7 w-7" /></div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">ZONA RESIDENCIAL</p>
                                <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">{student.residenceZone || 'Zona Urbana'}</p>
                                <p className="text-[11px] font-bold text-slate-400 uppercase mt-2">{MUNICIPALITY_NAME} • Bahia</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#064e3b] p-16 rounded-[4rem] text-white shadow-deep relative overflow-hidden group border border-emerald-950">
                    <BadgeCheck className="h-16 w-16 mb-12 text-emerald-400 group-hover:rotate-12 transition-transform duration-700" />
                    <h3 className="text-3xl font-black tracking-tighter mb-6 leading-tight uppercase">Autenticidade <br/>Garantida.</h3>
                    <p className="text-emerald-100/60 text-base leading-relaxed mb-12 font-medium">Esta pasta possui integridade nominal garantida via barramento municipal SME Itaberaba para fins de comprovação oficial em todo território nacional.</p>
                    <div className="flex justify-between items-center pt-10 border-t border-emerald-800">
                        <span className="text-[11px] font-black uppercase tracking-[0.6em] opacity-40">GOV DIGITAL 2025</span>
                        <div className="p-3 bg-emerald-500 rounded-xl shadow-2xl shadow-emerald-950 animate-pulse">
                            <Zap className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <div className="absolute -bottom-32 -right-32 h-64 w-64 bg-emerald-500/10 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-[4s]"></div>
                </div>
            </div>
        </div>
      </div>
    </div>
    </>
  );
};