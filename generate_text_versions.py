#!/usr/bin/env python3
"""
Generate clean, copy-paste-ready plain text versions of the NESFIC 2026 Submission PDFs:
1. NESFIC_D50_Proposal_Ron_Hatibaruah.txt
2. NESFIC_D50_Proof_of_Work_Ron_Hatibaruah.txt
"""

import re
import os

def format_markdown_table_to_plain_text(table_match):
    lines = [l.strip() for l in table_match.strip().split('\n') if l.strip()]
    if len(lines) < 2:
        return table_match
    
    # Must have a genuine markdown separator in line 1: |---|---|
    if not re.match(r'^\|?[\s\-:|]+\|?$', lines[1]):
        return table_match

    rows = []
    for idx, line in enumerate(lines):
        if idx == 1:
            continue  # Separator line
        cells = [c.strip() for c in line.split('|')]
        # Drop empty leading/trailing cells if line had leading/trailing pipes
        if cells and cells[0] == '':
            cells = cells[1:]
        if cells and cells[-1] == '':
            cells = cells[:-1]
        if cells:
            rows.append(cells)
            
    if not rows:
        return table_match

    # Compute column widths
    num_cols = max(len(r) for r in rows)
    col_widths = [0] * num_cols
    for r in rows:
        for idx, cell in enumerate(r):
            # Strip markdown bold/code from cell for length check
            clean_cell = re.sub(r'<br\s*/?>', ' ', cell, flags=re.IGNORECASE)
            clean_cell = re.sub(r'\s*\n\s*', ' ', re.sub(r'[*`_]', '', clean_cell)).strip()
            col_widths[idx] = max(col_widths[idx], len(clean_cell))

    # Cap max col width to 45 for wrap readability
    col_widths = [max(w, 8) for w in col_widths]

    # Build ASCII formatted table
    sep_line = '+' + '+'.join('-' * (w + 2) for w in col_widths) + '+'
    output_lines = [sep_line]

    for row_idx, r in enumerate(rows):
        padded_cells = []
        for idx in range(num_cols):
            cell_val = r[idx] if idx < len(r) else ''
            clean_val = re.sub(r'<br\s*/?>', ' ', cell_val, flags=re.IGNORECASE)
            clean_val = re.sub(r'[*`_]', '', clean_val)
            clean_val = re.sub(r'\s*\n\s*', ' ', clean_val).strip()
            padded_cells.append(f" {clean_val.ljust(col_widths[idx])} ")
        output_lines.append('|' + '|'.join(padded_cells) + '|')
        if row_idx == 0:  # Header separator
            output_lines.append(sep_line)

    output_lines.append(sep_line)
    return '\n'.join(output_lines)

def convert_md_to_plain_text(content):
    # Process tables first
    table_pattern = re.compile(r'((?:^[ \t]*\|.+?\|[ \t]*\n)+)', re.MULTILINE)
    
    def table_sub(match):
        return '\n' + format_markdown_table_to_plain_text(match.group(1)) + '\n'

    text = table_pattern.sub(table_sub, content)

    # Format Headings
    # Level 1 (# Title)
    text = re.sub(r'^# (.*)$', r'================================================================================\n\1\n================================================================================', text, flags=re.MULTILINE)
    
    # Level 2 (## Field X or ## Section X)
    text = re.sub(r'^## (.*)$', r'\n--------------------------------------------------------------------------------\n\1\n--------------------------------------------------------------------------------', text, flags=re.MULTILINE)
    
    # Level 3 (### Subheading)
    text = re.sub(r'^### (.*)$', r'\n[ \1 ]', text, flags=re.MULTILINE)
    
    # Level 4 (#### Sub-subheading)
    text = re.sub(r'^#### (.*)$', r'\n  ▶ \1', text, flags=re.MULTILINE)

    # Specific HTML tags only - DO NOT use generic <[^>]+> as it strips math inequalities like <100% or <40
    text = re.sub(r'<sub>(.*?)</sub>', r'_\1', text)
    text = re.sub(r'<sup>(.*?)</sup>', r'^\1', text)
    text = re.sub(r'<br\s*/?>', '\n', text)
    text = re.sub(r'</?(?:b|strong|i|em|p|div|span|h[1-6]|ul|ol|li|table|tr|td|th|tbody|thead)[^>]*>', '', text, flags=re.IGNORECASE)

    # Format bold and italics
    text = re.sub(r'\*\*\*(.*?)\*\*\*', r'\1', text)
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    text = re.sub(r'\*(.*?)\*', r'\1', text)
    text = re.sub(r'`(.*?)`', r'\1', text)

    # Clean markdown links [label](url) -> label (url)
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'\1 (\2)', text)

    # Format bullet points
    text = re.sub(r'^\s*[-*]\s+', '  • ', text, flags=re.MULTILINE)

    # Clean excessive empty lines
    text = re.sub(r'\n{3,}', '\n\n', text)

    return text.strip() + '\n'

def generate_text_files():
    base_dir = '/Users/kalyan/Downloads/2026/Nov2026/NESFIC2026-Demos'
    
    # 1. Proposal Text Version
    proposal_md_path = os.path.join(base_dir, 'proposal_contents.md')
    proposal_txt_path = os.path.join(base_dir, 'NESFIC_D50_Proposal_Ron_Hatibaruah.txt')
    
    with open(proposal_md_path, 'r', encoding='utf-8') as f:
        proposal_md = f.read()

    proposal_txt = convert_md_to_plain_text(proposal_md)
    with open(proposal_txt_path, 'w', encoding='utf-8') as f:
        f.write(proposal_txt)
    print(f"Generated {proposal_txt_path} ({len(proposal_txt.splitlines())} lines)")

    # 2. Proof of Work Dossier Text Version
    pow_md_path = os.path.join(base_dir, 'proof_of_work_dossier.md')
    pow_txt_path = os.path.join(base_dir, 'NESFIC_D50_Proof_of_Work_Ron_Hatibaruah.txt')

    with open(pow_md_path, 'r', encoding='utf-8') as f:
        pow_md = f.read()

    pow_txt = convert_md_to_plain_text(pow_md)
    with open(pow_txt_path, 'w', encoding='utf-8') as f:
        f.write(pow_txt)
    print(f"Generated {pow_txt_path} ({len(pow_txt.splitlines())} lines)")

if __name__ == '__main__':
    generate_text_files()
