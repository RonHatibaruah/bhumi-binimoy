import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Rectangle, Circle, Polygon, PathPatch
import numpy as np

os.environ['MPLCONFIGDIR'] = '/tmp/matplotlib-cache'
base_dir = os.path.dirname(os.path.abspath(__file__))
out_dir = os.path.join(base_dir, 'assets', 'proposal_images')
os.makedirs(out_dir, exist_ok=True)

# Common High-Tech Widescreen Palette (Data Center / Dark Cyber GovTech Infographic Style)
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

def add_header(ax, title, subtitle, tag="NESFIC-D-52 TECH FRAMEWORK"):
    # Top banner bar
    banner = FancyBboxPatch((0.03, 0.89), 0.94, 0.08, boxstyle="round,pad=0.01,rounding_size=0.015",
                            facecolor='#111c35', edgecolor='#1e293b', linewidth=1.5)
    ax.add_patch(banner)
    
    # Tag badge
    tag_bg = FancyBboxPatch((0.05, 0.915), 0.18, 0.032, boxstyle="round,pad=0.005,rounding_size=0.008",
                            facecolor='#065f46', edgecolor='#10b981', linewidth=1)
    ax.add_patch(tag_bg)
    ax.text(0.14, 0.931, tag, ha='center', va='center', fontsize=7.5, fontweight='bold', color='#6ee7b7')
    
    ax.text(0.25, 0.935, title, fontsize=11, fontweight='bold', color=TEXT_WHITE)
    ax.text(0.25, 0.910, subtitle, fontsize=8, color=CYAN_ACCENT)
    
    # Right status chip
    gov_badge = FancyBboxPatch((0.79, 0.915), 0.16, 0.032, boxstyle="round,pad=0.005,rounding_size=0.008",
                               facecolor='#1e293b', edgecolor='#334155', linewidth=1)
    ax.add_patch(gov_badge)
    ax.text(0.87, 0.931, "GOVT OF ASSAM • R&DM", ha='center', va='center', fontsize=7, fontweight='bold', color='#e2e8f0')

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
    ax.set_facecolor(BG_DARK)
    fig.patch.set_facecolor(BG_DARK)
    ax.axis('off')

    add_header(ax, "PARADIGM SHIFT: TRANSFORMATION FROM BROKER INTERMEDIARIES TO GOVERNMENT-VERIFIED EXCHANGE",
               "Assam Land Exchange (BhumiBinimoy) Cadastral Marketplace & Assisted Conveyancing Architecture",
               "PARADIGM SHIFT FRAMEWORK")

    # LEFT COLUMN: Reactive Legacy Baseline
    box_left = FancyBboxPatch((0.03, 0.08), 0.45, 0.77, boxstyle="round,pad=0.015,rounding_size=0.02",
                              facecolor='#1c1917', edgecolor='#ef4444', linewidth=1.5)
    ax.add_patch(box_left)
    ax.text(0.255, 0.81, "TRADITIONAL LAND MARKETPLACE (BROKER-DRIVEN)", ha='center', fontsize=11, fontweight='bold', color='#fca5a5')
    ax.text(0.255, 0.775, "Severe Information Asymmetry, Speculative Markups & 5-10% Broker Cuts", ha='center', fontsize=8, color=TEXT_MUTED)

    left_cards = [
        ("STAGE 1 • OPAQUE DISCOVERY & INFORMAL BROKERS", "Unverified classified ads, roadside signs, & street brokers. Buyers depend on\nself-reported seller claims with zero statutory cross-checks.", '#291b1b', '#7f1d1d'),
        ("STAGE 2 • FRAGMENTED MANUAL DUE DILIGENCE", "Buyers hire advocates for 30-90 days to physically retrieve paper Jamabandis,\nsearch Sub-Registrar books, & consult Lat Mandals informally.", '#331717', '#991b1b'),
        ("STAGE 3 • SPECULATIVE VALUATION & EXTORTIONATE FEES", "Brokers artificially inflate land prices (+30% to +50% markup) and deduct 5% to 10%\ncommissions, fueling cash under-reporting and stamp duty loss.", '#450a0a', '#b91c1c'),
        ("STAGE 4 • SUDDEN NOC HALTS & CIVIL LITIGATION", "Hidden defects (Dag overlaps, unpartitioned co-sharer heirs, Chapter X tribal\nviolations) trigger surprise transaction freezes at Circle Office.", '#570808', '#dc2626')
    ]

    for idx, (head, desc, bg, border) in enumerate(left_cards):
        y = 0.65 - idx * 0.17
        card = FancyBboxPatch((0.05, y - 0.04), 0.41, 0.13, boxstyle="round,pad=0.01,rounding_size=0.015",
                              facecolor=bg, edgecolor=border, linewidth=1.2)
        ax.add_patch(card)
        ax.text(0.07, y + 0.045, head, fontsize=8.5, fontweight='bold', color='#f87171')
        ax.text(0.07, y - 0.010, desc, fontsize=8, color='#e2e8f0', linespacing=1.2)

    # RIGHT COLUMN: BhumiBinimoy Government-Verified Exchange
    box_right = FancyBboxPatch((0.52, 0.08), 0.45, 0.77, boxstyle="round,pad=0.015,rounding_size=0.02",
                               facecolor='#06201b', edgecolor=EMERALD_ACCENT, linewidth=2.0)
    ax.add_patch(box_right)
    ax.text(0.745, 0.81, "BHUMIBINIMOY (ASSAM LAND EXCHANGE)", ha='center', fontsize=11, fontweight='bold', color='#6ee7b7')
    ax.text(0.745, 0.775, "Government-Facilitated Cadastral Map Discovery, Zonal Pricing & Assisted Conveyancing", ha='center', fontsize=8, color=CYAN_ACCENT)

    right_cards = [
        ("STAGE 1 • CADASTRAL MAP DISCOVERY & VOLUNTARY LISTING", "Lawful Pattadars voluntarily list parcels on Assam's official vector cadastral\nmap with authenticated boundaries & strict separation of seller vs Govt data.", '#063328', '#047857'),
        ("STAGE 2 • INSTANT 8-POINT STATUTORY DUE DILIGENCE", "Algorithmic audit of tenure alienability, area variance, co-sharer shares,\ne-Khajana tax clearance, bank liens, and Chapter X tribal safeguards.", '#073e31', '#059669'),
        ("STAGE 3 • TRANSPARENT PRICE DISCOVERY & 0% BROKER CUT", "Real-time benchmarking against official Circle Zonal Valuation ($/Bigha).\nTransparent stamp duty schedule. Zero broker commissions.", '#0b4a3c', '#10b981'),
        ("STAGE 4 • ASSISTED STATUTORY PIPELINE & AUTO-MUTATION", "Pre-filled Land Sale NOC to Circle Officer, biometric e-Panjeeyan booking,\nand straight-through Mission Basundhara 3.0 mutation in 72 hours.", '#064e3b', '#34d399')
    ]

    for idx, (head, desc, bg, border) in enumerate(right_cards):
        y = 0.65 - idx * 0.17
        card = FancyBboxPatch((0.54, y - 0.04), 0.41, 0.13, boxstyle="round,pad=0.01,rounding_size=0.015",
                              facecolor=bg, edgecolor=border, linewidth=1.2)
        ax.add_patch(card)
        ax.text(0.56, y + 0.045, head, fontsize=8.5, fontweight='bold', color='#6ee7b7')
        ax.text(0.56, y - 0.010, desc, fontsize=8, color='#f1f5f9', linespacing=1.2)

    save_dual(fig, "diagram_1_before_after_workflow")

# ==============================================================================
# DIAGRAM 2: 16:9 Dual-Core Synchronous Integration Engine
# ==============================================================================
def create_widescreen_diagram_2():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_DARK)
    fig.patch.set_facecolor(BG_DARK)
    ax.axis('off')

    add_header(ax, "INTEGRATED DATA ECOSYSTEM: 5 REVENUE PILLARS FEDERATION ENGINE",
               "Dharitree (RoR), Bhudakshya (GIS), e-Panjeeyan (Deeds), Zonal DB & e-Khajana Interoperability",
               "FEDERATED GOVTECH ARCHITECTURE")

    # Left: Dharitree System
    b_left = FancyBboxPatch((0.03, 0.10), 0.28, 0.74, boxstyle="round,pad=0.015,rounding_size=0.02",
                            facecolor=CARD_BG, edgecolor='#0284c7', linewidth=1.8)
    ax.add_patch(b_left)
    ax.text(0.17, 0.79, "DHARITREE REVENUE CORE", ha='center', fontsize=11, fontweight='bold', color='#38bdf8')
    ax.text(0.17, 0.76, "Textual RoR & Jamabandi Records", ha='center', fontsize=8, color=TEXT_MUTED)

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
                              facecolor='#162544', edgecolor='#1e3a8a', linewidth=1)
        ax.add_patch(card)
        ax.text(0.06, y + 0.018, head, fontsize=8, fontweight='bold', color='#bae6fd')
        ax.text(0.06, y - 0.012, sub, fontsize=7, color='#94a3b8')

    # Center: BhumiBinimoy Core Reconciliation Pipeline
    b_center = FancyBboxPatch((0.35, 0.06), 0.30, 0.81, boxstyle="round,pad=0.015,rounding_size=0.02",
                             facecolor='#062c24', edgecolor=EMERALD_ACCENT, linewidth=2.5)
    ax.add_patch(b_center)
    ax.text(0.50, 0.82, "BHUMIBINIMOY FEDERATION CORE", ha='center', fontsize=12, fontweight='bold', color='#ffffff')
    ax.text(0.50, 0.79, "Cadastral Marketplace Engine & 8-Point Due-Diligence", ha='center', fontsize=8, color='#6ee7b7')

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
                             facecolor='#083b30', edgecolor='#10b981', linewidth=1.2)
        ax.add_patch(box)
        ax.text(0.38, y + 0.015, title, fontsize=8, fontweight='bold', color='#a7f3d0')
        ax.text(0.38, y - 0.018, detail, fontsize=7, color='#d1fae5')

    # Right: Bhudakshya Cadastral WebGIS
    b_right = FancyBboxPatch((0.69, 0.10), 0.28, 0.74, boxstyle="round,pad=0.015,rounding_size=0.02",
                             facecolor=CARD_BG, edgecolor='#8b5cf6', linewidth=1.8)
    ax.add_patch(b_right)
    ax.text(0.83, 0.79, "BHUDAKSHYA & e-PANJEEYAN", ha='center', fontsize=11, fontweight='bold', color='#c4b5fd')
    ax.text(0.83, 0.76, "Spatial Vector GIS & Registration Registry", ha='center', fontsize=8, color=TEXT_MUTED)

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
                              facecolor='#231c42', edgecolor='#4c1d95', linewidth=1)
        ax.add_patch(card)
        ax.text(0.72, y + 0.018, head, fontsize=8, fontweight='bold', color='#ddd6fe')
        ax.text(0.72, y - 0.012, sub, fontsize=7, color='#94a3b8')

    save_dual(fig, "diagram_2_dual_system_reconciliation")

# ==============================================================================
# DIAGRAM 3: Assisted Conveyancing State Machine (5-Stage Lifecycle)
# ==============================================================================
def create_widescreen_diagram_3():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_DARK)
    fig.patch.set_facecolor(BG_DARK)
    ax.axis('off')

    add_header(ax, "ASSISTED CONVEYANCING STATE MACHINE: 5-STAGE TRANSACTION PIPELINE",
               "Deterministic Milestone Workflow from Voluntary Listing to Automated Mission Basundhara Mutation",
               "CONVEYANCING STATE MACHINE")

    stages = [
        ("STAGE 1\nVOLUNTARY LISTING", "Lawful Pattadar e-KYC\nDag & Patta auto-lookup\nVoluntary consent signed\n8-Point Title Audit", 0.03, '#063328', '#059669', '#6ee7b7'),
        ("STAGE 2\nPRICE DISCOVERY", "Cadastral map discovery\nZonal Value comparison\nBuyer EOI submitted\nMutual price agreed", 0.23, '#083b30', '#10b981', '#a7f3d0'),
        ("STAGE 3\nESCROW TOKEN", "Milestone earnest deposit\nState-facilitated escrow\nZero private broker fee\nSale agreement signed", 0.43, '#1e293b', '#3b82f6', '#93c5fd'),
        ("STAGE 4\nCIRCLE SALE NOC", "Pre-filled NOC application\nDispur Circle Officer\n30-day objection window\nMandals survey cleared", 0.63, '#2a1a4a', '#a855f7', '#d8b4fe'),
        ("STAGE 5\nDEED & MUTATION", "e-Panjeeyan biometric slot\nStamp duty paid via GRAS\nDeed registered at SRO\nBasundhara auto-mutated", 0.83, '#331c19', '#f97316', '#fdba74')
    ]

    for title, desc, x, bg, stroke, text_color in stages:
        box = FancyBboxPatch((x, 0.20), 0.14, 0.62, boxstyle="round,pad=0.015,rounding_size=0.025", 
                             facecolor=bg, edgecolor=stroke, linewidth=2)
        ax.add_patch(box)
        ax.text(x + 0.07, 0.74, title, ha='center', va='center', fontsize=9.5, fontweight='bold', color=text_color)
        ax.text(x + 0.07, 0.45, desc, ha='center', va='center', fontsize=8, color='#f1f5f9', linespacing=1.3)

    for idx in range(4):
        ax.annotate('', xy=(0.20 + idx * 0.20, 0.51), xytext=(0.17 + idx * 0.20, 0.51),
                    arrowprops=dict(facecolor=CYAN_ACCENT, edgecolor=CYAN_ACCENT, width=2.5, headwidth=8))

    # Bottom summary box
    summary_box = FancyBboxPatch((0.03, 0.05), 0.94, 0.11, boxstyle="round,pad=0.01,rounding_size=0.015",
                                 facecolor='#111c35', edgecolor='#1e293b', linewidth=1)
    ax.add_patch(summary_box)
    ax.text(0.5, 0.105, "OPERATIONAL OUTCOME: Transaction cycle compressed from 180 days to <30 days. Citizen saves 5%-10% in avoided broker commissions. Zero post-sale litigation.",
            ha='center', va='center', fontsize=9, fontweight='bold', color='#34d399')

    save_dual(fig, "diagram_3_cadastral_anomaly_catalog")

# ==============================================================================
# DIAGRAM 4: 8-Point Due-Diligence Ledger & Title Clearance Badge Hierarchy
# ==============================================================================
def create_widescreen_diagram_4():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_DARK)
    fig.patch.set_facecolor(BG_DARK)
    ax.axis('off')

    add_header(ax, "8-POINT STATUTORY DUE-DILIGENCE & VERIFICATION BADGE HIERARCHY",
               "Deterministic Statutory Title Auditing under Assam Land and Revenue Regulation (ALRR) 1886",
               "DUE-DILIGENCE ENGINE")

    checks = [
        ("CHK-01: Patta Tenure Classification", "Periodic Patta (Khiraj Myadi) alienability confirmed. Annual Patta flagged.", "20 Pts", '#063328', '#10b981'),
        ("CHK-02: Spatial-Textual Area Variance", "|Bhudakshya GIS Area - Jamabandi Area| <= 5% statutory threshold.", "15 Pts", '#063328', '#10b981'),
        ("CHK-03: Co-Sharer Partition Balance", "Sum of fractional Pattadar shares exactly equals 100.0%.", "15 Pts", '#063328', '#10b981'),
        ("CHK-04: e-Khajana Revenue Clearance", "Annual Touzi demand fully settled; zero municipal or land revenue arrears.", "10 Pts", '#063328', '#10b981'),
        ("CHK-05: Encumbrance & Mortgage Search", "Sub-Registrar e-Panjeeyan books indicate zero active bank charges or liens.", "15 Pts", '#063328', '#10b981'),
        ("CHK-06: Revenue Court Litigation Check", "Zero active civil injunctions, stay orders, or title dispute notices.", "10 Pts", '#063328', '#10b981'),
        ("CHK-07: Chapter X Tribal Belt Filter", "Transfer compliance with protected class restrictions in Tribal Belts/Blocks.", "10 Pts", '#292518', '#f59e0b'),
        ("CHK-08: Ecological & Public Reserve Buffer", "Zero overlap with Village Grazing Reserves (VGR), PGR, or wetlands.", "5 Pts", '#063328', '#10b981')
    ]

    for idx, (title, desc, pts, bg, stroke) in enumerate(checks):
        col = idx % 2
        row = idx // 2
        x = 0.04 + col * 0.48
        y = 0.69 - row * 0.155

        box = FancyBboxPatch((x, y - 0.05), 0.44, 0.125, boxstyle="round,pad=0.015,rounding_size=0.02",
                             facecolor=bg, edgecolor=stroke, linewidth=1.5)
        ax.add_patch(box)
        ax.text(x + 0.02, y + 0.035, title, fontsize=9, fontweight='bold', color='#f1f5f9')
        ax.text(x + 0.02, y - 0.02, desc, fontsize=8, color='#cbd5e1')
        ax.text(x + 0.42, y + 0.035, pts, fontsize=8.5, fontweight='bold', color=stroke, ha='right')

    # Badges row at bottom
    badges = [
        ("GOLD VERIFIED", "Score 90-100: Clean Title", '#064e3b', '#34d399'),
        ("SILVER VERIFIED", "Score 75-89: Minor Dues", '#155e75', '#22d3ee'),
        ("CONDITIONAL", "Score 50-74: Co-Sharer Action", '#78350f', '#fde047'),
        ("RESTRICTED", "Score <50: Tribal/Court Block", '#881337', '#fda4af')
    ]
    for idx, (badge, sub, bg, text_c) in enumerate(badges):
        x = 0.04 + idx * 0.24
        box = FancyBboxPatch((x, 0.05), 0.21, 0.11, boxstyle="round,pad=0.01,rounding_size=0.015",
                             facecolor=bg, edgecolor=text_c, linewidth=1.5)
        ax.add_patch(box)
        ax.text(x + 0.105, 0.115, badge, ha='center', va='center', fontsize=9, fontweight='bold', color=text_c)
        ax.text(x + 0.105, 0.08, sub, ha='center', va='center', fontsize=7.5, color='#f1f5f9')

    save_dual(fig, "diagram_4_land_health_score_hierarchy")

# ==============================================================================
# DIAGRAM 5: Transparent Price Discovery & Zonal Value Benchmarking
# ==============================================================================
def create_widescreen_diagram_5():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_DARK)
    fig.patch.set_facecolor(BG_DARK)
    ax.axis('off')

    add_header(ax, "TRANSPARENT PRICE DISCOVERY: ZONAL VALUE BENCHMARKING ENGINE",
               "Eliminating Asymmetric Speculation with Statutorily Grounded Fair Market Value Indices",
               "PRICE DISCOVERY ENGINE")

    cols = [
        ("OFFICIAL ZONAL VALUE (FLOOR)", "Kamrup Metro Gazette Rate", "Rs. 85,00,000 / Bigha\n(Dispur Basti Rate)\n\n• Minimum registration threshold\n• Gazette gazetted valuation\n• Non-negotiable tax floor\n• Statutorily mandated benchmark", 0.05, '#1e293b', '#3b82f6', '#93c5fd'),
        ("SELLER VOLUNTARY ASKING PRICE", "Lawful Pattadar Request", "Rs. 96,66,667 / Bigha\n(+13.7% over Zonal Rate)\n\n• Premium for 30ft PWD road frontage\n• Elevated non-waterlogging plot\n• Ready municipal water pipeline\n• Fair Market Value Assessment", 0.38, '#063328', '#10b981', '#6ee7b7'),
        ("SPECULATIVE BROKER QUOTE", "Traditional Middleman Quote", "Rs. 1,30,00,000+ / Bigha\n(+53% Artificial Markup)\n\n• Hidden 5%-10% broker margin\n• Speculative artificial escalation\n• Disjointed cash components\n• Protracted price opacity", 0.71, '#331717', '#ef4444', '#fca5a5')
    ]

    for title, sub, bullets, x, bg, stroke, text_color in cols:
        box = FancyBboxPatch((x, 0.25), 0.24, 0.58, boxstyle="round,pad=0.015,rounding_size=0.025",
                             facecolor=bg, edgecolor=stroke, linewidth=2)
        ax.add_patch(box)
        ax.text(x + 0.12, 0.77, title, ha='center', va='center', fontsize=9, fontweight='bold', color=text_color)
        ax.text(x + 0.12, 0.73, sub, ha='center', va='center', fontsize=7.5, color='#94a3b8')
        ax.text(x + 0.02, 0.50, bullets, ha='left', va='center', fontsize=8, color='#f1f5f9', linespacing=1.3)

    sched_box = FancyBboxPatch((0.05, 0.06), 0.90, 0.14, boxstyle="round,pad=0.01,rounding_size=0.015",
                               facecolor='#111c35', edgecolor='#1e293b', linewidth=1)
    ax.add_patch(sched_box)
    ax.text(0.5, 0.15, "TRANSPARENT STATUTORY ACQUISITION CHARGES SCHEDULE (DISPUR 1.5 BIGHA CASE)",
            ha='center', va='center', fontsize=9, fontweight='bold', color='#38bdf8')
    ax.text(0.5, 0.095, "Agreed Price: Rs. 1.45 Cr  |  Assam Stamp Duty (6%): Rs. 8.70 Lakh  |  Registration (2%): Rs. 2.90 Lakh  |  Govt Facilitation (0.25%): Rs. 36,250  |  Broker Cut: Rs. 0 (Saved Rs. 7.25 Lakh)",
            ha='center', va='center', fontsize=8, color='#f1f5f9')

    save_dual(fig, "diagram_5_lat_mandal_mobile_app")

# ==============================================================================
# DIAGRAM 6: Dispur Circle Pilot & Enterprise Cloud Architecture
# ==============================================================================
def create_widescreen_diagram_6():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_DARK)
    fig.patch.set_facecolor(BG_DARK)
    ax.axis('off')

    add_header(ax, "DISPUR REVENUE CIRCLE PILOT & ASDC ENTERPRISE CLOUD ARCHITECTURE",
               "Tier-III ASDC Zero-Trust Hosting, NIC e-Pramaan OAuth2, PostGIS 3.4 & Leaflet Cadastral Tile Engine",
               "ENTERPRISE CLOUD ARCHITECTURE")

    layers = [
        ("LAYER 1: PRESENTATION & USER CHANNELS", "WebGIS Cadastral Map (Leaflet / MapLibre)  •  Buyer Deal Room  •  Seller Voluntary e-KYC Portal  •  Dept Console", 0.72, '#131e36', '#38bdf8'),
        ("LAYER 2: API GATEWAY & SECURITY PERIMETER", "NIC e-Pramaan OAuth2 / Jan Parichay  •  TLS 1.3  •  WAF  •  Role-Based Access Control (RBAC)  •  SHA-256 Ledger", 0.54, '#063328', '#10b981'),
        ("LAYER 3: CORE MICROSERVICES ENGINE", "Marketplace Tile Server  •  8-Point Due-Diligence Engine  •  Zonal Value Benchmark  •  Assisted Workflow State Machine", 0.36, '#1e293b', '#3b82f6'),
        ("LAYER 4: FEDERATED GOVERNMENT INTEGRATION", "Dharitree Read-Only View  •  Bhudakshya WFS/WMS  •  e-Panjeeyan SRO Connect  •  e-Khajana GRAS  •  Basundhara API", 0.18, '#2a1a4a', '#a855f7'),
        ("LAYER 5: DATA PERSISTENCE & STORAGE", "PostgreSQL 16 + PostGIS (Cadastral Polygons)  •  Redis 7.2 Spatial Cache  •  Encrypted Audit Trail  •  ASDC Tier-III SAN", 0.02, '#0f172a', '#64748b')
    ]

    for title, desc, y, bg, stroke in layers:
        box = FancyBboxPatch((0.05, y), 0.90, 0.13, boxstyle="round,pad=0.015,rounding_size=0.02",
                             facecolor=bg, edgecolor=stroke, linewidth=1.5)
        ax.add_patch(box)
        ax.text(0.5, y + 0.085, title, ha='center', va='center', fontsize=9.5, fontweight='bold', color=TEXT_WHITE)
        ax.text(0.5, y + 0.04, desc, ha='center', va='center', fontsize=8, color='#cbd5e1')

    save_dual(fig, "diagram_6_citizen_land_health_certificate")

# ==============================================================================
# DIAGRAM 7: Economic Sustainability & State Facilitation Revenue Model
# ==============================================================================
def create_widescreen_diagram_7():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_DARK)
    fig.patch.set_facecolor(BG_DARK)
    ax.axis('off')

    add_header(ax, "ECONOMIC SUSTAINABILITY & STATE FACILITATION REVENUE PROJECTION MODEL",
               "Transforming Land Governance into a Self-Funding Revenue Driver for the Government of Assam",
               "ECONOMIC IMPACT & REVENUE MODEL")

    tiers = [
        ("PHASE 1: DISPUR PILOT", "1,500 Facilitated Trades", "Target Revenue: Rs. 7.50 Cr\nCitizen Broker Savings: Rs. 15.0 Cr\nTurnaround: <30 Days\nDispute Rate: 0.0%", 0.06, '#063328', '#10b981', '#6ee7b7'),
        ("PHASE 2: KAMRUP METRO", "6,000 Facilitated Trades", "Target Revenue: Rs. 15.00 Cr / yr\nCitizen Broker Savings: Rs. 60.0 Cr\nSelf-funds ASDC GIS Ops\nDistrict-wide SRO sync", 0.38, '#1e293b', '#3b82f6', '#93c5fd'),
        ("PHASE 3: STATEWIDE ASSAM", "35 Districts Expansion", "Target Revenue: Rs. 45.00+ Cr / yr\nCitizen Broker Savings: Rs. 200+ Cr\nPermanent State Revenue\nCatalyst for Viksit Assam", 0.70, '#2a1a4a', '#a855f7', '#d8b4fe')
    ]

    for title, sub, bullets, x, bg, stroke, text_color in tiers:
        box = FancyBboxPatch((x, 0.28), 0.24, 0.54, boxstyle="round,pad=0.015,rounding_size=0.025",
                             facecolor=bg, edgecolor=stroke, linewidth=2)
        ax.add_patch(box)
        ax.text(x + 0.12, 0.74, title, ha='center', va='center', fontsize=9.5, fontweight='bold', color=text_color)
        ax.text(x + 0.12, 0.69, sub, ha='center', va='center', fontsize=7.5, color='#94a3b8')
        ax.text(x + 0.02, 0.48, bullets, ha='left', va='center', fontsize=8.5, color='#f1f5f9', linespacing=1.4)

    callout = FancyBboxPatch((0.06, 0.06), 0.88, 0.16, boxstyle="round,pad=0.01,rounding_size=0.015",
                             facecolor='#111c35', edgecolor='#1e293b', linewidth=1)
    ax.add_patch(callout)
    ax.text(0.5, 0.17, "WIN-WIN PUBLIC VALUE PROPOSITION:", ha='center', va='center', fontsize=9.5, fontweight='bold', color='#34d399')
    ax.text(0.5, 0.11, "Citizens gain 100% verified legal security and save 5%-10% in private commissions.\nThe Government of Assam secures a dedicated, legitimate non-tax facilitation revenue stream of Rs. 15Cr - Rs. 45Cr annually.",
            ha='center', va='center', fontsize=8, color='#f1f5f9', linespacing=1.3)

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
