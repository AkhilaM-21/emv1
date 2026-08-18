import os

story_file = r'c:\Users\akhil\OneDrive\Desktop\projects\emv1\src\pages\products\supply-chain\SupplyStory.jsx'
hero_file = r'c:\Users\akhil\OneDrive\Desktop\projects\emv1\src\pages\products\supply-chain\SupplyHero.jsx'
story_css = r'c:\Users\akhil\OneDrive\Desktop\projects\emv1\src\pages\products\supply-chain\SupplyStory.css'
hero_css = r'c:\Users\akhil\OneDrive\Desktop\projects\emv1\src\pages\products\supply-chain\SupplyHero.css'
app_css = r'c:\Users\akhil\OneDrive\Desktop\projects\emv1\src\pages\products\supply-chain\SupplyApp.css'

def replace_in_file(path, replacements):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

replace_in_file(story_file, [
    ('title="Eight modules."', 'title="Seven modules."'),
    ('accent="One ledger underneath."', 'accent="One stock ledger underneath."'),
    ('Nothing here is a separate product with its own database. Every module writes to the same journals and inherits the same controls, so what one module knows, all of them know.', 'Nothing here is a separate product with its own database. Every module writes to the same stock and document records, so what one of them knows, all of them know.'),
    
    ('title="From document to signed close,"', 'title="From the purchase order"'),
    ('accent="in five moves."', 'accent="to the carton on the shelf."'),
    ('The same record travels the whole way. Nothing is re-keyed, re-exported or reconciled against a second system — each step below is the one screen where that move actually happens.', 'The same order travels the whole way. Procurement, the warehouse and the fleet read and write the same records, so a quantity never has to be reconciled between two systems that both claim to be right.'),

    ('Rules run against live balances on a schedule or on an event.', 'Rules run against live stock on a schedule or on an event.'),

    ('title="One ledger, wired to"', 'title="One stock ledger, wired to"'),
    ('Emvive Finance is the accounting core, not an island.', 'Emvive Supply Chain is the operational core, not an island.'),

    ('title="Evidence in the trail,"', 'title="Control that survives"'),
    ('accent="not just the policy."', 'accent="contact with a warehouse."'),
    ('The answer to \'can we trust it?\' is evidence. The controls below are enforced by the ledger itself, and the trail they leave is visible while you are reading the record.', 'Physical operations are where controls usually break — a shift needs to move stock now and the system is the obstacle. These are designed to hold without stopping the work.'),
])

color_replacements = [
    ('#0a8f5e', '#3557d8'),
    ('10, 143, 94', '53, 87, 216'),
    ('10,143,94', '53,87,216'),
    ('#07724b', '#2a46bb'),
]

for css_file in [story_css, hero_css, app_css]:
    replace_in_file(css_file, color_replacements)

print('Updated texts and colors')
