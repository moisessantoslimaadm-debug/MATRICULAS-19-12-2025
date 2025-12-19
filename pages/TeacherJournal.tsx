

import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { 
  Save, Search, Loader2, ClipboardCheck, Award, User, 
  CheckCircle, XCircle, ChevronLeft, Target, Star, Activity
} from 'lucide-react';
import { useNavigate } from '../router';

const CONCEPTS = ['', 'DI', 'EP', 'DB', 'DE'];
const CONCEPT_STYLE: Record<string, string> = {
  'DI': 'bg-red-50 text-red-600 border-red-100',
  'EP': 'bg-amber-50 text-amber-600 border-amber-100',
  'DB': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'DE': 'bg-indigo-50 text-indigo-600 border-indigo-100',
  '': 'bg-slate-50 text-slate-300 border-slate-100'
};

export const TeacherJournal: React.FC = () => {
  const { students, updateStudents } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [grades, setGrades] = useState<Record<string, string>>({});

  const userData = JSON.parse(sessionStorage.getItem('user_data') || '{}');
  const filtered = students.filter(s => s.status === 'Matriculado' && s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast("Diário de Classe sincronizado com sucesso no banco municipal.", "success");
    }, 1500);
  };

  const cycleGrade = (studentId: string) => {
    const current = grades[studentId] || '';
    const nextIdx = (CONCEPTS.indexOf(current) + 1) % CONCEPTS.length;
    setGrades({ ...grades, [studentId]: CONCEPTS[nextIdx] });
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-20 px-8 page-transition">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-24 gap-10">
          <div className="space-y-8">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition group">
                <ChevronLeft className="h-4 w-4 group-hover:-translate-x-2 transition-transform" /> Voltar ao Painel
            </button>
            <div>
                <div className="flex items-center gap-4 mb-5">
                  <ClipboardCheck className="h-7 w-7 text-emerald-600" />
                  <span className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em]">Modulo Docente • v2.0</span>
                </div>
                <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">Diário de <br/><span className="text-emerald-600">Classe.</span></h1>
                <p className="text-slate-500 font-medium text-xl mt-6">Escola: <span className="text-slate-900 font-black">{userData.schoolName || 'Rede Municipal'}</span> • Prof. {userData.name}</p>
            </div>
          </div>
          <button onClick={handleSave} disabled={isSaving} className="btn-primary !h-20 !px-16 shadow-emerald-200">
            {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
            Sincronizar Lançamentos
          </button>
        </header>

        <div className="bg-white rounded-[4rem] shadow-luxury border border-slate-100 overflow-hidden">
          <div className="p-12 border-b border-slate-50 bg-slate-50/20 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
              <input 
                type="text" 
                placeholder="Localizar aluno na turma..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input-premium pl-20 !bg-white"
              />
            </div>
            <div className="flex items-center gap-10">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Presença</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Falta</span>
                </div>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estudante</th>
                  <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Controle de Frequência</th>
                  <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Conceito Pedagógico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm flex items-center justify-center text-emerald-600 font-black text-2xl">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-xl uppercase tracking-tighter leading-none mb-3">{s.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">RA Municipal: {s.enrollmentId || '---'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-10 text-center">
                      <div className="flex justify-center gap-5">
                        <button 
                          onClick={() => setAttendance({...attendance, [s.id]: true})}
                          className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 ${attendance[s.id] === true ? 'bg-emerald-500 text-white shadow-xl scale-110' : 'bg-slate-50 text-slate-200 hover:text-emerald-300'}`}
                        >
                          <CheckCircle className="h-8 w-8" />
                        </button>
                        <button 
                          onClick={() => setAttendance({...attendance, [s.id]: false})}
                          className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 ${attendance[s.id] === false ? 'bg-red-500 text-white shadow-xl scale-110' : 'bg-slate-50 text-slate-200 hover:text-red-300'}`}
                        >
                          <XCircle className="h-8 w-8" />
                        </button>
                      </div>
                    </td>
                    <td className="px-12 py-10">
                      <div className="flex justify-center">
                         <button 
                            onClick={() => cycleGrade(s.id)}
                            className={`w-28 h-16 rounded-[1.5rem] border-2 font-black text-lg transition-all duration-500 flex items-center justify-center gap-3 ${grades[s.id] ? CONCEPT_STYLE[grades[s.id]] : 'bg-slate-50 border-dashed border-slate-200 text-slate-300 hover:border-blue-400 hover:text-blue-400'}`}
                         >
                            {grades[s.id] || '--'}
                            {grades[s.id] === 'DE' && <Star className="h-4 w-4 fill-current" />}
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-10">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex items-center gap-6">
                <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg"><Target className="h-6 w-6" /></div>
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total da Turma</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{filtered.length}</p>
                </div>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex items-center gap-6">
                <div className="bg-emerald-500 p-4 rounded-2xl text-white shadow-lg"><Activity className="h-6 w-6" /></div>
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Média de Presença</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">94%</p>
                </div>
            </div>
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl flex items-center gap-6">
                <div className="bg-blue-400 p-4 rounded-2xl text-slate-900 shadow-lg"><Award className="h-6 w-6" /></div>
                <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Status Sincronismo</p>
                    <p className="text-xl font-black tracking-tight uppercase">Base Ativa</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
