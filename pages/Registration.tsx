import React, { useState, useEffect } from 'react';
import { INITIAL_REGISTRATION_STATE } from '../constants';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { RegistrationFormState, RegistryStudent } from '../types';
import { Check, User, Camera, ShieldCheck, ArrowRight, Loader2, MapPin, ChevronLeft, Info, FileText, UserCheck, Search } from 'lucide-react';
import { useNavigate } from '../router';

export const Registration: React.FC = () => {
  const { addStudent } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [formState, setFormState] = useState<RegistrationFormState>(INITIAL_REGISTRATION_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (section: 'student' | 'guardian' | 'address', field: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const nextStep = () => {
    if (formState.step === 1 && !formState.student.fullName) {
      addToast("Nome nominal do aluno é obrigatório.", "warning"); return;
    }
    setFormState(prev => ({ ...prev, step: prev.step + 1 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newStudent: RegistryStudent = {
      id: `std-${Date.now()}`,
      enrollmentId: `MAT-${Math.floor(Math.random() * 900000) + 100000}`,
      name: formState.student.fullName.toUpperCase(),
      birthDate: formState.student.birthDate,
      cpf: formState.student.cpf,
      status: 'Em Análise',
      school: 'Triagem Territorial',
      lat: -12.5253, lng: -40.2917,
      address: {
          ...formState.address,
          zone: formState.address.residenceZone as 'Urbana' | 'Rural'
      },
      specialNeeds: formState.student.needsSpecialEducation,
      transportRequest: formState.student.needsTransport
    };

    setTimeout(async () => {
      await addStudent(newStudent);
      addToast('Registro nominal transmitido com sucesso.', 'success');
      navigate(`/status?success=true&id=${newStudent.enrollmentId}`);
    }, 1800);
  };

  const StepIndicator = ({ step, label, icon: Icon }: any) => (
      <div className={`flex flex-col items-center gap-4 relative z-10 transition-all duration-700 ${formState.step >= step ? 'opacity-100' : 'opacity-30'}`}>
          <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 border-2 ${formState.step > step ? 'bg-emerald-500 border-emerald-500 text-white shadow-xl' : formState.step === step ? 'bg-slate-900 border-slate-900 text-blue-400 shadow-2xl scale-110' : 'bg-white border-slate-100 text-slate-300'}`}>
              {formState.step > step ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
          </div>
          <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${formState.step >= step ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-24 px-8 page-transition">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-20 space-y-8 animate-in fade-in slide-in-from-top-8 duration-1000">
            <div className="inline-flex items-center gap-4 px-6 py-2 bg-blue-50 rounded-full border border-blue-100 shadow-sm mb-4">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <span className="text-blue-700 text-[10px] font-black uppercase tracking-ultra">Plataforma Oficial SME • Matrícula Nominal</span>
            </div>
            <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">Matrícula <br/> <span className="text-blue-600">Síncrona.</span></h1>
            <p className="text-slate-500 font-medium text-2xl tracking-tight max-w-2xl mx-auto">Processamento individualizado via geointeligência municipal.</p>
        </header>

        <div className="bg-white rounded-[4rem] shadow-luxury border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50">
            <div className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]" style={{ width: `${(formState.step / 4) * 100}%` }}></div>
          </div>

          <div className="p-16 md:p-24">
            <div className="flex justify-between mb-20 relative">
                <StepIndicator step={1} label="Estudante" icon={User} />
                <StepIndicator step={2} label="Responsáveis" icon={UserCheck} />
                <StepIndicator step={3} label="Território" icon={MapPin} />
                <StepIndicator step={4} label="Conclusão" icon={FileText} />
                <div className="absolute top-7 left-0 right-0 h-px bg-slate-100 -z-10"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-16">
                {formState.step === 1 && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-right-12 duration-700">
                        <div className="flex flex-col items-center">
                            <div className="w-48 h-48 rounded-[3rem] bg-slate-50 border-[10px] border-white shadow-luxury flex items-center justify-center group relative cursor-pointer active:scale-95 transition-all overflow-hidden">
                                {formState.student.photo ? <img src={formState.student.photo} className="w-full h-full object-cover" /> : <User className="h-16 w-16 text-slate-200" />}
                                <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                                  <Camera className="h-10 w-10 text-blue-600" />
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-6">Foto Nominal do Estudante</p>
                        </div>

                        <div className="grid gap-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Nome Completo do Aluno</label>
                                <input type="text" placeholder="Conforme Certidão de Nascimento" required value={formState.student.fullName} onChange={e => handleInputChange('student', 'fullName', e.target.value)} className="input-premium" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Data de Nascimento</label>
                                    <input type="date" required value={formState.student.birthDate} onChange={e => handleInputChange('student', 'birthDate', e.target.value)} className="input-premium" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">CPF (Identidade Nominal)</label>
                                    <input type="text" placeholder="000.000.000-00" value={formState.student.cpf} onChange={e => handleInputChange('student', 'cpf', e.target.value)} className="input-premium" />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-10 pt-6">
                                <label className="flex items-center gap-6 p-8 bg-slate-50 rounded-[2.2rem] border-2 border-transparent hover:border-blue-100 cursor-pointer transition-all group">
                                    <input type="checkbox" checked={formState.student.needsSpecialEducation} onChange={e => handleInputChange('student', 'needsSpecialEducation', e.target.checked)} className="w-6 h-6 rounded-lg text-blue-600 focus:ring-blue-500 border-slate-300" />
                                    <div>
                                        <p className="font-black text-slate-900 uppercase tracking-tight text-lg">Educação Especial (AEE)</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Requer Laudo Médico Nominal</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-6 p-8 bg-slate-50 rounded-[2.2rem] border-2 border-transparent hover:border-blue-100 cursor-pointer transition-all group">
                                    <input type="checkbox" checked={formState.student.needsTransport} onChange={e => handleInputChange('student', 'needsTransport', e.target.checked)} className="w-6 h-6 rounded-lg text-blue-600 focus:ring-blue-500 border-slate-300" />
                                    <div>
                                        <p className="font-black text-slate-900 uppercase tracking-tight text-lg">Transporte Escolar</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Região Rural / Difícil Acesso</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {formState.step === 2 && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-right-12 duration-700">
                         <div className="grid gap-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Responsável Legal (Nome Completo)</label>
                                <input type="text" placeholder="Nome conforme RG" required value={formState.guardian.fullName} onChange={e => handleInputChange('guardian', 'fullName', e.target.value)} className="input-premium" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">CPF do Responsável</label>
                                    <input type="text" placeholder="000.000.000-00" required value={formState.guardian.cpf} onChange={e => handleInputChange('guardian', 'cpf', e.target.value)} className="input-premium" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Celular / WhatsApp</label>
                                    <input type="tel" placeholder="(75) 9 9999-9999" required value={formState.guardian.phone} onChange={e => handleInputChange('guardian', 'phone', e.target.value)} className="input-premium" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Endereço de E-mail</label>
                                <input type="email" placeholder="email@exemplo.com" required value={formState.guardian.email} onChange={e => handleInputChange('guardian', 'email', e.target.value)} className="input-premium" />
                            </div>
                        </div>
                    </div>
                )}

                {formState.step === 3 && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-right-12 duration-700">
                        <div className="bg-blue-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                          <MapPin className="h-10 w-10 mb-8 opacity-60 group-hover:scale-110 transition-transform duration-700" />
                          <h4 className="text-3xl font-black uppercase tracking-tighter mb-4">Geoprocessamento Nominal</h4>
                          <p className="text-blue-100 text-lg font-medium leading-relaxed opacity-90">O endereço informado é a chave para a alocação automática por geointeligência municipal.</p>
                          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                            <div className="md:col-span-12 space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Logradouro / Rua</label>
                                <input type="text" placeholder="Ex: Av. Rio Branco" required value={formState.address.street} onChange={e => handleInputChange('address', 'street', e.target.value)} className="input-premium" />
                            </div>
                            <div className="md:col-span-4 space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Número</label>
                                <input type="text" placeholder="Ex: 123" required value={formState.address.number} onChange={e => handleInputChange('address', 'number', e.target.value)} className="input-premium" />
                            </div>
                            <div className="md:col-span-8 space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Bairro</label>
                                <input type="text" placeholder="Ex: Primavera" required value={formState.address.neighborhood} onChange={e => handleInputChange('address', 'neighborhood', e.target.value)} className="input-premium" />
                            </div>
                            <div className="md:col-span-6 space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">CEP Local</label>
                                <input type="text" placeholder="46880-000" required value={formState.address.zipCode} onChange={e => handleInputChange('address', 'zipCode', e.target.value)} className="input-premium" />
                            </div>
                            <div className="md:col-span-6 space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Zona de Residência</label>
                                <select value={formState.address.residenceZone} onChange={e => handleInputChange('address', 'residenceZone', e.target.value)} className="input-premium appearance-none">
                                  <option value="Urbana">Zona Urbana</option>
                                  <option value="Rural">Zona Rural</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {formState.step === 4 && (
                    <div className="space-y-12 animate-in zoom-in-95 duration-700">
                        <div className="bg-[#0F172A] p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
                             <div className="relative z-10 space-y-12">
                                <div className="flex justify-between items-center border-b border-white/10 pb-10">
                                    <h3 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-6"><ShieldCheck className="h-10 w-10 text-blue-400" /> Revisão Nominal</h3>
                                    <div className="bg-blue-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Protocolo Seguro</div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-16">
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estudante Nominal</p>
                                        <p className="text-3xl font-black uppercase tracking-tight">{formState.student.fullName}</p>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bairro / Território</p>
                                        <p className="text-3xl font-black uppercase tracking-tight">{formState.address.neighborhood || 'Itaberaba'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 pt-6 opacity-60">
                                    <Info className="h-6 w-6 text-blue-400" />
                                    <p className="text-sm font-medium leading-relaxed">Ao transmitir, você confirma a integridade dos dados para fins de auditoria municipal.</p>
                                </div>
                             </div>
                             <div className="absolute -bottom-32 -right-32 h-80 w-80 bg-blue-600/10 rounded-full blur-[120px]"></div>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center pt-16 border-t border-slate-50">
                    <button type="button" onClick={() => setFormState(p => ({...p, step: p.step-1}))} disabled={formState.step === 1} className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-ultra hover:text-slate-900 transition-all disabled:opacity-0 group">
                      <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" /> Voltar
                    </button>
                    {formState.step < 4 ? (
                        <button type="button" onClick={nextStep} className="btn-primary !h-20 !px-16 shadow-blue-100">
                            Próxima Etapa <ArrowRight className="h-6 w-6" />
                        </button>
                    ) : (
                        <button type="submit" disabled={isSubmitting} className="btn-primary !h-20 !px-16 !bg-blue-600 border-blue-500 shadow-blue-100">
                            {isSubmitting ? <Loader2 className="h-7 w-7 animate-spin" /> : <>Transmitir Matrícula <ArrowRight className="h-6 w-6" /></>}
                        </button>
                    )}
                </div>
            </form>
          </div>
        </div>
        
        <div className="mt-20 flex justify-center gap-12">
            <div className="flex items-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all">
                <FileText className="h-6 w-6" />
                <span className="text-[10px] font-black uppercase tracking-widest">Termos de Uso</span>
            </div>
            <div className="flex items-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all">
                <Search className="h-6 w-6" />
                <span className="text-[10px] font-black uppercase tracking-widest">LGPD Municipal</span>
            </div>
        </div>
      </div>
    </div>
  );
};