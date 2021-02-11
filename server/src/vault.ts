import { Router } from 'express';
import { setData, getData } from './stores';
import { Services } from './types';

export const vault = Router();

vault.post('/tokens', (req, res) => {
  const { data } = req.body;
  const id = setData(req.apiKey, Services.vault, JSON.stringify(data));

  res.status(201).send({
    id,
    data,
  });
});

vault.get('/tokens/:id', (req, res) => {
  const { id } = req.params;
  const data = JSON.parse(getData(req.apiKey, Services.vault, id));
  res.status(201).send({
    id,
    data,
  });
});
