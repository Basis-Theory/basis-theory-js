export class BasisTheoryApiError extends Error {
  public readonly data: unknown;
  public readonly status: number;

  public constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'BasisTheoryApiError';
    this.status = status;
    this.data = data;
  }
}
