import { BKL, Anomaly, HealthReport, LandRecord, HealthGrade } from '../types/landRecords';

// 1 Bigha = 5 Katha = 100 Lesa
// 1 Katha = 20 Lesa
// In Assam standard revenue measures: 1 Bigha = 14,400 sq ft ≈ 1337.8038 sq.m.
// 1 Lesa ≈ 13.378038 sq.m.
export const SQM_PER_LESA = 13.378038;

export function bklToLesa(bkl: BKL): number {
  return (bkl.bigha * 100) + (bkl.katha * 20) + bkl.lesa;
}

export function bklToSqM(bkl: BKL): number {
  return Math.round(bklToLesa(bkl) * SQM_PER_LESA * 100) / 100;
}

export function sqMToBKL(sqM: number): BKL {
  const totalLesa = sqM / SQM_PER_LESA;
  const bigha = Math.floor(totalLesa / 100);
  const remainingAfterBigha = totalLesa % 100;
  const katha = Math.floor(remainingAfterBigha / 20);
  const lesa = Math.round((remainingAfterBigha % 20) * 10) / 10;
  return { bigha, katha, lesa };
}

export function formatBKL(bkl: BKL): string {
  return `${bkl.bigha}B - ${bkl.katha}K - ${bkl.lesa}L`;
}

/**
 * Executes the full deterministic health check audit on a land record.
 * Implements strict rules adhering to the Assam Land and Revenue Regulation, 1886.
 */
export function auditLandRecord(record: Omit<LandRecord, 'healthReport'>): HealthReport {
  const anomalies: Anomaly[] = [];
  const now = new Date().toISOString().split('T')[0];

  // RULE 1: Spatial Cadastral Area vs Jamabandi Textual Area Discrepancy
  const textSqM = record.jamabandiAreaSqM || bklToSqM(record.jamabandiArea);
  const cadSqM = record.cadastralAreaSqM;
  const areaDiffSqM = Math.abs(cadSqM - textSqM);
  const variancePercentage = textSqM > 0 ? (areaDiffSqM / textSqM) * 100 : 100;

  if (variancePercentage > 5.0) {
    const isCritical = variancePercentage > 15.0;
    anomalies.push({
      id: `ANOM-${record.dagNumber}-1`,
      type: 'SPATIAL_AREA_MISMATCH',
      title: 'Cadastral GIS Area Mismatch',
      description: `Bhudakshya polygon area (${cadSqM.toFixed(1)} sq.m / ${formatBKL(record.cadastralAreaBKL)}) deviates from Jamabandi recorded area (${textSqM.toFixed(1)} sq.m / ${formatBKL(record.jamabandiArea)}) by ${variancePercentage.toFixed(1)}%.`,
      severity: isCritical ? 'CRITICAL' : 'HIGH',
      penaltyPoints: isCritical ? 35 : 20,
      suggestedAction: 'Deploy Lat Mandal for GPS ground survey verification and map rectification under Rule 48.',
      detectedAt: now
    });
  }

  // RULE 2: Cadastral Boundary Overlap
  if (record.overlapsWithDag) {
    anomalies.push({
      id: `ANOM-${record.dagNumber}-2`,
      type: 'SPATIAL_OVERLAP',
      title: 'Cadastral Polygon Overlap Detected',
      description: `Dag ${record.dagNumber} geometry overlaps with adjacent Dag ${record.overlapsWithDag} by intersecting polygon boundaries.`,
      severity: 'CRITICAL',
      penaltyPoints: 35,
      suggestedAction: 'Require boundary settlement and demarcation hearing before Circle Officer.',
      detectedAt: now
    });
  }

  // RULE 3: Zero or Null Land Revenue on Taxable Land
  const exemptClasses = ['VGR (Village Grazing Reserve)', 'PGR (Professional Grazing Reserve)', 'Beel / Jalashay (Wetland)', 'Road / Public Infrastructure'];
  if (!exemptClasses.includes(record.landClass)) {
    if (record.annualRevenueRs <= 0) {
      anomalies.push({
        id: `ANOM-${record.dagNumber}-3`,
        type: 'ZERO_OR_NULL_REVENUE',
        title: 'Zero Land Revenue Assessment',
        description: `Privately held ${record.landClass} under ${record.pattaType} shows ₹0.00 annual revenue assessment. Potential revenue leakage or missing reassessment.`,
        severity: 'MEDIUM',
        penaltyPoints: 15,
        suggestedAction: 'Generate revised Touzi revenue assessment demand note for the Mouzadar.',
        detectedAt: now
      });
    }
  }

  // RULE 4: Pattadar Title Share Consistency (Must equal exactly 100%)
  const totalShares = record.pattadars.reduce((sum, p) => sum + p.sharePercentage, 0);
  if (Math.abs(totalShares - 100) > 0.01) {
    const isOver = totalShares > 100;
    anomalies.push({
      id: `ANOM-${record.dagNumber}-4`,
      type: 'SHARE_SUM_MISMATCH',
      title: 'Pattadar Ownership Share Drift',
      description: `Aggregate recorded pattadar shares equal ${totalShares}%, violating unity of title (${isOver ? 'Exceeds 100%' : 'Deficit under 100% - missing unallocated heirs'}).`,
      severity: 'HIGH',
      penaltyPoints: 25,
      suggestedAction: 'Initiate suo-motu field mutation or partition case under Section 97 of ALRR.',
      detectedAt: now
    });
  }

  // RULE 5: Tribal Belt / Protected Class Violations (Assam Land & Revenue Regulation Chapter X)
  if (record.inTribalBelt) {
    const nonTribalHolders = record.pattadars.filter(p => !p.isTribalProtected);
    if (nonTribalHolders.length > 0) {
      anomalies.push({
        id: `ANOM-${record.dagNumber}-5`,
        type: 'PROTECTED_LAND_ENCROACHMENT',
        title: 'Chapter X Tribal Belt Transfer Flag',
        description: `Parcel is situated in a notified Tribal Belt/Block, but holds non-protected landholder(s): ${nonTribalHolders.map(h => h.name).join(', ')}.`,
        severity: 'CRITICAL',
        penaltyPoints: 35,
        suggestedAction: 'Flag for legal inquiry under Deputy Commissioner / Chapter X Revenue Court.',
        detectedAt: now
      });
    }
  }

  // Protected Land Class misuse (Private patta on Grazing Reserve / Wetland)
  if ((record.landClass.includes('Grazing') || record.landClass.includes('Beel')) && record.pattaType.includes('Myadi')) {
    anomalies.push({
      id: `ANOM-${record.dagNumber}-5b`,
      type: 'PROTECTED_LAND_ENCROACHMENT',
      title: 'Ecological / Common Land Patta Irregularity',
      description: `Myadi private patta issued on designated ${record.landClass}. High risk of ecological encroachment or irregular settlement.`,
      severity: 'CRITICAL',
      penaltyPoints: 40,
      suggestedAction: 'Notify Revenue Circle Officer for de-reservation scrutiny.',
      detectedAt: now
    });
  }

  // RULE 6: Incomplete Pattadar Information & KYC
  const missingKycPattadars = record.pattadars.filter(
    p => p.aadhaarStatus === 'MISSING' || !p.guardianName || p.guardianName.trim() === ''
  );
  if (missingKycPattadars.length > 0) {
    anomalies.push({
      id: `ANOM-${record.dagNumber}-6`,
      type: 'MISSING_MANDATORY_METADATA',
      title: 'Incomplete Landholder Identification (KYC)',
      description: `${missingKycPattadars.length} Pattadar(s) have missing guardian name or unlinked digital identity records.`,
      severity: 'LOW',
      penaltyPoints: 5 * missingKycPattadars.length,
      suggestedAction: 'Trigger automated SMS reminder for Mission Basundhara self-authentication.',
      detectedAt: now
    });
  }

  // RULE 7: Unresolved Encumbrance Notes
  const unresolvedNotes = record.legacyNotes.filter(n => 
    n.toLowerCase().includes('mortgage') || 
    n.toLowerCase().includes('stay') || 
    n.toLowerCase().includes('dispute') ||
    n.toLowerCase().includes('acquisition')
  );
  if (unresolvedNotes.length > 0) {
    anomalies.push({
      id: `ANOM-${record.dagNumber}-7`,
      type: 'UNRESOLVED_ENCUMBRANCE',
      title: 'Active Encumbrance / Legal Restriction Note',
      description: `Unredeemed historical notation detected: "${unresolvedNotes[0]}".`,
      severity: 'MEDIUM',
      penaltyPoints: 15,
      suggestedAction: 'Cross-reference with e-Panjeeyan and Bank NOC repository for digital release.',
      detectedAt: now
    });
  }

  // Compute Composite Land Health Score
  const totalPenalties = anomalies.reduce((sum, a) => sum + a.penaltyPoints, 0);
  const score = Math.max(0, 100 - totalPenalties);

  let grade: HealthGrade = 'GRADE_A';
  let riskStatus: 'CLEAN' | 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK' = 'CLEAN';

  if (score >= 85) {
    grade = 'GRADE_A';
    riskStatus = anomalies.length === 0 ? 'CLEAN' : 'LOW_RISK';
  } else if (score >= 65) {
    grade = 'GRADE_B';
    riskStatus = 'LOW_RISK';
  } else if (score >= 40) {
    grade = 'GRADE_C';
    riskStatus = 'MODERATE_RISK';
  } else {
    grade = 'GRADE_D';
    riskStatus = 'HIGH_RISK';
  }

  return {
    score,
    grade,
    riskStatus,
    anomalies,
    evaluatedAt: now,
    isEligibleForFastTrack: score >= 85 && anomalies.length === 0
  };
}
