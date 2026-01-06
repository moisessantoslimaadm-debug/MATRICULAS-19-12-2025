import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from '../router';
import { CheckCircle, Search, UserCheck, AlertCircle, Clock, ShieldCheck, Zap, Printer, ArrowRight, FolderOpen, Fingerprint, Copy, Check } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { RegistryStudent } from '../types';

const StatusTimeline = ({ status }: { status: string }) => {
    const steps = [
        { label: 'Protocolado', match: ['Em Análise', 'Pendente', 'Matriculado'] },
        { label: 'Em Análise', match: ['Em Análise', 'Pendente', 'Matriculado'] },
        { label: 'Documentação', match: ['Pendente', 'Matriculado'] },
        { label: 'Matriculado', match: ['Matriculado'] }
    ];

    const currentStepIndex = steps.findIndex(s => s.match.includes(status) && s.label === status) !== -1 
        ? steps.findIndex(s => s.label === status) 
        : (status === 'Matriculado' ? 3 : status === 'Pendente' ? 2 : 1);

    return (
        <div className="flex justify-between items-center w-full max-w-lg mx-auto mb-10 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10"></div>
            <div className="absolute top-1/2 left-0 h-1 bg-emerald-500 -z-10 transition-all duration-1000" style={{ width: `${(currentStepIndex / 3) * 100}%` }}></div>
            
            {steps.map((step, i) => {
                const isCompleted = i <= currentStepIndex;
                return (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-300'}`}>
                            {isCompleted ? <Check className="h-4 w-4" /> : <div className="w-2 h-2 bg-slate-300 rounded-full"></div>}
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-widest ${isCompleted ? 'text-emerald-700' : 'text-slate-300'}`}>{step.label}</span>
                    </div>
                );
            })}
        </div>
    );
};

export const Status: React.FC = () => {
  const { students } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const enrollmentId = searchParams.get('id'); // Obtém o ID real da URL
  
  const [studentInput, setStudentInput] = useState('');
  const [searchResults, setSearchResults] = useState<RegistryStudent[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentInput.trim()) return;
    
    const term = studentInput.toLowerCase().trim();
    // Termo limpo apenas com números para busca de CPF/INEP
    const numericTerm = term.replace(/\D/g, '');
    // Termo alfanumérico limpo para busca de Matrícula (ex: MAT123)
    const alphaNumericTerm = term.replace(/[^a-z0-9]/g, '');

    const found = students.filter(s => {
        // 1. Busca por Nome (Prioridade visual - contém o termo)
        if (s.name.toLowerCase().includes(term)) return true;

        // 2. Busca Numérica Estrita (CPF, INEP)
        // Requer pelo menos 3 dígitos para evitar falso positivo excessivo com números pequenos
        if (numericTerm.length >= 3) {
            const sCpf = (s.cpf || '').replace(/\D/g, '');
            const sInep = (s.inepId || '').toString();
            
            if (sCpf.includes(numericTerm)) return true;
            if (sInep.includes(numericTerm)) return true;
        }

        // 3. Busca por Matrícula (Flexível - suporta com ou sem traços/prefixos)
        if (alphaNumericTerm.length >= 3) {
            const sEnrollment = (s.enrollmentId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            if (sEnrollment.includes(alphaNumericTerm)) return true;
        }

        return false;
    });

    setSearchResults(found);
    setHasSearched(true);
  };

  const handleCopyId = () => {
    if (enrollmentId) {
        navigator.clipboard.writeText(enrollmentId);
        addToast("Protocolo copiado para a área de transferência.", "success");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 page-transition">
        <div className="bg-white rounded-[4rem] shadow-2xl border border-emerald-100 p-16 max-w-xl w-full text-center">
          <div className="w-32 h-32 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-xl shadow-emerald-50 animate-in zoom-in duration-500">
            <CheckCircle className="h-16 w-16 text-emerald-600" />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none mb-6">Protocolo <br/><span className="text-emerald-600">Transmitido.</span></h2>
          <p className="text-slate-500 font-medium text-lg mb-12 leading-relaxed">Seu registro nominal foi enviado à rede municipal de ensino.</p>
          
          <div className="bg-slate-900 py-10 px-10 rounded-[3rem] mb-12 border border-slate-800 relative group overflow-hidden">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em] mb-3 relative z-10">Chave de Acompanhamento</p>
            <div className="flex items-center justify-center gap-4 relative z-10">
                <span className="text-4xl font-black text-emerald-400 tracking-tighter">{enrollmentId || 'PROCESSANDO...'}</span>
                <button 
                    onClick={handleCopyId} 
                    className="p-2 bg-white/10 rounded-xl hover:bg-white/20 text-emerald-400 transition-colors"
                    title="Copiar Protocolo"
                >
                    <Copy className="h-5 w-5" />
                </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
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
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-slate-900 rounded-full mb-6">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[9px] font-bold text-white uppercase tracking-widest">Portal do Aluno</span>
            </div>
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-none mb-6 uppercase">Acesso <span className="text-emerald-600">Nominal.</span></h1>
            <p className="text-slate-500 font-medium text-lg">Informe seus dados para acessar sua Pasta Digital.</p>
        </header>

        <form onSubmit={handleSearch} className="mb-16 relative max-w-2xl mx-auto">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
                <Fingerprint className="h-6 w-6" />
            </div>
            <input 
                type="text" 
                placeholder="Digite seu CPF, Nº de Matrícula, INEP ou Nome..." 
                value={studentInput} 
                onChange={e => setStudentInput(e.target.value)}
                className="w-full pl-16 pr-36 py-6 bg-white border border-slate-200 rounded-[2rem] shadow-luxury focus:ring-[6px] focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 text-lg placeholder:text-slate-300 placeholder:font-normal"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-8 py-3.5 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95">
                Localizar
            </button>
        </form>

        <div className="space-y-6">
            {searchResults.map(s => (
                <div key={s.id} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col gap-8 group hover:shadow-deep hover:border-emerald-100 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-50 transition-colors"></div>
                    
                    <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10 text-center md:text-left">
                        <div className="w-24 h-24 rounded-[2rem] bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                            {s.photo ? <img src={s.photo} className="w-full h-full object-cover" /> : <UserCheck className="h-10 w-10 text-slate-200" />}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none mb-3">{s.name}</h3>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                    RA: {s.enrollmentId || '---'}
                                </p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                    CPF: {s.cpf}
                                </p>
                            </div>
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-4 flex items-center justify-center md:justify-start gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                {s.school || 'Unidade em Alocação'}
                            </p>
                        </div>
                        
                        <div className="flex flex-col items-center md:items-end gap-4 relative z-10 w-full md:w-auto ml-auto">
                            <span className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${s.status === 'Matriculado' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                Situação: {s.status}
                            </span>
                            <button 
                                onClick={() => navigate(`/student/monitoring?id=${s.id}`)}
                                className="btn-primary !h-14 !px-8 !text-[10px] !bg-slate-900 hover:!bg-emerald-600 w-full md:w-auto shadow-xl"
                            >
                                <FolderOpen className="h-4 w-4 mr-2" /> Abrir Pasta do Aluno
                            </button>
                        </div>
                    </div>

                    {/* Linha do Tempo Visual */}
                    <div className="border-t border-slate-50 pt-8 mt-2">
                        <StatusTimeline status={s.status} />
                    </div>
                </div>
            ))}
            
            {hasSearched && searchResults.length === 0 && (
                <div className="py-24 text-center border-4 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30">
                    <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-6" />
                    <p className="text-slate-400 font-bold text-lg uppercase tracking-widest">Identificação Nominal Não Localizada</p>
                    <p className="text-slate-400 text-xs mt-2">Verifique o CPF, Matrícula ou Nome digitado.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};