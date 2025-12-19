import React, { useState, useMemo, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { useLog } from '../contexts/LogContext';
import { 
  Search, Trash2, User, ChevronLeft, ChevronRight, 
  Upload, Edit3, Loader2, Download, Database, MapPin, 
  Filter, CheckCircle2, UserPlus, X, Save, ShieldAlert
} from 'lucide-react';
import { RegistryStudent } from '../types';

export const AdminData: React.FC = () => {
  const { students, updateStudent, removeStudent } = useData();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingStudent, setEditingStudent] = useState<RegistryStudent | null>(null);

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.cpf.includes(searchTerm) ||
    (s.address?.neighborhood || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginated = filtered.slice((currentPage - 1) * 10, currentPage * 10);
  const totalPages = Math.ceil(filtered.length / 10);

  const handleSaveEdit = async () => {
    if (editingStudent) {
      await updateStudent(editingStudent);
      addToast("Registro nominal atualizado com sucesso.", "success");
      setEditingStudent(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja realmente remover este registro nominal permanentemente?")) {
        await removeStudent(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-8 lg:px-16 page-transition">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-6 w-6 text-blue-600" />
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Base Territorial SME</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Censo <span className="text-blue-600">Nominal.</span></h1>
          </div>
          
          <div className="flex gap-4">
            <button onClick={() => addToast("Função de importação CSV em processamento.", "info")} className="btn-secondary">
              <Upload className="h-4 w-4" /> Importar CSV
            </button>
            <button onClick={() => addToast("Exportando base nominal...", "success")} className="btn-primary">
              <Download className="h-4 w-4" /> Exportar Base
            </button>
          </div>
        </header>

        <div className="card-requinte overflow-hidden">
          <div className="p-10 border-b border-slate-50 bg-white flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="relative flex-1 w-full max-w-lg">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-200" />
              <input 
                type="text" 
                placeholder="Pesquisar por nome, CPF ou bairro..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input-premium pl-16 !bg-slate-50 shadow-inner"
              />
            </div>
            <div className="flex items-center gap-5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base de Dados: {filtered.length} Entradas</span>
                <div className="h-4 w-px bg-slate-200"></div>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Síncrono</span>
                </div>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Estudante Nominal</th>
                  <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">CPF / Protocolo</th>
                  <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Localização</th>
                  <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Controle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginated.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-blue-600 shadow-sm text-xl uppercase">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-base uppercase tracking-tight leading-none mb-2">{s.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.grade || 'Fundamental II'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <p className="text-sm font-black text-slate-700 font-mono mb-1">{s.cpf}</p>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black rounded-lg uppercase tracking-widest border border-blue-100">{s.enrollmentId}</span>
                    </td>
                    <td className="px-10 py-8">
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">{s.address?.neighborhood}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate max-w-[150px]">{s.address?.street}</p>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingStudent(s)} className="p-3 text-slate-400 hover:text-blue-600 bg-white border border-slate-100 rounded-xl shadow-sm transition-all hover:scale-110"><Edit3 className="h-5 w-5" /></button>
                        <button onClick={() => handleDelete(s.id)} className="p-3 text-slate-400 hover:text-red-500 bg-white border border-slate-100 rounded-xl shadow-sm transition-all hover:scale-110"><Trash2 className="h-5 w-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-10 bg-white border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Exibindo {paginated.length} de {filtered.length} alunos nominalmente</span>
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 disabled:opacity-30 hover:bg-white transition-all shadow-sm"><ChevronLeft className="h-5 w-5" /></button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage >= totalPages} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 disabled:opacity-30 hover:bg-white transition-all shadow-sm"><ChevronRight className="h-5 w-5" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal Refinado */}
      {editingStudent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setEditingStudent(null)}></div>
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl relative animate-in zoom-in-95 duration-300 overflow-hidden border border-white">
             <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <div className="flex items-center gap-5">
                    <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg"><Edit3 className="h-6 w-6" /></div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Editar Cadastro.</h3>
                </div>
                <button onClick={() => setEditingStudent(null)} className="p-3 hover:bg-slate-200 rounded-full transition-colors"><X className="h-6 w-6 text-slate-400" /></button>
             </div>
             <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Nominal</label>
                      <input type="text" value={editingStudent.name} onChange={e => setEditingStudent({...editingStudent, name: e.target.value.toUpperCase()})} className="input-premium" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CPF</label>
                      <input type="text" value={editingStudent.cpf} onChange={e => setEditingStudent({...editingStudent, cpf: e.target.value})} className="input-premium" />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unidade Escolar</label>
                      <input type="text" value={editingStudent.school || ''} onChange={e => setEditingStudent({...editingStudent, school: e.target.value})} className="input-premium" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Situação de Matrícula</label>
                      <select value={editingStudent.status} onChange={e => setEditingStudent({...editingStudent, status: e.target.value as any})} className="input-premium appearance-none">
                         <option value="Matriculado">Matriculado</option>
                         <option value="Pendente">Pendente</option>
                         <option value="Em Análise">Em Análise</option>
                         <option value="Transferido">Transferido</option>
                         <option value="Abandono">Abandono</option>
                      </select>
                   </div>
                </div>
             </div>
             <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-6">
                <button onClick={() => setEditingStudent(null)} className="btn-secondary !h-14">Cancelar</button>
                <button onClick={handleSaveEdit} className="btn-primary !h-14 !bg-blue-600 !border-blue-700">
                  <Save className="h-5 w-5" /> Salvar Alterações Síncronas
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};