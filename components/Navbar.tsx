import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from '../router';
import { 
  GraduationCap, Menu, X, CloudOff, LogOut, 
  Building, Map, FileText, LayoutDashboard, 
  Users, BarChart3, Database
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isOffline } = useData();
  
  const [role, setRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const savedRole = sessionStorage.getItem('user_role') as UserRole;
    const userData = JSON.parse(sessionStorage.getItem('user_data') || '{}');
    setRole(savedRole);
    setUserName(userData.name || '');
    setIsOpen(false);
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (role) {
        if (role === UserRole.TEACHER) navigate('/journal');
        else if (role === UserRole.STUDENT) navigate(`/student/monitoring?id=${JSON.parse(sessionStorage.getItem('user_data') || '{}').id}`);
        else navigate('/dashboard');
    } else {
        navigate('/');
    }
  };

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    // Verifica correspondência exata ou parcial para sub-rotas
    const isActiveLink = currentPath === path || (path !== '/' && currentPath.startsWith(path));

    return isActiveLink
      ? 'text-emerald-700 font-black border-b-2 border-emerald-600 px-3 py-4 text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all bg-emerald-50/50 rounded-t-lg' 
      : 'text-slate-500 hover:text-emerald-700 font-bold px-3 py-4 transition-all text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 rounded-lg';
  };

  const MobileLink = ({ to, children, icon: Icon }: any) => (
    <Link 
      to={to} 
      className={`flex items-center gap-4 p-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${location.pathname.startsWith(to) ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'text-slate-500 hover:bg-slate-50'}`}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {children}
    </Link>
  );

  return (
    <>
      <nav className="sticky top-0 z-[100] px-6 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm transition-all duration-300">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            {/* Toggle Mobile */}
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <a href="#" onClick={handleLogoClick} className="flex items-center gap-3 group">
              <div className="bg-[#064e3b] p-2.5 rounded-xl text-white shadow-lg shadow-emerald-900/20 group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-base text-slate-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
                  SME <span className="text-emerald-600">Digital</span>
                </span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Governo de Itaberaba</span>
              </div>
            </a>

            {/* Desktop Menu - Navegação Direta e Clara */}
            <div className="hidden lg:flex items-center gap-2 ml-4">
              {(role === UserRole.ADMIN_SME || role === UserRole.DIRECTOR) ? (
                <>
                  <Link to="/dashboard" className={isActive('/dashboard')}>
                    <LayoutDashboard className="h-4 w-4" /> Painel
                  </Link>
                  <Link to="/admin/escolas" className={isActive('/admin/escolas')}>
                    <Building className="h-4 w-4" /> Gestão Escolar
                  </Link>
                  <Link to="/admin/map" className={isActive('/admin/map')}>
                    <Map className="h-4 w-4" /> Mapa Geo
                  </Link>
                  <Link to="/admin/data" className={isActive('/admin/data')}>
                    <Database className="h-4 w-4" /> Censo Nominal
                  </Link>
                  <Link to="/reports" className={isActive('/reports')}>
                    <BarChart3 className="h-4 w-4" /> Relatórios BI
                  </Link>
                </>
              ) : !role ? (
                  <>
                  <Link to="/" className={isActive('/')}>Início</Link>
                  <Link to="/schools" className={isActive('/schools')}>Unidades</Link>
                  <Link to="/registration" className={isActive('/registration')}>Matrícula</Link>
                  <Link to="/status" className={isActive('/status')}>Protocolo</Link>
                  </>
              ) : null}
              {/* Professores e Alunos têm navegação simplificada ou focada */}
            </div>
          </div>

          <div className="flex items-center gap-6">
            {isOffline && (
              <div className="hidden sm:flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 text-red-600 text-[9px] font-black uppercase tracking-wide animate-pulse">
                <CloudOff className="h-3 w-3" /> Offline Mode
              </div>
            )}

            {role ? (
              <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <span className="text-[11px] font-bold text-slate-900 block leading-none">{userName}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{role}</span>
                </div>
                <button onClick={handleLogout} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100" title="Sair do Sistema">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary !h-12 !px-6 !text-[10px] !rounded-xl !bg-slate-900 shadow-lg hover:!bg-emerald-600">
                  Acesso Restrito
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-0 left-0 w-[85%] max-w-sm h-full bg-white shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-left duration-300 flex flex-col">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
                 <div className="flex items-center gap-3">
                    <div className="bg-[#064e3b] p-2 rounded-lg text-white">
                        <GraduationCap className="h-5 w-5" />
                    </div>
                    <span className="font-black text-sm text-slate-900 uppercase">Menu Principal</span>
                 </div>
                 <button onClick={() => setIsOpen(false)} className="p-2 bg-slate-50 rounded-full"><X className="h-5 w-5 text-slate-400" /></button>
            </div>

            <div className="flex-1 space-y-6">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Módulos</p>
                  <div className="space-y-2">
                    {!role ? (
                      <>
                        <MobileLink to="/">Início</MobileLink>
                        <MobileLink to="/schools">Unidades Escolares</MobileLink>
                        <MobileLink to="/registration">Realizar Matrícula</MobileLink>
                        <MobileLink to="/status">Consultar Protocolo</MobileLink>
                      </>
                    ) : (role === UserRole.ADMIN_SME || role === UserRole.DIRECTOR) ? (
                      <>
                         <MobileLink to="/dashboard" icon={LayoutDashboard}>Painel de Controle</MobileLink>
                         <MobileLink to="/admin/escolas" icon={Building}>Gestão Escolar</MobileLink>
                         <MobileLink to="/admin/map" icon={Map}>Mapa Territorial</MobileLink>
                         <MobileLink to="/admin/data" icon={Database}>Censo Nominal</MobileLink>
                         <MobileLink to="/reports" icon={BarChart3}>Relatórios BI</MobileLink>
                      </>
                    ) : role === UserRole.TEACHER ? (
                         <MobileLink to="/journal" icon={FileText}>Diário de Classe</MobileLink>
                    ) : (
                         <MobileLink to="/student/monitoring" icon={Users}>Minha Pasta</MobileLink>
                    )}
                  </div>
               </div>
            </div>
            
            {role && (
                 <div className="pt-6 border-t border-slate-100 mt-auto">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 font-bold border border-slate-200">
                            {userName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-xs truncate">{userName}</p>
                            <p className="text-[10px] text-emerald-600 font-black uppercase">{role}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-red-50 text-red-600 font-bold uppercase text-xs hover:bg-red-100 transition-colors">
                        <LogOut className="h-4 w-4" /> Encerrar Sessão
                    </button>
                 </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};