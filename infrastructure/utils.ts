import * as dns from 'dns';
import * as retry from 'async-retry';

export const lookupDns = (
  address: string,
  expected?: string
): Promise<string> => {
  return retry(
    () =>
      new Promise<string>((resolve, reject) => {
        dns.lookup(address, (err, result) => {
          if (err) {
            return reject(err);
          }
          if (expected && expected !== result) {
            return reject(result);
          }
          return resolve(result);
        });
      }),
    {
      retries: 30,
      minTimeout: 10000,
      maxTimeout: 10000,
    }
  );
};
