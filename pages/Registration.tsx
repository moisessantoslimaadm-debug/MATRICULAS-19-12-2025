
import React, { useState } from 'react';
import { INITIAL_REGISTRATION_STATE, MUNICIPALITY_NAME } from '../constants';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { RegistrationFormState, RegistryStudent } from '../types';
import { Check, User, ShieldCheck, ChevronRight, Loader2, MapPin, ChevronLeft, FileText, UserCheck, Smartphone, Zap, HeartPulse, Bus } from 'lucide-react';
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
      school: 'Geoprocessamento SME em Progresso',
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
    }, 2500);
  };

  const StepCircle = ({ step, icon: Icon, label }: any) => (
    <div className="flex flex-col items-center gap-6 group">
        <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-700 relative ${formState.step >= step ? 'bg-[#064e3b] text-white shadow-deep scale-110' : 'bg-slate-100 text-slate-300'}`}>
            {formState.step > step ? <Check className="h-10 w-10" /> : <Icon className="h-8 w-8" />}
            {formState.step === step && <div className="absolute inset-0 rounded-[2rem] border-4 border-emerald-400 animate-ping opacity-20"></div>}
        </div>
        <div className="text-center space-y-1">
            <span className={`text-[10px] font-black uppercase tracking-[0.4em] block ${formState.step >= step ? 'text-emerald-700' : 'text-slate-300'}`}>0{step}</span>
            <span className={`text-[9px] font-bold uppercase tracking-widest hidden md:block ${formState.step >= step ? 'text-slate-900' : 'text-slate-300'}`}>{label}</span>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-24 px-8 page-transition">
      <div className="max-w-5xl mx-auto space-y-20">
        <header className="text-center space-y-8">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-emerald-50 rounded-3xl border border-emerald-100 mb-6 shadow-sm">
              <Zap className="h-5 w-5 text-emerald-600 animate-pulse" />
              <span className="text-emerald-800 text-[11px] font-black uppercase tracking-[0.4em]">Barramento Nominal Síncrono</span>
            </div>
            <h1 className="text-8xl font-black text-slate-900 tracking-tighter uppercase leading-[0.8] text-display">Matrícula <br/><span className="text-emerald-600">Digital.</span></h1>
            <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-[11px]">Governo de Itaberaba • Ciclo Educativo 2025</p>
        </header>

        <div className="card-requinte !p-0 border-none shadow-deep">
          <div className="p-16 border-b border-slate-50 bg-slate-50/30 flex justify-center gap-12 md:gap-24 relative overflow-hidden">
              <StepCircle step={1} icon={User} label="Identificação" />
              <StepCircle step={2} icon={UserCheck} label="Responsável" />
              <StepCircle step={3} icon={MapPin} label="Localização" />
              <StepCircle step={4} icon={FileText} label="Consolidação" />
              <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-1000" style={{ width: `${(formState.step / 4) * 100}%` }}></div>
          </div>

          <form onSubmit={handleSubmit} className="p-16 md:p-24 space-y-16 bg-white">
              {formState.step === 1 && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                      <div className="grid md:grid-cols-2 gap-12">
                          <div className="space-y-5">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-3">Nome Nominal Completo</label>
                              <input type="text" required value={formState.student.fullName} onChange={e => handleInputChange('student', 'fullName', e.target.value)} className="input-premium" placeholder="EX: ARTHUR SILVA SANTOS" />
                          </div>
                          <div className="space-y-5">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-3">Data de Nascimento</label>
                              <input type="date" required value={formState.student.birthDate} onChange={e => handleInputChange('student', 'birthDate', e.target.value)} className="input-premium" />
                          </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-12">
                          <div className="space-y-5">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-3">CPF do Estudante</label>
                              <input type="text" required value={formState.student.cpf} onChange={e => handleInputChange('student', 'cpf', e.target.value)} className="input-premium" placeholder="000.000.000-00" />
                          </div>
                          <div className="flex flex-col justify-end gap-6 pb-2">
                              <label className="flex items-center gap-6 p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 cursor-pointer group hover:bg-white hover:shadow-luxury transition-all">
                                  <div className="relative">
                                    <input type="checkbox" className="w-8 h-8 rounded-xl text-emerald-600 focus:ring-12 focus:ring-emerald-50 border-emerald-200" checked={formState.student.needsSpecialEducation} onChange={e => handleInputChange('student', 'needsSpecialEducation', e.target.checked)} />
                                  </div>
                                  <div className="flex items-center gap-4">
                                      <HeartPulse className="h-6 w-6 text-emerald-600" />
                                      <span className="text-[11px] font-black text-emerald-800 uppercase tracking-widest">Requer Atendimento Especial (AEE)</span>
                                  </div>
                              </label>
                          </div>
                      </div>
                  </div>
              )}

              {formState.step === 2 && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                      <div className="grid md:grid-cols-2 gap-12">
                          <div className="space-y-5">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-3">Nome do Responsável Legal</label>
                              <input type="text" required value={formState.guardian.fullName} onChange={e => handleInputChange('guardian', 'fullName', e.target.value)} className="input-premium" />
                          </div>
                          <div className="space-y-5">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-3">Telefone de Contato Síncrono</label>
                              <div className="relative group">
                                  <Smartphone className="absolute left-8 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                                  <input type="tel" required value={formState.guardian.phone} onChange={e => handleInputChange('guardian', 'phone', e.target.value)} className="input-premium pl-20" placeholder="(75) 90000-0000" />
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {formState.step === 3 && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                      <div className="bg-[#064e3b] p-12 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-10 text-white shadow-deep relative overflow-hidden">
                          <div className="bg-emerald-500 p-6 rounded-[2.2rem] shadow-2xl relative z-10 rotate-6 group-hover:rotate-0 transition-transform">
                            <MapPin className="h-10 w-10 text-white" />
                          </div>
                          <div className="relative z-10 text-center md:text-left">
                              <p className="text-xs font-black uppercase tracking-[0.4em] text-emerald-400 mb-3">Geo-Alocação SME</p>
                              <p className="text-lg font-medium opacity-80 leading-relaxed">A alocação será processada automaticamente por menor distância nominal absoluta entre a residência e a unidade escolar.</p>
                          </div>
                          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[100px] -mr-24 -mt-24"></div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-12">
                          <div className="space-y-5">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-3">Logradouro / Rua</label>
                              <input type="text" required value={formState.address.street} onChange={e => handleInputChange('address', 'street', e.target.value)} className="input-premium" />
                          </div>
                          <div className="space-y-5">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-3">Bairro de Residência</label>
                              <input type="text" required value={formState.address.neighborhood} onChange={e => handleInputChange('address', 'neighborhood', e.target.value)} className="input-premium" />
                          </div>
                      </div>
                      <label className="flex items-center gap-8 p-10 bg-blue-50/50 rounded-[3.5rem] border border-blue-100 cursor-pointer group hover:bg-white hover:shadow-luxury transition-all w-full relative">
                          <input type="checkbox" className="w-10 h-10 rounded-[1.2rem] text-blue-600 focus:ring-12 focus:ring-blue-50 border-blue-200" checked={formState.student.needsTransport} onChange={e => handleInputChange('student', 'needsTransport', e.target.checked)} />
                          <div className="flex items-center gap-6">
                              <div className="p-4 bg-blue-100 rounded-2xl text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                                <Bus className="h-8 w-8" />
                              </div>
                              <div>
                                <span className="text-xl font-black text-blue-900 uppercase tracking-tighter block">Solicitar Transporte Municipal</span>
                                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mt-2 block">Prioridade absoluta para fluxos rurais e periféricos</span>
                              </div>
                          </div>
                      </label>
                  </div>
              )}

              {formState.step === 4 && (
                  <div className="py-16 text-center space-y-12 animate-in fade-in zoom-in-95 duration-1000">
                      <div className="w-40 h-40 bg-emerald-50 rounded-[4rem] flex items-center justify-center mx-auto shadow-deep border-4 border-white ring-1 ring-emerald-100 animate-luxury-float">
                        <ShieldCheck className="h-20 w-20 text-emerald-600" />
                      </div>
                      <div className="space-y-6">
                        <h2 className="text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">Dossiê Pronto.</h2>
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.6em] max-w-lg mx-auto leading-relaxed">Sua solicitação nominal será transmitida e auditada pelo barramento municipal SME Itaberaba.</p>
                      </div>
                      <div className="bg-slate-50/50 p-16 rounded-[4rem] border border-slate-100 text-left space-y-8 shadow-inner">
                          <div className="flex justify-between items-center border-b border-slate-200 pb-8">
                              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Estudante Nominal</span>
                              <span className="text-xl font-black text-slate-900 uppercase tracking-tighter">{formState.student.fullName}</span>
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Zona Territorial</span>
                              <span className="text-xl font-black text-slate-900 uppercase tracking-tighter">{formState.address.neighborhood} • Itaberaba</span>
                          </div>
                      </div>
                  </div>
              )}

              <div className="flex justify-between items-center pt-20 border-t border-slate-100">
                  <button type="button" onClick={() => setFormState(p => ({...p, step: p.step - 1}))} disabled={formState.step === 1} className="text-[12px] font-black text-slate-400 hover:text-emerald-700 disabled:opacity-0 flex items-center gap-6 transition-all uppercase tracking-[0.3em] group">
                    <div className="bg-slate-50 p-4 rounded-2xl group-hover:-translate-x-2 transition-transform">
                        <ChevronLeft className="h-6 w-6" />
                    </div> Voltar
                  </button>
                  {formState.step < 4 ? (
                      <button type="button" onClick={nextStep} className="btn-primary !h-24 !px-16 !text-[13px] !rounded-[2.5rem]">Próximo Passo <ChevronRight className="h-6 w-6" /></button>
                  ) : (
                      <button type="submit" disabled={isSubmitting} className="btn-primary !h-24 !px-16 !text-[13px] !bg-emerald-600 !rounded-[2.5rem] shadow-emerald-900/20 active:scale-95 group">
                          {isSubmitting ? <Loader2 className="h-8 w-8 animate-spin" /> : <>Transmitir Matrícula <Zap className="h-6 w-6 group-hover:scale-125 transition-transform" /></>}
                      </button>
                  )}
              </div>
          </form>
        </div>
      </div>
    </div>
  );
};
