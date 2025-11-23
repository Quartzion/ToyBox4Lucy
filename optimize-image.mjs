// optimize-image.js
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import { globby } from 'globby';
import path from 'path';
import fs from 'fs/promises';

const convertToWebp = async () => {

  const imageFolder = 'client/public';

  const files = await globby([
    `${imageFolder}/*.{png,PNG,jpg,JPG,jpeg,JPEG}`,
    `${imageFolder}/**/*.{png,PNG,jpg,JPG,jpeg,JPEG}`,
  ]);



  if (files.length === 0) {
    console.warn('⚠️ No image files found for WebP conversion.');
    return;
  }

  console.log(`✅ Found ${files.length} images to convert.`);

  await Promise.all(
    files.map(async (file) => {
      try {
        const buffer = await fs.readFile(file);
        const webpBuffer = await imagemin.buffer(buffer, {
          plugins: [imageminWebp({ quality: 75 })],
        });

        const webpPath = path.format({
          dir: path.dirname(file),
          name: path.parse(file).name,
          ext: '.webp',
        });

        await fs.writeFile(webpPath, webpBuffer);
        console.log(`✅ Created WebP: ${webpPath}`);
      } catch (err) {
        console.error(`❌ Error converting ${file} to WebP:`, err);
      }
    })
  );
};

const compressOriginals = async () => {
  console.log('✅ Compressing original PNG and JPEG images...');
  await imagemin(['client/public/**/*.{png,PNG,jpg,JPG,jpeg,JPEG}'], {
    destination: 'client/public',
    plugins: [
      imageminMozjpeg({ quality: 75 }),
      imageminPngquant({ quality: [0.6, 0.8] }),
    ],
  });
};

const run = async () => {
  try {
    await convertToWebp();
    await compressOriginals();
    console.log('✅ Image optimization and WebP conversion complete!');
  } catch (err) {
    console.error('❌ Error during image optimization:', err);
  }
};

run();
