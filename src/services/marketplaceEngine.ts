import { 
  BKL, 
  LandMarketplaceListing, 
  TitleClearanceBadge, 
  DueDiligenceCheck, 
  GovernmentVerifiedData 
} from '../types/landRecords';

// Assam standard revenue measures:
// 1 Bigha = 5 Katha = 100 Lesa ≈ 1337.8038 sq.m.
// 1 Katha = 20 Lesa ≈ 267.5608 sq.m.
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

export function formatINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * 8-Point Title Due-Diligence Engine for Assam Land Records
 */
export function evaluateTitleDueDiligence(
  data: Omit<GovernmentVerifiedData, 'titleScore' | 'titleClearanceBadge' | 'checks'>
): { score: number; badge: TitleClearanceBadge; checks: DueDiligenceCheck[] } {
  const checks: DueDiligenceCheck[] = [];

  // 1. Tenure Check (Periodic vs Annual Patta)
  const isPeriodic = data.pattaType.includes('Periodic') || data.pattaType.includes('Myadi');
  checks.push({
    id: 'CHK-01',
    code: 'TENURE_CLASS',
    title: 'Tenure & Patta Type Alienability',
    category: 'TENURE',
    status: isPeriodic ? 'PASSED' : 'FAILED',
    points: isPeriodic ? 20 : 0,
    maxPoints: 20,
    details: isPeriodic 
      ? `Permanent alienable tenure (${data.pattaType}). Eligible for lawful transfer under ALRR 1886.`
      : `Annual / Non-transferable tenure (${data.pattaType}). Requires special conversion prior to sale.`,
    statutoryReference: 'Assam Land and Revenue Regulation 1886, Section 9'
  });

  // 2. Spatial-Textual Area Variance (|GIS Area - Jamabandi Area| / Jamabandi Area <= 5%)
  const variancePass = data.areaVariancePct <= 5.0;
  const varianceWarning = data.areaVariancePct > 5.0 && data.areaVariancePct <= 10.0;
  checks.push({
    id: 'CHK-02',
    code: 'AREA_VARIANCE',
    title: 'Cadastral Polygon vs. Jamabandi Area Consistency',
    category: 'AREA',
    status: variancePass ? 'PASSED' : (varianceWarning ? 'WARNING' : 'FAILED'),
    points: variancePass ? 15 : (varianceWarning ? 8 : 0),
    maxPoints: 15,
    details: `Variance between Bhudakshya polygon (${data.cadastralPolygonAreaSqM} sq.m) and Jamabandi (${data.recordedAreaSqM} sq.m) is ${data.areaVariancePct.toFixed(2)}% (statutory limit: 5%).`,
    statutoryReference: 'Assam Cadastral Survey Guidelines & BhuNaksha Tolerance Matrix'
  });

  // 3. Co-Sharer Partition & Share Sum
  const totalShares = data.pattadars.reduce((acc, p) => acc + p.sharePercentage, 0);
  const sharePass = Math.abs(totalShares - 100.0) < 0.1;
  checks.push({
    id: 'CHK-03',
    code: 'SHARE_INTEGRITY',
    title: 'Pattadar Title Share Completeness',
    category: 'CO_SHARER',
    status: sharePass ? 'PASSED' : 'WARNING',
    points: sharePass ? 15 : 5,
    maxPoints: 15,
    details: sharePass 
      ? `100% of fractional shares accounted for among ${data.pattadars.length} recorded pattadar(s).`
      : `Recorded co-sharer shares sum to ${totalShares.toFixed(1)}% (deficit/excess requires field partition).`,
    statutoryReference: 'Assam Land Records Manual, Chapter V (Partition & Share Allocation)'
  });

  // 4. e-Khajana Revenue Clearance
  const revenuePass = data.eKhajanaStatus.isClear && data.eKhajanaStatus.arrearsINR === 0;
  checks.push({
    id: 'CHK-04',
    code: 'REVENUE_STATUS',
    title: 'e-Khajana Land Revenue & Touzi Clearance',
    category: 'REVENUE',
    status: revenuePass ? 'PASSED' : 'WARNING',
    points: revenuePass ? 10 : 3,
    maxPoints: 10,
    details: revenuePass 
      ? `Annual Touzi demand (₹${data.eKhajanaStatus.annualTouziDemandINR}) fully discharged. Zero outstanding arrears.`
      : `Pending revenue arrears of ₹${data.eKhajanaStatus.arrearsINR.toFixed(2)}. Must be cleared before Sale NOC issuance.`,
    statutoryReference: 'Assam Land Revenue Re-assessment Act & e-Khajana Portal'
  });

  // 5. Encumbrance / Bank Mortgage Search
  const activeEncumbrance = data.encumbrances.some(e => e.status === 'ACTIVE');
  checks.push({
    id: 'CHK-05',
    code: 'ENCUMBRANCE_STATUS',
    title: 'Registered Encumbrances & Bank Liens',
    category: 'ENCUMBRANCE',
    status: !activeEncumbrance ? 'PASSED' : 'FAILED',
    points: !activeEncumbrance ? 15 : 0,
    maxPoints: 15,
    details: !activeEncumbrance 
      ? 'Clean financial title. Zero active bank hypothecations or financial charges on e-Panjeeyan ledger.'
      : `Active bank charge detected: ${data.encumbrances.map(e => `${e.institution} (${e.type})`).join(', ')}. Requires bank NOC.`,
    statutoryReference: 'Registration Act 1908 & Sub-Registrar Encumbrance Certificate Records'
  });

  // 6. Court Litigation Injunction Check
  const activeStay = data.courtLitigationFlags.some(f => f.status === 'ACTIVE_INJUNCTION');
  const lisPendens = data.courtLitigationFlags.some(f => f.status === 'LIS_PENDENS');
  checks.push({
    id: 'CHK-06',
    code: 'LITIGATION_STATUS',
    title: 'Revenue Court & Civil Injunction Status',
    category: 'LITIGATION',
    status: !activeStay && !lisPendens ? 'PASSED' : (lisPendens ? 'WARNING' : 'FAILED'),
    points: !activeStay && !lisPendens ? 10 : (lisPendens ? 4 : 0),
    maxPoints: 10,
    details: !activeStay && !lisPendens
      ? 'Zero pending civil injunctions, title disputes, or revenue court stay orders on record.'
      : `Litigation note: ${data.courtLitigationFlags.map(f => f.details).join('; ')}`,
    statutoryReference: 'Civil Procedure Code Section 52 (Lis Pendens) & Revenue Court Case Registry'
  });

  // 7. Chapter X Tribal Belt / Block Compliance
  const isTribalBelt = data.chapterXTribalBeltStatus === 'NOTIFIED_BELT_PROTECTED_CLASS_ONLY';
  checks.push({
    id: 'CHK-07',
    code: 'TRIBAL_BELT_COMPLIANCE',
    title: 'Chapter X Tribal Belt / Block Safeguards',
    category: 'TRIBAL_BELT',
    status: !isTribalBelt ? 'PASSED' : 'WARNING',
    points: !isTribalBelt ? 10 : 6,
    maxPoints: 10,
    details: !isTribalBelt 
      ? 'Parcel lies outside notified Tribal Belts/Blocks. Open for general lawful transfer.'
      : 'Situated within Notified Tribal Belt/Block. Transfer restricted strictly to protected class citizens.',
    statutoryReference: 'Assam Land and Revenue Regulation 1886, Chapter X (Protection of Backward Classes)'
  });

  // 8. Ecological Buffer & Classification Check
  const isEcological = data.landClass.includes('VGR') || data.landClass.includes('PGR') || data.landClass.includes('Reserve');
  checks.push({
    id: 'CHK-08',
    code: 'ECOLOGICAL_BUFFER',
    title: 'Ecological Reserve & Public Land Buffer',
    category: 'ECOLOGICAL',
    status: !isEcological ? 'PASSED' : 'FAILED',
    points: !isEcological ? 5 : 0,
    maxPoints: 5,
    details: !isEcological
      ? `Permissible private classification (${data.landClass}). Zero overlap with Village Grazing Reserves.`
      : `Critical conflict: Parcel classified under protected public reserve (${data.landClass}). Non-alienable.`,
    statutoryReference: 'Assam Land Policy 2019 & Protection of Grazing Reserves Directive'
  });

  // Compute Total Score
  const score = checks.reduce((acc, c) => acc + c.points, 0);

  // Derive Badge
  let badge: TitleClearanceBadge = 'RESTRICTED';
  if (score >= 90 && !activeEncumbrance && !activeStay && isPeriodic) {
    badge = 'GOLD_VERIFIED';
  } else if (score >= 75 && !activeStay && isPeriodic) {
    badge = 'SILVER_VERIFIED';
  } else if (score >= 50) {
    badge = 'CONDITIONAL';
  } else {
    badge = 'RESTRICTED';
  }

  return { score, badge, checks };
}

/**
 * Computes estimated statutory transfer charges (Stamp Duty, Registration, Facilitation)
 */
export function calculateTransactionFees(
  agreedPriceINR: number,
  zonalValuationINR: number,
  facilitationFeePct: number = 0.25
) {
  // In Assam: Stamp Duty is evaluated on whichever is higher (Agreed Price or Zonal Value)
  const taxableBase = Math.max(agreedPriceINR, zonalValuationINR);
  
  // Standard Assam Stamp Duty: 6% for general transfer, Registration Fee: 2%
  const stampDutyINR = Math.round(taxableBase * 0.06);
  const registrationFeeINR = Math.round(taxableBase * 0.02);
  const facilitationFeeINR = Math.round(agreedPriceINR * (facilitationFeePct / 100));
  const estimatedTotalCostINR = agreedPriceINR + stampDutyINR + registrationFeeINR + facilitationFeeINR;

  return {
    taxableBase,
    stampDutyINR,
    registrationFeeINR,
    facilitationFeeINR,
    estimatedTotalCostINR,
    savingsComparedToBrokerINR: Math.round(agreedPriceINR * 0.05) - facilitationFeeINR // assumes 5% broker fee
  };
}
