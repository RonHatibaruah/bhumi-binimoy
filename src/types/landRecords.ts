export type PattaType = 
  | 'Periodic Patta (Khiraj Myadi)' 
  | 'Annual Patta (Eksona)' 
  | 'Special Grant / Tea Grant' 
  | 'Nisf-Kheraj' 
  | 'Govt Khas / Allotment';

export type LandClassification = 
  | 'Basti (Residential)' 
  | 'Bari (Homestead/Orchard)'
  | 'Sali (Paddy/Agricultural)' 
  | 'Ahu (Agricultural)' 
  | 'Byabasayik (Commercial)' 
  | 'Patit (Fallow)' 
  | 'Industrial (AIIDC Belt)'
  | 'VGR / PGR (Ecological Reserve)';

export interface BKL {
  bigha: number;
  katha: number; // 0-4 (5 katha = 1 bigha)
  lesa: number;  // 0-19.99 (20 lesa = 1 katha)
}

export type TitleClearanceBadge = 'GOLD_VERIFIED' | 'SILVER_VERIFIED' | 'CONDITIONAL' | 'RESTRICTED';

export type ListingStage = 
  | 'VERIFIED_AVAILABLE'
  | 'INQUIRIES_OPEN'
  | 'EOI_SUBMITTED'
  | 'OFFER_ACCEPTED'
  | 'SALE_NOC_IN_PROGRESS'
  | 'REGISTRATION_SCHEDULED'
  | 'COMPLETED_MUTATED';

export interface PattadarInfo {
  id: string;
  nameMasked: string;
  guardianNameMasked: string;
  sharePercentage: number;
  isAadhaarVerified: boolean;
  phoneMasked: string;
  isTribalProtected: boolean;
}

export interface DueDiligenceCheck {
  id: string;
  code: string;
  title: string;
  category: 'TENURE' | 'AREA' | 'CO_SHARER' | 'REVENUE' | 'ENCUMBRANCE' | 'LITIGATION' | 'TRIBAL_BELT' | 'ECOLOGICAL';
  status: 'PASSED' | 'WARNING' | 'FAILED';
  points: number;
  maxPoints: number;
  details: string;
  statutoryReference: string;
}

export interface GovernmentVerifiedData {
  dagNumber: string;
  pattaNumber: string;
  pattaType: PattaType;
  landClass: LandClassification;
  recordedAreaBKL: BKL;
  recordedAreaSqM: number;
  cadastralPolygonAreaSqM: number;
  areaVariancePct: number;
  pattadars: PattadarInfo[];
  zonalRatePerBighaINR: number;
  totalZonalValuationINR: number;
  eKhajanaStatus: {
    isClear: boolean;
    lastPaymentDate: string;
    annualTouziDemandINR: number;
    arrearsINR: number;
  };
  encumbrances: {
    type: string;
    institution: string;
    status: 'ACTIVE' | 'DISCHARGED' | 'NONE';
    registeredDate?: string;
  }[];
  courtLitigationFlags: {
    caseNumber?: string;
    courtName?: string;
    status: 'NO_ACTIVE_STAY' | 'ACTIVE_INJUNCTION' | 'LIS_PENDENS';
    details: string;
  }[];
  chapterXTribalBeltStatus: 'OUTSIDE_TRIBAL_BELT' | 'NOTIFIED_BELT_PROTECTED_CLASS_ONLY';
  titleClearanceBadge: TitleClearanceBadge;
  titleScore: number; // 0-100
  checks: DueDiligenceCheck[];
  lastReconciledAt: string;
}

export interface SellerRepresentations {
  askingPriceINR: number;
  askingPricePerBighaINR: number;
  priceOverZonalPct: number;
  fairValueAssessment: 'FAIR_MARKET' | 'MODERATE_PREMIUM' | 'HIGH_PREMIUM' | 'BELOW_ZONAL';
  propertyHighlights: string;
  possessionStatus: 'IMMEDIATE_VACANT' | 'TENANTED' | 'PARTIAL_POSSESSION';
  approachRoadWidthFeet: number;
  amenities: string[];
  sellerStatement: string;
  voluntaryConsentDeclaration: string;
  voluntaryConsentTimestamp: string;
  photos: string[];
}

export interface BuyerOffer {
  id: string;
  buyerNameMasked: string;
  buyerPhoneMasked: string;
  offeredAmountINR: number;
  earnestDepositTokenINR: number;
  submittedAt: string;
  status: 'SUBMITTED' | 'ACCEPTED' | 'COUNTERED' | 'REJECTED';
  proposedPaymentTerms: string;
}

export interface LandMarketplaceListing {
  id: string;
  title: string;
  district: string;
  circle: string;
  mouza: string;
  village: string;
  coordinates: [number, number][]; // Polygon coordinates [[lat, lng], ...]
  centerPoint: [number, number];   // [lat, lng]
  stage: ListingStage;
  governmentVerified: GovernmentVerifiedData;
  sellerRepresentations: SellerRepresentations;
  offers: BuyerOffer[];
  facilitationFeePct: number; // e.g. 0.25%
  estimatedFacilitationFeeINR: number;
  createdAt: string;
}

// Backward compatibility alias
export type LandRecord = LandMarketplaceListing;
