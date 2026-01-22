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

// Approximate coordinates for state centers (latitude, longitude)
const stateCoordinates: { [key: string]: [number, number] } = {
  'Rajasthan': [27.0238, 74.2179],
  'Madhya Pradesh': [22.9375, 78.6553],
  'Gujarat': [22.2587, 71.1924],
  'Andhra Pradesh': [15.9129, 78.6675],
  'Karnataka': [15.3173, 75.7139],
  'Tamil Nadu': [11.1271, 78.6569],
  'Uttar Pradesh': [26.8467, 80.9462],
  'Punjab': [31.1471, 75.3412]
};

const IndiaOilseedMap = () => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<StateData | null>(null);

  const totalProduction = Object.values(statesData).reduce((sum, state) => sum + state.production, 0);
  const totalMarketValue = Object.values(statesData).reduce((sum, state) => sum + state.marketValue, 0);
  const totalFarmers = Object.values(statesData).reduce((sum, state) => sum + state.farmers, 0);

  const getStateColor = (stateName: string) => {
    if (hoveredState === stateName) return '#FF9933'; // Saffron on hover
    const state = statesData[stateName];
    if (!state) return '#f0f0f0';
    
    // Use tricolor theme based on production intensity
    const intensity = state.production / 10;
    if (intensity > 0.7) return '#FF9933'; // Saffron for high production
    if (intensity > 0.5) return '#FFFFFF'; // White for medium production  
    if (intensity > 0.3) return '#138808'; // Green for medium-low production
    return '#e8f5e8'; // Light green for low production
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
      <div className="space-y-4 text-center">
        <h2 className="text-4xl font-bold flex items-center justify-center gap-3">
          <div className="flex gap-1">
            <div className="w-3 h-8 rounded" style={{ backgroundColor: '#FF9933' }} />
            <div className="w-3 h-8 rounded bg-white border border-gray-300" />
            <div className="w-3 h-8 rounded" style={{ backgroundColor: '#138808' }} />
          </div>
          India Oilseed Production Map
          <div className="flex gap-1">
            <div className="w-3 h-8 rounded" style={{ backgroundColor: '#FF9933' }} />
            <div className="w-3 h-8 rounded bg-white border border-gray-300" />
            <div className="w-3 h-8 rounded" style={{ backgroundColor: '#138808' }} />
          </div>
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Interactive map showcasing India's oilseed production with patriotic tricolor theme - Click on states to explore detailed agricultural insights
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
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="flex gap-1">
                <div className="w-2 h-6 rounded" style={{ backgroundColor: '#FF9933' }} />
                <div className="w-2 h-6 rounded bg-white border border-gray-300" />
                <div className="w-2 h-6 rounded" style={{ backgroundColor: '#138808' }} />
              </div>
              Interactive India Map - Tricolor Theme
            </CardTitle>
            <CardDescription className="text-gray-600">
              Experience India's oilseed production data through the colors of our nation - Click on highlighted states to discover agricultural insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-6 rounded-lg relative border-4 border-gray-300 shadow-2xl">
              <svg
                viewBox="0 0 1200 1200"
                className="w-full h-auto"
                style={{ minHeight: '800px', maxHeight: '900px' }}
              >
                <defs>
                  {/* Indian Tricolor Gradient - More Visible */}
                  <linearGradient id="tricolorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FF9933', stopOpacity: 0.6 }} />
                    <stop offset="25%" style={{ stopColor: '#FF9933', stopOpacity: 0.4 }} />
                    <stop offset="33%" style={{ stopColor: '#FFFFFF', stopOpacity: 0.3 }} />
                    <stop offset="50%" style={{ stopColor: '#FFFFFF', stopOpacity: 0.2 }} />
                    <stop offset="66%" style={{ stopColor: '#138808', stopOpacity: 0.4 }} />
                    <stop offset="100%" style={{ stopColor: '#138808', stopOpacity: 0.6 }} />
                  </linearGradient>
                  
                  {/* Ashoka Chakra pattern - More Visible */}
                  <pattern id="chakra" x="0" y="0" width="150" height="150" patternUnits="userSpaceOnUse">
                    <circle cx="75" cy="75" r="25" fill="none" stroke="#000080" strokeWidth="1" opacity="0.3"/>
                    <circle cx="75" cy="75" r="18" fill="none" stroke="#000080" strokeWidth="0.8" opacity="0.25"/>
                    <circle cx="75" cy="75" r="12" fill="none" stroke="#000080" strokeWidth="0.6" opacity="0.2"/>
                  </pattern>
                  
                  {/* Shadow filter */}
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="3" dy="3" stdDeviation="4" floodOpacity="0.3"/>
                  </filter>
                </defs>

                {/* Background - Light gray with visible tricolor */}
                <rect width="1200" height="1200" fill="#EAEAEA" />
                <rect width="1200" height="1200" fill="url(#tricolorGradient)" />
                <rect width="1200" height="1200" fill="url(#chakra)" />
                
                {/* India Map Outline with Tricolor Theme - Scaled for 1200x1200 */}
                <g filter="url(#shadow)">
                  {/* Jammu & Kashmir */}
                  <path
                    d="M 570 120 L 690 120 L 720 150 L 750 180 L 720 210 L 690 225 L 630 225 L 600 210 L 570 180 Z"
                    fill="#f8f8f8"
                    stroke="#333"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <text x="645" y="172" textAnchor="middle" className="fill-gray-700" fontSize="14">J&K</text>

                  {/* Himachal Pradesh */}
                  <path
                    d="M 570 225 L 630 225 L 660 255 L 645 285 L 600 285 L 570 255 Z"
                    fill="#f8f8f8"
                    stroke="#333"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <text x="615" y="255" textAnchor="middle" className="fill-gray-700" fontSize="14">HP</text>

                  {/* Punjab */}
                  <g
                    onMouseEnter={() => setHoveredState('Punjab')}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => handleStateClick('Punjab')}
                    className="cursor-pointer"
                  >
                    <path
                      d="M 480 285 L 570 285 L 600 315 L 585 345 L 555 360 L 510 345 L 480 315 Z"
                      fill={getStateColor('Punjab')}
                      stroke="#333"
                      strokeWidth="3"
                      opacity={hoveredState === 'Punjab' ? 1 : 0.9}
                    />
                    <text x="540" y="322" textAnchor="middle" className="fill-black font-bold" fontSize="16">
                      Punjab
                    </text>
                  </g>

                  {/* Uttarakhand */}
                  <path
                    d="M 660 255 L 720 255 L 735 285 L 720 315 L 675 315 L 660 285 Z"
                    fill="#f8f8f8"
                    stroke="#333"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <text x="697" y="285" textAnchor="middle" className="fill-gray-700" fontSize="14">UK</text>

                  {/* Haryana */}
                  <path
                    d="M 510 345 L 585 345 L 600 375 L 585 405 L 540 405 L 510 375 Z"
                    fill="#f8f8f8"
                    stroke="#333"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <text x="555" y="375" textAnchor="middle" className="fill-gray-700" fontSize="14">Haryana</text>

                  {/* Delhi */}
                  <path
                    d="M 585 375 L 615 375 L 615 405 L 585 405 Z"
                    fill="#f8f8f8"
                    stroke="#333"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <text x="600" y="390" textAnchor="middle" className="fill-gray-700" fontSize="12">DL</text>

                  {/* Uttar Pradesh */}
                  <g
                    onMouseEnter={() => setHoveredState('Uttar Pradesh')}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => handleStateClick('Uttar Pradesh')}
                    className="cursor-pointer"
                  >
                    <path
                      d="M 600 315 L 810 315 L 870 375 L 855 435 L 825 480 L 750 510 L 660 495 L 600 450 L 585 405 L 585 360 Z"
                      fill={getStateColor('Uttar Pradesh')}
                      stroke="#333"
                      strokeWidth="3"
                      opacity={hoveredState === 'Uttar Pradesh' ? 1 : 0.9}
                    />
                    <text x="727" y="412" textAnchor="middle" className="fill-black font-bold" fontSize="16">
                      Uttar Pradesh
                    </text>
                  </g>

                  {/* Rajasthan */}
                  <g
                    onMouseEnter={() => setHoveredState('Rajasthan')}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => handleStateClick('Rajasthan')}
                    className="cursor-pointer"
                  >
                    <path
                      d="M 330 285 L 480 285 L 510 345 L 495 420 L 465 510 L 420 600 L 360 645 L 300 600 L 270 495 L 255 390 L 270 330 L 300 285 Z"
                      fill={getStateColor('Rajasthan')}
                      stroke="#333"
                      strokeWidth="3"
                      opacity={hoveredState === 'Rajasthan' ? 1 : 0.9}
                    />
                    <text x="397" y="442" textAnchor="middle" className="fill-black font-bold" fontSize="16">
                      Rajasthan
                    </text>
                  </g>

                  {/* Madhya Pradesh */}
                  <g
                    onMouseEnter={() => setHoveredState('Madhya Pradesh')}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => handleStateClick('Madhya Pradesh')}
                    className="cursor-pointer"
                  >
                    <path
                      d="M 420 600 L 660 495 L 750 510 L 810 570 L 795 630 L 720 690 L 630 720 L 540 705 L 465 660 L 420 615 Z"
                      fill={getStateColor('Madhya Pradesh')}
                      stroke="#333"
                      strokeWidth="3"
                      opacity={hoveredState === 'Madhya Pradesh' ? 1 : 0.9}
                    />
                    <text x="615" y="607" textAnchor="middle" className="fill-black font-bold" fontSize="16">
                      Madhya Pradesh
                    </text>
                  </g>

                  {/* Gujarat */}
                  <g
                    onMouseEnter={() => setHoveredState('Gujarat')}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => handleStateClick('Gujarat')}
                    className="cursor-pointer"
                  >
                    <circle
                      cx="330"
                      cy="675"
                      r="42"
                      fill={getStateColor('Gujarat')}
                      stroke="#333"
                      strokeWidth="3"
                      opacity={hoveredState === 'Gujarat' ? 1 : 0.9}
                    />
                    <text x="330" y="680" textAnchor="middle" className="fill-black font-bold" fontSize="14">
                      Gujarat
                    </text>
                  </g>

                  {/* Bihar */}
                  <path
                    d="M 810 315 L 900 315 L 930 375 L 900 435 L 855 465 L 810 435 Z"
                    fill="#f8f8f8"
                    stroke="#333"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <text x="870" y="390" textAnchor="middle" className="fill-gray-700" fontSize="14">Bihar</text>

                  {/* Jharkhand */}
                  <path
                    d="M 855 465 L 930 435 L 960 495 L 930 555 L 885 570 L 840 540 Z"
                    fill="#f8f8f8"
                    stroke="#333"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <text x="900" y="502" textAnchor="middle" className="fill-gray-700" fontSize="14">JH</text>

                  {/* West Bengal */}
                  <path
                    d="M 930 375 L 1020 375 L 1050 435 L 1035 525 L 990 585 L 930 570 L 900 510 L 900 435 Z"
                    fill="#f8f8f8"
                    stroke="#333"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <text x="975" y="480" textAnchor="middle" className="fill-gray-700" fontSize="14">West Bengal</text>

                  {/* Odisha */}
                  <path
                    d="M 840 570 L 930 570 L 960 630 L 930 690 L 870 720 L 810 690 L 795 630 Z"
                    fill="#f8f8f8"
                    stroke="#333"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <text x="877" y="645" textAnchor="middle" className="fill-gray-700" fontSize="14">Odisha</text>

                  {/* Chhattisgarh */}
                  <path
                    d="M 720 690 L 795 630 L 840 690 L 810 750 L 750 780 L 690 765 L 675 720 Z"
                    fill="#f8f8f8"
                    stroke="#333"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <text x="757" y="705" textAnchor="middle" className="fill-gray-700" fontSize="14">CG</text>

                  {/* Maharashtra */}
                  <path
                    d="M 375 765 L 465 660 L 540 705 L 630 720 L 675 780 L 645 840 L 570 870 L 480 885 L 390 855 L 345 795 L 330 750 Z"
                    fill="#f8f8f8"
                    stroke="#333"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <text x="510" y="772" textAnchor="middle" className="fill-gray-700" fontSize="14">Maharashtra</text>

                  {/* Telangana */}
                  <path
                    d="M 645 780 L 720 765 L 750 810 L 720 855 L 675 870 L 645 840 Z"
                    fill="#f8f8f8"
                    stroke="#333"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <text x="697" y="817" textAnchor="middle" className="fill-gray-700" fontSize="14">TS</text>

                  {/* Andhra Pradesh */}
                  <g
                    onMouseEnter={() => setHoveredState('Andhra Pradesh')}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => handleStateClick('Andhra Pradesh')}
                    className="cursor-pointer"
                  >
                    <circle
                      cx="840"
                      cy="810"
                      r="40"
                      fill={getStateColor('Andhra Pradesh')}
                      stroke="#333"
                      strokeWidth="3"
                      opacity={hoveredState === 'Andhra Pradesh' ? 1 : 0.9}
                    />
                    <text x="840" y="815" textAnchor="middle" className="fill-black font-bold" fontSize="14">
                      Andhra Pradesh
                    </text>
                  </g>

                  {/* Karnataka */}
                  <g
                    onMouseEnter={() => setHoveredState('Karnataka')}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => handleStateClick('Karnataka')}
                    className="cursor-pointer"
                  >
                    <circle
                      cx="517"
                      cy="945"
                      r="38"
                      fill={getStateColor('Karnataka')}
                      stroke="#333"
                      strokeWidth="3"
                      opacity={hoveredState === 'Karnataka' ? 1 : 0.9}
                    />
                    <text x="517" y="950" textAnchor="middle" className="fill-black font-bold" fontSize="14">
                      Karnataka
                    </text>
                  </g>

                  {/* Kerala */}
                  <path
                    d="M 360 1020 L 420 1035 L 405 1095 L 375 1125 L 330 1110 L 315 1065 L 330 1035 Z"
                    fill="#f8f8f8"
                    stroke="#333"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <text x="367" y="1080" textAnchor="middle" className="fill-gray-700" fontSize="14">Kerala</text>

                  {/* Tamil Nadu */}
                  <g
                    onMouseEnter={() => setHoveredState('Tamil Nadu')}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => handleStateClick('Tamil Nadu')}
                    className="cursor-pointer"
                  >
                    <circle
                      cx="540"
                      cy="1087"
                      r="35"
                      fill={getStateColor('Tamil Nadu')}
                      stroke="#333"
                      strokeWidth="3"
                      opacity={hoveredState === 'Tamil Nadu' ? 1 : 0.9}
                    />
                    <text x="540" y="1092" textAnchor="middle" className="fill-black font-bold" fontSize="14">
                      Tamil Nadu
                    </text>
                  </g>

                  {/* Goa */}
                  <path
                    d="M 345 795 L 375 795 L 375 840 L 345 840 Z"
                    fill="#f8f8f8"
                    stroke="#333"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <text x="360" y="817" textAnchor="middle" className="fill-gray-700" fontSize="12">Goa</text>
                </g>

                {/* Production tooltip on hover */}
                {hoveredState && (
                  <g>
                    <rect
                      x={hoveredState === 'Rajasthan' ? 180 : hoveredState === 'Madhya Pradesh' ? 525 : hoveredState === 'Tamil Nadu' ? 420 : hoveredState === 'Gujarat' ? 120 : hoveredState === 'Punjab' ? 420 : hoveredState === 'Uttar Pradesh' ? 630 : hoveredState === 'Andhra Pradesh' ? 780 : hoveredState === 'Karnataka' ? 420 : 525}
                      y={hoveredState === 'Tamil Nadu' ? 1185 : hoveredState === 'Karnataka' ? 1050 : hoveredState === 'Andhra Pradesh' ? 930 : hoveredState === 'Punjab' ? 240 : hoveredState === 'Rajasthan' ? 480 : hoveredState === 'Madhya Pradesh' ? 645 : hoveredState === 'Gujarat' ? 705 : hoveredState === 'Uttar Pradesh' ? 435 : 240}
                      width="210"
                      height="75"
                      fill="#fff"
                      stroke="#FF9933"
                      strokeWidth="3"
                      rx="8"
                      opacity="0.95"
                    />
                    <text
                      x={hoveredState === 'Rajasthan' ? 285 : hoveredState === 'Madhya Pradesh' ? 630 : hoveredState === 'Tamil Nadu' ? 525 : hoveredState === 'Gujarat' ? 225 : hoveredState === 'Punjab' ? 525 : hoveredState === 'Uttar Pradesh' ? 735 : hoveredState === 'Andhra Pradesh' ? 885 : hoveredState === 'Karnataka' ? 525 : 630}
                      y={hoveredState === 'Tamil Nadu' ? 1215 : hoveredState === 'Karnataka' ? 1080 : hoveredState === 'Andhra Pradesh' ? 960 : hoveredState === 'Punjab' ? 270 : hoveredState === 'Rajasthan' ? 510 : hoveredState === 'Madhya Pradesh' ? 675 : hoveredState === 'Gujarat' ? 735 : hoveredState === 'Uttar Pradesh' ? 465 : 270}
                      text-anchor="middle"
                      className="fill-black font-bold"
                      fontSize="18"
                    >
                      {hoveredState}
                    </text>
                    <text
                      x={hoveredState === 'Rajasthan' ? 285 : hoveredState === 'Madhya Pradesh' ? 630 : hoveredState === 'Tamil Nadu' ? 525 : hoveredState === 'Gujarat' ? 225 : hoveredState === 'Punjab' ? 525 : hoveredState === 'Uttar Pradesh' ? 735 : hoveredState === 'Andhra Pradesh' ? 885 : hoveredState === 'Karnataka' ? 525 : 630}
                      y={hoveredState === 'Tamil Nadu' ? 1240 : hoveredState === 'Karnataka' ? 1105 : hoveredState === 'Andhra Pradesh' ? 985 : hoveredState === 'Punjab' ? 295 : hoveredState === 'Rajasthan' ? 535 : hoveredState === 'Madhya Pradesh' ? 700 : hoveredState === 'Gujarat' ? 760 : hoveredState === 'Uttar Pradesh' ? 490 : 295}
                      text-anchor="middle"
                      className="fill-#138808 font-bold"
                      fontSize="16"
                    >
                      {statesData[hoveredState]?.production}M tonnes
                    </text>
                  </g>
                )}
              </svg>

              {/* Tricolor Legend */}
              <div className="mt-4 p-4 bg-white rounded-lg border-4 border-gray-300 shadow-lg">
                <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 rounded" style={{ backgroundColor: '#FF9933' }} />
                  <span className="w-4 h-4 rounded bg-white border border-gray-300" />
                  <span className="w-4 h-4 rounded" style={{ backgroundColor: '#138808' }} />
                  Production Intensity (Tricolor Theme)
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FF9933' }} />
                    <span>High (7-8.5M tonnes)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-white border border-gray-400" />
                    <span>Medium (5-6.8M tonnes)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#138808' }} />
                    <span>Medium-Low (3-4.8M tonnes)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#e8f5e8' }} />
                    <span>Low (&lt;3M tonnes)</span>
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
              {selectedState ? `Rank #${selectedState.rank}` : 'Click on a state'}
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

export default IndiaOilseedMap;
