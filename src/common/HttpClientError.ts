export class HttpClientError extends Error {
  public readonly status: number;

  public readonly data?: unknown;

  public readonly headers?: unknown;

  public constructor(
    message: string,
    status: number,
    data?: unknown,
    headers?: unknown
  ) {
    super(message);
    this.name = 'HttpClientError';
    this.status = status;
    this.data = data;
    this.headers = headers;

    Object.setPrototypeOf(this, HttpClientError.prototype);
  }
}
