import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 850 } });
await page.goto('http://localhost:400/#/products/platform', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: 'C:/Users/akhil/AppData/Local/Temp/claude/c--Users-akhil-OneDrive-Desktop-projects-emv1-public/d4775622-bda4-4f6d-97f7-2fa50559bcd4/scratchpad/hero4.png' });
const rect = await page.evaluate(() => {
  const hero = document.querySelector('.pa-hero');
  const r = hero.getBoundingClientRect();
  return { heroHeight: r.height, heroBottom: r.bottom };
});
console.log(JSON.stringify(rect));
await browser.close();
