
import React, { useState, useEffect } from 'react';
import { useSearchParams } from '../router';
import { useData } from '../contexts/DataContext';
import { 
  User, Award, MapPin, Printer, ShieldCheck, Activity, 
  Zap, GraduationCap, TrendingUp, ChevronLeft, Calendar, Info
} from 'lucide-react';
import { useNavigate } from '../router';

export const StudentMonitoring: React.FC = () => {
  const { students } = useData();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const studentId = params.get('id');

  const student = students.find(s => s.id === studentId || s.enrollmentId === studentId);

  if (!student) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#fcfdfe] gap-6">
      <div className="w-16 h-16 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Acessando Prontuário Nominal...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-20 px-8 page-transition">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-16">
          <div className="flex items-center gap-10">
            <div className="relative group">
                <div className="w-40 h-40 rounded-[3rem] bg-white border-[10px] border-white shadow-luxury overflow-hidden flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                  {student.photo ? <img src={student.photo} className="w-full h-full object-cover" /> : <User className="h-16 w-16 text-slate-200" />}
                </div>
                <div className="absolute -bottom-3 -right-3 bg-blue-600 p-3.5 rounded-[1.2rem] text-white shadow-2xl border-4 border-[#fcfdfe]">
                    <ShieldCheck className="h-6 w-6" />
                </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">Protocolo: {student.enrollmentId || 'PENDENTE'}</span>
                <span className="bg-emerald-50 text-emerald-600 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100">{student.status}</span>
              </div>
              <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">{student.name}</h1>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-4 mt-4">
                <GraduationCap className="h-6 w-6 text-blue-600" /> {student.grade || 'Fundamental II'} • {student.school || 'Unidade Municipal'}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => window.print()} className="btn-secondary !h-20 !px-12 shadow-luxury">
                <Printer className="h-6 w-6" /> Imprimir Boletim
            </button>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-10 mb-16">
          <div className="card-requinte p-12 flex items-center gap-8">
            <div className="bg-blue-600 p-5 rounded-[1.5rem] text-white shadow-xl shadow-blue-100"><Activity className="h-7 w-7" /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assiduidade</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">{student.attendance?.presentDays || '98'}%</p>
            </div>
          </div>
          <div className="card-requinte p-12 flex items-center gap-8">
            <div className="bg-emerald-500 p-5 rounded-[1.5rem] text-white shadow-xl shadow-emerald-100"><TrendingUp className="h-7 w-7" /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Média Nominal</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">DE</p>
            </div>
          </div>
          <div className="bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl flex items-center gap-8 text-white relative overflow-hidden group">
            <div className="bg-blue-400 p-5 rounded-[1.5rem] text-slate-900 shadow-xl relative z-10"><Zap className="h-7 w-7" /></div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Transp. Escolar</p>
              <p className="text-xl font-black uppercase tracking-tight">{student.transportRequest ? 'REQUERIDO' : 'URBANO'}</p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150"></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8">
                <div className="bg-white rounded-[4rem] shadow-luxury border border-slate-100 p-16 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-16">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-5 uppercase">
                            <Award className="h-8 w-8 text-blue-600" /> Histórico Pedagógico BNCC
                        </h3>
                        <div className="flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Ano Letivo 2025</span>
                        </div>
                    </div>
                    
                    <div className="space-y-8">
                        {(student.performanceHistory || [
                            { subject: 'LÍNGUA PORTUGUESA', g1: ['DE', 'DB', ''] },
                            { subject: 'MATEMÁTICA', g1: ['DB', 'EP', ''] },
                            { subject: 'CIÊNCIAS', g1: ['DE', 'DE', ''] }
                        ]).map((row, idx) => (
                            <div key={idx} className="flex items-center justify-between p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-50 hover:bg-white hover:shadow-xl transition-all duration-500 group">
                                <span className="font-black text-slate-900 uppercase tracking-tight text-2xl group-hover:text-blue-600 transition-colors">{row.subject}</span>
                                <div className="flex gap-4">
                                    {row.g1?.map((g, i) => (
                                        <div key={i} className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm border ${g === 'DE' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : g === 'DB' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-slate-300 border-slate-100'}`}>
                                            {g || '--'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="absolute -bottom-32 -right-32 h-80 w-80 bg-blue-50 rounded-full -z-10 blur-[120px] opacity-30"></div>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-10">
                <div className="bg-white p-16 rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-10 uppercase flex items-center gap-4">
                        <Info className="h-6 w-6 text-blue-500" /> Dados Nominais
                    </h3>
                    <div className="space-y-10">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Cadastro de Pessoa Física</p>
                            <p className="text-xl font-bold text-slate-800 font-mono">{student.cpf}</p>
                        </div>
                        <div className="pt-10 border-t border-slate-50">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Localização Nominal</p>
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><MapPin className="h-5 w-5" /></div>
                                <div>
                                    <p className="text-lg font-black text-slate-800 uppercase leading-none mb-2">{student.address?.neighborhood}</p>
                                    <p className="text-sm font-medium text-slate-400 uppercase tracking-tight">{student.address?.street}, {student.address?.number}</p>
                                </div>
                            </div>
                        </div>
                        <div className="pt-10 border-t border-slate-50">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Número de Inscrição Social</p>
                            <p className="text-xl font-bold text-slate-800 font-mono">{student.nis || '--- --- ---'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
