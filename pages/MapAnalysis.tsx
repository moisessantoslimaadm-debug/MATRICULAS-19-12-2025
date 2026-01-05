import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from '../router';
import { 
  ArrowLeft, Layers, Search, Compass, LocateFixed, Globe,
  Loader2, Users, Flame, Map as MapIcon
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useLog } from '../contexts/LogContext';

declare const L: any;

export const MapAnalysis: React.FC = () => {
  const { schools, students } = useData();
  const { addToast } = useToast();
  const { addLog } = useLog();
  const navigate = useNavigate();
  
  const mapRef = useRef<any>(null);
  const heatLayerRef = useRef<any>(null);
  const schoolMarkersRef = useRef<any>(null);
  const studentMarkersRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const searchResultMarkerRef = useRef<any>(null);
  
  const schoolMarkerMap = useRef<Map<string, any>>(new Map());

  // Estado para alternar camadas: 'points' (marcadores individuais) ou 'heat' (mapa de calor)
  const [activeLayer, setActiveLayer] = useState<'heat' | 'points'>('points');
  const [mapStyle, setMapStyle] = useState<'streets' | 'clean' | 'satellite'>('clean'); 
  const [isMapReady, setIsMapReady] = useState(false);
  const [searchStreet, setSearchStreet] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isSearchingExternal, setIsSearchingExternal] = useState(false);

  // Integração com API de Geocodificação (Nominatim / OpenStreetMap)
  const geocodeAddress = async (query: string) => {
    try {
        // Contextualiza a busca para aumentar a precisão dentro do município
        const contextualizedQuery = `${query}, Itaberaba, Bahia, Brasil`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(contextualizedQuery)}&limit=1&addressdetails=1`;
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'EducaMunicipio-Platform/1.0 (Educational Project)'
            }
        });
        
        if (!response.ok) return null;
        
        const data = await response.json();
        if (data && Array.isArray(data) && data.length > 0 && data[0]) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                displayName: data[0].display_name,
                type: data[0].type
            };
        }
        return null;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
  };

  const tileProviders = {
    streets: { 
      base: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      labels: null 
    },
    clean: { 
      base: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      labels: null 
    },
    satellite: { 
      base: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      labels: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png' 
    }
  };

  const updateMapTiles = (style: keyof typeof tileProviders) => {
    if (!mapRef.current) return;
    mapRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) mapRef.current.removeLayer(layer);
    });
    
    L.tileLayer(tileProviders[style].base, { 
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(mapRef.current);

    if (tileProviders[style].labels) {
        L.tileLayer(tileProviders[style].labels, { 
            pane: 'shadowPane', 
            zIndex: 600,
            opacity: style === 'satellite' ? 1 : 0.8
        }).addTo(mapRef.current);
    }
  };

  useEffect(() => {
    if (!mapRef.current) {
        const map = L.map('analysis-map', {
            attributionControl: false,
            zoomControl: false,
            maxZoom: 20,
            minZoom: 14
        }).setView([-12.5253, -40.2917], 15);

        mapRef.current = map;
        updateMapTiles('clean');
        
        schoolMarkersRef.current = L.layerGroup().addTo(map);
        studentMarkersRef.current = L.layerGroup().addTo(map);
        
        setTimeout(() => map.invalidateSize(), 100);
        setIsMapReady(true);
    }
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;
    mapRef.current.invalidateSize();

    // Limpa camadas anteriores para redesenho
    if (heatLayerRef.current) mapRef.current.removeLayer(heatLayerRef.current);
    schoolMarkersRef.current.clearLayers();
    studentMarkersRef.current.clearLayers();
    schoolMarkerMap.current.clear();

    const zapIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
    
    // Renderiza Escolas (Sempre visíveis)
    if (Array.isArray(schools)) {
      schools.forEach(school => {
          if (!school || typeof school !== 'object') return;
          
          const lat = Number(school.lat);
          const lng = Number(school.lng);
          
          // Validação robusta de coordenadas geográficas
          // Verifica se é número, se não é nulo/undefined na origem, se é finito e se está nos limites do planeta
          if (
              school.lat === null || school.lat === undefined ||
              school.lng === null || school.lng === undefined ||
              isNaN(lat) || isNaN(lng) || 
              !isFinite(lat) || !isFinite(lng) || 
              Math.abs(lat) > 90 || Math.abs(lng) > 180
          ) {
              addLog(`[MapAnalysis] Escola ignorada por coordenadas inválidas: ${school.name} (ID: ${school.id}) - Lat: ${school.lat}, Lng: ${school.lng}`, 'warning');
              return;
          }

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

          const marker = L.marker([lat, lng], { icon })
            .bindPopup(`<div class="p-6 bg-white rounded-3xl min-w-[240px] shadow-luxury">
                          <h4 class="text-lg font-black text-slate-900 uppercase tracking-tighter mb-2 leading-none">${school.name}</h4>
                          <p class="text-[10px] text-slate-400 font-bold uppercase mb-4">${school.address}</p>
                          <div class="pt-3 border-t border-slate-50 flex justify-between items-center">
                              <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">${zapIconSvg} Base Ativa</span>
                              <span class="text-[10px] font-black text-slate-900 uppercase">Vagas: ${school.availableSlots}</span>
                          </div>
                        </div>`)
            .on('click', () => {
                mapRef.current.flyTo([lat, lng], 18, { 
                    duration: 1.5,
                    easeLinearity: 0.25
                });
            })
            .addTo(schoolMarkersRef.current);
          
          schoolMarkerMap.current.set(school.id, marker);
      });
    }

    // Lógica Condicional de Camadas (Heatmap vs Pontos)
    if (activeLayer === 'heat') {
        const heatData = (students || [])
            .filter(s => s && typeof s === 'object' && !isNaN(Number(s.lat)) && !isNaN(Number(s.lng)))
            .map(s => [Number(s.lat), Number(s.lng), 1.0]); // Intensidade
            
        if (typeof L.heatLayer === 'function' && heatData.length > 0) {
            heatLayerRef.current = L.heatLayer(heatData, {
                radius: 30,
                blur: 20,
                maxZoom: 17,
                gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
            }).addTo(mapRef.current);
        } else if (typeof L.heatLayer !== 'function') {
            console.warn("Leaflet.heat não carregado.");
        }
    } else {
        // Camada de Pontos Individuais
        (students || []).forEach(s => {
            if (!s || typeof s !== 'object') return;
            const sLat = Number(s.lat);
            const sLng = Number(s.lng);
            
            if (isNaN(sLat) || isNaN(sLng)) return;

            const isAEE = s.specialNeeds;
            const icon = L.divIcon({
                html: `<div class="marker-student ${isAEE ? 'is-aee' : ''}"></div>`,
                className: 'custom-div-icon',
                iconSize: [12, 12]
            });
            L.marker([sLat, sLng], { icon })
             .bindPopup(`<div class="p-4 bg-white rounded-2xl min-w-[200px] shadow-lg text-center">
                          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Censo Nominal</p>
                          <p class="font-black text-slate-900 uppercase">${s.name.split(' ')[0]}***</p>
                          <p class="text-[9px] text-slate-500 mt-2">${isAEE ? 'Público Alvo AEE' : 'Ensino Regular'}</p>
                        </div>`)
             .addTo(studentMarkersRef.current);
        });
    }
  }, [schools, students, activeLayer, isMapReady, addLog]); // Added addLog to dependency array

  useEffect(() => {
      updateMapTiles(mapStyle);
  }, [mapStyle]);

  const handleSearchLocation = async () => {
      if (!searchStreet.trim()) return;
      setIsSearchingExternal(true);
      
      const result = await geocodeAddress(searchStreet);
      
      if (result) {
          // Remove marcador anterior de busca
          if (searchResultMarkerRef.current) {
              searchResultMarkerRef.current.remove();
          }

          // Cria ícone personalizado para o resultado
          const icon = L.divIcon({
              html: `<div class="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-xl animate-bounce"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg></div>`,
              className: 'custom-div-icon',
              iconSize: [40, 40]
          });

          // Adiciona ao mapa
          searchResultMarkerRef.current = L.marker([result.lat, result.lng], { icon })
            .addTo(mapRef.current)
            .bindPopup(`<div class="text-xs font-bold text-slate-900 p-2 text-center max-w-[150px]">${result.displayName}</div>`)
            .openPopup();

          // Voa para o local
          mapRef.current.flyTo([result.lat, result.lng], 17);
          addToast("Localização encontrada.", "success");
      } else {
          addToast("Endereço não localizado em Itaberaba.", "warning");
      }
      setIsSearchingExternal(false);
  };

  const handleLocateMe = () => {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
          (pos) => {
              const { latitude, longitude } = pos.coords;
              if (userMarkerRef.current) userMarkerRef.current.remove();
              
              const icon = L.divIcon({
                  html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg pulse-ring"></div>`,
                  className: 'custom-div-icon',
                  iconSize: [16, 16]
              });

              userMarkerRef.current = L.marker([latitude, longitude], { icon }).addTo(mapRef.current);
              mapRef.current.flyTo([latitude, longitude], 16);
              setIsLocating(false);
          },
          (err) => {
              addToast("Erro ao obter localização GPS.", "error");
              setIsLocating(false);
          }
      );
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full relative bg-slate-100 overflow-hidden">
      {/* Sidebar Controls */}
      <div className="absolute top-6 left-6 z-[400] flex flex-col gap-4">
        <button onClick={() => navigate('/dashboard')} className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:scale-110 transition-all">
            <ArrowLeft className="h-5 w-5" />
        </button>
        
        <div className="bg-white p-2 rounded-3xl shadow-xl flex flex-col gap-2">
            <button onClick={() => setMapStyle('clean')} className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${mapStyle === 'clean' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`} title="Mapa Limpo">
                <Globe className="h-5 w-5" />
            </button>
            <button onClick={() => setMapStyle('streets')} className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${mapStyle === 'streets' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`} title="Ruas">
                <Compass className="h-5 w-5" />
            </button>
            <button onClick={() => setMapStyle('satellite')} className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${mapStyle === 'satellite' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`} title="Satélite">
                <Layers className="h-5 w-5" />
            </button>
        </div>

        <button onClick={handleLocateMe} className="w-12 h-12 bg-blue-600 text-white rounded-2xl shadow-xl flex items-center justify-center hover:bg-blue-700 transition-all">
            {isLocating ? <Loader2 className="h-5 w-5 animate-spin" /> : <LocateFixed className="h-5 w-5" />}
        </button>
      </div>

      {/* Layer Toggle Control (Top-Right) - CONTROLE DE CAMADAS */}
      <div className="absolute top-6 right-6 z-[400] flex flex-col gap-3">
        <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-luxury border border-white/50 flex flex-col gap-2">
            <div className="px-3 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-1 flex items-center gap-2">
               <MapIcon className="h-3 w-3" /> Camadas de Análise
            </div>
            <button 
                onClick={() => setActiveLayer('points')} 
                className={`p-3 rounded-xl flex items-center gap-3 transition-all duration-300 w-44 ${activeLayer === 'points' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                <div className={`p-1.5 rounded-lg ${activeLayer === 'points' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <Users className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Alunos (Pontos)</span>
            </button>
            <button 
                onClick={() => setActiveLayer('heat')} 
                className={`p-3 rounded-xl flex items-center gap-3 transition-all duration-300 w-44 ${activeLayer === 'heat' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                <div className={`p-1.5 rounded-lg ${activeLayer === 'heat' ? 'bg-orange-500' : 'bg-slate-100'}`}>
                    <Flame className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Mapa de Calor</span>
            </button>
        </div>
      </div>

      {/* Search Bar Overlay */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[400] w-full max-w-md px-6">
        <div className="bg-white p-2 rounded-[2rem] shadow-2xl flex items-center gap-2 border border-slate-100">
            <div className="pl-4"><Search className="h-5 w-5 text-slate-300" /></div>
            <input 
                type="text" 
                placeholder="Buscar logradouro..." 
                className="flex-1 h-12 outline-none font-semibold text-slate-700 placeholder:text-slate-300 bg-transparent text-sm"
                value={searchStreet}
                onChange={e => setSearchStreet(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearchLocation()}
            />
            <button 
                onClick={handleSearchLocation}
                disabled={isSearchingExternal}
                className="h-12 px-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2 disabled:opacity-50"
            >
                {isSearchingExternal ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buscar'}
            </button>
        </div>
      </div>

      <div id="analysis-map" className="absolute inset-0 z-0 bg-slate-200" />
      
      <style>{`
        .marker-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transform: translate(-50%, -50%);
        }
        .marker-school {
            width: 44px;
            height: 44px;
            background: white;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #059669;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 4px solid white;
        }
        .marker-school:hover {
            transform: scale(1.2) rotate(-5deg);
            color: #0f172a;
        }
        .marker-label {
            background: rgba(15, 23, 42, 0.9);
            color: white;
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            margin-top: 8px;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
            backdrop-filter: blur(4px);
        }
        .marker-container:hover .marker-label {
            opacity: 1;
        }
        .marker-student {
            width: 10px;
            height: 10px;
            background: #3b82f6;
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .marker-student.is-aee {
            background: #ec4899;
            width: 12px;
            height: 12px;
        }
        .pulse-ring {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
            animation: pulse-blue 2s infinite;
        }
        @keyframes pulse-blue {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
      `}</style>
    </div>
  );
};