const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const outDir = path.resolve(__dirname, '../screenshots/glassmorphism');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // 1. Desktop 1440px - English Full Page
  {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('sk_solar_lang', 'en');
    });
    await page.setViewport({ width: 1440, height: 960 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));

    // Full page screenshot
    await page.screenshot({ path: path.join(outDir, 'en-desktop-1440-full.png'), fullPage: true });
    console.log('Saved en-desktop-1440-full.png');

    // Test dragging on Row 01 (Solutions Track)
    const solutionsTrack = await page.$('#solutions [style*="pan-y"]');
    if (solutionsTrack) {
      const box = await solutionsTrack.boundingBox();
      if (box) {
        // Drag from box.x + 400 to box.x + 100
        await page.mouse.move(box.x + 400, box.y + 100);
        await page.mouse.down();
        await page.mouse.move(box.x + 100, box.y + 100, { steps: 10 });
        await page.mouse.up();
        await new Promise(r => setTimeout(r, 600));
        await page.screenshot({ path: path.join(outDir, 'solutions-dragged.png') });
        console.log('Saved solutions-dragged.png');
      }
    }

    // Test FAQ accordion click & expand in glass panel
    await page.evaluate(() => {
      const faqButtons = document.querySelectorAll('#pm-surya-ghar button[aria-expanded]');
      if (faqButtons[0]) faqButtons[0].click(); // open Q1
      if (faqButtons[2]) faqButtons[2].click(); // open Q3 (subsidy)
    });
    await new Promise(r => setTimeout(r, 600));
    const faqSection = await page.$('#pm-surya-ghar .glass-panel');
    if (faqSection) {
      await faqSection.screenshot({ path: path.join(outDir, 'faq-glass-expanded.png') });
      console.log('Saved faq-glass-expanded.png');
    }

    await page.close();
  }

  // 2. Desktop 1440px - Hindi Full Page
  {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('sk_solar_lang', 'hi');
    });
    await page.setViewport({ width: 1440, height: 960 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));

    await page.screenshot({ path: path.join(outDir, 'hi-desktop-1440-full.png'), fullPage: true });
    console.log('Saved hi-desktop-1440-full.png');
    await page.close();
  }

  // 3. Desktop 1920px (Ultra-wide)
  {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('sk_solar_lang', 'en');
    });
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));

    await page.screenshot({ path: path.join(outDir, 'en-desktop-1920-full.png'), fullPage: true });
    console.log('Saved en-desktop-1920-full.png');
    await page.close();
  }

  // 4. Tablet 1024px
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 768 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(outDir, 'tablet-1024-full.png'), fullPage: true });
    console.log('Saved tablet-1024-full.png');
    await page.close();
  }

  // 5. Tablet 768px
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(outDir, 'tablet-768-full.png'), fullPage: true });
    console.log('Saved tablet-768-full.png');
    await page.close();
  }

  // 6. Mobile 390px (iPhone 14)
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(outDir, 'mobile-390-full.png'), fullPage: true });
    console.log('Saved mobile-390-full.png');
    await page.close();
  }

  // 7. Small Mobile 375px
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(outDir, 'mobile-375-full.png'), fullPage: true });
    console.log('Saved mobile-375-full.png');
    await page.close();
  }

  await browser.close();
  console.log('All glassmorphism & draggable track verification tests finished successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});