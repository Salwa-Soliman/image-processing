import express from 'express';
import routes from './routes/index';

const app = express();
const PORT = 3030;

app.use('/', routes);

app.listen(PORT, () => {
  console.log('PORT listening on port: ' + PORT);
});

export default app;
