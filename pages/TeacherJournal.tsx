import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { generatePedagogicalReport } from '../services/geminiService';
import { 
  Save, Search, Loader2, ClipboardCheck, MessageSquare, 
  CheckCircle, XCircle, ChevronLeft, Calendar, Home, Sparkles, Printer, X, Archive
} from 'lucide-react';
import { useNavigate } from '../router';
import { TeacherNote, RegistryStudent } from '../types';
import { MUNICIPALITY_NAME } from '../constants';

const CONCEPTS = ['', 'DI', 'EP', 'DB', 'DE'];
const CONCEPT_STYLE: Record<string, string> = {
  'DI': 'bg-red-50 text-red-600 border-red-100',
  'EP': 'bg-amber-50 text-amber-600 border-amber-100',
  'DB': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'DE': 'bg-indigo-50 text-indigo-600 border-indigo-100',
  '': 'bg-slate-50 text-slate-300 border-slate-100'
};

export const TeacherJournal: React.FC = () => {
  const { students, updateStudents } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Estado local
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({}); // Novas notas para salvar
  const [openNoteId, setOpenNoteId] = useState<string | null>(null); // Qual aluno está com campo de obs aberto

  // Estado para Relatório IA
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<RegistryStudent | null>(null);

  const userData = JSON.parse(sessionStorage.getItem('user_data') || '{}');
  const filtered = students.filter(s => s.status === 'Matriculado' && s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    const initialGrades: Record<string, string> = {};
    const initialAttendance: Record<string, boolean> = {};

    students.forEach(s => {
        // Carrega nota atual
        const grade = s.performanceHistory?.find(h => h.subject === 'LÍNGUA PORTUGUESA')?.g1?.[0];
        if (grade) initialGrades[s.id] = grade;

        // Verifica se já tem frequência pra hoje (simulação)
        const todayRecord = s.attendanceHistory?.find(r => r.date === selectedDate);
        if (todayRecord) initialAttendance[s.id] = todayRecord.present;
    });
    setGrades(initialGrades);
    setAttendance(initialAttendance);
  }, [students, selectedDate]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
        const studentsToUpdate = filtered.map(student => {
            let updatedStudent = { ...student };

            // 1. Atualizar Frequência
            if (attendance[student.id] !== undefined) {
                const currentHistory = student.attendanceHistory || [];
                const cleanHistory = currentHistory.filter(r => r.date !== selectedDate);
                cleanHistory.push({ date: selectedDate, present: attendance[student.id] });
                updatedStudent.attendanceHistory = cleanHistory;
            }

            // 2. Atualizar Notas
            if (grades[student.id]) {
                const currentHistory = updatedStudent.performanceHistory || [];
                const subjectIndex = currentHistory.findIndex(h => h.subject === 'LÍNGUA PORTUGUESA');
                let newHistory = [...currentHistory];
                
                if (subjectIndex >= 0) {
                    const newG1 = [...(newHistory[subjectIndex].g1 || ['', '', ''])];
                    newG1[0] = grades[student.id]; 
                    newHistory[subjectIndex] = { ...newHistory[subjectIndex], g1: newG1 };
                } else {
                    newHistory.push({ subject: 'LÍNGUA PORTUGUESA', g1: [grades[student.id], '', ''] });
                }
                updatedStudent.performanceHistory = newHistory;
            }

            // 3. Adicionar Observação
            if (notes[student.id]) {
                const newNote: TeacherNote = {
                    id: `note-${Date.now()}-${Math.random()}`,
                    date: selectedDate,
                    author: userData.name || 'Professor',
                    content: notes[student.id],
                    type: 'Academic'
                };
                updatedStudent.teacherNotes = [newNote, ...(updatedStudent.teacherNotes || [])];
            }

            return updatedStudent;
        });

        await updateStudents(studentsToUpdate);
        setNotes({}); // Limpa notas após salvar
        setOpenNoteId(null);
        addToast("Diário sincronizado com a Pasta do Aluno.", "success");
    } catch (error) {
        console.error(error);
        addToast("Erro ao sincronizar dados.", "error");
    } finally {
        setIsSaving(false);
    }
  };

  const cycleGrade = (studentId: string) => {
    const current = grades[studentId] || '';
    const nextIdx = (CONCEPTS.indexOf(current) + 1) % CONCEPTS.length;
    setGrades({ ...grades, [studentId]: CONCEPTS[nextIdx] });
  };

  const handleGenerateReport = async (student: RegistryStudent) => {
      setSelectedStudentForReport(student);
      setIsGeneratingReport(true);
      setReportModalOpen(true);
      setReportContent("Analisando dados do aluno no barramento...");

      try {
          const totalDays = student.attendanceHistory?.length || 0;
          const presentDays = student.attendanceHistory?.filter(r => r.present).length || 0;
          const attPercent = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;
          
          const studentGrades = {
              'LÍNGUA PORTUGUESA': grades[student.id] || 'N/A'
          };

          const text = await generatePedagogicalReport(student, attPercent, studentGrades);
          setReportContent(text || "Não foi possível gerar o relatório no momento.");
      } catch (error) {
          setReportContent("Erro ao conectar com o serviço de inteligência artificial.");
      } finally {
          setIsGeneratingReport(false);
      }
  };

  const handleBack = () => navigate(-1);
  const handleHome = () => navigate('/journal');
  const handleHistory = () => navigate('/journal/history');

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-20 px-8 page-transition">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-16 gap-10 no-print">
          <div className="space-y-8">
            <div className="flex gap-4">
                <button onClick={handleBack} className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition group">
                    <ChevronLeft className="h-4 w-4 group-hover:-translate-x-2 transition-transform" /> Voltar
                </button>
                 <button onClick={handleHome} className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition group">
                    <Home className="h-4 w-4" /> Início
                </button>
            </div>
            <div>
                <div className="flex items-center gap-4 mb-5">
                  <ClipboardCheck className="h-7 w-7 text-emerald-600" />
                  <span className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em]">Modulo Docente • Conectado</span>
                </div>
                <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none text-display">Diário de <br/><span className="text-emerald-600">Classe.</span></h1>
                <p className="text-slate-500 font-medium text-xl mt-6">Escola: <span className="text-slate-900 font-black">{userData.schoolName || 'Rede Municipal'}</span> • Prof. {userData.name}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-4 w-full xl:w-auto">
             <div className="flex gap-3 w-full xl:w-auto">
                 <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex-1 xl:flex-none">
                    <Calendar className="h-5 w-5 text-slate-400" />
                    <input 
                        type="date" 
                        value={selectedDate} 
                        onChange={e => setSelectedDate(e.target.value)}
                        className="font-bold text-slate-700 bg-transparent outline-none uppercase text-sm w-full"
                    />
                 </div>
                 <button 
                    onClick={handleHistory}
                    className="flex items-center gap-3 px-6 py-3 bg-white text-slate-600 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-200 hover:text-emerald-700 hover:shadow-lg transition-all text-[10px] font-black uppercase tracking-widest"
                 >
                    <Archive className="h-4 w-4" /> Arquivos
                 </button>
             </div>
             
             <button onClick={handleSave} disabled={isSaving} className="btn-primary !h-20 !px-16 shadow-emerald-200 group relative overflow-hidden w-full xl:w-auto">
                {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6 group-hover:scale-110 transition-transform" />}
                <span className="relative z-10">Sincronizar Pasta</span>
                {isSaving && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
             </button>
          </div>
        </header>

        <div className="bg-white rounded-[4rem] shadow-luxury border border-slate-100 overflow-hidden no-print">
          <div className="p-12 border-b border-slate-50 bg-slate-50/20 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
              <input 
                type="text" 
                placeholder="Localizar aluno na turma..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input-premium pl-20 !bg-white shadow-sm"
              />
            </div>
            <div className="flex items-center gap-10">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Presença</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Falta</span>
                </div>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estudante</th>
                  <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Frequência ({selectedDate.split('-').reverse().join('/')})</th>
                  <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Avaliação (Português)</th>
                  <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors duration-300">
                    <td className="px-12 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-[1.2rem] bg-white border border-slate-100 shadow-sm flex items-center justify-center text-emerald-600 font-black text-xl">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-lg uppercase tracking-tighter leading-none mb-2">{s.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">RA: {s.enrollmentId}</p>
                        </div>
                      </div>
                      {openNoteId === s.id && (
                          <div className="mt-4 animate-in slide-in-from-top-2">
                              <textarea 
                                  className="w-full p-4 rounded-xl border border-blue-200 bg-blue-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                  placeholder={`Escreva uma observação para a pasta de ${s.name}...`}
                                  value={notes[s.id] || ''}
                                  onChange={e => setNotes({...notes, [s.id]: e.target.value})}
                              />
                          </div>
                      )}
                    </td>
                    <td className="px-12 py-8 text-center">
                      <div className="flex justify-center gap-4">
                        <button 
                          onClick={() => setAttendance({...attendance, [s.id]: true})}
                          className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center transition-all duration-300 ${attendance[s.id] === true ? 'bg-emerald-500 text-white shadow-lg scale-110' : 'bg-slate-50 text-slate-300 hover:text-emerald-400 border border-slate-100'}`}
                        >
                          <CheckCircle className="h-6 w-6" />
                        </button>
                        <button 
                          onClick={() => setAttendance({...attendance, [s.id]: false})}
                          className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center transition-all duration-300 ${attendance[s.id] === false ? 'bg-red-500 text-white shadow-lg scale-110' : 'bg-slate-50 text-slate-300 hover:text-red-400 border border-slate-100'}`}
                        >
                          <XCircle className="h-6 w-6" />
                        </button>
                      </div>
                    </td>
                    <td className="px-12 py-8">
                      <div className="flex justify-center">
                         <button 
                            onClick={() => cycleGrade(s.id)}
                            className={`w-24 h-14 rounded-[1.2rem] border-2 font-black text-lg transition-all duration-500 flex items-center justify-center gap-2 ${grades[s.id] ? CONCEPT_STYLE[grades[s.id]] : 'bg-slate-50 border-dashed border-slate-200 text-slate-300 hover:border-blue-400 hover:text-blue-400'}`}
                         >
                            {grades[s.id] || '--'}
                         </button>
                      </div>
                    </td>
                    <td className="px-12 py-8 text-right">
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => handleGenerateReport(s)}
                                className="p-4 rounded-[1.2rem] bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm group/ai"
                                title="Gerar Relatório IA"
                            >
                                <Sparkles className="h-5 w-5" />
                            </button>
                            <button 
                                onClick={() => setOpenNoteId(openNoteId === s.id ? null : s.id)}
                                className={`p-4 rounded-[1.2rem] border transition-all ${notes[s.id] ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-100 text-slate-300 hover:text-blue-500 hover:border-blue-200'}`}
                            >
                                <MessageSquare className="h-5 w-5" />
                            </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Relatório IA / Impressão Profissional */}
      {reportModalOpen && selectedStudentForReport && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:bg-white print:p-0 print:block print:relative">
              <div className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] print:shadow-none print:max-w-none print:max-h-none print:rounded-none print:h-full">
                  
                  {/* Header do Modal (Tela) */}
                  <div className="flex justify-between items-center p-8 border-b border-slate-100 no-print">
                      <div className="flex items-center gap-4">
                          <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                              <Sparkles className="h-6 w-6" />
                          </div>
                          <div>
                              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Relatório Pedagógico IA</h3>
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Aluno: {selectedStudentForReport.name}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-3">
                          <button onClick={() => window.print()} className="btn-secondary !h-12 !px-6 !text-[10px]">
                              <Printer className="h-4 w-4" /> Imprimir
                          </button>
                          <button onClick={() => setReportModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-full transition-colors">
                              <X className="h-5 w-5 text-slate-400" />
                          </button>
                      </div>
                  </div>

                  {/* Conteúdo (Tela) */}
                  <div className="p-10 overflow-y-auto no-print">
                      {isGeneratingReport ? (
                          <div className="flex flex-col items-center justify-center py-20 gap-6">
                              <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
                              <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Gerando Análise Pedagógica...</p>
                          </div>
                      ) : (
                          <div className="prose prose-slate max-w-none">
                              <div className="whitespace-pre-wrap font-medium text-slate-700 leading-relaxed text-justify">
                                  {reportContent}
                              </div>
                          </div>
                      )}
                  </div>

                  {/* Layout de Impressão (A4 Profissional) */}
                  <div className="hidden print:block p-10 bg-white text-black font-serif h-full">
                      <div className="text-center border-b-2 border-black pb-6 mb-8">
                          <div className="flex justify-center mb-4"><div className="w-24 h-24 bg-gray-200 rounded-full border border-gray-400 flex items-center justify-center text-4xl font-bold">BR</div></div>
                          <h1 className="text-2xl font-bold uppercase tracking-wide mb-1">Prefeitura Municipal de {MUNICIPALITY_NAME}</h1>
                          <h2 className="text-lg font-medium uppercase">Secretaria Municipal de Educação</h2>
                          <p className="text-sm mt-2 italic">Relatório de Acompanhamento Pedagógico Individual - Ano Letivo 2025</p>
                      </div>

                      <div className="mb-8 border border-gray-300 p-4">
                          <table className="w-full text-sm">
                              <tbody>
                                  <tr>
                                      <td className="font-bold py-1 w-32">ALUNO(A):</td>
                                      <td className="uppercase">{selectedStudentForReport.name}</td>
                                      <td className="font-bold py-1 w-32">TURMA:</td>
                                      <td className="uppercase">{selectedStudentForReport.className || 'N/A'}</td>
                                  </tr>
                                  <tr>
                                      <td className="font-bold py-1">RA / MATRÍCULA:</td>
                                      <td>{selectedStudentForReport.enrollmentId}</td>
                                      <td className="font-bold py-1">DATA EMISSÃO:</td>
                                      <td>{new Date().toLocaleDateString()}</td>
                                  </tr>
                                  <tr>
                                      <td className="font-bold py-1">UNIDADE ESCOLAR:</td>
                                      <td colSpan={3} className="uppercase">{selectedStudentForReport.school}</td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>

                      <div className="text-justify leading-loose text-base font-normal mb-12">
                          {reportContent}
                      </div>

                      <div className="mt-20 pt-10 border-t border-black grid grid-cols-2 gap-20 text-center text-sm">
                          <div>
                              <p className="mb-12">_________________________________________________</p>
                              <p className="font-bold uppercase">{userData.name}</p>
                              <p>Professor(a) Responsável</p>
                          </div>
                          <div>
                              <p className="mb-12">_________________________________________________</p>
                              <p className="font-bold uppercase">Coordenação Pedagógica</p>
                              <p>Visto</p>
                          </div>
                      </div>
                  </div>

              </div>
          </div>
      )}
    </div>
  );
};