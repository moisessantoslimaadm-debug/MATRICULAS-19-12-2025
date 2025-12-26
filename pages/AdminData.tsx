import React, { useState, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { 
  Search, Trash2, ChevronLeft, ChevronRight, 
  Edit3, Download, Database, X, Save, ShieldCheck, Upload
} from 'lucide-react';
import { RegistryStudent, School } from '../types';

export const AdminData: React.FC = () => {
  const { students, updateStudent, removeStudent, addStudent, addSchool } = useData();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingStudent, setEditingStudent] = useState<RegistryStudent | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.cpf.includes(searchTerm)
  );

  const paginated = filtered.slice((currentPage - 1) * 12, currentPage * 12);
  const totalPages = Math.ceil(filtered.length / 12);

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      addToast("Nenhum dado para exportar.", "warning");
      return;
    }

    // Cabeçalhos compatíveis com Layout Inep/MEC
    const headers = [
      "ID_SISTEMA", "INEP_ID", "MATRICULA_RA", "NOME_COMPLETO", 
      "DATA_NASCIMENTO", "CPF", "SEXO", "RACA_COR", 
      "ESCOLA_ATUAL", "TURMA", "TURNO", "STATUS_MATRICULA", 
      "AEE_DEFICIENCIA", "TRANSPORTE_PUBLICO", "ZONA_RESIDENCIAL"
    ];

    const csvContent = [
      headers.join(';'),
      ...filtered.map(s => [
        s.id,
        s.inepId || '',
        s.enrollmentId || '',
        `"${s.name}"`, // Aspas para evitar quebra em nomes compostos
        s.birthDate,
        s.cpf,
        s.sex || '',
        s.race || '',
        `"${s.school || ''}"`,
        `"${s.className || ''}"`,
        s.classSchedule || '',
        s.status,
        s.specialNeeds ? 'SIM' : 'NAO',
        s.transportRequest ? 'SIM' : 'NAO',
        s.residenceZone || ''
      ].join(';'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `censo_nominal_sme_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addToast("Arquivo CSV gerado com sucesso.", "success");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        const text = event.target?.result as string;
        if (!text) return;

        const lines = text.split('\n').filter(l => l.trim());
        if (lines.length < 2) {
            addToast("Arquivo vazio ou sem dados.", "warning");
            return;
        }

        // Detect separator based on first line
        const firstLine = lines[0];
        const separator = firstLine.includes(';') ? ';' : ',';
        const headers = firstLine.split(separator).map(h => h.trim().toUpperCase().replace(/"/g, ''));

        let importedCount = 0;
        let type = 'unknown';

        // Heuristic detection based on headers
        if (headers.includes('NOME_COMPLETO') || headers.includes('ALUNO') || headers.includes('CPF')) {
            type = 'student';
        } else if (headers.includes('NOME_ESCOLA') || headers.includes('ESCOLA') || headers.includes('INEP')) {
            type = 'school';
        }

        if (type === 'unknown') {
            addToast("Formato não reconhecido. Use cabeçalhos padrão (ex: NOME_COMPLETO, CPF).", "error");
            return;
        }

        addToast(`Iniciando importação de ${lines.length - 1} registros de ${type === 'student' ? 'Alunos' : 'Escolas'}...`, "info");

        try {
            for (let i = 1; i < lines.length; i++) {
                const rowValues = lines[i].split(separator).map(v => v.trim().replace(/"/g, ''));
                if (rowValues.length < 2) continue; // Skip empty lines

                const row: any = {};
                headers.forEach((h, idx) => {
                    row[h] = rowValues[idx];
                });

                if (type === 'student') {
                    const newStudent: RegistryStudent = {
                        id: row['ID_SISTEMA'] || `imp-std-${Date.now()}-${Math.random().toString(36).substr(2,5)}`,
                        name: (row['NOME_COMPLETO'] || row['NOME'] || 'ALUNO IMPORTADO').toUpperCase(),
                        cpf: row['CPF'] || '',
                        birthDate: row['DATA_NASCIMENTO'] || '',
                        enrollmentId: row['MATRICULA_RA'] || `MAT-${Math.floor(Math.random() * 900000) + 100000}`,
                        inepId: row['INEP_ID'] || '',
                        school: row['ESCOLA_ATUAL'] || row['ESCOLA'] || 'Não Alocado',
                        status: (row['STATUS_MATRICULA'] || 'Pendente') as any,
                        className: row['TURMA'] || '',
                        classSchedule: row['TURNO'] || '',
                        specialNeeds: row['AEE_DEFICIENCIA'] === 'SIM' || row['AEE_DEFICIENCIA'] === 'TRUE',
                        transportRequest: row['TRANSPORTE_PUBLICO'] === 'SIM' || row['TRANSPORTE_PUBLICO'] === 'TRUE',
                        residenceZone: (row['ZONA_RESIDENCIAL'] || 'Urbana') as any,
                        lat: -12.52, // Coordenada padrão
                        lng: -40.29
                    };
                    await addStudent(newStudent);
                } else if (type === 'school') {
                    const newSchool: School = {
                        id: row['ID'] || `imp-sch-${Date.now()}-${Math.random().toString(36).substr(2,5)}`,
                        name: (row['NOME_ESCOLA'] || row['ESCOLA'] || 'NOVA ESCOLA').toUpperCase(),
                        inep: row['INEP'] || '',
                        address: row['ENDERECO'] || 'Endereço não informado',
                        availableSlots: parseInt(row['VAGAS'] || '0') || 400,
                        lat: parseFloat(row['LAT'] || '-12.5265'),
                        lng: parseFloat(row['LNG'] || '-40.2925'),
                        types: [],
                        hasAEE: row['TEM_AEE'] === 'SIM',
                        image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80',
                        rating: 5
                    };
                    await addSchool(newSchool);
                }
                importedCount++;
            }
            addToast(`Processamento concluído: ${importedCount} registros importados.`, "success");
        } catch (error) {
            console.error(error);
            addToast("Erro crítico ao processar arquivo CSV.", "error");
        }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-6 page-transition">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900 uppercase">Censo <span className="text-emerald-600">Nominal</span></h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Base de dados síncrona SME</p>
          </div>
          <div className="flex gap-2">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".csv" 
                className="hidden" 
            />
            <button onClick={handleImportClick} className="btn-secondary !h-8 !text-[9px] hover:border-emerald-300">
                <Upload className="h-3 w-3" /> Importar CSV
            </button>
            <button onClick={handleExportCSV} className="btn-primary !h-8 !text-[9px] hover:!bg-emerald-700">
                <Download className="h-3 w-3" /> Exportar CSV
            </button>
          </div>
        </header>

        <div className="card-requinte overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar por nome ou CPF..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input-premium pl-10 h-10 bg-slate-50/50"
              />
            </div>
            <div className="flex items-center gap-6 pr-2">
                <div className="text-right">
                  <p className="text-[8px] font-bold text-slate-400 uppercase">Total na Rede</p>
                  <p className="text-sm font-bold text-slate-900">{filtered.length}</p>
                </div>
                <div className="h-8 w-px bg-slate-100"></div>
                <div className="flex items-center gap-2 text-emerald-600">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[8px] font-bold uppercase">Base Auditada</span>
                </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Estudante</th>
                  <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Escola</th>
                  <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                          <img src={s.photo || `https://ui-avatars.com/api/?name=${s.name}&background=064e3b&color=fff`} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-[10px] uppercase leading-none mb-1">{s.name}</p>
                          <p className="text-[8px] text-slate-400 font-medium">{s.cpf}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[10px] font-medium text-slate-600 uppercase truncate max-w-[150px]">{s.school}</td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex justify-center">
                        <span className={`badge-status ${s.status === 'Matriculado' ? 'badge-emerald' : 'badge-amber'}`}>{s.status}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingStudent(s)} className="p-1.5 text-slate-400 hover:text-emerald-600"><Edit3 className="h-3.5 w-3.5" /></button>
                        <button onClick={() => removeStudent(s.id)} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-400 uppercase">Página {currentPage} de {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} className="p-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50"><ChevronLeft className="h-3.5 w-3.5" /></button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} className="p-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50"><ChevronRight className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </div>
      </div>

      {editingStudent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditingStudent(null)}></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative p-6 animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 uppercase text-xs">Editar Registro</h3>
                <button onClick={() => setEditingStudent(null)} className="p-1 hover:bg-slate-100 rounded-full"><X className="h-4 w-4 text-slate-400" /></button>
             </div>
             <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Nome Nominal</label>
                    <input type="text" value={editingStudent.name} onChange={e => setEditingStudent({...editingStudent, name: e.target.value.toUpperCase()})} className="input-premium h-10" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Status da Vaga</label>
                    <select value={editingStudent.status} onChange={e => setEditingStudent({...editingStudent, status: e.target.value as any})} className="input-premium h-10">
                        <option value="Matriculado">Matriculado</option>
                        <option value="Pendente">Pendente</option>
                        <option value="Em Análise">Em Análise</option>
                    </select>
                </div>
             </div>
             <div className="mt-8 flex justify-end gap-2">
                <button onClick={() => setEditingStudent(null)} className="btn-secondary !h-8 !text-[9px]">Descartar</button>
                <button onClick={() => { updateStudent(editingStudent); setEditingStudent(null); addToast("Pasta Sincronizada", "success"); }} className="btn-primary !h-8 !text-[9px]"><Save className="h-3 w-3" /> Salvar</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};