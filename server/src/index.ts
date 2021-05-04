import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { atomic } from './atomic';
import { tokens } from './tokens';
const app = express();
const port = Number(process.env.PORT) || 3333;
const host = process.env.HOST || 'localhost';

app.use(cors());
app.use(bodyParser.json());
app.use((req, _res, next) => {
  req.apiKey = req.headers['x-api-key'] as string; // TODO const
  next();
});

app.get('/', (req, res) => {
  res.status(200).send('Hello, from mock-server');
});

app.use('/atomic', atomic);
app.use('/tokens', tokens);

app.listen(port, host, () => {
  console.log(`BasisTheory services mock server listening at ${host}:${port}`);
});
