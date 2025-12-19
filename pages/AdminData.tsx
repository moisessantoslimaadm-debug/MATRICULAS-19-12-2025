import React, { useState, useMemo, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { useLog } from '../contexts/LogContext';
import { 
  Search, Trash2, User, ChevronLeft, ChevronRight, 
  Upload, Edit3, Loader2, Download, Database, MapPin, 
  Filter, CheckCircle2, UserPlus, X, Save
} from 'lucide-react';
import { RegistryStudent } from '../types';

export const AdminData: React.FC = () => {
  const { students, updateStudent, removeStudent } = useData();
  const { addToast } = useToast();
  const { addLog } = useLog();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isImporting, setIsImporting] = useState(false);
  const [editingStudent, setEditingStudent] = useState<RegistryStudent | null>(null);

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.cpf.includes(searchTerm) ||
    s.address?.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-8 lg:px-16 page-transition">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-5 w-5 text-blue-600" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Territorial SME</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Censo <span className="text-blue-600">Nominal.</span></h1>
          </div>
          
          <div className="flex gap-4">
            <input type="file" ref={fileInputRef} className="hidden" accept=".csv" />
            <button className="btn-secondary !h-12 !px-6">
              <Upload className="h-4 w-4" /> Importar CSV
            </button>
            <button className="btn-primary !h-12 !px-6">
              <Download className="h-4 w-4" /> Exportar Base
            </button>
          </div>
        </header>

        <div className="card-requinte overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-white flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
              <input 
                type="text" 
                placeholder="Pesquisar por nome ou CPF..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input-premium pl-12"
              />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total: {filtered.length} alunos</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estudante</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">CPF / RA</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Localização</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginated.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm uppercase">{s.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase">{s.grade || 'Não alocado'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-mono text-slate-600">{s.cpf}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{s.enrollmentId}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-slate-700 uppercase">{s.address?.neighborhood}</p>
                      <p className="text-[10px] text-slate-400 uppercase">{s.address?.street}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingStudent(s)} className="p-2.5 text-slate-400 hover:text-blue-600 bg-white border border-slate-100 rounded-xl shadow-sm"><Edit3 className="h-4 w-4" /></button>
                        <button onClick={() => removeStudent(s.id)} className="p-2.5 text-slate-400 hover:text-red-500 bg-white border border-slate-100 rounded-xl shadow-sm"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-white border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Página {currentPage} de {totalPages || 1}</span>
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-400 disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage >= totalPages} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-400 disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditingStudent(null)}></div>
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden">
             <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Editar Registro.</h3>
                <button onClick={() => setEditingStudent(null)} className="p-2 hover:bg-slate-200 rounded-full transition"><X className="h-6 w-6" /></button>
             </div>
             <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nome Completo</label>
                      <input type="text" value={editingStudent.name} onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} className="input-premium" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">CPF</label>
                      <input type="text" value={editingStudent.cpf} onChange={e => setEditingStudent({...editingStudent, cpf: e.target.value})} className="input-premium" />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Escola</label>
                      <input type="text" value={editingStudent.school || ''} onChange={e => setEditingStudent({...editingStudent, school: e.target.value})} className="input-premium" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Status</label>
                      <select value={editingStudent.status} onChange={e => setEditingStudent({...editingStudent, status: e.target.value as any})} className="input-premium appearance-none">
                         <option value="Matriculado">Matriculado</option>
                         <option value="Pendente">Pendente</option>
                         <option value="Em Análise">Em Análise</option>
                      </select>
                   </div>
                </div>
             </div>
             <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                <button onClick={() => setEditingStudent(null)} className="btn-secondary">Cancelar</button>
                <button onClick={handleSaveEdit} className="btn-primary">
                  <Save className="h-4 w-4" /> Salvar Alterações
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};