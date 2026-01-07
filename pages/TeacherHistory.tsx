import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from '../router';
import { useToast } from '../contexts/ToastContext';
import { 
  ArrowLeft, Download, Printer, Archive, FileText, 
  Calendar, ClipboardList, CheckCircle, XCircle
} from 'lucide-react';
import { MUNICIPALITY_NAME } from '../constants';

export const TeacherHistory: React.FC = () => {
  const { students } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const userData = JSON.parse(sessionStorage.getItem('user_data') || '{}');

  // Filtra apenas alunos matriculados ativos
  const activeStudents = useMemo(() => 
    students.filter(s => s.status === 'Matriculado').sort((a, b) => a.name.localeCompare(b.name)), 
  [students]);

  const handleExportCSV = () => {
    // Cabeçalho CSV
    const headers = ["NOME_ALUNO", "RA", "DATA", "TIPO_REGISTRO", "CONTEUDO_VALOR"];
    const rows: string[] = [];

    activeStudents.forEach(student => {
        // Linhas de Frequência
        student.attendanceHistory?.forEach(rec => {
            rows.push([
                `"${student.name}"`,
                student.enrollmentId || '',
                rec.date,
                "FREQUENCIA",
                rec.present ? "PRESENTE" : "AUSENTE"
            ].join(';'));
        });

        // Linhas de Diário/Notas
        student.teacherNotes?.forEach(note => {
            rows.push([
                `"${student.name}"`,
                student.enrollmentId || '',
                note.date,
                "OBSERVACAO_PEDAGOGICA",
                `"${note.content.replace(/"/g, '""')}"`
            ].join(';'));
        });
    });

    if (rows.length === 0) {
        addToast("Não há histórico registrado para exportar.", "warning");
        return;
    }

    const csvContent = [headers.join(';'), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `historico_classe_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Arquivo CSV gerado com sucesso.", "success");
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] page-transition">
      {/* --- CABEÇALHO DE TELA (NÃO IMPRESSO) --- */}
      <div className="no-print py-12 px-8 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
            <div className="space-y-6">
                <button onClick={() => navigate('/journal')} className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-2 transition-transform" /> Voltar ao Diário
                </button>
                <div className="flex items-center gap-4">
                    <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-xl">
                        <Archive className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Arquivo <br/><span className="text-emerald-600">Anual.</span></h1>
                        <p className="text-slate-500 font-medium text-sm mt-2">Consolidado de Frequência e Registros Pedagógicos</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-4">
                <button onClick={handleExportCSV} className="btn-secondary !h-16 !px-8 !text-[10px]">
                    <Download className="h-5 w-5" /> CSV (Dados Brutos)
                </button>
                <button onClick={() => window.print()} className="btn-primary !h-16 !px-8 !text-[10px] !bg-slate-900">
                    <Printer className="h-5 w-5" /> Imprimir Relatório
                </button>
            </div>
        </header>

        <div className="bg-white rounded-[3rem] p-10 shadow-luxury border border-slate-100">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                <FileText className="h-5 w-5 text-emerald-600" />
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Pré-visualização do Documento</h3>
            </div>
            <p className="text-slate-500 text-sm mb-4">
                Abaixo está a visualização consolidada de todos os alunos. Utilize o botão <b>Imprimir Relatório</b> para gerar o PDF oficial ou imprimir em papel A4.
            </p>
        </div>
      </div>

      {/* --- ÁREA DE IMPRESSÃO (ESTILO OFICIAL A4) --- */}
      <div className="max-w-[210mm] mx-auto bg-white p-10 min-h-screen print:w-full print:max-w-none print:p-0 print:min-h-0">
        
        {/* Cabeçalho do Relatório */}
        <div className="text-center border-b-2 border-black pb-4 mb-8">
            <h1 className="text-xl font-bold uppercase tracking-wide">Prefeitura Municipal de {MUNICIPALITY_NAME}</h1>
            <h2 className="text-sm font-bold uppercase mt-1">Secretaria Municipal de Educação</h2>
            <div className="mt-4 flex justify-between text-xs font-medium uppercase border-t border-gray-300 pt-2">
                <span>Escola: {userData.schoolName || 'Rede Municipal'}</span>
                <span>Professor(a): {userData.name}</span>
                <span>Ano Letivo: 2025</span>
            </div>
            <h3 className="text-lg font-black uppercase mt-6 bg-gray-100 py-2">Relatório Anual de Acompanhamento de Classe</h3>
        </div>

        {/* Lista de Alunos */}
        <div className="space-y-12">
            {activeStudents.map((student, idx) => {
                const totalDays = student.attendanceHistory?.length || 0;
                const presentDays = student.attendanceHistory?.filter(r => r.present).length || 0;
                const absenceDays = totalDays - presentDays;
                const percent = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : "100.0";

                return (
                    <div key={student.id} className="break-inside-avoid border border-gray-300 rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-start bg-slate-50 p-3 rounded-md mb-4 border-b border-gray-200">
                            <div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Estudante {idx + 1}</span>
                                <h4 className="text-lg font-black uppercase">{student.name}</h4>
                                <span className="text-xs font-mono text-gray-600">RA: {student.enrollmentId || 'N/A'}</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-2xl font-bold">{percent}%</span>
                                <span className="text-[9px] font-bold uppercase text-gray-500">Frequência</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
                            {/* Coluna 1: Resumo de Frequência */}
                            <div>
                                <h5 className="text-xs font-bold uppercase border-b border-gray-300 pb-1 mb-2 flex items-center gap-2">
                                    <Calendar className="h-3 w-3" /> Registro de Frequência
                                </h5>
                                <div className="text-xs space-y-1">
                                    <div className="flex justify-between">
                                        <span>Total Dias Letivos:</span>
                                        <span className="font-bold">{totalDays}</span>
                                    </div>
                                    <div className="flex justify-between text-emerald-700">
                                        <span>Presenças:</span>
                                        <span className="font-bold">{presentDays}</span>
                                    </div>
                                    <div className="flex justify-between text-red-700">
                                        <span>Faltas:</span>
                                        <span className="font-bold">{absenceDays}</span>
                                    </div>
                                </div>
                                
                                {/* Mini grade de datas (se houver espaço ou necessidade detalhada) */}
                                {student.attendanceHistory && student.attendanceHistory.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {student.attendanceHistory.slice(-10).map((att, i) => (
                                            <div key={i} className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white ${att.present ? 'bg-emerald-500' : 'bg-red-500'}`} title={att.date}>
                                                {att.present ? 'P' : 'F'}
                                            </div>
                                        ))}
                                        {student.attendanceHistory.length > 10 && <span className="text-[8px] text-gray-400">...</span>}
                                    </div>
                                )}
                            </div>

                            {/* Coluna 2: Diário de Classe (Últimos Registros) */}
                            <div>
                                <h5 className="text-xs font-bold uppercase border-b border-gray-300 pb-1 mb-2 flex items-center gap-2">
                                    <ClipboardList className="h-3 w-3" /> Registros Pedagógicos
                                </h5>
                                {student.teacherNotes && student.teacherNotes.length > 0 ? (
                                    <div className="space-y-2">
                                        {student.teacherNotes.map((note) => (
                                            <div key={note.id} className="text-xs border-l-2 border-gray-300 pl-2">
                                                <span className="font-bold text-gray-600 block">{note.date.split('-').reverse().join('/')}</span>
                                                <p className="italic text-gray-800">"{note.content}"</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 italic">Nenhuma observação registrada.</p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Rodapé de Assinaturas */}
        <div className="mt-20 pt-10 border-t border-black grid grid-cols-3 gap-10 text-center text-xs break-inside-avoid">
            <div>
                <p className="mb-8">_______________________________</p>
                <p className="font-bold uppercase">Secretaria Escolar</p>
            </div>
            <div>
                <p className="mb-8">_______________________________</p>
                <p className="font-bold uppercase">Coordenação Pedagógica</p>
            </div>
            <div>
                <p className="mb-8">_______________________________</p>
                <p className="font-bold uppercase">{userData.name}</p>
                <p>Professor(a) Responsável</p>
            </div>
        </div>
        <div className="text-center mt-4 text-[10px] text-gray-400">
            Gerado via Plataforma SME Digital • {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};