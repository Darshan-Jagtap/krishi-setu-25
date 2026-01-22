import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  MapPin,
  Leaf,
  BarChart3,
  Zap,
  DollarSign
} from 'lucide-react';

interface StateData {
  name: string;
  production: number; // in million tonnes
  mainProducts: string[];
  marketValue: number; // in crores
  farmers: number; // in thousands
  rank: number;
}

const statesData: { [key: string]: StateData } = {
  'Rajasthan': {
    name: 'Rajasthan',
    production: 8.5,
    mainProducts: ['Mustard', 'Groundnut'],
    marketValue: 2500,
    farmers: 450,
    rank: 1
  },
  'Madhya Pradesh': {
    name: 'Madhya Pradesh',
    production: 7.2,
    mainProducts: ['Soybean', 'Sunflower'],
    marketValue: 2100,
    farmers: 380,
    rank: 2
  },
  'Gujarat': {
    name: 'Gujarat',
    production: 6.8,
    mainProducts: ['Groundnut', 'Sunflower'],
    marketValue: 2000,
    farmers: 320,
    rank: 3
  },
  'Andhra Pradesh': {
    name: 'Andhra Pradesh',
    production: 5.2,
    mainProducts: ['Groundnut', 'Sunflower'],
    marketValue: 1500,
    farmers: 280,
    rank: 4
  },
  'Karnataka': {
    name: 'Karnataka',
    production: 4.8,
    mainProducts: ['Sunflower', 'Coconut'],
    marketValue: 1400,
    farmers: 240,
    rank: 5
  },
  'Tamil Nadu': {
    name: 'Tamil Nadu',
    production: 3.5,
    mainProducts: ['Coconut', 'Groundnut'],
    marketValue: 1000,
    farmers: 180,
    rank: 6
  },
  'Uttar Pradesh': {
    name: 'Uttar Pradesh',
    production: 3.2,
    mainProducts: ['Mustard', 'Sunflower'],
    marketValue: 950,
    farmers: 160,
    rank: 7
  },
  'Punjab': {
    name: 'Punjab',
    production: 2.8,
    mainProducts: ['Mustard', 'Sunflower'],
    marketValue: 850,
    farmers: 140,
    rank: 8
  }
};

const OilseedIndustryMap = () => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<StateData | null>(null);

  const totalProduction = Object.values(statesData).reduce((sum, state) => sum + state.production, 0);
  const totalMarketValue = Object.values(statesData).reduce((sum, state) => sum + state.marketValue, 0);
  const totalFarmers = Object.values(statesData).reduce((sum, state) => sum + state.farmers, 0);

  const getStateColor = (stateName: string) => {
    if (hoveredState === stateName) return 'fill-green-500 hover:fill-green-600';
    const state = statesData[stateName];
    if (!state) return 'fill-gray-200 hover:fill-gray-300';
    
    const intensity = state.production / 10;
    if (intensity > 0.7) return 'fill-green-600 hover:fill-green-700';
    if (intensity > 0.5) return 'fill-green-500 hover:fill-green-600';
    if (intensity > 0.3) return 'fill-green-400 hover:fill-green-500';
    return 'fill-green-300 hover:fill-green-400';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <MapPin className="w-8 h-8 text-green-600" />
          Oilseed By-Product Industry Map
        </h2>
        <p className="text-muted-foreground">
          India's major oilseed producing states and market statistics
        </p>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-transparent">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                <span className="text-sm text-muted-foreground">Total Production</span>
              </div>
              <p className="text-3xl font-bold text-green-600">{totalProduction.toFixed(1)}M</p>
              <p className="text-xs text-muted-foreground">Million tonnes annually</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-transparent">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-muted-foreground">Market Value</span>
              </div>
              <p className="text-3xl font-bold text-blue-600">₹{totalMarketValue}Cr</p>
              <p className="text-xs text-muted-foreground">Total industry value</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-transparent">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-muted-foreground">Farmers</span>
              </div>
              <p className="text-3xl font-bold text-purple-600">{totalFarmers}K+</p>
              <p className="text-xs text-muted-foreground">Engaged farmers</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-transparent">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-muted-foreground">Growth Rate</span>
              </div>
              <p className="text-3xl font-bold text-orange-600">+12.5%</p>
              <p className="text-xs text-muted-foreground">Year-on-year</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <Card className="lg:col-span-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Production Heatmap
            </CardTitle>
            <CardDescription>Hover over states to see details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg">
              <svg
                viewBox="0 0 800 600"
                className="w-full h-auto"
                style={{ maxHeight: '400px' }}
              >
                {/* Simplified India map representation with major oilseed states */}
                
                {/* Rajasthan */}
                <g
                  onMouseEnter={() => setHoveredState('Rajasthan')}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => setSelectedState(statesData['Rajasthan'])}
                  className="cursor-pointer transition-all"
                >
                  <circle
                    cx="240"
                    cy="180"
                    r="35"
                    className={`${getStateColor('Rajasthan')} stroke-gray-400 stroke-1 transition-all`}
                  />
                  <text x="240" y="185" className="text-xs font-semibold fill-gray-700">
                    Rajasthan
                  </text>
                </g>

                {/* Madhya Pradesh */}
                <g
                  onMouseEnter={() => setHoveredState('Madhya Pradesh')}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => setSelectedState(statesData['Madhya Pradesh'])}
                  className="cursor-pointer transition-all"
                >
                  <circle
                    cx="320"
                    cy="230"
                    r="32"
                    className={`${getStateColor('Madhya Pradesh')} stroke-gray-400 stroke-1 transition-all`}
                  />
                  <text x="320" y="235" className="text-xs font-semibold fill-gray-700">
                    MP
                  </text>
                </g>

                {/* Gujarat */}
                <g
                  onMouseEnter={() => setHoveredState('Gujarat')}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => setSelectedState(statesData['Gujarat'])}
                  className="cursor-pointer transition-all"
                >
                  <circle
                    cx="220"
                    cy="260"
                    r="30"
                    className={`${getStateColor('Gujarat')} stroke-gray-400 stroke-1 transition-all`}
                  />
                  <text x="220" y="265" className="text-xs font-semibold fill-gray-700">
                    Gujarat
                  </text>
                </g>

                {/* Andhra Pradesh */}
                <g
                  onMouseEnter={() => setHoveredState('Andhra Pradesh')}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => setSelectedState(statesData['Andhra Pradesh'])}
                  className="cursor-pointer transition-all"
                >
                  <circle
                    cx="420"
                    cy="340"
                    r="28"
                    className={`${getStateColor('Andhra Pradesh')} stroke-gray-400 stroke-1 transition-all`}
                  />
                  <text x="420" y="345" className="text-xs font-semibold fill-gray-700">
                    AP
                  </text>
                </g>

                {/* Karnataka */}
                <g
                  onMouseEnter={() => setHoveredState('Karnataka')}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => setSelectedState(statesData['Karnataka'])}
                  className="cursor-pointer transition-all"
                >
                  <circle
                    cx="355"
                    cy="375"
                    r="26"
                    className={`${getStateColor('Karnataka')} stroke-gray-400 stroke-1 transition-all`}
                  />
                  <text x="355" y="380" className="text-xs font-semibold fill-gray-700">
                    KA
                  </text>
                </g>

                {/* Tamil Nadu */}
                <g
                  onMouseEnter={() => setHoveredState('Tamil Nadu')}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => setSelectedState(statesData['Tamil Nadu'])}
                  className="cursor-pointer transition-all"
                >
                  <circle
                    cx="410"
                    cy="450"
                    r="24"
                    className={`${getStateColor('Tamil Nadu')} stroke-gray-400 stroke-1 transition-all`}
                  />
                  <text x="410" y="455" className="text-xs font-semibold fill-gray-700">
                    TN
                  </text>
                </g>

                {/* Uttar Pradesh */}
                <g
                  onMouseEnter={() => setHoveredState('Uttar Pradesh')}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => setSelectedState(statesData['Uttar Pradesh'])}
                  className="cursor-pointer transition-all"
                >
                  <circle
                    cx="365"
                    cy="130"
                    r="30"
                    className={`${getStateColor('Uttar Pradesh')} stroke-gray-400 stroke-1 transition-all`}
                  />
                  <text x="365" y="135" className="text-xs font-semibold fill-gray-700">
                    UP
                  </text>
                </g>

                {/* Punjab */}
                <g
                  onMouseEnter={() => setHoveredState('Punjab')}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => setSelectedState(statesData['Punjab'])}
                  className="cursor-pointer transition-all"
                >
                  <circle
                    cx="295"
                    cy="105"
                    r="25"
                    className={`${getStateColor('Punjab')} stroke-gray-400 stroke-1 transition-all`}
                  />
                  <text x="295" y="110" className="text-xs font-semibold fill-gray-700">
                    Punjab
                  </text>
                </g>

                {/* Legend */}
                <g>
                  <text x="20" y="540" className="text-sm font-semibold fill-gray-700">
                    Production Intensity:
                  </text>
                  <rect x="20" y="550" width="15" height="15" className="fill-green-600" />
                  <text x="40" y="562" className="text-xs fill-gray-600">
                    High (7-8.5M)
                  </text>
                  <rect x="150" y="550" width="15" height="15" className="fill-green-400" />
                  <text x="170" y="562" className="text-xs fill-gray-600">
                    Medium (3-5M)
                  </text>
                  <rect x="280" y="550" width="15" height="15" className="fill-green-300" />
                  <text x="300" y="562" className="text-xs fill-gray-600">
                    Low (&lt;3M)
                  </text>
                </g>
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* State Details */}
        <Card className="border-green-200 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedState ? selectedState.name : 'Select a State'}
            </CardTitle>
            <CardDescription>
              {selectedState ? `Rank #${selectedState.rank}` : 'Hover and click on map'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedState ? (
              <>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Annual Production</p>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedState.production}M tonnes
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Market Value</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{selectedState.marketValue} Crores
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Farmers Engaged</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {selectedState.farmers}K+
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Main Products</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedState.mainProducts.map((product, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-green-100 text-green-800">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Click on a state to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Producers */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Top Oilseed Producing States
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.values(statesData)
              .sort((a, b) => b.production - a.production)
              .map((state, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-transparent rounded-lg border border-green-200 hover:border-green-400 transition-colors cursor-pointer"
                  onClick={() => setSelectedState(state)}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-green-100 text-green-800 font-bold">
                      #{state.rank}
                    </Badge>
                    <div>
                      <p className="font-semibold">{state.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {state.mainProducts.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{state.production}M</p>
                    <p className="text-xs text-muted-foreground">tonnes/year</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OilseedIndustryMap;
