import path from 'path';
import { promises as fs, existsSync } from 'fs';
import sharp, { AvailableFormatInfo, FormatEnum } from 'sharp';

const resizeImage = async (
  imagePath: string,
  width: number,
  height: number,
  format: keyof FormatEnum | AvailableFormatInfo
) => {
  const resizedDir = path.join(
      __dirname,
      '..',
      '..',
      'assets',
      'resized-images'
    ),
    image = path.basename(imagePath),
    resizedImagePath = path.join(
      resizedDir,
      `${image.substring(
        0,
        image.lastIndexOf('.')
      )}-${width}x${height}.${format}`
    );

  // create resized-images directory if it doesn't exist
  if (!existsSync(resizedDir)) {
    await fs.mkdir(resizedDir);
  }

  // check if resized image already exists
  // create new resized image if it doesn't exist
  if (!existsSync(resizedImagePath)) {
    try {
      await sharp(imagePath)
        .resize({
          width,
          height,
        })
        .toFormat(format)
        .toFile(resizedImagePath);
    } catch (error) {
      console.log('Error resizing image ', error);
    }
  }

  return resizedImagePath;
};

export default resizeImage;
