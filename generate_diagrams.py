import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Rectangle, Circle, Polygon
import numpy as np

os.environ['MPLCONFIGDIR'] = '/tmp/matplotlib-cache'
out_dir = '/Users/kalyan/Downloads/2026/Nov2026/NESFIC2026-Demos/assets/proposal_images'
os.makedirs(out_dir, exist_ok=True)

# -------------------------------------------------------------
# DIAGRAM 1: Before vs After Workflow Comparison
# -------------------------------------------------------------
def create_diagram_1():
    fig, ax = plt.subplots(figsize=(12, 6.5), dpi=200)
    ax.set_facecolor('#f8fafc')
    fig.patch.set_facecolor('#f8fafc')
    ax.axis('off')

    # Title
    ax.text(0.5, 0.95, "PARADIGM SHIFT: CURRENT REACTIVE VS. BHUMISWASTHYA PROACTIVE ASSURANCE", 
            ha='center', va='center', fontsize=13, fontweight='bold', color='#0f172a')
    ax.text(0.5, 0.90, "Government of Assam • Revenue & Disaster Management Department • NESFIC-D-50", 
            ha='center', va='center', fontsize=9, color='#059669')

    # Left Box - Current Reactive Approach
    box_left = FancyBboxPatch((0.04, 0.08), 0.43, 0.76, boxstyle="round,pad=0.02,rounding_size=0.03", 
                              facecolor='#fff1f2', edgecolor='#fda4af', linewidth=2)
    ax.add_patch(box_left)
    ax.text(0.255, 0.80, "CURRENT WORKFLOW (REACTIVE BOTTLENECK)", ha='center', va='center', 
            fontsize=11, fontweight='bold', color='#9f1239')

    left_steps = [
        ("1. Record at Rest in Silo", "Dharitree & Bhudakshya hold un-audited historical records.\nErrors remain latent and unnoticed for years.", '#ffe4e6'),
        ("2. Citizen Triggers Transaction", "Citizen applies for Land Sale NOC, Bank Mortgage,\nor Inheritance Mutation under urgent timeline.", '#ffe4e6'),
        ("3. Sudden Discrepancy Discovery", "Sub-Registrar or CO discovers Dag overlap, missing BKL\narea, or share deficit. Transaction is abruptly halted.", '#fecdd3'),
        ("4. Prolonged Disputes & Backlogs", "3 to 12 months delay. Contentious field summons,\nlegal notices, and high citizen dissatisfaction.", '#fda4af')
    ]
    for idx, (title, desc, bg) in enumerate(left_steps):
        y = 0.67 - idx * 0.17
        step_box = FancyBboxPatch((0.06, y - 0.05), 0.39, 0.13, boxstyle="round,pad=0.01,rounding_size=0.02",
                                  facecolor=bg, edgecolor='#f43f5e', linewidth=1)
        ax.add_patch(step_box)
        ax.text(0.08, y + 0.035, title, fontsize=9, fontweight='bold', color='#881337')
        ax.text(0.08, y - 0.015, desc, fontsize=7.5, color='#4c0519', linespacing=1.2)

    # Right Box - BhumiSwasthya Proactive Solution
    box_right = FancyBboxPatch((0.53, 0.08), 0.43, 0.76, boxstyle="round,pad=0.02,rounding_size=0.03", 
                               facecolor='#f0fdf4', edgecolor='#86efac', linewidth=2)
    ax.add_patch(box_right)
    ax.text(0.745, 0.80, "BHUMISWASTHYA (PROACTIVE ASSURANCE)", ha='center', va='center', 
            fontsize=11, fontweight='bold', color='#14532d')

    right_steps = [
        ("1. Automated Continuous Audit", "7 statutory rules scan textual Jamabandi against Cadastral\nGIS geometry while records are at rest.", '#dcfce7'),
        ("2. Early Anomaly Flagging", "Defects (overlaps, share deficits, zero Touzi revenue)\nflagged with composite Health Score (0-100).", '#dcfce7'),
        ("3. Prioritized Lat Mandal Dispatch", "Risk-targeted field survey roster deployed with GPS\ncoordinate lock & ground-truthing tools.", '#bbf7d0'),
        ("4. Pre-Emptive Fast-Track Settlement", "Reconciled BEFORE citizen applies. 70% faster mutations,\nzero unexpected disputes, and trusted title records.", '#86efac')
    ]
    for idx, (title, desc, bg) in enumerate(right_steps):
        y = 0.67 - idx * 0.17
        step_box = FancyBboxPatch((0.55, y - 0.05), 0.39, 0.13, boxstyle="round,pad=0.01,rounding_size=0.02",
                                  facecolor=bg, edgecolor='#10b981', linewidth=1)
        ax.add_patch(step_box)
        ax.text(0.57, y + 0.035, title, fontsize=9, fontweight='bold', color='#064e3b')
        ax.text(0.57, y - 0.015, desc, fontsize=7.5, color='#022c22', linespacing=1.2)

    path = os.path.join(out_dir, "diagram_1_before_after_workflow.png")
    plt.tight_layout()
    plt.savefig(path, dpi=200, bbox_inches='tight')
    plt.close()
    print(f"Created {path}")

# -------------------------------------------------------------
# DIAGRAM 2: Dual-System Reconciliation (Dharitree + Bhudakshya)
# -------------------------------------------------------------
def create_diagram_2():
    fig, ax = plt.subplots(figsize=(12, 6.5), dpi=200)
    ax.set_facecolor('#f8fafc')
    fig.patch.set_facecolor('#f8fafc')
    ax.axis('off')

    ax.text(0.5, 0.95, "DUAL-SYSTEM RECONCILIATION: DHARITREE (TEXT) & BHUDAKSHYA (GIS)", 
            ha='center', va='center', fontsize=13, fontweight='bold', color='#0f172a')
    ax.text(0.5, 0.90, "Automated Cross-Verification Engine for Land Health Check (NESFIC-D-50)", 
            ha='center', va='center', fontsize=9, color='#059669')

    # Left: Dharitree
    box_dharitree = FancyBboxPatch((0.05, 0.15), 0.26, 0.68, boxstyle="round,pad=0.02,rounding_size=0.03", 
                                   facecolor='#f0fdfa', edgecolor='#5eead4', linewidth=1.5)
    ax.add_patch(box_dharitree)
    ax.text(0.18, 0.78, "DHARITREE (TEXTUAL)", ha='center', va='center', fontsize=10.5, fontweight='bold', color='#134e4a')
    ax.text(0.18, 0.74, "Record of Rights (Jamabandi)", ha='center', va='center', fontsize=8, color='#0f766e')

    d_items = [
        "• Dag & Patta Numbers",
        "• Recorded Area (Bigha-Katha-Lesa)",
        "• Pattadar Names & KYC",
        "• Fractional Ownership Shares (%)",
        "• Land Classification (Basti, Sali)",
        "• Annual Touzi Revenue Demand",
        "• Historical Encumbrance Notes"
    ]
    for i, item in enumerate(d_items):
        ax.text(0.07, 0.67 - i*0.065, item, fontsize=8, color='#0f172a')

    # Center: BhumiSwasthya Engine
    box_engine = FancyBboxPatch((0.36, 0.10), 0.28, 0.75, boxstyle="round,pad=0.02,rounding_size=0.03", 
                                facecolor='#064e3b', edgecolor='#047857', linewidth=2)
    ax.add_patch(box_engine)
    ax.text(0.50, 0.81, "BHUMISWASTHYA CORE", ha='center', va='center', fontsize=11, fontweight='bold', color='#ffffff')
    ax.text(0.50, 0.77, "Reconciliation & Scoring Pipeline", ha='center', va='center', fontsize=8, color='#a7f3d0')

    engine_blocks = [
        ("Assam Unit Standardizer", "1B = 5K = 100L ≈ 1337.8 sq.m"),
        ("PostGIS Spatial Topology", "ST_Overlaps • ST_Area • GiST"),
        ("7 Deterministic Rules", "Legal & Mathematical Checks"),
        ("Health Score Derivation", "0-100 Composite Index (Grades A-D)"),
        ("Targeted Dispatch Engine", "Field Rosters for Lat Mandals")
    ]
    for i, (b_title, b_sub) in enumerate(engine_blocks):
        y = 0.67 - i*0.11
        eb = FancyBboxPatch((0.38, y - 0.035), 0.24, 0.08, boxstyle="round,pad=0.01,rounding_size=0.015",
                            facecolor='#022c22', edgecolor='#10b981', linewidth=1)
        ax.add_patch(eb)
        ax.text(0.50, y + 0.015, b_title, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#6ee7b7')
        ax.text(0.50, y - 0.015, b_sub, ha='center', va='center', fontsize=7, color='#d1fae5')

    # Right: Bhudakshya
    box_bhudakshya = FancyBboxPatch((0.69, 0.15), 0.26, 0.68, boxstyle="round,pad=0.02,rounding_size=0.03", 
                                    facecolor='#eff6ff', edgecolor='#93c5fd', linewidth=1.5)
    ax.add_patch(box_bhudakshya)
    ax.text(0.82, 0.78, "BHUDAKSHYA (GIS)", ha='center', va='center', fontsize=10.5, fontweight='bold', color='#1e3a8a')
    ax.text(0.82, 0.74, "Cadastral Map Overlay (Bhu-Naksha)", ha='center', va='center', fontsize=8, color='#2563eb')

    b_items = [
        "• Digitized Dag Polygon Geometry",
        "• Geo-Referenced Coordinates (CRS)",
        "• Planar Metric Area (sq. meters)",
        "• Adjacent Parcel Boundary Vectors",
        "• Village Cadastral Outer Limits",
        "• Notified Tribal Belt Boundaries",
        "• Ecological Reserves (VGR/PGR)"
    ]
    for i, item in enumerate(b_items):
        ax.text(0.71, 0.67 - i*0.065, item, fontsize=8, color='#0f172a')

    # Flow arrows
    ax.annotate('', xy=(0.35, 0.50), xytext=(0.32, 0.50), arrowprops=dict(arrowstyle="->", color='#059669', lw=2.5))
    ax.annotate('', xy=(0.65, 0.50), xytext=(0.68, 0.50), arrowprops=dict(arrowstyle="<-", color='#2563eb', lw=2.5))

    path = os.path.join(out_dir, "diagram_2_dual_system_reconciliation.png")
    plt.tight_layout()
    plt.savefig(path, dpi=200, bbox_inches='tight')
    plt.close()
    print(f"Created {path}")

# -------------------------------------------------------------
# DIAGRAM 3: Cadastral Anomaly Catalog (5 Real Defects)
# -------------------------------------------------------------
def create_diagram_3():
    fig, axes = plt.subplots(1, 5, figsize=(15, 4.5), dpi=200)
    fig.patch.set_facecolor('#f8fafc')

    fig.suptitle("CATALOG OF DETECTED CADASTRAL DEFECTS (ASSAM REVENUE FRAMEWORK)", 
                 fontsize=13, fontweight='bold', color='#0f172a', y=0.98)

    titles = [
        ("1. Boundary Overlap", "Dag 103 overlaps Dag 104\n(Red Hatched Conflict)"),
        ("2. Spatial Area Drift", "Jamabandi: 1B-1K-0L\nGIS Polygon: -19.6% deficit"),
        ("3. Tenure Share Deficit", "Total Shares = 70%\n(Missing 30% Heir Share)"),
        ("4. Chapter X Tribal Belt", "Non-Tribal Holding in\nNotified Dimoria Belt"),
        ("5. Common Land (VGR)", "Private Patta on Village\nGrazing Reserve (VGR)")
    ]

    for idx, ax in enumerate(axes):
        ax.set_facecolor('#ffffff')
        ax.set_xlim(0, 10)
        ax.set_ylim(0, 10)
        ax.set_xticks([])
        ax.set_yticks([])
        for spine in ax.spines.values():
            spine.set_color('#cbd5e1')
            spine.set_linewidth(1)

        t_main, t_sub = titles[idx]
        ax.set_title(t_main, fontsize=9.5, fontweight='bold', color='#0f172a', pad=8)
        ax.text(5, -1.2, t_sub, ha='center', va='top', fontsize=7.5, color='#475569', linespacing=1.2)

        if idx == 0:
            # Overlap
            p1 = Polygon([(1,2), (6,2), (5,8), (1,7)], closed=True, facecolor='#f97316', alpha=0.5, edgecolor='#ea580c', lw=2)
            p2 = Polygon([(4,1), (9,2), (8,7), (3,7)], closed=True, facecolor='#ef4444', alpha=0.5, edgecolor='#dc2626', lw=2, linestyle='--')
            ax.add_patch(p1)
            ax.add_patch(p2)
            ax.text(2.5, 4.5, "Dag 103", fontsize=8, fontweight='bold', color='#7c2d12')
            ax.text(7.0, 4.5, "Dag 104", fontsize=8, fontweight='bold', color='#7f1d1d')
            ax.text(4.5, 4.5, "⚠️", fontsize=10, ha='center', va='center')
        elif idx == 1:
            # Area Drift
            outer = Polygon([(1,1), (9,1), (8,9), (1,8)], closed=True, facecolor='none', edgecolor='#94a3b8', lw=2, linestyle=':')
            inner = Polygon([(2,2), (7,2), (6.5,7), (2,6.5)], closed=True, facecolor='#f59e0b', alpha=0.6, edgecolor='#d97706', lw=2)
            ax.add_patch(outer)
            ax.add_patch(inner)
            ax.text(4.5, 4.5, "Actual GIS Area\n(0B-4K-16L)", ha='center', va='center', fontsize=7.5, fontweight='bold', color='#78350f')
            ax.text(5, 8.2, "Recorded Jamabandi", ha='center', fontsize=7, color='#64748b')
        elif idx == 2:
            # Share Deficit
            sizes = [40, 30, 30]
            colors_list = ['#10b981', '#3b82f6', '#f43f5e']
            labels = ['P1: 40%', 'P2: 30%', 'Deficit:\n30%']
            wedges, _ = ax.pie(sizes, colors=colors_list, startangle=90, radius=3.2, center=(5,5),
                               wedgeprops=dict(width=1.5, edgecolor='#ffffff', linewidth=1.5))
            ax.text(5, 5, "Total:\n70%", ha='center', va='center', fontsize=8.5, fontweight='bold', color='#0f172a')
        elif idx == 3:
            # Tribal Belt
            tb = Polygon([(0.5,0.5), (9.5,0.5), (9.5,9.5), (0.5,9.5)], closed=True, facecolor='#f3e8ff', edgecolor='#c084fc', lw=2)
            parcel = Polygon([(2.5,2.5), (7.5,3.0), (7.0,7.5), (2.0,7.0)], closed=True, facecolor='#ef4444', alpha=0.6, edgecolor='#b91c1c', lw=2)
            ax.add_patch(tb)
            ax.add_patch(parcel)
            ax.text(5, 8.8, "Notified Tribal Belt (Dimoria)", ha='center', fontsize=7, color='#7e22ce', fontweight='bold')
            ax.text(4.7, 5.0, "Dag 310\nNon-Protected\nTransferee", ha='center', va='center', fontsize=7.5, fontweight='bold', color='#ffffff')
        elif idx == 4:
            # VGR Encroachment
            vgr = Polygon([(0.5,0.5), (9.5,0.5), (9.5,9.5), (0.5,9.5)], closed=True, facecolor='#dcfce7', edgecolor='#86efac', lw=2)
            enc = Polygon([(3,3), (8,3.5), (7.5,8), (2.5,7.5)], closed=True, facecolor='#f43f5e', alpha=0.65, edgecolor='#dc2626', lw=2)
            ax.add_patch(vgr)
            ax.add_patch(enc)
            ax.text(5, 8.8, "Village Grazing Reserve (VGR)", ha='center', fontsize=7, color='#15803d', fontweight='bold')
            ax.text(5, 5.2, "Dag 402\nPrivate Myadi Patta\n(Commercial)", ha='center', va='center', fontsize=7.5, fontweight='bold', color='#ffffff')

    path = os.path.join(out_dir, "diagram_3_cadastral_anomaly_catalog.png")
    plt.tight_layout()
    plt.savefig(path, dpi=200, bbox_inches='tight')
    plt.close()
    print(f"Created {path}")

# -------------------------------------------------------------
# DIAGRAM 4: Land Health Score Hierarchy (Grade A - D)
# -------------------------------------------------------------
def create_diagram_4():
    fig, ax = plt.subplots(figsize=(10, 6), dpi=200)
    ax.set_facecolor('#f8fafc')
    fig.patch.set_facecolor('#f8fafc')
    ax.axis('off')

    ax.text(0.5, 0.94, "LAND HEALTH SCORING MODEL & RISK TIER HIERARCHY", 
            ha='center', va='center', fontsize=13, fontweight='bold', color='#0f172a')
    ax.text(0.5, 0.89, "Multi-Factor Penalty Model: Score = Max(0, 100 - Σ Penalties)", 
            ha='center', va='center', fontsize=8.5, color='#059669')

    tiers = [
        ("GRADE A (85 - 100) • CLEAN & HEALTHY", 
         "Straight-Through Transaction Ready. 0 boundary overlap, 0 share deficit, spatial drift <5%, verified Touzi tax.", 
         '#f0fdf4', '#10b981', '#064e3b', 'FAST-TRACK MUTATION READY'),
        ("GRADE B (65 - 84) • MINOR INCONSISTENCY", 
         "Minor clerical or metadata gaps (Aadhaar KYC pending, spatial drift 5-10%). Reconcilable via desk review.", 
         '#fefce8', '#f59e0b', '#78350f', 'DESK RECONCILIATION'),
        ("GRADE C (40 - 64) • MODERATE RISK", 
         "Share allocation deficit (unallocated heirs), unassessed Touzi revenue, or unredeemed legacy bank mortgage.", 
         '#fff7ed', '#f97316', '#7c2d12', 'KANUNGO AUDIT & NOTICE'),
        ("GRADE D (< 40) • CRITICAL / HIGH RISK", 
         "Cadastral boundary overlap, Chapter X Tribal Belt non-tribal holding, or private settlement on VGR grazing land.", 
         '#fff1f2', '#ef4444', '#881337', 'MANDATORY FIELD SURVEY')
    ]

    for idx, (title, desc, bg, border, text_color, badge) in enumerate(tiers):
        y = 0.70 - idx * 0.18
        box = FancyBboxPatch((0.08, y - 0.06), 0.84, 0.14, boxstyle="round,pad=0.015,rounding_size=0.02",
                             facecolor=bg, edgecolor=border, linewidth=1.8)
        ax.add_patch(box)

        # Title & Badge
        ax.text(0.11, y + 0.045, title, fontsize=9.5, fontweight='bold', color=text_color)
        badge_box = FancyBboxPatch((0.71, y + 0.03), 0.19, 0.035, boxstyle="round,pad=0.008,rounding_size=0.01",
                                   facecolor=border, edgecolor='none')
        ax.add_patch(badge_box)
        ax.text(0.805, y + 0.047, badge, ha='center', va='center', fontsize=6.5, fontweight='bold', color='#ffffff')

        # Description
        ax.text(0.11, y - 0.015, desc, fontsize=8, color='#334155', linespacing=1.2)

    path = os.path.join(out_dir, "diagram_4_land_health_score_hierarchy.png")
    plt.tight_layout()
    plt.savefig(path, dpi=200, bbox_inches='tight')
    plt.close()
    print(f"Created {path}")

# -------------------------------------------------------------
# DIAGRAM 5: Lat Mandal Mobile Field App Mockup
# -------------------------------------------------------------
def create_diagram_5():
    fig, ax = plt.subplots(figsize=(8, 7), dpi=200)
    ax.set_facecolor('#f8fafc')
    fig.patch.set_facecolor('#f8fafc')
    ax.axis('off')

    ax.text(0.5, 0.96, "LAT MANDAL FIELD VERIFICATION INTERFACE (PWA)", 
            ha='center', va='center', fontsize=12, fontweight='bold', color='#0f172a')
    ax.text(0.5, 0.92, "GPS-Locked Ground Verification Sheet for Circle Officer Roster", 
            ha='center', va='center', fontsize=8, color='#059669')

    # Phone Frame
    phone = FancyBboxPatch((0.22, 0.04), 0.56, 0.84, boxstyle="round,pad=0.02,rounding_size=0.04",
                           facecolor='#0f172a', edgecolor='#334155', linewidth=4)
    ax.add_patch(phone)

    # Phone Screen
    screen = FancyBboxPatch((0.24, 0.06), 0.52, 0.80, boxstyle="round,pad=0.01,rounding_size=0.02",
                            facecolor='#ffffff', edgecolor='#cbd5e1', linewidth=1)
    ax.add_patch(screen)

    # App Header inside screen
    app_header = FancyBboxPatch((0.24, 0.77), 0.52, 0.09, boxstyle="round,pad=0.005,rounding_size=0.01",
                                facecolor='#064e3b', edgecolor='none')
    ax.add_patch(app_header)
    ax.text(0.26, 0.825, "BhumiSwasthya Field Mandal", fontsize=8.5, fontweight='bold', color='#ffffff')
    ax.text(0.26, 0.795, "Officer: Biren Kalita (LM-04, Dispur)", fontsize=7, color='#a7f3d0')

    # Task Card
    task_card = FancyBboxPatch((0.26, 0.64), 0.48, 0.11, boxstyle="round,pad=0.008,rounding_size=0.01",
                               facecolor='#fef2f2', edgecolor='#fecaca', linewidth=1)
    ax.add_patch(task_card)
    ax.text(0.28, 0.72, "TASK: Dag 103 & 104 Boundary Overlap", fontsize=8, fontweight='bold', color='#991b1b')
    ax.text(0.28, 0.69, "Village: Jatia, Beltola • Priority: CRITICAL", fontsize=7, color='#b91c1c')
    ax.text(0.28, 0.66, "Conflict: 28.4 sq.m overlap along western border", fontsize=6.5, color='#7f1d1d')

    # Inputs Section
    inputs_box = FancyBboxPatch((0.26, 0.23), 0.48, 0.39, boxstyle="round,pad=0.008,rounding_size=0.01",
                                facecolor='#f8fafc', edgecolor='#e2e8f0', linewidth=1)
    ax.add_patch(inputs_box)
    
    ax.text(0.28, 0.59, "1. Ground-Measured Area (Assam BKL):", fontsize=7.5, fontweight='bold', color='#0f172a')
    ax.text(0.28, 0.555, "[ 0 Bigha ]  [ 3 Katha ]  [ 15.2 Lesa ]", fontsize=7.5, color='#0f766e', fontweight='bold')

    ax.text(0.28, 0.515, "2. Cadastral Boundary Stones:", fontsize=7.5, fontweight='bold', color='#0f172a')
    ax.text(0.28, 0.485, "• Displaced / Disputed on Ground", fontsize=7, color='#c2410c')

    ax.text(0.28, 0.445, "3. GPS Coordinates Lock:", fontsize=7.5, fontweight='bold', color='#0f172a')
    ax.text(0.28, 0.415, "[GPS] 26.1384 N, 91.7925 E (Accuracy: +/-1.2m)", fontsize=7, color='#1e40af')

    ax.text(0.28, 0.375, "4. Geo-Tagged Photographic Evidence:", fontsize=7.5, fontweight='bold', color='#0f172a')
    ax.text(0.28, 0.345, "[PHOTO] stone_demarcation_dag103.jpg (Locked)", fontsize=7, color='#15803d')

    ax.text(0.28, 0.305, "5. Statutory Recommendation:", fontsize=7.5, fontweight='bold', color='#0f172a')
    ax.text(0.28, 0.275, "Notice to Neighbor for Joint Boundary Hearing", fontsize=7, color='#065f46')

    # Submit Button
    btn = FancyBboxPatch((0.28, 0.10), 0.44, 0.08, boxstyle="round,pad=0.008,rounding_size=0.015",
                         facecolor='#059669', edgecolor='none')
    ax.add_patch(btn)
    ax.text(0.50, 0.14, "SUBMIT FIELD SURVEY REPORT", ha='center', va='center', fontsize=8, fontweight='bold', color='#ffffff')

    path = os.path.join(out_dir, "diagram_5_lat_mandal_mobile_app.png")
    plt.tight_layout()
    plt.savefig(path, dpi=200, bbox_inches='tight')
    plt.close()
    print(f"Created {path}")

# -------------------------------------------------------------
# DIAGRAM 6: Citizen Land Health Certificate
# -------------------------------------------------------------
def create_diagram_6():
    fig, ax = plt.subplots(figsize=(10, 6.5), dpi=200)
    ax.set_facecolor('#ffffff')
    fig.patch.set_facecolor('#ffffff')
    ax.axis('off')

    # Outer ornate certificate border
    border_outer = FancyBboxPatch((0.03, 0.03), 0.94, 0.94, boxstyle="round,pad=0.01,rounding_size=0.02",
                                  facecolor='#fefce8', edgecolor='#ca8a04', linewidth=2.5)
    ax.add_patch(border_outer)

    border_inner = FancyBboxPatch((0.05, 0.05), 0.90, 0.90, boxstyle="round,pad=0.01,rounding_size=0.015",
                                  facecolor='#ffffff', edgecolor='#eab308', linewidth=1)
    ax.add_patch(border_inner)

    # Header
    ax.text(0.5, 0.88, "GOVERNMENT OF ASSAM", ha='center', va='center', fontsize=11, fontweight='bold', color='#78350f')
    ax.text(0.5, 0.84, "REVENUE & DISASTER MANAGEMENT DEPARTMENT", ha='center', va='center', fontsize=9, color='#0f172a')
    ax.text(0.5, 0.79, "LAND RECORD HEALTH CERTIFICATE (BHUMI SWASTHYA PRAMAN PATRA)", 
            ha='center', va='center', fontsize=12, fontweight='bold', color='#064e3b')
    ax.text(0.5, 0.75, "Issued under Automated Cadastral Health Monitoring Protocol (NESFIC-D-50)", 
            ha='center', va='center', fontsize=7.5, color='#059669')

    # Parcel Details Grid
    details_box = FancyBboxPatch((0.08, 0.36), 0.84, 0.35, boxstyle="round,pad=0.01,rounding_size=0.015",
                                 facecolor='#f8fafc', edgecolor='#cbd5e1', linewidth=1)
    ax.add_patch(details_box)

    ax.text(0.12, 0.67, "Dag Number: 101", fontsize=9, fontweight='bold', color='#0f172a')
    ax.text(0.40, 0.67, "Patta Number: KP-452 (Kheraj Myadi)", fontsize=9, color='#0f172a')
    ax.text(0.70, 0.67, "Village: Jatia (Beltola Mouza)", fontsize=9, color='#0f172a')

    ax.text(0.12, 0.60, "Recorded Jamabandi: 0B - 2K - 10L (668.9 sq.m)", fontsize=8, color='#334155')
    ax.text(0.55, 0.60, "Cadastral GIS Area: 0B - 2K - 10.2L (671.2 sq.m)", fontsize=8, color='#334155')

    ax.text(0.12, 0.53, "Pattadar: Pranab Kumar Goswami", fontsize=8.5, fontweight='bold', color='#0f172a')
    ax.text(0.55, 0.53, "Tenure Share: 100% (Aadhaar Verified)", fontsize=8.5, color='#059669')

    ax.text(0.12, 0.46, "Annual Touzi Revenue: ₹245.00 (Fully Paid)", fontsize=8, color='#334155')
    ax.text(0.55, 0.46, "Encumbrance / Court Stay: NONE DETECTED", fontsize=8, color='#15803d')

    ax.text(0.12, 0.39, "Spatial Variance: 0.3% (Clean Cadastral Match)", fontsize=8, color='#059669')
    ax.text(0.55, 0.39, "Tribal Belt Status: Non-Restricted / Regular", fontsize=8, color='#334155')

    # Health Badge & Stamp
    badge = FancyBboxPatch((0.10, 0.12), 0.42, 0.20, boxstyle="round,pad=0.01,rounding_size=0.02",
                           facecolor='#f0fdf4', edgecolor='#86efac', linewidth=1.5)
    ax.add_patch(badge)
    ax.text(0.31, 0.26, "GRADE A • 100 / 100", ha='center', va='center', fontsize=13, fontweight='bold', color='#15803d')
    ax.text(0.31, 0.19, "CLEAN TITLE • ZERO SPATIAL DEFECTS", ha='center', va='center', fontsize=7.5, color='#166534', fontweight='bold')
    ax.text(0.31, 0.15, "Fast-Track Digital Mutation Eligible", ha='center', va='center', fontsize=7, color='#15803d')

    # Official Seal / QR Representation
    qr_box = FancyBboxPatch((0.65, 0.11), 0.22, 0.21, boxstyle="round,pad=0.005,rounding_size=0.01",
                            facecolor='#0f172a', edgecolor='none')
    ax.add_patch(qr_box)
    ax.text(0.76, 0.24, "[ DIGITAL SEAL ]", ha='center', va='center', fontsize=8, color='#a7f3d0', fontweight='bold')
    ax.text(0.76, 0.18, "QR Token: #MB-2026-9812", ha='center', va='center', fontsize=6.5, color='#ffffff')
    ax.text(0.76, 0.14, "Verified by Circle Officer", ha='center', va='center', fontsize=6, color='#94a3b8')

    path = os.path.join(out_dir, "diagram_6_citizen_land_health_certificate.png")
    plt.tight_layout()
    plt.savefig(path, dpi=200, bbox_inches='tight')
    plt.close()
    print(f"Created {path}")

# -------------------------------------------------------------
# DIAGRAM 7: Enterprise System Architecture & Cloud Hosting
# -------------------------------------------------------------
def create_diagram_7():
    fig, ax = plt.subplots(figsize=(12, 6.5), dpi=200)
    ax.set_facecolor('#f8fafc')
    fig.patch.set_facecolor('#f8fafc')
    ax.axis('off')

    ax.text(0.5, 0.95, "ENTERPRISE CLOUD ARCHITECTURE & SYSTEM INTEGRATION", 
            ha='center', va='center', fontsize=13, fontweight='bold', color='#0f172a')
    ax.text(0.5, 0.90, "Compliant with MeghRaj Cloud & Assam State Data Centre (SDC) Security Directives", 
            ha='center', va='center', fontsize=8.5, color='#059669')

    # Layer 1: Ingestion
    l1 = FancyBboxPatch((0.05, 0.68), 0.90, 0.18, boxstyle="round,pad=0.015,rounding_size=0.02",
                        facecolor='#ffffff', edgecolor='#cbd5e1', linewidth=1.5)
    ax.add_patch(l1)
    ax.text(0.08, 0.81, "1. READ-ONLY DATA INGESTION GATEWAY (SDC SECURE ZONE)", fontsize=9, fontweight='bold', color='#0f172a')
    
    ingest_boxes = [
        ("Dharitree API / Extracts", "RoR, Patta, BKL, Touzi Demand"),
        ("Bhudakshya WFS / GIS", "Cadastral Dag Polygon Vectors"),
        ("Mouzadar Touzi Rolls", "Annual Collection, Arrears"),
        ("Chapter X Spatial Layer", "Notified Tribal Belts, VGR/PGR")
    ]
    for i, (head, sub) in enumerate(ingest_boxes):
        x = 0.08 + i * 0.22
        b = FancyBboxPatch((x, 0.70), 0.20, 0.08, boxstyle="round,pad=0.01,rounding_size=0.01",
                           facecolor='#f0fdf4', edgecolor='#86efac')
        ax.add_patch(b)
        ax.text(x + 0.10, 0.75, head, ha='center', va='center', fontsize=7.5, fontweight='bold', color='#065f46')
        ax.text(x + 0.10, 0.72, sub, ha='center', va='center', fontsize=6.5, color='#047857')

    # Layer 2: Core Processing
    l2 = FancyBboxPatch((0.05, 0.36), 0.90, 0.27, boxstyle="round,pad=0.015,rounding_size=0.02",
                        facecolor='#064e3b', edgecolor='#047857', linewidth=2)
    ax.add_patch(l2)
    ax.text(0.08, 0.58, "2. CORE ANOMALY DETECTION & SCORING PIPELINE (PYTHON 3.13 + POSTGIS 16)", fontsize=9.5, fontweight='bold', color='#ffffff')

    core_boxes = [
        ("Assam BKL Conversion Core", "1B = 5K = 100L ≈ 1337.8 sq.m\nPlanar Coordinate Reprojection"),
        ("PostGIS Spatial Topology", "ST_Overlaps • ST_Area • GiST\nBoundary sliver detection"),
        ("7 Statutory Audit Rules", "ALRR 1886 • Chapter X Filter\nTenure share parity audit"),
        ("Composite Scoring Engine", "Score = Max(0, 100 - Σ Penalties)\nRisk Grading (Grades A to D)")
    ]
    for i, (head, sub) in enumerate(core_boxes):
        x = 0.08 + i * 0.22
        b = FancyBboxPatch((x, 0.39), 0.20, 0.15, boxstyle="round,pad=0.01,rounding_size=0.01",
                           facecolor='#022c22', edgecolor='#10b981')
        ax.add_patch(b)
        ax.text(x + 0.10, 0.49, head, ha='center', va='center', fontsize=8, fontweight='bold', color='#6ee7b7')
        ax.text(x + 0.10, 0.43, sub, ha='center', va='center', fontsize=6.5, color='#d1fae5', linespacing=1.2)

    # Layer 3: Presentation Portals
    l3 = FancyBboxPatch((0.05, 0.06), 0.90, 0.25, boxstyle="round,pad=0.015,rounding_size=0.02",
                        facecolor='#ffffff', edgecolor='#cbd5e1', linewidth=1.5)
    ax.add_patch(l3)
    ax.text(0.08, 0.26, "3. MULTI-STAKEHOLDER APPLICATION LAYER (ROLE-BASED ACCESS CONTROL)", fontsize=9, fontweight='bold', color='#0f172a')

    portal_boxes = [
        ("Executive Command Center", "Circle Heatmaps • Anomaly Filter\nRevenue Risk • CSV Exports", '#eff6ff', '#3b82f6'),
        ("Lat Mandal Field Portal", "Mobile PWA • GPS Coordinate Lock\nBoundary Photo & Evidence Audit", '#f0fdf4', '#10b981'),
        ("Citizen Self-Check Portal", "Public Dag/Patta Search • Health Card\nMission Basundhara Correction Link", '#fffbeb', '#f59e0b')
    ]
    for i, (head, sub, bg, bc) in enumerate(portal_boxes):
        x = 0.08 + i * 0.30
        b = FancyBboxPatch((x, 0.09), 0.27, 0.13, boxstyle="round,pad=0.01,rounding_size=0.01",
                           facecolor=bg, edgecolor=bc, linewidth=1.2)
        ax.add_patch(b)
        ax.text(x + 0.135, 0.18, head, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#0f172a')
        ax.text(x + 0.135, 0.13, sub, ha='center', va='center', fontsize=7, color='#475569', linespacing=1.2)

    path = os.path.join(out_dir, "diagram_7_enterprise_system_architecture.png")
    plt.tight_layout()
    plt.savefig(path, dpi=200, bbox_inches='tight')
    plt.close()
    print(f"Created {path}")

if __name__ == '__main__':
    create_diagram_1()
    create_diagram_2()
    create_diagram_3()
    create_diagram_4()
    create_diagram_5()
    create_diagram_6()
    create_diagram_7()
