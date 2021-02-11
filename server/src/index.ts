import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { payments } from './payments';
import { vault } from './vault';
const app = express();
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || 'localhost';

app.use(cors());
app.use(bodyParser.json());
app.use((req, _res, next) => {
  req.apiKey = req.headers['x-api-key'] as string; // TODO const
  next();
});

app.get('/', (req, res) => {
  res.status(200).send('Hello, from mock-server')
});

app.use('/payments', payments);
app.use('/vault', vault);

app.listen(port, host, () => {
  console.log(`BasisTheory services mock server listening at ${host}:${port}`);
});
