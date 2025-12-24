import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { 
  Search, Trash2, ChevronLeft, ChevronRight, 
  Edit3, Download, Database, X, Save, ShieldCheck
} from 'lucide-react';
import { RegistryStudent } from '../types';

export const AdminData: React.FC = () => {
  const { students, updateStudent, removeStudent } = useData();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingStudent, setEditingStudent] = useState<RegistryStudent | null>(null);

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.cpf.includes(searchTerm)
  );

  const paginated = filtered.slice((currentPage - 1) * 12, currentPage * 12);
  const totalPages = Math.ceil(filtered.length / 12);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-6 page-transition">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900 uppercase">Censo <span className="text-emerald-600">Nominal</span></h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Base de dados síncrona SME</p>
          </div>
          <button onClick={() => addToast("Gerando relatório...", "info")} className="btn-primary !h-8 !text-[9px]">
            <Download className="h-3 w-3" /> Exportar CSV
          </button>
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