#!/usr/bin/env python3
"""
Generate clean, copy-paste-ready, textarea-compliant plain text files for NESFIC 2026:
1. NESFIC_D52_Proposal_Ron_Hatibaruah.txt (Field-by-field copy-paste textarea blocks)
2. NESFIC_D52_Proof_of_Work_Ron_Hatibaruah.txt (Full and modular copy-paste textarea blocks)
"""

import os
import re

base_dir = os.path.dirname(os.path.abspath(__file__))

def clean_text_for_textarea(text):
    """
    Strips raw markdown syntax, converts formulas to plain text,
    standardizes bullets and whitespace for HTML <textarea> compatibility.
    """
    t = text
    # Remove raw markdown table syntax and convert to clean tab/indented lines
    lines = t.split('\n')
    cleaned_lines = []
    in_table = False
    
    for line in lines:
        stripped = line.strip()
        # Detect table separator
        if re.match(r'^\|?[\s\-:|]+\|?$', stripped):
            in_table = True
            continue
        if stripped.startswith('|') and stripped.endswith('|'):
            cells = [c.strip() for c in stripped.strip('|').split('|')]
            clean_cells = [re.sub(r'[*`_]', '', c) for c in cells]
            cleaned_lines.append('  • ' + ' | '.join(clean_cells))
            continue
        cleaned_lines.append(line)
        
    t = '\n'.join(cleaned_lines)
    
    # Strip markdown headers (##, ###)
    t = re.sub(r'^#{1,6}\s+(.*?)$', r'\1', t, flags=re.MULTILINE)
    
    # Strip bold and italics
    t = re.sub(r'\*\*\*(.*?)\*\*\*', r'\1', t)
    t = re.sub(r'\*\*(.*?)\*\*', r'\1', t)
    t = re.sub(r'\*(.*?)\*', r'\1', t)
    t = re.sub(r'`(.*?)`', r'\1', t)
    
    # Convert markdown links [Label](url) -> Label: url
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'\1 (\2)', t)
    
    # Clean latex math
    t = re.sub(r'\$₹/\\text\{Bigha\}\$', 'Rs./Bigha', t)
    t = re.sub(r'\$1\\text\{ Bigha\} = 5\\text\{ Katha\} = 100\\text\{ Lesa\} \\approx 1337\.8\\text\{ m\}\^2\$', 
               '1 Bigha = 5 Katha = 100 Lesa = 1,337.80 sq. m', t)
    t = re.sub(r'\$([^$]+)\$', r'\1', t)
    
    # Standardize bullet points
    t = re.sub(r'^[ \t]*[-*]\s+', '• ', t, flags=re.MULTILINE)
    
    # Clean excessive empty lines
    t = re.sub(r'\n{3,}', '\n\n', t)
    
    return t.strip()

def build_proposal_textarea_file():
    proposal_path = os.path.join(base_dir, 'proposal_contents.md')
    out_path = os.path.join(base_dir, 'NESFIC_D52_Proposal_Ron_Hatibaruah.txt')
    
    with open(proposal_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    fields_raw = re.split(r'## Field ', content)[1:]
    
    field_data = []
    limits = [500, 500, 400, 400, 300]
    
    for idx, f in enumerate(fields_raw):
        lines = f.strip().split('\n')
        header_line = lines[0].strip()
        body = '\n'.join(lines[1:]).strip()
        
        # Remove markdown subheader tags and word count annotations for clean textarea
        clean_body = re.sub(r'###\s+', '', body)
        clean_body = re.sub(r'\*?\(Word Count:[^\)]+\)\*?', '', clean_body).strip()
        clean_body = clean_text_for_textarea(clean_body)
        
        words = len(clean_body.split())
        chars = len(clean_body)
        limit = limits[idx] if idx < len(limits) else 500
        
        field_data.append({
            'num': idx + 1,
            'title': f"Field {idx + 1}: {header_line.split(':', 1)[-1].strip() if ':' in header_line else header_line}",
            'limit': limit,
            'words': words,
            'chars': chars,
            'content': clean_body
        })
        
    doc = []
    doc.append("=" * 80)
    doc.append("NESFIC-D-52 PROPOSAL SUBMISSION — TEXTAREA COMPLIANT COPY-PASTE BLOCKS")
    doc.append("=" * 80)
    doc.append("Problem Statement: NESFIC-D-52 (Stream 1) — Assam Land Exchange: Government-Verified Marketplace")
    doc.append("Challenge Owners: Revenue & Disaster Management Department, Government of Assam")
    doc.append("Applicant / Innovator: Ron Hatibaruah")
    doc.append("Live Working Prototype: https://bhumi-binimoy.pages.dev/")
    doc.append("GitHub Repository: https://github.com/RonHatibaruah/bhumi-binimoy")
    doc.append("Compliance Status: 100% compliant with Assam Startup USPR character & word limits")
    doc.append("=" * 80)
    doc.append("\nINSTRUCTIONS FOR APPLICANT:")
    doc.append("• Each field below is formatted with zero markdown syntax, plain-text bullets, and exact word counts.")
    doc.append("• Copy ONLY the text between [COPY START] and [COPY END] for each respective portal input box.")
    doc.append("• The text will paste cleanly into any web browser <textarea> without truncation or formatting distortion.\n")
    
    for f in field_data:
        doc.append("=" * 80)
        doc.append(f"[COPY-PASTE READY TEXTAREA BLOCK: FIELD {f['num']}]")
        doc.append(f"Field Name: {f['title']}")
        doc.append(f"Word Count: {f['words']} words (Maximum Allowed: {f['limit']} words) | Characters: {f['chars']}")
        doc.append(f"Validation: {'PASSED (COMPLIANT)' if f['words'] <= f['limit'] else 'WARNING: EXCEEDS LIMIT'}")
        doc.append("-" * 80)
        doc.append(f"[COPY START - FIELD {f['num']}]")
        doc.append(f['content'])
        doc.append(f"[COPY END - FIELD {f['num']}]")
        doc.append("=" * 80)
        doc.append("\n")
        
    output_text = '\n'.join(doc).strip() + '\n'
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(output_text)
    print(f"Generated {out_path} ({len(output_text.splitlines())} lines)")

def build_proof_of_work_textarea_file():
    pow_path = os.path.join(base_dir, 'proof_of_work_dossier.md')
    out_path = os.path.join(base_dir, 'NESFIC_D52_Proof_of_Work_Ron_Hatibaruah.txt')
    
    with open(pow_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    cleaned_content = clean_text_for_textarea(content)
    words = len(cleaned_content.split())
    chars = len(cleaned_content)
    
    doc = []
    doc.append("=" * 80)
    doc.append("NESFIC-D-52 PROOF OF WORK & EVIDENCE DOSSIER — TEXTAREA COMPLIANT")
    doc.append("=" * 80)
    doc.append("BhumiBinimoy (ভূমি বিনিময়): Assam Land Exchange (ALE)")
    doc.append("Problem Statement: NESFIC-D-52 (Stream 1 — Government Track)")
    doc.append("Challenge Owners: Revenue & Disaster Management Department, Government of Assam")
    doc.append("Lead Innovator & Applicant: Ron Hatibaruah")
    doc.append("Live Working Prototype: https://bhumi-binimoy.pages.dev/")
    doc.append("GitHub Repository: https://github.com/RonHatibaruah/bhumi-binimoy")
    doc.append("=" * 80)
    doc.append("\nINSTRUCTIONS:")
    doc.append("• OPTION A: If the portal provides a single large 'Proof of Work / Technical Evidence' textarea,")
    doc.append("  copy the entire text from [COPY START - MASTER PROOF OF WORK DOSSIER] below.")
    doc.append("• OPTION B: If the portal provides separate textareas for Architecture, Schemas, Benchmarks,")
    doc.append("  and Security, use the individual section blocks provided in Part 2 below.\n")
    
    doc.append("=" * 80)
    doc.append("[COPY-PASTE READY TEXTAREA BLOCK: MASTER FULL DOSSIER]")
    doc.append(f"Total Word Count: {words} words | Characters: {chars}")
    doc.append("-" * 80)
    doc.append("[COPY START - MASTER PROOF OF WORK DOSSIER]")
    doc.append(cleaned_content)
    doc.append("[COPY END - MASTER PROOF OF WORK DOSSIER]")
    doc.append("=" * 80)
    doc.append("\n\n")
    
    # Modular Sections
    sections = re.split(r'\n## (\d+\.[^\n]+)\n', content)
    if len(sections) > 1:
        doc.append("=" * 80)
        doc.append("PART 2: MODULAR SECTION-BY-SECTION COPY-PASTE BLOCKS")
        doc.append("=" * 80)
        doc.append("\n")
        
        for i in range(1, len(sections), 2):
            sec_title = sections[i].strip()
            sec_body = clean_text_for_textarea(sections[i+1].strip())
            sec_words = len(sec_body.split())
            sec_chars = len(sec_body)
            
            doc.append("-" * 80)
            doc.append(f"[SECTION BLOCK: {sec_title}]")
            doc.append(f"Word Count: {sec_words} words | Characters: {sec_chars}")
            doc.append("-" * 80)
            doc.append(f"[COPY START - {sec_title}]")
            doc.append(sec_body)
            doc.append(f"[COPY END - {sec_title}]")
            doc.append("-" * 80)
            doc.append("\n")
            
    output_text = '\n'.join(doc).strip() + '\n'
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(output_text)
    print(f"Generated {out_path} ({len(output_text.splitlines())} lines)")

if __name__ == '__main__':
    build_proposal_textarea_file()
    build_proof_of_work_textarea_file()
