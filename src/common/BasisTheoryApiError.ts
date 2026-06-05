export class BasisTheoryApiError extends Error {
  public constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown,
    public readonly _debug?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'BasisTheoryApiError';

    Object.setPrototypeOf(this, BasisTheoryApiError.prototype);
  }
}
