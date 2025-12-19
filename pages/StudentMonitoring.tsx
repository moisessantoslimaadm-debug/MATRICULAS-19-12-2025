import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from '../router';
import { useData } from '../contexts/DataContext';
import { 
  User, Award, MapPin, Printer, ShieldCheck, Activity, 
  Zap, GraduationCap, TrendingUp, ChevronLeft, Calendar, 
  Info, Share2, Star, BadgeCheck, FileText, ArrowRight
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
      <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-50 rounded-2xl"></div>
          <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-2xl animate-spin"></div>
      </div>
      <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">Sincronizando...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-8 lg:px-16 page-transition">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-20 no-print">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
            <div className="relative group">
                <div className="w-40 h-40 rounded-[2.5rem] bg-white border-[8px] border-white shadow-xl overflow-hidden flex items-center justify-center transition-all duration-700 relative">
                  {student.photo ? <img src={student.photo} className="w-full h-full object-cover" alt={student.name} /> : <User className="h-16 w-16 text-slate-100" />}
                </div>
                <div className="absolute -bottom-3 -right-3 bg-blue-600 p-3 rounded-2xl text-white shadow-lg border-4 border-[#f8fafc]">
                    <ShieldCheck className="h-6 w-6" />
                </div>
            </div>
            
            <div className="space-y-4 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <span className="bg-[#0F172A] text-white px-5 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-md">RA: {student.enrollmentId || '---'}</span>
                <span className={`px-5 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border ${student.status === 'Matriculado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                    {student.status}
                </span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{student.name}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 pt-2">
                  <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                    <GraduationCap className="h-5 w-5 text-blue-600" /> {student.grade || 'Fundamental II'}
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                    <MapPin className="h-5 w-5 text-blue-600" /> {student.school || 'Unidade Municipal'}
                  </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 w-full lg:w-auto">
            <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                <Share2 className="h-6 w-6" />
            </button>
            <button onClick={() => window.print()} className="btn-secondary !h-14 !px-10">
                <Printer className="h-5 w-5" /> Imprimir
            </button>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card-requinte !p-10 flex items-center gap-8 group">
            <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-md group-hover:scale-105 transition-transform"><Activity className="h-6 w-6" /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Frequência</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{student.attendance?.presentDays || '98'}%</p>
            </div>
          </div>
          
          <div className="card-requinte !p-10 flex items-center gap-8 group">
            <div className="bg-emerald-500 p-5 rounded-2xl text-white shadow-md group-hover:scale-105 transition-transform"><TrendingUp className="h-6 w-6" /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Média Global</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">DE</p>
            </div>
          </div>
          
          <div className="bg-[#0F172A] p-10 rounded-[2rem] shadow-lg flex items-center gap-8 text-white relative overflow-hidden group border border-slate-800">
            <div className="bg-blue-400 p-5 rounded-2xl text-slate-900 shadow-md group-hover:scale-105 transition-transform relative z-10"><Zap className="h-6 w-6" /></div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Transporte</p>
              <p className="text-xl font-bold uppercase tracking-tight">{student.transportRequest ? 'REQUERIDO' : 'URBANO'}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8">
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-10">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-6 uppercase">
                                <Award className="h-8 w-8 text-blue-600" /> Rendimento BNCC.
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Histórico Consolidado 2025</p>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">v2.5 Digital</span>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        {(student.performanceHistory || [
                            { subject: 'LÍNGUA PORTUGUESA', g1: ['DE', 'DB', ''] },
                            { subject: 'MATEMÁTICA', g1: ['DB', 'EP', ''] },
                            { subject: 'CIÊNCIAS', g1: ['DE', 'DE', ''] },
                            { subject: 'ARTES', g1: ['DE', 'DE', ''] }
                        ]).map((row, idx) => (
                            <div key={idx} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-50 hover:bg-white hover:shadow-md transition-all group">
                                <div className="flex items-center gap-6">
                                    <FileText className="h-5 w-5 text-slate-300 group-hover:text-blue-600" />
                                    <span className="font-bold text-slate-900 uppercase tracking-tight text-xl">{row.subject}</span>
                                </div>
                                <div className="flex gap-4">
                                    {row.g1?.map((g, i) => (
                                        <div key={i} className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm border ${g === 'DE' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : g === 'DB' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-white text-slate-200 border-slate-100'}`}>
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
                <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group no-print">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-12 uppercase flex items-center gap-4">
                        <Info className="h-6 w-6 text-blue-500" /> Cadastro Nominal.
                    </h3>
                    <div className="space-y-10">
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">CPF</p>
                            <p className="text-xl font-bold text-slate-800 font-mono">{student.cpf}</p>
                        </div>
                        <div className="pt-10 border-t border-slate-100">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-6">Logradouro SME</p>
                            <div className="flex items-start gap-5">
                                <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                                <div>
                                    <p className="text-xl font-bold text-slate-900 uppercase leading-none mb-2 tracking-tight">{student.address?.neighborhood}</p>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">{student.address?.street}, {student.address?.number}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-emerald-600 p-10 rounded-[2rem] text-white shadow-lg relative overflow-hidden border border-emerald-500">
                    <ShieldCheck className="h-12 w-12 mb-8 opacity-40" />
                    <h3 className="text-3xl font-black tracking-tighter mb-6 leading-none uppercase">Validação Síncrona.</h3>
                    <p className="text-emerald-50 text-sm leading-relaxed mb-10">Documento autenticado pela SME Itaberaba.</p>
                    <div className="flex justify-between items-center pt-8 border-t border-emerald-500/50">
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">v2.5</span>
                        <ArrowRight className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};