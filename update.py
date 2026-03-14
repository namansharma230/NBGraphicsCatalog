import os
import re

html_path = '/Users/namansharma/NBGraphicPortfolio/index.html'
with open(html_path, 'r') as f:
    html = f.read()

def generate_html(folder_name, data_label, span_label):
    folder_path = f'/Users/namansharma/NBGraphicPortfolio/images/{folder_name}'
    if not os.path.isdir(folder_path):
        return ""
    files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')) and not f.startswith('.')]
    files.sort()
    
    html_out = ""
    for file in files:
        title = os.path.splitext(file)[0].replace('-', ' ').title()
        img_src = f"images/{folder_name}/{file}"
        item = f'''        <div class="vault-masonry-item" onclick="openLightbox(this)" data-title="{title}" data-label="{data_label}">
          <img src="{img_src}" alt="{title}" loading="lazy" />
          <div class="item-overlay">
            <div><span class="item-label">{span_label}</span>
              <div class="item-title">{title}</div>
            </div>
          </div>
        </div>'''
        html_out += item + "\n"
    return html_out.rstrip()

sections = [
    ('Apparel', 'APPAREL', 'Apparel', 'Apparel'),
    ('F&amp;B Branding', 'F&B', 'F&B', 'F&amp;B'),
    ('Identity &amp; Graphics', 'IDENTITY', 'Identity', 'Identity'),
    ('Corporate &amp; Events', 'CORPORATE', 'Corporate', 'Corporate')
]

for title_prefix, folder_name, data_label, span_label in sections:
    generated_html = generate_html(folder_name, data_label, span_label)
    
    pattern = r'(<h3 class="vault-folder-title">' + title_prefix + r'.*?</h3>\s*<div class="vault-masonry">)(.*?)(      </div>\s*</div>)'
    
    def replacer(match):
        return match.group(1) + "\n" + generated_html + "\n" + match.group(3)
        
    html = re.sub(pattern, replacer, html, count=1, flags=re.DOTALL)

with open(html_path, 'w') as f:
    f.write(html)
print("Updated index.html")
