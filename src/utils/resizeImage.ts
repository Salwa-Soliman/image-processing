import path from 'path';
import { promises as fs, existsSync } from 'fs';
import sharp from 'sharp';
import QueryString from 'qs';

const resizeImageHandler = async (
  query: QueryString.ParsedQs
): Promise<string> => {
  const image = query.image as string;

  const imagePath = path.join(
    __dirname,
    '..',
    '..',
    'assets',
    'images',
    image as string
  );

  const {
    width: originalWidth,
    height: originalHeight,
    format,
  } = await sharp(imagePath).metadata();

  const width = parseInt(query.width as string) || originalWidth;
  const height = parseInt(query.height as string) || originalHeight;

  const resizedDir = path.join(
    __dirname,
    '..',
    '..',
    'assets',
    'resized-images'
  );

  const resizedImagePath = path.join(
    resizedDir,
    `${image.substring(0, image.lastIndexOf('.'))}-${width}x${height}.${format}`
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
        .toFormat(format as keyof sharp.FormatEnum)
        .toFile(resizedImagePath);
    } catch (error) {
      console.log('Error resizing image ', error);
    }
  }

  return resizedImagePath;
};

export default resizeImageHandler;
