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

# -------------------------------------------------------------
# DIAGRAM 1: Before vs After Paradigm Shift (Broker Market vs Land Exchange)
# -------------------------------------------------------------
def create_diagram_1():
    fig, ax = plt.subplots(figsize=(12, 6.5), dpi=200)
    ax.set_facecolor('#f8fafc')
    fig.patch.set_facecolor('#f8fafc')
    ax.axis('off')

    # Title
    ax.text(0.5, 0.95, "PARADIGM SHIFT: FRAGMENTED BROKER NETWORK VS. ASSAM LAND EXCHANGE", 
            ha='center', va='center', fontsize=13, fontweight='bold', color='#0f172a')
    ax.text(0.5, 0.90, "Government of Assam • Revenue & Disaster Management Department • NESFIC-D-52", 
            ha='center', va='center', fontsize=9, color='#059669')

    # Left Box - Current Broken Approach
    box_left = FancyBboxPatch((0.04, 0.08), 0.43, 0.76, boxstyle="round,pad=0.02,rounding_size=0.03", 
                              facecolor='#fff1f2', edgecolor='#fda4af', linewidth=2)
    ax.add_patch(box_left)
    ax.text(0.255, 0.80, "CURRENT WORKFLOW (INFORMAL BROKERS)", ha='center', va='center', 
            fontsize=11, fontweight='bold', color='#9f1239')

    left_steps = [
        ("1. Opaque Discovery & Misleading Claims", "Unregulated private brokers, roadside signage, and\nclassifieds with unverified, self-reported title claims.", '#ffe4e6'),
        ("2. Fragmented Manual Verification", "Buyer hires local advocates to check physical Jamabandis,\nSub-Registrar deed books, and consult Lat Mandals.", '#ffe4e6'),
        ("3. Speculative Pricing & High Commission", "Artificial price inflation with 5% to 10% private\nbroker cuts and widespread stamp duty under-reporting.", '#fecdd3'),
        ("4. Protracted Disputes & Stalled NOCs", "30 to 90 days delay. Latent co-sharer or tribal belt\ndefects trigger surprise rejections at Circle Office.", '#fda4af')
    ]
    for idx, (title, desc, bg) in enumerate(left_steps):
        y = 0.67 - idx * 0.17
        step_box = FancyBboxPatch((0.06, y - 0.05), 0.39, 0.13, boxstyle="round,pad=0.01,rounding_size=0.02",
                                  facecolor=bg, edgecolor='#f43f5e', linewidth=1)
        ax.add_patch(step_box)
        ax.text(0.08, y + 0.035, title, fontsize=9, fontweight='bold', color='#881337')
        ax.text(0.08, y - 0.015, desc, fontsize=7.5, color='#4c0519', linespacing=1.2)

    # Right Box - BhumiBinimoy Solution
    box_right = FancyBboxPatch((0.53, 0.08), 0.43, 0.76, boxstyle="round,pad=0.02,rounding_size=0.03", 
                               facecolor='#f0fdf4', edgecolor='#86efac', linewidth=2)
    ax.add_patch(box_right)
    ax.text(0.745, 0.80, "BHUMIBINIMOY (GOVERNMENT-VERIFIED EXCHANGE)", ha='center', va='center', 
            fontsize=11, fontweight='bold', color='#14532d')

    right_steps = [
        ("1. Cadastral Map Public Discovery", "Willing owners voluntarily list parcels on Assam's official\ncadastral map with authenticated vector boundaries.", '#dcfce7'),
        ("2. Instant 8-Point Due-Diligence", "Automated reconciliation of Dharitree, Bhudakshya,\ne-Panjeeyan, e-Khajana, and Chapter X safeguards.", '#dcfce7'),
        ("3. Transparent Price Discovery", "Asking price benchmarked against official Zonal Rates\nwith statutory stamp duty schedule and 0% broker cut.", '#bbf7d0'),
        ("4. Assisted Fast-Track Conveyancing", "Pre-filled Land Sale NOC to Circle Officer, biometric\ne-Panjeeyan booking, and Mission Basundhara mutation.", '#86efac')
    ]
    for idx, (title, desc, bg) in enumerate(right_steps):
        y = 0.67 - idx * 0.17
        step_box = FancyBboxPatch((0.55, y - 0.05), 0.39, 0.13, boxstyle="round,pad=0.01,rounding_size=0.02",
                                  facecolor=bg, edgecolor='#22c55e', linewidth=1)
        ax.add_patch(step_box)
        ax.text(0.57, y + 0.035, title, fontsize=9, fontweight='bold', color='#14532d')
        ax.text(0.57, y - 0.015, desc, fontsize=7.5, color='#052e16', linespacing=1.2)

    plt.tight_layout()
    png_path = os.path.join(out_dir, 'diagram_1_before_after_workflow.png')
    jpg_path = os.path.join(out_dir, 'diagram_1_before_after_workflow.jpg')
    plt.savefig(png_path, dpi=200, bbox_inches='tight')
    plt.savefig(jpg_path, dpi=200, bbox_inches='tight')
    plt.close()
    print("Saved Diagram 1")

# -------------------------------------------------------------
# DIAGRAM 2: Integrated Data Ecosystem (Dharitree, Bhudakshya, e-Panjeeyan)
# -------------------------------------------------------------
def create_diagram_2():
    fig, ax = plt.subplots(figsize=(12, 6.5), dpi=200)
    ax.set_facecolor('#f8fafc')
    fig.patch.set_facecolor('#f8fafc')
    ax.axis('off')

    ax.text(0.5, 0.95, "INTEGRATED DATA ECOSYSTEM: 5 REVENUE PILLARS FEDERATION", 
            ha='center', va='center', fontsize=13, fontweight='bold', color='#0f172a')
    ax.text(0.5, 0.90, "Federated Truth Engine Underpinning BhumiBinimoy (Assam Land Exchange)", 
            ha='center', va='center', fontsize=9, color='#0284c7')

    # Central Exchange Box
    center_box = FancyBboxPatch((0.36, 0.35), 0.28, 0.38, boxstyle="round,pad=0.02,rounding_size=0.03", 
                               facecolor='#f0fdf4', edgecolor='#10b981', linewidth=2.5)
    ax.add_patch(center_box)
    ax.text(0.5, 0.65, "BHUMIBINIMOY CORE", ha='center', va='center', fontsize=11, fontweight='bold', color='#065f46')
    ax.text(0.5, 0.60, "Assam Land Exchange Platform", ha='center', va='center', fontsize=8, color='#047857')
    ax.text(0.5, 0.52, "• Cadastral Map Tile Server\n• 8-Point Due-Diligence Engine\n• Zonal Value Price Benchmark\n• Seller Voluntary e-KYC Vault\n• Assisted Conveyancing State Machine", 
            ha='center', va='center', fontsize=7.5, color='#064e3b', linespacing=1.3)
    ax.text(0.5, 0.40, "ASDC High-Security Enclave", ha='center', va='center', fontsize=7.5, fontweight='bold', color='#059669')

    # Surrounding Systems (5 Pillars)
    pillars = [
        ("DHARITREE", "Record of Rights (RoR)", "• Pattadar fractional shares\n• Jamabandi recorded BKL\n• Patta classification (Myadi)\n• Registered co-sharers", 0.05, 0.55, '#e0f2fe', '#38bdf8', '#0369a1'),
        ("BHUDAKSHYA", "Cadastral WebGIS", "• Dag polygon vector rings\n• Sub-meter GIS area (sq.m)\n• Cadastral boundary topology\n• Contiguous parcel buffer", 0.05, 0.12, '#fae8ff', '#e879f9', '#86198f'),
        ("e-PANJEEYAN", "Deed Registration", "• Registered deed encumbrances\n• Active bank hypothecations\n• Historical conveyancing chain\n• Sub-Registrar biometric slots", 0.68, 0.55, '#fef3c7', '#fcd34d', '#92400e'),
        ("ZONAL VALUATION", "Circle Valuation DB", "• Official Circle Rate Gazette\n• Land class multipliers\n• Minimum stamp duty base\n• Transparent fair value index", 0.68, 0.12, '#ffedd5', '#fb923c', '#9a3412'),
        ("e-KHAJANA & REVENUE", "Tax Assessment Portal", "• Annual Touzi revenue demand\n• Real-time arrears settlement\n• e-Challan / GRAS payments", 0.36, 0.06, '#dcfce7', '#4ade80', '#166534')
    ]

    for name, sub, bullets, x, y, bg, stroke, text_color in pillars:
        box = FancyBboxPatch((x, y), 0.27, 0.25, boxstyle="round,pad=0.015,rounding_size=0.025", 
                             facecolor=bg, edgecolor=stroke, linewidth=1.5)
        ax.add_patch(box)
        ax.text(x + 0.135, y + 0.21, name, ha='center', va='center', fontsize=9.5, fontweight='bold', color=text_color)
        ax.text(x + 0.135, y + 0.17, sub, ha='center', va='center', fontsize=7.5, color='#475569')
        ax.text(x + 0.02, y + 0.08, bullets, ha='left', va='center', fontsize=7, color='#1e293b', linespacing=1.2)

    plt.tight_layout()
    plt.savefig(os.path.join(out_dir, 'diagram_2_dual_system_reconciliation.png'), dpi=200, bbox_inches='tight')
    plt.savefig(os.path.join(out_dir, 'diagram_2_dual_system_reconciliation.jpg'), dpi=200, bbox_inches='tight')
    plt.close()
    print("Saved Diagram 2")

# -------------------------------------------------------------
# DIAGRAM 3: Assisted Conveyancing State Machine (5-Stage Lifecycle)
# -------------------------------------------------------------
def create_diagram_3():
    fig, ax = plt.subplots(figsize=(12, 6.5), dpi=200)
    ax.set_facecolor('#f8fafc')
    fig.patch.set_facecolor('#f8fafc')
    ax.axis('off')

    ax.text(0.5, 0.95, "ASSISTED CONVEYANCING STATE MACHINE: 5-STAGE TRANSACTION PIPELINE", 
            ha='center', va='center', fontsize=13, fontweight='bold', color='#0f172a')
    ax.text(0.5, 0.90, "From Voluntary Cadastral Listing to Sub-Registrar Deed Execution & Auto-Mutation", 
            ha='center', va='center', fontsize=9, color='#0284c7')

    stages = [
        ("STAGE 1\nVOLUNTARY LISTING", "Lawful Pattadar e-KYC\nDag & Patta lookup\nVoluntary consent signed\n8-Point Title Audit", 0.03, '#ecfdf5', '#10b981', '#065f46'),
        ("STAGE 2\nPRICE DISCOVERY", "Interactive Cadastral map\nZonal Value comparison\nBuyer EOI submitted\nMutual terms locked", 0.23, '#f0fdf4', '#22c55e', '#15803d'),
        ("STAGE 3\nESCROW TOKEN", "Milestone earnest deposit\nState-facilitated escrow\nZero private broker fee\nSale agreement digitally executed", 0.43, '#eff6ff', '#3b82f6', '#1e40af'),
        ("STAGE 4\nCIRCLE SALE NOC", "Pre-filled NOC application\nDispur Circle Officer\n30-day objection window\nMandals survey cleared", 0.63, '#fdf4ff', '#c084fc', '#6b21a8'),
        ("STAGE 5\nDEED & MUTATION", "e-Panjeeyan biometric slot\nStamp duty paid via GRAS\nDeed registered at SRO\nMission Basundhara auto-mutated", 0.83, '#fff7ed', '#fb923c', '#9a3412')
    ]

    for title, desc, x, bg, stroke, text_color in stages:
        box = FancyBboxPatch((x, 0.22), 0.14, 0.58, boxstyle="round,pad=0.015,rounding_size=0.025", 
                             facecolor=bg, edgecolor=stroke, linewidth=2)
        ax.add_patch(box)
        ax.text(x + 0.07, 0.72, title, ha='center', va='center', fontsize=9, fontweight='bold', color=text_color)
        ax.text(x + 0.07, 0.45, desc, ha='center', va='center', fontsize=7.5, color='#334155', linespacing=1.3)

    # Connector arrows
    for idx in range(4):
        ax.annotate('', xy=(0.20 + idx * 0.20, 0.51), xytext=(0.17 + idx * 0.20, 0.51),
                    arrowprops=dict(facecolor='#059669', edgecolor='#059669', width=2, headwidth=7))

    # Bottom summary box
    summary_box = FancyBboxPatch((0.03, 0.06), 0.94, 0.11, boxstyle="round,pad=0.01,rounding_size=0.015",
                                 facecolor='#0f172a', edgecolor='#334155', linewidth=1)
    ax.add_patch(summary_box)
    ax.text(0.5, 0.115, "OUTCOME: Transaction cycle compressed from 180 days to <30 days. Citizen saves 5%-10% broker cuts. Zero post-sale litigation.",
            ha='center', va='center', fontsize=8.5, fontweight='bold', color='#34d399')

    plt.tight_layout()
    plt.savefig(os.path.join(out_dir, 'diagram_3_cadastral_anomaly_catalog.png'), dpi=200, bbox_inches='tight')
    plt.savefig(os.path.join(out_dir, 'diagram_3_cadastral_anomaly_catalog.jpg'), dpi=200, bbox_inches='tight')
    plt.close()
    print("Saved Diagram 3")

# -------------------------------------------------------------
# DIAGRAM 4: 8-Point Due-Diligence Ledger & Title Clearance Badge
# -------------------------------------------------------------
def create_diagram_4():
    fig, ax = plt.subplots(figsize=(12, 6.5), dpi=200)
    ax.set_facecolor('#f8fafc')
    fig.patch.set_facecolor('#f8fafc')
    ax.axis('off')

    ax.text(0.5, 0.95, "8-POINT STATUTORY DUE-DILIGENCE & VERIFICATION BADGE HIERARCHY", 
            ha='center', va='center', fontsize=13, fontweight='bold', color='#0f172a')
    ax.text(0.5, 0.90, "Automated Statutory Evaluation Matrix under Assam Land & Revenue Regulation 1886", 
            ha='center', va='center', fontsize=9, color='#059669')

    checks = [
        ("CHK-01: Patta Tenure Classification", "Periodic Patta (Khiraj Myadi) alienability confirmed. Annual Patta flagged.", "20 Pts", '#dcfce7', '#166534'),
        ("CHK-02: Spatial-Textual Area Variance", "|Bhudakshya GIS Area - Jamabandi Area| <= 5% statutory threshold.", "15 Pts", '#dcfce7', '#166534'),
        ("CHK-03: Co-Sharer Partition Balance", "Sum of fractional Pattadar shares exactly equals 100.0%.", "15 Pts", '#dcfce7', '#166534'),
        ("CHK-04: e-Khajana Revenue Clearance", "Annual Touzi demand fully settled; zero municipal or land revenue arrears.", "10 Pts", '#dcfce7', '#166534'),
        ("CHK-05: Encumbrance & Mortgage Search", "Sub-Registrar e-Panjeeyan books indicate zero active bank charges or liens.", "15 Pts", '#dcfce7', '#166534'),
        ("CHK-06: Revenue Court Litigation Check", "Zero active civil injunctions, stay orders, or title dispute notices.", "10 Pts", '#dcfce7', '#166534'),
        ("CHK-07: Chapter X Tribal Belt Filter", "Transfer compliance with protected class restrictions in Tribal Belts/Blocks.", "10 Pts", '#fef3c7', '#92400e'),
        ("CHK-08: Ecological & Public Reserve Buffer", "Zero overlap with Village Grazing Reserves (VGR), PGR, or wetlands.", "5 Pts", '#dcfce7', '#166534')
    ]

    for idx, (title, desc, pts, bg, stroke) in enumerate(checks):
        col = idx % 2
        row = idx // 2
        x = 0.04 + col * 0.48
        y = 0.70 - row * 0.16

        box = FancyBboxPatch((x, y - 0.05), 0.44, 0.13, boxstyle="round,pad=0.015,rounding_size=0.02",
                             facecolor=bg, edgecolor=stroke, linewidth=1.5)
        ax.add_patch(box)
        ax.text(x + 0.02, y + 0.035, title, fontsize=8.5, fontweight='bold', color=stroke)
        ax.text(x + 0.02, y - 0.02, desc, fontsize=7.5, color='#334155')
        ax.text(x + 0.42, y + 0.035, pts, fontsize=8, fontweight='bold', color=stroke, ha='right')

    # Badges row at bottom
    badges = [
        ("GOLD VERIFIED", "Score 90-100: Clean Title", '#065f46', '#34d399'),
        ("SILVER VERIFIED", "Score 75-89: Minor Dues", '#0e7490', '#22d3ee'),
        ("CONDITIONAL", "Score 50-74: Co-Sharer Action", '#b45309', '#fde047'),
        ("RESTRICTED", "Score <50: Tribal/Court Block", '#be123c', '#fda4af')
    ]
    for idx, (badge, sub, bg, text_c) in enumerate(badges):
        x = 0.04 + idx * 0.24
        box = FancyBboxPatch((x, 0.05), 0.21, 0.11, boxstyle="round,pad=0.01,rounding_size=0.015",
                             facecolor=bg, edgecolor=text_c, linewidth=1)
        ax.add_patch(box)
        ax.text(x + 0.105, 0.115, badge, ha='center', va='center', fontsize=8.5, fontweight='bold', color=text_c)
        ax.text(x + 0.105, 0.08, sub, ha='center', va='center', fontsize=7, color='#f1f5f9')

    plt.tight_layout()
    plt.savefig(os.path.join(out_dir, 'diagram_4_land_health_score_hierarchy.png'), dpi=200, bbox_inches='tight')
    plt.savefig(os.path.join(out_dir, 'diagram_4_land_health_score_hierarchy.jpg'), dpi=200, bbox_inches='tight')
    plt.close()
    print("Saved Diagram 4")

# -------------------------------------------------------------
# DIAGRAM 5: Transparent Price Discovery & Zonal Value Benchmarking
# -------------------------------------------------------------
def create_diagram_5():
    fig, ax = plt.subplots(figsize=(12, 6.5), dpi=200)
    ax.set_facecolor('#f8fafc')
    fig.patch.set_facecolor('#f8fafc')
    ax.axis('off')

    ax.text(0.5, 0.95, "TRANSPARENT PRICE DISCOVERY: ZONAL VALUE BENCHMARKING ENGINE", 
            ha='center', va='center', fontsize=13, fontweight='bold', color='#0f172a')
    ax.text(0.5, 0.90, "Eliminating Asymmetric Speculation and Unfair Intermediary Markups", 
            ha='center', va='center', fontsize=9, color='#0284c7')

    # 3-Pillar Comparison Box
    cols = [
        ("OFFICIAL ZONAL VALUE (FLOOR)", "Kamrup Metro Gazette Rate", "₹85,00,000 / Bigha\n(Dispur Basti Rate)\n\n• Minimum registration threshold\n• Gazette gazetted valuation\n• Non-negotiable tax floor\n• Statutorily mandated benchmark", 0.05, '#eff6ff', '#3b82f6', '#1d4ed8'),
        ("SELLER VOLUNTARY ASKING PRICE", "Lawful Pattadar Request", "₹96,66,667 / Bigha\n(+13.7% over Zonal Rate)\n\n• Premium for 30ft PWD road frontage\n• Elevated non-waterlogging plot\n• Ready municipal water pipeline\n• Fair Market Value Assessment", 0.38, '#f0fdf4', '#10b981', '#047857'),
        ("SPECULATIVE BROKER QUOTE", "Traditional Middleman Quote", "₹1,30,00,000+ / Bigha\n(+53% Artificial Markup)\n\n• Hidden 5%-10% broker margin\n• Speculative artificial escalation\n• Disjointed cash components\n• Protracted price opacity", 0.71, '#fff1f2', '#f43f5e', '#be123c')
    ]

    for title, sub, bullets, x, bg, stroke, text_color in cols:
        box = FancyBboxPatch((x, 0.25), 0.24, 0.58, boxstyle="round,pad=0.015,rounding_size=0.025",
                             facecolor=bg, edgecolor=stroke, linewidth=2)
        ax.add_patch(box)
        ax.text(x + 0.12, 0.77, title, ha='center', va='center', fontsize=8.5, fontweight='bold', color=text_color)
        ax.text(x + 0.12, 0.73, sub, ha='center', va='center', fontsize=7.5, color='#64748b')
        ax.text(x + 0.02, 0.50, bullets, ha='left', va='center', fontsize=7.5, color='#1e293b', linespacing=1.3)

    # Statutory Transfer Charges Schedule at Bottom
    sched_box = FancyBboxPatch((0.05, 0.06), 0.90, 0.14, boxstyle="round,pad=0.01,rounding_size=0.015",
                               facecolor='#0f172a', edgecolor='#334155', linewidth=1)
    ax.add_patch(sched_box)
    ax.text(0.5, 0.15, "TRANSPARENT STATUTORY ACQUISITION CHARGES SCHEDULE (DISPUR 1.5 BIGHA CASE)",
            ha='center', va='center', fontsize=8.5, fontweight='bold', color='#38bdf8')
    ax.text(0.5, 0.095, "Agreed Price: ₹1.45 Cr  |  Assam Stamp Duty (6%): ₹8.70 Lakh  |  Registration (2%): ₹2.90 Lakh  |  Govt Facilitation (0.25%): ₹36,250  |  Broker Cut: ₹0 (Saved ₹7.25 Lakh)",
            ha='center', va='center', fontsize=7.5, color='#f1f5f9')

    plt.tight_layout()
    plt.savefig(os.path.join(out_dir, 'diagram_5_lat_mandal_mobile_app.png'), dpi=200, bbox_inches='tight')
    plt.savefig(os.path.join(out_dir, 'diagram_5_lat_mandal_mobile_app.jpg'), dpi=200, bbox_inches='tight')
    plt.close()
    print("Saved Diagram 5")

# -------------------------------------------------------------
# DIAGRAM 6: Dispur Circle Pilot Framework & ASDC Enterprise Architecture
# -------------------------------------------------------------
def create_diagram_6():
    fig, ax = plt.subplots(figsize=(12, 6.5), dpi=200)
    ax.set_facecolor('#f8fafc')
    fig.patch.set_facecolor('#f8fafc')
    ax.axis('off')

    ax.text(0.5, 0.95, "DISPUR REVENUE CIRCLE PILOT & ASDC ENTERPRISE CLOUD ARCHITECTURE", 
            ha='center', va='center', fontsize=13, fontweight='bold', color='#0f172a')
    ax.text(0.5, 0.90, "Government-Approved Secure Hosting at Assam State Data Centre (ASDC)", 
            ha='center', va='center', fontsize=9, color='#059669')

    layers = [
        ("LAYER 1: PRESENTATION & USER CHANNELS", "WebGIS Cadastral Map (Leaflet / MapLibre)  •  Buyer Deal Room  •  Seller Voluntary e-KYC Portal  •  Dept Console", 0.72, '#f8fafc', '#94a3b8'),
        ("LAYER 2: API GATEWAY & SECURITY PERIMETER", "NIC e-Pramaan OAuth2 / Jan Parichay  •  TLS 1.3  •  WAF  •  Role-Based Access Control (RBAC)  •  SHA-256 Ledger", 0.54, '#f0fdf4', '#22c55e'),
        ("LAYER 3: CORE MICROSERVICES ENGINE", "Marketplace Tile Server  •  8-Point Due-Diligence Engine  •  Zonal Value Benchmark  •  Assisted Workflow State Machine", 0.36, '#eff6ff', '#3b82f6'),
        ("LAYER 4: FEDERATED GOVERNMENT INTEGRATION", "Dharitree Read-Only View  •  Bhudakshya WFS/WMS  •  e-Panjeeyan SRO Connect  •  e-Khajana GRAS  •  Basundhara API", 0.18, '#fdf4ff', '#c084fc'),
        ("LAYER 5: DATA PERSISTENCE & STORAGE", "PostgreSQL 16 + PostGIS (Cadastral Polygons)  •  Redis 7.2 Spatial Cache  •  Encrypted Audit Trail  •  ASDC Tier-III SAN", 0.02, '#0f172a', '#334155')
    ]

    for title, desc, y, bg, stroke in layers:
        box = FancyBboxPatch((0.05, y), 0.90, 0.13, boxstyle="round,pad=0.015,rounding_size=0.02",
                             facecolor=bg, edgecolor=stroke, linewidth=1.5)
        ax.add_patch(box)
        text_color = '#ffffff' if bg == '#0f172a' else '#0f172a'
        sub_color = '#94a3b8' if bg == '#0f172a' else '#475569'
        ax.text(0.5, y + 0.085, title, ha='center', va='center', fontsize=9, fontweight='bold', color=text_color)
        ax.text(0.5, y + 0.04, desc, ha='center', va='center', fontsize=7.5, color=sub_color)

    plt.tight_layout()
    plt.savefig(os.path.join(out_dir, 'diagram_6_citizen_land_health_certificate.png'), dpi=200, bbox_inches='tight')
    plt.savefig(os.path.join(out_dir, 'diagram_6_citizen_land_health_certificate.jpg'), dpi=200, bbox_inches='tight')
    plt.close()
    print("Saved Diagram 6")

# -------------------------------------------------------------
# DIAGRAM 7: Economic Sustainability & State Facilitation Revenue Model
# -------------------------------------------------------------
def create_diagram_7():
    fig, ax = plt.subplots(figsize=(12, 6.5), dpi=200)
    ax.set_facecolor('#f8fafc')
    fig.patch.set_facecolor('#f8fafc')
    ax.axis('off')

    ax.text(0.5, 0.95, "ECONOMIC IMPACT & NON-TAX FACILITATION REVENUE PROJECTIONS", 
            ha='center', va='center', fontsize=13, fontweight='bold', color='#0f172a')
    ax.text(0.5, 0.90, "Transforming Land Governance from an Administrative Cost to a Self-Funding Asset", 
            ha='center', va='center', fontsize=9, color='#059669')

    # 3 Revenue Tiers
    tiers = [
        ("PHASE 1: DISPUR PILOT", "1,500 Facilitated Trades", "Target Revenue: ₹7.50 Cr\nCitizen Broker Savings: ₹15.0 Cr\nTurnaround: <30 Days\nDispute Rate: 0.0%", 0.06, '#f0fdf4', '#22c55e', '#15803d'),
        ("PHASE 2: KAMRUP METRO", "6,000 Facilitated Trades", "Target Revenue: ₹15.00 Cr / yr\nCitizen Broker Savings: ₹60.0 Cr\nSelf-funds ASDC GIS Ops\nDistrict-wide SRO sync", 0.38, '#eff6ff', '#3b82f6', '#1e40af'),
        ("PHASE 3: STATEWIDE ASSAM", "35 Districts Expansion", "Target Revenue: ₹45.00+ Cr / yr\nCitizen Broker Savings: ₹200+ Cr\nPermanent State Revenue\nCatalyst for Viksit Assam", 0.70, '#fdf4ff', '#a855f7', '#6b21a8')
    ]

    for title, sub, bullets, x, bg, stroke, text_color in tiers:
        box = FancyBboxPatch((x, 0.28), 0.24, 0.54, boxstyle="round,pad=0.015,rounding_size=0.025",
                             facecolor=bg, edgecolor=stroke, linewidth=2)
        ax.add_patch(box)
        ax.text(x + 0.12, 0.74, title, ha='center', va='center', fontsize=9, fontweight='bold', color=text_color)
        ax.text(x + 0.12, 0.69, sub, ha='center', va='center', fontsize=7.5, color='#64748b')
        ax.text(x + 0.02, 0.48, bullets, ha='left', va='center', fontsize=8, color='#1e293b', linespacing=1.4)

    # Bottom Callout Box
    callout = FancyBboxPatch((0.06, 0.06), 0.88, 0.16, boxstyle="round,pad=0.01,rounding_size=0.015",
                             facecolor='#0f172a', edgecolor='#334155', linewidth=1)
    ax.add_patch(callout)
    ax.text(0.5, 0.17, "WIN-WIN PUBLIC VALUE PROPOSITION:", ha='center', va='center', fontsize=9, fontweight='bold', color='#34d399')
    ax.text(0.5, 0.11, "Citizens gain 100% verified legal security and save 5%-10% in private commissions.\nThe Government of Assam secures a dedicated, legitimate non-tax facilitation revenue stream of ₹15Cr - ₹45Cr annually.",
            ha='center', va='center', fontsize=7.5, color='#f1f5f9', linespacing=1.3)

    plt.tight_layout()
    plt.savefig(os.path.join(out_dir, 'diagram_7_enterprise_system_architecture.png'), dpi=200, bbox_inches='tight')
    plt.savefig(os.path.join(out_dir, 'diagram_7_enterprise_system_architecture.jpg'), dpi=200, bbox_inches='tight')
    plt.close()
    print("Saved Diagram 7")

if __name__ == '__main__':
    create_diagram_1()
    create_diagram_2()
    create_diagram_3()
    create_diagram_4()
    create_diagram_5()
    create_diagram_6()
    create_diagram_7()
    print("All NESFIC-D-52 diagrams rendered successfully!")
