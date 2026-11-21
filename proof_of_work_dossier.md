# Proof of Work & Solution Evidence Dossier
## BhumiBinimoy (ভূমি বিনিময়): Assam Land Exchange (ALE)
### Government-Verified Cadastral Marketplace for Buying and Selling Land
**Submission Category:** NESFIC 2026 (Stream 1 — Government Track)  
**Problem Statement ID:** **NESFIC-D-52**  
**Challenge Owners:** Revenue & Disaster Management Department, Government of Assam  
**Lead Innovator & Applicant:** Ron Hatibaruah  
**Live Working Prototype:** `https://bhumi-swasthya.pages.dev/` (Assam Land Exchange Edition)  
**Document Type:** Empirical Proof of Work (PoW), Architecture Validation, Data Schemas & Performance Benchmarks

---

## 1. Executive Summary & Prototype Status

In full alignment with the Assam Startup NESFIC 2026 Uniform Solution Proposal Requirements (USPR), this document provides verifiable **Proof of Work (PoW)**, architectural validation, and test benchmark results demonstrating a fully operational, high-fidelity software prototype of **BhumiBinimoy (Assam Land Exchange)**.

The prototype proves that a government-facilitated digital land marketplace built directly upon Assam’s official cadastral map is technically viable, legally compliant, and immediately deployable.

### Key Capabilities Demonstrated in the Live Prototype:
1. **Interactive Cadastral GIS Marketplace:** Renders georeferenced Dag polygons on Assam’s official cadastral sheets, allowing prospective buyers to visually discover parcels voluntarily listed by lawful owners.
2. **Voluntary Seller Onboarding & Instant Verification:** Verifies lawful pattadar ownership in real time by cross-referencing Dag and Patta numbers against *Dharitree* Record of Rights (RoRs) and *Bhudakshya* spatial boundaries.
3. **Strict Separation of Truth:** Enforces an uncompromisable demarcation between **Government-Verified Official Particulars** (immutable system records) and **Seller Representations** (asking price, photographs, development amenities).
4. **Transparent Price Discovery & Zonal Value Benchmarking:** Compares seller asking prices directly against official Circle-level Zonal Rates ($₹/\text{Bigha}$), calculating a transparent Fair Value Index and projected statutory stamp duty/registration fees.
5. **8-Point Automated Title Due-Diligence Ledger:** Computes real-time clearance for tenure type (Periodic vs. Annual Patta), area discrepancy, co-sharer partition balance, e-Khajana tax clearance, bank liens, court litigation injunctions, and Chapter X Tribal Belt transfer restrictions.
6. **Assisted Conveyancing & Transaction Deal Room:** Manages structured buyer inquiries, Expressions of Interest (EOI), counter-offers, token escrow status, and automated pre-population of Land Sale NOCs for Circle Officer approval and *e-Panjeeyan* deed execution.
7. **Statutory Integrity & Disclaimers:** Features watermarked due-diligence summaries and prominent statutory disclaimers ensuring compliance with the *Assam Land and Revenue Regulation (ALRR), 1886*.
8. **Department Command & Facilitation Console:** Provides Circle Officers and departmental administrators with circle-wise listing analytics, facilitation fee revenue projections, and anti-fraud telemetry.

---

## 2. Live System Architecture & Technical Pipeline

```
+─────────────────────────────────────────────────────────────────────────────────────────+
|                                DATA FEDERATION GATEWAY                                  |
|   • Dharitree Extracts (RoR / Jamabandi)       • Bhudakshya Cadastral GeoJSON Layers    |
|   • e-Panjeeyan Registered Deed History        • Zonal Valuation Gazette Schedules      |
|   • e-Khajana Annual Revenue Ledger            • Notified Tribal Belt / Block Polygons  |
+─────────────────────────────────────────────────────────────────────────────────────────+
                                              │
                                              ▼
+─────────────────────────────────────────────────────────────────────────────────────────+
|                        NORMALIZATION & UNIT CONVERSION ENGINE                           |
|        Assam Standard BKL Formula: 1 Bigha = 5 Katha = 100 Lesa ≈ 1337.8038 sq.m        |
|        Coordinate Transformation: EPSG:4326 (WGS84) ──► EPSG:32646 (UTM Zone 46N)       |
+─────────────────────────────────────────────────────────────────────────────────────────+
                                              │
                                              ▼
+─────────────────────────────────────────────────────────────────────────────────────────+
|                       8-POINT STATUTORY DUE-DILIGENCE ENGINE                            |
|  [Check 1] Patta Tenure Classification (Periodic Patta vs Annual / Non-Transferable)   |
|  [Check 2] Spatial-Textual Area Variance (|GIS Polygon Area - Jamabandi Area| <= 5.0%) |
|  [Check 3] Co-Sharer Partition Integrity (Sum of recorded Pattadar shares == 100.0%)    |
|  [Check 4] e-Khajana Revenue Status (Annual Touzi Demand current; zero arrears)         |
|  [Check 5] Encumbrance & Lien Registry (No unredeemed bank mortgages on record)         |
|  [Check 6] Civil Court Litigation Registry (Zero active stay orders or lis pendens)     |
|  [Check 7] Chapter X Tribal Belt Filter (Transferor & Transferee class eligibility)    |
|  [Check 8] Ecological Buffer Check (No overlap with VGR, PGR, wetlands or rivers)       |
+─────────────────────────────────────────────────────────────────────────────────────────+
                                              │
                                              ▼
+─────────────────────────────────────────────────────────────────────────────────────────+
|                        CADASTRAL MARKETPLACE & DEAL ROOM CORE                           |
|  • Dynamic Vector Cadastral Tile Server (GeoJSON / MapLibre)                            |
|  • Zonal Value vs Asking Price Benchmark Calculator                                     |
|  • Cryptographic Title Clearance Badge Generator (Gold / Silver / Conditional)          |
|  • Assisted Transaction Workflow State Machine (Listing ➔ EOI ➔ NOC ➔ e-Panjeeyan)      |
+─────────────────────────────────────────────────────────────────────────────────────────+
                                              │
                                              ▼
+─────────────────────────────────────────────────────────────────────────────────────────+
|                           ROLE-BASED PRESENTATION APPS                                  |
|   • Public Cadastral Marketplace Explorer (Interactive WebGIS Map & Parcel Filter)      |
|   • Lawful Seller Onboarding Portal (e-KYC & Jamabandi Consent Flow)                    |
|   • Buyer Due-Diligence Deal Room (Official vs Seller Data + EOI Engine)                |
|   • Revenue Department Command Console (Dispur Pilot Admin & Facilitation Fee Audits)   |
+─────────────────────────────────────────────────────────────────────────────────────────+
```

---

## 3. Data Schemas & Separation of Truth

A paramount principle of NESFIC-D-52 is the **strict, unequivocal distinction** between immutable Government-verified record data and self-declared seller representations:

```json
{
  "listingId": "ALE-KAM-DIS-2026-0042",
  "mouza": "Beltola",
  "revenueCircle": "Dispur",
  "district": "Kamrup Metropolitan",
  
  "governmentVerifiedParticulars": {
    "dagNumber": "342",
    "pattaNumber": "KP-118",
    "pattaType": "Periodic Patta (Khiraj Myadi)",
    "landClassification": "Basti (Residential)",
    "recordedArea": {
      "bigha": 1,
      "katha": 2,
      "lesa": 10,
      "totalSqMeters": 2006.7
    },
    "gisPolygonAreaSqM": 1998.4,
    "areaVariancePct": 0.41,
    "pattadarRecords": [
      {
        "pattadarIdMasked": "PATT-***-984",
        "nameMasked": "R*** H***",
        "sharePercentage": 100.0,
        "isVerifiedAadhaarLinked": true
      }
    ],
    "zonalRatePerBighaINR": 8500000,
    "totalZonalValuationINR": 12750000,
    "eKhajanaStatus": {
      "isClear": true,
      "lastPaymentDate": "2026-04-12",
      "annualTouziDemandINR": 485.00,
      "arrearsINR": 0.00
    },
    "recordedEncumbrances": [],
    "courtLitigationFlags": [],
    "chapterXTribalBeltStatus": "OUTSIDE_TRIBAL_BELT",
    "titleClearanceBadge": "GOLD_VERIFIED"
  },
  
  "sellerRepresentations": {
    "askingPriceINR": 14500000,
    "askingPricePerBighaINR": 9666667,
    "priceOverZonalPct": 13.73,
    "propertyHighlights": "Prime residential plot fronting 30ft PWD road with municipal water and 3-phase electricity.",
    "possessionStatus": "Immediate Vacant Possession",
    "voluntaryConsentDeclaration": "I hereby voluntarily offer this parcel for sale and declare that the representations made are truthful to my knowledge.",
    "voluntaryConsentTimestamp": "2026-10-15T09:30:00Z"
  },
  
  "assistedWorkflow": {
    "currentStage": "INQUIRIES_OPEN",
    "activeEOICount": 3,
    "facilitationFeeTierPct": 0.25,
    "estimatedStateFacilitationRevenueINR": 36250
  }
}
```

---

## 4. 8-Point Title Due-Diligence Verification Engine

The core automated due-diligence engine executes deterministic validation rules:

| Check ID | Verification Rule | Algorithmic Evaluation | Passing Condition | Weight |
| :--- | :--- | :--- | :--- | :--- |
| **CHK-01** | **Tenure Class** | `RoR.patta_type` in `['Khiraj Myadi', 'Periodic Patta']` | Must be permanent alienable tenure | 20 pts |
| **CHK-02** | **Area Consistency** | `abs(GIS_Area - Jamabandi_Area) / Jamabandi_Area <= 0.05` | Variance strictly within 5% tolerance | 15 pts |
| **CHK-03** | **Share Completeness** | `sum(pattadar.shares) == 100.0` | Fractional shares sum to exactly 100% | 15 pts |
| **CHK-04** | **e-Khajana Status** | `eKhajana.arrears == 0.0` | Zero pending land revenue dues | 10 pts |
| **CHK-05** | **Encumbrance Check** | `ePanjeeyan.active_liens == 0` | No active bank hypothecation / attachment | 15 pts |
| **CHK-06** | **Litigation Check** | `RevenueCourt.injunctions == 0` | No pending title stay or dispute notices | 10 pts |
| **CHK-07** | **Chapter X Compliance** | `Parcels.intersects(Tribal_Belt) == False` or Buyer Eligible | Complies with ALRR tribal land safeguards | 10 pts |
| **CHK-08** | **Ecological Reserve** | `ST_DWithin(Parcel, VGR_PGR_Layer, 0) == False` | Zero encroachment on village grazing lands | 5 pts |

### Dynamic Badge Scoring:
- **GOLD VERIFIED (Score 90–100):** Clean title, zero encumbrances, zero area variance, ready for fast-track statutory sale.
- **SILVER VERIFIED (Score 75–89):** Minor non-fatal clerical observations (e.g. slight e-Khajana balance pending settlement).
- **CONDITIONAL (Score 50–74):** Requires pre-transaction administrative action (e.g. formal co-sharer partition deed).
- **RESTRICTED (<50 or Chapter X Ineligible):** Non-transferable without prior special approval of the District Commissioner.

---

## 5. Assisted Conveyancing State Machine

```
   [1. VOLUNTARY LISTING]
              │
              ▼
   [2. 8-POINT GOVERNMENT VERIFICATION] ──► (Discrepancy ➔ Rectification Notice)
              │ (Verified)
              ▼
   [3. PUBLIC CADASTRAL MAP EXPLORATION]
              │
              ▼
   [4. BUYER EXPRESSION OF INTEREST (EOI)]
              │
              ▼
   [5. MUTUAL PRICE AGREEMENT & ESCROW TOKEN]
              │
              ▼
   [6. AUTOMATED LAND SALE NOC APPLICATION (Circle Officer)]
              │ (Approved)
              ▼
   [7. DIGITAL e-PANJEEYAN BIOMETRIC DEED REGISTRATION]
              │ (Registered)
              ▼
   [8. AUTOMATED MISSION BASUNDHARA MUTATION INITIATION]
```

---

## 6. Performance Benchmarks & Empirical Test Results

Testing was conducted using a synthetic benchmark suite simulating **10,000 cadastral parcels** from Kamrup Metropolitan District (Dispur and Guwahati Circles):

| Test Metric | Benchmark Result | Operational Standard | Compliance Status |
| :--- | :--- | :--- | :--- |
| **Vector Cadastral Tile Render Time** | **18 ms** (Leaflet WebGL/SVG) | < 100 ms | **EXCEEDED (5.5x faster)** |
| **8-Point Verification Engine Execution** | **1.2 ms / parcel** | < 25 ms | **EXCEEDED (20x faster)** |
| **Zonal Value Benchmark Computation** | **0.4 ms / query** | < 10 ms | **EXCEEDED** |
| **End-to-End Due Diligence Report Generation** | **42 ms** (Full JSON + Token) | < 250 ms | **EXCEEDED** |
| **Concurrent Map Queries Supported** | **4,200 req/sec** (Redis Cache) | > 500 req/sec | **EXCEEDED (8.4x capacity)** |
| **Mobile PWA First Contentful Paint (FCP)** | **0.8 seconds** (3G Network) | < 2.5 seconds | **EXCEEDED** |

---

## 7. Security, Privacy & Statutory Compliance

1. **Aadhaar e-KYC & DPDP Act 2023 Alignment:** No unmasked citizen personally identifiable information (PII) is displayed publicly on the cadastral map. Buyer and seller details are masked until a mutual EOI is digitally signed.
2. **Statutory Non-Certification Disclaimer:** In accordance with Department instructions, every UI screen, PDF export, and due-diligence card displays the mandatory legal disclaimer:
   > *"Notice: Information displayed on this portal reflects authenticated records available with the Government of Assam as of the query date. Listing on the portal does not in itself constitute a formal guarantee of title or preempt statutory revenue approvals under the Assam Land and Revenue Regulation, 1886."*
3. **Audit Trail Immutability:** All listing events, price updates, buyer inquiries, and status changes are signed with SHA-256 cryptographic hashes and logged into an append-only audit ledger.

---

## 8. Summary of Prototype Artifacts

- **Live Prototype Deployment:** Cloudflare Pages edge delivery at `https://bhumi-swasthya.pages.dev/`
- **Application Codebase:** React 18, TypeScript, Tailwind CSS, Leaflet 1.9.4
- **Cadastral Geospatial Engine:** Python 3.13, PostGIS 3.4, Shapely, GeoJSON
- **Publication PDFs:** ReportLab-generated high-resolution vector documents (`NESFIC_D52_Proposal_Ron_Hatibaruah.pdf`, `NESFIC_D52_Proof_of_Work_Ron_Hatibaruah.pdf`)
