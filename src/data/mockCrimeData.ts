import { CrimeEvent, RiskAnalysis, TrendDataPoint, SeverityLevel, ChicagoCrimeRecord } from '@/types/crime';

// San Francisco coordinates
const SF_CENTER = { lat: 37.7749, lng: -122.4194 };

const generateRandomOffset = (range: number) => (Math.random() - 0.5) * range;

const crimeTypes = [
  "HOMICIDE", "BATTERY", "ASSAULT", "ROBBERY", "KIDNAPPING",
  "CRIMINAL SEXUAL ASSAULT", "OFFENSE INVOLVING CHILDREN", "STALKING", "INTIMIDATION", "HUMAN TRAFFICKING",
  "RITUALISM", "THEFT", "BURGLARY", "MOTOR VEHICLE THEFT", "THEFT OF ANY",
  "CRIMINAL DAMAGE", "ARSON", "CRIMINAL TRESPASS", "NARCOTICS", "WEAPONS VIOLATION",
  "DECEPTIVE PRACTICE", "PROSTITUTION", "PUBLIC PEACE VIOLATION", "INTERFERENCE WITH PUBLIC OFFICER", "LIQUOR LAW VIOLATION",
  "GAMBLING", "OBSCENITY", "PUBLIC INDECENCY", "OTHER OFFENSE", "NON-CRIMINAL", "NON-CRIMINAL (SUBJECT SPECIFIED)",
  "OTHER NARCOTIC VIOLATION", "CONCEALED CARRY LICENSE VIOLATION"
];
const severities: SeverityLevel[] = ['violent', 'property', 'vandalism', 'public'];
const addresses = [
  'Market St & 5th St',
  'Mission District',
  'SOMA Area',
  'Financial District',
  'Tenderloin',
  'Civic Center',
  'Union Square',
  'Embarcadero',
  'North Beach',
  'Chinatown',
];

export const generateMockEvents = (count: number = 15): CrimeEvent[] => {
  const events: CrimeEvent[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const minutesAgo = Math.floor(Math.random() * 1440); // Up to 24 hours ago
    const timestamp = new Date(now.getTime() - minutesAgo * 60000);
    const crime = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
    
    events.push({
      id: `evt-${i + 1}`,
      type: crimeTypes[Math.floor(Math.random() * crimeTypes.length)],
      severity: ChicagoCrimeRecord[crime],
      location: {
        lat: SF_CENTER.lat + generateRandomOffset(0.05),
        lng: SF_CENTER.lng + generateRandomOffset(0.08),
        address: addresses[Math.floor(Math.random() * addresses.length)],
      },
      timestamp,
      description: `Reported incident in the area`,
    });
  }

  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const generateRiskAnalysis = (): RiskAnalysis => {
  const score = Math.floor(Math.random() * 40) + 60; // 60-100
  let level: SeverityLevel = 'public';
  if (score >= 85) level = 'violent';
  else if (score >= 70) level = 'property';
  else if (score >= 50) level = 'vandalism';

  return {
    score,
    level,
    breakdown: `High density of thefts within analysis radius. ${Math.floor(Math.random() * 10 + 5)} incidents in last hour.`,
    factors: [
      { label: 'Theft Activity', value: Math.floor(Math.random() * 30 + 70), trend: 'up' },
      { label: 'Assault Reports', value: Math.floor(Math.random() * 50 + 20), trend: 'down' },
      { label: 'Property Crime', value: Math.floor(Math.random() * 40 + 40), trend: 'stable' },
      { label: 'Vandalism', value: Math.floor(Math.random() * 30 + 10), trend: 'down' },
    ],
  };
};

export const generateTrendData = (hours: number): TrendDataPoint[] => {
  const data: TrendDataPoint[] = [];
  const now = new Date();
  const intervals = hours <= 1 ? 12 : hours <= 6 ? 24 : 48;
  const intervalMinutes = (hours * 60) / intervals;

  for (let i = intervals - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * intervalMinutes * 60000);
    const count = Math.floor(Math.random() * 15) + 2;
    const severityIndex = Math.floor(Math.random() * severities.length);
    
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      count,
      severity: severities[severityIndex],
    });
  }

  return data;
};

export const mockEvents = generateMockEvents(15);
export const mockRiskAnalysis = generateRiskAnalysis();
export const mockTrendData = generateTrendData(6);
