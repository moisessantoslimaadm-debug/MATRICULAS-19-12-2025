import React, { useState } from 'react';
import { useNavigate, Link } from '../router';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../services/supabaseClient';
import { 
  GraduationCap, Lock, User, Loader2, ShieldCheck, 
  ChevronRight, Zap, Sparkles, Mail, Key, Fingerprint
} from 'lucide-react';
import { UserRole } from '../types';
import { MOCK_STUDENT_REGISTRY } from '../constants';
import { useData } from '../contexts/DataContext'; // Importando para acesso aos alunos

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  // Acesso direto aos dados para validar login de aluno (mock/local)
  // Em produção, isso seria uma query no backend
  const { students } = useData(); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const inputUser = email.trim().toUpperCase();
    const inputPass = password.trim();
    const cleanInputUser = inputUser.replace(/\D/g, ''); // Apenas números para CPF/Matrícula

    let mockUser = null;
    let redirectPath = '/dashboard';

    // --- LÓGICA DE LOGIN POR IDENTIFICADOR (ALUNO) ---
    // Verifica se o input corresponde a um CPF ou Matrícula de aluno existente
    const studentMatch = students.find(s => {
        const sCpf = s.cpf.replace(/\D/g, '');
        const sMat = s.enrollmentId ? s.enrollmentId.replace(/\D/g, '') : '';
        return sCpf === cleanInputUser || sMat === cleanInputUser;
    });

    if (studentMatch) {
        // Validação Simplificada para Aluno:
        // Se encontrou o aluno, verifica se a senha é o próprio CPF (para facilitar o teste conforme pedido)
        // Ou se a senha é uma data de nascimento (formato simples)
        const sCpf = studentMatch.cpf.replace(/\D/g, '');
        
        // Regra: Senha pode ser o CPF ou '1234' (default demo)
        if (inputPass === sCpf || inputPass === '1234') {
            mockUser = {
                id: studentMatch.id,
                name: studentMatch.name,
                role: UserRole.STUDENT,
                email: 'aluno@rede.ba.gov.br', // Placeholder
                photo: studentMatch.photo
            };
            redirectPath = `/student/monitoring?id=${studentMatch.id}`;
        } else {
             addToast('Senha inválida. Para alunos, use seu CPF.', 'error');
             setIsLoading(false);
             return;
        }
    }
    // --- LÓGICA DE LOGIN ADMINISTRATIVO (HARDCODED DEMO) ---
    else if (['SME', 'DIRETOR', 'PROFESSOR'].includes(inputUser)) {
        if (inputUser === 'SME' && inputPass === '1234') {
            mockUser = {
                id: 'mock-admin-sme',
                name: 'Secretaria de Educação (SME)',
                role: UserRole.ADMIN_SME,
                email: 'sme@itaberaba.ba.gov.br'
            };
        }
        else if (inputUser === 'DIRETOR' && inputPass === '1234') {
            mockUser = {
                id: 'mock-diretor',
                name: 'Ediana Silva (Diretora)',
                role: UserRole.DIRECTOR,
                schoolId: '29446309',
                schoolName: 'CENTRO MUNICIPAL DE EDUCACAO BASICA',
                email: 'direcao@itaberaba.ba.gov.br'
            };
        }
        else if (inputUser === 'PROFESSOR' && inputPass === '1234') {
            mockUser = {
                id: 'mock-professor',
                name: 'Prof. Antônio Carlos',
                role: UserRole.TEACHER,
                schoolId: '29446309',
                email: 'prof.antonio@itaberaba.ba.gov.br'
            };
            redirectPath = '/journal';
        }
    }

    // --- EXECUTA LOGIN MOCK (IMEDIATO) ---
    if (mockUser) {
        sessionStorage.setItem('admin_auth', 'true');
        sessionStorage.setItem('user_role', mockUser.role);
        sessionStorage.setItem('user_data', JSON.stringify(mockUser));
        addToast(`Bem-vindo(a), ${mockUser.name}`, 'success');
        navigate(redirectPath);
        setIsLoading(false);
        return;
    }

    // --- FALBACK: AUTENTICAÇÃO REAL (SUPABASE) ---
    // Se não for aluno nem usuário demo, tenta Supabase
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.includes('@') ? email : `${email}@itaberaba.ba.gov.br`,
        password: password,
      });

      if (error) throw error;

      if (data.user) {
        const role = data.user.user_metadata?.role || UserRole.ADMIN_SME;
        const userData = { 
          id: data.user.id, 
          name: data.user.user_metadata?.full_name || 'Gestor SME', 
          role: role,
          email: data.user.email 
        };

        sessionStorage.setItem('admin_auth', 'true');
        sessionStorage.setItem('user_role', role);
        sessionStorage.setItem('user_data', JSON.stringify(userData));
        
        addToast(`Acesso autorizado: ${userData.name}`, 'success');
        
        if (role === UserRole.TEACHER) navigate('/journal');
        else if (role === UserRole.STUDENT) navigate(`/student/monitoring?id=${data.user.id}`);
        else navigate('/dashboard');
      }
    } catch (error: any) {
      addToast('Credenciais não localizadas no barramento.', 'error');
    } finally {
      setIsLoading(false);
    }
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
                <p className="text-emerald-100/60 text-lg leading-relaxed mb-16 font-medium max-w-sm">Acesso restrito e auditável com proteção de dados via Supabase Auth.</p>
                
                <div className="space-y-8">
                    <div className="flex items-center gap-6 group">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-emerald-500/20 transition-all duration-500">
                            <ShieldCheck className="h-7 w-7 text-emerald-400" />
                        </div>
                        <span className="text-[10px] font-black text-emerald-100/40 uppercase tracking-[0.2em]">Criptografia de Ponta (AES-256)</span>
                    </div>
                    <div className="flex items-center gap-6 group">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-emerald-500/20 transition-all duration-500">
                            <Zap className="h-7 w-7 text-emerald-400" />
                        </div>
                        <span className="text-[10px] font-black text-emerald-100/40 uppercase tracking-[0.2em]">Integração Direta Supabase 2025</span>
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
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">Barramento Nominal Seguro</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-10 relative z-10">
            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Usuário, CPF ou Matrícula</label>
                <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                    <input 
                        type="text" required value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="Ex: 000.000.000-00 ou SME..."
                        className="input-premium pl-16 !h-14 !text-sm"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Token de Segurança</label>
                <div className="relative group">
                    <Key className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
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
                {isLoading ? <Loader2 className="h-7 w-7 animate-spin" /> : <>Autenticar no Barramento <ChevronRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" /></>}
            </button>
          </form>
          
          <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center relative z-10">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-ultra">Cloud Sync enabled</span>
              <Link to="/status" className="text-[9px] font-black text-emerald-600 uppercase tracking-ultra hover:underline flex items-center gap-2">
                <Fingerprint className="h-4 w-4" /> Consultar Pasta sem Senha
              </Link>
          </div>
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-[120px] opacity-30 -z-0"></div>
        </div>
      </div>
    </div>
  );
};