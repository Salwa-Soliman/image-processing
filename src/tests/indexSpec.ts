import supertest from 'supertest';
import app from '../index';
import path from 'path';
import { promises as fs, existsSync } from 'fs';

const req = supertest(app);
const resizedDir = path.join(__dirname, '..', '..', 'assets', 'resized-images');

describe('Testing endpoint status codes', () => {
  it("Should return 500 if image query isn't included in URL", async () => {
    await req.get('/api/images').expect(500);
  });

  it('Should return 404 if image is missing', async () => {
    await req.get('/api/images?image=salwa.jpg').expect(404);
  });

  it('Should return 200 if image exists', async () => {
    await req.get('/api/images?image=fjord.jpg').expect(200);
  });
});

describe('Testing endpoint with image, width and height queries', () => {
  it('Should create resized-images folder if image exists', async () => {
    await req.post('/api/images?image=fjord.jpg');
    expect(existsSync(resizedDir)).toBeTruthy();
    const resizedImagePath = path.join(resizedDir, 'fjord-1920x1280.jpeg');
    expect(existsSync(resizedImagePath)).toBeTruthy();
  });

  it('Should create resized image => fjord-200x200.jpg', async () => {
    await req.post('/api/images?image=fjord.jpg&width=200&height=200');
    const resizedImagePath = path.join(resizedDir, 'fjord-200x200.jpeg');
    expect(existsSync(resizedImagePath)).toBeTruthy();
  });

  it('Should use original height if height query is missing', async () => {
    await req.post('/api/images?image=fjord.jpg&width=200');
    const resizedImagePath = path.join(resizedDir, 'fjord-200x1280.jpeg');
    expect(existsSync(resizedImagePath)).toBeTruthy();
  });

  it('Should use original width if width query is missing', async () => {
    await req.post('/api/images?image=fjord.jpg&height=200');
    const resizedImagePath = path.join(resizedDir, 'fjord-1920x1280.jpeg');
    expect(existsSync(resizedImagePath)).toBeTruthy();
  });
});
