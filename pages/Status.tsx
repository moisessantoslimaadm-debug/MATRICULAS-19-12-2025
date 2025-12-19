import React, { useState } from 'react';
import { useSearchParams, Link } from '../router';
import { CheckCircle, Search, UserCheck, AlertCircle, Clock, ShieldCheck, Zap, Printer, ArrowRight } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { RegistryStudent } from '../types';

export const Status: React.FC = () => {
  const { students } = useData();
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  
  const [studentInput, setStudentInput] = useState('');
  const [searchResults, setSearchResults] = useState<RegistryStudent[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentInput.trim()) return;
    const term = studentInput.toLowerCase().trim();
    const found = students.filter(s => s.name.toLowerCase().includes(term) || (s.enrollmentId && s.enrollmentId.toLowerCase().includes(term)));
    setSearchResults(found);
    setHasSearched(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 page-transition">
        <div className="bg-white rounded-[4rem] shadow-2xl border border-emerald-100 p-16 max-w-xl w-full text-center">
          <div className="w-32 h-32 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-xl shadow-emerald-50">
            <CheckCircle className="h-16 w-16 text-emerald-600" />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none mb-6">Protocolo <br/><span className="text-emerald-600">Transmitido.</span></h2>
          <p className="text-slate-500 font-medium text-lg mb-12 leading-relaxed">Seu registro nominal foi enviado à rede municipal de ensino.</p>
          <div className="bg-slate-900 py-10 px-10 rounded-[3rem] mb-12 border border-slate-800">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em] mb-3">Chave de Acompanhamento</p>
            <span className="text-4xl font-black text-emerald-400 tracking-tighter">MAT-{Math.floor(Math.random() * 900000) + 100000}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <button onClick={() => window.print()} className="btn-secondary"><Printer className="h-4 w-4" /> Imprimir</button>
             <Link to="/" className="btn-primary !bg-emerald-600">Início <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-20 px-6 page-transition">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-16">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-slate-900 rounded-full mb-6">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[9px] font-bold text-white uppercase tracking-widest">Consulta Nominal Segura</span>
            </div>
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-none mb-6 uppercase">Status do <span className="text-emerald-600">Aluno.</span></h1>
            <p className="text-slate-500 font-medium text-lg">Acompanhe a alocação e situação de vaga.</p>
        </header>

        <form onSubmit={handleSearch} className="mb-16 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
            <input 
                type="text" placeholder="Protocolo ou nome do aluno..." value={studentInput} onChange={e => setStudentInput(e.target.value)}
                className="w-full pl-16 pr-32 py-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-emerald-50 focus:border-emerald-600 outline-none transition-all font-bold text-slate-700 text-lg"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-8 py-3.5 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all">Consultar</button>
        </form>

        <div className="space-y-6">
            {searchResults.map(s => (
                <div key={s.id} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 group hover:shadow-luxury transition-all duration-500">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 rounded-2xl bg-slate-50 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                            {s.photo ? <img src={s.photo} className="w-full h-full object-cover" /> : <UserCheck className="h-10 w-10 text-slate-200" />}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none mb-3">{s.name}</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
                                {s.enrollmentId || 'PENDENTE'} <span className="w-1 h-1 rounded-full bg-slate-200"></span> {s.school || 'Geoprocessamento Ativo'}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-4">
                        <span className={`px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest border shadow-sm ${s.status === 'Matriculado' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{s.status}</span>
                        <div className="flex items-center gap-2 opacity-40">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Atualizado Hoje</span>
                        </div>
                    </div>
                </div>
            ))}
            
            {hasSearched && searchResults.length === 0 && (
                <div className="py-24 text-center border-4 border-dashed border-slate-100 rounded-[3rem]">
                    <AlertCircle className="h-12 w-12 text-slate-200 mx-auto mb-6" />
                    <p className="text-slate-300 font-bold text-lg uppercase tracking-widest">Protocolo não localizado</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};