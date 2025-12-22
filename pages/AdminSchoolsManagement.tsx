
import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate, useSearchParams } from '../router';
import { 
  Building, Users, Layers, Star, Plus, Search, 
  ChevronRight, Trash2, Edit3, Globe, Briefcase, 
  Zap, X, Save, UserCheck, MoreHorizontal, Info,
  Mail, Phone, Briefcase as BriefcaseIcon, Calendar,
  TrendingUp, Award, DollarSign, ShieldCheck
} from 'lucide-react';
import { Professional, Project, RegistryStudent, School } from '../types';

export const AdminSchoolsManagement: React.FC = () => {
  const { 
    professionals, projects, students, schools, 
    addProfessional, updateProfessional, removeProfessional,
    addProject, updateProject, removeProject, 
    updateStudent, linkStudentToProject 
  } = useData();
  
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const tabParam = params.get('tab');
  
  const [activeTab, setActiveTab] = useState<'professionals' | 'students' | 'projects'>(
    (tabParam as any) || 'students'
  );
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ status: 'Ativo' });

  useEffect(() => {
    if (tabParam && ['professionals', 'students', 'projects'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  const filteredProfessionals = useMemo(() => professionals.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.role && p.role.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [professionals, searchTerm]);

  const filteredProjects = useMemo(() => projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [projects, searchTerm]);

  const filteredStudents = useMemo(() => students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || (s.school && s.school.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [students, searchTerm]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({ status: 'Ativo' });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsFormModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'professionals') {
      if (editingItem) await updateProfessional(formData as Professional);
      else await addProfessional({ ...formData, id: `prof-${Date.now()}` } as Professional);
    } else if (activeTab === 'projects') {
      if (editingItem) await updateProject(formData as Project);
      else await addProject({ 
          ...formData, 
          id: `proj-${Date.now()}`, 
          participantsCount: 0,
          image: formData.image || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80',
          status: 'Ativo'
        } as Project);
    }
    setIsFormModalOpen(false);
  };

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button 
      onClick={() => { navigate(`/admin/escolas?tab=${id}`); setActiveTab(id); setSearchTerm(''); }}
      className={`flex items-center gap-4 px-10 py-5 rounded-[2.2rem] text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === id ? 'bg-[#0F172A] text-white shadow-deep scale-105' : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-100'}`}
    >
      <Icon className={`h-4 w-4 ${activeTab === id ? 'text-emerald-400' : 'text-slate-300'}`} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 px-12 page-transition">
      <div className="max-w-[1600px] mx-auto space-y-12">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 border-b border-slate-200 pb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-6">
                <div className="bg-[#064e3b] p-5 rounded-[2rem] text-white shadow-2xl rotate-3"><Building className="h-10 w-10" /></div>
                <div>
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">Gestão de <br/><span className="text-emerald-600">Unidades.</span></h1>
                </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2.5 px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100">
                <Globe className="h-4 w-4 text-emerald-500" />
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">SME Itaberaba • Nominal</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 no-print">
            <TabButton id="students" label="Escolas/Alunos" icon={Building} />
            <TabButton id="professionals" label="Profissionais" icon={Briefcase} />
            <TabButton id="projects" label="Projetos" icon={Star} />
          </div>
        </header>

        <div className="flex flex-col md:flex-row justify-between items-center gap-10 no-print">
           <div className="relative group w-full max-w-2xl">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
             <input 
               type="text" 
               placeholder={`Buscar por ${activeTab === 'professionals' ? 'nome/servidor' : activeTab === 'projects' ? 'nome/projeto' : 'escola/aluno'}...`} 
               value={searchTerm} 
               onChange={e => setSearchTerm(e.target.value)} 
               className="input-premium pl-16 !h-16 !text-[12px] !bg-white" 
             />
           </div>
           {activeTab !== 'students' && (
             <button 
               onClick={handleOpenAddModal}
               className="btn-primary !h-16 !px-12 !bg-[#0F172A] !text-[10px] !rounded-[1.8rem] whitespace-nowrap"
             >
               <Plus className="h-6 w-6" /> {activeTab === 'professionals' ? 'Novo Profissional' : 'Novo Projeto'}
             </button>
           )}
        </div>

        {activeTab === 'professionals' && (
          <div className="card-requinte !p-0 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Servidor</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Função Técnica</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Lotação Síncrona</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProfessionals.map(p => (
                  <tr key={p.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-10 py-8">
                        <p className="font-black text-slate-900 uppercase text-sm mb-1">{p.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">CPF: {p.cpf}</p>
                    </td>
                    <td className="px-10 py-8">
                        <div className="flex items-center gap-3">
                           <BriefcaseIcon className="h-4 w-4 text-blue-500" />
                           <span className="font-bold text-slate-600 uppercase text-xs">{p.role}</span>
                        </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className="px-5 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase border border-blue-100">{p.schoolName || 'SME Central'}</span>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button onClick={() => handleOpenEditModal(p)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 shadow-sm transition-all"><Edit3 className="h-4.5 w-4.5" /></button>
                          <button onClick={() => removeProfessional(p.id)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-600 shadow-sm transition-all"><Trash2 className="h-4.5 w-4.5" /></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'students' && (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
             {filteredStudents.map(s => (
               <div key={s.id} className="card-requinte !p-10 group flex flex-col justify-between">
                 <div>
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-16 h-16 rounded-[1.8rem] bg-emerald-50 flex items-center justify-center font-black text-emerald-600 text-2xl shadow-sm border border-emerald-100 group-hover:rotate-12 transition-transform">
                          {s.name.charAt(0)}
                        </div>
                        <button onClick={() => navigate(`/student/monitoring?id=${s.id}`)} className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-600 transition-all"><ChevronRight className="h-6 w-6" /></button>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2 line-clamp-1">{s.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-10">{s.school || 'Unidade em Análise'}</p>
                 </div>
                 <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">NIRE: {s.enrollmentId || '---'}</span>
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${s.status === 'Matriculado' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{s.status}</span>
                 </div>
               </div>
             ))}
           </div>
        )}

        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {filteredProjects.map(proj => (
              <div key={proj.id} className="card-requinte group overflow-hidden flex flex-col h-[520px]">
                <div className="h-48 relative overflow-hidden">
                  <img src={proj.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={proj.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <div className="absolute top-6 right-6 flex gap-3">
                    <button onClick={() => handleOpenEditModal(proj)} className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white hover:text-slate-900 transition-all border border-white/20"><Edit3 className="h-5 w-5" /></button>
                  </div>
                </div>
                <div className="p-10 flex flex-col flex-1">
                   <div className="flex-1">
                     <div className="flex items-center gap-3 mb-4">
                        <Star className="h-4 w-4 text-emerald-500 fill-current" />
                        <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20">{proj.category}</span>
                     </div>
                     <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-5 leading-none">{proj.name}</h3>
                     <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-3">{proj.description}</p>
                   </div>
                   <div className="pt-8 mt-8 border-t border-slate-50 flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Investimento</p>
                        <p className="text-lg font-black text-slate-900">{proj.budget || 'R$ 0,00'}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Participantes</p>
                        <p className="text-lg font-black text-emerald-600">{proj.participantsCount} Alunos</p>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isFormModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsFormModalOpen(false)}></div>
          <div className="bg-white rounded-[4rem] shadow-deep w-full max-w-xl relative p-14 animate-in zoom-in-95 duration-300">
             <div className="flex justify-between items-center mb-12">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                      {editingItem ? 'Editar Registro' : `Novo ${activeTab === 'professionals' ? 'Servidor' : 'Projeto'}`}
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" /> Sincronismo Nominal Ativo
                    </p>
                </div>
                <button onClick={() => setIsFormModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-full transition-all text-slate-300"><X className="h-8 w-8" /></button>
             </div>
             
             <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Nome Completo / Título</label>
                    <input 
                      type="text" required value={formData.name || ''} 
                      onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})} 
                      className="input-premium !h-16 !text-sm" 
                      placeholder="Identificação nominal..."
                    />
                </div>

                {activeTab === 'professionals' ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">CPF</label>
                          <input type="text" value={formData.cpf || ''} onChange={e => setFormData({...formData, cpf: e.target.value})} className="input-premium !h-16 !text-sm" placeholder="000.000.000-00" />
                      </div>
                      <div className="space-y-3">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Cargo</label>
                          <input type="text" value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value.toUpperCase()})} className="input-premium !h-16 !text-sm" placeholder="Ex: PROFESSOR" />
                      </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Unidade de Lotação</label>
                        <select value={formData.schoolId || ''} onChange={e => {
                          const school = schools.find(s => s.id === e.target.value);
                          setFormData({...formData, schoolId: e.target.value, schoolName: school?.name});
                        }} className="input-premium !h-16 !text-sm">
                          <option value="">Selecione a Unidade</option>
                          <option value="SME">SME CENTRAL</option>
                          {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Categoria</label>
                            <input type="text" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value.toUpperCase()})} className="input-premium !h-16 !text-sm" placeholder="Ex: TECNOLOGIA" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Orçamento</label>
                            <input type="text" value={formData.budget || ''} onChange={e => setFormData({...formData, budget: e.target.value})} className="input-premium !h-16 !text-sm" placeholder="Ex: R$ 5.000,00" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Resumo Executivo</label>
                        <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="input-premium !h-40 !text-sm py-6 resize-none" placeholder="Descreva os objetivos do projeto..." />
                    </div>
                  </div>
                )}

                <div className="pt-10 flex gap-6">
                   <button type="button" onClick={() => setIsFormModalOpen(false)} className="btn-secondary !h-16 flex-1 !text-[11px] !rounded-2xl">Descartar</button>
                   <button type="submit" className="btn-primary !h-16 flex-1 !text-[11px] !bg-[#0F172A] !rounded-2xl active:scale-95 group shadow-emerald-900/10">
                       {editingItem ? <Save className="h-5 w-5" /> : <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />}
                       Salvar Base Nominal
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};
