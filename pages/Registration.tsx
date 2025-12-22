import React, { useState } from 'react';
import { INITIAL_REGISTRATION_STATE, MUNICIPALITY_NAME } from '../constants';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { RegistrationFormState, RegistryStudent } from '../types';
import { Check, User, ShieldCheck, ChevronRight, Loader2, MapPin, ChevronLeft, FileText, UserCheck, Smartphone } from 'lucide-react';
import { useNavigate } from '../router';

export const Registration: React.FC = () => {
  const { addStudent } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [formState, setFormState] = useState<RegistrationFormState>(INITIAL_REGISTRATION_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (section: 'student' | 'guardian' | 'address', field: string, value: any) => {
    setFormState(prev => ({
      ...prev, [section]: { ...prev[section], [field]: value }
    }));
  };

  const nextStep = () => {
    setFormState(prev => ({ ...prev, step: prev.step + 1 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newStudent: RegistryStudent = {
      id: `std-${Date.now()}`,
      enrollmentId: `MAT-${Math.floor(Math.random() * 900000) + 100000}`,
      name: (formState.student.fullName || 'NOVO ALUNO').toUpperCase(),
      birthDate: formState.student.birthDate,
      cpf: formState.student.cpf,
      status: 'Em Análise',
      school: 'Aguardando Alocação SME',
      lat: -12.5253, lng: -40.2917,
      address: {
          ...formState.address,
          zone: (formState.address.residenceZone || 'Urbana') as 'Urbana' | 'Rural'
      },
      specialNeeds: formState.student.needsSpecialEducation,
      transportRequest: formState.student.needsTransport
    };

    setTimeout(async () => {
      await addStudent(newStudent);
      setIsSubmitting(false);
      navigate(`/status?success=true&id=${newStudent.enrollmentId}`);
    }, 2000);
  };

  const StepCircle = ({ step, icon: Icon }: any) => (
    <div className="flex flex-col items-center gap-4">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-700 ${formState.step >= step ? 'bg-[#064e3b] text-white shadow-2xl' : 'bg-slate-100 text-slate-300'}`}>
            {formState.step > step ? <Check className="h-8 w-8" /> : <Icon className="h-7 w-7" />}
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${formState.step >= step ? 'text-emerald-700' : 'text-slate-300'}`}>Etapa 0{step}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-24 px-8 page-transition">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center space-y-6">
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">Matrícula <span className="text-emerald-600">Síncrona.</span></h1>
            <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs">Registro Nominal Municipal • Itaberaba 2025</p>
        </header>

        <div className="card-requinte !p-0 overflow-hidden border-2 border-emerald-50">
          <div className="p-12 border-b border-emerald-50 bg-slate-50/50 flex justify-center gap-16 md:gap-24">
              <StepCircle step={1} icon={User} />
              <StepCircle step={2} icon={UserCheck} />
              <StepCircle step={3} icon={MapPin} />
              <StepCircle step={4} icon={FileText} />
          </div>

          <form onSubmit={handleSubmit} className="p-16 space-y-12 bg-white">
              {formState.step === 1 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome Completo do Estudante</label>
                              <input type="text" required value={formState.student.fullName} onChange={e => handleInputChange('student', 'fullName', e.target.value)} className="input-premium" placeholder="Ex: Arthur Silva Pereira" />
                          </div>
                          <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Data de Nascimento</label>
                              <input type="date" required value={formState.student.birthDate} onChange={e => handleInputChange('student', 'birthDate', e.target.value)} className="input-premium" />
                          </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">CPF (Obrigatório)</label>
                              <input type="text" required value={formState.student.cpf} onChange={e => handleInputChange('student', 'cpf', e.target.value)} className="input-premium" placeholder="000.000.000-00" />
                          </div>
                          <div className="flex flex-col justify-center gap-4 pt-4">
                              <label className="flex items-center gap-5 p-5 bg-emerald-50 rounded-2xl border border-emerald-100 cursor-pointer group">
                                  <input type="checkbox" className="w-6 h-6 rounded-lg text-emerald-600 focus:ring-emerald-100 border-emerald-200" checked={formState.student.needsSpecialEducation} onChange={e => handleInputChange('student', 'needsSpecialEducation', e.target.checked)} />
                                  <span className="text-xs font-black text-emerald-800 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">Educação Especial (AEE)</span>
                              </label>
                          </div>
                      </div>
                  </div>
              )}

              {formState.step === 2 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome do Responsável Legal</label>
                              <input type="text" required value={formState.guardian.fullName} onChange={e => handleInputChange('guardian', 'fullName', e.target.value)} className="input-premium" />
                          </div>
                          <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Vínculo Parentesco</label>
                              <select className="input-premium appearance-none" value={formState.guardian.relationship} onChange={e => handleInputChange('guardian', 'relationship', e.target.value)}>
                                  <option value="Mãe">Mãe</option>
                                  <option value="Pai">Pai</option>
                                  <option value="Tutor Legal">Tutor Legal</option>
                              </select>
                          </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Contato Telefônico</label>
                              <div className="relative">
                                  <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
                                  <input type="tel" required value={formState.guardian.phone} onChange={e => handleInputChange('guardian', 'phone', e.target.value)} className="input-premium pl-16" placeholder="(75) 00000-0000" />
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {formState.step === 3 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <div className="bg-[#064e3b] p-8 rounded-[2.5rem] flex items-center gap-6 text-white shadow-2xl">
                          <div className="bg-emerald-500 p-4 rounded-2xl shadow-lg">
                            <MapPin className="h-8 w-8 text-white" />
                          </div>
                          <div>
                              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 mb-1">Geolocalização Ativa</p>
                              <p className="text-base font-medium opacity-80">O logradouro nominal define a alocação por menor distância.</p>
                          </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Rua / Logradouro</label>
                              <input type="text" required value={formState.address.street} onChange={e => handleInputChange('address', 'street', e.target.value)} className="input-premium" />
                          </div>
                          <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Bairro Territorial</label>
                              <input type="text" required value={formState.address.neighborhood} onChange={e => handleInputChange('address', 'neighborhood', e.target.value)} className="input-premium" />
                          </div>
                      </div>
                      <div className="flex items-center gap-10">
                        <label className="flex items-center gap-5 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 cursor-pointer group hover:bg-white transition-all w-full">
                            <input type="checkbox" className="w-8 h-8 rounded-xl text-emerald-600 focus:ring-emerald-100 border-slate-200" checked={formState.student.needsTransport} onChange={e => handleInputChange('student', 'needsTransport', e.target.checked)} />
                            <div>
                                <span className="text-sm font-black text-slate-800 uppercase tracking-widest block">Requer Transporte Escolar</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase mt-1 block">Válido para estudantes de zonas rurais</span>
                            </div>
                        </label>
                      </div>
                  </div>
              )}

              {formState.step === 4 && (
                  <div className="py-12 text-center space-y-10 animate-in fade-in zoom-in-95 duration-700">
                      <div className="w-32 h-32 bg-emerald-50 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl border border-emerald-100">
                        <ShieldCheck className="h-16 w-16 text-emerald-600" />
                      </div>
                      <div>
                        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-4">Dados Consolidados.</h2>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] max-w-sm mx-auto">Sua solicitação será processada nominalmente no banco municipal.</p>
                      </div>
                      <div className="bg-emerald-50/30 p-10 rounded-[3rem] border border-emerald-100 text-left space-y-6">
                          <div className="flex justify-between items-center border-b border-emerald-100 pb-5">
                              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Estudante Nominal</span>
                              <span className="text-sm font-black text-slate-900 uppercase">{formState.student.fullName}</span>
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Território</span>
                              <span className="text-sm font-black text-slate-900 uppercase">{formState.address.neighborhood}</span>
                          </div>
                      </div>
                  </div>
              )}

              <div className="flex justify-between items-center pt-12 border-t border-emerald-50">
                  <button type="button" onClick={() => setFormState(p => ({...p, step: p.step - 1}))} disabled={formState.step === 1} className="text-[11px] font-black text-slate-400 hover:text-emerald-700 disabled:opacity-0 flex items-center gap-3 transition-all uppercase tracking-widest group">
                    <ChevronLeft className="h-6 w-6 group-hover:-translate-x-2 transition-transform" /> Voltar
                  </button>
                  {formState.step < 4 ? (
                      <button type="button" onClick={nextStep} className="btn-primary !h-16 !px-12 !text-[12px]">Próximo Passo</button>
                  ) : (
                      <button type="submit" disabled={isSubmitting} className="btn-primary !h-16 !px-12 !text-[12px] !bg-emerald-600">
                          {isSubmitting ? <Loader2 className="h-7 w-7 animate-spin" /> : "Transmitir Matrícula"}
                      </button>
                  )}
              </div>
          </form>
        </div>
      </div>
    </div>
  );
};