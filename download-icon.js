import fs from 'fs';
import https from 'https';
import path from 'path';

const url = 'https://ibb.co/dwPfGdqB';
const dest = path.join(process.cwd(), 'assets', 'icon.png');

fs.mkdirSync(path.join(process.cwd(), 'assets'), { recursive: true });

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    // Parse the image URL (ImgBB places it in the og:image meta tag or similar)
    const match = data.match(/<meta property="og:image"\s+content="([^"]+)"/i) || data.match(/<link rel="image_src"\s+href="([^"]+)"/i);
    if (!match) {
      console.error('Could not find image URL');
      process.exit(1);
    }
    const imageUrl = match[1];
    console.log('Found image URL:', imageUrl);

    https.get(imageUrl, (imgRes) => {
      const file = fs.createWriteStream(dest);
      imgRes.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Icon downloaded successfully.');
      });
    }).on('error', (err) => {
      console.error('Error downloading icon:', err.message);
      process.exit(1);
    });
  });
}).on('error', err => {
  console.error('Error fetching ImgBB page:', err.message);
  process.exit(1);
});
