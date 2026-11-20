import { LandRecord, VerificationTask } from '../types/landRecords';
import { auditLandRecord, sqMToBKL } from '../services/healthCheckEngine';

// Coordinates centered around Dispur / Khanapara / Sonapur in Assam (Lat ~26.13, Lng ~91.80)
const rawLandRecordsData: Array<Omit<LandRecord, 'healthReport'>> = [
  // DAG 101 - Clean Grade A Record (Dispur - Jatia)
  {
    id: 'AS-KM-DIS-JAT-101',
    dagNumber: '101',
    pattaNumber: 'KP-452',
    pattaType: 'Kheraj Myadi',
    district: 'Kamrup Metropolitan',
    circle: 'Dispur',
    mouza: 'Beltola',
    village: 'Jatia',
    landClass: 'Basti (Residential)',
    inTribalBelt: false,
    jamabandiArea: { bigha: 0, katha: 2, lesa: 10 },
    jamabandiAreaSqM: 668.9,
    cadastralAreaSqM: 671.2,
    cadastralAreaBKL: { bigha: 0, katha: 2, lesa: 10.2 },
    annualRevenueRs: 245.0,
    localCessRs: 61.25,
    coordinates: [
      [26.1380, 91.7910],
      [26.1388, 91.7912],
      [26.1387, 91.7925],
      [26.1379, 91.7923],
      [26.1380, 91.7910]
    ],
    pattadars: [
      {
        id: 'P-101-1',
        name: 'Pranab Kumar Goswami',
        guardianName: 'Late Bhabesh Goswami',
        relation: 'Son of',
        sharePercentage: 100,
        aadhaarStatus: 'VERIFIED',
        phone: '+91 94350 12890',
        isTribalProtected: false
      }
    ],
    legacyNotes: ['Mutated vide CO Dispur Order No. 892/2019.'],
    verificationStatus: 'HEALTHY_VERIFIED',
    lastUpdated: '2026-08-14'
  },

  // DAG 102 - Spatial Area Mismatch (Dispur - Jatia)
  {
    id: 'AS-KM-DIS-JAT-102',
    dagNumber: '102',
    pattaNumber: 'KP-453',
    pattaType: 'Kheraj Myadi',
    district: 'Kamrup Metropolitan',
    circle: 'Dispur',
    mouza: 'Beltola',
    village: 'Jatia',
    landClass: 'Basti (Residential)',
    inTribalBelt: false,
    jamabandiArea: { bigha: 1, katha: 1, lesa: 0 }, // 120 Lesas = 1605.3 sq.m.
    jamabandiAreaSqM: 1605.3,
    cadastralAreaSqM: 1290.0, // Significant shortfall: ~20% deviation!
    cadastralAreaBKL: { bigha: 0, katha: 4, lesa: 16.4 },
    annualRevenueRs: 480.0,
    localCessRs: 120.0,
    coordinates: [
      [26.1388, 91.7912],
      [26.1398, 91.7915],
      [26.1396, 91.7927],
      [26.1387, 91.7925],
      [26.1388, 91.7912]
    ],
    pattadars: [
      {
        id: 'P-102-1',
        name: 'Ratna Barua',
        guardianName: 'Mukul Barua',
        relation: 'Wife of',
        sharePercentage: 50,
        aadhaarStatus: 'VERIFIED',
        phone: '+91 98640 44211',
        isTribalProtected: false
      },
      {
        id: 'P-102-2',
        name: 'Deepak Barua',
        guardianName: 'Mukul Barua',
        relation: 'Son of',
        sharePercentage: 50,
        aadhaarStatus: 'VERIFIED',
        phone: '+91 98641 55322',
        isTribalProtected: false
      }
    ],
    legacyNotes: ['Partitioned in 2008 without updated D-sketch.'],
    verificationStatus: 'ASSIGNED_TO_MANDAL',
    assignedMandal: 'Biren Kalita (LM-04)',
    lastUpdated: '2026-09-02'
  },

  // DAG 103 & 104 - Cadastral Polygon Overlap (Dispur - Jatia)
  {
    id: 'AS-KM-DIS-JAT-103',
    dagNumber: '103',
    pattaNumber: 'KP-454',
    pattaType: 'Kheraj Myadi',
    district: 'Kamrup Metropolitan',
    circle: 'Dispur',
    mouza: 'Beltola',
    village: 'Jatia',
    landClass: 'Byabasayik (Commercial)',
    inTribalBelt: false,
    jamabandiArea: { bigha: 0, katha: 3, lesa: 15 },
    jamabandiAreaSqM: 1003.3,
    cadastralAreaSqM: 1010.0,
    cadastralAreaBKL: { bigha: 0, katha: 3, lesa: 15.5 },
    annualRevenueRs: 1250.0,
    localCessRs: 312.5,
    overlapsWithDag: '104',
    coordinates: [
      [26.1379, 91.7923],
      [26.1387, 91.7925],
      [26.1385, 91.7938],
      [26.1376, 91.7936],
      [26.1379, 91.7923]
    ],
    pattadars: [
      {
        id: 'P-103-1',
        name: 'Jyotish Das',
        guardianName: 'Dimbeswar Das',
        relation: 'Son of',
        sharePercentage: 100,
        aadhaarStatus: 'VERIFIED',
        phone: '+91 91012 33490',
        isTribalProtected: false
      }
    ],
    legacyNotes: ['Encroachment dispute pending with neighbor on eastern boundary.'],
    verificationStatus: 'ASSIGNED_TO_MANDAL',
    assignedMandal: 'Biren Kalita (LM-04)',
    lastUpdated: '2026-09-18'
  },

  {
    id: 'AS-KM-DIS-JAT-104',
    dagNumber: '104',
    pattaNumber: 'KP-455',
    pattaType: 'Kheraj Myadi',
    district: 'Kamrup Metropolitan',
    circle: 'Dispur',
    mouza: 'Beltola',
    village: 'Jatia',
    landClass: 'Basti (Residential)',
    inTribalBelt: false,
    jamabandiArea: { bigha: 0, katha: 3, lesa: 0 },
    jamabandiAreaSqM: 802.7,
    cadastralAreaSqM: 815.0,
    cadastralAreaBKL: { bigha: 0, katha: 3, lesa: 0.9 },
    annualRevenueRs: 360.0,
    localCessRs: 90.0,
    overlapsWithDag: '103',
    coordinates: [
      [26.1384, 91.7933], // Overlaps with western edge of 103!
      [26.1394, 91.7936],
      [26.1392, 91.7946],
      [26.1382, 91.7943],
      [26.1384, 91.7933]
    ],
    pattadars: [
      {
        id: 'P-104-1',
        name: 'Anupama Hazarika',
        guardianName: 'Bolin Hazarika',
        relation: 'Wife of',
        sharePercentage: 100,
        aadhaarStatus: 'PENDING',
        phone: '+91 97060 91823',
        isTribalProtected: false
      }
    ],
    legacyNotes: ['Boundary re-demarcation requested.'],
    verificationStatus: 'ASSIGNED_TO_MANDAL',
    assignedMandal: 'Biren Kalita (LM-04)',
    lastUpdated: '2026-10-01'
  },

  // DAG 205 - Pattadar Share Sum Mismatch + Zero Revenue (Khanapara)
  {
    id: 'AS-KM-DIS-KHN-205',
    dagNumber: '205',
    pattaNumber: 'KP-812',
    pattaType: 'Kheraj Myadi',
    district: 'Kamrup Metropolitan',
    circle: 'Dispur',
    mouza: 'Beltola',
    village: 'Khanapara',
    landClass: 'Sali (Paddy/Agricultural)',
    inTribalBelt: false,
    jamabandiArea: { bigha: 2, katha: 0, lesa: 0 },
    jamabandiAreaSqM: 2675.6,
    cadastralAreaSqM: 2680.0,
    cadastralAreaBKL: { bigha: 2, katha: 0, lesa: 0.3 },
    annualRevenueRs: 0.0, // ZERO REVENUE ANOMALY!
    localCessRs: 0.0,
    coordinates: [
      [26.1250, 91.8020],
      [26.1265, 91.8023],
      [26.1263, 91.8042],
      [26.1248, 91.8038],
      [26.1250, 91.8020]
    ],
    pattadars: [
      // Only 70% accounted for (missing 30% after unregistered partition!)
      {
        id: 'P-205-1',
        name: 'Kandarpa Deka',
        guardianName: 'Khagen Deka',
        relation: 'Son of',
        sharePercentage: 40,
        aadhaarStatus: 'VERIFIED',
        phone: '+91 94351 77123',
        isTribalProtected: false
      },
      {
        id: 'P-205-2',
        name: 'Nabin Deka',
        guardianName: 'Khagen Deka',
        relation: 'Son of',
        sharePercentage: 30,
        aadhaarStatus: 'MISSING',
        phone: '',
        isTribalProtected: false
      }
    ],
    legacyNotes: ['Uncollected revenue since re-assessment year 2017.', 'Co-sharer deceased; succession incomplete.'],
    verificationStatus: 'PENDING_AUDIT',
    lastUpdated: '2026-07-22'
  },

  // DAG 310 - Tribal Belt Violation in Sonapur
  {
    id: 'AS-KM-SON-DIM-310',
    dagNumber: '310',
    pattaNumber: 'TB-190',
    pattaType: 'Kheraj Myadi',
    district: 'Kamrup Metropolitan',
    circle: 'Sonapur',
    mouza: 'Dimoria',
    village: 'Sonapur Gaon',
    landClass: 'Basti (Residential)',
    inTribalBelt: true, // In Tribal Belt!
    jamabandiArea: { bigha: 1, katha: 2, lesa: 10 },
    jamabandiAreaSqM: 2006.7,
    cadastralAreaSqM: 2012.0,
    cadastralAreaBKL: { bigha: 1, katha: 2, lesa: 10.4 },
    annualRevenueRs: 320.0,
    localCessRs: 80.0,
    coordinates: [
      [26.1150, 91.9520],
      [26.1162, 91.9525],
      [26.1160, 91.9540],
      [26.1148, 91.9535],
      [26.1150, 91.9520]
    ],
    pattadars: [
      {
        id: 'P-310-1',
        name: 'Sunil Sharma', // Non-tribal in notified protected belt!
        guardianName: 'Om Prakash Sharma',
        relation: 'Son of',
        sharePercentage: 100,
        aadhaarStatus: 'VERIFIED',
        phone: '+91 98540 22910',
        isTribalProtected: false
      }
    ],
    legacyNotes: ['Transferred via unregistered agreement in 2014.', 'Chapter X scrutiny flagged.'],
    verificationStatus: 'ASSIGNED_TO_MANDAL',
    assignedMandal: 'Hemen Saikia (LM-09)',
    lastUpdated: '2026-09-29'
  },

  // DAG 402 - Common Grazing Reserve (VGR) Encroachment
  {
    id: 'AS-KM-SON-DIM-402',
    dagNumber: '402',
    pattaNumber: 'VGR-002',
    pattaType: 'Myadi (Periodic)', // Irregular private patta on VGR!
    district: 'Kamrup Metropolitan',
    circle: 'Sonapur',
    mouza: 'Dimoria',
    village: 'Dimoria Pathar',
    landClass: 'VGR (Village Grazing Reserve)',
    inTribalBelt: true,
    jamabandiArea: { bigha: 5, katha: 0, lesa: 0 },
    jamabandiAreaSqM: 6689.0,
    cadastralAreaSqM: 6695.0,
    cadastralAreaBKL: { bigha: 5, katha: 0, lesa: 0.4 },
    annualRevenueRs: 120.0,
    localCessRs: 30.0,
    coordinates: [
      [26.1100, 91.9590],
      [26.1125, 91.9598],
      [26.1120, 91.9625],
      [26.1095, 91.9615],
      [26.1100, 91.9590]
    ],
    pattadars: [
      {
        id: 'P-402-1',
        name: 'Commercial Poultry Ventures LLP',
        guardianName: 'Rep by Director Alok Singha',
        relation: 'Care of',
        sharePercentage: 100,
        aadhaarStatus: 'MISSING',
        phone: '+91 98642 99011',
        isTribalProtected: false
      }
    ],
    legacyNotes: ['Allotment order contested in Hon. Gauhati High Court PIL.'],
    verificationStatus: 'ASSIGNED_TO_MANDAL',
    assignedMandal: 'Hemen Saikia (LM-09)',
    lastUpdated: '2026-10-15'
  },

  // DAG 501 - Clean Agricultural Land (Kaliabor, Nagaon)
  {
    id: 'AS-NG-KAL-JAK-501',
    dagNumber: '501',
    pattaNumber: 'KP-119',
    pattaType: 'Kheraj Myadi',
    district: 'Nagaon',
    circle: 'Kaliabor',
    mouza: 'Duar Bagori',
    village: 'Jakhalabandha',
    landClass: 'Sali (Paddy/Agricultural)',
    inTribalBelt: false,
    jamabandiArea: { bigha: 3, katha: 2, lesa: 10 },
    jamabandiAreaSqM: 4682.3,
    cadastralAreaSqM: 4680.1,
    cadastralAreaBKL: { bigha: 3, katha: 2, lesa: 9.8 },
    annualRevenueRs: 420.0,
    localCessRs: 105.0,
    coordinates: [
      [26.5820, 93.0010],
      [26.5845, 93.0015],
      [26.5840, 93.0048],
      [26.5815, 93.0042],
      [26.5820, 93.0010]
    ],
    pattadars: [
      {
        id: 'P-501-1',
        name: 'Monojit Bora',
        guardianName: 'Dharma Kanta Bora',
        relation: 'Son of',
        sharePercentage: 100,
        aadhaarStatus: 'VERIFIED',
        phone: '+91 94353 88124',
        isTribalProtected: false
      }
    ],
    legacyNotes: ['Clear title. PM-KISAN verified beneficiary.'],
    verificationStatus: 'HEALTHY_VERIFIED',
    lastUpdated: '2026-09-10'
  },

  // DAG 502 - Unresolved 2004 Bank Mortgage (Nagaon)
  {
    id: 'AS-NG-KAL-JAK-502',
    dagNumber: '502',
    pattaNumber: 'KP-120',
    pattaType: 'Kheraj Myadi',
    district: 'Nagaon',
    circle: 'Kaliabor',
    mouza: 'Duar Bagori',
    village: 'Jakhalabandha',
    landClass: 'Basti (Residential)',
    inTribalBelt: false,
    jamabandiArea: { bigha: 1, katha: 0, lesa: 5 },
    jamabandiAreaSqM: 1404.7,
    cadastralAreaSqM: 1406.0,
    cadastralAreaBKL: { bigha: 1, katha: 0, lesa: 5.1 },
    annualRevenueRs: 310.0,
    localCessRs: 77.5,
    coordinates: [
      [26.5815, 93.0042],
      [26.5830, 93.0045],
      [26.5828, 93.0065],
      [26.5812, 93.0061],
      [26.5815, 93.0042]
    ],
    pattadars: [
      {
        id: 'P-502-1',
        name: 'Bhabesh Saikia',
        guardianName: 'Golap Saikia',
        relation: 'Son of',
        sharePercentage: 100,
        aadhaarStatus: 'VERIFIED',
        phone: '+91 98544 11090',
        isTribalProtected: false
      }
    ],
    legacyNotes: ['Mortgaged to AGVB (Assam Gramin Vikash Bank) in 2004 for tractor loan; digital NOC pending.'],
    verificationStatus: 'PENDING_AUDIT',
    lastUpdated: '2026-08-30'
  }
];

// Process raw land records through the automated health check engine
export const initialLandRecords: LandRecord[] = rawLandRecordsData.map(raw => ({
  ...raw,
  healthReport: auditLandRecord(raw)
}));

export const initialVerificationTasks: VerificationTask[] = [
  {
    id: 'TASK-2026-001',
    dagId: 'AS-KM-DIS-JAT-102',
    dagNumber: '102',
    pattaNumber: 'KP-453',
    village: 'Jatia',
    circle: 'Dispur',
    priority: 'HIGH',
    assignedMandal: 'Biren Kalita (LM-04)',
    anomaliesSummary: ['Cadastral area shortfall by 19.6% vs Jamabandi', 'Partition demarcation mismatch'],
    status: 'IN_PROGRESS',
    scheduledDate: '2026-11-22'
  },
  {
    id: 'TASK-2026-002',
    dagId: 'AS-KM-DIS-JAT-103',
    dagNumber: '103 & 104',
    pattaNumber: 'KP-454 & KP-455',
    village: 'Jatia',
    circle: 'Dispur',
    priority: 'CRITICAL',
    assignedMandal: 'Biren Kalita (LM-04)',
    anomaliesSummary: ['Overlapping polygon geometry (103 overlaps with 104)', 'Active boundary conflict'],
    status: 'ASSIGNED',
    scheduledDate: '2026-11-23'
  },
  {
    id: 'TASK-2026-003',
    dagId: 'AS-KM-SON-DIM-310',
    dagNumber: '310',
    pattaNumber: 'TB-190',
    village: 'Sonapur Gaon',
    circle: 'Sonapur',
    priority: 'CRITICAL',
    assignedMandal: 'Hemen Saikia (LM-09)',
    anomaliesSummary: ['Chapter X Tribal Belt violation - Non-protected class holding in Dimoria'],
    status: 'ASSIGNED',
    scheduledDate: '2026-11-24'
  },
  {
    id: 'TASK-2026-004',
    dagId: 'AS-KM-SON-DIM-402',
    dagNumber: '402',
    pattaNumber: 'VGR-002',
    village: 'Dimoria Pathar',
    circle: 'Sonapur',
    priority: 'CRITICAL',
    assignedMandal: 'Hemen Saikia (LM-09)',
    anomaliesSummary: ['Private Myadi Patta on Village Grazing Reserve (VGR)'],
    status: 'ASSIGNED',
    scheduledDate: '2026-11-25'
  }
];
