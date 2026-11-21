import { LandMarketplaceListing } from '../types/landRecords';
import { evaluateTitleDueDiligence, bklToSqM } from '../services/marketplaceEngine';

const rawListingsData = [
  // 1. Dispur - Beltola (Prime Residential) - Gold Verified
  {
    id: 'ALE-KAM-DIS-001',
    title: 'Prime 1.5 Bigha Residential Plot near Beltola Tiniali',
    district: 'Kamrup Metropolitan',
    circle: 'Dispur',
    mouza: 'Beltola',
    village: 'Jatia',
    coordinates: [
      [26.1380, 91.7910],
      [26.1388, 91.7912],
      [26.1387, 91.7925],
      [26.1379, 91.7923],
      [26.1380, 91.7910]
    ] as [number, number][],
    centerPoint: [26.1384, 91.7918] as [number, number],
    stage: 'VERIFIED_AVAILABLE' as const,
    governmentVerified: {
      dagNumber: '101',
      pattaNumber: 'KP-452',
      pattaType: 'Periodic Patta (Khiraj Myadi)' as const,
      landClass: 'Basti (Residential)' as const,
      recordedAreaBKL: { bigha: 1, katha: 2, lesa: 10 },
      recordedAreaSqM: 2006.7,
      cadastralPolygonAreaSqM: 2012.4,
      areaVariancePct: 0.28,
      pattadars: [
        {
          id: 'PATT-DIS-01',
          nameMasked: 'Pranab K*** Goswami',
          guardianNameMasked: 'Late Bhabesh Goswami',
          sharePercentage: 100.0,
          isAadhaarVerified: true,
          phoneMasked: '+91 94350 ***90',
          isTribalProtected: false
        }
      ],
      zonalRatePerBighaINR: 8500000,
      totalZonalValuationINR: 12750000,
      eKhajanaStatus: {
        isClear: true,
        lastPaymentDate: '2026-04-10',
        annualTouziDemandINR: 520.00,
        arrearsINR: 0.00
      },
      encumbrances: [],
      courtLitigationFlags: [],
      chapterXTribalBeltStatus: 'OUTSIDE_TRIBAL_BELT' as const,
      lastReconciledAt: '2026-10-14T08:30:00Z'
    },
    sellerRepresentations: {
      askingPriceINR: 14500000,
      askingPricePerBighaINR: 9666667,
      priceOverZonalPct: 13.73,
      fairValueAssessment: 'FAIR_MARKET' as const,
      propertyHighlights: 'Corner plot with 30ft wide PWD pucca road frontage. High elevation, zero waterlogging during monsoons, and ready municipal water pipeline.',
      possessionStatus: 'IMMEDIATE_VACANT' as const,
      approachRoadWidthFeet: 30,
      amenities: ['PWD Pucca Road', '3-Phase Electricity', 'GMC Piped Water', 'Street Lighting', 'Optical Fiber Ready'],
      sellerStatement: 'Lawful owner selling voluntarily for family relocation. Ready for straight-through registration and immediate boundary possession.',
      voluntaryConsentDeclaration: 'I, Pranab Kumar Goswami, lawful Pattadar of Dag 101, Patta KP-452, voluntarily list this parcel on Assam Land Exchange with full consent.',
      voluntaryConsentTimestamp: '2026-10-15T11:20:00Z',
      photos: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60'
      ]
    },
    offers: [
      {
        id: 'OFF-001-A',
        buyerNameMasked: 'Dr. Ananya B***',
        buyerPhoneMasked: '+91 98640 ***44',
        offeredAmountINR: 14000000,
        earnestDepositTokenINR: 200000,
        submittedAt: '2026-10-18T14:15:00Z',
        status: 'SUBMITTED' as const,
        proposedPaymentTerms: '10% token on agreement, 90% via SBI Home Loan upon Sub-Registrar deed execution.'
      }
    ],
    facilitationFeePct: 0.25,
    estimatedFacilitationFeeINR: 36250,
    createdAt: '2026-10-15'
  },

  // 2. Dispur - Khanapara (Commercial Highway Facing) - Gold Verified
  {
    id: 'ALE-KAM-DIS-002',
    title: '2.0 Bigha Commercial Land fronting GS Road, Khanapara',
    district: 'Kamrup Metropolitan',
    circle: 'Dispur',
    mouza: 'Beltola',
    village: 'Khanapara',
    coordinates: [
      [26.1240, 91.8150],
      [26.1255, 91.8155],
      [26.1252, 91.8175],
      [26.1238, 91.8170],
      [26.1240, 91.8150]
    ] as [number, number][],
    centerPoint: [26.1246, 91.8163] as [number, number],
    stage: 'INQUIRIES_OPEN' as const,
    governmentVerified: {
      dagNumber: '108',
      pattaNumber: 'KP-890',
      pattaType: 'Periodic Patta (Khiraj Myadi)' as const,
      landClass: 'Byabasayik (Commercial)' as const,
      recordedAreaBKL: { bigha: 2, katha: 0, lesa: 0 },
      recordedAreaSqM: 2675.6,
      cadastralPolygonAreaSqM: 2680.1,
      areaVariancePct: 0.17,
      pattadars: [
        {
          id: 'PATT-DIS-02',
          nameMasked: 'Diganta B***',
          guardianNameMasked: 'B. C. Barman',
          sharePercentage: 100.0,
          isAadhaarVerified: true,
          phoneMasked: '+91 98640 ***21',
          isTribalProtected: false
        }
      ],
      zonalRatePerBighaINR: 14000000,
      totalZonalValuationINR: 28000000,
      eKhajanaStatus: {
        isClear: true,
        lastPaymentDate: '2026-03-28',
        annualTouziDemandINR: 1850.00,
        arrearsINR: 0.00
      },
      encumbrances: [],
      courtLitigationFlags: [],
      chapterXTribalBeltStatus: 'OUTSIDE_TRIBAL_BELT' as const,
      lastReconciledAt: '2026-10-12T10:15:00Z'
    },
    sellerRepresentations: {
      askingPriceINR: 32000000,
      askingPricePerBighaINR: 16000000,
      priceOverZonalPct: 14.29,
      fairValueAssessment: 'FAIR_MARKET' as const,
      propertyHighlights: 'Direct frontage on 4-lane Asian Highway/GS Road. Ideal for corporate office headquarters, hospital, or commercial retail mall.',
      possessionStatus: 'IMMEDIATE_VACANT' as const,
      approachRoadWidthFeet: 60,
      amenities: ['4-Lane Highway Access', 'Heavy Load HT Power', 'Commercial Zoning Clearance', 'Adequate Setback Buffer'],
      sellerStatement: 'Verified commercial title. All municipal tax and commercial conversion certificates cleared with GMDA.',
      voluntaryConsentDeclaration: 'I voluntarily offer this commercial parcel for verified sale on Assam Land Exchange without intermediaries.',
      voluntaryConsentTimestamp: '2026-10-12T15:00:00Z',
      photos: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60'
      ]
    },
    offers: [
      {
        id: 'OFF-002-A',
        buyerNameMasked: 'North East Infra L***',
        buyerPhoneMasked: '+91 94351 ***88',
        offeredAmountINR: 31000000,
        earnestDepositTokenINR: 500000,
        submittedAt: '2026-10-19T11:00:00Z',
        status: 'SUBMITTED' as const,
        proposedPaymentTerms: 'Direct RTGS corporate transfer within 21 days of Sale NOC clearance.'
      }
    ],
    facilitationFeePct: 0.25,
    estimatedFacilitationFeeINR: 80000,
    createdAt: '2026-10-12'
  },

  // 3. Dispur - Jatia (Residential) - Silver Verified (Minor Revenue Arrears pending)
  {
    id: 'ALE-KAM-DIS-003',
    title: '3 Katha Residential Plot in Peaceful Residential Colony, Jatia',
    district: 'Kamrup Metropolitan',
    circle: 'Dispur',
    mouza: 'Beltola',
    village: 'Jatia',
    coordinates: [
      [26.1410, 91.7850],
      [26.1418, 91.7853],
      [26.1416, 91.7865],
      [26.1408, 91.7862],
      [26.1410, 91.7850]
    ] as [number, number][],
    centerPoint: [26.1413, 91.7858] as [number, number],
    stage: 'VERIFIED_AVAILABLE' as const,
    governmentVerified: {
      dagNumber: '214',
      pattaNumber: 'KP-312',
      pattaType: 'Periodic Patta (Khiraj Myadi)' as const,
      landClass: 'Basti (Residential)' as const,
      recordedAreaBKL: { bigha: 0, katha: 3, lesa: 0 },
      recordedAreaSqM: 802.7,
      cadastralPolygonAreaSqM: 805.2,
      areaVariancePct: 0.31,
      pattadars: [
        {
          id: 'PATT-DIS-03',
          nameMasked: 'Mukul C*** Kalita',
          guardianNameMasked: 'H. Kalita',
          sharePercentage: 100.0,
          isAadhaarVerified: true,
          phoneMasked: '+91 97060 ***55',
          isTribalProtected: false
        }
      ],
      zonalRatePerBighaINR: 9000000,
      totalZonalValuationINR: 5400000,
      eKhajanaStatus: {
        isClear: false,
        lastPaymentDate: '2024-03-15',
        annualTouziDemandINR: 320.00,
        arrearsINR: 640.00
      },
      encumbrances: [],
      courtLitigationFlags: [],
      chapterXTribalBeltStatus: 'OUTSIDE_TRIBAL_BELT' as const,
      lastReconciledAt: '2026-10-10T12:00:00Z'
    },
    sellerRepresentations: {
      askingPriceINR: 6200000,
      askingPricePerBighaINR: 10333333,
      priceOverZonalPct: 14.81,
      fairValueAssessment: 'FAIR_MARKET' as const,
      propertyHighlights: 'Gently elevated land with boundary wall and gate already erected. Quiet residential neighborhood with walking distance to schools and dispensary.',
      possessionStatus: 'IMMEDIATE_VACANT' as const,
      approachRoadWidthFeet: 20,
      amenities: ['Boundary Wall Erected', 'Paved Colony Road', 'Electricity Pole at Gate', 'Drainage Connected'],
      sellerStatement: 'Pattadar will settle the 2-year e-Khajana arrears (₹640) immediately through online portal upon buyer token agreement.',
      voluntaryConsentDeclaration: 'I voluntarily offer Dag 214 for verified listing and confirm unencumbered physical possession.',
      voluntaryConsentTimestamp: '2026-10-11T10:00:00Z',
      photos: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60'
      ]
    },
    offers: [],
    facilitationFeePct: 0.25,
    estimatedFacilitationFeeINR: 15500,
    createdAt: '2026-10-11'
  },

  // 4. Guwahati - Ulubari (Commercial Core) - Conditional (Co-Sharer Consent Required)
  {
    id: 'ALE-KAM-GHY-004',
    title: '1.0 Bigha Commercial Land in Heart of Ulubari, GS Road corridor',
    district: 'Kamrup Metropolitan',
    circle: 'Guwahati',
    mouza: 'Panbari',
    village: 'Ulubari',
    coordinates: [
      [26.1680, 91.7580],
      [26.1690, 91.7582],
      [26.1688, 91.7600],
      [26.1678, 91.7598],
      [26.1680, 91.7580]
    ] as [number, number][],
    centerPoint: [26.1684, 91.7590] as [number, number],
    stage: 'INQUIRIES_OPEN' as const,
    governmentVerified: {
      dagNumber: '45',
      pattaNumber: 'KP-119',
      pattaType: 'Periodic Patta (Khiraj Myadi)' as const,
      landClass: 'Byabasayik (Commercial)' as const,
      recordedAreaBKL: { bigha: 1, katha: 0, lesa: 5 },
      recordedAreaSqM: 1404.7,
      cadastralPolygonAreaSqM: 1409.0,
      areaVariancePct: 0.31,
      pattadars: [
        {
          id: 'PATT-GHY-04A',
          nameMasked: 'Hemanta K*** Saikia',
          guardianNameMasked: 'Late N. Saikia',
          sharePercentage: 50.0,
          isAadhaarVerified: true,
          phoneMasked: '+91 94350 ***12',
          isTribalProtected: false
        },
        {
          id: 'PATT-GHY-04B',
          nameMasked: 'Bijoy K*** Saikia',
          guardianNameMasked: 'Late N. Saikia',
          sharePercentage: 50.0,
          isAadhaarVerified: true,
          phoneMasked: '+91 94350 ***18',
          isTribalProtected: false
        }
      ],
      zonalRatePerBighaINR: 18000000,
      totalZonalValuationINR: 18900000,
      eKhajanaStatus: {
        isClear: true,
        lastPaymentDate: '2026-02-10',
        annualTouziDemandINR: 1420.00,
        arrearsINR: 0.00
      },
      encumbrances: [],
      courtLitigationFlags: [],
      chapterXTribalBeltStatus: 'OUTSIDE_TRIBAL_BELT' as const,
      lastReconciledAt: '2026-10-08T16:00:00Z'
    },
    sellerRepresentations: {
      askingPriceINR: 21000000,
      askingPricePerBighaINR: 20000000,
      priceOverZonalPct: 11.11,
      fairValueAssessment: 'FAIR_MARKET' as const,
      propertyHighlights: 'Ultra-prime central Guwahati location opposite flyover. Both brother pattadars have executed a mutual agreement to jointly sell 100% of the dag.',
      possessionStatus: 'IMMEDIATE_VACANT' as const,
      approachRoadWidthFeet: 40,
      amenities: ['Central City Center', 'Commercial 40ft Frontage', 'City Bus Stop Connectivity', 'Underground Drainage'],
      sellerStatement: 'Joint voluntary listing by both co-pattadars. Formal joint power of attorney executed for fast deed registration.',
      voluntaryConsentDeclaration: 'We, Hemanta Saikia and Bijoy Saikia, jointly verify and voluntarily offer this parcel for sale.',
      voluntaryConsentTimestamp: '2026-10-09T09:30:00Z',
      photos: [
        'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=800&auto=format&fit=crop&q=60'
      ]
    },
    offers: [
      {
        id: 'OFF-004-A',
        buyerNameMasked: 'Brahmaputra Health C***',
        buyerPhoneMasked: '+91 98540 ***99',
        offeredAmountINR: 20000000,
        earnestDepositTokenINR: 1000000,
        submittedAt: '2026-10-20T16:45:00Z',
        status: 'SUBMITTED' as const,
        proposedPaymentTerms: 'Single tranche payment via escrow upon joint execution of deed by both pattadars.'
      }
    ],
    facilitationFeePct: 0.25,
    estimatedFacilitationFeeINR: 52500,
    createdAt: '2026-10-09'
  },

  // 5. Sonapur - Khetri (Agricultural) - Conditional / Tribal Belt (Chapter X Protected Class Only)
  {
    id: 'ALE-KAM-SON-005',
    title: '4.0 Bigha Agricultural Sali Land in Notified Tribal Belt, Sonapur',
    district: 'Kamrup Metropolitan',
    circle: 'Sonapur',
    mouza: 'Sonapur',
    village: 'Khetri',
    coordinates: [
      [26.1150, 91.9820],
      [26.1170, 91.9825],
      [26.1165, 91.9855],
      [26.1145, 91.9850],
      [26.1150, 91.9820]
    ] as [number, number][],
    centerPoint: [26.1158, 91.9838] as [number, number],
    stage: 'VERIFIED_AVAILABLE' as const,
    governmentVerified: {
      dagNumber: '320',
      pattaNumber: 'KP-567',
      pattaType: 'Periodic Patta (Khiraj Myadi)' as const,
      landClass: 'Sali (Paddy/Agricultural)' as const,
      recordedAreaBKL: { bigha: 4, katha: 0, lesa: 0 },
      recordedAreaSqM: 5351.2,
      cadastralPolygonAreaSqM: 5360.5,
      areaVariancePct: 0.17,
      pattadars: [
        {
          id: 'PATT-SON-05',
          nameMasked: 'Bhaben B***',
          guardianNameMasked: 'Late R. Boro',
          sharePercentage: 100.0,
          isAadhaarVerified: true,
          phoneMasked: '+91 94353 ***41',
          isTribalProtected: true
        }
      ],
      zonalRatePerBighaINR: 1200000,
      totalZonalValuationINR: 4800000,
      eKhajanaStatus: {
        isClear: true,
        lastPaymentDate: '2026-01-20',
        annualTouziDemandINR: 280.00,
        arrearsINR: 0.00
      },
      encumbrances: [],
      courtLitigationFlags: [],
      chapterXTribalBeltStatus: 'NOTIFIED_BELT_PROTECTED_CLASS_ONLY' as const,
      lastReconciledAt: '2026-10-05T14:20:00Z'
    },
    sellerRepresentations: {
      askingPriceINR: 5800000,
      askingPricePerBighaINR: 1450000,
      priceOverZonalPct: 20.83,
      fairValueAssessment: 'MODERATE_PREMIUM' as const,
      propertyHighlights: 'Fertile organic paddy land with perennial stream irrigation access and all-weather motorable bund road.',
      possessionStatus: 'IMMEDIATE_VACANT' as const,
      approachRoadWidthFeet: 15,
      amenities: ['Stream Irrigation Access', 'Perimeter Trench', 'All-Weather Village Road'],
      sellerStatement: 'Notice to prospective buyers: Under Chapter X of the Assam Land and Revenue Regulation 1886, this parcel can only be purchased by members of notified Protected Classes.',
      voluntaryConsentDeclaration: 'I, Bhaben Boro, tribal protected pattadar, voluntarily offer this parcel for sale strictly to eligible protected class buyers.',
      voluntaryConsentTimestamp: '2026-10-06T11:00:00Z',
      photos: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60'
      ]
    },
    offers: [],
    facilitationFeePct: 0.25,
    estimatedFacilitationFeeINR: 14500,
    createdAt: '2026-10-06'
  },

  // 6. North Guwahati - Majgaon (Near AIIMS & IITG) - Gold Verified
  {
    id: 'ALE-KAM-NGH-006',
    title: '1.25 Bigha Residential Plot near AIIMS & IIT Guwahati, Majgaon',
    district: 'Kamrup',
    circle: 'North Guwahati',
    mouza: 'Sila Sinduri Ghopa',
    village: 'Majgaon',
    coordinates: [
      [26.2150, 91.7050],
      [26.2162, 91.7055],
      [26.2158, 91.7072],
      [26.2146, 91.7068],
      [26.2150, 91.7050]
    ] as [number, number][],
    centerPoint: [26.2154, 91.7061] as [number, number],
    stage: 'OFFER_ACCEPTED' as const,
    governmentVerified: {
      dagNumber: '88',
      pattaNumber: 'KP-201',
      pattaType: 'Periodic Patta (Khiraj Myadi)' as const,
      landClass: 'Basti (Residential)' as const,
      recordedAreaBKL: { bigha: 1, katha: 1, lesa: 10 },
      recordedAreaSqM: 1739.1,
      cadastralPolygonAreaSqM: 1742.8,
      areaVariancePct: 0.21,
      pattadars: [
        {
          id: 'PATT-NGH-06',
          nameMasked: 'Gautom C*** Sarma',
          guardianNameMasked: 'Late K. Sarma',
          sharePercentage: 100.0,
          isAadhaarVerified: true,
          phoneMasked: '+91 98642 ***30',
          isTribalProtected: false
        }
      ],
      zonalRatePerBighaINR: 6500000,
      totalZonalValuationINR: 8450000,
      eKhajanaStatus: {
        isClear: true,
        lastPaymentDate: '2026-05-12',
        annualTouziDemandINR: 410.00,
        arrearsINR: 0.00
      },
      encumbrances: [],
      courtLitigationFlags: [],
      chapterXTribalBeltStatus: 'OUTSIDE_TRIBAL_BELT' as const,
      lastReconciledAt: '2026-10-02T11:00:00Z'
    },
    sellerRepresentations: {
      askingPriceINR: 9500000,
      askingPricePerBighaINR: 7307692,
      priceOverZonalPct: 12.43,
      fairValueAssessment: 'FAIR_MARKET' as const,
      propertyHighlights: 'High-appreciation corridor within 5 minutes of AIIMS Changsari and Brahmaputra Bridge. 25ft front road with streetlights.',
      possessionStatus: 'IMMEDIATE_VACANT' as const,
      approachRoadWidthFeet: 25,
      amenities: ['Proximity to AIIMS', 'PWD Road Access', '3-Phase Power', 'Clean Ground Water'],
      sellerStatement: 'Agreement reached with verified buyer. Sale NOC in process with Circle Officer, North Guwahati.',
      voluntaryConsentDeclaration: 'Voluntary offer submitted and verified through Dharitree e-Pramaan authentication.',
      voluntaryConsentTimestamp: '2026-10-02T14:30:00Z',
      photos: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60'
      ]
    },
    offers: [
      {
        id: 'OFF-006-A',
        buyerNameMasked: 'Nilotpal D***',
        buyerPhoneMasked: '+91 97061 ***10',
        offeredAmountINR: 9500000,
        earnestDepositTokenINR: 300000,
        submittedAt: '2026-10-14T10:00:00Z',
        status: 'ACCEPTED' as const,
        proposedPaymentTerms: 'Escrow token deposited. Balance payable upon deed execution.'
      }
    ],
    facilitationFeePct: 0.25,
    estimatedFacilitationFeeINR: 23750,
    createdAt: '2026-10-02'
  }
];

// Evaluate due-diligence for each raw listing to generate immutable checks & badges
export const initialLandMarketplaceListings: LandMarketplaceListing[] = rawListingsData.map(item => {
  const { score, badge, checks } = evaluateTitleDueDiligence(item.governmentVerified);
  return {
    ...item,
    governmentVerified: {
      ...item.governmentVerified,
      titleScore: score,
      titleClearanceBadge: badge,
      checks
    }
  };
});

// Backward compatibility alias
export const initialLandRecords = initialLandMarketplaceListings;
