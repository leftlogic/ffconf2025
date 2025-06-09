import sharp from 'sharp';
import path from 'path';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node processImage.mjs <image-file>');
  process.exit(1);
}

const ext = path.extname(inputPath).toLowerCase();
const basename = path.basename(inputPath, ext);
const dirname = path.dirname(inputPath);
const validExt = ['.jpg', '.jpeg', '.png'];

if (!validExt.includes(ext)) {
  console.error(`Unsupported file type: ${ext}`);
  process.exit(1);
}

const outputPath = path.join(dirname, `${basename}-duo${ext}`);

const duotoneColour = '#6767FF';

// Create greyscale base image
const greyscaleBuffer = await sharp(inputPath)
  .greyscale()
  .resize(367, 367, { fit: 'cover' })
  .png()
  .toBuffer();

// Convert hex color to RGB values
const hex = duotoneColour.replace('#', '');
const r = parseInt(hex.substr(0, 2), 16);
const g = parseInt(hex.substr(2, 2), 16);
const b = parseInt(hex.substr(4, 2), 16);

// Apply duotone effect using tint
await sharp(greyscaleBuffer)
  .tint({ r, g, b })
  .toFile(outputPath);

console.log(`Processed image saved as ${outputPath}`);