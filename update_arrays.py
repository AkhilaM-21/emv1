import re
import os

def replace_block(content, var_name, new_block):
    start_idx = content.find(f"const {var_name} = [")
    if start_idx == -1: return content
    
    end_idx = content.find("];\n", start_idx)
    if end_idx == -1: end_idx = content.find("];", start_idx)
    
    if end_idx != -1:
        return content[:start_idx] + f"const {var_name} = [\n{new_block}\n];" + content[end_idx+2:]
    return content

supply_caps = """  {
    k: 'Supplier Management', c: 'green', icon: BookOpen,
    line: 'Onboarding, scorecards and contracts.',
    body: 'Supplier CR, VAT, ISO and insurance certificates tracked with expiry alerting before an order can be placed. Performance by delivery and quality.',
    points: ['Supplier onboarding and scorecards', 'Price lists and contract terms', 'Compliance documents with expiry alerting', 'RFQ and quotation comparison', 'Performance by delivery and quality'],
    stat: ['412', 'active suppliers'],
  },
  {
    k: 'Procurement', c: 'violet', icon: Receipt,
    line: 'Every order acknowledged, every supplier scored.',
    body: 'Requisition to receipt on one document trail. Budget is checked when the commitment is made, approvals route by value and category.',
    points: ['Requisition, RFQ, PO and acknowledgement', 'Commitment accounting against live budgets', 'Approval routing by value and category', 'ASN and goods receipt matching', 'Variance holds instead of nodded-through receipts'],
    stat: ['128', 'open POs'],
  },
  {
    k: 'Manufacturing', c: 'blue', icon: CreditCard,
    line: 'Bill of materials and shop-floor issue.',
    body: 'The bill of materials issues stock from the right bins and back-flushes the finished goods when the run closes.',
    points: ['Bill of materials and routing', 'Shop-floor issue and back-flush', 'Work order scheduling against capacity', 'Batch and serial traceability', 'Yield and scrap reporting'],
    stat: ['9', 'work orders'],
  },
  {
    k: 'Warehouse', c: 'orange', icon: Wallet,
    line: 'Down to the bin, down to the batch.',
    body: 'Putaway, picking, packing and counting run on a scanner that works when the signal does not. Stock is held at bin and batch level.',
    points: ['Bin, batch and serial level stock', 'Putaway, picking, packing and counting', 'FEFO selection with wave planning', 'Offline-first scanning, synced in range', 'Cycle counts with variance approval'],
    stat: ['46', 'aisles'],
  },
  {
    k: 'Transportation', c: 'teal', icon: TrendingUp,
    line: 'You hear about the delay before the customer does.',
    body: 'Loads are built by weight and drop sequence, trips are tracked against plan, and cold chain is logged the whole way.',
    points: ['Load building by weight and drop', 'Live ETA against plan', 'Temperature and humidity logging', 'Proof of delivery with signature and photo', 'Driver, trip and fleet records'],
    stat: ['342', 'in transit'],
  },
  {
    k: 'Distribution', c: 'cyan', icon: ChartPie,
    line: 'Cross-docked and allocated across hubs.',
    body: 'Allocation across hubs happens against live demand rather than a monthly plan.',
    points: ['Replenishment and allocation', 'Inter-site transfers and returns', 'Cross-docking at the hub', 'Outlet-level stock visibility', 'Demand-led distribution, not monthly plans'],
    stat: ['18', 'hubs'],
  },
  {
    k: 'Customer Planning', c: 'purple', icon: FileText,
    line: 'Demand forecasting by outlet.',
    body: 'The outlet sees the same record the supplier did. Fill rate is measured on the line, not on the invoice.',
    points: ['Demand forecasting by outlet', 'Inventory targets and reorder points', 'Risk and stock-out prediction', 'Scenario planning on assumptions', 'Fill rate and OTIF measurement'],
    stat: ['212', 'outlets'],
  }"""

supply_steps = """  {
    k: 'Purchase', c: 'green', icon: Inbox,
    t: 'Requisition became a purchase order',
    d: 'Budget checked at commitment, approval routed by value, order sent and acknowledged — no email in the loop.',
    crumb: 'Procurement',
    img: '/images/capture_step.jpg',
  },
  {
    k: 'Produce', c: 'blue', icon: Send,
    t: 'Work order consumes the components',
    d: 'The bill of materials issues stock from the right bins and back-flushes the finished goods when the run closes.',
    crumb: 'Manufacturing',
    img: '/images/post_step.jpg',
  },
  {
    k: 'Warehouse', c: 'violet', icon: ShieldCheck,
    t: 'Putaway, then picked against wave',
    d: 'FEFO batch selection, bin-level allocation, and a pick path that walks the aisles once.',
    crumb: 'Warehouse',
    img: '/images/control_step.jpg',
  },
  {
    k: 'Transit', c: 'orange', icon: RefreshCw,
    t: 'Truck departs dock',
    d: 'Load built by weight and drop sequence, temperature logged end to end, proof of delivery captured on the driver’s phone.',
    crumb: 'Logistics',
    img: '/images/automate_step.jpg',
  },
  {
    k: 'Delivery', c: 'rose', icon: FileCheck2,
    t: 'On the shelf, in stock, on time',
    d: 'The outlet sees the same record the supplier did. Fill rate is measured on the line, not on the invoice.',
    crumb: 'Distribution',
    img: '/images/close_step.jpg',
  }"""

supply_auto = """  {
    id: 'stock-replenishment',
    label: 'Stock & Replenishment',
    items: [
      { name: 'Reorder point breach' },
      { name: 'FEFO batch selection' },
      { name: 'Cycle count scheduling' },
      { name: 'Transfer suggestions' },
    ]
  },
  {
    id: 'procurement-transport',
    label: 'Procurement & Transport',
    items: [
      { name: 'PO acknowledgement chasing' },
      { name: 'Three-way receipt match' },
      { name: 'Load building by drop' },
      { name: 'ETA slip alerting' },
    ]
  }"""

platform_caps = """  {
    k: 'Idea & Requirements', c: 'green', icon: BookOpen,
    line: 'Somebody in the business needs software.',
    body: 'A process that lives in a spreadsheet, an inbox and a filing cabinet. Written as a requirement, not a ticket in a two-year backlog.',
    points: ['Requirements capture', 'Process mapping', 'Stakeholder alignment', 'Rapid prototyping', 'Agile iteration'],
    stat: ['Day 0', 'inception'],
  },
  {
    k: 'Build with Studio', c: 'violet', icon: Receipt,
    line: 'Studio turns it into real screens.',
    body: 'Data model, forms, tables, dashboards and permissions, assembled visually. What you place is what ships.',
    points: ['Drag-and-drop screen canvas', 'Forms, tables, charts and detail views', 'Responsive by default, mobile build included', 'Component library with your brand applied', 'What you place is what ships'],
    stat: ['Days 1–4', 'build phase'],
  },
  {
    k: 'Connect Data', c: 'blue', icon: CreditCard,
    line: 'It binds to the records you already keep.',
    body: 'Objects from your ERP, your CRM and your legacy database, with row-level access inherited rather than re-granted.',
    points: ['Objects, fields and relationships', 'Row-level permissions inherited from the ERP', 'Validation and computed fields', 'Import from spreadsheet or existing table', 'One model shared with Finance and Supply Chain'],
    stat: ['Day 4', 'integration'],
  },
  {
    k: 'Automate with Flow', c: 'orange', icon: Wallet,
    line: 'Flow puts the process behind the screen.',
    body: 'Triggers, conditions, human approvals, API calls and scheduled jobs on the same canvas as the application.',
    points: ['Triggers on record, schedule or webhook', 'Conditions, branches and loops', 'Human approval steps with delegation', 'API calls out and callbacks in', 'Every run traced step by step'],
    stat: ['Days 5–6', 'automation'],
  },
  {
    k: 'Test Sandbox', c: 'teal', icon: TrendingUp,
    line: 'It runs in a sandbox with real shapes of data.',
    body: 'Test runs replay against sample records, every step is traced, and nothing touches production until somebody signs it off.',
    points: ['Sandbox with real shapes of data', 'Replay a run against sample records', 'Diff any two releases', 'Sign-off before anything touches production', 'Rollback that works'],
    stat: ['Day 7', 'testing'],
  },
  {
    k: 'Deploy', c: 'cyan', icon: ChartPie,
    line: 'It ships, with a rollback that works.',
    body: 'Promotion through environments with approval, versioned releases, a URL, a mobile build and an API — from one definition.',
    points: ['Four environments with promotion', 'Versioned workspaces and audit trail', 'Regional residency including backups', 'Autoscaling from forty users to four thousand', 'Zero-downtime releases'],
    stat: ['Day 8', 'production'],
  }"""

platform_steps = """  {
    k: 'Studio', c: 'green', icon: Inbox,
    t: 'Screens, data and permissions, assembled visually',
    d: 'What you place is what ships. There is no rebuild between the prototype and the application.',
    crumb: 'Build',
    img: '/images/capture_step.jpg',
  },
  {
    k: 'Flow', c: 'blue', icon: Send,
    t: 'Triggers, approvals and actions on one canvas',
    d: 'The process lives beside the screen it belongs to rather than in a separate automation tool.',
    crumb: 'Automate',
    img: '/images/post_step.jpg',
  },
  {
    k: 'Data', c: 'violet', icon: ShieldCheck,
    t: 'Bound to the records you already keep',
    d: 'Applications read the ERP objects finance and operations are already posting to, with access inherited rather than re-granted.',
    crumb: 'Connect',
    img: '/images/control_step.jpg',
  },
  {
    k: 'Governance', c: 'orange', icon: RefreshCw,
    t: 'Identity, audit and residency, once',
    d: 'The same controls cover everything built here, so IT reviews the platform rather than every application on it.',
    crumb: 'Security',
    img: '/images/automate_step.jpg',
  },
  {
    k: 'Release', c: 'rose', icon: FileCheck2,
    t: 'Promotion through environments with approval',
    d: 'Versioned releases, instant rollback, and zero-downtime deployments.',
    crumb: 'Deploy',
    img: '/images/close_step.jpg',
  }"""

platform_auto = """  {
    id: 'process-automation',
    label: 'Process Automation',
    items: [
      { name: 'Approval routing by value' },
      { name: 'Scheduled record jobs' },
      { name: 'Webhook triggers' },
      { name: 'Escalation on no response' },
    ]
  },
  {
    id: 'integration-data',
    label: 'Integration & Data',
    items: [
      { name: 'ERP object sync' },
      { name: 'API calls out and back' },
      { name: 'Bulk import validation' },
      { name: 'Event push on change' },
    ]
  }"""

def fix_file(file_path, caps, steps, auto):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    content = replace_block(content, 'CAPS', caps)
    content = replace_block(content, 'STEPS', steps)
    content = replace_block(content, 'AUTOMATION_TABS', auto)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file(r'c:\Users\akhil\OneDrive\Desktop\projects\emv1\src\pages\products\supply-chain\SupplyStory.jsx', supply_caps, supply_steps, supply_auto)
fix_file(r'c:\Users\akhil\OneDrive\Desktop\projects\emv1\src\pages\products\platform\PlatformStory.jsx', platform_caps, platform_steps, platform_auto)

print("Updated arrays in Story files")
