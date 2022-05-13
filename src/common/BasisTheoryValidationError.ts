import type { FieldError } from '@/types/elements';

export class BasisTheoryValidationError<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Details = Record<string, any>
> extends Error {
  public constructor(
    message: string,
    public readonly details: Details,
    /**
     * @deprecated use {@link details}
     */
    public readonly validation?: FieldError[]
  ) {
    super(message);
    this.name = 'BasisTheoryValidationError';
  }
}
