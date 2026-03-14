const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const pub = path.join(__dirname, '../public');

const files = [
  'result1.JPG','result2.JPG','result3.JPG','result4.JPG',
  'result5.JPG','result6.JPG','result7.JPG',
  'results8.JPG','results9.JPG','results10.PNG',
  'results11.JPG','results12.PNG','results13.jpeg','result14.jpeg'
];

async function run() {
  for (const f of files) {
    const src = path.join(pub, f);
    if (!fs.existsSync(src)) { console.log('skip', f); continue; }
    const before = fs.statSync(src).size;
    // Output always as lowercase .jpg with _c suffix so no collision on case-insensitive FS
    const base = f.replace(/\.[^.]+$/, '');
    const outName = base.toLowerCase() + '.jpg';
    const dest = path.join(pub, outName);
    const tmp = dest + '.tmp';
    await sharp(src)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(tmp);
    const after = fs.statSync(tmp).size;
    // Remove original before rename to avoid case-insensitive collision
    if (fs.existsSync(src)) fs.unlinkSync(src);
    fs.renameSync(tmp, dest);
    console.log(f, '->', outName, Math.round(before/1024)+'K ->', Math.round(after/1024)+'K');
  }
  console.log('Done!');
}
run().catch(console.error);
