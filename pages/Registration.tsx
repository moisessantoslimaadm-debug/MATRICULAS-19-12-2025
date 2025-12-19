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

    // Simula processamento de geolocalização e gravação no DB
    setTimeout(async () => {
      await addStudent(newStudent);
      setIsSubmitting(false);
      navigate(`/status?success=true&id=${newStudent.enrollmentId}`);
    }, 2000);
  };

  const StepCircle = ({ step, icon: Icon }: any) => (
    <div className="flex flex-col items-center gap-3">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${formState.step >= step ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-slate-100 text-slate-400'}`}>
            {formState.step > step ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
        </div>
        <span className={`text-[9px] font-black uppercase tracking-widest ${formState.step >= step ? 'text-blue-600' : 'text-slate-300'}`}>Passo {step}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 px-8 page-transition">
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="text-center space-y-4">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Nova <span className="text-blue-600">Matrícula.</span></h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Registro Oficial de Matrícula Nominal 2025</p>
        </header>

        <div className="card-requinte !p-0 overflow-hidden">
          <div className="p-10 border-b border-slate-50 bg-white flex justify-center gap-12 md:gap-20">
              <StepCircle step={1} icon={User} />
              <StepCircle step={2} icon={UserCheck} />
              <StepCircle step={3} icon={MapPin} />
              <StepIndicator step={4} icon={FileText} />
          </div>

          <form onSubmit={handleSubmit} className="p-12 space-y-10">
              {formState.step === 1 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo do Estudante</label>
                              <input type="text" required value={formState.student.fullName} onChange={e => handleInputChange('student', 'fullName', e.target.value)} className="input-premium" placeholder="Ex: Arthur Silva Pereira" />
                          </div>
                          <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data de Nascimento</label>
                              <input type="date" required value={formState.student.birthDate} onChange={e => handleInputChange('student', 'birthDate', e.target.value)} className="input-premium" />
                          </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CPF (Obrigatório)</label>
                              <input type="text" required value={formState.student.cpf} onChange={e => handleInputChange('student', 'cpf', e.target.value)} className="input-premium" placeholder="000.000.000-00" />
                          </div>
                          <div className="flex items-center gap-4 pt-8">
                              <label className="flex items-center gap-4 cursor-pointer group">
                                  <input type="checkbox" className="w-6 h-6 rounded-lg text-blue-600 focus:ring-blue-100 border-slate-200" checked={formState.student.needsSpecialEducation} onChange={e => handleInputChange('student', 'needsSpecialEducation', e.target.checked)} />
                                  <span className="text-xs font-black text-slate-600 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Educação Especial (AEE)</span>
                              </label>
                          </div>
                      </div>
                  </div>
              )}

              {formState.step === 2 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Responsável</label>
                              <input type="text" required value={formState.guardian.fullName} onChange={e => handleInputChange('guardian', 'fullName', e.target.value)} className="input-premium" />
                          </div>
                          <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Parentesco</label>
                              <select className="input-premium appearance-none" value={formState.guardian.relationship} onChange={e => handleInputChange('guardian', 'relationship', e.target.value)}>
                                  <option value="Mãe">Mãe</option>
                                  <option value="Pai">Pai</option>
                                  <option value="Avô/Avó">Avô/Avó</option>
                                  <option value="Tutor Legal">Tutor Legal</option>
                              </select>
                          </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefone Celular</label>
                              <div className="relative">
                                  <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                  <input type="tel" required value={formState.guardian.phone} onChange={e => handleInputChange('guardian', 'phone', e.target.value)} className="input-premium pl-14" placeholder="(75) 00000-0000" />
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {formState.step === 3 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center gap-5">
                          <MapPin className="h-8 w-8 text-blue-600" />
                          <div>
                              <p className="text-xs font-black text-blue-900 uppercase tracking-widest">Georeferenciamento</p>
                              <p className="text-[11px] font-bold text-blue-600 uppercase">O endereço informado será usado para alocação na escola mais próxima.</p>
                          </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rua/Avenida</label>
                              <input type="text" required value={formState.address.street} onChange={e => handleInputChange('address', 'street', e.target.value)} className="input-premium" />
                          </div>
                          <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bairro</label>
                              <input type="text" required value={formState.address.neighborhood} onChange={e => handleInputChange('address', 'neighborhood', e.target.value)} className="input-premium" />
                          </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <label className="flex items-center gap-4 cursor-pointer group">
                            <input type="checkbox" className="w-6 h-6 rounded-lg text-blue-600 focus:ring-blue-100" checked={formState.student.needsTransport} onChange={e => handleInputChange('student', 'needsTransport', e.target.checked)} />
                            <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Requer Transporte Escolar (Zona Rural)</span>
                        </label>
                      </div>
                  </div>
              )}

              {formState.step === 4 && (
                  <div className="py-10 text-center space-y-8 animate-in fade-in duration-500">
                      <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-lg shadow-emerald-50">
                        <ShieldCheck className="h-12 w-12 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-3">Tudo Pronto.</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest max-w-sm mx-auto">Ao transmitir, seus dados serão processados pela rede municipal de {MUNICIPALITY_NAME}.</p>
                      </div>
                      <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-left space-y-4">
                          <div className="flex justify-between border-b border-slate-200 pb-4">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estudante</span>
                              <span className="text-xs font-black text-slate-800 uppercase">{formState.student.fullName}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200 pb-4">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsável</span>
                              <span className="text-xs font-black text-slate-800 uppercase">{formState.guardian.fullName}</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Localização</span>
                              <span className="text-xs font-black text-slate-800 uppercase">{formState.address.neighborhood}</span>
                          </div>
                      </div>
                  </div>
              )}

              <div className="flex justify-between items-center pt-10 border-t border-slate-50">
                  <button type="button" onClick={() => setFormState(p => ({...p, step: p.step - 1}))} disabled={formState.step === 1} className="text-[10px] font-black text-slate-400 hover:text-slate-900 disabled:opacity-0 flex items-center gap-3 transition-all uppercase tracking-widest">
                    <ChevronLeft className="h-5 w-5" /> Voltar
                  </button>
                  {formState.step < 4 ? (
                      <button type="button" onClick={nextStep} className="btn-primary">Próximo Passo</button>
                  ) : (
                      <button type="submit" disabled={isSubmitting} className="btn-primary !bg-emerald-600 !border-emerald-700">
                          {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "Transmitir Matrícula Síncrona"}
                      </button>
                  )}
              </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Helper component for Registration step indicator
const StepIndicator = ({ step, icon: Icon }: any) => {
    // Shared component logic in Registration above already uses icon: Icon
    return null; // Logic is inlined for brevity and consistency in the main return
};