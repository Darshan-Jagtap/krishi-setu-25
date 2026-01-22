import { useState } from 'react';
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

// State positions on map (approximate x, y percentages for SVG overlay)
const statePositions: { [key: string]: { x: number; y: number; r: number } } = {
  'Punjab': { x: 25, y: 15, r: 4 },
  'Uttar Pradesh': { x: 45, y: 25, r: 5 },
  'Rajasthan': { x: 30, y: 35, r: 6 },
  'Madhya Pradesh': { x: 50, y: 40, r: 5 },
  'Gujarat': { x: 25, y: 50, r: 5 },
  'Andhra Pradesh': { x: 60, y: 60, r: 5 },
  'Karnataka': { x: 55, y: 70, r: 4 },
  'Tamil Nadu': { x: 65, y: 85, r: 4 }
};

const RealIndiaMap = () => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<StateData | null>(null);

  const totalProduction = Object.values(statesData).reduce((sum, state) => sum + state.production, 0);
  const totalMarketValue = Object.values(statesData).reduce((sum, state) => sum + state.marketValue, 0);
  const totalFarmers = Object.values(statesData).reduce((sum, state) => sum + state.farmers, 0);

  const getStateColor = (stateName: string) => {
    if (hoveredState === stateName) return '#059669';
    const state = statesData[stateName];
    if (!state) return '#e5e7eb';
    
    const intensity = state.production / 10;
    if (intensity > 0.7) return '#16a34a';
    if (intensity > 0.5) return '#22c55e';
    if (intensity > 0.3) return '#4ade80';
    return '#86efac';
  };

  const handleStateClick = (stateName: string) => {
    const state = statesData[stateName];
    if (state) {
      setSelectedState(state);
    }
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
              Production Heatmap - India
            </CardTitle>
            <CardDescription>Hover and click on states to see details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-blue-50 to-green-50 p-4 rounded-lg">
              {/* SVG Map with Interactive Overlays */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-auto"
                style={{ minHeight: '400px', maxHeight: '500px' }}
              >
                {/* India Map Background - Simple outline */}
                <defs>
                  <linearGradient id="indiaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#e0f2fe', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#dcfce7', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>

                {/* India outline (simplified) */}
                <path
                  d="M 20 10 L 80 10 L 85 30 L 90 50 L 85 70 L 75 85 L 50 90 L 25 85 L 15 70 L 10 50 L 15 30 Z"
                  fill="url(#indiaGradient)"
                  stroke="#0ea5e9"
                  strokeWidth="0.5"
                />

                {/* State circles with production data */}
                {Object.entries(statePositions).map(([stateName, pos]) => {
                  const state = statesData[stateName];
                  const color = getStateColor(stateName);
                  const isHovered = hoveredState === stateName;
                  const isSelected = selectedState?.name === stateName;

                  return (
                    <g
                      key={stateName}
                      onMouseEnter={() => setHoveredState(stateName)}
                      onMouseLeave={() => setHoveredState(null)}
                      onClick={() => handleStateClick(stateName)}
                      className="cursor-pointer"
                    >
                      {/* Circle */}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={isHovered || isSelected ? pos.r * 1.3 : pos.r}
                        fill={color}
                        stroke={isSelected ? '#000' : '#fff'}
                        strokeWidth={isSelected ? '0.8' : '0.3'}
                        opacity={isHovered ? 0.9 : 0.8}
                        style={{ transition: 'all 0.2s ease' }}
                      />

                      {/* State label */}
                      <text
                        x={pos.x}
                        y={pos.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs font-bold fill-gray-800 pointer-events-none"
                        style={{ fontSize: '2px' }}
                      >
                        {stateName.split(' ')[0].substring(0, 3)}
                      </text>

                      {/* Tooltip on hover */}
                      {isHovered && (
                        <g>
                          <rect
                            x={pos.x - 8}
                            y={pos.y - 12}
                            width="16"
                            height="8"
                            fill="#fff"
                            stroke="#666"
                            strokeWidth="0.2"
                            rx="0.5"
                          />
                          <text
                            x={pos.x}
                            y={pos.y - 8}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-gray-800 pointer-events-none"
                            style={{ fontSize: '1.5px', fontWeight: 'bold' }}
                          >
                            {state.production}M
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Legend */}
                <g>
                  <text x="5" y="95" className="fill-gray-700" style={{ fontSize: '1.5px', fontWeight: 'bold' }}>
                    Legend:
                  </text>
                  <circle cx="5" cy="97" r="0.8" fill="#16a34a" />
                  <text x="6.5" y="97.3" className="fill-gray-600" style={{ fontSize: '1px' }}>
                    High
                  </text>
                  <circle cx="15" cy="97" r="0.8" fill="#22c55e" />
                  <text x="16.5" y="97.3" className="fill-gray-600" style={{ fontSize: '1px' }}>
                    Medium
                  </text>
                  <circle cx="25" cy="97" r="0.8" fill="#86efac" />
                  <text x="26.5" y="97.3" className="fill-gray-600" style={{ fontSize: '1px' }}>
                    Low
                  </text>
                </g>
              </svg>

              {/* Production Intensity Legend */}
              <div className="mt-4 p-3 bg-white rounded border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-2">Production Intensity:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#16a34a' }} />
                    <span>High (7-8.5M)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }} />
                    <span>Medium (5-6.8M)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#4ade80' }} />
                    <span>Medium-Low (3-4.8M)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#86efac' }} />
                    <span>Low (&lt;3M)</span>
                  </div>
                </div>
              </div>
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
              {selectedState ? `Rank #${selectedState.rank}` : 'Click on a state on the map'}
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
                <p className="text-sm">Click on a state on the map to view details</p>
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

export default RealIndiaMap;
