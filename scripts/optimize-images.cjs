const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const files = [
  { src: 'pm-modi-initiative.jpg', out: 'pm-modi-initiative.webp', maxW: 800 },
  { src: 'indian-rooftop-solar-1.jpg', out: 'indian-rooftop-solar-1.webp', maxW: 1600 },
  { src: 'indian-rooftop-solar-2.jpg', out: 'indian-rooftop-solar-2.webp', maxW: 1200 },
  { src: 'solar-technicians-work.jpg', out: 'solar-technicians-work.webp', maxW: 1200 },
  { src: 'solar-inverter-install.jpg', out: 'solar-inverter-install.webp', maxW: 800 },
  { src: 'solar-rooftop-modern.jpg', out: 'solar-rooftop-modern.webp', maxW: 1400 },
];

async function run() {
  const dir = path.resolve(__dirname, '../public/pm-surya-ghar');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();

  for (const f of files) {
    const srcPath = path.join(dir, f.src);
    const outPath = path.join(dir, f.out);
    if (!fs.existsSync(srcPath)) continue;

    const fileUrl = 'file://' + srcPath.replace(/\\/g, '/');
    await page.goto(fileUrl);

    const base64WebP = await page.evaluate(async (maxW) => {
      const img = document.querySelector('img');
      const canvas = document.createElement('canvas');
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > maxW) {
        h = Math.round((h * maxW) / w);
        w = maxW;
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    }, f.maxW);

    const data = base64WebP.replace(/^data:image\/webp;base64,/, '');
    fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
    const stat = fs.statSync(outPath);
    console.log(`Optimized ${f.out}: ${stat.size} bytes`);
  }

  await browser.close();
  console.log('Optimization complete!');
}

run().catch(console.error);
