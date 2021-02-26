import * as dns from 'dns';
import * as retry from 'async-retry';

export const assertDns = <T extends 'A' | 'AAAA' | 'CNAME'>(
  hostname: string,
  rrtype: T,
  expected: string[] = [],
  retryOptions: retry.Options = {
    retries: 30,
    minTimeout: 10000,
    maxTimeout: 10000,
  }
): Promise<string[]> => {
  return retry(
    async () =>
      new Promise<string[]>((resolve, reject) => {
        dns.resolve(hostname, rrtype, (err, records) => {
          if (err) {
            return reject(err);
          }
          if (
            expected.length > 0 &&
            expected.every((e) => (records as string[]).indexOf(e) < 0)
          ) {
            return reject(
              new Error(
                `Resolved "${rrtype}" records [${records}] for "${hostname}" do not contain every expected values: [${expected}]`
              )
            );
          }
          return resolve(records as string[]);
        });
      }),
    retryOptions
  );
};
