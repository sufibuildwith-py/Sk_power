const fs = require('fs');
const path = require('path');
const https = require('https');

const images = [
  {
    name: 'indian-rooftop-solar-1.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Rooftop_Solar_panels_on_homes_in_Mehsana%2C_Gujarat%2C_India.jpg',
  },
  {
    name: 'indian-rooftop-solar-2.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Rooftop_Solar_panels_on_homes_in_Mehsana%2C_Gujarat%2C_India_%2869514%29.jpg',
  },
  {
    name: 'solar-technician-install.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Solar_installation_technician_on_rooftop_%285392894792%29.jpg',
  },
  {
    name: 'solar-technicians-work.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Technicians_working_on_a_solar_panel_installation_%289234%29.jpg',
  },
  {
    name: 'solar-rooftop-modern.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Rooftop_solar_photovoltaic_installation.jpg',
  },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    function get(currentUrl) {
      https.get(
        currentUrl,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          },
        },
        (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return get(res.headers.location);
          }
          if (res.statusCode !== 200) {
            return reject(new Error(`Status ${res.statusCode} for ${currentUrl}`));
          }
          const file = fs.createWriteStream(dest);
          res.pipe(file);
          file.on('finish', () => file.close(resolve));
          file.on('error', reject);
        }
      ).on('error', reject);
    }
    get(url);
  });
}

async function main() {
  const dir = path.resolve(__dirname, '../public/pm-surya-ghar');
  for (const img of images) {
    const dest = path.join(dir, img.name);
    console.log(`Downloading ${img.name}...`);
    try {
      await download(img.url, dest);
      const stat = fs.statSync(dest);
      console.log(`✓ Saved ${img.name} (${stat.size} bytes)`);
    } catch (e) {
      console.error(`✗ Failed ${img.name}:`, e.message);
    }
    await new Promise((r) => setTimeout(r, 2500));
  }
}

main();
