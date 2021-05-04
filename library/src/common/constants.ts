import { ServicesMap } from '../types';

export const SERVICES: ServicesMap = {
  tokens: {
    production: `https://${process.env.API_HOST_PROD}/tokens`,
    sandbox: `https://${process.env.API_HOST_DEV}/tokens`,
    local: `http://${process.env.API_HOST_LOCAL}/tokens`,
  },
  atomic: {
    production: `https://${process.env.API_HOST_PROD}/atomic`,
    sandbox: `https://${process.env.API_HOST_DEV}/atomic`,
    local: `http://${process.env.API_HOST_LOCAL}/atomic`,
  },
  applications: {
    production: `https://${process.env.API_HOST_PROD}/applications`,
    sandbox: `https://${process.env.API_HOST_DEV}/applications`,
    local: `http://${process.env.API_HOST_LOCAL}/applications`,
  },
};

export const API_KEY_HEADER = 'X-API-KEY';
