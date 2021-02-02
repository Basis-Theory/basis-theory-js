import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { payments } from './payments';
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use((req, _res, next) => {
  req.apiKey = req.headers['x-api-key'] as string; // TODO const
  next();
});

app.use('/payments', payments);

app.listen(port, () => {
  console.log(`BasisTheory services mock server listening at port ${port}`);
});
