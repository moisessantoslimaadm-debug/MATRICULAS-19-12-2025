import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate, useSearchParams } from '../router';
import { 
  Building, Users, Layers, Star, Plus, Search, 
  Trash2, Briefcase, X, Save, MapPin, Building2, 
  ArrowRight, ArrowLeft, GraduationCap, UserCheck, 
  Stethoscope, PaintBucket, Lock, Edit3
} from 'lucide-react';
import { Professional, Project, School, SchoolType } from '../types';

const INITIAL_SCHOOL_FORM: Partial<School> = {
    name: '',
    inep: '',
    address: '',
    availableSlots: 400,
    types: [],
    hasAEE: false,
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80',
    lat: -12.5265,
    lng: -40.2925,
    rating: 5
};

export const AdminSchoolsManagement: React.FC = () => {
  const { 
    professionals, projects, students, schools, 
    addProfessional, updateProfessional, removeProfessional,
    addProject, updateProject, removeProject, 
    addSchool, updateSchool, // Usando updateSchool
    removeStudent
  } = useData();
  
  const navigate = useNavigate();
  const [params] = useSearchParams();
  
  const schoolIdParam = params.get('schoolId');
  const viewParam = params.get('view') || 'overview'; // overview, students, projects
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [isEditSchoolMode, setIsEditSchoolMode] = useState(false); // Flag para edição de escola
  
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ status: 'Ativo' });
  const [schoolFormData, setSchoolFormData] = useState<Partial<School>>(INITIAL_SCHOOL_FORM);

  // Escola Selecionada (Contexto Atual)
  const selectedSchool = useMemo(() => 
    schools.find(s => s.id === schoolIdParam), 
  [schools, schoolIdParam]);

  // --- FILTROS DE DADOS DA ESCOLA SELECIONADA ---

  const schoolStudents = useMemo(() => {
    if (!selectedSchool) return [];
    return students.filter(s => 
      s.schoolId === selectedSchool.id || s.school === selectedSchool.name
    ).filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [students, selectedSchool, searchTerm]);

  const schoolProfessionals = useMemo(() => {
    if (!selectedSchool) return [];
    return professionals.filter(p => 
      p.schoolId === selectedSchool.id || p.schoolName === selectedSchool.name
    ).filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [professionals, selectedSchool, searchTerm]);

  const schoolProjects = useMemo(() => {
     return projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [projects, searchTerm]);

  // --- AÇÕES ---

  const handleOpenSchool = (school: School) => {
    navigate(`/admin/escolas?schoolId=${school.id}&view=overview`);
    setSearchTerm('');
  };

  const handleBackToUnits = () => {
    navigate(`/admin/escolas`);
    setSearchTerm('');
  };

  // Submit Genérico (Projetos)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchool) return;

    if (viewParam === 'projects') {
        if (editingItem) await updateProject(formData as Project);
        else await addProject({ ...formData, id: `proj-${Date.now()}` } as Project);
    }
    setIsFormModalOpen(false);
  };

  // Submit Escola (Criação ou Edição)
  const handleSchoolSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (isEditSchoolMode && selectedSchool) {
          await updateSchool({ ...selectedSchool, ...schoolFormData } as School);
      } else {
          await addSchool({
              ...schoolFormData,
              id: `sch-${Date.now()}`,
          } as School);
      }
      setIsSchoolModalOpen(false);
      setSchoolFormData(INITIAL_SCHOOL_FORM);
      setIsEditSchoolMode(false);
  };

  // Prepara modal para EDIÇÃO de escola
  const handleEditSchool = () => {
      if (!selectedSchool) return;
      setSchoolFormData({
          ...selectedSchool
      });
      setIsEditSchoolMode(true);
      setIsSchoolModalOpen(true);
  };

  // Prepara modal para CRIAÇÃO de escola
  const handleCreateSchool = () => {
      setSchoolFormData(INITIAL_SCHOOL_FORM);
      setIsEditSchoolMode(false);
      setIsSchoolModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsFormModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ status: 'Ativo' });
    setIsFormModalOpen(true);
  };

  // Manipulação de Tipos de Escola
  const toggleSchoolType = (type: SchoolType) => {
      const currentTypes = schoolFormData.types || [];
      if (currentTypes.includes(type)) {
          setSchoolFormData({ ...schoolFormData, types: currentTypes.filter(t => t !== type) });
      } else {
          setSchoolFormData({ ...schoolFormData, types: [...currentTypes, type] });
      }
  };

  // --------------------------------------------------------------------------------
  // VIEW 1: LISTA DE ESCOLAS (ROOT)
  // --------------------------------------------------------------------------------
  if (!selectedSchool) {
    return (
        <div className="min-h-screen bg-[#f8fafc] py-20 px-12 page-transition">
            <div className="max-w-[1600px] mx-auto space-y-12">
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 border-b border-slate-200 pb-16 no-print">
                    <div className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="bg-[#064e3b] p-5 rounded-[2rem] text-white shadow-2xl rotate-3"><Building className="h-10 w-10" /></div>
                            <div>
                                <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">Rede <br/><span className="text-emerald-600">Municipal.</span></h1>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 w-full max-w-xl">
                        <div className="relative group flex-1">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
                            <input 
                                type="text" 
                                placeholder="Buscar Unidade Escolar..." 
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)} 
                                className="input-premium pl-16 !h-16 !text-[12px] !bg-white" 
                            />
                        </div>
                        <button onClick={handleCreateSchool} className="btn-primary !h-16 !px-8 !text-[10px] !bg-slate-900 shrink-0">
                            <Plus className="h-5 w-5" /> Nova Unidade
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {schools.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(school => (
                        <div key={school.id} className="card-requinte group flex flex-col h-full hover:-translate-y-2 cursor-pointer" onClick={() => handleOpenSchool(school)}>
                            <div className="h-40 relative overflow-hidden border-b border-slate-100">
                                <img src={school.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={school.name} />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">INEP: {school.inep}</div>
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <h3 className="text-lg font-black text-slate-900 uppercase leading-tight group-hover:text-emerald-600 transition-colors mb-4 underline decoration-transparent underline-offset-4 group-hover:decoration-emerald-500">
                                    {school.name}
                                </h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-6 flex items-center gap-2">
                                    <MapPin className="h-3 w-3 text-emerald-500" /> {school.address}
                                </p>
                                <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{school.types[0]}</span>
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL DE CRIAÇÃO/EDIÇÃO DE ESCOLA */}
            {isSchoolModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsSchoolModalOpen(false)}></div>
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl relative p-12 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="font-black text-slate-900 uppercase text-xl tracking-tight flex items-center gap-4">
                                <Building className="h-6 w-6 text-emerald-600" /> {isEditSchoolMode ? 'Editar Unidade' : 'Nova Unidade Escolar'}
                            </h3>
                            <button onClick={() => setIsSchoolModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="h-5 w-5 text-slate-400" /></button>
                        </div>
                        
                        <form onSubmit={handleSchoolSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome da Instituição</label>
                                <input type="text" required value={schoolFormData.name} onChange={e => setSchoolFormData({...schoolFormData, name: e.target.value.toUpperCase()})} className="input-premium" placeholder="EX: ESCOLA MUNICIPAL..." />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Código INEP</label>
                                    <input type="text" required value={schoolFormData.inep} onChange={e => setSchoolFormData({...schoolFormData, inep: e.target.value})} className="input-premium" placeholder="00000000" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacidade de Alunos</label>
                                    <input type="number" required value={schoolFormData.availableSlots} onChange={e => setSchoolFormData({...schoolFormData, availableSlots: parseInt(e.target.value)})} className="input-premium" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Endereço Completo</label>
                                <input type="text" required value={schoolFormData.address} onChange={e => setSchoolFormData({...schoolFormData, address: e.target.value})} className="input-premium" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Latitude</label>
                                    <input type="number" step="any" value={schoolFormData.lat} onChange={e => setSchoolFormData({...schoolFormData, lat: parseFloat(e.target.value)})} className="input-premium" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Longitude</label>
                                    <input type="number" step="any" value={schoolFormData.lng} onChange={e => setSchoolFormData({...schoolFormData, lng: parseFloat(e.target.value)})} className="input-premium" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Imagem (URL)</label>
                                <input type="text" value={schoolFormData.image} onChange={e => setSchoolFormData({...schoolFormData, image: e.target.value})} className="input-premium" />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Modalidades de Ensino</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.values(SchoolType).map((type) => (
                                        <label key={type} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${schoolFormData.types?.includes(type) ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white'}`}>
                                            <input 
                                                type="checkbox" 
                                                checked={schoolFormData.types?.includes(type)}
                                                onChange={() => toggleSchoolType(type)}
                                                className="rounded text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span className="text-[10px] font-bold uppercase">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                <input 
                                    type="checkbox" 
                                    checked={schoolFormData.hasAEE}
                                    onChange={e => setSchoolFormData({...schoolFormData, hasAEE: e.target.checked})}
                                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-[11px] font-black text-blue-800 uppercase tracking-wide">Unidade possui Sala de Recursos (AEE)?</span>
                            </div>

                            <div className="flex justify-end gap-3 pt-6">
                                <button type="button" onClick={() => setIsSchoolModalOpen(false)} className="btn-secondary !h-14 !px-10 !text-[10px]">Cancelar</button>
                                <button type="submit" className="btn-primary !h-14 !px-10 !text-[10px] !bg-emerald-600"><Save className="h-4 w-4" /> {isEditSchoolMode ? 'Atualizar Dados' : 'Registrar Escola'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
  }

  // --------------------------------------------------------------------------------
  // VIEW 2: DASHBOARD DA ESCOLA (ABAS: ALUNOS, PROJETOS)
  // --------------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-8 page-transition">
        <div className="max-w-[1600px] mx-auto space-y-10">
            {/* Header da Escola */}
            <div className="bg-white rounded-[3rem] p-12 shadow-luxury border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] -mr-64 -mt-64 opacity-60"></div>
                <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start gap-10">
                    <div className="flex flex-col gap-6">
                         <button onClick={handleBackToUnits} className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition group w-fit">
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Voltar para Rede
                        </button>
                        <div className="flex items-center gap-8">
                            <div className="w-24 h-24 rounded-[2rem] bg-slate-900 border-[6px] border-white shadow-2xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-700">
                                <img src={selectedSchool.image} className="w-full h-full object-cover" alt="School" />
                            </div>
                            <div>
                                <div className="flex items-center gap-4 mb-2">
                                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">{selectedSchool.name}</h1>
                                    <button onClick={handleEditSchool} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors shadow-sm" title="Editar Escola">
                                        <Edit3 className="h-4 w-4" />
                                    </button>
                                </div>
                                <p className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-3 bg-emerald-50 px-3 py-1 rounded-lg w-fit border border-emerald-100">INEP: {selectedSchool.inep} • {selectedSchool.address}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                        {[
                            { id: 'overview', label: 'Visão Geral', icon: Building2 },
                            { id: 'students', label: 'Alunos', icon: GraduationCap },
                            { id: 'projects', label: 'Projetos', icon: Star },
                        ].map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => navigate(`/admin/escolas?schoolId=${selectedSchool.id}&view=${tab.id}`)}
                                className={`flex items-center gap-3 px-8 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${viewParam === tab.id ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-slate-50 text-slate-400 hover:bg-white hover:shadow-lg border border-transparent hover:border-slate-100'}`}
                            >
                                <tab.icon className={`h-4 w-4 ${viewParam === tab.id ? 'text-emerald-400' : ''}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ABA 1: VISÃO GERAL */}
            {viewParam === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
                     <div className="card-requinte !p-10 flex flex-col justify-between h-48 border-l-[8px] border-emerald-500">
                        <Users className="h-8 w-8 text-emerald-600" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Alunos</p>
                            <p className="text-4xl font-black text-slate-900 tracking-tighter">{schoolStudents.length}</p>
                        </div>
                     </div>
                     <div className="card-requinte !p-10 flex flex-col justify-between h-48 border-l-[8px] border-blue-500">
                        <Briefcase className="h-8 w-8 text-blue-600" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Corpo Docente</p>
                            <p className="text-4xl font-black text-slate-900 tracking-tighter">{schoolProfessionals.length}</p>
                        </div>
                     </div>
                     <div className="card-requinte !p-10 flex flex-col justify-between h-48 border-l-[8px] border-amber-500">
                        <Layers className="h-8 w-8 text-amber-600" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Capacidade</p>
                            <p className="text-4xl font-black text-slate-900 tracking-tighter">{selectedSchool.availableSlots}</p>
                        </div>
                     </div>
                     <button 
                        onClick={() => navigate(`/admin/escolas?schoolId=${selectedSchool.id}&view=students`)}
                        className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-deep flex flex-col justify-center items-center gap-4 hover:bg-emerald-600 transition-colors group"
                     >
                        <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-emerald-600 transition-all">
                            <ArrowRight className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Gerenciar Turmas</span>
                     </button>
                </div>
            )}

            {/* ABA 2: ALUNOS */}
            {viewParam === 'students' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
                    <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="relative group w-full max-w-md">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                            <input 
                                type="text" 
                                placeholder="Buscar aluno nesta escola..." 
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)} 
                                className="input-premium pl-14 !h-14 !text-[11px] !bg-slate-50" 
                            />
                        </div>
                        <div className="text-right">
                            <span className="block text-2xl font-black text-slate-900">{schoolStudents.length}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Matriculados</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {schoolStudents.map(student => (
                            <div key={student.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group flex items-start gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-emerald-600 font-black text-lg border border-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    {student.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-black text-slate-900 text-xs uppercase leading-tight truncate">{student.name}</h4>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">CPF: {student.cpf}</p>
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={() => navigate(`/student/monitoring?id=${student.id}`)} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">Ver Pasta</button>
                                        <button onClick={() => removeStudent(student.id)} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="h-3 w-3" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ABA 3: PROJETOS */}
            {viewParam === 'projects' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
                    <div className="flex justify-end">
                        <button onClick={handleOpenAdd} className="btn-primary !h-14 !px-8 !text-[10px] !bg-emerald-600 shadow-emerald-200">
                            <Plus className="h-4 w-4" /> Novo Projeto
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {schoolProjects.map(proj => (
                            <div key={proj.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-luxury flex gap-8 items-center relative overflow-hidden group">
                                <div className="w-32 h-32 rounded-[2rem] bg-slate-100 flex-shrink-0 overflow-hidden">
                                    {proj.image ? <img src={proj.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Project" /> : <Star className="h-10 w-10 text-slate-300 m-auto" />}
                                </div>
                                <div>
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest mb-3 inline-block">{proj.category}</span>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">{proj.name}</h3>
                                    <p className="text-[10px] font-medium text-slate-400 leading-relaxed max-w-sm">{proj.description}</p>
                                    <div className="mt-4 flex items-center gap-4">
                                        <button onClick={() => handleOpenEdit(proj)} className="text-[10px] font-black uppercase text-slate-400 hover:text-emerald-600 transition-colors">Gerenciar</button>
                                        <button onClick={() => removeProject(proj.id)} className="text-[10px] font-black uppercase text-slate-400 hover:text-red-600 transition-colors">Arquivar</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Modal de Formulário Genérico */}
        {isFormModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsFormModalOpen(false)}></div>
                <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative p-10 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-slate-900 uppercase text-lg tracking-tight">
                            {editingItem ? 'Editar Registro' : 'Novo Cadastro'}
                        </h3>
                        <button onClick={() => setIsFormModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="h-5 w-5 text-slate-400" /></button>
                    </div>
                    
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        {viewParam === 'projects' && (
                             <>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Projeto</label>
                                    <input type="text" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})} className="input-premium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição</label>
                                    <textarea required value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="input-premium h-32 py-4" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
                                        <input type="text" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="input-premium" />
                                    </div>
                                     <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Orçamento</label>
                                        <input type="text" value={formData.budget || ''} onChange={e => setFormData({...formData, budget: e.target.value})} className="input-premium" />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="flex justify-end gap-3 pt-6">
                            <button type="button" onClick={() => setIsFormModalOpen(false)} className="btn-secondary !h-12 !px-8 !text-[10px]">Cancelar</button>
                            <button type="submit" className="btn-primary !h-12 !px-8 !text-[10px] !bg-slate-900"><Save className="h-4 w-4" /> Salvar Dados</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};