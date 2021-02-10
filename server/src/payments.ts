import { Router } from 'express';
import { mask } from './utils';
import { setData } from './stores';
import { Services } from './types';

export const payments = Router();

payments.post(
  '/credit_card',
  (req, res) => {
    const info = req.body;
    const data = JSON.stringify(info);
    const token = setData(req.apiKey, Services.payments, data);

    res.status(201).send({
      token,
      info: {
        cardNumber: mask(info.cardNumber, 4),
        expiration: info.expiration,
        holderName: info.holderName,
      },
    });
  }
);
