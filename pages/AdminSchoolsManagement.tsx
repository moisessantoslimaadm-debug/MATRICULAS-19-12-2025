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
    updateStudent, linkStudentToProject 
  } = useData();
  
  const navigate = useNavigate();
  const [params] = useSearchParams();
  
  // Leitura dos parâmetros da URL
  const tabParam = params.get('tab');
  const schoolIdParam = params.get('schoolId');
  
  // 'units' é agora uma das abas possíveis
  const [activeTab, setActiveTab] = useState<'units' | 'professionals' | 'students' | 'projects' | 'censo'>(
    (tabParam as any) || 'units'
  );
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ status: 'Ativo' });
  
  // Estado para armazenar a escola selecionada para visualização do Censo
  const [selectedSchoolForCenso, setSelectedSchoolForCenso] = useState<School | null>(null);

  // Sincroniza o estado com a URL
  useEffect(() => {
    if (tabParam && ['units', 'professionals', 'students', 'projects', 'censo'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }

    // Deep Linking: Recupera a escola selecionada via URL se estivermos na aba censo
    if (tabParam === 'censo' && schoolIdParam && schools.length > 0) {
        const school = schools.find(s => s.id === schoolIdParam);
        if (school) {
            setSelectedSchoolForCenso(school);
        }
    }
  }, [tabParam, schoolIdParam, schools]);

  // Cálculos dinâmicos para o Censo da escola selecionada
  const censoData = useMemo(() => {
    if (!selectedSchoolForCenso) return null;

    const schoolStudents = students.filter(s => s.schoolId === selectedSchoolForCenso.id || s.school === selectedSchoolForCenso.name);
    const schoolProfs = professionals.filter(p => p.schoolId === selectedSchoolForCenso.id);
    
    return {
        totalStudents: schoolStudents.length,
        specialNeeds: schoolStudents.filter(s => s.specialNeeds).length,
        transport: schoolStudents.filter(s => s.transportRequest).length,
        // Filtra professores por string (exemplo simplificado)
        teachers: schoolProfs.filter(p => p.role.toUpperCase().includes('PROFESSOR') || p.role.toUpperCase().includes('DOCENTE')).length,
        staff: schoolProfs.length,
        // Mock de turmas baseado no total de alunos (média de 25 por turma, mínimo 1)
        classes: Math.ceil(schoolStudents.length / 25) || 1
    };
  }, [selectedSchoolForCenso, students, professionals]);

  const filteredSchools = useMemo(() => schools.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || (s.inep && s.inep.includes(searchTerm))
  ), [schools, searchTerm]);

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

  // Função para abrir o censo da escola com persistência na URL
  const handleOpenSchoolCenso = (school: School) => {
    setSelectedSchoolForCenso(school);
    setActiveTab('censo');
    // Adiciona o ID da escola na URL para permitir F5/Refresh e Deep Linking
    navigate(`/admin/escolas?tab=censo&schoolId=${school.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToUnits = () => {
    setActiveTab('units');
    navigate(`/admin/escolas?tab=units`);
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
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">SME Itaberaba • Nominal</span>
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

        {activeTab === 'censo' ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
            {!selectedSchoolForCenso ? (
               <div className="flex flex-col items-center justify-center py-32 text-center border-4 border-dashed border-slate-100 rounded-[3rem]">
                  <Building2 className="h-20 w-20 text-slate-200 mb-6" />
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Nenhuma Unidade Selecionada</h3>
                  <p className="text-slate-400 font-medium mb-8">Selecione uma escola na aba "Escolas" para visualizar o recibo do Censo.</p>
                  <button onClick={() => { setActiveTab('units'); navigate('/admin/escolas?tab=units'); }} className="btn-primary !h-14 !px-10 !text-[10px] !rounded-2xl">
                    Ir para Lista de Escolas
                  </button>
               </div>
            ) : (
                <>
                {/* Actions Bar */}
                <div className="flex justify-between items-center no-print">
                    <button onClick={handleBackToUnits} className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition group">
                        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 group-hover:-translate-x-1 transition-transform">
                            <ArrowLeft className="h-4 w-4" />
                        </div>
                        Voltar para Lista
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle className="h-3 w-3" /> Dados Sincronizados
                        </span>
                    </div>
                </div>

                {/* Header do Relatório Educacenso */}
                <div className="bg-white p-12 rounded-[2rem] shadow-luxury border border-slate-200 print:shadow-none print:border-slate-400">
                  <div className="flex flex-col items-center text-center mb-10">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Coat_of_arms_of_Brazil.svg/1200px-Coat_of_arms_of_Brazil.svg.png" className="w-16 h-16 mb-4" alt="Brasão do Brasil" />
                    <p className="text-[12px] font-bold text-slate-800 uppercase">Ministério da Educação</p>
                    <p className="text-[11px] font-medium text-slate-700">Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira</p>
                    <div className="w-full h-px bg-slate-300 my-4"></div>
                    <div className="text-left w-full space-y-1">
                      <p className="text-[10px] font-black text-slate-900">Sistema disponível apenas para leitura.</p>
                      <p className="text-[10px] font-bold text-slate-600">Escola fechada! Para cadastrar/editar dados, faz-se necessária a retificação do Censo.</p>
                      <p className="text-[9px] text-slate-500 italic">As informações constantes neste recibo poderão sofrer alterações, devido a correções de inconsistências identificadas pela Secretaria Estadual de Educação ou pelo Inep.</p>
                    </div>
                    <div className="w-full h-px bg-slate-300 my-4"></div>
                    <div className="text-left w-full">
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">Educacenso 2025</h2>
                      <h3 className="text-lg font-black text-slate-900 mt-1 uppercase">{selectedSchoolForCenso.inep} {selectedSchoolForCenso.name}</h3>
                      <p className="text-md font-bold text-slate-600">Recibo</p>
                    </div>
                  </div>

                  {/* Seção Dados da Entidade */}
                  <div className="mb-10">
                    <div className="bg-slate-50 px-6 py-3 border-b-2 border-slate-900 mb-6">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase">Dados da entidade</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 px-6 text-[11px]">
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-500">Código da Escola:</span>
                        <span className="font-black text-slate-900">{selectedSchoolForCenso.inep}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-500">Nome da Escola:</span>
                        <span className="font-black text-slate-900 text-right">{selectedSchoolForCenso.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-500">Situação de Funcionamento:</span>
                        <span className="font-black text-slate-900">Em atividade</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-500">Dependência administrativa:</span>
                        <span className="font-black text-slate-900">Municipal</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-500">Categoria de Escola Privada:</span>
                        <span className="font-black text-slate-900">---</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-500">Localização/ Zona da escola:</span>
                        <span className="font-black text-slate-900">Urbana</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-500">UF:</span>
                        <span className="font-black text-slate-900">Bahia</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-500">Município:</span>
                        <span className="font-black text-slate-900">Itaberaba</span>
                      </div>
                    </div>
                  </div>

                  {/* Seção Turmas e Alunos */}
                  <div className="mb-10 overflow-x-auto">
                    <div className="bg-slate-50 px-6 py-3 border-b-2 border-slate-900 mb-6">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase">Turmas e alunos</h4>
                    </div>
                    <table className="w-full text-center border-collapse">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border border-slate-300 p-4 text-[10px] font-black uppercase text-slate-600">Turmas</th>
                          <th className="border border-slate-300 p-4 text-[10px] font-black uppercase text-slate-600">Áreas do conhecimento confirmadas sem docente</th>
                          <th className="border border-slate-300 p-4 text-[10px] font-black uppercase text-slate-600">Total de Alunos (as)</th>
                          <th className="border border-slate-300 p-4 text-[10px] font-black uppercase text-slate-600">Alunos(as) com Deficiência, TEA e Altas Habilidades</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-300 p-6 text-sm font-black">{censoData?.classes}</td>
                          <td className="border border-slate-300 p-6 text-sm font-black">0</td>
                          <td className="border border-slate-300 p-6 text-sm font-black">{censoData?.totalStudents}</td>
                          <td className="border border-slate-300 p-6 text-sm font-black">{censoData?.specialNeeds}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Seção Profissionais Escolares */}
                  <div className="mb-10 overflow-x-auto">
                    <div className="bg-slate-50 px-6 py-3 border-b-2 border-slate-900 mb-6">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase">Profissionais Escolares</h4>
                    </div>
                    <table className="w-full text-center border-collapse">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border border-slate-300 p-3 text-[9px] font-black uppercase text-slate-600">Docentes</th>
                          <th className="border border-slate-300 p-3 text-[9px] font-black uppercase text-slate-600">Tutores Auxiliares</th>
                          <th className="border border-slate-300 p-3 text-[9px] font-black uppercase text-slate-600">Profissionais/ monitores atividade complementar</th>
                          <th className="border border-slate-300 p-3 text-[9px] font-black uppercase text-slate-600">Instrutores da Educação Profissional</th>
                          <th className="border border-slate-300 p-3 text-[9px] font-black uppercase text-slate-600">Auxiliares/ assistentes educacionais</th>
                          <th className="border border-slate-300 p-3 text-[9px] font-black uppercase text-slate-600">Tradutores/ Intérpretes de Libras</th>
                          <th className="border border-slate-300 p-3 text-[9px] font-black uppercase text-slate-600">Profissionais apoio escolar deficiência</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-300 p-4 text-sm font-black">{censoData?.teachers}</td>
                          <td className="border border-slate-300 p-4 text-sm font-black">0</td>
                          <td className="border border-slate-300 p-4 text-sm font-black">0</td>
                          <td className="border border-slate-300 p-4 text-sm font-black">0</td>
                          <td className="border border-slate-300 p-4 text-sm font-black">{Math.max(0, (censoData?.staff || 0) - (censoData?.teachers || 0))}</td>
                          <td className="border border-slate-300 p-4 text-sm font-black">0</td>
                          <td className="border border-slate-300 p-4 text-sm font-black">{Math.ceil((censoData?.specialNeeds || 0) / 3)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Seção Informações de Vínculo */}
                  <div className="mb-10 overflow-x-auto">
                    <div className="bg-slate-50 px-6 py-3 border-b-2 border-slate-900 mb-6">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase">Informações de vínculo</h4>
                    </div>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-center">
                          <th rowSpan={2} className="border border-slate-300 p-3 text-[10px] font-black uppercase text-slate-600">Tipo de mediação didático-pedagógica</th>
                          <th rowSpan={2} className="border border-slate-300 p-3 text-[10px] font-black uppercase text-slate-600">Total</th>
                          <th colSpan={5} className="border border-slate-300 p-3 text-[10px] font-black uppercase text-slate-600">Matrículas</th>
                        </tr>
                        <tr className="bg-slate-50 text-center">
                          <th className="border border-slate-300 p-2 text-[8px] font-black uppercase text-slate-500">Ensino Regular</th>
                          <th className="border border-slate-300 p-2 text-[8px] font-black uppercase text-slate-500">EJA</th>
                          <th className="border border-slate-300 p-2 text-[8px] font-black uppercase text-slate-500">Curso Técnico</th>
                          <th className="border border-slate-300 p-2 text-[8px] font-black uppercase text-slate-500">Atividade Complementar</th>
                          <th className="border border-slate-300 p-2 text-[8px] font-black uppercase text-slate-500">AEE</th>
                        </tr>
                      </thead>
                      <tbody className="text-center font-black text-slate-900">
                        <tr>
                          <td className="border border-slate-300 p-4 text-left text-[10px] uppercase">Presencial</td>
                          <td className="border border-slate-300 p-4">{censoData?.totalStudents}</td>
                          <td className="border border-slate-300 p-4">{censoData?.totalStudents}</td>
                          <td className="border border-slate-300 p-4">0</td>
                          <td className="border border-slate-300 p-4">0</td>
                          <td className="border border-slate-300 p-4">0</td>
                          <td className="border border-slate-300 p-4">{censoData?.specialNeeds}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-4 text-left text-[10px] uppercase">Semipresencial</td>
                          <td className="border border-slate-300 p-4">0</td>
                          <td className="border border-slate-300 p-4">0</td>
                          <td className="border border-slate-300 p-4">0</td>
                          <td className="border border-slate-300 p-4">0</td>
                          <td className="border border-slate-300 p-4">0</td>
                          <td className="border border-slate-300 p-4">0</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-4 text-left text-[10px] uppercase">EAD</td>
                          <td className="border border-slate-300 p-4">0</td>
                          <td className="border border-slate-300 p-4">0</td>
                          <td className="border border-slate-300 p-4">0</td>
                          <td className="border border-slate-300 p-4">0</td>
                          <td className="border border-slate-300 p-4">0</td>
                          <td className="border border-slate-300 p-4">0</td>
                        </tr>
                      </tbody>
                      <tfoot className="bg-slate-100 text-center font-black text-slate-900">
                        <tr>
                          <td className="border border-slate-300 p-4 text-left text-[10px] uppercase">Total</td>
                          <td className="border border-slate-300 p-4">{censoData?.totalStudents}</td>
                          <td className="border border-slate-300 p-4">{censoData?.totalStudents}</td>
                          <td className="border border-slate-300 p-4">0</td>
                          <td className="border border-slate-300 p-4">0</td>
                          <td className="border border-slate-300 p-4">0</td>
                          <td className="border border-slate-300 p-4">{censoData?.specialNeeds}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Seção Alunos que utilizam transporte escolar */}
                  <div className="mb-10 w-fit">
                    <div className="bg-slate-50 px-6 py-3 border-b-2 border-slate-900 mb-6">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase">Alunos de escolarização que utilizam transporte escolar</h4>
                    </div>
                    <table className="min-w-[400px] text-center border-collapse">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border border-slate-300 p-4 text-[10px] font-black uppercase text-slate-600">Poder Público</th>
                          <th className="border border-slate-300 p-4 text-[10px] font-black uppercase text-slate-600">Alunos</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-300 p-4 text-[11px] font-bold">Municipal</td>
                          <td className="border border-slate-300 p-4 font-black">{censoData?.transport}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-4 text-[11px] font-bold">Estadual</td>
                          <td className="border border-slate-300 p-4 font-black">0</td>
                        </tr>
                      </tbody>
                      <tfoot className="bg-slate-100">
                        <tr>
                          <td className="border border-slate-300 p-4 text-[11px] font-black">Total</td>
                          <td className="border border-slate-300 p-4 font-black">{censoData?.transport}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Seção Autenticação */}
                  <div className="mb-10">
                    <div className="bg-slate-50 px-6 py-3 border-b-2 border-slate-900 mb-6">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase">Autenticação</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-8 px-6 text-[10px]">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-500 uppercase">Nome do gestor escola</p>
                        <p className="font-black text-slate-900 uppercase">PAULA VANESSA BOMFIM DE ABREU</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-500 uppercase">CPF do gestor escolar</p>
                        <p className="font-black text-slate-900">80231322534</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-500 uppercase">Cargo</p>
                        <p className="font-black text-slate-900 uppercase">Diretor</p>
                      </div>
                    </div>
                  </div>

                  {/* Rodapé Responsável */}
                  <div className="mt-16 pt-10 border-t-2 border-slate-900">
                    <h4 className="text-[12px] font-black text-slate-900 uppercase mb-6">Responsável pelo Fechamento do Censo Escolar - Educacenso 2025</h4>
                    <div className="grid grid-cols-2 gap-8 text-[11px]">
                      <div className="space-y-3">
                        <div className="flex gap-4">
                          <span className="font-bold text-slate-500 min-w-[150px]">Nome do informante:</span>
                          <span className="font-black text-slate-900 uppercase">NORA NOVAES MELO</span>
                        </div>
                        <div className="flex gap-4">
                          <span className="font-bold text-slate-500 min-w-[150px]">CPF responsável:</span>
                          <span className="font-black text-slate-900">08946353520</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex gap-4">
                          <span className="font-bold text-slate-500 min-w-[150px]">Data/Hora do encerramento:</span>
                          <span className="font-black text-slate-900 uppercase">15/10/2025 às 17:29:14</span>
                        </div>
                        <div className="flex gap-4">
                          <span className="font-bold text-slate-500 min-w-[150px]">Código do recibo:</span>
                          <span className="font-black text-slate-900 uppercase">1EFF15E6CB8081EFFAD0072661E5BA46</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-10 text-right italic">Emitido em 28/10/2025 às 10:17:13</p>
                  </div>
                </div>

                {/* Ações de Impressão */}
                <div className="flex justify-center no-print pb-20">
                  <button onClick={() => window.print()} className="btn-primary !h-20 !px-20 shadow-deep">
                    <Printer className="h-6 w-6" /> Imprimir Recibo Educacenso
                  </button>
                </div>
                </>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center gap-10 no-print">
               <div className="relative group w-full max-w-2xl">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
                 <input 
                   type="text" 
                   placeholder={`Buscar por ${activeTab === 'professionals' ? 'nome/servidor' : activeTab === 'projects' ? 'nome/projeto' : activeTab === 'units' ? 'unidade escolar' : 'escola/aluno'}...`} 
                   value={searchTerm} 
                   onChange={e => setSearchTerm(e.target.value)} 
                   className="input-premium pl-16 !h-16 !text-[12px] !bg-white" 
                 />
               </div>
               {activeTab !== 'students' && activeTab !== 'units' && (
                 <button 
                   onClick={handleOpenAddModal}
                   className="btn-primary !h-16 !px-12 !bg-[#0F172A] !text-[10px] !rounded-[1.8rem] whitespace-nowrap"
                 >
                   <Plus className="h-6 w-6" /> {activeTab === 'professionals' ? 'Novo Profissional' : 'Novo Projeto'}
                 </button>
               )}
            </div>

            {/* Nova ABA UNIDADES */}
            {activeTab === 'units' && (
              <div className="card-requinte !p-0 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidade Escolar</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">INEP</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Localização</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSchools.map(s => (
                      <tr key={s.id} className="group hover:bg-slate-50/50 transition-all">
                        <td className="px-10 py-8">
                            <button 
                                onClick={() => handleOpenSchoolCenso(s)}
                                className="font-black text-slate-900 uppercase text-sm mb-1 hover:text-emerald-600 hover:underline text-left"
                            >
                                {s.name}
                            </button>
                            <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Clique no nome para abrir o Censo</p>
                        </td>
                        <td className="px-10 py-8">
                            <span className="font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg text-xs">{s.inep}</span>
                        </td>
                        <td className="px-10 py-8 text-center">
                          <span className="px-5 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase border border-blue-100">{s.address}</span>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <button onClick={() => handleOpenSchoolCenso(s)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 shadow-sm transition-all group-hover:bg-emerald-50">
                                <ArrowRight className="h-4.5 w-4.5" />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

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
                               <Briefcase className="h-4 w-4 text-blue-500" />
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
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
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
          </>
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

      <style>{`
        @media print {
          body { background: white !important; }
          .page-transition { animation: none !important; padding: 0 !important; margin: 0 !important; }
          .no-print { display: none !important; }
          header { border: none !important; padding-bottom: 0 !important; margin-bottom: 0 !important; }
          .max-w-[1600px] { max-width: 100% !important; margin: 0 !important; width: 100% !important; }
          .rounded-[2rem], .rounded-[4rem], .rounded-[3rem] { border-radius: 0 !important; }
          .shadow-luxury, .shadow-deep { box-shadow: none !important; }
          .border { border-color: #e2e8f0 !important; }
          .bg-slate-50 { background-color: transparent !important; }
          .bg-slate-100 { background-color: #f1f5f9 !important; -webkit-print-color-adjust: exact; }
          .bg-white { background-color: white !important; }
          .print:border-slate-400 { border-color: #94a3b8 !important; }
        }
      `}</style>
    </div>
  );
};
