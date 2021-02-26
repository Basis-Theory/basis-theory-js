import * as dns from 'dns';
import * as retry from 'async-retry';

export const lookupDns = (address: string): Promise<string> => {
  return retry(
    () =>
      new Promise<string>((resolve, reject) => {
        dns.lookup(address, (err, address) => {
          if (err) {
            reject(err);
          }
          resolve(address);
        });
      }),
    {
      retries: 30,
      minTimeout: 10000,
      maxTimeout: 10000,
    }
  );
};
