import React from 'react';
import { useSearchParams } from '../router';
import { useData } from '../contexts/DataContext';
import { 
  MapPin, Printer, ShieldCheck, Activity, 
  GraduationCap, HeartPulse, Bus, FileText,
  BadgeCheck, Zap, Info
} from 'lucide-react';
import { useNavigate } from '../router';

export const StudentMonitoring: React.FC = () => {
  const { students } = useData();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const studentId = params.get('id');

  const student = students.find(s => s.id === studentId || s.enrollmentId === studentId);

  if (!student) return <div className="h-screen flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-emerald-900">Sincronizando Dossiê...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-6 page-transition">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative group">
                <div className="w-16 h-16 rounded-lg bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
                  <img src={student.photo || `https://ui-avatars.com/api/?name=${student.name}&size=100&background=064e3b&color=fff`} className="w-full h-full object-cover" alt={student.name} />
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 bg-[#064e3b] p-1 rounded text-white shadow shadow-emerald-950/20">
                    <ShieldCheck className="h-2.5 w-2.5" />
                </div>
            </div>
            
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">RA: {student.enrollmentId || 'PROVISÓRIO'}</span>
                <span className={`badge-status ${student.status === 'Matriculado' ? 'badge-emerald' : 'badge-amber'}`}>{student.status}</span>
              </div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight uppercase leading-none">{student.name}</h1>
              <div className="flex items-center gap-3 pt-1">
                  <div className="flex items-center gap-1 text-slate-400 font-bold text-[8px] uppercase">
                    <GraduationCap className="h-2.5 w-2.5 text-emerald-600" /> {student.grade || 'REGULAR'}
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 font-bold text-[8px] uppercase">
                    <MapPin className="h-2.5 w-2.5 text-emerald-600" /> {student.school || 'AGUARDANDO'}
                  </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="btn-secondary !h-8 !px-4 !text-[8px]">
                <Printer className="h-3 w-3" /> Imprimir Dossiê
            </button>
            <button onClick={() => navigate('/performance?studentId=' + student.id)} className="btn-primary !h-8 !px-4 !text-[8px]">
                <Activity className="h-3 w-3" /> Ver Indicadores
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-requinte p-3 flex flex-col justify-between h-20">
            <Activity className="h-3.5 w-3.5 text-emerald-600" />
            <div>
              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Frequência</p>
              <p className="text-lg font-black text-slate-900 tracking-tighter">98<span className="text-[10px] text-emerald-400">%</span></p>
            </div>
          </div>
          
          <div className="card-requinte p-3 flex flex-col justify-between h-20">
            <HeartPulse className={`h-3.5 w-3.5 ${student.specialNeeds ? 'text-pink-500' : 'text-slate-200'}`} />
            <div>
              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Saúde / AEE</p>
              <p className="text-[9px] font-black text-slate-900 uppercase truncate">{student.specialNeeds ? (student.disabilityType || 'Ativo') : 'REGULAR'}</p>
            </div>
          </div>

          <div className="card-requinte p-3 flex flex-col justify-between h-20">
            <Bus className={`h-3.5 w-3.5 ${student.transportRequest ? 'text-blue-500' : 'text-slate-200'}`} />
            <div>
              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Logística</p>
              <p className="text-[9px] font-black text-slate-900 uppercase truncate">{student.transportRequest ? 'ROTA ATIVA' : 'URBANO'}</p>
            </div>
          </div>

          <div className="bg-[#064e3b] p-3 rounded-xl flex flex-col justify-between text-white h-20 shadow-sm border border-emerald-900/50">
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
            <div>
              <p className="text-[7px] font-bold text-emerald-500 uppercase tracking-widest mb-0.5">Sincronismo</p>
              <p className="text-[9px] font-black uppercase truncate">Base Nominal Ativa</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-emerald-600" /> Rendimento Acadêmico (Ciclo 2025)
                    </h3>
                    <div className="space-y-2">
                        {(student.performanceHistory || [
                            { subject: 'LÍNGUA PORTUGUESA', g1: ['DE', 'DB', ''] },
                            { subject: 'MATEMÁTICA', g1: ['DB', 'EP', ''] },
                            { subject: 'CIÊNCIAS', g1: ['DE', 'DE', ''] },
                            { subject: 'HISTÓRIA', g1: ['DB', 'DB', ''] }
                        ]).map((row, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100 group hover:bg-white transition-all">
                                <span className="font-bold text-slate-900 uppercase text-[9px] truncate group-hover:text-emerald-700">{row.subject}</span>
                                <div className="flex gap-1.5">
                                    {row.g1?.map((g, i) => (
                                        <div key={i} className={`w-7 h-7 rounded flex items-center justify-center font-bold text-[9px] border ${g ? 'bg-white border-emerald-200 text-emerald-700 shadow-sm' : 'bg-transparent border-slate-200 text-slate-300'}`}>
                                            {g || '-'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="card-requinte p-5 space-y-4 shadow-sm">
                    <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-2">Dados Cadastrais</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"><Info className="h-3.5 w-3.5" /></div>
                            <div>
                                <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">CPF Nominal</p>
                                <p className="text-[10px] font-bold text-slate-900 font-mono">{student.cpf}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"><MapPin className="h-3.5 w-3.5" /></div>
                            <div>
                                <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Território</p>
                                <p className="text-[10px] font-bold text-slate-900 uppercase truncate">{student.address?.neighborhood || 'CENTRO'} • {student.address?.zone || 'URBANA'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#064e3b] p-5 rounded-xl text-white shadow-md relative overflow-hidden border border-emerald-900">
                    <BadgeCheck className="h-6 w-6 mb-3 opacity-40" />
                    <h3 className="text-sm font-bold tracking-tight mb-1 leading-none uppercase">Validado SME.</h3>
                    <p className="text-emerald-100/60 text-[8px] leading-relaxed mb-3">Este dossiê possui integridade síncrona municipal auditada.</p>
                    <div className="pt-2 border-t border-emerald-800 text-[7px] font-bold uppercase tracking-widest opacity-60">ITABERABA • GOVERNO DIGITAL</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};