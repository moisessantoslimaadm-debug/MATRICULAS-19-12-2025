import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from '../router';
import { 
  ArrowLeft, Layers, Search, Compass, LocateFixed, Globe,
  Loader2, Users, Flame, Map as MapIcon, Tag, Check, X, MapPin
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useLog } from '../contexts/LogContext';

declare const L: any;

const ZONE_COLORS: Record<string, string> = {
    'Zona A': '#ef4444', // Red
    'Zona B': '#3b82f6', // Blue
    'Zona C': '#10b981', // Emerald
    'Zona D': '#8b5cf6', // Violet
    'Zona E': '#f59e0b', // Amber
    'Zona F': '#06b6d4', // Cyan
    'Zona Rural': '#854d0e', // Brown
    'Default': '#64748b' // Slate
};

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
  const userAccuracyCircleRef = useRef<any>(null);
  const searchResultMarkerRef = useRef<any>(null);
  
  const schoolMarkerMap = useRef<Map<string, any>>(new Map());

  // Estado para alternar camadas: 'points' (marcadores individuais) ou 'heat' (mapa de calor)
  const [activeLayer, setActiveLayer] = useState<'heat' | 'points'>('points');
  const [mapStyle, setMapStyle] = useState<'streets' | 'clean' | 'satellite'>('clean'); 
  const [isMapReady, setIsMapReady] = useState(false);
  const [searchStreet, setSearchStreet] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isSearchingExternal, setIsSearchingExternal] = useState(false);

  // --- FUNÇÃO AUXILIAR DE VALIDAÇÃO GEOGRÁFICA ROBUSTA ---
  // Garante integridade de dados para evitar quebras no Leaflet
  const validateCoordinates = useCallback((lat: any, lng: any, context: string, id: string, name: string): { lat: number, lng: number } | null => {
      const nLat = Number(lat);
      const nLng = Number(lng);
      
      // Verifica: Não nulo, numérico, não-NaN, finito e dentro dos limites do globo terrestre (-90 a 90 para Lat, -180 a 180 para Lng)
      const isValid = 
          lat !== null && lat !== undefined &&
          lng !== null && lng !== undefined &&
          !isNaN(nLat) && !isNaN(nLng) && 
          isFinite(nLat) && isFinite(nLng) && 
          Math.abs(nLat) <= 90 && Math.abs(nLng) <= 180;

      if (!isValid) {
          // Loga o erro conforme solicitado e retorna null para que o item seja ignorado na renderização
          addLog(`[MapAnalysis] Dados geo inválidos ignorados (${context}): ${name} (ID: ${id}). Lat: ${lat}, Lng: ${lng}`, 'warning');
          return null;
      }
      return { lat: nLat, lng: nLng };
  }, [addLog]);

  // Integração com API de Geocodificação (Nominatim / OpenStreetMap)
  const geocodeAddress = async (query: string) => {
    try {
        // Contextualiza a busca para Itaberaba para evitar resultados globais
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
        addLog(`[MapAnalysis] Erro na geocodificação: ${error}`, 'error');
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
    
    // --- RENDERIZAÇÃO DE ESCOLAS ---
    if (Array.isArray(schools)) {
      schools.forEach(school => {
          if (!school || typeof school !== 'object') return;
          
          // Validação Robusta de Coordenadas:
          const coords = validateCoordinates(school.lat, school.lng, 'Escola', school.id, school.name);
          if (!coords) return; // Ignora escolas com coordenadas inválidas

          // Define cor baseada na Zona
          const zoneColor = school.zone && ZONE_COLORS[school.zone] ? ZONE_COLORS[school.zone] : ZONE_COLORS['Default'];

          const iconHtml = `<div class="marker-container">
                  <div class="marker-school shadow-deep" style="color: ${zoneColor}; border-color: ${zoneColor}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  </div>
                  <div class="marker-label" style="border-left: 3px solid ${zoneColor}">${school.name}</div>
               </div>`;

          const icon = L.divIcon({
              html: iconHtml,
              className: 'custom-div-icon',
              iconSize: [44, 44]
          });

          const popupContent = `<div class="p-6 bg-white rounded-3xl min-w-[240px] shadow-luxury" style="border-left: 4px solid ${zoneColor}">
                  <h4 class="text-lg font-black text-slate-900 uppercase tracking-tighter mb-2 leading-none">${school.name}</h4>
                  <p class="text-[10px] text-slate-400 font-bold uppercase mb-1">${school.address}</p>
                  <span class="inline-block px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase mb-4" style="background-color: ${zoneColor}">${school.zone || 'Zona Indefinida'}</span>
                  <div class="pt-3 border-t border-slate-50 flex justify-between items-center">
                      <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">${zapIconSvg} Base Ativa</span>
                      <span class="text-[10px] font-black text-slate-900 uppercase">Vagas: ${school.availableSlots}</span>
                  </div>
               </div>`;

          const marker = L.marker([coords.lat, coords.lng], { icon, zIndexOffset: 0 })
            .bindPopup(popupContent)
            .on('click', () => {
                mapRef.current.flyTo([coords.lat, coords.lng], 18, { 
                    animate: true,
                    duration: 1.5,
                    easeLinearity: 0.25
                });
                marker.openPopup();
            })
            .addTo(schoolMarkersRef.current);
          
          schoolMarkerMap.current.set(school.id, marker);
      });
    }

    // --- RENDERIZAÇÃO DE ALUNOS (CAMADAS ALTERNÁVEIS) ---
    // O controle na interface define 'activeLayer'
    if (activeLayer === 'heat') {
        const heatData: any[] = [];
        
        (students || []).forEach(s => {
            if (!s || typeof s !== 'object') return;
            // Valida coordenadas do aluno também para evitar erros no heatmap
            const coords = validateCoordinates(s.lat, s.lng, 'Aluno Heatmap', s.id, s.name);
            if (coords) {
                // Intensidade padrão 1.0, pode ser ajustado por critério
                heatData.push([coords.lat, coords.lng, 1.0]);
            }
        });
            
        if (typeof L.heatLayer === 'function' && heatData.length > 0) {
            heatLayerRef.current = L.heatLayer(heatData, {
                radius: 30,
                blur: 20,
                maxZoom: 17,
                gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
            }).addTo(mapRef.current);
        } else if (typeof L.heatLayer !== 'function') {
            console.warn("Leaflet.heat não carregado. Verifique o index.html.");
            addLog("[MapAnalysis] Leaflet.heat não disponível.", 'error');
        }
    } else {
        // Camada de Pontos Individuais
        (students || []).forEach(s => {
            if (!s || typeof s !== 'object') return;
            // Valida coordenadas do aluno
            const coords = validateCoordinates(s.lat, s.lng, 'Aluno Ponto', s.id, s.name);
            if (!coords) return;

            const isAEE = s.specialNeeds;
            // Encontra a escola do aluno para determinar a cor da zona
            const studentSchool = schools.find(sch => sch.name === s.school || sch.id === s.schoolId);
            const zoneColor = studentSchool && studentSchool.zone && ZONE_COLORS[studentSchool.zone] ? ZONE_COLORS[studentSchool.zone] : ZONE_COLORS['Default'];

            const icon = L.divIcon({
                html: `<div class="marker-student ${isAEE ? 'is-aee' : ''}" style="background-color: ${zoneColor};"></div>`,
                className: 'custom-div-icon',
                iconSize: [10, 10]
            });
            L.marker([coords.lat, coords.lng], { icon })
             .bindPopup(`<div class="p-4 bg-white rounded-2xl min-w-[200px] shadow-lg text-center" style="border-top: 3px solid ${zoneColor}">
                          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Censo Nominal</p>
                          <p class="font-black text-slate-900 uppercase">${s.name.split(' ')[0]}***</p>
                          <p class="text-[9px] text-slate-500 mt-2">${isAEE ? 'Público Alvo AEE' : 'Ensino Regular'}</p>
                          <p class="text-[8px] font-bold uppercase mt-1" style="color: ${zoneColor}">${studentSchool?.zone || 'Zona N/A'}</p>
                        </div>`)
             .addTo(studentMarkersRef.current);
        });
    }
  }, [schools, students, activeLayer, isMapReady, addLog, validateCoordinates]);

  useEffect(() => {
      updateMapTiles(mapStyle);
  }, [mapStyle]);

  const handleSearchLocation = async () => {
      if (!searchStreet.trim()) return;
      setIsSearchingExternal(true);
      
      const result = await geocodeAddress(searchStreet);
      
      if (result) {
          // Validação robusta também para o resultado da busca
          const coords = validateCoordinates(result.lat, result.lng, 'Busca Endereço', 'search-result', result.displayName);
          if (!coords) {
             addToast("Endereço retornado com coordenadas inválidas.", "error");
             setIsSearchingExternal(false);
             return;
          }

          if (searchResultMarkerRef.current) {
              searchResultMarkerRef.current.remove();
          }

          const icon = L.divIcon({
              html: `<div class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-2xl border-4 border-white animate-bounce relative z-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                     </div>`,
              className: 'custom-div-icon',
              iconSize: [48, 48],
              iconAnchor: [24, 48],
              popupAnchor: [0, -50]
          });

          searchResultMarkerRef.current = L.marker([coords.lat, coords.lng], { icon, zIndexOffset: 1000 })
            .addTo(mapRef.current)
            .bindPopup(`<div class="text-xs font-bold text-slate-900 p-2 text-center max-w-[200px]">
                          <p class="uppercase leading-tight">${result.displayName.split(',')[0]}</p>
                          <p class="text-[9px] text-slate-400 mt-1">Localizado via Nominatim</p>
                        </div>`)
            .openPopup();

          mapRef.current.flyTo([coords.lat, coords.lng], 18, {
              animate: true,
              duration: 2.0
          });
          
          addToast("Localização encontrada com precisão.", "success");
      } else {
          addToast("Endereço não localizado em Itaberaba. Tente especificar o bairro.", "warning");
      }
      setIsSearchingExternal(false);
  };

  const handleClearSearch = () => {
      setSearchStreet('');
      if (searchResultMarkerRef.current) {
          searchResultMarkerRef.current.remove();
          searchResultMarkerRef.current = null;
      }
  };

  const handleLocateMe = () => {
      setIsLocating(true);
      if (!navigator.geolocation) {
          addToast("Seu navegador não suporta geolocalização.", "error");
          setIsLocating(false);
          return;
      }

      navigator.geolocation.getCurrentPosition(
          (pos) => {
              const { latitude, longitude, accuracy } = pos.coords;
              
              // Validação robusta também para o GPS do usuário
              const coords = validateCoordinates(latitude, longitude, 'GPS Usuário', 'user-loc', 'Minha Localização');
              if (!coords) {
                  addToast("GPS retornou coordenadas inválidas ou fora dos limites.", "error");
                  setIsLocating(false);
                  return;
              }

              if (userMarkerRef.current) mapRef.current.removeLayer(userMarkerRef.current);
              if (userAccuracyCircleRef.current) mapRef.current.removeLayer(userAccuracyCircleRef.current);
              
              const icon = L.divIcon({
                  html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg pulse-ring"></div>`,
                  className: 'custom-div-icon',
                  iconSize: [16, 16]
              });

              userMarkerRef.current = L.marker([coords.lat, coords.lng], { 
                  icon,
                  zIndexOffset: 1000 
              })
              .addTo(mapRef.current)
              .bindPopup(`<div class="text-center p-1"><p class="text-xs font-black text-slate-900 uppercase">Sua Localização</p><p class="text-[9px] text-slate-500">Precisão: ~${Math.round(accuracy)}m</p></div>`)
              .openPopup();

              userAccuracyCircleRef.current = L.circle([coords.lat, coords.lng], {
                  radius: accuracy,
                  color: '#3b82f6',
                  fillColor: '#3b82f6',
                  fillOpacity: 0.1,
                  weight: 1,
                  dashArray: '4, 4'
              }).addTo(mapRef.current);
              
              const bounds = userAccuracyCircleRef.current.getBounds();
              mapRef.current.flyToBounds(bounds, {
                  padding: [50, 50],
                  animate: true,
                  duration: 2.0,
                  maxZoom: 18
              });
              
              addToast("Localização GPS atualizada.", "success");
              setIsLocating(false);
          },
          (err) => {
              console.error(err);
              addToast("Permissão de localização negada ou erro no GPS.", "error");
              setIsLocating(false);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
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

        <button 
            onClick={handleLocateMe} 
            className="w-12 h-12 bg-blue-600 text-white rounded-2xl shadow-xl flex items-center justify-center hover:bg-blue-700 transition-all active:scale-95"
            title="Minha Localização"
        >
            {isLocating ? <Loader2 className="h-5 w-5 animate-spin" /> : <LocateFixed className="h-5 w-5" />}
        </button>
      </div>

      {/* CONTROLE DE CAMADAS (TOGGLE) */}
      <div className="absolute top-6 right-6 z-[400] flex flex-col gap-3">
        <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-luxury border border-white/50 flex flex-col gap-2 animate-in slide-in-from-top-4">
            <div className="px-3 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-1 flex items-center gap-2">
               <MapIcon className="h-3 w-3" /> Visualização
            </div>
            
            <button 
                onClick={() => setActiveLayer('points')} 
                className={`p-3 rounded-xl flex items-center gap-3 transition-all duration-300 w-44 group ${activeLayer === 'points' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                <div className={`p-1.5 rounded-lg transition-colors ${activeLayer === 'points' ? 'bg-slate-800' : 'bg-slate-100 group-hover:bg-white'}`}>
                    <Users className="h-4 w-4" />
                </div>
                <div className="flex-1 text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest block">Alunos (Pontos)</span>
                    <span className="text-[8px] font-medium opacity-60">Localização exata</span>
                </div>
                {activeLayer === 'points' && <Check className="h-3 w-3 text-emerald-400" />}
            </button>

            <button 
                onClick={() => setActiveLayer('heat')} 
                className={`p-3 rounded-xl flex items-center gap-3 transition-all duration-300 w-44 group ${activeLayer === 'heat' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                <div className={`p-1.5 rounded-lg transition-colors ${activeLayer === 'heat' ? 'bg-orange-500' : 'bg-slate-100 group-hover:bg-white'}`}>
                    <Flame className="h-4 w-4" />
                </div>
                <div className="flex-1 text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest block">Mapa de Calor</span>
                    <span className="text-[8px] font-medium opacity-60">Densidade demográfica</span>
                </div>
                {activeLayer === 'heat' && <Check className="h-3 w-3 text-white" />}
            </button>
        </div>

        {/* LEGENDA DE ZONAS */}
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-luxury border border-white/50 flex flex-col gap-2 animate-in slide-in-from-right-4 duration-500">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                <Tag className="h-3 w-3" /> Zonas Territoriais
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {Object.entries(ZONE_COLORS).filter(([key]) => key !== 'Default').map(([zone, color]) => (
                    <div key={zone} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: color }}></div>
                        <span className="text-[9px] font-bold text-slate-700 uppercase">{zone}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Search Bar Overlay */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[400] w-full max-w-md px-6">
        <div className="bg-white p-2 rounded-[2rem] shadow-2xl flex items-center gap-2 border border-slate-100">
            <div className="pl-4"><Search className="h-5 w-5 text-slate-300" /></div>
            <input 
                type="text" 
                placeholder="Buscar ruas, bairros ou logradouros..." 
                className="flex-1 h-12 outline-none font-semibold text-slate-700 placeholder:text-slate-300 bg-transparent text-sm"
                value={searchStreet}
                onChange={e => setSearchStreet(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearchLocation()}
            />
            {searchStreet && (
                <button onClick={handleClearSearch} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <X className="h-4 w-4" />
                </button>
            )}
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
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 4px solid white;
        }
        .marker-school:hover {
            transform: scale(1.2) rotate(-5deg);
            z-index: 1000;
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
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .marker-student.is-aee {
            width: 12px;
            height: 12px;
            border-color: #ec4899;
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