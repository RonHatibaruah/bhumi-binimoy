import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Rectangle, Circle, Polygon, PathPatch
import numpy as np

os.environ['MPLCONFIGDIR'] = '/tmp/matplotlib-cache'
out_dir = '/Users/kalyan/Downloads/2026/Nov2026/NESFIC2026-Demos/assets/proposal_images'
os.makedirs(out_dir, exist_ok=True)

# Common High-Tech Palette
BG_DARK = '#0b1120'
CARD_BG = '#131e36'
CARD_BORDER = '#223458'
CYAN_ACCENT = '#06b6d4'
EMERALD_ACCENT = '#10b981'
ROSE_ACCENT = '#f43f5e'
AMBER_ACCENT = '#f59e0b'
PURPLE_ACCENT = '#a855f7'
TEXT_WHITE = '#ffffff'
TEXT_MUTED = '#94a3b8'

def add_header(ax, title, subtitle, tag="NESFIC-D-50 TECH FRAMEWORK"):
    # Top banner bar
    banner = FancyBboxPatch((0.03, 0.89), 0.94, 0.08, boxstyle="round,pad=0.01,rounding_size=0.015",
                            facecolor='#111c35', edgecolor='#1e293b', linewidth=1.5)
    ax.add_patch(banner)
    
    # Tag badge
    tag_bg = FancyBboxPatch((0.05, 0.915), 0.18, 0.032, boxstyle="round,pad=0.005,rounding_size=0.008",
                            facecolor='#065f46', edgecolor='#10b981', linewidth=1)
    ax.add_patch(tag_bg)
    ax.text(0.14, 0.931, tag, ha='center', va='center', fontsize=7.5, fontweight='bold', color='#6ee7b7')
    
    ax.text(0.25, 0.935, title, fontsize=12, fontweight='bold', color=TEXT_WHITE)
    ax.text(0.25, 0.910, subtitle, fontsize=8, color=CYAN_ACCENT)
    
    # Right status chip
    gov_badge = FancyBboxPatch((0.80, 0.915), 0.15, 0.032, boxstyle="round,pad=0.005,rounding_size=0.008",
                               facecolor='#1e293b', edgecolor='#334155', linewidth=1)
    ax.add_patch(gov_badge)
    ax.text(0.875, 0.931, "GOVT OF ASSAM • R&DM", ha='center', va='center', fontsize=7, fontweight='bold', color='#e2e8f0')

# ==============================================================================
# DIAGRAM 1: 16:9 Widescreen Paradigm Shift Transformation Framework
# ==============================================================================
def create_widescreen_diagram_1():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_DARK)
    fig.patch.set_facecolor(BG_DARK)
    ax.axis('off')

    add_header(ax, "PARADIGM SHIFT: TRANSFORMATION FROM REACTIVE DISPUTES TO PROACTIVE ASSURANCE",
               "Autonomous Cadastral & Record-of-Rights Auditing System Architecture (ALRR 1886 Alignment)",
               "PARADIGM SHIFT FRAMEWORK")

    # LEFT COLUMN: Reactive Legacy Baseline
    box_left = FancyBboxPatch((0.03, 0.08), 0.45, 0.77, boxstyle="round,pad=0.015,rounding_size=0.02",
                              facecolor='#161726', edgecolor='#4c0519', linewidth=2)
    ax.add_patch(box_left)
    
    # Left Header
    lh = FancyBboxPatch((0.05, 0.77), 0.41, 0.06, boxstyle="round,pad=0.008,rounding_size=0.012",
                         facecolor='#310a14', edgecolor='#e11d48', linewidth=1.5)
    ax.add_patch(lh)
    ax.text(0.255, 0.80, "LEGACY AS-IS WORKFLOW (REACTIVE BOTTLENECK)", ha='center', va='center',
            fontsize=11, fontweight='bold', color='#fecdd3')

    left_cards = [
        ("PHASE 1 • LATENT ANOMALY CREATION", "Historical digitisation errors, overlapping village dags, and un-partitioned\nheir records lie dormant at rest in disconnected databases for decades.", '#241018', '#f43f5e'),
        ("PHASE 2 • CITIZEN-TRIGGERED DISCOVERY", "Citizen applies for land sale NOC, bank mortgage, or inheritance transfer.\nFlaws are suddenly discovered in-flight under severe transaction deadlines.", '#241018', '#f43f5e'),
        ("PHASE 3 • TRANSACTION FREEZE & STALEMATE", "Revenue department or registration halts proceedings. Notice summons issued;\ncitizens face unexpected legal disputes, boundaries objections, and costs.", '#241018', '#f43f5e'),
        ("PHASE 4 • PROLONGED ADMINISTRATIVE BACKLOG", "Requires 6-18 months of litigation, manual survey callouts, and heavy Lat\nMandal diversion. Citizen frustration mounts; public trust degrades.", '#310a14', '#e11d48')
    ]

    for idx, (head, desc, bg, border) in enumerate(left_cards):
        y = 0.65 - idx * 0.17
        card = FancyBboxPatch((0.05, y - 0.04), 0.41, 0.13, boxstyle="round,pad=0.01,rounding_size=0.015",
                              facecolor=bg, edgecolor=border, linewidth=1.2)
        ax.add_patch(card)
        ax.text(0.07, y + 0.045, head, fontsize=8.5, fontweight='bold', color='#fda4af')
        ax.text(0.07, y - 0.010, desc, fontsize=8, color='#f1f5f9', linespacing=1.2)

    # RIGHT COLUMN: BhumiSwasthya Autonomous Framework
    box_right = FancyBboxPatch((0.52, 0.08), 0.45, 0.77, boxstyle="round,pad=0.015,rounding_size=0.02",
                               facecolor='#0c1e28', edgecolor='#065f46', linewidth=2)
    ax.add_patch(box_right)

    rh = FancyBboxPatch((0.54, 0.77), 0.41, 0.06, boxstyle="round,pad=0.008,rounding_size=0.012",
                         facecolor='#064e3b', edgecolor='#10b981', linewidth=1.5)
    ax.add_patch(rh)
    ax.text(0.745, 0.80, "BHUMISWASTHYA TO-BE WORKFLOW (PROACTIVE ASSURANCE)", ha='center', va='center',
            fontsize=11, fontweight='bold', color='#a7f3d0')

    right_cards = [
        ("STAGE 1 • CONTINUOUS DUAL-SYSTEM AUDIT", "Automated PostGIS & Python engine executes 7 statutory consistency rules\nacross Dharitree (Jamabandi) & Bhudakshya (GIS) while records are at rest.", '#0b2923', '#10b981'),
        ("STAGE 2 • MULTI-DIMENSIONAL RISK SCORING", "Every parcel scored on 0-100 Land Health Index. High-risk dags (overlaps,\nChapter X tribal violations, share deficits) triaged automatically into Grade D.", '#0b2923', '#10b981'),
        ("STAGE 3 • PRIORITIZED GPS FIELD SURVEY", "Targeted inspection rosters sent to Lat Mandal mobile PWA. On-site boundary\nlock (accuracy +/-1.2m) & geo-tagged photos capture ground truth early.", '#0b2923', '#10b981'),
        ("STAGE 4 • INSTANT FAST-TRACK TRANSACTIONS", "Discrepancies reconciled BEFORE citizen applies. 70% reduction in disposal\ntimes, zero surprise disputes, and guaranteed transparent land titles.", '#064e3b', '#34d399')
    ]

    for idx, (head, desc, bg, border) in enumerate(right_cards):
        y = 0.65 - idx * 0.17
        card = FancyBboxPatch((0.54, y - 0.04), 0.41, 0.13, boxstyle="round,pad=0.01,rounding_size=0.015",
                              facecolor=bg, edgecolor=border, linewidth=1.2)
        ax.add_patch(card)
        ax.text(0.56, y + 0.045, head, fontsize=8.5, fontweight='bold', color='#6ee7b7')
        ax.text(0.56, y - 0.010, desc, fontsize=8, color='#f1f5f9', linespacing=1.2)

    path = os.path.join(out_dir, "diagram_1_before_after_workflow.png")
    plt.tight_layout()
    plt.savefig(path, dpi=200, bbox_inches='tight')
    plt.close()
    print(f"Created {path}")

# ==============================================================================
# DIAGRAM 2: 16:9 Dual-Core Synchronous Integration Engine
# ==============================================================================
def create_widescreen_diagram_2():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_DARK)
    fig.patch.set_facecolor(BG_DARK)
    ax.axis('off')

    add_header(ax, "DUAL-SYSTEM SYNCHRONOUS INTEGRATION: DHARITREE (TEXT) & BHUDAKSHYA (GIS)",
               "Mathematical Alignment, Geodetic CRS Transformation & 7-Vector Anomaly Pipeline",
               "DUAL-CORE ARCHITECTURE")

    # Left: Dharitree System
    b_left = FancyBboxPatch((0.03, 0.10), 0.28, 0.74, boxstyle="round,pad=0.015,rounding_size=0.02",
                            facecolor=CARD_BG, edgecolor='#0284c7', linewidth=1.8)
    ax.add_patch(b_left)
    ax.text(0.17, 0.79, "DHARITREE DATABASE", ha='center', fontsize=11, fontweight='bold', color='#38bdf8')
    ax.text(0.17, 0.76, "ILRMS Textual RoR Repository", ha='center', fontsize=8, color=TEXT_MUTED)

    d_items = [
        ("Dag & Patta Identity", "Alphanumeric parcel tokens (KP / Periodic / Annual)"),
        ("Jamabandi Recorded Area", "Assam vernacular: Bigha - Katha - Lesa (BKL)"),
        ("Tenure Share Registry", "Co-sharer Pattadar fractional ownership percentages"),
        ("Land Classification", "Basti (Residential), Sali (Paddy), Byabasayik (Comm)"),
        ("Touzi Revenue Demands", "Annual land tax assessment, cess, & arrears balance"),
        ("Historical Encumbrances", "Bank hypothecations, mortgage tokens, court stays")
    ]
    for i, (head, sub) in enumerate(d_items):
        y = 0.69 - i * 0.095
        card = FancyBboxPatch((0.045, y - 0.025), 0.25, 0.075, boxstyle="round,pad=0.005,rounding_size=0.01",
                              facecolor='#162544', edgecolor='#1e3a8a', linewidth=1)
        ax.add_patch(card)
        ax.text(0.06, y + 0.018, head, fontsize=8, fontweight='bold', color='#bae6fd')
        ax.text(0.06, y - 0.012, sub, fontsize=7, color='#94a3b8')

    # Center: BhumiSwasthya Core Reconciliation Pipeline
    b_center = FancyBboxPatch((0.35, 0.06), 0.30, 0.81, boxstyle="round,pad=0.015,rounding_size=0.02",
                             facecolor='#062c24', edgecolor=EMERALD_ACCENT, linewidth=2.5)
    ax.add_patch(b_center)
    ax.text(0.50, 0.82, "BHUMISWASTHYA CORE ENGINE", ha='center', fontsize=12, fontweight='bold', color='#ffffff')
    ax.text(0.50, 0.79, "Mathematical Conversion & PostGIS Spatial Topology", ha='center', fontsize=8, color='#6ee7b7')

    c_items = [
        ("Assam BKL Conversion Core", "1 Bigha = 5 Katha = 100 Lesa = 1337.8038 sq.m\nExact geodetic metric calculation"),
        ("Geodetic Planar Projection", "CRS Conversion: EPSG:4326 (WGS84)\n──► EPSG:32646 (UTM Zone 46N)"),
        ("Topological Overlap Detector", "PostGIS ST_Overlaps & ST_Intersection\nBoundary sliver & conflict resolution"),
        ("Statutory Compliance Filters", "Chapter X Tribal Belt Protected Class Filter\nVGR / PGR / Wetland Reservation Check"),
        ("Composite Land Health Scorer", "Score = Max(0, 100 - Σ Penalties)\nAutomated Triage: Grade A, B, C, D")
    ]
    for i, (head, sub) in enumerate(c_items):
        y = 0.72 - i * 0.125
        card = FancyBboxPatch((0.37, y - 0.035), 0.26, 0.10, boxstyle="round,pad=0.008,rounding_size=0.01",
                              facecolor='#021c17', edgecolor='#059669', linewidth=1.2)
        ax.add_patch(card)
        ax.text(0.50, y + 0.025, head, ha='center', fontsize=8.5, fontweight='bold', color='#34d399')
        ax.text(0.50, y - 0.015, sub, ha='center', fontsize=7, color='#d1fae5', linespacing=1.1)

    # Right: Bhudakshya Cadastral GIS System
    b_right = FancyBboxPatch((0.69, 0.10), 0.28, 0.74, boxstyle="round,pad=0.015,rounding_size=0.02",
                             facecolor=CARD_BG, edgecolor='#7c3aed', linewidth=1.8)
    ax.add_patch(b_right)
    ax.text(0.83, 0.79, "BHUDAKSHYA (BHU-NAKSHA)", ha='center', fontsize=11, fontweight='bold', color='#c084fc')
    ax.text(0.83, 0.76, "Cadastral GIS Vector Infrastructure", ha='center', fontsize=8, color=TEXT_MUTED)

    b_items = [
        ("Digitized Dag Geometry", "2D Polygon coordinates & survey vertex boundaries"),
        ("Spatial Boundary Vectors", "Shared parcel lines & inter-plot adjacency models"),
        ("Digital Village Perimeters", "Total revenue village jurisdiction boundaries"),
        ("Notified Protected Layers", "Tribal Belts/Blocks & Forest Reservation boundary"),
        ("Ecological Commons Map", "VGR (Village Grazing) & PGR reserve spatial polygons"),
        ("Orthorectified Imagery", "Satellite & UAV high-resolution ground basemap")
    ]
    for i, (head, sub) in enumerate(b_items):
        y = 0.69 - i * 0.095
        card = FancyBboxPatch((0.705, y - 0.025), 0.25, 0.075, boxstyle="round,pad=0.005,rounding_size=0.01",
                              facecolor='#1f1b3b', edgecolor='#4c1d95', linewidth=1)
        ax.add_patch(card)
        ax.text(0.72, y + 0.018, head, fontsize=8, fontweight='bold', color='#e9d5ff')
        ax.text(0.72, y - 0.012, sub, fontsize=7, color='#94a3b8')

    # Connecting Arrows
    ax.annotate('', xy=(0.35, 0.48), xytext=(0.31, 0.48), arrowprops=dict(arrowstyle="->", color=CYAN_ACCENT, lw=3))
    ax.annotate('', xy=(0.65, 0.48), xytext=(0.69, 0.48), arrowprops=dict(arrowstyle="<-", color=PURPLE_ACCENT, lw=3))

    path = os.path.join(out_dir, "diagram_2_dual_system_reconciliation.png")
    plt.tight_layout()
    plt.savefig(path, dpi=200, bbox_inches='tight')
    plt.close()
    print(f"Created {path}")

# ==============================================================================
# DIAGRAM 3: 16:9 5-Vector Cadastral Topological Anomaly Detection Matrix
# ==============================================================================
def create_widescreen_diagram_3():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_DARK)
    fig.patch.set_facecolor(BG_DARK)
    ax.axis('off')

    add_header(ax, "CADASTRAL ANOMALY DETECTION SUITE: 5 TOPOLOGICAL & STATUTORY DEFECT PATTERNS",
               "Deterministic Spatial & Legal Rules Enforcing Assam Land and Revenue Regulation 1886",
               "ANOMALY DETECTION MATRIX")

    panels = [
        ("1. CADASTRAL OVERLAP", "Dag 103 & 104 Boundary Intersection", "CRITICAL RISK (-35 Pts)", ROSE_ACCENT),
        ("2. SPATIAL AREA DRIFT", "19.6% Shortfall vs Jamabandi Text", "HIGH RISK (-20 Pts)", AMBER_ACCENT),
        ("3. SHARE DISCREPANCY", "Pattadar Shares = 70% (30% Deficit)", "HIGH RISK (-25 Pts)", AMBER_ACCENT),
        ("4. CHAPTER X VIOLATION", "Non-Tribal in Protected Tribal Belt", "CRITICAL RISK (-35 Pts)", ROSE_ACCENT),
        ("5. COMMON LAND RESERVATION", "Private Myadi Patta on VGR Grazing", "CRITICAL RISK (-40 Pts)", ROSE_ACCENT)
    ]

    for idx, (p_title, p_sub, p_badge, b_color) in enumerate(panels):
        x = 0.03 + idx * 0.19
        panel_box = FancyBboxPatch((x, 0.10), 0.175, 0.74, boxstyle="round,pad=0.01,rounding_size=0.015",
                                   facecolor=CARD_BG, edgecolor=CARD_BORDER, linewidth=1.5)
        ax.add_patch(panel_box)

        # Badge
        badge_box = FancyBboxPatch((x + 0.01, 0.78), 0.155, 0.035, boxstyle="round,pad=0.005,rounding_size=0.008",
                                   facecolor='#1e293b', edgecolor=b_color, linewidth=1)
        ax.add_patch(badge_box)
        ax.text(x + 0.087, 0.797, p_badge, ha='center', va='center', fontsize=6.5, fontweight='bold', color=b_color)

        ax.text(x + 0.087, 0.74, p_title, ha='center', fontsize=8.5, fontweight='bold', color=TEXT_WHITE)
        ax.text(x + 0.087, 0.705, p_sub, ha='center', fontsize=7, color=TEXT_MUTED)

        # Graphic Box
        g_box = FancyBboxPatch((x + 0.015, 0.28), 0.145, 0.38, boxstyle="round,pad=0.005,rounding_size=0.01",
                               facecolor='#0b1120', edgecolor='#1e293b', linewidth=1)
        ax.add_patch(g_box)

        # Draw specific visual inside each panel
        if idx == 0:
            # Overlap polygons
            poly1 = Polygon([(x+0.03, 0.35), (x+0.10, 0.35), (x+0.09, 0.58), (x+0.03, 0.55)], closed=True,
                            facecolor='#ea580c', alpha=0.5, edgecolor='#ea580c', lw=1.5)
            poly2 = Polygon([(x+0.07, 0.38), (x+0.14, 0.38), (x+0.13, 0.61), (x+0.06, 0.61)], closed=True,
                            facecolor='#e11d48', alpha=0.5, edgecolor='#e11d48', lw=1.5, linestyle='--')
            ax.add_patch(poly1)
            ax.add_patch(poly2)
            ax.text(x+0.087, 0.48, "[OVERLAP ZONE]\nST_Overlaps > 0", ha='center', fontsize=7, fontweight='bold', color='#fecdd3')

        elif idx == 1:
            # Area Drift: Outer dashed line, inner smaller polygon
            outer = Polygon([(x+0.025, 0.32), (x+0.15, 0.32), (x+0.14, 0.62), (x+0.025, 0.60)], closed=True,
                            facecolor='none', edgecolor='#94a3b8', lw=1.5, linestyle=':')
            inner = Polygon([(x+0.04, 0.35), (x+0.13, 0.35), (x+0.12, 0.55), (x+0.04, 0.54)], closed=True,
                            facecolor='#d97706', alpha=0.6, edgecolor='#f59e0b', lw=1.5)
            ax.add_patch(outer)
            ax.add_patch(inner)
            ax.text(x+0.087, 0.45, "GIS Polygon Area\n-19.6% Deficit", ha='center', fontsize=7.5, fontweight='bold', color='#fef3c7')

        elif idx == 2:
            # Pie Chart
            wedges, _ = ax.pie([40, 30, 30], colors=['#10b981', '#3b82f6', '#f43f5e'], startangle=90, radius=0.06,
                               center=(x+0.087, 0.47), wedgeprops=dict(width=0.03, edgecolor='#0b1120', linewidth=1.5))
            ax.text(x+0.087, 0.47, "Sum:\n70%", ha='center', va='center', fontsize=7, fontweight='bold', color='#ffffff')
            ax.text(x+0.087, 0.32, "P1: 40% • P2: 30%\nUnallocated Heir: 30%", ha='center', fontsize=6.5, color='#cbd5e1')

        elif idx == 3:
            # Tribal Belt Boundary
            tb = Polygon([(x+0.02, 0.30), (x+0.155, 0.30), (x+0.155, 0.64), (x+0.02, 0.64)], closed=True,
                         facecolor='#3b0764', alpha=0.5, edgecolor='#a855f7', lw=1.5)
            pr = Polygon([(x+0.045, 0.36), (x+0.13, 0.36), (x+0.12, 0.58), (x+0.04, 0.56)], closed=True,
                         facecolor='#dc2626', alpha=0.7, edgecolor='#f87171', lw=1.5)
            ax.add_patch(tb)
            ax.add_patch(pr)
            ax.text(x+0.087, 0.61, "Dimoria Tribal Belt", ha='center', fontsize=6.5, fontweight='bold', color='#e9d5ff')
            ax.text(x+0.087, 0.47, "Dag 310\nNon-Protected\nTransferee", ha='center', fontsize=7, fontweight='bold', color='#ffffff')

        elif idx == 4:
            # VGR Grazing Land
            vgr = Polygon([(x+0.02, 0.30), (x+0.155, 0.30), (x+0.155, 0.64), (x+0.02, 0.64)], closed=True,
                          facecolor='#064e3b', alpha=0.5, edgecolor='#10b981', lw=1.5)
            enc = Polygon([(x+0.045, 0.36), (x+0.13, 0.38), (x+0.12, 0.58), (x+0.04, 0.56)], closed=True,
                          facecolor='#e11d48', alpha=0.75, edgecolor='#f43f5e', lw=1.5)
            ax.add_patch(vgr)
            ax.add_patch(enc)
            ax.text(x+0.087, 0.61, "Village Grazing Reserve", ha='center', fontsize=6.5, fontweight='bold', color='#a7f3d0')
            ax.text(x+0.087, 0.47, "Dag 402\nPrivate Myadi Patta\n(Commercial)", ha='center', fontsize=7, fontweight='bold', color='#ffffff')

        # Statutory Action Box below
        act_box = FancyBboxPatch((x + 0.015, 0.12), 0.145, 0.13, boxstyle="round,pad=0.005,rounding_size=0.008",
                                 facecolor='#162544', edgecolor='#1e3a8a')
        ax.add_patch(act_box)
        actions = [
            "Mandatory Joint Survey Order\nissued to Lat Mandal LM-04",
            "Lat Mandal Ground Survey\nre-calculates true BKL area",
            "Suo-motu partition case\ninitiated under Section 97 ALRR",
            "Transferred to Deputy\nCommissioner Revenue Court",
            "Notice of de-reservation\nscrutiny issued to Circle Officer"
        ]
        ax.text(x + 0.087, 0.185, "STATUTORY ACTION:", ha='center', fontsize=6.5, fontweight='bold', color=CYAN_ACCENT)
        ax.text(x + 0.087, 0.145, actions[idx], ha='center', fontsize=6.5, color='#e2e8f0', linespacing=1.2)

    path = os.path.join(out_dir, "diagram_3_cadastral_anomaly_catalog.png")
    plt.savefig(path, dpi=200)
    plt.close()
    print(f"Created {path}")

# ==============================================================================
# DIAGRAM 4: 16:9 Multi-Tier Risk Classification Framework
# ==============================================================================
def create_widescreen_diagram_4():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_DARK)
    fig.patch.set_facecolor(BG_DARK)
    ax.axis('off')

    add_header(ax, "LAND HEALTH SCORING MODEL & RISK TIER TRIAGE MATRIX (0 - 100 SCALE)",
               "Deterministic Multi-Factor Penalty Engine: Score = Max(0, 100 - Σ [Severity_i * Penalty_i])",
               "RISK SCORING HIERARCHY")

    tiers = [
        ("GRADE A • 85 TO 100", "CLEAN / LOW RISK", '#064e3b', '#10b981', '#6ee7b7',
         "0 Cadastral Overlaps • 0 Share Deficits • Area Variance < 5.0% • Verified Touzi Revenue",
         "STRAIGHT-THROUGH DIGITAL MUTATION READY",
         "Parcels require zero manual intervention. Automatically certified for instant sale NOC, bank loan hypothecation, and direct succession mutation without human queue delays."),
        
        ("GRADE B • 65 TO 84", "MINOR INCONSISTENCY", '#451a03', '#f59e0b', '#fde68a',
         "Minor clerical or metadata gaps • Aadhaar KYC unlinked • Spatial boundary drift 5% to 10%",
         "DESK RECONCILIATION & AUTO-CORRECTION",
         "Reconciled via administrative desk review by Kanungo. Automated SMS notification dispatched to Pattadar via Mission Basundhara portal for digital self-authentication."),
        
        ("GRADE C • 40 TO 64", "MODERATE RISK", '#431407', '#f97316', '#fed7aa',
         "Pattadar share sum < 100% (unrecorded heirs) • ₹0 Touzi tax demand on taxable holding • Unredeemed mortgage note",
         "KANUNGO AUDIT & LEGAL NOTICE TRIGGER",
         "Suo-motu field mutation inquiry initiated under Section 97 ALRR. Bank discharge verification request triggered via e-Panjeeyan integration gateway."),
        
        ("GRADE D • 0 TO 39", "CRITICAL / HIGH RISK", '#4c0519', '#f43f5e', '#fecdd3',
         "Cadastral polygon overlap • Chapter X Tribal Belt non-protected transferee • Private Myadi Patta on VGR Grazing Reserve",
         "MANDATORY LAT MANDAL FIELD SURVEY",
         "Immediate freeze on automated services. Priority work-order dispatched to Lat Mandal mobile app for on-ground GPS demarcation, pillar inspection, and CO formal hearing.")
    ]

    for idx, (grade, risk_label, bg_color, border_color, text_hl, criteria, action, desc) in enumerate(tiers):
        y = 0.68 - idx * 0.195
        card = FancyBboxPatch((0.04, y - 0.05), 0.92, 0.165, boxstyle="round,pad=0.015,rounding_size=0.02",
                              facecolor=bg_color, edgecolor=border_color, linewidth=1.8)
        ax.add_patch(card)

        # Left Grade Pill
        gp = FancyBboxPatch((0.06, y + 0.04), 0.22, 0.045, boxstyle="round,pad=0.005,rounding_size=0.01",
                            facecolor='#0b1120', edgecolor=border_color, linewidth=1.2)
        ax.add_patch(gp)
        ax.text(0.17, y + 0.062, grade, ha='center', va='center', fontsize=9.5, fontweight='bold', color=text_hl)

        # Risk badge
        ax.text(0.30, y + 0.062, f"STATUS: {risk_label}", va='center', fontsize=8.5, fontweight='bold', color=TEXT_WHITE)

        # Operational Action badge right
        act_pill = FancyBboxPatch((0.68, y + 0.04), 0.26, 0.045, boxstyle="round,pad=0.005,rounding_size=0.01",
                                  facecolor=border_color, edgecolor='none')
        ax.add_patch(act_pill)
        ax.text(0.81, y + 0.062, action, ha='center', va='center', fontsize=7.5, fontweight='bold', color='#0b1120')

        # Technical Criteria
        ax.text(0.06, y + 0.005, f"DETECTION CRITERIA: {criteria}", fontsize=8, fontweight='bold', color='#e2e8f0')

        # Description
        ax.text(0.06, y - 0.032, f"DEPARTMENTAL ACTION: {desc}", fontsize=7.5, color='#cbd5e1', linespacing=1.1)

    path = os.path.join(out_dir, "diagram_4_land_health_score_hierarchy.png")
    plt.tight_layout()
    plt.savefig(path, dpi=200, bbox_inches='tight')
    plt.close()
    print(f"Created {path}")

# ==============================================================================
# DIAGRAM 5: 16:9 Lat Mandal Mobile Geospatial Field App
# ==============================================================================
def create_widescreen_diagram_5():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_DARK)
    fig.patch.set_facecolor(BG_DARK)
    ax.axis('off')

    add_header(ax, "LAT MANDAL FIELD GROUND-TRUTHING INTERFACE (PROGRESSIVE WEB APP)",
               "GPS-Locked Cadastral Demarcation, Vernacular BKL Measurement & Photo Evidence Capture",
               "SURVEYOR FIELD PWA")

    # Left: Mobile Frame Visual
    phone = FancyBboxPatch((0.05, 0.08), 0.32, 0.77, boxstyle="round,pad=0.02,rounding_size=0.035",
                           facecolor='#020617', edgecolor='#334155', linewidth=3)
    ax.add_patch(phone)

    # Phone Inner Screen
    scr = FancyBboxPatch((0.065, 0.10), 0.29, 0.73, boxstyle="round,pad=0.01,rounding_size=0.02",
                         facecolor='#0f172a', edgecolor='#1e293b', linewidth=1)
    ax.add_patch(scr)

    # Mobile Screen Header
    m_h = FancyBboxPatch((0.065, 0.75), 0.29, 0.08, boxstyle="round,pad=0.005,rounding_size=0.01",
                          facecolor='#064e3b', edgecolor='none')
    ax.add_patch(m_h)
    ax.text(0.08, 0.795, "BhumiSwasthya Mandal", fontsize=9, fontweight='bold', color='#ffffff')
    ax.text(0.08, 0.768, "Biren Kalita • LM-04 (Beltola Mouza)", fontsize=7, color='#6ee7b7')

    # Task Box
    tb = FancyBboxPatch((0.08, 0.62), 0.26, 0.11, boxstyle="round,pad=0.008,rounding_size=0.01",
                        facecolor='#261014', edgecolor='#f43f5e', linewidth=1)
    ax.add_patch(tb)
    ax.text(0.095, 0.695, "TASK #TASK-2026-002 • CRITICAL", fontsize=7.5, fontweight='bold', color='#fecdd3')
    ax.text(0.095, 0.665, "Dag 103 & 104 Boundary Conflict", fontsize=7, color='#fda4af')
    ax.text(0.095, 0.638, "Target: Jatia Village • Due: 2026-11-23", fontsize=6.5, color='#cbd5e1')

    # Inputs inside screen
    ax.text(0.095, 0.58, "1. Measured Ground BKL:", fontsize=7, fontweight='bold', color=TEXT_WHITE)
    ax.text(0.095, 0.55, "[ 0 Bigha ]  [ 3 Katha ]  [ 15.2 Lesa ]", fontsize=7, fontweight='bold', color=CYAN_ACCENT)

    ax.text(0.095, 0.51, "2. Boundary Pillar Status:", fontsize=7, fontweight='bold', color=TEXT_WHITE)
    ax.text(0.095, 0.48, "[X] Displaced / Disputed on Ground", fontsize=7, color=AMBER_ACCENT)

    ax.text(0.095, 0.44, "3. GPS Geotag Lock:", fontsize=7, fontweight='bold', color=TEXT_WHITE)
    ax.text(0.095, 0.41, "[GPS] 26.1384 N, 91.7925 E (+/-1.2m)", fontsize=7, color='#38bdf8')

    ax.text(0.095, 0.37, "4. Physical Photo Capture:", fontsize=7, fontweight='bold', color=TEXT_WHITE)
    ax.text(0.095, 0.34, "[PHOTO] stone_demarcation_dag103.jpg", fontsize=7, color=EMERALD_ACCENT)

    ax.text(0.095, 0.30, "5. Statutory Recommendation:", fontsize=7, fontweight='bold', color=TEXT_WHITE)
    ax.text(0.095, 0.27, "Joint Boundary Settlement Notice", fontsize=7, color='#e2e8f0')

    # Submit Button inside screen
    s_btn = FancyBboxPatch((0.08, 0.14), 0.26, 0.07, boxstyle="round,pad=0.008,rounding_size=0.01",
                           facecolor=EMERALD_ACCENT, edgecolor='none')
    ax.add_patch(s_btn)
    ax.text(0.21, 0.175, "SUBMIT FIELD SURVEY REPORT", ha='center', va='center', fontsize=7.5, fontweight='bold', color='#022c22')

    # Right: Technical Capabilities & Field Architecture
    b_features = FancyBboxPatch((0.41, 0.08), 0.55, 0.77, boxstyle="round,pad=0.015,rounding_size=0.02",
                                facecolor=CARD_BG, edgecolor=CARD_BORDER, linewidth=1.8)
    ax.add_patch(b_features)
    ax.text(0.44, 0.80, "FIELD VERIFICATION TECHNICAL CAPABILITIES", fontsize=11, fontweight='bold', color=TEXT_WHITE)
    ax.text(0.44, 0.77, "Designed for Offline Resilience in Remote Assamese Mouzas & Char Areas", fontsize=8, color=CYAN_ACCENT)

    feat_list = [
        ("OFFLINE-FIRST PROGRESSIVE WEB APP (PWA)", 
         "Fully functional in low-connectivity areas (riverine char dags, forested tea gardens). Syncs verified survey sheets\nand photos automatically when device regains 4G/5G connectivity with the State Data Centre."),
        ("SUB-METER GNSS & GPS INTEGRATION", 
         "Integrates device GPS and Bluetooth external RTK rovers, locking geographical parcel vertices with accuracy\nunder +/-1.5 meters. Eliminates ambiguity over displaced boundary corner stones (chitha pillars)."),
        ("TIME-STAMPED PHOTOGRAPHIC AUDIT LOGS", 
         "Captured demarcation photos are cryptographically signed with EXIF coordinates, timestamp, and Mandal\ncredentials, creating legally indisputable evidence for Circle Officer judicial settlement hearings."),
        ("60% REDUCTION IN SURVEY REPORTING TIME", 
         "Pre-populated cadastral diagnostics eliminate manual report drafting. Mandals confirm ground truth with\ntouch inputs, allowing a single surveyor to inspect up to 25 flagged dags per day.")
    ]

    for i, (f_head, f_desc) in enumerate(feat_list):
        y = 0.67 - i * 0.145
        f_card = FancyBboxPatch((0.43, y - 0.035), 0.51, 0.12, boxstyle="round,pad=0.01,rounding_size=0.012",
                                facecolor='#0b1120', edgecolor='#1e293b', linewidth=1)
        ax.add_patch(f_card)
        ax.text(0.45, y + 0.035, f_head, fontsize=8.5, fontweight='bold', color='#6ee7b7')
        ax.text(0.45, y - 0.012, f_desc, fontsize=7.5, color='#cbd5e1', linespacing=1.2)

    path = os.path.join(out_dir, "diagram_5_lat_mandal_mobile_app.png")
    plt.tight_layout()
    plt.savefig(path, dpi=200, bbox_inches='tight')
    plt.close()
    print(f"Created {path}")

# ==============================================================================
# DIAGRAM 6: 16:9 Citizen Trust Certificate & Basundhara Integration
# ==============================================================================
def create_widescreen_diagram_6():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_DARK)
    fig.patch.set_facecolor(BG_DARK)
    ax.axis('off')

    add_header(ax, "CITIZEN LAND HEALTH CARD (BHUMI SWASTHYA PRAMAN PATRA)",
               "Public Verification Token, Mission Basundhara Pre-Emptive Correction Linkage",
               "CITIZEN TRANSPARENCY PORTAL")

    # Left: Official Certificate Representation
    cert_outer = FancyBboxPatch((0.04, 0.08), 0.55, 0.77, boxstyle="round,pad=0.015,rounding_size=0.02",
                                facecolor='#ffffff', edgecolor='#d97706', linewidth=2.5)
    ax.add_patch(cert_outer)

    cert_inner = FancyBboxPatch((0.055, 0.10), 0.52, 0.73, boxstyle="round,pad=0.01,rounding_size=0.015",
                                facecolor='#fcfbf7', edgecolor='#fde68a', linewidth=1.5)
    ax.add_patch(cert_inner)

    # Certificate Headers
    ax.text(0.315, 0.79, "GOVERNMENT OF ASSAM", ha='center', fontsize=10, fontweight='bold', color='#78350f')
    ax.text(0.315, 0.765, "REVENUE & DISASTER MANAGEMENT DEPARTMENT", ha='center', fontsize=8, color='#0f172a')
    ax.text(0.315, 0.725, "LAND RECORD HEALTH CERTIFICATE", ha='center', fontsize=12, fontweight='bold', color='#064e3b')
    ax.text(0.315, 0.695, "Issued under Automated Cadastral Health Monitoring Protocol (NESFIC-D-50)", ha='center', fontsize=6.5, color='#059669')

    # Grid Box
    g_box = FancyBboxPatch((0.075, 0.35), 0.48, 0.32, boxstyle="round,pad=0.01,rounding_size=0.01",
                           facecolor='#f8fafc', edgecolor='#e2e8f0', linewidth=1)
    ax.add_patch(g_box)

    ax.text(0.09, 0.625, "Dag Number: 101", fontsize=8.5, fontweight='bold', color='#0f172a')
    ax.text(0.24, 0.625, "Patta Number: KP-452 (Kheraj Myadi)", fontsize=8.5, color='#0f172a')
    ax.text(0.44, 0.625, "Village: Jatia, Dispur", fontsize=8.5, color='#0f172a')

    ax.text(0.09, 0.565, "Jamabandi Area: 0B - 2K - 10L (668.9 sq.m)", fontsize=7.5, color='#334155')
    ax.text(0.32, 0.565, "Cadastral GIS Area: 0B - 2K - 10.2L (671.2 sq.m)", fontsize=7.5, color='#334155')

    ax.text(0.09, 0.505, "Pattadar: Pranab Kumar Goswami", fontsize=8, fontweight='bold', color='#0f172a')
    ax.text(0.32, 0.505, "Tenure Share: 100% (Aadhaar Verified)", fontsize=8, color='#059669')

    ax.text(0.09, 0.445, "Annual Revenue: Rs. 245.00 (Fully Paid)", fontsize=7.5, color='#334155')
    ax.text(0.32, 0.445, "Encumbrance / Court Stay: NONE DETECTED", fontsize=7.5, color='#15803d')

    ax.text(0.09, 0.385, "Spatial Variance: 0.3% (Clean Cadastral Match)", fontsize=7.5, color='#059669')
    ax.text(0.32, 0.385, "Tribal Belt Status: Regular Non-Restricted", fontsize=7.5, color='#334155')

    # Badge Stamp
    st = FancyBboxPatch((0.08, 0.14), 0.27, 0.17, boxstyle="round,pad=0.01,rounding_size=0.015",
                        facecolor='#f0fdf4', edgecolor='#86efac', linewidth=1.5)
    ax.add_patch(st)
    ax.text(0.215, 0.25, "GRADE A • 100/100", ha='center', fontsize=11, fontweight='bold', color='#15803d')
    ax.text(0.215, 0.19, "CLEAN TITLE • ZERO SPATIAL DEFECTS", ha='center', fontsize=6.5, fontweight='bold', color='#166534')
    ax.text(0.215, 0.16, "Eligible for Straight-Through Mutation", ha='center', fontsize=6.5, color='#15803d')

    # QR Code Token
    qr = FancyBboxPatch((0.39, 0.14), 0.16, 0.17, boxstyle="round,pad=0.005,rounding_size=0.01",
                        facecolor='#0f172a', edgecolor='none')
    ax.add_patch(qr)
    ax.text(0.47, 0.24, "[ DIGITAL SEAL ]", ha='center', fontsize=7.5, fontweight='bold', color='#a7f3d0')
    ax.text(0.47, 0.19, "Token: #MB-2026-9812", ha='center', fontsize=6.5, color='#ffffff')
    ax.text(0.47, 0.16, "Circle Officer Verified", ha='center', fontsize=6, color='#94a3b8')

    # Right: Citizen Value Framework
    b_cit = FancyBboxPatch((0.63, 0.08), 0.33, 0.77, boxstyle="round,pad=0.015,rounding_size=0.02",
                           facecolor=CARD_BG, edgecolor=CARD_BORDER, linewidth=1.8)
    ax.add_patch(b_cit)
    ax.text(0.66, 0.80, "CITIZEN VALUE PROPOSITION", fontsize=11, fontweight='bold', color=TEXT_WHITE)
    ax.text(0.66, 0.77, "Direct Integration with Mission Basundhara 3.0", fontsize=8, color=CYAN_ACCENT)

    c_points = [
        ("KNOW YOUR LAND HEALTH IN SECONDS", "Citizens search by Village + Dag/Patta number on any smartphone,\ninstantly viewing their parcel trust badge with zero technical complexity."),
        ("PRE-EMPTIVE DISPUTE PREVENTION", "Identifies area mismatches or share deficits months BEFORE selling or\nmortgaging, preventing surprise transaction halts and broker exploitation."),
        ("1-CLICK PROACTIVE CORRECTION", "Flagged parcels provide direct links to file online clerical correction\nor partition applications under Mission Basundhara without office visits."),
        ("BANK LOAN FAST-TRACK PASSPORT", "Certified Grade A Health Cards accepted by commercial & rural banks\nfor instant collateral valuation, speeding up Kisan Credit Card (KCC) loans.")
    ]

    for i, (chead, cdesc) in enumerate(c_points):
        y = 0.67 - i * 0.145
        ccard = FancyBboxPatch((0.65, y - 0.035), 0.29, 0.12, boxstyle="round,pad=0.01,rounding_size=0.01",
                               facecolor='#0b1120', edgecolor='#1e293b', linewidth=1)
        ax.add_patch(ccard)
        ax.text(0.67, y + 0.035, chead, fontsize=8, fontweight='bold', color='#38bdf8')
        ax.text(0.67, y - 0.012, cdesc, fontsize=7, color='#cbd5e1', linespacing=1.2)

    path = os.path.join(out_dir, "diagram_6_citizen_land_health_certificate.png")
    plt.tight_layout()
    plt.savefig(path, dpi=200, bbox_inches='tight')
    plt.close()
    print(f"Created {path}")

# ==============================================================================
# DIAGRAM 7: 16:9 Enterprise Architecture & Cloud Deployment
# ==============================================================================
def create_widescreen_diagram_7():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_DARK)
    fig.patch.set_facecolor(BG_DARK)
    ax.axis('off')

    add_header(ax, "ENTERPRISE CLOUD ARCHITECTURE & SDC SYSTEM INTEGRATION",
               "Zero-Trust Read-Only Ingestion, PostGIS 16 Spatial Compute & Role-Gated Application Delivery",
               "ENTERPRISE GOVTECH STACK")

    layers = [
        ("LAYER 1 • SECURE READ-ONLY DATA INGESTION (ASSAM STATE DATA CENTRE SECURE ZONE)",
         [("Dharitree API / Extracts", "Tabular RoR, Jamabandi, Pattadars, BKL Area"),
          ("Bhudakshya WFS / Vector Feed", "Cadastral Dag Polygons & Boundary Lines"),
          ("Mouzadar Touzi Registers", "Annual Tax Demand, Cess, Arrears Collection"),
          ("Notified Spatial Boundary Layers", "Chapter X Tribal Belts, VGR/PGR Commons")],
         0.67, 0.18, '#1e293b', '#0284c7'),

        ("LAYER 2 • HIGH-PERFORMANCE COMPUTATION & SPATIAL ENGINE (PYTHON 3.13 + POSTGIS 16)",
         [("Assam BKL Conversion Core", "1B = 5K = 100L = 1337.8 sq.m\nGeodesic Metric Alignment"),
          ("PostGIS Spatial Topology", "ST_Overlaps • ST_Area • GiST\nBoundary Conflict Detection"),
          ("7 Statutory Anomaly Rules", "ALRR 1886 Jurisprudence\nTenure Share Parity Engine"),
          ("Composite Health Scorer", "Score = Max(0, 100 - Σ Penalties)\nAutomated Triage: Grades A-D")],
         0.37, 0.24, '#064e3b', EMERALD_ACCENT),

        ("LAYER 3 • PRESENTATION & MULTI-STAKEHOLDER APPLICATION SERVICES (ROLE-BASED ACCESS CONTROL)",
         [("Executive Command Dashboard", "Circle Heatmaps • Defect Analytics\nTouzi Revenue at Risk • CSV Exports"),
          ("Lat Mandal Field Mobile PWA", "GPS Coordinate Lock (+/-1.2m)\nBoundary Photo & Measurement Log"),
          ("Citizen Self-Check Portal", "Public Dag/Patta Search • Health Card\nMission Basundhara Direct Routing")],
         0.08, 0.23, '#1e293b', PURPLE_ACCENT)
    ]

    for l_title, boxes, y_base, h_box, bg_box, border_col in layers:
        container = FancyBboxPatch((0.04, y_base), 0.92, h_box, boxstyle="round,pad=0.015,rounding_size=0.02",
                                   facecolor='#111c35', edgecolor=border_col, linewidth=1.5)
        ax.add_patch(container)
        ax.text(0.06, y_base + h_box - 0.035, l_title, fontsize=9, fontweight='bold', color=TEXT_WHITE)

        num_boxes = len(boxes)
        box_width = 0.88 / num_boxes - 0.02
        for b_idx, (b_head, b_sub) in enumerate(boxes):
            bx = 0.06 + b_idx * (box_width + 0.02)
            by = y_base + 0.025
            bh = h_box - 0.075
            inner_b = FancyBboxPatch((bx, by), box_width, bh, boxstyle="round,pad=0.008,rounding_size=0.01",
                                     facecolor='#0b1120', edgecolor='#1e293b', linewidth=1)
            ax.add_patch(inner_b)
            ax.text(bx + box_width/2, by + bh*0.62, b_head, ha='center', va='center', fontsize=8, fontweight='bold', color='#6ee7b7')
            ax.text(bx + box_width/2, by + bh*0.32, b_sub, ha='center', va='center', fontsize=6.8, color='#cbd5e1', linespacing=1.2)

    path = os.path.join(out_dir, "diagram_7_enterprise_system_architecture.png")
    plt.tight_layout()
    plt.savefig(path, dpi=200, bbox_inches='tight')
    plt.close()
    print(f"Created {path}")

if __name__ == '__main__':
    create_widescreen_diagram_1()
    create_widescreen_diagram_2()
    create_widescreen_diagram_3()
    create_widescreen_diagram_4()
    create_widescreen_diagram_5()
    create_widescreen_diagram_6()
    create_widescreen_diagram_7()
