import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from '../router';
import { 
  MapPin, Search, Star, HeartPulse, 
  CheckCircle2, AlertTriangle, 
  XCircle, ChevronDown, ArrowRight, 
  Hash, Zap, Sparkles
} from 'lucide-react';
import { School, SchoolType } from '../types';

declare const L: any;

const SchoolCard: React.FC<{ school: School; enrolledCount: number; isExpanded: boolean; onToggleExpand: () => void; isAdmin: boolean }> = ({ school, enrolledCount, isExpanded, onToggleExpand, isAdmin }) => {
    const navigate = useNavigate();
    const totalSlots = school.availableSlots || 0;
    const availablePercent = totalSlots > 0 ? ((totalSlots - enrolledCount) / totalSlots) * 100 : 0;

    const getStatus = () => {
        if (availablePercent < 10) return { color: 'text-red-600', bg: 'bg-red-500', label: 'Lotação Crítica', icon: <XCircle className="h-3 w-3" /> };
        if (availablePercent <= 50) return { color: 'text-amber-600', bg: 'bg-amber-500', label: 'Vagas Médias', icon: <AlertTriangle className="h-3 w-3" /> };
        return { color: 'text-emerald-600', bg: 'bg-emerald-500', label: 'Disponibilidade Alta', icon: <CheckCircle2 className="h-3 w-3" /> };
    };

    const status = getStatus();

    return (
        <div 
            onClick={onToggleExpand}
            className={`card-gallery group cursor-pointer relative flex flex-col ${isExpanded ? 'ring-2 ring-emerald-500 z-20 scale-[1.02]' : ''}`}
        >
            <div className={`relative overflow-hidden bg-slate-100 transition-all duration-700 ${isExpanded ? 'h-80' : 'h-56'}`}>
                <img src={school.image} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt={school.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                
                <div className="absolute top-6 left-6 flex gap-3">
                    <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-white/50">
                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-black text-slate-900">{school.rating.toFixed(1)}</span>
                    </div>
                    {school.hasAEE && (
                        <div className="bg-emerald-500 text-white p-2.5 rounded-2xl shadow-xl animate-pulse">
                            <HeartPulse className="h-4 w-4" />
                        </div>
                    )}
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl backdrop-blur-xl bg-white/90 ${status.color}`}>
                        {status.icon} {status.label}
                    </div>
                </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
                <h3 className={`font-black text-slate-900 tracking-tighter leading-[0.9] transition-all mb-4 uppercase ${isExpanded ? 'text-4xl' : 'text-2xl line-clamp-2'}`}>
                    {school.name}
                </h3>
                
                <div className="flex items-start gap-3 text-slate-400 text-sm mb-8">
                    <MapPin className="h-5 w-5 shrink-0 text-emerald-500" />
                    <span className={`font-medium ${isExpanded ? '' : 'line-clamp-1'}`}>{school.address}</span>
                </div>

                <div className="mb-8">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-3">
                        <span className="text-slate-400">Ocupação de Rede</span>
                        <span className="text-slate-900">{enrolledCount} / {totalSlots}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                        <div className={`h-full transition-all duration-[1.5s] ${status.bg} shadow-[0_0_15px_rgba(16,185,129,0.3)]`} style={{ width: `${(enrolledCount / Math.max(1, totalSlots)) * 100}%` }} />
                    </div>
                </div>

                {isExpanded && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex flex-wrap gap-2">
                            {school.types.map(t => (
                                <span key={t} className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase rounded-xl tracking-widest">{t}</span>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Hash className="h-3 w-3" /> Código INEP</p>
                                <p className="text-sm font-black text-slate-700 font-mono">{school.inep || '293839XX'}</p>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Zap className="h-3 w-3 text-emerald-500" /> Geoprocess</p>
                                <p className="text-sm font-black text-slate-700 truncate">Vínculo Ativo</p>
                            </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); navigate('/registration'); }} className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] uppercase tracking-widest rounded-[2.2rem] transition-all shadow-2xl shadow-emerald-100 flex items-center justify-center gap-6 active:scale-95">
                            Solicitar Vaga Nominal <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export const SchoolList: React.FC = () => {
  const { schools, students } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [expandedSchoolId, setExpandedSchoolId] = useState<string | null>(null);
  
  const mapRef = useRef<any>(null);

  const getEnrolled = useCallback((name: string) => students.filter(s => s.school === name && s.status === 'Matriculado').length, [students]);

  const filteredSchools = useMemo(() => schools.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || s.types.includes(selectedType as SchoolType);
    return matchesSearch && matchesType;
  }), [schools, searchTerm, selectedType]);

  useEffect(() => {
    if (viewMode === 'map' && !mapRef.current) {
        const map = L.map('main-map', { attributionControl: false, zoomControl: false }).setView([-12.5253, -40.2917], 14);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
        mapRef.current = map;
    }
    if (viewMode === 'map') {
        setTimeout(() => mapRef.current?.invalidateSize(), 200);
    }
  }, [viewMode]);

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-24 px-8 page-transition">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-24">
          <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-50 rounded-full border border-emerald-100 mb-8">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Guia Oficial SME 2025</span>
            </div>
            <h1 className="text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8 uppercase">Rede <br/> <span className="text-emerald-600">Escolar.</span></h1>
            <p className="text-slate-500 font-medium text-2xl tracking-tight max-w-2xl">Catálogo nominal e georeferenciado das unidades de ensino do município.</p>
          </div>
          <div className="flex bg-slate-50 p-3 rounded-[2.5rem] border border-slate-100 shadow-inner">
             <button onClick={() => setViewMode('list')} className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white text-emerald-600 shadow-2xl scale-105' : 'text-slate-400'}`}>Mosaico</button>
             <button onClick={() => setViewMode('map')} className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all ${viewMode === 'map' ? 'bg-white text-emerald-600 shadow-2xl scale-105' : 'text-slate-400'}`}>Geoprocess</button>
          </div>
        </header>

        <div className="bg-white p-6 rounded-[3.5rem] shadow-luxury border border-slate-100 mb-16 flex flex-col md:flex-row gap-6 sticky top-24 z-40">
            <div className="relative flex-1 group">
                <Search className="absolute left-10 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-200 group-focus-within:text-emerald-600 transition-colors" />
                <input type="text" placeholder="Pesquisar unidade..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-24 pr-8 py-8 bg-slate-50 border-none rounded-[3rem] focus:bg-white focus:ring-8 focus:ring-emerald-50 transition-all font-black text-slate-700 text-xl shadow-inner" />
            </div>
            <div className="relative md:w-80 group">
                <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="w-full px-10 py-8 bg-slate-50 border-none rounded-[3rem] appearance-none focus:bg-white focus:ring-8 focus:ring-emerald-50 transition-all font-black text-slate-700 text-sm uppercase tracking-widest cursor-pointer shadow-inner">
                    <option value="">Todas as Etapas</option>
                    {Object.values(SchoolType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-10 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 pointer-events-none" />
            </div>
        </div>

        {viewMode === 'list' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {filteredSchools.map(s => (
                    <SchoolCard key={s.id} school={s} enrolledCount={getEnrolled(s.name)} isExpanded={expandedSchoolId === s.id} onToggleExpand={() => setExpandedSchoolId(expandedSchoolId === s.id ? null : s.id)} isAdmin={false} />
                ))}
            </div>
        ) : (
            <div className="h-[750px] w-full rounded-[5rem] shadow-luxury overflow-hidden border-[12px] border-white animate-in zoom-in-95 duration-1000 relative">
                <div id="main-map" className="w-full h-full" />
                <div className="absolute top-10 left-10 z-[300] bg-slate-900/90 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 text-white shadow-2xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-3">Rede Georeferenciada</p>
                    <p className="text-xl font-black tracking-tight">Análise de Fluxo Nominal</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};