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
            self.drawString(54, letter[1] - 36, "Government of Assam • Revenue & Disaster Management Department • NESFIC-D-50")
            self.drawRightString(letter[0] - 54, letter[1] - 36, "BhumiSwasthya — Ron Hatibaruah")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 45, letter[0] - 54, 45)
        self.drawString(54, 32, "NESFIC 2026 Proposal • Problem NESFIC-D-50 • Applicant: Ron Hatibaruah")
        self.drawRightString(letter[0] - 54, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def clean_inline_markdown(text):
    if not text:
        return ""
    t = text.strip()
    
    # 0. Clean Unicode characters not supported by standard PDF Helvetica
    t = t.replace('₹', 'Rs. ')
    t = t.replace('ভূমি স্বাস্থ্য প্ৰমাণপত্ৰ', 'Land Health Certificate')
    t = t.replace('ভূমি স্বাস্থ্য', 'Land Health Assurance')
    t = t.replace('–', '-').replace('—', ' - ')
    t = t.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')
    
    # 1. LaTeX Math Cleanup
    t = re.sub(r'\\left\s*\(', '(', t)
    t = re.sub(r'\\right\s*\)', ')', t)
    t = re.sub(r'\\left\s*\[', '[', t)
    t = re.sub(r'\\right\s*\]', ']', t)
    t = t.replace(r'\left', '').replace(r'\right', '')
    t = t.replace(r'\%', '%').replace(r'\_', '_').replace(r'\&', '&')
    
    t = re.sub(r'\\text\{([^}]+)\}', r'\1', t)
    t = re.sub(r'\\sum_\{i=1\}\^\{?7\}?', '&Sigma;<sub>i=1</sub><sup>7</sup>', t)
    t = re.sub(r'\\sum_\{[^}]+\}', '&Sigma;', t)
    t = re.sub(r'\\sum', '&Sigma;', t)
    t = re.sub(r'\\times', '&times;', t)
    t = re.sub(r'\\cdot', '&middot;', t)
    t = re.sub(r'\\le\b', '≤', t)
    t = re.sub(r'\\ge\b', '≥', t)
    t = re.sub(r'\\ne\b', '≠', t)
    t = re.sub(r'\\approx\b', '≈', t)
    t = re.sub(r'\\max\b', 'max', t)
    t = re.sub(r'\\min\b', 'min', t)
    t = re.sub(r'\$\$', '', t)

    # Subscripts using native ReportLab <sub> tags
    t = re.sub(r'\bw_([0-9a-zA-Z]+)\b', r'w<sub>\1</sub>', t)
    t = re.sub(r'\bp_([0-9a-zA-Z]+)\b', r'p<sub>\1</sub>', t)
    t = re.sub(r'\bD_([0-9a-zA-Z]+)\b', r'D<sub>\1</sub>', t)
    t = re.sub(r'\bS_([0-9a-zA-Z]+)\b', r'S<sub>\1</sub>', t)
    
    # Strip remaining $
    t = re.sub(r'\$([^\$]+)\$', r'<b>\1</b>', t)
    t = t.replace('$', '')

    # 2. Markdown formatting
    # Replace bold **text**
    t = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', t)
    # Replace *italic* or _italic_
    t = re.sub(r'(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)', r'<i>\1</i>', t)
    # Replace `code`
    t = re.sub(r'`([^`]+)`', r'<b>\1</b>', t)
    
    # 3. Clean word count badge markers
    t = re.sub(r'^\*\((.*?)\)\*$', r'\1', t)
    t = re.sub(r'^\((.*?)\)$', r'\1', t)
    
    # 4. Normalize break tags to self-closing <br/>
    t = re.sub(r'<br\s*/?>', '<br/>', t)

    # 5. XML escape while preserving tags: <b>, <i>, <br/>, <sub>, <sup>
    parts = []
    tokens = re.split(r'(</?[bi]>|<br/>|</?sub>|</?sup>)', t)
    for token in tokens:
        if token in ['<b>', '</b>', '<i>', '</i>', '<br/>', '<sub>', '</sub>', '<sup>', '</sup>']:
            parts.append(token)
        else:
            parts.append(escape(token))
    return ''.join(parts)

def safe_paragraph(text, style):
    cleaned = clean_inline_markdown(text)
    return Paragraph(cleaned, style)

def create_styled_table(table_rows, available_width=490, is_budget=False):
    """Converts a 2D list of text cells into a styled ReportLab Table."""
    styles = getSampleStyleSheet()
    header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=colors.white
    )
    cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor('#1e293b')
    )
    bold_cell_style = ParagraphStyle(
        'TableBoldCell',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor('#0f172a')
    )

    num_cols = len(table_rows[0])
    
    # Calculate column widths
    if num_cols == 2:
        col_widths = [available_width * 0.40, available_width * 0.60]
    elif num_cols == 3:
        if is_budget:
            col_widths = [available_width * 0.48, available_width * 0.22, available_width * 0.30]
        else:
            col_widths = [available_width * 0.30, available_width * 0.20, available_width * 0.50]
    elif num_cols == 4:
        col_widths = [available_width * 0.16, available_width * 0.24, available_width * 0.40, available_width * 0.20]
    elif num_cols == 5:
        col_widths = [available_width * 0.18, available_width * 0.16, available_width * 0.14, available_width * 0.26, available_width * 0.26]
    else:
        col_widths = [available_width / num_cols] * num_cols

    flowable_data = []
    for r_idx, row in enumerate(table_rows):
        row_cells = []
        for c_idx, cell in enumerate(row):
            cell_text = cell.strip()
            # Clean loose markdown artifacts from cell
            if cell_text.startswith('|') and cell_text.endswith('|'):
                cell_text = cell_text[1:-1].strip()
            
            if r_idx == 0:
                p = Paragraph(clean_inline_markdown(cell_text), header_style)
            else:
                if c_idx == 0 or 'Total' in cell_text or 'TOTAL' in cell_text:
                    p = Paragraph(clean_inline_markdown(cell_text), bold_cell_style)
                else:
                    p = Paragraph(clean_inline_markdown(cell_text), cell_style)
            row_cells.append(p)
        flowable_data.append(row_cells)

    t = Table(flowable_data, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#064e3b')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')])
    ]))
    return t

def parse_markdown_content(raw_lines, available_width=490):
    """
    Parses a list of markdown lines into ReportLab flowables,
    properly rendering tables, headings, callout boxes, and text without raw markdown.
    """
    styles = getSampleStyleSheet()
    
    h3_style = ParagraphStyle(
        'H3Style',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=6,
        spaceAfter=2,
        keepWithNext=True
    )
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=4
    )
    bullet_style = ParagraphStyle(
        'BulletStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#1e293b'),
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3
    )
    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#065f46'),
        spaceAfter=4
    )
    card_title_style = ParagraphStyle(
        'CardTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#064e3b')
    )
    card_body_style = ParagraphStyle(
        'CardBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.5,
        textColor=colors.HexColor('#1e293b')
    )

    flowables = []
    i = 0
    while i < len(raw_lines):
        line = raw_lines[i].strip()
        if not line:
            i += 1
            continue

        # 1. Word budget callout
        if 'Word Count' in line or 'Word Budget' in line:
            clean_bc = line.replace('*', '').replace('(', '').replace(')', '').strip()
            flowables.append(safe_paragraph(f"<b>Submission Word Budget:</b> {clean_bc}", callout_style))
            flowables.append(Spacer(1, 2))
            i += 1
            continue

        # 2. Markdown Headings
        if line.startswith('### '):
            h_text = line[4:].strip()
            flowables.append(safe_paragraph(h_text, h3_style))
            
            # Embed dedicated high-impact Wireframe images directly below their respective headings
            img_dir = '/Users/kalyan/Downloads/2026/Nov2026/NESFIC2026-Demos/assets/proposal_images'
            if 'Wireframe 1' in h_text:
                wf1 = os.path.join(img_dir, 'wireframe_1_executive_dashboard.jpg')
                if os.path.exists(wf1):
                    flowables.append(Spacer(1, 3))
                    flowables.append(Image(wf1, width=available_width, height=available_width * 9 / 16))
                    flowables.append(Spacer(1, 6))
            elif 'Wireframe 2' in h_text:
                wf2 = os.path.join(img_dir, 'wireframe_2_cadastral_webgis.jpg')
                if os.path.exists(wf2):
                    flowables.append(Spacer(1, 3))
                    flowables.append(Image(wf2, width=available_width, height=available_width * 9 / 16))
                    flowables.append(Spacer(1, 6))
            elif 'Wireframe 3' in h_text:
                wf3 = os.path.join(img_dir, 'wireframe_3_lat_mandal_mobile.jpg')
                if os.path.exists(wf3):
                    flowables.append(Spacer(1, 3))
                    flowables.append(Image(wf3, width=available_width, height=available_width * 9 / 16))
                    flowables.append(Spacer(1, 6))
            elif 'Wireframe 4' in h_text:
                wf4 = os.path.join(img_dir, 'wireframe_4_citizen_certificate.jpg')
                if os.path.exists(wf4):
                    flowables.append(Spacer(1, 3))
                    flowables.append(Image(wf4, width=available_width, height=available_width * 9 / 16))
                    flowables.append(Spacer(1, 6))

            i += 1
            continue
        elif line.startswith('#### '):
            flowables.append(safe_paragraph(line[5:], h3_style))
            i += 1
            continue

        # 3. Standard Markdown Table (e.g. | Header 1 | Header 2 |)
        if line.startswith('|') and i + 1 < len(raw_lines) and ('|---|' in raw_lines[i+1] or '|:--' in raw_lines[i+1] or '|---' in raw_lines[i+1]):
            table_raw_rows = []
            while i < len(raw_lines) and raw_lines[i].strip().startswith('|'):
                cur_line = raw_lines[i].strip()
                # Skip divider rows like |---|---|
                if not re.match(r'^\|[\s:\-]+\|$', cur_line) and not ('|---' in cur_line):
                    # Split cells by pipe
                    cells = [c.strip() for c in cur_line.split('|')[1:-1]]
                    if cells:
                        table_raw_rows.append(cells)
                i += 1
            if len(table_raw_rows) >= 2:
                flowables.append(Spacer(1, 3))
                flowables.append(create_styled_table(table_raw_rows, available_width=available_width))
                flowables.append(Spacer(1, 4))
            continue

        # 4. Code Blocks or ASCII Diagrams (``` ... ``` or +---+)
        if line.startswith('```') or line.startswith('+'):
            block_lines = []
            if line.startswith('```'):
                i += 1
                while i < len(raw_lines) and not raw_lines[i].strip().startswith('```'):
                    block_lines.append(raw_lines[i].strip())
                    i += 1
                if i < len(raw_lines) and raw_lines[i].strip().startswith('```'):
                    i += 1
            else:
                while i < len(raw_lines) and (raw_lines[i].strip().startswith('+') or raw_lines[i].strip().startswith('|') or '│' in raw_lines[i] or '▼' in raw_lines[i]):
                    block_lines.append(raw_lines[i].strip())
                    i += 1

            # Check if this ASCII block is a Budget Table
            budget_rows = []
            is_budget_block = any('BUDGET HEAD' in b for b in block_lines)
            if is_budget_block:
                for bl in block_lines:
                    if '|' in bl and not bl.startswith('+'):
                        cells = [c.strip() for c in bl.split('|')[1:-1]]
                        if cells and len(cells) >= 3 and not all(c == '' for c in cells):
                            budget_rows.append(cells)
                if len(budget_rows) >= 2:
                    flowables.append(Spacer(1, 3))
                    flowables.append(create_styled_table(budget_rows, available_width=available_width, is_budget=True))
                    flowables.append(Spacer(1, 4))
                    continue

            # Check if this ASCII block is a Stage / Step sequence (e.g. Stage 1... Stage 2...)
            stage_cards = []
            cur_stage_title = None
            cur_stage_desc = []
            for bl in block_lines:
                if 'Stage ' in bl and ':' in bl:
                    if cur_stage_title:
                        stage_cards.append((cur_stage_title, "<br/>".join(cur_stage_desc)))
                    parts = bl.split('|')
                    title_text = parts[1].strip() if len(parts) > 1 else bl
                    cur_stage_title = title_text
                    cur_stage_desc = []
                elif cur_stage_title:
                    clean_bl = bl.replace('|', '').replace('+', '').strip()
                    if clean_bl and not clean_bl.startswith('▼') and not clean_bl.startswith('│'):
                        cur_stage_desc.append(clean_bl)
            if cur_stage_title:
                stage_cards.append((cur_stage_title, "<br/>".join(cur_stage_desc)))

            if len(stage_cards) >= 2:
                # Render as a sleek structured table of stages
                stage_table_data = [["DEVELOPMENT STAGE", "KEY ACTIVITIES & TARGET DELIVERABLES"]]
                for st, sd in stage_cards:
                    stage_table_data.append([st, sd])
                flowables.append(Spacer(1, 3))
                flowables.append(create_styled_table(stage_table_data, available_width=available_width))
                flowables.append(Spacer(1, 4))
                continue

            # Check if this ASCII block is Security Safeguards
            if any('SECURITY & SAFETY SAFEGUARDS' in b for b in block_lines):
                safeguards = []
                for bl in block_lines:
                    if '[' in bl and ']' in bl:
                        clean_bl = bl.replace('|', '').strip()
                        safeguards.append(clean_bl)
                if safeguards:
                    sg_table_data = [["MANDATORY SAFEGUARD PILLAR", "OPERATIONAL IMPLEMENTATION & PROTOCOL"]]
                    for sg in safeguards:
                        m = re.match(r'\[(.*?)\](.*)', sg)
                        if m:
                            sg_table_data.append([f"<b>{m.group(1).strip()}</b>", m.group(2).strip()])
                        else:
                            sg_table_data.append(["<b>SAFEGUARD</b>", sg])
                    flowables.append(Spacer(1, 3))
                    flowables.append(create_styled_table(sg_table_data, available_width=available_width))
                    flowables.append(Spacer(1, 4))
                    continue

            # Check if this ASCII block is Team structure
            if any('Ron Hatibaruah' in b for b in block_lines) and any('Senior Geospatial' in b for b in block_lines):
                team_table_data = [
                    ["ROLE & DESIGNATION", "CORE EXPERTISE & RESPONSIBILITY"],
                    ["<b>Ron Hatibaruah</b><br/>Lead Architect", "Full-stack systems architecture, product design, and algorithmic execution. Deep domain knowledge of Assam revenue laws & digital governance."],
                    ["<b>Senior Geospatial Engineer</b><br/>GIS Specialist", "PostGIS, GDAL, spatial indexing, Delaunay triangulation, topology algorithms & coordinate reprojection."],
                    ["<b>Full-Stack WebGIS Engineer</b><br/>Platform Developer", "React, Leaflet, Next.js, FastAPI, Docker, automated CI/CD and secure API integrations."],
                    ["<b>Assam Land Revenue Legal Advisor</b><br/>Domain Specialist", "Retired Circle Officer / Kanungo, ALRR 1886 compliance, Touzi rules, Chapter X tribal protections."]
                ]
                flowables.append(Spacer(1, 3))
                flowables.append(create_styled_table(team_table_data, available_width=available_width))
                flowables.append(Spacer(1, 4))
                continue

            # Check if this ASCII block is Testing Tiers
            if any('Tier 3: Synthetic' in b for b in block_lines):
                test_table_data = [
                    ["TESTING TIER", "TARGET BENCHMARKS & EVALUATION PROTOCOL"],
                    ["<b>Tier 3: Synthetic Stress Testing</b>", "Benchmarking on 500+ heterogeneous Assam Dags across 3 revenue circles.<br/>Sub-second batch screening (500 parcels audited in <1.8 seconds)."],
                    ["<b>Tier 4: Lat Mandal Ground-Truthing</b>", "Verification of flagged parcels using physical GPS & survey measurements.<br/>Assessing field usability, offline PWA synchronization, and report accuracy."]
                ]
                flowables.append(Spacer(1, 3))
                flowables.append(create_styled_table(test_table_data, available_width=available_width))
                flowables.append(Spacer(1, 4))
                continue

            # If it's an ASCII flowchart/architecture diagram that is already represented by an embedded image, skip it!
            if any(term in "".join(block_lines) for term in [
                'DATA INGESTION GATEWAY', 'PARADIGM SHIFT: FROM REACTIVE', 'Audited Dags', 
                'GOVERNMENT OF ASSAM', 'BHUDAKSHYA CADASTRAL MAP', 'LAT MANDAL GROUND VERIFICATION', 
                'LAND RECORD HEALTH CERTIFICATE'
            ]):
                continue

            # Fallback: clean lines into a card box
            cleaned_card_lines = []
            for bl in block_lines:
                cl = bl.replace('|', '').replace('+', '').strip()
                if cl and not cl.startswith('─') and not cl.startswith('│') and not cl.startswith('▼'):
                    cleaned_card_lines.append(cl)
            if cleaned_card_lines:
                card_data = [[safe_paragraph("<br/>".join(cleaned_card_lines), card_body_style)]]
                t_card = Table(card_data, colWidths=[available_width])
                t_card.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
                    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
                    ('PADDING', (0,0), (-1,-1), 6),
                ]))
                flowables.append(t_card)
                flowables.append(Spacer(1, 4))
            continue

        # 5. Mathematical Formula Display Card ($$S = \max ... $$)
        if 'S = \\max' in line or 'S = max' in line or line.startswith('$$S') or line.startswith('$$'):
            formula_card_data = [[
                Paragraph("<b>COMPOSITE LAND HEALTH SCORE (LHS) MATHEMATICAL FORMULATION</b><br/>"
                          "&nbsp;<br/>"
                          "<font size=11 color='#064e3b'><b>S</b> = max(0, 100 - Σ<sub>i=1</sub><sup>7</sup> (w<sub>i</sub> × p<sub>i</sub>))</font>",
                          ParagraphStyle('FormulaDisplay', parent=styles['Normal'], alignment=1, leading=16))
            ]]
            t_form = Table(formula_card_data, colWidths=[available_width])
            t_form.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f0fdf4')),
                ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#059669')),
                ('PADDING', (0,0), (-1,-1), 8),
                ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ]))
            flowables.append(Spacer(1, 4))
            flowables.append(t_form)
            flowables.append(Spacer(1, 6))
            i += 1
            continue

        # 6. Mathematical Parameters Table (- $w_1$ ... - $w_7$)
        if line.startswith('- $w_1$') or line.startswith('- w_1') or line.startswith('- w1'):
            param_rows = [
                ["FACTOR", "WEIGHT (w<sub>i</sub>)", "TRIGGER LOGIC & MATHEMATICAL PENALTY FUNCTION"],
                ["<b>w<sub>1</sub> (Spatial Variance)</b>", "<b>35 pts</b>", "p<sub>1</sub> = 35 if Var > 15%; p<sub>1</sub> = 20 if 5% < Var ≤ 15%; p<sub>1</sub> = 0 if Var ≤ 5%"],
                ["<b>w<sub>2</sub> (Cadastral Overlap)</b>", "<b>35 pts</b>", "p<sub>2</sub> = 35 if ST_Overlaps = True (severe boundary polygon collision)"],
                ["<b>w<sub>3</sub> (Revenue Deficit)</b>", "<b>15 pts</b>", "p<sub>3</sub> = 15 if Revenue ≤ 0 on non-exempt private land"],
                ["<b>w<sub>4</sub> (Tenure Share Drift)</b>", "<b>25 pts</b>", "p<sub>4</sub> = 25 if |Σ Shares - 100%| > 0.01% (unallocated fractional heirs)"],
                ["<b>w<sub>5</sub> (Chapter X Tribal Belt)</b>", "<b>35 pts</b>", "p<sub>5</sub> = 35 if non-protected landholder in protected tribal belt"],
                ["<b>w<sub>6</sub> (Common Land Encroachment)</b>", "<b>40 pts</b>", "p<sub>6</sub> = 40 if private patta on Village Grazing Reserve (VGR) / PGR / Wetland"],
                ["<b>w<sub>7</sub> (Historical Encumbrance)</b>", "<b>15 pts</b>", "p<sub>7</sub> = 15 if unredeemed mortgage or court litigation stay note"]
            ]
            while i < len(raw_lines) and (raw_lines[i].strip().startswith('- $w_') or raw_lines[i].strip().startswith('- w_') or raw_lines[i].strip().startswith('- w')):
                i += 1
            flowables.append(Spacer(1, 3))
            flowables.append(create_styled_table(param_rows, available_width=available_width))
            flowables.append(Spacer(1, 6))
            continue

        # 7. Bullet items (- or *)
        if line.startswith('- ') or line.startswith('* '):
            item_text = line[2:].strip()
            flowables.append(Paragraph(f"• {clean_inline_markdown(item_text)}", bullet_style))
            i += 1
            continue

        # 8. Numbered items (1. , 2. )
        if line[0].isdigit() and len(line) > 2 and line[1:3] in ['. ', ') ']:
            flowables.append(Paragraph(clean_inline_markdown(line), bullet_style))
            i += 1
            continue

        # 9. Standard prose paragraph
        flowables.append(Paragraph(clean_inline_markdown(line), body_style))
        i += 1

    return flowables

def build_proposal_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#064e3b'),
        spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor('#0f766e'),
        spaceAfter=10
    )
    meta_style = ParagraphStyle(
        'MetaStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#334155')
    )
    field_title_style = ParagraphStyle(
        'FieldTitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#064e3b'),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    story = []

    # Title Banner
    story.append(safe_paragraph("BHUMISWASTHYA (Land Health Assurance)", title_style))
    story.append(safe_paragraph("Automated Land Records Health-Check & Anomaly Detection System", subtitle_style))
    story.append(safe_paragraph("<b>Grant Proposal & Technical Solution Submission Document</b>", subtitle_style))
    
    meta_data = [
        [safe_paragraph("<b>Problem Statement ID:</b> NESFIC-D-50 (Stream 1)", meta_style), safe_paragraph("<b>Challenge Owner:</b> Rev. & Disaster Mgmt Dept, Assam", meta_style)],
        [safe_paragraph("<b>Lead Applicant:</b> Ron Hatibaruah", meta_style), safe_paragraph("<b>Platform:</b> Assam Startup (AISF) NESFIC 2026", meta_style)],
        [safe_paragraph("<b>Live Demo:</b> http://localhost:5173/", meta_style), safe_paragraph("<b>Status:</b> Working Prototype Verified", meta_style)]
    ]
    t_meta = Table(meta_data, colWidths=[240, 264])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f0fdf4')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#86efac')),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))

    img_dir = '/Users/kalyan/Downloads/2026/Nov2026/NESFIC2026-Demos/assets/proposal_images'
    with open('/Users/kalyan/Downloads/2026/Nov2026/NESFIC2026-Demos/proposal_contents.md') as f:
        content = f.read()

    sections = content.split('## Field ')
    for sec in sections[1:]:
        lines = sec.strip().split('\n')
        sec_header = lines[0].strip()
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#059669'), spaceBefore=8, spaceAfter=6))
        story.append(safe_paragraph(f"Field {sec_header}", field_title_style))

        # Embed high-impact 16:9 widescreen diagrams
        if '1: Problem understanding' in sec_header:
            img1 = os.path.join(img_dir, 'diagram_1_before_after_workflow.jpg')
            if os.path.exists(img1):
                story.append(Spacer(1, 4))
                story.append(Image(img1, width=490, height=275))
                story.append(Spacer(1, 6))
        elif '2: Proposed solution' in sec_header:
            img2 = os.path.join(img_dir, 'diagram_2_dual_system_reconciliation.jpg')
            if os.path.exists(img2):
                story.append(Spacer(1, 4))
                story.append(Image(img2, width=490, height=275))
                story.append(Spacer(1, 6))
        elif '3: Describe User Journey' in sec_header:
            img5 = os.path.join(img_dir, 'diagram_5_lat_mandal_mobile_app.jpg')
            if os.path.exists(img5):
                story.append(Spacer(1, 4))
                story.append(Image(img5, width=490, height=275))
                story.append(Spacer(1, 6))
        elif '4: Technology & solution architecture' in sec_header:
            img7 = os.path.join(img_dir, 'diagram_7_enterprise_system_architecture.jpg')
            if os.path.exists(img7):
                story.append(Spacer(1, 4))
                story.append(Image(img7, width=490, height=275))
                story.append(Spacer(1, 6))

        # Parse markdown body lines cleanly
        body_flowables = parse_markdown_content(lines[1:], available_width=490)
        story.extend(body_flowables)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated {output_path}")

def build_proof_of_work_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#064e3b'),
        spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor('#0f766e'),
        spaceAfter=10
    )
    meta_style = ParagraphStyle(
        'MetaStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#334155')
    )
    h2_style = ParagraphStyle(
        'H2Style',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=colors.HexColor('#064e3b'),
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    story = []

    story.append(safe_paragraph("PROOF OF WORK & SOLUTION EVIDENCE DOSSIER", title_style))
    story.append(safe_paragraph("BhumiSwasthya (Land Health Assurance) - Cadastral Health Verification System", subtitle_style))
    story.append(safe_paragraph("<b>Empirical Test Benchmarks, Prototype Architecture & Wireframe Evidence</b>", subtitle_style))
    
    meta_data = [
        [safe_paragraph("<b>Challenge ID:</b> NESFIC-D-50 (Stream 1)", meta_style), safe_paragraph("<b>Department:</b> Rev. & Disaster Mgmt, Assam", meta_style)],
        [safe_paragraph("<b>Lead Applicant:</b> Ron Hatibaruah", meta_style), safe_paragraph("<b>Format:</b> Solution Evidence (PDF < 10 MB)", meta_style)],
        [safe_paragraph("<b>Live Prototype:</b> http://localhost:5173/", meta_style), safe_paragraph("<b>Verification Status:</b> Fully Built & Tested", meta_style)]
    ]
    t_meta = Table(meta_data, colWidths=[240, 264])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#eff6ff')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#93c5fd')),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))

    img_dir = '/Users/kalyan/Downloads/2026/Nov2026/NESFIC2026-Demos/assets/proposal_images'
    with open('/Users/kalyan/Downloads/2026/Nov2026/NESFIC2026-Demos/proof_of_work_dossier.md') as f:
        content = f.read()

    # Split by major ## sections
    sections = content.split('\n## ')
    # Header before first ##
    if sections[0].strip():
        story.extend(parse_markdown_content(sections[0].strip().split('\n'), available_width=490))

    for sec in sections[1:]:
        lines = sec.strip().split('\n')
        sec_title = lines[0].strip()
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0284c7'), spaceBefore=8, spaceAfter=5))
        story.append(safe_paragraph(sec_title, h2_style))

        # Embed diagram images below corresponding section titles
        if '1. Problem Statement' in sec_title or 'Problem Statement' in sec_title:
            img1 = os.path.join(img_dir, 'diagram_1_before_after_workflow.jpg')
            if os.path.exists(img1):
                story.append(Spacer(1, 4))
                story.append(Image(img1, width=490, height=275))
                story.append(Spacer(1, 6))

        elif '2. Live System Architecture' in sec_title:
            img7 = os.path.join(img_dir, 'diagram_7_enterprise_system_architecture.jpg')
            if os.path.exists(img7):
                story.append(Spacer(1, 4))
                story.append(Image(img7, width=490, height=275))
                story.append(Spacer(1, 6))
            img2 = os.path.join(img_dir, 'diagram_2_dual_system_reconciliation.jpg')
            if os.path.exists(img2):
                story.append(Spacer(1, 4))
                story.append(Image(img2, width=490, height=275))
                story.append(Spacer(1, 6))

        elif '4. Empirical Test Benchmarks' in sec_title:
            img3 = os.path.join(img_dir, 'diagram_3_cadastral_anomaly_catalog.jpg')
            if os.path.exists(img3):
                story.append(Spacer(1, 4))
                story.append(Image(img3, width=490, height=275))
                story.append(Spacer(1, 6))

        elif '5. Algorithmic Formulation' in sec_title:
            story.append(PageBreak())
            img4 = os.path.join(img_dir, 'diagram_4_land_health_score_hierarchy.jpg')
            if os.path.exists(img4):
                story.append(Spacer(1, 2))
                story.append(Image(img4, width=490, height=175))
                story.append(Spacer(1, 3))

        # Parse markdown body
        body_flowables = parse_markdown_content(lines[1:], available_width=490)
        story.extend(body_flowables)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated {output_path}")

if __name__ == '__main__':
    out_dir = '/Users/kalyan/Downloads/2026/Nov2026/NESFIC2026-Demos'
    proposal_pdf = os.path.join(out_dir, 'NESFIC_D50_Proposal_Ron_Hatibaruah.pdf')
    pow_pdf = os.path.join(out_dir, 'NESFIC_D50_Proof_of_Work_Ron_Hatibaruah.pdf')
    
    build_proposal_pdf(proposal_pdf)
    build_proof_of_work_pdf(pow_pdf)
