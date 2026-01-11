export type SeverityLevel = 'violent' | 'property' | 'vandalism' | 'public';

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
export type EventType = 'HOMICIDE' | 'BATTERY' | 'ASSAULT'
  | 'ROBBERY' | 'KIDNAPPING' | 'CRIMINAL SEXUAL ASSAULT'
  | 'OFFENSE INVOLVING CHILDREN' | 'STALKING' | 'INTIMIDATION'
  | 'HUMAN TRAFFICKING' | 'RITUALISM' | 'THEFT'
  | 'BURGLARY' | 'MOTOR VEHICLE THEFT' | 'THEFT OF ANY'
  | 'CRIMINAL DAMAGE' | 'ARSON' | 'CRIMINAL TRESPASS'
  | 'NARCOTICS' | 'WEAPONS VIOLATION' | 'DECEPTIVE PRACTICE'
  | 'PROSTITUTION' | 'PUBLIC PEACE VIOLATION' | 'INTERFERENCE WITH PUBLIC OFFICER'
  | 'LIQUOR LAW VIOLATION' | 'GAMBLING' | 'OBSCENITY' | 'PUBLIC INDECENCY'
  | 'OTHER OFFENSE' | 'NON-CRIMINAL' | 'NON-CRIMINAL (SUBJECT SPECIFIED)'
  | 'OTHER NARCOTIC VIOLATION' | 'CONCEALED CARRY LICENSE VIOLATION';

export const ChicagoCrimeRecord: Record<string, SeverityLevel> = {
  'HOMICIDE': 'violent',
  'BATTERY': 'violent',
  'ASSAULT': 'violent',
  'ROBBERY': 'violent',
  'KIDNAPPING': 'violent',
  'CRIMINAL SEXUAL ASSAULT': 'violent',
  'OFFENSE INVOLVING CHILDREN': 'violent',
  'STALKING': 'violent',
  'INTIMIDATION': 'violent',
  'HUMAN TRAFFICKING': 'violent',
  'RITUALISM': 'violent',

  // 2. Property (재산/침입 범죄) - 주황색 계열 권장
  'THEFT': 'property',
  'BURGLARY': 'property',
  'MOTOR VEHICLE THEFT': 'property',
  'THEFT OF ANY': 'property', // 가끔 나타나는 변종 대비

  // 3. Vandalism (파손/침입) - 노란색 계열 권장
  'CRIMINAL DAMAGE': 'vandalism',
  'ARSON': 'vandalism',
  'CRIMINAL TRESPASS': 'vandalism',

  // 4. Public (공공 질서/기타) - 파란색/회색 계열 권장
  'NARCOTICS': 'public',
  'WEAPONS VIOLATION': 'public',
  'DECEPTIVE PRACTICE': 'public',
  'PROSTITUTION': 'public',
  'PUBLIC PEACE VIOLATION': 'public',
  'INTERFERENCE WITH PUBLIC OFFICER': 'public',
  'LIQUOR LAW VIOLATION': 'public',
  'GAMBLING': 'public',
  'OBSCENITY': 'public',
  'PUBLIC INDECENCY': 'public',
  'OTHER OFFENSE': 'public',
  'NON-CRIMINAL': 'public',
  'NON-CRIMINAL (SUBJECT SPECIFIED)': 'public',
  'OTHER NARCOTIC VIOLATION': 'public',
  'CONCEALED CARRY LICENSE VIOLATION': 'public'
};
