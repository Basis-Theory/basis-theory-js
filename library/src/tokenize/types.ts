import { Primitive } from '../tokens';

type TokenizeObject<Other = Primitive> = {
  [key: string]:
    | Primitive
    | TokenizeObject<Other>
    | TokenizeArray<Other>
    | Other;
};
type TokenizeArray<Other = Primitive> = Array<
  Primitive | TokenizeObject<Other> | TokenizeArray<Other> | Other
>;
type TokenizeData<Other = Primitive> =
  | TokenizeArray<Other>
  | TokenizeObject<Other>;

export type { TokenizeData };
