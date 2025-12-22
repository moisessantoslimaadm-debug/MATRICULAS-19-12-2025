import React, { useState } from 'react';
import { useNavigate, Link } from '../router';
import { useToast } from '../contexts/ToastContext';
import { 
  GraduationCap, Lock, User, Loader2, ShieldCheck, 
  Globe, LogIn, ChevronRight, Zap, Sparkles
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
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] page-transition items-center justify-center p-6">
      <div className="max-w-6xl w-full bg-white rounded-[4rem] shadow-deep overflow-hidden border border-slate-200 flex flex-col lg:flex-row min-h-[700px]">
        <div className="lg:w-[45%] bg-[#064e3b] p-16 text-white relative flex flex-col justify-between overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-5 mb-20 group">
                    <div className="bg-emerald-500 p-4 rounded-[1.8rem] shadow-2xl group-hover:rotate-12 transition-transform duration-700 border border-white/20">
                        <GraduationCap className="h-9 w-9" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-3xl tracking-tighter uppercase leading-none">SME <span className="text-emerald-400">Digital</span></span>
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.4em] mt-2">v2.5 High Security</span>
                    </div>
                </div>
                <h2 className="text-7xl font-black mb-10 tracking-tighter uppercase leading-[0.85] text-display">Portal <br/><span className="text-emerald-400">Síncrono.</span></h2>
                <p className="text-emerald-100/60 text-lg leading-relaxed mb-16 font-medium max-w-sm">Acesso restrito e auditável para a rede nominal de ensino de Itaberaba.</p>
                
                <div className="space-y-8">
                    <div className="flex items-center gap-6 group">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-emerald-500/20 transition-all duration-500">
                            <ShieldCheck className="h-7 w-7 text-emerald-400" />
                        </div>
                        <span className="text-[10px] font-black text-emerald-100/40 uppercase tracking-[0.2em]">Criptografia Militar Síncrona</span>
                    </div>
                    <div className="flex items-center gap-6 group">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-emerald-500/20 transition-all duration-500">
                            <Zap className="h-7 w-7 text-emerald-400" />
                        </div>
                        <span className="text-[10px] font-black text-emerald-100/40 uppercase tracking-[0.2em]">Integração Direta INEP 2025</span>
                    </div>
                </div>
            </div>
            <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] bg-emerald-500/10 rounded-full blur-[100px] animate-luxury-float"></div>
            <div className="relative z-10 flex items-center gap-4 text-emerald-100/30">
                <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest">© 2025 Município Digital • SME ITABERABA</span>
            </div>
        </div>

        <div className="lg:w-[55%] p-20 bg-white flex flex-col justify-center relative overflow-hidden">
          <div className="mb-16 relative z-10">
            <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">Acesso.</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">Credenciais de Rede Nominal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-10 relative z-10">
            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Identificação de Usuário</label>
                <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                    <input 
                        type="text" required value={username} onChange={e => setUsername(e.target.value)}
                        placeholder="sme, professor ou aluno"
                        className="input-premium pl-16 !h-14 !text-sm"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Token de Segurança</label>
                <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                    <input 
                        type="password" required value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input-premium pl-16 !h-14 !text-sm"
                    />
                </div>
            </div>

            <button 
                type="submit" disabled={isLoading}
                className="btn-primary w-full h-20 !text-[12px] shadow-2xl shadow-emerald-900/20 active:scale-95 group"
            >
                {isLoading ? <Loader2 className="h-7 w-7 animate-spin" /> : <>Autenticar Módulo <ChevronRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" /></>}
            </button>
          </form>
          
          <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center relative z-10">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-ultra">v2.5 Itaberaba OS</span>
              <Link to="/status" className="text-[9px] font-black text-emerald-600 uppercase tracking-ultra hover:underline">Suporte Síncrono</Link>
          </div>
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-[120px] opacity-30 -z-0"></div>
        </div>
      </div>
    </div>
  );
};