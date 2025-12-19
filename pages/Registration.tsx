import React, { useState } from 'react';
import { INITIAL_REGISTRATION_STATE } from '../constants';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { RegistrationFormState, RegistryStudent } from '../types';
import { Check, User, Camera, ShieldCheck, ArrowRight, Loader2, MapPin, ChevronLeft, Info } from 'lucide-react';
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
      addToast("Nome do aluno é obrigatório.", "warning"); return;
    }
    setFormState(prev => ({ ...prev, step: prev.step + 1 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newStudent: RegistryStudent = {
      id: Date.now().toString(),
      name: formState.student.fullName.toUpperCase(),
      birthDate: formState.student.birthDate,
      cpf: formState.student.cpf,
      status: 'Em Análise',
      school: 'Cálculo Territorial',
      lat: -12.5253, lng: -40.2917,
      address: formState.address
    };

    setTimeout(async () => {
      await addStudent(newStudent);
      addToast('Protocolo nominal enviado.', 'success');
      navigate('/status?success=true');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-6 page-transition">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 mb-2">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-blue-700 text-[8px] font-bold uppercase tracking-widest">Protocolo Seguro SME</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none uppercase">Matrícula <span className="text-blue-600">Nominal.</span></h1>
            <p className="text-slate-500 font-medium text-base">Inscrição georreferenciada para o ano letivo 2025.</p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-luxury border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
            <div className="h-full bg-blue-600 transition-all duration-700" style={{ width: `${(formState.step / 4) * 100}%` }}></div>
          </div>

          <div className="p-10 md:p-14">
            <div className="flex justify-between mb-12 relative">
                {[1, 2, 3, 4].map(s => (
                    <div key={s} className="flex flex-col items-center gap-3 relative z-10">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-500 ${formState.step >= s ? 'bg-slate-900 text-blue-400 shadow-lg' : 'bg-slate-50 text-slate-200'}`}>
                            {formState.step > s ? <Check className="h-5 w-5" /> : s}
                        </div>
                        <span className={`text-[8px] font-bold uppercase tracking-widest ${formState.step >= s ? 'text-slate-900' : 'text-slate-300'}`}>
                            {['Dados', 'Pais', 'Local', 'Fim'][s-1]}
                        </span>
                    </div>
                ))}
                <div className="absolute top-5 left-0 right-0 h-px bg-slate-100 -z-10"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                {formState.step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-[1.8rem] bg-slate-50 border-[6px] border-white shadow-md flex items-center justify-center group relative cursor-pointer active:scale-95 transition-all overflow-hidden">
                                {formState.student.photo ? <img src={formState.student.photo} className="w-full h-full object-cover" /> : <User className="h-10 w-10 text-slate-200" />}
                                <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                  <Camera className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome do Aluno</label>
                                <input type="text" placeholder="Nome Completo" required value={formState.student.fullName} onChange={e => handleInputChange('student', 'fullName', e.target.value)} className="input-premium" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nascimento</label>
                                    <input type="date" required value={formState.student.birthDate} onChange={e => handleInputChange('student', 'birthDate', e.target.value)} className="input-premium" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">CPF (Se houver)</label>
                                    <input type="text" placeholder="000.000.000-00" value={formState.student.cpf} onChange={e => handleInputChange('student', 'cpf', e.target.value)} className="input-premium" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Simplified step transitions for brevety */}
                {formState.step === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500">
                         <div className="grid gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Responsável</label>
                                <input type="text" placeholder="Nome Completo" required value={formState.guardian.fullName} onChange={e => handleInputChange('guardian', 'fullName', e.target.value)} className="input-premium" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contato</label>
                                    <input type="tel" placeholder="(75) 9 9999-9999" required value={formState.guardian.phone} onChange={e => handleInputChange('guardian', 'phone', e.target.value)} className="input-premium" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Vínculo</label>
                                    <select value={formState.guardian.relationship} onChange={e => handleInputChange('guardian', 'relationship', e.target.value)} className="input-premium appearance-none">
                                      <option value="Mãe">Mãe</option>
                                      <option value="Pai">Pai</option>
                                      <option value="Tutor">Tutor Legal</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {formState.step === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500">
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center gap-4">
                          <MapPin className="h-6 w-6 text-blue-600" />
                          <p className="text-xs text-blue-700 font-medium">O logradouro nominal define a alocação automática por geoprocessamento.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="md:col-span-3 space-y-1.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Logradouro</label>
                                <input type="text" placeholder="Rua / Avenida" required value={formState.address.street} onChange={e => handleInputChange('address', 'street', e.target.value)} className="input-premium" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nº</label>
                                <input type="text" required value={formState.address.number} onChange={e => handleInputChange('address', 'number', e.target.value)} className="input-premium" />
                            </div>
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Bairro</label>
                                <input type="text" required value={formState.address.neighborhood} onChange={e => handleInputChange('address', 'neighborhood', e.target.value)} className="input-premium" />
                            </div>
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">CEP</label>
                                <input type="text" required value={formState.address.zipCode} onChange={e => handleInputChange('address', 'zipCode', e.target.value)} className="input-premium" />
                            </div>
                        </div>
                    </div>
                )}

                {formState.step === 4 && (
                    <div className="space-y-8 animate-in zoom-in-95 duration-500">
                        <div className="bg-slate-900 p-10 rounded-[2.2rem] text-white shadow-xl relative overflow-hidden group">
                             <div className="relative z-10 space-y-6">
                                <h3 className="text-2xl font-extrabold uppercase tracking-tight flex items-center gap-3"><ShieldCheck className="h-6 w-6 text-blue-400" /> Revisão Nominal</h3>
                                <div className="grid md:grid-cols-2 gap-8 border-t border-white/10 pt-8">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Aluno</p>
                                        <p className="text-lg font-bold uppercase">{formState.student.fullName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Região</p>
                                        <p className="text-lg font-bold uppercase">{formState.address.neighborhood || 'Itaberaba'}</p>
                                    </div>
                                </div>
                             </div>
                             <div className="absolute -bottom-16 -right-16 h-40 w-40 bg-blue-600/10 rounded-full blur-[50px]"></div>
                        </div>
                        <div className="flex items-start gap-4 px-2">
                             <Info className="h-5 w-5 text-amber-500 shrink-0" />
                             <p className="text-slate-500 text-[10px] font-medium leading-relaxed">Confirmo que os dados nominais são verídicos e serão auditados pela Secretaria de Educação.</p>
                        </div>
                    </div>
                )}

                <div className="flex justify-between pt-10 border-t border-slate-50">
                    <button type="button" onClick={() => setFormState(p => ({...p, step: p.step-1}))} disabled={formState.step === 1} className="flex items-center gap-2 px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all disabled:opacity-0">
                      <ChevronLeft className="h-4 w-4" /> Voltar
                    </button>
                    {formState.step < 4 ? (
                        <button type="button" onClick={nextStep} className="btn-primary">Continuar <ArrowRight className="h-4 w-4" /></button>
                    ) : (
                        <button type="submit" disabled={isSubmitting} className="btn-primary">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Transmitir Registro"}
                        </button>
                    )}
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};