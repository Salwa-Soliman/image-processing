import express from 'express';
import path from 'path';
import sharp, { AvailableFormatInfo, FormatEnum } from 'sharp';
import resizeImage from './../utils/resizeImage';

const routes = express.Router();
routes.get('/', (_, res) => {
  res.send('<h1>Main Route</h1>');
});

routes.get('/api/images', async (req, res) => {
  // case no image selected
  if (!req.query.image) {
    res.status(500).send(`<h1>Bad Request .. No Image Selected!!</h1>`);
    return;
  }

  const imagePath = path.join(
    __dirname,
    '..',
    '..',
    'assets',
    'images',
    req.query.image as unknown as string
  );

  try {
    const {
      width: originalWidth,
      height: originalHeight,
      format,
    } = await sharp(imagePath).metadata();

    const width = (req.query.width || originalWidth) as number,
      height = (req.query.height || originalHeight) as number;

    const newImage = await resizeImage(
      imagePath,
      +width,
      +height,
      format as unknown as keyof FormatEnum | AvailableFormatInfo
    );

    res.sendFile(newImage);
  } catch (error) {
    console.log('An error occurred', error);
    res.status(404).send('<h1>Image NOT Found!!</h1>');
  }
});

export default routes;
