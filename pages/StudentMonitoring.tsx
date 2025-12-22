
import React from 'react';
import { useSearchParams } from '../router';
import { useData } from '../contexts/DataContext';
import { 
  MapPin, Printer, ShieldCheck, Activity, 
  GraduationCap, HeartPulse, Bus, FileText,
  BadgeCheck, Zap, Info, ArrowLeft,
  Calendar, Globe, Building, Database
} from 'lucide-react';
import { useNavigate } from '../router';

export const StudentMonitoring: React.FC = () => {
  const { students } = useData();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const studentId = params.get('id');

  const student = students.find(s => s.id === studentId || s.enrollmentId === studentId || s.inepId === studentId);

  if (!student) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-6">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-2xl animate-spin"></div>
        <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.5em]">Gerando Dossiê Nominal...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-12 px-8 page-transition">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between no-print">
            <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-emerald-600 transition group">
                <ArrowLeft className="h-4.5 w-4.5 group-hover:-translate-x-1.5 transition-transform" /> Voltar ao Painel
            </button>
            <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-ultra">Dossiê Sincronizado SME</span>
            </div>
        </div>

        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 no-print bg-white p-10 rounded-[3rem] border border-slate-200 shadow-luxury relative overflow-hidden group">
          <div className="flex items-center gap-10 relative z-10">
            <div className="relative">
                <div className="w-28 h-28 rounded-[2.5rem] bg-slate-50 border-4 border-white shadow-2xl overflow-hidden ring-1 ring-slate-100 group-hover:scale-105 transition-transform duration-700">
                  <img src={student.photo || `https://ui-avatars.com/api/?name=${student.name}&size=150&background=064e3b&color=fff`} className="w-full h-full object-cover" alt={student.name} />
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 bg-[#064e3b] p-2.5 rounded-2xl text-white shadow-2xl border-4 border-white">
                    <ShieldCheck className="h-4 w-4" />
                </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">ID INEP: {student.inepId || '---'}</span>
                <span className={`badge-status ${student.status === 'Matriculado' ? 'badge-emerald' : 'badge-amber'}`}>{student.status}</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">{student.name}</h1>
              <div className="flex items-center gap-8 pt-2">
                  <div className="flex items-center gap-2.5 text-slate-500 font-bold text-[10px] uppercase tracking-tight">
                    <GraduationCap className="h-5 w-5 text-emerald-600" /> {student.grade || 'ENSINO REGULAR'}
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-500 font-bold text-[10px] uppercase tracking-tight">
                    <Building className="h-5 w-5 text-emerald-600" /> {student.school || 'AGUARDANDO ALOCAÇÃO'}
                  </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 relative z-10">
            <button onClick={() => window.print()} className="btn-secondary !h-14 !px-8 !text-[10px] !rounded-2xl">
                <Printer className="h-5 w-5" /> Exportar Dossiê
            </button>
            <button onClick={() => navigate('/performance?studentId=' + student.id)} className="btn-primary !h-14 !px-8 !text-[10px] !rounded-2xl shadow-emerald-900/10">
                <Activity className="h-5 w-5" /> Histórico Síncrono
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-requinte p-6 flex flex-col justify-between h-32 border-l-4 border-l-emerald-600">
            <Activity className="h-6 w-6 text-emerald-600" />
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Carga Horária / Semana</p>
              <p className="text-2xl font-black text-slate-900 tracking-tighter">{student.weeklyHours || '---'}</p>
            </div>
          </div>
          
          <div className="card-requinte p-6 flex flex-col justify-between h-32 border-l-4 border-l-pink-500">
            <HeartPulse className={`h-6 w-6 ${student.specialNeeds ? 'text-pink-500' : 'text-slate-200'}`} />
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Inclusão AEE (Diagnóstico)</p>
              <p className="text-[11px] font-black text-slate-900 uppercase truncate leading-none">{student.specialNeeds ? (student.disabilityType || 'EM MONITOR.') : 'ENSINO REGULAR'}</p>
            </div>
          </div>

          <div className="card-requinte p-6 flex flex-col justify-between h-32 border-l-4 border-l-blue-500">
            <Bus className={`h-6 w-6 ${student.transportRequest ? 'text-blue-500' : 'text-slate-200'}`} />
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Logística de Transporte</p>
              <p className="text-[11px] font-black text-slate-900 uppercase truncate leading-none">{student.transportRequest ? (student.transportVehicle || 'ÔNIBUS MUNICIPAL') : 'LOCAL / URBANO'}</p>
            </div>
          </div>

          <div className="bg-[#0F172A] p-6 rounded-2xl flex flex-col justify-between text-white h-32 shadow-xl border border-slate-800 group">
            <div className="flex justify-between items-start">
                <Database className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-[8px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 uppercase">Sync MEC</span>
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Vínculo Nominal Inep</p>
              <p className="text-[11px] font-black uppercase truncate leading-none tracking-tight">BANCO AUDITADO SME</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-luxury">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-4">
                            <FileText className="h-6 w-6 text-emerald-600" /> Prontuário Educacional 2025
                        </h3>
                        <div className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-bold text-slate-400 border border-slate-100 uppercase">Ciclo 1 Ativo</div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                        <div className="space-y-6">
                            <div className="group">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Turma de Vínculo</p>
                                <p className="text-sm font-black text-slate-900 uppercase">{student.className || 'Não Alocada'}</p>
                                <p className="text-[9px] text-slate-400 mt-1 font-bold">Código Turma: {student.classCode || '---'}</p>
                            </div>
                            <div className="group">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Horário e Funcionamento</p>
                                <p className="text-sm font-black text-slate-900 uppercase">{student.classSchedule || 'Matutino (08:00 às 12:00)'}</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="group">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Documentação Nominal (CPF)</p>
                                <p className="text-sm font-black text-slate-900 font-mono tracking-tighter">{student.cpf}</p>
                            </div>
                            <div className="group">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Metadados Pessoais</p>
                                <p className="text-sm font-black text-slate-900 uppercase">{student.race} • {student.sex}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-4">
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                            <Info className="h-4 w-4 text-blue-600" /> Observações Técnicas SME
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            {student.specialNeeds 
                                ? `Estudante com atendimento educacional especializado ativo. Recursos em uso: ${student.resourceAEE}. Monitoramento de rede nominal em progresso.` 
                                : "Fluxo regular de ensino sem necessidade de atendimento técnico especializado (AEE) registrado nesta vigência de rede."
                            }
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="card-requinte p-8 space-y-8 shadow-luxury rounded-[2.5rem]">
                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] border-b border-slate-50 pb-6 flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-emerald-600" /> Territorialidade
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-start gap-5">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shrink-0"><Globe className="h-5 w-5" /></div>
                            <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">ZONA DE RESIDÊNCIA</p>
                                <p className="text-xs font-black text-slate-900 uppercase">{student.residenceZone || 'Zona Urbana'} • Itaberaba - BA</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-5">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0"><Calendar className="h-5 w-5" /></div>
                            <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">VIGÊNCIA NOMINAL</p>
                                <p className="text-xs font-black text-slate-900 uppercase">CENSO ESCOLAR 2025</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#064e3b] p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border border-emerald-900">
                    <BadgeCheck className="h-12 w-12 mb-8 text-emerald-400 group-hover:scale-110 transition-transform duration-1000" />
                    <h3 className="text-xl font-black tracking-tight mb-3 leading-tight uppercase">Validação Síncrona.</h3>
                    <p className="text-emerald-100/60 text-[10px] leading-relaxed mb-10 font-medium">Este dossiê possui integridade nominal garantida via barramento municipal SME Itaberaba para fins de comprovação oficial.</p>
                    <div className="flex justify-between items-center pt-6 border-t border-emerald-800">
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] opacity-40">Gov Digital 2025</span>
                        <Zap className="h-4 w-4 text-emerald-400 animate-pulse" />
                    </div>
                    <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px]"></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
