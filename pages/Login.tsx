
import React, { useState } from 'react';
import { useNavigate, Link } from '../router';
import { useToast } from '../contexts/ToastContext';
import { 
  GraduationCap, Lock, User, Loader2, ShieldCheck, 
  Globe, LogIn, ChevronRight
} from 'lucide-react';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      let role: UserRole | null = null;
      let userData = null;
      const cleanUser = username.toLowerCase().trim();

      if (cleanUser === 'sme' && password === '1234') {
        role = UserRole.ADMIN_SME;
        userData = { id: 'adm-01', name: 'Secretaria SME', role: UserRole.ADMIN_SME, email: 'sme@itaberaba.ba.gov.br' };
      } else if (cleanUser === 'professor' && password === '1234') {
        role = UserRole.TEACHER;
        userData = { id: 'prof-01', name: 'Prof. Carlos Alberto', role: UserRole.TEACHER, schoolName: 'JOÃO XXIII' };
      } else if (cleanUser === 'aluno' && password === '1234') {
        role = UserRole.STUDENT;
        userData = { id: 'std-01', name: 'Arthur Silva', role: UserRole.STUDENT, studentId: 'std-0' };
      }

      if (role && userData) {
        sessionStorage.setItem('admin_auth', 'true');
        sessionStorage.setItem('user_role', role);
        sessionStorage.setItem('user_data', JSON.stringify(userData));
        addToast(`Acesso autorizado: ${userData.name}`, 'success');
        
        if (role === UserRole.TEACHER) navigate('/journal');
        else if (role === UserRole.STUDENT) navigate(`/student/monitoring?id=${userData.studentId}`);
        else navigate('/dashboard');
      } else {
        addToast('Usuário ou senha inválidos.', 'error');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-[#fcfdfe] page-transition items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white rounded-[4rem] shadow-luxury overflow-hidden border border-slate-100 flex flex-col md:flex-row">
        <div className="md:w-[45%] bg-[#0F172A] p-16 text-white relative flex flex-col justify-between overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-16">
                    <div className="bg-blue-600 p-3 rounded-2xl shadow-xl">
                        <GraduationCap className="h-7 w-7" />
                    </div>
                    <span className="font-black text-2xl tracking-tighter uppercase">SME <span className="text-blue-500">Digital</span></span>
                </div>
                <h2 className="text-6xl font-black mb-8 tracking-tighter uppercase leading-[0.9]">Portal <br/><span className="text-blue-500">Unificado.</span></h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-12 font-medium">Acesso exclusivo para servidores da rede municipal, docentes e responsáveis.</p>
                
                <div className="space-y-6">
                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div> Criptografia Militar
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div> Sincronização INEP
                    </div>
                </div>
            </div>
            <div className="absolute -bottom-24 -right-24 h-80 w-80 bg-blue-600/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="md:w-[55%] p-20 bg-white flex flex-col justify-center">
          <div className="mb-12">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Autenticação.</h3>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">Insira suas credenciais de rede</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ID de Usuário / CPF</label>
                <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <input 
                        type="text" required value={username} onChange={e => setUsername(e.target.value)}
                        placeholder="sme, professor ou aluno"
                        className="input-premium pl-16"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha de Acesso</label>
                <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <input 
                        type="password" required value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input-premium pl-16"
                    />
                </div>
            </div>

            <button 
                type="submit" disabled={isLoading}
                className="btn-primary w-full h-20 !text-[12px]"
            >
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Acessar Plataforma <ChevronRight className="h-5 w-5" /></>}
            </button>
          </form>
          
          <div className="mt-16 pt-10 border-t border-slate-50 flex justify-between">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">v2.5 Gov Itaberaba</span>
              <Link to="/status" className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] hover:underline">Suporte Técnico</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
