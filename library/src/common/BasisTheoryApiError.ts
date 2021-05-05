export class BasisTheoryApiError extends Error {
  public constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown
  ) {
    super(message);
    this.name = 'BasisTheoryApiError';
    this.status = status;
    this.data = data;
  }
}
