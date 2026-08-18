import os
import re

story_file = r'c:\Users\akhil\OneDrive\Desktop\projects\emv1\src\pages\products\supply-chain\SupplyStory.jsx'
hero_file = r'c:\Users\akhil\OneDrive\Desktop\projects\emv1\src\pages\products\supply-chain\SupplyHero.jsx'

with open(story_file, 'r', encoding='utf-8') as f:
    story = f.read()

# Replace C object
story = re.sub(
    r'const C = \{.*?\};',
    '''const C = {
  green: ['#0891b2', '8, 145, 178'],
  violet: ['#0891b2', '8, 145, 178'],
  blue: ['#0891b2', '8, 145, 178'],
  orange: ['#0891b2', '8, 145, 178'],
  teal: ['#0891b2', '8, 145, 178'],
  purple: ['#0891b2', '8, 145, 178'],
  cyan: ['#0891b2', '8, 145, 178'],
  rose: ['#0891b2', '8, 145, 178'],
};''',
    story,
    flags=re.DOTALL
)

# Replace gColors
story = story.replace("const gColors = ['#FBBC04', '#34A853', '#EA4335', '#4285F4', '#FBBC04'];", 
                      "const gColors = ['#0891b2', '#0891b2', '#0891b2', '#0891b2', '#0891b2'];")

# Replace stroke colors in right-svg
story = story.replace('stroke="#34A853"', 'stroke="#0891b2"')
story = story.replace('stroke="#4285F4"', 'stroke="#0891b2"')

with open(story_file, 'w', encoding='utf-8') as f:
    f.write(story)

# Update Hero
with open(hero_file, 'r', encoding='utf-8') as f:
    hero = f.read()

# Replace colors in CAPS of Hero
hero = re.sub(
    r"color: '#[a-f0-9]{6}'",
    "color: '#0891b2'",
    hero
)
hero = re.sub(
    r"rgb: '[0-9]+, [0-9]+, [0-9]+'",
    "rgb: '8, 145, 178'",
    hero
)

with open(hero_file, 'w', encoding='utf-8') as f:
    f.write(hero)

print("Updated everything to single cyan color")
