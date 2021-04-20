import { ServicesMap } from '../types';

export const SERVICES: ServicesMap = {
  vault: {
    production: `https://${process.env.API_HOST_PROD}/vault`,
    sandbox: `https://${process.env.API_HOST_DEV}/vault`,
    local: `https://${process.env.API_HOST_LOCAL}/vault`,
  },
  payments: {
    production: `https://${process.env.API_HOST_PROD}/atomic`,
    sandbox: `https://${process.env.API_HOST_DEV}/atomic`,
    local: `https://${process.env.API_HOST_LOCAL}/atomic`,
  },
};

export const API_KEY_HEADER = 'X-API-KEY';
