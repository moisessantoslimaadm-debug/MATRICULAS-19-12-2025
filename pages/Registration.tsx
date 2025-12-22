
import React, { useState } from 'react';
import { INITIAL_REGISTRATION_STATE, MUNICIPALITY_NAME } from '../constants';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { RegistrationFormState, RegistryStudent } from '../types';
import { 
  Check, User, ShieldCheck, ChevronRight, Loader2, 
  MapPin, ChevronLeft, FileText, UserCheck, Smartphone, 
  Zap, HeartPulse, Bus, LocateFixed, Info, AlertCircle 
} from 'lucide-react';
import { useNavigate } from '../router';

export const Registration: React.FC = () => {
  const { addStudent, getNearestSchool } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [formState, setFormState] = useState<RegistrationFormState>(INITIAL_REGISTRATION_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);

  const handleInputChange = (section: 'student' | 'guardian' | 'address', field: string, value: any) => {
    setFormState(prev => ({
      ...prev, [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      addToast("Navegador sem suporte a GPS.", "error");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setIsLocating(false);
        addToast("Coordenadas nominais capturadas.", "success");
      },
      () => {
        setIsLocating(false);
        addToast("Acesso à localização negado.", "warning");
      }
    );
  };

  const nextStep = () => {
    setFormState(prev => ({ ...prev, step: prev.step + 1 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Geo-Alocação Síncrona
    const lat = coords?.lat || -12.5253;
    const lng = coords?.lng || -40.2917;
    const allocation = getNearestSchool(lat, lng);
    
    const newStudent: RegistryStudent = {
      id: `std-${Date.now()}`,
      enrollmentId: `MAT-${Math.floor(Math.random() * 900000) + 100000}`,
      name: (formState.student.fullName || 'NOVO ALUNO').toUpperCase(),
      birthDate: formState.student.birthDate,
      cpf: formState.student.cpf,
      status: 'Em Análise',
      school: allocation?.school.name || 'SME Central',
      schoolId: allocation?.school.id,
      geoDistance: allocation?.distance,
      lat, lng,
      address: {
          ...formState.address,
          zone: formState.address.residenceZone || 'Urbana'
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

  const StepCircle = ({ step, icon: Icon, label }: any) => (
    <div className="flex flex-col items-center gap-6 group">
        <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center transition-all duration-700 relative ${formState.step >= step ? 'bg-[#064e3b] text-white shadow-deep scale-110' : 'bg-slate-100 text-slate-300'}`}>
            {formState.step > step ? <Check className="h-8 w-8" /> : <Icon className="h-7 w-7" />}
            {formState.step === step && <div className="absolute inset-0 rounded-[1.8rem] border-4 border-emerald-400 animate-ping opacity-20"></div>}
        </div>
        <div className="text-center space-y-1">
            <span className={`text-[9px] font-black uppercase tracking-[0.4em] block ${formState.step >= step ? 'text-emerald-700' : 'text-slate-300'}`}>0{step}</span>
            <span className={`text-[8px] font-bold uppercase tracking-widest hidden md:block ${formState.step >= step ? 'text-slate-900' : 'text-slate-300'}`}>{label}</span>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-24 px-8 page-transition">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-50 rounded-full border border-emerald-100 mb-4 shadow-sm">
              <Zap className="h-4 w-4 text-emerald-600 animate-pulse" />
              <span className="text-emerald-800 text-[10px] font-black uppercase tracking-ultra">Alocação Síncrona Ativa</span>
            </div>
            <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.8] text-display">Inscrição <br/><span className="text-emerald-600">Digital.</span></h1>
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Censo Escolar {new Date().getFullYear()} • Itaberaba</p>
        </header>

        <div className="card-requinte !p-0 border-none shadow-deep">
          <div className="p-12 border-b border-slate-50 bg-slate-50/50 flex justify-center gap-8 md:gap-16 relative overflow-hidden">
              <StepCircle step={1} icon={User} label="Estudante" />
              <StepCircle step={2} icon={UserCheck} label="Responsável" />
              <StepCircle step={3} icon={MapPin} label="Localização" />
              <StepCircle step={4} icon={FileText} label="Resumo" />
              <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-1000" style={{ width: `${(formState.step / 4) * 100}%` }}></div>
          </div>

          <form onSubmit={handleSubmit} className="p-12 md:p-20 space-y-12 bg-white">
              {formState.step === 1 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome Completo</label>
                              <input type="text" required value={formState.student.fullName} onChange={e => handleInputChange('student', 'fullName', e.target.value.toUpperCase())} className="input-premium" placeholder="EX: JOÃO DA SILVA" />
                          </div>
                          <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nascimento</label>
                              <input type="date" required value={formState.student.birthDate} onChange={e => handleInputChange('student', 'birthDate', e.target.value)} className="input-premium" />
                          </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">CPF Nominal</label>
                              <input type="text" required value={formState.student.cpf} onChange={e => handleInputChange('student', 'cpf', e.target.value)} className="input-premium" placeholder="000.000.000-00" />
                          </div>
                          <div className="flex flex-col justify-end">
                              <label className="flex items-center gap-5 p-5 bg-emerald-50 rounded-2xl border border-emerald-100 cursor-pointer hover:bg-white hover:shadow-luxury transition-all">
                                  <input type="checkbox" className="w-7 h-7 rounded-lg text-emerald-600 focus:ring-8 focus:ring-emerald-50 border-emerald-200" checked={formState.student.needsSpecialEducation} onChange={e => handleInputChange('student', 'needsSpecialEducation', e.target.checked)} />
                                  <div className="flex items-center gap-3">
                                      <HeartPulse className="h-5 w-5 text-emerald-600" />
                                      <span className="text-[10px] font-black text-emerald-800 uppercase">Requer AEE (Educação Especial)</span>
                                  </div>
                              </label>
                          </div>
                      </div>
                  </div>
              )}

              {formState.step === 2 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Responsável Legal</label>
                              <input type="text" required value={formState.guardian.fullName} onChange={e => handleInputChange('guardian', 'fullName', e.target.value.toUpperCase())} className="input-premium" />
                          </div>
                          <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Telefone de Contato</label>
                              <div className="relative group">
                                  <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
                                  <input type="tel" required value={formState.guardian.phone} onChange={e => handleInputChange('guardian', 'phone', e.target.value)} className="input-premium pl-16" placeholder="(75) 00000-0000" />
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {formState.step === 3 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <div className="bg-[#064e3b] p-10 rounded-[3rem] flex flex-col md:flex-row items-center gap-8 text-white shadow-deep overflow-hidden relative group">
                          <div className="bg-emerald-500 p-5 rounded-2xl shadow-xl transition-transform group-hover:rotate-6">
                            <MapPin className="h-8 w-8 text-white" />
                          </div>
                          <div className="flex-1 text-center md:text-left relative z-10">
                              <p className="text-[9px] font-black uppercase tracking-ultra text-emerald-400 mb-2">GPS SME ITABERABA</p>
                              <p className="text-base font-medium opacity-80 leading-relaxed">Sua localização nominal é usada para calcular a unidade escolar mais próxima de sua residência.</p>
                          </div>
                          <button 
                            type="button" 
                            onClick={handleGetLocation}
                            disabled={isLocating}
                            className="p-5 bg-white text-slate-900 rounded-[1.5rem] shadow-xl hover:bg-emerald-50 transition-all flex items-center gap-4 active:scale-95 disabled:opacity-50"
                          >
                            {isLocating ? <Loader2 className="h-6 w-6 animate-spin text-emerald-600" /> : <LocateFixed className="h-6 w-6 text-emerald-600" />}
                            <span className="text-[9px] font-black uppercase tracking-widest">Obter Coordenadas</span>
                          </button>
                      </div>

                      {coords && (
                        <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in zoom-in-95">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                          <span className="text-[9px] font-black text-emerald-800 uppercase">Posicionamento: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</span>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Endereço Residencial</label>
                              <input type="text" required value={formState.address.street} onChange={e => handleInputChange('address', 'street', e.target.value)} className="input-premium" placeholder="Rua, Número..." />
                          </div>
                          <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Bairro</label>
                              <input type="text" required value={formState.address.neighborhood} onChange={e => handleInputChange('address', 'neighborhood', e.target.value)} className="input-premium" />
                          </div>
                      </div>
                      <label className="flex items-center gap-6 p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 cursor-pointer group hover:bg-white hover:shadow-luxury transition-all">
                          <input type="checkbox" className="w-8 h-8 rounded-xl text-blue-600 focus:ring-8 focus:ring-blue-50 border-blue-200" checked={formState.student.needsTransport} onChange={e => handleInputChange('student', 'needsTransport', e.target.checked)} />
                          <div className="flex items-center gap-5">
                              <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                                <Bus className="h-6 w-6" />
                              </div>
                              <div>
                                <span className="text-lg font-black text-blue-900 uppercase tracking-tight block">Solicitar Transporte Público</span>
                                <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block">Itinerários otimizados via Geo-Alocação</span>
                              </div>
                          </div>
                      </label>
                  </div>
              )}

              {formState.step === 4 && (
                  <div className="py-12 text-center space-y-10 animate-in fade-in zoom-in-95 duration-700">
                      <div className="w-32 h-32 bg-emerald-50 rounded-[3.5rem] flex items-center justify-center mx-auto shadow-deep border-4 border-white animate-luxury-float">
                        <ShieldCheck className="h-16 w-16 text-emerald-600" />
                      </div>
                      <div className="space-y-4">
                        <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">Consolidação.</h2>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] max-w-sm mx-auto">Verifique os dados nominais antes de transmitir ao barramento municipal.</p>
                      </div>
                      <div className="bg-slate-50/50 p-12 rounded-[3.5rem] border border-slate-100 text-left space-y-6 shadow-inner">
                          <div className="flex justify-between items-center border-b border-slate-200 pb-6">
                              <span className="text-[10px] font-black text-slate-400 uppercase">Estudante</span>
                              <span className="text-lg font-black text-slate-900 uppercase">{formState.student.fullName}</span>
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-slate-400 uppercase">Território</span>
                              <span className="text-lg font-black text-slate-900 uppercase">{formState.address.neighborhood || 'Itaberaba'}</span>
                          </div>
                          <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center gap-4">
                            <Info className="h-6 w-6 text-blue-600" />
                            <p className="text-[11px] font-medium text-blue-900">O sistema alocará automaticamente a vaga na unidade escolar de maior conveniência geográfica.</p>
                          </div>
                      </div>
                  </div>
              )}

              <div className="flex justify-between items-center pt-16 border-t border-slate-100">
                  <button type="button" onClick={() => setFormState(p => ({...p, step: p.step - 1}))} disabled={formState.step === 1} className="text-[11px] font-black text-slate-400 hover:text-emerald-700 disabled:opacity-0 flex items-center gap-4 transition-all uppercase tracking-widest">
                    <ChevronLeft className="h-5 w-5" /> Voltar
                  </button>
                  {formState.step < 4 ? (
                      <button type="button" onClick={nextStep} className="btn-primary !h-16 !px-12 !text-[11px] !rounded-[1.5rem]">Próximo Passo <ChevronRight className="h-5 w-5" /></button>
                  ) : (
                      <button type="submit" disabled={isSubmitting} className="btn-primary !h-16 !px-12 !text-[11px] !bg-emerald-600 !rounded-[1.5rem] active:scale-95 group">
                          {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Transmitir Dossiê <Zap className="h-5 w-5 group-hover:scale-125 transition-transform" /></>}
                      </button>
                  )}
              </div>
          </form>
        </div>
      </div>
    </div>
  );
};
