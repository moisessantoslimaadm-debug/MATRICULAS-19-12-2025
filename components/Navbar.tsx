import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from '../router';
import { GraduationCap, Menu, X, CloudOff, LogOut, ShieldCheck, Building, Briefcase, Star, Map, FileText, BarChart3 } from 'lucide-react';
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
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    const currentSearch = location.search;
    
    if (path.includes('?tab=')) {
      const [base, query] = path.split('?');
      return currentPath === base && currentSearch.includes(query)
        ? 'text-emerald-700 font-bold border-b-2 border-emerald-600 px-3 py-4 text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all' 
        : 'text-slate-500 hover:text-emerald-700 font-semibold px-3 py-4 transition-all text-[10px] uppercase tracking-wider flex items-center gap-2';
    }

    return currentPath === path
      ? 'text-emerald-700 font-bold border-b-2 border-emerald-600 px-3 py-4 text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all' 
      : 'text-slate-500 hover:text-emerald-700 font-semibold px-3 py-4 transition-all text-[10px] uppercase tracking-wider flex items-center gap-2';
  };

  return (
    <nav className="sticky top-0 z-[100] px-6 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-[1600px] mx-auto flex justify-between items-center h-14">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-[#064e3b] p-1.5 rounded-md text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-slate-900 tracking-tight leading-none">
                SME <span className="text-emerald-600">Digital</span>
              </span>
              <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Governo de Itaberaba</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {(role === UserRole.ADMIN_SME || role === UserRole.DIRECTOR) && (
              <>
                <Link to="/dashboard" className={isActive('/dashboard')}>Painel</Link>
                <Link to="/admin/escolas?tab=units" className={isActive('/admin/escolas?tab=units')}>
                  <Building className="h-3.5 w-3.5" /> Escolas
                </Link>
                <Link to="/admin/escolas?tab=professionals" className={isActive('/admin/escolas?tab=professionals')}>
                  <Briefcase className="h-3.5 w-3.5" /> Profissionais
                </Link>
                <Link to="/admin/escolas?tab=projects" className={isActive('/admin/escolas?tab=projects')}>
                  <Star className="h-3.5 w-3.5" /> Projetos
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
            <div className="flex items-center gap-1.5 bg-red-50 px-2 py-1 rounded text-red-600 text-[8px] font-bold uppercase">
              <CloudOff className="h-3 w-3" /> Offline
            </div>
          )}

          {role ? (
            <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] font-bold text-slate-900 block leading-none">{userName}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">Gestor Municipal</span>
              </div>
              <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors" title="Sair do Sistema">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary !h-8 !px-3 !text-[9px]">
                Acesso Restrito
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
