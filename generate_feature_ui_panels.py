import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Rectangle, Circle, Polygon
import numpy as np

os.environ['MPLCONFIGDIR'] = '/tmp/matplotlib-cache'
base_dir = os.path.dirname(os.path.abspath(__file__))
out_dir = os.path.join(base_dir, 'assets', 'proposal_images')
os.makedirs(out_dir, exist_ok=True)

# Common Palette & Styles
BG_CANVAS = '#0f172a'
WIN_BG = '#ffffff'
WIN_BORDER = '#334155'
NAVY_HEADER = '#0f172a'
EMERALD_GREEN = '#059669'
LIGHT_EMERALD = '#ecfdf5'
ROYAL_BLUE = '#1d4ed8'
LIGHT_BLUE = '#eff6ff'
TEXT_DARK = '#0f172a'
TEXT_MUTED = '#64748b'
AMBER_GOLD = '#d97706'
ROSE_RED = '#dc2626'

def draw_browser_chrome(ax, url, title_page="Assam Land Exchange | BhumiBinimoy"):
    # Window Frame Shadow / Outer Border
    outer = FancyBboxPatch((0.015, 0.02), 0.97, 0.96, boxstyle="round,pad=0.01,rounding_size=0.018",
                           facecolor=WIN_BG, edgecolor='#cbd5e1', linewidth=2.0, zorder=1)
    ax.add_patch(outer)
    
    # Title Bar / Top Bar
    title_bar = FancyBboxPatch((0.015, 0.925), 0.97, 0.055, boxstyle="round,pad=0.005,rounding_size=0.012",
                               facecolor='#f8fafc', edgecolor='#cbd5e1', linewidth=1.0, zorder=2)
    ax.add_patch(title_bar)
    
    # Mac Window Control Dots
    ax.add_patch(Circle((0.035, 0.952), 0.007, facecolor='#ef4444', edgecolor='#dc2626', linewidth=0.5, zorder=3))
    ax.add_patch(Circle((0.050, 0.952), 0.007, facecolor='#f59e0b', edgecolor='#d97706', linewidth=0.5, zorder=3))
    ax.add_patch(Circle((0.065, 0.952), 0.007, facecolor='#10b981', edgecolor='#059669', linewidth=0.5, zorder=3))
    
    # URL Omnibox
    url_box = FancyBboxPatch((0.18, 0.933), 0.64, 0.038, boxstyle="round,pad=0.004,rounding_size=0.008",
                             facecolor='#ffffff', edgecolor='#94a3b8', linewidth=1.0, zorder=3)
    ax.add_patch(url_box)
    
    # Secure indicator
    ax.text(0.195, 0.952, "[SECURE]", fontsize=6.5, fontweight='bold', color='#059669', ha='center', va='center', zorder=4)
    ax.text(0.235, 0.952, url, fontsize=8.5, fontweight='medium', color='#0f766e', va='center', zorder=4)
    ax.text(0.795, 0.952, "ASDC TIER-III SSL", fontsize=7, fontweight='bold', color='#059669', ha='right', va='center', zorder=4)
    
    # Platform Nav Bar
    nav_bar = Rectangle((0.016, 0.865), 0.968, 0.060, facecolor=NAVY_HEADER, edgecolor='none', zorder=2)
    ax.add_patch(nav_bar)
    
    # Gov Crest & Logo
    ax.text(0.035, 0.900, "BHUMIBINIMOY (Assam Land Exchange)", fontsize=9.5, fontweight='bold', color='#ffffff', va='center', zorder=3)
    ax.text(0.035, 0.880, "GOVERNMENT OF ASSAM • REVENUE & DISASTER MGMT • NESFIC-D-52", fontsize=6.5, color='#34d399', va='center', zorder=3)
    
    # Nav items
    navs = ["Cadastral Map", "Buyer Deal Room", "Seller Portal", "Conveyancing", "Admin Console", "Guide & Tutorial"]
    for i, n in enumerate(navs):
        x = 0.44 + i * 0.09
        is_active = (i == 0 and "map" in url) or (i == 1 and "deal" in url) or (i == 2 and "seller" in url) or (i == 3 and "convey" in url) or (i == 4 and "admin" in url) or (i == 5 and "tutorial" in url or "guide" in url)
        fc = '#065f46' if is_active else 'none'
        tc = '#6ee7b7' if is_active else '#cbd5e1'
        if is_active:
            pill = FancyBboxPatch((x-0.008, 0.875), 0.082, 0.040, boxstyle="round,pad=0.002,rounding_size=0.006",
                                  facecolor=fc, edgecolor='#10b981', linewidth=1, zorder=3)
            ax.add_patch(pill)
        ax.text(x + 0.033, 0.895, n, fontsize=7.5, fontweight='bold' if is_active else 'normal', color=tc, ha='center', va='center', zorder=4)

def save_ui(fig, basename):
    plt.tight_layout()
    png_path = os.path.join(out_dir, f"{basename}.png")
    jpg_path = os.path.join(out_dir, f"{basename}.jpg")
    plt.savefig(png_path, dpi=200, bbox_inches='tight')
    plt.savefig(jpg_path, dpi=200, bbox_inches='tight')
    plt.close()
    print(f"Rendered UI: {basename}.png & .jpg")

# ------------------------------------------------------------------------------
# UI-01: Cadastral WebGIS Multi-Layer Explorer
# ------------------------------------------------------------------------------
def render_ui_01():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_CANVAS)
    fig.patch.set_facecolor(BG_CANVAS)
    ax.axis('off')
    
    draw_browser_chrome(ax, "https://bhumi-binimoy.pages.dev/#cadastral-map-explorer")
    
    # Map Canvas Area (Left & Center)
    map_bg = Rectangle((0.016, 0.021), 0.684, 0.844, facecolor='#f1f5f9', edgecolor='none', zorder=2)
    ax.add_patch(map_bg)
    
    # 500m Survey Grid Lines
    for gx in np.linspace(0.04, 0.68, 9):
        ax.axvline(gx, color='#cbd5e1', linestyle='--', linewidth=0.7, zorder=3)
    for gy in np.linspace(0.05, 0.84, 7):
        ax.axhline(gy, color='#cbd5e1', linestyle='--', linewidth=0.7, zorder=3)
        
    # Coordinate Callout
    ax.text(0.03, 0.84, "EPSG:32646 (UTM 46N) • 26°08'42\"N, 91°47'18\"E • Dispur Circle", fontsize=7.5, color='#64748b', zorder=4)
    
    # Render Vector Cadastral Polygons
    polys = [
        # (Points, Fill, Stroke, Label, Area, Status)
        ([(0.08, 0.48), (0.24, 0.52), (0.26, 0.76), (0.10, 0.72)], '#dcfce7', '#16a34a', "Dag 241\n(GOLD)\n1B-2K-10L", 0.17, 0.62),
        ([(0.26, 0.52), (0.42, 0.55), (0.44, 0.78), (0.28, 0.76)], '#e0e7ff', '#4f46e5', "Dag 512\n(SILVER)\n2B-1K-0L", 0.35, 0.65),
        ([(0.44, 0.55), (0.60, 0.58), (0.62, 0.80), (0.46, 0.78)], '#fef3c7', '#d97706', "Dag 804\n(COND)\n0B-4K-15L", 0.53, 0.67),
        ([(0.10, 0.22), (0.26, 0.25), (0.24, 0.46), (0.08, 0.44)], '#f1f5f9', '#94a3b8', "Dag 1029\n(Unlisted)\n1B-0K-0L", 0.17, 0.34),
        ([(0.28, 0.25), (0.46, 0.28), (0.44, 0.50), (0.26, 0.48)], '#fee2e2', '#dc2626', "Dag 145\n(TRIBAL)\n3B-0K-0L", 0.36, 0.37),
        ([(0.48, 0.28), (0.64, 0.31), (0.62, 0.53), (0.46, 0.51)], '#dcfce7', '#16a34a', "Dag 618\n(GOLD)\n1B-3K-5L", 0.55, 0.40),
    ]
    
    for pts, fc, ec, lbl, cx, cy in polys:
        poly = Polygon(pts, closed=True, facecolor=fc, edgecolor=ec, linewidth=1.8, alpha=0.9, zorder=4)
        ax.add_patch(poly)
        ax.text(cx, cy, lbl, ha='center', va='center', fontsize=7.5, fontweight='bold', color='#0f172a', zorder=5)
        
    # Layer Switcher Tool (Floating on Top Right of Map)
    layer_box = FancyBboxPatch((0.48, 0.70), 0.20, 0.14, boxstyle="round,pad=0.005,rounding_size=0.01",
                               facecolor='#ffffff', edgecolor='#cbd5e1', linewidth=1.5, zorder=6)
    ax.add_patch(layer_box)
    ax.text(0.49, 0.815, "MAP LAYERS & CADASTRAL OVERLAYS", fontsize=7, fontweight='bold', color='#0f172a', zorder=7)
    layers_list = [("● CartoDB Positron (Active)", '#059669', True),
                   ("○ Esri World Satellite Imagery", '#475569', False),
                   ("○ Dark Matter (Night Cadastre)", '#475569', False),
                   ("☑ 500m Survey Grid Snapping", '#1d4ed8', True)]
    for idx, (ltxt, lcol, chk) in enumerate(layers_list):
        ax.text(0.49, 0.785 - idx*0.024, ltxt, fontsize=6.5, color=lcol, fontweight='bold' if chk else 'normal', zorder=7)

    # Right Sidebar: Selected Parcel Detail Card & Actions
    sb = Rectangle((0.70, 0.021), 0.284, 0.844, facecolor='#ffffff', edgecolor='#cbd5e1', linewidth=1.0, zorder=3)
    ax.add_patch(sb)
    
    ax.text(0.715, 0.835, "PARCEL DUE DILIGENCE DOSSIER", fontsize=9.5, fontweight='bold', color='#065f46', zorder=4)
    ax.text(0.715, 0.815, "Official Jamabandi & Cadastral Vector Record", fontsize=7, color='#64748b', zorder=4)
    
    # Badge Chip
    badge = FancyBboxPatch((0.715, 0.765), 0.25, 0.038, boxstyle="round,pad=0.004,rounding_size=0.008",
                           facecolor='#065f46', edgecolor='#10b981', linewidth=1.2, zorder=4)
    ax.add_patch(badge)
    ax.text(0.84, 0.784, "★ GOLD VERIFIED TITLE • SCORE 95/100", ha='center', va='center', fontsize=7.5, fontweight='bold', color='#ffffff', zorder=5)
    
    # Attribute Table Card
    attr_box = FancyBboxPatch((0.715, 0.35), 0.25, 0.395, boxstyle="round,pad=0.005,rounding_size=0.01",
                              facecolor='#f8fafc', edgecolor='#e2e8f0', linewidth=1.0, zorder=4)
    ax.add_patch(attr_box)
    
    attrs = [
        ("Dag No / Patta No", "Dag 241 / KP-108"),
        ("Revenue Mouza", "Beltola Mouza (Dispur)"),
        ("Tenure Type", "Periodic (Khiraj Myadi)"),
        ("Recorded Area", "1 Bigha - 2 Katha - 10 Lesa"),
        ("Metric Surface Area", "2,006.70 sq. meters"),
        ("Spatial Variance", "1.18% (Tolerance <5%) [PASS]"),
        ("Land Class", "Basti (Residential)"),
        ("Circle Zonal Rate", "₹85,00,000 / Bigha"),
        ("Voluntary Asking Price", "₹1,45,00,000 (₹96.6L/B)"),
        ("Fair Value Index", "1.14x (+13.7% PWD Premium)")
    ]
    for i, (k, v) in enumerate(attrs):
        y = 0.72 - i * 0.036
        ax.text(0.725, y, k, fontsize=6.8, color='#64748b', zorder=5)
        ax.text(0.955, y, v, fontsize=6.8, fontweight='bold', color='#0f172a', ha='right', zorder=5)
        ax.axhline(y - 0.008, xmin=0.725, xmax=0.955, color='#e2e8f0', linewidth=0.5, zorder=5)
        
    # Action Buttons
    btn1 = FancyBboxPatch((0.715, 0.26), 0.25, 0.065, boxstyle="round,pad=0.005,rounding_size=0.01",
                          facecolor='#059669', edgecolor='#047857', linewidth=1.5, zorder=4)
    ax.add_patch(btn1)
    ax.text(0.84, 0.292, "ENTER BUYER DEAL ROOM ➔", ha='center', va='center', fontsize=8.5, fontweight='bold', color='#ffffff', zorder=5)
    
    btn2 = FancyBboxPatch((0.715, 0.18), 0.25, 0.060, boxstyle="round,pad=0.005,rounding_size=0.01",
                          facecolor='#eff6ff', edgecolor='#3b82f6', linewidth=1.2, zorder=4)
    ax.add_patch(btn2)
    ax.text(0.84, 0.210, "📄 Download Title Due-Diligence Certificate", ha='center', va='center', fontsize=7.2, fontweight='bold', color='#1d4ed8', zorder=5)
    
    # Bottom Disclaimer Callout
    ax.text(0.84, 0.08, "STATUTORY NOTE: Voluntary listing under ALRR 1886.\nPre-cleared for expedited 72-hr Circle Sale NOC.",
            ha='center', va='center', fontsize=6.5, color='#475569', linespacing=1.2, zorder=4)
            
    save_ui(fig, "ui_01_cadastral_webgis")

# ------------------------------------------------------------------------------
# UI-02: Buyer Deal Room & 8-Point Due-Diligence Audit
# ------------------------------------------------------------------------------
def render_ui_02():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_CANVAS)
    fig.patch.set_facecolor(BG_CANVAS)
    ax.axis('off')
    
    draw_browser_chrome(ax, "https://bhumi-binimoy.pages.dev/#buyer-deal-room?listing=ALE-KAM-DIS-2026-0042")
    
    # Header Banner inside view
    top_card = FancyBboxPatch((0.03, 0.77), 0.94, 0.08, boxstyle="round,pad=0.008,rounding_size=0.012",
                              facecolor='#f8fafc', edgecolor='#cbd5e1', linewidth=1.2, zorder=2)
    ax.add_patch(top_card)
    ax.text(0.05, 0.825, "BUYER DEAL ROOM • LISTING #ALE-KAM-DIS-2026-0042", fontsize=10, fontweight='bold', color='#065f46', zorder=3)
    ax.text(0.05, 0.800, "Dag 241, Patta KP-108, Beltola Mouza, Dispur Revenue Circle • 1 Bigha, 2 Katha, 10 Lesa", fontsize=7.5, color='#64748b', zorder=3)
    ax.text(0.95, 0.812, "GOLD VERIFIED (SCORE 95/100)", ha='right', fontsize=9, fontweight='bold', color='#059669', zorder=3)
    
    # Left Column: Strict Separation of Truth
    left_box = FancyBboxPatch((0.03, 0.04), 0.45, 0.71, boxstyle="round,pad=0.01,rounding_size=0.015",
                              facecolor='#ffffff', edgecolor='#cbd5e1', linewidth=1.5, zorder=2)
    ax.add_patch(left_box)
    ax.text(0.05, 0.715, "STRICT SEPARATION OF TRUTH", fontsize=9.5, fontweight='bold', color='#1e293b', zorder=3)
    ax.text(0.05, 0.690, "Statutory demarcation between Immutable Govt Data & Seller Representations", fontsize=7, color='#64748b', zorder=3)
    
    # Gov Verified Subcard
    gov_sub = FancyBboxPatch((0.045, 0.38), 0.42, 0.285, boxstyle="round,pad=0.006,rounding_size=0.01",
                             facecolor='#f0fdf4', edgecolor='#86efac', linewidth=1.2, zorder=3)
    ax.add_patch(gov_sub)
    ax.text(0.06, 0.635, "IMMUTABLE GOVERNMENT-VERIFIED PARTICULARS (STATE RECORDS)", fontsize=7.5, fontweight='bold', color='#065f46', zorder=4)
    g_rows = [
        ("Jamabandi RoR (Dharitree):", "Khiraj Myadi (Periodic) • Basti Classification"),
        ("Bhudakshya Vector GIS Area:", "2,006.70 sq.m (Area Variance 1.18% PASS)"),
        ("e-Panjeeyan SRO Search:", "Zero active mortgages/liens across 12 years"),
        ("e-Khajana Touzi Status:", "Current FY fully settled (Challan #GRAS-9812)"),
        ("Chapter X Tribal Protection:", "Non-Tribal Belt/Block zone (Unrestricted)")
    ]
    for i, (k, v) in enumerate(g_rows):
        y = 0.605 - i * 0.044
        ax.text(0.06, y, k, fontsize=6.8, color='#475569', zorder=4)
        ax.text(0.45, y, v, fontsize=6.8, fontweight='bold', color='#065f46', ha='right', zorder=4)
        
    # Seller Claims Subcard
    sell_sub = FancyBboxPatch((0.045, 0.06), 0.42, 0.295, boxstyle="round,pad=0.006,rounding_size=0.01",
                              facecolor='#eff6ff', edgecolor='#93c5fd', linewidth=1.2, zorder=3)
    ax.add_patch(sell_sub)
    ax.text(0.06, 0.325, "SELLER REPRESENTATIONS & VALUE-ADD ATTRIBUTES", fontsize=7.5, fontweight='bold', color='#1d4ed8', zorder=4)
    s_rows = [
        ("Voluntary Asking Price:", "₹1,45,00,000 (₹96.67 Lakh / Bigha)"),
        ("Official Zonal Rate Floor:", "₹85,00,000 / Bigha (Dispur Basti Baseline)"),
        ("Fair Market Value Premium:", "+13.7% above circle rate (Reasonable)"),
        ("Physical Access & Frontage:", "30-foot direct PWD asphalt road connection"),
        ("Topography & Drainage:", "High elevated plot, zero waterlogging in monsoon")
    ]
    for i, (k, v) in enumerate(s_rows):
        y = 0.295 - i * 0.044
        ax.text(0.06, y, k, fontsize=6.8, color='#475569', zorder=4)
        ax.text(0.45, y, v, fontsize=6.8, fontweight='bold', color='#1e3a8a', ha='right', zorder=4)
        
    # Right Column: 8-Point Due-Diligence Audit & EOI Action
    right_box = FancyBboxPatch((0.51, 0.04), 0.46, 0.71, boxstyle="round,pad=0.01,rounding_size=0.015",
                               facecolor='#ffffff', edgecolor='#cbd5e1', linewidth=1.5, zorder=2)
    ax.add_patch(right_box)
    ax.text(0.53, 0.715, "8-POINT STATUTORY DUE DILIGENCE AUDIT", fontsize=9.5, fontweight='bold', color='#065f46', zorder=3)
    ax.text(0.53, 0.690, "Real-time algorithmic reconciliation under ALRR 1886 provisions", fontsize=7, color='#64748b', zorder=3)
    
    chk_rows = [
        ("CHK-1: Periodic Patta Tenure", "Periodic Khiraj Myadi alienability confirmed", "[PASS 20/20]"),
        ("CHK-2: Area Variance Check", "|Bhudakshya - Jamabandi| = 1.18% <= 5%", "[PASS 15/15]"),
        ("CHK-3: Co-Sharer Partition", "Sole Pattadar Biren Kalita (100% share)", "[PASS 15/15]"),
        ("CHK-4: e-Khajana Revenue Arrears", "Touzi balance ₹0; e-Receipt verified", "[PASS 10/10]"),
        ("CHK-5: e-Panjeeyan SRO Search", "Zero encumbrances or bank hypothecations", "[PASS 15/15]"),
        ("CHK-6: Revenue Court Stays", "No lis pendens or civil injunctions", "[PASS 10/10]"),
        ("CHK-7: Chapter X Tribal Belt", "Not within notified Tribal Belt/Block", "[PASS 10/10]"),
        ("CHK-8: Eco & Reserve Buffer", "Zero overlap with VGR, PGR, or wetland", "[PASS 5/5]")
    ]
    for i, (t, d, s) in enumerate(chk_rows):
        y = 0.645 - i * 0.042
        ax.text(0.53, y, f"✓ {t}:", fontsize=7, fontweight='bold', color='#065f46', zorder=4)
        ax.text(0.72, y, d, fontsize=6.8, color='#334155', zorder=4)
        ax.text(0.95, y, s, fontsize=7, fontweight='bold', color='#059669', ha='right', zorder=4)
        ax.axhline(y - 0.010, xmin=0.53, xmax=0.95, color='#f1f5f9', linewidth=0.5, zorder=4)
        
    # Transaction Deal Room Action Card
    eoi_box = FancyBboxPatch((0.525, 0.06), 0.43, 0.22, boxstyle="round,pad=0.008,rounding_size=0.012",
                             facecolor='#f8fafc', edgecolor='#cbd5e1', linewidth=1.2, zorder=3)
    ax.add_patch(eoi_box)
    ax.text(0.54, 0.245, "SUBMIT EXPRESSION OF INTEREST (EOI) & ESCROW TOKEN", fontsize=8, fontweight='bold', color='#1e293b', zorder=4)
    ax.text(0.54, 0.220, "State-facilitated escrow deposit • Zero private broker cuts (Save ₹7.25 Lakh)", fontsize=6.8, color='#059669', zorder=4)
    
    # Offer input mock
    off_box = FancyBboxPatch((0.54, 0.14), 0.24, 0.055, boxstyle="round,pad=0.004,rounding_size=0.006",
                             facecolor='#ffffff', edgecolor='#94a3b8', linewidth=1.0, zorder=4)
    ax.add_patch(off_box)
    ax.text(0.55, 0.165, "Offer: ₹ 1,42,00,000", fontsize=8, fontweight='bold', color='#0f172a', va='center', zorder=5)
    
    btn_eoi = FancyBboxPatch((0.79, 0.14), 0.15, 0.055, boxstyle="round,pad=0.004,rounding_size=0.006",
                             facecolor='#059669', edgecolor='#047857', linewidth=1.0, zorder=4)
    ax.add_patch(btn_eoi)
    ax.text(0.865, 0.165, "SUBMIT EOI ➔", fontsize=8, fontweight='bold', color='#ffffff', ha='center', va='center', zorder=5)
    
    ax.text(0.74, 0.09, "🔒 Escrow held in Assam Cyber Treasury (GRAS) • 100% refundable if Title NOC rejected.",
            fontsize=6.5, color='#64748b', ha='center', zorder=4)
            
    save_ui(fig, "ui_02_buyer_deal_room")

# ------------------------------------------------------------------------------
# UI-03: Landowner Voluntary Listing & Dharitree e-KYC Portal
# ------------------------------------------------------------------------------
def render_ui_03():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_CANVAS)
    fig.patch.set_facecolor(BG_CANVAS)
    ax.axis('off')
    
    draw_browser_chrome(ax, "https://bhumi-binimoy.pages.dev/#seller-voluntary-portal")
    
    # Stepper Progress Bar
    step_bar = FancyBboxPatch((0.04, 0.78), 0.92, 0.07, boxstyle="round,pad=0.008,rounding_size=0.01",
                              facecolor='#ffffff', edgecolor='#cbd5e1', linewidth=1.2, zorder=2)
    ax.add_patch(step_bar)
    steps = [("1. Aadhaar e-KYC", True), ("2. Dharitree RoR Fetch", True), ("3. Voluntary Listing Details", True), ("4. Statutory Consent", False)]
    for i, (sn, done) in enumerate(steps):
        x = 0.08 + i * 0.23
        col = '#059669' if done else '#94a3b8'
        ax.text(x, 0.815, f"{'✓' if done else '○'} {sn}", fontsize=8.5, fontweight='bold', color=col, zorder=3)
        if i < 3:
            ax.annotate('', xy=(x + 0.19, 0.815), xytext=(x + 0.15, 0.815),
                        arrowprops=dict(facecolor='#cbd5e1', edgecolor='#cbd5e1', width=1, headwidth=4), zorder=3)
            
    # Main Form Area (Split Left/Right)
    left_p = FancyBboxPatch((0.04, 0.05), 0.44, 0.70, boxstyle="round,pad=0.01,rounding_size=0.015",
                            facecolor='#ffffff', edgecolor='#cbd5e1', linewidth=1.5, zorder=2)
    ax.add_patch(left_p)
    ax.text(0.06, 0.71, "AADHAAR e-KYC & DHARITREE EXTRACTION", fontsize=9.5, fontweight='bold', color='#065f46', zorder=3)
    ax.text(0.06, 0.685, "Authenticated land records extracted directly from official state databases", fontsize=7, color='#64748b', zorder=3)
    
    # Aadhaar Chip
    aadh = FancyBboxPatch((0.06, 0.61), 0.40, 0.055, boxstyle="round,pad=0.005,rounding_size=0.008",
                          facecolor='#f0fdf4', edgecolor='#86efac', linewidth=1.0, zorder=3)
    ax.add_patch(aadh)
    ax.text(0.075, 0.635, "✓ Aadhaar UIDAI e-KYC Verified: Biren Kalita (UID: XXXX-XXXX-4819)", fontsize=7.2, fontweight='bold', color='#065f46', va='center', zorder=4)
    
    # Extracted Details Card
    ext_card = FancyBboxPatch((0.06, 0.20), 0.40, 0.39, boxstyle="round,pad=0.006,rounding_size=0.01",
                              facecolor='#f8fafc', edgecolor='#e2e8f0', linewidth=1.0, zorder=3)
    ax.add_patch(ext_card)
    ax.text(0.075, 0.555, "OFFICIAL DHARITREE RECORD OF RIGHTS (RoR):", fontsize=7.5, fontweight='bold', color='#1e293b', zorder=4)
    ext_rows = [
        ("Revenue Circle:", "Dispur Revenue Circle"),
        ("Revenue Mouza:", "Beltola Mouza"),
        ("Dag Number:", "Dag No. 512 (Georeferenced Vector Polygon)"),
        ("Patta Number & Class:", "Patta KP-84 (Khiraj Myadi / Periodic)"),
        ("Recorded Land Class:", "Basti (Residential)"),
        ("Recorded Jamabandi Area:", "2 Bigha - 1 Katha - 0 Lesa (3,076.9 sq.m)"),
        ("Co-Sharer Partition:", "Sole Recorded Pattadar (100.0% Share)"),
        ("Touzi Revenue Status:", "Paid up to FY2026-27 (Challan #GRAS-9812)")
    ]
    for i, (k, v) in enumerate(ext_rows):
        y = 0.52 - i * 0.038
        ax.text(0.075, y, k, fontsize=6.8, color='#64748b', zorder=4)
        ax.text(0.445, y, v, fontsize=6.8, fontweight='bold', color='#065f46', ha='right', zorder=4)
        
    ax.text(0.26, 0.10, "★ 0% BROKERAGE GUARANTEE: Sell land directly at government fair value.\nZero commission deducted from your proceeds.",
            ha='center', va='center', fontsize=7.2, fontweight='bold', color='#059669', linespacing=1.2, zorder=3)

    # Right Form Panel: Seller Asking Price & Listing Declaration
    right_p = FancyBboxPatch((0.52, 0.05), 0.44, 0.70, boxstyle="round,pad=0.01,rounding_size=0.015",
                             facecolor='#ffffff', edgecolor='#cbd5e1', linewidth=1.5, zorder=2)
    ax.add_patch(right_p)
    ax.text(0.54, 0.71, "LISTING VALUATION & STATUTORY DECLARATION", fontsize=9.5, fontweight='bold', color='#1e293b', zorder=3)
    ax.text(0.54, 0.685, "Transparent price discovery benchmarked against circle zonal gazettes", fontsize=7, color='#64748b', zorder=3)
    
    # Zonal Rate Guide
    z_guide = FancyBboxPatch((0.54, 0.58), 0.40, 0.08, boxstyle="round,pad=0.005,rounding_size=0.01",
                             facecolor='#eff6ff', edgecolor='#93c5fd', linewidth=1.0, zorder=3)
    ax.add_patch(z_guide)
    ax.text(0.555, 0.635, "OFFICIAL DISPUR ZONAL VALUATION FLOOR: ₹ 85,00,000 / Bigha", fontsize=7.5, fontweight='bold', color='#1d4ed8', zorder=4)
    ax.text(0.555, 0.605, "Statutory baseline for your 2.2 Bigha parcel: ₹ 1,87,00,000 minimum registration floor.", fontsize=6.8, color='#3b82f6', zorder=4)
    
    # Asking Price Input
    ax.text(0.54, 0.54, "Enter Voluntary Asking Price (₹):", fontsize=7.5, fontweight='bold', color='#1e293b', zorder=3)
    price_box = FancyBboxPatch((0.54, 0.47), 0.40, 0.055, boxstyle="round,pad=0.004,rounding_size=0.006",
                               facecolor='#f8fafc', edgecolor='#059669', linewidth=1.5, zorder=3)
    ax.add_patch(price_box)
    ax.text(0.555, 0.495, "₹ 2,10,00,000  (₹ 95,45,454 / Bigha • +12.3% above Zonal Baseline)", fontsize=8, fontweight='bold', color='#065f46', va='center', zorder=4)
    
    # Benefits Checklist
    ax.text(0.54, 0.43, "Landowner Benefits in Assam Land Exchange:", fontsize=7.5, fontweight='bold', color='#0f172a', zorder=3)
    bens = [
        "• Direct connection to verified genuine buyers with pre-cleared escrow",
        "• Avoid paying 5% to 10% private broker cut (You save ₹10,50,000!)",
        "• Automated pre-filled Land Sale NOC submission to Dispur Circle Office",
        "• Guaranteed fast-track biometric SRO booking and Basundhara mutation"
    ]
    for idx, b in enumerate(bens):
        ax.text(0.54, 0.395 - idx*0.035, b, fontsize=7, color='#334155', zorder=3)
        
    # Statutory consent box
    c_box = FancyBboxPatch((0.54, 0.17), 0.40, 0.075, boxstyle="round,pad=0.004,rounding_size=0.006",
                           facecolor='#f0fdf4', edgecolor='#86efac', linewidth=1.0, zorder=3)
    ax.add_patch(c_box)
    ax.text(0.555, 0.22, "☑ Statutory Declaration under Assam Land & Revenue Regulation 1886:", fontsize=6.8, fontweight='bold', color='#065f46', zorder=4)
    ax.text(0.555, 0.19, "I hereby voluntarily list Dag 512 and confirm no active civil litigation or undisclosed co-sharers.", fontsize=6.3, color='#047857', zorder=4)
    
    # Submit Button
    s_btn = FancyBboxPatch((0.54, 0.08), 0.40, 0.065, boxstyle="round,pad=0.005,rounding_size=0.01",
                           facecolor='#059669', edgecolor='#047857', linewidth=1.2, zorder=3)
    ax.add_patch(s_btn)
    ax.text(0.74, 0.112, "PUBLISH VOLUNTARY LISTING TO CADASTRAL MAP ➔", ha='center', va='center', fontsize=8.5, fontweight='bold', color='#ffffff', zorder=4)
    
    save_ui(fig, "ui_03_seller_portal")

# ------------------------------------------------------------------------------
# UI-04: 5-Stage Assisted Conveyancing Pipeline Tracker
# ------------------------------------------------------------------------------
def render_ui_04():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_CANVAS)
    fig.patch.set_facecolor(BG_CANVAS)
    ax.axis('off')
    
    draw_browser_chrome(ax, "https://bhumi-binimoy.pages.dev/#assisted-conveyancing?id=TRX-2026-DIS-081")
    
    # Transaction Header Card
    hdr = FancyBboxPatch((0.03, 0.77), 0.94, 0.08, boxstyle="round,pad=0.008,rounding_size=0.012",
                         facecolor='#f8fafc', edgecolor='#cbd5e1', linewidth=1.2, zorder=2)
    ax.add_patch(hdr)
    ax.text(0.05, 0.825, "CONVEYANCING LIFECYCLE • TRANSACTION #TRX-2026-DIS-081", fontsize=10, fontweight='bold', color='#065f46', zorder=3)
    ax.text(0.05, 0.800, "Buyer: Ananya Goswami (Verified)  |  Seller: Biren Kalita (Sole Pattadar)  |  Parcel: Dag 241, Beltola Mouza", fontsize=7.5, color='#64748b', zorder=3)
    ax.text(0.95, 0.812, "CURRENT: STAGE 4 (CIRCLE SALE NOC PENDING)", ha='right', fontsize=8.5, fontweight='bold', color='#d97706', zorder=3)
    
    # 5-Stage Stepper
    step_box = FancyBboxPatch((0.03, 0.65), 0.94, 0.10, boxstyle="round,pad=0.008,rounding_size=0.012",
                              facecolor='#ffffff', edgecolor='#cbd5e1', linewidth=1.5, zorder=2)
    ax.add_patch(step_box)
    
    stages = [
        ("STAGE 1\nVoluntary Listing", "COMPLETED\nJamabandi RoR Verified", '#dcfce7', '#059669', '#065f46'),
        ("STAGE 2\nPrice Discovery", "COMPLETED\n₹1.45 Cr Agreed", '#dcfce7', '#059669', '#065f46'),
        ("STAGE 3\nEscrow Token", "COMPLETED\n₹5.0 Lakh in GRAS", '#dcfce7', '#059669', '#065f46'),
        ("STAGE 4\nCircle Sale NOC", "ACTIVE (DAY 14/30)\nLat Mandal Cleared", '#fef3c7', '#d97706', '#92400e'),
        ("STAGE 5\nDeed & Basundhara", "PENDING\ne-Panjeeyan Slot Ready", '#f1f5f9', '#94a3b8', '#64748b')
    ]
    for idx, (title, sub, bg, ec, tc) in enumerate(stages):
        x = 0.05 + idx * 0.185
        card = FancyBboxPatch((x, 0.665), 0.165, 0.07, boxstyle="round,pad=0.004,rounding_size=0.008",
                              facecolor=bg, edgecolor=ec, linewidth=1.2, zorder=3)
        ax.add_patch(card)
        ax.text(x + 0.082, 0.715, title, ha='center', va='center', fontsize=7.2, fontweight='bold', color=tc, zorder=4)
        ax.text(x + 0.082, 0.680, sub, ha='center', va='center', fontsize=6.2, color='#334155', zorder=4)
        if idx < 4:
            ax.annotate('', xy=(x + 0.185, 0.70), xytext=(x + 0.168, 0.70),
                        arrowprops=dict(facecolor=ec, edgecolor=ec, width=1.5, headwidth=4), zorder=4)
                        
    # Center Document Preview: Pre-filled Circle Land Sale NOC Application
    doc_p = FancyBboxPatch((0.03, 0.04), 0.58, 0.59, boxstyle="round,pad=0.01,rounding_size=0.015",
                           facecolor='#ffffff', edgecolor='#cbd5e1', linewidth=1.5, zorder=2)
    ax.add_patch(doc_p)
    ax.text(0.05, 0.59, "PRE-FILLED STATUTORY LAND SALE NOC (FORM NO. 14A)", fontsize=9, fontweight='bold', color='#1e293b', zorder=3)
    ax.text(0.05, 0.565, "Submitted electronically to Dispur Revenue Circle Officer under ALRR Section 10", fontsize=7, color='#64748b', zorder=3)
    
    # Embedded Paper Document Mock
    doc_sheet = FancyBboxPatch((0.05, 0.06), 0.54, 0.48, boxstyle="square,pad=0.005",
                               facecolor='#fafafa', edgecolor='#cbd5e1', linewidth=1.0, zorder=3)
    ax.add_patch(doc_sheet)
    ax.text(0.32, 0.51, "GOVERNMENT OF ASSAM • OFFICE OF THE CIRCLE OFFICER, DISPUR", ha='center', fontsize=7.5, fontweight='bold', color='#0f172a', zorder=4)
    ax.text(0.32, 0.485, "APPLICATION FOR PERMISSION TO TRANSFER IMMOVABLE PROPERTY (NOC)", ha='center', fontsize=7, color='#475569', zorder=4)
    
    doc_lines = [
        ("Applicant / Transferor:", "Sri Biren Kalita, S/o Late H. Kalita (Aadhaar Verified)"),
        ("Transferee / Purchaser:", "Smti Ananya Goswami, D/o D. Goswami (Aadhaar Verified)"),
        ("Schedule of Land:", "Kamrup Metro District, Dispur Circle, Beltola Mouza"),
        ("Dag No / Patta No:", "Dag No. 241 / Periodic Patta KP-108 (Area: 1B-2K-10L)"),
        ("Consideration Amount:", "₹ 1,45,00,000 (Exceeds Circle Zonal Floor ₹1.275 Cr)"),
        ("Lat Mandal Field Report:", "Physical boundary demarcated. Zero encroachment detected."),
        ("Public Objection Window:", "Notice published on portal. 16 days remaining of 30-day window.")
    ]
    for i, (k, v) in enumerate(doc_lines):
        y = 0.44 - i * 0.038
        ax.text(0.07, y, k, fontsize=6.8, color='#475569', zorder=4)
        ax.text(0.24, y, v, fontsize=6.8, fontweight='bold', color='#0f172a', zorder=4)
        
    ax.text(0.32, 0.12, "DIGITALLY SIGNED & HASHED: SHA256: 7f8a91b... • VERIFIED VIA DISPUR ASDC SERVER",
            ha='center', fontsize=6.5, color='#059669', fontweight='bold', zorder=4)
            
    # Right Sidebar: Milestone Actions & Fee Schedule
    act_p = FancyBboxPatch((0.63, 0.04), 0.34, 0.59, boxstyle="round,pad=0.01,rounding_size=0.015",
                           facecolor='#ffffff', edgecolor='#cbd5e1', linewidth=1.5, zorder=2)
    ax.add_patch(act_p)
    ax.text(0.65, 0.59, "STATUTORY CLEARANCE MILESTONES", fontsize=9, fontweight='bold', color='#065f46', zorder=3)
    ax.text(0.65, 0.565, "Real-time sync with e-Panjeeyan & Basundhara", fontsize=7, color='#64748b', zorder=3)
    
    # Financial breakdown
    fee_box = FancyBboxPatch((0.65, 0.28), 0.30, 0.26, boxstyle="round,pad=0.006,rounding_size=0.01",
                             facecolor='#f8fafc', edgecolor='#e2e8f0', linewidth=1.0, zorder=3)
    ax.add_patch(fee_box)
    ax.text(0.665, 0.51, "TRANSACTION FINANCIAL SCHEDULE:", fontsize=7.5, fontweight='bold', color='#1e293b', zorder=4)
    fees = [
        ("Agreed Purchase Price:", "₹ 1,45,00,000"),
        ("Assam Stamp Duty (6%):", "₹ 8,70,000 (GRAS e-Challan)"),
        ("SRO Registration (2%):", "₹ 2,90,000"),
        ("Govt Facilitation (0.25%):", "₹ 36,250 (Non-tax revenue)"),
        ("Private Broker Fee:", "₹ 0 (SAVED ₹7.25 LAKH)")
    ]
    for i, (k, v) in enumerate(fees):
        y = 0.47 - i * 0.038
        ax.text(0.665, y, k, fontsize=6.8, color='#475569', zorder=4)
        ax.text(0.935, y, v, fontsize=6.8, fontweight='bold', color='#065f46' if 'Broker' in k else '#0f172a', ha='right', zorder=4)
        
    # SRO Appointment Box
    sro_btn = FancyBboxPatch((0.65, 0.17), 0.30, 0.08, boxstyle="round,pad=0.005,rounding_size=0.01",
                             facecolor='#eff6ff', edgecolor='#3b82f6', linewidth=1.2, zorder=3)
    ax.add_patch(sro_btn)
    ax.text(0.80, 0.22, "SCHEDULE e-PANJEEYAN BIOMETRIC SLOT", ha='center', fontsize=7.5, fontweight='bold', color='#1d4ed8', zorder=4)
    ax.text(0.80, 0.19, "Kamrup Metro SRO • Slot reserved upon NOC issue", ha='center', fontsize=6.5, color='#3b82f6', zorder=4)
    
    ax.text(0.80, 0.09, "Straight-Through Mutation: Automatic Basundhara 3.0 RoR\ncreation within 72 hours of deed registration.",
            ha='center', va='center', fontsize=6.8, color='#059669', linespacing=1.2, zorder=3)
            
    save_ui(fig, "ui_04_conveyancing_pipeline")

# ------------------------------------------------------------------------------
# UI-05: Revenue Circle Officer & ASDC Administrative Management Console
# ------------------------------------------------------------------------------
def render_ui_05():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_CANVAS)
    fig.patch.set_facecolor(BG_CANVAS)
    ax.axis('off')
    
    draw_browser_chrome(ax, "https://bhumi-binimoy.pages.dev/#admin-console")
    
    # Admin Masthead inside view
    top_bar = FancyBboxPatch((0.03, 0.77), 0.94, 0.08, boxstyle="round,pad=0.008,rounding_size=0.012",
                             facecolor='#0f172a', edgecolor='#1e293b', linewidth=1.2, zorder=2)
    ax.add_patch(top_bar)
    ax.text(0.05, 0.825, "ASDC ENTERPRISE CONSOLE • DISPUR REVENUE CIRCLE", fontsize=10, fontweight='bold', color='#ffffff', zorder=3)
    ax.text(0.05, 0.800, "Authenticated as: admin@assam.gov.in (Circle Officer & System Administrator)", fontsize=7.5, color='#94a3b8', zorder=3)
    ax.text(0.95, 0.812, "DEMO CREDENTIALS ACTIVE  •  [LOGOUT]", ha='right', fontsize=8, fontweight='bold', color='#34d399', zorder=3)
    
    # 4 Metric Cards
    kpis = [
        ("ACTIVE VOLUNTARY LISTINGS", "142 Parcels", "Dispur & Beltola Mouzas", '#f0fdf4', '#86efac', '#065f46'),
        ("FACILITATED LAND VOLUME", "₹ 42.80 Cr", "Q1-Q2 Pilot Target", '#eff6ff', '#93c5fd', '#1d4ed8'),
        ("STATE FACILITATION REV (0.25%)", "₹ 10.70 Lakh", "Direct Non-Tax Revenue", '#faf5ff', '#d8b4fe', '#6b21a8'),
        ("CITIZEN BROKER SAVINGS", "₹ 2.14 Cr", "Saved at 5% broker cuts", '#ecfdf5', '#a7f3d0', '#047857')
    ]
    for idx, (title, val, sub, bg, ec, tc) in enumerate(kpis):
        x = 0.03 + idx * 0.24
        k_card = FancyBboxPatch((x, 0.65), 0.22, 0.10, boxstyle="round,pad=0.006,rounding_size=0.01",
                                facecolor=bg, edgecolor=ec, linewidth=1.2, zorder=2)
        ax.add_patch(k_card)
        ax.text(x + 0.015, 0.725, title, fontsize=6.8, fontweight='bold', color='#475569', zorder=3)
        ax.text(x + 0.015, 0.690, val, fontsize=11, fontweight='bold', color=tc, zorder=3)
        ax.text(x + 0.015, 0.665, sub, fontsize=6.5, color='#64748b', zorder=3)
        
    # Main Moderation Queue (Left Panel)
    q_box = FancyBboxPatch((0.03, 0.04), 0.58, 0.59, boxstyle="round,pad=0.01,rounding_size=0.015",
                           facecolor='#ffffff', edgecolor='#cbd5e1', linewidth=1.5, zorder=2)
    ax.add_patch(q_box)
    ax.text(0.05, 0.59, "CIRCLE OFFICER LISTING MODERATION QUEUE", fontsize=9, fontweight='bold', color='#1e293b', zorder=3)
    ax.text(0.05, 0.565, "Inspect voluntary seller submissions, verify Jamabandis, and approve for public map", fontsize=7, color='#64748b', zorder=3)
    
    # Table Header
    th = FancyBboxPatch((0.045, 0.515), 0.55, 0.038, boxstyle="square,pad=0.002", facecolor='#e2e8f0', edgecolor='none', zorder=3)
    ax.add_patch(th)
    cols = [("Parcel / Dag", 0.06), ("Seller / Mouza", 0.18), ("8-Pt Score", 0.32), ("Asking vs Zonal", 0.42), ("Decision Action", 0.53)]
    for ch, cx in cols:
        ax.text(cx, 0.533, ch, fontsize=6.8, fontweight='bold', color='#334155', va='center', zorder=4)
        
    q_rows = [
        ("Dag 241 (KP-108)", "Biren Kalita (Beltola)", "95 (GOLD)", "₹1.45 Cr (+13.7%)", "[APPROVED]", '#059669'),
        ("Dag 512 (KP-84)", "J. Barua (Dispur)", "90 (GOLD)", "₹2.10 Cr (+12.3%)", "[APPROVED]", '#059669'),
        ("Dag 804 (AP-12)", "M. Deka (Beltola)", "68 (COND)", "₹85.0 L (Annual Patta)", "[FLAGGED]", '#d97706'),
        ("Dag 145 (KP-30)", "T. Rabha (Tribal Block)", "42 (REST)", "₹1.10 Cr (Protected)", "[REJECTED]", '#dc2626')
    ]
    for idx, (p, s, sc, pr, act, col) in enumerate(q_rows):
        y = 0.47 - idx * 0.048
        bg_r = '#f8fafc' if idx % 2 == 0 else '#ffffff'
        rb = FancyBboxPatch((0.045, y - 0.015), 0.55, 0.042, boxstyle="square,pad=0.002", facecolor=bg_r, edgecolor='#f1f5f9', zorder=3)
        ax.add_patch(rb)
        ax.text(0.06, y + 0.005, p, fontsize=6.8, color='#0f172a', zorder=4)
        ax.text(0.18, y + 0.005, s, fontsize=6.8, color='#334155', zorder=4)
        ax.text(0.32, y + 0.005, sc, fontsize=6.8, fontweight='bold', color='#065f46' if 'GOLD' in sc else col, zorder=4)
        ax.text(0.42, y + 0.005, pr, fontsize=6.8, color='#334155', zorder=4)
        ax.text(0.53, y + 0.005, act, fontsize=6.8, fontweight='bold', color=col, zorder=4)
        
    # Actions Explanation
    ax.text(0.32, 0.26, "Circle Officer Actions: [Approve Listing]  [Flag Discrepancy]  [Put on Hold]  [Reject]",
            ha='center', fontsize=7, fontweight='bold', color='#0f766e', zorder=3)
            
    # Cryptographic Ledger (Bottom Left)
    led_box = FancyBboxPatch((0.045, 0.06), 0.55, 0.17, boxstyle="round,pad=0.006,rounding_size=0.01",
                             facecolor='#0f172a', edgecolor='#1e293b', linewidth=1.0, zorder=3)
    ax.add_patch(led_box)
    ax.text(0.06, 0.20, "CRYPTOGRAPHIC SHA-256 AUDIT TRAIL (IMMUTABLE DISPUR LEDGER):", fontsize=7.2, fontweight='bold', color='#38bdf8', zorder=4)
    led_lines = [
        "BLOCK #0482 | 2026-11-21 11:04:12 UTC | OFFICER: CO_DISPUR_01 | LISTING_APPROVED: Dag 241 | HASH: 9a3f28...b71",
        "BLOCK #0481 | 2026-11-21 09:42:08 UTC | OFFICER: CO_DISPUR_01 | DISCREPANCY_FLAGGED: Dag 804 (Annual Patta) | HASH: 4e1c90...a32",
        "BLOCK #0480 | 2026-11-20 16:30:55 UTC | OFFICER: SYS_ADMIN | ZONAL_RATE_UPDATED: Beltola Mouza (+5%) | HASH: 18b7f2...e90"
    ]
    for i, ll in enumerate(led_lines):
        ax.text(0.06, 0.165 - i*0.035, ll, fontsize=5.8, color='#94a3b8', fontfamily='monospace', zorder=4)

    # Right Panel: Circle Zonal Rates & Dispute Telemetry
    rp = FancyBboxPatch((0.63, 0.04), 0.34, 0.59, boxstyle="round,pad=0.01,rounding_size=0.015",
                        facecolor='#ffffff', edgecolor='#cbd5e1', linewidth=1.5, zorder=2)
    ax.add_patch(rp)
    ax.text(0.65, 0.59, "CIRCLE ZONAL VALUATION ENGINE", fontsize=9, fontweight='bold', color='#065f46', zorder=3)
    ax.text(0.65, 0.565, "Kamrup Metro Gazetted Valuation Floors (₹/Bigha)", fontsize=7, color='#64748b', zorder=3)
    
    z_rates = [
        ("Dispur Mouza (Basti):", "₹ 85,00,000 / Bigha"),
        ("Beltola Mouza (Basti):", "₹ 78,00,000 / Bigha"),
        ("Sonapur Mouza (Agri/Bari):", "₹ 24,00,000 / Bigha"),
        ("North Guwahati (Comm):", "₹ 92,00,000 / Bigha"),
        ("Panbari Mouza (Faringati):", "₹ 18,00,000 / Bigha")
    ]
    for i, (m, r) in enumerate(z_rates):
        y = 0.52 - i * 0.038
        ax.text(0.65, y, m, fontsize=7, color='#334155', zorder=3)
        ax.text(0.95, y, r, fontsize=7, fontweight='bold', color='#1d4ed8', ha='right', zorder=3)
        
    # Dispute Alert Center
    d_box = FancyBboxPatch((0.65, 0.06), 0.30, 0.24, boxstyle="round,pad=0.006,rounding_size=0.01",
                           facecolor='#fff1f2', edgecolor='#fda4af', linewidth=1.2, zorder=3)
    ax.add_patch(d_box)
    ax.text(0.665, 0.265, "DISPUTE & FRAUD ALERT CENTER", fontsize=7.5, fontweight='bold', color='#9f1239', zorder=4)
    alerts = [
        ("• Area Discrepancy Alert:", "Dag 912 variance 7.4% (>5% limit)"),
        ("• Chapter X Protected Zone:", "Dag 145 transfer blocked (Tribal Block)"),
        ("• Co-Sharer Dispute Notice:", "Dag 331 unpartitioned objection pending"),
        ("• Zero False Positives:", "100% statutory filtering before public view")
    ]
    for i, (k, v) in enumerate(alerts):
        y = 0.225 - i * 0.038
        ax.text(0.665, y, k, fontsize=6.8, fontweight='bold', color='#881337', zorder=4)
        ax.text(0.935, y, v, fontsize=6.5, color='#4c0519', ha='right', zorder=4)
        
    save_ui(fig, "ui_05_admin_console")

# ------------------------------------------------------------------------------
# UI-06: Interactive Tutorial & Citizen Onboarding Modal
# ------------------------------------------------------------------------------
def render_ui_06():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_CANVAS)
    fig.patch.set_facecolor(BG_CANVAS)
    ax.axis('off')
    
    draw_browser_chrome(ax, "https://bhumi-binimoy.pages.dev/#platform-tutorial-guide")
    
    # Semi-transparent overlay backdrop
    scrim = Rectangle((0.016, 0.021), 0.968, 0.844, facecolor='#0f172a', alpha=0.6, zorder=2)
    ax.add_patch(scrim)
    
    # Modal Window Container
    modal = FancyBboxPatch((0.10, 0.06), 0.80, 0.76, boxstyle="round,pad=0.01,rounding_size=0.018",
                           facecolor='#ffffff', edgecolor='#059669', linewidth=2.0, zorder=3)
    ax.add_patch(modal)
    
    # Modal Header
    m_hdr = FancyBboxPatch((0.10, 0.74), 0.80, 0.08, boxstyle="round,pad=0.005,rounding_size=0.015",
                           facecolor='#f8fafc', edgecolor='#cbd5e1', linewidth=1.0, zorder=4)
    ax.add_patch(m_hdr)
    ax.text(0.13, 0.795, "BHUMIBINIMOY (Assam Land Exchange) - COMPREHENSIVE PLATFORM GUIDE & TUTORIAL", fontsize=10.5, fontweight='bold', color='#065f46', zorder=5)
    ax.text(0.13, 0.765, "Problem Statement: NESFIC-D-52 • Revenue & Disaster Management Department, Government of Assam", fontsize=7.5, color='#64748b', zorder=5)
    ax.text(0.87, 0.78, "✕ Close", ha='right', fontsize=9, fontweight='bold', color='#94a3b8', zorder=5)
    
    # 4 Main Tabs
    tab_list = [
        ("1. What the Application Is", True),
        ("2. How to Use the Application", False),
        ("3. 8-Point Due Diligence", False),
        ("4. Dispur Pilot & Revenue", False)
    ]
    for idx, (tname, is_sel) in enumerate(tab_list):
        tx = 0.12 + idx * 0.19
        t_card = FancyBboxPatch((tx, 0.67), 0.18, 0.050, boxstyle="round,pad=0.004,rounding_size=0.008",
                                facecolor='#059669' if is_sel else '#f1f5f9',
                                edgecolor='#047857' if is_sel else '#cbd5e1', linewidth=1.0, zorder=5)
        ax.add_patch(t_card)
        ax.text(tx + 0.09, 0.695, tname, ha='center', va='center', fontsize=7.5,
                fontweight='bold' if is_sel else 'normal', color='#ffffff' if is_sel else '#475569', zorder=6)
        
    # Modal Body Content: What the Application Is & Problem Context
    body_box = FancyBboxPatch((0.12, 0.09), 0.76, 0.56, boxstyle="round,pad=0.008,rounding_size=0.012",
                              facecolor='#f8fafc', edgecolor='#e2e8f0', linewidth=1.0, zorder=4)
    ax.add_patch(body_box)
    
    # Left Half: The Challenge & The Solution
    ax.text(0.14, 0.61, "THE CORE PROBLEM STATEMENT (NESFIC-D-52)", fontsize=9, fontweight='bold', color='#9f1239', zorder=5)
    prob_p = (
        "Land acquisition in Assam is throttled by unregulated private brokers demanding 5% to 10% cuts,\n"
        "concealing boundary disputes, and generating protracted civil litigation. Buyers lack verified cadastral\n"
        "discovery, while sellers lack a trusted government-facilitated monetization channel."
    )
    ax.text(0.14, 0.54, prob_p, fontsize=7.2, color='#334155', linespacing=1.3, zorder=5)
    
    ax.text(0.14, 0.47, "THE BHUMIBINIMOY GOVERNMENT-VERIFIED SOLUTION", fontsize=9, fontweight='bold', color='#065f46', zorder=5)
    sol_p = (
        "A state-facilitated digital exchange that anchors land discovery directly to Assam's vector cadastral\n"
        "map. Only lawful pattadars verified via Aadhaar and Dharitree can list parcels. Transactions follow\n"
        "an assisted 5-stage conveyancing pipeline, delivering pre-cleared NOCs and automated Basundhara mutation."
    )
    ax.text(0.14, 0.40, sol_p, fontsize=7.2, color='#14532d', linespacing=1.3, zorder=5)
    
    # 5 GovTech Pillars Badges
    ax.text(0.14, 0.33, "5 FOUNDATIONAL REVENUE PILLARS FEDERATED:", fontsize=8, fontweight='bold', color='#0f172a', zorder=5)
    pillars = ["1. Dharitree (RoR)", "2. Bhudakshya (GIS)", "3. e-Panjeeyan (Deeds)", "4. Zonal DB (Valuation)", "5. Basundhara 3.0 (Mutation)"]
    for i, pil in enumerate(pillars):
        px = 0.14 + (i % 3) * 0.14
        py = 0.28 if i < 3 else 0.23
        p_badge = FancyBboxPatch((px, py), 0.13, 0.038, boxstyle="round,pad=0.003,rounding_size=0.006",
                                 facecolor='#ffffff', edgecolor='#10b981', linewidth=1.0, zorder=5)
        ax.add_patch(p_badge)
        ax.text(px + 0.065, py + 0.019, pil, ha='center', va='center', fontsize=6.5, fontweight='bold', color='#065f46', zorder=6)

    # Right Half: 4 Role-Based User Journey Subcards with Direct Action Triggers
    ax.text(0.56, 0.61, "INTERACTIVE ROLE-BASED USER WALKTHROUGHS", fontsize=9, fontweight='bold', color='#1e293b', zorder=5)
    
    roles = [
        ("FOR LAND BUYERS", "Cadastral map search, layer switching, 8-point audit & EOI.", "[Explore Map ➔]", '#eff6ff', '#3b82f6', '#1d4ed8'),
        ("FOR LANDOWNERS (SELLERS)", "Aadhaar e-KYC, Jamabandi auto-fetch & 0% broker fee.", "[List Land ➔]", '#f0fdf4', '#10b981', '#065f46'),
        ("FOR CONVEYANCING", "Track 5-stage lifecycle from token deposit to SRO deed.", "[Open Pipeline ➔]", '#faf5ff', '#a855f7', '#6b21a8'),
        ("FOR REVENUE OFFICIALS", "Demo login, listing moderation & SHA-256 ledger.", "[Admin Login ➔]", '#fff7ed', '#f97316', '#c2410c')
    ]
    for idx, (rt, rd, rbtn, rbg, rborder, rtc) in enumerate(roles):
        ry = 0.53 - idx * 0.10
        rcard = FancyBboxPatch((0.56, ry), 0.30, 0.085, boxstyle="round,pad=0.004,rounding_size=0.008",
                               facecolor=rbg, edgecolor=rborder, linewidth=1.0, zorder=5)
        ax.add_patch(rcard)
        ax.text(0.575, ry + 0.055, rt, fontsize=7.5, fontweight='bold', color=rtc, zorder=6)
        ax.text(0.575, ry + 0.030, rd, fontsize=6.5, color='#475569', zorder=6)
        
        # Button
        b_box = FancyBboxPatch((0.77, ry + 0.020), 0.08, 0.040, boxstyle="round,pad=0.002,rounding_size=0.005",
                               facecolor=rborder, edgecolor='none', zorder=6)
        ax.add_patch(b_box)
        ax.text(0.81, ry + 0.040, rbtn, ha='center', va='center', fontsize=6.2, fontweight='bold', color='#ffffff', zorder=7)
        
    # Modal Bottom Callout
    ax.text(0.50, 0.11, "Empowering Assam Citizens with Transparent, Tamper-Proof Land Governance under NESFIC 2026",
            ha='center', va='center', fontsize=7.2, fontweight='bold', color='#059669', zorder=5)
            
    save_ui(fig, "ui_06_tutorial_modal")

if __name__ == '__main__':
    render_ui_01()
    render_ui_02()
    render_ui_03()
    render_ui_04()
    render_ui_05()
    render_ui_06()
    print("All 6 high-fidelity UI feature panels generated successfully!")
