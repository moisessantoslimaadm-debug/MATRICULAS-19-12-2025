import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from '../router';
import { 
  GraduationCap, Menu, X, LogOut, 
  Building, Map, FileText, LayoutDashboard, 
  Users, BarChart3, Database, Briefcase, FolderOpen,
  Home, ClipboardList, Search
} from 'lucide-react';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [role, setRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const savedRole = sessionStorage.getItem('user_role') as UserRole;
    const userData = JSON.parse(sessionStorage.getItem('user_data') || '{}');
    setRole(savedRole);
    setUserName(userData.name || '');
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.clear();
    setRole(null);
    setUserName('');
    navigate('/');
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Redireciona para dashboard se for ADMIN_SME ou STUDENT, caso contrário vai para home
    if (role === UserRole.ADMIN_SME || role === UserRole.STUDENT) {
        navigate('/dashboard');
    } else {
        navigate('/');
    }
  };

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    const active = currentPath === path || (path !== '/' && currentPath.startsWith(path));
    
    return active
      ? 'text-emerald-700 bg-emerald-50 font-black' 
      : 'text-slate-500 hover:text-emerald-600 hover:bg-slate-50 font-medium';
  };

  const NavItem = ({ to, icon: Icon, label }: any) => (
    <Link 
        to={to} 
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] uppercase tracking-widest transition-all ${isActive(to)}`}
    >
        <Icon className="h-4 w-4" />
        {label}
    </Link>
  );

  const MobileLink = ({ to, icon: Icon, label }: any) => (
    <Link 
        to={to} 
        onClick={() => setIsOpen(false)}
        className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[12px] uppercase tracking-widest transition-all ${isActive(to)}`}
    >
        <Icon className="h-5 w-5" />
        {label}
    </Link>
  );

  return (
    <>
      <nav className="h-20 bg-white border-b border-slate-100 px-6 fixed top-0 w-full z-[50] flex items-center justify-between shadow-sm">
        {/* Logo com manipulador de clique personalizado */}
        <a href="/" onClick={handleLogoClick} className="flex items-center gap-3 group">
            <div className="bg-[#064e3b] text-white p-2.5 rounded-xl shadow-lg group-hover:rotate-12 transition-transform">
                <GraduationCap className="h-6 w-6" />
            </div>
            <div className="leading-none">
                <span className="block text-lg font-black text-slate-900 tracking-tighter uppercase">SME <span className="text-emerald-600">Digital</span></span>
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Itaberaba • BA</span>
            </div>
        </a>

        {/* Desktop Menu */}
        <div className="hidden xl:flex items-center gap-2">
            {!role && (
                <>
                    <NavItem to="/" icon={Home} label="Início" />
                    <NavItem to="/schools" icon={Building} label="Escolas" />
                    <NavItem to="/registration" icon={FileText} label="Matrícula" />
                    <NavItem to="/status" icon={Search} label="Consultar" />
                    <Link to="/login" className="ml-4 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95">
                        Acesso Restrito
                    </Link>
                </>
            )}

            {role === UserRole.ADMIN_SME && (
                <>
                    <NavItem to="/dashboard" icon={LayoutDashboard} label="Painel" />
                    <NavItem to="/admin/map" icon={Map} label="Geo" />
                    <NavItem to="/admin/escolas" icon={Building} label="Rede" />
                    <NavItem to="/admin/data" icon={Database} label="Censo" />
                    <NavItem to="/reports" icon={BarChart3} label="BI" />
                </>
            )}

            {role === UserRole.TEACHER && (
                <>
                    <NavItem to="/journal" icon={ClipboardList} label="Diário de Classe" />
                </>
            )}

            {role === UserRole.STUDENT && (
                <>
                    <NavItem to={`/student/monitoring?id=${JSON.parse(sessionStorage.getItem('user_data') || '{}').id}`} icon={FolderOpen} label="Minha Pasta" />
                    <NavItem to={`/performance?studentId=${JSON.parse(sessionStorage.getItem('user_data') || '{}').id}`} icon={BarChart3} label="Boletim" />
                </>
            )}

            {role && (
                <div className="flex items-center gap-4 ml-6 pl-6 border-l border-slate-100">
                    <div className="text-right hidden 2xl:block">
                        <span className="block text-[10px] font-black text-slate-900 uppercase truncate max-w-[150px]" title={userName}>{userName}</span>
                        <span className="block text-[8px] font-bold text-emerald-600 uppercase tracking-widest">{role}</span>
                    </div>
                    <button onClick={handleLogout} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Sair">
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(true)} className="xl:hidden p-2 text-slate-900">
            <Menu className="h-8 w-8" />
        </button>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-20" />

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] xl:hidden">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-white shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-300">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#064e3b] text-white p-2 rounded-lg">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <span className="font-black text-slate-900 uppercase tracking-tight">Menu</span>
                    </div>
                    <button onClick={() => setIsOpen(false)}><X className="h-6 w-6 text-slate-400" /></button>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto">
                    {!role && (
                        <>
                            <MobileLink to="/" icon={Home} label="Início" />
                            <MobileLink to="/schools" icon={Building} label="Escolas" />
                            <MobileLink to="/registration" icon={FileText} label="Matrícula" />
                            <MobileLink to="/status" icon={Search} label="Consultar" />
                            <MobileLink to="/login" icon={Users} label="Acesso Restrito" />
                        </>
                    )}

                    {role === UserRole.ADMIN_SME && (
                        <>
                            <MobileLink to="/dashboard" icon={LayoutDashboard} label="Painel de Controle" />
                            <MobileLink to="/admin/map" icon={Map} label="Geoprocessamento" />
                            <MobileLink to="/admin/escolas" icon={Building} label="Gestão de Rede" />
                            <MobileLink to="/admin/data" icon={Database} label="Censo Nominal" />
                            <MobileLink to="/reports" icon={BarChart3} label="Relatórios BI" />
                        </>
                    )}

                    {role === UserRole.TEACHER && (
                        <MobileLink to="/journal" icon={ClipboardList} label="Diário de Classe" />
                    )}

                    {role === UserRole.STUDENT && (
                        <>
                            <MobileLink to={`/student/monitoring?id=${JSON.parse(sessionStorage.getItem('user_data') || '{}').id}`} icon={FolderOpen} label="Minha Pasta" />
                            <MobileLink to={`/performance?studentId=${JSON.parse(sessionStorage.getItem('user_data') || '{}').id}`} icon={BarChart3} label="Boletim" />
                        </>
                    )}
                </div>

                {role && (
                    <div className="pt-8 border-t border-slate-100 mt-4">
                        <div className="mb-6">
                            <span className="block text-sm font-black text-slate-900 uppercase truncate">{userName}</span>
                            <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{role}</span>
                        </div>
                        <button onClick={handleLogout} className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-50 hover:text-red-600 transition-all">
                            <LogOut className="h-4 w-4" /> Sair do Sistema
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
    </>
  );
};