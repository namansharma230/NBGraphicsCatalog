import os

html_path = '/Users/namansharma/NBGraphicPortfolio/index.html'
with open(html_path, 'r') as f:
    html = f.read()

def generate_html(folder_name, folder_id, folder_title, data_label, span_label):
    folder_path = f'/Users/namansharma/NBGraphicPortfolio/images/{folder_name}'
    if not os.path.isdir(folder_path):
        return ""
    files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')) and not f.startswith('.')]
    files.sort()
    
    html_out = f'''    <!-- ═══ FOLDER: {folder_name} ═══ -->
    <div class="vault-folder" id="{folder_id}">
      <button class="vault-back" onclick="closeVaultFolder()">&#8592; &nbsp;Back to Vault</button>
      <h3 class="vault-folder-title">{folder_title}</h3>
      <div class="vault-masonry">\n'''
    
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
        
    html_out += '''      </div>
    </div>\n\n'''
    return html_out

sections = [
    ('APPAREL', 'vault-apparel', 'Apparel &mdash; The Cerise / Pixelate Line', 'Apparel', 'Apparel'),
    ('F&B', 'vault-fnb', 'F&amp;B Branding &mdash; The Caf&eacute; Collection', 'F&B', 'F&amp;B'),
    ('IDENTITY', 'vault-identity', 'Identity &amp; Graphics &mdash; Armada / Smoke / Manzil', 'Identity', 'Identity'),
    ('CORPORATE', 'vault-corporate', 'Corporate &amp; Events &mdash; AIESEC Series', 'Corporate', 'Corporate')
]

replacement_html = ""
for s in sections:
    replacement_html += generate_html(s[0], s[1], s[2], s[3], s[4])

start_marker = "<!-- ═══ FOLDER: APPAREL ═══ -->"
end_marker = "</section>"

start_idx = html.find(start_marker)
end_idx = html.find(end_marker, start_idx)

if start_idx != -1 and end_idx != -1:
    new_html = html[:start_idx] + replacement_html + "  " + html[end_idx:]
    with open(html_path, 'w') as f:
        f.write(new_html)
    print("Fixed index.html successfully.")
else:
    print("Could not find markers.")
