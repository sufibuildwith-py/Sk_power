const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const outDir = path.resolve(__dirname, '../screenshots/pm-surya-ghar');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // 1. Desktop 1440px - English
  {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('sk_solar_lang', 'en');
    });
    await page.setViewport({ width: 1440, height: 960 });
    await page.goto('http://localhost:3000/#pm-surya-ghar', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));

    // Hide fixed header for clean full-section screenshot
    await page.evaluate(() => {
      const header = document.querySelector('#site-header');
      if (header) header.style.display = 'none';
    });

    const section = await page.$('#pm-surya-ghar');
    if (section) {
      await section.screenshot({ path: path.join(outDir, 'en-desktop-1440.png') });
      console.log('Saved en-desktop-1440');
    }

    await page.close();
  }

  // 2. Desktop 1440px - Hindi
  {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('sk_solar_lang', 'hi');
    });
    await page.setViewport({ width: 1440, height: 960 });
    await page.goto('http://localhost:3000/#pm-surya-ghar', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));

    await page.evaluate(() => {
      const header = document.querySelector('#site-header');
      if (header) header.style.display = 'none';
    });

    const section = await page.$('#pm-surya-ghar');
    if (section) {
      await section.screenshot({ path: path.join(outDir, 'hi-desktop-1440.png') });
      console.log('Saved hi-desktop-1440');
    }

    await page.close();
  }

  // 3. Tablet 1024px
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 768 });
    await page.goto('http://localhost:3000/#pm-surya-ghar', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.evaluate(() => {
      const header = document.querySelector('#site-header');
      if (header) header.style.display = 'none';
    });
    const section = await page.$('#pm-surya-ghar');
    if (section) {
      await section.screenshot({ path: path.join(outDir, 'tablet-1024.png') });
      console.log('Saved tablet-1024');
    }
    await page.close();
  }

  // 4. Tablet 768px
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000/#pm-surya-ghar', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.evaluate(() => {
      const header = document.querySelector('#site-header');
      if (header) header.style.display = 'none';
    });
    const section = await page.$('#pm-surya-ghar');
    if (section) {
      await section.screenshot({ path: path.join(outDir, 'tablet-768.png') });
      console.log('Saved tablet-768');
    }
    await page.close();
  }

  // 5. Mobile 390px
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844 });
    await page.goto('http://localhost:3000/#pm-surya-ghar', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.evaluate(() => {
      const header = document.querySelector('#site-header');
      if (header) header.style.display = 'none';
    });
    const section = await page.$('#pm-surya-ghar');
    if (section) {
      await section.screenshot({ path: path.join(outDir, 'mobile-390.png') });
      console.log('Saved mobile-390');
    }
    await page.close();
  }

  // 6. Mobile 375px
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/#pm-surya-ghar', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.evaluate(() => {
      const header = document.querySelector('#site-header');
      if (header) header.style.display = 'none';
    });
    const section = await page.$('#pm-surya-ghar');
    if (section) {
      await section.screenshot({ path: path.join(outDir, 'mobile-375.png') });
      console.log('Saved mobile-375');
    }
    await page.close();
  }

  await browser.close();
  console.log('All visual storytelling tests complete!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
