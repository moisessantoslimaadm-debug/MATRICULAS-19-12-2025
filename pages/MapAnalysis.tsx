import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from '../router';
import { 
  ArrowLeft, LocateFixed, Activity, Maximize, 
  School as SchoolIcon, Users, Map as MapIcon, 
  Layers, Filter, MapPin, Info, Zap, ShieldCheck, ChevronRight
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

declare const L: any;

export const MapAnalysis: React.FC = () => {
  const { schools, students } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const mapRef = useRef<any>(null);
  const heatLayerRef = useRef<any>(null);
  const schoolMarkersRef = useRef<any>(null);
  const studentMarkersRef = useRef<any>(null);

  const [activeLayer, setActiveLayer] = useState<'heat' | 'points'>('heat');
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current) {
        const map = L.map('analysis-map', {
            attributionControl: false,
            zoomControl: false,
            maxZoom: 18,
            minZoom: 11
        }).setView([-12.5253, -40.2917], 13);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);

        schoolMarkersRef.current = L.layerGroup().addTo(map);
        studentMarkersRef.current = L.layerGroup();
        mapRef.current = map;
        setIsMapReady(true);
    }

    return () => {
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;
    
    // Clear layers
    if (heatLayerRef.current) {
        mapRef.current.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
    }
    if (mapRef.current.hasLayer(studentMarkersRef.current)) {
        mapRef.current.removeLayer(studentMarkersRef.current);
    }
    schoolMarkersRef.current.clearLayers();
    studentMarkersRef.current.clearLayers();

    // 1. Schools
    schools.forEach(school => {
        if (!school.lat || !school.lng) return;
        const icon = L.divIcon({
            html: `<div class="bg-[#0F172A] p-3 rounded-[1.2rem] shadow-2xl border-4 border-white text-blue-400 transition-transform hover:scale-125 duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                   </div>`,
            className: 'school-marker-custom',
            iconSize: [48, 48],
            iconAnchor: [24, 24]
        });
        L.marker([school.lat, school.lng], { icon })
          .bindPopup(`<div class="p-6 bg-white rounded-3xl min-w-[220px] shadow-2xl">
                        <p class="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-3">Unidade Ativa</p>
                        <b class="text-xl font-black uppercase text-slate-900 tracking-tighter leading-none">${school.name}</b>
                        <p class="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest leading-relaxed">${school.address}</p>
                      </div>`)
          .addTo(schoolMarkersRef.current);
    });

    // 2. Students Layer
    const validStudents = students.filter(s => s.lat && s.lng);

    if (activeLayer === 'heat') {
        const heatData = validStudents.map(s => [s.lat, s.lng, 1.0]); 
        if (typeof L.heatLayer === 'function' && heatData.length > 0) {
            heatLayerRef.current = L.heatLayer(heatData, {
                radius: 45,
                blur: 25,
                maxZoom: 16,
                gradient: { 0.4: '#3b82f6', 0.6: '#10b981', 0.8: '#fbbf24', 1: '#ef4444' }
            }).addTo(mapRef.current);
        }
    } else {
        validStudents.forEach(s => {
            const dot = L.circleMarker([s.lat, s.lng], {
                radius: 8,
                fillColor: '#2563eb',
                color: '#fff',
                weight: 3,
                opacity: 1,
                fillOpacity: 1
            });
            dot.bindPopup(`
                <div class="p-6 bg-white rounded-3xl min-w-[240px] shadow-2xl">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg"><ShieldCheck className="h-4 w-4" /></div>
                        <p class="text-[10px] font-black text-blue-600 uppercase tracking-widest">${s.enrollmentId || 'ALUNO NOMINAL'}</p>
                    </div>
                    <h4 class="font-black text-slate-900 text-2xl leading-none uppercase tracking-tighter mb-4">${s.name}</h4>
                    <div class="pt-4 border-t border-slate-50 space-y-2">
                        <p class="text-[10px] text-slate-800 font-bold uppercase tracking-widest">Endereço: ${s.address?.street}, ${s.address?.number}</p>
                        <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">${s.address?.neighborhood || 'ZONA URBANA'}</p>
                    </div>
                </div>
            `);
            dot.addTo(studentMarkersRef.current);
        });
        studentMarkersRef.current.addTo(mapRef.current);
    }
  }, [activeLayer, students, schools, isMapReady]);

  return (
    <div className="h-[calc(100vh-120px)] bg-[#fcfdfe] flex overflow-hidden page-transition m-8 rounded-[4rem] shadow-luxury border border-white">
      <div className="w-[480px] bg-white border-r border-slate-100 shadow-2xl z-20 flex flex-col relative">
        <div className="p-16 border-b border-slate-50 bg-slate-50/20 relative overflow-hidden">
            <button onClick={() => navigate('/dashboard')} className="mb-12 text-slate-400 hover:text-blue-600 flex items-center gap-4 text-[11px] font-black uppercase tracking-ultra transition group relative z-10">
                <ArrowLeft className="h-6 w-6 group-hover:-translate-x-3 transition-transform" /> Voltar ao Painel
            </button>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter flex items-center gap-6 uppercase relative z-10 text-display">
                <LocateFixed className="h-12 w-12 text-blue-600" /> Geoproc
            </h1>
            <p className="text-[10px] text-slate-400 mt-6 uppercase font-black tracking-ultra relative z-10">Inteligência Territorial SME</p>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-16 space-y-16 custom-scrollbar">
            <section>
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-12 flex items-center gap-5">
                    <Layers className="h-6 w-6 text-slate-400" /> Camadas de Rede
                </h3>
                <div className="grid grid-cols-1 gap-8">
                    <button 
                        onClick={() => setActiveLayer('heat')}
                        className={`p-10 rounded-[3rem] border-2 transition-all duration-700 flex items-center gap-10 ${activeLayer === 'heat' ? 'bg-[#0F172A] border-[#0F172A] text-white shadow-2xl scale-[1.05]' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                    >
                        <Activity className={`h-12 w-12 ${activeLayer === 'heat' ? 'text-blue-400' : 'text-slate-300'}`} />
                        <div className="text-left">
                            <p className="text-2xl font-black uppercase tracking-tighter">Mapa de Calor</p>
                            <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mt-2">Saturação por Bairro</p>
                        </div>
                    </button>
                    <button 
                        onClick={() => setActiveLayer('points')}
                        className={`p-10 rounded-[3rem] border-2 transition-all duration-700 flex items-center gap-10 ${activeLayer === 'points' ? 'bg-[#0F172A] border-[#0F172A] text-white shadow-2xl scale-[1.05]' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                    >
                        <MapPin className={`h-12 w-12 ${activeLayer === 'points' ? 'text-blue-400' : 'text-slate-300'}`} />
                        <div className="text-left">
                            <p className="text-2xl font-black uppercase tracking-tighter">Logradouros</p>
                            <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mt-2">Identificação Nominal</p>
                        </div>
                    </button>
                </div>
            </section>

            <div className="bg-[#0F172A] p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group border border-slate-800">
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-16">
                        <span className="text-[11px] font-black text-blue-400 uppercase tracking-ultra">Métricas de Área</span>
                        <Zap className="h-7 w-7 text-amber-400 animate-pulse" />
                    </div>
                    <div className="space-y-12">
                        <div className="flex justify-between items-end border-b border-white/5 pb-10">
                            <span className="text-[13px] text-slate-500 uppercase font-black tracking-widest">Alunos Plotados</span>
                            <span className="text-7xl font-black tracking-tighter">{students.length}</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-[13px] text-slate-500 uppercase font-black tracking-widest">Escolas na Base</span>
                            <span className="text-7xl font-black tracking-tighter">{schools.length}</span>
                        </div>
                    </div>
                </div>
                <div className="absolute -bottom-24 -right-24 h-64 w-64 bg-blue-600/10 rounded-full blur-[80px] transition-transform duration-1000 group-hover:scale-150"></div>
            </div>

            <div className="bg-blue-50 p-12 rounded-[4rem] border border-blue-100 relative overflow-hidden">
                <p className="text-[11px] font-black text-blue-600 uppercase tracking-ultra mb-10">Escala de Densidade</p>
                <div className="flex items-center gap-2 h-6 w-full rounded-full overflow-hidden mb-8 shadow-inner bg-white/50">
                    <div className="flex-1 bg-blue-500"></div>
                    <div className="flex-1 bg-emerald-500"></div>
                    <div className="flex-1 bg-yellow-400"></div>
                    <div className="flex-1 bg-orange-500"></div>
                    <div className="flex-1 bg-red-600"></div>
                </div>
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Área Vaga</span>
                    <span>Saturação Máxima</span>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <div id="analysis-map" className="w-full h-full z-10" />
        
        <div className="absolute top-12 left-12 z-[300] glass-premium px-12 py-8 rounded-[3rem] shadow-luxury flex items-center gap-10 animate-in slide-in-from-top-12 duration-1000 border-white">
            <div className="bg-[#0F172A] p-5 rounded-[1.8rem] text-blue-400 shadow-2xl transition-transform hover:rotate-6"><Maximize className="h-8 w-8" /></div>
            <div>
                <span className="text-[11px] font-black text-slate-400 uppercase block tracking-ultra mb-3">Visão Territorial SME</span>
                <span className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Itaberaba • Bahia Digital</span>
            </div>
        </div>
      </div>
    </div>
  );
};