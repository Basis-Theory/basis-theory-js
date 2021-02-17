import { Router } from 'express';
import { setData, getData } from './stores';
import { Services } from './types';

export const vault = Router();

vault.post('/tokens', (req, res) => {
  const { data } = req.body;
  const token = setData(req.apiKey, Services.vault, JSON.stringify(data));

  res.status(201).send({
    token,
    data,
  });
});

vault.get('/tokens/:token', (req, res) => {
  const { token } = req.params;
  const data = JSON.parse(getData(req.apiKey, Services.vault, token));
  res.status(201).send({
    token,
    data,
  });
});
