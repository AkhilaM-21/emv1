import re
import os

supply_hero = r'c:\Users\akhil\OneDrive\Desktop\projects\emv1\src\pages\products\supply-chain\SupplyHero.jsx'
platform_hero = r'c:\Users\akhil\OneDrive\Desktop\projects\emv1\src\pages\products\platform\PlatformHero.jsx'

with open(supply_hero, 'r', encoding='utf-8') as f:
    s_content = f.read()

s_content = s_content.replace('Financial operations,', 'Supply chain,')
s_content = s_content.replace('Connect financial operations, approvals, reporting and controls in one platform', 'Connect procurement, manufacturing, logistics and distribution in one platform')

s_caps = """const CAPS = [
  { k: 'Supplier Management', icon: BookOpen, color: '#0a8f5e', rgb: '10, 143, 94', d: 'Onboarding, scorecards and contracts.' },
  { k: 'Procurement', icon: Receipt, color: '#6c50b2', rgb: '108, 80, 178', d: 'Every order acknowledged, every supplier scored.' },
  { k: 'Manufacturing', icon: CreditCard, color: '#2563eb', rgb: '37, 99, 235', d: 'Bill of materials and shop-floor issue.' },
  { k: 'Warehouse', icon: Wallet, color: '#e2601f', rgb: '226, 96, 31', d: 'Down to the bin, down to the batch.' },
  { k: 'Transportation', icon: TrendingUp, color: '#0d9488', rgb: '13, 148, 136', d: 'You hear about the delay before the customer does.' },
  { k: 'Distribution', icon: ChartPie, color: '#9333ea', rgb: '147, 51, 234', d: 'Cross-docked and allocated across hubs.' },
];"""

start = s_content.find("const CAPS = [")
end = s_content.find("];\n", start) + 2
if start != -1 and end != 1:
    s_content = s_content[:start] + s_caps + s_content[end:]

with open(supply_hero, 'w', encoding='utf-8') as f:
    f.write(s_content)


with open(platform_hero, 'r', encoding='utf-8') as f:
    p_content = f.read()

p_content = p_content.replace('Financial operations,', 'Business applications,')
p_content = p_content.replace('Connect financial operations, approvals, reporting and controls in one platform', 'Build, automate and connect your internal operations in one platform')
p_content = p_content.replace('Emvive Supply', 'Emvive Platform')

p_caps = """const CAPS = [
  { k: 'Idea & Requirements', icon: BookOpen, color: '#0a8f5e', rgb: '10, 143, 94', d: 'Somebody in the business needs software.' },
  { k: 'Build with Studio', icon: Receipt, color: '#6c50b2', rgb: '108, 80, 178', d: 'Studio turns it into real screens.' },
  { k: 'Connect Data', icon: CreditCard, color: '#2563eb', rgb: '37, 99, 235', d: 'It binds to the records you already keep.' },
  { k: 'Automate with Flow', icon: Wallet, color: '#e2601f', rgb: '226, 96, 31', d: 'Flow puts the process behind the screen.' },
  { k: 'Test Sandbox', icon: TrendingUp, color: '#0d9488', rgb: '13, 148, 136', d: 'It runs in a sandbox with real shapes of data.' },
  { k: 'Deploy', icon: ChartPie, color: '#9333ea', rgb: '147, 51, 234', d: 'It ships, with a rollback that works.' },
];"""

start = p_content.find("const CAPS = [")
end = p_content.find("];\n", start) + 2
if start != -1 and end != 1:
    p_content = p_content[:start] + p_caps + p_content[end:]

with open(platform_hero, 'w', encoding='utf-8') as f:
    f.write(p_content)

print("Updated Heroes")
