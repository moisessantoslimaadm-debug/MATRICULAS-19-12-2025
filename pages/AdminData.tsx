import React, { useState, useMemo, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { useLog } from '../contexts/LogContext';
import { 
  Search, Trash2, User, ChevronLeft, ChevronRight, 
  Upload, Edit3, Loader2, Download, Database, MapPin, 
  Filter, CheckCircle2, UserPlus
} from 'lucide-react';
import { RegistryStudent } from '../types';

export const AdminData: React.FC = () => {
  const { students, updateStudents, removeStudent } = useData();
  const { addToast } = useToast();
  const { addLog } = useLog();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isImporting, setIsImporting] = useState(false);

  // Mapeamento geográfico de Itaberaba para geolocalização nominal automática
  const NEIGHBORHOOD_COORD: Record<string, {lat: number, lng: number}> = {
    'CENTRO': { lat: -12.5253, lng: -40.2917 },
    'PRIMAVERA': { lat: -12.5280, lng: -40.3020 },
    'CAITITU': { lat: -12.5400, lng: -40.2950 },
    'BARRO VERMELHO': { lat: -12.5320, lng: -40.2850 },
    'JARDIM PALMEIRAS': { lat: -12.5180, lng: -40.3100 }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    addLog(`Iniciando processamento de planilha nominal: ${file.name}`, 'info');

    // Simulação de processamento inteligente de CSV/Excel
    setTimeout(() => {
      const currentList = [...students];
      let newCount = 0;
      let updatedCount = 0;

      // Mock de dados vindos da planilha
      const importedRows = Array.from({ length: 8 }).map((_, i) => {
        const neighborhoods = Object.keys(NEIGHBORHOOD_COORD);
        const neighborhood = neighborhoods[i % neighborhoods.length];
        const baseGeo = NEIGHBORHOOD_COORD[neighborhood];
        const lat = baseGeo.lat + (Math.random() - 0.5) * 0.004;
        const lng = baseGeo.lng + (Math.random() - 0.5) * 0.004;
        const cpf = `123.456.789-${(10 + i).toString().padStart(2, '0')}`;

        return {
          id: `imp-${Date.now()}-${i}`,
          name: `ALUNO IMPORTADO ${i + 10} NOMINAL`,
          birthDate: '2014-05-12',
          cpf: cpf,
          nis: `NIS-${2000 + i}`,
          status: 'Matriculado' as const,
          school: 'ESCOLA MUNICIPAL JOÃO XXIII',
          grade: '4º Ano',
          lat, lng,
          address: {
            street: `Rua Logradouro Nominal ${i + 50}`,
            number: `${250 + i}`,
            neighborhood: neighborhood,
            city: 'Itaberaba',
            zipCode: '46880-000',
            zone: 'Urbana' as const
          },
          transportRequest: i % 3 === 0,
          specialNeeds: i % 10 === 0,
          performanceHistory: [
            { subject: 'LÍNGUA PORTUGUESA', g1: ['DB', 'DB', ''] },
            { subject: 'MATEMÁTICA', g1: ['EP', 'DB', ''] }
          ]
        };
      });

      importedRows.forEach(imp => {
        const existingIdx = currentList.findIndex(s => s.cpf === imp.cpf);
        if (existingIdx > -1) {
          currentList[existingIdx] = { ...currentList[existingIdx], ...imp };
          updatedCount++;
        } else {
          currentList.push(imp);
          newCount++;
        }
      });

      updateStudents(currentList);
      setIsImporting(false);
      addToast(`Importação Concluída: ${newCount} novos, ${updatedCount} atualizados.`, "success");
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 2000);
  };

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.cpf.includes(searchTerm) ||
    s.address?.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginated = filtered.slice((currentPage - 1) * 10, currentPage * 10);
  const totalPages = Math.ceil(filtered.length / 10);

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-20 px-12 page-transition">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-20 gap-10">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg">
                <Database className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Territorial SME</span>
            </div>
            <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none text-display">Censo <br/><span className="text-blue-600">Nominal.</span></h1>
            <p className="text-slate-500 font-medium text-lg mt-6 max-w-xl">Gestão auditável de registros individuais com geoprocessamento em tempo real.</p>
          </div>
          
          <div className="flex gap-5 animate-in fade-in slide-in-from-right-8 duration-700">
            <input type="file" ref={fileInputRef} className="hidden" accept=".csv, .xlsx" onChange={handleFileUpload} />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="btn-secondary !h-20 !px-12"
            >
              {isImporting ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
              Importar Planilha
            </button>
            <button className="btn-primary !h-20 !px-12">
              <Download className="h-6 w-6" /> Exportar Dados
            </button>
          </div>
        </header>

        <div className="bg-white rounded-[3.5rem] shadow-luxury border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-700">
          <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-50/30">
            <div className="relative flex-1 w-full max-w-lg">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
              <input 
                type="text" 
                placeholder="Filtrar por nome, CPF ou bairro..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input-premium pl-16 !bg-white !py-4"
              />
            </div>
            <div className="flex items-center gap-8">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-ultra">Registros na Rede: <span className="text-slate-900">{filtered.length}</span></span>
              <button className="p-4 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-blue-600 transition-all shadow-sm"><Filter className="h-5 w-5" /></button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-10 py-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estudante</th>
                  <th className="px-10 py-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identidade Nom.</th>
                  <th className="px-10 py-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Logradouro SME</th>
                  <th className="px-10 py-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginated.map(s => (
                  <tr key={s.id} className="group hover:bg-blue-50/40 transition-all duration-500">
                    <td className="px-10 py-10">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-blue-600 font-black text-2xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-xl uppercase tracking-tighter leading-none mb-3">{s.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.school}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-10">
                      <p className="text-[11px] font-bold text-slate-700 font-mono mb-2">{s.cpf}</p>
                      <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border ${s.status === 'Matriculado' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-10 py-10">
                      <div className="flex items-center gap-4 text-slate-500">
                        <MapPin className="h-5 w-5 text-blue-400" />
                        <div>
                            <p className="text-sm font-black uppercase text-slate-800 tracking-tight">{s.address?.neighborhood}</p>
                            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest line-clamp-1">{s.address?.street}, {s.address?.number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-10 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                        <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm"><Edit3 className="h-5 w-5" /></button>
                        <button onClick={() => removeStudent(s.id)} className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-red-500 transition-all shadow-sm"><Trash2 className="h-5 w-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-10 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Página {currentPage} de {totalPages || 1} • {filtered.length} registros</span>
            <div className="flex items-center gap-6">
              <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-4 bg-white rounded-2xl border border-slate-200 text-slate-400 disabled:opacity-30 transition-all hover:bg-slate-50"><ChevronLeft className="h-6 w-6" /></button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage >= totalPages} className="p-4 bg-white rounded-2xl border border-slate-200 text-slate-400 disabled:opacity-30 transition-all hover:bg-slate-50"><ChevronRight className="h-6 w-6" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};