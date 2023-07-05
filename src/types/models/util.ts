/**
 * Make all properties in T nullable
 */
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

/**
 * Make selected properties in T nullable
 */
type NullableProps<T, K extends keyof T> = T | Nullable<Pick<T, K>>;

export type { Nullable, NullableProps };
