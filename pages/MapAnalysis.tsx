import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from '../router';
import { 
  ArrowLeft, Activity, Maximize, MapPin, Layers, 
  Search, Compass, Navigation2, Navigation, Globe,
  ShieldCheck, Loader2
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
  const userMarkerRef = useRef<any>(null);

  const [activeLayer, setActiveLayer] = useState<'heat' | 'points'>('points');
  const [mapStyle, setMapStyle] = useState<'voyager' | 'satellite' | 'dark'>('voyager');
  const [isMapReady, setIsMapReady] = useState(false);
  const [searchStreet, setSearchStreet] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const tileProviders = {
    voyager: {
      base: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',
      labels: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png'
    },
    satellite: {
      base: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      labels: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png'
    },
    dark: {
      base: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
      labels: 'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png'
    }
  };

  const updateMapTiles = (style: keyof typeof tileProviders) => {
    if (!mapRef.current) return;
    mapRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) mapRef.current.removeLayer(layer);
    });
    
    L.tileLayer(tileProviders[style].base, { maxZoom: 20 }).addTo(mapRef.current);
    L.tileLayer(tileProviders[style].labels, { pane: 'shadowPane', zIndex: 1000 }).addTo(mapRef.current);
  };

  useEffect(() => {
    if (!mapRef.current) {
        const map = L.map('analysis-map', {
            attributionControl: false,
            zoomControl: false,
            maxZoom: 20,
            minZoom: 12
        }).setView([-12.5253, -40.2917], 15);

        mapRef.current = map;
        updateMapTiles('voyager');
        schoolMarkersRef.current = L.layerGroup().addTo(map);
        studentMarkersRef.current = L.layerGroup().addTo(map);
        
        // Force resize to prevent gray areas
        setTimeout(() => map.invalidateSize(), 100);
        
        setIsMapReady(true);
    }
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;
    
    // Ensure map fits container on update
    mapRef.current.invalidateSize();

    if (heatLayerRef.current) mapRef.current.removeLayer(heatLayerRef.current);
    schoolMarkersRef.current.clearLayers();
    studentMarkersRef.current.clearLayers();

    // Ícone SVG estático para o popup
    const zapIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
    const shieldIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`;

    // Plotagem de Unidades Escolares
    schools.forEach(school => {
        if (!school || typeof school.lat !== 'number' || typeof school.lng !== 'number') return;

        const icon = L.divIcon({
            html: `<div class="marker-container">
                    <div class="marker-school shadow-deep">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    </div>
                    <div class="marker-label">${school.name}</div>
                   </div>`,
            className: 'custom-div-icon',
            iconSize: [44, 44]
        });

        L.marker([school.lat, school.lng], { icon })
          .bindPopup(`<div class="p-6 bg-white rounded-3xl min-w-[240px] shadow-luxury">
                        <h4 class="text-lg font-black text-slate-900 uppercase tracking-tighter mb-2 leading-none">${school.name}</h4>
                        <p class="text-[10px] text-slate-400 font-bold uppercase mb-4">${school.address}</p>
                        <div class="pt-3 border-t border-slate-50 flex justify-between items-center">
                            <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">${zapIconSvg} Base Ativa</span>
                            <span class="text-[10px] font-black text-slate-900 uppercase">Vagas: ${school.availableSlots}</span>
                        </div>
                      </div>`)
          .addTo(schoolMarkersRef.current);
    });

    // Plotagem de Alunos / Mapa de Calor
    if (activeLayer === 'heat') {
        const heatData = students
            .filter(s => s && typeof s.lat === 'number' && typeof s.lng === 'number')
            .map(s => [s.lat, s.lng, 1.0]); 
            
        if (typeof L.heatLayer === 'function' && heatData.length > 0) {
            heatLayerRef.current = L.heatLayer(heatData, { 
                radius: 40, blur: 25, maxZoom: 16,
                gradient: { 0.4: '#3b82f6', 0.65: '#10b981', 1: '#f59e0b' }
            }).addTo(mapRef.current);
        }
    } else {
        students.forEach(s => {
            if (!s || typeof s.lat !== 'number' || typeof s.lng !== 'number') return;

            const marker = L.circleMarker([s.lat, s.lng], {
                radius: 7, fillColor: '#3b82f6', color: '#fff', weight: 3, opacity: 1, fillOpacity: 1, className: 'student-pulse'
            });
            marker.bindPopup(`<div class="p-4 bg-white rounded-2xl min-w-[200px] shadow-luxury">
                <p class="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1 flex items-center gap-1.5">${shieldIconSvg} Aluno Nominal</p>
                <h4 class="font-black text-slate-900 uppercase text-xs mb-3 leading-tight">${s.name}</h4>
                <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p class="text-[8px] text-slate-500 font-black uppercase tracking-widest">Escola: ${s.school || 'Geoprocessamento SME'}</p>
                </div>
            </div>`);
            marker.addTo(studentMarkersRef.current);
        });
    }
  }, [activeLayer, students, schools, isMapReady]);

  const handleStreetSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchStreet || !mapRef.current) return;
    const term = searchStreet.toLowerCase();
    
    // Busca nominal profunda
    const match = students.find(s => 
        s && (
            (s.name && s.name.toLowerCase().includes(term)) || 
            (s.cpf && s.cpf.includes(term)) ||
            (s.address && s.address.street && s.address.street.toLowerCase().includes(term))
        )
    ) || schools.find(s => s && s.name && s.name.toLowerCase().includes(term));

    if (match && typeof match.lat === 'number' && typeof match.lng === 'number') {
        mapRef.current.flyTo([match.lat, match.lng], 18, { 
            duration: 1.8,
            easeLinearity: 0.15
        });
        addToast(`Visualizando: ${match.name}`, 'info');
    } else {
        addToast("Critério nominal não localizado no barramento.", "warning");
    }
  };

  const handleLocateMe = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
        addToast("Geolocalização não suportada pelo navegador.", "error");
        setIsLocating(false);
        return;
    }
    
    addToast("Buscando sinal GPS...", "info");
    
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;
            
            if (mapRef.current) {
                // Remove marcador anterior do usuário se existir
                if (userMarkerRef.current) {
                    mapRef.current.removeLayer(userMarkerRef.current);
                }

                mapRef.current.flyTo([latitude, longitude], 17, { 
                    duration: 2,
                    easeLinearity: 0.25 
                });

                // Cria ícone pulsante personalizado
                const userIcon = L.divIcon({
                    className: 'bg-transparent',
                    html: `<div class="relative">
                             <div class="absolute -top-3 -left-3 w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                             <div class="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                           </div>`
                });

                userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon })
                    .addTo(mapRef.current)
                    .bindPopup(`<div class="text-[10px] font-black uppercase tracking-widest text-slate-900 p-1">Sua Localização Nominal</div>`)
                    .openPopup();
            }
            
            setIsLocating(false);
            addToast("Localização nominal confirmada.", "success");
        },
        (err) => {
            console.error(err);
            addToast("Não foi possível obter sua localização.", "error");
            setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="h-[calc(100vh-80px)] bg-[#f8fafc] flex overflow-hidden page-transition m-4 rounded-[3rem] shadow-deep border-4 border-white relative">
      <div className="w-[400px] bg-white border-r border-slate-100 z-20 flex flex-col shrink-0">
        <div className="p-10 border-b border-slate-50 bg-slate-50/30">
            <button onClick={() => navigate('/dashboard')} className="mb-8 text-slate-400 hover:text-emerald-600 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition group">
                <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Dashboard SME
            </button>
            <div className="flex items-center gap-5">
                <div className="bg-[#0F172A] p-3 rounded-2xl text-emerald-400 shadow-xl"><Compass size={28} className="animate-spin-slow" /></div>
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">GeoBI.</h1>
                    <p className="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-ultra">Inteligência Territorial</p>
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
            <form onSubmit={handleStreetSearch} className="space-y-4">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3"><Navigation2 size={16} className="text-blue-500" /> Localização Nominal</h3>
                <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                    <input type="text" value={searchStreet} onChange={e => setSearchStreet(e.target.value)} placeholder="Aluno, CPF ou Logradouro..." className="input-premium pl-16 !h-16 !text-sm !bg-slate-50" />
                </div>
            </form>

            <section className="space-y-6">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3"><Layers size={16} className="text-emerald-500" /> Camadas Ativas</h3>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setActiveLayer('heat')} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${activeLayer === 'heat' ? 'bg-[#0F172A] border-[#0F172A] text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-100'}`}>
                        <Activity size={24} />
                        <span className="text-[10px] font-black uppercase">Densidade</span>
                    </button>
                    <button onClick={() => setActiveLayer('points')} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${activeLayer === 'points' ? 'bg-[#0F172A] border-[#0F172A] text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-100'}`}>
                        <MapPin size={24} />
                        <span className="text-[10px] font-black uppercase">Unidades</span>
                    </button>
                </div>
            </section>

            <section className="space-y-6">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3"><Globe size={16} className="text-blue-500" /> Modo de Exibição</h3>
                <div className="flex bg-slate-50 p-2 rounded-2xl border border-slate-100 gap-2">
                    {(['voyager', 'satellite', 'dark'] as const).map(style => (
                        <button key={style} onClick={() => { setMapStyle(style); updateMapTiles(style); }} className={`flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${mapStyle === style ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}>
                            {style === 'voyager' ? 'Ruas' : style === 'satellite' ? 'Satélite' : 'Dark'}
                        </button>
                    ))}
                </div>
            </section>
        </div>

        <div className="p-10 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <ShieldCheck className="text-emerald-500 h-5 w-5" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Auditada 2025</span>
            </div>
            <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl">Sync 24h</span>
        </div>
      </div>

      <div className="flex-1 relative bg-slate-100">
        <div id="analysis-map" className="w-full h-full z-10" />
        
        <div className="absolute top-10 left-10 z-[300] bg-white/90 backdrop-blur-xl px-8 py-5 rounded-[2.5rem] shadow-luxury flex items-center gap-6 border border-white">
            <div className="bg-[#0F172A] p-3 rounded-2xl text-emerald-400 shadow-xl"><Compass className="h-7 w-7 animate-spin-slow" /></div>
            <div>
                <span className="text-[10px] font-black text-slate-400 uppercase block tracking-ultra mb-1">Barramento Geo-Síncrono Ativo</span>
                <span className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Itaberaba • BA</span>
            </div>
        </div>

        <div className="absolute bottom-10 right-10 z-[300] flex flex-col gap-4">
            <button onClick={() => { mapRef.current.flyTo([-12.5253, -40.2917], 15, { duration: 1.5 }); mapRef.current.invalidateSize(); }} className="p-5 bg-white rounded-2xl shadow-luxury text-slate-900 hover:text-emerald-600 transition-all border border-slate-100"><Maximize size={24} /></button>
            <button 
                onClick={handleLocateMe} 
                disabled={isLocating}
                className="p-5 bg-[#0F172A] rounded-2xl shadow-deep text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLocating ? <Loader2 size={24} className="animate-spin" /> : <Navigation size={24} />}
            </button>
        </div>
      </div>

      <style>{`
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .student-pulse { animation: studentPulse 3s infinite ease-in-out; }
        @keyframes studentPulse { 0% { r: 7; opacity: 1; stroke-width: 3; } 50% { r: 11; opacity: 0.6; stroke-width: 1; } 100% { r: 7; opacity: 1; stroke-width: 3; } }
        .marker-container { display: flex; flex-direction: column; align-items: center; }
        .marker-school { background: #0F172A; color: #10b981; padding: 12px; border-radius: 16px; border: 3px solid white; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); cursor: pointer; }
        .marker-school:hover { transform: scale(1.3) rotate(8deg); z-index: 1000; background: #064e3b; }
        .marker-label { background: white; padding: 6px 14px; border-radius: 12px; font-size: 10px; font-weight: 900; text-transform: uppercase; box-shadow: 0 15px 25px -5px rgba(0,0,0,0.1); margin-top: 10px; white-space: nowrap; pointer-events: none; opacity: 0; transition: all 0.3s; border: 1px solid #f1f5f9; }
        .marker-container:hover .marker-label { opacity: 1; transform: translateY(5px); }
      `}</style>
    </div>
  );
};