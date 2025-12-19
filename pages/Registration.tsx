import React, { useState } from 'react';
import { INITIAL_REGISTRATION_STATE } from '../constants';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { RegistrationFormState, RegistryStudent } from '../types';
import { Check, User, Camera, ShieldCheck, ArrowRight, Loader2, MapPin, ChevronLeft, Info, FileText, UserCheck } from 'lucide-react';
import { useNavigate } from '../router';

export const Registration: React.FC = () => {
  const { addStudent } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [formState, setFormState] = useState<RegistrationFormState>(INITIAL_REGISTRATION_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (section: 'student' | 'guardian' | 'address', field: string, value: any) => {
    setFormState(prev => ({
      ...prev, section: { ...prev[section], [field]: value }
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
      school: 'Triagem Territorial',
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
      navigate(`/status?success=true&id=${newStudent.enrollmentId}`);
    }, 1500);
  };

  const StepCircle = ({ step, icon: Icon }: any) => (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formState.step >= step ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
        {formState.step > step ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-8 page-transition">
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="text-center space-y-4">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Nova Matrícula.</h1>
            <p className="text-slate-500 font-medium">Siga os passos para o registro nominal 2025.</p>
        </header>

        <div className="card-requinte !p-0 overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-white flex justify-center gap-10">
              <StepCircle step={1} icon={User} />
              <StepCircle step={2} icon={UserCheck} />
              <StepCircle step={3} icon={MapPin} />
              <StepCircle step={4} icon={FileText} />
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
              {formState.step === 1 && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                      <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nome do Aluno</label>
                              <input type="text" required value={formState.student.fullName} onChange={e => setFormState({...formState, student: {...formState.student, fullName: e.target.value}})} className="input-premium" />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">CPF</label>
                              <input type="text" value={formState.student.cpf} onChange={e => setFormState({...formState, student: {...formState.student, cpf: e.target.value}})} className="input-premium" />
                          </div>
                      </div>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 rounded-lg" checked={formState.student.needsSpecialEducation} onChange={e => setFormState({...formState, student: {...formState.student, needsSpecialEducation: e.target.checked}})} />
                            <span className="text-xs font-bold text-slate-600">Educação Especial (AEE)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 rounded-lg" checked={formState.student.needsTransport} onChange={e => setFormState({...formState, student: {...formState.student, needsTransport: e.target.checked}})} />
                            <span className="text-xs font-bold text-slate-600">Transporte Escolar</span>
                        </label>
                      </div>
                  </div>
              )}

              {formState.step >= 2 && formState.step <= 4 && (
                  <div className="py-20 text-center space-y-4 animate-in fade-in duration-500">
                      <ShieldCheck className="h-12 w-12 text-blue-100 mx-auto" />
                      <p className="text-slate-400 text-sm italic">Campos de validação em processamento...</p>
                      {formState.step === 4 && (
                         <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-left">
                            <h4 className="text-xs font-bold text-blue-700 uppercase mb-2">Revisão Final</h4>
                            <p className="text-[10px] text-blue-600 font-medium">Ao transmitir, você declara que os dados fornecidos são verdadeiros para a SME Itaberaba.</p>
                         </div>
                      )}
                  </div>
              )}

              <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                  <button type="button" onClick={() => setFormState(p => ({...p, step: p.step-1}))} disabled={formState.step === 1} className="text-xs font-bold text-slate-400 hover:text-slate-900 disabled:opacity-0 flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" /> Voltar
                  </button>
                  {formState.step < 4 ? (
                      <button type="button" onClick={nextStep} className="btn-primary !h-12 !px-10">Próximo Passo</button>
                  ) : (
                      <button type="submit" disabled={isSubmitting} className="btn-primary !h-12 !px-10 !bg-blue-600">
                          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Transmitir Matrícula"}
                      </button>
                  )}
              </div>
          </form>
        </div>
      </div>
    </div>
  );
};