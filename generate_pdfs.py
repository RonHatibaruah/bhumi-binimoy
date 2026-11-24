import os
import re
from xml.sax.saxutils import escape
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, Image
)
from reportlab.pdfgen import canvas

base_dir = os.path.dirname(os.path.abspath(__file__))
img_dir = os.path.join(base_dir, 'assets', 'proposal_images')

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header (pages after page 1)
        if self._pageNumber > 1:
            self.drawString(54, letter[1] - 36, "Government of Assam • Revenue & Disaster Management Department • NESFIC-D-52")
            self.drawRightString(letter[0] - 54, letter[1] - 36, "BhumiBinimoy (Assam Land Exchange) — Abhishek Satyam")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 45, letter[0] - 54, 45)
        self.drawString(54, 32, "NESFIC 2026 • Problem NESFIC-D-52 • Lead Applicant: Abhishek Satyam (RazorNext Software)")
        self.drawRightString(letter[0] - 54, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def clean_inline_markdown(text):
    if not text:
        return ""
    t = text.strip()
    
    # Protect backtick inline code
    code_matches = []
    def save_code(m):
        code_matches.append(m.group(1))
        return f"__CODE_PH_{len(code_matches)-1}__"
    t = re.sub(r'`([^`]+)`', save_code, t)

    # Protect masked triple asterisks
    t = re.sub(r'\*{3,}', '***', t)

    # Unicode cleanup for Helvetica
    t = t.replace('₹', 'Rs. ')
    t = t.replace('ভূমি বিনিময়', 'BhumiBinimoy')
    t = t.replace('ভূমি স্বাস্থ্য', 'BhumiSwasthya')
    t = t.replace('–', '-').replace('—', ' - ')
    t = t.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')
    t = t.replace('➔', '->').replace('•', '*').replace('✓', '[X]')

    # LaTeX Math Cleanup
    t = re.sub(r'\\left\s*\(', '(', t)
    t = re.sub(r'\\right\s*\)', ')', t)
    t = re.sub(r'\\text\{([^}]+)\}', r'\1', t)
    t = t.replace(r'\%', '%').replace(r'\_', '_').replace(r'\&', '&')
    t = t.replace(r'\times', '&times;').replace(r'\approx', '≈')
    t = re.sub(r'\$([^\$]+)\$', r'<b>\1</b>', t)
    t = t.replace('$', '')

    # Bold & Italic markdown
    t = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'(?<!\*)\*([a-zA-Z0-9][^\*]*?)\*(?!\*)', r'<i>\1</i>', t)

    # Restore code blocks
    for idx, cb in enumerate(code_matches):
        t = t.replace(f"__CODE_PH_{idx}__", f"<b>{escape(cb)}</b>")

    return t

def safe_paragraph(text, style):
    clean = clean_inline_markdown(text)
    try:
        return Paragraph(clean, style)
    except Exception:
        clean = escape(re.sub(r'<[^>]+>', '', clean))
        return Paragraph(clean, style)

def create_styled_table(data_rows, col_widths=None, available_width=490):
    styles = getSampleStyleSheet()
    header_style = ParagraphStyle(
        'THStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#064e3b')
    )
    cell_style = ParagraphStyle(
        'TDStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor('#1e293b')
    )

    num_cols = len(data_rows[0])
    if not col_widths:
        w = available_width / num_cols
        col_widths = [w] * num_cols

    table_data = []
    for r_idx, row in enumerate(data_rows):
        cur_row = []
        for c_idx, cell in enumerate(row):
            st = header_style if r_idx == 0 else cell_style
            cur_row.append(safe_paragraph(cell, st))
        table_data.append(cur_row)

    t = Table(table_data, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('BOTTOMPADDING', (0,0), (-1,0), 4),
        ('TOPPADDING', (0,0), (-1,0), 4),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor('#ffffff'), colors.HexColor('#f8fafc')]),
        ('TOPPADDING', (0,1), (-1,-1), 3),
        ('BOTTOMPADDING', (0,1), (-1,-1), 3),
    ]))
    return t

def parse_markdown_content(raw_lines, available_width=490):
    styles = getSampleStyleSheet()
    h3_style = ParagraphStyle(
        'H3Style', parent=styles['Heading3'], fontName='Helvetica-Bold',
        fontSize=10, leading=13, textColor=colors.HexColor('#064e3b'), spaceBefore=6, spaceAfter=2
    )
    h4_style = ParagraphStyle(
        'H4Style', parent=styles['Heading4'], fontName='Helvetica-Bold',
        fontSize=9, leading=12, textColor=colors.HexColor('#0f766e'), spaceBefore=4, spaceAfter=2
    )
    body_style = ParagraphStyle(
        'BodyStyle', parent=styles['Normal'], fontName='Helvetica',
        fontSize=8, leading=11.5, textColor=colors.HexColor('#1e293b'), spaceAfter=4
    )
    bullet_style = ParagraphStyle(
        'BulletStyle', parent=styles['Normal'], fontName='Helvetica',
        fontSize=8, leading=11, textColor=colors.HexColor('#1e293b'), leftIndent=12, spaceAfter=2
    )
    code_style = ParagraphStyle(
        'CodeStyle', parent=styles['Normal'], fontName='Courier',
        fontSize=6.5, leading=8.5, textColor=colors.HexColor('#0f172a')
    )

    flowables = []
    i = 0
    while i < len(raw_lines):
        line = raw_lines[i].strip()
        if not line:
            i += 1
            continue

        if line.startswith('### '):
            flowables.append(safe_paragraph(line[4:].strip(), h3_style))
            i += 1
            continue

        if line.startswith('#### '):
            flowables.append(safe_paragraph(line[5:].strip(), h4_style))
            i += 1
            continue

        if line.startswith('```'):
            i += 1
            code_lines = []
            while i < len(raw_lines) and not raw_lines[i].strip().startswith('```'):
                code_lines.append(raw_lines[i].rstrip())
                i += 1
            if i < len(raw_lines):
                i += 1

            code_text = "<br/>".join(escape(cl) for cl in code_lines)
            t_code = Table([[Paragraph(code_text, code_style)]], colWidths=[available_width])
            t_code.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
                ('PADDING', (0,0), (-1,-1), 5),
            ]))
            flowables.append(Spacer(1, 3))
            flowables.append(t_code)
            flowables.append(Spacer(1, 5))
            continue

        if line.startswith('|') and line.endswith('|'):
            table_lines = []
            while i < len(raw_lines) and raw_lines[i].strip().startswith('|'):
                table_lines.append(raw_lines[i].strip())
                i += 1

            table_rows = []
            for tl in table_lines:
                if re.match(r'^\|?[\s\-:|]+\|?$', tl):
                    continue
                cells = [c.strip() for c in tl.split('|')[1:-1]]
                if cells:
                    table_rows.append(cells)

            if table_rows:
                flowables.append(Spacer(1, 4))
                flowables.append(create_styled_table(table_rows, available_width=available_width))
                flowables.append(Spacer(1, 5))
            continue

        if line.startswith('- ') or line.startswith('* '):
            flowables.append(safe_paragraph(f"• {line[2:]}", bullet_style))
            i += 1
            continue

        if line[0].isdigit() and len(line) > 2 and line[1:3] in ['. ', ') ']:
            flowables.append(safe_paragraph(line, bullet_style))
            i += 1
            continue

        flowables.append(safe_paragraph(line, body_style))
        i += 1

    return flowables

def add_figure(story, img_filename, caption_text, width=490, height=275.6, caption_style=None):
    img_path = os.path.join(img_dir, img_filename)
    if os.path.exists(img_path):
        story.append(Spacer(1, 4))
        story.append(Image(img_path, width=width, height=height))
        story.append(Spacer(1, 2))
        if caption_text and caption_style:
            story.append(safe_paragraph(caption_text, caption_style))
        story.append(Spacer(1, 6))

def build_proposal_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path, pagesize=letter, leftMargin=54, rightMargin=54, topMargin=54, bottomMargin=54
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=18, leading=22,
        textColor=colors.HexColor('#064e3b'), spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'DocSubTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10.5, leading=14,
        textColor=colors.HexColor('#0f766e'), spaceAfter=8
    )
    meta_style = ParagraphStyle(
        'MetaStyle', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=12, textColor=colors.HexColor('#334155')
    )
    field_title_style = ParagraphStyle(
        'FieldTitle', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=11, leading=15,
        textColor=colors.HexColor('#064e3b'), spaceBefore=8, spaceAfter=4, keepWithNext=True
    )
    caption_style = ParagraphStyle(
        'FigCaption', parent=styles['Normal'], fontName='Helvetica-Oblique',
        fontSize=7.2, leading=9.5, textColor=colors.HexColor('#334155'),
        alignment=1, spaceAfter=4
    )

    story = []
    story.append(safe_paragraph("BHUMIBINIMOY (Assam Land Exchange)", title_style))
    story.append(safe_paragraph("Government-Verified Cadastral Marketplace for Buying and Selling Land", subtitle_style))
    story.append(safe_paragraph("<b>Grant Proposal & Technical Solution Submission Document</b>", subtitle_style))

    meta_data = [
        [safe_paragraph("<b>Problem Statement ID:</b> NESFIC-D-52 (Stream 1)", meta_style), safe_paragraph("<b>Challenge Owner:</b> Rev. & Disaster Mgmt Dept, Assam", meta_style)],
        [safe_paragraph("<b>Lead Applicant:</b> Abhishek Satyam (RazorNext Software Pvt Ltd)", meta_style), safe_paragraph("<b>Platform:</b> Assam Startup (AISF) NESFIC 2026", meta_style)],
        [safe_paragraph("<b>Live Demo:</b> https://bhumi-binimoy.pages.dev/", meta_style), safe_paragraph("<b>Status:</b> Working Prototype Verified", meta_style)]
    ]
    t_meta = Table(meta_data, colWidths=[240, 264])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f0fdf4')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#86efac')),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 8))

    proposal_md = os.path.join(base_dir, 'proposal_contents.md')
    with open(proposal_md) as f:
        content = f.read()

    sections = content.split('## Field ')
    for sec in sections[1:]:
        lines = sec.strip().split('\n')
        sec_header = lines[0].strip()
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#059669'), spaceBefore=8, spaceAfter=5))
        story.append(safe_paragraph(f"Field {sec_header}", field_title_style))

        # Embed appropriate figures
        if '1: Problem understanding' in sec_header:
            add_figure(story, 'infographic_01_paradigm_shift.jpg',
                       "<b>Figure 1.1: Paradigm Shift Framework</b> — Transformation from Unregulated Broker Cartels to BhumiBinimoy Government-Verified Exchange.",
                       caption_style=caption_style)
        elif '2: Proposed solution' in sec_header:
            add_figure(story, 'ui_01_cadastral_webgis.jpg',
                       "<b>Prototype View 2.1: Cadastral WebGIS Multi-Layer Explorer</b> — Georeferenced Dag polygons, 500m survey grid, and Gold Verified title attributes in Dispur Circle.",
                       caption_style=caption_style)
            add_figure(story, 'infographic_04_due_diligence_matrix.jpg',
                       "<b>Figure 2.2: 8-Point Statutory Due-Diligence Engine & Verification Badge Matrix</b> under Assam Land & Revenue Regulation (ALRR) 1886.",
                       caption_style=caption_style)
            add_figure(story, 'ui_02_buyer_deal_room.jpg',
                       "<b>Prototype View 2.3: Buyer Deal Room & Strict Separation of Truth</b> — Immutable Government Records side-by-side with Seller Representations and Escrow EOI panel.",
                       caption_style=caption_style)
        elif '3: Technology architecture' in sec_header:
            add_figure(story, 'infographic_02_govtech_federation.jpg',
                       "<b>Figure 3.1: 5 Revenue Pillars Federation Engine</b> — Bi-directional synchrony across Dharitree, Bhudakshya, e-Panjeeyan, Zonal Valuation DB, and e-Khajana.",
                       caption_style=caption_style)
            add_figure(story, 'infographic_06_asdc_cloud_architecture.jpg',
                       "<b>Figure 3.2: ASDC Tier-III Enterprise Cloud Topology & Zero-Trust Security Perimeter</b>.",
                       caption_style=caption_style)
        elif '4: Pilot proposal' in sec_header:
            add_figure(story, 'infographic_07_economic_revenue_model.jpg',
                       "<b>Figure 4.1: Economic Sustainability & State Facilitation Revenue Model</b> (₹7.5 Cr Dispur Pilot to ₹45+ Cr Statewide Expansion).",
                       caption_style=caption_style)
            add_figure(story, 'ui_04_conveyancing_pipeline.jpg',
                       "<b>Prototype View 4.2: 5-Stage Assisted Conveyancing Pipeline</b> — Pre-filled Circle Land Sale NOC, 30-day statutory objection window, and SRO deed booking.",
                       caption_style=caption_style)
        elif '5: Team capabilities' in sec_header:
            add_figure(story, 'ui_05_admin_console.jpg',
                       "<b>Prototype View 5.1: Revenue Circle Officer Management Console</b> — Listing moderation queue, Zonal Rate editor, dispute telemetry, and SHA-256 audit ledger.",
                       caption_style=caption_style)
            add_figure(story, 'infographic_03_conveyancing_state_machine.jpg',
                       "<b>Figure 5.2: Assisted Conveyancing State Machine</b> — Compressing 180-day transaction cycles to <30 days with automated Mission Basundhara 3.0 mutation.",
                       caption_style=caption_style)

        body_flowables = parse_markdown_content(lines[1:], available_width=490)
        story.extend(body_flowables)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated {output_path}")

def build_proof_of_work_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path, pagesize=letter, leftMargin=54, rightMargin=54, topMargin=54, bottomMargin=54
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=18, leading=22,
        textColor=colors.HexColor('#064e3b'), spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'DocSubTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10.5, leading=14,
        textColor=colors.HexColor('#0f766e'), spaceAfter=8
    )
    meta_style = ParagraphStyle(
        'MetaStyle', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=12, textColor=colors.HexColor('#334155')
    )
    h2_style = ParagraphStyle(
        'H2Style', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=11, leading=15,
        textColor=colors.HexColor('#064e3b'), spaceBefore=8, spaceAfter=4, keepWithNext=True
    )

    caption_style = ParagraphStyle(
        'FigCaption', parent=styles['Normal'], fontName='Helvetica-Oblique',
        fontSize=7.2, leading=9.5, textColor=colors.HexColor('#334155'),
        alignment=1, spaceAfter=4
    )

    story = []
    story.append(safe_paragraph("PROOF OF WORK & SOLUTION EVIDENCE DOSSIER", title_style))
    story.append(safe_paragraph("BhumiBinimoy (Assam Land Exchange) - Cadastral Marketplace System", subtitle_style))
    story.append(safe_paragraph("<b>Empirical Test Benchmarks, Prototype Architecture & Data Schemas</b>", subtitle_style))

    meta_data = [
        [safe_paragraph("<b>Challenge ID:</b> NESFIC-D-52 (Stream 1)", meta_style), safe_paragraph("<b>Department:</b> Rev. & Disaster Mgmt, Assam", meta_style)],
        [safe_paragraph("<b>Lead Applicant:</b> Abhishek Satyam (RazorNext Software Pvt Ltd)", meta_style), safe_paragraph("<b>Format:</b> Solution Evidence (PDF < 10 MB)", meta_style)],
        [safe_paragraph("<b>Live Prototype:</b> https://bhumi-binimoy.pages.dev/", meta_style), safe_paragraph("<b>Verification Status:</b> Fully Built & Tested", meta_style)]
    ]
    t_meta = Table(meta_data, colWidths=[240, 264])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#eff6ff')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#93c5fd')),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 8))

    pow_md = os.path.join(base_dir, 'proof_of_work_dossier.md')
    with open(pow_md) as f:
        content = f.read()

    sections = content.split('## ')
    if sections[0].strip():
        story.extend(parse_markdown_content(sections[0].strip().split('\n'), available_width=490))

    for sec in sections[1:]:
        lines = sec.strip().split('\n')
        sec_title = lines[0].strip()
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0284c7'), spaceBefore=8, spaceAfter=5))
        story.append(safe_paragraph(sec_title, h2_style))

        if '1. Executive Summary' in sec_title:
            add_figure(story, 'ui_01_cadastral_webgis.jpg',
                       "<b>Proof of Work View 1.1: Live Cadastral WebGIS Multi-Layer Explorer</b> at https://bhumi-binimoy.pages.dev/.",
                       caption_style=caption_style)
            add_figure(story, 'infographic_01_paradigm_shift.jpg',
                       "<b>Figure 1.2: Comparative Analysis</b> — Fragmented Broker Network vs. BhumiBinimoy Government-Verified Exchange.",
                       caption_style=caption_style)
        elif '2. Live System Architecture' in sec_title:
            add_figure(story, 'infographic_02_govtech_federation.jpg',
                       "<b>Figure 2.1: 5-Pillar GovTech Integration Architecture & BKL Normalization Core</b>.",
                       caption_style=caption_style)
            add_figure(story, 'infographic_06_asdc_cloud_architecture.jpg',
                       "<b>Figure 2.2: ASDC Tier-III Enterprise Zero-Trust Cloud Topology & Security Pipeline</b>.",
                       caption_style=caption_style)
        elif '3. Data Schemas & Separation of Truth' in sec_title:
            add_figure(story, 'ui_02_buyer_deal_room.jpg',
                       "<b>Proof of Work View 3.1: Buyer Deal Room</b> — Enforcing Strict Demarcation between Official Records and Seller Claims.",
                       caption_style=caption_style)
            add_figure(story, 'infographic_05_price_discovery_zonal.jpg',
                       "<b>Figure 3.2: Transparent Price Discovery & Zonal Value Benchmarking Engine</b> (Dispur 1.5 Bigha Acquisition Schedule).",
                       caption_style=caption_style)
        elif '4. 8-Point Title Due-Diligence' in sec_title:
            add_figure(story, 'infographic_04_due_diligence_matrix.jpg',
                       "<b>Figure 4.1: 8-Point Statutory Due-Diligence Matrix & Point Weight Distribution</b> under ALRR 1886.",
                       caption_style=caption_style)
            add_figure(story, 'ui_03_seller_portal.jpg',
                       "<b>Proof of Work View 4.2: Landowner Voluntary Listing Portal</b> — Aadhaar e-KYC and Automated Dharitree Jamabandi RoR Extraction.",
                       caption_style=caption_style)
        elif '5. Assisted Conveyancing' in sec_title:
            add_figure(story, 'infographic_03_conveyancing_state_machine.jpg',
                       "<b>Figure 5.1: 5-Stage Transaction Pipeline Lifecycle & Milestone Verification</b>.",
                       caption_style=caption_style)
            add_figure(story, 'ui_04_conveyancing_pipeline.jpg',
                       "<b>Proof of Work View 5.2: Assisted Conveyancing Tracker</b> — Pre-filled Circle NOC Application and Cyber-Treasury Token Escrow.",
                       caption_style=caption_style)
        elif '6. Performance Benchmarks' in sec_title:
            add_figure(story, 'ui_05_admin_console.jpg',
                       "<b>Proof of Work View 6.1: Revenue Circle Officer ASDC Command Console & Immutable SHA-256 Audit Ledger</b>.",
                       caption_style=caption_style)
            add_figure(story, 'infographic_07_economic_revenue_model.jpg',
                       "<b>Figure 6.2: 3-Phase State Facilitation Non-Tax Revenue Projections</b> (0.25% Transaction Model).",
                       caption_style=caption_style)
        elif '7. Security, Privacy' in sec_title:
            add_figure(story, 'ui_06_tutorial_modal.jpg',
                       "<b>Proof of Work View 7.1: Interactive Platform Tutorial & Citizen Guided Onboarding Modal</b>.",
                       caption_style=caption_style)

        body_flowables = parse_markdown_content(lines[1:], available_width=490)
        story.extend(body_flowables)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated {output_path}")

if __name__ == '__main__':
    proposal_pdf = os.path.join(base_dir, 'NESFIC_D52_Proposal_Abhishek_Satyam.pdf')
    pow_pdf = os.path.join(base_dir, 'NESFIC_D52_Proof_of_Work_Abhishek_Satyam.pdf')
    
    build_proposal_pdf(proposal_pdf)
    build_proof_of_work_pdf(pow_pdf)

    # Also keep sync with legacy name if referenced
    legacy_prop = os.path.join(base_dir, 'NESFIC_D52_Proposal_Ron_Hatibaruah.pdf')
    legacy_pow = os.path.join(base_dir, 'NESFIC_D52_Proof_of_Work_Ron_Hatibaruah.pdf')
    import shutil
    shutil.copy2(proposal_pdf, legacy_prop)
    shutil.copy2(pow_pdf, legacy_pow)
