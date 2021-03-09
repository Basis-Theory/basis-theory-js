import { Router } from 'express';
import type { PaymentsApi } from '../../library/src/payments/types';
import { setData } from './stores';
import { Services } from './types';
import { mask } from './utils';

export const payments = Router();

payments.post('/sources/cards', (req, res) => {
  const info: PaymentsApi.SourceCardModel = req.body;
  const data = JSON.stringify(info);
  const token = setData(req.apiKey, Services.payments, data);

  res.status(201).send({
    token,
    metadata: {
      masked: {
        number: mask(info.card.number, 4),
        expiration_month: 'XX',
        expiration_year: 'XX',
      },
    },
    billing_details: info.billing_details && {
      name: info.billing_details.name,
    },
  } as PaymentsApi.SourceCardResponse);
});
