export type ServiceEnvironment = 'production' | 'sandbox' | 'local';

export type ServiceUrlMap = {
  [key in ServiceEnvironment]: string;
};

export type Services = 'vault' | 'payments';

export type ServicesMap = {
  [key in Services]: ServiceUrlMap;
};
