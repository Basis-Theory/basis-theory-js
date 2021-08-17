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
  tenants: {
    production: `https://${process.env.API_HOST_PROD}/tenants/self`,
    sandbox: `https://${process.env.API_HOST_DEV}/tenants/self`,
    local: `http://${process.env.API_HOST_LOCAL}/tenants/self`,
  },
  logs: {
    production: `https://${process.env.API_HOST_PROD}/logs`,
    sandbox: `https://${process.env.API_HOST_DEV}/logs`,
    local: `http://${process.env.API_HOST_LOCAL}/logs`,
  },
  reactorFormulas: {
    production: `https://${process.env.API_HOST_PROD}/reactor-formulas`,
    sandbox: `https://${process.env.API_HOST_DEV}/reactor-formulas`,
    local: `http://${process.env.API_HOST_LOCAL}/reactor-formulas`,
  },
  reactors: {
    production: `https://${process.env.API_HOST_PROD}/reactors`,
    sandbox: `https://${process.env.API_HOST_DEV}/reactors`,
    local: `http://${process.env.API_HOST_LOCAL}/reactors`,
  },
  atomicBanks: {
    production: `https://${process.env.API_HOST_PROD}/atomic/banks`,
    sandbox: `https://${process.env.API_HOST_DEV}/atomic/banks`,
    local: `http://${process.env.API_HOST_LOCAL}/atomic/banks`,
  },
  atomicCards: {
    production: `https://${process.env.API_HOST_PROD}/atomic/cards`,
    sandbox: `https://${process.env.API_HOST_DEV}/atomic/cards`,
    local: `http://${process.env.API_HOST_LOCAL}/atomic/cards`,
  },
  permissions: {
    production: `https://${process.env.API_HOST_PROD}/permissions`,
    sandbox: `https://${process.env.API_HOST_DEV}/permissions`,
    local: `http://${process.env.API_HOST_LOCAL}/permissions`,
  },
};

export const API_KEY_HEADER = 'X-API-KEY';

export const BT_TRACE_ID_HEADER = 'bt-trace-id';
