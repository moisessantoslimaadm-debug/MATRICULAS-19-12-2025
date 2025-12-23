import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate, useSearchParams } from '../router';
import { 
  Building, Users, Layers, Star, Plus, Search, 
  ChevronRight, Trash2, Edit3, Globe, Briefcase, 
  Zap, X, Save, ShieldCheck, Printer, FileText,
  MapPin, CheckCircle, Info, Building2, ArrowRight, ArrowLeft
} from 'lucide-react';
import { Professional, Project, RegistryStudent, School } from '../types';

export const AdminSchoolsManagement: React.FC = () => {
  const { 
    professionals, projects, students, schools, 
    addProfessional, updateProfessional, removeProfessional,
    addProject, updateProject, removeProject, 
    updateStudent, removeStudent
  } = useData();
  
  const navigate = useNavigate();
  const [params] = useSearchParams();
  
  const tabParam = params.get('tab');
  const schoolIdParam = params.get('schoolId');
  
  const [activeTab, setActiveTab] = useState<'units' | 'professionals' | 'students' | 'projects' | 'censo'>(
    (tabParam as any) || 'units'
  );
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ status: 'Ativo' });
  const [selectedSchoolForCenso, setSelectedSchoolForCenso] = useState<School | null>(null);

  // Sincronização com URL para Deep Linking
  useEffect(() => {
    if (tabParam) setActiveTab(tabParam as any);
    if (tabParam === 'censo' && schoolIdParam && schools.length > 0) {
        const school = schools.find(s => s.id === schoolIdParam);
        if (school) setSelectedSchoolForCenso(school);
    }
  }, [tabParam, schoolIdParam, schools]);

  const censoData = useMemo(() => {
    if (!selectedSchoolForCenso) return null;
    const schoolStudents = students.filter(s => s.schoolId === selectedSchoolForCenso.id || s.school === selectedSchoolForCenso.name);
    const schoolProfs = professionals.filter(p => p.schoolId === selectedSchoolForCenso.id);
    return {
        totalStudents: schoolStudents.length,
        specialNeeds: schoolStudents.filter(s => s.specialNeeds).length,
        transport: schoolStudents.filter(s => s.transportRequest).length,
        teachers: schoolProfs.filter(p => p.role.toUpperCase().includes('PROFESSOR')).length,
        staff: schoolProfs.length,
        classes: Math.ceil(schoolStudents.length / 25) || 1
    };
  }, [selectedSchoolForCenso, students, professionals]);

  const filteredItems = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (activeTab === 'units') return schools.filter(s => s.name.toLowerCase().includes(term) || s.inep?.includes(term));
    if (activeTab === 'professionals') return professionals.filter(p => p.name.toLowerCase().includes(term) || p.cpf.includes(term));
    if (activeTab === 'students') return students.filter(s => s.name.toLowerCase().includes(term) || s.cpf.includes(term));
    if (activeTab === 'projects') return projects.filter(p => p.name.toLowerCase().includes(term));
    return [];
  }, [activeTab, schools, professionals, students, projects, searchTerm]);

  const handleOpenSchoolCenso = (school: School) => {
    setSelectedSchoolForCenso(school);
    setActiveTab('censo');
    navigate(`/admin/escolas?tab=censo&schoolId=${school.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToUnits = () => {
    setActiveTab('units');
    navigate(`/admin/escolas?tab=units`);
  };

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
      else await addProject({ ...formData, id: `proj-${Date.now()}`, participantsCount: 0, status: 'Ativo' } as Project);
    } else if (activeTab === 'students' && editingItem) {
      await updateStudent(formData as RegistryStudent);
    }
    setIsFormModalOpen(false);
  };

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button 
      onClick={() => { navigate(`/admin/escolas?tab=${id}`); setActiveTab(id); setSearchTerm(''); }}
      className={`flex items-center gap-4 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === id ? 'bg-[#0F172A] text-white shadow-deep scale-105' : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-100'}`}
    >
      <Icon className={`h-4 w-4 ${activeTab === id ? 'text-emerald-400' : 'text-slate-300'}`} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 px-12 page-transition">
      <div className="max-w-[1600px] mx-auto space-y-12">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 border-b border-slate-200 pb-16 no-print">
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
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">SME Itaberaba • Cloud Sincronizado</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 no-print">
            <TabButton id="units" label="Escolas" icon={Building2} />
            <TabButton id="students" label="Alunos" icon={Users} />
            <TabButton id="professionals" label="Profissionais" icon={Briefcase} />
            <TabButton id="projects" label="Projetos" icon={Star} />
            <TabButton id="censo" label="Censo 2025" icon={FileText} />
          </div>
        </header>

        {activeTab === 'censo' && selectedSchoolForCenso ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
                <div className="flex justify-between items-center no-print">
                    <button onClick={handleBackToUnits} className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition group">
                        <ArrowLeft className="h-4 w-4" /> Voltar para Lista
                    </button>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" /> Certificação Nominal MEC
                    </span>
                </div>

                <div className="bg-white p-12 rounded-[2rem] shadow-luxury border border-slate-200 print:shadow-none print:border-slate-400">
                  <div className="flex flex-col items-center text-center mb-10">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Coat_of_arms_of_Brazil.svg/1200px-Coat_of_arms_of_Brazil.svg.png" className="w-16 h-16 mb-4" alt="Brasão do Brasil" />
                    <p className="text-[12px] font-bold text-slate-800 uppercase">Ministério da Educação</p>
                    <p className="text-[11px] font-medium text-slate-700">Inep - Educacenso 2025</p>
                    <div className="w-full h-px bg-slate-300 my-4"></div>
                    <div className="text-left w-full">
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">Recibo de Fechamento de Unidade</h2>
                      <h3 className="text-lg font-black text-slate-900 mt-1 uppercase">{selectedSchoolForCenso.inep} - {selectedSchoolForCenso.name}</h3>
                    </div>
                  </div>

                  <div className="mb-10 overflow-x-auto">
                    <table className="w-full text-center border-collapse">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border border-slate-300 p-4 text-[10px] font-black uppercase text-slate-600">Turmas</th>
                          <th className="border border-slate-300 p-4 text-[10px] font-black uppercase text-slate-600">Total Alunos</th>
                          <th className="border border-slate-300 p-4 text-[10px] font-black uppercase text-slate-600">Alunos AEE</th>
                          <th className="border border-slate-300 p-4 text-[10px] font-black uppercase text-slate-600">Docentes Ativos</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-300 p-6 text-sm font-black">{censoData?.classes}</td>
                          <td className="border border-slate-300 p-6 text-sm font-black">{censoData?.totalStudents}</td>
                          <td className="border border-slate-300 p-6 text-sm font-black">{censoData?.specialNeeds}</td>
                          <td className="border border-slate-300 p-6 text-sm font-black">{censoData?.teachers}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-16 pt-10 border-t-2 border-slate-900">
                    <div className="grid grid-cols-2 gap-8 text-[11px]">
                      <div className="space-y-3">
                        <div className="flex gap-4"><span className="font-bold text-slate-500">Responsável SME:</span><span className="font-black uppercase">SISTEMA SÍNCRONO NOMINAL</span></div>
                        <div className="flex gap-4"><span className="font-bold text-slate-500">ID Auditoria:</span><span className="font-mono font-black text-[9px]">{selectedSchoolForCenso.id.toUpperCase()}</span></div>
                      </div>
                      <div className="text-right italic text-slate-400 text-[9px]">Documento digital emitido em {new Date().toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center no-print pb-20">
                  <button onClick={() => window.print()} className="btn-primary !h-20 !px-20 shadow-deep">
                    <Printer className="h-6 w-6" /> Imprimir Recibo Oficial
                  </button>
                </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center gap-10 no-print">
               <div className="relative group w-full max-w-2xl">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
                 <input 
                   type="text" 
                   placeholder={`Buscar em ${activeTab === 'professionals' ? 'Profissionais' : activeTab === 'students' ? 'Alunos' : 'Escolas'}...`} 
                   value={searchTerm} 
                   onChange={e => setSearchTerm(e.target.value)} 
                   className="input-premium pl-16 !h-16 !text-[12px] !bg-white" 
                 />
               </div>
               {['professionals', 'projects'].includes(activeTab) && (
                 <button onClick={handleOpenAddModal} className="btn-primary !h-16 !px-10 shadow-emerald-200">
                    <Plus className="h-5 w-5" /> Novo Registro
                 </button>
               )}
            </div>

            <div className="card-requinte !p-0 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificação</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detalhes Técnicos</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredItems.map((item: any) => (
                      <tr key={item.id} className="group hover:bg-slate-50/50 transition-all">
                        <td className="px-10 py-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-emerald-600">
                                    {item.name?.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-black text-slate-900 uppercase text-sm">{item.name}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">{item.cpf || item.inep || 'Cód: ' + item.id}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-10 py-8">
                            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase border border-blue-100">
                                {item.role || item.status || item.school || item.address}
                            </span>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <div className="flex justify-end gap-3">
                                {activeTab === 'units' ? (
                                    <button onClick={() => handleOpenSchoolCenso(item)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 shadow-sm transition-all">
                                        <ArrowRight className="h-4.5 w-4.5" />
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={() => handleOpenEditModal(item)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600"><Edit3 className="h-4 w-4" /></button>
                                        <button onClick={() => activeTab === 'professionals' ? removeProfessional(item.id) : activeTab === 'students' ? removeStudent(item.id) : removeProject(item.id)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                                    </>
                                )}
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </>
        )}
      </div>

      {/* Modal de Formulário Único para Gestão */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsFormModalOpen(false)}></div>
          <div className="bg-white rounded-[3rem] shadow-deep w-full max-w-xl relative p-12 animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-slate-900 uppercase">Gestão Nominal</h3>
                <button onClick={() => setIsFormModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="h-6 w-6" /></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nome Completo</label>
                    <input type="text" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})} className="input-premium !h-14 !text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Documento / CPF</label>
                        <input type="text" value={formData.cpf || ''} onChange={e => setFormData({...formData, cpf: e.target.value})} className="input-premium !h-14 !text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Status / Função</label>
                        <input type="text" value={formData.role || formData.status || ''} onChange={e => setFormData({...formData, role: e.target.value})} className="input-premium !h-14 !text-sm" />
                    </div>
                </div>
                <div className="pt-6 flex gap-4">
                    <button type="button" onClick={() => setIsFormModalOpen(false)} className="btn-secondary flex-1 !h-14">Cancelar</button>
                    <button type="submit" className="btn-primary flex-1 !h-14 !bg-emerald-600">Salvar no Cloud</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};
