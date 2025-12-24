import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from '../router';
import { GraduationCap, Menu, X, CloudOff, LogOut, Building, Map, FileText } from 'lucide-react';
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
    setIsOpen(false); // Fecha menu ao mudar de rota
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    
    // Lógica aprimorada para sub-rotas e parâmetros
    const isActiveLink = currentPath === path || (path !== '/' && currentPath.startsWith(path));

    return isActiveLink
      ? 'text-emerald-700 font-bold border-b-2 border-emerald-600 px-3 py-4 text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all bg-emerald-50/50' 
      : 'text-slate-500 hover:text-emerald-700 font-semibold px-3 py-4 transition-all text-[10px] uppercase tracking-wider flex items-center gap-2 hover:bg-slate-50';
  };

  const MobileLink = ({ to, children, icon: Icon }: any) => (
    <Link 
      to={to} 
      className={`flex items-center gap-4 p-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${location.pathname === to ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'text-slate-500 hover:bg-slate-50'}`}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {children}
    </Link>
  );

  return (
    <>
      <nav className="sticky top-0 z-[100] px-6 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            {/* Toggle Mobile */}
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link to="/" className="flex items-center gap-3">
              <div className="bg-[#064e3b] p-2 rounded-lg text-white shadow-lg shadow-emerald-900/20">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-sm text-slate-900 tracking-tight leading-none">
                  SME <span className="text-emerald-600">Digital</span>
                </span>
                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Governo de Itaberaba</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1 ml-6">
              {(role === UserRole.ADMIN_SME || role === UserRole.DIRECTOR) && (
                <>
                  <Link to="/dashboard" className={isActive('/dashboard')}>Painel</Link>
                  <Link to="/admin/escolas" className={isActive('/admin/escolas')}>
                    <Building className="h-3.5 w-3.5" /> Gestão de Rede
                  </Link>
                  <Link to="/admin/map" className={isActive('/admin/map')}>
                    <Map className="h-3.5 w-3.5" /> Mapa Geo
                  </Link>
                  <Link to="/admin/data" className={isActive('/admin/data')}>
                    <FileText className="h-3.5 w-3.5" /> Censo
                  </Link>
                </>
              )}
              {!role && (
                  <>
                  <Link to="/" className={isActive('/')}>Início</Link>
                  <Link to="/schools" className={isActive('/schools')}>Unidades</Link>
                  <Link to="/registration" className={isActive('/registration')}>Matrícula</Link>
                  <Link to="/status" className={isActive('/status')}>Protocolo</Link>
                  </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isOffline && (
              <div className="hidden sm:flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 text-red-600 text-[9px] font-black uppercase tracking-wide animate-pulse">
                <CloudOff className="h-3 w-3" /> Offline Mode
              </div>
            )}

            {role ? (
              <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] font-bold text-slate-900 block leading-none">{userName}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Gestor Municipal</span>
                </div>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Sair do Sistema">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary !h-10 !px-5 !text-[10px] !rounded-xl !bg-slate-900 shadow-lg">
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
          <div className="absolute top-16 left-0 w-3/4 max-w-sm h-[calc(100vh-64px)] bg-white border-r border-slate-200 shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="space-y-6">
               <div className="pb-6 border-b border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Navegação Principal</p>
                  <div className="space-y-2">
                    {!role ? (
                      <>
                        <MobileLink to="/">Início</MobileLink>
                        <MobileLink to="/schools">Unidades Escolares</MobileLink>
                        <MobileLink to="/registration">Realizar Matrícula</MobileLink>
                        <MobileLink to="/status">Consultar Protocolo</MobileLink>
                      </>
                    ) : (
                      <>
                         <MobileLink to="/dashboard">Painel de Controle</MobileLink>
                         <MobileLink to="/admin/escolas">Gestão de Escolas</MobileLink>
                         <MobileLink to="/admin/map">Mapa Territorial</MobileLink>
                         <MobileLink to="/admin/data">Censo Nominal</MobileLink>
                      </>
                    )}
                  </div>
               </div>
               
               {role && (
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Conta</p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                        <p className="font-bold text-slate-900 text-sm">{userName}</p>
                        <p className="text-xs text-emerald-600 font-medium">{role}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-600 font-bold uppercase text-xs">
                        <LogOut className="h-4 w-4" /> Encerrar Sessão
                    </button>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};