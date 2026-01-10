export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface CrimeEvent {
  id: string;
  type: string;
  severity: SeverityLevel;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  timestamp: Date;
  description: string;
}

export interface RiskAnalysis {
  score: number;
  level: SeverityLevel;
  breakdown: string;
  factors: {
    label: string;
    value: number;
    trend: 'up' | 'down' | 'stable';
  }[];
}

export interface TrendDataPoint {
  time: string;
  count: number;
  severity: SeverityLevel;
}

export type TimeRange = '1h' | '6h' | '24h';
export type EventType = 'theft' | 'assault' | 'vandalism' | 'burglary' | 'robbery';
