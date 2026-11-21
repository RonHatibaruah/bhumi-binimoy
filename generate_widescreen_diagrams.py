import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Rectangle, Circle, Polygon
import numpy as np

os.environ['MPLCONFIGDIR'] = '/tmp/matplotlib-cache'
base_dir = os.path.dirname(os.path.abspath(__file__))
out_dir = os.path.join(base_dir, 'assets', 'proposal_images')
os.makedirs(out_dir, exist_ok=True)

# Clean White / Light-Gray Blueprint Grid Palette (Exact Data Centers Master Infographic Style)
BG_LIGHT = '#ffffff'
GRID_LIGHT = '#f1f5f9'
NAVY_HEADER = '#0f172a'
NAVY_TEXT = '#0f172a'
MUTED_TEXT = '#475569'
EMERALD_GREEN = '#059669'
ROYAL_BLUE = '#1d4ed8'
CYAN_ACCENT = '#0284c7'
AMBER_GOLD = '#d97706'
ROSE_RED = '#dc2626'
PURPLE_ACCENT = '#7c3aed'

def add_blueprint_grid(ax):
    for x in np.linspace(0, 1, 25):
        ax.axvline(x, color=GRID_LIGHT, linewidth=0.7, zorder=0)
    for y in np.linspace(0, 1, 15):
        ax.axhline(y, color=GRID_LIGHT, linewidth=0.7, zorder=0)

def add_header(ax, title, subtitle, tag="NESFIC-D-52 TECH FRAMEWORK"):
    # Top banner bar
    banner = FancyBboxPatch((0.03, 0.89), 0.94, 0.08, boxstyle="round,pad=0.01,rounding_size=0.015",
                            facecolor=NAVY_HEADER, edgecolor='#1e293b', linewidth=1.5, zorder=2)
    ax.add_patch(banner)
    
    # Tag badge
    tag_bg = FancyBboxPatch((0.05, 0.915), 0.17, 0.032, boxstyle="round,pad=0.005,rounding_size=0.008",
                            facecolor='#065f46', edgecolor=EMERALD_GREEN, linewidth=1, zorder=3)
    ax.add_patch(tag_bg)
    ax.text(0.135, 0.931, tag, ha='center', va='center', fontsize=7.5, fontweight='bold', color='#6ee7b7', zorder=4)
    
    ax.text(0.24, 0.935, title, fontsize=11, fontweight='bold', color='#ffffff', zorder=4)
    ax.text(0.24, 0.910, subtitle, fontsize=8, color='#38bdf8', zorder=4)
    
    # Right status chip
    gov_badge = FancyBboxPatch((0.80, 0.915), 0.15, 0.032, boxstyle="round,pad=0.005,rounding_size=0.008",
                               facecolor='#1e293b', edgecolor='#334155', linewidth=1, zorder=3)
    ax.add_patch(gov_badge)
    ax.text(0.875, 0.931, "GOVT OF ASSAM • R&DM", ha='center', va='center', fontsize=7, fontweight='bold', color='#e2e8f0', zorder=4)

def save_dual(fig, basename):
    plt.tight_layout()
    png_path = os.path.join(out_dir, f"{basename}.png")
    jpg_path = os.path.join(out_dir, f"{basename}.jpg")
    plt.savefig(png_path, dpi=200, bbox_inches='tight')
    plt.savefig(jpg_path, dpi=200, bbox_inches='tight')
    plt.close()
    print(f"Rendered {basename}.png & .jpg")

# ==============================================================================
# DIAGRAM 1: 16:9 Widescreen Paradigm Shift Transformation Framework
# ==============================================================================
def create_widescreen_diagram_1():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_LIGHT)
    fig.patch.set_facecolor(BG_LIGHT)
    ax.axis('off')
    add_blueprint_grid(ax)

    add_header(ax, "PARADIGM SHIFT: TRANSFORMATION FROM BROKER INTERMEDIARIES TO GOVERNMENT-VERIFIED EXCHANGE",
               "Assam Land Exchange (BhumiBinimoy) Cadastral Marketplace & Assisted Conveyancing Architecture",
               "PARADIGM SHIFT FRAMEWORK")

    # LEFT COLUMN: Reactive Legacy Baseline
    box_left = FancyBboxPatch((0.03, 0.08), 0.45, 0.77, boxstyle="round,pad=0.015,rounding_size=0.02",
                              facecolor='#fff1f2', edgecolor='#fda4af', linewidth=1.5, zorder=2)
    ax.add_patch(box_left)
    ax.text(0.255, 0.81, "TRADITIONAL LAND MARKETPLACE (BROKER-DRIVEN)", ha='center', fontsize=11, fontweight='bold', color='#9f1239', zorder=3)
    ax.text(0.255, 0.775, "Severe Information Asymmetry, Speculative Markups & 5-10% Broker Cuts", ha='center', fontsize=8, color='#881337', zorder=3)

    left_cards = [
        ("STAGE 1 • OPAQUE DISCOVERY & INFORMAL BROKERS", "Unverified classified ads, roadside signs, & street brokers. Buyers depend on\nself-reported seller claims with zero statutory cross-checks.", '#ffe4e6', '#f43f5e'),
        ("STAGE 2 • FRAGMENTED MANUAL DUE DILIGENCE", "Buyers hire advocates for 30-90 days to physically retrieve paper Jamabandis,\nsearch Sub-Registrar books, & consult Lat Mandals informally.", '#ffe4e6', '#f43f5e'),
        ("STAGE 3 • SPECULATIVE VALUATION & EXTORTIONATE FEES", "Brokers artificially inflate land prices (+30% to +50% markup) and deduct 5% to 10%\ncommissions, fueling cash under-reporting and stamp duty loss.", '#fecdd3', '#e11d48'),
        ("STAGE 4 • SUDDEN NOC HALTS & CIVIL LITIGATION", "Hidden defects (Dag overlaps, unpartitioned co-sharer heirs, Chapter X tribal\nviolations) trigger surprise transaction freezes at Circle Office.", '#fda4af', '#be123c')
    ]

    for idx, (head, desc, bg, border) in enumerate(left_cards):
        y = 0.65 - idx * 0.17
        card = FancyBboxPatch((0.05, y - 0.04), 0.41, 0.13, boxstyle="round,pad=0.01,rounding_size=0.015",
                              facecolor=bg, edgecolor=border, linewidth=1.2, zorder=3)
        ax.add_patch(card)
        ax.text(0.07, y + 0.045, head, fontsize=8.5, fontweight='bold', color='#881337', zorder=4)
        ax.text(0.07, y - 0.010, desc, fontsize=8, color='#4c0519', linespacing=1.2, zorder=4)

    # RIGHT COLUMN: BhumiBinimoy Government-Verified Exchange
    box_right = FancyBboxPatch((0.52, 0.08), 0.45, 0.77, boxstyle="round,pad=0.015,rounding_size=0.02",
                               facecolor='#f0fdf4', edgecolor='#86efac', linewidth=2.0, zorder=2)
    ax.add_patch(box_right)
    ax.text(0.745, 0.81, "BHUMIBINIMOY (ASSAM LAND EXCHANGE)", ha='center', fontsize=11, fontweight='bold', color='#14532d', zorder=3)
    ax.text(0.745, 0.775, "Government-Facilitated Cadastral Map Discovery, Zonal Pricing & Assisted Conveyancing", ha='center', fontsize=8, color='#15803d', zorder=3)

    right_cards = [
        ("STAGE 1 • CADASTRAL MAP DISCOVERY & VOLUNTARY LISTING", "Lawful Pattadars voluntarily list parcels on Assam's official vector cadastral\nmap with authenticated boundaries & strict separation of seller vs Govt data.", '#dcfce7', '#22c55e'),
        ("STAGE 2 • INSTANT 8-POINT STATUTORY DUE DILIGENCE", "Algorithmic audit of tenure alienability, area variance, co-sharer shares,\ne-Khajana tax clearance, bank liens, and Chapter X tribal safeguards.", '#dcfce7', '#22c55e'),
        ("STAGE 3 • TRANSPARENT PRICE DISCOVERY & 0% BROKER CUT", "Real-time benchmarking against official Circle Zonal Valuation ($/Bigha).\nTransparent stamp duty schedule. Zero broker commissions.", '#bbf7d0', '#16a34a'),
        ("STAGE 4 • ASSISTED STATUTORY PIPELINE & AUTO-MUTATION", "Pre-filled Land Sale NOC to Circle Officer, biometric e-Panjeeyan booking,\nand straight-through Mission Basundhara 3.0 mutation in 72 hours.", '#86efac', '#15803d')
    ]

    for idx, (head, desc, bg, border) in enumerate(right_cards):
        y = 0.65 - idx * 0.17
        card = FancyBboxPatch((0.54, y - 0.04), 0.41, 0.13, boxstyle="round,pad=0.01,rounding_size=0.015",
                              facecolor=bg, edgecolor=border, linewidth=1.2, zorder=3)
        ax.add_patch(card)
        ax.text(0.56, y + 0.045, head, fontsize=8.5, fontweight='bold', color='#065f46', zorder=4)
        ax.text(0.56, y - 0.010, desc, fontsize=8, color='#064e3b', linespacing=1.2, zorder=4)

    save_dual(fig, "diagram_1_before_after_workflow")

# ==============================================================================
# DIAGRAM 2: 16:9 Dual-Core Synchronous Integration Engine
# ==============================================================================
def create_widescreen_diagram_2():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_LIGHT)
    fig.patch.set_facecolor(BG_LIGHT)
    ax.axis('off')
    add_blueprint_grid(ax)

    add_header(ax, "INTEGRATED DATA ECOSYSTEM: 5 REVENUE PILLARS FEDERATION ENGINE",
               "Dharitree (RoR), Bhudakshya (GIS), e-Panjeeyan (Deeds), Zonal DB & e-Khajana Interoperability",
               "FEDERATED GOVTECH ARCHITECTURE")

    # Left: Dharitree System
    b_left = FancyBboxPatch((0.03, 0.10), 0.28, 0.74, boxstyle="round,pad=0.015,rounding_size=0.02",
                            facecolor='#eff6ff', edgecolor='#93c5fd', linewidth=1.8, zorder=2)
    ax.add_patch(b_left)
    ax.text(0.17, 0.79, "DHARITREE REVENUE CORE", ha='center', fontsize=11, fontweight='bold', color='#1d4ed8', zorder=3)
    ax.text(0.17, 0.76, "Textual RoR & Jamabandi Records", ha='center', fontsize=8, color=MUTED_TEXT, zorder=3)

    d_items = [
        ("Dag & Patta Identity", "Alphanumeric parcel tokens (Periodic / Khiraj Myadi)"),
        ("Jamabandi Recorded Area", "Assam vernacular: Bigha - Katha - Lesa (BKL)"),
        ("Tenure Share Registry", "Co-sharer Pattadar fractional ownership percentages"),
        ("Land Classification", "Basti (Residential), Sali (Paddy), Byabasayik (Comm)"),
        ("Touzi Revenue Demands", "Annual land tax assessment, cess, & arrears balance"),
        ("Historical Encumbrances", "Bank hypothecations, mortgage tokens, court stays")
    ]
    for i, (head, sub) in enumerate(d_items):
        y = 0.69 - i * 0.095
        card = FancyBboxPatch((0.045, y - 0.025), 0.25, 0.075, boxstyle="round,pad=0.005,rounding_size=0.01",
                              facecolor='#ffffff', edgecolor='#bfdbfe', linewidth=1, zorder=3)
        ax.add_patch(card)
        ax.text(0.06, y + 0.018, head, fontsize=8, fontweight='bold', color='#1e40af', zorder=4)
        ax.text(0.06, y - 0.012, sub, fontsize=7, color='#475569', zorder=4)

    # Center: BhumiBinimoy Core Reconciliation Pipeline
    b_center = FancyBboxPatch((0.35, 0.06), 0.30, 0.81, boxstyle="round,pad=0.015,rounding_size=0.02",
                             facecolor='#f0fdf4', edgecolor=EMERALD_GREEN, linewidth=2.5, zorder=2)
    ax.add_patch(b_center)
    ax.text(0.50, 0.82, "BHUMIBINIMOY FEDERATION CORE", ha='center', fontsize=12, fontweight='bold', color='#065f46', zorder=3)
    ax.text(0.50, 0.79, "Cadastral Marketplace Engine & 8-Point Due-Diligence", ha='center', fontsize=8, color='#047857', zorder=3)

    reconcile_items = [
        ("1. BKL Unit Normalization Engine", "1 Bigha = 5 Katha = 100 Lesa ≈ 1337.8038 sq.m"),
        ("2. Spatial-Textual Variance Audit", "|GIS Area - Jamabandi Area| <= 5% statutory threshold"),
        ("3. Zonal Value Benchmarking", "Circle Rate comparison & Fair Value Index calculation"),
        ("4. Strict Separation of Truth", "Immutable Govt particulars vs Self-reported seller claims"),
        ("5. Chapter X Tribal Belt Verification", "Transferor & Transferee class eligibility validation"),
        ("6. Assisted Conveyancing Orchestrator", "EOI ➔ Escrow ➔ Sale NOC ➔ e-Panjeeyan ➔ Basundhara")
    ]
    for i, (title, detail) in enumerate(reconcile_items):
        y = 0.72 - i * 0.105
        box = FancyBboxPatch((0.365, y - 0.035), 0.27, 0.085, boxstyle="round,pad=0.005,rounding_size=0.01",
                             facecolor='#ffffff', edgecolor='#86efac', linewidth=1.2, zorder=3)
        ax.add_patch(box)
        ax.text(0.38, y + 0.015, title, fontsize=8, fontweight='bold', color='#065f46', zorder=4)
        ax.text(0.38, y - 0.018, detail, fontsize=7, color='#14532d', zorder=4)

    # Right: Bhudakshya Cadastral WebGIS
    b_right = FancyBboxPatch((0.69, 0.10), 0.28, 0.74, boxstyle="round,pad=0.015,rounding_size=0.02",
                             facecolor='#faf5ff', edgecolor='#d8b4fe', linewidth=1.8, zorder=2)
    ax.add_patch(b_right)
    ax.text(0.83, 0.79, "BHUDAKSHYA & e-PANJEEYAN", ha='center', fontsize=11, fontweight='bold', color='#6b21a8', zorder=3)
    ax.text(0.83, 0.76, "Spatial Vector GIS & Registration Registry", ha='center', fontsize=8, color=MUTED_TEXT, zorder=3)

    b_items = [
        ("Cadastral Vector Polygons", "Georeferenced Dag boundary rings (EPSG:32646)"),
        ("Polygon Area Derivation", "Sub-meter planar polygon surface calculations"),
        ("Boundary Topology & Snapping", "Overlap detection (ST_Overlaps) & sliver checks"),
        ("e-Panjeeyan Registered Deeds", "Sub-Registrar encumbrance certificate ledger"),
        ("Zonal Rate Gazette DB", "Kamrup Metro official Circle Valuation schedules"),
        ("e-Khajana GRAS Payment Sync", "Real-time payment verification & receipt hashing")
    ]
    for i, (head, sub) in enumerate(b_items):
        y = 0.69 - i * 0.095
        card = FancyBboxPatch((0.705, y - 0.025), 0.25, 0.075, boxstyle="round,pad=0.005,rounding_size=0.01",
                              facecolor='#ffffff', edgecolor='#e9d5ff', linewidth=1, zorder=3)
        ax.add_patch(card)
        ax.text(0.72, y + 0.018, head, fontsize=8, fontweight='bold', color='#581c87', zorder=4)
        ax.text(0.72, y - 0.012, sub, fontsize=7, color='#475569', zorder=4)

    save_dual(fig, "diagram_2_dual_system_reconciliation")

# ==============================================================================
# DIAGRAM 3: Assisted Conveyancing State Machine (5-Stage Lifecycle)
# ==============================================================================
def create_widescreen_diagram_3():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_LIGHT)
    fig.patch.set_facecolor(BG_LIGHT)
    ax.axis('off')
    add_blueprint_grid(ax)

    add_header(ax, "ASSISTED CONVEYANCING STATE MACHINE: 5-STAGE TRANSACTION PIPELINE",
               "Deterministic Milestone Workflow from Voluntary Listing to Automated Mission Basundhara Mutation",
               "CONVEYANCING STATE MACHINE")

    stages = [
        ("STAGE 1\nVOLUNTARY LISTING", "Lawful Pattadar e-KYC\nDag & Patta auto-lookup\nVoluntary consent signed\n8-Point Title Audit", 0.03, '#ecfdf5', '#10b981', '#065f46'),
        ("STAGE 2\nPRICE DISCOVERY", "Cadastral map discovery\nZonal Value comparison\nBuyer EOI submitted\nMutual price agreed", 0.23, '#f0fdf4', '#22c55e', '#15803d'),
        ("STAGE 3\nESCROW TOKEN", "Milestone earnest deposit\nState-facilitated escrow\nZero private broker fee\nSale agreement signed", 0.43, '#eff6ff', '#3b82f6', '#1d4ed8'),
        ("STAGE 4\nCIRCLE SALE NOC", "Pre-filled NOC application\nDispur Circle Officer\n30-day objection window\nMandals survey cleared", 0.63, '#faf5ff', '#a855f7', '#6b21a8'),
        ("STAGE 5\nDEED & MUTATION", "e-Panjeeyan biometric slot\nStamp duty paid via GRAS\nDeed registered at SRO\nBasundhara auto-mutated", 0.83, '#fff7ed', '#f97316', '#c2410c')
    ]

    for title, desc, x, bg, stroke, text_color in stages:
        box = FancyBboxPatch((x, 0.20), 0.14, 0.62, boxstyle="round,pad=0.015,rounding_size=0.02", 
                             facecolor=bg, edgecolor=stroke, linewidth=2, zorder=2)
        ax.add_patch(box)
        ax.text(x + 0.07, 0.74, title, ha='center', va='center', fontsize=9.5, fontweight='bold', color=text_color, zorder=3)
        ax.text(x + 0.07, 0.45, desc, ha='center', va='center', fontsize=8, color='#334155', linespacing=1.3, zorder=3)

    for idx in range(4):
        ax.annotate('', xy=(0.20 + idx * 0.20, 0.51), xytext=(0.17 + idx * 0.20, 0.51),
                    arrowprops=dict(facecolor=EMERALD_GREEN, edgecolor=EMERALD_GREEN, width=2.5, headwidth=8), zorder=4)

    summary_box = FancyBboxPatch((0.03, 0.05), 0.94, 0.11, boxstyle="round,pad=0.01,rounding_size=0.015",
                                 facecolor='#0f172a', edgecolor='#1e293b', linewidth=1, zorder=2)
    ax.add_patch(summary_box)
    ax.text(0.5, 0.105, "OPERATIONAL OUTCOME: Transaction cycle compressed from 180 days to <30 days. Citizen saves 5%-10% in avoided broker commissions. Zero post-sale litigation.",
            ha='center', va='center', fontsize=9, fontweight='bold', color='#34d399', zorder=3)

    save_dual(fig, "diagram_3_cadastral_anomaly_catalog")

# ==============================================================================
# DIAGRAM 4: 8-Point Due-Diligence Ledger & Title Clearance Badge Hierarchy
# ==============================================================================
def create_widescreen_diagram_4():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_LIGHT)
    fig.patch.set_facecolor(BG_LIGHT)
    ax.axis('off')
    add_blueprint_grid(ax)

    add_header(ax, "8-POINT STATUTORY DUE-DILIGENCE & VERIFICATION BADGE HIERARCHY",
               "Deterministic Statutory Title Auditing under Assam Land and Revenue Regulation (ALRR) 1886",
               "DUE-DILIGENCE ENGINE")

    checks = [
        ("CHK-01: Patta Tenure Classification", "Periodic Patta (Khiraj Myadi) alienability confirmed. Annual Patta flagged.", "20 Pts", '#dcfce7', '#059669'),
        ("CHK-02: Spatial-Textual Area Variance", "|Bhudakshya GIS Area - Jamabandi Area| <= 5% statutory threshold.", "15 Pts", '#dcfce7', '#059669'),
        ("CHK-03: Co-Sharer Partition Balance", "Sum of fractional Pattadar shares exactly equals 100.0%.", "15 Pts", '#dcfce7', '#059669'),
        ("CHK-04: e-Khajana Revenue Clearance", "Annual Touzi demand fully settled; zero municipal or land revenue arrears.", "10 Pts", '#dcfce7', '#059669'),
        ("CHK-05: Encumbrance & Mortgage Search", "Sub-Registrar e-Panjeeyan books indicate zero active bank charges or liens.", "15 Pts", '#dcfce7', '#059669'),
        ("CHK-06: Revenue Court Litigation Check", "Zero active civil injunctions, stay orders, or title dispute notices.", "10 Pts", '#dcfce7', '#059669'),
        ("CHK-07: Chapter X Tribal Belt Filter", "Transfer compliance with protected class restrictions in Tribal Belts/Blocks.", "10 Pts", '#fef3c7', '#d97706'),
        ("CHK-08: Ecological & Public Reserve Buffer", "Zero overlap with Village Grazing Reserves (VGR), PGR, or wetlands.", "5 Pts", '#dcfce7', '#059669')
    ]

    for idx, (title, desc, pts, bg, stroke) in enumerate(checks):
        col = idx % 2
        row = idx // 2
        x = 0.04 + col * 0.48
        y = 0.69 - row * 0.155

        box = FancyBboxPatch((x, y - 0.05), 0.44, 0.125, boxstyle="round,pad=0.015,rounding_size=0.02",
                             facecolor=bg, edgecolor=stroke, linewidth=1.5, zorder=2)
        ax.add_patch(box)
        ax.text(x + 0.02, y + 0.035, title, fontsize=9, fontweight='bold', color='#0f172a', zorder=3)
        ax.text(x + 0.02, y - 0.02, desc, fontsize=8, color='#334155', zorder=3)
        ax.text(x + 0.42, y + 0.035, pts, fontsize=8.5, fontweight='bold', color=stroke, ha='right', zorder=3)

    badges = [
        ("GOLD VERIFIED", "Score 90-100: Clean Title", '#065f46', '#34d399'),
        ("SILVER VERIFIED", "Score 75-89: Minor Dues", '#0e7490', '#22d3ee'),
        ("CONDITIONAL", "Score 50-74: Co-Sharer Action", '#b45309', '#fde047'),
        ("RESTRICTED", "Score <50: Tribal/Court Block", '#be123c', '#fda4af')
    ]
    for idx, (badge, sub, bg, text_c) in enumerate(badges):
        x = 0.04 + idx * 0.24
        box = FancyBboxPatch((x, 0.05), 0.21, 0.11, boxstyle="round,pad=0.01,rounding_size=0.015",
                             facecolor=bg, edgecolor=text_c, linewidth=1.5, zorder=2)
        ax.add_patch(box)
        ax.text(x + 0.105, 0.115, badge, ha='center', va='center', fontsize=9, fontweight='bold', color=text_c, zorder=3)
        ax.text(x + 0.105, 0.08, sub, ha='center', va='center', fontsize=7.5, color='#f1f5f9', zorder=3)

    save_dual(fig, "diagram_4_land_health_score_hierarchy")

# ==============================================================================
# DIAGRAM 5: Transparent Price Discovery & Zonal Value Benchmarking
# ==============================================================================
def create_widescreen_diagram_5():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_LIGHT)
    fig.patch.set_facecolor(BG_LIGHT)
    ax.axis('off')
    add_blueprint_grid(ax)

    add_header(ax, "TRANSPARENT PRICE DISCOVERY: ZONAL VALUE BENCHMARKING ENGINE",
               "Eliminating Asymmetric Speculation with Statutorily Grounded Fair Market Value Indices",
               "PRICE DISCOVERY ENGINE")

    cols = [
        ("OFFICIAL ZONAL VALUE (FLOOR)", "Kamrup Metro Gazette Rate", "Rs. 85,00,000 / Bigha\n(Dispur Basti Rate)\n\n• Minimum registration threshold\n• Gazette gazetted valuation\n• Non-negotiable tax floor\n• Statutorily mandated benchmark", 0.05, '#eff6ff', '#3b82f6', '#1d4ed8'),
        ("SELLER VOLUNTARY ASKING PRICE", "Lawful Pattadar Request", "Rs. 96,66,667 / Bigha\n(+13.7% over Zonal Rate)\n\n• Premium for 30ft PWD road frontage\n• Elevated non-waterlogging plot\n• Ready municipal water pipeline\n• Fair Market Value Assessment", 0.38, '#f0fdf4', '#10b981', '#047857'),
        ("SPECULATIVE BROKER QUOTE", "Traditional Middleman Quote", "Rs. 1,30,00,000+ / Bigha\n(+53% Artificial Markup)\n\n• Hidden 5%-10% broker margin\n• Speculative artificial escalation\n• Disjointed cash components\n• Protracted price opacity", 0.71, '#fff1f2', '#ef4444', '#be123c')
    ]

    for title, sub, bullets, x, bg, stroke, text_color in cols:
        box = FancyBboxPatch((x, 0.25), 0.24, 0.58, boxstyle="round,pad=0.015,rounding_size=0.025",
                             facecolor=bg, edgecolor=stroke, linewidth=2, zorder=2)
        ax.add_patch(box)
        ax.text(x + 0.12, 0.77, title, ha='center', va='center', fontsize=9, fontweight='bold', color=text_color, zorder=3)
        ax.text(x + 0.12, 0.73, sub, ha='center', va='center', fontsize=7.5, color=MUTED_TEXT, zorder=3)
        ax.text(x + 0.02, 0.50, bullets, ha='left', va='center', fontsize=8, color='#1e293b', linespacing=1.3, zorder=3)

    sched_box = FancyBboxPatch((0.05, 0.06), 0.90, 0.14, boxstyle="round,pad=0.01,rounding_size=0.015",
                               facecolor='#0f172a', edgecolor='#1e293b', linewidth=1, zorder=2)
    ax.add_patch(sched_box)
    ax.text(0.5, 0.15, "TRANSPARENT STATUTORY ACQUISITION CHARGES SCHEDULE (DISPUR 1.5 BIGHA CASE)",
            ha='center', va='center', fontsize=9, fontweight='bold', color='#38bdf8', zorder=3)
    ax.text(0.5, 0.095, "Agreed Price: Rs. 1.45 Cr  |  Assam Stamp Duty (6%): Rs. 8.70 Lakh  |  Registration (2%): Rs. 2.90 Lakh  |  Govt Facilitation (0.25%): Rs. 36,250  |  Broker Cut: Rs. 0 (Saved Rs. 7.25 Lakh)",
            ha='center', va='center', fontsize=8, color='#f1f5f9', zorder=3)

    save_dual(fig, "diagram_5_lat_mandal_mobile_app")

# ==============================================================================
# DIAGRAM 6: Dispur Circle Pilot & Enterprise Cloud Architecture
# ==============================================================================
def create_widescreen_diagram_6():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_LIGHT)
    fig.patch.set_facecolor(BG_LIGHT)
    ax.axis('off')
    add_blueprint_grid(ax)

    add_header(ax, "DISPUR REVENUE CIRCLE PILOT & ASDC ENTERPRISE CLOUD ARCHITECTURE",
               "Tier-III ASDC Zero-Trust Hosting, NIC e-Pramaan OAuth2, PostGIS 3.4 & Leaflet Cadastral Tile Engine",
               "ENTERPRISE CLOUD ARCHITECTURE")

    layers = [
        ("LAYER 1: PRESENTATION & USER CHANNELS", "WebGIS Cadastral Map (Leaflet / MapLibre)  •  Buyer Deal Room  •  Seller Voluntary e-KYC Portal  •  Dept Console", 0.72, '#f8fafc', '#94a3b8'),
        ("LAYER 2: API GATEWAY & SECURITY PERIMETER", "NIC e-Pramaan OAuth2 / Jan Parichay  •  TLS 1.3  •  WAF  •  Role-Based Access Control (RBAC)  •  SHA-256 Ledger", 0.54, '#f0fdf4', '#22c55e'),
        ("LAYER 3: CORE MICROSERVICES ENGINE", "Marketplace Tile Server  •  8-Point Due-Diligence Engine  •  Zonal Value Benchmark  •  Assisted Workflow State Machine", 0.36, '#eff6ff', '#3b82f6'),
        ("LAYER 4: FEDERATED GOVERNMENT INTEGRATION", "Dharitree Read-Only View  •  Bhudakshya WFS/WMS  •  e-Panjeeyan SRO Connect  •  e-Khajana GRAS  •  Basundhara API", 0.18, '#faf5ff', '#c084fc'),
        ("LAYER 5: DATA PERSISTENCE & STORAGE", "PostgreSQL 16 + PostGIS (Cadastral Polygons)  •  Redis 7.2 Spatial Cache  •  Encrypted Audit Trail  •  ASDC Tier-III SAN", 0.02, '#0f172a', '#334155')
    ]

    for title, desc, y, bg, stroke in layers:
        box = FancyBboxPatch((0.05, y), 0.90, 0.13, boxstyle="round,pad=0.015,rounding_size=0.02",
                             facecolor=bg, edgecolor=stroke, linewidth=1.5, zorder=2)
        ax.add_patch(box)
        text_color = '#ffffff' if bg == '#0f172a' else '#0f172a'
        sub_color = '#94a3b8' if bg == '#0f172a' else '#475569'
        ax.text(0.5, y + 0.085, title, ha='center', va='center', fontsize=9.5, fontweight='bold', color=text_color, zorder=3)
        ax.text(0.5, y + 0.04, desc, ha='center', va='center', fontsize=8, color=sub_color, zorder=3)

    save_dual(fig, "diagram_6_citizen_land_health_certificate")

# ==============================================================================
# DIAGRAM 7: Economic Sustainability & State Facilitation Revenue Model
# ==============================================================================
def create_widescreen_diagram_7():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_LIGHT)
    fig.patch.set_facecolor(BG_LIGHT)
    ax.axis('off')
    add_blueprint_grid(ax)

    add_header(ax, "ECONOMIC SUSTAINABILITY & STATE FACILITATION REVENUE PROJECTION MODEL",
               "Transforming Land Governance into a Self-Funding Revenue Driver for the Government of Assam",
               "ECONOMIC IMPACT & REVENUE MODEL")

    tiers = [
        ("PHASE 1: DISPUR PILOT", "1,500 Facilitated Trades", "Target Revenue: Rs. 7.50 Cr\nCitizen Broker Savings: Rs. 15.0 Cr\nTurnaround: <30 Days\nDispute Rate: 0.0%", 0.06, '#f0fdf4', '#22c55e', '#15803d'),
        ("PHASE 2: KAMRUP METRO", "6,000 Facilitated Trades", "Target Revenue: Rs. 15.00 Cr / yr\nCitizen Broker Savings: Rs. 60.0 Cr\nSelf-funds ASDC GIS Ops\nDistrict-wide SRO sync", 0.38, '#eff6ff', '#3b82f6', '#1e40af'),
        ("PHASE 3: STATEWIDE ASSAM", "35 Districts Expansion", "Target Revenue: Rs. 45.00+ Cr / yr\nCitizen Broker Savings: Rs. 200+ Cr\nPermanent State Revenue\nCatalyst for Viksit Assam", 0.70, '#faf5ff', '#a855f7', '#6b21a8')
    ]

    for title, sub, bullets, x, bg, stroke, text_color in tiers:
        box = FancyBboxPatch((x, 0.28), 0.24, 0.54, boxstyle="round,pad=0.015,rounding_size=0.025",
                             facecolor=bg, edgecolor=stroke, linewidth=2, zorder=2)
        ax.add_patch(box)
        ax.text(x + 0.12, 0.74, title, ha='center', va='center', fontsize=9.5, fontweight='bold', color=text_color, zorder=3)
        ax.text(x + 0.12, 0.69, sub, ha='center', va='center', fontsize=7.5, color=MUTED_TEXT, zorder=3)
        ax.text(x + 0.02, 0.48, bullets, ha='left', va='center', fontsize=8.5, color='#1e293b', linespacing=1.4, zorder=3)

    callout = FancyBboxPatch((0.06, 0.06), 0.88, 0.16, boxstyle="round,pad=0.01,rounding_size=0.015",
                             facecolor='#0f172a', edgecolor='#1e293b', linewidth=1, zorder=2)
    ax.add_patch(callout)
    ax.text(0.5, 0.17, "WIN-WIN PUBLIC VALUE PROPOSITION:", ha='center', va='center', fontsize=9.5, fontweight='bold', color='#34d399', zorder=3)
    ax.text(0.5, 0.11, "Citizens gain 100% verified legal security and save 5%-10% in private commissions.\nThe Government of Assam secures a dedicated, legitimate non-tax facilitation revenue stream of Rs. 15Cr - Rs. 45Cr annually.",
            ha='center', va='center', fontsize=8, color='#f1f5f9', linespacing=1.3, zorder=3)

    save_dual(fig, "diagram_7_enterprise_system_architecture")

if __name__ == '__main__':
    create_widescreen_diagram_1()
    create_widescreen_diagram_2()
    create_widescreen_diagram_3()
    create_widescreen_diagram_4()
    create_widescreen_diagram_5()
    create_widescreen_diagram_6()
    create_widescreen_diagram_7()
    print("All 16:9 widescreen technological framework infographic images generated successfully!")
