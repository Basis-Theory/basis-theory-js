import { Router } from 'express';
import { setData } from './stores';
import { Services } from './types';
import { mask } from './utils';

export const payments = Router();

payments.post('/cards', (req, res) => {
  const info = req.body;
  const data = JSON.stringify(info);
  const token = setData(req.apiKey, Services.payments, data);

  res.status(201).send({
    id: token,
    card: {
      number: mask(info.card.number, 4),
      expiration_month: info.card.expiration_month,
      expiration_year: info.card.expiration_year,
      cvc: 'XXX',
    },
    billing_details: info.billing_details && {
      name: info.billing_details.name,
    },
  });
});
