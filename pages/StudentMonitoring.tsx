
import React from 'react';
import { useSearchParams } from '../router';
import { useData } from '../contexts/DataContext';
// Fix: Added missing MUNICIPALITY_NAME import
import { MUNICIPALITY_NAME } from '../constants';
import { 
  MapPin, Printer, ShieldCheck, Activity, 
  GraduationCap, HeartPulse, Bus, FileText,
  BadgeCheck, Zap, Info, ArrowLeft,
  Calendar, Globe, Building, Database, ArrowUpRight, Award, Target
} from 'lucide-react';
import { useNavigate } from '../router';

export const StudentMonitoring: React.FC = () => {
  const { students } = useData();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const studentId = params.get('id');

  const student = students.find(s => s.id === studentId || s.enrollmentId === studentId || s.inepId === studentId);

  if (!student) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-10">
        <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-8 border-emerald-100 rounded-3xl"></div>
            <div className="absolute inset-0 border-8 border-emerald-600 border-t-transparent rounded-3xl animate-spin"></div>
        </div>
        <span className="text-emerald-600 font-black text-[12px] uppercase tracking-[0.5em] animate-pulse">Autenticando Dossiê Nominal...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-20 px-12 page-transition">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex items-center justify-between no-print">
            <button onClick={() => navigate(-1)} className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-emerald-600 transition-all group">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 group-hover:-translate-x-2 transition-transform">
                    <ArrowLeft className="h-5 w-5" />
                </div> Painel de Rede
            </button>
            <div className="flex items-center gap-4 bg-emerald-50 px-6 py-2.5 rounded-2xl border border-emerald-100 shadow-sm">
                <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_#10b981]"></div>
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-ultra">Dossiê Síncrono SME Itaberaba</span>
            </div>
        </div>

        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12 no-print bg-white p-16 rounded-[4rem] border border-slate-100 shadow-deep relative overflow-hidden group">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-14 relative z-10">
            <div className="relative shrink-0">
                <div className="w-40 h-40 rounded-[3.5rem] bg-slate-50 border-8 border-white shadow-2xl overflow-hidden ring-1 ring-slate-100 group-hover:scale-105 transition-transform duration-1000">
                  <img src={student.photo || `https://ui-avatars.com/api/?name=${student.name}&size=250&background=064e3b&color=fff`} className="w-full h-full object-cover" alt={student.name} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#064e3b] p-4 rounded-[1.5rem] text-white shadow-2xl border-4 border-white animate-bounce">
                    <ShieldCheck className="h-7 w-7" />
                </div>
            </div>
            
            <div className="space-y-8 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-slate-900 px-6 py-2 rounded-xl text-white">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">ID MEC: {student.inepId || 'PENDENTE'}</span>
                </div>
                <span className={`badge-status ${student.status === 'Matriculado' ? 'badge-emerald' : 'badge-amber'}`}>
                    <Target className="h-4 w-4" />
                    {student.status}
                </span>
              </div>
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">{student.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-10">
                  <div className="flex items-center gap-4 text-slate-500 font-bold text-[12px] uppercase tracking-widest">
                    <GraduationCap className="h-6 w-6 text-emerald-600" /> {student.grade || 'ENSINO REGULAR'}
                  </div>
                  <div className="flex items-center gap-4 text-slate-500 font-bold text-[12px] uppercase tracking-widest">
                    <Building className="h-6 w-6 text-emerald-600" /> {student.school || 'AGUARDANDO ALOCAÇÃO'}
                  </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 relative z-10 w-full xl:w-auto">
            <button onClick={() => window.print()} className="btn-primary !h-20 !px-12 !bg-white !text-slate-900 border border-slate-100 shadow-luxury hover:!bg-slate-50">
                <Printer className="h-6 w-6" /> Exportar PDF
            </button>
            <button onClick={() => navigate('/performance?studentId=' + student.id)} className="btn-primary !h-20 !px-12 !bg-slate-900">
                <Activity className="h-6 w-6" /> Monitoramento
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[120px] opacity-40 -mr-32 -mt-32"></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
          <div className="card-requinte p-10 flex flex-col justify-between h-44 border-l-[10px] border-emerald-600">
            <Activity className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">CH Semanal Nominal</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">{student.weeklyHours || '20:00:00'}</p>
            </div>
          </div>
          
          <div className="card-requinte p-10 flex flex-col justify-between h-44 border-l-[10px] border-pink-500">
            <HeartPulse className={`h-8 w-8 ${student.specialNeeds ? 'text-pink-500' : 'text-slate-200'}`} />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Diagnóstico Inep AEE</p>
              <p className="text-[13px] font-black text-slate-900 uppercase truncate leading-none tracking-tight">{student.specialNeeds ? (student.disabilityType || 'MONITORADO') : 'REGULAR'}</p>
            </div>
          </div>

          <div className="card-requinte p-10 flex flex-col justify-between h-44 border-l-[10px] border-blue-500">
            <Bus className={`h-8 w-8 ${student.transportRequest ? 'text-blue-500' : 'text-slate-200'}`} />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Frota e Itinerário</p>
              <p className="text-[13px] font-black text-slate-900 uppercase truncate leading-none tracking-tight">{student.transportRequest ? (student.transportVehicle || 'ÔNIBUS MUNICIPAL') : 'ZONA URBANA'}</p>
            </div>
          </div>

          <div className="bg-[#0F172A] p-10 rounded-[3rem] flex flex-col justify-between text-white h-44 shadow-deep border border-slate-800 group">
            <div className="flex justify-between items-start">
                <Database className="h-8 w-8 text-blue-400 group-hover:scale-110 transition-transform" />
                <div className="bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest">Sync MEC</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Integridade de Rede</p>
              <p className="text-2xl font-black uppercase tracking-tight leading-none text-emerald-400">Auditado</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-12">
            <div className="col-span-12 xl:col-span-8 space-y-10">
                <div className="card-requinte !p-16 shadow-luxury">
                    <div className="flex justify-between items-center mb-16 border-b border-slate-50 pb-10">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-6">
                                <FileText className="h-8 w-8 text-emerald-600" /> Prontuário Educacional 2025
                            </h3>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Vigência Nominal Ciclo I</p>
                        </div>
                        <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl">
                            <Award className="h-6 w-6" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
                        <div className="space-y-10">
                            <div className="group space-y-3">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Turma de Vínculo MEC</p>
                                <p className="text-xl font-black text-slate-900 uppercase tracking-tight">{student.className || 'AGUARDANDO ALOCAÇÃO'}</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg uppercase">Cód: {student.classCode || '---'}</span>
                                </div>
                            </div>
                            <div className="group space-y-3">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Funcionamento Síncrono</p>
                                <p className="text-xl font-black text-slate-900 uppercase tracking-tight">{student.classSchedule || 'MATUTINO (08:00 - 12:00)'}</p>
                            </div>
                        </div>
                        <div className="space-y-10">
                            <div className="group space-y-3">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Documentação Nominal</p>
                                <p className="text-xl font-black text-slate-900 font-mono tracking-tighter">{student.cpf}</p>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Zap className="h-3 w-3" /> Validado via Receita Federal</span>
                            </div>
                            <div className="group space-y-3">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Metadados do Estudante</p>
                                <p className="text-xl font-black text-slate-900 uppercase tracking-tight">{student.race} • {student.sex}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 space-y-6 relative overflow-hidden group">
                        <div className="flex items-center gap-5 mb-2 relative z-10">
                            <div className="bg-blue-600 p-3 rounded-xl text-white shadow-lg">
                                <Info className="h-6 w-6" />
                            </div>
                            <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em]">Observações Técnicas SME</h4>
                        </div>
                        <p className="text-base text-slate-600 font-medium leading-relaxed relative z-10 max-w-2xl">
                            {student.specialNeeds 
                                ? `Estudante possui atendimento especializado ativo (AEE). Recursos em uso: ${student.resourceAEE || 'Monitoramento Técnico'}. Base nominal sincronizada com o barramento de rede.` 
                                : "O estudante está enquadrado em fluxo regular de ensino municipal, sem restrições técnicas ou necessidade de atendimento especializado registradas na presente vigência."
                            }
                        </p>
                        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-blue-100 rounded-full blur-[80px] opacity-40 group-hover:scale-125 transition-transform duration-[3s]"></div>
                    </div>
                </div>
            </div>

            <div className="col-span-12 xl:col-span-4 space-y-10">
                <div className="card-requinte !p-12 space-y-12 shadow-deep rounded-[3.5rem]">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-8">
                        <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.5em] flex items-center gap-5">
                            <MapPin className="h-6 w-6 text-emerald-600" /> Territorialidade
                        </h3>
                        <ArrowUpRight className="h-5 w-5 text-slate-200" />
                    </div>
                    <div className="space-y-12">
                        <div className="flex items-start gap-8 group">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shrink-0 group-hover:scale-110 transition-transform shadow-sm"><Globe className="h-7 w-7" /></div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">ZONA RESIDENCIAL</p>
                                <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">{student.residenceZone || 'Zona Urbana'}</p>
                                <p className="text-[11px] font-bold text-slate-400 uppercase mt-2">{MUNICIPALITY_NAME} • Bahia</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-8 group">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0 group-hover:scale-110 transition-transform shadow-sm"><Calendar className="h-7 w-7" /></div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">VIGÊNCIA NOMINAL</p>
                                <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">CENSO ESCOLAR 2025</p>
                                <p className="text-[11px] font-bold text-slate-400 uppercase mt-2">Dossiê Válido para 12 Meses</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#064e3b] p-16 rounded-[4rem] text-white shadow-deep relative overflow-hidden group border border-emerald-950">
                    <BadgeCheck className="h-16 w-16 mb-12 text-emerald-400 group-hover:rotate-12 transition-transform duration-700" />
                    <h3 className="text-3xl font-black tracking-tighter mb-6 leading-tight uppercase">Autenticidade <br/>Garantida.</h3>
                    <p className="text-emerald-100/60 text-base leading-relaxed mb-12 font-medium">Este dossiê possui integridade nominal garantida via barramento municipal SME Itaberaba para fins de comprovação oficial em todo território nacional.</p>
                    <div className="flex justify-between items-center pt-10 border-t border-emerald-800">
                        <span className="text-[11px] font-black uppercase tracking-[0.6em] opacity-40">GOV DIGITAL 2025</span>
                        <div className="p-3 bg-emerald-500 rounded-xl shadow-2xl shadow-emerald-950 animate-pulse">
                            <Zap className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <div className="absolute -bottom-32 -right-32 h-64 w-64 bg-emerald-500/10 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-[4s]"></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
