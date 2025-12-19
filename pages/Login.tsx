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
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-[#fcfdfe] page-transition items-center justify-center p-6 lg:p-12">
      <div className="max-w-6xl w-full bg-white rounded-[4.5rem] shadow-luxury overflow-hidden border border-slate-100 flex flex-col lg:flex-row min-h-[750px]">
        <div className="lg:w-[45%] bg-[#0F172A] p-20 text-white relative flex flex-col justify-between overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-6 mb-24 group">
                    <div className="bg-blue-600 p-4 rounded-[1.8rem] shadow-2xl group-hover:rotate-12 transition-transform duration-700">
                        <GraduationCap className="h-9 w-9" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-3xl tracking-tighter uppercase leading-none">SME <span className="text-blue-500">Digital</span></span>
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em] mt-2">v2.5 High Security</span>
                    </div>
                </div>
                <h2 className="text-7xl font-black mb-12 tracking-tighter uppercase leading-[0.85] text-display">Portal <br/><span className="text-blue-600">Unificado.</span></h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-16 font-medium max-w-sm">Acesso restrito e auditável para a rede de ensino de Itaberaba.</p>
                
                <div className="space-y-8">
                    <div className="flex items-center gap-6 group cursor-default">
                        <div className="w-12 h-12 rounded-2xl bg-blue-900/50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                            <ShieldCheck className="h-6 w-6 text-blue-400" />
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-ultra">Criptografia Militar Síncrona</span>
                    </div>
                    <div className="flex items-center gap-6 group cursor-default">
                        <div className="w-12 h-12 rounded-2xl bg-blue-900/50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                            <Zap className="h-6 w-6 text-blue-400" />
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-ultra">Integração Direta INEP 2025</span>
                    </div>
                </div>
            </div>
            <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-luxury-float"></div>
            <div className="relative z-10 flex items-center gap-4 text-slate-500">
                <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest">© 2025 Município Digital</span>
            </div>
        </div>

        <div className="lg:w-[55%] p-24 bg-white flex flex-col justify-center relative overflow-hidden">
          <div className="mb-20 relative z-10">
            <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">Autenticação.</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.6em]">Credenciais de Rede Municipal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-12 relative z-10">
            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">ID de Usuário / CPF</label>
                <div className="relative group">
                    <User className="absolute left-8 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                        type="text" required value={username} onChange={e => setUsername(e.target.value)}
                        placeholder="sme, professor ou aluno"
                        className="input-premium pl-20"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Senha de Segurança</label>
                <div className="relative group">
                    <Lock className="absolute left-8 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                        type="password" required value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input-premium pl-20"
                    />
                </div>
            </div>

            <button 
                type="submit" disabled={isLoading}
                className="btn-primary w-full h-24 !text-[14px] shadow-blue-200"
            >
                {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : <>Validar Acesso <ChevronRight className="h-6 w-6" /></>}
            </button>
          </form>
          
          <div className="mt-20 pt-12 border-t border-slate-50 flex justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-ultra">v2.5 Gov Itaberaba</span>
              <Link to="/status" className="text-[10px] font-black text-blue-500 uppercase tracking-ultra hover:underline">Suporte Síncrono</Link>
          </div>
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full blur-[100px] opacity-20 -z-0"></div>
        </div>
      </div>
    </div>
  );
};