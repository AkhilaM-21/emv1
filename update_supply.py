import os
import re

story_file = r'c:\Users\akhil\OneDrive\Desktop\projects\emv1\src\pages\products\supply-chain\SupplyStory.jsx'
hero_file = r'c:\Users\akhil\OneDrive\Desktop\projects\emv1\src\pages\products\supply-chain\SupplyHero.jsx'
story_css = r'c:\Users\akhil\OneDrive\Desktop\projects\emv1\src\pages\products\supply-chain\SupplyStory.css'
hero_css = r'c:\Users\akhil\OneDrive\Desktop\projects\emv1\src\pages\products\supply-chain\SupplyHero.css'

with open(story_file, 'r', encoding='utf-8') as f:
    story = f.read()

# 1. Revert C
story = re.sub(
    r'const C = \{.*?\};',
    '''const C = {
  green: ['#0891b2', '8, 145, 178'],
  violet: ['#6c50b2', '108, 80, 178'],
  blue: ['#2563eb', '37, 99, 235'],
  orange: ['#e2601f', '226, 96, 31'],
  teal: ['#0d9488', '13, 148, 136'],
  purple: ['#9333ea', '147, 51, 234'],
  cyan: ['#0891b2', '8, 145, 178'],
  rose: ['#e11d48', '225, 29, 72'],
};''',
    story,
    flags=re.DOTALL
)

# 2. Revert gColors
story = story.replace(
    "const gColors = ['#0891b2', '#0891b2', '#0891b2', '#0891b2', '#0891b2'];",
    "const gColors = ['#FBBC04', '#34A853', '#EA4335', '#4285F4', '#FBBC04'];"
)

# 3. Update Impact section text
story = story.replace(
    "One real group — seven legal entities, three currencies — twelve months after go-live. Measured in working days after period end.",
    "One real group — eighteen hubs, two hundred and twelve outlets — twelve months after go-live. Measured on the line, not on the invoice."
)
story = story.replace(
    "Nineteen working days, most of it chasing",
    "Eleven days, most of it waiting on a status"
)
story = story.replace(
    "Reviewed, signed and filed by day three",
    "Acknowledged, picked, loaded and delivered"
)
story = story.replace(
    "returned to the team, every month",
    "off the cycle, on every order"
)
story = story.replace("THE MONTH-END CLOSE", "ORDER TO SHELF")
story = story.replace("Working days after period end", "Working days from PO to outlet")
story = story.replace("−2 days", "−7 days")
story = story.replace("<ScrollNumber to={16}", "<ScrollNumber to={7}")

story = story.replace("label: 'To close'", "label: 'Order to shelf'")
story = story.replace("value: '3'", "value: '4'")
story = story.replace("label: 'Less manual work'", "label: 'Fill rate'")
story = story.replace("value: '42'", "value: '99.1'")
story = story.replace("label: 'Entities consolidated'", "label: 'Hubs consolidated'")
story = story.replace("value: '7'", "value: '18'")
story = story.replace("label: 'First-pass clearance'", "label: 'OTIF'")
story = story.replace("value: '99.8'", "value: '96.4'")

story = story.replace("const RULER = [1, 5, 10, 15, 20, 25, 31];", "const RULER = [1, 4, 7, 10, 14, 18, 20];")
story = story.replace("const DAYS = 31;", "const DAYS = 20;")

story = story.replace("days: 19", "days: 11")
story = story.replace("days: 3", "days: 4")

old_quotes = """const QUOTES = [
  'Sub-ledgers post in real time and reconciliations run nightly, so period end reviews work that is already done.',
  'ZATCA Phase 2, Arabic presentation, multi-currency groups and data held in Saudi Arabia, UAE or India.',
  'A closed period rejects a posting. Approval limits and duty segregation are enforced by the ledger, not by memo.',
];"""
new_quotes = """const QUOTES = [
  'Stock is held at bin and batch level, so what the system says is on the shelf is what the picker finds on the shelf.',
  'Loads are built by weight and drop sequence, and an ETA that slips lists the outlets affected before the customer calls.',
  'A buyer cannot receive their own order. Approval limits and duty segregation are enforced by the ledger, not by memo.',
];"""
story = story.replace(old_quotes, new_quotes)

with open(story_file, 'w', encoding='utf-8') as f:
    f.write(story)


# 4. Revert Hero CAPS
with open(hero_file, 'r', encoding='utf-8') as f:
    hero = f.read()

hero = hero.replace("{ k: 'Supplier Management', icon: BookOpen, color: '#0891b2', rgb: '8, 145, 178', d: 'Onboarding, scorecards and contracts.' }", 
"{ k: 'Supplier Management', icon: BookOpen, color: '#0a8f5e', rgb: '10, 143, 94', d: 'Onboarding, scorecards and contracts.' }")
hero = hero.replace("{ k: 'Procurement', icon: Receipt, color: '#0891b2', rgb: '8, 145, 178'", "{ k: 'Procurement', icon: Receipt, color: '#6c50b2', rgb: '108, 80, 178'")
hero = hero.replace("{ k: 'Manufacturing', icon: CreditCard, color: '#0891b2', rgb: '8, 145, 178'", "{ k: 'Manufacturing', icon: CreditCard, color: '#2563eb', rgb: '37, 99, 235'")
hero = hero.replace("{ k: 'Warehouse', icon: Wallet, color: '#0891b2', rgb: '8, 145, 178'", "{ k: 'Warehouse', icon: Wallet, color: '#e2601f', rgb: '226, 96, 31'")
hero = hero.replace("{ k: 'Transportation', icon: TrendingUp, color: '#0891b2', rgb: '8, 145, 178'", "{ k: 'Transportation', icon: TrendingUp, color: '#0d9488', rgb: '13, 148, 136'")
hero = hero.replace("{ k: 'Distribution', icon: ChartPie, color: '#0891b2', rgb: '8, 145, 178'", "{ k: 'Distribution', icon: ChartPie, color: '#9333ea', rgb: '147, 51, 234'")

with open(hero_file, 'w', encoding='utf-8') as f:
    f.write(hero)


# 5. Replace Gradients in CSS
with open(story_css, 'r', encoding='utf-8') as f:
    css = f.read()

css = css.replace('#34d399', '#38bdf8')
css = css.replace('#16b877', '#0284c7')
css = css.replace('#059669', '#0369a1')
css = css.replace('#06603f', '#0c4a6e')
css = css.replace('#10b981', '#0ea5e9')
css = css.replace('#3b82f6', '#4f46e5')
css = css.replace('#4fd1a1', '#38bdf8') 
css = css.replace('#6ee7c0', '#7dd3fc') 
css = css.replace('#7cb3ff', '#818cf8')
css = css.replace('#0a1410', '#0a1014')
css = css.replace('#07120d', '#070f12')
css = css.replace('#050d09', '#050a0d')

with open(story_css, 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated texts, reverted icon colors, and changed gradient colors')
