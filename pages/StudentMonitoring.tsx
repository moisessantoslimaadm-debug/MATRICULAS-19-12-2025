import React from 'react';
import { useSearchParams } from '../router';
import { useData } from '../contexts/DataContext';
import { 
  User, Award, MapPin, Printer, ShieldCheck, Activity, 
  Zap, GraduationCap, TrendingUp, ChevronLeft, Calendar, 
  Info, Share2, Sparkles, HeartPulse, Bus, FileText, ArrowRight,
  BadgeCheck
} from 'lucide-react';
import { useNavigate } from '../router';

export const StudentMonitoring: React.FC = () => {
  const { students } = useData();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const studentId = params.get('id');

  const student = students.find(s => s.id === studentId || s.enrollmentId === studentId);

  if (!student) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#fcfdfe] gap-10">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-2xl animate-spin"></div>
      <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Sincronizando Dossiê...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-8 lg:px-16 page-transition">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-20 no-print">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
            <div className="relative group">
                <div className="w-48 h-48 rounded-[3rem] bg-white border-[8px] border-white shadow-2xl overflow-hidden flex items-center justify-center transition-all duration-700 relative">
                  <img src={student.photo || `https://ui-avatars.com/api/?name=${student.name}&size=200`} className="w-full h-full object-cover" alt={student.name} />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-blue-600 p-4 rounded-2xl text-white shadow-xl border-4 border-[#f8fafc]">
                    <ShieldCheck className="h-7 w-7" />
                </div>
            </div>
            
            <div className="space-y-6 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <span className="bg-[#0F172A] text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">ID NOMINAL: {student.enrollmentId || '---'}</span>
                <span className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-md ${student.status === 'Matriculado' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                    {student.status}
                </span>
              </div>
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">{student.name}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-10 pt-2">
                  <div className="flex items-center gap-4 text-slate-400 font-black text-[11px] uppercase tracking-widest">
                    <GraduationCap className="h-6 w-6 text-blue-600" /> {student.grade || 'SÉRIE PENDENTE'}
                  </div>
                  <div className="flex items-center gap-4 text-slate-400 font-black text-[11px] uppercase tracking-widest">
                    <MapPin className="h-6 w-6 text-blue-600" /> {student.school || 'AGUARDANDO ALOCAÇÃO'}
                  </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 w-full lg:w-auto">
            <button onClick={() => window.print()} className="btn-secondary !h-16 !px-12 shadow-xl">
                <Printer className="h-6 w-6" /> Gerar Prontuário
            </button>
          </div>
        </header>

        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="card-requinte !p-10 flex flex-col justify-between group">
            <Activity className="h-8 w-8 text-blue-600 mb-8" />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Frequência</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">98%</p>
            </div>
          </div>
          
          <div className="card-requinte !p-10 flex flex-col justify-between group">
            <HeartPulse className={`h-8 w-8 mb-8 ${student.specialNeeds ? 'text-pink-500 animate-pulse' : 'text-slate-200'}`} />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Saúde / AEE</p>
              <p className="text-xl font-black text-slate-900 uppercase tracking-tight">{student.specialNeeds ? student.disabilityType : 'REGULAR'}</p>
            </div>
          </div>

          <div className="card-requinte !p-10 flex flex-col justify-between group">
            <Bus className={`h-8 w-8 mb-8 ${student.transportRequest ? 'text-blue-500' : 'text-slate-200'}`} />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Logística</p>
              <p className="text-xl font-black text-slate-900 uppercase tracking-tight">{student.transportRequest ? 'ROTA ATIVA' : 'URBANO'}</p>
            </div>
          </div>

          <div className="bg-[#0F172A] p-10 rounded-[2.5rem] flex flex-col justify-between text-white shadow-2xl relative overflow-hidden group">
            <Sparkles className="h-8 w-8 text-amber-400 mb-8" />
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Projetos Ativos</p>
              <p className="text-lg font-black uppercase tracking-tight">{student.municipalProjects?.[0] || 'NENHUM'}</p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600 opacity-20 blur-3xl"></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
                <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-16">
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-16 flex items-center gap-6">
                        <FileText className="h-10 w-10 text-blue-600" /> Histórico Síncrono.
                    </h3>
                    <div className="space-y-8">
                        {(student.performanceHistory || [
                            { subject: 'LÍNGUA PORTUGUESA', g1: ['DE', 'DB', ''] },
                            { subject: 'MATEMÁTICA', g1: ['DB', 'EP', ''] },
                            { subject: 'CIÊNCIAS', g1: ['DE', 'DE', ''] }
                        ]).map((row, idx) => (
                            <div key={idx} className="flex items-center justify-between p-8 bg-slate-50 rounded-[2rem] border border-slate-50 hover:bg-white hover:shadow-xl transition-all group">
                                <span className="font-black text-slate-900 uppercase tracking-tight text-2xl">{row.subject}</span>
                                <div className="flex gap-4">
                                    {row.g1?.map((g, i) => (
                                        <div key={i} className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border ${g ? 'bg-white border-blue-100 text-blue-600' : 'bg-transparent border-slate-200 text-slate-200'}`}>
                                            {g || '--'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-10">
                <div className="card-requinte !p-12 relative overflow-hidden group">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-12 uppercase">Identidade SME.</h3>
                    <div className="space-y-10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm"><Info className="h-7 w-7" /></div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">CPF Oficial</p>
                                <p className="text-xl font-black text-slate-800 font-mono tracking-tighter">{student.cpf}</p>
                            </div>
                        </div>
                        <div className="pt-10 border-t border-slate-100 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm"><MapPin className="h-7 w-7" /></div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Logradouro Territorial</p>
                                <p className="text-xl font-black text-slate-900 uppercase leading-none tracking-tight">{student.address?.neighborhood}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-600 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden border border-blue-500">
                    <BadgeCheck className="h-16 w-16 mb-10 opacity-30" />
                    <h3 className="text-4xl font-black tracking-tighter mb-6 leading-none uppercase">Validação <br/> Digital SME.</h3>
                    <p className="text-blue-100 text-sm leading-relaxed mb-12 font-medium">Este dossiê possui integridade de rede municipal e validade legal em todo o território de Itaberaba.</p>
                    <div className="flex justify-between items-center pt-10 border-t border-blue-500/50">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">ITABERABA • 2025</span>
                        <ArrowRight className="h-6 w-6" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};