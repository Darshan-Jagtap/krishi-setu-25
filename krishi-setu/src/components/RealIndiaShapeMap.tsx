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

const RealIndiaShapeMap = () => {
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
          India's major oilseed producing states with accurate geographical boundaries
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
              Real India Map - Oilseed Production
            </CardTitle>
            <CardDescription>Hover and click on states to see details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-blue-50 to-green-50 p-4 rounded-lg overflow-auto">
              {/* Real India Shape Map */}
              <svg
                viewBox="0 0 1000 900"
                className="w-full h-auto"
                style={{ minHeight: '600px', maxHeight: '700px' }}
              >
                <defs>
                  <pattern id="ocean" width="100" height="100" patternUnits="userSpaceOnUse">
                    <rect width="100" height="100" fill="#e0f2fe" />
                    <circle cx="20" cy="20" r="2" fill="#bae6fd" opacity="0.3"/>
                    <circle cx="80" cy="80" r="2" fill="#bae6fd" opacity="0.3"/>
                  </pattern>
                </defs>

                {/* Ocean Background */}
                <rect width="1000" height="900" fill="url(#ocean)" />
                
                {/* India Outline with Realistic Shape */}
                
                {/* Jammu & Kashmir */}
                <path
                  d="M 380 80 L 480 80 L 520 120 L 500 160 L 420 160 L 380 120 Z"
                  fill="#e5e7eb"
                  stroke="#333"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <text x="450" y="120" textAnchor="middle" className="fill-gray-600" fontSize="10">Jammu & Kashmir</text>

                {/* Himachal Pradesh */}
                <path
                  d="M 420 160 L 500 160 L 520 200 L 480 220 L 420 200 Z"
                  fill="#e5e7eb"
                  stroke="#333"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <text x="470" y="190" textAnchor="middle" className="fill-gray-600" fontSize="10">Himachal</text>

                {/* Punjab */}
                <g
                  onMouseEnter={() => setHoveredState('Punjab')}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => handleStateClick('Punjab')}
                  className="cursor-pointer"
                >
                  <path
                    d="M 380 220 L 480 220 L 480 260 L 420 280 L 380 260 Z"
                    fill={getStateColor('Punjab')}
                    stroke="#333"
                    strokeWidth="1"
                    opacity={hoveredState === 'Punjab' ? 0.9 : 0.8}
                  />
                  <text x="430" y="240" textAnchor="middle" className="fill-black font-bold" fontSize="12">
                    Punjab
                  </text>
                </g>

                {/* Uttarakhand */}
                <path
                  d="M 500 200 L 560 200 L 560 240 L 520 260 L 500 240 Z"
                  fill="#e5e7eb"
                  stroke="#333"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <text x="530" y="230" textAnchor="middle" className="fill-gray-600" fontSize="10">Uttarakhand</text>

                {/* Haryana */}
                <path
                  d="M 380 260 L 480 260 L 480 300 L 420 320 L 380 300 Z"
                  fill="#e5e7eb"
                  stroke="#333"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <text x="430" y="280" textAnchor="middle" className="fill-gray-600" fontSize="10">Haryana</text>

                {/* Delhi */}
                <path
                  d="M 480 260 L 520 260 L 520 300 L 480 300 Z"
                  fill="#e5e7eb"
                  stroke="#333"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <text x="500" y="280" textAnchor="middle" className="fill-gray-600" fontSize="10">Delhi</text>

                {/* Uttar Pradesh */}
                <g
                  onMouseEnter={() => setHoveredState('Uttar Pradesh')}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => handleStateClick('Uttar Pradesh')}
                  className="cursor-pointer"
                >
                  <path
                    d="M 520 240 L 680 240 L 700 340 L 640 380 L 520 360 L 500 300 Z"
                    fill={getStateColor('Uttar Pradesh')}
                    stroke="#333"
                    strokeWidth="1"
                    opacity={hoveredState === 'Uttar Pradesh' ? 0.9 : 0.8}
                  />
                  <text x="600" y="310" textAnchor="middle" className="fill-black font-bold" fontSize="12">
                    Uttar Pradesh
                  </text>
                </g>

                {/* Rajasthan - Large state in west */}
                <g
                  onMouseEnter={() => setHoveredState('Rajasthan')}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => handleStateClick('Rajasthan')}
                  className="cursor-pointer"
                >
                  <path
                    d="M 200 220 L 380 220 L 380 380 L 320 420 L 200 380 L 180 300 Z"
                    fill={getStateColor('Rajasthan')}
                    stroke="#333"
                    strokeWidth="1"
                    opacity={hoveredState === 'Rajasthan' ? 0.9 : 0.8}
                  />
                  <text x="290" y="320" textAnchor="middle" className="fill-black font-bold" fontSize="12">
                    Rajasthan
                  </text>
                </g>

                {/* Madhya Pradesh - Central large state */}
                <g
                  onMouseEnter={() => setHoveredState('Madhya Pradesh')}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => handleStateClick('Madhya Pradesh')}
                  className="cursor-pointer"
                >
                  <path
                    d="M 320 380 L 640 380 L 660 480 L 580 520 L 320 480 L 280 420 Z"
                    fill={getStateColor('Madhya Pradesh')}
                    stroke="#333"
                    strokeWidth="1"
                    opacity={hoveredState === 'Madhya Pradesh' ? 0.9 : 0.8}
                  />
                  <text x="470" y="450" textAnchor="middle" className="fill-black font-bold" fontSize="12">
                    Madhya Pradesh
                  </text>
                </g>

                {/* Gujarat - West coast state */}
                <g
                  onMouseEnter={() => setHoveredState('Gujarat')}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => handleStateClick('Gujarat')}
                  className="cursor-pointer"
                >
                  <path
                    d="M 180 380 L 320 380 L 320 480 L 250 520 L 150 480 L 120 420 Z"
                    fill={getStateColor('Gujarat')}
                    stroke="#333"
                    strokeWidth="1"
                    opacity={hoveredState === 'Gujarat' ? 0.9 : 0.8}
                  />
                  <text x="220" y="450" textAnchor="middle" className="fill-black font-bold" fontSize="12">
                    Gujarat
                  </text>
                </g>

                {/* Bihar */}
                <path
                  d="M 680 240 L 760 240 L 780 340 L 720 380 L 680 340 Z"
                  fill="#e5e7eb"
                  stroke="#333"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <text x="730" y="310" textAnchor="middle" className="fill-gray-600" fontSize="10">Bihar</text>

                {/* Jharkhand */}
                <path
                  d="M 680 380 L 720 380 L 740 460 L 680 500 L 640 460 Z"
                  fill="#e5e7eb"
                  stroke="#333"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <text x="690" y="440" textAnchor="middle" className="fill-gray-600" fontSize="10">Jharkhand</text>

                {/* West Bengal */}
                <path
                  d="M 760 340 L 820 340 L 840 460 L 780 500 L 720 460 Z"
                  fill="#e5e7eb"
                  stroke="#333"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <text x="780" y="420" textAnchor="middle" className="fill-gray-600" fontSize="10">West Bengal</text>

                {/* Odisha */}
                <path
                  d="M 640 500 L 740 460 L 780 540 L 720 580 L 640 560 Z"
                  fill="#e5e7eb"
                  stroke="#333"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <text x="710" y="520" textAnchor="middle" className="fill-gray-600" fontSize="10">Odisha</text>

                {/* Chhattisgarh */}
                <path
                  d="M 580 520 L 640 520 L 640 580 L 580 620 L 520 580 Z"
                  fill="#e5e7eb"
                  stroke="#333"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <text x="580" y="550" textAnchor="middle" className="fill-gray-600" fontSize="10">Chhattisgarh</text>

                {/* Maharashtra - Large west state */}
                <path
                  d="M 280 480 L 520 520 L 480 620 L 280 580 L 200 520 Z"
                  fill="#e5e7eb"
                  stroke="#333"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <text x="360" y="550" text-anchor="middle" className="fill-gray-600" fontSize="10">Maharashtra</text>

                {/* Telangana */}
                <path
                  d="M 520 580 L 580 580 L 580 620 L 520 620 Z"
                  fill="#e5e7eb"
                  stroke="#333"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <text x="550" y="600" text-anchor="middle" className="fill-gray-600" fontSize="10">Telangana</text>

                {/* Andhra Pradesh - East coast */}
                <g
                  onMouseEnter={() => setHoveredState('Andhra Pradesh')}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => handleStateClick('Andhra Pradesh')}
                  className="cursor-pointer"
                >
                  <path
                    d="M 580 620 L 720 580 L 760 640 L 720 680 L 580 680 L 540 640 Z"
                    fill={getStateColor('Andhra Pradesh')}
                    stroke="#333"
                    strokeWidth="1"
                    opacity={hoveredState === 'Andhra Pradesh' ? 0.9 : 0.8}
                  />
                  <text x="650" y="650" text-anchor="middle" className="fill-black font-bold" fontSize="12">
                    Andhra Pradesh
                  </text>
                </g>

                {/* Karnataka - Southwest */}
                <g
                  onMouseEnter={() => setHoveredState('Karnataka')}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => handleStateClick('Karnataka')}
                  className="cursor-pointer"
                >
                  <path
                    d="M 280 580 L 480 620 L 460 680 L 280 680 L 240 640 Z"
                    fill={getStateColor('Karnataka')}
                    stroke="#333"
                    strokeWidth="1"
                    opacity={hoveredState === 'Karnataka' ? 0.9 : 0.8}
                  />
                  <text x="360" y="630" text-anchor="middle" className="fill-black font-bold" fontSize="12">
                    Karnataka
                  </text>
                </g>

                {/* Kerala - Southwest tip */}
                <path
                  d="M 240 680 L 280 680 L 280 720 L 240 720 Z"
                  fill="#e5e7eb"
                  stroke="#333"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <text x="260" y="700" text-anchor="middle" className="fill-gray-600" fontSize="10">Kerala</text>

                {/* Tamil Nadu - South tip */}
                <g
                  onMouseEnter={() => setHoveredState('Tamil Nadu')}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => handleStateClick('Tamil Nadu')}
                  className="cursor-pointer"
                >
                  <path
                    d="M 280 680 L 460 680 L 500 720 L 460 760 L 280 760 L 240 720 Z"
                    fill={getStateColor('Tamil Nadu')}
                    stroke="#333"
                    strokeWidth="1"
                    opacity={hoveredState === 'Tamil Nadu' ? 0.9 : 0.8}
                  />
                  <text x="370" y="720" text-anchor="middle" className="fill-black font-bold" fontSize="12">
                    Tamil Nadu
                  </text>
                </g>

                {/* Goa */}
                <path
                  d="M 240 640 L 280 640 L 280 680 L 240 680 Z"
                  fill="#e5e7eb"
                  stroke="#333"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <text x="260" y="660" text-anchor="middle" className="fill-gray-600" fontSize="10">Goa</text>

                {/* Production tooltip on hover */}
                {hoveredState && (
                  <g>
                    <rect
                      x={hoveredState === 'Rajasthan' ? 150 : hoveredState === 'Madhya Pradesh' ? 400 : hoveredState === 'Tamil Nadu' ? 300 : hoveredState === 'Gujarat' ? 100 : 400}
                      y={hoveredState === 'Tamil Nadu' ? 780 : hoveredState === 'Karnataka' ? 700 : hoveredState === 'Andhra Pradesh' ? 700 : 200}
                      width="140"
                      height="50"
                      fill="#fff"
                      stroke="#333"
                      strokeWidth="1"
                      rx="5"
                      opacity="0.95"
                    />
                    <text
                      x={hoveredState === 'Rajasthan' ? 220 : hoveredState === 'Madhya Pradesh' ? 470 : hoveredState === 'Tamil Nadu' ? 370 : hoveredState === 'Gujarat' ? 170 : 470}
                      y={hoveredState === 'Tamil Nadu' ? 800 : hoveredState === 'Karnataka' ? 720 : hoveredState === 'Andhra Pradesh' ? 720 : 220}
                      text-anchor="middle"
                      className="fill-black font-bold"
                      fontSize="14"
                    >
                      {hoveredState}
                    </text>
                    <text
                      x={hoveredState === 'Rajasthan' ? 220 : hoveredState === 'Madhya Pradesh' ? 470 : hoveredState === 'Tamil Nadu' ? 370 : hoveredState === 'Gujarat' ? 170 : 470}
                      y={hoveredState === 'Tamil Nadu' ? 815 : hoveredState === 'Karnataka' ? 735 : hoveredState === 'Andhra Pradesh' ? 735 : 235}
                      text-anchor="middle"
                      className="fill-green-600 font-bold"
                      fontSize="12"
                    >
                      {statesData[hoveredState]?.production}M tonnes
                    </text>
                  </g>
                )}
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

export default RealIndiaShapeMap;
