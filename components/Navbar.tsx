import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from '../router';
import { GraduationCap, Menu, X, CloudCheck, CloudOff, LogOut, ShieldCheck } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isOffline, refreshData } = useData();
  
  const [role, setRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const savedRole = sessionStorage.getItem('user_role') as UserRole;
    const userData = JSON.parse(sessionStorage.getItem('user_data') || '{}');
    setRole(savedRole);
    setUserName(userData.name || '');
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const isActive = (path: string) => 
    location.pathname === path 
      ? 'text-blue-600 font-black bg-blue-50/80 px-8 py-4 rounded-[1.8rem] shadow-sm border border-blue-100/50' 
      : 'text-slate-400 hover:text-slate-900 font-black px-8 py-4 hover:bg-slate-50/50 rounded-[1.8rem] transition-all duration-500 text-[10px] uppercase tracking-widest';

  return (
    <nav className="glass-premium sticky top-6 z-[100] px-10 py-5 mx-8 rounded-[3rem] shadow-luxury border border-white/80 transition-all duration-700">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
        <div className="flex items-center gap-16">
          <Link to="/" className="flex items-center gap-6 group">
            <div className="bg-slate-900 p-4 rounded-[1.5rem] group-hover:rotate-[15deg] transition-all duration-700 shadow-2xl shadow-slate-200/50 active:scale-90 border border-slate-800">
              <GraduationCap className="h-8 w-8 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl text-slate-900 tracking-tighter uppercase leading-none">
                SME <span className="text-blue-600">Digital</span>
              </span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Itaberaba • Bahia</span>
            </div>
          </Link>

          <div className="hidden xl:flex items-center gap-4">
            {(role === UserRole.ADMIN_SME || role === UserRole.DIRECTOR) && (
              <>
                <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
                <Link to="/admin/map" className={isActive('/admin/map')}>Geoprocess</Link>
                <Link to="/admin/data" className={isActive('/admin/data')}>Nominal</Link>
                <Link to="/reports" className={isActive('/reports')}>Relatórios</Link>
              </>
            )}
            {!role && (
                <>
                <Link to="/" className={isActive('/')}>Início</Link>
                <Link to="/schools" className={isActive('/schools')}>Rede Escolar</Link>
                <Link to="/registration" className={isActive('/registration')}>Matrícula</Link>
                <Link to="/status" className={isActive('/status')}>Protocolo</Link>
                </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="hidden md:flex items-center gap-4">
            {isOffline ? (
              <button onClick={() => refreshData()} className="flex items-center gap-3 bg-red-50 px-6 py-3 rounded-full border border-red-100 text-red-600 text-[9px] font-black uppercase tracking-widest animate-pulse">
                <CloudOff className="h-3 w-3" /> Offline
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-full border border-blue-100 text-blue-600 text-[9px] font-black uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4" /> Rede Segura
              </div>
            )}
          </div>

          <div className="h-10 w-px bg-slate-200/50 hidden md:block"></div>

          {role ? (
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-end hidden sm:flex text-right">
                <span className="text-sm font-black text-slate-900 leading-none uppercase tracking-tight">{userName}</span>
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mt-2">Núcleo Administrativo</span>
              </div>
              <div className="group relative">
                <div className="w-14 h-14 rounded-[1.6rem] bg-slate-900 flex items-center justify-center text-blue-400 font-black text-xl shadow-2xl cursor-pointer group-hover:scale-110 transition-all duration-700 border border-slate-800">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute top-full right-0 mt-6 w-80 bg-white rounded-[3rem] shadow-luxury border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-700 p-6 z-[200] transform origin-top-right scale-95 group-hover:scale-100">
                    <div className="p-6 border-b border-slate-50 mb-4 bg-slate-50/50 rounded-[2.2rem]">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Identidade Digital</p>
                        <p className="text-sm font-black text-slate-900 truncate uppercase">{userName}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-between gap-4 px-8 py-5 text-red-500 hover:bg-red-50 rounded-[2rem] transition-colors font-black text-[10px] uppercase tracking-[0.3em] group/btn">
                        <span>Encerrar Sessão</span>
                        <LogOut className="h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                    </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 active:scale-95 border border-slate-800">
                Acesso Restrito
            </Link>
          )}

          <button onClick={() => setIsOpen(!isOpen)} className="xl:hidden p-4 bg-slate-50 rounded-[1.5rem] text-slate-400 hover:text-blue-600 transition-colors">
            {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="xl:hidden absolute top-[calc(100%+1.5rem)] left-0 right-0 bg-white rounded-[3.5rem] shadow-luxury border border-slate-100 p-10 animate-in slide-in-from-top-6 duration-700">
             <div className="flex flex-col gap-4">
                 <Link onClick={()=>setIsOpen(false)} to="/" className="px-10 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">Início</Link>
                 <Link onClick={()=>setIsOpen(false)} to="/schools" className="px-10 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">Rede Escolar</Link>
                 <Link onClick={()=>setIsOpen(false)} to="/registration" className="px-10 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">Solicitar Matrícula</Link>
                 <Link onClick={()=>setIsOpen(false)} to="/status" className="px-10 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">Status do Aluno</Link>
                 {role && <Link onClick={()=>setIsOpen(false)} to="/dashboard" className="px-10 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">Dashboard Admin</Link>}
             </div>
        </div>
      )}
    </nav>
  );
};