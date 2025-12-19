import React, { useState, useEffect } from 'react';
import { useSearchParams } from '../router';
import { useData } from '../contexts/DataContext';
import { 
  User, Award, MapPin, Printer, ShieldCheck, Activity, 
  Zap, GraduationCap, TrendingUp, ChevronLeft, Calendar, Info, Share2, Star
} from 'lucide-react';
import { useNavigate } from '../router';
import { MUNICIPALITY_NAME } from '../constants';

export const StudentMonitoring: React.FC = () => {
  const { students } = useData();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const studentId = params.get('id');

  const student = students.find(s => s.id === studentId || s.enrollmentId === studentId);

  if (!student) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#fcfdfe] gap-10">
      <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-blue-50 rounded-[2rem]"></div>
          <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-[2rem] animate-spin"></div>
      </div>
      <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Sincronizando Prontuário Nominal...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-24 px-12 page-transition">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-16 mb-24">
          <div className="flex items-center gap-14">
            <div className="relative group">
                <div className="w-56 h-56 rounded-[4rem] bg-white border-[12px] border-white shadow-luxury overflow-hidden flex items-center justify-center transition-all duration-[1.5s] group-hover:scale-105 relative">
                  {student.photo ? <img src={student.photo} className="w-full h-full object-cover" /> : <User className="h-24 w-24 text-slate-200" />}
                  <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-blue-600 p-5 rounded-[1.8rem] text-white shadow-2xl border-[6px] border-[#fcfdfe] group-hover:rotate-12 transition-transform duration-700">
                    <ShieldCheck className="h-8 w-8" />
                </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <span className="bg-[#0F172A] text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-ultra shadow-2xl">Protocolo: {student.enrollmentId || 'PENDENTE'}</span>
                <span className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-ultra border ${student.status === 'Matriculado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                    {student.status}
                </span>
              </div>
              <h1 className="text-8xl font-black text-slate-900 tracking-tighter uppercase leading-none">{student.name}</h1>
              <div className="flex items-center gap-8 pt-4">
                  <div className="flex items-center gap-4 text-slate-400 font-black text-[11px] uppercase tracking-ultra">
                    <GraduationCap className="h-6 w-6 text-blue-600" /> {student.grade || 'Fundamental II'}
                  </div>
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  <div className="flex items-center gap-4 text-slate-400 font-black text-[11px] uppercase tracking-ultra">
                    <MapPin className="h-6 w-6 text-blue-600" /> {student.school || 'Unidade Municipal'}
                  </div>
              </div>
            </div>
          </div>
          <div className="flex gap-6">
            <button className="p-8 bg-white border border-slate-100 rounded-[2.5rem] text-slate-400 hover:text-blue-600 transition-all shadow-sm hover:shadow-luxury">
                <Share2 className="h-7 w-7" />
            </button>
            <button onClick={() => window.print()} className="btn-secondary !h-24 !px-16 !text-[12px] shadow-luxury">
                <Printer className="h-7 w-7" /> Prontuário PDF
            </button>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-12 mb-20">
          <div className="card-requinte !p-16 flex items-center gap-10 group cursor-default">
            <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-2xl group-hover:scale-110 transition-transform duration-700"><Activity className="h-9 w-9" /></div>
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Assiduidade</p>
              <p className="text-5xl font-black text-slate-900 tracking-tighter">{student.attendance?.presentDays || '98'}%</p>
            </div>
          </div>
          <div className="card-requinte !p-16 flex items-center gap-10 group cursor-default">
            <div className="bg-emerald-500 p-6 rounded-[2rem] text-white shadow-2xl group-hover:scale-110 transition-transform duration-700"><TrendingUp className="h-9 w-9" /></div>
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Média Global</p>
              <p className="text-5xl font-black text-slate-900 tracking-tighter">DE</p>
            </div>
          </div>
          <div className="bg-[#0F172A] p-16 rounded-[4.5rem] shadow-2xl flex items-center gap-10 text-white relative overflow-hidden group cursor-default border border-slate-800">
            <div className="bg-blue-400 p-6 rounded-[2rem] text-slate-900 shadow-2xl group-hover:scale-110 transition-transform duration-700 relative z-10"><Zap className="h-9 w-9" /></div>
            <div className="relative z-10">
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Transp. Escolar</p>
              <p className="text-2xl font-black uppercase tracking-tighter">{student.transportRequest ? 'REQUERIDO' : 'URBANO'}</p>
            </div>
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-blue-600/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8">
                <div className="bg-white rounded-[4.5rem] shadow-luxury border border-slate-100 p-20 relative overflow-hidden group">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-24 gap-12 relative z-10">
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-6 uppercase">
                                <Award className="h-10 w-10 text-blue-600" /> Rendimento BNCC
                            </h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-16">Histórico Acadêmico Consolidado 2025</p>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50 px-8 py-4 rounded-[2rem] border border-slate-100">
                            <Calendar className="h-5 w-5 text-slate-400" />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-ultra">Ciclo Digital V2</span>
                        </div>
                    </div>
                    
                    <div className="space-y-10 relative z-10">
                        {(student.performanceHistory || [
                            { subject: 'LÍNGUA PORTUGUESA', g1: ['DE', 'DB', ''] },
                            { subject: 'MATEMÁTICA', g1: ['DB', 'EP', ''] },
                            { subject: 'CIÊNCIAS', g1: ['DE', 'DE', ''] },
                            { subject: 'ARTES', g1: ['DE', 'DE', ''] }
                        ]).map((row, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row items-center justify-between p-10 bg-slate-50/50 rounded-[3rem] border border-slate-50 hover:bg-white hover:shadow-luxury transition-all duration-700 group/row">
                                <span className="font-black text-slate-900 uppercase tracking-tighter text-3xl group-hover/row:text-blue-600 transition-colors mb-8 md:mb-0">{row.subject}</span>
                                <div className="flex gap-6">
                                    {row.g1?.map((g, i) => (
                                        <div key={i} className={`w-16 h-16 rounded-[1.5rem] flex flex-col items-center justify-center font-black text-base shadow-sm border-2 transition-all duration-500 ${g === 'DE' ? 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-100' : g === 'DB' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100' : 'bg-white text-slate-200 border-slate-50'}`}>
                                            {g || '--'}
                                            {g === 'DE' && <Star className="h-2 w-2 mt-1 fill-current" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-12">
                <div className="bg-white p-16 rounded-[4.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-16 uppercase flex items-center gap-6">
                        <Info className="h-8 w-8 text-blue-500" /> Dados Nominais
                    </h3>
                    <div className="space-y-12">
                        <div className="group-hover:translate-x-2 transition-transform duration-500">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Cadastro de Pessoa Física</p>
                            <p className="text-2xl font-bold text-slate-800 font-mono tracking-tight">{student.cpf}</p>
                        </div>
                        <div className="pt-12 border-t border-slate-100 group-hover:translate-x-2 transition-transform duration-500 delay-75">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-5">Logradouro Nominal SME</p>
                            <div className="flex items-start gap-6">
                                <div className="bg-blue-50 p-4 rounded-[1.5rem] text-blue-600 shadow-sm"><MapPin className="h-6 w-6" /></div>
                                <div>
                                    <p className="text-2xl font-black text-slate-900 uppercase leading-none mb-3 tracking-tighter">{student.address?.neighborhood}</p>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{student.address?.street}, {student.address?.number}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-emerald-600 p-16 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden group border border-emerald-500">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-[2s]"></div>
                    <ShieldCheck className="h-16 w-16 mb-12 opacity-40 group-hover:rotate-12 transition-transform" />
                    <h3 className="text-5xl font-black tracking-tighter mb-8 leading-[0.9] uppercase">Validação <br/> Digital.</h3>
                    <p className="text-emerald-50 text-xl font-medium leading-relaxed mb-16">Este prontuário é um documento oficial autenticado por {MUNICIPALITY_NAME}.</p>
                    <div className="flex justify-between items-center pt-10 border-t border-emerald-500/50">
                        <span className="text-[10px] font-black uppercase tracking-ultra">SME • {MUNICIPALITY_NAME} 2025</span>
                        <ChevronLeft className="h-6 w-6 rotate-180" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};