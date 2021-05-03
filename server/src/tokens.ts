import { Router } from 'express';
import { setData, getData } from './stores';
import { Services } from './types';

export const tokens = Router();

tokens.post('/', (req, res) => {
  const { data } = req.body;
  const id = setData(req.apiKey, Services.vault, JSON.stringify(data));

  res.status(201).send({
    id,
    data,
  });
});

tokens.get('/:id', (req, res) => {
  const { id } = req.params;
  const data = JSON.parse(getData(req.apiKey, Services.vault, id));
  res.status(201).send({
    id,
    data,
  });
});
