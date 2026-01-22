import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  MapPin,
  Leaf,
  BarChart3,
  DollarSign
} from 'lucide-react';

interface StateData {
  name: string;
  production: number;
  mainProducts: string[];
  marketValue: number;
  farmers: number;
  rank: number;
}

// Extract production from description string
const extractProduction = (description: string): number => {
  const match = description.match(/(\d+\.?\d*)M\s+tonnes/);
  return match ? parseFloat(match[1]) : 0;
};

// Mapping from SimpleMaps codes to state names
const codeToStateMap: { [key: string]: string } = {
  'INRJ': 'Rajasthan',
  'INMP': 'Madhya Pradesh',
  'INGJ': 'Gujarat',
  'INAP': 'Andhra Pradesh',
  'INKA': 'Karnataka',
  'INTN': 'Tamil Nadu',
  'INUP': 'Uttar Pradesh',
  'INPB': 'Punjab',
  'INMH': 'Maharashtra',
  'INWB': 'West Bengal',
  'INHR': 'Haryana',
  'INTG': 'Telangana',
  'INAS': 'Assam',
  'INBR': 'Bihar',
  'INJH': 'Jharkhand',
  'INOR': 'Orissa',
  'INCH': 'Chhattisgarh'
};

// State data - will be populated from map config
const statesData: { [key: string]: StateData } = {};

// SimpleMaps configuration - EXACTLY as you provided
const getMapConfig = () => {
  return {
    main_settings: {
      width: "responsive",
      background_color: "#FFFFFF",
      background_transparent: "yes",
      border_color: "#ffffff",
      
      state_description: "State description",
      state_color: "#88A4BC",
      state_hover_color: "#3B729F",
      state_url: "",
      border_size: 1.5,
      all_states_inactive: "no",
      all_states_zoomable: "yes",
      
      location_description: "Location description",
      location_url: "",
      location_color: "#FF0067",
      location_opacity: 0.8,
      location_hover_opacity: 1,
      location_size: 25,
      location_type: "square",
      location_image_source: "frog.png",
      location_border_color: "#FFFFFF",
      location_border: 2,
      location_hover_border: 2.5,
      all_locations_inactive: "no",
      all_locations_hidden: "no",
      
      label_color: "#ffffff",
      label_hover_color: "#ffffff",
      label_size: 16,
      label_font: "Arial",
      label_display: "auto",
      label_scale: "yes",
      hide_labels: "no",
      hide_eastern_labels: "no",
     
      zoom: "yes",
      manual_zoom: "yes",
      back_image: "no",
      initial_back: "no",
      initial_zoom: "-1",
      initial_zoom_solo: "no",
      region_opacity: 1,
      region_hover_opacity: 0.6,
      zoom_out_incrementally: "yes",
      zoom_percentage: 0.99,
      zoom_time: 0.5,
      
      popup_color: "white",
      popup_opacity: 0.9,
      popup_shadow: 1,
      popup_corners: 5,
      popup_font: "12px/1.5 Verdana, Arial, Helvetica, sans-serif",
      popup_nocss: "no",
      
      div: "map",
      auto_load: "yes",
      url_new_tab: "no",
      images_directory: "default",
      fade_time: 0.1,
      link_text: "View Website",
      popups: "detect",
      state_image_url: "",
      state_image_position: "",
      location_image_url: ""
    },
    state_specific: {
      INAN: {
        name: "Andaman and Nicobar",
        hover_color: "green",
        description: "Oilseed production per year 0.0M tonnes"
      },
      INAP: {
        name: "Andhra Pradesh",
        hover_color: "green",
        description: "Oilseed production per year 3.7M tonnes"
      },
      INAR: {
        name: "Arunachal Pradesh",
        hover_color: "green",
        description: "Oilseed production per year 3.7M tonnes"
      },
      INAS: {
        name: "Assam",
        hover_color: "green",
        description: "Oilseed production per year 2.6M tonnes"
      },
      INBR: {
        name: "Bihar",
        hover_color: "green",
        description: "Oilseed production per year 1.5M tonnes"
      },
      INCH: {
        description: "Oilseed production per year 0.8M tonnes",
        name: "Chhattisgarh",
        hover_color: "green"
      },
      INCT: {
        name: "Chhattisgarh",
        hover_color: "green",
        description: "Oilseed production per year 0.8M tonnes"
      },
      INDH: {
        name: "Mizoram",
        hover_color: "green",
        description: "Oilseed production per year 0.02M tonnes"
      },
      INDL: {
        name: "Delhi",
        hover_color: "green",
        description: "Oilseed production per year 0.05M tonnes"
      },
      INGA: {
        name: "Goa",
        hover_color: "green",
        description: "Oilseed production per year 0.001M tonnes"
      },
      INGJ: {
        name: "Gujarat",
        hover_color: "green",
        description: "Oilseed production per year 72.7M tonnes"
      },
      INHP: {
        name: "Himachal Pradesh",
        hover_color: "green",
        description: "Oilseed production per year 0.074M tonnes"
      },
      INHR: {
        name: "Haryana",
        hover_color: "green",
        description: "Oilseed production per year 13.8M tonnes"
      },
      INJH: {
        name: "Jharkhand",
        hover_color: "green",
        description: "Oilseed production per year 3.7M tonnes"
      },
      INJK: {
        name: "Jammu and Kashmir",
        hover_color: "green",
        description: "Oilseed production per year 0.38M tonnes"
      },
      INKA: {
        name: "Karnataka",
        hover_color: "green",
        description: "Oilseed production per year 7.5M tonnes"
      },
      INKL: {
        name: "Kerala",
        hover_color: "green",
        description: "Oilseed production per year 0.07M tonnes"
      },
      INLA: {
        name: "Ladakh",
        hover_color: "green",
        description: "Oilseed production per year 0.01M tonnes"
      },
      INLD: {
        name: "Lakshadweep",
        hover_color: "green",
        description: "Oilseed production per year 0.0M tonnes"
      },
      INMH: {
        name: "Maharashtra",
        hover_color: "green",
        description: "Oilseed production per year 55.9M tonnes"
      },
      INML: {
        name: "Meghalaya",
        hover_color: "green",
        description: "Oilseed production per year 0.15M tonnes"
      },
      INMN: {
        name: "Manipur",
        hover_color: "green",
        description: "Oilseed production per year 0.27M tonnes"
      },
      INMP: {
        name: "Madhya Pradesh",
        hover_color: "green",
        description: "Oilseed production per year 85.7M tonnes"
      },
      INMZ: {
        name: "Mizoram",
        hover_color: "green",
        description: "Oilseed production per year 0.02M tonnes"
      },
      INNL: {
        name: "Nagaland",
        hover_color: "green",
        description: "Oilseed production per year 0.4M tonnes"
      },
      INOR: {
        name: "Orissa",
        hover_color: "green",
        description: "Oilseed production per year 0.0M tonnes"
      },
      INPB: {
        name: "Punjab",
        hover_color: "green",
        description: "Oilseed production per year 0.74M tonnes"
      },
      INPY: {
        name: "Puducherry",
        hover_color: "green",
        description: "Oilseed production per year 0.01M tonnes"
      },
      INRJ: {
        name: "Rajasthan",
        hover_color: "green",
        description: "Oilseed production per year 93.6M tonnes"
      },
      INSK: {
        name: "Sikkim",
        hover_color: "green",
        description: "Oilseed production per year 0.02M tonnes"
      },
      INTG: {
        name: "Telangana",
        hover_color: "green",
        description: "Oilseed production per year 5.2M tonnes"
      },
      INTN: {
        name: "Tamil Nadu",
        hover_color: "green",
        description: "Oilseed production per year 9.1M tonnes"
      },
      INTR: {
        name: "Tripura",
        hover_color: "green",
        description: "Oilseed production per year 0.11M tonnes"
      },
      INUP: {
        name: "Uttar Pradesh",
        hover_color: "green",
        description: "Oilseed production per year 22.3M tonnes"
      },
      INUT: {
        name: "Uttaranchal",
        hover_color: "green",
        description: "Oilseed production per year 0.0M tonnes"
      },
      INWB: {
        name: "West Bengal",
        hover_color: "green",
        description: "Oilseed production per year 13.3M tonnes"
      }
    },
    locations: {
      "0": {
        name: "New Delhi",
        lat: "28.6",
        lng: "77.2"
      }
    },
    labels: {
      "0": {
        name: "Andaman and Nicobar",
        parent_id: "INAN"
      },
      "1": {
        name: "Andhra Pradesh",
        parent_id: "INAP"
      },
      "2": {
        name: "Arunachal Pradesh",
        parent_id: "INAR"
      },
      "3": {
        name: "Assam",
        parent_id: "INAS"
      },
      "4": {
        name: "Bihar",
        parent_id: "INBR"
      },
      "5": {
        name: "Chandigarh",
        parent_id: "INCH"
      },
      "6": {
        name: "Chhattisgarh",
        parent_id: "INCT"
      },
      "7": {
        name: "Dādra and Nagar Haveli and Damān and Diu",
        parent_id: "INDH"
      },
      "8": {
        name: "Delhi",
        parent_id: "INDL"
      },
      "9": {
        name: "Goa",
        parent_id: "INGA"
      },
      "10": {
        name: "Gujarat",
        parent_id: "INGJ"
      },
      "11": {
        name: "Himachal Pradesh",
        parent_id: "INHP"
      },
      "12": {
        name: "Haryana",
        parent_id: "INHR"
      },
      "13": {
        name: "Jharkhand",
        parent_id: "INJH"
      },
      "14": {
        name: "Jammu and Kashmir",
        parent_id: "INJK"
      },
      "15": {
        name: "Karnataka",
        parent_id: "INKA"
      },
      "16": {
        name: "Kerala",
        parent_id: "INKL"
      },
      "17": {
        name: "Ladakh",
        parent_id: "INLA"
      },
      "18": {
        name: "Lakshadweep",
        parent_id: "INLD"
      },
      "19": {
        name: "Maharashtra",
        parent_id: "INMH"
      },
      "20": {
        name: "Meghalaya",
        parent_id: "INML"
      },
      "21": {
        name: "Manipur",
        parent_id: "INMN"
      },
      "22": {
        name: "Madhya Pradesh",
        parent_id: "INMP"
      },
      "23": {
        name: "Mizoram",
        parent_id: "INMZ"
      },
      "24": {
        name: "Nagaland",
        parent_id: "INNL"
      },
      "25": {
        name: "Orissa",
        parent_id: "INOR"
      },
      "26": {
        name: "Punjab",
        parent_id: "INPB"
      },
      "27": {
        name: "Puducherry",
        parent_id: "INPY"
      },
      "28": {
        name: "Rajasthan",
        parent_id: "INRJ"
      },
      "29": {
        name: "Sikkim",
        parent_id: "INSK"
      },
      "30": {
        name: "Telangana",
        parent_id: "INTG"
      },
      "31": {
        name: "Tamil Nadu",
        parent_id: "INTN"
      },
      "32": {
        name: "Tripura",
        parent_id: "INTR"
      },
      "33": {
        name: "Uttar Pradesh",
        parent_id: "INUP"
      },
      "34": {
        name: "Uttaranchal",
        parent_id: "INUT"
      },
      "35": {
        name: "West Bengal",
        parent_id: "INWB"
      },
      "36": {
        name: "New Delhi",
        x: "346.70",
        y: "322.17",
        parent_type: "location",
        parent_id: "0"
      },
      INAN: {
        name: "Andaman and Nicobar",
        parent_id: "INAN"
      },
      INAP: {
        name: "Andhra Pradesh",
        parent_id: "INAP"
      },
      INAR: {
        name: "Arunachal Pradesh",
        parent_id: "INAR"
      },
      INAS: {
        name: "Assam",
        parent_id: "INAS"
      },
      INBR: {
        name: "Bihar",
        parent_id: "INBR"
      },
      INCH: {
        name: "Chandigarh",
        parent_id: "INCH"
      },
      INCT: {
        name: "Chhattisgarh",
        parent_id: "INCT"
      },
      INDH: {
        name: "Dādra and Nagar Haveli and Damān and Diu",
        parent_id: "INDH"
      },
      INDL: {
        name: "Delhi",
        parent_id: "INDL"
      },
      INGA: {
        name: "Goa",
        parent_id: "INGA"
      },
      INGJ: {
        name: "Gujarat",
        parent_id: "INGJ"
      },
      INHP: {
        name: "Himachal Pradesh",
        parent_id: "INHP"
      },
      INHR: {
        name: "Haryana",
        parent_id: "INHR"
      },
      INJH: {
        name: "Jharkhand",
        parent_id: "INJH"
      },
      INJK: {
        name: "Jammu and Kashmir",
        parent_id: "INJK"
      },
      INKA: {
        name: "Karnataka",
        parent_id: "INKA"
      },
      INKL: {
        name: "Kerala",
        parent_id: "INKL"
      },
      INLA: {
        name: "Ladakh",
        parent_id: "INLA"
      },
      INLD: {
        name: "Lakshadweep",
        parent_id: "INLD"
      },
      INMH: {
        name: "Maharashtra",
        parent_id: "INMH"
      },
      INML: {
        name: "Meghalaya",
        parent_id: "INML"
      },
      INMN: {
        name: "Manipur",
        parent_id: "INMN"
      },
      INMP: {
        name: "Madhya Pradesh",
        parent_id: "INMP"
      },
      INMZ: {
        name: "Mizoram",
        parent_id: "INMZ"
      },
      INNL: {
        name: "Nagaland",
        parent_id: "INNL"
      },
      INOR: {
        name: "Orissa",
        parent_id: "INOR"
      },
      INPB: {
        name: "Punjab",
        parent_id: "INPB"
      },
      INPY: {
        name: "Puducherry",
        parent_id: "INPY"
      },
      INRJ: {
        name: "Rajasthan",
        parent_id: "INRJ"
      },
      INSK: {
        name: "Sikkim",
        parent_id: "INSK"
      },
      INTG: {
        name: "Telangana",
        parent_id: "INTG"
      },
      INTN: {
        name: "Tamil Nadu",
        parent_id: "INTN"
      },
      INTR: {
        name: "Tripura",
        parent_id: "INTR"
      },
      INUP: {
        name: "Uttar Pradesh",
        parent_id: "INUP"
      },
      INUT: {
        name: "Uttaranchal",
        parent_id: "INUT"
      },
      INWB: {
        name: "West Bengal",
        parent_id: "INWB"
      }
    },
    legend: {
      entries: []
    },
    regions: {}
  };
};

const ProfessionalIndiaMap = () => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInitializedRef = useRef(false);
  const { t } = useTranslation();

  // Populate statesData from map config (from mapdata.js or fallback)
  useEffect(() => {
    const populateStatesData = () => {
      // Try to get mapdata from global variable first, otherwise use fallback
      const mapConfig = (window as any).simplemaps_countrymap_mapdata || getMapConfig();
      
      Object.entries(mapConfig.state_specific).forEach(([code, stateInfo]: [string, any]) => {
        const stateName = stateInfo.name;
        if (codeToStateMap[code] || stateName) {
          const production = extractProduction(stateInfo.description || '0.0M tonnes');
          if (!statesData[stateName]) {
            statesData[stateName] = {
              name: stateName,
              production: production,
              mainProducts: ['Oilseeds'],
              marketValue: Math.round(production * 300),
              farmers: Math.round(production * 50),
              rank: 0
            };
          }
        }
      });
      
      // Calculate ranks
      const sortedStates = Object.values(statesData).sort((a, b) => b.production - a.production);
      sortedStates.forEach((state, index) => {
        state.rank = index + 1;
      });
    };

    // Try immediately, then retry after a delay in case mapdata.js loads later
    populateStatesData();
    const timer = setTimeout(populateStatesData, 1000);
    return () => clearTimeout(timer);
  }, []);

  const totalProduction = Object.values(statesData).reduce((sum, state) => sum + state.production, 0);
  const totalMarketValue = Object.values(statesData).reduce((sum, state) => sum + state.marketValue, 0);
  const totalFarmers = Object.values(statesData).reduce((sum, state) => sum + state.farmers, 0);

  const handleStateClick = (stateName: string) => {
    const state = statesData[stateName];
    if (state) {
      setSelectedState(state);
    }
  };

  useEffect(() => {
    // Load mapdata.js first, then SimpleMaps library
    const loadMapData = () => {
      // Check if mapdata is already loaded
      if (typeof (window as any).simplemaps_countrymap_mapdata !== 'undefined') {
        loadSimpleMapsLibrary();
        return;
      }

      // Load mapdata.js
      const mapDataScript = document.createElement('script');
      mapDataScript.src = '/mapdata.js';
      mapDataScript.onload = () => {
        // After mapdata.js loads, load the SimpleMaps library
        loadSimpleMapsLibrary();
      };
      mapDataScript.onerror = () => {
        const errorMsg = 'mapdata.js not found. Please ensure mapdata.js is in the public directory.';
        console.error(errorMsg);
        setMapError(errorMsg);
      };
      document.head.appendChild(mapDataScript);
    };

    const loadSimpleMapsLibrary = () => {
      // Check if library is already loaded
      if (typeof (window as any).simplemaps_countrymap !== 'undefined') {
        initializeMap();
        return;
      }

      // Try to load SimpleMaps library from common paths
      const scriptPaths = [
        '/simplemaps/countrymap.js',
        '/simplemaps/india_map.js',
        '/countrymap.js',
        '/india_map.js',
        'https://simplemaps.com/lib/1.0.0/simplemaps_countrymap.js'
      ];

      let scriptIndex = 0;
      const tryLoadScript = () => {
        if (scriptIndex >= scriptPaths.length) {
          const errorMsg = 'SimpleMaps library not found. Please place the SimpleMaps JavaScript file (countrymap.js or india_map.js) in the public directory.';
          console.error(errorMsg);
          setMapError(errorMsg);
          return;
        }

        const script = document.createElement('script');
        script.src = scriptPaths[scriptIndex];
        script.onload = () => {
          if (typeof (window as any).simplemaps_countrymap !== 'undefined') {
            initializeMap();
          } else {
            scriptIndex++;
            tryLoadScript();
          }
        };
        script.onerror = () => {
          scriptIndex++;
          tryLoadScript();
        };
        document.head.appendChild(script);
      };

      tryLoadScript();
    };

    const initializeMap = () => {
      if (mapInitializedRef.current) return;
      
      try {
        // Use mapdata from mapdata.js (already loaded as global variable)
        // If not available, use our config as fallback
        if (typeof (window as any).simplemaps_countrymap_mapdata === 'undefined') {
          const mapConfig = getMapConfig();
          (window as any).simplemaps_countrymap_mapdata = mapConfig;
        }
        
        // Initialize the map
        if ((window as any).simplemaps_countrymap && (window as any).simplemaps_countrymap.load) {
          (window as any).simplemaps_countrymap.load();
          setMapLoaded(true);
          setMapError(null);
        } else {
          throw new Error('SimpleMaps load function not available');
        }
        
        mapInitializedRef.current = true;

        // Add click event listeners to states after map loads
        const addEventListeners = () => {
          const stateElements = document.querySelectorAll('[id^="IN"]');
          if (stateElements.length === 0) {
            // Retry if map not fully loaded
            setTimeout(addEventListeners, 500);
            return;
          }
          
          stateElements.forEach((element) => {
            const stateCode = element.id;
            const stateName = codeToStateMap[stateCode] || (element as HTMLElement).getAttribute('data-name');
            if (stateName && statesData[stateName]) {
              element.addEventListener('click', () => {
                handleStateClick(stateName);
              });
              element.addEventListener('mouseenter', () => {
                setHoveredState(stateName);
              });
              element.addEventListener('mouseleave', () => {
                setHoveredState(null);
              });
            }
          });
        };

        setTimeout(addEventListeners, 1000);
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Failed to initialize map. Please check browser console for details.');
      }
    };

    loadMapData();

    // Cleanup
    return () => {
      mapInitializedRef.current = false;
    };
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-4 text-center">
        <h2 className="text-4xl font-bold flex items-center justify-center gap-3">
          <div className="flex gap-1">
            <div className="w-3 h-8 rounded" style={{ backgroundColor: '#FF9933' }} />
            <div className="w-3 h-8 rounded bg-white border border-gray-300" />
            <div className="w-3 h-8 rounded" style={{ backgroundColor: '#138808' }} />
          </div>
          {t('professionalMap.title')}
          <div className="flex gap-1">
            <div className="w-3 h-8 rounded" style={{ backgroundColor: '#FF9933' }} />
            <div className="w-3 h-8 rounded bg-white border border-gray-300" />
            <div className="w-3 h-8 rounded" style={{ backgroundColor: '#138808' }} />
          </div>
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {t('professionalMap.subtitle')}
        </p>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-transparent">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                <span className="text-sm text-muted-foreground">{t('professionalMap.stats.totalProduction')}</span>
              </div>
              <p className="text-3xl font-bold text-green-600">{totalProduction.toFixed(1)}M</p>
              <p className="text-xs text-muted-foreground">{t('professionalMap.stats.millionTonnes')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-transparent">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-muted-foreground">{t('professionalMap.stats.marketValue')}</span>
              </div>
              <p className="text-3xl font-bold text-blue-600">₹{totalMarketValue}Cr</p>
              <p className="text-xs text-muted-foreground">{t('professionalMap.stats.industryValue')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-transparent">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-muted-foreground">{t('professionalMap.stats.farmers')}</span>
              </div>
              <p className="text-3xl font-bold text-purple-600">{totalFarmers}K+</p>
              <p className="text-xs text-muted-foreground">{t('professionalMap.stats.engagedFarmers')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-transparent">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-muted-foreground">{t('professionalMap.stats.growthRate')}</span>
              </div>
              <p className="text-3xl font-bold text-orange-600">+12.5%</p>
              <p className="text-xs text-muted-foreground">{t('professionalMap.stats.yoy')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <Card className="lg:col-span-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="flex gap-1">
                <div className="w-2 h-6 rounded" style={{ backgroundColor: '#FF9933' }} />
                <div className="w-2 h-6 rounded bg-white border border-gray-300" />
                <div className="w-2 h-6 rounded" style={{ backgroundColor: '#138808' }} />
              </div>
                {t('professionalMap.mapCard.title')}
            </CardTitle>
            <CardDescription className="text-gray-600">
                {t('professionalMap.mapCard.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-6 rounded-lg relative border-4 border-gray-300 shadow-2xl overflow-hidden">
              {mapError ? (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-semibold text-gray-700 mb-2">{t('professionalMap.error.title')}</p>
                  <p className="text-sm text-gray-600 mb-4">{mapError}</p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
                      <p className="text-sm font-semibold text-yellow-800 mb-2">{t('professionalMap.error.stepsTitle')}</p>
                    <ol className="text-xs text-yellow-700 list-decimal list-inside space-y-1">
                        <li>{t('professionalMap.error.step1')}</li>
                        <li>{t('professionalMap.error.step2')}
                        <ul className="list-disc list-inside ml-4 mt-1">
                            <li><code className="bg-yellow-100 px-1 rounded">/public/simplemaps/countrymap.js</code></li>
                            <li><code className="bg-yellow-100 px-1 rounded">/public/countrymap.js</code></li>
                            <li><code className="bg-yellow-100 px-1 rounded">/public/india_map.js</code></li>
                        </ul>
                      </li>
                        <li>{t('professionalMap.error.step3')} <code className="bg-yellow-100 px-1 rounded">/public/mapdata.js</code></li>
                        <li>{t('professionalMap.error.step4')}</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <>
                  <div 
                    id="map" 
                    ref={mapContainerRef}
                    className="w-full"
                    style={{ minHeight: '600px', height: '600px' }}
                  />
                  {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                          <p className="text-sm text-gray-600">{t('professionalMap.loading')}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
              
            </div>
          </CardContent>
        </Card>

        {/* State Details */}
        <Card className="border-green-200 h-fit shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="text-xl text-gray-800">
              {selectedState ? selectedState.name : t('professionalMap.stateCard.select')}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {selectedState ? t('professionalMap.stateCard.rank', { rank: selectedState.rank }) : t('professionalMap.stateCard.helper')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {selectedState ? (
              <>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 mb-2 font-medium">{t('professionalMap.stateCard.annualProduction')}</p>
                    <p className="text-3xl font-bold text-green-700">
                      {selectedState.production}M tonnes
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{t('professionalMap.stateCard.annualHelper')}</p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 mb-2 font-medium">{t('professionalMap.stateCard.marketValue')}</p>
                    <p className="text-3xl font-bold text-blue-700">
                      ₹{selectedState.marketValue} Cr
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{t('professionalMap.stateCard.marketHelper')}</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-gray-600 mb-2 font-medium">{t('professionalMap.stateCard.farmers')}</p>
                    <p className="text-3xl font-bold text-purple-700">
                      {selectedState.farmers}K+
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{t('professionalMap.stateCard.farmersHelper')}</p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-gray-600 mb-3 font-medium">{t('professionalMap.stateCard.products')}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedState.mainProducts.map((product, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-orange-100 text-orange-800 px-3 py-1 text-sm">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p className="text-sm font-medium">{t('professionalMap.stateCard.emptyTitle')}</p>
                <p className="text-xs mt-2">{t('professionalMap.stateCard.emptyHelper')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Producers */}
      <Card className="border-green-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
            <TrendingUp className="w-6 h-6 text-green-600" />
            {t('professionalMap.topProducers')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {Object.values(statesData)
              .sort((a, b) => b.production - a.production)
              .slice(0, 10)
              .map((state, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-transparent rounded-lg border border-green-200 hover:border-green-400 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedState(state)}
                >
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="bg-green-100 text-green-800 font-bold px-3 py-1 text-sm">
                      #{state.rank}
                    </Badge>
                    <div>
                      <p className="font-semibold text-gray-800">{state.name}</p>
                      <p className="text-sm text-gray-600">
                        {state.mainProducts.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-700 text-lg">{state.production}M</p>
                  <p className="text-xs text-gray-500">{t('professionalMap.tonnesPerYear')}</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalIndiaMap;
