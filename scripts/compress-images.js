const sharp = require('sharp');
const fs = require('fs');
const pub = './public';

const files = [
  { name: 'result.jpg', width: 1200 },
  { name: 'мма.jpg', width: 800 },
  { name: 'boxing.jpg', width: 800 },
  { name: 'grappling.jpg', width: 800 },
  { name: 'bjj.jpg', width: 800 },
  { name: 'highkis.jpg', width: 800 },
  { name: 'kilosova.jpg', width: 600 },
  { name: 'korlyakov.jpg', width: 600 },
  { name: 'lazukov.jpeg', width: 600 },
  { name: 'sherbakov.jpeg', width: 600 },
  { name: 'shesterikov.jpg', width: 600 },
  { name: 'zaharov.jpg', width: 600 },
  { name: 'baranov.jpg', width: 600 },
  { name: 'yandex.jpg', width: 400 },
  { name: '2gis.jpeg', width: 400 },
];

const before = {};
files.forEach(f => {
  try { before[f.name] = fs.statSync(pub + '/' + f.name).size; } catch (e) {}
});

Promise.all(
  files.map(f =>
    sharp(pub + '/' + f.name)
      .resize(f.width, null, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 93, mozjpeg: true })
      .toBuffer()
      .then(buf => {
        fs.writeFileSync(pub + '/' + f.name, buf);
        const b = before[f.name] || 0;
        console.log(`${f.name}: ${Math.round(b / 1024)}KB -> ${Math.round(buf.length / 1024)}KB`);
      })
      .catch(e => console.log(`${f.name}: ошибка - ${e.message}`))
  )
).then(() => console.log('\nГотово!'));
