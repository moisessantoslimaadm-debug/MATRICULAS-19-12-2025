
import React, { useState, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { 
  Search, Trash2, User, ChevronLeft, ChevronRight, 
  Upload, Edit3, Download, Database, MapPin, 
  X, Save, HeartPulse, Bus, Sparkles, Camera, CameraIcon,
  ShieldCheck, Info, CheckCircle2, AlertCircle
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
    s.cpf.includes(searchTerm) ||
    (s.address?.neighborhood || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginated = filtered.slice((currentPage - 1) * 10, currentPage * 10);
  const totalPages = Math.ceil(filtered.length / 10);

  const handleSaveEdit = async () => {
    if (editingStudent) {
      await updateStudent(editingStudent);
      addToast("Dossiê Nominal atualizado com sucesso.", "success");
      setEditingStudent(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja remover este registro nominal permanentemente da base municipal?")) {
        await removeStudent(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-8 lg:px-16 page-transition">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg">
                <Database className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Gestão de Rede • Itaberaba Digital</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Censo <span className="text-blue-600">Nominal 360°.</span></h1>
          </div>
          
          <div className="flex gap-4">
            <button onClick={() => addToast("Exportando base nominal completa...", "success")} className="btn-primary !bg-slate-900 !h-14">
              <Download className="h-5 w-5" /> Exportar Dados
            </button>
          </div>
        </header>

        <div className="card-requinte overflow-hidden shadow-2xl">
          <div className="p-10 border-b border-slate-50 bg-white flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="relative flex-1 w-full max-w-xl">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-200" />
              <input 
                type="text" 
                placeholder="Pesquisar por nome completo, CPF ou bairro..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input-premium pl-20 !h-16 shadow-inner text-lg"
              />
            </div>
            <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registros na Base</p>
                  <p className="text-2xl font-black text-slate-900">{filtered.length}</p>
                </div>
                <div className="h-10 w-px bg-slate-100"></div>
                <div className="flex items-center gap-3 bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Dados Síncronos</span>
                </div>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Estudante (Nome Completo)</th>
                  <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Inclusão / Saúde</th>
                  <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Logística / Projetos</th>
                  <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginated.map(s => (
                  <tr key={s.id} className="hover:bg-blue-50/20 transition-all group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-[1.8rem] bg-white border-4 border-white shadow-xl overflow-hidden">
                            <img src={s.photo || `https://ui-avatars.com/api/?name=${s.name}&background=random`} className="w-full h-full object-cover" />
                          </div>
                          {s.specialNeeds && (
                            <div className="absolute -top-2 -right-2 bg-pink-500 text-white p-1.5 rounded-full shadow-lg">
                               <HeartPulse className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-lg uppercase tracking-tight leading-none mb-2">{s.name}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CPF: {s.cpf}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{s.enrollmentId}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col items-center gap-2">
                        {s.specialNeeds ? (
                          <span className="px-4 py-1.5 bg-pink-50 text-pink-600 text-[9px] font-black rounded-xl border border-pink-100 uppercase tracking-widest flex items-center gap-2">
                            <AlertCircle className="h-3 w-3" /> {s.disabilityType || 'PNE'}
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-300 uppercase">Regular</span>
                        )}
                        {s.participatesAEE && (
                          <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-xl border border-indigo-100 uppercase tracking-widest">
                            SALA AEE ATIVA
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col items-center gap-2">
                        {s.transportRequest ? (
                          <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded-xl border border-blue-100 uppercase tracking-widest flex items-center gap-2">
                             <Bus className="h-3 w-3" /> TRANSPORTE OK
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-300 uppercase">A Pé / Próprio</span>
                        )}
                        {s.municipalProjects?.map(p => (
                          <span key={p} className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-xl border border-emerald-100 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="h-3 w-3" /> {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingStudent(s)} className="p-4 text-slate-400 hover:text-blue-600 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all hover:scale-110"><Edit3 className="h-5 w-5" /></button>
                        <button onClick={() => handleDelete(s.id)} className="p-4 text-slate-400 hover:text-red-500 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all hover:scale-110"><Trash2 className="h-5 w-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-10 bg-white border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paginação Executiva: {currentPage} de {totalPages}</span>
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-30 transition-all"><ChevronLeft className="h-5 w-5" /></button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage >= totalPages} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-30 transition-all"><ChevronRight className="h-5 w-5" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE EDIÇÃO 360° */}
      {editingStudent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setEditingStudent(null)}></div>
          <div className="bg-white rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-4xl relative animate-in zoom-in-95 duration-300 overflow-hidden border border-white">
             
             <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-blue-600 rounded-[1.8rem] text-white shadow-xl shadow-blue-100"><Edit3 className="h-7 w-7" /></div>
                    <div>
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Dossiê de {editingStudent.name.split(' ')[0]}.</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">Atualização de Registro Biométrico e Escolar</p>
                    </div>
                </div>
                <button onClick={() => setEditingStudent(null)} className="p-4 hover:bg-slate-200 rounded-full transition-colors"><X className="h-7 w-7 text-slate-400" /></button>
             </div>

             <div className="p-12 h-[60vh] overflow-y-auto custom-scrollbar space-y-12">
                
                {/* Seção Biométrica */}
                <div className="flex flex-col md:flex-row gap-12 items-center bg-blue-50/30 p-10 rounded-[2.5rem] border border-blue-50">
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-[2.5rem] bg-white border-8 border-white shadow-2xl overflow-hidden">
                        <img src={editingStudent.photo || `https://ui-avatars.com/api/?name=${editingStudent.name}&background=random`} className="w-full h-full object-cover" />
                      </div>
                      <button className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-2xl shadow-xl hover:scale-110 transition-all border-4 border-white">
                        <CameraIcon className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="flex-1 space-y-6">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL da Foto do Aluno</label>
                          <input type="text" value={editingStudent.photo || ''} onChange={e => setEditingStudent({...editingStudent, photo: e.target.value})} className="input-premium" placeholder="https://exemplo.com/foto.jpg" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo (Auditável)</label>
                          <input type="text" value={editingStudent.name} onChange={e => setEditingStudent({...editingStudent, name: e.target.value.toUpperCase()})} className="input-premium font-black" />
                       </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-ultra flex items-center gap-4">
                        <HeartPulse className="h-5 w-5 text-pink-500" /> Saúde e Inclusão
                      </h4>
                      <div className="space-y-4">
                        <label className="flex items-center gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white transition-all group">
                          <input type="checkbox" className="w-6 h-6 rounded-lg border-slate-200 text-pink-600 focus:ring-pink-100" checked={editingStudent.specialNeeds} onChange={e => setEditingStudent({...editingStudent, specialNeeds: e.target.checked})} />
                          <span className="text-sm font-black text-slate-600 uppercase group-hover:text-slate-900">Possui Deficiência / PNE</span>
                        </label>
                        {editingStudent.specialNeeds && (
                          <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
                             <input type="text" value={editingStudent.disabilityType || ''} onChange={e => setEditingStudent({...editingStudent, disabilityType: e.target.value})} className="input-premium" placeholder="Especificar deficiência..." />
                             <label className="flex items-center gap-5 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 cursor-pointer">
                                <input type="checkbox" className="w-6 h-6 rounded-lg border-indigo-200 text-indigo-600 focus:ring-indigo-100" checked={editingStudent.participatesAEE} onChange={e => setEditingStudent({...editingStudent, participatesAEE: e.target.checked})} />
                                <span className="text-sm font-black text-indigo-700 uppercase">Frequenta Sala de Recursos AEE</span>
                             </label>
                          </div>
                        )}
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-ultra flex items-center gap-4">
                        <Bus className="h-5 w-5 text-blue-500" /> Logística e Projetos
                      </h4>
                      <div className="space-y-4">
                        <label className="flex items-center gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white transition-all group">
                          <input type="checkbox" className="w-6 h-6 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-100" checked={editingStudent.transportRequest} onChange={e => setEditingStudent({...editingStudent, transportRequest: e.target.checked})} />
                          <span className="text-sm font-black text-slate-600 uppercase group-hover:text-slate-900">Necessita de Transporte Municipal</span>
                        </label>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Projetos Municipais (Separados por vírgula)</label>
                            <input type="text" value={editingStudent.municipalProjects?.join(', ') || ''} onChange={e => setEditingStudent({...editingStudent, municipalProjects: e.target.value.split(',').map(p => p.trim()).filter(p => p !== '')})} className="input-premium" placeholder="Ex: Robótica, Música na Escola" />
                        </div>
                      </div>
                   </div>
                </div>

                <div className="pt-10 border-t border-slate-100 grid md:grid-cols-2 gap-10">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unidade Escolar</label>
                      <input type="text" value={editingStudent.school || ''} onChange={e => setEditingStudent({...editingStudent, school: e.target.value})} className="input-premium" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Situação Administrativa</label>
                      <select value={editingStudent.status} onChange={e => setEditingStudent({...editingStudent, status: e.target.value as any})} className="input-premium appearance-none">
                         <option value="Matriculado">Matriculado</option>
                         <option value="Pendente">Pendente</option>
                         <option value="Em Análise">Em Análise</option>
                         <option value="Transferido">Transferido</option>
                      </select>
                   </div>
                </div>
             </div>

             <div className="p-12 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-6">
                <button onClick={() => setEditingStudent(null)} className="btn-secondary !h-16 !px-12">Descartar</button>
                <button onClick={handleSaveEdit} className="btn-primary !h-16 !px-12 !bg-blue-600 !border-blue-700 shadow-xl shadow-blue-100">
                  <Save className="h-6 w-6" /> Sincronizar Dossiê
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
