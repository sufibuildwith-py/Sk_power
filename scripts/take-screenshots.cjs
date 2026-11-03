const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const viewports = [
  { name: '1920x1080', width: 1920, height: 1080 },
  { name: '1440x960', width: 1440, height: 960 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '390x844', width: 390, height: 844 },
  { name: '375x667', width: 375, height: 667 },
];

async function run() {
  const outDir = path.resolve(__dirname, '../screenshots');
  const enDir = path.join(outDir, 'en');
  const hiDir = path.join(outDir, 'hi');
  for (const d of [outDir, enDir, hiDir]) {
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d, { recursive: true });
    }
  }

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // 1. Capture English across viewports
  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('sk_solar_lang', 'en');
    });
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));

    const shotPath = path.join(enDir, `hero-${vp.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`[EN] Saved screenshot for ${vp.name}`);
    await page.close();
  }

  // 2. Capture Hindi across viewports
  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('sk_solar_lang', 'hi');
    });
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));

    const shotPath = path.join(hiDir, `hero-${vp.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`[HI] Saved screenshot for ${vp.name}`);
    await page.close();
  }

  // 3. Test Quote Modal in English
  {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('sk_solar_lang', 'en');
    });
    await page.setViewport({ width: 1440, height: 960 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('header button')).find(b => b.textContent && b.textContent.includes('Quote'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(enDir, 'modal-1440x960.png') });
    console.log('[EN] Saved modal screenshot');
    await page.close();
  }

  // 4. Test Quote Modal in Hindi
  {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('sk_solar_lang', 'hi');
    });
    await page.setViewport({ width: 1440, height: 960 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('header button')).find(b => b.textContent && b.textContent.includes('कोटेशन'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(hiDir, 'modal-1440x960.png') });
    console.log('[HI] Saved modal screenshot');
    await page.close();
  }

  // 5. Test Mobile Menu in English
  {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('sk_solar_lang', 'en');
    });
    await page.setViewport({ width: 390, height: 844 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    await page.evaluate(() => {
      const btn = document.querySelector('header button.lg\\:hidden');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(enDir, 'mobile-menu-390x844.png') });
    console.log('[EN] Saved mobile menu screenshot');
    await page.close();
  }

  // 6. Test Mobile Menu in Hindi
  {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('sk_solar_lang', 'hi');
    });
    await page.setViewport({ width: 390, height: 844 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    await page.evaluate(() => {
      const btn = document.querySelector('header button.lg\\:hidden');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(hiDir, 'mobile-menu-390x844.png') });
    console.log('[HI] Saved mobile menu screenshot');
    await page.close();
  }

  // 7. Test solutions and products sections in Hindi
  {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('sk_solar_lang', 'hi');
    });
    await page.setViewport({ width: 1440, height: 960 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    await page.evaluate(() => {
      const solutions = document.getElementById('solutions');
      if (solutions) solutions.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(hiDir, 'solutions-section.png') });
    console.log('[HI] Saved solutions section screenshot');
    await page.close();
  }

  // 8. Capture close-ups of Navbar and Footer Logo
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 960 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Navbar close-up
    const header = await page.$('#site-header');
    if (header) {
      await header.screenshot({ path: path.join(outDir, 'navbar-logo-closeup.png') });
      console.log('Saved navbar logo closeup');
    }

    // Scroll to footer and take footer close-up
    const footer = await page.$('footer#contact');
    if (footer) {
      await page.evaluate(() => {
        document.querySelector('footer#contact').scrollIntoView();
      });
      await new Promise(r => setTimeout(r, 600));
      await footer.screenshot({ path: path.join(outDir, 'footer-logo-closeup.png') });
      console.log('Saved footer logo closeup');
    }
    await page.close();
  }

  await browser.close();
  console.log('All visual tests complete!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
