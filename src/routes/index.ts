import express, { Request, Response } from 'express';
import resizeImageHandler from './../utils/resizeImage';

const routes = express.Router();
routes.get('/', (_, res: Response) => {
  res.send('<h1>Main Route</h1>');
});

routes.get('/api/images', async (req: Request, res: Response) => {
  // case no image selected
  if (!req.query.image) {
    res.status(500).send(`<h1>Bad Request .. No Image Selected!!</h1>`);
    return;
  }

  try {
    const resizedImage = await resizeImageHandler(req.query);
    res.sendFile(resizedImage);
  } catch (error) {
    console.error('An error occurred', error);
    res.status(404).send('<h1>Image NOT Found!!</h1>');
  }
});

export default routes;
