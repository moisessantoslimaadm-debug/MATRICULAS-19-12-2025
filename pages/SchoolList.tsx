import React, { useState, useMemo, useCallback } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from '../router';
import { 
  MapPin, Search, Star, CheckCircle2, 
  ChevronDown, ArrowRight, XCircle, AlertTriangle
} from 'lucide-react';
import { School, SchoolType } from '../types';

const SchoolCard: React.FC<{ school: School; enrolledCount: number }> = ({ school, enrolledCount }) => {
    const navigate = useNavigate();
    const totalSlots = school.availableSlots || 0;
    const occupancy = totalSlots > 0 ? (enrolledCount / totalSlots) * 100 : 0;

    return (
        <div className="card-requinte flex flex-col overflow-hidden">
            <div className="h-24 bg-slate-100 relative">
                <img src={school.image} className="w-full h-full object-cover" alt={school.name} />
                <div className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur px-1 py-0.5 rounded text-[7px] font-bold flex items-center gap-0.5 shadow-sm border border-slate-100">
                    <Star className="h-2 w-2 text-amber-500 fill-amber-500" /> {school.rating.toFixed(1)}
                </div>
            </div>
            <div className="p-2.5 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 text-[10px] uppercase tracking-tight mb-0.5 truncate">{school.name}</h3>
                <p className="text-[8px] text-slate-400 flex items-center gap-1 mb-2 truncate">
                    <MapPin className="h-2.5 w-2.5 text-emerald-500" /> {school.address}
                </p>
                
                <div className="mb-2">
                    <div className="flex justify-between text-[7px] font-bold uppercase mb-0.5">
                        <span className="text-slate-400">Ocupação</span>
                        <span className="text-slate-900">{enrolledCount}/{totalSlots}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className={`h-full ${occupancy > 90 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(occupancy, 100)}%` }} />
                    </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-2 h-3.5 overflow-hidden">
                    {school.types.slice(0, 2).map(t => (
                        <span key={t} className="px-1 py-0.5 bg-slate-50 text-slate-500 text-[6px] font-bold uppercase rounded border border-slate-100">{t}</span>
                    ))}
                </div>

                <button 
                  onClick={() => navigate('/registration')}
                  className="mt-auto w-full py-1.5 bg-[#064e3b] hover:bg-emerald-700 text-white text-[7px] font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-1.5"
                >
                    Solicitar Vaga <ArrowRight className="h-2.5 w-2.5" />
                </button>
            </div>
        </div>
    );
};

export const SchoolList: React.FC = () => {
  const { schools, students } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');

  const getEnrolled = useCallback((name: string) => students.filter(s => s.school === name && s.status === 'Matriculado').length, [students]);

  const filteredSchools = useMemo(() => schools.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || s.types.includes(selectedType as SchoolType);
    return matchesSearch && matchesType;
  }), [schools, searchTerm, selectedType]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6 page-transition">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 uppercase">Rede <span className="text-emerald-600">Escolar</span></h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Catálogo georeferenciado de unidades</p>
          </div>
        </header>

        <div className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Pesquisar unidade..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  className="input-premium pl-10 border-none bg-slate-50" 
                />
            </div>
            <select 
              value={selectedType} 
              onChange={e => setSelectedType(e.target.value)} 
              className="input-premium md:w-48 bg-slate-50 border-none !text-[9px] font-bold uppercase"
            >
                <option value="">Todas as Etapas</option>
                {Object.values(SchoolType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredSchools.map(s => (
                <SchoolCard key={s.id} school={s} enrolledCount={getEnrolled(s.name)} />
            ))}
        </div>
      </div>
    </div>
  );
};