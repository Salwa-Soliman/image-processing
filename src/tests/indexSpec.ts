import QueryString from 'qs';
import path from 'path';
import { promises as fs } from 'fs';
import supertest from 'supertest';
import resizeImageHandler from './../utils/resizeImage';
import app from '../index';

const req = supertest(app);
const resizedDir = path.join(__dirname, '..', '..', 'assets', 'resized-images');

describe('Testing endpoint status codes', () => {
  it("Should return 500 if image query isn't included in URL", async () => {
    await req.get('/api/images').expect(500);
  });

  it('Should return 404 if image is NOT found', async () => {
    await req.get('/api/images?image=salwa.jpg').expect(404);
  });

  it('Should return 200 if image exists', async () => {
    await req.get('/api/images?image=fjord.jpg').expect(200);
  });
});

describe('Testing endpoint with image, width and height queries', () => {
  afterEach(async () => {
    await fs.rm(resizedDir, { recursive: true, force: true });
  });

  it("Should use original width & height if they're not included in query => fjord-1920x1280.jpeg", async () => {
    // send request
    await req.post('/api/images?image=fjord.jpg');
    // mock req.query
    const query = {
      image: 'fjord.jpg',
    } as unknown as QueryString.ParsedQs;
    // expected result
    const expectedResizedImage = path.join(resizedDir, 'fjord-1920x1280.jpeg');
    // actual result
    const resizedImage = await resizeImageHandler(query);
    // test
    expect(resizedImage).toBe(expectedResizedImage);
  });

  it('Should ignore characters in width & height queries', async () => {
    // send request
    await req.post('/api/images?image=fjord.jpg&width=1080px&height=500mm');
    // mock req.query
    const query = {
      image: 'fjord.jpg',
      width: '1080px',
      height: '500mm',
    } as unknown as QueryString.ParsedQs;
    // expected result
    const expectedResizedImage = path.join(resizedDir, 'fjord-1080x500.jpeg');
    // actual result
    const resizedImage = await resizeImageHandler(query);
    // test
    expect(resizedImage).toBe(expectedResizedImage);
  });

  it('Should create resized image => fjord-200x200.jpeg', async () => {
    // send request
    await req.post('/api/images?image=fjord.jpg&width=200&height=200');
    // mock req.query
    const query = {
      image: 'fjord.jpg',
      width: 200,
      height: 200,
    } as unknown as QueryString.ParsedQs;
    // expected result
    const expectedResizedImage = path.join(resizedDir, 'fjord-200x200.jpeg');
    // actual result
    const resizedImage = await resizeImageHandler(query);
    // test
    expect(resizedImage).toBe(expectedResizedImage);
  });

  it('Should use original height if height query is missing', async () => {
    // send request
    await req.post('/api/images?image=fjord.jpg&width=300');
    // mock req.query
    const query = {
      image: 'fjord.jpg',
      width: 300,
    } as unknown as QueryString.ParsedQs;
    // expected result
    const expectedResizedImage = path.join(resizedDir, 'fjord-300x1280.jpeg');
    // actual result
    const resizedImage = await resizeImageHandler(query);
    // test
    expect(resizedImage).toBe(expectedResizedImage);
  });

  it('Should use original width if width query is missing', async () => {
    // send request
    await req.post('/api/images?image=fjord.jpg&height=200');
    // mock req.query
    const query = {
      image: 'fjord.jpg',
      height: 200,
    } as unknown as QueryString.ParsedQs;
    // expected result
    const expectedResizedImage = path.join(resizedDir, 'fjord-1920x200.jpeg');
    // actual result
    const resizedImage = await resizeImageHandler(query);
    // test
    expect(resizedImage).toBe(expectedResizedImage);
  });
});
