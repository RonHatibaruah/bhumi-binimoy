export type PattaType = 
  | 'Myadi (Periodic)' 
  | 'Eksona (Annual)' 
  | 'Kheraj Myadi' 
  | 'Nisf-Kheraj' 
  | 'Govt Khas / Allotment';

export type LandClassification = 
  | 'Basti (Residential)' 
  | 'Sali (Paddy/Agricultural)' 
  | 'Ahu (Agricultural)' 
  | 'Byabasayik (Commercial)' 
  | 'Patit (Fallow)' 
  | 'VGR (Village Grazing Reserve)' 
  | 'PGR (Professional Grazing Reserve)' 
  | 'Beel / Jalashay (Wetland)' 
  | 'Road / Public Infrastructure';

export interface Pattadar {
  id: string;
  name: string;
  guardianName: string;
  relation: 'Son of' | 'Daughter of' | 'Wife of' | 'Care of';
  sharePercentage: number; // e.g. 50% = 50
  aadhaarStatus: 'VERIFIED' | 'PENDING' | 'MISSING';
  phone: string;
  isTribalProtected: boolean;
}

export interface BKL {
  bigha: number;
  katha: number; // 0-4 (5 katha = 1 bigha)
  lesa: number;  // 0-19.99 (20 lesa = 1 katha)
}

export type AnomalyType = 
  | 'SPATIAL_AREA_MISMATCH'
  | 'SPATIAL_OVERLAP'
  | 'ZERO_OR_NULL_REVENUE'
  | 'SHARE_SUM_MISMATCH'
  | 'PROTECTED_LAND_ENCROACHMENT'
  | 'MISSING_MANDATORY_METADATA'
  | 'UNRESOLVED_ENCUMBRANCE'
  | 'UNCLOSED_BOUNDARY_TOPOLOGY';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface Anomaly {
  id: string;
  type: AnomalyType;
  title: string;
  description: string;
  severity: SeverityLevel;
  penaltyPoints: number;
  suggestedAction: string;
  detectedAt: string;
}

export type HealthGrade = 'GRADE_A' | 'GRADE_B' | 'GRADE_C' | 'GRADE_D';

export interface HealthReport {
  score: number; // 0 to 100
  grade: HealthGrade;
  riskStatus: 'CLEAN' | 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK';
  anomalies: Anomaly[];
  evaluatedAt: string;
  isEligibleForFastTrack: boolean;
}

export type VerificationStatus = 
  | 'HEALTHY_VERIFIED'
  | 'PENDING_AUDIT'
  | 'ASSIGNED_TO_MANDAL'
  | 'FIELD_INSPECTION_COMPLETED'
  | 'CORRECTION_RECOMMENDED';

export interface LandRecord {
  id: string;
  dagNumber: string;
  pattaNumber: string;
  pattaType: PattaType;
  district: string;
  circle: string;
  mouza: string;
  village: string;
  landClass: LandClassification;
  inTribalBelt: boolean;
  
  // Recorded textual values (Jamabandi)
  jamabandiArea: BKL;
  jamabandiAreaSqM: number;
  annualRevenueRs: number;
  localCessRs: number;
  
  // GIS Cadastral Data (Bhudakshya)
  cadastralAreaSqM: number;
  cadastralAreaBKL: BKL;
  coordinates: [number, number][]; // Polygon rings [[lat, lng], ...]
  overlapsWithDag?: string;
  
  pattadars: Pattadar[];
  legacyNotes: string[];
  
  healthReport: HealthReport;
  verificationStatus: VerificationStatus;
  assignedMandal?: string;
  fieldNotes?: string;
  lastUpdated: string;
}

export interface VerificationTask {
  id: string;
  dagId: string;
  dagNumber: string;
  pattaNumber: string;
  village: string;
  circle: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  assignedMandal: string;
  anomaliesSummary: string[];
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
  scheduledDate: string;
  findings?: {
    onGroundAreaBKL?: BKL;
    boundaryMarkersIntact: boolean;
    possessionVerified: boolean;
    remarks: string;
    verifiedAt: string;
    gpsCoordinates?: string;
  };
}
