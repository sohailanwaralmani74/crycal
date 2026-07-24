import os
import re
from gen_finance import build_finance
from gen_construction import build_construction
from gen_automotive import build_automotive
from gen_saas import build_saas
from generate_all_35 import HUB_SUBCATS, base_dir

print("--- RUNNING ALL GENERATORS ---")
build_finance()
build_construction()
build_automotive()
build_saas()
print("--- ALL GENERATORS FINISHED ---")

# VALIDATION AUDIT
print("\n=== PERFORMING STRICT VALIDATION AUDIT ON 35 SUBCATEGORIES ===")

all_files = []
for hub_key, subcats in HUB_SUBCATS.items():
    for cat_id, name, url, icon in subcats:
        all_files.append((hub_key, f"{cat_id}.md", cat_id))

errors = []
warnings = []

for hub_key, fname, cat_id in all_files:
    fpath = os.path.join(base_dir, fname)
    if not os.path.exists(fpath):
        errors.append(f"Missing file: {fname}")
        continue
    
    with open(fpath, "r", encoding="utf-8") as f:
        raw = f.read()
    
    fm_match = re.match(r"^---\n(.*?)\n---\n(.*)$", raw, re.DOTALL)
    if not fm_match:
        errors.append(f"{fname}: Invalid frontmatter structure")
        continue
    
    fm_str, body = fm_match.groups()
    
    # 1. Frontmatter Title & Description check
    title_m = re.search(r'title:\s*"(.*?)"', fm_str)
    if not title_m:
        title_m = re.search(r'title:\s*([^\n]+)', fm_str)
    title_val = title_m.group(1).strip() if title_m else ""
    
    desc_m = re.search(r'description:\s*"(.*?)"', fm_str)
    if not desc_m:
        desc_m = re.search(r'description:\s*([^\n]+)', fm_str)
    desc_val = desc_m.group(1).strip() if desc_m else ""
    
    if len(title_val) > 58:
        errors.append(f"{fname}: title length {len(title_val)} > 58 chars ('{title_val}')")
    
    if len(desc_val) > 155:
        errors.append(f"{fname}: description length {len(desc_val)} > 155 chars ('{desc_val}')")
    
    # Check H1 title
    h1_m = re.search(r'<h1>(.*?)</h1>', body)
    if not h1_m:
        h1_m = re.search(r'^#\s+(.+)$', body, re.MULTILINE)
    if not h1_m:
        errors.append(f"{fname}: Missing H1 title in body")
    else:
        h1_val = h1_m.group(1).strip()
        if h1_val == title_val:
            warnings.append(f"{fname}: H1 is identical to frontmatter title ('{h1_val}')")
    
    # Check H1 placement before Liquid tool list
    tool_list_pos = body.find("class=\"tool-list\"")
    h1_pos = body.find("<h1>") if "<h1>" in body else body.find("# ")
    if tool_list_pos != -1 and h1_pos != -1 and h1_pos > tool_list_pos:
        errors.append(f"{fname}: H1 title appears AFTER tool-list loop")
    
    # 2. Word Count check (Body MUST be between 600 and 800 words)
    words = re.findall(r'\w+', body)
    word_count = len(words)
    if word_count < 600 or word_count > 800:
        errors.append(f"{fname}: Body word count is {word_count} (MUST be 600 to 800 words)")
    
    # 3. Liquid Loop check
    if '{% assign tools = site.data.tools | where: "category", page.category | where: "type", "tool" %}' not in body:
        errors.append(f"{fname}: Missing or broken Liquid tool assignment loop")
    if '{% for tool in tools %}' not in body:
        errors.append(f"{fname}: Missing Liquid for loop over tools")
    
    # 4. Cross-linking rule check (Related Categories grid links ONLY to subcats within same master hub)
    grid_m = re.search(r'<div class="related-cats-grid">(.*?)</div>', body, re.DOTALL)
    if not grid_m:
        errors.append(f"{fname}: Missing related-cats-grid section")
    else:
        grid_html = grid_m.group(1)
        links = re.findall(r'href="([^"]+)"', grid_html)
        
        # Get allowed URLs for this hub
        allowed_urls = {item[2] for item in HUB_SUBCATS[hub_key]}
        for link in links:
            if link not in allowed_urls:
                errors.append(f"{fname}: Illegal cross-link '{link}' outside master hub '{hub_key}'")
            if link == f"/{cat_id}":
                errors.append(f"{fname}: Self-referencing link '{link}' found in related categories")

print("\n=== AUDIT SUMMARY ===")
print(f"Total Pages Checked: {len(all_files)}")
print(f"Errors Found: {len(errors)}")
print(f"Warnings Found: {len(warnings)}")

if errors:
    print("\n--- ERRORS ---")
    for err in errors:
        print(f"  ❌ {err}")

if warnings:
    print("\n--- WARNINGS ---")
    for warn in warnings:
        print(f"  ⚠️ {warn}")

if not errors and not warnings:
    print("\n🎉 ALL 35 SUBCATEGORY LANDING PAGES PASSED ALL AUDIT CHECKS PERFECTLY!")
