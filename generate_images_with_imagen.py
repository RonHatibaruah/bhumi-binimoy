#!/usr/bin/env python3
"""
Automated 16:9 Widescreen Technological Infographic Generator using Google Imagen 3.
Powered by the official google-genai SDK (Google Pro / Google AI Studio).
"""

import os
import sys
import io
import argparse
from PIL import Image
from google import genai
from google.genai import types

base_dir = os.path.dirname(os.path.abspath(__file__))
out_dir = os.path.join(base_dir, 'assets', 'proposal_images')
os.makedirs(out_dir, exist_ok=True)

INFOGRAPHICS = [
    {
        "filename": "illustration_ai_workflow.jpg",
        "title": "Hero Command Center Architecture",
        "prompt": (
            "An authoritative, highly detailed 16:9 widescreen technological architectural infographic on a clean "
            "white and light-gray blueprint grid background illustrating ASSAM LAND EXCHANGE (BHUMIBINIMOY): "
            "GOVERNMENT-VERIFIED CADASTRAL MARKETPLACE (NESFIC-D-52). The top header features bold dark navy typography "
            "'ASSAM LAND EXCHANGE (BHUMIBINIMOY)' with subtitle 'Government-Verified Cadastral Marketplace for Buying and Selling Land'. "
            "The visual layout presents an expansive isometric command-center architecture: In the center, a luminous 3D vector cadastral map "
            "of Assam with illuminated Dag parcel boundaries color-coded in emerald green (Gold Verified), cyan (Active Deal), and royal blue "
            "(Survey Boundary). Surrounding the central map are 5 detailed engineered subsystem cards connected via glowing pulse-data conduits: "
            "1) Dharitree RoR (Jamabandi Ownership & Heirs); 2) Bhudakshya WebGIS (Georeferenced Dag Boundaries & DGPS Area); 3) e-Panjeeyan SRO "
            "(Registered Deeds & 12-Year Encumbrance Liens); 4) Zonal Valuation Engine (Gazetted Circle Rates & Fair Value Index); 5) e-Khajana "
            "(Touzi Revenue Clearance & GRAS Receipts). Inset hexagonal and pill metric badges: '100% Verified Title', '0% Broker Commission', "
            "'Dispur Pilot Ready', and '72-Hour Auto-Mutation'. Clean 2D/isometric vector aesthetic, crisp lines, modern corporate palette with "
            "dark navy, cyan, emerald green, amber, and royal blue accents, ultra-sharp engineering typography."
        )
    },
    {
        "filename": "diagram_1_before_after_workflow.jpg",
        "alias": "infographic_01_paradigm_shift.jpg",
        "title": "Paradigm Shift Framework",
        "prompt": (
            "An authoritative 16:9 widescreen comparative technological framework infographic on a clean white and light-gray blueprint grid background "
            "illustrating PARADIGM SHIFT: TRANSFORMATION FROM BROKER INTERMEDIARIES TO GOVERNMENT-VERIFIED CADASTRAL LAND EXCHANGE. The top header "
            "features bold dark navy typography 'PARADIGM SHIFT: BROKER CARTELS VS. GOVERNMENT-VERIFIED EXCHANGE' with subtitle 'Eliminating "
            "Asymmetric Information & Predatory Fees in Assam Land Governance'. The visual presents a side-by-side comparative architecture: "
            "Left Panel (Crimson / Coral Red Accent Card - 'Traditional Broker-Driven Market'): 4 structured dilemma stages with red warning icons: "
            "1. Opaque Classifieds & Street Brokers; 2. Fragmented 90-Day Physical Paper Chasing; 3. Extortionate 5-10% Broker Cuts & Price Inflation; "
            "4. Surprise NOC Halts & Protracted Civil Litigation. Right Panel (Emerald Green & Royal Blue Accent Card - 'Assam Land Exchange (BhumiBinimoy)'): "
            "4 structured milestone stages with green checkmark icons: 1. Cadastral WebGIS Discovery & Voluntary Seller Listings; 2. Instant 8-Point "
            "Statutory Due Diligence Engine; 3. Transparent Zonal Benchmarks & 0% Broker Fee; 4. Assisted Conveyancing & 72-Hour Auto-Mutation. "
            "Center Divider: A glowing directional conduit showing 'Digital Transformation Paradigm Shift'. Top and bottom metric badges: "
            "'0% Broker Fee', '100% Title Confidence', '<30 Day Turnaround', '72-Hour Mutation'. Clean 2D flat vector aesthetic, ultra-sharp typography."
        )
    },
    {
        "filename": "diagram_2_dual_system_reconciliation.jpg",
        "alias": "infographic_02_govtech_federation.jpg",
        "title": "5 Revenue Pillars Federation Engine",
        "prompt": (
            "An authoritative 16:9 widescreen technological systems architecture infographic on a clean white and light-gray blueprint grid background "
            "illustrating INTEGRATED DATA ECOSYSTEM: 5 REVENUE PILLARS FEDERATION ENGINE. The top header features bold dark navy typography "
            "'FEDERATED GOVTECH ARCHITECTURE FOR ASSAM LAND EXCHANGE' with subtitle 'Real-Time Interoperability Hub for Land Records, Cadastral Maps & "
            "Deed Registration'. The center features a high-tech glowing hub labeled 'Assam Land Exchange Core Federation Router' with cryptographic security "
            "shields. Radiating outward are 5 comprehensive, beautifully detailed architectural pillar cards with icons, data streams, and sub-bullet items: "
            "1) Pillar 1: Dharitree (Jamabandi Textual RoR, Pattadar Ownership, Co-Sharer Records - Royal Blue); 2) Pillar 2: Bhudakshya (Cadastral WebGIS "
            "Vector Polygons, DGPS Boundary Coordinates - Cyan); 3) Pillar 3: e-Panjeeyan SRO (Registered Deeds, 12-Year Encumbrance Search, Bank Liens - Purple); "
            "4) Pillar 4: Zonal Valuation Engine (Circle-Wise Gazetted Unit Rates per Bigha, PWD Road Tiers - Emerald Green); 5) Pillar 5: e-Khajana & GRAS "
            "(Touzi Demand, Online Land Revenue Tax Clearance - Amber). Bottom horizontal audit bar: 'SHA-256 Cryptographic Audit Ledger | NIC e-Pramaan "
            "OAuth2 Gateway | Sub-Second Query Latency | Zero-Trust RBAC'. Clean 2D flat vector aesthetic, crisp lines, ultra-sharp typography."
        )
    },
    {
        "filename": "diagram_3_cadastral_anomaly_catalog.jpg",
        "alias": "infographic_03_conveyancing_state_machine.jpg",
        "title": "Assisted Conveyancing State Machine",
        "prompt": (
            "An authoritative 16:9 widescreen deterministic workflow infographic on a clean white and light-gray blueprint grid background illustrating "
            "ASSISTED CONVEYANCING STATE MACHINE: 5-STAGE TRANSACTION PIPELINE. The top header displays bold dark navy typography 'DETERMINISTIC ASSISTED "
            "CONVEYANCING STATE MACHINE' with subtitle 'Step-by-Step Transaction Lifecycle from Voluntary Listing to Mission Basundhara 3.0 Auto-Mutation'. "
            "The visual layout presents 5 sequential, rich horizontal milestone cards connected with glowing directional flow chevrons and step numbers: "
            "Stage 1 (Royal Blue): 'Voluntary Listing & 8-Point Title Audit' (Pattadar e-KYC, Jamabandi Fetch, Algorithmic Scoring); Stage 2 (Cyan): "
            "'Public Cadastral Discovery & EOI' (Interactive WebGIS Dag Polygon, Verified Buyer Offer, Deal Room); Stage 3 (Emerald Green): 'Milestone Token Escrow' "
            "(Protected State Deposit, 0% Private Broker Intermediary); Stage 4 (Amber): 'Circle Officer Sale NOC' (Automated Lat Mandal Field Verification, "
            "Statutory Clearance); Stage 5 (Deep Purple): 'Biometric Deed & 72-Hour Auto-Mutation' (e-Panjeeyan SRO Execution, Mission Basundhara 3.0 RoR Update). "
            "Bottom metric badges: 'Turnaround <30 Days', '0% Broker Fee', '100% Legal Certainty', '72-Hour Auto-Mutation'. Clean 2D flat vector aesthetic, "
            "crisp borders, ultra-sharp engineering typography."
        )
    },
    {
        "filename": "diagram_4_land_health_score_hierarchy.jpg",
        "alias": "infographic_04_due_diligence_matrix.jpg",
        "title": "8-Point Due Diligence Audit Matrix",
        "prompt": (
            "A master institutional engineering due diligence infographic in 16:9 widescreen format on a clean white blueprint background with subtle technical "
            "gridlines illustrating THE 8-POINT STATUTORY DUE DILIGENCE AUDIT MATRIX & VERIFICATION BADGE HIERARCHY. The top header displays bold dark navy "
            "typography 'STATUTORY TITLE DUE DILIGENCE & VERIFICATION MATRIX' with subtitle 'Deterministic Title Auditing Framework under Assam Land and Revenue "
            "Regulation 1886'. The top section presents an 8-card structured verification matrix (arranged in 2 rows of 4 cards) with numerical point weights, "
            "checklist checkboxes, and diagnostic icons: 1. 'Patta Alienability & Tenure Check' (20 Pts, Royal Blue); 2. 'Bhudakshya Cadastral Area Variance <=5%' "
            "(15 Pts, Cyan); 3. 'Co-Sharer Partition & Share Audit' (15 Pts, Teal); 4. 'e-Khajana Revenue Tax Clearance' (10 Pts, Emerald Green); 5. 'e-Panjeeyan "
            "SRO Deed & Bank Lien Search' (15 Pts, Amber); 6. 'Revenue Court Litigation Clearance' (10 Pts, Orange); 7. 'Chapter X Tribal Belt Safeguard' (10 Pts, "
            "Crimson); 8. 'Ecological & PWD Buffer Check' (5 Pts, Slate). Bottom section features 4 distinct horizontal Verification Tier Badges with metallic "
            "shields: 'Gold Verified (90-100 Pts)' in metallic gold; 'Silver Verified (75-89 Pts)' in polished silver; 'Conditional (50-74 Pts)' in amber; "
            "'Restricted (<50 Pts)' in crimson red. Clean 2D flat vector aesthetic, ultra-sharp typography."
        )
    },
    {
        "filename": "diagram_5_lat_mandal_mobile_app.jpg",
        "alias": "infographic_05_price_discovery_zonal.jpg",
        "title": "Price Discovery & Zonal Valuation Engine",
        "prompt": (
            "An authoritative 16:9 widescreen financial-GovTech valuation infographic on a clean white and light-gray blueprint grid background illustrating "
            "TRANSPARENT PRICE DISCOVERY: ZONAL VALUE BENCHMARKING ENGINE. The top header features bold dark navy typography 'TRANSPARENT PRICE DISCOVERY & "
            "ZONAL VALUATION ENGINE' with subtitle 'Eliminating Asymmetric Speculation with Statutorily Grounded Fair Market Value Indices'. Top section displays "
            "3 large comparative vertical columns: 1) Column 1 (Royal Blue Header - 'Official Circle Zonal Rate Floor'): Rate '₹85,00,000 / Bigha', Kamrup Metro "
            "Gazette statutory baseline rate, zero speculative markup; 2) Column 2 (Emerald Green Header - 'Verified Seller Asking Price (BhumiBinimoy)'): Rate "
            "'₹96,66,667 / Bigha', +13.7% verified fair-market premium for 30ft PWD road frontage; 3) Column 3 (Crimson Red Header - 'Traditional Broker Speculative "
            "Quote'): Rate '₹1,30,00,000+ / Bigha', +53% artificial inflation with opaque middleman cuts. Bottom section: Comprehensive Statutory Fee Breakdown Card: "
            "Agreed Price: ₹1.45 Cr | Stamp Duty (6%): ₹8.70 Lakh | Registration (2%): ₹2.90 Lakh | Govt Facilitation Fee (0.25%): ₹36,250 | Broker Fee: ₹0 | "
            "Citizen Savings: ₹7.25 Lakh to ₹14.50 Lakh! Clean 2D flat vector design, dark navy, cyan, emerald green, and amber diagnostic badges, crisp financial typography."
        )
    },
    {
        "filename": "diagram_6_citizen_land_health_certificate.jpg",
        "alias": "infographic_06_asdc_cloud_architecture.jpg",
        "title": "ASDC Enterprise Cloud Architecture",
        "prompt": (
            "A comprehensive 16:9 widescreen engineering architectural stack infographic on a clean white and light-gray blueprint grid background illustrating "
            "DISPUR PILOT & ENTERPRISE CLOUD ARCHITECTURE: ASDC ZERO-TRUST STACK. The top header features bold dark navy typography 'DISPUR REVENUE CIRCLE PILOT & "
            "ASDC ENTERPRISE CLOUD ARCHITECTURE' with subtitle 'Tier-III Assam State Data Centre Zero-Trust Hosting & WebGIS Infrastructure'. The visual layout "
            "presents a 5-tier horizontal enterprise software stack diagram: Tier 1 (Top - Royal Blue): 'Presentation Channels' - Cadastral WebGIS Portal | Buyer "
            "Deal Room | Seller Portal | Revenue Officer Console; Tier 2 (Cyan): 'API Gateway & Zero-Trust Security' - NIC e-Pramaan OAuth2 | Cloud WAF | TLS 1.3 | "
            "SHA-256 Audit Trail | Role-Based Access Control; Tier 3 (Emerald Green): 'Core Microservices Engine' - Vector Tile Map Server (MVT) | 8-Point Due-Diligence "
            "Engine | Zonal Valuation Benchmark | Transaction State Machine; Tier 4 (Purple): 'Federated Integration Gateways' - Dharitree RoR API | Bhudakshya "
            "WebGIS | e-Panjeeyan SRO | e-Khajana GRAS | Mission Basundhara 3.0; Tier 5 (Bottom - Navy / Slate): 'Enterprise Data & Infrastructure' - PostgreSQL 16 + "
            "PostGIS | Redis 7.2 Cluster | ASDC Tier-III High-Availability SAN Storage. Callout metric badges: '99.9% Uptime SLA', 'Sub-Second Tile Rendering', "
            "'TLS 1.3 End-to-End', 'PostGIS Spatial Query <50ms'. Clean 2D flat vector aesthetic, ultra-sharp engineering typography."
        )
    },
    {
        "filename": "diagram_7_enterprise_system_architecture.jpg",
        "alias": "infographic_07_economic_revenue_model.jpg",
        "title": "Economic Sustainability & Revenue Model",
        "prompt": (
            "An authoritative 16:9 widescreen economic roadmap and financial sustainability infographic on a clean white and light-gray blueprint grid background "
            "illustrating ECONOMIC SUSTAINABILITY & STATE FACILITATION REVENUE PROJECTION MODEL. The top header features bold dark navy typography 'ECONOMIC "
            "SUSTAINABILITY & STATE FACILITATION REVENUE MODEL' with subtitle 'Transforming Land Governance into a Self-Funding Revenue Driver for the Government "
            "of Assam'. Main section displays 3 progressive horizontal scaling roadmap cards side by side: Card 1 (Royal Blue Header - 'Phase 1: Dispur Circle Pilot'): "
            "1,500 Facilitated Trades | State Revenue: ₹7.50 Cr (0.25% fee + Stamp duty) | Citizen Savings: ₹15.0 Cr (Avoided Broker Cuts) | Turnaround: <30 Days; "
            "Card 2 (Cyan Header - 'Phase 2: Kamrup Metro Expansion'): 6,00,0 Annual Trades | State Revenue: ₹15.00 Cr / year | Citizen Savings: ₹60.0 Cr | 100% "
            "Self-Funds ASDC Cloud & WebGIS Operations; Card 3 (Emerald Green Header - 'Phase 3: Statewide Assam Rollout'): 35 Districts Expanded | State Revenue: "
            "₹45.00+ Cr / year | Citizen Savings: ₹200+ Cr | Total Elimination of Predatory Land Broker Cartels. Bottom Callout Banner (Gold / Amber Accent): "
            "'The Win-Win Public Value Proposition: Citizens save 5-10% in predatory broker commissions while Assam Government establishes a transparent, self-funding "
            "digital land registry ecosystem.' Clean 2D flat vector aesthetic, high precision, ultra-sharp typography."
        )
    }
]

def main():
    parser = argparse.ArgumentParser(description="Generate 16:9 Infographics using Google Imagen 3.")
    parser.add_argument("--api-key", help="Google GenAI / Gemini API Key for sumanzfilms@gmail.com", default=None)
    args = parser.parse_args()

    api_key = args.api_key or os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        print("ERROR: No Google API Key found.")
        print("Please provide it via --api-key <YOUR_KEY> or export GEMINI_API_KEY='<YOUR_KEY>'")
        sys.exit(1)

    print("Initializing Google GenAI client (Imagen 3)...")
    client = genai.Client(api_key=api_key)

    for idx, item in enumerate(INFOGRAPHICS, start=1):
        filename = item["filename"]
        title = item["title"]
        prompt = item["prompt"]
        out_path = os.path.join(out_dir, filename)

        print(f"\n[{idx}/8] Generating {title} -> {filename}...")
        try:
            result = client.models.generate_images(
                model="imagen-3.0-generate-002",
                prompt=prompt,
                config=types.GenerateImagesConfig(
                    number_of_images=1,
                    aspect_ratio="16:9",
                    output_mime_type="image/jpeg",
                )
            )

            if result.generated_images:
                img_data = result.generated_images[0].image.image_bytes
                image = Image.open(io.BytesIO(img_data))
                image.save(out_path, "JPEG", quality=95)
                print(f"  ✓ Saved {filename} ({os.path.getsize(out_path):,} bytes)")

                # If alias defined, also save alias
                if "alias" in item:
                    alias_path = os.path.join(out_dir, item["alias"])
                    image.save(alias_path, "JPEG", quality=95)
                    print(f"  ✓ Saved alias {item['alias']}")
            else:
                print(f"  ✗ Warning: No image returned for {filename}")

        except Exception as e:
            print(f"  ✗ Error generating {filename}: {e}")

    print("\n--- Image Generation Completed ---")
    print("Recompiling submission PDFs with ReportLab...")
    import subprocess
    subprocess.run([sys.executable, os.path.join(base_dir, "generate_pdfs.py")], check=True)
    print("✓ All PDFs recompiled successfully.")

if __name__ == "__main__":
    main()
