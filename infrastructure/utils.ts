import * as dns from 'dns';
import * as https from 'https';
import * as netmask from 'netmask';
import * as retry from 'async-retry';

export const resolveDns = (
  hostname: string,
  retryOptions?: retry.Options
): Promise<string[]> => {
  return retry(
    () =>
      new Promise<string[]>((resolve, reject) => {
        dns.resolve(hostname, (err, records) => {
          if (err) {
            return reject(err);
          }
          return resolve(records);
        });
      }),
    retryOptions
  );
};

/**
 * Asserts that a Cloudflare DNS hostname points to an
 * expected value. In case CF proxy is detected, assert
 * it points to valid CF ips v4.
 * @returns object container `proxied` flag and resolved records.
 * @throws error if no record is found matching expected value, neither
 * proxy is detected.
 */
export const assertCloudflareDns = async (
  hostname: string,
  expected: string
): Promise<{ proxied: boolean; records: string[] }> => {
  const records = await resolveDns(hostname, {
    retries: 6,
    minTimeout: 10000,
    maxTimeout: 10000,
  });
  if (records.indexOf(expected) < 0) {
    return new Promise((resolve, reject) => {
      https.get('https://www.cloudflare.com/ips-v4', (res) => {
        res.on('data', (data: Buffer) => {
          const cfIps: string[] = data.toString().trim().split('\n');
          const masks = cfIps.map((d) => new netmask.Netmask(d));
          if (
            records.every((record) =>
              masks.some((mask) => mask.contains(record))
            )
          ) {
            // all records match at least one of CF's masks
            resolve({ proxied: true, records });
          } else {
            reject(
              new Error(
                `Resolved records [${records}] for "${hostname}" do not contain expected value "${expected}", 
              neither match any of the Cloudflare ips [${cfIps}]`
              )
            );
          }
        });
      });
    });
  }
  // expected has been found
  return { proxied: false, records };
};
