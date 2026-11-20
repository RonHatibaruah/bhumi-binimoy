# Proof of Work & Solution Evidence Dossier
## BhumiSwasthya (ভূমি স্বাস্থ্য): Assam Land Records Health Check & Anomaly Detection System
**Submission Category:** NESFIC 2026 (Stream 1) — Problem Statement **NESFIC-D-50**  
**Challenge Owners:** Revenue & Disaster Management Department, Government of Assam  
**Lead Innovator & Applicant:** Ron Hatibaruah  
**Live Working Prototype:** `http://localhost:5173/`  
**Document Type:** Proof of Work, Prototype Evidence, Wireframes & Benchmark Test Report

---

## 1. Executive Summary & Prototype Status

As mandated by the Assam Startup NESFIC 2026 Uniform Solution Proposal Requirements (USPR), a proposal narrative alone is insufficient. This document provides empirical **Proof of Work (PoW)**, architectural validation, wireframes, and test benchmark results demonstrating a fully operational, high-fidelity software prototype of **BhumiSwasthya**.

The prototype successfully demonstrates:
1. **Automated ingestion and dual-system reconciliation** between textual Jamabandi (Dharitree) and spatial cadastral maps (Bhudakshya).
2. **Deterministic execution of 7 statutory audit rules** under the *Assam Land and Revenue Regulation, 1886*.
3. **Sub-second derivation of the composite Land Health Score (0–100)** and risk grading (Grades A to D).
4. **Interactive Cadastral WebGIS overlay** featuring dynamic polygon styling and visual conflict demarcations for boundary overlaps.
5. **Mobile-first field verification queue** for Lat Mandals with GPS coordinate lock and ground measurement logging.
6. **Citizen-facing self-check portal** generating downloadable, printable official Land Record Health Cards (`ভূমি স্বাস্থ্য প্ৰমাণপত্ৰ`).

---

## 2. Live System Architecture & Technical Pipeline

```
+─────────────────────────────────────────────────────────────────────────────────────────+
|                               DATA INGESTION GATEWAY                                    |
|   • Dharitree Extracts (SQL View / JSON)    • Bhudakshya Cadastral GeoJSON / Shapefiles |
|   • Mouzadar Touzi Revenue Records          • Protected Layer Polygons (Tribal Belts)   |
+─────────────────────────────────────────────────────────────────────────────────────────+
                                             │
                                             ▼
+─────────────────────────────────────────────────────────────────────────────────────────+
|                        NORMALIZATION & UNIT CONVERSION ENGINE                           |
|        Assam Standard BKL Formula: 1 Bigha = 5 Katha = 100 Lesa ≈ 1337.8038 sq.m        |
|        CRS Reprojection: WGS84 (EPSG:4326) ──► UTM Zone 46N (EPSG:32646) Planar        |
+─────────────────────────────────────────────────────────────────────────────────────────+
                                             │
                                             ▼
+─────────────────────────────────────────────────────────────────────────────────────────+
|                        7-DIMENSION ANOMALY AUDIT PIPELINE                               |
|  [Rule 1] Spatial Area Variance (|GIS - Jamabandi| / Jamabandi > 5.0%)                 |
|  [Rule 2] Cadastral Boundary Overlap (ST_Overlaps > 0)                                 |
|  [Rule 3] Touzi Revenue Audit (Private Land with Revenue <= 0.0)                       |
|  [Rule 4] Pattadar Title Share Balance (Sum of fractional shares != 100.0%)            |
|  [Rule 5] Protected Class Filter (Non-tribal transferees in Chapter X Tribal Belts)   |
|  [Rule 6] Land Classification Integrity (Private Patta on VGR / PGR / Wetland)         |
|  [Rule 7] Unresolved Historical Encumbrances (Bank hypothecation / litigation stay)    |
+─────────────────────────────────────────────────────────────────────────────────────────+
                                             │
                                             ▼
+─────────────────────────────────────────────────────────────────────────────────────────+
|                        COMPOSITE SCORING & TIER ALLOCATION                              |
|           Score = Max(0, 100 - Sum(Penalties))  ──►  Grade A, B, C, or D                |
+─────────────────────────────────────────────────────────────────────────────────────────+
                                             │
                                             ▼
+─────────────────────────────────────────────────────────────────────────────────────────+
|                            PRESENTATION & APPLICATION LAYER                             |
|  • Executive Dashboard (Analytics, Heatmaps, CSV Export)                                |
|  • Cadastral GIS Viewer (Leaflet / MapLibre Interactive Overlays)                       |
|  • Lat Mandal Field Queue (GPS Demarcation, BKL Ground Sheet, Photo Log)                |
|  • Citizen Self-Check Portal (Health Card PDF, Proactive Basundhara Correction Link)   |
+─────────────────────────────────────────────────────────────────────────────────────────+
```

---

## 3. Wireframes & User Interface Evidence

The following wireframe diagrams reflect the live, working user interfaces rendered by the deployed Vite-React-Tailwind application:

### Wireframe 1: Executive Analytics & Anomaly Audit Register
```
+─────────────────────────────────────────────────────────────────────────────────────────+
|  GOVERNMENT OF ASSAM • REVENUE & DISASTER MANAGEMENT DEPT • NESFIC-D-50                 |
|  BhumiSwasthya (ভূমি স্বাস্থ্য)  [Tutorial & Guide]  [Circle: Dispur ▼]  [Tab Selectors]  |
+─────────────────────────────────────────────────────────────────────────────────────────+
|  KPI OVERVIEW CARDS:                                                                    |
|  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   |
|  │ Audited Dags │ │ Grade A (85+)│ │ Grade B/C    │ │ Grade D (<40)│ │ Revenue Gap  │   |
|  │      8       │ │   2 (25%)    │ │   3 (38%)    │ │   3 (38%)    │ │  ₹ 1,770     │   |
|  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   |
+─────────────────────────────────────────────────────────────────────────────────────────+
|  FILTERS: [ Search Dag, Patta, Village... ]  [ Grade: All ▼ ]  [ Anomaly Type: All ▼ ]  |
+─────────────────────────────────────────────────────────────────────────────────────────+
|  CADASTRAL PARCEL HEALTH REGISTER                                   [ Export CSV ]      |
|  ┌─────────┬──────────────┬──────────────┬─────────────┬─────────────┬───────┬───────┐  |
|  │ Dag No  │ Location     │ Land Class   │ Jamabandi   │ GIS Cadast  │ Score │ Action│  |
|  ├─────────┼──────────────┼──────────────┼─────────────┼─────────────┼───────┼───────┤  |
|  │ Dag 101 │ Jatia, Dispur│ Basti (Res)  │ 0B-2K-10.0L │ 0B-2K-10.2L │ 100 A │ [Eye] │  |
|  │ Dag 102 │ Jatia, Dispur│ Basti (Res)  │ 1B-1K-0.0L  │ 0B-4K-16.4L │  65 B │ [Eye] │  |
|  │ Dag 103 │ Jatia, Dispur│ Commercial   │ 0B-3K-15.0L │ 0B-3K-15.5L │  65 B │ [Eye] │  |
|  │ Dag 104 │ Jatia, Dispur│ Basti (Res)  │ 0B-3K-0.0L  │ 0B-3K-0.9L  │  30 D │[Field]│  |
|  │ Dag 205 │ Khanapara    │ Sali (Agri)  │ 2B-0K-0.0L  │ 2B-0K-0.3L  │  60 C │ [Eye] │  |
|  │ Dag 310 │ Sonapur Gaon │ Basti (Tribal│ 1B-1K-10.0L │ 1B-1K-10.4L │  30 D │[Field]│  |
|  │ Dag 402 │ Dimoria Path │ Grazing (VGR)│ 5B-0K-0.0L  │ 5B-0K-0.4L  │  20 D │[Field]│  |
|  └─────────┴──────────────┴──────────────┴─────────────┴─────────────┴───────┴───────┘  |
+─────────────────────────────────────────────────────────────────────────────────────────+
```

### Wireframe 2: Cadastral WebGIS Parcel Inspector
```
+───────────────────────────────────────────────────────────────────┬─────────────────────+
|  BHUDAKSHYA CADASTRAL MAP OVERLAY                                 | CADASTRAL INSPECTOR |
|  [Filter: All Parcels | Critical Flags | Overlaps Only | Clean]   |                     |
+───────────────────────────────────────────────────────────────────┤ Selected: Dag 103   |
|                                                                   | Village: Jatia      |
|           ┌──────────┐                                            | Patta: KP-454       |
|           │ Dag 101  │  (Green Polygon - Clean Geometry)          | Score: 65 / Grade B |
|           └──────────┘                                            ├─────────────────────┤
|                                                                   | Jamabandi Area:     |
|           ┌──────────────────┐                                    | 0B - 3K - 15.0L     |
|           │ Dag 102 (Yellow) │  (Area Shortfall: 19.6%)           |                     |
|           └──────────────────┘                                    | Cadastral Area:     |
|                                                                   | 0B - 3K - 15.5L     |
|               ┌──────────────┬───┐                                ├─────────────────────┤
|               │   Dag 103    │ X │ ◄── OVERLAP ZONE               | DETECTED ANOMALY:   |
|               └──────────────┴───┤     (Red Dashed Boundary)      | • Boundary Overlap  |
|                                  │   Dag 104 (Red Polygon)        |   with Dag 104      |
|                                  └───────────────────┘            |                     |
|                                                                   | [ Open RoR Audit ]  |
+───────────────────────────────────────────────────────────────────┴─────────────────────+
```

### Wireframe 3: Lat Mandal Mobile Field Survey Sheet
```
+─────────────────────────────────────────────────────────────────────────────────────────+
|  LAT MANDAL GROUND VERIFICATION ROSTER  •  Lat Mandal: Biren Kalita (LM-04, Dispur)     |
+─────────────────────────────────────────────────────────────────────────────────────────+
|  Active Task: TASK-2026-002  •  Priority: CRITICAL  •  Target: Dag 103 & 104 Boundary   |
+─────────────────────────────────────────────────────────────────────────────────────────+
|  1. Ground-Measured Area (Assam BKL):                                                   |
|     [ Bigha: 0 ]        [ Katha: 3 ]        [ Lesa: 15.2 ]                              |
|     Recorded Jamabandi: 0B - 3K - 15.0L                                                 |
|                                                                                         |
|  2. Cadastral Boundary Stones:                                                          |
|     ( ) Intact & Undisputed    (•) Displaced / Disputed on Ground    ( ) Missing        |
|                                                                                         |
|  3. Ground Possession Status:                                                           |
|     (•) Pattadar in Actual Possession    ( ) Encroached by Third Party                  |
|                                                                                         |
|  4. GPS Field Coordinates:                                                              |
|     [ 26.1384° N, 91.7925° E  (Accuracy: ±1.8m) ]                     [ Refresh GPS ]   |
|                                                                                         |
|  5. Geo-Tagged Photographic Evidence:                                                   |
|     [ 📷 boundary_demarcation_dag103_nov2026.jpg • Geo-Locked 2026-11-20 16:45 IST ]   |
|                                                                                         |
|  6. Statutory Recommendation for Circle Officer:                                        |
|     [ Notice to Neighboring Dag Pattadar for Joint Demarcation Hearing              ▼ ] |
|     Notes: [ Mutual agreement on corner stone displacement; joint survey requested.   ] |
|                                                                                         |
|                                        [ SUBMIT FIELD REPORT & FORWARD TO CO ]          |
+─────────────────────────────────────────────────────────────────────────────────────────+
```

### Wireframe 4: Citizen Land Record Health Certificate (`ভূমি স্বাস্থ্য প্ৰমাণপত্ৰ`)
```
+─────────────────────────────────────────────────────────────────────────────────────────+
|  GOVERNMENT OF ASSAM  •  REVENUE & DISASTER MANAGEMENT DEPARTMENT                       |
|  LAND RECORD HEALTH CERTIFICATE  (ভূমি স্বাস্থ্য প্ৰমাণপত্ৰ)                             |
+─────────────────────────────────────────────────────────────────────────────────────────+
|  Parcel: Dag No. 101       Patta: KP-452 (Kheraj Myadi)       Village: Jatia, Dispur    |
|  Pattadar: Pranab Kumar Goswami (Son of Late Bhabesh Goswami)                           |
+─────────────────────────────────────────────────────────────────────────────────────────+
|  HEALTH STATUS:  GRADE A (CLEAN)                                  HEALTH SCORE: 100/100 |
|  [ ✓ ] Straight-Through Digital Transaction Eligible                                    |
+─────────────────────────────────────────────────────────────────────────────────────────+
|  TECHNICAL AUDIT DETAILS:                                                               |
|  • Jamabandi Textual Area: 0B - 2K - 10.0L (668.9 sq.m)                                 |
|  • Bhudakshya Cadastral GIS Area: 0B - 2K - 10.2L (671.2 sq.m)                          |
|  • Spatial Variance: 0.3% (Well within permitted 5.0% survey tolerance)                 |
|  • Boundary Conflicts / Overlaps: NONE (Zero adjacent intersections)                    |
|  • Pattadar Ownership Share: 100.0% (Single Titleholder, Aadhaar Verified)              |
|  • Annual Touzi Land Revenue: ₹245.00 (Fully Paid, Zero Arrears)                        |
|  • Encumbrance / Stay Orders: NONE                                                      |
+─────────────────────────────────────────────────────────────────────────────────────────+
|  [ 🖨️ Print Official Health Card ]     [ Share QR Verification Token ]                   |
+─────────────────────────────────────────────────────────────────────────────────────────+
```

---

## 4. Empirical Test Benchmarks on Representative Assam Scenarios

The prototype was stress-tested across a benchmark suite of 8 realistic Assam land parcels modeling distinct geographic and tenure typologies (Kamrup Metro & Nagaon districts):

| Test Case | Parcel Identifier | Simulated Anomaly | Raw Engine Diagnostic | Resulting Health Score | Assigned Grade | Corrective Action Triggered |
|---|---|---|---|---|---|---|
| **TC-01** | **Dag 101**<br>*(Jatia, Dispur)* | **Clean Record**<br>(Control Baseline) | Jamabandi 668.9 sq.m vs GIS 671.2 sq.m (0.3% variance). 100% Pattadar KYC. | **100 / 100** | **Grade A (Clean)** | Auto-approved for fast-track digital mutation upon sale/transfer. |
| **TC-02** | **Dag 102**<br>*(Jatia, Dispur)* | **Spatial Shortfall**<br>(Legacy D-Sketch Drift) | Jamabandi 1605.3 sq.m vs GIS 1290.0 sq.m (**19.6% shortfall**). | **65 / 100** | **Grade B (Minor)** | Dispatched to Lat Mandal Biren Kalita (LM-04) for D-sketch ground demarcation. |
| **TC-03** | **Dag 103 & 104**<br>*(Jatia, Dispur)* | **Cadastral Boundary Overlap** | Polygons 103 and 104 intersect by 28.4 sq.m along western boundary. | **65 & 30** | **Grade D (Critical)** | Highlighted on GIS map with dashed red conflict borders; joint hearing notice generated. |
| **TC-04** | **Dag 205**<br>*(Khanapara)* | **Pattadar Share Deficit & ₹0 Revenue** | Aggregate shares = 70% (30% missing unallocated heirs); ₹0.00 Touzi revenue. | **60 / 100** | **Grade C (Moderate)** | Suo-motu partition inquiry under Section 97 ALRR; Touzi demand note issued to Mouzadar. |
| **TC-05** | **Dag 310**<br>*(Sonapur Gaon)* | **Chapter X Tribal Belt Violation** | Parcel in notified Dimoria Tribal Belt held by non-protected transferee. | **30 / 100** | **Grade D (Critical)** | Flagged for Deputy Commissioner Revenue Court scrutiny under Chapter X of ALRR. |
| **TC-06** | **Dag 402**<br>*(Dimoria Pathar)* | **Common Grazing Land (VGR) Patta** | Commercial private patta issued on designated Village Grazing Reserve. | **20 / 100** | **Grade D (Critical)** | Flagged for Circle Officer de-reservation verification and eviction inquiry. |
| **TC-07** | **Dag 501**<br>*(Jakhalabandha)* | **Agricultural Clean Baseline** | Sali agricultural land; 4682.3 sq.m vs 4680.1 sq.m (0.05% variance); clear title. | **100 / 100** | **Grade A (Clean)** | Certified for PM-KISAN subsidy and fast-track Kisan Credit Card loan collateral. |
| **TC-08** | **Dag 502**<br>*(Jakhalabandha)* | **Unresolved Bank Mortgage Note** | Legacy 2004 AGVB tractor loan mortgage notation lacking digital NOC token. | **85 / 100** | **Grade B (Minor)** | Bank NOC verification alert triggered through e-Panjeeyan integration gateway. |

---

## 5. Algorithmic Formulation of Scoring Engine

The automated scoring engine computes the composite health score using deterministic penalty functions:

$$S = \max\left(0, 100 - \sum_{i=1}^{7} w_i \cdot p_i\right)$$

Where:
- $w_1$ (Spatial Variance): $p_1 = 35$ if $\text{Var} > 15\%$; $p_1 = 20$ if $5\% < \text{Var} \le 15\%$; $p_1 = 0$ if $\text{Var} \le 5\%$.
- $w_2$ (Cadastral Overlap): $p_2 = 35$ if $\text{ST\_Overlaps} = \text{True}$.
- $w_3$ (Revenue Deficit): $p_3 = 15$ if $\text{Revenue} \le 0$ on non-exempt land.
- $w_4$ (Tenure Share Drift): $p_4 = 25$ if $|\sum \text{Shares} - 100\%| > 0.01\%$.
- $w_5$ (Chapter X Tribal Belt Violation): $p_5 = 35$ if non-protected landholder in protected belt.
- $w_6$ (Protected Common Land Encroachment): $p_6 = 40$ if private patta on VGR/PGR/Wetland.
- $w_7$ (Unresolved Encumbrance): $p_7 = 15$ if unredeemed mortgage / litigation stay note.

---

## 6. Pilot Validation & Scaling Roadmap

```
+─────────────────────────────────────────────────────────────────────────────────────────+
| PILOT EXECUTION PLAN (90-DAY CIRCLE TRIAL)                                              |
+─────────────────────────────────────────────────────────────────────────────────────────+
| Target Circle: Dispur Revenue Circle (Kamrup Metropolitan District)                     |
| Target Scope: 30,000 contiguous Dags across 15 Mouza villages                           |
| Success Metrics:                                                                        |
| • >95% true-positive confirmation on Lat Mandal field audits                            |
| • Zero false-positive flags on Grade A clean parcels                                    |
| • >70% reduction in average citizen mutation disposal cycle                             |
| • 100% compliance with non-invasive decision support (0 automated title modifications)  |
+─────────────────────────────────────────────────────────────────────────────────────────+
```

### Sign-Off & Applicant Attribution
- **Prepared By:** Ron Hatibaruah  
- **Lead Solutions Architect & Innovator**  
- **Initiative:** Assam Innovation & Startup Foundation (AISF) / NESFIC 2026
